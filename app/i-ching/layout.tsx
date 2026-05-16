import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "I-Ching en Ligne — Oracle des 64 Hexagrammes | Madame Céleste",
  description:
    "Consultez le I-Ching avec la méthode authentique des 3 pièces. 64 hexagrammes, lignes changeantes et hexagramme de transformation selon la sagesse taoïste.",
  keywords: [
    "I-Ching en ligne",
    "oracle I-Ching",
    "64 hexagrammes",
    "livre des mutations",
    "yi king",
    "taoïsme divination",
    "tirage I-Ching gratuit",
  ],
  openGraph: {
    title: "I-Ching en Ligne — Oracle des 64 Hexagrammes | Madame Céleste",
    description:
      "Consultez le I-Ching avec la méthode authentique des 3 pièces. 64 hexagrammes, lignes changeantes et hexagramme de transformation selon la sagesse taoïste.",
  },
  alternates: { canonical: "/i-ching" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
