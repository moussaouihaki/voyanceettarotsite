import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oracle Ogham Celtique — 25 Staves Druidiques | Madame Céleste",
  description:
    "Consultez l'oracle celtique Ogham, l'alphabet sacré des druides irlandais. 25 feadha associés aux arbres sacrés pour une guidance de tradition druidique.",
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
      "Consultez l'oracle celtique Ogham, l'alphabet sacré des druides irlandais. 25 feadha associés aux arbres sacrés pour une guidance de tradition druidique.",
  },
  alternates: { canonical: "/ogham" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
