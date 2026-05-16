"use client";

import { useState, useCallback } from "react";
import { Download, Copy, Sparkles, Check } from "lucide-react";

// ── Sigil Algorithm ──────────────────────────────────────────────────────────

function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function processIntention(intention: string): {
  upper: string;
  noSpaces: string;
  noDupes: string;
  noVowels: string;
} {
  const upper = removeAccents(intention.toUpperCase());
  const noSpaces = upper.replace(/\s+/g, "");
  // Remove duplicate consecutive letters
  let noDupes = "";
  const seen = new Set<string>();
  for (const ch of noSpaces) {
    if (/[A-Z]/.test(ch) && !seen.has(ch)) {
      seen.add(ch);
      noDupes += ch;
    }
  }
  const noVowels = noDupes.replace(/[AEIOU]/g, "");
  return { upper, noSpaces, noDupes, noVowels };
}

// ── SVG Generation ────────────────────────────────────────────────────────────

// Maps a letter A–Z to an angle in degrees (A=0°, Z≈345°)
function letterToAngle(letter: string): number {
  const index = letter.charCodeAt(0) - 65; // A=0, B=1 ... Z=25
  return (index / 26) * 360;
}

// Maps a letter to a point on the circle (cx=150, cy=150, r=100)
function letterToPoint(letter: string): { x: number; y: number } {
  const angleDeg = letterToAngle(letter) - 90; // start from top
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: 150 + 100 * Math.cos(angleRad),
    y: 150 + 100 * Math.sin(angleRad),
  };
}

function buildSVG(letters: string[], bgColor = "#1a1208"): string {
  const viewSize = 300;
  const cx = 150;
  const cy = 150;
  const r = 100;

  if (letters.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${viewSize}" height="${viewSize}" viewBox="0 0 ${viewSize} ${viewSize}">
  <rect width="${viewSize}" height="${viewSize}" fill="${bgColor}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(212,175,111,0.15)" stroke-width="1"/>
  <circle cx="${cx}" cy="${cy}" r="3" fill="rgba(212,175,111,0.3)"/>
</svg>`;
  }

  // Deduplicate letters to avoid redundant points but preserve order
  const uniqueLetters = letters.filter((l, i) => letters.indexOf(l) === i);
  const points = uniqueLetters.map(letterToPoint);

  // Build connecting line segments between consecutive consonant points
  const lineSegments = points.length > 1
    ? points.map((p, i) => {
        if (i === 0) return "";
        const prev = points[i - 1];
        return `<line x1="${prev.x.toFixed(2)}" y1="${prev.y.toFixed(2)}" x2="${p.x.toFixed(2)}" y2="${p.y.toFixed(2)}" stroke="rgba(212,175,111,0.7)" stroke-width="1.2" stroke-linecap="round"/>`;
      }).join("\n  ")
    : "";

  // Close the shape: connect last point back to first
  const closingLine = points.length > 2
    ? `<line x1="${points[points.length - 1].x.toFixed(2)}" y1="${points[points.length - 1].y.toFixed(2)}" x2="${points[0].x.toFixed(2)}" y2="${points[0].y.toFixed(2)}" stroke="rgba(212,175,111,0.35)" stroke-width="0.7" stroke-dasharray="3,3"/>`
    : "";

  // Small dot at each used letter position
  const dots = points.map((p) =>
    `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="3" fill="#d4af6f" opacity="0.85"/>`
  ).join("\n  ");

  // Tiny letter labels near each point (offset outward)
  const labels = uniqueLetters.map((l, i) => {
    const p = points[i];
    const angleDeg = letterToAngle(l) - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const labelDist = r + 14;
    const lx = (cx + labelDist * Math.cos(angleRad)).toFixed(2);
    const ly = (cy + labelDist * Math.sin(angleRad) + 4).toFixed(2);
    return `<text x="${lx}" y="${ly}" text-anchor="middle" font-family="Georgia, serif" font-size="8" fill="rgba(212,175,111,0.55)">${l}</text>`;
  }).join("\n  ");

  // Start/end marker: a small circle at the first point
  const startMarker = points.length > 0
    ? `<circle cx="${points[0].x.toFixed(2)}" cy="${points[0].y.toFixed(2)}" r="5" fill="none" stroke="rgba(212,175,111,0.9)" stroke-width="1.2"/>`
    : "";

  // Tick marks for all 26 letter positions
  const tickMarks = Array.from({ length: 26 }, (_, i) => {
    const a = ((i / 26) * 360 - 90) * (Math.PI / 180);
    const x1 = (cx + (r - 4) * Math.cos(a)).toFixed(2);
    const y1 = (cy + (r - 4) * Math.sin(a)).toFixed(2);
    const x2 = (cx + (r + 2) * Math.cos(a)).toFixed(2);
    const y2 = (cy + (r + 2) * Math.sin(a)).toFixed(2);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(212,175,111,0.12)" stroke-width="0.5"/>`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${viewSize}" height="${viewSize}" viewBox="0 0 ${viewSize} ${viewSize}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#231a08"/>
      <stop offset="100%" stop-color="${bgColor}"/>
    </radialGradient>
  </defs>
  <rect width="${viewSize}" height="${viewSize}" fill="url(#bg)"/>
  <!-- Outer decorative circles -->
  <circle cx="${cx}" cy="${cy}" r="${r + 22}" fill="none" stroke="rgba(212,175,111,0.08)" stroke-width="0.5"/>
  <!-- Main letter-circle -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(212,175,111,0.2)" stroke-width="0.8"/>
  <!-- Letter position tick marks -->
  ${tickMarks}
  <!-- Sigil lines -->
  ${lineSegments}
  ${closingLine}
  <!-- Letter dots and labels -->
  ${dots}
  ${labels}
  ${startMarker}
  <!-- Center point -->
  <circle cx="${cx}" cy="${cy}" r="2" fill="rgba(212,175,111,0.5)"/>
</svg>`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SigilPage() {
  const [intention, setIntention] = useState("");
  const [copied, setCopied] = useState(false);

  const { upper, noSpaces, noDupes, noVowels } = processIntention(intention);
  const sigilLetters = noVowels.split("").filter(Boolean);
  const svgContent = buildSVG(sigilLetters);

  const downloadSVG = useCallback(() => {
    if (!intention.trim()) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sigil-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [svgContent, intention]);

  const copySVG = useCallback(async () => {
    if (!intention.trim()) return;
    await navigator.clipboard.writeText(svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [svgContent, intention]);

  const hasResult = sigilLetters.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 fade-in-up">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="badge-gold mb-5">
          <Sparkles size={11} className="inline mr-2" />
          Magie du Chaos · Sigil
        </div>
        <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
          Générateur de Sigils
        </h1>
        <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
          Transformez une intention en symbole sacré
        </p>
      </div>

      {/* Input */}
      <div className="luxe-card rounded-sm p-8 mb-8">
        <label className="luxe-label">Votre intention</label>
        <input
          type="text"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="Je suis en pleine santé et confiance..."
          className="luxe-input"
          autoFocus
        />
        <p className="text-[11px] text-[#c9b88a] mt-3 tracking-wide">
          Formulez une intention positive, au présent, à la première personne
        </p>
      </div>

      {/* SVG Preview + Process */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Sigil */}
        <div className="luxe-card rounded-sm p-8 flex flex-col items-center">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-6">Votre Sigil</div>

          <div
            className="rounded-sm overflow-hidden mb-6"
            style={{ background: "#1a1208", border: "1px solid rgba(212,175,111,0.2)" }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />

          {hasResult && (
            <div className="flex gap-3 w-full">
              <button
                onClick={downloadSVG}
                className="btn-gold flex-1 text-sm"
              >
                <Download size={13} />
                <span>Télécharger</span>
              </button>
              <button
                onClick={copySVG}
                className="btn-outline-gold flex-1 text-sm"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? "Copié !" : "Copier SVG"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Process breakdown */}
        <div className="luxe-card rounded-sm p-8">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-6">Processus de distillation</div>

          <div className="space-y-4">
            <Step
              number="1"
              label="Intention originale"
              value={intention || "—"}
              muted={!intention}
            />
            <Arrow />
            <Step
              number="2"
              label="Majuscules sans accents"
              value={upper || "—"}
              muted={!upper}
            />
            <Arrow />
            <Step
              number="3"
              label="Sans espaces, sans doublons"
              value={noDupes || "—"}
              muted={!noDupes}
            />
            <Arrow />
            <Step
              number="4"
              label="Lettres du sigil (sans voyelles)"
              value={noVowels || "—"}
              highlight={!!noVowels}
              muted={!noVowels}
            />
          </div>

          {hasResult && (
            <div className="mt-6 pt-6 border-t border-[rgba(212,175,111,0.1)]">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">Lettres utilisées</div>
              <div className="flex flex-wrap gap-2">
                {sigilLetters.map((l, i) => (
                  <span
                    key={i}
                    className="w-9 h-9 flex items-center justify-center rounded-sm border border-[rgba(212,175,111,0.3)] text-[#d4af6f] font-serif-display text-lg"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="luxe-card rounded-sm p-8 mb-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-5">Qu&apos;est-ce qu&apos;un sigil ?</div>
        <div className="font-serif-text text-[#e8dcc0] text-[16px] leading-[1.85] space-y-3">
          <p>
            Un sigil (du latin <em>sigillum</em>, « sceau ») est un symbole magique créé à partir d&apos;une intention formulée.
            La technique moderne du sigil, popularisée par le magicien du chaos Austin Osman Spare, consiste à condenser
            une intention en un symbole visuel unique afin de la communiquer directement à l&apos;inconscient.
          </p>
          <p>
            En retirant les voyelles et les répétitions, on dépouille l&apos;intention de son sens littéral conscient.
            Le symbole résultant peut alors être « chargé » et « lancé » sans que le mental ne s&apos;y accroche.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-[rgba(212,175,111,0.1)]">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Comment utiliser votre sigil</div>
          <div className="grid sm:grid-cols-3 gap-4">
            <UseCard
              icon="🔥"
              title="La brûler"
              desc="Chargez le sigil en vous y concentrant intensément, puis brûlez le papier pour libérer l'intention dans l'univers."
            />
            <UseCard
              icon="🧘"
              title="Méditation"
              desc="Fixez le sigil pendant la méditation. Laissez votre esprit se vider tout en absorbant le symbole."
            />
            <UseCard
              icon="📱"
              title="Fond d'écran"
              desc="Utilisez-le comme fond d'écran ou screensaver pour exposer votre inconscient au symbole quotidiennement."
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mb-4">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-6">Conseils pour la magie des sigils</div>
        <div className="grid sm:grid-cols-3 gap-5">
          <TipCard
            title="Formulez positivement"
            text="Évitez les négations : au lieu de « Je n'ai plus peur », écrivez « Je suis courageux et confiant ». L'inconscient n'entend pas le « ne… pas »."
          />
          <TipCard
            title="Oubliez l'intention"
            text="Une fois le sigil créé et lancé, essayez de l'oublier consciemment. S'y accrocher crée une résistance. La magie travaille mieux dans l'oubli."
          />
          <TipCard
            title="Le moment gnostique"
            text="Chargez le sigil dans un état modifié de conscience : intense rire, fatigue extrême, méditation profonde ou pic d'émotion positive."
          />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Step({
  number,
  label,
  value,
  highlight,
  muted,
}: {
  number: string;
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-5 h-5 rounded-full border border-[rgba(212,175,111,0.4)] text-[#d4af6f] text-[10px] flex items-center justify-center font-serif-display">
        {number}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] tracking-[0.2em] uppercase text-[#c9b88a] mb-0.5">{label}</div>
        <div
          className={`font-serif-display text-sm break-all ${
            highlight ? "text-[#d4af6f] text-base tracking-widest" : muted ? "text-[#6b5d3e]" : "text-cream"
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center gap-3 pl-2">
      <div className="text-[rgba(212,175,111,0.3)] text-xs pl-1">↓</div>
    </div>
  );
}

function UseCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-sm border border-[rgba(212,175,111,0.15)] p-4 bg-[rgba(212,175,111,0.03)]">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-serif-display text-sm text-cream mb-1">{title}</div>
      <p className="text-[12px] text-[#c9b88a] leading-relaxed">{desc}</p>
    </div>
  );
}

function TipCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="luxe-card rounded-sm p-5">
      <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-2">{title}</div>
      <p className="font-serif-text text-[#c9b88a] text-[13px] leading-relaxed">{text}</p>
    </div>
  );
}
