import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendrier Astral 2026 — Éclipses, Rétrogrades & Pleines Lunes | Madame Céleste",
  description: "Suivez tous les événements astrologiques 2026 : Mercure rétrograde, éclipses solaires et lunaires, pleines lunes et nouvelles lunes. Rituels et conseils pour chaque événement.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
