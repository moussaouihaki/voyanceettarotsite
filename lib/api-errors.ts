/**
 * Checks an API response and throws a typed error for non-OK statuses.
 * Use in every authFetch call so catch blocks can distinguish 401/429/5xx.
 */
export function checkResponse(res: Response): void {
  if (res.ok) return;
  if (res.status === 401) throw new Error("auth");
  if (res.status === 429) throw new Error("limit");
  throw new Error("server");
}

/**
 * Returns a user-friendly French error message from a typed error.
 * @param err      - the caught error
 * @param fallback - the generic mystical fallback message for this feature
 */
export function apiErrorMessage(err: unknown, fallback: string): string {
  const msg = err instanceof Error ? err.message : "";
  if (msg === "auth") return "Votre session a expiré — reconnectez-vous pour continuer.";
  if (msg === "limit") return "Vous avez atteint la limite de consultations. Réessayez dans quelques instants.";
  return fallback;
}
