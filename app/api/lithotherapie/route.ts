import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, lithothérapeute et guérisseuse énergétique. Tu interprètes les messages des cristaux et pierres précieuses avec sagesse, poésie et profondeur en français. Tu guides vers la guérison vibratoire et l'équilibre des énergies.` + FORMATTING_RULES;

interface CrystalData {
  name: string;
  colorHex: string;
  chakra: string;
  position: string;
  keywords: string[];
  properties: string;
}

interface LithotherapieRequest {
  crystals: CrystalData[];
  question?: string;
  spreadName: string;
  profile?: { prenom?: string; dateNaissance?: string };
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`lithotherapie:${auth.uid}`, 20);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const { crystals, question, spreadName, profile } = await req.json() as LithotherapieRequest;

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const prenom = profile?.prenom ?? "chère âme";
  const dateNaissance = profile?.dateNaissance ? `\nDate de naissance : ${profile.dateNaissance}` : "";

  const crystalsList = crystals.map((c, i) =>
    `${i + 1}. Position "${c.position}" : ${c.name} (Chakra : ${c.chakra}) — Mots-clés : ${c.keywords.join(", ")} — Propriétés : ${c.properties}`
  ).join("\n");

  const prompt = `${SYSTEM}

Prénom de la personne : ${prenom}${dateNaissance}

Tirage de cristaux : ${spreadName}
${question ? `Question ou intention : "${question}"` : "Lecture vibratoire générale."}

Les cristaux révélés :
${crystalsList}

Compose une lecture lithothérapeutique d'environ 500 mots. Adresse-toi à ${prenom} dès la première phrase. Pour chaque cristal, interprète son message vibratoire dans sa position et la façon dont il répond à l'intention ou à la question. Évoque les chakras concernés, les énergies en jeu et la guidance pratique de guérison. Conclus par une synthèse inspirante et un conseil concret sur l'utilisation des cristaux pour cette guidance.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(new TextEncoder().encode("Les cristaux gardent leur silence... Réessayez."));
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
