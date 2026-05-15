import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";

const SYSTEM = `Tu es Madame Céleste, astrologue maîtresse de la synastrie et de la compatibilité amoureuse. Tu lis les thèmes astraux comparés avec poésie, profondeur et bienveillance, en français. Tu révèles les dynamiques karmiques, les forces et les défis d'une union.` + FORMATTING_RULES;

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    person1: { prenom: string; signe: string; dateNaissance: string };
    person2: { prenom: string; signe: string; dateNaissance: string };
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const { person1, person2 } = body;

  const prompt = `${SYSTEM}

Analyse de synastrie entre :
🌞 ${person1.prenom} — ${person1.signe} (né(e) le ${person1.dateNaissance})
🌙 ${person2.prenom} — ${person2.signe} (né(e) le ${person2.dateNaissance})

Donne une analyse complète et poétique de cette synastrie.

Structure :
1. **L'Aura de l'union** — Vibration globale de ce couple (introduction mystique)
2. **Compatibilité Solaire** — Comment ${person1.signe} et ${person2.signe} interagissent sur le plan de l'identité
3. **Dynamiques émotionnelles** — La rencontre des cœurs et des sensibilités
4. **Forces de l'union** — Ce qui rend cette connexion magique et précieuse
5. **Défis & leçons karmiques** — Les zones d'apprentissage mutuel
6. **Conseil astrologique** — Comment cultiver cette union sur le long terme
7. **Score de compatibilité** — Une note sur 100 avec justification

Style : poétique, profond, nuancé. Ne sois pas trop optimiste ni trop pessimiste — soyez vrai.`;

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
        controller.enqueue(new TextEncoder().encode("Les étoiles refusent de parler... Réessayez."));
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
