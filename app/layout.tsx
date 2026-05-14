import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import StarBackground from "@/components/StarBackground";
import Footer from "@/components/Footer";
import { UserProfileProvider } from "@/contexts/UserProfileContext";

export const metadata: Metadata = {
  title: "Madame Céleste — Voyance & Arts Divinatoires Premium",
  description: "Le sanctuaire numérique de la voyance et des arts divinatoires. Tarot, astrologie, numérologie, runes, I-Ching, chakras — éclairés par l'intelligence artificielle.",
  keywords: ["voyance", "tarot", "astrologie", "horoscope", "numérologie", "runes", "I-Ching", "chakras", "Madame Céleste"],
  openGraph: {
    title: "Madame Céleste — Voyance & Arts Divinatoires Premium",
    description: "Plus de 55 tirages de tarot, profil astral complet, runes, I-Ching et bien plus. Votre guidance personnalisée par IA.",
    type: "website",
    locale: "fr_FR",
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
