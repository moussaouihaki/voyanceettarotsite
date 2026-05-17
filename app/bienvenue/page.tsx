"use client";

import Link from "next/link";
import CircleVideo from "@/components/CircleVideo";
import {
  Sparkles,
  Moon,
  Sun,
  Star,
  Crown,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Star,
    title: "Tarot",
    badge: "55+ tirages",
    desc: "Du tirage oui/non à la croix celtique 10 cartes — chaque spread révèle une facette unique de votre destin.",
  },
  {
    icon: Sun,
    title: "Horoscope",
    badge: "12 signes",
    desc: "Votre horoscope quotidien, hebdomadaire et mensuel rédigé selon la position réelle des astres le jour de votre naissance.",
  },
  {
    icon: Moon,
    title: "Thème Astral",
    badge: "Complet",
    desc: "Soleil, Lune, Ascendant et dix planètes : votre carte du ciel personnalisée déchiffrée avec une précision rare.",
  },
  {
    icon: Sparkles,
    title: "Carte du Jour",
    badge: "Quotidienne",
    desc: "Une carte tirée chaque matin à l'aube pour orienter votre journée — un rituel sacré accessible en un instant.",
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

const DECOUVERTE_ITEMS = [
  "Carte du Jour — tirée chaque matin",
  "Horoscope quotidien pour votre signe",
  "3 tirages de tarot par jour",
  "Accès au profil astral simplifié",
];

const MYSTIQUE_ITEMS = [
  "Tirages illimités, tous les spreads",
  "Thème astral natal complet",
  "Numérologie et chemin de vie",
  "Historique de toutes vos lectures",
  "Voyance libre avec Madame Céleste",
];

export default function BienvenueePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-[#d4af6f] opacity-40 float-anim" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-[#e8c875] opacity-50 float-slow" />
        <div className="absolute top-1/3 left-1/4 w-1 h-1 rounded-full bg-[#d4af6f] opacity-60" />

        <div className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
          <div className="flex justify-center mb-10 fade-in">
            <CircleVideo size="lg" glow />
          </div>

          <div className="badge-gold mb-6 fade-in-up-delay-1">
            <span>✦ Bienvenue chez Madame Céleste ✦</span>
          </div>

          <h1 className="font-serif-display text-5xl md:text-7xl font-semibold leading-[1.1] mb-6 fade-in-up-delay-2">
            <span className="text-gradient-cream">Bienvenue dans</span>
            <br />
            <span className="text-shimmer-gold">le Sanctuaire</span>
          </h1>

          <p className="font-serif-text italic text-xl md:text-2xl text-[#c9b88a] mb-4 fade-in-up-delay-2">
            Les astres vous attendaient. Votre chemin commence ici.
          </p>

          <div className="divider-ornament max-w-md mx-auto my-8 fade-in-up-delay-3">
            <span>✦</span>
          </div>

          <p className="text-[#c9b88a] max-w-2xl mx-auto text-[15px] leading-relaxed mb-12 fade-in-up-delay-3">
            Tarot, astrologie, numérologie, thème astral complet et carte du jour —
            chaque lecture est tissée autour de votre essence unique.
            Votre guidance personnalisée commence gratuitement, dès maintenant.
          </p>

          <div className="flex flex-wrap gap-4 justify-center fade-in-up-delay-4">
            <Link href="/mon-profil" className="btn-gold">
              <Sparkles size={14} />
              <span>Commencer gratuitement</span>
            </Link>
            <Link href="/tirage" className="btn-outline-gold">
              <Star size={14} />
              <span>Voir le tarot</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="divider-ornament max-w-sm mx-auto mb-6">
            <span>Univers</span>
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl mb-4 text-gradient-cream">
            Ce qui vous attend
          </h2>
          <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-xl mx-auto">
            Quatre portes vers la connaissance de soi, ouvertes pour vous.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="luxe-card rounded-sm p-7 flex flex-col">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.15)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center">
                    <Icon size={20} className="text-[#d4af6f]" />
                  </div>
                  <span className="badge-soft">{feat.badge}</span>
                </div>
                <h3 className="font-serif-display text-xl text-cream mb-3">{feat.title}</h3>
                <p className="text-[13px] text-[#c9b88a] leading-relaxed flex-1">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="divider-ornament max-w-sm mx-auto mb-6">
            <span>Accès</span>
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl mb-4 text-gradient-cream">
            C&apos;est gratuit
          </h2>
          <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-xl mx-auto">
            Commencez sans carte bancaire. Évoluez à votre rythme.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="luxe-card rounded-sm p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-1">Gratuit</div>
                <h3 className="font-serif-display text-2xl text-cream">Découverte</h3>
              </div>
              <div className="badge-gold">Gratuit</div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {DECOUVERTE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-[#c9b88a]">
                  <CheckCircle2 size={16} className="text-[#d4af6f] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/mon-profil" className="btn-outline-gold w-full text-center">
              <span>Créer mon compte</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="luxe-card-premium rounded-sm p-8 flex flex-col relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(212,175,111,0.1),transparent_70%)] pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-1">Premium</div>
                <h3 className="font-serif-display text-2xl text-cream">Mystique</h3>
              </div>
              <div className="badge-premium">VIP</div>
            </div>

            <ul className="space-y-3 mb-8 flex-1 relative">
              {MYSTIQUE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-[#c9b88a]">
                  <Crown size={16} className="text-[#d4af6f] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/tarifs" className="btn-gold w-full text-center relative">
              <Crown size={14} />
              <span>Découvrir les formules</span>
            </Link>
          </div>
        </div>
      </section>

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
              <div className="text-[11px] text-[#8a6f3a] mt-1">
                {t.sign} · {t.city}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="luxe-card-premium rounded-sm p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(212,175,111,0.12),transparent_70%)] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(74,14,46,0.3),transparent_70%)] pointer-events-none" />

          <div className="relative">
            <div className="flex justify-center mb-8">
              <CircleVideo size="sm" glow />
            </div>

            <div className="badge-gold mb-6 inline-block">✦ Votre voyage commence ici ✦</div>

            <h2 className="font-serif-display text-4xl md:text-6xl mb-5 text-gradient-cream leading-tight">
              Le sanctuaire<br />
              <span className="font-serif-text italic font-normal text-[#d4af6f]">vous attend</span>
            </h2>

            <p className="font-serif-text italic text-[#c9b88a] text-xl mb-4 max-w-2xl mx-auto">
              Les étoiles ont aligné votre chemin jusqu'ici.
              Laissez Madame Céleste éclairer la suite.
            </p>

            <p className="text-[#c9b88a] text-[14px] mb-10 max-w-xl mx-auto leading-relaxed">
              Créez votre profil en 30 secondes — sans carte bancaire.
              Votre première carte du jour vous attend dès ce soir.
            </p>

            <Link href="/mon-profil" className="btn-gold text-base px-10 py-4">
              <Sparkles size={16} />
              <span>Créer mon profil gratuit</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
