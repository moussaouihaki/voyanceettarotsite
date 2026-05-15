import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";

const SYSTEM = `Tu es Madame Céleste, guérisseuse énergétique et experte en chakras, kundalini et médecine subtile. Tu interprètes les bilans énergétiques avec compassion, poésie et profondeur en français. Tu guides vers la guérison et l'équilibre des corps subtils.` + FORMATTING_RULES;

export async function POST(req: NextRequest) {
  const { scores } = await req.json() as { scores: Record<string, number> };
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const chakraNames: Record<string, string> = {
    racine: "Chakra Racine (Mūlādhāra) 🔴",
    sacre: "Chakra Sacré (Svādhiṣṭhāna) 🟠",
    plexus: "Chakra Plexus Solaire (Maṇipūra) 🟡",
    coeur: "Chakra Cœur (Anāhata) 💚",
    gorge: "Chakra Gorge (Viśuddha) 🔵",
    "troisieme-oeil": "Chakra Troisième Œil (Ājñā) 🔮",
    couronne: "Chakra Couronne (Sahasrāra) 👑",
  };

  const scoresList = Object.entries(scores).map(([id, score]) =>
    `${chakraNames[id] || id} : ${score}% ouvert (${score < 40 ? "BLOQUÉ" : score < 70 ? "PARTIELLEMENT OUVERT" : "OUVERT"})`
  ).join("\n");

  const mostBlocked = Object.entries(scores).sort(([, a], [, b]) => a - b)[0];
  const mostOpen = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];

  const prompt = `${SYSTEM}

Bilan énergétique des chakras :
${scoresList}

Chakra le plus bloqué : ${chakraNames[mostBlocked[0]] || mostBlocked[0]} (${mostBlocked[1]}%)
Chakra le plus ouvert : ${chakraNames[mostOpen[0]] || mostOpen[0]} (${mostOpen[1]}%)

Donne un bilan énergétique complet et des conseils de guérison.

Structure :
1. **Lecture globale de l'aura énergétique** — Vue d'ensemble poétique de l'état énergétique
2. **Les chakras qui demandent attention** — Focalisez sur les plus bloqués avec compassion
3. **Les chakras en force** — Célébrez les chakras ouverts et comment les utiliser
4. **Programme de rééquilibrage** — Conseils pratiques : cristaux, mantras, affirmations, pratiques
5. **Message de guérison** — Un message d'espoir et d'encouragement

Style bienveillant, spirituel et ancré dans les pratiques traditionnelles.`;

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
        controller.enqueue(new TextEncoder().encode("Les énergies subtiles sont perturbées... Réessayez."));
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
