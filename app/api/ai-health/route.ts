import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(_req: NextRequest) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: "GOOGLE_API_KEY manquante dans les variables d'environnement" }, { status: 503 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Réponds juste: OK");
    const text = result.response.text();
    return Response.json({ ok: true, response: text.slice(0, 20) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg.includes("API_KEY_INVALID") || msg.includes("API key") ? 401
      : msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED") ? 429
      : msg.includes("not found") || msg.includes("MODEL") ? 404
      : 500;
    return Response.json({ ok: false, error: msg.slice(0, 200) }, { status });
  }
}
