import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendule Virtuel — Divination par le Pendule | Madame Céleste",
  description:
    "Utilisez le pendule virtuel pour obtenir une réponse Oui ou Non. Divination par le pendule en ligne, gratuite et immédiate.",
  keywords: ["pendule virtuel", "pendule divination en ligne", "pendule oui non", "radiesthésie en ligne", "pendule gratuit"],
  openGraph: {
    title: "Pendule Virtuel — Divination par le Pendule | Madame Céleste",
    description: "Utilisez le pendule virtuel pour obtenir une réponse Oui ou Non. Divination par le pendule en ligne, gratuite et immédiate.",
  },
  alternates: { canonical: "/pendule" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
