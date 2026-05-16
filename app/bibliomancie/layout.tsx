import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bibliomancie — Oracle des Textes Sacrés | Madame Céleste",
  description:
    "Consultez l'oracle de la bibliomancie : un passage de textes sacrés (Tao Te Ching, Rumi, Gibran, Marc Aurèle) est tiré pour vous révéler un message du destin.",
  keywords: [
    "bibliomancie",
    "oracle textes sacrés",
    "divination livres",
    "tao te ching oracle",
    "rumi sagesse",
    "message destin sagesse",
  ],
  openGraph: {
    title: "Bibliomancie — Oracle des Textes Sacrés | Madame Céleste",
    description:
      "Consultez l'oracle de la bibliomancie : un passage de textes sacrés (Tao Te Ching, Rumi, Gibran, Marc Aurèle) est tiré pour vous révéler un message du destin.",
  },
  alternates: { canonical: "/bibliomancie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
