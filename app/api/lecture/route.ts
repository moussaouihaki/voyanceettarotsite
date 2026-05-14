import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MADAME_CELESTE_SYSTEM } from "@/lib/gemini";

interface CardData {
  name: string;
  suit: string;
  number: string;
  position: string;
  reversed: boolean;
  keywords: string[];
}

export async function POST(req: NextRequest) {
  const { cards, question, spreadType } = await req.json() as {
    cards: CardData[];
    question: string;
    spreadType: string;
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response("Clé API manquante", { status: 500 });
  }

  const cardsList = cards.map((c, i) =>
    `${i + 1}. Position "${c.position}" : ${c.name} (${c.suit}, ${c.number})${c.reversed ? " — INVERSÉE" : ""}\n   Mots-clés : ${c.keywords.join(", ")}`
  ).join("\n");

  const userPrompt = `${MADAME_CELESTE_SYSTEM}

Voici le tirage ${spreadType === "trois" ? "à 3 cartes (Passé/Présent/Futur)" : "Croix Celtique"} :

${cardsList}

${question ? `Question du consultant : "${question}"` : "Lecture générale (pas de question spécifique)."}

Donne une lecture complète, poétique et profonde. Pour chaque carte, explique sa signification dans sa position. Termine par une synthèse globale et un message d'espoir ou un conseil pratique.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(userPrompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
      } catch (err) {
        controller.enqueue(
          new TextEncoder().encode("\n\nLes astres sont voilés... Réessayez dans quelques instants.")
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
