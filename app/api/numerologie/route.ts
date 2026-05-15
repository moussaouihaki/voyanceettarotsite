import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NumerologyProfile } from "@/lib/numerology";

const SYSTEM = `Tu es Madame Céleste, numérologue mystique maîtrisant la numérologie pythagoricienne, kabbalistique et angélique. Tu interprètes les nombres avec profondeur et poésie, en français. Tu révèles la mission de vie, les talents cachés et les défis karmiques de tes consultants.`;

export async function POST(req: NextRequest) {
  const { prenom, nom, dateNaissance, profile } = await req.json() as {
    prenom: string;
    nom: string;
    dateNaissance: string;
    profile: NumerologyProfile;
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  const masterNote = profile.nombreMaitre ? `⚠️ ATTENTION : Le Chemin de Vie ${profile.cheminDeVie} est un NOMBRE MAÎTRE — vibration élevée et mission spirituelle importante.` : "";
  const karmicNote = profile.nombreKarmique ? `⚠️ DETTE KARMIQUE ${profile.nombreKarmique} détectée — une leçon de vie importante à intégrer.` : "";

  const prompt = `${SYSTEM}

Profil numérologique de ${prenom} ${nom} (né(e) le ${dateNaissance}) :

🌟 CHEMIN DE VIE : ${profile.cheminDeVie} ${masterNote}
💫 NOMBRE D'EXPRESSION : ${profile.expression}
❤️ NOMBRE DE L'ÂME : ${profile.ame}
🎭 NOMBRE DE PERSONNALITÉ : ${profile.personnalite}
⚡ NOMBRE ACTIF (prénom) : ${profile.actif}
🏠 NOMBRE HÉRÉDITAIRE (nom) : ${profile.hereditaire}
📅 ANNÉE PERSONNELLE : ${profile.anneePersonnelle}
🌙 MOIS PERSONNEL : ${profile.moisPersonnel}
☀️ JOUR PERSONNEL : ${profile.jourPersonnel}
🌱 NOMBRE DE NAISSANCE (jour) : ${profile.nombreNaissance}
${karmicNote}

Donne une lecture numérologique complète, profonde et poétique.

Structure :
1. **Le Chemin de Vie ${profile.cheminDeVie}** — La mission principale (développez longuement)
2. **L'Expression & l'Âme** — La personnalité visible vs le désir profond
3. **Les Influences actuelles** — Année personnelle ${profile.anneePersonnelle} : que signifie cette année ?
4. **Synthèse & Conseil** — Comment ces vibrations s'harmonisent dans votre vie

Style mystique, précis et bienveillant. Mentionnez si des nombres maîtres ou karmiques sont présents.`;

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
        controller.enqueue(new TextEncoder().encode("Les vibrations numériques sont perturbées... Réessayez."));
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
