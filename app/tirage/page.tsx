"use client";
import { authFetch } from '@/lib/api-client';
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ALL_CARDS, TarotCard } from "@/lib/tarot-cards";
import { ALL_SPREADS, SPREAD_CATEGORIES, type Spread, type SpreadCategory } from "@/lib/spreads";
import { getSpreadIcon, CATEGORY_ICONS } from "@/lib/spread-icons";
import { useUserProfile, canAccessFeature, TIER_LIMITS } from "@/contexts/UserProfileContext";
import { canUse, increment, remaining } from "@/lib/daily-limits";
import TarotCardComponent from "@/components/TarotCard";
import ReadingResult from "@/components/ReadingResult";
import CircleVideo from "@/components/CircleVideo";
import { type DeckType } from "@/lib/deck-images";
import CityAutocomplete from "@/components/CityAutocomplete";
import DeckShuffle from "@/components/DeckShuffle";
import DeckPick from "@/components/DeckPick";
import { Search, Sparkles, ArrowLeft, RotateCcw, Star, Layers, Lock, Crown, Heart, ChevronDown, Calendar, Clock, MapPin } from "lucide-react";

type DrawnCard = TarotCard & { reversed: boolean; positionIndex: number };
type Step = "choose" | "question" | "shuffle" | "pick" | "draw" | "reading";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DIFFICULTY_LABELS = {
  facile: "Initiation",
  intermédiaire: "Intermédiaire",
  avancé: "Avancé",
};

export default function TiragePage() {
  const { profile, addReading } = useUserProfile();
  const [step, setStep] = useState<Step>("choose");
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [activeCategory, setActiveCategory] = useState<SpreadCategory | "all">("all");
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [noProfileHint, setNoProfileHint] = useState<string | null>(null);
  const [conjointPrenom, setConjointPrenom] = useState("");
  const [conjointDateNaissance, setConjointDateNaissance] = useState("");
  const [conjointHeureNaissance, setConjointHeureNaissance] = useState("");
  const [conjointVille, setConjointVille] = useState("");
  const [conjointLat, setConjointLat] = useState<number | undefined>();
  const [conjointLon, setConjointLon] = useState<number | undefined>();
  const [showConjoint, setShowConjoint] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);

  // Scroll to top whenever the step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  const [deck, setDeck] = useState<DeckType>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("tarot-deck") as DeckType) || "rws";
    }
    return "rws";
  });

  const switchDeck = (d: DeckType) => {
    setDeck(d);
    localStorage.setItem("tarot-deck", d);
  };

  // Shuffle deck when entering shuffle step
  const startShuffle = useCallback(() => {
    setShuffledDeck(shuffleArray(ALL_CARDS));
    setStep("shuffle");
  }, []);

  const tier = profile?.subscription;

  const filteredSpreads = ALL_SPREADS.filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSpreadSelect = (spread: Spread) => {
    if (!profile) {
      setNoProfileHint(spread.id);
      return;
    }
    if (tier === "decouverte" && spread.cardCount > 3) {
      // Redirect hint handled via overlay click — no state needed, Link used inline
      return;
    }
    setNoProfileHint(null);
    setSelectedSpread(spread);
    setStep("question");
  };

  // Called when user finishes shuffling → go to pick step
  const handleShuffleDone = useCallback(() => {
    setStep("pick");
  }, []);

  // Called when user picks their cards manually
  const handlePickDone = useCallback((pickedCards: DrawnCard[]) => {
    if (!selectedSpread || !profile) return;
    const currentTier = profile.subscription;
    if (!canUse("tirages", currentTier)) {
      setLimitReached(true);
    } else {
      setLimitReached(false);
    }
    setCards(pickedCards);
    setFlippedCards(new Set());
    setReading("");
    setStep("draw");
  }, [selectedSpread, profile]);

  const flipCard = (i: number) => setFlippedCards((p) => new Set([...p, i]));
  const flipAll = () => setFlippedCards(new Set(cards.map((_, i) => i)));
  const allFlipped = flippedCards.size === cards.length && cards.length > 0;

  const getLecture = async () => {
    if (!selectedSpread || !profile) return;

    const currentTier = profile.subscription;

    // Decouverte tier: show paywall instead of calling API
    if (currentTier === "decouverte") {
      setStep("reading");
      setReading("__PAYWALL_IA__");
      return;
    }

    // mystique / vip: full access, increment counter
    setIsStreaming(true);
    setReading("");
    setStep("reading");
    increment("tirages");

    const positions = selectedSpread.positions;
    const cardData = cards.map((c, i) => ({
      name: c.name, suit: c.suit, number: c.number,
      position: positions[i] || `Position ${i + 1}`,
      reversed: c.reversed, keywords: c.keywords,
    }));
    try {
      const res = await authFetch("/api/lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards: cardData,
          question,
          spreadType: selectedSpread.id,
          spreadName: selectedSpread.name,
          profile: {
            prenom: profile.prenom,
            nom: profile.nom,
            dateNaissance: profile.dateNaissance,
            heureNaissance: profile.heureNaissance,
            villeNaissance: profile.villeNaissance,
            genre: profile.genre,
            subscription: profile.subscription,
          },
          conjoint: showConjoint && conjointPrenom ? {
            prenom: conjointPrenom,
            dateNaissance: conjointDateNaissance,
            heureNaissance: conjointHeureNaissance,
            villeNaissance: conjointVille,
            lat: conjointLat,
            lon: conjointLon,
          } : undefined,
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
      addReading({ type: "tarot", title: selectedSpread.name, content: full, meta: { question } });
    } catch {
      setReading("Les astres sont momentanément voilés... Veuillez réessayer.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStep("choose");
    setCards([]);
    setFlippedCards(new Set());
    setReading("");
    setQuestion("");
    setSelectedSpread(null);
    setLimitReached(false);
    setNoProfileHint(null);
    setShuffledDeck([]);
    setConjointPrenom("");
    setConjointDateNaissance("");
    setConjointHeureNaissance("");
    setConjointVille("");
    setConjointLat(undefined);
    setConjointLon(undefined);
    setShowConjoint(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Step 1: Choose spread */}
      {step === "choose" && (
        <div className="fade-in-up">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CircleVideo size="md" glow />
            </div>
            <div className="badge-gold mb-5">
              <Layers size={11} className="inline mr-2" />
              Bibliothèque de tirages
            </div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">Tirage de Tarot</h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg">
              {ALL_SPREADS.length} tirages — choisissez celui qui résonne avec votre question
            </p>

            {/* Deck selector */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8a6f3a]">Jeu de cartes</span>
              <div className="flex border border-[rgba(212,175,111,0.25)] rounded-sm overflow-hidden">
                {(["rws", "marseille"] as DeckType[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => switchDeck(d)}
                    className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all ${
                      deck === d
                        ? "bg-[rgba(212,175,111,0.15)] text-[#e8c875] border-r border-[rgba(212,175,111,0.25)] last:border-r-0"
                        : "text-[#8a6f3a] hover:text-[#c9b88a] border-r border-[rgba(212,175,111,0.15)] last:border-r-0"
                    }`}
                  >
                    {d === "rws" ? "Rider-Waite" : "Marseille"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* No-profile banner */}
          {!profile && (
            <div className="luxe-card rounded-sm p-4 mb-8 max-w-xl mx-auto flex items-center gap-3">
              <Lock size={16} className="text-[#d4af6f] shrink-0" />
              <p className="text-[13px] text-[#c9b88a] font-serif-text italic flex-1">
                Inscrivez-vous pour accéder aux tirages personnalisés
              </p>
              <Link href="/mon-profil" className="btn-ghost !py-1.5 !px-3 !text-[11px] shrink-0">
                Créer mon profil
              </Link>
            </div>
          )}

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a6f3a]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un tirage..."
                className="luxe-input !pl-11"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-all border ${
                activeCategory === "all"
                  ? "bg-[rgba(212,175,111,0.12)] border-[#d4af6f] text-[#e8c875]"
                  : "border-[rgba(212,175,111,0.2)] text-[#c9b88a] hover:border-[rgba(212,175,111,0.4)]"
              }`}
            >
              Tous · {ALL_SPREADS.length}
            </button>
            {(Object.entries(SPREAD_CATEGORIES) as [SpreadCategory, typeof SPREAD_CATEGORIES[SpreadCategory]][]).map(([cat, data]) => {
              const Icon = CATEGORY_ICONS[cat];
              const count = ALL_SPREADS.filter(s => s.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-all flex items-center gap-2 border ${
                    activeCategory === cat
                      ? "bg-[rgba(212,175,111,0.12)] border-[#d4af6f] text-[#e8c875]"
                      : "border-[rgba(212,175,111,0.2)] text-[#c9b88a] hover:border-[rgba(212,175,111,0.4)]"
                  }`}
                >
                  <Icon size={12} />
                  <span>{data.label}</span>
                  <span className="opacity-60">· {count}</span>
                </button>
              );
            })}
          </div>

          {/* Spreads grid */}
          {filteredSpreads.length === 0 ? (
            <div className="text-center text-[#c9b88a] py-16 font-serif-text italic">
              Aucun tirage ne correspond à votre recherche
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSpreads.map((spread) => {
                const Icon = getSpreadIcon(spread.id, spread.category);
                const isPremiumLocked = tier === "decouverte" && spread.cardCount > 3;
                const isNoProfileHinted = noProfileHint === spread.id;

                return (
                  <div key={spread.id} className="flex flex-col">
                    <button
                      onClick={() => {
                        if (isPremiumLocked) return; // overlay handles this
                        handleSpreadSelect(spread);
                      }}
                      className={`luxe-card rounded-sm p-6 text-left group relative flex-1 ${
                        isPremiumLocked ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {spread.popular && !isPremiumLocked && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] tracking-[0.2em] uppercase text-[#d4af6f]">
                          <Star size={10} className="fill-[#d4af6f]" />
                          <span>Populaire</span>
                        </div>
                      )}

                      {isPremiumLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                          <Lock size={16} className="text-[#d4af6f]" />
                          <Link
                            href="/tarifs"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] underline underline-offset-2 hover:text-[#e8c875]"
                          >
                            Voir les offres
                          </Link>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-5">
                        <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.12)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center group-hover:border-[#d4af6f] transition-colors">
                          <Icon size={18} className="text-[#d4af6f]" />
                        </div>
                        <div className="flex flex-col items-end gap-1.5 mt-1">
                          <span className="badge-soft !text-[9px]">
                            {spread.cardCount} {spread.cardCount === 1 ? "carte" : "cartes"}
                          </span>
                          <span className="text-[9px] tracking-widest uppercase text-[#8a6f3a]">
                            {DIFFICULTY_LABELS[spread.difficulty]}
                          </span>
                          {isPremiumLocked && (
                            <span className="text-[9px] tracking-widest uppercase text-[#d4af6f] flex items-center gap-1">
                              <Crown size={9} />
                              Mystique
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-serif-display text-lg text-cream group-hover:text-[#e8c875] transition-colors mb-1.5">
                        {spread.name}
                      </h3>
                      <p className="text-[11px] tracking-wider text-[#d4af6f] uppercase mb-3">{spread.subtitle}</p>
                      <p className="text-[13px] text-[#c9b88a] leading-relaxed line-clamp-2">{spread.description}</p>
                    </button>

                    {/* No-profile inline hint */}
                    {isNoProfileHinted && (
                      <div className="luxe-card rounded-sm px-4 py-3 mt-1 flex items-center gap-2">
                        <Lock size={13} className="text-[#d4af6f] shrink-0" />
                        <p className="text-[12px] text-[#c9b88a] flex-1">
                          Créez d&apos;abord votre{" "}
                          <Link href="/mon-profil" className="text-[#d4af6f] underline underline-offset-2 hover:text-[#e8c875]">
                            profil gratuit
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Question */}
      {step === "question" && selectedSpread && (
        <div className="max-w-2xl mx-auto fade-in-up">
          <div className="text-center mb-10">
            {(() => {
              const Icon = getSpreadIcon(selectedSpread.id, selectedSpread.category);
              return (
                <div className="w-16 h-16 rounded-sm mx-auto mb-5 border border-[#d4af6f] flex items-center justify-center bg-[rgba(212,175,111,0.08)]">
                  <Icon size={24} className="text-[#d4af6f]" />
                </div>
              );
            })()}
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">{selectedSpread.subtitle}</div>
            <h2 className="font-serif-display text-4xl text-gradient-cream mb-3">{selectedSpread.name}</h2>
            <p className="text-[#c9b88a] text-[15px] mb-2">
              {selectedSpread.cardCount} {selectedSpread.cardCount === 1 ? "carte" : "cartes"} · {DIFFICULTY_LABELS[selectedSpread.difficulty]}
            </p>
            <p className="font-serif-text italic text-[#c9b88a] text-lg">{selectedSpread.description}</p>
          </div>

          <div className="luxe-card rounded-sm p-6 mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Positions du tirage</div>
            <div className="flex flex-wrap gap-2">
              {selectedSpread.positions.map((pos, i) => (
                <span key={i} className="badge-soft">
                  <span className="text-[#d4af6f] mr-1.5">{i + 1}.</span>
                  {pos}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="luxe-label">Votre question (optionnel)</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Concentrez votre intention avant de tirer..."
              rows={3}
              className="luxe-input resize-none"
            />
          </div>

          {tier !== "decouverte" && selectedSpread?.category === "amour" && (
            <div className="luxe-card rounded-sm p-6 mt-6">
              <button
                type="button"
                onClick={() => setShowConjoint(!showConjoint)}
                className="flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-[#c9b88a] hover:text-[#f5ecd9] transition-colors w-full"
              >
                <Heart size={14} className="text-[#d4af6f]" />
                <span>Ajouter les infos de votre conjoint(e)</span>
                <ChevronDown size={12} className={`ml-auto transition-transform ${showConjoint ? "rotate-180" : ""}`} />
              </button>

              {showConjoint && (
                <div className="mt-5 space-y-4 pt-4 border-t border-[rgba(212,175,111,0.12)]">
                  <p className="text-[11px] text-[#8a6f3a] tracking-wide font-serif-text italic">
                    Ces informations permettent à Madame Céleste d&apos;affiner la lecture amoureuse avec une analyse de compatibilité.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="luxe-label">Prénom du/de la conjoint(e)</label>
                      <input type="text" value={conjointPrenom} onChange={(e) => setConjointPrenom(e.target.value)} placeholder="Prénom" className="luxe-input" />
                    </div>
                    <div>
                      <label className="luxe-label flex items-center gap-1"><Calendar size={10} /> Date de naissance</label>
                      <input type="date" value={conjointDateNaissance} onChange={(e) => setConjointDateNaissance(e.target.value)} className="luxe-input" />
                    </div>
                    <div>
                      <label className="luxe-label flex items-center gap-1"><Clock size={10} /> Heure (optionnel)</label>
                      <input type="time" value={conjointHeureNaissance} onChange={(e) => setConjointHeureNaissance(e.target.value)} className="luxe-input" />
                    </div>
                    <div>
                      <label className="luxe-label flex items-center gap-1"><MapPin size={10} /> Ville de naissance</label>
                      <CityAutocomplete
                        value={conjointVille}
                        onChange={(city, lat, lon) => { setConjointVille(city); setConjointLat(lat); setConjointLon(lon); }}
                        placeholder="Ville, Pays"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap mt-8">
            <button onClick={() => setStep("choose")} className="btn-ghost">
              <ArrowLeft size={13} className="inline mr-2" />
              <span>Retour</span>
            </button>
            <button onClick={startShuffle} className="btn-gold">
              <Sparkles size={14} />
              <span>Mélanger les cartes</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Shuffle */}
      {step === "shuffle" && selectedSpread && (
        <div className="fade-in-up">
          <DeckShuffle
            spreadName={selectedSpread.name}
            onShuffleDone={handleShuffleDone}
          />
        </div>
      )}

      {/* Step 4: Pick */}
      {step === "pick" && selectedSpread && (
        <div className="fade-in-up">
          <DeckPick
            count={selectedSpread.cardCount}
            shuffledDeck={shuffledDeck}
            onPickDone={handlePickDone}
          />
        </div>
      )}

      {/* Step 5 & 6: Draw + Reading */}
      {(step === "draw" || step === "reading") && selectedSpread && (
        <div className="fade-in-up">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <CircleVideo size="sm" glow />
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">{selectedSpread.subtitle}</div>
            <h2 className="font-serif-display text-3xl text-gradient-cream mb-2">{selectedSpread.name}</h2>
            {question && <p className="font-serif-text italic text-[#c9b88a] mt-2">&ldquo;{question}&rdquo;</p>}
            {step === "draw" && !allFlipped && !limitReached && (
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">Cliquez sur chaque carte pour la révéler</p>
            )}
          </div>

          {/* Daily limit reached paywall */}
          {step === "draw" && limitReached && (
            <div className="max-w-md mx-auto mb-10">
              <div className="luxe-card rounded-sm p-8 text-center">
                <Crown size={32} className="text-[#d4af6f] mx-auto mb-4" />
                <h3 className="font-serif-display text-2xl text-gradient-cream mb-3">Limite quotidienne atteinte</h3>
                <p className="font-serif-text italic text-[#c9b88a] mb-6">
                  Les membres Mystique bénéficient de tirages illimités.
                </p>
                <Link href="/tarifs" className="btn-gold inline-flex items-center gap-2">
                  <Sparkles size={14} />
                  <span>Voir les offres</span>
                </Link>
              </div>
              <div className="text-center mt-4">
                <button onClick={reset} className="btn-ghost">
                  <ArrowLeft size={13} className="inline mr-2" />
                  <span>Retour aux tirages</span>
                </button>
              </div>
            </div>
          )}

          {!limitReached && (
            <>
              {/* Deck selector — visible while cards are shown */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8a6f3a]">Jeu de cartes</span>
                <div className="flex border border-[rgba(212,175,111,0.25)] rounded-sm overflow-hidden">
                  {(["rws", "marseille"] as DeckType[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => switchDeck(d)}
                      className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all ${
                        deck === d
                          ? "bg-[rgba(212,175,111,0.15)] text-[#e8c875] border-r border-[rgba(212,175,111,0.25)] last:border-r-0"
                          : "text-[#8a6f3a] hover:text-[#c9b88a] border-r border-[rgba(212,175,111,0.15)] last:border-r-0"
                      }`}
                    >
                      {d === "rws" ? "Rider-Waite" : "Marseille"}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`flex flex-wrap justify-center gap-5 md:gap-6 mb-10 ${selectedSpread.cardCount > 7 ? "max-w-6xl" : "max-w-4xl"} mx-auto`}>
                {cards.map((card, i) => (
                  <TarotCardComponent
                    key={card.id} card={card}
                    position={selectedSpread.positions[i] || `Position ${i + 1}`}
                    isFlipped={flippedCards.has(i)}
                    onClick={() => !flippedCards.has(i) && flipCard(i)}
                    index={i}
                    deck={deck}
                  />
                ))}
              </div>

              {step === "draw" && (
                <div className="flex gap-3 justify-center flex-wrap">
                  {!allFlipped && (
                    <button onClick={flipAll} className="btn-outline-gold">
                      <span>Révéler toutes les cartes</span>
                    </button>
                  )}
                  {allFlipped && (
                    <button onClick={getLecture} className="btn-gold">
                      <Sparkles size={14} />
                      <span>Obtenir ma lecture</span>
                    </button>
                  )}
                  <button onClick={reset} className="btn-ghost">
                    <RotateCcw size={13} className="inline mr-2" />
                    <span>Recommencer</span>
                  </button>
                </div>
              )}

              {/* IA Paywall for decouverte tier */}
              {step === "reading" && reading === "__PAYWALL_IA__" && (
                <div className="max-w-md mx-auto mt-10">
                  <div className="luxe-card rounded-sm p-8 text-center">
                    <Crown size={32} className="text-[#d4af6f] mx-auto mb-4" />
                    <h3 className="font-serif-display text-2xl text-gradient-cream mb-3">
                      Interprétation IA réservée aux membres Mystique
                    </h3>
                    <p className="font-serif-text italic text-[#c9b88a] mb-6">
                      Accédez à des lectures personnalisées et approfondies en rejoignant l&apos;offre Mystique.
                    </p>
                    <Link href="/tarifs" className="btn-gold inline-flex items-center gap-2">
                      <Sparkles size={14} />
                      <span>Voir les offres</span>
                    </Link>
                  </div>
                  <div className="text-center mt-4">
                    <button onClick={reset} className="btn-ghost">
                      <RotateCcw size={13} className="inline mr-2" />
                      <span>Nouveau tirage</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Normal reading result */}
              {!(step === "reading" && reading === "__PAYWALL_IA__") && (
                <ReadingResult text={reading} isStreaming={isStreaming} />
              )}

              {step === "reading" && !isStreaming && reading && reading !== "__PAYWALL_IA__" && (
                <div className="text-center mt-8">
                  <button onClick={reset} className="btn-outline-gold">
                    <RotateCcw size={13} className="inline mr-2" />
                    <span>Nouveau tirage</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
