"use client";

import { useState } from "react";
import { TarotCard } from "@/lib/tarot-cards";
import { getCardImage, type DeckType } from "@/lib/deck-images";
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  card: TarotCard & { reversed: boolean; positionIndex: number };
  position: string;
  isFlipped: boolean;
  onClick: () => void;
  index: number;
  deck?: DeckType;
}

function CardImage({ card, imageUrl, size }: { card: Props["card"]; imageUrl: string | null; size: "small" | "large" }) {
  if (imageUrl) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={card.name}
          fill
          unoptimized
          className="object-cover"
          sizes={size === "large" ? "400px" : "130px"}
        />
        <div className="absolute inset-0 border border-[rgba(212,175,111,0.5)] pointer-events-none" />
        {card.reversed && (
          <div className="absolute top-1.5 right-1.5 text-[8px] tracking-widest uppercase bg-[#07040d]/80 text-[#e8c875] border border-[#d4af6f] px-1.5 py-0.5 rounded-sm">
            ⟲
          </div>
        )}
        {size === "small" && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#07040d]/95 via-[#07040d]/70 to-transparent p-2 text-center">
            <div className="text-[9px] font-serif-display text-[#e8c875] leading-tight">{card.name}</div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-3">
      <div className={`mb-2 text-[#d4af6f] ${size === "large" ? "text-5xl" : "text-3xl"}`}>{card.emoji}</div>
      <div className={`font-serif-display text-[#e8c875] leading-tight mb-1 text-center ${size === "large" ? "text-base" : "text-[11px]"}`}>
        {card.name}
      </div>
      <div className={`text-[#8a6f3a] ${size === "large" ? "text-sm" : "text-[9px]"}`}>{card.number}</div>
      {card.reversed && (
        <div className={`tracking-widest uppercase text-[#d4af6f] border border-[#d4af6f] px-1.5 py-0.5 mt-2 ${size === "large" ? "text-xs" : "text-[8px]"}`}>
          Inversée
        </div>
      )}
    </div>
  );
}

export default function TarotCardComponent({ card, position, isFlipped, onClick, index, deck = "rws" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const imageUrl = getCardImage(card.id, deck);

  const handleClick = () => {
    if (isFlipped) {
      setExpanded(true);
    } else {
      onClick();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] text-center max-w-[120px] font-serif-display">
          {position}
        </div>

        <div
          className={`card-scene cursor-pointer ${isFlipped ? "hover:scale-105 transition-transform duration-200" : ""}`}
          style={{ width: 130, height: 220 }}
          onClick={handleClick}
          title={isFlipped ? "Cliquer pour agrandir" : undefined}
        >
          <div
            className={`card-3d ${isFlipped ? "flipped" : ""} ${isFlipped && card.reversed ? "card-reversed" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Back */}
            <div className="card-face card-back-face">
              <div className="flex flex-col items-center gap-3">
                <div className="text-[#d4af6f] text-2xl">✦</div>
                <div className="w-12 h-12 rounded-full border border-[rgba(212,175,111,0.4)] flex items-center justify-center">
                  <div className="text-[#d4af6f] text-xl">☽</div>
                </div>
                <div className="text-[#d4af6f] text-2xl">✦</div>
              </div>
              <div className="absolute inset-0 opacity-15" style={{
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(212,175,111,0.2) 8px, rgba(212,175,111,0.2) 9px)",
              }} />
            </div>

            {/* Front */}
            <div className="card-face card-front-face !p-0 overflow-hidden">
              <CardImage card={card} imageUrl={imageUrl} size="small" />
            </div>
          </div>
        </div>

        {isFlipped && (
          <div className="flex flex-wrap gap-1 justify-center max-w-[130px]">
            {card.keywords.slice(0, 2).map((k) => (
              <span key={k} className="text-[8px] tracking-wider text-[#c9b88a] bg-[rgba(13,8,32,0.6)] border border-[rgba(212,175,111,0.15)] px-1.5 py-0.5 rounded-sm">
                {k}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07040d]/90 backdrop-blur-sm p-6"
          onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
        >
          <div
            className="relative max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute -top-10 right-0 text-[#d4af6f] hover:text-[#e8c875] transition-colors"
            >
              <X size={22} />
            </button>

            <div className="text-center mb-4">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-1">{position}</div>
              <div className="font-serif-display text-xl text-cream">{card.name}</div>
              {card.reversed && (
                <div className="text-[10px] tracking-wider uppercase text-[#c9b88a] mt-1">— Inversée —</div>
              )}
            </div>

            <div
              className={`relative mx-auto rounded-sm overflow-hidden border border-[rgba(212,175,111,0.4)] shadow-[0_0_60px_rgba(212,175,111,0.2)] ${card.reversed ? "rotate-180" : ""}`}
              style={{ width: 260, height: 440 }}
            >
              <CardImage card={card} imageUrl={imageUrl} size="large" />
            </div>

            <div className="mt-5 text-center">
              <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                {card.keywords.map((k) => (
                  <span key={k} className="badge-soft text-[10px]">{k}</span>
                ))}
              </div>
              {card.upright && (
                <p className="font-serif-text italic text-[#c9b88a] text-[13px] leading-relaxed mt-2">
                  {card.reversed ? (card.meaningReversed || card.upright) : card.upright}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
