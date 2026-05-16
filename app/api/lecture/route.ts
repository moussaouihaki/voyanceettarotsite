import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MADAME_CELESTE_SYSTEM } from "@/lib/gemini";
import { getSunSign } from "@/lib/astrology";

interface CardData {
  name: string;
  suit: string;
  number: string;
  position: string;
  reversed: boolean;
  keywords: string[];
}

interface UserProfile {
  prenom?: string;
  dateNaissance?: string;
  heureNaissance?: string;
  villeNaissance?: string;
}

interface ConjointInfo {
  prenom?: string;
  dateNaissance?: string;
  heureNaissance?: string;
  villeNaissance?: string;
  lat?: number;
  lon?: number;
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();

  let body: { cards?: CardData[]; question?: string; spreadType?: string; spreadName?: string; profile?: UserProfile; conjoint?: ConjointInfo };
  try {
    body = await req.json();
  } catch {
    return new Response("Requête invalide", { status: 400 });
  }

  const { cards, question, spreadName, profile, conjoint } = body;
  if (!Array.isArray(cards) || cards.length === 0) {
    return new Response("Cartes requises", { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const cardsList = cards.map((c, i) =>
    `${i + 1}. Position « ${c.position} » : ${c.name} (${c.suit}, ${c.number})${c.reversed ? " — INVERSÉE" : ""}\n   Mots-clés : ${c.keywords.join(", ")}`
  ).join("\n");

  let personalContext = "";
  if (profile?.prenom) {
    let sunSign = "";
    if (profile.dateNaissance) {
      try {
        sunSign = getSunSign(profile.dateNaissance).name;
      } catch {}
    }

    const birthParts: string[] = [];
    if (profile.dateNaissance) birthParts.push(profile.dateNaissance);
    if (profile.heureNaissance) birthParts.push(profile.heureNaissance);
    const birthDesc = birthParts.length > 0 ? ` née le ${birthParts.join(" à ")}` : "";
    const cityDesc = profile.villeNaissance ? ` à ${profile.villeNaissance}` : "";
    const sunDesc = sunSign ? `, signe ${sunSign}` : "";

    personalContext = `\nCette lecture est pour ${profile.prenom},${birthDesc}${cityDesc}${sunDesc}. Adresse-toi à elle/lui par son prénom tout au long de la lecture. Commence par adresser ${profile.prenom} directement.`;
  }

  let conjointContext = "";
  if (conjoint?.prenom && conjoint?.dateNaissance) {
    let conjointSun = "";
    try { conjointSun = getSunSign(conjoint.dateNaissance).name; } catch {}
    const sunDesc = conjointSun ? `, signe ${conjointSun}` : "";
    conjointContext = `\n\nInformations sur le/la partenaire : ${conjoint.prenom}, né(e) le ${conjoint.dateNaissance}${conjoint.heureNaissance ? ` à ${conjoint.heureNaissance}` : ""}${conjoint.villeNaissance ? ` à ${conjoint.villeNaissance}` : ""}${sunDesc}. Intègre une analyse de compatibilité entre ${profile?.prenom || "le/la consultant(e)"} et ${conjoint.prenom} dans ta lecture.`;
  }

  const userPrompt = `${MADAME_CELESTE_SYSTEM}

Tirage consulté : ${spreadName || "Tirage de Tarot"}
${personalContext}${conjointContext}

Cartes tirées :
${cardsList}

${question ? `Question du consultant : « ${question} »` : "Lecture générale (pas de question spécifique)."}

Donne une lecture complète, poétique et profonde. Pour chaque carte, explique sa signification dans sa position et son interaction avec les autres cartes. Termine par une synthèse globale, un message d'espoir et un conseil pratique actionnable. Environ 600-800 mots.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(userPrompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(new TextEncoder().encode("\n\nLes astres sont voilés... Réessayez dans quelques instants."));
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
