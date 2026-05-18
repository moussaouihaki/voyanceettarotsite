import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lithothérapie — 30 Cristaux & Pierres de Guérison | Madame Céleste",
  description:
    "30 pierres et cristaux en lithothérapie — améthyste, quartz rose, lapis-lazuli, citrine et plus. Tirages de cristaux avec interprétation vibratoire IA pour l'amour, la guérison et l'abondance.",
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
      "30 pierres et cristaux en lithothérapie — améthyste, quartz rose, lapis-lazuli, citrine et plus. Tirages de cristaux avec interprétation vibratoire IA pour l'amour, la guérison et l'abondance.",
  },
  alternates: { canonical: "/lithotherapie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
