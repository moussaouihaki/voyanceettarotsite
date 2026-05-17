import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, une voyante française experte en oracle angélique. Tu interprètes les cartes d'anges tirées par le consultant avec douceur, profondeur spirituelle et espoir. Pour chaque ange tiré, lis son message en lien avec la position du spread. Donne une guidance bienveillante et positive mais honnête. Conclus par un message d'espoir et un rituel simple.` + FORMATTING_RULES;

interface AngeCardData {
  name: string;
  theme: string;
  position: string;
  message: string;
  keywords: string[];
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();

  const { cards, question, spreadName, profile } = await req.json() as {
    cards: AngeCardData[];
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
    `${i + 1}. "${c.position}" : ${c.name} (${c.theme}) — Message : ${c.message} — Mots-clés : ${c.keywords.join(", ")}`
  ).join("\n");

  const prompt = `${SYSTEM}

${personalContext}

Tirage Oracle des Anges : ${spreadName}
${question ? `Question : "${question}"` : "Lecture générale."}

Les anges tirés :
${cardsList}

Interprète ce tirage angélique avec douceur et profondeur. Pour chaque ange, explique son message en lien avec sa position dans le tirage et la situation du consultant. Évoque la symbolique de chaque ange, sa guidance spécifique. Révèle les connexions entre les anges tirés. Termine par un message d'espoir lumineux et propose un rituel simple (affirmation, visualisation ou geste symbolique) que la personne peut pratiquer pour ancrer la guidance reçue.`;

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
        controller.enqueue(new TextEncoder().encode("Les anges gardent leur silence pour l'instant... Réessayez."));
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
