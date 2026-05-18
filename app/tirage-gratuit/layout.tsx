import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirage Tarot Gratuit en Ligne — Interprétation IA | Madame Céleste",
  description:
    "Effectuez un tirage de tarot gratuit en ligne et recevez une interprétation personnalisée par Madame Céleste, notre intelligence artificielle divinatoire. Croix celtique, tirage amour, oui ou non, carte du jour — disponible 24h/24 sans inscription.",
  keywords: [
    "tirage tarot gratuit",
    "tarot gratuit en ligne",
    "tirage tarot en ligne",
    "tirage gratuit tarot",
    "tarot gratuit sans inscription",
    "tirage tarot gratuit immédiat",
    "tarot gratuit internet",
    "tirage tarot amour gratuit",
    "croix celtique gratuit",
    "tirage tarot oui non gratuit",
    "carte du jour tarot gratuit",
    "tirage 3 cartes tarot gratuit",
    "interprétation tarot IA",
    "Madame Céleste tarot",
  ],
  openGraph: {
    title: "Tirage Tarot Gratuit en Ligne — Interprétation IA | Madame Céleste",
    description:
      "Effectuez un tirage de tarot gratuit en ligne et recevez une interprétation personnalisée par Madame Céleste. Croix celtique, tirage amour, oui ou non — disponible 24h/24.",
    type: "website",
    locale: "fr_FR",
  },
  alternates: { canonical: "/tirage-gratuit" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Le tirage de tarot est-il vraiment gratuit ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Oui, plusieurs tirages sont disponibles gratuitement sans inscription : la Carte du Jour, le Tirage Oui/Non, et le Tirage 3 Cartes. L'interprétation IA est incluse." }
    },
    {
      "@type": "Question",
      "name": "Faut-il créer un compte pour faire un tirage ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Non, vous pouvez effectuer un tirage gratuit sans créer de compte. Un compte gratuit vous permet d'obtenir des lectures plus personnalisées basées sur votre profil astral." }
    },
    {
      "@type": "Question",
      "name": "Comment fonctionne l'interprétation par intelligence artificielle ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Madame Céleste est une IA formée aux symbolismes du tarot de Rider-Waite-Smith et du Tarot de Marseille. Elle analyse la combinaison de cartes tirées et génère une interprétation narrative en français, en tenant compte de votre question et de votre profil si disponible." }
    },
    {
      "@type": "Question",
      "name": "Quelle est la différence entre la version gratuite et l'abonnement ?",
      "acceptedAnswer": { "@type": "Answer", "text": "La version gratuite inclut les tirages de base avec un nombre limité de consultations par jour. L'abonnement Mystique (à partir de 9,90€/mois) débloque les 55+ tirages, les tirages illimités, les arts divinatoires (Runes, I-Ching, Oracle de Belline…) et une personnalisation poussée." }
    }
  ]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />
      {children}
    </>
  );
}
