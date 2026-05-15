"use client";
import { useState } from "react";
import Link from "next/link";
import { HEXAGRAMS, consultIChing, type Hexagram } from "@/lib/iching";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Coins, BookOpen, Sparkles, ArrowLeft, Compass, Crown } from "lucide-react";

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

type Step = "intro" | "question" | "toss" | "result";

export default function IChingPage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [step, setStep] = useState<Step>("intro");
  const [question, setQuestion] = useState("");
  const [hexagram, setHexagram] = useState<Hexagram | null>(null);
  const [tossResults, setTossResults] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const tossCoin = async () => {
    if (tossResults.length >= 6 || isAnimating) return;
    setIsAnimating(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = consultIChing();
    const newResults = [...tossResults, result.lines[tossResults.length] ?? 1];
    setTossResults(newResults);
    setIsAnimating(false);
    if (newResults.length === 6) {
      setTimeout(() => {
        setHexagram(result);
        setStep("result");
      }, 700);
    }
  };

  const tossAll = () => {
    const result = consultIChing();
    setTossResults(result.lines);
    setHexagram(result);
    setTimeout(() => setStep("result"), 400);
  };

  const getInterpretation = async () => {
    if (!hexagram) return;
    setIsStreaming(true);
    setReading("");
    try {
      const res = await fetch("/api/iching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hexagram, question, profile }),
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
      addReading({ type: "iching", title: `${hexagram.number}. ${hexagram.name}`, content: full });
    } catch {
      setReading("Le Yi-King garde le silence... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => { setStep("intro"); setQuestion(""); setHexagram(null); setTossResults([]); setReading(""); };

  if (!isHydrated) return null;

  if (!profile) {
    return <PremiumWall title="I-Ching" message="Le Livre des Mutations et son interprétation IA sont réservés aux membres Mystique." />;
  }

  if (!canAccessFeature(profile.subscription, "premium")) {
    return <PremiumWall title="I-Ching" message="Le Livre des Mutations et son interprétation IA sont réservés aux membres Mystique." />;
  }

  const renderLine = (isYang: boolean, index: number) => (
    <div key={index} className="flex items-center justify-center gap-2 h-4">
      {isYang ? (
        <div className="h-1.5 w-24 bg-[#d4af6f] rounded-full" />
      ) : (
        <>
          <div className="h-1.5 w-10 bg-[#d4af6f]/70 rounded-full" />
          <div className="w-2" />
          <div className="h-1.5 w-10 bg-[#d4af6f]/70 rounded-full" />
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {step === "intro" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Compass size={11} className="inline mr-2" />
              Sagesse Orientale
            </div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">Yi-King</h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              Le Livre des Transformations — oracle ancestral chinois. 64 hexagrammes révèlent la sagesse du Tao.
            </p>
          </div>

          <div className="luxe-card rounded-sm p-7 mb-10">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-5">Les 64 hexagrammes</div>
            <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-2 max-w-3xl mx-auto">
              {HEXAGRAMS.slice(0, 32).map((h) => (
                <div key={h.number} title={`${h.number}. ${h.name}`}
                  className="aspect-square rounded-sm border border-[rgba(212,175,111,0.2)] bg-[rgba(13,8,32,0.6)] flex items-center justify-center text-xs text-[#d4af6f] hover:text-[#e8c875] hover:border-[#d4af6f] hover:bg-[rgba(212,175,111,0.06)] transition-all cursor-help">
                  {h.symbol}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-[#8a6f3a] text-center mt-3 tracking-wider">+ 32 autres</div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { Icon: Coins, title: "Tirage par pièces", desc: "Lancez 3 pièces virtuelles 6 fois pour construire votre hexagramme" },
              { Icon: BookOpen, title: "64 hexagrammes", desc: "La totalité des situations et transformations possibles selon le Tao" },
              { Icon: Sparkles, title: "Interprétation IA", desc: "La sagesse ancienne éclairée par l'intelligence artificielle" },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="luxe-card rounded-sm p-6 text-center">
                <Icon size={22} className="text-[#d4af6f] mx-auto mb-3" />
                <div className="font-serif-display text-cream mb-2">{title}</div>
                <p className="text-[12px] text-[#c9b88a] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button onClick={() => setStep("question")} className="btn-gold">
              <Sparkles size={14} />
              <span>Consulter le Yi-King</span>
            </button>
          </div>
        </div>
      )}

      {step === "question" && (
        <div className="max-w-xl mx-auto fade-in-up">
          <div className="text-center mb-10">
            <Coins size={28} className="text-[#d4af6f] mx-auto mb-4" />
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-3">Votre Question</h2>
            <p className="font-serif-text italic text-[#c9b88a] text-lg">
              Concentrez-vous. Le Yi-King répond aux situations, pas aux prédictions directes.
            </p>
          </div>

          <div className="mb-8">
            <label className="luxe-label">Votre situation (optionnel)</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Décrivez votre situation ou question..."
              rows={4}
              className="luxe-input resize-none"
            />
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => setStep("intro")} className="btn-ghost">
              <ArrowLeft size={13} className="inline mr-2" />
              <span>Retour</span>
            </button>
            <button onClick={() => setStep("toss")} className="btn-gold">
              <Coins size={14} />
              <span>Lancer les pièces</span>
            </button>
          </div>
        </div>
      )}

      {step === "toss" && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <h2 className="font-serif-display text-3xl text-gradient-cream mb-2">Construction de l&apos;Hexagramme</h2>
            {question && <p className="font-serif-text italic text-[#c9b88a] mt-2">&ldquo;{question}&rdquo;</p>}
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">
              Ligne {tossResults.length + 1}/6 — de bas en haut
            </p>
          </div>

          <div className="luxe-card-premium rounded-sm p-10 mb-10 max-w-md mx-auto">
            <div className="space-y-3 mb-5">
              {Array.from({ length: 6 }).map((_, i) => {
                const lineIndex = 5 - i;
                const filled = lineIndex < tossResults.length;
                const isYang = filled ? tossResults[lineIndex] === 1 : null;
                return (
                  <div key={i} className={`flex items-center justify-center gap-2 h-4 transition-all ${filled ? "opacity-100" : "opacity-15"}`}>
                    {filled && isYang !== null ? (
                      isYang ? (
                        <div className="h-1.5 w-24 bg-[#d4af6f] rounded-full" />
                      ) : (
                        <>
                          <div className="h-1.5 w-10 bg-[#d4af6f]/70 rounded-full" />
                          <div className="w-2" />
                          <div className="h-1.5 w-10 bg-[#d4af6f]/70 rounded-full" />
                        </>
                      )
                    ) : (
                      <div className="h-1.5 w-24 bg-[rgba(212,175,111,0.2)] rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-center text-[10px] tracking-widest uppercase text-[#8a6f3a]">
              {tossResults.length === 0 ? "Commencez à lancer" : `${tossResults.length}/6 lignes tracées`}
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            {tossResults.length < 6 && (
              <>
                <button
                  onClick={tossCoin}
                  disabled={isAnimating}
                  className={`btn-gold ${isAnimating ? "opacity-70 scale-95" : ""}`}
                >
                  <Coins size={14} />
                  <span>{isAnimating ? "Lancement..." : "Lancer les pièces"}</span>
                </button>
                <button onClick={tossAll} className="btn-outline-gold">
                  <span>Tirage automatique</span>
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-10 mt-8 text-[10px] tracking-widest text-[#c9b88a]">
            <div className="flex items-center gap-2">
              <div className="h-1 w-10 bg-[#d4af6f] rounded" />
              <span>YANG (—)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-4 bg-[#d4af6f]/70 rounded" />
              <div className="w-1" />
              <div className="h-1 w-4 bg-[#d4af6f]/70 rounded" />
              <span>YIN (- -)</span>
            </div>
          </div>
        </div>
      )}

      {step === "result" && hexagram && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <div className="font-serif-display text-5xl text-[#d4af6f] mb-3">{hexagram.symbol}</div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] mb-4">Hexagramme {hexagram.number}/64</div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-1">{hexagram.name}</h2>
            <p className="text-[#c9b88a] font-serif-text italic text-lg">{hexagram.nameZh}</p>
            {question && <p className="font-serif-text italic text-[#c9b88a] mt-3 text-[14px]">&ldquo;{question}&rdquo;</p>}
          </div>

          <div className="luxe-card-premium rounded-sm p-8 mb-8">
            <div className="grid md:grid-cols-[140px_1fr] gap-8 items-start">
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => {
                  const lineIndex = 5 - i;
                  return renderLine(hexagram.lines[lineIndex] === 1, i);
                })}
              </div>
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {hexagram.keywords.map(k => (
                    <span key={k} className="badge-soft">{k}</span>
                  ))}
                </div>
                <p className="font-serif-text text-[#e8dcc0] text-[15px] leading-relaxed italic mb-5">
                  {hexagram.meaning}
                </p>
                <div className="space-y-3 text-[13px] border-l-2 border-[rgba(212,175,111,0.3)] pl-4">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] block mb-1">Oracle</span>
                    <span className="text-[#c9b88a]">{hexagram.judgment}</span>
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] block mb-1">Conseil</span>
                    <span className="text-[#c9b88a]">{hexagram.advice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] block mb-1">Élément</span>
                    <span className="text-[#c9b88a]">{hexagram.element}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-8">
            {!reading && !isStreaming && (
              <button onClick={getInterpretation} className="btn-gold">
                <Sparkles size={14} />
                <span>Interprétation approfondie IA</span>
              </button>
            )}
            <button onClick={reset} className="btn-ghost">
              <span>Nouvelle consultation</span>
            </button>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}
    </div>
  );
}
