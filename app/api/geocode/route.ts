import { type NextRequest } from "next/server";

export const maxDuration = 30;

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    country?: string;
  };
}

interface GeocodedPlace {
  displayName: string;
  shortName: string;
  country: string;
  lat: number;
  lon: number;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim() === "") {
    return Response.json([], {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=7&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "MadameCeleste/1.0 (astro@celestevoyance.com)",
        "Accept-Language": "fr",
      },
    });

    if (!res.ok) {
      return Response.json([], {
        headers: { "Cache-Control": "public, max-age=86400" },
      });
    }

    const data: NominatimResult[] = await res.json();

    const results: GeocodedPlace[] = data.map((item) => {
      const firstPart = item.display_name.split(",")[0].trim();
      const shortName =
        firstPart ||
        item.address.city ||
        item.address.town ||
        item.address.village ||
        item.address.county ||
        item.display_name;

      return {
        displayName: item.display_name,
        shortName: shortName,
        country: item.address.country ?? "",
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      };
    });

    return Response.json(results, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return Response.json([], {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }
}
