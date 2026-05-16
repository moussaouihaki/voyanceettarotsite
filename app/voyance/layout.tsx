import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voyance en Ligne Gratuite — Chat avec Madame Céleste",
  description:
    "Posez vos questions à Madame Céleste et recevez une réponse de voyance personnalisée en temps réel. Amour, travail, avenir — une voyance authentique par IA.",
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
      "Posez vos questions à Madame Céleste et recevez une réponse de voyance personnalisée en temps réel. Amour, travail, avenir — une voyance authentique par IA.",
  },
  alternates: { canonical: "/voyance" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
