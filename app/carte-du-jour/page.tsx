"use client";
import { useState, useEffect } from "react";
import { ALL_CARDS } from "@/lib/tarot-cards";
import ReadingResult from "@/components/ReadingResult";

type CardOfDay = {
  name: string;
  emoji: string;
  suit: string;
  number: string;
  reversed: boolean;
  keywords: string[];
  upright: string;
  meaningReversed: string;
};

function getDailyCard(): CardOfDay {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % ALL_CARDS.length;
  const card = ALL_CARDS[index];
  const reversed = (seed % 3) === 0;
  return { ...card, reversed };
}

export default function CarteDuJourPage() {
  const [card, setCard] = useState<CardOfDay | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [intention, setIntention] = useState("");

  useEffect(() => {
    setCard(getDailyCard());
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const getReading = async () => {
    if (!card) return;
    setIsStreaming(true);
    setReading("");
    try {
      const res = await fetch("/api/carte-du-jour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card, intention }),
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
      setReading("La carte du jour garde son mystère... Réessayez dans quelques instants.");
    } finally {
      setIsStreaming(false);
    }
  };

  if (!card) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="fade-in-up">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 float-anim">🌅</div>
          <h1 className="text-3xl font-bold text-purple-100 mb-2">Carte du Jour</h1>
          <p className="text-purple-400 text-sm capitalize">{today}</p>
        </div>

        {!revealed ? (
          <div className="flex flex-col items-center gap-6">
            <p className="text-purple-300/70 text-sm max-w-sm text-center">
              Une carte unique vous accompagne chaque jour. Concentrez-vous sur votre journée, puis révélez votre guidance.
            </p>

            {/* Intention input */}
            <div className="w-full max-w-md">
              <label className="text-purple-400 text-xs block mb-2">Votre intention du jour (optionnel)</label>
              <input
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Ce sur quoi vous souhaitez une guidance..."
                className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            {/* Card back - unflipped */}
            <div
              onClick={() => setRevealed(true)}
              className="w-36 h-52 rounded-2xl border-2 border-purple-600/60 bg-gradient-to-b from-[#12003a] to-[#0d0030] flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all duration-500 hover:scale-105"
            >
              <div className="text-5xl text-purple-600 mb-2">✦</div>
              <div className="text-xs text-purple-600 font-cinzel text-center px-4">Cliquez pour révéler</div>
              <div className="text-[10px] text-purple-700 mt-2">votre carte du jour</div>
            </div>

            <p className="text-purple-600 text-xs">La même carte vous accompagne toute la journée</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {/* Revealed card */}
            <div className="w-36 h-52 rounded-2xl border-2 border-yellow-500/70 bg-gradient-to-b from-[#0d0025] to-[#1a0048] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.2)]">
              <div className={`text-5xl text-yellow-300 font-bold mb-2 ${card.reversed ? "rotate-180" : ""}`}>
                {card.emoji}
              </div>
              <div className="text-xs font-cinzel text-purple-300 text-center px-2">{card.name}</div>
              {card.reversed && <div className="text-[9px] text-red-400 mt-1">Inversée</div>}
            </div>

            {/* Card info */}
            <div className="mystical-card rounded-2xl p-6 w-full max-w-xl">
              <div className="text-center mb-4">
                <h2 className="font-cinzel text-xl text-yellow-300 mb-1">{card.name}</h2>
                <p className="text-purple-400 text-xs">{card.suit} {card.reversed ? "· Position inversée" : ""}</p>
              </div>

              <div className="flex flex-wrap gap-1 justify-center mb-4">
                {card.keywords.map(k => (
                  <span key={k} className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded">{k}</span>
                ))}
              </div>

              <p className="text-purple-200/80 text-sm leading-relaxed text-center mb-4">
                {card.reversed ? card.meaningReversed : card.upright}
              </p>

              {intention && (
                <div className="bg-purple-900/20 rounded-xl p-3 mb-4">
                  <p className="text-xs text-purple-400">Intention : <span className="text-purple-300 italic">"{intention}"</span></p>
                </div>
              )}

              {!reading && !isStreaming && (
                <div className="text-center">
                  <button onClick={getReading} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold">
                    🔮 Message de la carte
                  </button>
                </div>
              )}
            </div>

            <ReadingResult text={reading} isStreaming={isStreaming} />

            {/* Daily affirmation */}
            <div className="mystical-card rounded-xl p-4 w-full max-w-xl text-center">
              <p className="text-xs text-purple-500 mb-2">Affirmation du jour</p>
              <p className="text-purple-300 italic text-sm">
                "Aujourd'hui, je m'ouvre aux messages de {card.name} et accueille sa guidance avec gratitude."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
