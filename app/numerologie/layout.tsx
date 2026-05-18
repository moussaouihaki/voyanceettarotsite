import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numérologie — Chemin de Vie & Profil Complet | Madame Céleste",
  description:
    "Votre profil numérologique complet — chemin de vie, expression, âme, réalisation. Compatibilité numérique et prévisions de l'année personnelle. Décryptez le sens de votre vie par les nombres.",
  keywords: [
    "numérologie chemin de vie",
    "numérologie gratuite",
    "calcul numérologie",
    "nombre de vie",
    "numérologie prénom",
    "chemin de vie numérologie",
  ],
  openGraph: {
    title: "Numérologie — Chemin de Vie & Profil Complet | Madame Céleste",
    description:
      "Votre profil numérologique complet — chemin de vie, expression, âme, réalisation. Compatibilité numérique et prévisions de l'année personnelle. Décryptez le sens de votre vie par les nombres.",
  },
  alternates: { canonical: "/numerologie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
