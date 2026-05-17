"use client";

import { LenormandCard, LENORMAND_PLAYING_CARDS } from "@/lib/lenormand";
import { LenormandSymbol } from "@/components/LenormandSymbols";

interface Props {
  card: LenormandCard;
  size?: "sm" | "md" | "lg";
  revealed?: boolean;
  showPlayingCard?: boolean;
}

const SIZE = {
  sm: { card: "w-[72px] h-[108px]", symSize: 36, name: "text-[7px]", num: "text-[7px]", suit: "text-[8px]" },
  md: { card: "w-[96px] h-[144px]", symSize: 44, name: "text-[8px]", num: "text-[8px]", suit: "text-[10px]" },
  lg: { card: "w-[130px] h-[195px]", symSize: 56, name: "text-[10px]", num: "text-[10px]", suit: "text-[13px]" },
};

export default function LenormandCardArt({ card, size = "md", revealed = true, showPlayingCard = true }: Props) {
  const s = SIZE[size];
  const playing = LENORMAND_PLAYING_CARDS[card.number];

  if (!revealed) {
    return (
      <div className={`${s.card} rounded-sm border border-[rgba(212,175,111,0.3)] bg-gradient-to-br from-[#1a0a2e] via-[#0d0820] to-[#07040d] flex items-center justify-center select-none relative overflow-hidden`}>
        <div className="absolute inset-[4px] border border-[rgba(212,175,111,0.12)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(212,175,111,0.5) 0px, rgba(212,175,111,0.5) 1px, transparent 1px, transparent 8px)" }}
        />
        <span className="text-[rgba(212,175,111,0.3)] text-xl">✦</span>
      </div>
    );
  }

  return (
    <div
      className={`${s.card} rounded-sm border border-[rgba(212,175,111,0.5)] bg-gradient-to-b from-[#180d2e] via-[#100820] to-[#07040d] relative overflow-hidden select-none flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(212,175,111,0.08)" }}
    >
      {/* Outer ornamental border */}
      <div className="absolute inset-[3px] border border-[rgba(212,175,111,0.2)] rounded-sm pointer-events-none" />
      {/* Corner ornaments */}
      <div className="absolute top-[6px] left-[6px] w-2 h-2 border-t border-l border-[rgba(212,175,111,0.4)]" />
      <div className="absolute top-[6px] right-[6px] w-2 h-2 border-t border-r border-[rgba(212,175,111,0.4)]" />
      <div className="absolute bottom-[6px] left-[6px] w-2 h-2 border-b border-l border-[rgba(212,175,111,0.4)]" />
      <div className="absolute bottom-[6px] right-[6px] w-2 h-2 border-b border-r border-[rgba(212,175,111,0.4)]" />

      {/* Top bar: card number + playing card */}
      <div className="flex items-start justify-between px-[8px] pt-[7px] shrink-0">
        <div className={`${s.num} font-serif-display text-[#d4af6f] leading-none`}>{card.number}</div>
        {showPlayingCard && playing && (
          <div className={`${s.suit} leading-none font-bold ${playing.red ? "text-[#e85555]" : "text-[#c9c9c9]"}`}>
            {playing.suit}
          </div>
        )}
      </div>

      {/* Central illustration */}
      <div className="flex-1 flex items-center justify-center py-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[rgba(212,175,111,0.06)] blur-md" />
        </div>
        <div className="relative z-10" aria-label={card.name}>
          <LenormandSymbol number={card.number} color="#d4af6f" size={s.symSize} />
        </div>
      </div>

      {/* Bottom: playing card rank + name */}
      <div className="shrink-0 pb-[7px] px-[6px]">
        {showPlayingCard && playing && (
          <div className="flex items-center justify-center gap-0.5 mb-[2px]">
            <span className={`${s.suit} font-bold leading-none ${playing.red ? "text-[#e85555]" : "text-[#c9c9c9]"} opacity-70`} style={{ fontSize: "0.6em" }}>
              {playing.rank}{playing.suit}
            </span>
          </div>
        )}
        <div className={`${s.name} font-serif-display text-[#e8c875] tracking-wide text-center leading-tight`}>
          {card.name.replace(/^(Le |La |Les |L')/, "")}
        </div>
      </div>
    </div>
  );
}
