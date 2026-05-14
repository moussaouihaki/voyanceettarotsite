"use client";

import { useState, useCallback } from "react";
import { drawCards, SPREAD_POSITIONS, TarotCard } from "@/lib/tarot-cards";
import TarotCardComponent from "@/components/TarotCard";
import ReadingResult from "@/components/ReadingResult";

type SpreadType = "trois" | "celtique";
type DrawnCard = TarotCard & { reversed: boolean; positionIndex: number };

export default function TiragePage() {
  const [step, setStep] = useState<"choose" | "question" | "draw" | "reading">("choose");
  const [spreadType, setSpreadType] = useState<SpreadType>("trois");
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSpreadSelect = (type: SpreadType) => {
    setSpreadType(type);
    setStep("question");
  };

  const handleDraw = useCallback(() => {
    const count = spreadType === "trois" ? 3 : 10;
    const drawn = drawCards(count);
    setCards(drawn);
    setFlippedCards(new Set());
    setReading("");
    setStep("draw");
  }, [spreadType]);

  const flipCard = (index: number) => {
    setFlippedCards((prev) => new Set([...prev, index]));
  };

  const flipAll = () => {
    setFlippedCards(new Set(cards.map((_, i) => i)));
  };

  const allFlipped = flippedCards.size === cards.length;

  const getLecture = async () => {
    setIsStreaming(true);
    setReading("");
    setStep("reading");

    const positions = SPREAD_POSITIONS[spreadType];
    const cardData = cards.map((c, i) => ({
      name: c.name,
      suit: c.suit,
      number: c.number,
      position: positions[i],
      reversed: c.reversed,
      keywords: c.keywords,
    }));

    try {
      const res = await fetch("/api/lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: cardData, question, spreadType }),
      });

      if (!res.ok || !res.body) throw new Error("Erreur de connexion");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setReading((prev) => prev + chunk);
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
  };

  const positions = SPREAD_POSITIONS[spreadType];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Step: Choose spread */}
      {step === "choose" && (
        <div className="text-center fade-in-up">
          <div className="text-5xl mb-4 float-anim">🃏</div>
          <h1 className="text-3xl font-bold text-purple-100 mb-2">Tirage de Tarot</h1>
          <p className="text-purple-400 mb-10">Choisissez votre type de tirage</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button onClick={() => handleSpreadSelect("trois")} className="mystical-card rounded-2xl p-8 text-left hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] group">
              <div className="text-4xl mb-4 text-center">🌙</div>
              <h2 className="font-cinzel text-xl text-yellow-300 mb-2 text-center">3 Cartes</h2>
              <p className="text-purple-300/80 text-sm text-center">Passé · Présent · Futur</p>
              <p className="text-purple-400/60 text-xs mt-3 text-center">Lecture rapide et précise</p>
            </button>

            <button onClick={() => handleSpreadSelect("celtique")} className="mystical-card rounded-2xl p-8 text-left hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] group">
              <div className="text-4xl mb-4 text-center">✦</div>
              <h2 className="font-cinzel text-xl text-yellow-300 mb-2 text-center">Croix Celtique</h2>
              <p className="text-purple-300/80 text-sm text-center">10 cartes — Lecture complète</p>
              <p className="text-purple-400/60 text-xs mt-3 text-center">Analyse approfondie</p>
            </button>
          </div>
        </div>
      )}

      {/* Step: Question */}
      {step === "question" && (
        <div className="max-w-xl mx-auto text-center fade-in-up">
          <div className="text-4xl mb-4 float-anim">✨</div>
          <h2 className="text-2xl font-bold text-purple-100 mb-2">Votre question</h2>
          <p className="text-purple-400 mb-8 text-sm">
            Concentrez-vous sur ce qui vous préoccupe. Vous pouvez laisser vide pour une lecture générale.
          </p>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: Comment évolue ma situation amoureuse ? Quel chemin prendre dans ma carrière ?"
            rows={4}
            className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl p-4 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 resize-none mb-6 text-sm"
          />

          <div className="flex gap-3 justify-center">
            <button onClick={() => setStep("choose")} className="px-6 py-3 rounded-xl border border-purple-700/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">
              ← Retour
            </button>
            <button onClick={handleDraw} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold text-sm">
              Tirer les cartes ✦
            </button>
          </div>
        </div>
      )}

      {/* Step: Draw cards */}
      {(step === "draw" || step === "reading") && (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-100 mb-1">Vos Cartes</h2>
            {question && (
              <p className="text-purple-400 text-sm italic">"{question}"</p>
            )}
            {step === "draw" && !allFlipped && (
              <p className="text-purple-500 text-xs mt-2">Cliquez sur chaque carte pour la révéler</p>
            )}
          </div>

          {/* Cards grid */}
          <div className={`flex flex-wrap justify-center gap-4 md:gap-6 mb-8 ${spreadType === "celtique" ? "max-w-4xl mx-auto" : "max-w-lg mx-auto"}`}>
            {cards.map((card, i) => (
              <TarotCardComponent
                key={card.id}
                card={card}
                position={positions[i]}
                isFlipped={flippedCards.has(i)}
                onClick={() => !flippedCards.has(i) && flipCard(i)}
                index={i}
              />
            ))}
          </div>

          {step === "draw" && (
            <div className="flex gap-3 justify-center">
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

          {/* Reading result */}
          <ReadingResult text={reading} isStreaming={isStreaming} />

          {step === "reading" && !isStreaming && reading && (
            <div className="text-center mt-6">
              <button onClick={reset} className="gradient-btn px-8 py-3 rounded-xl text-white text-sm">
                Nouveau tirage
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
