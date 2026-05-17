import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement confirmé | Madame Céleste",
  description: "Votre abonnement Madame Céleste a été activé avec succès.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
