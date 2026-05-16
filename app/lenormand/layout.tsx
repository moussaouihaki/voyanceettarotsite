import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oracle Lenormand — Grand Tableau & 36 Cartes | Madame Céleste",
  description:
    "Tirage Oracle Lenormand authentique : 36 cartes de la tradition française, Grand Tableau, Croix Lenormand. La cartomancienne préférée de Napoléon vous guide.",
  keywords: [
    "oracle lenormand",
    "tirage lenormand",
    "grand tableau lenormand",
    "cartomancie lenormand",
    "36 cartes lenormand",
    "mlle lenormand",
  ],
  openGraph: {
    title: "Oracle Lenormand — Grand Tableau & 36 Cartes | Madame Céleste",
    description:
      "Tirage Oracle Lenormand authentique : 36 cartes de la tradition française, Grand Tableau, Croix Lenormand. La cartomancienne préférée de Napoléon vous guide.",
  },
  alternates: { canonical: "/lenormand" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
