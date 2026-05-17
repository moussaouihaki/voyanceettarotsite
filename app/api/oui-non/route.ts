import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MODEL_NAME } from "@/lib/gemini";
import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 30;

type CardResult = "OUI" | "NON" | "PEUT-ÊTRE";

const POSITIVE_CARDS = new Set([
  "Le Soleil",
  "L'Étoile",
  "Le Monde",
  "La Roue de la Fortune",
  "Le Bateleur",
  "Les Amoureux",
  "La Justice",
  "Le Jugement",
  "L'Impératrice",
  "La Force",
  "La Tempérance",
  "L'Empereur",
]);

const NEGATIVE_CARDS = new Set([
  "La Tour",
  "Le Diable",
  "La Lune",
  "La Mort",
  "Le Pendu",
  "L'Ermite",
  "Le Chariot",
  "La Maison-Dieu",
]);

function classifyCard(name: string): "positive" | "negative" | "neutral" {
  if (POSITIVE_CARDS.has(name)) return "positive";
  if (NEGATIVE_CARDS.has(name)) return "negative";
  return "neutral";
}

function computeResult(cards: string[]): CardResult {
  let positive = 0;
  let negative = 0;
  let neutral = 0;

  for (const card of cards) {
    const cat = classifyCard(card);
    if (cat === "positive") positive++;
    else if (cat === "negative") negative++;
    else neutral++;
  }

  if (positive > negative && positive > neutral) return "OUI";
  if (negative > positive && negative > neutral) return "NON";
  return "PEUT-ÊTRE";
}

export async function POST(req: NextRequest) {
  const authResult = await verifyIdToken(req);
  if (!authResult) return unauthorizedResponse();
  const rl = rateLimit(`oui-non:${authResult.uid}`, 20);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const { question, cards } = (await req.json()) as {
    question: string;
    cards: string[];
  };

  if (!question || !Array.isArray(cards) || cards.length !== 3) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const result = computeResult(cards);

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Clé API manquante." }, { status: 500 });
  }

  const prompt = `Tu es Madame Céleste. Réponds à la question "${question}" en te basant sur les 3 cartes tirées : ${cards.join(", ")}. Le résultat global est ${result}. Donne une interprétation bienveillante de 2-3 phrases maximum. Commence directement par l'interprétation sans préambule. N'utilise jamais de markdown ni d'astérisques.`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const response = await model.generateContent(prompt);
    const interpretation = response.response.text().trim();

    return NextResponse.json({ result, interpretation });
  } catch {
    return NextResponse.json(
      { result, interpretation: "Les cartes ont parlé. Faites confiance à leur réponse et à votre intuition pour avancer sur votre chemin." },
      { status: 200 }
    );
  }
}
