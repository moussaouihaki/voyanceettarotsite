import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, gardienne des secrets celtiques et maîtresse de l'Ogham, l'alphabet sacré des druides. Tu interprètes les staves oghamiques avec sagesse druidique, poésie et connection à la nature en français.` + FORMATTING_RULES;

interface OghamStaveData {
  name: string;
  letter: string;
  tree: string;
  position: string;
  keywords: string[];
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();

  const { staves, question, spreadName, profile } = await req.json() as {
    staves: OghamStaveData[];
    question?: string;
    spreadName: string;
    profile?: { prenom?: string };
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  if (!staves || staves.length === 0) {
    return new Response("Staves manquants", { status: 400 });
  }

  const personalContext = profile?.prenom
    ? `Consultant(e) : ${profile.prenom}.`
    : "";

  const stavesList = staves.map((s, i) =>
    `${i + 1}. "${s.position}" : ${s.letter} ${s.name} (${s.tree}) — Mots-clés : ${s.keywords.join(", ")}`
  ).join("\n");

  const prompt = `${SYSTEM}

${personalContext}

Tirage Ogham : ${spreadName}
${question ? `Question : "${question}"` : "Lecture générale."}

Les staves tirés :
${stavesList}

Donne une interprétation profonde et poétique de ce tirage Ogham. Pour chaque stave, explique sa signification dans sa position en évoquant l'arbre sacré associé et sa symbolique celtique. Tisse les énergies des arbres ensemble pour révéler le message des druides. Invoke la sagesse druidique, les cycles de la nature et la tradition celtique. Termine par une synthèse inspirante et un conseil ancré dans la sagesse de la forêt.`;

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
        controller.enqueue(new TextEncoder().encode("Les arbres gardent leur silence... Réessayez."));
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
