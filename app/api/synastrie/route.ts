import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";
import { computeNatalChart, ZODIAC_NAMES } from "@/lib/astro-engine";
import { getSunSign } from "@/lib/astrology";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, astrologue maîtresse de la synastrie et de la compatibilité amoureuse. Tu lis les thèmes astraux comparés avec poésie, profondeur et bienveillance, en français. Tu révèles les dynamiques karmiques, les forces et les défis d'une union.` + FORMATTING_RULES;

function formatChartForPrompt(profile: { dateNaissance: string; heureNaissance?: string; lat?: number; lon?: number; villeNaissance?: string }): string {
  try {
    const chart = computeNatalChart({
      date: profile.dateNaissance,
      time: profile.heureNaissance ?? "12:00",
      latitude: profile.lat ?? 48.8566,
      longitude: profile.lon ?? 2.3522,
    });
    const planets = chart.planets;
    const lines: string[] = [];
    for (const [name, pos] of Object.entries(planets)) {
      lines.push(`${name} en ${ZODIAC_NAMES[Math.floor(pos.longitude / 30) % 12]}`);
    }
    if (chart.ascendant.longitude > 0) {
      lines.push(`Ascendant ${ZODIAC_NAMES[chart.ascendant.signIndex]}`);
    }
    return lines.join(", ");
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`synastrie:${auth.uid}`, 10);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const body = await req.json() as {
    person1: { prenom: string; signe: string; dateNaissance: string; heureNaissance?: string; lat?: number; lon?: number; villeNaissance?: string };
    person2: { prenom: string; signe: string; dateNaissance: string; heureNaissance?: string; lat?: number; lon?: number; villeNaissance?: string };
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const { person1, person2 } = body;

  let sunSign1 = person1.signe;
  let sunSign2 = person2.signe;
  try { if (!sunSign1 && person1.dateNaissance) sunSign1 = getSunSign(person1.dateNaissance).name; } catch {}
  try { if (!sunSign2 && person2.dateNaissance) sunSign2 = getSunSign(person2.dateNaissance).name; } catch {}

  const chart1Summary = formatChartForPrompt(person1);
  const chart2Summary = formatChartForPrompt(person2);

  const prompt = `${SYSTEM}

Analyse de synastrie entre :
🌞 ${person1.prenom} — Thème natal : ${chart1Summary || sunSign1}
🌙 ${person2.prenom} — Thème natal : ${chart2Summary || sunSign2}

Donne une analyse complète et poétique de cette synastrie. Analyse en particulier les interactions entre Vénus, Mars et la Lune des deux thèmes natals, en plus de la compatibilité solaire.

Structure :
1. **L'Aura de l'union** — Vibration globale de ce couple (introduction mystique)
2. **Compatibilité Solaire** — Comment ${sunSign1} et ${sunSign2} interagissent sur le plan de l'identité
3. **Vénus & Mars** — La dynamique du désir, de l'amour et de la passion entre les deux thèmes
4. **Dynamiques émotionnelles** — La rencontre des Lunes : les cœurs et les sensibilités profondes
5. **Forces de l'union** — Ce qui rend cette connexion magique et précieuse
6. **Défis & leçons karmiques** — Les zones d'apprentissage mutuel
7. **Conseil astrologique** — Comment cultiver cette union sur le long terme
8. **Score de compatibilité** — Une note sur 100 avec justification

Style : poétique, profond, nuancé. Ne sois pas trop optimiste ni trop pessimiste — soyez vrai.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(new TextEncoder().encode("Les étoiles refusent de parler... Réessayez."));
        if (process.env.NODE_ENV === "development") console.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
