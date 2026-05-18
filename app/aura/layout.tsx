import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lecture d'Aura — Couleurs & Énergie Vibratoire | Madame Céleste",
  description:
    "Lecture de votre aura — découvrez la couleur dominante de votre champ énergétique, sa signification spirituelle et les conseils pour renforcer votre rayonnement. Analyse IA personnalisée.",
  keywords: [
    "lecture aura",
    "couleur aura signification",
    "aura spirituelle",
    "champ aurique",
    "énergie subtile aura",
    "voir son aura",
  ],
  openGraph: {
    title: "Lecture d'Aura — Couleurs & Énergie Vibratoire | Madame Céleste",
    description:
      "Découvrez les couleurs de votre aura et leur signification spirituelle. Analyse de votre champ énergétique subtil pour comprendre votre vibration et potentiel.",
  },
  alternates: { canonical: "/aura" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
