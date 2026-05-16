// Moteur astrologique réel
// Calcule positions planétaires, ascendant, MC, maisons à partir de date/heure/lieu de naissance.
// Algorithmes basés sur Jean Meeus, "Astronomical Algorithms" (2e éd.) — précision suffisante pour l'astrologie.

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function rev(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

// ───────── 1. Julian Day ─────────
function julianDay(year: number, month: number, day: number, hourUT: number): number {
  if (month <= 2) { year -= 1; month += 12; }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1))
    + day + hourUT / 24 + b - 1524.5;
  return jd;
}

// ───────── 2. Position du Soleil (longitude écliptique géocentrique) ─────────
function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = rev(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = rev(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * DEG)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG)
    + 0.000289 * Math.sin(3 * M * DEG);
  return rev(L0 + C);
}

// ───────── 3. Position de la Lune (simplifiée) ─────────
function moonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const Lp = rev(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D  = rev(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
  const M  = rev(357.5291092 + 35999.0502909 * T);
  const Mp = rev(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
  const F  = rev(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);

  // Termes principaux (Meeus, table 47.A, abrégée — précision ~10')
  const sum =
      6.288774 * Math.sin(Mp * DEG)
    + 1.274027 * Math.sin((2 * D - Mp) * DEG)
    + 0.658314 * Math.sin(2 * D * DEG)
    + 0.213618 * Math.sin(2 * Mp * DEG)
    - 0.185116 * Math.sin(M * DEG)
    - 0.114332 * Math.sin(2 * F * DEG)
    + 0.058793 * Math.sin((2 * D - 2 * Mp) * DEG)
    + 0.057066 * Math.sin((2 * D - M - Mp) * DEG)
    + 0.053322 * Math.sin((2 * D + Mp) * DEG)
    + 0.045758 * Math.sin((2 * D - M) * DEG)
    - 0.040923 * Math.sin((M - Mp) * DEG)
    - 0.034720 * Math.sin(D * DEG)
    - 0.030383 * Math.sin((M + Mp) * DEG);

  return rev(Lp + sum);
}

// ───────── 4. Planètes intérieures et extérieures (éphémérides simplifiées) ─────────
// Formules dérivées de Paul Schlyter (http://stjarnhimlen.se/comp/ppcomp.html)
interface OrbitalElements {
  N: (d: number) => number;  // longitude of ascending node
  i: (d: number) => number;  // inclination
  w: (d: number) => number;  // argument of perihelion
  a: number;                  // mean distance (AU) - constant for our needs
  e: (d: number) => number;  // eccentricity
  M: (d: number) => number;  // mean anomaly
}

const PLANETS_DATA: Record<string, OrbitalElements> = {
  Mercure: {
    N: (d) => 48.3313 + 3.24587e-5 * d,
    i: (d) => 7.0047  + 5.00e-8 * d,
    w: (d) => 29.1241 + 1.01444e-5 * d,
    a: 0.387098,
    e: (d) => 0.205635 + 5.59e-10 * d,
    M: (d) => 168.6562 + 4.0923344368 * d,
  },
  Vénus: {
    N: (d) => 76.6799 + 2.46590e-5 * d,
    i: (d) => 3.3946  + 2.75e-8 * d,
    w: (d) => 54.8910 + 1.38374e-5 * d,
    a: 0.723330,
    e: (d) => 0.006773 - 1.302e-9 * d,
    M: (d) => 48.0052 + 1.6021302244 * d,
  },
  Mars: {
    N: (d) => 49.5574 + 2.11081e-5 * d,
    i: (d) => 1.8497  - 1.78e-8 * d,
    w: (d) => 286.5016 + 2.92961e-5 * d,
    a: 1.523688,
    e: (d) => 0.093405 + 2.516e-9 * d,
    M: (d) => 18.6021 + 0.5240207766 * d,
  },
  Jupiter: {
    N: (d) => 100.4542 + 2.76854e-5 * d,
    i: (d) => 1.3030  - 1.557e-7 * d,
    w: (d) => 273.8777 + 1.64505e-5 * d,
    a: 5.20256,
    e: (d) => 0.048498 + 4.469e-9 * d,
    M: (d) => 19.8950 + 0.0830853001 * d,
  },
  Saturne: {
    N: (d) => 113.6634 + 2.38980e-5 * d,
    i: (d) => 2.4886  - 1.081e-7 * d,
    w: (d) => 339.3939 + 2.97661e-5 * d,
    a: 9.55475,
    e: (d) => 0.055546 - 9.499e-9 * d,
    M: (d) => 316.9670 + 0.0334442282 * d,
  },
  Uranus: {
    N: (d) => 74.0005 + 1.3978e-5 * d,
    i: (d) => 0.7733  + 1.9e-8 * d,
    w: (d) => 96.6612 + 3.0565e-5 * d,
    a: 19.18171,
    e: (d) => 0.047318 + 7.45e-9 * d,
    M: (d) => 142.5905 + 0.011725806 * d,
  },
  Neptune: {
    N: (d) => 131.7806 + 3.0173e-5 * d,
    i: (d) => 1.7700  - 2.55e-7 * d,
    w: (d) => 272.8461 - 6.027e-6 * d,
    a: 30.05826,
    e: (d) => 0.008606 + 2.15e-9 * d,
    M: (d) => 260.2471 + 0.005995147 * d,
  },
  Pluton: {
    // approximation, Pluton est délicat à modeler avec des éléments orbitaux
    N: (d) => 110.3 + 1.30e-5 * d,
    i: (d) => 17.14,
    w: (d) => 113.76 + 2.9e-5 * d,
    a: 39.482,
    e: (d) => 0.2488,
    M: (d) => 14.882 + 0.00396 * d,
  },
};

function daysSince2000(jd: number): number {
  return jd - 2451545.0;
}

function solveKepler(M: number, e: number): number {
  let E = M + e * RAD * Math.sin(M * DEG) * (1 + e * Math.cos(M * DEG));
  for (let i = 0; i < 6; i++) {
    const dE = (E - e * RAD * Math.sin(E * DEG) - M) / (1 - e * Math.cos(E * DEG));
    E -= dE;
    if (Math.abs(dE) < 1e-6) break;
  }
  return E;
}

function planetEclipticLongitude(name: string, jd: number, sunLon: number): number {
  const p = PLANETS_DATA[name];
  if (!p) return 0;
  const d = daysSince2000(jd);
  const N = rev(p.N(d));
  const i = p.i(d);
  const w = rev(p.w(d));
  const e = p.e(d);
  const M = rev(p.M(d));

  const E = solveKepler(M, e);
  const x = p.a * (Math.cos(E * DEG) - e);
  const y = p.a * Math.sqrt(1 - e * e) * Math.sin(E * DEG);
  const r = Math.sqrt(x * x + y * y);
  const v = Math.atan2(y, x) * RAD;

  // heliocentric ecliptic coordinates
  const xeclip = r * (Math.cos(N * DEG) * Math.cos((v + w) * DEG) - Math.sin(N * DEG) * Math.sin((v + w) * DEG) * Math.cos(i * DEG));
  const yeclip = r * (Math.sin(N * DEG) * Math.cos((v + w) * DEG) + Math.cos(N * DEG) * Math.sin((v + w) * DEG) * Math.cos(i * DEG));
  // const zeclip = r * Math.sin((v + w) * DEG) * Math.sin(i * DEG);

  // Sun position (geocentric)
  const sLon = sunLon * DEG;
  // Sun distance ~1 AU (we approximate by using sunLongitude)
  const xs = Math.cos(sLon);
  const ys = Math.sin(sLon);

  // Geocentric = helio + sun
  const xg = xeclip + xs;
  const yg = yeclip + ys;
  const lon = Math.atan2(yg, xg) * RAD;
  return rev(lon);
}

// ───────── 5. Conversion longitude écliptique → signe astrologique ─────────
export const ZODIAC_NAMES = ["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"];
export const ZODIAC_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

export interface PlanetPosition {
  longitude: number; // 0-360
  sign: string;
  symbol: string;
  signIndex: number;
  degreeInSign: number;
  retrograde?: boolean;
}

function toPosition(lon: number, retrograde?: boolean): PlanetPosition {
  const l = rev(lon);
  const signIndex = Math.floor(l / 30);
  return {
    longitude: l,
    sign: ZODIAC_NAMES[signIndex],
    symbol: ZODIAC_SYMBOLS[signIndex],
    signIndex,
    degreeInSign: l - signIndex * 30,
    retrograde: retrograde ?? false,
  };
}

// ───────── 5b. Obliquité dynamique (Meeus, ch. 22) ─────────
function getObliquity(T: number): number {
  return 23.439291111 - 0.013004167 * T - 0.000000164 * T * T + 0.000000504 * T * T * T;
}

// ───────── 5c. Rétrogradation ─────────
// Retourne la longitude géocentrique brute d'un corps à un JD donné.
function getRawLongitude(name: string, jd: number): number {
  if (name === "Soleil") return sunLongitude(jd);
  if (name === "Lune")   return moonLongitude(jd);
  return planetEclipticLongitude(name, jd, sunLongitude(jd));
}

function isRetrograde(name: string, jd: number): boolean {
  // Le Soleil et la Lune ne sont jamais rétrogrades
  if (name === "Soleil" || name === "Lune") return false;
  const lon1 = getRawLongitude(name, jd);
  const lon2 = getRawLongitude(name, jd + 1);
  const diff = ((lon2 - lon1) + 360) % 360;
  return diff > 180; // si > 180°, la planète recule
}

// ───────── 5d. Nœuds lunaires (Meeus, ch. 47) ─────────
function getLunarNode(T: number): number {
  return rev(125.0445479 - 1934.1362608 * T + 0.0020754 * T * T);
}

// ───────── 5e. Lilith — apogée moyen de la Lune ─────────
function getLilith(T: number): number {
  return rev(83.3532465 + 40.9982502 * T);
}

// ───────── 6. Greenwich Mean Sidereal Time ─────────
function gmst(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const gmstDeg = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T - T * T * T / 38710000;
  return rev(gmstDeg);
}

// ───────── 7. Ascendant & Midheaven (MC) ─────────
function calculateAscendant(jd: number, latitude: number, longitudeEast: number): { ascendant: number; mc: number } {
  const T = (jd - 2451545.0) / 36525;
  // LST = GMST + longitude (positive east)
  const lst = rev(gmst(jd) + longitudeEast);
  const ramc = lst * DEG;
  const lat = latitude * DEG;
  const obl = getObliquity(T) * DEG; // obliquité dynamique

  // MC = atan(tan(RAMC) / cos(obl))
  const mcRaw = Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(obl));
  const mc = rev(mcRaw * RAD);

  // Ascendant
  const ascRaw = Math.atan2(
    -Math.cos(ramc),
    Math.sin(ramc) * Math.cos(obl) + Math.tan(lat) * Math.sin(obl)
  );
  let asc = rev(ascRaw * RAD);
  // Quadrant correction
  if (asc < mc) asc += 180;
  if (asc - mc > 180) asc -= 180;
  asc = rev(asc);

  return { ascendant: asc, mc };
}

// ───────── 8. API publique ─────────
export interface NatalChart {
  jd: number;
  planets: Record<string, PlanetPosition>;
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
  houses: PlanetPosition[]; // 12 cusps (Whole Sign houses = same sign as ascendant for house I)
  northNode: PlanetPosition;
  southNode: PlanetPosition;
  lilith: PlanetPosition;
}

export interface BirthData {
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM (24h, local time at birth location) */
  time?: string;
  /** decimal degrees, north positive */
  latitude?: number;
  /** decimal degrees, east positive */
  longitude?: number;
  /** UTC offset in hours at the moment of birth (e.g., 1 for CET, 2 for CEST) */
  timezoneOffset?: number;
}

export function computeNatalChart(birth: BirthData): NatalChart {
  const [y, m, d] = birth.date.split("-").map(Number);
  let h = 12, min = 0;
  if (birth.time) {
    const parts = birth.time.split(":").map(Number);
    h = parts[0] ?? 12;
    min = parts[1] ?? 0;
  }
  const localHour = h + min / 60;
  const tz = birth.timezoneOffset ?? estimateTimezone(birth.longitude);
  const hourUT = localHour - tz;

  const jd = julianDay(y, m, d, hourUT);
  const T = (jd - 2451545.0) / 36525;

  const sun = sunLongitude(jd);
  const moon = moonLongitude(jd);

  const planets: Record<string, PlanetPosition> = {
    Soleil: toPosition(sun, false),
    Lune:   toPosition(moon, false),
  };
  for (const name of Object.keys(PLANETS_DATA)) {
    const lon = planetEclipticLongitude(name, jd, sun);
    const retro = isRetrograde(name, jd);
    planets[name] = toPosition(lon, retro);
  }

  // Nœuds lunaires
  const northNodeLon = getLunarNode(T);
  const southNodeLon = rev(northNodeLon + 180);
  const northNode = toPosition(northNodeLon, false);
  const southNode = toPosition(southNodeLon, false);

  // Lilith (apogée moyen de la Lune)
  const lilithLon = getLilith(T);
  const lilith = toPosition(lilithLon, false);

  let asc: PlanetPosition;
  let mc: PlanetPosition;
  let houses: PlanetPosition[];

  if (birth.time && birth.latitude !== undefined && birth.longitude !== undefined) {
    const { ascendant, mc: midhVal } = calculateAscendant(jd, birth.latitude, birth.longitude);
    asc = toPosition(ascendant);
    mc = toPosition(midhVal);
    // Whole sign houses : maison I = 0° du signe de l'ascendant
    houses = Array.from({ length: 12 }, (_, i) => toPosition((asc.signIndex + i) * 30));
  } else {
    asc = toPosition(0);
    mc = toPosition(0);
    houses = [];
  }

  return { jd, planets, ascendant: asc, midheaven: mc, houses, northNode, southNode, lilith };
}

/** Very rough timezone estimate based on longitude (only used as fallback). */
export function estimateTimezone(longitudeEast?: number): number {
  if (longitudeEast === undefined) return 0;
  return Math.round(longitudeEast / 15);
}

/** Format a position like "12°34' Bélier ♈" */
export function formatPosition(p: PlanetPosition): string {
  const deg = Math.floor(p.degreeInSign);
  const min = Math.floor((p.degreeInSign - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}' ${p.sign} ${p.symbol}`;
}

/** Aspects entre planètes — angles standards 0/60/90/120/180 +/- orbe */
export interface Aspect {
  planet1: string;
  planet2: string;
  type: "conjonction" | "sextile" | "carré" | "trigone" | "opposition" | "quinconce";
  exactness: number; // orbe en degrés
}

const ASPECT_TYPES = [
  { angle: 0,   type: "conjonction" as const, orb: 8 },
  { angle: 60,  type: "sextile" as const, orb: 6 },
  { angle: 90,  type: "carré" as const, orb: 6 },
  { angle: 120, type: "trigone" as const, orb: 8 },
  { angle: 180, type: "opposition" as const, orb: 8 },
  { angle: 150, type: "quinconce" as const, orb: 3 },
];

export function computeAspects(planets: Record<string, PlanetPosition>): Aspect[] {
  const names = Object.keys(planets);
  const aspects: Aspect[] = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = planets[names[i]].longitude;
      const b = planets[names[j]].longitude;
      let diff = Math.abs(a - b);
      if (diff > 180) diff = 360 - diff;
      for (const at of ASPECT_TYPES) {
        const exact = Math.abs(diff - at.angle);
        if (exact <= at.orb) {
          aspects.push({ planet1: names[i], planet2: names[j], type: at.type, exactness: exact });
          break;
        }
      }
    }
  }
  return aspects.sort((a, b) => a.exactness - b.exactness);
}

// ───────── 9. Transits du jour ─────────
/** Retourne les positions planétaires actuelles (midi UTC, Paris) pour les pages horoscope/mes-astres. */
export function computeTodayTransits(): NatalChart {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  return computeNatalChart({ date: dateStr, time: "12:00", latitude: 48.8566, longitude: 2.3522 });
}

// ───────── 10. Aspects de synastrie ─────────
export interface SynastrieAspect extends Aspect {
  // planet1 appartient à la personne 1, planet2 à la personne 2
}

/**
 * Calcule les aspects entre les planètes de deux personnes (synastrie).
 * Croise chaque planète de `planets1` avec chaque planète de `planets2`.
 */
export function computeSynastrieAspects(
  planets1: Record<string, PlanetPosition>,
  planets2: Record<string, PlanetPosition>
): SynastrieAspect[] {
  const names1 = Object.keys(planets1);
  const names2 = Object.keys(planets2);
  const aspects: SynastrieAspect[] = [];

  for (const n1 of names1) {
    for (const n2 of names2) {
      const a = planets1[n1].longitude;
      const b = planets2[n2].longitude;
      let diff = Math.abs(a - b);
      if (diff > 180) diff = 360 - diff;
      for (const at of ASPECT_TYPES) {
        const exact = Math.abs(diff - at.angle);
        if (exact <= at.orb) {
          aspects.push({ planet1: n1, planet2: n2, type: at.type, exactness: exact });
          break;
        }
      }
    }
  }

  return aspects.sort((a, b) => a.exactness - b.exactness);
}
