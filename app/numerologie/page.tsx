"use client";
import { authFetch } from '@/lib/api-client';
import { checkResponse, apiErrorMessage } from "@/lib/api-errors";
import { useState, useEffect } from "react";
import Link from "next/link";
import { calculerProfil, calculerExpression, calculerAme, calculerCheminDeVie, NUMBER_MEANINGS, type NumerologyProfile } from "@/lib/numerology";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Hash, Sparkles, Crown, AlertCircle, Heart } from "lucide-react";

// ── Compatibility matrix (Pythagorean, base numbers 1-9) ──────────────────────
const COMPAT_MATRIX: Record<string, { score: number; label: string }> = {
  "1-1": { score: 65, label: "Dynamique" },
  "1-2": { score: 85, label: "Harmonieux" },
  "1-3": { score: 80, label: "Créatif" },
  "1-4": { score: 70, label: "Solide" },
  "1-5": { score: 75, label: "Stimulant" },
  "1-6": { score: 80, label: "Équilibré" },
  "1-7": { score: 70, label: "Mystérieux" },
  "1-8": { score: 85, label: "Puissant" },
  "1-9": { score: 75, label: "Inspiré" },
  "2-2": { score: 80, label: "Doux" },
  "2-3": { score: 85, label: "Joyeux" },
  "2-4": { score: 80, label: "Stable" },
  "2-5": { score: 65, label: "Contrasté" },
  "2-6": { score: 90, label: "Idéal" },
  "2-7": { score: 75, label: "Profond" },
  "2-8": { score: 70, label: "Complémentaire" },
  "2-9": { score: 85, label: "Universel" },
  "3-3": { score: 70, label: "Expressif" },
  "3-4": { score: 65, label: "Contrasté" },
  "3-5": { score: 85, label: "Aventureux" },
  "3-6": { score: 90, label: "Harmonieux" },
  "3-7": { score: 70, label: "Spirituel" },
  "3-8": { score: 70, label: "Contrasté" },
  "3-9": { score: 85, label: "Inspirant" },
  "4-4": { score: 75, label: "Solide" },
  "4-5": { score: 60, label: "Difficile" },
  "4-6": { score: 85, label: "Familial" },
  "4-7": { score: 75, label: "Réfléchi" },
  "4-8": { score: 85, label: "Ambitieux" },
  "4-9": { score: 70, label: "Humaniste" },
  "5-5": { score: 75, label: "Libre" },
  "5-6": { score: 70, label: "Contrasté" },
  "5-7": { score: 80, label: "Curieux" },
  "5-8": { score: 75, label: "Dynamique" },
  "5-9": { score: 80, label: "Ouvert" },
  "6-6": { score: 80, label: "Harmonieux" },
  "6-7": { score: 70, label: "Profond" },
  "6-8": { score: 80, label: "Équilibré" },
  "6-9": { score: 92, label: "Idéal" },
  "7-7": { score: 75, label: "Mystique" },
  "7-8": { score: 68, label: "Contrasté" },
  "7-9": { score: 85, label: "Spirituel" },
  "8-8": { score: 70, label: "Ambitieux" },
  "8-9": { score: 75, label: "Puissant" },
  "9-9": { score: 85, label: "Universel" },
};

function baseNumber(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

function numberCompat(a: number, b: number): number {
  const n1 = baseNumber(a), n2 = baseNumber(b);
  const key = n1 <= n2 ? `${n1}-${n2}` : `${n2}-${n1}`;
  return COMPAT_MATRIX[key]?.score ?? 72;
}

function overallLabel(score: number): string {
  if (score >= 88) return "Âmes sœurs";
  if (score >= 80) return "Très harmonieux";
  if (score >= 70) return "Équilibré";
  if (score >= 60) return "À cultiver";
  return "Défi vibratoire";
}

function gaugeColor(score: number): string {
  if (score <= 60) return "#ef4444";
  if (score <= 72) return "#f97316";
  return "#22c55e";
}

interface PersonInput {
  prenom: string;
  date: string;
}

interface CompatResult {
  p1: { prenom: string; expression: number; ame: number; chemin: number | null };
  p2: { prenom: string; expression: number; ame: number; chemin: number | null };
  scores: { expression: number; ame: number; chemin: number | null };
  overall: number;
  label: string;
}

function computeCompat(a: PersonInput, b: PersonInput): CompatResult {
  const e1 = calculerExpression(a.prenom);
  const e2 = calculerExpression(b.prenom);
  const am1 = calculerAme(a.prenom);
  const am2 = calculerAme(b.prenom);
  const c1 = a.date ? calculerCheminDeVie(a.date) : null;
  const c2 = b.date ? calculerCheminDeVie(b.date) : null;

  const sExpr = numberCompat(e1, e2);
  const sAme = numberCompat(am1, am2);
  const sChemin = (c1 && c2) ? numberCompat(c1, c2) : null;

  const overall = sChemin !== null
    ? Math.round(0.40 * sExpr + 0.35 * sChemin + 0.25 * sAme)
    : Math.round(0.60 * sExpr + 0.40 * sAme);

  return {
    p1: { prenom: a.prenom, expression: e1, ame: am1, chemin: c1 },
    p2: { prenom: b.prenom, expression: e2, ame: am2, chemin: c2 },
    scores: { expression: sExpr, ame: sAme, chemin: sChemin },
    overall,
    label: overallLabel(overall),
  };
}

function MiniBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] tracking-wider uppercase text-[#8a6f3a] mb-1">
        <span>{label}</span>
        <span style={{ color: gaugeColor(score) }}>{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: gaugeColor(score) }}
        />
      </div>
    </div>
  );
}

function NumericCompatibility() {
  const { profile } = useUserProfile();
  const [a, setA] = useState<PersonInput>({ prenom: profile?.prenom || "", date: profile?.dateNaissance || "" });
  const [b, setB] = useState<PersonInput>({ prenom: "", date: "" });
  const [result, setResult] = useState<CompatResult | null>(null);
  const [aiReading, setAiReading] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleCalculate = () => {
    if (!a.prenom.trim() || !b.prenom.trim()) return;
    setResult(computeCompat(a, b));
    setAiReading("");
  };

  const getAIReading = async () => {
    if (!result) return;
    setIsLoadingAI(true);
    setAiReading("");
    try {
      const res = await authFetch("/api/compatibilite-numerique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      checkResponse(res); if (!res.body) throw new Error("server");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAiReading((p) => p + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setAiReading(apiErrorMessage(err, "Les vibrations numériques sont perturbées... Réessayez."));
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="luxe-card rounded-sm p-7 mb-10">
      <div className="text-center mb-7">
        <div className="badge-gold mb-4">
          <Heart size={11} className="inline mr-2" />
          Compatibilité Numérique
        </div>
        <p className="font-serif-text italic text-[#c9b88a] text-sm max-w-md mx-auto">
          Expression, Âme et Chemin de Vie — trois axes vibratoires analysés selon la tradition pythagoricienne.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-6">
        {([
          { label: "Votre prénom", val: a, set: setA },
          { label: "Prénom de l'autre", val: b, set: setB },
        ] as const).map(({ label, val, set }) => (
          <div key={label}>
            <label className="luxe-label">{label}</label>
            <input
              value={val.prenom}
              onChange={(e) => { set((p) => ({ ...p, prenom: e.target.value })); setResult(null); setAiReading(""); }}
              placeholder="Ex : Marie"
              className="luxe-input mb-3"
            />
            <label className="luxe-label">Date de naissance <span className="text-[#8a6f3a] normal-case">(optionnel)</span></label>
            <input
              type="date"
              value={val.date}
              onChange={(e) => { set((p) => ({ ...p, date: e.target.value })); setResult(null); setAiReading(""); }}
              className="luxe-input"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleCalculate}
          disabled={!a.prenom.trim() || !b.prenom.trim()}
          className="btn-gold"
        >
          <Heart size={14} />
          <span>Calculer la compatibilité</span>
        </button>
      </div>

      {result && (
        <div className="fade-in-up">
          {/* Two circles with 3 numbers each */}
          <div className="flex items-start justify-center gap-8 mb-8">
            {([
              { p: result.p1, color: "#d4af6f", bg: "rgba(212,175,111,0.08)" },
              { p: result.p2, color: "#9b7ed4", bg: "rgba(155,126,212,0.08)" },
            ] as const).map(({ p, color, bg }) => (
              <div key={p.prenom} className="flex flex-col items-center gap-2">
                <div
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-2"
                  style={{ borderColor: color, background: bg }}
                >
                  <div className="font-serif-display text-3xl font-semibold" style={{ color }}>{p.expression}</div>
                </div>
                <div className="text-[11px] tracking-[0.2em] uppercase" style={{ color }}>{p.prenom}</div>
                <div className="text-center text-[10px] text-[#8a6f3a] leading-relaxed">
                  <div>Expression · {p.expression}</div>
                  <div>Âme · {p.ame}</div>
                  {p.chemin && <div>Chemin · {p.chemin}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Main gauge */}
          <div className="max-w-sm mx-auto mb-2">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[10px] tracking-widest uppercase text-[#8a6f3a]">Affinité globale</span>
              <span className="font-serif-display text-2xl" style={{ color: gaugeColor(result.overall) }}>{result.overall}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${result.overall}%`, backgroundColor: gaugeColor(result.overall) }}
              />
            </div>
            <div className="text-center font-serif-display text-xl text-gradient-cream mt-3 mb-5">{result.label}</div>
          </div>

          {/* Breakdown bars */}
          <div className="max-w-sm mx-auto mb-6 border-t border-[rgba(212,175,111,0.1)] pt-5">
            <MiniBar score={result.scores.expression} label="Expression (masque social)" />
            <MiniBar score={result.scores.ame} label="Âme (désirs profonds)" />
            {result.scores.chemin !== null && (
              <MiniBar score={result.scores.chemin} label="Chemin de vie (mission)" />
            )}
          </div>

          {/* AI reading */}
          {!aiReading && !isLoadingAI && (
            <div className="text-center">
              {profile ? (
                <button onClick={getAIReading} className="btn-gold">
                  <Sparkles size={14} />
                  <span>Révéler l'interprétation de Madame Céleste</span>
                </button>
              ) : (
                <p className="text-[11px] tracking-widest uppercase text-[#8a6f3a]">
                  Connectez-vous pour l&apos;interprétation complète par IA
                </p>
              )}
            </div>
          )}
          {(aiReading || isLoadingAI) && (
            <ReadingResult text={aiReading} isStreaming={isLoadingAI} />
          )}
        </div>
      )}
    </div>
  );
}

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
      checkResponse(res); if (!res.body) throw new Error("server");
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
    } catch (err) {
      setReading(apiErrorMessage(err, "Les vibrations numériques sont perturbées... Réessayez."));
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
              Chemin de vie · Expression · Année personnelle · Les nombres révèlent tout
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

          <NumericCompatibility />

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
