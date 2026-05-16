import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirage de Tarot en Ligne — 55+ Tirages | Madame Céleste",
  description:
    "Choisissez parmi 55+ tirages de tarot : Croix Celtique, tirage amour, Shadow Work, pleine lune... Cartes Rider-Waite interprétées par l'IA pour une guidance personnalisée.",
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
      "Choisissez parmi 55+ tirages de tarot : Croix Celtique, tirage amour, Shadow Work, pleine lune... Cartes Rider-Waite interprétées par l'IA pour une guidance personnalisée.",
  },
  alternates: { canonical: "/tirage" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
