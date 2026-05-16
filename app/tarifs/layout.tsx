import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abonnements & Tarifs — Découverte, Mystique & VIP | Madame Céleste",
  description: "Découvrez nos formules d'abonnement Découverte, Mystique et VIP. Accédez à tous les arts divinatoires, lectures illimitées et fonctionnalités premium de Madame Céleste.",
  keywords: ["abonnement voyance", "tarif tarot", "voyance premium", "abonnement mystic", "tarot vip", "abonnement arts divinatoires"],
  openGraph: {
    title: "Abonnements & Tarifs — Madame Céleste",
    description: "Formules Découverte, Mystique et VIP pour accéder à tous les arts divinatoires.",
  },
  alternates: { canonical: "/tarifs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
