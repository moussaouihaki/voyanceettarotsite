import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lithothérapie — 30 Cristaux & Pierres de Guérison | Madame Céleste",
  description:
    "Découvrez les propriétés vibratoires de 30 cristaux et pierres précieuses. Guidance personnalisée pour choisir vos pierres de guérison, protection et éveil spirituel.",
  keywords: [
    "lithothérapie",
    "cristaux guérison",
    "pierres précieuses vertus",
    "amethyste quartz rose citrine",
    "pierres chakras",
    "cristaux thérapeutiques",
  ],
  openGraph: {
    title: "Lithothérapie — 30 Cristaux & Pierres de Guérison | Madame Céleste",
    description:
      "Découvrez les propriétés vibratoires de 30 cristaux et pierres précieuses. Guidance personnalisée pour choisir vos pierres de guérison, protection et éveil spirituel.",
  },
  alternates: { canonical: "/lithotherapie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
