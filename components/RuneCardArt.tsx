"use client";

interface RuneCard {
  id: string;
  symbol: string;
  name: string;
  phonetic?: string;
  number?: number;
  element?: string;
}

interface Props {
  rune: RuneCard;
  size?: "sm" | "md" | "lg";
  revealed?: boolean;
  reversed?: boolean;
}

const SIZE = {
  sm: { card: "w-[64px] h-[96px]", glyph: "text-3xl", name: "text-[7px]", detail: "text-[7px]" },
  md: { card: "w-[90px] h-[135px]", glyph: "text-4xl", name: "text-[9px]", detail: "text-[8px]" },
  lg: { card: "w-[120px] h-[180px]", glyph: "text-5xl", name: "text-[11px]", detail: "text-[9px]" },
};

const ELEMENT_COLORS: Record<string, string> = {
  "Feu": "#e85535",
  "Terre": "#7a9e4a",
  "Air": "#5588d4",
  "Eau": "#4a8aaa",
  "Glace": "#a8c8e8",
};

export default function RuneCardArt({ rune, size = "md", revealed = true, reversed = false }: Props) {
  const s = SIZE[size];
  const elementColor = rune.element ? (ELEMENT_COLORS[rune.element] ?? "#d4af6f") : "#d4af6f";

  if (!revealed) {
    return (
      <div className={`${s.card} rounded-sm border border-[rgba(212,175,111,0.3)] bg-gradient-to-b from-[#1a0829] to-[#07040d] flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-[3px] border border-[rgba(212,175,111,0.1)]" />
        <span className="text-[rgba(212,175,111,0.2)] text-2xl">ᚢ</span>
      </div>
    );
  }

  return (
    <div
      className={`${s.card} rounded-sm border border-[rgba(212,175,111,0.4)] bg-gradient-to-b from-[#120820] to-[#05030d] flex flex-col relative overflow-hidden`}
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.3)" }}
    >
      {/* Weathered texture overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='1' fill='%23ffffff'/%3E%3C/svg%3E\")" }}
      />
      {/* Side rune borders */}
      <div className="absolute left-[4px] top-0 bottom-0 w-px opacity-20" style={{ background: `linear-gradient(to bottom, transparent, ${elementColor}, transparent)` }} />
      <div className="absolute right-[4px] top-0 bottom-0 w-px opacity-20" style={{ background: `linear-gradient(to bottom, transparent, ${elementColor}, transparent)` }} />

      {/* Top: number + phonetic */}
      <div className="flex items-center justify-between px-[7px] pt-[6px] shrink-0">
        <div className={`${s.detail} text-[#d4af6f] font-serif-display opacity-60`}>{rune.number}</div>
        <div className={`${s.detail} text-[#d4af6f] font-serif-display opacity-50`}>{rune.phonetic}</div>
      </div>

      {/* Central rune glyph */}
      <div className="flex-1 flex items-center justify-center">
        <span
          className={`${s.glyph} select-none transition-transform duration-300`}
          style={{
            color: elementColor,
            textShadow: `0 0 20px ${elementColor}60, 0 0 40px ${elementColor}30`,
            transform: reversed ? "rotate(180deg)" : "none",
            fontFamily: "serif",
          }}
        >
          {rune.symbol}
        </span>
      </div>

      {/* Bottom: element dot + name */}
      <div className="shrink-0 pb-[6px] px-[6px] flex flex-col items-center gap-[3px]">
        {rune.element && (
          <div className={`${s.detail} tracking-widest uppercase opacity-50`} style={{ color: elementColor }}>
            {rune.element}
          </div>
        )}
        <div className={`${s.name} font-serif-display text-[#e8c875] tracking-wider text-center`}>
          {rune.name}
        </div>
        {reversed && (
          <div className="text-[7px] tracking-widest uppercase text-[#d4af6f] border border-[rgba(212,175,111,0.3)] px-1">
            ⟲ Inversée
          </div>
        )}
      </div>
    </div>
  );
}
