"use client";

import { TarotCard } from "@/lib/tarot-cards";

interface Props {
  card: TarotCard & { reversed: boolean; positionIndex: number };
  position: string;
  isFlipped: boolean;
  onClick: () => void;
  index: number;
}

export default function TarotCardComponent({ card, position, isFlipped, onClick, index }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs text-purple-400 font-cinzel text-center">{position}</div>

      <div
        className="card-scene"
        style={{ width: 120, height: 200 }}
        onClick={onClick}
      >
        <div
          className={`card-3d ${isFlipped ? "flipped" : ""} ${isFlipped && card.reversed ? "card-reversed" : ""}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Back */}
          <div className="card-face card-back-face">
            <div className="flex flex-col items-center gap-2 text-purple-300/60">
              <div className="text-2xl">✦</div>
              <div className="text-[10px] font-cinzel text-center px-2">Cliquez pour révéler</div>
              <div className="text-lg">🌙</div>
              <div className="text-2xl">✦</div>
            </div>
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(124,58,237,0.3) 10px, rgba(124,58,237,0.3) 11px)",
            }} />
          </div>

          {/* Front */}
          <div className="card-face card-front-face">
            <div className="text-3xl mb-2">{card.emoji}</div>
            <div className="text-[11px] font-cinzel font-bold text-yellow-300 leading-tight mb-1">
              {card.name}
            </div>
            <div className="text-[9px] text-purple-400 mb-2 font-cinzel">{card.number}</div>
            <div className="text-[9px] text-purple-300/70 mb-2">{card.suit}</div>
            {card.reversed && (
              <div className="text-[9px] text-red-400 border border-red-400/30 rounded px-1.5 py-0.5">
                Inversée
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {card.keywords.slice(0, 2).map((k) => (
                <span key={k} className="text-[8px] text-purple-400/70 bg-purple-900/40 px-1 py-0.5 rounded">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
