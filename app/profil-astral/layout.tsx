import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Astral & Thème Natal Complet Gratuit | Madame Céleste",
  description:
    "Votre thème natal complet calculé en quelques secondes — Soleil, Lune, Ascendant, Mercure, Vénus, Mars et toutes vos planètes. Interprétation IA approfondie de votre carte du ciel.",
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
      "Votre thème natal complet calculé en quelques secondes — Soleil, Lune, Ascendant, Mercure, Vénus, Mars et toutes vos planètes. Interprétation IA approfondie de votre carte du ciel.",
  },
  alternates: { canonical: "/profil-astral" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
