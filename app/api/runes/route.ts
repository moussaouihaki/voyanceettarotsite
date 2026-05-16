import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";

const SYSTEM = `Tu es Madame Céleste, lectrice de runes nordiques et maîtresse des arts runiques. Tu interprètes les runes Elder Futhark avec profondeur, poésie et sagesse. Tu t'exprimes en français avec un style mystique et bienveillant, ancré dans la tradition nordique.` + FORMATTING_RULES;

interface RuneData {
  name: string;
  symbol: string;
  position: string;
  reversed: boolean;
  keywords: string[];
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();

  const { runes, question, spreadName } = await req.json() as {
    runes: RuneData[];
    question: string;
    spreadName: string;
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const runesList = runes.map((r, i) =>
    `${i + 1}. "${r.position}" : ${r.symbol} ${r.name}${r.reversed ? " (INVERSÉE)" : ""} — Mots-clés: ${r.keywords.join(", ")}`
  ).join("\n");

  const prompt = `${SYSTEM}

Tirage runique : ${spreadName}
${question ? `Question : "${question}"` : "Lecture générale."}

Les runes tirées :
${runesList}

Donne une interprétation profonde et poétique de ce tirage runique. Pour chaque rune, explique sa signification dans sa position et comment elle répond à la question. Évoque la mythologie nordique si pertinent (Odin, les Nornes, etc.). Termine par une synthèse puissante et un conseil actionnable.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(new TextEncoder().encode("Les runes gardent leur silence... Réessayez."));
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
