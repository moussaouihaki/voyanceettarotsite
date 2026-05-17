import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirage Oui ou Non — Réponse Tarot Immédiate | Madame Céleste",
  description:
    "Posez votre question et recevez une réponse Oui ou Non par les cartes de tarot. Tirage gratuit et immédiat par Madame Céleste.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
