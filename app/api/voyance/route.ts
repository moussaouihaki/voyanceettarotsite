import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MADAME_CELESTE_SYSTEM } from "@/lib/gemini";
import { getSunSign } from "@/lib/astrology";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UserProfile {
  prenom?: string;
  dateNaissance?: string;
  heureNaissance?: string;
  villeNaissance?: string;
  subscription?: string;
}

export async function POST(req: NextRequest) {
  let body: { messages?: ChatMessage[]; profile?: UserProfile };
  try {
    body = await req.json();
  } catch {
    return new Response("Requête invalide", { status: 400 });
  }

  const { messages, profile } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Messages requis", { status: 400 });
  }
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== "user" || !lastMessage.content?.trim()) {
    return new Response("Dernier message invalide", { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return new Response("Clé API manquante", { status: 500 });

  // Build personalized system prompt with user profile
  let personalContext = "";
  if (profile?.prenom) {
    let sunSign = "";
    if (profile.dateNaissance) {
      try {
        sunSign = getSunSign(profile.dateNaissance).name;
      } catch {}
    }

    const birthParts: string[] = [];
    if (profile.dateNaissance) birthParts.push(`née le ${profile.dateNaissance}`);
    if (profile.heureNaissance) birthParts.push(`à ${profile.heureNaissance}`);
    if (profile.villeNaissance) birthParts.push(`à ${profile.villeNaissance}`);
    const birthDesc = birthParts.length > 0 ? `, ${birthParts.join(" ")}` : "";
    const sunDesc = sunSign ? `, signe solaire ${sunSign}` : "";

    personalContext = `\n\nTu parles avec ${profile.prenom}${birthDesc}${sunDesc}. Appelle-la/le toujours par son prénom ${profile.prenom}.`;
  } else {
    personalContext = "\n\nTu parles avec un(e) visiteur(se) anonyme. Sois chaleureux(se) et accueillant(e), même sans connaître son prénom.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: MADAME_CELESTE_SYSTEM + personalContext,
  });

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(lastMessage.content);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.enqueue(new TextEncoder().encode("Les étoiles sont voilées... Réessayez dans quelques instants."));
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
