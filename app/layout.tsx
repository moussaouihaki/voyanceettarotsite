import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import StarBackground from "@/components/StarBackground";

export const metadata: Metadata = {
  title: "Madame Céleste — Voyance & Tarot IA",
  description: "Consultez les astres et le tarot avec l'intelligence artificielle. Tirages de cartes, voyance et lectures mystiques.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col relative">
        <StarBackground />
        <Navigation />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <footer className="relative z-10 text-center py-4 text-xs text-purple-400/50 border-t border-purple-900/20">
          ✦ Madame Céleste — À des fins de divertissement uniquement ✦
        </footer>
      </body>
    </html>
  );
}
