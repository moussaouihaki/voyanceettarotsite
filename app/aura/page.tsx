"use client";
import { authFetch } from '@/lib/api-client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { AURA_COLORS, type AuraColor } from "@/lib/aura";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Sparkles, RotateCcw, Crown, ChevronRight } from "lucide-react";

// ── Aura layer definitions ────────────────────────────────────────────────────

interface AuraLayer {
  id: string;
  name: string;
  description: string;
  question: string;
  answers: { label: string; colorId: string }[];
}

const AURA_LAYERS: AuraLayer[] = [
  {
    id: "etheric",
    name: "Couche Éthérique",
    description: "Reflet direct du corps physique — vitalité, santé, énergie vitale",
    question: "Comment vous sentez-vous physiquement en ce moment ?",
    answers: [
      { label: "Plein(e) d'énergie et de vitalité", colorId: "rouge" },
      { label: "Léger(ère) et créatif(ve)", colorId: "orange" },
      { label: "Fatigué(e) mais mentalement actif(ve)", colorId: "jaune" },
      { label: "Calme et ancré(e)", colorId: "vert" },
    ],
  },
  {
    id: "emotional",
    name: "Couche Émotionnelle",
    description: "État émotionnel et affectif — ressentis, humeurs, équilibre intérieur",
    question: "Quelle émotion vous habite principalement ces derniers temps ?",
    answers: [
      { label: "Amour et connexion avec les autres", colorId: "rose" },
      { label: "Curiosité intellectuelle et clarté", colorId: "jaune" },
      { label: "Paix intérieure et harmonie", colorId: "vert" },
      { label: "Mélancolie ou profondeur intérieure", colorId: "indigo" },
    ],
  },
  {
    id: "mental",
    name: "Couche Mentale",
    description: "Pensées, croyances, logique — la structure de votre mental",
    question: "Comment fonctionne votre esprit en ce moment ?",
    answers: [
      { label: "Analytique et structuré(e)", colorId: "jaune" },
      { label: "Intuitif(ve) et visionnaire", colorId: "indigo" },
      { label: "Créatif(ve) et imaginatif(ve)", colorId: "orange" },
      { label: "Centré(e) sur l'essentiel", colorId: "blanc" },
    ],
  },
  {
    id: "astral",
    name: "Couche Astrale",
    description: "Pont entre le physique et le spirituel — relations, amour universel",
    question: "Comment vivez-vous vos relations avec les autres ?",
    answers: [
      { label: "Avec amour et générosité", colorId: "rose" },
      { label: "Avec communication et authenticité", colorId: "bleu-ciel" },
      { label: "Avec passion et intensité", colorId: "rouge" },
      { label: "Avec sagesse et discernement", colorId: "violet" },
    ],
  },
  {
    id: "etheric-template",
    name: "Couche Éthérique-Template",
    description: "Schéma divin du corps — sons, archétypes, modèles subtils",
    question: "Quel aspect de votre expression vous tient le plus à cœur ?",
    answers: [
      { label: "Ma voix et ma communication", colorId: "bleu-ciel" },
      { label: "Ma créativité artistique", colorId: "orange" },
      { label: "Ma guidance et mon leadership", colorId: "or" },
      { label: "Mon intégrité et mes valeurs", colorId: "blanc" },
    ],
  },
  {
    id: "celestial",
    name: "Couche Céleste",
    description: "Corps céleste — connexion à l'amour divin et à l'extase spirituelle",
    question: "Quel est votre rapport à la spiritualité et au divin ?",
    answers: [
      { label: "Profond et mystique, je vis ma foi", colorId: "violet" },
      { label: "Intuitif, je perçois au-delà du visible", colorId: "indigo" },
      { label: "Lumineux, je ressens la guidance divine", colorId: "blanc" },
      { label: "En exploration, je cherche ma voie", colorId: "argent" },
    ],
  },
  {
    id: "causal",
    name: "Couche Causale",
    description: "Corps causal — karma, mémoire de l'âme, plan de vie",
    question: "Comment percevez-vous votre mission de vie en ce moment ?",
    answers: [
      { label: "Je transforme et guide les autres", colorId: "or" },
      { label: "Je cherche à évoluer et à comprendre", colorId: "indigo" },
      { label: "Je guéris et apporte de l'amour", colorId: "vert" },
      { label: "Je traverse une transformation profonde", colorId: "noir" },
    ],
  },
];

// ── Helper: resolve AuraColor from id ────────────────────────────────────────

function getColorById(id: string): AuraColor {
  return AURA_COLORS.find((c) => c.id === id) ?? AURA_COLORS[0];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PremiumWall({ title, message }: { title: string; message: string }) {
  return (
    <div className="max-w-lg mx-auto text-center px-6 py-20">
      <Crown size={40} className="text-[#d4af6f] mx-auto mb-6" />
      <div className="badge-gold mb-5">Premium</div>
      <h2 className="font-serif-display text-3xl text-gradient-cream mb-4">{title}</h2>
      <p className="font-serif-text italic text-[#c9b88a] mb-8">{message}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/tarifs" className="btn-gold"><Crown size={14} /><span>Voir les offres</span></Link>
        <Link href="/mon-profil" className="btn-outline-gold"><span>Mon profil</span></Link>
      </div>
    </div>
  );
}

interface AuraLayerCardProps {
  layer: AuraLayer;
  color: AuraColor;
  index: number;
}

function AuraLayerCard({ layer, color, index }: AuraLayerCardProps) {
  return (
    <div className="luxe-card rounded-sm p-5 flex gap-4 items-start">
      {/* Color swatch */}
      <div
        className="w-14 h-14 rounded-full flex-shrink-0 mt-1"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${color.colorHex}, ${color.colorSecondary})`,
          boxShadow: `0 0 20px ${color.colorHex}44`,
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-0.5">
          Couche {index + 1} · {layer.name}
        </div>
        <div className="font-serif-display text-base text-cream mb-0.5">{color.name}</div>
        <div className="text-[11px] italic text-[#c9b88a] mb-2">{layer.description}</div>
        <div className="flex flex-wrap gap-1">
          {color.keywords.slice(0, 3).map((kw) => (
            <span key={kw} className="badge-soft !text-[9px]">{kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main page component ───────────────────────────────────────────────────────

type PageStep = "quiz" | "review" | "reading";

export default function AuraPage() {
  const { profile, addReading, isHydrated } = useUserProfile();

  // Quiz state
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  const [layerColors, setLayerColors] = useState<string[]>([]); // colorId per layer
  const [pageStep, setPageStep] = useState<PageStep>("quiz");

  // Reading state
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Reset everything
  const resetQuiz = () => {
    setCurrentLayerIndex(0);
    setLayerColors([]);
    setPageStep("quiz");
    setQuestion("");
    setReading("");
  };

  // Auto-reset on hydration
  useEffect(() => {
    if (!isHydrated) return;
    resetQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const handleAnswer = (colorId: string) => {
    const updated = [...layerColors, colorId];
    setLayerColors(updated);
    if (currentLayerIndex < AURA_LAYERS.length - 1) {
      setCurrentLayerIndex(currentLayerIndex + 1);
    } else {
      setPageStep("review");
    }
  };

  const getLecture = async () => {
    setIsStreaming(true);
    setReading("");
    setPageStep("reading");

    const layerData = AURA_LAYERS.map((layer, i) => {
      const color = getColorById(layerColors[i] ?? "vert");
      return {
        layer: layer.name,
        layerDescription: layer.description,
        colorName: color.name,
        colorHex: color.colorHex,
        chakra: color.chakra,
        archetype: color.archetype,
        keywords: color.keywords,
        message: color.message,
      };
    });

    try {
      const res = await authFetch("/api/aura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors: layerData, question, profile }),
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
        type: "aura",
        title: `Lecture d'Aura — 7 Couches`,
        content: full,
        meta: { question, layers: layerData.map((l) => `${l.layer}: ${l.colorName}`) },
      });
    } catch {
      setReading("L'aura garde ses secrets pour l'instant... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  if (!isHydrated) return null;

  if (!profile) {
    return (
      <PremiumWall
        title="Lecture d'Aura"
        message="Inscrivez-vous gratuitement pour une lecture d'aura personnalisée."
      />
    );
  }

  if (!canAccessFeature(profile.subscription, "premium")) {
    return (
      <PremiumWall
        title="Aura — Abonnement requis"
        message="Les lectures d'aura avec interprétation IA sont réservées aux membres Mystique."
      />
    );
  }

  const currentLayer = AURA_LAYERS[currentLayerIndex];
  const progress = Math.round((currentLayerIndex / AURA_LAYERS.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="fade-in-up">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-gold mb-5">
            <Sparkles size={11} className="inline mr-2" />
            Énergies Subtiles
          </div>
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 float-slow"
            style={{
              background: "radial-gradient(circle at 40% 40%, #d4af6f, #8E44AD)",
              boxShadow: "0 0 40px #d4af6f55, 0 0 80px #8E44AD33",
            }}
          />
          <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
            Lecture d&apos;Aura
          </h1>
          <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
            Les 7 couches de votre champ énergétique · Questionnaire intuitif
          </p>
        </div>

        {/* ── QUIZ STEP ── */}
        {pageStep === "quiz" && currentLayer && (
          <div className="max-w-xl mx-auto">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f]">
                  {currentLayer.name} · {currentLayerIndex + 1}/{AURA_LAYERS.length}
                </span>
                <span className="text-[10px] tracking-widest text-[#8a6f3a]">{progress}%</span>
              </div>
              <div className="h-px bg-[rgba(212,175,111,0.15)] overflow-hidden">
                <div
                  className="h-full transition-all duration-700 bg-[#d4af6f]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Layer info */}
            <div className="text-center mb-8">
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a6f3a] mb-2">
                {currentLayer.description}
              </div>
            </div>

            {/* Question card */}
            <div className="luxe-card rounded-sm p-7 mb-4">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">
                Couche {currentLayerIndex + 1} sur 7
              </div>
              <p className="font-serif-text text-[#e8dcc0] text-lg leading-relaxed mb-7 italic">
                {currentLayer.question}
              </p>
              <div className="space-y-2.5">
                {currentLayer.answers.map((answer) => (
                  <button
                    key={answer.colorId}
                    onClick={() => handleAnswer(answer.colorId)}
                    className="w-full text-left px-5 py-3.5 transition-all border border-[rgba(212,175,111,0.18)] text-[#c9b88a] hover:border-[#d4af6f] hover:bg-[rgba(212,175,111,0.06)] hover:text-[#f5ecd9] text-[14px] tracking-wide flex items-center justify-between group"
                  >
                    <span>{answer.label}</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4af6f]" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="w-full text-center text-[10px] tracking-widest uppercase text-[#8a6f3a] hover:text-[#d4af6f] transition-colors py-3"
            >
              Recommencer
            </button>
          </div>
        )}

        {/* ── REVIEW STEP ── */}
        {pageStep === "review" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">
                Vos 7 couches d&apos;aura révélées
              </div>
              <p className="font-serif-text italic text-[#c9b88a] text-sm">
                Chaque couche reflète une dimension différente de votre être
              </p>
            </div>

            {/* 7 layer cards */}
            <div className="space-y-3 mb-8">
              {AURA_LAYERS.map((layer, i) => (
                <AuraLayerCard
                  key={layer.id}
                  layer={layer}
                  color={getColorById(layerColors[i] ?? "vert")}
                  index={i}
                />
              ))}
            </div>

            {/* Optional question */}
            <div className="mb-8">
              <label className="luxe-label">Votre question (optionnel)</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Concentrez-vous sur votre aura avant de poser votre question..."
                rows={3}
                className="luxe-input resize-none"
              />
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={resetQuiz} className="btn-ghost">
                <RotateCcw size={13} className="inline mr-2" />
                <span>Recommencer</span>
              </button>
              <button onClick={getLecture} className="btn-gold">
                <Sparkles size={14} />
                <span>Révéler ma lecture d&apos;aura</span>
              </button>
            </div>
          </div>
        )}

        {/* ── READING STEP ── */}
        {pageStep === "reading" && (
          <div>
            {/* Summary of 7 layers */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {AURA_LAYERS.map((layer, i) => {
                const color = getColorById(layerColors[i] ?? "vert");
                return (
                  <div
                    key={layer.id}
                    className="luxe-card rounded-sm p-4 flex items-center gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${color.colorHex}, ${color.colorSecondary})`,
                        boxShadow: `0 0 12px ${color.colorHex}44`,
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-[9px] tracking-[0.2em] uppercase text-[#8a6f3a] truncate">
                        {layer.name}
                      </div>
                      <div className="text-[12px] text-cream font-serif-display truncate">
                        {color.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <ReadingResult text={reading} isStreaming={isStreaming} />

            {!isStreaming && reading && (
              <div className="text-center mt-8">
                <button onClick={resetQuiz} className="btn-outline-gold">
                  <RotateCcw size={13} className="inline mr-2" />
                  <span>Nouvelle lecture</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
