"use client";

import { useMemo } from "react";
import { NatalChart, Aspect, ZODIAC_NAMES, ZODIAC_SYMBOLS } from "@/lib/astro-engine";

// ─── Constants ────────────────────────────────────────────────────────────────

const PLANET_SYMBOLS: Record<string, string> = {
  Soleil:  "☉", Lune:    "☽", Mercure: "☿", Vénus:   "♀",
  Mars:    "♂", Jupiter: "♃", Saturne: "♄", Uranus:  "♅",
  Neptune: "♆", Pluton:  "♇",
};

const PLANET_COLORS: Record<string, string> = {
  Soleil:  "#FFD700", Lune:    "#C0C8D0", Mercure: "#A8D8EA", Vénus:   "#FFB6C1",
  Mars:    "#FF6B6B", Jupiter: "#DDA0DD", Saturne: "#D4AF6F", Uranus:  "#7FDBFF",
  Neptune: "#6C91BF", Pluton:  "#9B59B6",
};

const ELEMENT_FILLS: Record<string, string> = {
  Bélier: "rgba(220,80,50,0.18)", Lion: "rgba(220,80,50,0.18)", Sagittaire: "rgba(220,80,50,0.18)",
  Taureau: "rgba(60,150,80,0.18)", Vierge: "rgba(60,150,80,0.18)", Capricorne: "rgba(60,150,80,0.18)",
  Gémeaux: "rgba(70,120,210,0.18)", Balance: "rgba(70,120,210,0.18)", Verseau: "rgba(70,120,210,0.18)",
  Cancer: "rgba(130,60,200,0.18)", Scorpion: "rgba(130,60,200,0.18)", Poissons: "rgba(130,60,200,0.18)",
};

const ASPECT_COLORS: Record<string, string> = {
  conjonction: "rgba(255,255,255,0.55)",
  sextile:     "rgba(80,200,80,0.55)",
  carré:       "rgba(244,80,80,0.55)",
  trigone:     "rgba(60,160,244,0.55)",
  opposition:  "rgba(255,165,40,0.55)",
};

const PLANET_ORDER = ["Soleil","Lune","Mercure","Vénus","Mars","Jupiter","Saturne","Uranus","Neptune","Pluton"];

// Chart radii
const R_OUTER       = 180; // outer tick ring
const R_ZODIAC_OUT  = 172; // zodiac outer
const R_ZODIAC_IN   = 148; // zodiac inner
const R_ZODIAC_MID  = 160; // zodiac symbol text
const R_PLANET_RING = 132; // planet circle center
const R_HOUSE_LINE  = 144; // house cusps reach
const R_INNER       = 110; // inner circle (aspects)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lonToSvgAngleRad(lon: number, rotation: number): number {
  // Rotate so Aries 0° (or ASC) is on the left
  return ((rotation - lon) * Math.PI) / 180;
}

function polar(r: number, angleRad: number): { x: number; y: number } {
  return { x: r * Math.cos(angleRad), y: r * Math.sin(angleRad) };
}

function arcPath(r: number, a1: number, a2: number, large = false): string {
  const p1 = polar(r, a1);
  const p2 = polar(r, a2);
  const laf = large ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${laf} 0 ${p2.x} ${p2.y}`;
}

function avoidCollisions<T extends { name: string; lon: number; angleDeg: number }>(
  planets: T[],
  minGapDeg = 9
): (T & { displayAngleDeg: number })[] {
  const sorted = [...planets].sort((a, b) => a.lon - b.lon);
  const result = sorted.map((p) => ({ ...p, displayAngleDeg: p.angleDeg }));

  // Two-pass collision spreading
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < result.length; i++) {
      const next = result[(i + 1) % result.length];
      let diff = (next.displayAngleDeg - result[i].displayAngleDeg + 360) % 360;
      if (diff < minGapDeg && diff >= 0) {
        const push = (minGapDeg - diff) / 2;
        result[i].displayAngleDeg = (result[i].displayAngleDeg - push + 360) % 360;
        next.displayAngleDeg = (next.displayAngleDeg + push) % 360;
      }
    }
  }
  return result as (T & { displayAngleDeg: number })[];
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  chart: NatalChart;
  aspects: Aspect[];
  hasTime: boolean;
  size?: number;
}

export default function NatalChartSVG({ chart, aspects, hasTime, size = 420 }: Props) {
  const ascLon = chart.ascendant.longitude;
  // Traditional western: ASC goes to the LEFT (180° in SVG coords from top)
  // rotation: ecliptic lon → SVG angle so that ascLon maps to left (180° = π rad)
  const rotation = hasTime ? 180 + ascLon : 0;

  const toAngle = (lon: number) => lonToSvgAngleRad(lon, rotation);
  const toDeg = (lon: number) => ((rotation - lon) % 360 + 360) % 360; // display angle in degrees

  // Build planet data with collision avoidance
  const rawPlanets = useMemo(() => {
    return PLANET_ORDER.map((name) => {
      const pos = chart.planets[name];
      if (!pos) return null;
      return { name, lon: pos.longitude, angleDeg: toDeg(pos.longitude), pos };
    }).filter(Boolean) as Array<{ name: string; lon: number; angleDeg: number; pos: NatalChart["planets"][string] }>;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, rotation]);

  const displayPlanets = useMemo(() => avoidCollisions(rawPlanets), [rawPlanets]);

  // House positions
  const houseData = useMemo(() => {
    if (!hasTime) return [];
    return chart.houses.map((h, i) => ({
      index: i + 1,
      lon: h.longitude,
      angle: toAngle(h.longitude),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart.houses, hasTime, rotation]);

  // Aspect lines
  const aspectLines = useMemo(() => {
    return aspects.slice(0, 25).map((asp) => {
      const p1 = chart.planets[asp.planet1];
      const p2 = chart.planets[asp.planet2];
      if (!p1 || !p2) return null;
      const a1 = toAngle(p1.longitude);
      const a2 = toAngle(p2.longitude);
      return {
        key: `${asp.planet1}-${asp.planet2}`,
        x1: R_INNER * Math.cos(a1), y1: R_INNER * Math.sin(a1),
        x2: R_INNER * Math.cos(a2), y2: R_INNER * Math.sin(a2),
        type: asp.type,
        exactness: asp.exactness,
      };
    }).filter(Boolean) as Array<{ key: string; x1: number; y1: number; x2: number; y2: number; type: string; exactness: number }>;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspects, chart.planets, rotation]);

  const vb = R_OUTER + 20;

  return (
    <svg
      viewBox={`${-vb} ${-vb} ${vb * 2} ${vb * 2}`}
      width={size}
      height={size}
      style={{ maxWidth: "100%", display: "block", margin: "0 auto" }}
      aria-label="Thème natal"
      role="img"
    >
      <defs>
        <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0e2e" />
          <stop offset="100%" stopColor="#07040d" />
        </radialGradient>
        <clipPath id="inner-clip">
          <circle cx={0} cy={0} r={R_INNER} />
        </clipPath>
        <filter id="planet-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <circle cx={0} cy={0} r={vb} fill="url(#bg-grad)" />

      {/* Degree tick marks — outer ring */}
      {Array.from({ length: 360 }).map((_, deg) => {
        const a = toAngle(deg);
        const isMajor = deg % 10 === 0;
        const isMed = deg % 5 === 0;
        const r1 = R_OUTER;
        const r2 = isMajor ? R_OUTER - 8 : isMed ? R_OUTER - 5 : R_OUTER - 3;
        const p1 = polar(r1, a);
        const p2 = polar(r2, a);
        return (
          <line key={deg}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="rgba(212,175,111,0.3)"
            strokeWidth={isMajor ? 0.8 : 0.4}
          />
        );
      })}

      {/* Outer circle */}
      <circle cx={0} cy={0} r={R_OUTER} fill="none" stroke="rgba(212,175,111,0.5)" strokeWidth="0.8" />

      {/* Zodiac band */}
      {ZODIAC_NAMES.map((sign, i) => {
        const startLon = i * 30;
        const endLon = startLon + 30;
        const a1 = toAngle(startLon);
        const a2 = toAngle(endLon);
        const p1o = polar(R_ZODIAC_OUT, a1), p2o = polar(R_ZODIAC_OUT, a2);
        const p1i = polar(R_ZODIAC_IN, a1),  p2i = polar(R_ZODIAC_IN, a2);
        const fill = ELEMENT_FILLS[sign] ?? "rgba(100,100,100,0.15)";
        const midA = toAngle(startLon + 15);
        const tm = polar(R_ZODIAC_MID, midA);
        return (
          <g key={sign}>
            <path
              d={`M ${p1i.x} ${p1i.y} L ${p1o.x} ${p1o.y} A ${R_ZODIAC_OUT} ${R_ZODIAC_OUT} 0 0 0 ${p2o.x} ${p2o.y} L ${p2i.x} ${p2i.y} A ${R_ZODIAC_IN} ${R_ZODIAC_IN} 0 0 1 ${p1i.x} ${p1i.y} Z`}
              fill={fill}
              stroke="rgba(212,175,111,0.25)"
              strokeWidth="0.5"
            />
            <text
              x={tm.x} y={tm.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fill="rgba(245,236,217,0.85)"
              style={{ fontFamily: "serif" }}
            >
              {ZODIAC_SYMBOLS[i]}
            </text>
          </g>
        );
      })}

      {/* Zodiac inner border */}
      <circle cx={0} cy={0} r={R_ZODIAC_IN} fill="none" stroke="rgba(212,175,111,0.4)" strokeWidth="0.8" />

      {/* Planet ring border */}
      <circle cx={0} cy={0} r={R_HOUSE_LINE} fill="none" stroke="rgba(212,175,111,0.2)" strokeWidth="0.5" />

      {/* Inner circle */}
      <circle cx={0} cy={0} r={R_INNER} fill="rgba(7,4,13,0.6)" stroke="rgba(212,175,111,0.35)" strokeWidth="0.7" />

      {/* House cusp lines */}
      {houseData.map(({ index, angle, lon: _lon }) => {
        const isAngle = index === 1 || index === 4 || index === 7 || index === 10;
        const outerR = isAngle ? R_ZODIAC_IN : R_HOUSE_LINE;
        const p1 = polar(R_INNER, angle);
        const p2 = polar(outerR, angle);
        return (
          <line key={index}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={isAngle ? "rgba(212,175,111,0.7)" : "rgba(212,175,111,0.2)"}
            strokeWidth={isAngle ? 1 : 0.5}
            strokeDasharray={isAngle ? "none" : "2,2"}
          />
        );
      })}

      {/* House numbers */}
      {houseData.map(({ index, angle }, i) => {
        const nextAngle = houseData[(i + 1) % 12]?.angle ?? angle;
        const midAngle = angle + ((nextAngle - angle + Math.PI * 2) % (Math.PI * 2)) / 2;
        const tp = polar(R_INNER - 15, midAngle);
        return (
          <text key={index}
            x={tp.x} y={tp.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="7"
            fill="rgba(212,175,111,0.45)"
            style={{ fontFamily: "serif" }}
          >
            {["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][index - 1]}
          </text>
        );
      })}

      {/* Aspect lines */}
      {aspectLines.map((asp) => (
        <line key={asp.key}
          x1={asp.x1} y1={asp.y1} x2={asp.x2} y2={asp.y2}
          stroke={ASPECT_COLORS[asp.type] ?? "rgba(255,255,255,0.3)"}
          strokeWidth={asp.exactness < 1 ? 1.2 : 0.7}
          clipPath="url(#inner-clip)"
        />
      ))}

      {/* Planet tick lines from zodiac band to planet ring */}
      {rawPlanets.map(({ name, lon }) => {
        const dp = displayPlanets.find((d) => d.name === name);
        if (!dp) return null;
        const aZodiac = toAngle(lon);
        const aDisplay = lonToSvgAngleRad(dp.displayAngleDeg, 0);
        const p1 = polar(R_ZODIAC_IN - 1, aZodiac);
        const p2 = polar(R_HOUSE_LINE + 1, aDisplay);
        return (
          <line key={`tick-${name}`}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="rgba(212,175,111,0.2)"
            strokeWidth="0.4"
          />
        );
      })}

      {/* Planet circles */}
      {displayPlanets.map(({ name, displayAngleDeg, pos }) => {
        const a = lonToSvgAngleRad(displayAngleDeg, 0);
        const c = polar(R_PLANET_RING, a);
        const color = PLANET_COLORS[name] ?? "#d4af6f";
        const deg = Math.floor(pos.degreeInSign);
        const min = Math.floor((pos.degreeInSign % 1) * 60);
        return (
          <g key={name} transform={`translate(${c.x},${c.y})`} filter="url(#planet-glow)">
            <circle cx={0} cy={0} r={9} fill="rgba(7,4,13,0.95)" stroke={color} strokeWidth="1" />
            <text
              x={0} y={0}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="8.5"
              fill={color}
              style={{ fontFamily: "serif" }}
            >
              {PLANET_SYMBOLS[name]}
            </text>
            {/* degree label */}
            <text
              x={0} y={13}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="5"
              fill="rgba(212,175,111,0.7)"
            >
              {deg}°{String(min).padStart(2,"0")}′
            </text>
          </g>
        );
      })}

      {/* ASC marker */}
      {hasTime && (() => {
        const a = toAngle(ascLon);
        const tip = polar(R_ZODIAC_IN + 2, a);
        const l = polar(R_ZODIAC_IN - 6, a + 0.06);
        const r2 = polar(R_ZODIAC_IN - 6, a - 0.06);
        const label = polar(R_ZODIAC_IN - 22, a);
        return (
          <g>
            <polygon points={`${tip.x},${tip.y} ${l.x},${l.y} ${r2.x},${r2.y}`} fill="#d4af6f" />
            <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#d4af6f" fontWeight="bold">AC</text>
          </g>
        );
      })()}

      {/* MC marker */}
      {hasTime && (() => {
        const a = toAngle(chart.midheaven.longitude);
        const tip = polar(R_ZODIAC_IN + 2, a);
        const l = polar(R_ZODIAC_IN - 6, a + 0.06);
        const r2 = polar(R_ZODIAC_IN - 6, a - 0.06);
        const label = polar(R_ZODIAC_IN - 22, a);
        return (
          <g>
            <polygon points={`${tip.x},${tip.y} ${l.x},${l.y} ${r2.x},${r2.y}`} fill="#f5ecd9" opacity="0.8" />
            <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#f5ecd9" fontWeight="bold">MC</text>
          </g>
        );
      })()}

      {/* Center dot */}
      <circle cx={0} cy={0} r={3} fill="rgba(212,175,111,0.6)" />
    </svg>
  );
}
