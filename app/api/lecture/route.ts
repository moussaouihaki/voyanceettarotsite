import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MADAME_CELESTE_SYSTEM } from "@/lib/gemini";
import { getSunSign } from "@/lib/astrology";

interface CardData {
  name: string;
  suit: string;
  number: string;
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

export async function POST(req: NextRequest) {
  let body: { cards?: CardData[]; question?: string; spreadType?: string; spreadName?: string; profile?: UserProfile };
  try {
    body = await req.json();
  } catch {
    return new Response("Requête invalide", { status: 400 });
  }

  const { cards, question, spreadName, profile } = body;
  if (!Array.isArray(cards) || cards.length === 0) {
    return new Response("Cartes requises", { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const cardsList = cards.map((c, i) =>
    `${i + 1}. Position « ${c.position} » : ${c.name} (${c.suit}, ${c.number})${c.reversed ? " — INVERSÉE" : ""}\n   Mots-clés : ${c.keywords.join(", ")}`
  ).join("\n");

  let personalContext = "";
  if (profile?.prenom) {
    personalContext += `\nLe consultant s'appelle ${profile.prenom}.`;
    if (profile.dateNaissance) {
      try {
        const sun = getSunSign(profile.dateNaissance);
        personalContext += ` Signe solaire : ${sun.name}.`;
      } catch {}
    }
    personalContext += " Adressez-vous à lui/elle directement et personnalisez la lecture en tenant compte de son signe.";
  }

  const userPrompt = `${MADAME_CELESTE_SYSTEM}

Tirage consulté : ${spreadName || "Tirage de Tarot"}
${personalContext}

Cartes tirées :
${cardsList}

${question ? `Question du consultant : « ${question} »` : "Lecture générale (pas de question spécifique)."}

Donne une lecture complète, poétique et profonde. Pour chaque carte, explique sa signification dans sa position et son interaction avec les autres cartes. Termine par une synthèse globale, un message d'espoir et un conseil pratique actionnable. Environ 600-800 mots.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });

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
