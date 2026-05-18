import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interprétation des Rêves — Oniromancie Jungienne | Madame Céleste",
  description:
    "Interprétation de vos rêves par Madame Céleste — symbolisme jungien, archétypes, messages de l'inconscient. Analysez vos rêves récurrents, prémonitoires ou symboliques en quelques instants.",
  keywords: [
    "interprétation rêves",
    "analyse rêves symbolique",
    "oniromancie",
    "rêves signification",
    "symboles rêves jung",
    "rêves récurrents signification",
  ],
  openGraph: {
    title: "Interprétation des Rêves — Oniromancie Jungienne | Madame Céleste",
    description:
      "Décryptez la signification de vos rêves avec la symbolique jungienne et l'oniromancie. Analyse approfondie de vos rêves récurrents pour comprendre votre inconscient.",
  },
  alternates: { canonical: "/reves" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
