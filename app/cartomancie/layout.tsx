import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartomancie Traditionnelle — Jeu de 32 Cartes | Madame Céleste",
  description:
    "Tirage de cartomancie à la française avec le jeu de 32 cartes. Art divinatoire populaire depuis le XIXe siècle — cœur, carreau, trèfle et pique révèlent votre avenir.",
  keywords: [
    "cartomancie 32 cartes",
    "tirage cartomancie",
    "divination cartes françaises",
    "cartomancie traditionnelle",
    "jeu de cartes divination",
  ],
  openGraph: {
    title: "Cartomancie Traditionnelle — Jeu de 32 Cartes | Madame Céleste",
    description:
      "Tirage de cartomancie à la française avec le jeu de 32 cartes. Art divinatoire populaire depuis le XIXe siècle — cœur, carreau, trèfle et pique révèlent votre avenir.",
  },
  alternates: { canonical: "/cartomancie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
