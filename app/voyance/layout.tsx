import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voyance en Ligne Gratuite — Chat avec Madame Céleste",
  description:
    "Consultez Madame Céleste en voyance libre 24h/24 — posez toutes vos questions sur l'amour, le travail, l'avenir. Notre IA divinatoire vous répond avec intuition et bienveillance.",
  keywords: [
    "voyance en ligne gratuite",
    "voyance par chat",
    "voyance personnalisée",
    "madame céleste voyance",
    "consultation voyance",
    "voyance amour",
  ],
  openGraph: {
    title: "Voyance en Ligne Gratuite — Chat avec Madame Céleste",
    description:
      "Consultez Madame Céleste en voyance libre 24h/24 — posez toutes vos questions sur l'amour, le travail, l'avenir. Notre IA divinatoire vous répond avec intuition et bienveillance.",
  },
  alternates: { canonical: "/voyance" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
