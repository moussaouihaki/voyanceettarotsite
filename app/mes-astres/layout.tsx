import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes Astres — Ciel Personnel & Transits | Madame Céleste",
  description:
    "Découvrez votre ciel personnel avec les transits planétaires en cours et leurs influences sur votre vie. Guidance astrologique quotidienne et personnalisée.",
  keywords: [
    "transits planétaires",
    "ciel personnel astrologie",
    "astrologie personnalisée",
    "influences planétaires",
  ],
  openGraph: {
    title: "Mes Astres — Ciel Personnel & Transits | Madame Céleste",
    description:
      "Découvrez votre ciel personnel avec les transits planétaires en cours et leurs influences sur votre vie. Guidance astrologique quotidienne et personnalisée.",
  },
  alternates: { canonical: "/mes-astres" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
