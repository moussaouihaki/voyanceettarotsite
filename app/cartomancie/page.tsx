"use client";
import { authFetch } from "@/lib/api-client";
import { useState } from "react";
import { CARTOMANCIE_DECK, drawCartomancie, type CartomancieCard } from "@/lib/cartomancie";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import Link from "next/link";
import ReadingResult from "@/components/ReadingResult";
import DeckShuffle from "@/components/DeckShuffle";
import GenericDeckPick from "@/components/GenericDeckPick";
import { Sparkles, ArrowLeft, RotateCcw, Star } from "lucide-react";

const SPREADS = [
  { id: "reponse", name: "La Réponse", count: 1, positions: ["La réponse"], description: "Une carte pour une réponse directe à votre question." },
  { id: "trois", name: "Hier · Aujourd'hui · Demain", count: 3, positions: ["Hier — Le passé proche", "Aujourd'hui — Le présent", "Demain — Le futur proche"], description: "La lecture temporelle classique de grand-mère." },
  { id: "cinq", name: "Les 5 de Grand-mère", count: 5, positions: ["Vous", "Votre Maison", "Ce qui vient vers vous", "Ce qui s'éloigne", "Le Résultat"], description: "Cinq cartes selon la tradition populaire française." },
  { id: "grand-jeu", name: "Le Grand Jeu", count: 9, positions: ["Le Passé", "Le Présent", "L'Avenir proche", "Vos Espoirs", "Vos Craintes", "Votre Entourage", "Ce qui est caché", "L'Inattendu", "Le Résultat final"], description: "Neuf cartes pour une lecture complète." },
];

type CartomancieSpread = typeof SPREADS[number];
type DrawnCartomancieCard = CartomancieCard & { position: string };

function CarteJeu32({ card, revealed, size = "lg" }: { card: CartomancieCard; revealed: boolean; size?: "sm" | "lg" }) {
  const w = size === "lg" ? "w-[90px]" : "w-[60px]";
  const h = size === "lg" ? "h-[130px]" : "h-[90px]";

  if (!revealed) {
    return (
      <div
        className={`${w} ${h} rounded-sm border-2 border-[#d4af6f] bg-gradient-to-b from-[#1a1020] to-[#0d0a14] flex items-center justify-center cursor-pointer select-none`}
        style={{ boxShadow: "0 0 10px rgba(212,175,111,0.15)" }}
      >
        <span className="text-[#d4af6f] opacity-50" style={{ fontSize: size === "lg" ? 28 : 18 }}>✦</span>
      </div>
    );
  }

  const rankMap: Record<string, string> = { "10": "0", "V": "J", "D": "Q", "R": "K" };
  const suitMap: Record<string, string> = { coeur: "H", carreau: "D", trefle: "C", pique: "S" };
  const apiRank = rankMap[card.rank] ?? card.rank;
  const apiSuit = suitMap[card.suit];
  const imgUrl = `https://deckofcardsapi.com/static/img/${apiRank}${apiSuit}.png`;

  return (
    <div className={`${w} ${h} rounded-sm overflow-hidden border border-[rgba(212,175,111,0.3)]`}
      style={{ boxShadow: "0 0 12px rgba(212,175,111,0.2)" }}>
      <img src={imgUrl} alt={card.name} className="w-full h-full object-cover" />
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 rounded-full border-2 border-[rgba(212,175,111,0.2)] border-t-[#d4af6f] animate-spin" />
    </div>
  );
}


export default function CartomanciePage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [step, setStep] = useState<"choose" | "question" | "shuffle" | "pick" | "draw" | "reading">("choose");
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [selectedSpread, setSelectedSpread] = useState<CartomancieSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCartomancieCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSpreadSelect = (spread: CartomancieSpread) => {
    setSelectedSpread(spread);
    setStep("question");
  };

  const handleShuffleDone = () => {
    const indices = Array.from({ length: 32 }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
    setStep("pick");
  };

  const handlePickDone = (indices: number[]) => {
    if (!selectedSpread) return;
    const drawn: DrawnCartomancieCard[] = indices.map((idx, posIdx) => ({
      ...CARTOMANCIE_DECK[idx],
      position: selectedSpread.positions[posIdx],
    }));
    setCards(drawn);
    setRevealedCards(new Set());
    setReading("");
    setStep("draw");
  };

  const handleDraw = () => {
    if (!selectedSpread) return;
    const drawn = drawCartomancie(selectedSpread.count);
    const withPositions: DrawnCartomancieCard[] = drawn.map((card, i) => ({
      ...card,
      position: selectedSpread.positions[i],
    }));
    setCards(withPositions);
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
      rank: c.rank,
      suit: c.suit,
      suitSymbol: c.suitSymbol,
      position: selectedSpread.positions[i],
      keywords: c.keywords,
    }));
    try {
      const res = await authFetch("/api/cartomancie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards: cardData,
          question,
          spreadName: selectedSpread.name,
          profile: { prenom: profile?.prenom, dateNaissance: profile?.dateNaissance },
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
      addReading({ type: "cartomancie", title: selectedSpread.name, content: full, meta: { question } });
    } catch {
      setReading("Les cartes restent muettes... Réessayez.");
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
    setShuffledIndices([]);
  };

  if (!isHydrated) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {step === "choose" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Star size={11} className="inline mr-2" />
              Tradition Française
            </div>
            <div className="font-serif-display text-7xl text-[#d4af6f] mb-5 float-slow">♠</div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">Cartomancie Traditionnelle</h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              Le Jeu de 32 Cartes · Art divinatoire populaire du XIXe siècle
            </p>
          </div>

          <div className="luxe-card rounded-sm p-7 mb-12">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-5">Les 32 cartes du jeu</div>
            <div className="flex gap-2 overflow-x-auto pb-2 justify-start">
              {CARTOMANCIE_DECK.map((card) => (
                <div key={card.id} className="group cursor-help hover:-translate-y-0.5 transition-transform flex-shrink-0" title={card.name}>
                  <CarteJeu32 card={card} revealed size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {SPREADS.map((spread) => (
              <button
                key={spread.id}
                onClick={() => handleSpreadSelect(spread)}
                className="luxe-card rounded-sm p-6 text-left group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.12)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center group-hover:border-[#d4af6f] transition-colors">
                    <Sparkles size={18} className="text-[#d4af6f]" />
                  </div>
                  <span className="badge-soft !text-[9px]">
                    {spread.count} {spread.count === 1 ? "carte" : "cartes"}
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
              <Sparkles size={24} className="text-[#d4af6f]" />
            </div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-3">{selectedSpread.name}</h2>
            <p className="font-serif-text italic text-[#c9b88a] text-lg">{selectedSpread.description}</p>
          </div>

          <div className="luxe-card rounded-sm p-6 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Positions</div>
            <div className="flex flex-wrap gap-2">
              {selectedSpread.positions.map((pos, i) => (
                <span key={i} className="badge-soft">
                  <span className="text-[#d4af6f] mr-1.5">{i + 1}.</span>
                  {pos}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="luxe-label">Votre question (optionnel)</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Posez votre question à grand-mère avant de battre les cartes..."
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
          deckSize={32}
          count={selectedSpread.count}
          onPickDone={handlePickDone}
          cardLabel="carte"
        />
      )}

      {(step === "draw" || step === "reading") && selectedSpread && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <h2 className="font-serif-display text-3xl text-gradient-cream mb-2">{selectedSpread.name}</h2>
            {question && <p className="font-serif-text italic text-[#c9b88a] mt-2">&ldquo;{question}&rdquo;</p>}
            {step === "draw" && !allRevealed && (
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">Cliquez sur chaque carte pour la retourner</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-10 max-w-4xl mx-auto">
            {cards.map((card, i) => {
              const isRevealed = revealedCards.has(i);
              return (
                <div key={card.id} className="flex flex-col items-center gap-3">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] text-center max-w-[110px] font-serif-display">
                    {selectedSpread.positions[i].split(" — ")[0]}
                  </div>
                  <div
                    onClick={() => !isRevealed && revealCard(i)}
                    className={`transition-all duration-500 ${
                      isRevealed
                        ? "shadow-[0_0_20px_rgba(212,175,111,0.2)] -translate-y-1"
                        : "hover:-translate-y-0.5 opacity-80 hover:opacity-100 cursor-pointer"
                    }`}
                  >
                    <CarteJeu32 card={card} revealed={isRevealed} size="lg" />
                  </div>
                  {isRevealed && (
                    <div className="flex flex-wrap gap-1 max-w-[110px] justify-center">
                      {card.keywords.slice(0, 2).map((k) => (
                        <span key={k} className="text-[8px] tracking-wider text-[#c9b88a]">· {k}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {step === "draw" && (
            <div className="flex gap-3 justify-center flex-wrap">
              {!allRevealed && (
                <button onClick={revealAll} className="btn-outline-gold">
                  <span>Révéler tout</span>
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
