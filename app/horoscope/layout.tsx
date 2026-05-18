import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horoscope du Jour 2026 — 12 Signes du Zodiaque | Madame Céleste",
  description:
    "Votre horoscope personnalisé du jour, de la semaine et du mois — rédigé par Madame Céleste selon votre signe solaire. Amour, travail, santé, finances : chaque domaine décrypté.",
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
      "Votre horoscope personnalisé du jour, de la semaine et du mois — rédigé par Madame Céleste selon votre signe solaire. Amour, travail, santé, finances : chaque domaine décrypté.",
  },
  alternates: { canonical: "/horoscope" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
