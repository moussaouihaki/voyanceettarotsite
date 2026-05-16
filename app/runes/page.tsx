"use client";
import { authFetch } from '@/lib/api-client';
import { useState } from "react";
import Link from "next/link";
import { ELDER_FUTHARK, RUNE_SPREADS, drawRunes, type RuneSpread } from "@/lib/runes";
import { getRuneSpreadIcon } from "@/lib/spread-icons";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import RuneCardArt from "@/components/RuneCardArt";
import { Sparkles, ArrowLeft, RotateCcw, Flame, Crown } from "lucide-react";

type DrawnRune = typeof ELDER_FUTHARK[0] & { isReversed: boolean };

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

export default function RunesPage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [step, setStep] = useState<"choose" | "question" | "draw" | "reading">("choose");
  const [selectedSpread, setSelectedSpread] = useState<RuneSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [runes, setRunes] = useState<DrawnRune[]>([]);
  const [revealedRunes, setRevealedRunes] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSpreadSelect = (spread: RuneSpread) => { setSelectedSpread(spread); setStep("question"); };

  const handleDraw = () => {
    if (!selectedSpread) return;
    setRunes(drawRunes(selectedSpread.count));
    setRevealedRunes(new Set());
    setReading("");
    setStep("draw");
  };

  const revealRune = (i: number) => setRevealedRunes((p) => new Set([...p, i]));
  const revealAll = () => setRevealedRunes(new Set(runes.map((_, i) => i)));
  const allRevealed = revealedRunes.size === runes.length && runes.length > 0;

  const getLecture = async () => {
    if (!selectedSpread) return;
    setIsStreaming(true);
    setReading("");
    setStep("reading");
    const runeData = runes.map((r, i) => ({
      name: r.name, symbol: r.symbol,
      position: selectedSpread.positions[i],
      reversed: r.isReversed, keywords: r.keywords,
    }));
    try {
      const res = await authFetch("/api/runes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runes: runeData, question, spreadName: selectedSpread.name, profile }),
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
      addReading({ type: "runes", title: selectedSpread.name, content: full, meta: { question } });
    } catch {
      setReading("Les runes gardent leur silence... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => { setStep("choose"); setRunes([]); setRevealedRunes(new Set()); setReading(""); setQuestion(""); setSelectedSpread(null); };

  if (!isHydrated) return null;

  if (!profile) {
    return <PremiumWall title="Lectures de Runes" message="Inscrivez-vous gratuitement pour des lectures de runes personnalisées." />;
  }

  if (!canAccessFeature(profile.subscription, "premium")) {
    return <PremiumWall title="Runes — Abonnement requis" message="Les lectures de runes avec interprétation IA sont réservées aux membres Mystique." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {step === "choose" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Flame size={11} className="inline mr-2" />
              Sagesse Nordique
            </div>
            <div className="font-serif-display text-7xl text-[#d4af6f] mb-5 float-slow">ᚠ</div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">Runes Nordiques</h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              Elder Futhark — les 24 runes de la tradition vikingue. Consultez la sagesse d&apos;Odin.
            </p>
          </div>

          <div className="luxe-card rounded-sm p-7 mb-12">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-5">Elder Futhark · Les 24 runes</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {ELDER_FUTHARK.map(r => (
                <div key={r.id} className="group cursor-help hover:-translate-y-0.5 transition-transform">
                  <RuneCardArt rune={r} size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RUNE_SPREADS.map((spread) => {
              const Icon = getRuneSpreadIcon(spread.id);
              return (
                <button
                  key={spread.id}
                  onClick={() => handleSpreadSelect(spread)}
                  className="luxe-card rounded-sm p-6 text-left group"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.12)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center group-hover:border-[#d4af6f] transition-colors">
                      <Icon size={18} className="text-[#d4af6f]" />
                    </div>
                    <span className="badge-soft !text-[9px]">
                      {spread.count} {spread.count === 1 ? "rune" : "runes"}
                    </span>
                  </div>
                  <h3 className="font-serif-display text-lg text-cream group-hover:text-[#e8c875] transition-colors mb-2">
                    {spread.name}
                  </h3>
                  <p className="text-[13px] text-[#c9b88a] leading-relaxed">{spread.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === "question" && selectedSpread && (
        <div className="max-w-2xl mx-auto fade-in-up">
          <div className="text-center mb-10">
            {(() => {
              const Icon = getRuneSpreadIcon(selectedSpread.id);
              return (
                <div className="w-16 h-16 rounded-sm mx-auto mb-5 border border-[#d4af6f] flex items-center justify-center bg-[rgba(212,175,111,0.08)]">
                  <Icon size={24} className="text-[#d4af6f]" />
                </div>
              );
            })()}
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
              placeholder="Concentrez-vous sur Odin avant de tirer..."
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
              <span>Tirer les runes</span>
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
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">Cliquez sur chaque rune pour la révéler</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-10 max-w-4xl mx-auto">
            {runes.map((rune, i) => (
              <div key={rune.id} className="flex flex-col items-center gap-3">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] text-center max-w-[110px] font-serif-display">
                  {selectedSpread.positions[i]}
                </div>
                <div
                  onClick={() => !revealedRunes.has(i) && revealRune(i)}
                  className={`cursor-pointer transition-all duration-500 ${
                    revealedRunes.has(i) ? "shadow-[0_0_20px_rgba(212,175,111,0.2)] -translate-y-1" : "hover:-translate-y-0.5 opacity-75 hover:opacity-100"
                  }`}
                >
                  <RuneCardArt
                    rune={rune}
                    size="lg"
                    revealed={revealedRunes.has(i)}
                    reversed={rune.isReversed}
                  />
                </div>
                {revealedRunes.has(i) && (
                  <div className="flex flex-wrap gap-1 max-w-[110px] justify-center">
                    {rune.keywords.slice(0, 2).map(k => (
                      <span key={k} className="text-[8px] tracking-wider text-[#c9b88a]">· {k}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {step === "draw" && (
            <div className="flex gap-3 justify-center flex-wrap">
              {!allRevealed && (
                <button onClick={revealAll} className="btn-outline-gold">
                  <span>Révéler toutes les runes</span>
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
