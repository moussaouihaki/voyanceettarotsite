"use client";
import { useState } from "react";
import { ZODIAC_SIGNS, getSunSign, PLANETS, ASTRO_HOUSES } from "@/lib/astrology";
import ReadingResult from "@/components/ReadingResult";

const MOON_SIGNS = ZODIAC_SIGNS.map(s => s.name);

export default function ProfilAstralPage() {
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [heureNaissance, setHeureNaissance] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");
  const [signeLunaire, setSigneLunaire] = useState("");
  const [ascendant, setAscendant] = useState("");
  const [step, setStep] = useState<"form" | "results">("form");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sunSign = dateNaissance ? getSunSign(dateNaissance) : null;

  const handleSubmit = () => {
    if (!prenom || !dateNaissance) return;
    setStep("results");
  };

  const getInterpretation = async () => {
    if (!sunSign) return;
    setIsStreaming(true);
    setReading("");
    try {
      const res = await fetch("/api/profil-astral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom, dateNaissance, heureNaissance, lieuNaissance,
          signeSolaire: sunSign.name,
          signeLunaire: signeLunaire || undefined,
          ascendant: ascendant || undefined,
        }),
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
      setReading("Les astres sont voilés... Réessayez dans quelques instants.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {step === "form" && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4 float-anim">♈</div>
            <h1 className="text-3xl font-bold text-purple-100 mb-2">Profil Astral</h1>
            <p className="text-purple-400 text-sm max-w-md mx-auto">
              Découvrez votre thème astral complet — signe solaire, lunaire, ascendant et interprétation personnalisée par l'IA.
            </p>
          </div>

          <div className="max-w-lg mx-auto mystical-card rounded-2xl p-8 space-y-5">
            <div>
              <label className="text-purple-300 text-sm block mb-2">Votre prénom *</label>
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom..." className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 text-sm" />
            </div>
            <div>
              <label className="text-purple-300 text-sm block mb-2">Date de naissance *</label>
              <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)}
                className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-500 text-sm" />
            </div>

            {dateNaissance && sunSign && (
              <div className="flex items-center gap-3 bg-purple-900/30 rounded-xl p-3 border border-purple-700/30">
                <span className="text-3xl">{sunSign.emoji}</span>
                <div>
                  <div className="text-yellow-300 font-cinzel font-bold">{sunSign.symbol} {sunSign.name}</div>
                  <div className="text-xs text-purple-400">{sunSign.dates} · {sunSign.element}</div>
                </div>
              </div>
            )}

            <div className="border-t border-purple-800/30 pt-4">
              <p className="text-xs text-purple-500 mb-4">Optionnel — pour une lecture plus complète :</p>
              <div className="space-y-4">
                <div>
                  <label className="text-purple-300 text-sm block mb-2">Heure de naissance</label>
                  <input type="time" value={heureNaissance} onChange={(e) => setHeureNaissance(e.target.value)}
                    className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-500 text-sm" />
                </div>
                <div>
                  <label className="text-purple-300 text-sm block mb-2">Lieu de naissance</label>
                  <input value={lieuNaissance} onChange={(e) => setLieuNaissance(e.target.value)}
                    placeholder="Paris, France..." className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 text-sm" />
                </div>
                <div>
                  <label className="text-purple-300 text-sm block mb-2">Signe Lunaire (si connu)</label>
                  <select value={signeLunaire} onChange={(e) => setSigneLunaire(e.target.value)}
                    className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-500 text-sm">
                    <option value="">Sélectionner...</option>
                    {MOON_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-purple-300 text-sm block mb-2">Ascendant (si connu)</label>
                  <select value={ascendant} onChange={(e) => setAscendant(e.target.value)}
                    className="w-full bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-500 text-sm">
                    <option value="">Sélectionner...</option>
                    {MOON_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={!prenom || !dateNaissance}
              className="gradient-btn glow-btn w-full py-3 rounded-xl text-white font-semibold text-sm">
              Voir mon profil astral ✦
            </button>
          </div>
        </div>
      )}

      {step === "results" && sunSign && (
        <div className="fade-in-up">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 float-anim">{sunSign.emoji}</div>
            <h2 className="font-cinzel text-2xl text-yellow-300 mb-1">Profil Astral de {prenom}</h2>
            <p className="text-purple-400 text-sm">{new Date(dateNaissance + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>

          {/* Main signs */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Signe Solaire ☀️", sign: sunSign.name, emoji: sunSign.emoji, desc: "Personnalité consciente", ruler: sunSign.ruler },
              { label: "Signe Lunaire 🌙", sign: signeLunaire || "Non calculé", emoji: signeLunaire ? ZODIAC_SIGNS.find(s => s.name === signeLunaire)?.emoji || "🌙" : "🌙", desc: "Émotions & instincts", ruler: signeLunaire ? "Heure requise" : "Entrez l'heure de naissance" },
              { label: "Ascendant ⬆️", sign: ascendant || "Non calculé", emoji: ascendant ? ZODIAC_SIGNS.find(s => s.name === ascendant)?.emoji || "⬆️" : "⬆️", desc: "Masque social", ruler: ascendant ? "Heure & lieu requis" : "Entrez heure + lieu" },
            ].map(({ label, sign, emoji, desc, ruler }) => (
              <div key={label} className="mystical-card rounded-xl p-5 text-center">
                <div className="text-xs text-purple-400 mb-2">{label}</div>
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="font-cinzel font-bold text-yellow-300 text-lg">{sign}</div>
                <div className="text-xs text-purple-400 mt-1">{desc}</div>
                <div className="text-xs text-purple-500 mt-1">{ruler}</div>
              </div>
            ))}
          </div>

          {/* Sun sign details */}
          <div className="mystical-card rounded-xl p-6 mb-6">
            <h3 className="font-cinzel text-yellow-300 mb-3">☀️ {sunSign.symbol} {sunSign.name} — Profil détaillé</h3>
            <p className="text-purple-200/80 text-sm mb-4">{sunSign.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-purple-400 mb-2">Forces :</p>
                <div className="flex flex-wrap gap-1">
                  {sunSign.strengths.map(s => <span key={s} className="text-xs bg-green-900/30 text-green-400 border border-green-700/30 px-2 py-1 rounded">{s}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs text-purple-400 mb-2">Défis :</p>
                <div className="flex flex-wrap gap-1">
                  {sunSign.challenges.map(s => <span key={s} className="text-xs bg-red-900/30 text-red-400 border border-red-700/30 px-2 py-1 rounded">{s}</span>)}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-purple-400">
              <span>⚡ Planète : {sunSign.ruler}</span>
              <span>🌊 Élément : {sunSign.element}</span>
              <span>♟️ Modalité : {sunSign.modality}</span>
              <span>💎 Pierre : {sunSign.stone}</span>
            </div>
          </div>

          {/* Planets reference */}
          <div className="mystical-card rounded-xl p-5 mb-6">
            <h3 className="font-cinzel text-purple-200 mb-3 text-sm">Planètes & domaines de vie</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {PLANETS.slice(0, 6).map(p => (
                <div key={p.name} className="flex items-start gap-2 text-xs">
                  <span className="text-purple-300 font-bold min-w-[80px]">{p.name}</span>
                  <span className="text-purple-500">{p.meaning}</span>
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
            <button onClick={() => { setStep("form"); setReading(""); }} className="px-6 py-3 rounded-xl border border-purple-700/40 text-purple-300 hover:bg-purple-900/30 transition-all text-sm">
              Modifier
            </button>
          </div>

          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}
    </div>
  );
}
