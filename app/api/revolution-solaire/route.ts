import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";
import { computeNatalChart, ZODIAC_NAMES, BirthData } from "@/lib/astro-engine";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

const SYSTEM =
  `Tu es Madame Céleste, astrologue expérimentée spécialiste de la Révolution Solaire. ` +
  `Tu interprètes le retour annuel du Soleil à sa position natale avec précision, poésie et profondeur en français. ` +
  `Tu guides chaque personne à traverser son année astrologique avec sagesse et confiance.` +
  FORMATTING_RULES;

/** Parse a date string in YYYY-MM-DD or DD/MM/YYYY and return { year, month, day }. */
function parseDateNaissance(raw: string): { year: number; month: number; day: number } | null {
  // Try YYYY-MM-DD
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return { year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) };
  }
  // Try DD/MM/YYYY
  const fr = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (fr) {
    return { year: Number(fr[3]), month: Number(fr[2]), day: Number(fr[1]) };
  }
  return null;
}

/** Build YYYY-MM-DD string from year, month, day. */
function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`revolution-solaire:${auth.uid}`, 10);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const body = (await req.json()) as {
    profile: {
      prenom: string;
      dateNaissance: string;
      heureNaissance?: string;
      villeNaissance?: string;
      lat?: number;
      lon?: number;
    };
  };

  const { profile } = body;
  const { prenom, dateNaissance, heureNaissance, lat, lon } = profile ?? {};

  if (!prenom || !dateNaissance) {
    return new Response("Prénom et date de naissance requis", { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  // ── Parse birth date ──
  const parsed = parseDateNaissance(dateNaissance);
  if (!parsed) {
    return new Response("Format de date invalide", { status: 400 });
  }
  const { year: birthYear, month: birthMonth, day: birthDay } = parsed;

  // ── Compute RS year ──
  const today = new Date();
  const todayYear = today.getFullYear();
  let rsYear = todayYear;
  const rsDateThisYear = new Date(todayYear, birthMonth - 1, birthDay);
  if (rsDateThisYear < today) {
    rsYear = todayYear + 1;
  }

  const natalDateIso = toIsoDate(birthYear, birthMonth, birthDay);
  const rsDateIso = toIsoDate(rsYear, birthMonth, birthDay);

  // ── Build BirthData for natal chart ──
  const natalBirth: BirthData = {
    date: natalDateIso,
    time: heureNaissance || undefined,
    latitude: lat,
    longitude: lon,
  };

  // ── Build BirthData for RS chart (same time/place, but RS year) ──
  const rsBirth: BirthData = {
    date: rsDateIso,
    time: heureNaissance || undefined,
    latitude: lat,
    longitude: lon,
  };

  // ── Compute both charts ──
  const natalChart = computeNatalChart(natalBirth);
  const rsChart = computeNatalChart(rsBirth);

  // ── Build planet descriptions ──
  const natalSunSign = natalChart.planets.Soleil?.sign ?? "inconnu";
  const natalMoonSign = natalChart.planets.Lune?.sign ?? null;

  const rsPlanetLines = Object.entries(rsChart.planets)
    .map(([name, pos]) => {
      const signIdx = pos.signIndex;
      const signName = ZODIAC_NAMES[signIdx] ?? pos.sign;
      return `${name} en ${signName}`;
    })
    .join(", ");

  // ── Build prompt ──
  const natalLine = `Signe solaire natal : ${natalSunSign}${natalMoonSign ? `, Lune natale en ${natalMoonSign}` : ""}.`;
  const rsYearLabel = `${rsYear}-${rsYear + 1}`;

  const prompt = `${SYSTEM}

${prenom} a un thème natal avec le ${natalLine}

Sa Révolution Solaire ${rsYearLabel} débute le ${birthDay}/${birthMonth}/${rsYear}.

Planètes de la Révolution Solaire : ${rsPlanetLines}.

Donne une interprétation complète de cette Révolution Solaire pour ${prenom}. Couvre les domaines suivants dans des paragraphes distincts et bien développés : le thème général de l'année, l'amour et les relations, le travail et la carrière, la santé et le bien-être, les finances, la croissance personnelle et spirituelle, et un conseil concret pour maximiser le potentiel de cette année.

La lecture doit être en prose pure, sans markdown, d'environ 700 à 900 mots. Adresse-toi toujours à ${prenom} par son prénom. Termine par un court disclaimer rappelant que cette lecture est à des fins d'inspiration et de divertissement.`;

  // ── Stream response ──
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(
          new TextEncoder().encode(
            "Les astres sont momentanément voilés… Réessayez dans quelques instants."
          )
        );
        console.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
