import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "I-Ching en Ligne — Oracle des 64 Hexagrammes | Madame Céleste",
  description:
    "Consultez le I-Ching, le Livre des Transformations. 64 hexagrammes, sagesse chinoise millénaire — posez votre question et recevez la réponse de l'oracle ancestral.",
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
      "Consultez le I-Ching, le Livre des Transformations. 64 hexagrammes, sagesse chinoise millénaire — posez votre question et recevez la réponse de l'oracle ancestral.",
  },
  alternates: { canonical: "/i-ching" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
