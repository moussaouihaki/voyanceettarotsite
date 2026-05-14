"use client";

import { TarotCard } from "@/lib/tarot-cards";
import { getTarotImage } from "@/lib/tarot-images";
import Image from "next/image";

interface Props {
  card: TarotCard & { reversed: boolean; positionIndex: number };
  position: string;
  isFlipped: boolean;
  onClick: () => void;
  index: number;
}

export default function TarotCardComponent({ card, position, isFlipped, onClick, index }: Props) {
  const imageUrl = getTarotImage(card.id);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] text-center max-w-[120px] font-serif-display">
        {position}
      </div>

      <div
        className="card-scene"
        style={{ width: 130, height: 220 }}
        onClick={onClick}
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
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-15" style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(212,175,111,0.2) 8px, rgba(212,175,111,0.2) 9px)",
            }} />
          </div>

          {/* Front */}
          <div className="card-face card-front-face !p-0 overflow-hidden">
            {imageUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={card.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="130px"
                />
                {/* Gold border frame overlay */}
                <div className="absolute inset-0 border border-[rgba(212,175,111,0.5)] pointer-events-none" />
                {card.reversed && (
                  <div className="absolute top-1.5 right-1.5 text-[8px] tracking-widest uppercase bg-[#07040d]/80 text-[#e8c875] border border-[#d4af6f] px-1.5 py-0.5 rounded-sm">
                    ⟲
                  </div>
                )}
                {/* Name strip at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#07040d]/95 via-[#07040d]/70 to-transparent p-2 text-center">
                  <div className="text-[9px] font-serif-display text-[#e8c875] leading-tight">{card.name}</div>
                </div>
              </div>
            ) : (
              // Fallback if image fails
              <div className="flex flex-col items-center justify-center w-full h-full p-3">
                <div className="text-3xl mb-2 text-[#d4af6f]">{card.emoji}</div>
                <div className="text-[11px] font-serif-display text-[#e8c875] leading-tight mb-1 text-center">
                  {card.name}
                </div>
                <div className="text-[9px] text-[#8a6f3a] mb-2">{card.number}</div>
                <div className="text-[9px] text-[#c9b88a] mb-2">{card.suit}</div>
                {card.reversed && (
                  <div className="text-[8px] tracking-widest uppercase text-[#d4af6f] border border-[#d4af6f] px-1.5 py-0.5">
                    Inversée
                  </div>
                )}
              </div>
            )}
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
  );
}
