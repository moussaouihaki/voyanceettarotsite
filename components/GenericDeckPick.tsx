"use client";

import { useState, useCallback } from "react";
import { Hand, ChevronRight, RotateCcw } from "lucide-react";

interface Props {
  deckSize: number;
  count: number;
  onPickDone: (indices: number[]) => void;
  cardLabel?: string;
}

export default function GenericDeckPick({ deckSize, count, onPickDone, cardLabel = "carte" }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = useCallback((index: number) => {
    setSelected((prev) => {
      if (prev.has(index)) {
        const next = new Set(prev);
        next.delete(index);
        return next;
      }
      if (prev.size >= count) return prev;
      return new Set([...prev, index]);
    });
  }, [count]);

  const handleConfirm = () => {
    onPickDone([...selected]);
  };

  const remaining = count - selected.size;
  const plural = count > 1;
  const cardLabelPlural = cardLabel === "rune" ? "runes" : cardLabel === "stave" ? "staves" : cardLabel + "s";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in-up">
      <div className="text-center mb-8">
        <div className="badge-gold mb-5 inline-flex items-center gap-2">
          <Hand size={11} />
          Choisissez vos {cardLabelPlural}
        </div>
        <h2 className="font-serif-display text-3xl md:text-4xl text-gradient-cream mb-3">
          Laissez votre intuition vous guider
        </h2>
        <p className="font-serif-text italic text-[#c9b88a] mb-6">
          Survolez les {cardLabelPlural}, sentez lesquel{cardLabel === "rune" ? "les" : "les"} vous appellent
        </p>

        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-sm border border-[rgba(212,175,111,0.25)] bg-[rgba(212,175,111,0.05)]">
          <div className="flex gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i < selected.size
                    ? "bg-[#d4af6f] shadow-[0_0_6px_rgba(212,175,111,0.6)]"
                    : "bg-[rgba(212,175,111,0.15)] border border-[rgba(212,175,111,0.3)]"
                }`}
              />
            ))}
          </div>
          <span className="text-[12px] text-[#c9b88a] tracking-wide">
            {selected.size === count
              ? `${count} ${plural ? cardLabelPlural : cardLabel} choisie${plural ? "s" : ""} ✦`
              : `Choisissez encore ${remaining} ${remaining > 1 ? cardLabelPlural : cardLabel}`}
          </span>
        </div>
      </div>

      <div
        className="grid gap-1.5 mb-8"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))" }}
      >
        {Array.from({ length: deckSize }).map((_, index) => {
          const isSelected = selected.has(index);
          const isFull = selected.size >= count && !isSelected;
          return (
            <button
              key={index}
              onClick={() => toggle(index)}
              disabled={isFull}
              aria-label={isSelected ? `Désélectionner la position ${index + 1}` : `Sélectionner la position ${index + 1}`}
              className={`relative rounded-sm transition-all duration-200 ${
                isFull ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1"
              } ${
                isSelected
                  ? "ring-2 ring-[#d4af6f] shadow-[0_0_12px_rgba(212,175,111,0.5)] -translate-y-1.5 z-10"
                  : ""
              }`}
              style={{ aspectRatio: "2/3" }}
            >
              <div
                className={`absolute inset-0 rounded-sm border transition-colors ${
                  isSelected
                    ? "border-[#d4af6f] bg-gradient-to-br from-[#2a1045] via-[#1a0a2e] to-[#0d0820]"
                    : "border-[rgba(212,175,111,0.2)] bg-gradient-to-br from-[#1a0a2e] via-[#0d0820] to-[#07040d]"
                }`}
              >
                <div className="absolute inset-[3px] border border-[rgba(212,175,111,0.15)] flex items-center justify-center">
                  <span className={`text-[10px] ${isSelected ? "text-[#d4af6f]" : "text-[rgba(212,175,111,0.15)]"}`}>✦</span>
                </div>
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, rgba(212,175,111,0.4) 0px, rgba(212,175,111,0.4) 1px, transparent 1px, transparent 7px)",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button onClick={() => setSelected(new Set())} className="btn-ghost gap-2 text-[12px]">
          <RotateCcw size={12} />
          Recommencer la sélection
        </button>
        <button
          onClick={handleConfirm}
          disabled={selected.size !== count}
          className={`btn-gold gap-2 transition-all ${selected.size !== count ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <ChevronRight size={14} />
          Révéler {count > 1 ? `mes ${count} ${cardLabelPlural}` : `ma ${cardLabel}`}
        </button>
      </div>
    </div>
  );
}
