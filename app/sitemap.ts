import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://celestevoyance.com";
const now = new Date();

const PUBLIC_PAGES: Array<{ path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "",                    priority: 1.0, freq: "daily" },
  { path: "/tirage",             priority: 0.95, freq: "weekly" },
  { path: "/tirage-gratuit",    priority: 0.92, freq: "weekly" },
  { path: "/voyance",            priority: 0.90, freq: "weekly" },
  { path: "/carte-du-jour",      priority: 0.90, freq: "daily" },
  { path: "/horoscope",          priority: 0.90, freq: "daily" },
  { path: "/profil-astral",      priority: 0.85, freq: "weekly" },
  { path: "/tarifs",             priority: 0.85, freq: "monthly" },
  { path: "/runes",              priority: 0.80, freq: "weekly" },
  { path: "/i-ching",            priority: 0.80, freq: "weekly" },
  { path: "/lenormand",          priority: 0.80, freq: "weekly" },
  { path: "/ogham",              priority: 0.75, freq: "weekly" },
  { path: "/belline",            priority: 0.75, freq: "weekly" },
  { path: "/cartomancie",        priority: 0.75, freq: "weekly" },
  { path: "/chakras",            priority: 0.75, freq: "weekly" },
  { path: "/numerologie",        priority: 0.75, freq: "weekly" },
  { path: "/lithotherapie",      priority: 0.70, freq: "weekly" },
  { path: "/aura",               priority: 0.70, freq: "weekly" },
  { path: "/synastrie",          priority: 0.75, freq: "weekly" },
  { path: "/chiromancie",        priority: 0.70, freq: "weekly" },
  { path: "/reves",              priority: 0.70, freq: "weekly" },
  { path: "/sigil",              priority: 0.65, freq: "monthly" },
  { path: "/bibliomancie",       priority: 0.65, freq: "monthly" },
  { path: "/autel",              priority: 0.65, freq: "monthly" },
  { path: "/revolution-solaire", priority: 0.70, freq: "weekly" },
  { path: "/anges",              priority: 0.85, freq: "weekly" },
  { path: "/calendrier-astral",  priority: 0.85, freq: "daily" },
  { path: "/oui-non",            priority: 0.90, freq: "daily" },
  { path: "/pendule",            priority: 0.80, freq: "weekly" },
  { path: "/tasseomancie",       priority: 0.80, freq: "weekly" },
  { path: "/mes-astres",         priority: 0.75, freq: "weekly" },
  { path: "/support",             priority: 0.60, freq: "monthly" },
  { path: "/mentions-legales",   priority: 0.30, freq: "yearly" },
  { path: "/cgv",                priority: 0.30, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.map(({ path, priority, freq }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
