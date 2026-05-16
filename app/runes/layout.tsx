import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirage de Runes Nordiques — Elder Futhark & Wyrd | Madame Céleste",
  description:
    "Consultez l'oracle des runes Elder Futhark. 24 runes + Wyrd, tirages authentiques avec interprétation mythologique nordique, inversées et lignes de destin.",
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
      "Consultez l'oracle des runes Elder Futhark. 24 runes + Wyrd, tirages authentiques avec interprétation mythologique nordique, inversées et lignes de destin.",
  },
  alternates: { canonical: "/runes" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
