import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MADAME_CELESTE_SYSTEM } from "@/lib/gemini";
import { getSunSign } from "@/lib/astrology";
import { computeNatalChart, ZODIAC_NAMES } from "@/lib/astro-engine";

export const maxDuration = 60;

function getTodayPlanetaryContext(): string {
  try {
    const today = new Date();
    const chart = computeNatalChart({
      date: today.toISOString().split('T')[0],
      time: "12:00",
      latitude: 48.8566,
      longitude: 2.3522, // Paris
    });
    const planets = chart.planets;
    const lines: string[] = [];
    const PLANET_FR: Record<string, string> = {
      "Soleil": "Soleil", "Lune": "Lune", "Mercure": "Mercure",
      "Vénus": "Vénus", "Mars": "Mars", "Jupiter": "Jupiter", "Saturne": "Saturne"
    };
    for (const [name, pos] of Object.entries(planets)) {
      if (PLANET_FR[name]) {
        const sign = ZODIAC_NAMES[Math.floor(pos.longitude / 30) % 12];
        lines.push(`${PLANET_FR[name]} en ${sign}`);
      }
    }
    return lines.slice(0, 7).join(", ");
  } catch {
    return "";
  }
}

interface CardData {
  name: string;
  suit: string;
  number: string;
  element: string;
  position: string;
  reversed: boolean;
  keywords: string[];
}

interface UserProfile {
  prenom?: string;
  dateNaissance?: string;
  heureNaissance?: string;
  villeNaissance?: string;
}

interface ConjointInfo {
  prenom?: string;
  dateNaissance?: string;
  heureNaissance?: string;
  villeNaissance?: string;
  lat?: number;
  lon?: number;
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();

  let body: { cards?: CardData[]; question?: string; spreadType?: string; spreadName?: string; profile?: UserProfile; conjoint?: ConjointInfo };
  try {
    body = await req.json();
  } catch {
    return new Response("Requête invalide", { status: 400 });
  }

  const { cards, question, spreadName, profile, conjoint } = body;
  if (!Array.isArray(cards) || cards.length === 0) {
    return new Response("Cartes requises", { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const cardsList = cards.map((c, i) =>
    `${i + 1}. Position « ${c.position} » : ${c.name} (${c.suit}, ${c.number}, élément : ${c.element})${c.reversed ? " — INVERSÉE" : ""}\n   Mots-clés : ${c.keywords.join(", ")}`
  ).join("\n");

  let personalContext = "";
  if (profile?.prenom) {
    let sunSign = "";
    if (profile.dateNaissance) {
      try {
        sunSign = getSunSign(profile.dateNaissance).name;
      } catch {}
    }

    const birthParts: string[] = [];
    if (profile.dateNaissance) birthParts.push(profile.dateNaissance);
    if (profile.heureNaissance) birthParts.push(profile.heureNaissance);
    const birthDesc = birthParts.length > 0 ? ` née le ${birthParts.join(" à ")}` : "";
    const cityDesc = profile.villeNaissance ? ` à ${profile.villeNaissance}` : "";
    const sunDesc = sunSign ? `, signe ${sunSign}` : "";

    personalContext = `\nCette lecture est pour ${profile.prenom},${birthDesc}${cityDesc}${sunDesc}. Adresse-toi à elle/lui par son prénom tout au long de la lecture. Commence par adresser ${profile.prenom} directement.`;
  }

  let conjointContext = "";
  if (conjoint?.prenom && conjoint?.dateNaissance) {
    let conjointSun = "";
    try { conjointSun = getSunSign(conjoint.dateNaissance).name; } catch {}
    const sunDesc = conjointSun ? `, signe ${conjointSun}` : "";
    conjointContext = `\n\nInformations sur le/la partenaire : ${conjoint.prenom}, né(e) le ${conjoint.dateNaissance}${conjoint.heureNaissance ? ` à ${conjoint.heureNaissance}` : ""}${conjoint.villeNaissance ? ` à ${conjoint.villeNaissance}` : ""}${sunDesc}. Intègre une analyse de compatibilité entre ${profile?.prenom || "le/la consultant(e)"} et ${conjoint.prenom} dans ta lecture.`;
  }

  const transitsContext = getTodayPlanetaryContext();

  const userPrompt = `${MADAME_CELESTE_SYSTEM}

Tirage consulté : ${spreadName || "Tirage de Tarot"}
${personalContext}${conjointContext}

Cartes tirées :
${cardsList}

${question ? `Question du consultant : « ${question} »` : "Lecture générale (pas de question spécifique)."}
${transitsContext ? `\nTransits planétaires du jour : ${transitsContext}. Si pertinent, fais le lien entre ces influences célestes actuelles et les cartes tirées pour une lecture encore plus précise.` : ""}

Instructions de lecture professionnelle :
- Dignités élémentaires : note si les éléments des cartes adjacentes se renforcent (Feu/Air) ou s'affaiblissent (Feu/Eau)
- Figures (Valet, Cavalier, Reine, Roi) : analyse-les comme archétypes psychologiques, pas seulement comme personnages
- Cartes inversées : explore le blocage intérieur ou l'énergie refoulée, pas seulement la signification opposée
- Numéologie des cartes : les numéros ont leur propre signification cyclique (1=début, 10=achèvement, etc.)
- Synthèse finale : dégage le thème dominant du tirage et une action concrète pour les 7 prochains jours

Donne une lecture complète, poétique et profonde. Pour chaque carte, explique sa signification dans sa position et son interaction avec les autres cartes. Termine par une synthèse globale, un message d'espoir et un conseil pratique actionnable. Environ 600-800 mots.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(userPrompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(new TextEncoder().encode("\n\nLes astres sont voilés... Réessayez dans quelques instants."));
        console.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
