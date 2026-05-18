import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendrier Astral 2026 — Éclipses, Rétrogrades & Pleines Lunes | Madame Céleste",
  description: "Le calendrier lunaire et planétaire complet — nouvelles lunes, pleines lunes, rétrogrades, entrées planétaires. Anticipez les grandes énergies du ciel pour chaque mois.",
  keywords: ["calendrier astral 2026", "mercure rétrograde 2026", "éclipse solaire 2026", "pleine lune 2026", "nouvelle lune 2026", "événements astrologiques"],
  openGraph: {
    title: "Calendrier Astral 2026 — Éclipses, Rétrogrades & Pleines Lunes | Madame Céleste",
    description: "Le calendrier lunaire et planétaire complet — nouvelles lunes, pleines lunes, rétrogrades, entrées planétaires. Anticipez les grandes énergies du ciel pour chaque mois.",
  },
  alternates: { canonical: "/calendrier-astral" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
