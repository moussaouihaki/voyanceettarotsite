import { auth } from "./firebase";

/**
 * Get Authorization headers with current user's Firebase ID token.
 * Returns empty object if not authenticated (routes will return 401).
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) return {};
  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

/**
 * Authenticated fetch — automatically adds Authorization header.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(options.headers as Record<string, string> ?? {}),
    },
  });
}
