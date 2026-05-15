"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { ZODIAC_SIGNS, getSunSign, PLANETS } from "@/lib/astrology";
import { computeNatalChart, computeAspects, formatPosition, NatalChart, BirthData } from "@/lib/astro-engine";
import { geocodeCity, getTimezoneOffset } from "@/lib/geocoding";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Moon, Sun, Sparkles, ArrowUp, Gem, Wind, Flame, Droplet, Mountain, MapPin, Clock, Loader2, Triangle, Square, Star, Circle, Minus } from "lucide-react";

const ELEMENT_ICONS: Record<string, typeof Sparkles> = {
  Feu: Flame, Terre: Mountain, Air: Wind, Eau: Droplet,
};

const PLANET_SYMBOLS: Record<string, string> = {
  Soleil: "☉", Lune: "☽", Mercure: "☿", Vénus: "♀", Mars: "♂",
  Jupiter: "♃", Saturne: "♄", Uranus: "♅", Neptune: "♆", Pluton: "♇",
};

const ASPECT_ICONS: Record<string, typeof Sparkles> = {
  conjonction: Circle, sextile: Star, carré: Square, trigone: Triangle, opposition: Minus,
};

const ASPECT_COLORS: Record<string, string> = {
  conjonction: "#d4af6f", sextile: "#8bc4a8", carré: "#c07070", trigone: "#8bb8d4", opposition: "#c085c0",
};

const MOON_SIGNS = ZODIAC_SIGNS.map((s) => s.name);

interface GeoState {
  lat: number; lon: number; tz: number; displayName: string;
}

export default function ProfilAstralPage() {
  const { profile, addReading } = useUserProfile();
  const [prenom, setPrenom] = useState(profile?.prenom || "");
  const [dateNaissance, setDateNaissance] = useState(profile?.dateNaissance || "");
  const [heureNaissance, setHeureNaissance] = useState(profile?.heureNaissance || "");
  const [villeInput, setVilleInput] = useState(profile?.villeNaissance || "");
  const [geo, setGeo] = useState<GeoState | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [step, setStep] = useState<"form" | "results">("form");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const geoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (profile) {
      setPrenom(profile.prenom);
      setDateNaissance(profile.dateNaissance);
      setHeureNaissance(profile.heureNaissance || "");
      setVilleInput(profile.villeNaissance);
    }
  }, [profile]);

  const resolveGeo = useCallback(async (city: string) => {
    if (!city.trim() || city.trim().length < 2) { setGeo(null); return; }
    setGeoLoading(true);
    setGeoError("");
    const result = await geocodeCity(city);
    if (!result) {
      setGeo(null);
      setGeoError("Ville introuvable. Essayez un nom plus précis.");
      setGeoLoading(false);
      return;
    }
    const tz = await getTimezoneOffset(result.lat, result.lon, dateNaissance || "2000-01-01");
    setGeo({ lat: result.lat, lon: result.lon, tz, displayName: result.displayName });
    setGeoLoading(false);
  }, [dateNaissance]);

  useEffect(() => {
    if (geoTimer.current) clearTimeout(geoTimer.current);
    if (!villeInput.trim()) { setGeo(null); setGeoError(""); return; }
    geoTimer.current = setTimeout(() => resolveGeo(villeInput), 700);
    return () => { if (geoTimer.current) clearTimeout(geoTimer.current); };
  }, [villeInput, resolveGeo]);

  const sunSign = dateNaissance ? getSunSign(dateNaissance) : null;

  const buildChart = useCallback((): NatalChart => {
    const birth: BirthData = {
      date: dateNaissance,
      time: heureNaissance || undefined,
      latitude: geo?.lat,
      longitude: geo?.lon,
      timezoneOffset: geo?.tz,
    };
    return computeNatalChart(birth);
  }, [dateNaissance, heureNaissance, geo]);

  const handleSubmit = () => {
    if (!prenom || !dateNaissance) return;
    const c = buildChart();
    setChart(c);
    setStep("results");
  };

  const getInterpretation = async () => {
    if (!sunSign || !chart) return;
    setIsStreaming(true);
    setReading("");
    const aspects = computeAspects(chart.planets);
    const topAspects = aspects.slice(0, 6).map(a => `${a.planet1} ${a.type} ${a.planet2} (orbe ${a.exactness.toFixed(1)}°)`).join(", ");
    const planetList = Object.entries(chart.planets)
      .map(([name, pos]) => `${name}: ${formatPosition(pos)}`)
      .join(", ");
    try {
      const res = await fetch("/api/profil-astral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom,
          dateNaissance,
          heureNaissance: heureNaissance || undefined,
          lieuNaissance: geo?.displayName || villeInput || undefined,
          signeSolaire: chart.planets.Soleil.sign,
          signeLunaire: chart.planets.Lune.sign,
          ascendant: heureNaissance && geo ? chart.ascendant.sign : undefined,
          midheaven: heureNaissance && geo ? chart.midheaven.sign : undefined,
          planets: planetList,
          aspects: topAspects,
        }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setReading((p) => p + chunk);
      }
      addReading({ type: "profil astral", title: `Thème natal de ${prenom}`, content: full });
    } catch {
      setReading("Les astres sont voilés… Réessayez dans quelques instants.");
    } finally {
      setIsStreaming(false);
    }
  };

  const hasFullChart = !!(heureNaissance && geo);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {step === "form" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Moon size={11} className="inline mr-2" />
              Carte du ciel natale
            </div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">Profil Astral</h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              Calcul astronomique réel de votre thème natal — positions planétaires précises, ascendant, maisons et aspects.
            </p>
          </div>

          <div className="max-w-xl mx-auto luxe-card rounded-sm p-8 space-y-5">
            <div className="text-center pb-4 border-b border-[rgba(212,175,111,0.15)]">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">Coordonnées de naissance</div>
              <p className="font-serif-text italic text-[#8a6f3a] text-sm">
                Date, heure et lieu permettent un thème natal complet avec ascendant
              </p>
            </div>

            <div>
              <label className="luxe-label">Prénom *</label>
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Votre prénom…" className="luxe-input" />
            </div>
            <div>
              <label className="luxe-label">Date de naissance *</label>
              <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} className="luxe-input" />
            </div>

            {dateNaissance && sunSign && (
              <div className="luxe-card-premium rounded-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-[#d4af6f] bg-[rgba(212,175,111,0.08)] flex items-center justify-center">
                  <span className="font-serif-display text-2xl text-[#d4af6f]">{sunSign.symbol}</span>
                </div>
                <div>
                  <div className="font-serif-display text-cream">{sunSign.name}</div>
                  <div className="text-[10px] tracking-wider text-[#c9b88a]">{sunSign.dates} · {sunSign.element}</div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[rgba(212,175,111,0.15)] space-y-4">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Pour l&apos;ascendant et les maisons</div>

              <div>
                <label className="luxe-label flex items-center gap-1.5">
                  <Clock size={11} />Heure de naissance
                </label>
                <input type="time" value={heureNaissance} onChange={(e) => setHeureNaissance(e.target.value)} className="luxe-input" />
              </div>

              <div>
                <label className="luxe-label flex items-center gap-1.5">
                  <MapPin size={11} />Lieu de naissance
                </label>
                <div className="relative">
                  <input
                    value={villeInput}
                    onChange={(e) => setVilleInput(e.target.value)}
                    placeholder="Paris, France…"
                    className="luxe-input pr-8"
                  />
                  {geoLoading && (
                    <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af6f] animate-spin" />
                  )}
                </div>
                {geo && !geoLoading && (
                  <p className="text-[10px] text-[#8bc4a8] mt-1 flex items-center gap-1">
                    <MapPin size={9} />
                    {geo.lat.toFixed(3)}°, {geo.lon.toFixed(3)}° · UTC{geo.tz >= 0 ? "+" : ""}{geo.tz}
                  </p>
                )}
                {geoError && !geoLoading && (
                  <p className="text-[10px] text-[#c07070] mt-1">{geoError}</p>
                )}
              </div>
            </div>

            <div className="pt-3">
              <button onClick={handleSubmit} disabled={!prenom || !dateNaissance} className="btn-gold w-full !justify-center">
                <Sparkles size={14} />
                <span>Calculer mon thème natal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "results" && sunSign && chart && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="font-serif-display text-7xl text-[#d4af6f] mb-3 float-slow">{sunSign.symbol}</div>
            <div className="badge-gold mb-3">Thème Natal Calculé</div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-2">{prenom}</h2>
            <p className="font-serif-text italic text-[#c9b88a]">
              {new Date(dateNaissance + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              {heureNaissance && ` · ${heureNaissance}`}
              {geo && ` · ${villeInput}`}
            </p>
          </div>

          {/* Trinité Asc/Sol/Lune */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                label: "Signe Solaire", Icon: Sun,
                sign: chart.planets.Soleil.sign, symbol: chart.planets.Soleil.symbol,
                pos: formatPosition(chart.planets.Soleil), desc: "Identité consciente",
              },
              {
                label: "Signe Lunaire", Icon: Moon,
                sign: chart.planets.Lune.sign, symbol: chart.planets.Lune.symbol,
                pos: formatPosition(chart.planets.Lune), desc: "Émotions & instincts",
              },
              {
                label: "Ascendant", Icon: ArrowUp,
                sign: hasFullChart ? chart.ascendant.sign : "—",
                symbol: hasFullChart ? chart.ascendant.symbol : "↑",
                pos: hasFullChart ? formatPosition(chart.ascendant) : "Heure + lieu requis",
                desc: "Première impression",
              },
            ].map(({ label, Icon, sign, symbol, pos, desc }) => (
              <div key={label} className="luxe-card rounded-sm p-6 text-center">
                <Icon size={18} className="text-[#d4af6f] mx-auto mb-3" />
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">{label}</div>
                <div className="font-serif-display text-4xl text-[#d4af6f] mb-2">{symbol}</div>
                <div className="font-serif-display text-lg text-cream mb-1">{sign}</div>
                <div className="text-[11px] text-[#c9b88a] mb-1">{desc}</div>
                <div className="text-[10px] tracking-wider text-[#8a6f3a]">{pos}</div>
              </div>
            ))}
          </div>

          {/* Tableau planétaire complet */}
          <div className="luxe-card rounded-sm p-7 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-6">
              Positions planétaires calculées
            </div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-0">
              {Object.entries(chart.planets).map(([name, pos]) => (
                <div key={name} className="flex items-center gap-3 py-2.5 border-b border-[rgba(212,175,111,0.08)] last:border-0">
                  <span className="font-serif-display text-[#d4af6f] text-lg w-6 text-center">{PLANET_SYMBOLS[name] || "·"}</span>
                  <span className="text-cream text-[13px] w-20 shrink-0">{name}</span>
                  <span className="text-[#c9b88a] text-[12px]">{formatPosition(pos)}</span>
                </div>
              ))}
              {hasFullChart && (
                <>
                  <div className="flex items-center gap-3 py-2.5 border-b border-[rgba(212,175,111,0.08)]">
                    <span className="font-serif-display text-[#d4af6f] text-lg w-6 text-center">↑</span>
                    <span className="text-cream text-[13px] w-20 shrink-0">Ascendant</span>
                    <span className="text-[#c9b88a] text-[12px]">{formatPosition(chart.ascendant)}</span>
                  </div>
                  <div className="flex items-center gap-3 py-2.5 border-b border-[rgba(212,175,111,0.08)]">
                    <span className="font-serif-display text-[#d4af6f] text-lg w-6 text-center">MC</span>
                    <span className="text-cream text-[13px] w-20 shrink-0">Milieu du ciel</span>
                    <span className="text-[#c9b88a] text-[12px]">{formatPosition(chart.midheaven)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Aspects */}
          {(() => {
            const aspects = computeAspects(chart.planets).slice(0, 8);
            return aspects.length > 0 ? (
              <div className="luxe-card rounded-sm p-7 mb-8">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-6">Aspects principaux</div>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-0">
                  {aspects.map((asp, i) => {
                    const Icon = ASPECT_ICONS[asp.type] || Star;
                    const color = ASPECT_COLORS[asp.type] || "#d4af6f";
                    return (
                      <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[rgba(212,175,111,0.08)] last:border-0">
                        <Icon size={12} style={{ color }} className="shrink-0" />
                        <span className="text-cream text-[12px]">{asp.planet1} — {asp.planet2}</span>
                        <span className="text-[#8a6f3a] text-[11px] ml-auto capitalize">{asp.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null;
          })()}

          {/* Maisons (si disponibles) */}
          {hasFullChart && chart.houses.length === 12 && (
            <div className="luxe-card rounded-sm p-7 mb-8">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-6">Les 12 Maisons (Whole Sign)</div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {chart.houses.map((house, i) => (
                  <div key={i} className="text-center p-3 bg-[rgba(212,175,111,0.04)] rounded-sm border border-[rgba(212,175,111,0.1)]">
                    <div className="text-[9px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-1">Maison {i + 1}</div>
                    <div className="font-serif-display text-[#d4af6f] text-lg">{house.symbol}</div>
                    <div className="text-cream text-[11px]">{house.sign}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profil détaillé signe solaire */}
          <div className="luxe-card-premium rounded-sm p-8 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">Profil détaillé · {sunSign.name}</div>
            <h3 className="font-serif-display text-2xl text-gradient-cream mb-4">{sunSign.symbol} {sunSign.name}</h3>
            <p className="font-serif-text text-[#e8dcc0] text-[15px] leading-relaxed italic mb-6">{sunSign.description}</p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-3">Forces</div>
                <div className="flex flex-wrap gap-1.5">
                  {sunSign.strengths.map((s) => <span key={s} className="badge-soft">+ {s}</span>)}
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-3">Défis</div>
                <div className="flex flex-wrap gap-1.5">
                  {sunSign.challenges.map((s) => <span key={s} className="badge-soft">− {s}</span>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-[rgba(212,175,111,0.15)] text-[12px]">
              {[
                { Icon: Sparkles, label: "Planète", value: sunSign.ruler },
                { Icon: ELEMENT_ICONS[sunSign.element] || Wind, label: "Élément", value: sunSign.element },
                { Icon: Moon, label: "Modalité", value: sunSign.modality },
                { Icon: Gem, label: "Pierre", value: sunSign.stone },
              ].map(({ Icon, label, value }) => (
                <div key={label}>
                  <div className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-1">
                    <Icon size={10} />{label}
                  </div>
                  <div className="text-cream">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="luxe-card rounded-sm p-7 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-5">Planètes & domaines de vie</div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
              {PLANETS.slice(0, 6).map((p) => (
                <div key={p.name} className="flex items-start gap-3 py-2 border-b border-[rgba(212,175,111,0.08)] last:border-0">
                  <span className="font-serif-display text-[#d4af6f] min-w-[100px]">{p.name.replace(/\s*[☀🌙☿♀♂♃♄♅♆♇]\s*/g, "").trim()}</span>
                  <span className="text-[#c9b88a]">{p.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-8">
            {!reading && !isStreaming && (
              <button onClick={getInterpretation} className="btn-gold">
                <Sparkles size={14} />
                <span>Interprétation IA complète</span>
              </button>
            )}
            <button onClick={() => { setStep("form"); setReading(""); setChart(null); }} className="btn-ghost">
              <span>Modifier</span>
            </button>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}
    </div>
  );
}
