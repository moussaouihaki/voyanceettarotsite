import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasséomancie — Lecture des Feuilles de Thé par IA | Madame Céleste",
  description:
    "Photographiez le fond de votre tasse de thé et recevez une lecture divinatoire par intelligence artificielle. Tasséomancie ancestrale modernisée par Madame Céleste.",
  keywords: [
    "tasséomancie",
    "lecture feuilles de thé",
    "divination thé",
    "tasseomancie gratuite",
    "lecture tasse thé IA",
    "madame céleste tasséomancie",
  ],
  openGraph: {
    title: "Tasséomancie — Lecture des Feuilles de Thé par IA | Madame Céleste",
    description:
      "Photographiez le fond de votre tasse de thé et recevez une lecture divinatoire par intelligence artificielle. Tasséomancie ancestrale modernisée par Madame Céleste.",
  },
  alternates: { canonical: "/tasseomancie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
