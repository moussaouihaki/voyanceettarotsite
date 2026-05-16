import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bilan des Chakras — 7 Centres Énergétiques & Rééquilibrage | Madame Céleste",
  description:
    "Diagnostiquez l'état de vos 7 chakras et recevez un programme de rééquilibrage personnalisé. Méditation, lithothérapie et pratiques énergétiques recommandées par l'IA.",
  keywords: [
    "bilan chakras",
    "chakras rééquilibrage",
    "7 chakras",
    "énergie chakras",
    "chakra racine sacré plexus cœur gorge troisième œil couronne",
  ],
  openGraph: {
    title: "Bilan des Chakras — 7 Centres Énergétiques & Rééquilibrage | Madame Céleste",
    description:
      "Diagnostiquez l'état de vos 7 chakras et recevez un programme de rééquilibrage personnalisé. Méditation, lithothérapie et pratiques énergétiques recommandées par l'IA.",
  },
  alternates: { canonical: "/chakras" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
