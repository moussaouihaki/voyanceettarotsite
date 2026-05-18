import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Synastrie Amoureuse — Compatibilité Astrologique | Madame Céleste",
  description:
    "Découvrez la compatibilité astrologique entre deux personnes. Analyse complète de synastrie — aspects planétaires, points de tension et d'harmonie, potentiel amoureux et karmique.",
  keywords: [
    "synastrie astrologique",
    "compatibilité amoureuse astrologie",
    "compatibilité signes",
    "synastrie gratuite",
    "carte synastrie",
  ],
  openGraph: {
    title: "Synastrie Amoureuse — Compatibilité Astrologique | Madame Céleste",
    description:
      "Découvrez la compatibilité astrologique entre deux personnes. Analyse complète de synastrie — aspects planétaires, points de tension et d'harmonie, potentiel amoureux et karmique.",
  },
  alternates: { canonical: "/synastrie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
