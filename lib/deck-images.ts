import { getTarotImage } from "@/lib/tarot-images";
import { getMarseilleImage } from "@/lib/tarot-marseille-images";

export type DeckType = "rws" | "marseille";

export function getCardImage(cardId: string, deck: DeckType = "rws"): string | null {
  if (deck === "marseille") return getMarseilleImage(cardId);
  return getTarotImage(cardId);
}

export function getDeckLabel(deck: DeckType): string {
  return deck === "marseille" ? "Tarot de Marseille" : "Rider-Waite-Smith";
}
