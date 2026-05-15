"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, Loader2, Star, Briefcase, Heart, Globe, User, TableProperties } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import PaywallGate from "@/components/PaywallGate";
import { cleanAIText } from "@/lib/format-ai-text";
import NatalChartSVG from "@/components/NatalChartSVG";
import {
  computeNatalChart,
  computeAspects,
  ZODIAC_NAMES,
  ZODIAC_SYMBOLS,
  NatalChart,
  Aspect,
  PlanetPosition,
  estimateTimezone,
} from "@/lib/astro-engine";

// ───── Constants ─────────────────────────────────────────────────────────────

const PLANET_SYMBOLS: Record<string, string> = {
  Soleil: "☉",
  Lune: "☽",
  Mercure: "☿",
  Vénus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturne: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluton: "♇",
};

const PLANET_ORDER = [
  "Soleil", "Lune", "Mercure", "Vénus", "Mars",
  "Jupiter", "Saturne", "Uranus", "Neptune", "Pluton",
];

const ELEMENT_COLORS: Record<string, string> = {
  "Bélier":      "rgba(212,100,50,0.3)",
  "Lion":        "rgba(212,100,50,0.3)",
  "Sagittaire":  "rgba(212,100,50,0.3)",
  "Taureau":     "rgba(80,160,80,0.3)",
  "Vierge":      "rgba(80,160,80,0.3)",
  "Capricorne":  "rgba(80,160,80,0.3)",
  "Gémeaux":     "rgba(80,130,212,0.3)",
  "Balance":     "rgba(80,130,212,0.3)",
  "Verseau":     "rgba(80,130,212,0.3)",
  "Cancer":      "rgba(120,60,200,0.3)",
  "Scorpion":    "rgba(120,60,200,0.3)",
  "Poissons":    "rgba(120,60,200,0.3)",
};

const ASPECT_COLORS: Record<string, string> = {
  conjonction: "#ffffff",
  sextile:     "#4CAF50",
  carré:       "#f44336",
  trigone:     "#2196F3",
  opposition:  "#FF9800",
};

const TABS = [
  { id: "portrait",  label: "Portrait",       icon: User },
  { id: "planetes",  label: "Planètes",        icon: TableProperties },
  { id: "carte",     label: "Carte du ciel",   icon: Globe },
  { id: "transits",  label: "Transits",        icon: Star },
  { id: "amour",     label: "Amour",           icon: Heart },
  { id: "carriere",  label: "Carrière",        icon: Briefcase },
] as const;

type TabId = typeof TABS[number]["id"];

const SUBSCRIPTION_LABELS: Record<string, string> = {
  decouverte: "Découverte",
  mystique:   "Mystique",
  vip:        "VIP",
};

// ───── Helpers ────────────────────────────────────────────────────────────────

// renderMarkdown replaced by cleanAIText from @/lib/format-ai-text

function svgAngle(lon: number): number {
  return (-lon - 90) * (Math.PI / 180);
}

function polarToXY(r: number, angleDeg: number): { x: number; y: number } {
  const a = svgAngle(angleDeg);
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}

// ───── Sub-components ─────────────────────────────────────────────────────────

function StreamSection({
  title,
  buttonLabel,
  text,
  loading,
  onReveal,
}: {
  title: string;
  buttonLabel: string;
  text: string;
  loading: boolean;
  onReveal: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="font-serif-display text-xl text-gradient-gold">{title}</h3>
        <button className="btn-gold" onClick={onReveal} disabled={loading}>
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Révélation en cours…</>
          ) : (
            <><Crown size={16} /> {buttonLabel}</>
          )}
        </button>
      </div>

      {text && (
        <div
          className="luxe-card rounded-sm p-6 font-serif-text text-base leading-[1.85]"
          style={{ color: "#e8dcc0" }}
          dangerouslySetInnerHTML={{ __html: cleanAIText(text) }}
        />
      )}

      {loading && !text && (
        <div className="luxe-card rounded-sm p-8 flex items-center justify-center gap-3" style={{ color: "#c9b88a" }}>
          <Loader2 size={20} className="animate-spin" style={{ color: "#d4af6f" }} />
          <span className="font-serif-text text-sm">Les astres murmurent…</span>
        </div>
      )}
    </div>
  );
}

// ───── Main page ─────────────────────────────────────────────────────────────

export default function MesAstresPage() {
  const { profile, firebaseUser, isHydrated } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !firebaseUser) {
      router.replace("/connexion?redirect=/mes-astres");
    }
  }, [isHydrated, firebaseUser, router]);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabId>("portrait");

  // AI text states
  const [portraitText, setPortraitText]       = useState("");
  const [portraitLoading, setPortraitLoading] = useState(false);
  const [transitsText, setTransitsText]       = useState("");
  const [transitsLoading, setTransitsLoading] = useState(false);
  const [amourText, setAmourText]             = useState("");
  const [amourLoading, setAmourLoading]       = useState(false);
  const [carriereText, setCarriereText]       = useState("");
  const [carriereLoading, setCarriereLoading] = useState(false);

  // ── Paywall: require at least "mystique" ──────────────────────────────────
  if (!profile?.subscription || profile.subscription === "decouverte") {
    return <PaywallGate feature="premium">{null}</PaywallGate>;
  }

  // ── No birth data ─────────────────────────────────────────────────────────
  if (!profile.dateNaissance) {
    return (
      <main className="min-h-screen px-4 py-16 flex items-center justify-center">
        <div className="luxe-card rounded-sm p-10 max-w-md w-full text-center">
          <Star size={36} style={{ color: "#d4af6f" }} className="mx-auto mb-6" />
          <h2 className="font-serif-display text-2xl mb-4 text-gradient-cream">
            Données de naissance manquantes
          </h2>
          <p className="text-sm mb-8" style={{ color: "#c9b88a" }}>
            Pour révéler vos astres, Madame Céleste a besoin de votre date de naissance.
            Complétez votre profil pour accéder à votre thème natal complet.
          </p>
          <Link href="/mon-profil" className="btn-gold">
            Compléter mon profil
          </Link>
        </div>
      </main>
    );
  }

  // ── Compute natal chart ───────────────────────────────────────────────────
  return <MesAstresContent
    profile={profile}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    portraitText={portraitText}
    setPortraitText={setPortraitText}
    portraitLoading={portraitLoading}
    setPortraitLoading={setPortraitLoading}
    transitsText={transitsText}
    setTransitsText={setTransitsText}
    transitsLoading={transitsLoading}
    setTransitsLoading={setTransitsLoading}
    amourText={amourText}
    setAmourText={setAmourText}
    amourLoading={amourLoading}
    setAmourLoading={setAmourLoading}
    carriereText={carriereText}
    setCarriereText={setCarriereText}
    carriereLoading={carriereLoading}
    setCarriereLoading={setCarriereLoading}
  />;
}

// ───── Content (rendered after guards) ───────────────────────────────────────

function MesAstresContent({
  profile,
  activeTab,
  setActiveTab,
  portraitText, setPortraitText, portraitLoading, setPortraitLoading,
  transitsText, setTransitsText, transitsLoading, setTransitsLoading,
  amourText, setAmourText, amourLoading, setAmourLoading,
  carriereText, setCarriereText, carriereLoading, setCarriereLoading,
}: {
  profile: NonNullable<ReturnType<typeof useUserProfile>["profile"]>;
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
  portraitText: string; setPortraitText: React.Dispatch<React.SetStateAction<string>>;
  portraitLoading: boolean; setPortraitLoading: (b: boolean) => void;
  transitsText: string; setTransitsText: React.Dispatch<React.SetStateAction<string>>;
  transitsLoading: boolean; setTransitsLoading: (b: boolean) => void;
  amourText: string; setAmourText: React.Dispatch<React.SetStateAction<string>>;
  amourLoading: boolean; setAmourLoading: (b: boolean) => void;
  carriereText: string; setCarriereText: React.Dispatch<React.SetStateAction<string>>;
  carriereLoading: boolean; setCarriereLoading: (b: boolean) => void;
}) {
  const hasTime = !!profile.heureNaissance;
  const timezoneOffset = estimateTimezone(profile.lonNaissance);

  const chart = useMemo<NatalChart>(() => {
    return computeNatalChart({
      date: profile.dateNaissance,
      time: profile.heureNaissance || undefined,
      latitude: profile.latNaissance,
      longitude: profile.lonNaissance,
      timezoneOffset,
    });
  }, [profile.dateNaissance, profile.heureNaissance, profile.latNaissance, profile.lonNaissance, timezoneOffset]);

  const aspects = useMemo<Aspect[]>(() => computeAspects(chart.planets), [chart.planets]);

  // ── Build API payload ─────────────────────────────────────────────────────
  function buildChartPayload(c: NatalChart) {
    const planets: Record<string, { sign: string; degreeInSign: number; house: number }> = {};
    Object.entries(c.planets).forEach(([name, pos]) => {
      const p = pos as PlanetPosition & { house?: number };
      planets[name] = { sign: p.sign, degreeInSign: p.degreeInSign, house: p.house ?? 0 };
    });
    return {
      planets,
      ascendant: { sign: c.ascendant.sign, degreeInSign: c.ascendant.degreeInSign },
      midheaven: { sign: c.midheaven.sign, degreeInSign: c.midheaven.degreeInSign },
      hasTime: !!profile.heureNaissance,
    };
  }

  // ── Streaming helper ──────────────────────────────────────────────────────
  async function streamSection(
    section: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    setLoading: (b: boolean) => void,
  ) {
    setLoading(true);
    setter("");
    try {
      const res = await fetch("/api/mes-astres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          profile: {
            prenom: profile.prenom,
            dateNaissance: profile.dateNaissance,
            heureNaissance: profile.heureNaissance,
            villeNaissance: profile.villeNaissance,
            genre: profile.genre,
          },
          natalChart: buildChartPayload(chart),
        }),
      });
      if (!res.ok || !res.body) throw new Error("API error");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setter((p) => p + decoder.decode(value, { stream: true }));
      }
    } catch {
      setter("Les étoiles sont voilées… Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  // ── Key planets ───────────────────────────────────────────────────────────
  const sunPos    = chart.planets["Soleil"];
  const moonPos   = chart.planets["Lune"];
  const ascPos    = chart.ascendant;

  // ── SVG chart data ────────────────────────────────────────────────────────
  const svgPlanets = PLANET_ORDER.map((name) => {
    const pos = chart.planets[name];
    if (!pos) return null;
    const { x, y } = polarToXY(110, pos.longitude);
    return { name, pos, x, y };
  }).filter(Boolean) as Array<{ name: string; pos: NatalChart["planets"][string]; x: number; y: number }>;

  const svgAspects = aspects.slice(0, 20).map((asp) => {
    const p1 = chart.planets[asp.planet1];
    const p2 = chart.planets[asp.planet2];
    if (!p1 || !p2) return null;
    const a1 = polarToXY(70, p1.longitude);
    const a2 = polarToXY(70, p2.longitude);
    return { ...asp, x1: a1.x, y1: a1.y, x2: a2.x, y2: a2.y };
  }).filter(Boolean) as Array<Aspect & { x1: number; y1: number; x2: number; y2: number }>;

  const ascLon   = ascPos.longitude;
  const ascAngle = svgAngle(ascLon);
  const ascTip   = { x: 140 * Math.cos(ascAngle), y: 140 * Math.sin(ascAngle) };
  const ascLeft  = { x: 133 * Math.cos(ascAngle + 0.1), y: 133 * Math.sin(ascAngle + 0.1) };
  const ascRight = { x: 133 * Math.cos(ascAngle - 0.1), y: 133 * Math.sin(ascAngle - 0.1) };

  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="fade-in-up mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="font-serif-display text-4xl md:text-5xl text-gradient-gold">
            Mes Astres
          </h1>
          <span
            className="badge-premium text-xs px-3 py-1 rounded-full self-center"
            style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            {SUBSCRIPTION_LABELS[profile.subscription] ?? profile.subscription}
          </span>
        </div>
        <p className="font-serif-text text-lg" style={{ color: "#c9b88a" }}>
          Le cosmos de {profile.prenom}, révélé par Madame Céleste
        </p>
      </div>

      {/* ── 3 key planets banner ── */}
      <div className="grid grid-cols-3 gap-3 mb-10 fade-in-up">
        {[
          { label: "Soleil",     pos: sunPos,  symbol: PLANET_SYMBOLS["Soleil"] },
          { label: "Lune",      pos: moonPos, symbol: PLANET_SYMBOLS["Lune"] },
          { label: "Ascendant", pos: hasTime ? ascPos : null, symbol: "AC" },
        ].map(({ label, pos, symbol }) => (
          <div
            key={label}
            className="luxe-card-premium rounded-sm p-4 text-center"
          >
            <div className="text-2xl mb-1" style={{ color: "#d4af6f" }}>{symbol}</div>
            <div className="font-serif-display text-xs mb-1 tracking-widest uppercase" style={{ color: "#8a6f3a" }}>
              {label}
            </div>
            {pos ? (
              <>
                <div className="font-serif-display text-base text-gradient-cream">{pos.sign}</div>
                <div className="text-xs mt-1" style={{ color: "#c9b88a" }}>
                  {ZODIAC_SYMBOLS[ZODIAC_NAMES.indexOf(pos.sign)]} {Math.floor(pos.degreeInSign)}°
                </div>
              </>
            ) : (
              <div className="text-xs" style={{ color: "#8a6f3a" }}>Heure requise</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Tab navigation ── */}
      <div
        className="flex overflow-x-auto gap-1 mb-8 pb-1"
        style={{ borderBottom: "1px solid rgba(212,175,111,0.15)" }}
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-3 text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-all duration-300"
              style={{
                color: isActive ? "#d4af6f" : "#8a6f3a",
                borderBottom: isActive ? "2px solid #d4af6f" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <div className="fade-in-up">

        {/* Portrait */}
        {activeTab === "portrait" && (
          <StreamSection
            title="Portrait Cosmique"
            buttonLabel="Révéler mon portrait"
            text={portraitText}
            loading={portraitLoading}
            onReveal={() => streamSection("portrait", setPortraitText, setPortraitLoading)}
          />
        )}

        {/* Planètes */}
        {activeTab === "planetes" && (
          <div className="space-y-8">
            <h3 className="font-serif-display text-xl text-gradient-gold">Positions planétaires</h3>

            <div className="luxe-card rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(212,175,111,0.15)" }}>
                    {["Planète", "Signe", "Degré", ...(hasTime ? ["Maison"] : [])].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs tracking-widest uppercase"
                        style={{ color: "#8a6f3a", fontFamily: "'Inter', sans-serif" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLANET_ORDER.map((name) => {
                    const pos = chart.planets[name];
                    if (!pos) return null;
                    return (
                      <tr
                        key={name}
                        style={{ borderBottom: "1px solid rgba(212,175,111,0.07)" }}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 font-medium" style={{ color: "#e8dcc0" }}>
                          <span style={{ color: "#d4af6f", marginRight: 8 }}>{PLANET_SYMBOLS[name]}</span>
                          {name}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#c9b88a" }}>
                          {ZODIAC_SYMBOLS[ZODIAC_NAMES.indexOf(pos.sign)]} {pos.sign}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: "#c9b88a" }}>
                          {Math.floor(pos.degreeInSign)}°{String(Math.floor((pos.degreeInSign % 1) * 60)).padStart(2, "0")}′
                        </td>
                        {hasTime && (
                          <td className="px-4 py-3" style={{ color: "#8a6f3a" }}>
                            {(() => { const h = (pos as PlanetPosition & { house?: number }).house; return h && h > 0 ? `Maison ${h}` : "—"; })()}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {/* Ascendant */}
                  {hasTime && (
                    <tr style={{ borderBottom: "1px solid rgba(212,175,111,0.07)" }} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-medium" style={{ color: "#e8dcc0" }}>
                        <span style={{ color: "#d4af6f", marginRight: 8 }}>AC</span>
                        Ascendant
                      </td>
                      <td className="px-4 py-3" style={{ color: "#c9b88a" }}>
                        {ZODIAC_SYMBOLS[ZODIAC_NAMES.indexOf(ascPos.sign)]} {ascPos.sign}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#c9b88a" }}>
                        {Math.floor(ascPos.degreeInSign)}°{String(Math.floor((ascPos.degreeInSign % 1) * 60)).padStart(2, "0")}′
                      </td>
                      <td className="px-4 py-3" style={{ color: "#8a6f3a" }}>—</td>
                    </tr>
                  )}
                  {/* Midheaven */}
                  {hasTime && (
                    <tr className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-medium" style={{ color: "#e8dcc0" }}>
                        <span style={{ color: "#d4af6f", marginRight: 8 }}>MC</span>
                        Milieu du ciel
                      </td>
                      <td className="px-4 py-3" style={{ color: "#c9b88a" }}>
                        {ZODIAC_SYMBOLS[ZODIAC_NAMES.indexOf(chart.midheaven.sign)]} {chart.midheaven.sign}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#c9b88a" }}>
                        {Math.floor(chart.midheaven.degreeInSign)}°{String(Math.floor((chart.midheaven.degreeInSign % 1) * 60)).padStart(2, "0")}′
                      </td>
                      <td className="px-4 py-3" style={{ color: "#8a6f3a" }}>—</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Aspects */}
            <div>
              <h3 className="font-serif-display text-xl text-gradient-gold mb-4">Aspects planétaires</h3>
              <div className="luxe-card rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(212,175,111,0.15)" }}>
                      {["Planète 1", "Aspect", "Planète 2", "Exactitude"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs tracking-widest uppercase"
                          style={{ color: "#8a6f3a", fontFamily: "'Inter', sans-serif" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {aspects.slice(0, 20).map((asp, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid rgba(212,175,111,0.07)" }}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3" style={{ color: "#e8dcc0" }}>
                          <span style={{ color: "#d4af6f", marginRight: 6 }}>{PLANET_SYMBOLS[asp.planet1] ?? ""}</span>
                          {asp.planet1}
                        </td>
                        <td
                          className="px-4 py-3 font-medium capitalize"
                          style={{ color: ASPECT_COLORS[asp.type] ?? "#d4af6f" }}
                        >
                          {asp.type}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#e8dcc0" }}>
                          <span style={{ color: "#d4af6f", marginRight: 6 }}>{PLANET_SYMBOLS[asp.planet2] ?? ""}</span>
                          {asp.planet2}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: "#c9b88a" }}>
                          {asp.exactness.toFixed(1)}°
                        </td>
                      </tr>
                    ))}
                    {aspects.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm" style={{ color: "#8a6f3a" }}>
                          Aucun aspect significatif trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Carte du ciel */}
        {activeTab === "carte" && (
          <div className="space-y-6">
            <h3 className="font-serif-display text-xl text-gradient-gold">Carte du ciel natale</h3>

            {!hasTime && (
              <p className="text-xs px-4 py-3 rounded" style={{ color: "#c9b88a", background: "rgba(212,175,111,0.06)", border: "1px solid rgba(212,175,111,0.15)" }}>
                Ajoutez votre heure de naissance dans votre profil pour afficher les maisons et l&apos;ascendant exact.
              </p>
            )}

            <div className="w-full max-w-lg mx-auto">
              <NatalChartSVG chart={chart} aspects={aspects} hasTime={hasTime} />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs" style={{ color: "#c9b88a" }}>
              {([
                ["conjonction","rgba(255,255,255,0.55)"],
                ["sextile","rgba(80,200,80,0.55)"],
                ["carré","rgba(244,80,80,0.55)"],
                ["trigone","rgba(60,160,244,0.55)"],
                ["opposition","rgba(255,165,40,0.55)"],
              ] as [string,string][]).map(([type, color]) => (
                <span key={type} className="flex items-center gap-1.5">
                  <span style={{ display: "inline-block", width: 22, height: 2, background: color, borderRadius: 1 }} />
                  <span className="capitalize tracking-wide">{type}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Transits */}
        {activeTab === "transits" && (
          <StreamSection
            title="Transits actuels"
            buttonLabel="Voir mes transits actuels"
            text={transitsText}
            loading={transitsLoading}
            onReveal={() => streamSection("transits", setTransitsText, setTransitsLoading)}
          />
        )}

        {/* Amour — requires VIP */}
        {activeTab === "amour" && (
          profile.subscription === "vip" ? (
            <StreamSection
              title="Portrait amoureux"
              buttonLabel="Lire mon portrait amoureux"
              text={amourText}
              loading={amourLoading}
              onReveal={() => streamSection("amour", setAmourText, setAmourLoading)}
            />
          ) : (
            <PaywallGate feature="vip">{null}</PaywallGate>
          )
        )}

        {/* Carrière */}
        {activeTab === "carriere" && (
          <StreamSection
            title="Vocation & Carrière"
            buttonLabel="Révéler ma vocation"
            text={carriereText}
            loading={carriereLoading}
            onReveal={() => streamSection("carriere", setCarriereText, setCarriereLoading)}
          />
        )}
      </div>
    </main>
  );
}
