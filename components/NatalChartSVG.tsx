"use client";

import { useMemo } from "react";
import { NatalChart, Aspect, ZODIAC_NAMES, ZODIAC_SYMBOLS } from "@/lib/astro-engine";

// ─── Constants ───────────────────────────────────────────────────────────────

const PLANET_SYMBOLS: Record<string, string> = {
  Soleil: "☉", Lune: "☽", Mercure: "☿", Vénus: "♀",
  Mars: "♂", Jupiter: "♃", Saturne: "♄", Uranus: "♅",
  Neptune: "♆", Pluton: "♇",
};

const PLANET_COLORS: Record<string, string> = {
  Soleil: "#FFD060", Lune: "#C8D4E0", Mercure: "#88CCEE", Vénus: "#FFB8C8",
  Mars: "#FF7070", Jupiter: "#CC99DD", Saturne: "#D4AF6F", Uranus: "#66DDFF",
  Neptune: "#7799CC", Pluton: "#AA77CC",
};

// Subtle element tints — lighter so signs don't look like blocks
const ELEMENT_FILLS: Record<string, string> = {
  Bélier: "rgba(200,60,30,0.12)", Lion: "rgba(200,60,30,0.12)", Sagittaire: "rgba(200,60,30,0.12)",
  Taureau: "rgba(40,140,60,0.12)", Vierge: "rgba(40,140,60,0.12)", Capricorne: "rgba(40,140,60,0.12)",
  Gémeaux: "rgba(50,100,200,0.12)", Balance: "rgba(50,100,200,0.12)", Verseau: "rgba(50,100,200,0.12)",
  Cancer: "rgba(110,40,180,0.12)", Scorpion: "rgba(110,40,180,0.12)", Poissons: "rgba(110,40,180,0.12)",
};

const ASPECT_COLORS: Record<string, string> = {
  conjonction: "rgba(255,255,255,0.50)",
  sextile: "rgba(60,200,80,0.60)",
  carré: "rgba(240,70,70,0.60)",
  trigone: "rgba(50,150,240,0.65)",
  opposition: "rgba(255,160,30,0.60)",
  quinconce:  "rgba(255,200,0,0.45)",
};

const PLANET_ORDER = ["Soleil","Lune","Mercure","Vénus","Mars","Jupiter","Saturne","Uranus","Neptune","Pluton"];

// Radii
const R_OUTER      = 182;
const R_ZODIAC_OUT = 174;
const R_ZODIAC_IN  = 148;
const R_ZODIAC_MID = 161;
const R_PLANET     = 130;
const R_HOUSE_EDGE = 145;
const R_INNER      = 108;
const R_DEG_TICK   = 182;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toRad(lon: number, rotation: number) {
  return ((rotation - lon) * Math.PI) / 180;
}

function polar(r: number, a: number) {
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}

function avoidCollisions<T extends { lon: number; displayDeg: number }>(items: T[], minGap = 10): T[] {
  const sorted = [...items].sort((a, b) => a.lon - b.lon);
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < sorted.length; i++) {
      const next = sorted[(i + 1) % sorted.length];
      const diff = ((next.displayDeg - sorted[i].displayDeg) + 360) % 360;
      if (diff < minGap) {
        const push = (minGap - diff) / 2;
        sorted[i].displayDeg = (sorted[i].displayDeg - push + 360) % 360;
        next.displayDeg = (next.displayDeg + push) % 360;
      }
    }
  }
  return sorted;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  chart: NatalChart;
  aspects: Aspect[];
  hasTime: boolean;
  size?: number;
}

export default function NatalChartSVG({ chart, aspects, hasTime, size = 440 }: Props) {
  const ascLon = chart.ascendant.longitude;
  const rotation = hasTime ? 180 + ascLon : 0;
  const ang = (lon: number) => toRad(lon, rotation);
  const dispDeg = (lon: number) => ((rotation - lon) % 360 + 360) % 360;

  // Planets with collision avoidance
  const planets = useMemo(() => {
    const raw = PLANET_ORDER.map(name => {
      const pos = chart.planets[name];
      if (!pos) return null;
      return { name, lon: pos.longitude, displayDeg: dispDeg(pos.longitude), pos };
    }).filter(Boolean) as Array<{ name: string; lon: number; displayDeg: number; pos: NatalChart["planets"][string] }>;
    return avoidCollisions(raw);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, rotation]);

  // Houses
  const houses = useMemo(() => {
    if (!hasTime) return [];
    return chart.houses.map((h, i) => ({ index: i + 1, lon: h.longitude, a: ang(h.longitude) }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart.houses, hasTime, rotation]);

  // Aspect lines
  const aspLines = useMemo(() => aspects.slice(0, 30).map(asp => {
    const p1 = chart.planets[asp.planet1];
    const p2 = chart.planets[asp.planet2];
    if (!p1 || !p2) return null;
    const a1 = ang(p1.longitude);
    const a2 = ang(p2.longitude);
    return {
      key: `${asp.planet1}-${asp.planet2}`,
      x1: R_INNER * Math.cos(a1), y1: R_INNER * Math.sin(a1),
      x2: R_INNER * Math.cos(a2), y2: R_INNER * Math.sin(a2),
      type: asp.type, exact: asp.exactness,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }).filter(Boolean) as Array<{ key: string; x1: number; y1: number; x2: number; y2: number; type: string; exact: number }>,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [aspects, chart.planets, rotation]);

  const vb = R_OUTER + 18;

  return (
    <svg
      viewBox={`${-vb} ${-vb} ${vb * 2} ${vb * 2}`}
      width={size} height={size}
      style={{ maxWidth: "100%", display: "block", margin: "0 auto" }}
      role="img" aria-label="Thème natal"
    >
      <defs>
        <radialGradient id="nchart-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#120b22" />
          <stop offset="100%" stopColor="#07040d" />
        </radialGradient>
        <clipPath id="nchart-inner"><circle cx={0} cy={0} r={R_INNER} /></clipPath>
        <filter id="nchart-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <circle cx={0} cy={0} r={vb} fill="url(#nchart-bg)" />

      {/* Outer degree tick ring */}
      {Array.from({ length: 360 }).map((_, d) => {
        const a = ang(d);
        const isMaj = d % 10 === 0, isMed = d % 5 === 0;
        const r1 = R_DEG_TICK;
        const r2 = isMaj ? r1 - 9 : isMed ? r1 - 5 : r1 - 2.5;
        const p1 = polar(r1, a), p2 = polar(r2, a);
        return (
          <line key={d} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={isMaj ? "rgba(212,175,111,0.45)" : "rgba(212,175,111,0.2)"}
            strokeWidth={isMaj ? 0.9 : 0.4}
          />
        );
      })}

      {/* Outer ring border */}
      <circle cx={0} cy={0} r={R_OUTER} fill="none" stroke="rgba(212,175,111,0.55)" strokeWidth="0.8" />

      {/* Zodiac band — thin elegant sectors */}
      {ZODIAC_NAMES.map((sign, i) => {
        const s = i * 30, e = s + 30;
        const a1 = ang(s), a2 = ang(e);
        const po1 = polar(R_ZODIAC_OUT, a1), po2 = polar(R_ZODIAC_OUT, a2);
        const pi1 = polar(R_ZODIAC_IN, a1),  pi2 = polar(R_ZODIAC_IN, a2);
        const mid = ang(s + 15);
        const tm = polar(R_ZODIAC_MID, mid);
        const fill = ELEMENT_FILLS[sign] ?? "rgba(100,100,100,0.08)";
        return (
          <g key={sign}>
            <path
              d={`M ${pi1.x} ${pi1.y} L ${po1.x} ${po1.y} A ${R_ZODIAC_OUT} ${R_ZODIAC_OUT} 0 0 0 ${po2.x} ${po2.y} L ${pi2.x} ${pi2.y} A ${R_ZODIAC_IN} ${R_ZODIAC_IN} 0 0 1 ${pi1.x} ${pi1.y} Z`}
              fill={fill} stroke="rgba(212,175,111,0.18)" strokeWidth="0.5"
            />
            {/* Zodiac symbol */}
            <text x={tm.x} y={tm.y} textAnchor="middle" dominantBaseline="central"
              fontSize="12" fill="rgba(245,236,217,0.88)" style={{ fontFamily: "serif" }}>
              {ZODIAC_SYMBOLS[i]}
            </text>
          </g>
        );
      })}

      {/* Inner zodiac border */}
      <circle cx={0} cy={0} r={R_ZODIAC_IN} fill="none" stroke="rgba(212,175,111,0.38)" strokeWidth="0.8" />

      {/* Planet band outer border */}
      <circle cx={0} cy={0} r={R_HOUSE_EDGE} fill="none" stroke="rgba(212,175,111,0.15)" strokeWidth="0.5" />

      {/* Inner circle */}
      <circle cx={0} cy={0} r={R_INNER} fill="rgba(7,4,13,0.55)" stroke="rgba(212,175,111,0.30)" strokeWidth="0.8" />

      {/* House cusp lines */}
      {houses.map(({ index, a }) => {
        const isAngle = [1,4,7,10].includes(index);
        const p1 = polar(R_INNER, a);
        const p2 = polar(isAngle ? R_ZODIAC_IN : R_HOUSE_EDGE, a);
        return (
          <line key={index} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={isAngle ? "rgba(212,175,111,0.60)" : "rgba(212,175,111,0.18)"}
            strokeWidth={isAngle ? 1 : 0.5}
            strokeDasharray={isAngle ? undefined : "3,3"}
          />
        );
      })}

      {/* House numbers in inner ring */}
      {houses.map(({ index, a }, i) => {
        const nextA = houses[(i + 1) % 12]?.a ?? a;
        let midA = a + ((nextA - a + Math.PI * 2) % (Math.PI * 2)) / 2;
        if (((nextA - a + Math.PI * 2) % (Math.PI * 2)) > Math.PI) midA = a + Math.PI;
        const tp = polar(R_INNER - 16, midA);
        const nums = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
        return (
          <text key={index} x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="central"
            fontSize="7.5" fill="rgba(212,175,111,0.40)" style={{ fontFamily: "serif" }}>
            {nums[index - 1]}
          </text>
        );
      })}

      {/* Aspect lines */}
      {aspLines.map(asp => (
        <line key={asp.key}
          x1={asp.x1} y1={asp.y1} x2={asp.x2} y2={asp.y2}
          stroke={ASPECT_COLORS[asp.type] ?? "rgba(255,255,255,0.3)"}
          strokeWidth={asp.exact < 1 ? 1.4 : asp.exact < 3 ? 0.9 : 0.5}
          clipPath="url(#nchart-inner)"
        />
      ))}

      {/* Planet tick lines from zodiac band to planet ring */}
      {planets.map(({ name, lon, displayDeg }) => {
        const aZod = ang(lon);
        const aDisp = toRad(displayDeg, 0);
        const p1 = polar(R_ZODIAC_IN - 1, aZod);
        const p2 = polar(R_HOUSE_EDGE + 1, aDisp);
        const color = PLANET_COLORS[name] ?? "#d4af6f";
        return (
          <line key={`tk-${name}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={color} strokeWidth="0.5" opacity="0.35"
          />
        );
      })}

      {/* Planet glyphs — clean style, no heavy circle */}
      {planets.map(({ name, displayDeg, pos }) => {
        const a = toRad(displayDeg, 0);
        const c = polar(R_PLANET, a);
        const color = PLANET_COLORS[name] ?? "#d4af6f";
        const deg = Math.floor(pos.degreeInSign);
        const min = Math.floor((pos.degreeInSign % 1) * 60);
        return (
          <g key={name} transform={`translate(${c.x},${c.y})`} filter="url(#nchart-glow)">
            {/* Subtle background disc */}
            <circle cx={0} cy={0} r={10} fill="rgba(7,4,13,0.90)" stroke={color} strokeWidth="0.7" opacity="0.9" />
            {/* Planet glyph */}
            <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
              fontSize="10" fill={color} style={{ fontFamily: "serif", fontWeight: "400" }}>
              {PLANET_SYMBOLS[name]}
            </text>
            {/* Degree below */}
            <text x={0} y={14} textAnchor="middle" dominantBaseline="central"
              fontSize="5.5" fill={color} opacity="0.75">
              {deg}°{String(min).padStart(2, "0")}′
            </text>
          </g>
        );
      })}

      {/* ASC arrow */}
      {hasTime && (() => {
        const a = ang(ascLon);
        const tip = polar(R_ZODIAC_IN + 3, a);
        const l1 = polar(R_ZODIAC_IN - 5, a + 0.055);
        const l2 = polar(R_ZODIAC_IN - 5, a - 0.055);
        const lb = polar(R_ZODIAC_IN - 20, a);
        return (
          <g>
            <polygon points={`${tip.x},${tip.y} ${l1.x},${l1.y} ${l2.x},${l2.y}`} fill="#d4af6f" />
            <text x={lb.x} y={lb.y} textAnchor="middle" dominantBaseline="central"
              fontSize="7.5" fill="#d4af6f" fontWeight="600">AC</text>
          </g>
        );
      })()}

      {/* MC arrow */}
      {hasTime && (() => {
        const a = ang(chart.midheaven.longitude);
        const tip = polar(R_ZODIAC_IN + 3, a);
        const l1 = polar(R_ZODIAC_IN - 5, a + 0.055);
        const l2 = polar(R_ZODIAC_IN - 5, a - 0.055);
        const lb = polar(R_ZODIAC_IN - 20, a);
        return (
          <g>
            <polygon points={`${tip.x},${tip.y} ${l1.x},${l1.y} ${l2.x},${l2.y}`} fill="rgba(245,236,217,0.85)" />
            <text x={lb.x} y={lb.y} textAnchor="middle" dominantBaseline="central"
              fontSize="7.5" fill="rgba(245,236,217,0.85)" fontWeight="600">MC</text>
          </g>
        );
      })()}

      {/* Centre */}
      <circle cx={0} cy={0} r={2.5} fill="rgba(212,175,111,0.6)" />
    </svg>
  );
}
