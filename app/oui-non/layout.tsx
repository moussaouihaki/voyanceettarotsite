import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirage Oui ou Non — Réponse Tarot Immédiate | Madame Céleste",
  description:
    "Posez votre question et recevez une réponse Oui ou Non par les cartes de tarot. Tirage gratuit et immédiat par Madame Céleste.",
  keywords: ["tirage oui non tarot", "tarot oui ou non gratuit", "réponse tarot immédiate", "oracle oui non", "divination oui non"],
  openGraph: {
    title: "Tirage Oui ou Non — Réponse Tarot Immédiate | Madame Céleste",
    description: "Posez votre question et recevez une réponse Oui ou Non par les cartes de tarot. Tirage gratuit et immédiat par Madame Céleste.",
  },
  alternates: { canonical: "/oui-non" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
