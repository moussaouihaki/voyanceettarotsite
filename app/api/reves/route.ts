import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

interface RevesRequest {
  dream: string;
  recurring?: boolean;
  dreamType?: string;
  emotions?: string;
  profile?: { prenom?: string; dateNaissance?: string };
}

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (!auth) return unauthorizedResponse();
  const rl = rateLimit(`reves:${auth.uid}`, 20);
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const { dream, recurring, dreamType, emotions, profile } = await req.json() as RevesRequest;

  if (!dream || dream.trim().length < 50) {
    return new Response(
      JSON.stringify({ error: "La description du rêve doit contenir au moins 50 caractères." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response("Clé API manquante", { status: 500 });
  }

  const prenom = profile?.prenom?.trim() || null;
  const dateNaissance = profile?.dateNaissance || null;

  const systemInstruction = `Tu es Madame Céleste, spécialiste en oniromancie — l'art d'interpréter les rêves. Tu puises dans le symbolisme jungien, les archétypes spirituels universels et ton intuition profonde pour révéler les messages cachés dans les rêves. Tu t'exprimes uniquement en français, avec une prose poétique, mystique et profondément bienveillante.

RÈGLES ABSOLUES DE FORMAT — à respecter sans la moindre exception :
1. PROSE PURE : N'utilise JAMAIS de markdown. Interdit absolu : astérisques (* ou **), dièses (#), tirets de liste (- ou *), underscores (_), backticks, chevrons (>). Écris UNIQUEMENT en prose fluide.
2. PAS DE LISTES : Aucune liste, aucun titre, aucun sous-titre. Uniquement des paragraphes séparés par des sauts de ligne.
3. PRÉNOM : Si le prénom est connu, adresse-toi à la personne par son prénom dès la première phrase et régulièrement tout au long de l'interprétation.`;

  const prenomPhrase = prenom
    ? `Le prénom de la personne est : ${prenom}.`
    : "Le prénom de la personne est inconnu — adresse-toi à elle chaleureusement.";

  const datePhrase = dateNaissance
    ? `Date de naissance : ${dateNaissance}.`
    : "";

  const dreamTypePhrase = dreamType && dreamType !== "Rêve ordinaire"
    ? `Ce rêve est de type : ${dreamType}. Adapte ton interprétation à ce type spécifique — un ${dreamType.toLowerCase()} porte des caractéristiques et des messages particuliers que tu dois impérativement intégrer dans ta lecture.`
    : "";

  const recurrentPhrase = recurring
    ? `Ce rêve est RÉCURRENT — insiste particulièrement sur l'importance de ce message répété et sur ce que l'inconscient cherche à communiquer avec insistance. Un rêve récurrent est un appel urgent de l'âme.`
    : "";

  const emotionsPhrase = emotions?.trim()
    ? `Émotions ressenties pendant et après le rêve : ${emotions.trim()}. Intègre profondément ces émotions dans ton interprétation — elles sont la clé vibratoire du message.`
    : "";

  const prompt = `${systemInstruction}

${prenomPhrase}
${datePhrase}

Rêve à interpréter :
"${dream.trim()}"

${dreamTypePhrase}
${recurrentPhrase}
${emotionsPhrase}

Compose une interprétation onirique d'environ 500 à 700 mots. Explore dans ta prose les éléments suivants, de façon organique et fluide, sans jamais les présenter comme une liste :

Les principaux symboles du rêve et leur signification jungienne profonde. L'atmosphère émotionnelle du rêve et ce qu'elle révèle sur l'état de l'inconscient. Les archétypes présents — Ombre, Anima ou Animus, Soi, Persona, Grande Mère, Héros, Trickster ou autres selon le contenu du rêve. Le message essentiel que ce rêve porte pour la situation actuelle de la personne. Un conseil pratique et concret pour intégrer ce message dans la vie éveillée.

Conclus avec une note de bienveillance et rappelle discrètement en toute fin que cette interprétation est offerte à titre d'inspiration personnelle et de divertissement, non de conseil médical ou psychologique.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(
          new TextEncoder().encode(
            "Les songes se dérobent ce soir... Les voiles du sommeil restent fermés. Veuillez réessayer."
          )
        );
        if (process.env.NODE_ENV === "development") console.error("[reves/route]", err);
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
