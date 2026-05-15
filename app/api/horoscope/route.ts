import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM = `Tu es Madame Céleste, astrologue mystique et voyante expérimentée. Tu écris les horoscopes en français avec un style poétique, inspirant et précis. Tes horoscopes sont personnalisés, profonds, et toujours bienveillants.`;

export async function POST(req: NextRequest) {
  const { sign, period = "jour" } = await req.json() as { sign: string; period?: string };
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const prompt = `${SYSTEM}

Écris l'horoscope du ${period === "jour" ? "jour" : period === "semaine" ? "de la semaine" : "du mois"} pour le signe ${sign}.

Date : ${today}

L'horoscope doit couvrir :
1. ❤️ Amour & Relations — 2-3 phrases poétiques et précises
2. 💼 Travail & Projets — 2-3 phrases avec des conseils concrets
3. 💰 Finances — 1-2 phrases sur l'énergie financière du ${period}
4. 🌿 Santé & Bien-être — 1-2 phrases de guidance
5. ⭐ Message des étoiles — 1 phrase inspirante comme synthèse

Commence par une accroche mystique sur l'énergie du jour pour ce signe. Style élégant, mystique mais concret. Maximum 200 mots.`;

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
