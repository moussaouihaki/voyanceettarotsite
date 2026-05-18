import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chiromancie — Lecture des Lignes de la Main par IA | Madame Céleste",
  description:
    "La chiromancie virtuelle — lecture des lignes de votre main par Madame Céleste. Ligne de vie, ligne de cœur, ligne de tête, ligne du destin. Révélations sur votre personnalité et votre avenir.",
  keywords: [
    "chiromancie",
    "lignes de la main",
    "lecture main destin",
    "palmistrie",
    "ligne de vie cœur tête",
    "chiromancie gratuite",
  ],
  openGraph: {
    title: "Chiromancie — Lecture des Lignes de la Main par IA | Madame Céleste",
    description:
      "Photographiez votre paume et laissez Madame Céleste analyser vos lignes de vie, de cœur et de tête. Chiromancie authentique assistée par intelligence artificielle.",
  },
  alternates: { canonical: "/chiromancie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
