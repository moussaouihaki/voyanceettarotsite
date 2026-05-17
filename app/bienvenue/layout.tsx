import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://celestevoyance.com";

export const metadata: Metadata = {
  title: "Bienvenue dans le Sanctuaire — Céleste Voyance",
  description: "Découvrez Madame Céleste : tarot, astrologie, numérologie et arts divinatoires éclairés par l'IA. Commencez gratuitement dès aujourd'hui.",
  keywords: [
    "voyance gratuite",
    "tarot gratuit",
    "horoscope personnalisé",
    "thème astral gratuit",
    "carte du jour tarot",
    "Madame Céleste",
    "arts divinatoires IA",
    "astrologie en ligne",
    "numérologie gratuite",
  ],
  alternates: { canonical: `${SITE_URL}/bienvenue` },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: `${SITE_URL}/bienvenue`,
    siteName: "Céleste Voyance",
    title: "Bienvenue dans le Sanctuaire — Céleste Voyance",
    description: "Tarot, astrologie, numérologie et arts divinatoires éclairés par l'IA. Rejoignez le sanctuaire gratuit de Madame Céleste.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
