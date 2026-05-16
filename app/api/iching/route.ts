import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";

const SYSTEM = `Tu es Madame Céleste, maîtresse du Yi-King (I-Ching) et des arts divinatoires de l'Orient ancien. Tu interprètes les hexagrammes avec sagesse taoïste, poésie et profondeur en français. Tu puises dans la philosophie du Tao et du Yin-Yang pour révéler les dynamiques de chaque situation.` + FORMATTING_RULES;

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();

  const { hexagram, question } = await req.json() as {
    hexagram: { number: number; name: string; nameZh: string; meaning: string; judgment: string; keywords: string[] };
    question: string;
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const prompt = `${SYSTEM}

Hexagramme consulté : N°${hexagram.number} — ${hexagram.name} (${hexagram.nameZh})
Mots-clés : ${hexagram.keywords.join(", ")}
Jugement traditionnel : "${hexagram.judgment}"
${question ? `Question du consultant : "${question}"` : "Consultation générale."}

Donne une interprétation profonde et poétique de cet hexagramme.

Structure :
1. **Le Message du Ciel** — Introduction mystique sur cet hexagramme (évocation du Tao, du Yin-Yang)
2. **Interprétation pour votre situation** — Comment cet hexagramme répond à la question posée
3. **La Sagesse du Jugement** — Développez le jugement traditionnel en termes contemporains
4. **Les Lignes en mouvement** — Évolution possible de la situation
5. **Le Conseil du Yi-King** — Quelle action ou non-action est recommandée

Style : Poétique, ancré dans la philosophie taoïste. Citez des métaphores naturelles (l'eau qui s'écoule, le tonnerre qui s'éveille, etc.).`;

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
        controller.enqueue(new TextEncoder().encode("Le Yi-King garde son silence... Réessayez."));
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
