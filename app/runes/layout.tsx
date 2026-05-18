import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirage de Runes Nordiques — Elder Futhark & Wyrd | Madame Céleste",
  description:
    "Consultez les 24 runes nordiques du Futhark Ancien. Tirages runiques avec interprétation IA — rune unique, tirage Nornes (passé/présent/futur), croix runique. Sagesse viking ancestrale.",
  keywords: [
    "tirage runes",
    "runes elder futhark",
    "oracle runes nordiques",
    "divination runes",
    "runes vikings",
    "rune wyrd",
    "tirage rune gratuit",
  ],
  openGraph: {
    title: "Tirage de Runes Nordiques — Elder Futhark & Wyrd | Madame Céleste",
    description:
      "Consultez les 24 runes nordiques du Futhark Ancien. Tirages runiques avec interprétation IA — rune unique, tirage Nornes (passé/présent/futur), croix runique. Sagesse viking ancestrale.",
  },
  alternates: { canonical: "/runes" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
