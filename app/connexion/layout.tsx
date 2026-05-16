import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | Madame Céleste",
  description: "Connectez-vous à votre espace personnel Madame Céleste.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
