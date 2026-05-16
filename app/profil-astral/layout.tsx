import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Astral & Thème Natal Complet Gratuit | Madame Céleste",
  description:
    "Calculez votre thème natal complet : positions planétaires, maisons astrologiques, ascendant, Milieu du Ciel et aspects. Interprétation approfondie par l'IA.",
  keywords: [
    "thème natal gratuit",
    "profil astral",
    "calcul ascendant",
    "carte du ciel",
    "thème astrologique",
    "planètes signes maisons",
  ],
  openGraph: {
    title: "Profil Astral & Thème Natal Complet Gratuit | Madame Céleste",
    description:
      "Calculez votre thème natal complet : positions planétaires, maisons astrologiques, ascendant, Milieu du Ciel et aspects. Interprétation approfondie par l'IA.",
  },
  alternates: { canonical: "/profil-astral" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
