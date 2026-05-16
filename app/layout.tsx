import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import StarBackground from "@/components/StarBackground";
import Footer from "@/components/Footer";
import { UserProfileProvider } from "@/contexts/UserProfileContext";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://celestevoyance.com";

export const viewport: Viewport = {
  themeColor: "#07040d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/logo-celeste.svg", type: "image/svg+xml" },
    ],
    apple: "/logo-celeste.svg",
    shortcut: "/logo-celeste.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Céleste Voyance",
  },
  formatDetection: { telephone: false },
  title: {
    default: "Céleste Voyance — Arts Divinatoires Premium",
    template: "%s · Madame Céleste",
  },
  description: "Le sanctuaire numérique de la voyance et des arts divinatoires. Tarot, astrologie, numérologie, runes, I-Ching, chakras — éclairés par l'intelligence artificielle.",
  keywords: ["voyance", "tarot", "astrologie", "horoscope", "numérologie", "runes", "I-Ching", "chakras", "Céleste Voyance", "thème astral", "carte du jour", "tirage tarot"],
  authors: [{ name: "Céleste Voyance" }],
  creator: "Céleste Voyance",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Céleste Voyance",
    title: "Céleste Voyance — Arts Divinatoires Premium",
    description: "Plus de 55 tirages de tarot, profil astral complet, runes, I-Ching et bien plus. Votre guidance personnalisée par IA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Céleste Voyance — Arts Divinatoires Premium",
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
