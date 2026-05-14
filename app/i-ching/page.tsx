"use client";
import { useState } from "react";
import { HEXAGRAMS, consultIChing, type Hexagram } from "@/lib/iching";
import ReadingResult from "@/components/ReadingResult";

type Step = "intro" | "question" | "toss" | "result";

export default function IChingPage() {
  const [step, setStep] = useState<Step>("intro");
  const [question, setQuestion] = useState("");
  const [hexagram, setHexagram] = useState<Hexagram | null>(null);
  const [tossResults, setTossResults] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const tossCoin = async () => {
    if (tossResults.length >= 6 || isAnimating) return;
    setIsAnimating(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = consultIChing();
    const newResults = [...tossResults, result.lines[tossResults.length] ?? 1];
    setTossResults(newResults);
    setIsAnimating(false);
    if (newResults.length === 6) {
      setTimeout(() => {
        setHexagram(result);
        setStep("result");
      }, 800);
    }
  };

  const tossAll = async () => {
    const result = consultIChing();
    setTossResults(result.lines);
    setHexagram(result);
    setTimeout(() => setStep("result"), 500);
  };

  const getInterpretation = async () => {
    if (!hexagram) return;
    setIsStreaming(true);
    setReading("");
    try {
      const res = await fetch("/api/iching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hexagram, question }),
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
      setReading("Les esprits de l'I-Ching gardent le silence... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStep("intro");
    setQuestion("");
    setHexagram(null);
    setTossResults([]);
    setReading("");
  };

  const renderLine = (isYang: boolean, index: number) => (
    <div key={index} className="flex items-center justify-center gap-2 h-4">
      {isYang ? (
        <div className="h-1.5 w-24 bg-yellow-400 rounded-full" />
      ) : (
        <>
          <div className="h-1.5 w-10 bg-yellow-400/70 rounded-full" />
          <div className="w-2" />
          <div className="h-1.5 w-10 bg-yellow-400/70 rounded-full" />
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {step === "intro" && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4 float-anim">☯️</div>
            <h1 className="text-3xl font-bold text-purple-100 mb-2">I-Ching</h1>
            <p className="text-purple-400 text-sm max-w-md mx-auto">
              Le Livre des Transformations — oracle ancestral chinois. 64 hexagrammes révèlent la sagesse du Tao.
            </p>
          </div>

          {/* Hexagram preview grid */}
          <div className="mystical-card rounded-xl p-4 mb-8">
            <p className="text-xs text-purple-400 mb-3 text-center font-cinzel">Les 64 hexagrammes de l'I-Ching</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {HEXAGRAMS.slice(0, 32).map((h) => (
                <div key={h.number} title={`${h.number}. ${h.name}`}
                  className="w-8 h-8 rounded bg-purple-900/40 border border-purple-700/30 flex items-center justify-center text-xs text-yellow-300/70 hover:text-yellow-300 hover:bg-purple-800/60 transition-all cursor-help">
                  {h.symbol}
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8 text-center">
            {[
              { emoji: "🪙", title: "Tirage par pièces", desc: "Lancez 3 pièces 6 fois pour construire votre hexagramme" },
              { emoji: "📖", title: "64 hexagrammes", desc: "La totalité des situations et transformations possibles" },
              { emoji: "🤖", title: "Interprétation IA", desc: "La sagesse ancienne éclairée par l'intelligence artificielle" },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="mystical-card rounded-xl p-4">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="font-cinzel text-yellow-300 text-sm mb-1">{title}</div>
                <p className="text-purple-400 text-xs">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button onClick={() => setStep("question")} className="gradient-btn glow-btn px-10 py-4 rounded-xl text-white font-semibold text-lg">
              Consulter l'I-Ching ☯️
            </button>
          </div>
        </div>
      )}

      {step === "question" && (
        <div className="max-w-lg mx-auto text-center fade-in-up">
          <div className="text-4xl mb-4">🪙</div>
          <h2 className="text-2xl font-bold text-purple-100 mb-2 font-cinzel">Votre Question</h2>
          <p className="text-purple-400 text-sm mb-8">Concentrez-vous sur votre question. L'I-Ching répond aux situations, pas aux prédictions directes.</p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Quelle est votre situation ou question ? (optionnel)"
            rows={4}
            className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl p-4 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 resize-none mb-6 text-sm"
          />
          <div className="flex gap-3 justify-center">
            <button onClick={() => setStep("intro")} className="px-6 py-3 rounded-xl border border-purple-700/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">← Retour</button>
            <button onClick={() => setStep("toss")} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold">Lancer les pièces 🪙</button>
          </div>
        </div>
      )}

      {step === "toss" && (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-100 mb-1 font-cinzel">Construction de l'Hexagramme</h2>
            {question && <p className="text-purple-400 text-sm italic mt-1">"{question}"</p>}
            <p className="text-purple-500 text-xs mt-2">Ligne {tossResults.length + 1}/6 — de bas en haut</p>
          </div>

          {/* Lines built so far */}
          <div className="mystical-card rounded-xl p-6 mb-8 max-w-xs mx-auto">
            <div className="space-y-3 mb-4">
              {Array.from({ length: 6 }).map((_, i) => {
                const lineIndex = 5 - i;
                const filled = lineIndex < tossResults.length;
                const isYang = filled ? tossResults[lineIndex] === 1 : null;
                return (
                  <div key={i} className={`flex items-center justify-center gap-2 h-4 transition-all ${filled ? "opacity-100" : "opacity-20"}`}>
                    {filled && isYang !== null ? (
                      isYang ? (
                        <div className="h-1.5 w-24 bg-yellow-400 rounded-full" />
                      ) : (
                        <>
                          <div className="h-1.5 w-10 bg-yellow-400/70 rounded-full" />
                          <div className="w-2" />
                          <div className="h-1.5 w-10 bg-yellow-400/70 rounded-full" />
                        </>
                      )
                    ) : (
                      <div className="h-1.5 w-24 bg-purple-700/30 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-center text-xs text-purple-500">
              {tossResults.length === 0 ? "Lancez pour commencer" : `${tossResults.length}/6 lignes tracées`}
            </div>
          </div>

          {/* Coin toss button */}
          <div className="flex gap-3 justify-center flex-wrap">
            {tossResults.length < 6 && (
              <>
                <button
                  onClick={tossCoin}
                  disabled={isAnimating}
                  className={`gradient-btn glow-btn px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all ${isAnimating ? "scale-95 opacity-80" : ""}`}
                >
                  {isAnimating ? "🪙 ..." : "🪙 Lancer les pièces"}
                </button>
                <button onClick={tossAll} className="px-6 py-4 rounded-xl border border-purple-700/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">
                  Tirage automatique
                </button>
              </>
            )}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-6 text-xs text-purple-500">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-yellow-400 rounded" />
              <span>Yang (—)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-3 bg-yellow-400/70 rounded" />
              <div className="w-1" />
              <div className="h-1 w-3 bg-yellow-400/70 rounded" />
              <span>Yin (- -)</span>
            </div>
          </div>
        </div>
      )}

      {step === "result" && hexagram && (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2 font-mono">{hexagram.symbol}</div>
            <div className="text-xs text-purple-500 mb-4">Hexagramme {hexagram.number}/64</div>
            <h2 className="font-cinzel text-2xl text-yellow-300 mb-1">{hexagram.name}</h2>
            <p className="text-purple-300 text-sm">{hexagram.nameZh}</p>
            {question && <p className="text-purple-400 text-sm italic mt-2">"{question}"</p>}
          </div>

          {/* Hexagram display */}
          <div className="mystical-card rounded-2xl p-6 mb-6">
            <div className="flex gap-8 items-start">
              <div className="flex flex-col gap-3 min-w-[100px]">
                {Array.from({ length: 6 }).map((_, i) => {
                  const lineIndex = 5 - i;
                  return renderLine(hexagram.lines[lineIndex] === 1, i);
                })}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-1 mb-3">
                  {hexagram.keywords.map(k => (
                    <span key={k} className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded">{k}</span>
                  ))}
                </div>
                <p className="text-purple-200/80 text-sm mb-3">{hexagram.meaning}</p>
                <div className="space-y-2 text-xs text-purple-400">
                  <div><span className="text-purple-300 font-cinzel">Oracle : </span>{hexagram.judgment}</div>
                  <div><span className="text-purple-300 font-cinzel">Conseil : </span>{hexagram.advice}</div>
                  <div><span className="text-purple-300 font-cinzel">Élément : </span>{hexagram.element}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-6">
            {!reading && !isStreaming && (
              <button onClick={getInterpretation} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold">
                🔮 Interprétation approfondie IA
              </button>
            )}
            <button onClick={reset} className="px-6 py-3 rounded-xl border border-purple-700/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">
              Nouvelle consultation
            </button>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}
    </div>
  );
}
