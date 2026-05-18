import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes Astres — Ciel Personnel & Transits | Madame Céleste",
  description:
    "Votre ciel personnel en temps réel. Suivez les transits planétaires qui influencent votre vie maintenant — guidance personnalisée basée sur votre thème natal complet.",
  keywords: [
    "transits planétaires",
    "ciel personnel astrologie",
    "astrologie personnalisée",
    "influences planétaires",
  ],
  openGraph: {
    title: "Mes Astres — Ciel Personnel & Transits | Madame Céleste",
    description:
      "Votre ciel personnel en temps réel. Suivez les transits planétaires qui influencent votre vie maintenant — guidance personnalisée basée sur votre thème natal complet.",
  },
  alternates: { canonical: "/mes-astres" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
