"use client";
import { authFetch } from '@/lib/api-client';
import { useState } from "react";
import Link from "next/link";
import { CRYSTALS, CRYSTAL_SPREADS, drawCrystals, type CrystalSpread, type Crystal } from "@/lib/lithotherapie";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Sparkles, ArrowLeft, RotateCcw, Gem, Crown } from "lucide-react";

type DrawnCrystal = Crystal & { position: string };

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
      <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] text-center max-w-[120px] font-serif-display">
        {crystal.position}
      </div>
      <div
        onClick={() => !revealed && onClick()}
        className={`w-24 h-28 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative overflow-hidden ${
          revealed
            ? "border-2 bg-[rgba(13,8,32,0.8)]"
            : "border border-[rgba(212,175,111,0.3)] bg-gradient-to-b from-[#1a1234] to-[#0d0820] hover:border-[#d4af6f]"
        }`}
        style={
          revealed
            ? {
                borderColor: glowColor,
                boxShadow: `0 0 24px ${glowColor}55, 0 0 8px ${glowColor}33`,
                background: `radial-gradient(ellipse at center, ${glowColor}22 0%, rgba(13,8,32,0.9) 70%)`,
              }
            : undefined
        }
      >
        {revealed ? (
          <>
            <div
              className="w-10 h-10 rounded-full mb-2 flex-shrink-0"
              style={{ backgroundColor: `${glowColor}99`, boxShadow: `0 0 12px ${glowColor}66` }}
            />
            <div className="text-[11px] font-serif-display text-center text-[#e8c875] px-1 leading-tight">
              {crystal.name}
            </div>
            <div className="text-[9px] font-serif-text italic text-[#c9b88a] mt-0.5">{crystal.nameEn}</div>
            <div
              className="mt-2 px-2 py-0.5 rounded-full text-[8px] tracking-wide font-medium"
              style={{ backgroundColor: `${glowColor}33`, color: glowColor, border: `1px solid ${glowColor}66` }}
            >
              {crystal.chakra}
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl text-[rgba(212,175,111,0.5)]">✦</div>
            <div className="text-[9px] tracking-widest uppercase text-[rgba(212,175,111,0.5)] mt-2">Révéler</div>
          </>
        )}
      </div>
      {revealed && (
        <div className="flex flex-wrap gap-1 max-w-[120px] justify-center">
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
            <div className="flex flex-wrap gap-3 justify-center">
              {CRYSTALS.map((c) => (
                <div key={c.id} className="group cursor-help flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full border transition-all"
                    style={{
                      backgroundColor: `${c.colorHex}99`,
                      borderColor: `${c.colorHex}66`,
                      boxShadow: `0 0 6px ${c.colorHex}44`,
                    }}
                    title={`${c.name} — ${c.chakra}`}
                  />
                  <div className="text-[8px] tracking-wide text-center text-[#8a6f3a] max-w-[64px] leading-tight">
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
