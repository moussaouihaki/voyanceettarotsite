import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oracle Lenormand — Grand Tableau & 36 Cartes | Madame Céleste",
  description:
    "Tirage de l'Oracle Lenormand — 36 cartes, méthode traditionnelle française. Grand tableau, tirage 3 cartes, croix Lenormand. Interprétation IA selon la tradition classique.",
  keywords: [
    "oracle lenormand",
    "tirage lenormand",
    "grand tableau lenormand",
    "cartomancie lenormand",
    "36 cartes lenormand",
    "mlle lenormand",
  ],
  openGraph: {
    title: "Oracle Lenormand — Grand Tableau & 36 Cartes | Madame Céleste",
    description:
      "Tirage de l'Oracle Lenormand — 36 cartes, méthode traditionnelle française. Grand tableau, tirage 3 cartes, croix Lenormand. Interprétation IA selon la tradition classique.",
  },
  alternates: { canonical: "/lenormand" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
