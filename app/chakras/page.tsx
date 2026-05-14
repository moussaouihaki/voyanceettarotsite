"use client";
import { useState } from "react";
import { CHAKRAS, evaluateChakras, type Chakra } from "@/lib/chakras";
import ReadingResult from "@/components/ReadingResult";

type Step = "intro" | "quiz" | "results";

export default function ChakrasPage() {
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
      const finalScores = evaluateChakras(newAnswers);
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
        body: JSON.stringify({ scores }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setReading((p) => p + decoder.decode(value, { stream: true }));
      }
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

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {step === "intro" && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4 float-anim">🌈</div>
            <h1 className="text-3xl font-bold text-purple-100 mb-2">Bilan des Chakras</h1>
            <p className="text-purple-400 text-sm max-w-md mx-auto">
              Évaluez l'équilibre de vos 7 centres d'énergie. Répondez sincèrement pour obtenir un bilan personnalisé.
            </p>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-8 max-w-2xl mx-auto">
            {CHAKRAS.map((c) => (
              <div key={c.id} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2"
                  style={{ borderColor: c.color, background: `${c.color}20` }}>
                  {c.emoji}
                </div>
                <div className="text-[9px] text-purple-500 text-center leading-tight">{c.name.replace("Chakra ", "")}</div>
                <div className="text-[9px] text-purple-600 italic">{c.mantra}</div>
              </div>
            ))}
          </div>

          <div className="mystical-card rounded-2xl p-6 max-w-lg mx-auto mb-8">
            <h3 className="font-cinzel text-purple-200 mb-4 text-center">Ce que vous découvrirez</h3>
            <ul className="space-y-2 text-sm text-purple-300/80">
              <li>✦ L'état d'équilibre de chacun de vos 7 chakras</li>
              <li>✦ Vos centres d'énergie les plus actifs et les plus bloqués</li>
              <li>✦ Des cristaux et huiles essentielles adaptés à votre profil</li>
              <li>✦ Une interprétation IA personnalisée avec des conseils pratiques</li>
            </ul>
            <div className="mt-4 text-xs text-purple-500 text-center">
              35 questions · Environ 5 minutes
            </div>
          </div>

          <div className="text-center">
            <button onClick={() => setStep("quiz")} className="gradient-btn glow-btn px-10 py-4 rounded-xl text-white font-semibold text-lg">
              Commencer le bilan 🌈
            </button>
          </div>
        </div>
      )}

      {step === "quiz" && (
        <div className="fade-in-up max-w-xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-purple-400 mb-2">
              <span>Chakra {currentChakra + 1}/{CHAKRAS.length} — {chakra.name}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-purple-900/40 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: chakra.color }} />
            </div>
          </div>

          {/* Chakra header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl border-2 mb-4"
              style={{ borderColor: chakra.color, background: `${chakra.color}20`, boxShadow: `0 0 30px ${chakra.color}30` }}>
              {chakra.emoji}
            </div>
            <h2 className="font-cinzel font-bold text-xl mb-1" style={{ color: chakra.color }}>{chakra.name}</h2>
            <p className="text-purple-400 text-xs">{chakra.nameSanskrit} · {chakra.element} · {chakra.mantra}</p>
            <p className="text-purple-500 text-xs mt-1">{chakra.location}</p>
          </div>

          {/* Question */}
          <div className="mystical-card rounded-2xl p-6 mb-6">
            <div className="text-xs text-purple-500 mb-3">Question {currentQuestion + 1}/5</div>
            <p className="text-purple-100 text-base leading-relaxed mb-6">
              {chakra.questions[currentQuestion]}
            </p>
            <div className="space-y-3">
              {[
                { label: "Jamais", value: 0 },
                { label: "Rarement", value: 25 },
                { label: "Parfois", value: 50 },
                { label: "Souvent", value: 75 },
                { label: "Toujours", value: 100 },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-purple-700/30 text-purple-300 hover:border-purple-500/60 hover:bg-purple-900/30 transition-all text-sm"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={reset} className="w-full text-center text-purple-600 text-xs hover:text-purple-400 transition-colors">
            Recommencer depuis le début
          </button>
        </div>
      )}

      {step === "results" && (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🌈</div>
            <h2 className="font-cinzel text-2xl text-yellow-300 mb-2">Votre Bilan Énergétique</h2>
            <p className="text-purple-400 text-sm">Voici l'état de vos 7 centres d'énergie</p>
          </div>

          {/* Chakra bars */}
          <div className="mystical-card rounded-2xl p-6 mb-6 space-y-4">
            {CHAKRAS.map((c) => {
              const score = scores[c.id] ?? 0;
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{c.emoji}</span>
                      <span className="text-sm text-purple-200 font-cinzel">{c.name}</span>
                      <span className="text-xs text-purple-500">{c.mantra}</span>
                    </div>
                    <span className={`text-sm font-bold font-cinzel ${getScoreColor(score)}`}>{score}%</span>
                  </div>
                  <div className="h-2.5 bg-purple-900/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${score}%`, background: c.color }} />
                  </div>
                  <div className="text-xs text-purple-500 mt-1">
                    {score >= 75 ? "Équilibré — " + c.balanced.substring(0, 60) + "..." : score >= 50 ? "Partiellement actif — continuez à travailler cet aspect." : "Attention requise — " + c.imbalanced.substring(0, 55) + "..."}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail cards for low chakras */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {CHAKRAS.filter(c => (scores[c.id] ?? 0) < 50).map((c) => (
              <div key={c.id} className="mystical-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{c.emoji}</span>
                  <div>
                    <div className="font-cinzel text-sm font-bold" style={{ color: c.color }}>{c.name}</div>
                    <div className="text-xs text-purple-500">{c.nameSanskrit}</div>
                  </div>
                </div>
                <p className="text-xs text-purple-300/80 mb-3">{c.imbalanced}</p>
                <div className="space-y-2">
                  <div>
                    <div className="text-[10px] text-purple-500 mb-1">Cristaux :</div>
                    <div className="flex flex-wrap gap-1">
                      {c.crystals.slice(0, 3).map(k => (
                        <span key={k} className="text-[10px] bg-purple-900/40 text-purple-400 px-1.5 py-0.5 rounded">{k}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-purple-400 italic">"{c.affirmation}"</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-6">
            {!reading && !isStreaming && (
              <button onClick={getInterpretation} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold">
                🔮 Interprétation IA complète
              </button>
            )}
            <button onClick={reset} className="px-6 py-3 rounded-xl border border-purple-700/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">
              Refaire le bilan
            </button>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}
    </div>
  );
}
