import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendrier Astral 2026 — Éclipses, Rétrogrades & Pleines Lunes | Madame Céleste",
  description: "Suivez tous les événements astrologiques 2026 : Mercure rétrograde, éclipses solaires et lunaires, pleines lunes et nouvelles lunes. Rituels et conseils pour chaque événement.",
  keywords: ["calendrier astral 2026", "mercure rétrograde 2026", "éclipse solaire 2026", "pleine lune 2026", "nouvelle lune 2026", "événements astrologiques"],
  openGraph: {
    title: "Calendrier Astral 2026 — Éclipses, Rétrogrades & Pleines Lunes | Madame Céleste",
    description: "Suivez tous les événements astrologiques 2026 : Mercure rétrograde, éclipses solaires et lunaires, pleines lunes et nouvelles lunes.",
  },
  alternates: { canonical: "/calendrier-astral" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
