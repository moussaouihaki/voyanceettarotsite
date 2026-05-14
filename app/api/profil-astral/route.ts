import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM = `Tu es Madame Céleste, astrologue expérimentée maîtrisant l'astrologie occidentale, védique et kabbalistique. Tu interprètes les thèmes astraux avec profondeur, poésie et précision en français. Tu révèles la personnalité profonde, la mission de vie et les défis karmiques à travers les astres.`;

export async function POST(req: NextRequest) {
  const { prenom, dateNaissance, heureNaissance, lieuNaissance, signeSolaire, signeLunaire, ascendant } = await req.json() as {
    prenom: string;
    dateNaissance: string;
    heureNaissance?: string;
    lieuNaissance?: string;
    signeSolaire: string;
    signeLunaire?: string;
    ascendant?: string;
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const lunarInfo = signeLunaire ? `Lune en ${signeLunaire}` : "Lune non calculée (heure de naissance non fournie)";
  const ascInfo = ascendant ? `Ascendant ${ascendant}` : "Ascendant non calculé (heure et lieu de naissance nécessaires)";
  const birthInfo = heureNaissance ? `le ${dateNaissance} à ${heureNaissance}` : `le ${dateNaissance}`;
  const locationInfo = lieuNaissance ? `à ${lieuNaissance}` : "";

  const prompt = `${SYSTEM}

Profil astral de ${prenom} né(e) ${birthInfo} ${locationInfo}

🌞 SIGNE SOLAIRE : ${signeSolaire}
🌙 SIGNE LUNAIRE : ${lunarInfo}
⬆️ ASCENDANT : ${ascInfo}

Donne un profil astral complet, profond et poétique.

Structure :
1. **L'Essence solaire — ${signeSolaire}** : La personnalité consciente, l'ego, l'expression vitale (développez en détail)
2. **La Lune intérieure** : Les émotions profondes, les instincts, les besoins cachés${signeLunaire ? ` (Lune en ${signeLunaire})` : " — explorez les possibilités selon la date"}
3. **L'Ascendant et le masque social** ${ascendant ? `(${ascendant})` : ""}: Comment les autres vous perçoivent
4. **Les Forces & Défis** : Atouts naturels et domaines de croissance pour ce profil
5. **La Mission de vie astrologique** : Ce que les astres révèlent sur votre chemin
6. **Conseils des étoiles** : Guidance pratique et inspirante pour ${prenom}

Style mystique, précis, poétique et bienveillant. Reliez les symboles astrologiques à des archétypes mythologiques.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(new TextEncoder().encode("Les astres sont momentanément cachés derrière les nuages... Réessayez."));
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
