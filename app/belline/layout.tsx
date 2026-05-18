import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oracle de Belline — 53 Cartes Planétaires | Madame Céleste",
  description:
    "L'Oracle de Belline — 53 cartes planétaires de la tradition ésotérique française. Tirages complets avec interprétation IA des influences planétaires et destinées révélées par ce grand oracle.",
  keywords: [
    "oracle belline",
    "tirage belline",
    "oracle planétaire français",
    "belline cartomancie",
    "53 cartes belline",
    "oracle 19ème siècle",
  ],
  openGraph: {
    title: "Oracle de Belline — 53 Cartes Planétaires | Madame Céleste",
    description:
      "Tirage Oracle de Belline avec les 53 cartes et leurs attributions planétaires. Oracle français du XIXe siècle pour révéler les influences célestes sur votre destin.",
  },
  alternates: { canonical: "/belline" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
