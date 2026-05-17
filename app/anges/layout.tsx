import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oracle des Anges — Guidance Angélique Gratuite | Madame Céleste",
  description: "Tirez vos cartes d'anges gardiens et recevez un message divin personnalisé. Oracle des 44 anges avec guidance IA par Madame Céleste.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
