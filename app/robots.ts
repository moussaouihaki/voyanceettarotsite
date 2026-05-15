import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://celestevoyance.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/mon-profil"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
