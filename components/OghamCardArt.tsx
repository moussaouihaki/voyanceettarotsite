"use client";

interface OghamFid {
  id: string;
  letter: string;
  name: string;
  tree?: string;
  element?: string;
  number?: number;
}

interface Props {
  fid: OghamFid;
  size?: "sm" | "md" | "lg";
  revealed?: boolean;
}

const SIZE = {
  sm: { card: "w-[60px] h-[100px]", glyph: "text-2xl", name: "text-[7px]", tree: "text-[6px]" },
  md: { card: "w-[84px] h-[140px]", glyph: "text-3xl", name: "text-[9px]", tree: "text-[7px]" },
  lg: { card: "w-[110px] h-[185px]", glyph: "text-4xl", name: "text-[11px]", tree: "text-[9px]" },
};

const ELEMENT_COLORS: Record<string, string> = {
  "Feu":   "#c86c3a",
  "Terre": "#6a9e3a",
  "Air":   "#7090c8",
  "Eau":   "#3a7a9e",
};

export default function OghamCardArt({ fid, size = "md", revealed = true }: Props) {
  const s = SIZE[size];
  const color = fid.element ? (ELEMENT_COLORS[fid.element] ?? "#d4af6f") : "#d4af6f";

  if (!revealed) {
    return (
      <div className={`${s.card} rounded-sm border border-[rgba(212,175,111,0.25)] bg-gradient-to-b from-[#0e1808] to-[#050a03] flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[rgba(212,175,111,0.15)]" />
        <span className="text-[rgba(212,175,111,0.15)] text-xl font-serif" style={{ writingMode: "vertical-rl", textOrientation: "upright", letterSpacing: "0.3em" }}>✦</span>
      </div>
    );
  }

  return (
    <div
      className={`${s.card} rounded-sm border border-[rgba(100,160,60,0.4)] bg-gradient-to-b from-[#0a1205] via-[#080f04] to-[#030701] flex flex-col relative overflow-hidden`}
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.4)" }}
    >
      {/* Vertical stem line — the ogham stave */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px"
        style={{ background: `linear-gradient(to bottom, transparent 5%, ${color}60 20%, ${color}80 50%, ${color}60 80%, transparent 95%)` }}
      />

      {/* Number top */}
      <div className="flex justify-center pt-[6px] shrink-0">
        <div className={`${s.tree} text-[rgba(212,175,111,0.4)] font-serif-display`}>{fid.number}</div>
      </div>

      {/* Central ogham letter */}
      <div className="flex-1 flex items-center justify-center">
        <span
          className={`${s.glyph} relative z-10`}
          style={{
            color,
            textShadow: `0 0 16px ${color}80`,
            fontFamily: "'Noto Sans Ogham', serif",
          }}
        >
          {fid.letter}
        </span>
      </div>

      {/* Bottom: tree + name */}
      <div className="shrink-0 pb-[6px] px-[5px] flex flex-col items-center gap-[2px]">
        {fid.tree && (
          <div className={`${s.tree} tracking-wider uppercase text-center`} style={{ color: `${color}99` }}>
            {fid.tree}
          </div>
        )}
        <div className={`${s.name} font-serif-display text-[#e8c875] tracking-wider text-center`}>
          {fid.name}
        </div>
      </div>
    </div>
  );
}
