import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import StarBackground from "@/components/StarBackground";
import Footer from "@/components/Footer";
import { UserProfileProvider } from "@/contexts/UserProfileContext";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://voyanceettarotsite.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Madame Céleste — Voyance & Arts Divinatoires Premium",
    template: "%s · Madame Céleste",
  },
  description: "Le sanctuaire numérique de la voyance et des arts divinatoires. Tarot, astrologie, numérologie, runes, I-Ching, chakras — éclairés par l'intelligence artificielle.",
  keywords: ["voyance", "tarot", "astrologie", "horoscope", "numérologie", "runes", "I-Ching", "chakras", "Madame Céleste", "thème astral", "carte du jour", "tirage tarot"],
  authors: [{ name: "Madame Céleste" }],
  creator: "Madame Céleste",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Madame Céleste",
    title: "Madame Céleste — Voyance & Arts Divinatoires Premium",
    description: "Plus de 55 tirages de tarot, profil astral complet, runes, I-Ching et bien plus. Votre guidance personnalisée par IA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madame Céleste — Voyance & Arts Divinatoires Premium",
    description: "Plus de 55 tirages de tarot, profil astral complet, runes, I-Ching. Guidance IA personnalisée.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col relative">
        <UserProfileProvider>
          <StarBackground />
          <Navigation />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </UserProfileProvider>
      </body>
    </html>
  );
}
