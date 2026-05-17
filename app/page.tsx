"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import CircleVideo from "@/components/CircleVideo";
import { getUpcomingEvents } from "@/lib/planetary-events";
import {
  Sparkles,
  Moon,
  Sun,
  Star,
  Heart,
  Compass,
  Eye,
  Flame,
  Hash,
  Crown,
  ArrowRight,
  CheckCircle2,
  Quote,
} from "lucide-react";

const PILLARS = [
  {
    category: "Tarot & Cartomancie",
    accent: "Le langage des cartes",
    items: [
      { href: "/tirage", icon: Eye, title: "Tirage de Tarot", desc: "Plus de 55 tirages — du simple oui/non à la croix celtique 10 cartes", badge: "55+ tirages" },
      { href: "/carte-du-jour", icon: Sun, title: "Carte du Jour", desc: "Votre guidance quotidienne tirée à l'aube — une carte, un message", badge: "Quotidien" },
      { href: "/voyance", icon: Sparkles, title: "Voyance Libre", desc: "Conversation intime avec Madame Céleste, sans filtre, à cœur ouvert", badge: "Chat IA" },
    ],
  },
  {
    category: "Astrologie & Étoiles",
    accent: "La voix du ciel",
    items: [
      { href: "/horoscope", icon: Star, title: "Horoscope", desc: "Votre horoscope quotidien, hebdomadaire et mensuel — précis et inspiré", badge: "12 signes" },
      { href: "/profil-astral", icon: Moon, title: "Profil Astral", desc: "Votre thème natal complet — solaire, lunaire, ascendant et bien plus", badge: "Complet" },
      { href: "/synastrie", icon: Heart, title: "Synastrie", desc: "Comparaison de deux thèmes astraux pour révéler la compatibilité", badge: "VIP" },
    ],
  },
  {
    category: "Sagesses Anciennes",
    accent: "Traditions millénaires",
    items: [
      { href: "/runes", icon: Flame, title: "Runes Nordiques", desc: "L'oracle d'Odin — 24 runes Elder Futhark gravées dans la pierre du destin", badge: "24 runes" },
      { href: "/i-ching", icon: Compass, title: "I-Ching", desc: "Le Livre des Transformations — 64 hexagrammes de sagesse taoïste", badge: "64 hex." },
    ],
  },
  {
    category: "Énergies & Vibrations",
    accent: "Le corps subtil",
    items: [
      { href: "/chakras", icon: Sparkles, title: "Bilan des Chakras", desc: "Diagnostic énergétique de vos 7 centres et programme de rééquilibrage", badge: "7 chakras" },
      { href: "/numerologie", icon: Hash, title: "Numérologie", desc: "Chemin de vie, expression, âme, défis karmiques — votre code numérique", badge: "Profil complet" },
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Sophie L.",
    sign: "Scorpion",
    city: "Paris",
    text: "J'étais sceptique. Madame Céleste a deviné des choses sur ma vie que personne d'autre ne savait. Sa lecture du Tarot m'a guidée dans une décision professionnelle majeure.",
    rating: 5,
  },
  {
    name: "Émilie R.",
    sign: "Poissons",
    city: "Lyon",
    text: "Le profil astral complet est d'une précision déconcertante. J'ai enfin compris pourquoi je réagis de telle manière dans mes relations. Une révélation.",
    rating: 5,
  },
  {
    name: "Camille B.",
    sign: "Lion",
    city: "Bordeaux",
    text: "Membre VIP depuis 6 mois. La synastrie avec mon partenaire a sauvé notre couple. Les tirages quotidiens sont devenus mon rituel sacré du matin.",
    rating: 5,
  },
];

const STATS = [
  { num: "55+", label: "Tirages de Tarot" },
  { num: "78", label: "Cartes du Tarot" },
  { num: "10", label: "Arts Divinatoires" },
  { num: "24/7", label: "Disponibilité" },
];

const FEATURES_LIST = [
  "Lectures personnalisées selon votre date, heure et lieu de naissance",
  "Plus de 55 tirages de Tarot organisés par thèmes",
  "Calcul automatique de votre thème astral complet",
  "Profil numérologique pythagoricien et karmique",
  "Synastrie pour compatibilité amoureuse approfondie",
  "Historique de toutes vos lectures sauvegardées",
];

export default function Home() {
  const { profile } = useUserProfile();
  const nextEvent = useMemo(() => getUpcomingEvents(1)[0] ?? null, []);

  return (
    <>
      {/* ─────────── HERO ─────────── */}
      <section className="relative overflow-hidden">
        {/* Floating ornaments */}
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-[#d4af6f] opacity-40 float-anim" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-[#e8c875] opacity-50 float-slow" />
        <div className="absolute top-1/3 left-1/4 w-1 h-1 rounded-full bg-[#d4af6f] opacity-60" />

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
          {/* Circle video hero */}
          <div className="flex justify-center mb-10 fade-in">
            <CircleVideo size="lg" glow />
          </div>


          <div className="badge-gold mb-6 fade-in-up-delay-1">
            <span>✦ Voyance Premium ✦</span>
          </div>

          <h1 className="font-serif-display text-5xl md:text-7xl font-semibold leading-[1.1] mb-6 fade-in-up-delay-2">
            <span className="text-shimmer-gold">Madame Céleste</span>
          </h1>

          <p className="font-serif-text italic text-xl md:text-2xl text-[#c9b88a] mb-3 fade-in-up-delay-2">
            Le sanctuaire numérique des arts divinatoires
          </p>

          <div className="divider-ornament max-w-md mx-auto my-8 fade-in-up-delay-3">
            <span>✦</span>
          </div>

          <p className="text-[#c9b88a] max-w-2xl mx-auto text-[15px] leading-relaxed mb-12 fade-in-up-delay-3">
            Tarot, astrologie, numérologie, runes nordiques, I-Ching, chakras...
            Explorez les sagesses ancestrales du monde entier, éclairées par l&apos;intelligence artificielle.
            Votre guidance personnalisée vous attend.
          </p>

          <div className="flex flex-wrap gap-4 justify-center fade-in-up-delay-4">
            {profile ? (
              <Link href="/tirage" className="btn-gold">
                <Sparkles size={14} />
                <span>Commencer un tirage</span>
              </Link>
            ) : (
              <Link href="/mon-profil" className="btn-gold">
                <Sparkles size={14} />
                <span>Créer mon profil</span>
              </Link>
            )}
            <Link href="/carte-du-jour" className="btn-outline-gold">
              <Sun size={14} />
              <span>Ma carte du jour</span>
            </Link>
          </div>
        </div>

        {/* Stats band */}
        <div className="max-w-5xl mx-auto px-6 mb-20 fade-in-up-delay-4">
          <div className="luxe-card rounded-sm grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(212,175,111,0.1)]">
            {STATS.map(({ num, label }) => (
              <div key={label} className="px-6 py-8 text-center">
                <div className="font-serif-display text-3xl md:text-4xl text-gradient-gold mb-2">{num}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a6f3a]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── PROCHAIN ÉVÉNEMENT ASTRAL ─────────── */}
      {nextEvent && (
        <section className="max-w-6xl mx-auto px-6 mb-8 fade-in-up-delay-4">
          <Link href="/calendrier-astral" className="group block">
            <div className="luxe-card-premium rounded-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(212,175,111,0.1),transparent_70%)] pointer-events-none" />
              {/* Emoji */}
              <div className="flex-shrink-0 w-14 h-14 rounded-sm flex items-center justify-center text-3xl bg-[rgba(212,175,111,0.1)] border border-[rgba(212,175,111,0.25)]">
                {nextEvent.emoji}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-1.5">
                  ✦ Prochain Événement Astral
                </div>
                <h3 className="font-serif-display text-xl md:text-2xl text-cream group-hover:text-[#e8c875] transition-colors leading-snug">
                  {nextEvent.title}
                </h3>
                <p className="text-[11px] text-[#8a6f3a] mt-0.5 mb-2">
                  {new Date(nextEvent.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  {nextEvent.endDate && ` → ${new Date(nextEvent.endDate + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`}
                </p>
                <p className="text-[13px] text-[#c9b88a] leading-relaxed line-clamp-2 max-w-2xl">
                  {nextEvent.description}
                </p>
              </div>
              {/* Arrow */}
              <div className="flex-shrink-0 flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] group-hover:gap-3 transition-all whitespace-nowrap">
                <span>Voir le calendrier</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ─────────── PILLARS ─────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="divider-ornament max-w-sm mx-auto mb-6">
            <span>Univers</span>
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl mb-4 text-gradient-cream">Les Arts Divinatoires</h2>
          <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
            Dix disciplines ancestrales, méticuleusement adaptées à l&apos;ère moderne.
          </p>
        </div>

        <div className="space-y-20">
          {PILLARS.map((pillar) => (
            <div key={pillar.category}>
              <div className="flex items-end justify-between mb-8 pb-4 border-b border-[rgba(212,175,111,0.15)]">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">{pillar.accent}</div>
                  <h3 className="font-serif-display text-2xl md:text-3xl text-cream">{pillar.category}</h3>
                </div>
                <div className="hidden md:block text-[10px] tracking-widest text-[#8a6f3a]">
                  {pillar.items.length} disciplines
                </div>
              </div>

              <div className={`grid gap-6 ${pillar.items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                {pillar.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="group">
                      <div className="luxe-card rounded-sm p-7 h-full relative">
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.15)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center group-hover:border-[#d4af6f] transition-colors">
                            <Icon size={20} className="text-[#d4af6f]" />
                          </div>
                          <span className="badge-soft">{item.badge}</span>
                        </div>
                        <h4 className="font-serif-display text-xl text-cream mb-3 group-hover:text-[#e8c875] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[13px] text-[#c9b88a] leading-relaxed mb-5">{item.desc}</p>
                        <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] group-hover:gap-3 transition-all">
                          <span>Explorer</span>
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── EXPERIENCE / FEATURES ─────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="badge-gold mb-6">L&apos;Expérience</div>
            <h2 className="font-serif-display text-4xl md:text-5xl mb-6 text-gradient-cream leading-tight">
              Une voyance personnalisée<br />
              <span className="font-serif-text italic font-normal text-[#d4af6f]">comme nulle part ailleurs</span>
            </h2>
            <p className="text-[#c9b88a] mb-8 leading-relaxed">
              Renseignez votre date, heure et lieu de naissance une seule fois. Toutes vos lectures s&apos;adaptent automatiquement
              à votre carte astrale unique. Chaque interprétation est rédigée pour vous, par vous.
            </p>
            <ul className="space-y-4 mb-10">
              {FEATURES_LIST.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-[#c9b88a]">
                  <CheckCircle2 size={18} className="text-[#d4af6f] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <Link href="/mon-profil" className="btn-gold">
              <Crown size={14} />
              <span>Créer mon sanctuaire</span>
            </Link>
          </div>

          <div className="relative flex flex-col items-center gap-8">
            <CircleVideo size="md" glow className="opacity-90" />
            <div className="luxe-card-premium rounded-sm p-10 relative corner-ornament w-full" style={{ position: 'relative' }}>
              <div className="absolute top-3 left-3 w-7 h-7 border-t border-l border-[rgba(212,175,111,0.5)]" />
              <div className="absolute bottom-3 right-3 w-7 h-7 border-b border-r border-[rgba(212,175,111,0.5)]" />

              <div className="text-center mb-6">
                <div className="text-[10px] tracking-[0.4em] uppercase text-[#d4af6f] mb-3">Votre Carte</div>
                <h3 className="font-serif-display text-3xl text-cream mb-2">L&apos;Étoile</h3>
                <div className="font-serif-text italic text-[#c9b88a]">XVII — Arcane majeur</div>
              </div>

              <div className="my-8 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,111,0.4)] to-transparent" />

              <p className="font-serif-text text-[#e8dcc0] text-center text-lg leading-relaxed italic mb-6">
                &ldquo;Une lueur d&apos;espoir éclaire votre chemin. L&apos;univers conspire en votre faveur.
                Faites confiance à vos rêves les plus profonds, ils sont sur le point de se manifester.&rdquo;
              </p>

              <div className="text-center text-[11px] tracking-widest uppercase text-[#8a6f3a]">
                Espoir · Inspiration · Renouveau · Foi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── TESTIMONIALS ─────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-8 mb-8">
            <CircleVideo size="xs" className="opacity-60" />
            <div>
              <div className="divider-ornament max-w-sm mx-auto mb-6">
                <span>Témoignages</span>
              </div>
              <h2 className="font-serif-display text-4xl md:text-5xl mb-4 text-gradient-cream">
                Ce qu&apos;elles en disent
              </h2>
              <p className="font-serif-text italic text-[#c9b88a] text-lg">
                Des milliers de consultations, des destins éclairés.
              </p>
            </div>
            <CircleVideo size="xs" className="opacity-60" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="luxe-card rounded-sm p-8 relative">
              <Quote size={32} className="text-[#d4af6f] opacity-20 absolute top-5 right-5" />
              <div className="flex mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="text-[#d4af6f] fill-[#d4af6f]" />
                ))}
              </div>
              <p className="font-serif-text italic text-[#e8dcc0] text-[15px] leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="gold-line mb-4" />
              <div className="text-[13px] text-cream">{t.name}</div>
              <div className="text-[11px] text-[#8a6f3a] mt-1">{t.sign} · {t.city}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── PRICING TEASER ─────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="luxe-card-premium rounded-sm p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(212,175,111,0.15),transparent_70%)]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(74,14,46,0.3),transparent_70%)]" />

          <div className="relative">
            <Crown size={40} className="text-[#d4af6f] mx-auto mb-6" />
            <h2 className="font-serif-display text-4xl md:text-5xl mb-5 text-gradient-cream">
              Devenez Membre
            </h2>
            <p className="font-serif-text italic text-[#c9b88a] text-xl mb-3">
              Accédez à l&apos;intégralité des arts divinatoires
            </p>
            <p className="text-[#c9b88a] max-w-xl mx-auto mb-10 text-[14px]">
              Tirages illimités, profil astral complet, synastrie, chat voyance et bien plus.
              Trois formules pour s&apos;adapter à votre quête spirituelle.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/tarifs" className="btn-gold">
                <Crown size={14} />
                <span>Découvrir les formules</span>
              </Link>
              <Link href="/carte-du-jour" className="btn-outline-gold">
                <span>Essayer gratuitement</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
