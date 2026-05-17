"use client";
import { authFetch } from '@/lib/api-client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { calculerProfil, NUMBER_MEANINGS, type NumerologyProfile } from "@/lib/numerology";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Hash, Sparkles, Crown, AlertCircle, Heart } from "lucide-react";

function getExpressionNumber(name: string): number {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, "");
  const sum = clean.split("").reduce((acc, ch) => acc + (ch.charCodeAt(0) - 64), 0);
  return reduceToSingle(sum);
}

function reduceToSingle(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  if (n <= 9) return n;
  const digits = String(n).split("").reduce((acc, d) => acc + parseInt(d), 0);
  return reduceToSingle(digits);
}

function getCompatibilityScore(n1: number, n2: number): { score: number; label: string; description: string } {
  const compatibilityMatrix: Record<string, { score: number; label: string; description: string }> = {
    "1-1": { score: 65, label: "Dynamique", description: "Deux leaders qui devront apprendre à partager le pouvoir avec bienveillance." },
    "1-2": { score: 85, label: "Harmonieux", description: "Le 1 apporte la direction, le 2 l'harmonie — un duo complémentaire et fort." },
    "1-3": { score: 80, label: "Créatif", description: "Association joyeuse et créative, pleine d'énergie et d'enthousiasme." },
    "1-4": { score: 70, label: "Solide", description: "Le 1 et le 4 construisent ensemble des fondations durables." },
    "1-5": { score: 75, label: "Stimulant", description: "Relation dynamique et aventureuse, mais attention aux directions opposées." },
    "1-6": { score: 80, label: "Équilibré", description: "Le 1 guide, le 6 nourrit — une belle complémentarité." },
    "1-7": { score: 70, label: "Mystérieux", description: "Deux âmes indépendantes qui se fascinent mutuellement." },
    "1-8": { score: 85, label: "Puissant", description: "Duo ambitieux et efficace, capable de grandes réalisations communes." },
    "1-9": { score: 75, label: "Inspiré", description: "Le 1 agit, le 9 inspire — une relation porteuse de sens." },
    "2-2": { score: 80, label: "Doux", description: "Relation sensible et intuitive, avec une grande empathie mutuelle." },
    "2-3": { score: 85, label: "Joyeux", description: "Couple communicatif et enjoué, l'harmonie et la créativité s'unissent." },
    "2-4": { score: 80, label: "Stable", description: "Le 2 apporte l'harmonie, le 4 la stabilité — relation solide." },
    "2-5": { score: 65, label: "Contrasté", description: "Le 2 cherche la paix, le 5 l'aventure — un équilibre à trouver." },
    "2-6": { score: 90, label: "Idéal", description: "Deux âmes tournées vers l'amour et l'harmonie — compatibilité excellente." },
    "2-7": { score: 75, label: "Profond", description: "Relation spirituelle et intime, riche en échanges profonds." },
    "2-8": { score: 70, label: "Complémentaire", description: "Le 2 adoucit le 8, le 8 structure le 2 — bonne complémentarité." },
    "2-9": { score: 85, label: "Universel", description: "Deux âmes généreuses et aimantes — relation belle et profonde." },
    "3-3": { score: 70, label: "Créatif", description: "Trop de légèreté parfois, mais une relation joyeuse et créative." },
    "3-4": { score: 65, label: "Contrasté", description: "Le 3 rêve, le 4 construit — ils peuvent s'équilibrer avec patience." },
    "3-5": { score: 85, label: "Aventureux", description: "Relation pétillante et joyeuse, pleine d'aventures et de découvertes." },
    "3-6": { score: 90, label: "Harmonieux", description: "Beauté, amour et créativité réunis — une des meilleures compatibilités." },
    "3-7": { score: 70, label: "Spirituel", description: "Le 3 s'exprime, le 7 réfléchit — une relation enrichissante." },
    "3-8": { score: 70, label: "Contrasté", description: "Le 3 joue, le 8 travaille — ils se complètent si chacun respecte l'autre." },
    "3-9": { score: 85, label: "Inspirant", description: "Créativité et humanisme unis — une relation artistique et généreuse." },
    "4-4": { score: 75, label: "Solide", description: "Relation stable et fiable, parfois manquant de spontanéité." },
    "4-5": { score: 60, label: "Difficile", description: "Le 4 veut la stabilité, le 5 la liberté — des ajustements nécessaires." },
    "4-6": { score: 85, label: "Familial", description: "Sécurité, amour et engagement — une relation durable et chaleureuse." },
    "4-7": { score: 75, label: "Réfléchi", description: "Deux âmes sérieuses qui apprécient la profondeur et la fiabilité." },
    "4-8": { score: 85, label: "Ambitieux", description: "Duo travailleur et efficace, capable de construire quelque chose de grand." },
    "4-9": { score: 70, label: "Humaniste", description: "Le 4 construit, le 9 donne — une relation utile et généreuse." },
    "5-5": { score: 75, label: "Libre", description: "Deux esprits libres qui s'amusent ensemble — mais attention à l'instabilité." },
    "5-6": { score: 70, label: "Contrasté", description: "Le 5 cherche l'aventure, le 6 le foyer — trouver un équilibre." },
    "5-7": { score: 80, label: "Curieux", description: "Deux esprits curieux et indépendants qui s'enrichissent mutuellement." },
    "5-8": { score: 75, label: "Dynamique", description: "Énergie et ambition réunies — relation active et stimulante." },
    "5-9": { score: 80, label: "Humaniste", description: "Liberté et générosité — relation inspirante et ouverte sur le monde." },
    "6-6": { score: 80, label: "Harmonieux", description: "Beaucoup d'amour et de soin, parfois au détriment de l'individualité." },
    "6-7": { score: 70, label: "Profond", description: "Le 6 aime, le 7 réfléchit — relation intime et spirituelle." },
    "6-8": { score: 80, label: "Équilibré", description: "Amour et ambition réunis — une relation protectrice et stable." },
    "6-9": { score: 90, label: "Idéal", description: "Deux âmes généreuses et aimantes — une des meilleures combinaisons." },
    "7-7": { score: 75, label: "Mystique", description: "Deux chercheurs de vérité — relation profonde mais parfois solitaire." },
    "7-8": { score: 70, label: "Contrasté", description: "Le 7 cherche l'intériorité, le 8 le succès — des compromis à trouver." },
    "7-9": { score: 85, label: "Spirituel", description: "Quête spirituelle commune — relation profonde et évolutive." },
    "8-8": { score: 70, label: "Ambitieux", description: "Beaucoup d'ambition, parfois au détriment de la douceur." },
    "8-9": { score: 75, label: "Puissant", description: "Force et générosité réunies — relation impactante et significative." },
    "9-9": { score: 85, label: "Universel", description: "Deux âmes évoluées tournées vers le monde — relation profondément humaine." },
  };
  const key = n1 <= n2 ? `${n1}-${n2}` : `${n2}-${n1}`;
  return compatibilityMatrix[key] || { score: 72, label: "Unique", description: "Une combinaison rare et unique, riche en apprentissages mutuels." };
}

function NumericCompatibility() {
  const [prenom1, setPrenom1] = useState("");
  const [prenom2, setPrenom2] = useState("");
  const [result, setResult] = useState<{ n1: number; n2: number; score: number; label: string; description: string } | null>(null);

  const handleCalculate = () => {
    if (!prenom1.trim() || !prenom2.trim()) return;
    const n1 = getExpressionNumber(prenom1);
    const n2 = getExpressionNumber(prenom2);
    const compat = getCompatibilityScore(n1, n2);
    setResult({ n1, n2, ...compat });
  };

  const gaugeColor = (score: number) => {
    if (score <= 50) return "#ef4444";
    if (score <= 70) return "#f97316";
    return "#22c55e";
  };

  return (
    <div className="luxe-card rounded-sm p-7 mb-10">
      <div className="text-center mb-7">
        <div className="badge-gold mb-4">
          <Heart size={11} className="inline mr-2" />
          Compatibilité Numérique
        </div>
        <p className="font-serif-text italic text-[#c9b88a] text-sm max-w-md mx-auto">
          Découvrez l&apos;harmonie vibratoire entre deux prénoms grâce au Nombre d&apos;Expression.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-5">
        <div className="flex-1">
          <label className="luxe-label">Votre prénom</label>
          <input
            value={prenom1}
            onChange={(e) => { setPrenom1(e.target.value); setResult(null); }}
            placeholder="Ex : Marie"
            className="luxe-input"
          />
        </div>
        <div className="flex-1">
          <label className="luxe-label">Prénom de l&apos;autre</label>
          <input
            value={prenom2}
            onChange={(e) => { setPrenom2(e.target.value); setResult(null); }}
            placeholder="Ex : Pierre"
            className="luxe-input"
          />
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleCalculate}
          disabled={!prenom1.trim() || !prenom2.trim()}
          className="btn-gold"
        >
          <Heart size={14} />
          <span>Calculer la compatibilité</span>
        </button>
      </div>

      {result && (
        <div className="fade-in-up">
          {/* Two circles */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-2"
                style={{ borderColor: "#d4af6f", background: "rgba(212,175,111,0.08)" }}
              >
                <div className="font-serif-display text-3xl font-semibold text-gradient-gold">{result.n1}</div>
              </div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#c9b88a]">{prenom1}</div>
            </div>

            <div className="text-[#8a6f3a] text-2xl font-serif-display">✦</div>

            <div className="flex flex-col items-center gap-2">
              <div
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-2"
                style={{ borderColor: "#9b7ed4", background: "rgba(155,126,212,0.08)" }}
              >
                <div className="font-serif-display text-3xl font-semibold" style={{ color: "#c8a8f0" }}>{result.n2}</div>
              </div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#c9b88a]">{prenom2}</div>
            </div>
          </div>

          {/* Gauge */}
          <div className="max-w-sm mx-auto mb-6">
            <div className="flex justify-between text-[10px] tracking-widest uppercase text-[#8a6f3a] mb-2">
              <span>Affinité</span>
              <span>{result.score}%</span>
            </div>
            <div className="h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${result.score}%`, backgroundColor: gaugeColor(result.score) }}
              />
            </div>
          </div>

          {/* Label + description */}
          <div className="text-center">
            <div className="font-serif-display text-2xl text-gradient-cream mb-3">{result.label}</div>
            <p className="font-serif-text italic text-[#c9b88a] text-sm max-w-md mx-auto leading-relaxed">
              {result.description}
            </p>
          </div>
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
