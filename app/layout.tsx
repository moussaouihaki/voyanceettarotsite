import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import StarBackground from "@/components/StarBackground";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollToTop from "@/components/ScrollToTop";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallBanner from "@/components/InstallBanner";
import { UserProfileProvider } from "@/contexts/UserProfileContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

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
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo-celeste.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/icon-192.png",
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
    <html lang="fr" className={`h-full ${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "url": SITE_URL,
                  "name": "Madame Céleste — Arts Divinatoires",
                  "description": "Sanctuaire numérique de voyance, tarot et arts divinatoires personnalisés par IA",
                  "inLanguage": "fr-FR",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/horoscope?q={search_term_string}` },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  "name": "Madame Céleste",
                  "url": SITE_URL,
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${SITE_URL}/logo-celeste.svg`
                  },
                  "sameAs": []
                }
              ]
            })
          }}
        />
        <UserProfileProvider>
          <ScrollToTop />
          <ServiceWorkerRegistration />
          <StarBackground />
          <Navigation />
          <main className="flex-1 relative z-10">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <Footer />
          <InstallBanner />
        </UserProfileProvider>
      </body>
    </html>
  );
}
