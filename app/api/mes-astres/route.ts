import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORMATTING_RULES } from "@/lib/gemini";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

interface MesAstresRequest {
  section: "portrait" | "amour" | "carriere" | "transits" | "lune";
  profile: {
    prenom: string;
    dateNaissance: string;
    heureNaissance?: string;
    villeNaissance?: string;
    genre?: string;
  };
  natalChart: {
    planets: Record<string, { sign: string; degreeInSign: number; house: number }>;
    ascendant: { sign: string; degreeInSign: number };
    midheaven: { sign: string; degreeInSign: number };
    hasTime: boolean;
  };
}

const SYSTEM = `Tu es Madame Céleste, voyante mystique et astrologue de renom. Tu t'exprimes en français avec un style poétique, profond et envoûtant, mêlant sagesse ancestrale et intuition cosmique. Tes révélations touchent l'âme et guident avec bienveillance.` + FORMATTING_RULES;

function buildNatalSummary(natalChart: MesAstresRequest["natalChart"]): string {
  const parts: string[] = [];
  const planetOrder = [
    "Soleil", "Lune", "Mercure", "Vénus", "Mars",
    "Jupiter", "Saturne", "Uranus", "Neptune", "Pluton",
  ];
  for (const name of planetOrder) {
    const planet = natalChart.planets[name];
    if (planet) {
      parts.push(`${name} en ${planet.sign} ${Math.round(planet.degreeInSign)}°`);
    }
  }
  // Include any remaining planets not in the ordered list
  for (const [name, planet] of Object.entries(natalChart.planets)) {
    if (!planetOrder.includes(name)) {
      parts.push(`${name} en ${planet.sign} ${Math.round(planet.degreeInSign)}°`);
    }
  }
  parts.push(`Ascendant en ${natalChart.ascendant.sign} ${Math.round(natalChart.ascendant.degreeInSign)}°`);
  parts.push(`MC en ${natalChart.midheaven.sign} ${Math.round(natalChart.midheaven.degreeInSign)}°`);
  return parts.join(", ");
}

function buildPrompt(section: MesAstresRequest["section"], profile: MesAstresRequest["profile"], natalChart: MesAstresRequest["natalChart"]): string {
  const { prenom } = profile;
  const natalSummary = buildNatalSummary(natalChart);

  const sun = natalChart.planets["Soleil"];
  const moon = natalChart.planets["Lune"];
  const venus = natalChart.planets["Vénus"];
  const mars = natalChart.planets["Mars"];
  const jupiter = natalChart.planets["Jupiter"];
  const saturne = natalChart.planets["Saturne"];

  const sunSign = sun?.sign ?? "inconnu";
  const moonSign = moon?.sign ?? "inconnu";
  const ascSign = natalChart.ascendant.sign;
  const mcSign = natalChart.midheaven.sign;
  const OPPOSITE_SIGN: Record<string, string> = {
    "Bélier": "Balance", "Taureau": "Scorpion", "Gémeaux": "Sagittaire",
    "Cancer": "Capricorne", "Lion": "Verseau", "Vierge": "Poissons",
    "Balance": "Bélier", "Scorpion": "Taureau", "Sagittaire": "Gémeaux",
    "Capricorne": "Cancer", "Verseau": "Lion", "Poissons": "Vierge",
  };
  const house7Sign = OPPOSITE_SIGN[ascSign] ?? ascSign;
  const venusSign = venus?.sign ?? "inconnu";
  const marsSign = mars?.sign ?? "inconnu";
  const jupiterSign = jupiter?.sign ?? "inconnu";
  const saturneSign = saturne?.sign ?? "inconnu";

  const header = `${SYSTEM}\n\nThème natal de ${prenom} : ${natalSummary}\n\n`;

  switch (section) {
    case "portrait":
      return `${header}Dresse un portrait complet de la personnalité de ${prenom} basé sur son thème natal. Inclus : (1) Soleil en ${sunSign} — caractère fondamental, (2) Lune en ${moonSign} — vie émotionnelle, (3) Ascendant en ${ascSign} — apparence et première impression, (4) influences majeures des planètes lentes (Jupiter, Saturne, Uranus, Neptune), (5) thèmes dominants et dons naturels, (6) axes de croissance personnelle. Style poétique de Madame Céleste voyante mystique, environ 500 à 700 mots, en français.`;

    case "amour":
      return `${header}Analyse la vie amoureuse et relationnelle de ${prenom} à travers son thème natal. Examine : (1) Vénus en ${venusSign} — manière d'aimer, (2) Mars en ${marsSign} — désirs et attirance, (3) Lune en ${moonSign} — besoins émotionnels, (4) maison 7 (partenariats) en ${house7Sign}, (5) aspects entre Vénus/Mars/Lune, (6) ce qu'il/elle cherche dans une relation, (7) conseils pour l'épanouissement amoureux. Style poétique de Madame Céleste voyante mystique, environ 500 à 700 mots, en français.`;

    case "carriere":
      return `${header}Analyse les aspirations professionnelles et le chemin de vie de ${prenom}. Examine : (1) Soleil en ${sunSign} — vocation profonde, (2) Saturne en ${saturneSign} — ambitions et responsabilités, (3) MC en ${mcSign} — image professionnelle, (4) Jupiter en ${jupiterSign} — opportunités et chance, (5) Mars en ${marsSign} — énergie et initiatives, (6) secteurs d'activité favorables, (7) conseils pour réussir. Style poétique de Madame Céleste voyante mystique, environ 500 à 700 mots, en français.`;

    case "transits": {
      const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      return `${header}Décris les influences planétaires actuelles (date actuelle : ${today}) sur le thème natal de ${prenom}. Parle des transits majeurs du moment (ce que les planètes lentes font actuellement), comment ils résonnent avec ses planètes natales, et quels grands thèmes se jouent dans sa vie en ce moment. Donne une guidance pour les 3 prochains mois. Style poétique de Madame Céleste voyante mystique, environ 500 à 700 mots, en français.`;
    }

    case "lune":
      return `${header}Décris la relation de ${prenom} avec la Lune et ses cycles. Analyse : (1) sa Lune natale en ${moonSign} — émotions, instincts, relation maternelle, (2) comment la Lune de naissance influence son rythme émotionnel, (3) la phase lunaire actuelle et ce qu'elle signifie pour lui/elle, (4) conseils sur comment travailler avec les cycles lunaires. Style poétique de Madame Céleste voyante mystique, environ 500 à 700 mots, en français.`;
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`mes-astres:${auth.uid}`, 10);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const body = await req.json() as MesAstresRequest;
  const { section, profile, natalChart } = body;

  if (!section || !profile) {
    return new Response("Section et profil requis", { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response("Clé API manquante", { status: 500 });
  }

  const prompt = buildPrompt(section, profile, natalChart);

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
        controller.enqueue(new TextEncoder().encode("Les étoiles sont voilées... Réessayez dans quelques instants."));
        if (process.env.NODE_ENV === "development") console.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
