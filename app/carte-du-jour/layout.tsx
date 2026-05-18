import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte du Jour — Guidance Quotidienne par le Tarot | Madame Céleste",
  description:
    "Votre carte de tarot du jour tirée chaque matin. Un message personnalisé de Madame Céleste pour guider votre journée — intention, conseil pratique et affirmation inclus.",
  keywords: [
    "carte du jour tarot",
    "tarot du jour",
    "oracle quotidien",
    "guidance quotidienne",
    "carte tarot journée",
  ],
  openGraph: {
    title: "Carte du Jour — Guidance Quotidienne par le Tarot | Madame Céleste",
    description:
      "Votre carte de tarot du jour tirée chaque matin. Un message personnalisé de Madame Céleste pour guider votre journée — intention, conseil pratique et affirmation inclus.",
  },
  alternates: { canonical: "/carte-du-jour" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
