import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horoscope du Jour 2026 — 12 Signes du Zodiaque | Madame Céleste",
  description:
    "Consultez votre horoscope du jour, de la semaine ou du mois pour les 12 signes du zodiaque. Prédictions astrologiques précises et personnalisées par intelligence artificielle.",
  keywords: [
    "horoscope du jour",
    "horoscope 2026",
    "horoscope gratuit",
    "astrologie signe",
    "bélier taureau gémeaux cancer lion vierge balance scorpion sagittaire capricorne verseau poissons",
  ],
  openGraph: {
    title: "Horoscope du Jour 2026 — 12 Signes du Zodiaque | Madame Céleste",
    description:
      "Consultez votre horoscope du jour, de la semaine ou du mois pour les 12 signes du zodiaque. Prédictions astrologiques précises et personnalisées par intelligence artificielle.",
  },
  alternates: { canonical: "/horoscope" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
