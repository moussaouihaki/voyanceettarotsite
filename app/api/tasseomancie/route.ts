import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const authResult = await verifyIdToken(req);
  if (!authResult) return unauthorizedResponse();
  const rl = rateLimit(`tasseomancie:${authResult.uid}`, 10);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const body = (await req.json()) as {
    imageBase64: string;
    mimeType?: string;
    question?: string;
  };

  const { imageBase64, mimeType = "image/jpeg", question } = body;

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return new Response("Image manquante", { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any,
  });

  const systemPrompt = `Tu es Madame Céleste, experte en tasséomancie — l'art ancestral de lire les feuilles de thé. Tu as 30 ans d'expérience dans cet art divinatoire pratiqué depuis l'Antiquité en Chine, en Turquie et dans l'Europe victorienne.

Analyse l'image du fond de tasse de thé fournie et identifie les formes et symboles visibles dans les feuilles (animaux, objets, lettres, chiffres, formes géométriques), la position des formes dans la tasse (bord supérieur = avenir proche, milieu = moyen terme, fond = futur lointain ou passé), et les zones claires vs sombres (zones claires = énergie positive, sombres = défis).

${question ? `La question focale de la consultante est : "${question}"` : ""}

Donne une lecture complète et mystérieuse en français, en prose pure (JAMAIS de markdown, JAMAIS d'astérisques, JAMAIS de listes à puces), structurée ainsi en paragraphes distincts :

Commence par décrire ce que tu vois dans la tasse avec poésie. Puis évoque le message du passé récent (fond de tasse). Ensuite ce qui se joue maintenant (milieu de tasse). Puis ce qui vient vers la consultante (bords supérieurs). Termine par une synthèse et un conseil actionnable bienveillant.

Sois précise, évocatrice et bienveillante. Entre 400 et 600 mots. Précise en fin que c'est à des fins d'inspiration et de divertissement.`;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream([
          { inlineData: { mimeType, data: imageBase64 } },
          systemPrompt,
        ]);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(
          new TextEncoder().encode(
            "Les feuilles de votre tasse gardent leurs secrets... Réessayez."
          )
        );
        if (process.env.NODE_ENV === "development") console.error("[Tasséomancie error]", err);
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
