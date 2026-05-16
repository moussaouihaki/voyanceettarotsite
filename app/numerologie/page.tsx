"use client";
import { authFetch } from '@/lib/api-client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { calculerProfil, NUMBER_MEANINGS, type NumerologyProfile } from "@/lib/numerology";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Hash, Sparkles, Crown, AlertCircle } from "lucide-react";

export default function NumerologiePage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [prenom, setPrenom] = useState(profile?.prenom || "");
  const [nom, setNom] = useState(profile?.nom || "");
  const [dateNaissance, setDateNaissance] = useState(profile?.dateNaissance || "");
  const [numProfile, setNumProfile] = useState<NumerologyProfile | null>(null);
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [step, setStep] = useState<"form" | "results">("form");

  useEffect(() => {
    if (profile?.prenom && profile?.nom && profile?.dateNaissance) {
      setPrenom(profile.prenom);
      setNom(profile.nom);
      setDateNaissance(profile.dateNaissance);
    }
  }, [profile]);

  const handleCalculate = () => {
    if (!prenom || !nom || !dateNaissance) return;
    const p = calculerProfil(prenom, nom, dateNaissance);
    setNumProfile(p);
    setStep("results");
  };

  const getInterpretation = async () => {
    if (!numProfile) return;
    setIsStreaming(true);
    setReading("");
    try {
      const res = await authFetch("/api/numerologie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, nom, dateNaissance, profile: numProfile }),
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
      addReading({ type: "numérologie", title: `Profil de ${prenom} ${nom}`, content: full });
    } catch {
      setReading("Les vibrations numériques sont perturbées... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const NumberCard = ({ label, value, highlight = false }: { label: string; value: number | null; highlight?: boolean }) => {
    if (value === null) return null;
    const meaning = NUMBER_MEANINGS[value];
    return (
      <div className={`luxe-card rounded-sm p-5 ${highlight ? "luxe-card-premium" : ""}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f]">{label}</div>
          <div
            className={`font-serif-display font-semibold text-4xl ${highlight ? "text-gradient-gold" : "text-cream"}`}
            style={highlight ? undefined : { color: meaning?.color || "#f5ecd9" }}
          >
            {value}
          </div>
        </div>
        {meaning && (
          <>
            <div className="font-serif-display text-[15px] text-cream mb-2">{meaning.title}</div>
            <div className="flex flex-wrap gap-1">
              {meaning.keywords.slice(0, 3).map((k) => (
                <span key={k} className="badge-soft !text-[9px]">{k}</span>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (!isHydrated) return null;

  const hasPremium = canAccessFeature(profile?.subscription, "premium");

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {step === "form" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Hash size={11} className="inline mr-2" />
              Numérologie pythagoricienne
            </div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">Numérologie</h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
              Découvrez votre profil numérologique complet — mission de vie, désirs profonds et influences actuelles.
            </p>
          </div>

          <div className="max-w-lg mx-auto luxe-card rounded-sm p-8 space-y-5">
            <div className="text-center pb-4 border-b border-[rgba(212,175,111,0.15)]">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">Vos coordonnées</div>
              <p className="font-serif-text italic text-[#8a6f3a] text-sm">Chaque lettre, chaque chiffre porte une vibration</p>
            </div>

            <div>
              <label className="luxe-label">Prénom</label>
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Votre prénom..." className="luxe-input" />
            </div>
            <div>
              <label className="luxe-label">Nom de famille</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom..." className="luxe-input" />
            </div>
            <div>
              <label className="luxe-label">Date de naissance</label>
              <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} className="luxe-input" />
            </div>

            <div className="pt-3">
              <button onClick={handleCalculate} disabled={!prenom || !nom || !dateNaissance} className="btn-gold w-full !justify-center">
                <Sparkles size={14} />
                <span>Calculer mon profil</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "results" && numProfile && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <div className="badge-gold mb-5">Profil numérologique</div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-2">
              {prenom} {nom}
            </h2>
            <p className="font-serif-text italic text-[#c9b88a]">
              né(e) le {new Date(dateNaissance + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>

            {(numProfile.nombreMaitre || numProfile.nombreKarmique) && (
              <div className="flex flex-wrap gap-3 justify-center mt-5">
                {numProfile.nombreMaitre && (
                  <span className="badge-premium flex items-center gap-1.5">
                    <Crown size={11} />
                    Nombre Maître {numProfile.cheminDeVie}
                  </span>
                )}
                {numProfile.nombreKarmique && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-red-300 bg-red-900/20 border border-red-500/40 px-3 py-1 rounded-sm">
                    <AlertCircle size={11} />
                    Dette Karmique {numProfile.nombreKarmique}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
            <div className="col-span-2 md:col-span-1">
              <NumberCard label="Chemin de Vie" value={numProfile.cheminDeVie} highlight />
            </div>
            <NumberCard label="Expression" value={numProfile.expression} />
            <NumberCard label="Âme — désir profond" value={numProfile.ame} />
            <NumberCard label="Personnalité" value={numProfile.personnalite} />
            <NumberCard label="Actif (prénom)" value={numProfile.actif} />
            <NumberCard label="Héréditaire (nom)" value={numProfile.hereditaire} />
          </div>

          <div className="luxe-card rounded-sm p-7 mb-10">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-6">Influences du moment</div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Année personnelle", value: numProfile.anneePersonnelle },
                { label: "Mois personnel", value: numProfile.moisPersonnel },
                { label: "Jour personnel", value: numProfile.jourPersonnel },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="font-serif-display text-4xl text-[#d4af6f] mb-1">{value}</div>
                  <div className="text-[9px] tracking-[0.25em] uppercase text-[#8a6f3a]">{label}</div>
                  {NUMBER_MEANINGS[value] && (
                    <div className="text-[11px] text-[#c9b88a] mt-2 font-serif-display">{NUMBER_MEANINGS[value].title}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-8">
            {!reading && !isStreaming && hasPremium && (
              <button onClick={getInterpretation} className="btn-gold">
                <Sparkles size={14} />
                <span>Interprétation IA complète</span>
              </button>
            )}
            {!reading && !isStreaming && !hasPremium && (
              <div className="luxe-card rounded-sm px-6 py-4 flex items-center gap-4 max-w-sm mx-auto">
                <Crown size={20} className="text-[#d4af6f] flex-shrink-0" />
                <p className="text-[13px] text-[#c9b88a] leading-snug">
                  Déverrouillez l&apos;interprétation IA avec Mystique
                </p>
                <Link href="/tarifs" className="btn-gold !py-1.5 !px-3 !text-[11px] flex-shrink-0">
                  <span>Voir</span>
                </Link>
              </div>
            )}
            <button onClick={() => { setStep("form"); setNumProfile(null); setReading(""); }} className="btn-ghost">
              <span>Nouveau calcul</span>
            </button>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}
    </div>
  );
}
