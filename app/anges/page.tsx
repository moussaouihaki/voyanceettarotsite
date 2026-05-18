"use client";
import { authFetch } from "@/lib/api-client";
import { checkResponse, apiErrorMessage } from "@/lib/api-errors";
import { useState } from "react";
import Link from "next/link";
import { ANGEL_CARDS, ANGEL_SPREADS, type AngeCard, type AngelSpread } from "@/lib/anges";
import GenericDeckPick from "@/components/GenericDeckPick";
import DeckShuffle from "@/components/DeckShuffle";
import ReadingResult from "@/components/ReadingResult";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Sparkles, ArrowLeft, RotateCcw, Star } from "lucide-react";

export default function AngesPage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [step, setStep] = useState<"choose" | "question" | "shuffle" | "pick" | "draw" | "reading">("choose");
  const [selectedSpread, setSelectedSpread] = useState<AngelSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<AngeCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSpreadSelect = (spread: AngelSpread) => {
    setSelectedSpread(spread);
    setStep("question");
  };

  const handleShuffleDone = () => {
    setStep("pick");
  };

  const handlePickDone = (indices: number[]) => {
    if (!selectedSpread) return;
    const drawn = indices.map((idx) => ANGEL_CARDS[idx % ANGEL_CARDS.length]);
    setCards(drawn);
    setRevealedCards(new Set());
    setReading("");
    setStep("draw");
  };

  const revealCard = (i: number) => setRevealedCards((p) => new Set([...p, i]));
  const revealAll = () => setRevealedCards(new Set(cards.map((_, i) => i)));
  const allRevealed = revealedCards.size === cards.length && cards.length > 0;

  const getLecture = async () => {
    if (!selectedSpread) return;
    setIsStreaming(true);
    setReading("");
    setStep("reading");
    const cardData = cards.map((c, i) => ({
      name: c.name,
      theme: c.theme,
      position: selectedSpread.positions[i],
      message: c.message,
      keywords: c.keywords,
    }));
    try {
      const res = await authFetch("/api/anges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: cardData, question, spreadName: selectedSpread.name, profile }),
      });
      checkResponse(res);
      if (!res.body) throw new Error("server");
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
      addReading({ type: "anges", title: selectedSpread.name, content: full, meta: { question } });
    } catch (err) {
      setReading(apiErrorMessage(err, "Les anges gardent leur silence pour l'instant... Réessayez."));
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStep("choose");
    setCards([]);
    setRevealedCards(new Set());
    setReading("");
    setQuestion("");
    setSelectedSpread(null);
  };

  if (!isHydrated) return null;

  if (!profile) {
    return (
      <div className="max-w-lg mx-auto text-center px-6 py-20">
        <div className="text-5xl mb-6">👼</div>
        <h2 className="font-serif-display text-3xl text-gradient-cream mb-4">Oracle des Anges</h2>
        <p className="font-serif-text italic text-[#c9b88a] mb-8">
          Connectez-vous gratuitement pour recevoir les messages de vos anges gardiens.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/mon-profil" className="btn-gold"><Sparkles size={14} /><span>Créer un compte</span></Link>
          <Link href="/mon-profil" className="btn-outline-gold"><span>Se connecter</span></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* ── CHOOSE SPREAD ── */}
      {step === "choose" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Star size={11} className="inline mr-2" />
              Oracle Angélique
            </div>
            <div className="font-serif-display text-7xl text-[#d4af6f] mb-5 float-slow">👼</div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">Oracle des Anges</h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              44 anges gardiens vous transmettent leur guidance divine. Laissez-les illuminer votre chemin.
            </p>
          </div>

          {/* Angel cards preview */}
          <div className="luxe-card rounded-sm p-7 mb-12">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-5">
              Les 44 Anges Gardiens
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {ANGEL_CARDS.map((ange) => (
                <div
                  key={ange.id}
                  title={`${ange.name} — ${ange.theme}`}
                  className="group cursor-help w-10 h-14 rounded-sm border border-[rgba(212,175,111,0.2)] bg-gradient-to-br from-[#1e0a3c] to-[#0d0820] flex items-center justify-center hover:-translate-y-0.5 transition-transform relative"
                  style={{ boxShadow: `0 0 8px ${ange.color}22` }}
                >
                  <span className="text-base">{ange.emoji}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[#1a0a2e] border border-[rgba(212,175,111,0.3)] text-[9px] text-[#d4af6f] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {ange.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spread selection */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ANGEL_SPREADS.map((spread) => (
              <button
                key={spread.id}
                onClick={() => handleSpreadSelect(spread)}
                className="luxe-card rounded-sm p-6 text-left group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.12)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center group-hover:border-[#d4af6f] transition-colors">
                    <span className="text-xl">👼</span>
                  </div>
                  <span className="badge-soft !text-[9px]">
                    {spread.count} {spread.count === 1 ? "ange" : "anges"}
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

      {/* ── QUESTION ── */}
      {step === "question" && selectedSpread && (
        <div className="max-w-2xl mx-auto fade-in-up">
          <div className="text-center mb-10">
            <div className="text-5xl mb-5">👼</div>
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
              placeholder="Ouvrez votre cœur aux anges avant de tirer..."
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
              <span>Invoquer les anges</span>
            </button>
          </div>
        </div>
      )}

      {/* ── SHUFFLE ── */}
      {step === "shuffle" && selectedSpread && (
        <DeckShuffle onShuffleDone={handleShuffleDone} spreadName={selectedSpread.name} />
      )}

      {/* ── PICK ── */}
      {step === "pick" && selectedSpread && (
        <GenericDeckPick
          deckSize={44}
          count={selectedSpread.count}
          onPickDone={handlePickDone}
          cardLabel="ange"
        />
      )}

      {/* ── DRAW & READING ── */}
      {(step === "draw" || step === "reading") && selectedSpread && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <h2 className="font-serif-display text-3xl text-gradient-cream mb-2">{selectedSpread.name}</h2>
            {question && <p className="font-serif-text italic text-[#c9b88a] mt-2">&ldquo;{question}&rdquo;</p>}
            {step === "draw" && !allRevealed && (
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">
                Cliquez sur chaque carte pour découvrir votre ange
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-10 max-w-4xl mx-auto">
            {cards.map((card, i) => {
              const revealed = revealedCards.has(i);
              return (
                <div key={`${card.id}-${i}`} className="flex flex-col items-center gap-3">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] text-center max-w-[120px] font-serif-display">
                    {selectedSpread.positions[i]}
                  </div>
                  <div
                    onClick={() => !revealed && revealCard(i)}
                    className={`cursor-pointer transition-all duration-500 ${
                      revealed
                        ? "shadow-[0_0_24px_rgba(212,175,111,0.25)] -translate-y-1"
                        : "hover:-translate-y-0.5 opacity-75 hover:opacity-100"
                    }`}
                  >
                    {/* Card face */}
                    <div
                      className="w-24 h-36 rounded-sm border flex flex-col items-center justify-center p-2 transition-all duration-500"
                      style={{
                        borderColor: revealed ? card.color : "rgba(212,175,111,0.2)",
                        background: revealed
                          ? `linear-gradient(135deg, ${card.color}18, #1a0a2e, #0d0820)`
                          : "linear-gradient(135deg, #1a0a2e, #0d0820, #07040d)",
                        boxShadow: revealed ? `0 0 20px ${card.color}33` : undefined,
                      }}
                    >
                      {revealed ? (
                        <>
                          <div className="text-3xl mb-2">{card.emoji}</div>
                          <div
                            className="text-[10px] font-serif-display text-center leading-tight"
                            style={{ color: card.color }}
                          >
                            {card.name}
                          </div>
                          <div className="text-[8px] text-[#c9b88a] text-center mt-1 leading-tight">
                            {card.theme}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl opacity-20">✦</div>
                          <div
                            className="absolute inset-[3px] border border-[rgba(212,175,111,0.08)] pointer-events-none rounded-sm"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(45deg, rgba(212,175,111,0.04) 0px, rgba(212,175,111,0.04) 1px, transparent 1px, transparent 8px)",
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  {revealed && (
                    <div className="text-center max-w-[120px]">
                      <p className="text-[9px] italic text-[#c9b88a] leading-relaxed">
                        {card.message}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1 justify-center">
                        {card.keywords.slice(0, 2).map((k) => (
                          <span key={k} className="text-[8px] tracking-wider text-[#d4af6f]">
                            · {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Revealed card details */}
          {allRevealed && step === "draw" && (
            <div className="max-w-3xl mx-auto mb-10">
              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((card, i) => (
                  <div
                    key={`detail-${card.id}-${i}`}
                    className="luxe-card rounded-sm p-5"
                    style={{ borderColor: `${card.color}44` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{card.emoji}</span>
                      <div>
                        <div className="font-serif-display text-sm" style={{ color: card.color }}>
                          {card.name}
                        </div>
                        <div className="text-[10px] text-[#c9b88a]">{card.theme}</div>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#c9b88a] italic leading-relaxed mb-3">
                      {card.guidance}
                    </p>
                    <div className="text-[10px] tracking-wider text-[#d4af6f] border-t border-[rgba(212,175,111,0.15)] pt-3">
                      <span className="opacity-60">Affirmation :</span>{" "}
                      <span className="italic">{card.affirmation}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-[#c9b88a] flex gap-3">
                      <span>💎 {card.crystal}</span>
                      <span>· {card.chakra}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "draw" && (
            <div className="flex gap-3 justify-center flex-wrap">
              {!allRevealed && (
                <button onClick={revealAll} className="btn-outline-gold">
                  <span>Révéler tous les anges</span>
                </button>
              )}
              {allRevealed && (
                <button onClick={getLecture} className="btn-gold">
                  <Sparkles size={14} />
                  <span>Recevoir la guidance divine</span>
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
