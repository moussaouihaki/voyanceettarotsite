import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MADAME_CELESTE_SYSTEM } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { card, intention } = await req.json() as {
    card: { name: string; suit: string; reversed: boolean; keywords: string[]; upright: string; meaningReversed: string };
    intention?: string;
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const userPrompt = `${MADAME_CELESTE_SYSTEM}

C'est la carte du jour du ${today} : **${card.name}** (${card.suit})${card.reversed ? " — position INVERSÉE" : ""}.

Mots-clés : ${card.keywords.join(", ")}.
Signification ${card.reversed ? "inversée" : "droite"} : ${card.reversed ? card.meaningReversed : card.upright}

${intention ? `L'intention du consultant pour aujourd'hui : "${intention}"` : "Lecture générale pour la journée."}

Compose un message de guidance pour aujourd'hui (la journée entière), en t'appuyant sur l'énergie de cette carte. Inclus :
1. Le message principal de la carte pour aujourd'hui
2. Ce qu'il faut favoriser / éviter aujourd'hui
3. Un conseil pratique concret
4. Une affirmation puissante pour la journée
Sois poétique, inspirant et bienveillant. Environ 200 mots.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(userPrompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(new TextEncoder().encode("\n\nLa carte garde son silence... Réessayez."));
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
