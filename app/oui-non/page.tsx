"use client";
import { useState, useCallback } from "react";
import { Sparkles, RotateCcw } from "lucide-react";

// ── Card pools ──────────────────────────────────────────────────────────────

const POSITIVE_CARDS = [
  "Le Soleil",
  "L'Étoile",
  "Le Monde",
  "La Roue de la Fortune",
  "Le Bateleur",
  "Les Amoureux",
  "La Justice",
  "Le Jugement",
  "L'Impératrice",
  "La Force",
  "La Tempérance",
  "L'Empereur",
];

const NEGATIVE_CARDS = [
  "La Tour",
  "Le Diable",
  "La Lune",
  "La Mort",
  "Le Pendu",
  "L'Ermite",
  "Le Chariot",
  "La Maison-Dieu",
];

const NEUTRAL_CARDS = [
  "Le Fou",
  "Le Magicien",
  "La Papesse",
  "Le Pape",
  "Le Chariot (endroit)",
  "La Roue de Fortune (inversée)",
  "La Mort (endroit)",
  "L'As de Bâtons",
  "Le 2 de Coupes",
  "Le 3 de Pentacles",
  "Le 7 d'Épées",
  "Le Valet de Bâtons",
  "Le Cavalier de Coupes",
  "La Reine d'Épées",
  "Le Roi de Pentacles",
];

const ALL_CARDS = [...POSITIVE_CARDS, ...NEGATIVE_CARDS, ...NEUTRAL_CARDS];

type CardResult = "OUI" | "NON" | "PEUT-ÊTRE";

interface DrawnCard {
  name: string;
  flipped: boolean;
}

interface Reading {
  result: CardResult;
  interpretation: string;
}

function pickCards(): string[] {
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function resultColor(result: CardResult): string {
  if (result === "OUI") return "#b5a34a"; // vert doré
  if (result === "NON") return "#8b1a1a"; // rouge sombre
  return "#7c3aed"; // violet
}

function resultGlow(result: CardResult): string {
  if (result === "OUI") return "0 0 60px rgba(181,163,74,0.4), 0 0 120px rgba(181,163,74,0.15)";
  if (result === "NON") return "0 0 60px rgba(139,26,26,0.4), 0 0 120px rgba(139,26,26,0.15)";
  return "0 0 60px rgba(124,58,237,0.4), 0 0 120px rgba(124,58,237,0.15)";
}

function CardBack() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "radial-gradient(ellipse at center, rgba(212,175,111,0.15) 0%, transparent 70%), linear-gradient(160deg, #1a1234 0%, #2d0a3e 40%, #0d0820 70%, #07040d 100%)",
        border: "1px solid rgba(212,175,111,0.4)",
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ color: "#d4af6f", fontSize: 28 }}>✦</div>
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        border: "2px solid rgba(212,175,111,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#d4af6f", fontSize: 22 }}>☽</span>
      </div>
      <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#d4af6f" }}>
        Carte
      </div>
      <div style={{ color: "#d4af6f", fontSize: 28 }}>✦</div>
      {/* diagonal pattern overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.12,
        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212,175,111,0.25) 10px, rgba(212,175,111,0.25) 11px)",
      }} />
    </div>
  );
}

function CardFront({ name }: { name: string }) {
  // Pick a simple symbol per card type
  const symbol =
    name.includes("Soleil") ? "☀️" :
    name.includes("Étoile") ? "⭐" :
    name.includes("Monde") ? "🌍" :
    name.includes("Roue") ? "🎡" :
    name.includes("Bateleur") || name.includes("Magicien") ? "🎩" :
    name.includes("Amoureux") ? "💕" :
    name.includes("Justice") ? "⚖️" :
    name.includes("Jugement") ? "📯" :
    name.includes("Impératrice") ? "👑" :
    name.includes("Force") ? "🦁" :
    name.includes("Tempérance") ? "🌈" :
    name.includes("Empereur") ? "⚔️" :
    name.includes("Tour") ? "⚡" :
    name.includes("Diable") ? "🔗" :
    name.includes("Lune") ? "🌕" :
    name.includes("Mort") ? "🦋" :
    name.includes("Pendu") ? "🌀" :
    name.includes("Ermite") ? "🕯️" :
    name.includes("Chariot") ? "🏆" :
    name.includes("Maison") ? "⚡" :
    "🃏";

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(160deg, #15102b 0%, #1a1234 50%, #0d0820 100%)",
      border: "1px solid rgba(212,175,111,0.5)",
      borderRadius: 6,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 12, textAlign: "center", gap: 8,
    }}>
      <div style={{ fontSize: 38 }}>{symbol}</div>
      <div style={{
        fontFamily: "var(--font-playfair, serif)",
        color: "#f5ecd9",
        fontSize: "0.82rem",
        lineHeight: 1.3,
        textShadow: "0 0 20px rgba(212,175,111,0.4)",
      }}>
        {name}
      </div>
    </div>
  );
}

interface FlipCardProps {
  card: DrawnCard;
  index: number;
}

function FlipCard({ card, index }: FlipCardProps) {
  return (
    <div
      className="card-scene"
      style={{ width: 130, height: 210, flexShrink: 0 }}
      aria-label={card.flipped ? card.name : "Carte face cachée"}
    >
      <div
        className={`card-3d${card.flipped ? " flipped" : ""}`}
        style={{
          transitionDelay: card.flipped ? `${index * 0.5}s` : "0s",
        }}
      >
        <div className="card-face card-back-face">
          <CardBack />
        </div>
        <div className="card-face card-front-face">
          <CardFront name={card.name} />
        </div>
      </div>
    </div>
  );
}

export default function OuiNonPage() {
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"form" | "revealing" | "done">("form");

  const handleConsult = useCallback(async () => {
    if (!question.trim()) return;
    setError("");
    setLoading(true);
    setPhase("revealing");

    const picked = pickCards();
    // Start with all cards face down
    setCards(picked.map((name) => ({ name, flipped: false })));

    // Flip cards one by one with 0.5s delay between each
    setTimeout(() => setCards((prev) => prev.map((c, i) => i === 0 ? { ...c, flipped: true } : c)), 500);
    setTimeout(() => setCards((prev) => prev.map((c, i) => i === 1 ? { ...c, flipped: true } : c)), 1000);
    setTimeout(() => setCards((prev) => prev.map((c, i) => i === 2 ? { ...c, flipped: true } : c)), 1500);

    try {
      const res = await fetch("/api/oui-non", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), cards: picked }),
      });
      const data = await res.json() as Reading;
      // Show result after all cards flipped (1.5s flip + 0.8s transition = ~2.5s)
      setTimeout(() => {
        setReading(data);
        setPhase("done");
        setLoading(false);
      }, 2600);
    } catch {
      setTimeout(() => {
        setError("Les cartes gardent leur silence... Réessayez dans quelques instants.");
        setPhase("form");
        setLoading(false);
      }, 2600);
    }
  }, [question]);

  const handleReset = () => {
    setPhase("form");
    setCards([]);
    setReading(null);
    setError("");
    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="fade-in-up">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-gold mb-5">
            <Sparkles size={11} className="inline mr-2" />
            Divination instantanée
          </div>
          <h1 className="font-serif-display text-5xl text-gradient-cream mb-4">
            Tirage Oui ou Non
          </h1>
          <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-md mx-auto">
            &ldquo;Posez votre question, laissez les cartes vous répondre.&rdquo;
          </p>
        </div>

        {/* Form phase */}
        {phase === "form" && (
          <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-xl">
              <label className="luxe-label">Votre question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex : Est-ce le bon moment pour changer de travail ?"
                className="luxe-input resize-none"
                rows={3}
                maxLength={300}
              />
              <div className="text-right mt-1" style={{ fontSize: "0.7rem", color: "#8a6f3a", letterSpacing: "0.05em" }}>
                {question.length}/300
              </div>
            </div>

            {error && (
              <p className="font-serif-text text-sm italic" style={{ color: "#8b1a1a" }}>{error}</p>
            )}

            <button
              onClick={handleConsult}
              disabled={!question.trim() || loading}
              className="btn-gold"
            >
              <Sparkles size={14} />
              <span>Consulter les cartes</span>
            </button>

            <p className="text-[11px] tracking-widest uppercase text-[#8a6f3a]">
              Tirage gratuit · Sans inscription
            </p>
          </div>
        )}

        {/* Cards display (revealing + done phases) */}
        {(phase === "revealing" || phase === "done") && (
          <div className="flex flex-col items-center gap-10">

            {/* Question display */}
            <div className="luxe-card rounded-sm p-5 w-full max-w-xl text-center">
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-2">Votre question</div>
              <p className="font-serif-text italic text-[#e8dcc0] text-lg">&ldquo;{question}&rdquo;</p>
            </div>

            {/* 3 cards */}
            <div
              style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}
              role="list"
              aria-label="Les trois cartes tirées"
            >
              {cards.map((card, i) => (
                <div key={i} role="listitem">
                  <FlipCard card={card} index={i} />
                </div>
              ))}
            </div>

            {/* Loading indicator */}
            {phase === "revealing" && (
              <div className="text-center">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] animate-pulse">
                  Les cartes se révèlent...
                </div>
              </div>
            )}

            {/* Result */}
            {phase === "done" && reading && (
              <div className="fade-in flex flex-col items-center gap-6 w-full max-w-xl">
                <div className="gold-line w-full" />

                {/* Big result */}
                <div className="text-center">
                  <div
                    className="font-serif-display"
                    style={{
                      fontSize: "5rem",
                      fontWeight: 700,
                      color: resultColor(reading.result),
                      textShadow: resultGlow(reading.result),
                      letterSpacing: "0.05em",
                      lineHeight: 1,
                    }}
                  >
                    {reading.result}
                  </div>
                  <div className="text-[10px] tracking-[0.3em] uppercase mt-3" style={{ color: resultColor(reading.result), opacity: 0.7 }}>
                    {reading.result === "OUI" ? "Réponse favorable" : reading.result === "NON" ? "Réponse défavorable" : "Incertitude — réfléchissez"}
                  </div>
                </div>

                {/* Cards names */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  {cards.map((c) => (
                    <span key={c.name} className="badge-soft">{c.name}</span>
                  ))}
                </div>

                {/* Interpretation */}
                <div className="luxe-card-premium rounded-sm p-7 w-full text-center">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">
                    Message de Madame Céleste
                  </div>
                  <p className="font-serif-text text-[#e8dcc0] text-lg leading-relaxed italic">
                    {reading.interpretation}
                  </p>
                </div>

                <div className="gold-line w-full" />

                {/* Reset button */}
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
  );
}
