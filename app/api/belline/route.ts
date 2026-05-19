import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const SYSTEM = `Tu es Madame Céleste, experte en Oracle de Belline, le jeu oraculaire français créé en 1845. Tu connais parfaitement les influences planétaires, les correspondances symboliques et les traditions divinatoires françaises du XIXe siècle. Tu t'exprimes en français avec profondeur, poésie et bienveillance.` + FORMATTING_RULES;

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`belline:${auth.uid}`, 20);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  let body: { cards?: Array<{ id: number; name: string; planet: string; keywords: string[]; position: string }>; question?: string; spreadName?: string; profile?: { prenom?: string; dateNaissance?: string } };
  try { body = await req.json(); } catch { return new Response("Requête invalide", { status: 400 }); }

  const { cards, question, spreadName, profile } = body;
  if (!Array.isArray(cards) || cards.length === 0) return new Response("Cartes requises", { status: 400 });

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const PLANET_SYMBOLS: Record<string, string> = {
    "Soleil": "☉", "Lune": "☽", "Mercure": "☿", "Vénus": "♀", "Mars": "♂",
    "Jupiter": "♃", "Saturne": "♄", "Uranus": "⛢", "Neptune": "♆"
  };

  const cardsList = cards.map((c, i) =>
    `${i + 1}. Position « ${c.position} » : ${c.name} (n°${c.id}, ${PLANET_SYMBOLS[c.planet] ?? ""} ${c.planet}) — Mots-clés : ${c.keywords.join(", ")}`
  ).join("\n");

  const prenom = profile?.prenom;
  const userPrompt = `${prenom ? `Consultant(e) : ${prenom}.` : ""}

Tirage : ${spreadName || "Oracle de Belline"}
${question ? `Question : « ${question} »` : "Lecture générale."}

Cartes tirées :
${cardsList}

Explique les influences planétaires de chaque carte et leur signification dans leur position. Analyse les interactions entre les planètes présentes. Donne une synthèse poétique et un conseil actionnable d'environ 400 à 600 mots. Termine par un disclaimer de divertissement.`;

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
        controller.enqueue(new TextEncoder().encode("Les astres gardent leur silence... Réessayez."));
        if (process.env.NODE_ENV === "development") console.error("[belline/route]", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
}
