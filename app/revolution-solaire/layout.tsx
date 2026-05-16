import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Révolution Solaire — Prévision Astrologique Annuelle | Madame Céleste",
  description:
    "Calculez votre révolution solaire et obtenez une prévision astrologique complète pour votre année personnelle. Thème de retour solaire interprété par l'IA.",
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
      "Calculez votre révolution solaire et obtenez une prévision astrologique complète pour votre année personnelle. Thème de retour solaire interprété par l'IA.",
  },
  alternates: { canonical: "/revolution-solaire" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
