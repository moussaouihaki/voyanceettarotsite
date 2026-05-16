"use client";
import { authFetch } from '@/lib/api-client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { AURA_COLORS, drawAuraColors, getAuraByBirthdate, type AuraColor } from "@/lib/aura";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Sparkles, RotateCcw, Crown } from "lucide-react";

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

interface AuraCardProps {
  color: AuraColor;
  index: number;
  isNatal?: boolean;
}

function AuraCard({ color, index, isNatal }: AuraCardProps) {
  const labels = ["Couleur Dominante", "Couleur Secondaire", "Couleur d'Influence"];
  return (
    <div className="luxe-card rounded-sm p-6 flex flex-col items-center text-center gap-4">
      <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] font-serif-display">
        {isNatal && index === 0 ? "Aura Natale" : labels[index] ?? `Couleur ${index + 1}`}
      </div>

      {/* Gradient circle swatch */}
      <div
        className="w-32 h-32 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)] flex-shrink-0"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${color.colorHex}, ${color.colorSecondary})`,
          boxShadow: `0 0 30px ${color.colorHex}55, 0 0 60px ${color.colorHex}22`,
        }}
      />

      <div>
        <h3 className="font-serif-display text-lg text-cream mb-1">{color.name}</h3>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mb-1">{color.archetype}</p>
        <p className="text-[11px] text-[#8a6f3a]">{color.chakra} · {color.element}</p>
      </div>

      {/* Keyword chips */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {color.keywords.slice(0, 4).map((kw) => (
          <span
            key={kw}
            className="badge-soft !text-[10px]"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AuraPage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [step, setStep] = useState<"draw" | "reading">("draw");
  const [colors, setColors] = useState<AuraColor[]>([]);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [usedBirthdate, setUsedBirthdate] = useState(false);

  // Auto-draw on load / when profile is hydrated
  useEffect(() => {
    if (!isHydrated) return;
    initDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const initDraw = () => {
    if (profile?.dateNaissance) {
      const natal = getAuraByBirthdate(profile.dateNaissance);
      const rest = drawAuraColors(3).filter((c) => c.id !== natal.id).slice(0, 2);
      setColors([natal, ...rest]);
      setUsedBirthdate(true);
    } else {
      setColors(drawAuraColors(3));
      setUsedBirthdate(false);
    }
    setReading("");
    setStep("draw");
    setQuestion("");
  };

  const getLecture = async () => {
    setIsStreaming(true);
    setReading("");
    setStep("reading");

    const colorData = colors.map((c) => ({
      name: c.name,
      colorHex: c.colorHex,
      chakra: c.chakra,
      archetype: c.archetype,
      keywords: c.keywords,
      strengths: c.strengths,
      challenges: c.challenges,
      message: c.message,
    }));

    try {
      const res = await authFetch("/api/aura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors: colorData, question, profile }),
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
        title: `Lecture d'Aura — ${colors.map((c) => c.name).join(", ")}`,
        content: full,
        meta: { question },
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="fade-in-up">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-gold mb-5">
            <Sparkles size={11} className="inline mr-2" />
            Énergies Subtiles
          </div>
          {/* Decorative aura glow symbol */}
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
            Couleurs vibratoires · Énergie subtile
          </p>
          {usedBirthdate && profile?.dateNaissance && (
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">
              Votre aura natale révélée · {new Date(profile.dateNaissance).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>

        {/* Color cards */}
        {colors.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {colors.map((color, i) => (
              <AuraCard
                key={color.id + i}
                color={color}
                index={i}
                isNatal={usedBirthdate}
              />
            ))}
          </div>
        )}

        {/* Question input — only shown in draw step */}
        {step === "draw" && (
          <div className="max-w-2xl mx-auto mb-8">
            <label className="luxe-label">Votre question (optionnel)</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Concentrez-vous sur vos couleurs d'aura avant de demander..."
              rows={3}
              className="luxe-input resize-none"
            />
          </div>
        )}

        {/* Actions */}
        {step === "draw" && (
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={initDraw} className="btn-ghost">
              <RotateCcw size={13} className="inline mr-2" />
              <span>Nouveau tirage</span>
            </button>
            <button onClick={getLecture} className="btn-gold" disabled={colors.length === 0}>
              <Sparkles size={14} />
              <span>Révéler ma lecture d&apos;aura</span>
            </button>
          </div>
        )}

        {/* Streaming result */}
        <ReadingResult text={reading} isStreaming={isStreaming} />

        {step === "reading" && !isStreaming && reading && (
          <div className="text-center mt-8">
            <button onClick={initDraw} className="btn-outline-gold">
              <RotateCcw size={13} className="inline mr-2" />
              <span>Nouveau tirage</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
