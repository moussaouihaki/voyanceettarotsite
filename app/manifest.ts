import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Céleste Voyance — Arts Divinatoires",
    short_name: "Céleste",
    description: "Tarot, astrologie, runes, numérologie — guidance personnalisée par IA",
    start_url: "/",
    display: "standalone",
    background_color: "#07040d",
    theme_color: "#07040d",
    orientation: "portrait-primary",
    categories: ["lifestyle", "entertainment"],
    lang: "fr",
    icons: [
      { src: "/logo-celeste.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcuts: [
      { name: "Tirage Tarot", short_name: "Tarot", url: "/tirage", description: "Tirer les cartes" },
      { name: "Carte du Jour", short_name: "Carte du Jour", url: "/carte-du-jour", description: "Guidance du jour" },
      { name: "Mes Astres", short_name: "Mes Astres", url: "/mes-astres", description: "Mon ciel natal" },
    ],
  };
}
