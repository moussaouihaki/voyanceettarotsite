import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Synastrie Amoureuse — Compatibilité Astrologique | Madame Céleste",
  description:
    "Comparez deux thèmes nataux pour révéler votre compatibilité amoureuse. Analyse synastrie complète : aspects interplanétaires, Vénus, Mars et connexions karmiques.",
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
      "Comparez deux thèmes nataux pour révéler votre compatibilité amoureuse. Analyse synastrie complète : aspects interplanétaires, Vénus, Mars et connexions karmiques.",
  },
  alternates: { canonical: "/synastrie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
