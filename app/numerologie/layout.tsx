import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numérologie — Chemin de Vie & Profil Complet | Madame Céleste",
  description:
    "Calculez votre chemin de vie, nombre d'expression, d'âme et vos défis karmiques. Profil numérologique complet basé sur votre prénom et date de naissance.",
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
      "Calculez votre chemin de vie, nombre d'expression, d'âme et vos défis karmiques. Profil numérologique complet basé sur votre prénom et date de naissance.",
  },
  alternates: { canonical: "/numerologie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
