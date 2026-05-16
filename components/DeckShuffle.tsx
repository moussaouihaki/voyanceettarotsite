"use client";

import { useState, useCallback } from "react";
import { Shuffle, ChevronRight, Sparkles } from "lucide-react";

interface Props {
  onShuffleDone: () => void;
  spreadName: string;
}

export default function DeckShuffle({ onShuffleDone, spreadName }: Props) {
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [phase, setPhase] = useState<"idle" | "fanning" | "gathering">("idle");

  const handleShuffle = useCallback(() => {
    if (isShuffling) return;
    setIsShuffling(true);
    setPhase("fanning");
    setTimeout(() => {
      setPhase("gathering");
      setTimeout(() => {
        setPhase("idle");
        setIsShuffling(false);
        setShuffleCount((n) => n + 1);
      }, 500);
    }, 600);
  }, [isShuffling]);

  // Generate 7 "card" layers for the deck visual
  const deckCards = Array.from({ length: 7 });

  return (
    <div className="max-w-lg mx-auto px-6 py-8 text-center fade-in-up">
      <div className="badge-gold mb-6 inline-flex items-center gap-2">
        <Shuffle size={11} />
        Mélangez le jeu
      </div>

      <h2 className="font-serif-display text-3xl md:text-4xl text-gradient-cream mb-3">
        Concentrez-vous sur votre intention
      </h2>
      <p className="font-serif-text italic text-[#c9b88a] mb-2">
        {spreadName}
      </p>
      <p className="text-[13px] text-[#8a6f3a] mb-10">
        Pensez à votre question, respirez profondément, puis mélangez autant de fois que vous le sentez.
      </p>

      {/* Deck visual */}
      <div className="flex justify-center mb-10">
        <div className="relative" style={{ width: 100, height: 155 }}>
          {deckCards.map((_, i) => {
            const offset = i * 1.5;
            let transform = `translateY(${-offset}px) translateX(${offset * 0.3}px)`;
            if (phase === "fanning") {
              const angle = (i - 3) * 12;
              const tx = (i - 3) * 18;
              transform = `rotate(${angle}deg) translateX(${tx}px) translateY(${Math.abs(i - 3) * 4}px)`;
            } else if (phase === "gathering") {
              transform = `translateY(${-offset * 0.5}px) translateX(${offset * 0.15}px)`;
            }
            return (
              <div
                key={i}
                className="absolute inset-0 rounded-sm border border-[rgba(212,175,111,0.5)] bg-gradient-to-br from-[#1a0a2e] via-[#0d0820] to-[#07040d] overflow-hidden"
                style={{
                  transform,
                  transition: phase === "fanning"
                    ? `transform ${0.3 + i * 0.04}s ease-out`
                    : phase === "gathering"
                    ? `transform ${0.25 + i * 0.03}s ease-in`
                    : "transform 0.2s ease",
                  zIndex: i,
                  bottom: 0,
                  top: 0,
                }}
              >
                {/* Card back pattern */}
                <div className="absolute inset-2 border border-[rgba(212,175,111,0.2)] flex items-center justify-center">
                  <div className="text-[rgba(212,175,111,0.25)] text-2xl select-none">✦</div>
                </div>
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, rgba(212,175,111,0.15) 0px, rgba(212,175,111,0.15) 1px, transparent 1px, transparent 8px)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Shuffle button */}
      <button
        onClick={handleShuffle}
        disabled={isShuffling}
        className="btn-gold mb-4 gap-3"
      >
        <Shuffle size={16} className={isShuffling ? "animate-spin" : ""} />
        {shuffleCount === 0 ? "Mélanger les cartes" : "Mélanger encore"}
      </button>

      {shuffleCount > 0 && (
        <div className="mb-6 text-[12px] text-[#8a6f3a] tracking-wider">
          {shuffleCount === 1 ? "Mélangé 1 fois" : `Mélangé ${shuffleCount} fois`}
          <span className="ml-2 text-[#d4af6f]">✦</span>
        </div>
      )}

      {shuffleCount > 0 && (
        <button
          onClick={onShuffleDone}
          className="btn-outline-gold gap-2 fade-in-up"
        >
          <Sparkles size={14} />
          Les cartes sont prêtes — choisir mes cartes
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
