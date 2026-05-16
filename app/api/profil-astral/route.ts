import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";

export const maxDuration = 60;

const SYSTEM = `Tu es Madame Céleste, astrologue expérimentée maîtrisant l'astrologie occidentale, védique et kabbalistique. Tu interprètes les thèmes astraux avec profondeur, poésie et précision en français. Tu révèles la personnalité profonde, la mission de vie et les défis karmiques à travers les astres.` + FORMATTING_RULES;

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();

  const body = await req.json() as {
    prenom: string;
    dateNaissance: string;
    heureNaissance?: string;
    lieuNaissance?: string;
    signeSolaire: string;
    signeLunaire?: string;
    ascendant?: string;
    midheaven?: string;
    planets?: string;
    aspects?: string;
  };
  const { prenom, dateNaissance, heureNaissance, lieuNaissance, signeSolaire, signeLunaire, ascendant, midheaven, planets, aspects } = body;

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });
  if (!prenom || !dateNaissance || !signeSolaire) return new Response("Données insuffisantes", { status: 400 });

  const birthInfo = heureNaissance ? `le ${dateNaissance} à ${heureNaissance}` : `le ${dateNaissance}`;
  const locationInfo = lieuNaissance ? ` à ${lieuNaissance}` : "";

  const planetBlock = planets
    ? `\n🪐 POSITIONS PLANÉTAIRES CALCULÉES :\n${planets}`
    : "";
  const ascBlock = ascendant
    ? `\n⬆️ ASCENDANT : ${ascendant}${midheaven ? `\n☁️ MILIEU DU CIEL (MC) : ${midheaven}` : ""}`
    : "\n⬆️ ASCENDANT : Non calculé (heure et lieu de naissance non fournis)";
  const aspectBlock = aspects
    ? `\n🔗 ASPECTS PRINCIPAUX : ${aspects}`
    : "";

  const prompt = `${SYSTEM}

Thème natal calculé astronomiquement de ${prenom}, né(e) ${birthInfo}${locationInfo}.

🌞 SIGNE SOLAIRE : ${signeSolaire}
🌙 SIGNE LUNAIRE : ${signeLunaire ?? "Non calculé"}${ascBlock}${planetBlock}${aspectBlock}

Interprète ce thème astral avec profondeur, précision et poésie. Chaque position planétaire est calculée par algorithme astronomique réel (Jean Meeus).

Structure :
1. **L'Essence solaire — ${signeSolaire}** : Personnalité consciente, ego, expression vitale
2. **La Lune en ${signeLunaire ?? "…"}** : Émotions profondes, instincts, besoins cachés
${ascendant ? `3. **L'Ascendant ${ascendant}** : Masque social, première impression` : "3. **L'ascendant** : Explore les potentiels liés au signe solaire"}
4. **Les planètes en détail** : Mercure (intellect), Vénus (amour), Mars (énergie) — interprète selon leurs positions réelles
5. **Les aspects majeurs** : Comment les planètes dialoguent entre elles dans ce thème
6. **La Mission de vie** : Ce que ce thème natal révèle sur le chemin de vie de ${prenom}
7. **Conseils des étoiles** : Guidance pratique et inspirante

Style mystique, précis, poétique. Utilise des archétypes mythologiques. Évite les généralités — appuie-toi sur les positions réelles.`;

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
        controller.enqueue(new TextEncoder().encode("Les astres sont momentanément cachés derrière les nuages… Réessayez."));
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
