import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de Sigils — Magie du Chaos & Intentions | Madame Céleste",
  description:
    "Créez votre sigil personnalisé à partir d'une intention écrite. Magie du chaos inspirée d'Austin Osman Spare — transformez vos désirs en symboles magiques puissants.",
  keywords: [
    "générateur sigil",
    "sigil magie",
    "magie du chaos",
    "créer sigil intention",
    "symbole magique",
    "sigil austin spare",
    "serviteur sigil",
  ],
  openGraph: {
    title: "Générateur de Sigils — Magie du Chaos & Intentions | Madame Céleste",
    description:
      "Créez votre sigil personnalisé à partir d'une intention écrite. Magie du chaos inspirée d'Austin Osman Spare — transformez vos désirs en symboles magiques puissants.",
  },
  alternates: { canonical: "/sigil" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
