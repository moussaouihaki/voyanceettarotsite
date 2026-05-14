"use client";
import { useState } from "react";
import { calculerProfil, NUMBER_MEANINGS, type NumerologyProfile } from "@/lib/numerology";
import ReadingResult from "@/components/ReadingResult";

export default function NumerologiePage() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [step, setStep] = useState<"form" | "results">("form");

  const handleCalculate = () => {
    if (!prenom || !nom || !dateNaissance) return;
    const p = calculerProfil(prenom, nom, dateNaissance);
    setProfile(p);
    setStep("results");
  };

  const getInterpretation = async () => {
    if (!profile) return;
    setIsStreaming(true);
    setReading("");
    try {
      const res = await fetch("/api/numerologie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, nom, dateNaissance, profile }),
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
      setReading("Les vibrations numériques sont perturbées... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const NumberBadge = ({ label, value, highlight = false }: { label: string; value: number | null; highlight?: boolean }) => {
    if (value === null) return null;
    const meaning = NUMBER_MEANINGS[value];
    return (
      <div className={`mystical-card rounded-xl p-4 ${highlight ? "border-yellow-500/50 shadow-[0_0_20px_rgba(255,215,0,0.1)]" : ""}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="text-xs text-purple-400">{label}</div>
          <div className={`text-3xl font-cinzel font-bold ${highlight ? "text-yellow-300" : "text-purple-200"}`}
            style={{ color: meaning?.color || undefined }}>
            {value}
          </div>
        </div>
        {meaning && (
          <>
            <div className="text-sm font-bold text-purple-100 mb-1">{meaning.title}</div>
            <div className="flex flex-wrap gap-1">
              {meaning.keywords.slice(0, 3).map((k) => (
                <span key={k} className="text-[10px] text-purple-400/70 bg-purple-900/40 px-1.5 py-0.5 rounded">{k}</span>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {step === "form" && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4 float-anim">🔢</div>
            <h1 className="text-3xl font-bold text-purple-100 mb-2">Numérologie</h1>
            <p className="text-purple-400 text-sm max-w-md mx-auto">
              Découvrez votre profil numérologique complet — mission de vie, désirs profonds et influences actuelles.
            </p>
          </div>

          <div className="max-w-md mx-auto mystical-card rounded-2xl p-8 space-y-5">
            <div>
              <label className="text-purple-300 text-sm block mb-2">Prénom</label>
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)}
                placeholder="Votre prénom..." className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 text-sm" />
            </div>
            <div>
              <label className="text-purple-300 text-sm block mb-2">Nom de famille</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)}
                placeholder="Votre nom..." className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 text-sm" />
            </div>
            <div>
              <label className="text-purple-300 text-sm block mb-2">Date de naissance</label>
              <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)}
                className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-500 text-sm" />
            </div>
            <button
              onClick={handleCalculate}
              disabled={!prenom || !nom || !dateNaissance}
              className="gradient-btn glow-btn w-full py-3 rounded-xl text-white font-semibold text-sm"
            >
              Calculer mon profil ✦
            </button>
          </div>
        </div>
      )}

      {step === "results" && profile && (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔢</div>
            <h2 className="font-cinzel text-2xl text-yellow-300 mb-1">Profil de {prenom} {nom}</h2>
            <p className="text-purple-400 text-sm">né(e) le {new Date(dateNaissance + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
            {profile.nombreMaitre && (
              <div className="inline-block mt-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-full text-sm">
                ⭐ Nombre Maître {profile.cheminDeVie} détecté
              </div>
            )}
            {profile.nombreKarmique && (
              <div className="inline-block mt-2 ml-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-full text-sm">
                ⚠️ Dette Karmique {profile.nombreKarmique}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="col-span-2 md:col-span-1">
              <NumberBadge label="Chemin de Vie" value={profile.cheminDeVie} highlight />
            </div>
            <NumberBadge label="Expression" value={profile.expression} />
            <NumberBadge label="Âme (désir profond)" value={profile.ame} />
            <NumberBadge label="Personnalité" value={profile.personnalite} />
            <NumberBadge label="Actif (prénom)" value={profile.actif} />
            <NumberBadge label="Héréditaire (nom)" value={profile.hereditaire} />
          </div>

          <div className="mystical-card rounded-xl p-5 mb-8">
            <h3 className="font-cinzel text-purple-200 mb-4">Influences du moment</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Année personnelle", value: profile.anneePersonnelle },
                { label: "Mois personnel", value: profile.moisPersonnel },
                { label: "Jour personnel", value: profile.jourPersonnel },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-cinzel font-bold text-purple-300">{value}</div>
                  <div className="text-xs text-purple-500 mt-1">{label}</div>
                  {NUMBER_MEANINGS[value] && <div className="text-xs text-purple-400 mt-1">{NUMBER_MEANINGS[value].title}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-6">
            {!reading && !isStreaming && (
              <button onClick={getInterpretation} className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold">
                🔮 Obtenir mon interprétation IA
              </button>
            )}
            <button onClick={() => { setStep("form"); setProfile(null); setReading(""); }} className="px-6 py-3 rounded-xl border border-purple-700/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">
              Nouveau calcul
            </button>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}
    </div>
  );
}
