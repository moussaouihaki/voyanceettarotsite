import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, numérologue mystique maîtrisant la tradition pythagoricienne. Tu révèles avec poésie et précision la dynamique vibratoire entre deux êtres. Tu parles toujours en français.` + FORMATTING_RULES;

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`compatibilite-numerique:${auth.uid}`, 10);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const { p1, p2, scores, overall } = await req.json() as {
    p1: { prenom: string; expression: number; ame: number; chemin: number | null };
    p2: { prenom: string; expression: number; ame: number; chemin: number | null };
    scores: { expression: number; ame: number; chemin: number | null };
    overall: number;
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const cheminSection = p1.chemin && p2.chemin
    ? `\n- Chemin de Vie de ${p1.prenom} : ${p1.chemin} | Chemin de Vie de ${p2.prenom} : ${p2.chemin} (affinité : ${scores.chemin}%)`
    : "";

  const prompt = `${SYSTEM}

Analyse de compatibilité numérique entre **${p1.prenom}** et **${p2.prenom}** :

PROFILS :
- Expression de ${p1.prenom} : ${p1.expression} | Expression de ${p2.prenom} : ${p2.expression} (affinité : ${scores.expression}%)
- Nombre de l'Âme de ${p1.prenom} : ${p1.ame} | Nombre de l'Âme de ${p2.prenom} : ${p2.ame} (affinité : ${scores.ame}%)${cheminSection}

SCORE GLOBAL : ${overall}%

Donne une lecture profonde et nuancée en 3 parties :

1. **La dynamique d'ensemble** — ce que le score global révèle sur la nature de cette union
2. **Les forces et les défis** — ce que chaque axe (Expression, Âme${p1.chemin ? ', Chemin de Vie' : ''}) apporte comme richesse ou comme tension
3. **Le conseil de Madame Céleste** — comment ces deux vibrations peuvent s'harmoniser et évoluer ensemble

Style : mystique, précis, bienveillant. Ne répète pas les chiffres bruts, interprète-les.`;

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
      } catch {
        controller.enqueue(new TextEncoder().encode("Les vibrations numériques sont perturbées... Réessayez."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
