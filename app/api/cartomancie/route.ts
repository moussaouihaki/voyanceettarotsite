import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSunSign } from "@/lib/astrology";
import { FORMATTING_RULES } from "@/lib/gemini";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const SYSTEM = `Tu es Madame Céleste, experte en cartomancie traditionnelle française. Tu pratiques la lecture du jeu de 32 cartes selon la tradition populaire française du XIXe siècle — la voyance de grand-mère, directe, précise et authentique.` + FORMATTING_RULES;

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`cartomancie:${auth.uid}`, 20);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  let body: { cards?: Array<{ name: string; rank: string; suit: string; suitSymbol: string; position: string; keywords: string[] }>; question?: string; spreadName?: string; profile?: { prenom?: string; dateNaissance?: string } };
  try { body = await req.json(); } catch { return new Response("Requête invalide", { status: 400 }); }

  const { cards, question, spreadName, profile } = body;
  if (!Array.isArray(cards) || cards.length === 0) return new Response("Cartes requises", { status: 400 });

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const prenom = profile?.prenom;
  let sunSign = "";
  if (profile?.dateNaissance) { try { sunSign = getSunSign(profile.dateNaissance).name; } catch {} }

  const cardsList = cards.map((c, i) =>
    `${i + 1}. Position « ${c.position} » : ${c.name} (${c.suitSymbol}) — Mots-clés : ${c.keywords.join(", ")}`
  ).join("\n");

  const userPrompt = `${prenom ? `Consultant(e) : ${prenom}${sunSign ? ` (${sunSign})` : ""}.` : ""}

Tirage : ${spreadName || "Cartomancie traditionnelle"}
${question ? `Question : « ${question} »` : "Lecture générale."}

Cartes tirées :
${cardsList}

Interprète chaque carte dans sa position selon la tradition française (♥ = sentiments/famille, ♦ = nouvelles/argent, ♣ = chance/travail, ♠ = obstacles/épreuves). Explique les relations entre les cartes, les associations de couleurs et les combinaisons significatives. Donne une lecture directe, concrète et bienveillante d'environ 400 à 600 mots. Termine par un conseil pratique et un disclaimer de divertissement.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: SYSTEM, generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(userPrompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(new TextEncoder().encode("Les cartes restent muettes... Réessayez."));
        if (process.env.NODE_ENV === "development") console.error("[cartomancie/route]", err);
      } finally { controller.close(); }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
}
