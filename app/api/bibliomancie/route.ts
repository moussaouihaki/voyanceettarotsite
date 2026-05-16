import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { FORMATTING_RULES } from "@/lib/gemini";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, gardienne des textes sacrés et oracle de la bibliomancie. Tu interprètes les passages tirés au hasard dans les grands textes de la sagesse universelle comme des réponses oraculaires de l'univers. Tu t'exprimes en français avec chaleur, profondeur mystique et poésie.` + FORMATTING_RULES;

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();

  const { question, passage, source, profile } = await req.json() as {
    question?: string;
    passage: string;
    source: string;
    profile?: { prenom?: string };
  };

  if (!passage) {
    return new Response("Passage manquant", { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const personalContext = profile?.prenom ? `Consultant(e) : ${profile.prenom}.` : "";

  const prompt = `${SYSTEM}

${personalContext}

Source oraculaire : ${source}
Passage tiré au sort : "${passage}"
${question ? `Question posée : "${question}"` : "Pas de question spécifique — lecture générale."}

Interprète ce passage comme un oracle qui répond à la question ou situation de la personne. Rédige uniquement en prose, sans markdown, entre 300 et 400 mots. Adopte un ton chaleureux et mystique.

${profile?.prenom ? `Commence par t'adresser à ${profile.prenom}.` : ""}
D'abord, explique ce que dit ce passage dans son contexte original et sa tradition. Ensuite, dévoile sa signification profonde en lien avec la question posée, comme si l'univers avait guidé cette main vers ces mots précis. Enfin, donne un conseil pratique et bienveillant ancré dans ce message. Termine par une phrase d'encouragement inspirée du passage.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(
          new TextEncoder().encode("Le livre garde ses secrets pour ce soir... Réessayez.")
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
