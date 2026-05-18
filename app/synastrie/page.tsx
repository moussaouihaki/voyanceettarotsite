"use client";
import { authFetch } from '@/lib/api-client';

import { useState } from "react";
import Link from "next/link";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import { getSunSign, ZODIAC_SIGNS } from "@/lib/astrology";
import ReadingResult from "@/components/ReadingResult";
import { Heart, User, Calendar, Crown, Lock, Sparkles } from "lucide-react";

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

export default function SynastriePage() {
  const { profile, addReading, isHydrated } = useUserProfile();

  const [person1Prenom, setPerson1Prenom] = useState(profile?.prenom || "");
  const [person1Date, setPerson1Date] = useState(profile?.dateNaissance || "");
  const [person2Prenom, setPerson2Prenom] = useState("");
  const [person2Date, setPerson2Date] = useState("");

  const [step, setStep] = useState<"form" | "result">("form");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sign1 = person1Date ? getSunSign(person1Date) : null;
  const sign2 = person2Date ? getSunSign(person2Date) : null;

  if (!isHydrated) return null;

  if (!profile) {
    return <PremiumWall title="Synastrie & Compatibilité" message="Comparez deux thèmes astraux avec une analyse IA approfondie. Réservé aux membres Mystique." />;
  }

  if (!canAccessFeature(profile.subscription, "premium")) {
    return <PremiumWall title="Synastrie & Compatibilité" message="Comparez deux thèmes astraux avec une analyse IA approfondie. Réservé aux membres Mystique." />;
  }

  const handleAnalyze = async () => {
    if (!sign1 || !sign2) return;
    setIsStreaming(true);
    setReading("");
    setStep("result");

    try {
      const res = await authFetch("/api/synastrie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person1: { prenom: person1Prenom, signe: sign1.name, dateNaissance: person1Date },
          person2: { prenom: person2Prenom, signe: sign2.name, dateNaissance: person2Date },
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
        type: "synastrie",
        title: `${person1Prenom} (${sign1.name}) × ${person2Prenom} (${sign2.name})`,
        content: full,
      });
    } catch {
      setReading("Les étoiles refusent de parler... Réessayez dans quelques instants.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStep("form");
    setReading("");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {step === "form" ? (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-6">
              <Crown size={11} className="inline mr-2" />
              Synastrie Premium
            </div>
            <h1 className="font-serif-display text-5xl text-gradient-cream mb-4">Compatibilité Astrale</h1>
            <p className="font-serif-text italic text-xl text-[#c9b88a]">
              Compatibilité amoureuse · Aspects planétaires · Liens karmiques
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Person 1 */}
            <div className="luxe-card rounded-sm p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full border border-[rgba(212,175,111,0.4)] flex items-center justify-center bg-[rgba(212,175,111,0.08)]">
                  <User size={16} className="text-[#d4af6f]" />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f]">Première âme</div>
                  <div className="font-serif-display text-cream">{profile?.prenom ? "Vous" : "Personne 1"}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="luxe-label">Prénom</label>
                  <input
                    type="text"
                    value={person1Prenom}
                    onChange={(e) => setPerson1Prenom(e.target.value)}
                    placeholder="Prénom"
                    className="luxe-input"
                  />
                </div>
                <div>
                  <label className="luxe-label flex items-center gap-2"><Calendar size={11} /> Date de naissance</label>
                  <input
                    type="date"
                    value={person1Date}
                    onChange={(e) => setPerson1Date(e.target.value)}
                    className="luxe-input"
                  />
                </div>

                {sign1 && (
                  <div className="text-center pt-3 border-t border-[rgba(212,175,111,0.15)]">
                    <div className="font-serif-display text-3xl text-gradient-gold">{sign1.symbol}</div>
                    <div className="text-cream">{sign1.name}</div>
                    <div className="text-[10px] text-[#8a6f3a] tracking-wider">{sign1.element} · {sign1.modality}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Person 2 */}
            <div className="luxe-card rounded-sm p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full border border-[rgba(212,175,111,0.4)] flex items-center justify-center bg-[rgba(212,175,111,0.08)]">
                  <Heart size={16} className="text-[#d4af6f]" />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f]">Deuxième âme</div>
                  <div className="font-serif-display text-cream">L&apos;autre</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="luxe-label">Prénom</label>
                  <input
                    type="text"
                    value={person2Prenom}
                    onChange={(e) => setPerson2Prenom(e.target.value)}
                    placeholder="Prénom"
                    className="luxe-input"
                  />
                </div>
                <div>
                  <label className="luxe-label flex items-center gap-2"><Calendar size={11} /> Date de naissance</label>
                  <input
                    type="date"
                    value={person2Date}
                    onChange={(e) => setPerson2Date(e.target.value)}
                    className="luxe-input"
                  />
                </div>

                {sign2 && (
                  <div className="text-center pt-3 border-t border-[rgba(212,175,111,0.15)]">
                    <div className="font-serif-display text-3xl text-gradient-gold">{sign2.symbol}</div>
                    <div className="text-cream">{sign2.name}</div>
                    <div className="text-[10px] text-[#8a6f3a] tracking-wider">{sign2.element} · {sign2.modality}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {sign1 && sign2 && (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-6 mb-6">
                <span className="font-serif-display text-4xl text-[#d4af6f]">{sign1.symbol}</span>
                <Heart size={20} className="text-[#d4af6f]" />
                <span className="font-serif-display text-4xl text-[#d4af6f]">{sign2.symbol}</span>
              </div>
              <p className="font-serif-text italic text-[#c9b88a] mb-8">
                {sign1.name} & {sign2.name} — leurs énergies sont-elles en harmonie ?
              </p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={!person1Prenom || !person1Date || !person2Prenom || !person2Date}
              className="btn-gold"
            >
              <Sparkles size={14} />
              <span>Analyser la synastrie</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="font-serif-display text-3xl text-[#d4af6f]">{sign1?.symbol}</div>
                <div className="text-cream">{person1Prenom}</div>
              </div>
              <Heart size={20} className="text-[#d4af6f]" />
              <div className="text-center">
                <div className="font-serif-display text-3xl text-[#d4af6f]">{sign2?.symbol}</div>
                <div className="text-cream">{person2Prenom}</div>
              </div>
            </div>
            <p className="font-serif-text italic text-[#c9b88a]">
              Analyse de synastrie entre {sign1?.name} et {sign2?.name}
            </p>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />

          {!isStreaming && reading && (
            <div className="text-center mt-8">
              <button onClick={reset} className="btn-outline-gold">
                <span>Nouvelle analyse</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
