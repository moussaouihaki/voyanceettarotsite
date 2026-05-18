import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oracle Ogham Celtique — 25 Staves Druidiques | Madame Céleste",
  description:
    "Les 25 feadha de l'Ogham Celtique, alphabet druidique irlandais. Guidance de la forêt sacrée — tirage unique, tirage des 3 mondes, croix celtique oghamique.",
  keywords: [
    "oracle ogham",
    "runes ogham",
    "alphabet ogham celtique",
    "divination druidique",
    "ogham irlandais",
    "staves ogham",
    "druide oracle",
  ],
  openGraph: {
    title: "Oracle Ogham Celtique — 25 Staves Druidiques | Madame Céleste",
    description:
      "Les 25 feadha de l'Ogham Celtique, alphabet druidique irlandais. Guidance de la forêt sacrée — tirage unique, tirage des 3 mondes, croix celtique oghamique.",
  },
  alternates: { canonical: "/ogham" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
