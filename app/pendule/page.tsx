"use client";
import { useState, useCallback } from "react";
import { Sparkles, RotateCcw } from "lucide-react";

type PenduleResult = "OUI" | "NON" | "PEUT-ÊTRE";

interface ResultConfig {
  label: PenduleResult;
  finalAngle: number; // CSS rotate degrees at rest
  color: string;
  glow: string;
  message: string;
}

const RESULTS: ResultConfig[] = [
  {
    label: "OUI",
    finalAngle: 0,
    color: "#b5a34a",
    glow: "0 0 40px rgba(181,163,74,0.5)",
    message: "Le pendule s'est stabilisé dans l'axe vertical : les énergies convergent vers un Oui. La voie est dégagée.",
  },
  {
    label: "NON",
    finalAngle: 90,
    color: "#8b1a1a",
    glow: "0 0 40px rgba(139,26,26,0.5)",
    message: "Le pendule s'immobilise à l'horizontale : les forces vous invitent à la prudence et au recul. La réponse est Non.",
  },
  {
    label: "PEUT-ÊTRE",
    finalAngle: 45,
    color: "#7c3aed",
    glow: "0 0 40px rgba(124,58,237,0.5)",
    message: "Le pendule hésite sur la diagonale : l'heure n'est pas encore à la certitude. Laissez le temps faire son œuvre.",
  },
];

function pickResult(): ResultConfig {
  return RESULTS[Math.floor(Math.random() * RESULTS.length)];
}

// CSS keyframes injected inline to avoid external stylesheet dependency
const PENDULE_STYLES = `
@keyframes pendule-swing {
  0%   { transform: rotate(0deg); }
  10%  { transform: rotate(28deg); }
  20%  { transform: rotate(-26deg); }
  30%  { transform: rotate(22deg); }
  40%  { transform: rotate(-18deg); }
  50%  { transform: rotate(14deg); }
  60%  { transform: rotate(-10deg); }
  70%  { transform: rotate(7deg); }
  80%  { transform: rotate(-4deg); }
  90%  { transform: rotate(2deg); }
  100% { transform: rotate(0deg); }
}

@keyframes pendule-swing-to-non {
  0%   { transform: rotate(0deg); }
  10%  { transform: rotate(28deg); }
  20%  { transform: rotate(-26deg); }
  30%  { transform: rotate(22deg); }
  40%  { transform: rotate(-18deg); }
  50%  { transform: rotate(14deg); }
  60%  { transform: rotate(-10deg); }
  70%  { transform: rotate(7deg); }
  80%  { transform: rotate(85deg); }
  90%  { transform: rotate(92deg); }
  100% { transform: rotate(90deg); }
}

@keyframes pendule-swing-to-peut-etre {
  0%   { transform: rotate(0deg); }
  10%  { transform: rotate(28deg); }
  20%  { transform: rotate(-26deg); }
  30%  { transform: rotate(22deg); }
  40%  { transform: rotate(-18deg); }
  50%  { transform: rotate(14deg); }
  60%  { transform: rotate(-10deg); }
  70%  { transform: rotate(40deg); }
  80%  { transform: rotate(47deg); }
  90%  { transform: rotate(43deg); }
  100% { transform: rotate(45deg); }
}

.pendule-anim-oui {
  animation: pendule-swing 3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  transform-origin: 100px 10px;
}
.pendule-anim-non {
  animation: pendule-swing-to-non 3.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  transform-origin: 100px 10px;
}
.pendule-anim-peut-etre {
  animation: pendule-swing-to-peut-etre 3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  transform-origin: 100px 10px;
}
`;

interface AxisLabel {
  x: number;
  y: number;
  label: string;
  anchor: "middle" | "start" | "end";
}

const AXIS_LABELS: AxisLabel[] = [
  { x: 100, y: 28, label: "OUI", anchor: "middle" },
  { x: 185, y: 118, label: "NON", anchor: "start" },
  { x: 100, y: 238, label: "?", anchor: "middle" },
  { x: 15, y: 118, label: "NON", anchor: "end" },
];

function PenduleSVG({ animClass }: { animClass: string }) {
  return (
    <svg width="200" height="250" viewBox="0 0 200 250" aria-hidden="true">
      <defs>
        <radialGradient id="gemGradient" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#6b21a8" />
        </radialGradient>
        <radialGradient id="pivotGradient" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#e8c875" />
          <stop offset="100%" stopColor="#d4af6f" />
        </radialGradient>
        <filter id="gemGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Outer graduated circle */}
        <filter id="circleGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Graduated background circle */}
      <circle
        cx="100"
        cy="118"
        r="105"
        fill="none"
        stroke="rgba(212,175,111,0.12)"
        strokeWidth="1"
        filter="url(#circleGlow)"
      />
      <circle
        cx="100"
        cy="118"
        r="90"
        fill="none"
        stroke="rgba(212,175,111,0.07)"
        strokeWidth="1"
      />

      {/* Axis lines */}
      <line x1="100" y1="13" x2="100" y2="223" stroke="rgba(212,175,111,0.18)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="10" y1="118" x2="190" y2="118" stroke="rgba(212,175,111,0.18)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="26" y1="34" x2="174" y2="202" stroke="rgba(212,175,111,0.10)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="174" y1="34" x2="26" y2="202" stroke="rgba(212,175,111,0.10)" strokeWidth="1" strokeDasharray="4 4" />

      {/* Axis labels */}
      {AXIS_LABELS.map((al) => (
        <text
          key={al.label + al.x}
          x={al.x}
          y={al.y}
          textAnchor={al.anchor}
          fill="rgba(212,175,111,0.45)"
          fontSize="9"
          fontFamily="var(--font-inter, sans-serif)"
          letterSpacing="2"
          textLength={al.label.length * 6}
        >
          {al.label}
        </text>
      ))}

      {/* The pendule itself (animated group) */}
      <g className={animClass}>
        {/* Fil */}
        <line x1="100" y1="10" x2="100" y2="210" stroke="#d4af6f" strokeWidth="1.5" strokeLinecap="round" />
        {/* Pivot */}
        <circle cx="100" cy="10" r="5" fill="url(#pivotGradient)" />
        {/* Gemme */}
        <circle cx="100" cy="220" r="18" fill="url(#gemGradient)" filter="url(#gemGlow)" opacity="0.95" />
        {/* Gemme highlight */}
        <circle cx="93" cy="213" r="5" fill="rgba(255,255,255,0.25)" />
      </g>
    </svg>
  );
}

export default function PendulePage() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<"form" | "swinging" | "done">("form");
  const [result, setResult] = useState<ResultConfig | null>(null);
  const [animClass, setAnimClass] = useState("");

  const handleSwing = useCallback(() => {
    if (!question.trim()) return;
    const picked = pickResult();
    setResult(picked);
    setPhase("swinging");

    const classMap: Record<PenduleResult, string> = {
      OUI: "pendule-anim-oui",
      NON: "pendule-anim-non",
      "PEUT-ÊTRE": "pendule-anim-peut-etre",
    };
    setAnimClass(classMap[picked.label]);

    // Show result after animation completes (~3.2s max)
    setTimeout(() => setPhase("done"), 3500);
  }, [question]);

  const handleReset = () => {
    setPhase("form");
    setResult(null);
    setAnimClass("");
    setQuestion("");
  };

  return (
    <>
      {/* Inject animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: PENDULE_STYLES }} />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="fade-in-up">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Sparkles size={11} className="inline mr-2" />
              Divination par le pendule
            </div>
            <h1 className="font-serif-display text-5xl text-gradient-cream mb-4">
              Pendule Virtuel
            </h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-md mx-auto">
              &ldquo;Laissez les énergies guider le pendule vers votre vérité.&rdquo;
            </p>
          </div>

          {/* Form */}
          {phase === "form" && (
            <div className="flex flex-col items-center gap-8">
              <div className="w-full max-w-md">
                <label className="luxe-label">Votre question (Oui / Non)</label>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && question.trim() && handleSwing()}
                  placeholder="Ex : Dois-je accepter cette proposition ?"
                  className="luxe-input"
                  maxLength={200}
                />
              </div>

              <button
                onClick={handleSwing}
                disabled={!question.trim()}
                className="btn-gold"
              >
                <Sparkles size={14} />
                <span>Faire osciller le pendule</span>
              </button>

              <p className="text-[11px] tracking-widest uppercase text-[#8a6f3a]">
                Tirage gratuit · Sans inscription
              </p>
            </div>
          )}

          {/* Pendule display */}
          {(phase === "swinging" || phase === "done") && (
            <div className="flex flex-col items-center gap-8">

              {/* Question */}
              <div className="luxe-card rounded-sm p-5 w-full max-w-md text-center">
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-2">
                  Votre question
                </div>
                <p className="font-serif-text italic text-[#e8dcc0] text-lg">&ldquo;{question}&rdquo;</p>
              </div>

              {/* SVG pendule */}
              <div
                style={{
                  background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(45,10,62,0.6) 0%, rgba(7,4,13,0.8) 100%)",
                  border: "1px solid rgba(212,175,111,0.15)",
                  borderRadius: 12,
                  padding: "32px 40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PenduleSVG animClass={animClass} />
              </div>

              {/* Swinging indicator */}
              {phase === "swinging" && (
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] animate-pulse">
                  Le pendule consulte les énergies...
                </div>
              )}

              {/* Result */}
              {phase === "done" && result && (
                <div className="fade-in flex flex-col items-center gap-6 w-full max-w-md">
                  <div className="gold-line w-full" />

                  {/* Result label */}
                  <div className="text-center">
                    <div
                      className="font-serif-display"
                      style={{
                        fontSize: "4.5rem",
                        fontWeight: 700,
                        color: result.color,
                        textShadow: result.glow,
                        letterSpacing: "0.05em",
                        lineHeight: 1,
                      }}
                    >
                      {result.label}
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="luxe-card-premium rounded-sm p-7 w-full text-center">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">
                      Message du pendule
                    </div>
                    <p className="font-serif-text text-[#e8dcc0] text-lg leading-relaxed italic">
                      {result.message}
                    </p>
                  </div>

                  <div className="gold-line w-full" />

                  <button onClick={handleReset} className="btn-outline-gold gap-2">
                    <RotateCcw size={13} />
                    Nouvelle question
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </>
  );
}
