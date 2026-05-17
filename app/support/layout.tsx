import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Madame Céleste",
  description: "Contactez l'équipe Madame Céleste pour toute question.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
