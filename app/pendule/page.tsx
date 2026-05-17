"use client";
import { useState, useCallback, useEffect } from "react";
import { Sparkles, RotateCcw, BookOpen } from "lucide-react";
import Link from "next/link";
import { useUserProfile } from "@/contexts/UserProfileContext";

type PenduleResult = "OUI" | "NON" | "PEUT-ÊTRE";

interface Crystal {
  id: string;
  name: string;
  color1: string;
  color2: string;
  highlight: string;
  glowColor: string;
  power: string;
  emoji: string;
}

const CRYSTALS: Crystal[] = [
  { id: "amethyste", name: "Améthyste", color1: "#c084fc", color2: "#6b21a8", highlight: "rgba(192,132,252,0.35)", glowColor: "rgba(139,92,246,0.6)", power: "Intuition & clarté spirituelle", emoji: "💜" },
  { id: "quartz", name: "Quartz Clair", color1: "#e0f2fe", color2: "#94a3b8", highlight: "rgba(255,255,255,0.5)", glowColor: "rgba(186,230,253,0.6)", power: "Vérité & amplification", emoji: "🤍" },
  { id: "obsidienne", name: "Obsidienne", color1: "#374151", color2: "#111827", highlight: "rgba(156,163,175,0.2)", glowColor: "rgba(55,65,81,0.8)", power: "Protection & révélation", emoji: "🖤" },
  { id: "rose", name: "Quartz Rose", color1: "#fda4af", color2: "#e11d48", highlight: "rgba(253,164,175,0.35)", glowColor: "rgba(244,63,94,0.5)", power: "Amour & guidance du cœur", emoji: "🩷" },
  { id: "citrine", name: "Citrine", color1: "#fde68a", color2: "#d97706", highlight: "rgba(253,230,138,0.4)", glowColor: "rgba(251,191,36,0.6)", power: "Abondance & confiance", emoji: "💛" },
  { id: "lapis", name: "Lapis-Lazuli", color1: "#60a5fa", color2: "#1e3a8a", highlight: "rgba(96,165,250,0.35)", glowColor: "rgba(59,130,246,0.6)", power: "Sagesse & vérité profonde", emoji: "💙" },
];

const MESSAGES: Record<PenduleResult, string[]> = {
  "OUI": [
    "Le pendule s'est stabilisé dans l'axe vertical : les énergies convergent vers un Oui. La voie est dégagée.",
    "Un mouvement franc et décidé vers l'axe du Oui. L'univers aligne ses forces en votre faveur.",
    "La vibration est claire et positive. Votre question reçoit une réponse affirmative des énergies consultées.",
    "Le pendule ne laisse aucun doute : la réponse est Oui. Faites confiance à ce signal lumineux.",
    "Une oscillation régulière sur l'axe du Oui — signe d'une énergie stable et confirmée en votre faveur.",
  ],
  "NON": [
    "Le pendule s'immobilise à l'horizontale : les forces vous invitent à la prudence et au recul. La réponse est Non.",
    "Un mouvement décidé vers l'axe horizontal indique un Non clair. Cette voie n'est pas la vôtre en ce moment.",
    "Les énergies résistent et indiquent Non. Un obstacle invisible vous protège peut-être d'un mauvais choix.",
    "La vibration se stabilise sur l'axe du Non. L'univers vous demande de regarder dans une autre direction.",
    "Un Non ferme et net. Acceptez cette guidance avec sérénité — un Non peut être le plus beau des cadeaux.",
  ],
  "PEUT-ÊTRE": [
    "Le pendule hésite sur la diagonale : l'heure n'est pas encore à la certitude. Laissez le temps faire son œuvre.",
    "Une oscillation indécise entre deux axes — la situation n'est pas encore mûre pour une réponse définitive.",
    "Les énergies sont partagées. Peut-être que la question mérite d'être reformulée, ou le moment attendu.",
    "La réponse se trouve dans l'entre-deux. Méditez davantage sur votre question avant de consulter à nouveau.",
    "Le pendule vous invite à la patience. Ce Peut-être est porteur d'une sagesse : attendez que le chemin se dégage.",
  ],
};

const RITUALS: Record<PenduleResult, string> = {
  "OUI": "Remerciez les énergies en posant votre main sur votre cœur. Visualisez votre désir accompli pendant 30 secondes.",
  "NON": "Respirez profondément et acceptez cette guidance. Posez votre cristal sur votre front quelques instants pour intégrer la réponse.",
  "PEUT-ÊTRE": "Reposez la question demain, après une nuit de sommeil. Notez vos rêves — ils pourraient apporter la réponse.",
};

const FOCUS_MESSAGES = [
  "Fermez les yeux et respirez profondément...",
  "Visualisez votre question avec clarté...",
  "Connectez-vous à l'énergie du cristal...",
  "Laissez votre intention se former...",
  "Le pendule s'éveille à votre vibration...",
];

const PENDULE_STYLES = `
@keyframes pendule-swing-oui {
  0%   { transform: rotate(-35deg); }
  8%   { transform: rotate(35deg); }
  16%  { transform: rotate(-28deg); }
  24%  { transform: rotate(28deg); }
  32%  { transform: rotate(-21deg); }
  40%  { transform: rotate(21deg); }
  48%  { transform: rotate(-14deg); }
  56%  { transform: rotate(14deg); }
  64%  { transform: rotate(-7deg); }
  72%  { transform: rotate(7deg); }
  80%  { transform: rotate(-3deg); }
  88%  { transform: rotate(3deg); }
  100% { transform: rotate(0deg); }
}

@keyframes pendule-swing-non {
  0%   { transform: rotate(-35deg); }
  8%   { transform: rotate(35deg); }
  16%  { transform: rotate(-28deg); }
  24%  { transform: rotate(28deg); }
  32%  { transform: rotate(-21deg); }
  40%  { transform: rotate(50deg); }
  50%  { transform: rotate(75deg); }
  60%  { transform: rotate(85deg); }
  72%  { transform: rotate(92deg); }
  84%  { transform: rotate(89deg); }
  92%  { transform: rotate(91deg); }
  100% { transform: rotate(90deg); }
}

@keyframes pendule-swing-peut-etre {
  0%   { transform: rotate(-35deg); }
  8%   { transform: rotate(35deg); }
  16%  { transform: rotate(-28deg); }
  24%  { transform: rotate(28deg); }
  32%  { transform: rotate(-18deg); }
  40%  { transform: rotate(18deg); }
  50%  { transform: rotate(35deg); }
  60%  { transform: rotate(42deg); }
  72%  { transform: rotate(47deg); }
  84%  { transform: rotate(44deg); }
  92%  { transform: rotate(46deg); }
  100% { transform: rotate(45deg); }
}

@keyframes gem-pulse {
  0%, 100% { opacity: 0.9; filter: url(#gemGlow); }
  50% { opacity: 1; filter: url(#gemGlowBright); }
}

@keyframes focus-fade {
  0%   { opacity: 0; transform: translateY(4px); }
  20%  { opacity: 1; transform: translateY(0); }
  80%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-4px); }
}

.pendule-anim-oui {
  animation: pendule-swing-oui 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
  transform-origin: 150px 15px;
}
.pendule-anim-non {
  animation: pendule-swing-non 4.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
  transform-origin: 150px 15px;
}
.pendule-anim-peut-etre {
  animation: pendule-swing-peut-etre 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
  transform-origin: 150px 15px;
}
.gem-pulse { animation: gem-pulse 2s ease-in-out infinite; }
.focus-msg { animation: focus-fade 2.5s ease-in-out forwards; }
`;

function PenduleSVG({ animClass, crystal, isSwinging }: { animClass: string; crystal: Crystal; isSwinging: boolean }) {
  return (
    <svg width="300" height="320" viewBox="0 0 300 320" aria-hidden="true">
      <defs>
        <radialGradient id="gemGradient" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={crystal.color1} />
          <stop offset="100%" stopColor={crystal.color2} />
        </radialGradient>
        <radialGradient id="pivotGradient" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#f0d080" />
          <stop offset="100%" stopColor="#d4af6f" />
        </radialGradient>
        <radialGradient id="bgGradient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(45,10,62,0.4)" />
          <stop offset="100%" stopColor="rgba(7,4,13,0)" />
        </radialGradient>
        <filter id="gemGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="gemGlowBright" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ambient background glow */}
      <ellipse cx="150" cy="160" rx="120" ry="100" fill="url(#bgGradient)" />

      {/* Graduated circles */}
      {[100, 85, 70].map((r, i) => (
        <circle key={r} cx="150" cy="160" r={r}
          fill="none"
          stroke={`rgba(212,175,111,${0.08 - i * 0.02})`}
          strokeWidth="1"
        />
      ))}

      {/* Tick marks around circle */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
        const isMain = i % 6 === 0;
        const r1 = isMain ? 88 : 93;
        const r2 = 100;
        return (
          <line key={i}
            x1={150 + r1 * Math.cos(angle)} y1={160 + r1 * Math.sin(angle)}
            x2={150 + r2 * Math.cos(angle)} y2={160 + r2 * Math.sin(angle)}
            stroke={`rgba(212,175,111,${isMain ? 0.3 : 0.1})`}
            strokeWidth={isMain ? 1.5 : 0.8}
          />
        );
      })}

      {/* Axis lines */}
      <line x1="150" y1="55" x2="150" y2="265" stroke="rgba(212,175,111,0.15)" strokeWidth="1" strokeDasharray="5 5" />
      <line x1="45" y1="160" x2="255" y2="160" stroke="rgba(212,175,111,0.15)" strokeWidth="1" strokeDasharray="5 5" />
      <line x1="79" y1="89" x2="221" y2="231" stroke="rgba(212,175,111,0.07)" strokeWidth="1" strokeDasharray="4 6" />
      <line x1="221" y1="89" x2="79" y2="231" stroke="rgba(212,175,111,0.07)" strokeWidth="1" strokeDasharray="4 6" />

      {/* Axis labels */}
      <text x="150" y="46" textAnchor="middle" fill="rgba(212,175,111,0.5)" fontSize="10" fontFamily="serif" letterSpacing="3">OUI</text>
      <text x="265" y="164" textAnchor="start" fill="rgba(212,175,111,0.5)" fontSize="10" fontFamily="serif" letterSpacing="3">NON</text>
      <text x="150" y="285" textAnchor="middle" fill="rgba(212,175,111,0.3)" fontSize="9" fontFamily="serif" letterSpacing="2">?</text>
      <text x="35" y="164" textAnchor="end" fill="rgba(212,175,111,0.5)" fontSize="10" fontFamily="serif" letterSpacing="3">NON</text>

      {/* Chain attachment bar */}
      <rect x="136" y="8" width="28" height="6" rx="3" fill="url(#pivotGradient)" filter="url(#softGlow)" />

      {/* The pendulum group (animated) */}
      <g className={animClass || (isSwinging ? "" : "")}>
        {/* Chain / fil with segments for realism */}
        {Array.from({ length: 8 }, (_, i) => {
          const y1 = 14 + i * 24;
          const y2 = y1 + 20;
          return (
            <line key={i} x1="150" y1={y1} x2="150" y2={y2}
              stroke={i % 2 === 0 ? "#d4af6f" : "#c9a84c"}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}
        {/* Chain links */}
        {Array.from({ length: 7 }, (_, i) => (
          <ellipse key={i} cx="150" cy={34 + i * 24} rx="3" ry="2"
            fill="none" stroke="#d4af6f" strokeWidth="1" opacity="0.6"
          />
        ))}

        {/* Crystal gem */}
        <g className={isSwinging ? "gem-pulse" : ""}>
          {/* Outer glow ring */}
          <circle cx="150" cy="275" r="28" fill={crystal.glowColor} opacity="0.25" />
          {/* Main gem body */}
          <polygon
            points="150,248 174,268 165,295 135,295 126,268"
            fill="url(#gemGradient)"
            filter="url(#gemGlow)"
          />
          {/* Gem facets */}
          <polygon points="150,248 174,268 150,268" fill={crystal.color1} opacity="0.3" />
          <polygon points="150,248 126,268 150,268" fill={crystal.color2} opacity="0.2" />
          <line x1="150" y1="248" x2="150" y2="295" stroke={crystal.highlight} strokeWidth="0.8" opacity="0.5" />
          <line x1="126" y1="268" x2="174" y2="268" stroke={crystal.highlight} strokeWidth="0.8" opacity="0.4" />
          {/* Highlight sparkle */}
          <circle cx="141" cy="257" r="4" fill={crystal.highlight} opacity="0.7" />
          <circle cx="138" cy="254" r="1.5" fill="rgba(255,255,255,0.9)" />
        </g>
      </g>
    </svg>
  );
}

export default function PendulePage() {
  const { profile, addReading } = useUserProfile();
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<"form" | "focusing" | "swinging" | "done">("form");
  const [result, setResult] = useState<ResultConfig | null>(null);
  const [animClass, setAnimClass] = useState("");
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal>(CRYSTALS[0]);
  const [focusIndex, setFocusIndex] = useState(0);
  const [resultMessage, setResultMessage] = useState("");
  const [saved, setSaved] = useState(false);

  type ResultConfig = {
    label: PenduleResult;
    color: string;
    glow: string;
    message: string;
    ritual: string;
  };

  // Rotate focus messages during focusing phase
  useEffect(() => {
    if (phase !== "focusing") return;
    const interval = setInterval(() => {
      setFocusIndex(i => (i + 1) % FOCUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleFocus = useCallback(() => {
    if (!question.trim()) return;
    setPhase("focusing");
    // After focus period, start swing
    setTimeout(() => {
      const picked = (["OUI", "NON", "PEUT-ÊTRE"] as PenduleResult[])[Math.floor(Math.random() * 3)];
      const msgs = MESSAGES[picked];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];

      const colorMap: Record<PenduleResult, string> = {
        "OUI": "#c9b028",
        "NON": "#9b1c1c",
        "PEUT-ÊTRE": "#7c3aed",
      };
      const glowMap: Record<PenduleResult, string> = {
        "OUI": "0 0 60px rgba(201,176,40,0.5)",
        "NON": "0 0 60px rgba(155,28,28,0.5)",
        "PEUT-ÊTRE": "0 0 60px rgba(124,58,237,0.5)",
      };
      const classMap: Record<PenduleResult, string> = {
        "OUI": "pendule-anim-oui",
        "NON": "pendule-anim-non",
        "PEUT-ÊTRE": "pendule-anim-peut-etre",
      };

      setResult({ label: picked, color: colorMap[picked], glow: glowMap[picked], message: msg, ritual: RITUALS[picked] });
      setResultMessage(msg);
      setAnimClass(classMap[picked]);
      setPhase("swinging");

      setTimeout(() => setPhase("done"), 4500);
    }, 4000);
  }, [question]);

  const handleSave = () => {
    if (!result || !addReading) return;
    addReading({
      type: "pendule",
      title: `Pendule — "${question.slice(0, 50)}${question.length > 50 ? "…" : ""}"`,
      content: `Question : ${question}\n\nCristal utilisé : ${selectedCrystal.name}\n\nRéponse : ${result.label}\n\n${result.message}\n\nRituel conseillé : ${result.ritual}`,
      meta: { question, crystal: selectedCrystal.name, result: result.label },
    });
    setSaved(true);
  };

  const handleReset = () => {
    setPhase("form");
    setResult(null);
    setAnimClass("");
    setQuestion("");
    setFocusIndex(0);
    setSaved(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PENDULE_STYLES }} />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="fade-in-up">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="badge-gold mb-5">
              <Sparkles size={11} className="inline mr-2" />
              Divination par le pendule
            </div>
            <h1 className="font-serif-display text-5xl text-gradient-cream mb-4">
              Pendule Virtuel
            </h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-md mx-auto">
              &ldquo;Le pendule amplifie les vibrations subtiles de votre intention.&rdquo;
            </p>
          </div>

          {/* FORM */}
          {phase === "form" && (
            <div className="flex flex-col items-center gap-8">

              {/* Crystal selector */}
              <div className="w-full">
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-4 text-center">
                  Choisissez votre cristal
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {CRYSTALS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCrystal(c)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all duration-200"
                      style={{
                        borderColor: selectedCrystal.id === c.id ? c.color1 : "rgba(212,175,111,0.15)",
                        background: selectedCrystal.id === c.id ? `${c.glowColor}` : "rgba(212,175,111,0.03)",
                        boxShadow: selectedCrystal.id === c.id ? `0 0 20px ${c.glowColor}` : "none",
                      }}
                    >
                      <span className="text-2xl">{c.emoji}</span>
                      <span className="text-[9px] tracking-wider text-[#c9b88a] text-center leading-tight">{c.name}</span>
                    </button>
                  ))}
                </div>
                {selectedCrystal && (
                  <p className="text-center text-[11px] text-[#8a6f3a] mt-3 italic">
                    {selectedCrystal.name} — {selectedCrystal.power}
                  </p>
                )}
              </div>

              {/* Question input */}
              <div className="w-full max-w-md">
                <label className="luxe-label">Votre question (Oui / Non)</label>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && question.trim() && handleFocus()}
                  placeholder="Ex : Dois-je accepter cette proposition ?"
                  className="luxe-input"
                  maxLength={200}
                />
                <p className="text-[10px] text-[#5a4e35] mt-2">
                  Formulez une question claire à laquelle on peut répondre par Oui ou Non.
                </p>
              </div>

              <button
                onClick={handleFocus}
                disabled={!question.trim()}
                className="btn-gold"
              >
                <Sparkles size={14} />
                <span>Activer le pendule</span>
              </button>

              <p className="text-[11px] tracking-widest uppercase text-[#8a6f3a]">
                Tirage gratuit · Sans inscription
              </p>
            </div>
          )}

          {/* FOCUSING */}
          {phase === "focusing" && (
            <div className="flex flex-col items-center gap-8">
              <div className="luxe-card rounded-sm p-5 w-full max-w-md text-center">
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-2">Votre question</div>
                <p className="font-serif-text italic text-[#e8dcc0] text-lg">&ldquo;{question}&rdquo;</p>
              </div>

              {/* Static pendulum during focus */}
              <div style={{
                background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(45,10,62,0.7) 0%, rgba(7,4,13,0.9) 100%)",
                border: "1px solid rgba(212,175,111,0.2)",
                borderRadius: 16,
                padding: "32px 48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <PenduleSVG animClass="" crystal={selectedCrystal} isSwinging={false} />
              </div>

              <div className="text-center min-h-[48px]">
                <p key={focusIndex} className="focus-msg font-serif-text italic text-[#d4af6f] text-base">
                  {FOCUS_MESSAGES[focusIndex]}
                </p>
              </div>

              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#d4af6f] animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* SWINGING + DONE */}
          {(phase === "swinging" || phase === "done") && (
            <div className="flex flex-col items-center gap-8">
              <div className="luxe-card rounded-sm p-5 w-full max-w-md text-center">
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-2">Votre question</div>
                <p className="font-serif-text italic text-[#e8dcc0] text-lg">&ldquo;{question}&rdquo;</p>
              </div>

              <div style={{
                background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(45,10,62,0.7) 0%, rgba(7,4,13,0.9) 100%)",
                border: `1px solid ${phase === "done" && result ? result.color + "40" : "rgba(212,175,111,0.2)"}`,
                borderRadius: 16,
                padding: "32px 48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: phase === "done" && result ? `0 0 40px ${result.color}20` : "none",
                transition: "all 0.5s ease",
              }}>
                <PenduleSVG animClass={animClass} crystal={selectedCrystal} isSwinging={phase === "swinging"} />
              </div>

              {phase === "swinging" && (
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] animate-pulse">
                  Le pendule consulte les énergies...
                </p>
              )}

              {phase === "done" && result && (
                <div className="fade-in flex flex-col items-center gap-6 w-full max-w-md">
                  <div className="gold-line w-full" />

                  {/* Result */}
                  <div className="text-center">
                    <div className="font-serif-display" style={{
                      fontSize: "5rem",
                      fontWeight: 700,
                      color: result.color,
                      textShadow: result.glow,
                      letterSpacing: "0.05em",
                      lineHeight: 1,
                    }}>
                      {result.label}
                    </div>
                    <p className="text-[10px] tracking-[0.2em] uppercase mt-2" style={{ color: result.color, opacity: 0.7 }}>
                      {selectedCrystal.name} · {selectedCrystal.power}
                    </p>
                  </div>

                  {/* Message */}
                  <div className="luxe-card-premium rounded-sm p-7 w-full">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">Message du pendule</div>
                    <p className="font-serif-text text-[#e8dcc0] text-base leading-relaxed italic">{result.message}</p>
                  </div>

                  {/* Ritual */}
                  <div className="luxe-card rounded-sm p-5 w-full">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">Rituel conseillé</div>
                    <p className="font-serif-text text-[#c9b88a] text-sm leading-relaxed">{result.ritual}</p>
                  </div>

                  <div className="gold-line w-full" />

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={handleReset} className="btn-outline-gold gap-2">
                      <RotateCcw size={13} />
                      Nouvelle question
                    </button>
                    {profile && !saved && (
                      <button onClick={handleSave} className="btn-outline-gold gap-2">
                        <BookOpen size={13} />
                        Sauvegarder
                      </button>
                    )}
                    {saved && (
                      <span className="text-[11px] text-[#d4af6f] italic self-center">✓ Sauvegardé dans votre journal</span>
                    )}
                  </div>

                  {profile && (
                    <Link href="/journal" className="text-[11px] text-[#5a4e35] hover:text-[#d4af6f] transition-colors">
                      Voir mon journal →
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
