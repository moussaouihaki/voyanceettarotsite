"use client";
import { useState } from "react";
import { ELDER_FUTHARK, RUNE_SPREADS, drawRunes, type RuneSpread } from "@/lib/runes";
import ReadingResult from "@/components/ReadingResult";

type DrawnRune = typeof ELDER_FUTHARK[0] & { isReversed: boolean };

export default function RunesPage() {
  const [step, setStep] = useState<"choose" | "question" | "draw" | "reading">("choose");
  const [selectedSpread, setSelectedSpread] = useState<RuneSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [runes, setRunes] = useState<DrawnRune[]>([]);
  const [revealedRunes, setRevealedRunes] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSpreadSelect = (spread: RuneSpread) => {
    setSelectedSpread(spread);
    setStep("question");
  };

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
      const res = await fetch("/api/runes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runes: runeData, question, spreadName: selectedSpread.name }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setReading((p) => p + decoder.decode(value, { stream: true }));
      }
    } catch {
      setReading("Les runes gardent leur silence... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => { setStep("choose"); setRunes([]); setRevealedRunes(new Set()); setReading(""); setQuestion(""); setSelectedSpread(null); };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {step === "choose" && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4 float-anim">ᚠ</div>
            <h1 className="text-3xl font-bold text-purple-100 mb-2">Runes Nordiques</h1>
            <p className="text-purple-400 text-sm max-w-md mx-auto">Elder Futhark — 24 runes de la tradition vikingue. Consultez la sagesse d'Odin.</p>
          </div>

          {/* Rune alphabet preview */}
          <div className="mystical-card rounded-xl p-4 mb-8">
            <p className="text-xs text-purple-400 mb-3 text-center font-cinzel">Elder Futhark — Les 24 runes</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {ELDER_FUTHARK.map(r => (
                <div key={r.id} className="text-center group cursor-help relative">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/40 border border-purple-700/30 flex items-center justify-center text-xl text-yellow-300 hover:bg-purple-800/60 transition-all">
                    {r.symbol}
                  </div>
                  <div className="text-[9px] text-purple-500 mt-0.5">{r.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Spread selection */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {RUNE_SPREADS.map((spread) => (
              <button key={spread.id} onClick={() => handleSpreadSelect(spread)}
                className="mystical-card rounded-xl p-5 text-left hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.3)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{spread.emoji}</span>
                  <span className="text-xs bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full">{spread.count} {spread.count === 1 ? "rune" : "runes"}</span>
                </div>
                <h3 className="font-cinzel font-bold text-yellow-300 text-sm mb-2">{spread.name}</h3>
                <p className="text-purple-400/70 text-xs leading-relaxed">{spread.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "question" && selectedSpread && (
        <div className="max-w-xl mx-auto text-center fade-in-up">
          <div className="text-4xl mb-4">{selectedSpread.emoji}</div>
          <h2 className="text-2xl font-bold text-purple-100 mb-2 font-cinzel">{selectedSpread.name}</h2>
          <p className="text-purple-400 text-sm mb-8">{selectedSpread.description}</p>
          <div className="mystical-card rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-purple-400 mb-2 font-cinzel">Positions :</p>
            <div className="flex flex-wrap gap-2">
              {selectedSpread.positions.map((p, i) => (
                <span key={i} className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded">{p}</span>
              ))}
            </div>
          </div>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)}
            placeholder="Votre question (optionnel) — Concentrez-vous sur Odin..."
            rows={3} className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl p-4 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 resize-none mb-6 text-sm" />
          <div className="flex gap-3 justify-center">
            <button onClick={() => setStep("choose")} className="px-6 py-3 rounded-xl border border-purple-700/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">← Retour</button>
            <button onClick={handleDraw} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold text-sm">Tirer les runes ᚠ</button>
          </div>
        </div>
      )}

      {(step === "draw" || step === "reading") && selectedSpread && (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-100 mb-1 font-cinzel">{selectedSpread.name}</h2>
            {question && <p className="text-purple-400 text-sm italic">"{question}"</p>}
          </div>

          <div className="flex flex-wrap justify-center gap-5 mb-8 max-w-3xl mx-auto">
            {runes.map((rune, i) => (
              <div key={rune.id} className="flex flex-col items-center gap-2">
                <div className="text-xs text-purple-400 font-cinzel text-center max-w-[100px]">{selectedSpread.positions[i]}</div>
                <div
                  onClick={() => !revealedRunes.has(i) && revealRune(i)}
                  className={`w-20 h-28 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${
                    revealedRunes.has(i)
                      ? "border-yellow-500/70 bg-gradient-to-b from-[#0d0025] to-[#1a0048]"
                      : "border-purple-600/60 bg-gradient-to-b from-[#12003a] to-[#0d0030] hover:border-purple-400"
                  }`}
                >
                  {revealedRunes.has(i) ? (
                    <>
                      <div className={`text-4xl text-yellow-300 font-bold ${rune.isReversed ? "rotate-180" : ""}`}>{rune.symbol}</div>
                      <div className="text-[10px] font-cinzel text-purple-300 mt-1">{rune.name}</div>
                      {rune.isReversed && <div className="text-[9px] text-red-400 mt-0.5">Inversée</div>}
                    </>
                  ) : (
                    <>
                      <div className="text-3xl text-purple-600">✦</div>
                      <div className="text-[10px] text-purple-600 mt-1">Cliquer</div>
                    </>
                  )}
                </div>
                {revealedRunes.has(i) && (
                  <div className="flex flex-wrap gap-1 max-w-[100px] justify-center">
                    {rune.keywords.slice(0, 2).map(k => (
                      <span key={k} className="text-[8px] text-purple-500 bg-purple-900/30 px-1 rounded">{k}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {step === "draw" && (
            <div className="flex gap-3 justify-center flex-wrap">
              {!allRevealed && <button onClick={revealAll} className="px-6 py-3 rounded-xl border border-purple-600/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">Révéler toutes</button>}
              {allRevealed && <button onClick={getLecture} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold">ᚠ Obtenir la lecture</button>}
              <button onClick={reset} className="px-5 py-3 rounded-xl border border-purple-700/30 text-purple-400 hover:bg-purple-900/20 transition-all text-sm">Recommencer</button>
            </div>
          )}

          <ReadingResult text={reading} isStreaming={isStreaming} />
          {step === "reading" && !isStreaming && reading && (
            <div className="text-center mt-6"><button onClick={reset} className="gradient-btn px-8 py-3 rounded-xl text-white text-sm">Nouveau tirage</button></div>
          )}
        </div>
      )}
    </div>
  );
}
