"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, Stars, Sparkles, RotateCcw, BookOpen, Lock } from "lucide-react";
import { authFetch } from "@/lib/api-client";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";

const TIPS = [
  {
    icon: Moon,
    title: "Notez dès le réveil",
    text: "Les rêves s'effacent en quelques minutes. Gardez un carnet au chevet de votre lit et écrivez immédiatement, avant même de vous lever.",
  },
  {
    icon: Stars,
    title: "Tous les détails comptent",
    text: "Couleurs, personnages, lieux, objets, sensations — chaque élément porte une signification symbolique. Ne censurez rien.",
  },
  {
    icon: BookOpen,
    title: "Décrivez vos émotions",
    text: "L'atmosphère émotionnelle d'un rêve est souvent plus révélatrice que son contenu narratif. Peur, joie, vertige — tout compte.",
  },
];

export default function RevesPage() {
  const { profile, addReading, isHydrated, firebaseUser } = useUserProfile();

  const [dream, setDream] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [emotions, setEmotions] = useState("");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isLoggedIn = !!firebaseUser;
  const dreamTooShort = dream.trim().length < 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamTooShort || isStreaming) return;

    setError(null);
    setReading("");
    setSubmitted(true);
    setIsStreaming(true);

    try {
      const res = await authFetch("/api/reves", {
        method: "POST",
        body: JSON.stringify({
          dream: dream.trim(),
          recurring,
          emotions: emotions.trim() || undefined,
          profile: profile
            ? { prenom: profile.prenom || undefined, dateNaissance: profile.dateNaissance || undefined }
            : undefined,
        }),
      });

      if (res.status === 401) {
        setError("Vous devez être connecté pour accéder à l'interprétation des rêves.");
        setSubmitted(false);
        setIsStreaming(false);
        return;
      }

      if (!res.ok || !res.body) {
        setError("Une erreur est survenue. Veuillez réessayer.");
        setSubmitted(false);
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setReading((prev) => prev + chunk);
      }

      addReading({
        type: "reves",
        title: "Analyse de Rêve",
        content: full,
        meta: { dreamExcerpt: dream.slice(0, 100), recurring, emotions: emotions.trim() || undefined },
      });
    } catch {
      setError("La connexion aux étoiles a été interrompue. Veuillez réessayer.");
      setSubmitted(false);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setReading("");
    setDream("");
    setRecurring(false);
    setEmotions("");
    setError(null);
  };

  if (!isHydrated) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">

      {/* ── Form step ── */}
      {!submitted && (
        <div className="fade-in-up">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Moon size={11} className="inline mr-2" />
              Oniromancie
            </div>
            <div className="font-serif-display text-7xl text-[#d4af6f] mb-5 float-slow">
              ☽
            </div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
              Analyse de vos Rêves
            </h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-xl mx-auto leading-relaxed">
              Les rêves sont la langue secrète de l&apos;âme. Madame Céleste en déchiffre
              les symboles, les archétypes et les messages cachés pour vous.
            </p>
          </div>

          {/* Auth notice */}
          {!isLoggedIn && (
            <div className="luxe-card rounded-sm p-6 mb-8 flex items-start gap-4 border-[rgba(212,175,111,0.3)]">
              <div className="w-10 h-10 rounded-sm bg-[rgba(212,175,111,0.08)] border border-[rgba(212,175,111,0.25)] flex items-center justify-center shrink-0 mt-0.5">
                <Lock size={16} className="text-[#d4af6f]" />
              </div>
              <div className="flex-1">
                <div className="font-serif-display text-base text-cream mb-1">
                  Connexion requise
                </div>
                <p className="text-[13px] text-[#c9b88a] leading-relaxed mb-4">
                  L&apos;interprétation de vos rêves est réservée aux membres. Rejoignez-nous gratuitement pour accéder à cette lecture.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/connexion" className="btn-gold text-xs !px-4 !py-2">
                    <Sparkles size={12} />
                    <span>Se connecter</span>
                  </Link>
                  <Link href="/tarifs" className="btn-ghost text-xs !px-4 !py-2">
                    <span>Découvrir les offres</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Main form */}
          <form onSubmit={handleSubmit} className="luxe-card rounded-sm p-8 mb-10">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-7">
              Partagez votre rêve avec Madame Céleste
            </div>

            {/* Dream textarea */}
            <div className="mb-6">
              <label className="luxe-label">
                Décrivez votre rêve <span className="text-[#d4af6f]">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={dream}
                  onChange={(e) => setDream(e.target.value)}
                  placeholder="Décrivez votre rêve en détail... Les personnages, les lieux, les symboles, les événements, les sensations physiques..."
                  rows={8}
                  className="luxe-input resize-none"
                  minLength={10}
                />
                <div
                  className={`text-right text-[11px] mt-1.5 transition-colors ${
                    dreamTooShort ? "text-[rgba(201,184,138,0.4)]" : "text-[#d4af6f]"
                  }`}
                >
                  {dream.length} caractères {dreamTooShort && dream.length > 0 && "(minimum 10)"}
                </div>
              </div>
            </div>

            {/* Recurring toggle */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative shrink-0">
                  <input
                    type="checkbox"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-[rgba(7,4,13,0.8)] border border-[rgba(212,175,111,0.25)] peer-checked:border-[rgba(212,175,111,0.6)] transition-all peer-focus:ring-1 peer-focus:ring-[rgba(212,175,111,0.4)]" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[rgba(201,184,138,0.4)] peer-checked:bg-[#d4af6f] peer-checked:translate-x-5 transition-all duration-200" />
                </div>
                <div>
                  <span className="text-[13px] text-[#e8dcc0] font-medium group-hover:text-cream transition-colors">
                    Rêve récurrent
                  </span>
                  <p className="text-[11px] text-[#c9b88a] mt-0.5">
                    Ce rêve revient régulièrement — l&apos;inconscient insiste
                  </p>
                </div>
              </label>
            </div>

            {/* Emotions textarea */}
            <div className="mb-8">
              <label className="luxe-label">
                Émotions ressenties{" "}
                <span className="text-[rgba(201,184,138,0.5)] normal-case tracking-normal">
                  (optionnel)
                </span>
              </label>
              <textarea
                value={emotions}
                onChange={(e) => setEmotions(e.target.value)}
                placeholder="Peur, joie, confusion, sérénité, angoisse, euphorie..."
                rows={2}
                className="luxe-input resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-sm bg-[rgba(180,60,60,0.12)] border border-[rgba(180,60,60,0.25)] text-[13px] text-[#e8a0a0]">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={dreamTooShort || isStreaming || !isLoggedIn}
              className="btn-gold w-full justify-center"
            >
              <Moon size={15} />
              <span>Interpréter mon rêve</span>
            </button>

            {!isLoggedIn && (
              <p className="text-center text-[11px] text-[rgba(201,184,138,0.5)] mt-3">
                Connexion requise pour accéder à l&apos;interprétation
              </p>
            )}
          </form>

          {/* Tips */}
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] text-center mb-5">
              Pour une meilleure interprétation
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {TIPS.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="luxe-card rounded-sm p-5 group"
                >
                  <div className="w-9 h-9 rounded-sm bg-[rgba(212,175,111,0.06)] border border-[rgba(212,175,111,0.2)] flex items-center justify-center mb-4 group-hover:border-[rgba(212,175,111,0.4)] transition-colors">
                    <Icon size={15} className="text-[#d4af6f]" />
                  </div>
                  <div className="font-serif-display text-sm text-cream mb-1.5">{title}</div>
                  <p className="text-[12px] text-[#c9b88a] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Result step ── */}
      {submitted && (
        <div className="fade-in-up">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="badge-gold mb-5">
              <Sparkles size={11} className="inline mr-2" />
              Lecture Onirique
            </div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-3">
              Interprétation de Madame Céleste
            </h2>
            <p className="font-serif-text italic text-[#c9b88a]">
              Les voiles du sommeil se lèvent...
            </p>
          </div>

          {/* Dream excerpt */}
          <div className="luxe-card rounded-sm px-6 py-5 mb-2 flex items-start gap-4">
            <Moon size={16} className="text-[#d4af6f] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a6f3a] mb-1.5">
                Votre rêve
              </div>
              <p className="font-serif-text text-[14px] text-[#c9b88a] italic leading-relaxed">
                &ldquo;
                {dream.length > 100 ? dream.slice(0, 100).trimEnd() + "…" : dream}
                &rdquo;
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {recurring && (
                  <span className="badge-gold text-[10px]">Rêve récurrent</span>
                )}
                {emotions.trim() && (
                  <span
                    className="text-[10px] tracking-wider text-[#c9b88a] px-2 py-0.5 rounded-sm border border-[rgba(201,184,138,0.15)]"
                    style={{ background: "rgba(201,184,138,0.04)" }}
                  >
                    {emotions.trim().slice(0, 40)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Reading result */}
          <ReadingResult text={reading} isStreaming={isStreaming} />

          {/* Error during streaming */}
          {error && (
            <div className="mt-6 px-4 py-3 rounded-sm bg-[rgba(180,60,60,0.12)] border border-[rgba(180,60,60,0.25)] text-[13px] text-[#e8a0a0]">
              {error}
            </div>
          )}

          {/* Reset */}
          {!isStreaming && (
            <div className="text-center mt-10">
              <button onClick={handleReset} className="btn-outline-gold">
                <RotateCcw size={13} className="inline mr-2" />
                <span>Analyser un autre rêve</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
