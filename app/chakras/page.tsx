"use client";
import { useState } from "react";
import { CHAKRAS } from "@/lib/chakras";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Sparkles, Gem, Sun, Heart, MessageSquare, Eye, Crown, Anchor, Sparkle } from "lucide-react";

// Chakra-specific lucide icons (premium)
const CHAKRA_ICONS: Record<string, typeof Sparkles> = {
  racine: Anchor,
  sacre: Sparkles,
  plexus: Sun,
  coeur: Heart,
  gorge: MessageSquare,
  "troisieme-oeil": Eye,
  couronne: Crown,
};

type Step = "intro" | "quiz" | "results";

export default function ChakrasPage() {
  const { profile, addReading } = useUserProfile();
  const [step, setStep] = useState<Step>("intro");
  const [currentChakra, setCurrentChakra] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const chakra = CHAKRAS[currentChakra];
  const totalAnswers = Object.values(answers).reduce((acc, a) => acc + a.length, 0);
  const totalQuestions = CHAKRAS.length * 5;
  const progress = Math.round((totalAnswers / totalQuestions) * 100);

  const handleAnswer = (value: number) => {
    const chakraId = chakra.id;
    const currentAnswers = answers[chakraId] || [];
    const newAnswers = { ...answers, [chakraId]: [...currentAnswers, value] };
    setAnswers(newAnswers);

    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentChakra < CHAKRAS.length - 1) {
      setCurrentChakra(currentChakra + 1);
      setCurrentQuestion(0);
    } else {
      // Compute scores based on 0-100 inputs (lower answer = more blocked)
      // Average the 5 answers per chakra
      const finalScores: Record<string, number> = {};
      CHAKRAS.forEach((c) => {
        const arr = newAnswers[c.id] || [];
        const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        finalScores[c.id] = Math.round(avg);
      });
      setScores(finalScores);
      setStep("results");
    }
  };

  const getInterpretation = async () => {
    setIsStreaming(true);
    setReading("");
    try {
      const res = await fetch("/api/chakras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores, profile }),
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
      addReading({ type: "chakras", title: "Bilan énergétique complet", content: full, meta: { scores } });
    } catch {
      setReading("Les énergies sont perturbées... Réessayez dans quelques instants.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStep("intro");
    setCurrentChakra(0);
    setCurrentQuestion(0);
    setAnswers({});
    setScores({});
    setReading("");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {step === "intro" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Sparkles size={11} className="inline mr-2" />
              Bilan énergétique
            </div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">Les 7 Chakras</h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              Évaluez l&apos;équilibre de vos 7 centres d&apos;énergie. Répondez sincèrement pour obtenir un bilan personnalisé.
            </p>
          </div>

          <div className="luxe-card rounded-sm p-8 mb-10">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-6">Le système énergétique</div>
            <div className="grid grid-cols-7 gap-3 max-w-3xl mx-auto">
              {CHAKRAS.map((c) => {
                const Icon = CHAKRA_ICONS[c.id] || Sparkle;
                return (
                  <div key={c.id} className="flex flex-col items-center gap-2 group">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-110"
                      style={{ borderColor: c.color, background: `${c.color}15` }}
                    >
                      <Icon size={18} style={{ color: c.color }} />
                    </div>
                    <div className="text-[9px] tracking-wider text-[#c9b88a] text-center leading-tight">{c.name.replace("Chakra ", "")}</div>
                    <div className="text-[8px] tracking-widest italic text-[#8a6f3a]">{c.mantra}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="luxe-card-premium rounded-sm p-8 max-w-xl mx-auto mb-10 text-center">
            <h3 className="font-serif-display text-2xl text-gradient-cream mb-5">Ce que vous découvrirez</h3>
            <ul className="space-y-3 text-left mb-6">
              {[
                "L'état d'équilibre de chacun de vos 7 chakras",
                "Vos centres d'énergie les plus actifs et les plus bloqués",
                "Des cristaux et huiles essentielles adaptés à votre profil",
                "Une interprétation IA personnalisée avec conseils pratiques",
              ].map((it) => (
                <li key={it} className="flex items-start gap-3 text-[14px] text-[#c9b88a]">
                  <Sparkle size={14} className="text-[#d4af6f] flex-shrink-0 mt-1" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a]">35 questions · 5 minutes</div>
          </div>

          <div className="text-center">
            <button onClick={() => setStep("quiz")} className="btn-gold">
              <Sparkles size={14} />
              <span>Commencer le bilan</span>
            </button>
          </div>
        </div>
      )}

      {step === "quiz" && (
        <div className="fade-in-up max-w-xl mx-auto">
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f]">
                {chakra.name} · {currentChakra + 1}/{CHAKRAS.length}
              </span>
              <span className="text-[10px] tracking-widest text-[#8a6f3a]">{progress}%</span>
            </div>
            <div className="h-px bg-[rgba(212,175,111,0.15)] overflow-hidden">
              <div className="h-full transition-all duration-700" style={{ width: `${progress}%`, background: chakra.color }} />
            </div>
          </div>

          <div className="text-center mb-10">
            {(() => {
              const Icon = CHAKRA_ICONS[chakra.id] || Sparkle;
              return (
                <div
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center border-2 mb-5"
                  style={{ borderColor: chakra.color, background: `${chakra.color}15`, boxShadow: `0 0 40px ${chakra.color}30` }}
                >
                  <Icon size={28} style={{ color: chakra.color }} />
                </div>
              );
            })()}
            <h2 className="font-serif-display text-2xl mb-1" style={{ color: chakra.color }}>{chakra.name}</h2>
            <p className="text-[11px] tracking-wider text-[#c9b88a] italic">{chakra.nameSanskrit} · {chakra.element} · {chakra.mantra}</p>
            <p className="text-[10px] text-[#8a6f3a] mt-1">{chakra.location}</p>
          </div>

          <div className="luxe-card rounded-sm p-7 mb-6">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Question {currentQuestion + 1}/5</div>
            <p className="font-serif-text text-[#e8dcc0] text-lg leading-relaxed mb-7 italic">
              {chakra.questions[currentQuestion]}
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Jamais", value: 100 },
                { label: "Rarement", value: 75 },
                { label: "Parfois", value: 50 },
                { label: "Souvent", value: 25 },
                { label: "Toujours", value: 0 },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className="w-full text-left px-5 py-3.5 transition-all border border-[rgba(212,175,111,0.18)] text-[#c9b88a] hover:border-[#d4af6f] hover:bg-[rgba(212,175,111,0.06)] hover:text-[#f5ecd9] text-[14px] tracking-wide"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={reset} className="w-full text-center text-[10px] tracking-widest uppercase text-[#8a6f3a] hover:text-[#d4af6f] transition-colors py-3">
            Recommencer
          </button>
        </div>
      )}

      {step === "results" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Sparkles size={11} className="inline mr-2" />
              Votre bilan
            </div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-4">Profil Énergétique</h2>
            <p className="font-serif-text italic text-[#c9b88a]">L&apos;état actuel de vos 7 centres d&apos;énergie</p>
          </div>

          <div className="luxe-card rounded-sm p-8 mb-8 space-y-5">
            {CHAKRAS.map((c) => {
              const Icon = CHAKRA_ICONS[c.id] || Sparkle;
              const score = scores[c.id] ?? 0;
              const status = score >= 75 ? "Équilibré" : score >= 50 ? "En éveil" : score >= 25 ? "Affaibli" : "Bloqué";
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon size={16} style={{ color: c.color }} />
                      <span className="font-serif-display text-cream">{c.name}</span>
                      <span className="text-[10px] tracking-widest italic text-[#8a6f3a]">{c.mantra}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] tracking-widest uppercase text-[#c9b88a]">{status}</span>
                      <span className="font-serif-display text-lg" style={{ color: c.color }}>{score}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[rgba(13,8,32,0.6)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: c.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {CHAKRAS.filter(c => (scores[c.id] ?? 0) < 50).map((c) => {
              const Icon = CHAKRA_ICONS[c.id] || Sparkle;
              return (
                <div key={c.id} className="luxe-card rounded-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: c.color, background: `${c.color}15` }}>
                      <Icon size={16} style={{ color: c.color }} />
                    </div>
                    <div>
                      <div className="font-serif-display text-lg" style={{ color: c.color }}>{c.name}</div>
                      <div className="text-[10px] tracking-wider italic text-[#8a6f3a]">{c.nameSanskrit}</div>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#c9b88a] mb-4 leading-relaxed">{c.imbalanced}</p>
                  <div className="mb-3">
                    <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] mb-1.5 flex items-center gap-1.5">
                      <Gem size={10} /> Cristaux recommandés
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {c.crystals.slice(0, 3).map(k => <span key={k} className="badge-soft !text-[9px]">{k}</span>)}
                    </div>
                  </div>
                  <p className="font-serif-text italic text-[12px] text-[#c9b88a] border-l-2 border-[rgba(212,175,111,0.3)] pl-3">
                    &ldquo;{c.affirmation}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-8">
            {!reading && !isStreaming && (
              <button onClick={getInterpretation} className="btn-gold">
                <Sparkles size={14} />
                <span>Interprétation IA complète</span>
              </button>
            )}
            <button onClick={reset} className="btn-ghost">
              <span>Refaire le bilan</span>
            </button>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}
    </div>
  );
}
