import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirage de Tarot en Ligne — 55+ Tirages | Madame Céleste",
  description:
    "Plus de 55 tirages de tarot disponibles — Croix Celtique, tirage amour, professionnel, 3 cartes, année complète. Chaque tirage interprété par Madame Céleste, notre IA divinatoire personnalisée.",
  keywords: [
    "tirage tarot en ligne",
    "tirage tarot gratuit",
    "tarot amour",
    "croix celtique tarot",
    "oracle tarot",
    "tirage en ligne",
    "tarot rider waite",
  ],
  openGraph: {
    title: "Tirage de Tarot en Ligne — 55+ Tirages | Madame Céleste",
    description:
      "Plus de 55 tirages de tarot disponibles — Croix Celtique, tirage amour, professionnel, 3 cartes, année complète. Chaque tirage interprété par Madame Céleste, notre IA divinatoire personnalisée.",
  },
  alternates: { canonical: "/tirage" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
