"use client";
import { authFetch } from '@/lib/api-client';
import { useState } from "react";
import Link from "next/link";
import { CRYSTALS, CRYSTAL_SPREADS, drawCrystals, type CrystalSpread, type Crystal } from "@/lib/lithotherapie";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Sparkles, ArrowLeft, RotateCcw, Gem, Crown } from "lucide-react";

type DrawnCrystal = Crystal & { position: string };

/** Faceted gem SVG — replaces plain colored circles */
function GemSVG({ colorHex, size = 44 }: { colorHex: string; size?: number }) {
  const w = size * 0.82;
  const h = size;
  const cx = w / 2;
  const uid = colorHex.replace("#", "g");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }} aria-hidden="true">
      <defs>
        <linearGradient id={uid} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={colorHex} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colorHex} stopOpacity="0.45" />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Outer gem body — hexagonal pendant cut */}
      <polygon
        points={`${cx},2 ${w-2},${h*0.28} ${w-1.5},${h*0.66} ${cx},${h-2} 1.5,${h*0.66} 2,${h*0.28}`}
        fill={`url(#${uid})`}
        filter={`url(#glow-${uid})`}
      />
      {/* Table face */}
      <polygon
        points={`${cx},${h*0.2} ${cx+w*0.3},${h*0.38} ${cx+w*0.28},${h*0.62} ${cx},${h*0.72} ${cx-w*0.28},${h*0.62} ${cx-w*0.3},${h*0.38}`}
        fill={colorHex} opacity="0.38"
      />
      {/* Crown band */}
      <polygon
        points={`${cx},2 ${w-2},${h*0.28} ${cx+w*0.3},${h*0.38} ${cx},${h*0.2} ${cx-w*0.3},${h*0.38} 2,${h*0.28}`}
        fill="rgba(255,255,255,0.18)"
      />
      {/* Right crown lighter */}
      <polygon
        points={`${cx},2 ${w-2},${h*0.28} ${cx+w*0.3},${h*0.38} ${cx},${h*0.2}`}
        fill="rgba(255,255,255,0.15)"
      />
      {/* Pavilion */}
      <polygon
        points={`${cx},${h-2} 1.5,${h*0.66} ${cx-w*0.28},${h*0.62} ${cx},${h*0.72} ${cx+w*0.28},${h*0.62} ${w-1.5},${h*0.66}`}
        fill={colorHex} opacity="0.28"
      />
      {/* Specular highlight */}
      <polygon points={`${cx},2 ${cx+w*0.28},${h*0.22} ${cx+w*0.18},${h*0.3} ${cx},${h*0.2}`} fill="rgba(255,255,255,0.55)" />
      <circle cx={cx * 0.68} cy={h * 0.2} r={w * 0.11} fill="rgba(255,255,255,0.65)" />
      <circle cx={cx * 0.65} cy={h * 0.17} r={w * 0.055} fill="white" />
    </svg>
  );
}

function PremiumWall({ title, message }: { title: string; message: string }) {
  return (
    <div className="max-w-lg mx-auto text-center px-6 py-20">
      <Crown size={40} className="text-[#d4af6f] mx-auto mb-6" />
      <div className="badge-gold mb-5">Premium</div>
      <h2 className="font-serif-display text-3xl text-gradient-cream mb-4">{title}</h2>
      <p className="font-serif-text italic text-[#c9b88a] mb-8">{message}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/tarifs" className="btn-gold"><Crown size={14} /><span>Voir les offres</span></Link>
        <Link href="/mon-profil" className="btn-outline-gold"><span>Mon profil</span></Link>
      </div>
    </div>
  );
}

function CrystalCard({
  crystal,
  revealed,
  onClick,
}: {
  crystal: DrawnCrystal;
  revealed: boolean;
  onClick: () => void;
}) {
  const glowColor = crystal.colorHex;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] text-center max-w-[130px] font-serif-display">
        {crystal.position}
      </div>
      <div
        onClick={() => !revealed && onClick()}
        className={`w-28 h-36 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative ${
          revealed
            ? "border-2"
            : "border border-[rgba(212,175,111,0.3)] bg-gradient-to-b from-[#1a1234] to-[#0d0820] hover:border-[#d4af6f] hover:shadow-[0_0_18px_rgba(212,175,111,0.15)]"
        }`}
        style={
          revealed
            ? {
                borderColor: glowColor,
                boxShadow: `0 0 32px ${glowColor}44, 0 0 10px ${glowColor}22`,
                background: `radial-gradient(ellipse at 50% 40%, ${glowColor}18 0%, rgba(13,8,32,0.95) 70%)`,
              }
            : undefined
        }
      >
        {revealed ? (
          <>
            <div className="mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              <GemSVG colorHex={crystal.colorHex} size={46} />
            </div>
            <div className="text-[11px] font-serif-display text-center text-[#e8c875] px-2 leading-tight mt-1">
              {crystal.name}
            </div>
            <div className="text-[9px] font-serif-text italic text-[#c9b88a] mt-0.5">{crystal.nameEn}</div>
            <div
              className="mt-2 px-2 py-0.5 rounded-full text-[8px] tracking-wide font-medium"
              style={{ backgroundColor: `${glowColor}28`, color: glowColor, border: `1px solid ${glowColor}55` }}
            >
              {crystal.chakra}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="text-xl text-[#d4af6f]">✦</div>
            <div className="text-[9px] tracking-widest uppercase text-[#d4af6f]">Révéler</div>
          </div>
        )}
      </div>
      {revealed && (
        <div className="flex flex-wrap gap-1 max-w-[130px] justify-center">
          {crystal.keywords.slice(0, 2).map((k) => (
            <span key={k} className="text-[8px] tracking-wider text-[#c9b88a]">· {k}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LithotherapiePage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [step, setStep] = useState<"choose" | "question" | "draw" | "reading">("choose");
  const [selectedSpread, setSelectedSpread] = useState<CrystalSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [crystals, setCrystals] = useState<DrawnCrystal[]>([]);
  const [revealedCrystals, setRevealedCrystals] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSpreadSelect = (spread: CrystalSpread) => {
    setSelectedSpread(spread);
    setStep("question");
  };

  const handleDraw = () => {
    if (!selectedSpread) return;
    const drawn = drawCrystals(selectedSpread.count);
    const withPositions: DrawnCrystal[] = drawn.map((c, i) => ({
      ...c,
      position: selectedSpread.positions[i],
    }));
    setCrystals(withPositions);
    setRevealedCrystals(new Set());
    setReading("");
    setStep("draw");
  };

  const revealCrystal = (i: number) => setRevealedCrystals((p) => new Set([...p, i]));
  const revealAll = () => setRevealedCrystals(new Set(crystals.map((_, i) => i)));
  const allRevealed = revealedCrystals.size === crystals.length && crystals.length > 0;

  const getLecture = async () => {
    if (!selectedSpread) return;
    setIsStreaming(true);
    setReading("");
    setStep("reading");
    const crystalData = crystals.map((c, i) => ({
      name: c.name,
      colorHex: c.colorHex,
      chakra: c.chakra,
      position: selectedSpread.positions[i],
      keywords: c.keywords,
      properties: c.properties,
    }));
    try {
      const res = await authFetch("/api/lithotherapie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crystals: crystalData, question, spreadName: selectedSpread.name, profile }),
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
      addReading({ type: "lithotherapie", title: selectedSpread.name, content: full, meta: { question } });
    } catch {
      setReading("Les cristaux gardent leur silence... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStep("choose");
    setCrystals([]);
    setRevealedCrystals(new Set());
    setReading("");
    setQuestion("");
    setSelectedSpread(null);
  };

  if (!isHydrated) return null;

  if (!profile) {
    return (
      <PremiumWall
        title="Lithothérapie"
        message="Inscrivez-vous gratuitement pour des lectures de cristaux personnalisées."
      />
    );
  }

  if (!canAccessFeature(profile.subscription, "premium")) {
    return (
      <PremiumWall
        title="Lithothérapie — Abonnement requis"
        message="Les lectures de cristaux avec interprétation IA sont réservées aux membres Mystique."
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {step === "choose" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Gem size={11} className="inline mr-2" />
              Guérison Vibratoire
            </div>
            <div className="font-serif-display text-7xl text-[#d4af6f] mb-5 float-slow">✦</div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
              Lithothérapie
            </h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              30 cristaux · Guérison vibratoire
            </p>
          </div>

          <div className="luxe-card rounded-sm p-7 mb-12">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-5">
              Bibliothèque de cristaux · 30 pierres
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {CRYSTALS.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col items-center gap-1.5 cursor-help group"
                  title={`${c.name} — ${c.chakra}`}
                >
                  <div
                    className="transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                    style={{ filter: `drop-shadow(0 0 4px ${c.colorHex}66)` }}
                  >
                    <GemSVG colorHex={c.colorHex} size={28} />
                  </div>
                  <div className="text-[7.5px] tracking-wide text-center text-[#8a6f3a] max-w-[58px] leading-tight">
                    {c.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CRYSTAL_SPREADS.map((spread) => (
              <button
                key={spread.id}
                onClick={() => handleSpreadSelect(spread)}
                className="luxe-card rounded-sm p-6 text-left group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.12)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center group-hover:border-[#d4af6f] transition-colors">
                    <Gem size={18} className="text-[#d4af6f]" />
                  </div>
                  <span className="badge-soft !text-[9px]">
                    {spread.count} {spread.count === 1 ? "cristal" : "cristaux"}
                  </span>
                </div>
                <h3 className="font-serif-display text-lg text-cream group-hover:text-[#e8c875] transition-colors mb-2">
                  {spread.name}
                </h3>
                <p className="text-[13px] text-[#c9b88a] leading-relaxed">{spread.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "question" && selectedSpread && (
        <div className="max-w-2xl mx-auto fade-in-up">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-sm mx-auto mb-5 border border-[#d4af6f] flex items-center justify-center bg-[rgba(212,175,111,0.08)]">
              <Gem size={24} className="text-[#d4af6f]" />
            </div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-3">{selectedSpread.name}</h2>
            <p className="font-serif-text italic text-[#c9b88a] text-lg">{selectedSpread.description}</p>
          </div>

          <div className="luxe-card rounded-sm p-6 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Positions</div>
            <div className="flex flex-wrap gap-2">
              {selectedSpread.positions.map((p, i) => (
                <span key={i} className="badge-soft">
                  <span className="text-[#d4af6f] mr-1.5">{i + 1}.</span>
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="luxe-label">Votre question (optionnel)</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Concentrez-vous sur les cristaux avant de tirer..."
              rows={3}
              className="luxe-input resize-none"
            />
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => setStep("choose")} className="btn-ghost">
              <ArrowLeft size={13} className="inline mr-2" />
              <span>Retour</span>
            </button>
            <button onClick={handleDraw} className="btn-gold">
              <Sparkles size={14} />
              <span>Tirer les cristaux</span>
            </button>
          </div>
        </div>
      )}

      {(step === "draw" || step === "reading") && selectedSpread && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <h2 className="font-serif-display text-3xl text-gradient-cream mb-2">{selectedSpread.name}</h2>
            {question && <p className="font-serif-text italic text-[#c9b88a] mt-2">&ldquo;{question}&rdquo;</p>}
            {step === "draw" && !allRevealed && (
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">
                Cliquez sur chaque cristal pour le révéler
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-10 max-w-4xl mx-auto">
            {crystals.map((crystal, i) => (
              <CrystalCard
                key={`${crystal.id}-${i}`}
                crystal={crystal}
                revealed={revealedCrystals.has(i)}
                onClick={() => revealCrystal(i)}
              />
            ))}
          </div>

          {step === "draw" && (
            <div className="flex gap-3 justify-center flex-wrap">
              {!allRevealed && (
                <button onClick={revealAll} className="btn-outline-gold">
                  <span>Révéler tous les cristaux</span>
                </button>
              )}
              {allRevealed && (
                <button onClick={getLecture} className="btn-gold">
                  <Sparkles size={14} />
                  <span>Obtenir la lecture</span>
                </button>
              )}
              <button onClick={reset} className="btn-ghost">
                <RotateCcw size={13} className="inline mr-2" />
                <span>Recommencer</span>
              </button>
            </div>
          )}

          <ReadingResult text={reading} isStreaming={isStreaming} />

          {step === "reading" && !isStreaming && reading && (
            <div className="text-center mt-8">
              <button onClick={reset} className="btn-outline-gold">
                <RotateCcw size={13} className="inline mr-2" />
                <span>Nouveau tirage</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
