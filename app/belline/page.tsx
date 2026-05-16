"use client";
import { authFetch } from "@/lib/api-client";
import { useState } from "react";
import Link from "next/link";
import { BELLINE_DECK, drawBelline, type BellineCard } from "@/lib/belline";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Sparkles, ArrowLeft, RotateCcw, Crown, Star } from "lucide-react";

type BellineSpread = {
  id: string;
  name: string;
  count: number;
  positions: string[];
  description: string;
};

const BELLINE_SPREADS: BellineSpread[] = [
  {
    id: "reponse",
    name: "La Réponse",
    count: 1,
    positions: ["La réponse de l'Oracle"],
    description: "Une carte pour une réponse directe et précise de l'Oracle.",
  },
  {
    id: "trilogie",
    name: "La Trilogie Planétaire",
    count: 3,
    positions: ["Passé", "Présent", "Futur"],
    description: "Trois cartes pour une vision temporelle sous l'influence des astres.",
  },
  {
    id: "quintessence",
    name: "La Quintessence",
    count: 5,
    positions: [
      "Votre énergie",
      "L'environnement",
      "Ce qui vient",
      "L'obstacle",
      "La résolution",
    ],
    description: "Cinq cartes pour une lecture approfondie de votre situation.",
  },
  {
    id: "grand-oracle",
    name: "Le Grand Oracle",
    count: 7,
    positions: [
      "Situation actuelle",
      "Influences passées",
      "Influences futures",
      "Vos atouts",
      "Vos obstacles",
      "Le conseil planétaire",
      "Le dénouement",
    ],
    description: "Sept cartes pour une révélation complète des forces en jeu.",
  },
];

const PLANET_SYMBOLS: Record<string, string> = {
  Soleil: "☉",
  Lune: "☽",
  Mercure: "☿",
  Vénus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturne: "♄",
  Uranus: "⛢",
  Neptune: "♆",
};

const PLANET_COLORS: Record<string, string> = {
  Soleil: "#f5a623",
  Lune: "#c9d6e8",
  Mercure: "#9b9b9b",
  Vénus: "#e8a0b0",
  Mars: "#e85535",
  Jupiter: "#7ab8f5",
  Saturne: "#b8a060",
  Uranus: "#7ae8e8",
  Neptune: "#6070e8",
};

type DrawnCard = BellineCard & { position: string };

function BellineCardDisplay({
  card,
  revealed,
  size = "lg",
}: {
  card: BellineCard;
  revealed: boolean;
  size?: "lg" | "sm";
}) {
  const w = size === "lg" ? "w-[90px]" : "w-[64px]";
  const h = size === "lg" ? "h-[130px]" : "h-[96px]";
  const planetColor = PLANET_COLORS[card.planet] ?? "#d4af6f";
  const planetSymbol = PLANET_SYMBOLS[card.planet] ?? "✦";

  if (!revealed) {
    return (
      <div
        className={`${w} ${h} rounded-sm border border-[rgba(212,175,111,0.3)] bg-[#0e0c0a] flex items-center justify-center`}
      >
        <span className="text-[#d4af6f] text-xl">✦</span>
      </div>
    );
  }

  return (
    <div
      className={`${w} ${h} rounded-sm bg-[#0e0c0a] border-2 flex flex-col items-center justify-between relative overflow-hidden`}
      style={{ borderColor: planetColor }}
    >
      {/* Top row: number + planet symbol */}
      <div className="w-full flex items-center justify-between px-1.5 pt-1">
        <span
          className="text-[9px] font-mono leading-none"
          style={{ color: planetColor }}
        >
          {card.id}
        </span>
        <span className="text-[10px] leading-none" style={{ color: planetColor }}>
          {planetSymbol}
        </span>
      </div>

      {/* Center: large planet symbol */}
      <div
        className={`${size === "lg" ? "text-4xl" : "text-2xl"} leading-none`}
        style={{ color: planetColor }}
      >
        {planetSymbol}
      </div>

      {/* Bottom: card name */}
      <div className="w-full px-1 pb-1 text-center">
        <span
          className={`${size === "lg" ? "text-[8px]" : "text-[7px]"} text-[#e8dcc8] leading-tight block tracking-wide`}
        >
          {card.name}
        </span>
      </div>
    </div>
  );
}

function PremiumWall({ title, message }: { title: string; message: string }) {
  return (
    <div className="max-w-lg mx-auto text-center px-6 py-20">
      <Crown size={40} className="text-[#d4af6f] mx-auto mb-6" />
      <div className="badge-gold mb-5">Premium</div>
      <h2 className="font-serif-display text-3xl text-gradient-cream mb-4">{title}</h2>
      <p className="font-serif-text italic text-[#c9b88a] mb-8">{message}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/tarifs" className="btn-gold">
          <Crown size={14} />
          <span>Voir les offres</span>
        </Link>
        <Link href="/mon-profil" className="btn-outline-gold">
          <span>Mon profil</span>
        </Link>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 rounded-full border-2 border-[rgba(212,175,111,0.2)] border-t-[#d4af6f] animate-spin" />
    </div>
  );
}

export default function BellinePage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [step, setStep] = useState<"choose" | "question" | "draw" | "reading">("choose");
  const [selectedSpread, setSelectedSpread] = useState<BellineSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSpreadSelect = (spread: BellineSpread) => {
    setSelectedSpread(spread);
    setStep("question");
  };

  const handleDraw = () => {
    if (!selectedSpread) return;
    const drawn = drawBelline(selectedSpread.count);
    const withPositions: DrawnCard[] = drawn.map((card, i) => ({
      ...card,
      position: selectedSpread.positions[i],
    }));
    setCards(withPositions);
    setRevealedCards(new Set());
    setReading("");
    setStep("draw");
  };

  const revealCard = (i: number) => setRevealedCards((p) => new Set([...p, i]));
  const revealAll = () => setRevealedCards(new Set(cards.map((_, i) => i)));
  const allRevealed = revealedCards.size === cards.length && cards.length > 0;

  const getLecture = async () => {
    if (!selectedSpread) return;
    setIsStreaming(true);
    setReading("");
    setStep("reading");
    const cardData = cards.map((c, i) => ({
      id: c.id,
      name: c.name,
      planet: c.planet,
      keywords: c.keywords,
      position: selectedSpread.positions[i],
    }));
    try {
      const res = await authFetch("/api/belline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards: cardData,
          question,
          spreadName: selectedSpread.name,
          profile: { prenom: profile?.prenom, dateNaissance: profile?.dateNaissance },
        }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setReading((p) => p + chunk);
      }
      addReading({
        type: "belline",
        title: selectedSpread.name,
        content: full,
        meta: { question },
      });
    } catch {
      setReading("Les astres gardent leur secret... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStep("choose");
    setCards([]);
    setRevealedCards(new Set());
    setReading("");
    setQuestion("");
    setSelectedSpread(null);
  };

  if (!isHydrated) return <Spinner />;

  if (!profile) {
    return (
      <PremiumWall
        title="Oracle de Belline"
        message="Inscrivez-vous gratuitement pour des tirages Belline personnalisés."
      />
    );
  }

  if (!canAccessFeature(profile.subscription, "premium")) {
    return (
      <PremiumWall
        title="Oracle de Belline — Abonnement requis"
        message="Les tirages Oracle de Belline avec interprétation IA sont réservés aux membres Mystique."
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {step === "choose" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Star size={11} className="inline mr-2" />
              Oracle de Belline
            </div>
            <div className="font-serif-display text-7xl text-[#d4af6f] mb-5 float-slow">☉</div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
              Oracle de Belline
            </h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              53 cartes · L&apos;Oracle des Planètes et des Destins
            </p>
          </div>

          <div className="luxe-card rounded-sm p-7 mb-12">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-5">
              Oracle de Belline · Les 53 cartes
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {BELLINE_DECK.map((card) => (
                <div
                  key={card.id}
                  className="group cursor-help hover:-translate-y-0.5 transition-transform"
                >
                  <BellineCardDisplay card={card} revealed size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {BELLINE_SPREADS.map((spread) => (
              <button
                key={spread.id}
                onClick={() => handleSpreadSelect(spread)}
                className="luxe-card rounded-sm p-6 text-left group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.12)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center group-hover:border-[#d4af6f] transition-colors">
                    <Sparkles size={18} className="text-[#d4af6f]" />
                  </div>
                  <span className="badge-soft !text-[9px]">
                    {spread.count} {spread.count === 1 ? "carte" : "cartes"}
                  </span>
                </div>
                <h3 className="font-serif-display text-lg text-cream group-hover:text-[#e8c875] transition-colors mb-2">
                  {spread.name}
                </h3>
                <p className="text-[13px] text-[#c9b88a] leading-relaxed">{spread.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "question" && selectedSpread && (
        <div className="max-w-2xl mx-auto fade-in-up">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-sm mx-auto mb-5 border border-[#d4af6f] flex items-center justify-center bg-[rgba(212,175,111,0.08)]">
              <Sparkles size={24} className="text-[#d4af6f]" />
            </div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-3">
              {selectedSpread.name}
            </h2>
            <p className="font-serif-text italic text-[#c9b88a] text-lg">
              {selectedSpread.description}
            </p>
          </div>

          <div className="luxe-card rounded-sm p-6 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Positions</div>
            <div className="flex flex-wrap gap-2">
              {selectedSpread.positions.map((pos, i) => (
                <span key={i} className="badge-soft">
                  <span className="text-[#d4af6f] mr-1.5">{i + 1}.</span>
                  {pos}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="luxe-label">Votre question (optionnel)</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Concentrez-vous sur l'Oracle avant de tirer vos cartes..."
              rows={3}
              className="luxe-input resize-none"
            />
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => setStep("choose")} className="btn-ghost">
              <ArrowLeft size={13} className="inline mr-2" />
              <span>Retour</span>
            </button>
            <button onClick={handleDraw} className="btn-gold">
              <Sparkles size={14} />
              <span>Tirer les cartes</span>
            </button>
          </div>
        </div>
      )}

      {(step === "draw" || step === "reading") && selectedSpread && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <h2 className="font-serif-display text-3xl text-gradient-cream mb-2">
              {selectedSpread.name}
            </h2>
            {question && (
              <p className="font-serif-text italic text-[#c9b88a] mt-2">
                &ldquo;{question}&rdquo;
              </p>
            )}
            {step === "draw" && !allRevealed && (
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">
                Cliquez sur chaque carte pour la révéler
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-10 max-w-4xl mx-auto">
            {cards.map((card, i) => (
              <div key={card.id} className="flex flex-col items-center gap-3">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] text-center max-w-[110px] font-serif-display">
                  {selectedSpread.positions[i].split(" — ")[0]}
                </div>
                <div
                  onClick={() => !revealedCards.has(i) && revealCard(i)}
                  className={`cursor-pointer transition-all duration-500 ${
                    revealedCards.has(i)
                      ? "shadow-[0_0_30px_rgba(212,175,111,0.25)] -translate-y-1"
                      : "hover:-translate-y-0.5 opacity-80 hover:opacity-100"
                  }`}
                >
                  <BellineCardDisplay card={card} revealed={revealedCards.has(i)} size="lg" />
                </div>
                {revealedCards.has(i) && (
                  <div className="flex flex-wrap gap-1 max-w-[110px] justify-center">
                    {card.keywords.slice(0, 2).map((k) => (
                      <span key={k} className="text-[8px] tracking-wider text-[#c9b88a]">
                        · {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {step === "draw" && (
            <div className="flex gap-3 justify-center flex-wrap">
              {!allRevealed && (
                <button onClick={revealAll} className="btn-outline-gold">
                  <span>Révéler tout</span>
                </button>
              )}
              {allRevealed && (
                <button onClick={getLecture} className="btn-gold">
                  <Sparkles size={14} />
                  <span>Obtenir la lecture</span>
                </button>
              )}
              <button onClick={reset} className="btn-ghost">
                <RotateCcw size={13} className="inline mr-2" />
                <span>Recommencer</span>
              </button>
            </div>
          )}

          <ReadingResult text={reading} isStreaming={isStreaming} />

          {step === "reading" && !isStreaming && reading && (
            <div className="text-center mt-8">
              <button onClick={reset} className="btn-outline-gold">
                <RotateCcw size={13} className="inline mr-2" />
                <span>Nouveau tirage</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
