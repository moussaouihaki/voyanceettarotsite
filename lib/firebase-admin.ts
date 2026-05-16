import { NextRequest } from "next/server";

export interface AuthResult {
  uid: string;
  email?: string;
}

/**
 * Verify a Firebase ID token using the Firebase Auth REST API.
 * No service account key required — uses the public Web API key.
 */
export async function verifyIdToken(req: NextRequest): Promise<AuthResult | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const idToken = authHeader.slice(7);
  // Firebase Web API key — public by design (visible in client bundle)
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyDIdkRiuvMHqfBehDbmTiOVBMWB2SJg5q8";

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const user = data?.users?.[0];
    if (!user) return null;

    return { uid: user.localId, email: user.email };
  } catch {
    return null;
  }
}

/**
 * Standard 401 response for unauthenticated requests.
 */
export function unauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({ error: "Authentification requise. Veuillez vous connecter." }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}
