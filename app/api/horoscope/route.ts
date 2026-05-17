import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, astrologue mystique et voyante expérimentée. Tu écris les horoscopes en français avec un style poétique, inspirant et précis. Tes horoscopes sont personnalisés, profonds, et toujours bienveillants.`;

interface ProfileData {
  prenom?: string;
  dateNaissance?: string;
  heureNaissance?: string;
  villeNaissance?: string;
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`horoscope:${auth.uid}`, 20);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const { sign, period = "jour", profile } = await req.json() as {
    sign: string;
    period?: string;
    profile?: ProfileData;
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const periodLabel = period === "jour" ? "du jour" : period === "semaine" ? "de la semaine" : "du mois";

  const personalCtx = profile?.prenom
    ? `Cet horoscope est pour ${profile.prenom}${profile.dateNaissance ? `, né(e) le ${profile.dateNaissance}` : ""}${profile.villeNaissance ? ` à ${profile.villeNaissance}` : ""}. Adresse-toi à ${profile.prenom} directement et par son prénom.`
    : "";

  const prompt = `${SYSTEM}
${personalCtx}

Écris l'horoscope ${periodLabel} pour le signe ${sign}.
Date : ${today}

L'horoscope doit couvrir :
1. Amour & Relations — 2-3 phrases poétiques et précises
2. Travail & Projets — 2-3 phrases avec des conseils concrets
3. Finances — 1-2 phrases sur l'énergie financière ${periodLabel}
4. Santé & Bien-être — 1-2 phrases de guidance
5. Message des étoiles — 1 phrase inspirante comme synthèse${profile?.prenom ? `\n6. Conseil personnalisé pour ${profile.prenom} — une guidance unique basée sur son énergie natale` : ""}

Commence par une accroche mystique sur l'énergie ${periodLabel} pour ce signe.${profile?.prenom ? ` Commence en appelant ${profile.prenom} par son prénom.` : ""} Style élégant, mystique mais concret. Maximum 220 mots.`;

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
        controller.enqueue(new TextEncoder().encode("Les astres sont momentanément voilés..."));
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
