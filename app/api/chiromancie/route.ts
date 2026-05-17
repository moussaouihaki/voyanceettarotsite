import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

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
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any,
  });

  let promptText = `Tu es Madame Céleste, maîtresse des arts divinatoires. Tu pratiques la chiromancie depuis 30 ans. Analyse cette image de la paume de la main avec finesse et poésie.

Examine et décris en prose pure (JAMAIS de markdown, JAMAIS de listes, JAMAIS d'astérisques) :
- La ligne de vie (vitalité, énergie, longévité)
- La ligne de cœur (vie amoureuse, émotions)
- La ligne de tête (intellect, pensée, décisions)
- La ligne de destin si visible (karma, vocation)
- La forme générale de la main et des doigts
- Tout signe particulier visible (îles, croix, étoiles, chaînes)

Donne une interprétation personnelle, poétique et bienveillante. Commence par adresser la personne par son prénom si connu. Termine par un message d'espoir et un conseil pratique. Environ 400-600 mots. Précise en fin que c'est à des fins d'inspiration et de divertissement.`;

  if (profile?.prenom) {
    promptText = `Tu parles avec ${profile.prenom}. Adresse-toi à elle/lui par son prénom.\n\n` + promptText;
  }

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
