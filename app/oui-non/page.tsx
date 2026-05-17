"use client";
import { useState, useCallback } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { ALL_CARDS as TAROT_DECK, type TarotCard } from "@/lib/tarot-cards";
import { getCardImage, type DeckType } from "@/lib/deck-images";
import { authFetch } from "@/lib/api-client";

// ── Card classification by ID ─────────────────────────────────────────────────

const POSITIVE_IDS = new Set([
  "major-19", // Soleil
  "major-17", // Étoile
  "major-21", // Monde
  "major-10", // Roue de la Fortune
  "major-6",  // Amoureux
  "major-11", // Justice
  "major-20", // Jugement
  "major-3",  // Impératrice
  "major-8",  // Force
  "major-14", // Tempérance
  "major-4",  // Empereur
  "major-1",  // Magicien
]);

const NEGATIVE_IDS = new Set([
  "major-16", // Tour
  "major-15", // Diable
  "major-18", // Lune
  "major-13", // Mort
  "major-12", // Pendu
]);

const POOL_IDS = new Set([
  ...POSITIVE_IDS,
  ...NEGATIVE_IDS,
  "major-0",  // Fou
  "major-2",  // Papesse
  "major-5",  // Pape
  "major-7",  // Chariot
  "major-9",  // Ermite
  "minor-bâtons-1",
  "minor-coupes-2",
  "minor-pentacles-3",
  "minor-épées-7",
  "minor-bâtons-11",
  "minor-coupes-12",
  "minor-épées-13",
  "minor-pentacles-14",
]);

const CARD_POOL: TarotCard[] = TAROT_DECK.filter(c => POOL_IDS.has(c.id));

type CardResult = "OUI" | "NON" | "PEUT-ÊTRE";

interface DrawnCard {
  card: TarotCard;
  flipped: boolean;
}

interface Reading {
  result: CardResult;
  interpretation: string;
}

function classifyCard(id: string): "positive" | "negative" | "neutral" {
  if (POSITIVE_IDS.has(id)) return "positive";
  if (NEGATIVE_IDS.has(id)) return "negative";
  return "neutral";
}

function computeLocalResult(cards: TarotCard[]): CardResult {
  let pos = 0, neg = 0, neu = 0;
  for (const c of cards) {
    const cls = classifyCard(c.id);
    if (cls === "positive") pos++;
    else if (cls === "negative") neg++;
    else neu++;
  }
  if (pos > neg && pos > neu) return "OUI";
  if (neg > pos && neg > neu) return "NON";
  return "PEUT-ÊTRE";
}

function pickCards(): TarotCard[] {
  const arr = [...CARD_POOL];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}

function resultColor(result: CardResult): string {
  if (result === "OUI") return "#b5a34a";
  if (result === "NON") return "#8b1a1a";
  return "#7c3aed";
}

function resultGlow(result: CardResult): string {
  if (result === "OUI") return "0 0 60px rgba(181,163,74,0.4), 0 0 120px rgba(181,163,74,0.15)";
  if (result === "NON") return "0 0 60px rgba(139,26,26,0.4), 0 0 120px rgba(139,26,26,0.15)";
  return "0 0 60px rgba(124,58,237,0.4), 0 0 120px rgba(124,58,237,0.15)";
}

// ── Card face components ──────────────────────────────────────────────────────

function CardBack() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "radial-gradient(ellipse at center, rgba(212,175,111,0.18) 0%, transparent 70%), linear-gradient(160deg, #1a1234 0%, #2d0a3e 40%, #0d0820 70%, #07040d 100%)",
      border: "1px solid rgba(212,175,111,0.45)",
      borderRadius: 6,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 10, position: "relative", overflow: "hidden",
    }}>
      {/* Outer border inset */}
      <div style={{ position: "absolute", inset: 6, border: "1px solid rgba(212,175,111,0.2)", borderRadius: 3, pointerEvents: "none" }} />
      {/* Corner ornaments */}
      {[["top-2","left-2","border-t","border-l"],["top-2","right-2","border-t","border-r"],["bottom-2","left-2","border-b","border-l"],["bottom-2","right-2","border-b","border-r"]].map((cls, i) => (
        <div key={i} style={{ position: "absolute", top: cls[0].includes("top") ? 10 : "auto", bottom: cls[0].includes("bottom") ? 10 : "auto", left: cls[1].includes("left") ? 10 : "auto", right: cls[1].includes("right") ? 10 : "auto", width: 12, height: 12, borderTop: cls.includes("border-t") ? "1px solid rgba(212,175,111,0.5)" : "none", borderBottom: cls.includes("border-b") ? "1px solid rgba(212,175,111,0.5)" : "none", borderLeft: cls.includes("border-l") ? "1px solid rgba(212,175,111,0.5)" : "none", borderRight: cls.includes("border-r") ? "1px solid rgba(212,175,111,0.5)" : "none" }} />
      ))}
      <svg width="60" height="80" viewBox="0 0 60 80" fill="none" stroke="rgba(212,175,111,0.6)" strokeWidth="0.8">
        {/* Central star/compass rose */}
        <circle cx="30" cy="40" r="22" />
        <circle cx="30" cy="40" r="16" />
        <circle cx="30" cy="40" r="6" />
        <line x1="30" y1="18" x2="30" y2="62" />
        <line x1="8" y1="40" x2="52" y2="40" />
        <line x1="14" y1="24" x2="46" y2="56" />
        <line x1="46" y1="24" x2="14" y2="56" />
        <circle cx="30" cy="6" r="3" fill="rgba(212,175,111,0.4)" />
        <circle cx="30" cy="74" r="3" fill="rgba(212,175,111,0.4)" />
        <circle cx="6" cy="40" r="3" fill="rgba(212,175,111,0.4)" />
        <circle cx="54" cy="40" r="3" fill="rgba(212,175,111,0.4)" />
      </svg>
      <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(212,175,111,0.7)", fontFamily: "serif" }}>
        Madame Céleste
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(212,175,111,0.4) 8px, rgba(212,175,111,0.4) 9px)" }} />
    </div>
  );
}

function CardFront({ card, deck = "rws" }: { card: TarotCard; deck?: DeckType }) {
  const imageUrl = getCardImage(card.id, deck);

  if (imageUrl) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", borderRadius: 5 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={card.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="eager"
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(7,4,13,0.95) 0%, rgba(7,4,13,0.7) 55%, transparent 100%)",
          padding: "10px 5px 5px", textAlign: "center",
        }}>
          <div style={{ fontSize: 8, fontFamily: "serif", color: "#e8c875", letterSpacing: "0.12em" }}>
            {card.name}
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(212,175,111,0.45)", borderRadius: 5, pointerEvents: "none" }} />
      </div>
    );
  }

  // Fallback — no image available
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(160deg, #15102b 0%, #1a1234 50%, #0d0820 100%)",
      border: "1px solid rgba(212,175,111,0.5)",
      borderRadius: 6,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 12, textAlign: "center", gap: 10,
    }}>
      <div style={{ fontFamily: "serif", fontSize: "2.2rem", color: "#d4af6f", lineHeight: 1 }}>{card.number}</div>
      <div style={{ fontFamily: "serif", fontSize: "0.78rem", color: "#f5ecd9", lineHeight: 1.3 }}>{card.name}</div>
    </div>
  );
}

interface FlipCardProps {
  drawn: DrawnCard;
  index: number;
  deck?: DeckType;
}

function FlipCard({ drawn, index, deck = "rws" }: FlipCardProps) {
  return (
    <div
      className="card-scene"
      style={{ width: 130, height: 210, flexShrink: 0 }}
      aria-label={drawn.flipped ? drawn.card.name : "Carte face cachée"}
    >
      <div
        className={`card-3d${drawn.flipped ? " flipped" : ""}`}
        style={{ transitionDelay: drawn.flipped ? `${index * 0.5}s` : "0s" }}
      >
        <div className="card-face card-back-face">
          <CardBack />
        </div>
        <div className="card-face card-front-face !p-0 overflow-hidden">
          <CardFront card={drawn.card} deck={deck} />
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function OuiNonPage() {
  const [question, setQuestion] = useState("");
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"form" | "revealing" | "done">("form");
  const [deck, setDeck] = useState<DeckType>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("tarot-deck") as DeckType) || "rws";
    }
    return "rws";
  });

  const switchDeck = (d: DeckType) => {
    setDeck(d);
    localStorage.setItem("tarot-deck", d);
  };

  const handleConsult = useCallback(async () => {
    if (!question.trim()) return;
    setError("");
    setLoading(true);
    setPhase("revealing");

    const picked = pickCards();
    setDrawn(picked.map((card) => ({ card, flipped: false })));

    setTimeout(() => setDrawn((prev) => prev.map((d, i) => i === 0 ? { ...d, flipped: true } : d)), 500);
    setTimeout(() => setDrawn((prev) => prev.map((d, i) => i === 1 ? { ...d, flipped: true } : d)), 1000);
    setTimeout(() => setDrawn((prev) => prev.map((d, i) => i === 2 ? { ...d, flipped: true } : d)), 1500);

    try {
      const res = await authFetch("/api/oui-non", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), cards: picked.map(c => c.name) }),
      });

      let data: Reading;
      if (res.ok) {
        data = await res.json() as Reading;
      } else {
        data = {
          result: computeLocalResult(picked),
          interpretation: "Les cartes ont parlé. Faites confiance à leur réponse et à votre intuition pour avancer sur votre chemin.",
        };
      }

      setTimeout(() => {
        setReading(data);
        setPhase("done");
        setLoading(false);
      }, 2600);
    } catch {
      setTimeout(() => {
        setReading({
          result: computeLocalResult(picked),
          interpretation: "Les cartes ont parlé. Faites confiance à leur réponse et à votre intuition pour avancer sur votre chemin.",
        });
        setPhase("done");
        setLoading(false);
      }, 2600);
    }
  }, [question]);

  const handleReset = () => {
    setPhase("form");
    setDrawn([]);
    setReading(null);
    setError("");
    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="fade-in-up">

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

            {/* Deck selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8a6f3a]">Jeu</span>
              <div className="flex border border-[rgba(212,175,111,0.25)] rounded-sm overflow-hidden">
                {(["rws", "marseille"] as DeckType[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => switchDeck(d)}
                    className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all ${
                      deck === d
                        ? "bg-[rgba(212,175,111,0.15)] text-[#e8c875] border-r border-[rgba(212,175,111,0.25)] last:border-r-0"
                        : "text-[#8a6f3a] hover:text-[#c9b88a] border-r border-[rgba(212,175,111,0.15)] last:border-r-0"
                    }`}
                  >
                    {d === "rws" ? "Rider-Waite" : "Marseille"}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] tracking-widest uppercase text-[#8a6f3a]">
              Tirage gratuit · Sans inscription
            </p>
          </div>
        )}

        {(phase === "revealing" || phase === "done") && (
          <div className="flex flex-col items-center gap-10">

            <div className="luxe-card rounded-sm p-5 w-full max-w-xl text-center">
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-2">Votre question</div>
              <p className="font-serif-text italic text-[#e8dcc0] text-lg">&ldquo;{question}&rdquo;</p>
            </div>

            <div
              style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}
              role="list"
              aria-label="Les trois cartes tirées"
            >
              {drawn.map((d, i) => (
                <div key={d.card.id} role="listitem">
                  <FlipCard drawn={d} index={i} deck={deck} />
                </div>
              ))}
            </div>

            {phase === "revealing" && (
              <div className="text-center">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] animate-pulse">
                  Les cartes se révèlent...
                </div>
              </div>
            )}

            {phase === "done" && reading && (
              <div className="fade-in flex flex-col items-center gap-6 w-full max-w-xl">
                <div className="gold-line w-full" />

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

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  {drawn.map((d) => (
                    <span key={d.card.id} className="badge-soft">{d.card.name}</span>
                  ))}
                </div>

                <div className="luxe-card-premium rounded-sm p-7 w-full text-center">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">
                    Message de Madame Céleste
                  </div>
                  <p className="font-serif-text text-[#e8dcc0] text-lg leading-relaxed italic">
                    {reading.interpretation}
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
  );
}
