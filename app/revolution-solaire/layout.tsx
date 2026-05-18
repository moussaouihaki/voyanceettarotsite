import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Révolution Solaire — Prévision Astrologique Annuelle | Madame Céleste",
  description:
    "Votre thème de révolution solaire — l'astrologie de votre année anniversaire. Découvrez les thèmes majeurs, les opportunités et les défis qui vous attendent pour les 12 prochains mois.",
  keywords: [
    "révolution solaire",
    "retour solaire",
    "prévision astrologique annuelle",
    "thème solaire",
    "astrologie anniversaire",
  ],
  openGraph: {
    title: "Révolution Solaire — Prévision Astrologique Annuelle | Madame Céleste",
    description:
      "Votre thème de révolution solaire — l'astrologie de votre année anniversaire. Découvrez les thèmes majeurs, les opportunités et les défis qui vous attendent pour les 12 prochains mois.",
  },
  alternates: { canonical: "/revolution-solaire" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
