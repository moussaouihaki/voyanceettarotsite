import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, voyante et lectrice d'auras. Tu interprètes les couleurs des champs énergétiques avec clairvoyance, poésie et profondeur en français. Tu révèles l'état de l'âme à travers les vibrations colorées de l'aura.` + FORMATTING_RULES;

interface AuraColorData {
  name: string;
  colorHex: string;
  chakra: string;
  archetype: string;
  keywords: string[];
  message: string;
}

interface AuraRequest {
  colors: AuraColorData[];
  question?: string;
  profile?: { prenom?: string; dateNaissance?: string };
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`aura:${auth.uid}`, 20);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const { colors, question, profile } = await req.json() as AuraRequest;

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const prenom = profile?.prenom ?? "chère âme";
  const dateNaissance = profile?.dateNaissance ? `\nDate de naissance : ${profile.dateNaissance}` : "";

  const colorsList = colors.map((c, i) =>
    `${i + 1}. ${c.name} — Archétype : ${c.archetype} — Chakra : ${c.chakra} — Mots-clés : ${c.keywords.join(", ")} — Message : ${c.message}`
  ).join("\n");

  const prompt = `${SYSTEM}

Prénom de la personne : ${prenom}${dateNaissance}

${question ? `Question ou intention : "${question}"` : "Lecture aura générale."}

Les couleurs d'aura révélées :
${colorsList}

Compose une lecture d'aura d'environ 400 mots. Adresse-toi à ${prenom} dès la première phrase. Décris la signification de chaque couleur d'aura révélée, son archétype, son chakra associé et ce qu'elle dit de l'état de l'âme en ce moment. Explore les interactions entre les couleurs et ce qu'elles révèlent ensemble. Conclus par un message d'orientation vibratoire et un conseil pratique pour travailler avec ces énergies.`;

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
        controller.enqueue(new TextEncoder().encode("Les couleurs de l'aura restent voilées... Réessayez."));
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
