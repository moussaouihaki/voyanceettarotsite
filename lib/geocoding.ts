// Geocoding via Nominatim (OpenStreetMap) — no API key required.
// Returns lat/lon in decimal degrees and UTC offset for the location.

export interface GeoResult {
  lat: number;
  lon: number;
  displayName: string;
  country: string;
}

export interface TimezoneResult {
  offset: number; // UTC offset in hours (e.g. 1 for Europe/Paris in winter)
}

export async function geocodeCity(query: string): Promise<GeoResult | null> {
  if (!query.trim()) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "MadameCeleste/1.0 (astro@madame-celeste.fr)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data: Array<{
      lat: string; lon: string; display_name: string;
      address?: { country?: string };
    }> = await res.json();
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      displayName: data[0].display_name,
      country: data[0].address?.country || "",
    };
  } catch {
    return null;
  }
}

// Uses the timeapi.io public API to get UTC offset from lat/lon
export async function getTimezoneOffset(lat: number, lon: number, dateStr: string): Promise<number> {
  try {
    const url = `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return estimateOffsetFromLon(lon);
    const data: { currentUtcOffset?: { seconds?: number } } = await res.json();
    if (data.currentUtcOffset?.seconds !== undefined) {
      return data.currentUtcOffset.seconds / 3600;
    }
    return estimateOffsetFromLon(lon);
  } catch {
    return estimateOffsetFromLon(lon);
  }
}

// Rough fallback: approximate UTC offset from longitude (15° per hour)
function estimateOffsetFromLon(lon: number): number {
  return Math.round(lon / 15);
}
