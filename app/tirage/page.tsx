"use client";
import { useState, useCallback } from "react";
import { drawCards, SPREAD_POSITIONS, TarotCard } from "@/lib/tarot-cards";
import { ALL_SPREADS, SPREAD_CATEGORIES, type Spread, type SpreadCategory } from "@/lib/spreads";
import TarotCardComponent from "@/components/TarotCard";
import ReadingResult from "@/components/ReadingResult";

type DrawnCard = TarotCard & { reversed: boolean; positionIndex: number };
type Step = "choose" | "question" | "draw" | "reading";

const CATEGORY_COLORS: Record<SpreadCategory, string> = {
  quotidien: "amber", temporel: "blue", amour: "pink",
  professionnel: "green", spirituel: "violet", classique: "purple", special: "yellow",
};

const DIFFICULTY_COLORS = { facile: "text-green-400", intermédiaire: "text-yellow-400", avancé: "text-red-400" };

export default function TiragePage() {
  const [step, setStep] = useState<Step>("choose");
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [activeCategory, setActiveCategory] = useState<SpreadCategory | "all">("all");
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpreads = ALL_SPREADS.filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSpreadSelect = (spread: Spread) => {
    setSelectedSpread(spread);
    setStep("question");
  };

  const handleDraw = useCallback(() => {
    if (!selectedSpread) return;
    setCards(drawCards(selectedSpread.cardCount));
    setFlippedCards(new Set());
    setReading("");
    setStep("draw");
  }, [selectedSpread]);

  const flipCard = (i: number) => setFlippedCards((p) => new Set([...p, i]));
  const flipAll = () => setFlippedCards(new Set(cards.map((_, i) => i)));
  const allFlipped = flippedCards.size === cards.length && cards.length > 0;

  const getLecture = async () => {
    if (!selectedSpread) return;
    setIsStreaming(true);
    setReading("");
    setStep("reading");

    // Use custom spread positions
    const positions = selectedSpread.positions;
    const cardData = cards.map((c, i) => ({
      name: c.name, suit: c.suit, number: c.number,
      position: positions[i] || `Position ${i + 1}`,
      reversed: c.reversed, keywords: c.keywords,
    }));

    try {
      const res = await fetch("/api/lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards: cardData, question,
          spreadType: selectedSpread.id,
          spreadName: selectedSpread.name,
        }),
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
      setReading("Les astres sont momentanément voilés... Veuillez réessayer.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStep("choose");
    setCards([]);
    setFlippedCards(new Set());
    setReading("");
    setQuestion("");
    setSelectedSpread(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Step 1: Choose spread */}
      {step === "choose" && (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 float-anim">🃏</div>
            <h1 className="text-3xl font-bold text-purple-100 mb-2">Tirage de Tarot</h1>
            <p className="text-purple-400 text-sm">{ALL_SPREADS.length} tirages disponibles</p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Rechercher un tirage..."
              className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm transition-all ${activeCategory === "all" ? "bg-purple-700 text-white" : "border border-purple-700/40 text-purple-400 hover:bg-purple-900/30"}`}
            >
              Tous ({ALL_SPREADS.length})
            </button>
            {(Object.entries(SPREAD_CATEGORIES) as [SpreadCategory, typeof SPREAD_CATEGORIES[SpreadCategory]][]).map(([cat, data]) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-1.5 ${activeCategory === cat ? "bg-purple-700 text-white" : "border border-purple-700/40 text-purple-400 hover:bg-purple-900/30"}`}
              >
                <span>{data.emoji}</span>
                <span>{data.label}</span>
                <span className="opacity-60">({ALL_SPREADS.filter(s => s.category === cat).length})</span>
              </button>
            ))}
          </div>

          {/* Spreads grid */}
          {filteredSpreads.length === 0 ? (
            <div className="text-center text-purple-400 py-12">Aucun tirage trouvé pour cette recherche.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSpreads.map((spread) => (
                <button
                  key={spread.id}
                  onClick={() => handleSpreadSelect(spread)}
                  className="mystical-card rounded-xl p-5 text-left hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{spread.emoji}</span>
                      {spread.popular && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30">⭐ Populaire</span>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full">
                        {spread.cardCount} {spread.cardCount === 1 ? "carte" : "cartes"}
                      </span>
                      <span className={`text-[10px] ${DIFFICULTY_COLORS[spread.difficulty]}`}>{spread.difficulty}</span>
                    </div>
                  </div>
                  <h3 className="font-cinzel font-bold text-yellow-300 text-sm mb-1">{spread.name}</h3>
                  <p className="text-purple-400/70 text-xs mb-2">{spread.subtitle}</p>
                  <p className="text-purple-300/60 text-xs leading-relaxed line-clamp-2">{spread.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Question */}
      {step === "question" && selectedSpread && (
        <div className="max-w-xl mx-auto text-center fade-in-up">
          <div className="text-4xl mb-4">{selectedSpread.emoji}</div>
          <h2 className="text-2xl font-bold text-purple-100 mb-1 font-cinzel">{selectedSpread.name}</h2>
          <p className="text-purple-400 text-sm mb-2">{selectedSpread.cardCount} cartes · {selectedSpread.difficulty}</p>
          <p className="text-purple-300/70 text-sm mb-8">{selectedSpread.description}</p>

          {/* Positions preview */}
          <div className="mystical-card rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-purple-400 mb-3 font-cinzel">Positions du tirage :</p>
            <div className="flex flex-wrap gap-2">
              {selectedSpread.positions.map((pos, i) => (
                <span key={i} className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded-lg border border-purple-700/30">
                  {i + 1}. {pos}
                </span>
              ))}
            </div>
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Votre question (optionnel) — Concentrez votre intention..."
            rows={3}
            className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl p-4 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 resize-none mb-6 text-sm"
          />
          <div className="flex gap-3 justify-center">
            <button onClick={() => setStep("choose")} className="px-6 py-3 rounded-xl border border-purple-700/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">← Retour</button>
            <button onClick={handleDraw} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold text-sm">Tirer les cartes ✦</button>
          </div>
        </div>
      )}

      {/* Step 3 & 4: Draw + Reading */}
      {(step === "draw" || step === "reading") && selectedSpread && (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-100 mb-1 font-cinzel">{selectedSpread.name}</h2>
            {question && <p className="text-purple-400 text-sm italic mt-1">"{question}"</p>}
            {step === "draw" && !allFlipped && (
              <p className="text-purple-500 text-xs mt-2">✦ Cliquez sur chaque carte pour la révéler ✦</p>
            )}
          </div>

          <div className={`flex flex-wrap justify-center gap-4 md:gap-5 mb-8 ${selectedSpread.cardCount > 7 ? "max-w-5xl" : "max-w-3xl"} mx-auto`}>
            {cards.map((card, i) => (
              <TarotCardComponent
                key={card.id} card={card}
                position={selectedSpread.positions[i] || `Position ${i + 1}`}
                isFlipped={flippedCards.has(i)}
                onClick={() => !flippedCards.has(i) && flipCard(i)}
                index={i}
              />
            ))}
          </div>

          {step === "draw" && (
            <div className="flex gap-3 justify-center flex-wrap">
              {!allFlipped && (
                <button onClick={flipAll} className="px-6 py-3 rounded-xl border border-purple-600/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">
                  Révéler toutes
                </button>
              )}
              {allFlipped && (
                <button onClick={getLecture} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold">
                  🔮 Obtenir ma lecture
                </button>
              )}
              <button onClick={reset} className="px-5 py-3 rounded-xl border border-purple-700/30 text-purple-400 hover:bg-purple-900/20 transition-all text-sm">
                Recommencer
              </button>
            </div>
          )}

          <ReadingResult text={reading} isStreaming={isStreaming} />

          {step === "reading" && !isStreaming && reading && (
            <div className="text-center mt-6 flex gap-3 justify-center">
              <button onClick={reset} className="gradient-btn px-8 py-3 rounded-xl text-white text-sm">Nouveau tirage</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
