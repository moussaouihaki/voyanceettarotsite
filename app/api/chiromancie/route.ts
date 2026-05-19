import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { FORMATTING_RULES } from "@/lib/gemini";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, maîtresse de la chiromancie selon la tradition de Cheiro et de l'école occidentale classique. Tu lis les lignes de la main depuis 30 ans, en t'appuyant sur les grandes lignes (vie, cœur, tête, destin) et les signes secondaires (îles, croix, étoiles, chaînes). Tu t'exprimes en français avec finesse, poésie et bienveillance.` + FORMATTING_RULES;

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`chiromancie:${auth.uid}`, 10);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const body = await req.json() as {
    imageBase64: string;
    mimeType: string;
    profile?: { prenom?: string; dateNaissance?: string };
  };

  const { imageBase64, mimeType, profile } = body;

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return new Response("Image manquante", { status: 400 });
  }

  // ~7 MB max when base64-decoded
  if (imageBase64.length > 9_500_000) {
    return new Response("Image trop volumineuse (max 7 Mo)", { status: 413 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM,
    generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any,
  });

  const personalContext = profile?.prenom ? `Consultant(e) : ${profile.prenom}.\n\n` : "";

  const promptText = `${personalContext}Analyse cette image de la paume de la main.

Examine et interprète en prose pure :
- La ligne de vie (vitalité, énergie, longévité)
- La ligne de cœur (vie amoureuse, émotions)
- La ligne de tête (intellect, pensée, décisions)
- La ligne de destin si visible (karma, vocation)
- La forme générale de la main et des doigts
- Tout signe particulier visible (îles, croix, étoiles, chaînes)

Donne une lecture personnelle, poétique et bienveillante d'environ 400 à 600 mots. Termine par un message d'espoir et un conseil pratique. Précise en fin que cette lecture est à des fins d'inspiration et de divertissement.`;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream([
          { inlineData: { mimeType, data: imageBase64 } },
          promptText,
        ]);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(
          new TextEncoder().encode("Les lignes de votre main gardent leurs secrets... Réessayez.")
        );
        if (process.env.NODE_ENV === "development") console.error(err);
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
