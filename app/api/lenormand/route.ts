import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, maîtresse de l'Oracle Lenormand et des arts cartomanciques. Tu interprètes les 36 cartes Lenormand avec précision, poésie et profondeur en français. Tu révèles les messages cachés dans les combinaisons de cartes avec sagesse bienveillante.` + FORMATTING_RULES;

interface LenormandCardData {
  number: number;
  name: string;
  symbol: string;
  position: string;
  keywords: string[];
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`lenormand:${auth.uid}`, 20);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const { cards, question, spreadName, profile } = await req.json() as {
    cards: LenormandCardData[];
    question?: string;
    spreadName: string;
    profile?: { prenom?: string; dateNaissance?: string };
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  if (!cards || cards.length === 0) {
    return new Response("Cartes manquantes", { status: 400 });
  }

  const personalContext = profile?.prenom
    ? `Consultant(e) : ${profile.prenom}${profile.dateNaissance ? `, né(e) le ${profile.dateNaissance}` : ""}.`
    : "";

  const cardsList = cards.map((c, i) =>
    `${i + 1}. "${c.position}" : ${c.symbol} N°${c.number} — ${c.name} — Mots-clés : ${c.keywords.join(", ")}`
  ).join("\n");

  const prompt = `${SYSTEM}

${personalContext}

Tirage Lenormand : ${spreadName}
${question ? `Question : "${question}"` : "Lecture générale."}

Les cartes tirées :
${cardsList}

Donne une interprétation profonde et poétique d'environ 500 mots de ce tirage Lenormand. Analyse chaque carte dans sa position, puis révèle les combinaisons et les messages secrets entre les cartes voisines. Évoque la tradition cartomancique et le symbolisme propre à l'Oracle Lenormand. Termine par une synthèse lumineuse et un conseil bienveillant et actionnable.`;

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
        controller.enqueue(new TextEncoder().encode("Les cartes gardent leur silence... Réessayez."));
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
