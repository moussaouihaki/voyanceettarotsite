"use client";
import { authFetch } from '@/lib/api-client';
import { useState } from "react";
import Link from "next/link";
import { OGHAM_STAVES, OGHAM_SPREADS, drawOgham, type OghamSpread, type OghamStave } from "@/lib/ogham";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import OghamCardArt from "@/components/OghamCardArt";
import { Sparkles, ArrowLeft, RotateCcw, Leaf, Crown, Hourglass, Plus } from "lucide-react";
import DeckShuffle from "@/components/DeckShuffle";
import GenericDeckPick from "@/components/GenericDeckPick";

function getOghamSpreadIcon(id: string) {
  const icons: Record<string, typeof Leaf> = {
    "fid-unique":         Leaf,
    "triades-celtiques":  Hourglass,
    "croix-celtique":     Plus,
  };
  return icons[id] ?? Sparkles;
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

export default function OghamPage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [step, setStep] = useState<"choose" | "question" | "shuffle" | "pick" | "draw" | "reading">("choose");
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [selectedSpread, setSelectedSpread] = useState<OghamSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [staves, setStaves] = useState<OghamStave[]>([]);
  const [revealedStaves, setRevealedStaves] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSpreadSelect = (spread: OghamSpread) => { setSelectedSpread(spread); setStep("question"); };

  const handleDraw = () => {
    if (!selectedSpread) return;
    setStaves(drawOgham(selectedSpread.count));
    setRevealedStaves(new Set());
    setReading("");
    setStep("draw");
  };

  const handleShuffleDone = () => {
    const indices = Array.from({ length: 25 }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
    setStep("pick");
  };

  const handlePickDone = (indices: number[]) => {
    if (!selectedSpread) return;
    setStaves(indices.map((idx) => OGHAM_STAVES[idx]));
    setRevealedStaves(new Set());
    setReading("");
    setStep("draw");
  };

  const revealStave = (i: number) => setRevealedStaves((p) => new Set([...p, i]));
  const revealAll = () => setRevealedStaves(new Set(staves.map((_, i) => i)));
  const allRevealed = revealedStaves.size === staves.length && staves.length > 0;

  const getLecture = async () => {
    if (!selectedSpread) return;
    setIsStreaming(true);
    setReading("");
    setStep("reading");
    const staveData = staves.map((s, i) => ({
      name: s.name,
      tree: s.tree,
      symbol: s.letter,
      position: selectedSpread.positions[i],
      keywords: s.keywords,
      meaning: s.meaning,
    }));
    try {
      const res = await authFetch("/api/ogham", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staves: staveData, question, spreadName: selectedSpread.name, profile }),
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
      addReading({ type: "ogham", title: selectedSpread.name, content: full, meta: { question } });
    } catch {
      setReading("Les staves gardent leur silence... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStep("choose");
    setStaves([]);
    setRevealedStaves(new Set());
    setReading("");
    setQuestion("");
    setSelectedSpread(null);
    setShuffledIndices([]);
  };

  if (!isHydrated) return null;

  if (!profile) {
    return <PremiumWall title="Ogham Celtique" message="Inscrivez-vous gratuitement pour des lectures oghamiques personnalisées." />;
  }

  if (!canAccessFeature(profile.subscription, "premium")) {
    return <PremiumWall title="Ogham — Abonnement requis" message="Les lectures d'Ogham avec interprétation IA sont réservées aux membres Premium." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {step === "choose" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Leaf size={11} className="inline mr-2" />
              Sagesse Druidique
            </div>
            <div className="font-serif-display text-7xl text-[#4a7c59] mb-5 float-slow">ᚇ</div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">Ogham Celtique</h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              25 feadha · Tradition druidique · La sagesse de la forêt sacrée
            </p>
          </div>

          <div className="luxe-card rounded-sm p-7 mb-12">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#4a7c59] text-center mb-5">Les 25 Staves Oghamiques</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {OGHAM_STAVES.map((s) => (
                <div key={s.id} className="group cursor-help hover:-translate-y-0.5 transition-transform">
                  <OghamCardArt fid={s} size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OGHAM_SPREADS.map((spread) => {
              const Icon = getOghamSpreadIcon(spread.id);
              return (
                <button
                  key={spread.id}
                  onClick={() => handleSpreadSelect(spread)}
                  className="luxe-card rounded-sm p-6 text-left group"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-[rgba(74,124,89,0.12)] to-transparent border border-[rgba(74,124,89,0.3)] flex items-center justify-center group-hover:border-[#4a7c59] transition-colors">
                      <Icon size={18} className="text-[#4a7c59]" />
                    </div>
                    <span className="badge-soft !text-[9px]">
                      {spread.count} {spread.count === 1 ? "stave" : "staves"}
                    </span>
                  </div>
                  <h3 className="font-serif-display text-lg text-cream group-hover:text-[#6aab7a] transition-colors mb-2">
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
              const Icon = getOghamSpreadIcon(selectedSpread.id);
              return (
                <div className="w-16 h-16 rounded-sm mx-auto mb-5 border border-[#4a7c59] flex items-center justify-center bg-[rgba(74,124,89,0.08)]">
                  <Icon size={24} className="text-[#4a7c59]" />
                </div>
              );
            })()}
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-3">{selectedSpread.name}</h2>
            <p className="font-serif-text italic text-[#c9b88a] text-lg">{selectedSpread.description}</p>
          </div>

          <div className="luxe-card rounded-sm p-6 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#4a7c59] mb-4">Positions</div>
            <div className="flex flex-wrap gap-2">
              {selectedSpread.positions.map((p, i) => (
                <span key={i} className="badge-soft">
                  <span className="text-[#4a7c59] mr-1.5">{i + 1}.</span>
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
              placeholder="Concentrez-vous sur l'esprit de la forêt avant de tirer..."
              rows={3}
              className="luxe-input resize-none"
            />
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => setStep("choose")} className="btn-ghost">
              <ArrowLeft size={13} className="inline mr-2" />
              <span>Retour</span>
            </button>
            <button onClick={() => setStep("shuffle")} className="btn-gold">
              <Sparkles size={14} />
              <span>Mélanger et tirer</span>
            </button>
          </div>
        </div>
      )}

      {step === "shuffle" && selectedSpread && (
        <DeckShuffle onShuffleDone={handleShuffleDone} spreadName={selectedSpread.name} />
      )}

      {step === "pick" && selectedSpread && (
        <GenericDeckPick
          deckSize={25}
          count={selectedSpread.count}
          onPickDone={handlePickDone}
          cardLabel="stave"
        />
      )}

      {(step === "draw" || step === "reading") && selectedSpread && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <h2 className="font-serif-display text-3xl text-gradient-cream mb-2">{selectedSpread.name}</h2>
            {question && <p className="font-serif-text italic text-[#c9b88a] mt-2">&ldquo;{question}&rdquo;</p>}
            {step === "draw" && !allRevealed && (
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#4a7c59] mt-4">Cliquez sur chaque stave pour le révéler</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-10 max-w-4xl mx-auto">
            {staves.map((stave, i) => (
              <div key={stave.id} className="flex flex-col items-center gap-3">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#4a7c59] text-center max-w-[110px] font-serif-display">
                  {selectedSpread.positions[i]}
                </div>
                <div
                  onClick={() => !revealedStaves.has(i) && revealStave(i)}
                  className={`cursor-pointer transition-all duration-500 ${
                    revealedStaves.has(i) ? "shadow-[0_0_20px_rgba(74,124,89,0.25)] -translate-y-1" : "hover:-translate-y-0.5 opacity-75 hover:opacity-100"
                  }`}
                >
                  <OghamCardArt fid={stave} size="lg" revealed={revealedStaves.has(i)} />
                </div>
                {revealedStaves.has(i) && (
                  <div className="flex flex-wrap gap-1 max-w-[110px] justify-center">
                    {stave.keywords.slice(0, 2).map((k) => (
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
                  <span>Révéler tous les staves</span>
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
