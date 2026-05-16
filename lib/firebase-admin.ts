import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextRequest } from "next/server";

let adminApp: App;

function getAdminApp(): App {
  if (adminApp) return adminApp;
  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  } else {
    // Fallback: use GOOGLE_APPLICATION_CREDENTIALS or default credentials
    adminApp = initializeApp({ projectId: projectId ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
  }

  return adminApp;
}

export interface AuthResult {
  uid: string;
  email?: string;
  tier?: string;
}

/**
 * Verify a Firebase ID token from the Authorization header.
 * Returns the decoded token or null if invalid/missing.
 */
export async function verifyIdToken(req: NextRequest): Promise<AuthResult | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const idToken = authHeader.slice(7);
  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

/**
 * Get a 401 error response for unauthenticated requests.
 */
export function unauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({ error: "Authentification requise. Veuillez vous connecter." }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}
