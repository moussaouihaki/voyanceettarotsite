import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autel Virtuel — Bougies, Intentions & Rituels Numériques | Madame Céleste",
  description:
    "Créez votre autel virtuel avec des bougies de couleurs et posez vos intentions. Rituels numériques pour manifester, guérir, attirer l'amour ou se protéger.",
  keywords: [
    "autel virtuel",
    "bougies rituels couleurs",
    "intention spirituelle",
    "rituel numérique",
    "magie bougies",
    "manifester intention",
  ],
  openGraph: {
    title: "Autel Virtuel — Bougies, Intentions & Rituels Numériques | Madame Céleste",
    description:
      "Créez votre autel virtuel avec des bougies de couleurs et posez vos intentions. Rituels numériques pour manifester, guérir, attirer l'amour ou se protéger.",
  },
  alternates: { canonical: "/autel" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
