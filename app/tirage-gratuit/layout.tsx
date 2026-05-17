import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirage Tarot Gratuit en Ligne — Interprétation IA | Madame Céleste",
  description:
    "Effectuez un tirage de tarot gratuit en ligne et recevez une interprétation personnalisée par Madame Céleste, notre intelligence artificielle divinatoire. Croix celtique, tirage amour, oui ou non, carte du jour — disponible 24h/24 sans inscription.",
  keywords: [
    "tirage tarot gratuit",
    "tarot gratuit en ligne",
    "tirage tarot en ligne",
    "tirage gratuit tarot",
    "tarot gratuit sans inscription",
    "tirage tarot gratuit immédiat",
    "tarot gratuit internet",
    "tirage tarot amour gratuit",
    "croix celtique gratuit",
    "tirage tarot oui non gratuit",
    "carte du jour tarot gratuit",
    "tirage 3 cartes tarot gratuit",
    "interprétation tarot IA",
    "Madame Céleste tarot",
  ],
  openGraph: {
    title: "Tirage Tarot Gratuit en Ligne — Interprétation IA | Madame Céleste",
    description:
      "Effectuez un tirage de tarot gratuit en ligne et recevez une interprétation personnalisée par Madame Céleste. Croix celtique, tirage amour, oui ou non — disponible 24h/24.",
    type: "website",
    locale: "fr_FR",
  },
  alternates: { canonical: "/tirage-gratuit" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
