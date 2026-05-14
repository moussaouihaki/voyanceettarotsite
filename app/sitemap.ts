import type { MetadataRoute } from "next";
import { BLOG_ARTICLES } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://voyanceettarotsite.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    "", "/tirage", "/carte-du-jour", "/voyance", "/horoscope", "/profil-astral",
    "/runes", "/i-ching", "/chakras", "/numerologie", "/synastrie",
    "/blog", "/tarifs", "/mon-profil", "/mentions-legales", "/cgv",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : path === "/tirage" || path === "/tarifs" ? 0.9 : 0.7,
  }));

  for (const a of BLOG_ARTICLES) {
    routes.push({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return routes;
}
