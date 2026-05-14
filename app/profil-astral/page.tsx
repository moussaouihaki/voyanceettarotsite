"use client";
import { useState, useEffect } from "react";
import { ZODIAC_SIGNS, getSunSign, PLANETS } from "@/lib/astrology";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Moon, Sun, Sparkles, ArrowUp, Gem, Wind, Flame, Droplet, Mountain } from "lucide-react";

const ELEMENT_ICONS: Record<string, typeof Sparkles> = {
  Feu: Flame,
  Terre: Mountain,
  Air: Wind,
  Eau: Droplet,
};

const MOON_SIGNS = ZODIAC_SIGNS.map(s => s.name);

export default function ProfilAstralPage() {
  const { profile, addReading } = useUserProfile();
  const [prenom, setPrenom] = useState(profile?.prenom || "");
  const [dateNaissance, setDateNaissance] = useState(profile?.dateNaissance || "");
  const [heureNaissance, setHeureNaissance] = useState(profile?.heureNaissance || "");
  const [lieuNaissance, setLieuNaissance] = useState(profile?.villeNaissance || "");
  const [signeLunaire, setSigneLunaire] = useState("");
  const [ascendant, setAscendant] = useState("");
  const [step, setStep] = useState<"form" | "results">("form");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (profile) {
      setPrenom(profile.prenom);
      setDateNaissance(profile.dateNaissance);
      setHeureNaissance(profile.heureNaissance || "");
      setLieuNaissance(profile.villeNaissance);
    }
  }, [profile]);

  const sunSign = dateNaissance ? getSunSign(dateNaissance) : null;

  const handleSubmit = () => {
    if (!prenom || !dateNaissance) return;
    setStep("results");
  };

  const getInterpretation = async () => {
    if (!sunSign) return;
    setIsStreaming(true);
    setReading("");
    try {
      const res = await fetch("/api/profil-astral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom, dateNaissance, heureNaissance, lieuNaissance,
          signeSolaire: sunSign.name,
          signeLunaire: signeLunaire || undefined,
          ascendant: ascendant || undefined,
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
      setReading("Les astres sont voilés... Réessayez dans quelques instants.");
    } finally {
      setIsStreaming(false);
    }
  };

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
              Découvrez votre thème astral complet — signe solaire, lunaire, ascendant et interprétation personnalisée.
            </p>
          </div>

          <div className="max-w-xl mx-auto luxe-card rounded-sm p-8 space-y-5">
            <div className="text-center pb-4 border-b border-[rgba(212,175,111,0.15)]">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">Vos coordonnées de naissance</div>
              <p className="font-serif-text italic text-[#8a6f3a] text-sm">
                Date, heure et lieu sont nécessaires pour un thème natal complet
              </p>
            </div>

            <div>
              <label className="luxe-label">Prénom *</label>
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Votre prénom..." className="luxe-input" />
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

            <div className="pt-4 border-t border-[rgba(212,175,111,0.15)]">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Optionnel — lecture complète</div>
              <div className="space-y-4">
                <div>
                  <label className="luxe-label">Heure de naissance</label>
                  <input type="time" value={heureNaissance} onChange={(e) => setHeureNaissance(e.target.value)} className="luxe-input" />
                </div>
                <div>
                  <label className="luxe-label">Lieu de naissance</label>
                  <input value={lieuNaissance} onChange={(e) => setLieuNaissance(e.target.value)} placeholder="Paris, France..." className="luxe-input" />
                </div>
                <div>
                  <label className="luxe-label">Signe Lunaire (si connu)</label>
                  <select value={signeLunaire} onChange={(e) => setSigneLunaire(e.target.value)} className="luxe-input">
                    <option value="">Sélectionner...</option>
                    {MOON_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="luxe-label">Ascendant (si connu)</label>
                  <select value={ascendant} onChange={(e) => setAscendant(e.target.value)} className="luxe-input">
                    <option value="">Sélectionner...</option>
                    {MOON_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button onClick={handleSubmit} disabled={!prenom || !dateNaissance} className="btn-gold w-full !justify-center">
                <Sparkles size={14} />
                <span>Voir mon profil astral</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "results" && sunSign && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="font-serif-display text-7xl text-[#d4af6f] mb-3 float-slow">{sunSign.symbol}</div>
            <div className="badge-gold mb-3">Profil Astral</div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-2">{prenom}</h2>
            <p className="font-serif-text italic text-[#c9b88a]">
              {new Date(dateNaissance + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { label: "Signe Solaire", Icon: Sun, sign: sunSign.name, symbol: sunSign.symbol, sub: sunSign.dates, desc: "Identité consciente" },
              { label: "Signe Lunaire", Icon: Moon, sign: signeLunaire || "Non calculé", symbol: signeLunaire ? ZODIAC_SIGNS.find(s => s.name === signeLunaire)?.symbol || "☽" : "☽", sub: signeLunaire ? "Émotions profondes" : "Heure de naissance requise", desc: "Émotions & instincts" },
              { label: "Ascendant", Icon: ArrowUp, sign: ascendant || "Non calculé", symbol: ascendant ? ZODIAC_SIGNS.find(s => s.name === ascendant)?.symbol || "↑" : "↑", sub: ascendant ? "Masque social" : "Heure + lieu requis", desc: "Première impression" },
            ].map(({ label, Icon, sign, symbol, sub, desc }) => (
              <div key={label} className="luxe-card rounded-sm p-6 text-center">
                <Icon size={18} className="text-[#d4af6f] mx-auto mb-3" />
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">{label}</div>
                <div className="font-serif-display text-4xl text-[#d4af6f] mb-2">{symbol}</div>
                <div className="font-serif-display text-lg text-cream mb-1">{sign}</div>
                <div className="text-[11px] text-[#c9b88a] mb-1">{desc}</div>
                <div className="text-[10px] tracking-wider text-[#8a6f3a]">{sub}</div>
              </div>
            ))}
          </div>

          <div className="luxe-card-premium rounded-sm p-8 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">Profil détaillé · {sunSign.name}</div>
            <h3 className="font-serif-display text-2xl text-gradient-cream mb-4">{sunSign.symbol} {sunSign.name}</h3>
            <p className="font-serif-text text-[#e8dcc0] text-[15px] leading-relaxed italic mb-6">{sunSign.description}</p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-3">Forces</div>
                <div className="flex flex-wrap gap-1.5">
                  {sunSign.strengths.map(s => <span key={s} className="badge-soft">+ {s}</span>)}
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-3">Défis</div>
                <div className="flex flex-wrap gap-1.5">
                  {sunSign.challenges.map(s => <span key={s} className="badge-soft">− {s}</span>)}
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
                    <Icon size={10} />
                    {label}
                  </div>
                  <div className="text-cream">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="luxe-card rounded-sm p-7 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-5">Planètes & domaines de vie</div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
              {PLANETS.slice(0, 6).map(p => (
                <div key={p.name} className="flex items-start gap-3 py-2 border-b border-[rgba(212,175,111,0.08)] last:border-0">
                  <span className="font-serif-display text-[#d4af6f] min-w-[100px]">{p.name.replace(/\s*[☀🌙☿♀♂♃♄♅♆♇]\s*/g, '').trim()}</span>
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
            <button onClick={() => { setStep("form"); setReading(""); }} className="btn-ghost">
              <span>Modifier</span>
            </button>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}
    </div>
  );
}
