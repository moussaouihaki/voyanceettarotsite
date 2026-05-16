import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte du Jour — Guidance Quotidienne par le Tarot | Madame Céleste",
  description:
    "Tirez votre carte du tarot du jour et recevez un message personnalisé de Madame Céleste. Un oracle quotidien unique pour guider chaque journée avec sagesse.",
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
      "Tirez votre carte du tarot du jour et recevez un message personnalisé de Madame Céleste. Un oracle quotidien unique pour guider chaque journée avec sagesse.",
  },
  alternates: { canonical: "/carte-du-jour" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
