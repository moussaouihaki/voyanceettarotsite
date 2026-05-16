import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Journal Mystique | Madame Céleste",
  description: "Retrouvez l'historique de tous vos tirages, lectures et consultations. Annotez, méditez et suivez votre voyage spirituel.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
