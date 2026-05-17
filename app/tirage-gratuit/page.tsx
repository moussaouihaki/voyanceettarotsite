"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Star,
  Eye,
  Moon,
  ArrowRight,
  Heart,
  Sun,
  HelpCircle,
  ChevronDown,
  Layers,
} from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Layers,
    title: "Choisissez votre tirage",
    desc: "Sélectionnez parmi nos tirages gratuits : une carte, croix celtique, amour, oui ou non, et bien d'autres spreads adaptés à chaque question.",
  },
  {
    num: "02",
    icon: Moon,
    title: "Concentrez votre intention",
    desc: "Prenez quelques secondes pour formuler clairement votre question ou votre intention. Les cartes répondent à la profondeur de votre engagement.",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Recevez votre lecture",
    desc: "Madame Céleste interprète chaque carte tirée et vous offre un message personnalisé, précis et bienveillant, en quelques instants.",
  },
];

const TIRAGES = [
  {
    icon: Star,
    title: "Tirage 1 Carte",
    desc: "Une guidance rapide et claire pour illuminer votre journée ou une décision immédiate.",
    href: "/tirage",
    badge: "Guidance rapide",
  },
  {
    icon: Layers,
    title: "Croix Celtique",
    desc: "Le tirage complet en 10 cartes — passé, présent, futur, obstacles et résultat final.",
    href: "/tirage",
    badge: "10 cartes",
  },
  {
    icon: Heart,
    title: "Tirage Amour",
    desc: "Éclairez vos relations sentimentales, votre compatibilité et le chemin de votre cœur.",
    href: "/tirage",
    badge: "Relations",
  },
  {
    icon: HelpCircle,
    title: "Oui ou Non",
    desc: "Posez votre question et obtenez une réponse directe et immédiate par les cartes.",
    href: "/oui-non",
    badge: "Réponse directe",
  },
  {
    icon: Sun,
    title: "Carte du Jour",
    desc: "Votre oracle quotidien — une carte tirée à l'aube pour guider chaque nouvelle journée.",
    href: "/carte-du-jour",
    badge: "Quotidien",
  },
  {
    icon: Eye,
    title: "Tirage 3 Cartes",
    desc: "Explorez votre passé, comprenez votre présent et envisagez votre futur avec clarté.",
    href: "/tirage",
    badge: "Passé · Présent · Futur",
  },
];

const FAQ = [
  {
    q: "Le tirage de tarot gratuit est-il fiable ?",
    a: "Oui. Chaque tirage repose sur un algorithme de mélange aléatoire certifié, identique à celui utilisé dans la divination traditionnelle. L'interprétation est ensuite assurée par Madame Céleste, notre intelligence artificielle entraînée sur les corpus symboliques du tarot de Marseille et du Rider-Waite. La fiabilité ne dépend pas du prix, mais de la qualité de votre question et de votre ouverture.",
  },
  {
    q: "Combien de tirages gratuits puis-je faire ?",
    a: "Les tirages de base — carte du jour, tirage oui/non, tirage 1 carte — sont entièrement gratuits et sans limite. Pour accéder aux tirages avancés comme la croix celtique complète ou le tirage amour approfondi, une inscription gratuite ou un abonnement premium est nécessaire. Vous pouvez consulter nos formules pour en savoir plus.",
  },
  {
    q: "Quelle est la différence entre le tarot et l'oracle ?",
    a: "Le tarot est un système codifié composé de 78 cartes réparties en 22 arcanes majeurs et 56 arcanes mineurs, organisés selon une structure symbolique précise héritée de la tradition ésotérique européenne. L'oracle est une appellation plus générale désignant tout outil divinatoire à jeu de cartes dont la structure est libre — chaque oracle a ses propres règles et symboles. Madame Céleste travaille principalement avec le tarot de Marseille et le Rider-Waite Smith.",
  },
  {
    q: "Comment fonctionne l'IA de Madame Céleste ?",
    a: "Madame Céleste est une intelligence artificielle développée spécifiquement pour les arts divinatoires. Elle analyse la combinaison des cartes tirées, leur position dans le spread, leur orientation (droite ou renversée) et le contexte de votre question pour générer une interprétation cohérente et personnalisée. Elle ne prédit pas l'avenir de manière déterministe, mais offre des pistes de réflexion et d'intuition pour vous aider à prendre des décisions éclairées.",
  },
];

export default function TirageGratuitPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="fade-in-up">

      <section className="relative overflow-hidden">
        <div className="absolute top-16 left-8 w-2 h-2 rounded-full bg-[#d4af6f] opacity-40 float-anim" />
        <div className="absolute top-32 right-16 w-1.5 h-1.5 rounded-full bg-[#e8c875] opacity-50 float-slow" />
        <div className="absolute top-1/2 left-1/3 w-1 h-1 rounded-full bg-[#d4af6f] opacity-60" />

        <div className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
          <div className="badge-gold mb-6">
            <Sparkles size={11} className="inline mr-2" />
            Tarot Gratuit en Ligne
          </div>

          <h1 className="font-serif-display text-5xl md:text-7xl font-semibold leading-[1.1] mb-5 text-gradient-cream">
            Tirage de Tarot Gratuit
          </h1>

          <h2 className="font-serif-text italic text-xl md:text-2xl text-[#c9b88a] mb-6">
            Interprété par Madame Céleste — Intelligence Artificielle
          </h2>

          <p className="text-[#c9b88a] max-w-2xl mx-auto text-[15px] leading-relaxed mb-12">
            Disponible 24h/24, 7j/7, Madame Céleste vous offre des tirages de tarot gratuits interprétés instantanément.
            Posez vos questions à toute heure du jour ou de la nuit, sans attente et sans inscription.
          </p>

          <Link href="/tirage" className="btn-gold">
            <Sparkles size={14} />
            <span>Tirer mes cartes maintenant</span>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="divider-ornament max-w-xs mx-auto mb-6">
            <span>Méthode</span>
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl mb-4 text-gradient-cream">
            Comment ça fonctionne
          </h2>
          <p className="font-serif-text italic text-[#c9b88a] text-lg">
            Trois étapes simples pour recevoir votre guidance divinatoire.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="luxe-card rounded-sm p-8 relative">
                <div className="font-serif-display text-6xl font-semibold text-gradient-gold opacity-20 absolute top-5 right-6 leading-none select-none">
                  {step.num}
                </div>
                <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.15)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center mb-6">
                  <Icon size={20} className="text-[#d4af6f]" />
                </div>
                <h3 className="font-serif-display text-xl text-cream mb-3">
                  {step.title}
                </h3>
                <p className="text-[13px] text-[#c9b88a] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="divider-ornament max-w-xs mx-auto mb-6">
            <span>Nos Tirages</span>
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl mb-4 text-gradient-cream">
            Nos tirages gratuits
          </h2>
          <p className="font-serif-text italic text-[#c9b88a] text-lg">
            Six spreads pour explorer toutes vos questions de vie.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIRAGES.map((tirage) => {
            const Icon = tirage.icon;
            return (
              <Link key={tirage.title} href={tirage.href} className="group">
                <div className="luxe-card rounded-sm p-7 h-full relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[rgba(212,175,111,0.15)] to-transparent border border-[rgba(212,175,111,0.3)] flex items-center justify-center group-hover:border-[#d4af6f] transition-colors">
                      <Icon size={20} className="text-[#d4af6f]" />
                    </div>
                    <span className="badge-gold text-[10px]">{tirage.badge}</span>
                  </div>
                  <h3 className="font-serif-display text-xl text-cream mb-3 group-hover:text-[#e8c875] transition-colors">
                    {tirage.title}
                  </h3>
                  <p className="text-[13px] text-[#c9b88a] leading-relaxed mb-5">
                    {tirage.desc}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] group-hover:gap-3 transition-all">
                    <span>Commencer</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="divider-ornament max-w-xs mx-auto mb-6">
            <span>FAQ</span>
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl mb-4 text-gradient-cream">
            Questions fréquentes
          </h2>
          <p className="font-serif-text italic text-[#c9b88a] text-lg">
            Tout ce que vous devez savoir sur le tirage de tarot gratuit.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <div key={i} className="luxe-card rounded-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-7 py-5 text-left gap-4"
                aria-expanded={openFaq === i}
              >
                <h3 className="font-serif-display text-lg text-cream group-hover:text-[#e8c875]">
                  {item.q}
                </h3>
                <ChevronDown
                  size={16}
                  className="text-[#d4af6f] flex-shrink-0 transition-transform duration-300"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {openFaq === i && (
                <div className="px-7 pb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,111,0.2)] to-transparent mb-5" />
                  <p className="text-[14px] text-[#c9b88a] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="luxe-card-premium rounded-sm p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(212,175,111,0.15),transparent_70%)]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(74,14,46,0.3),transparent_70%)]" />

          <div className="relative">
            <div className="badge-gold mb-6 inline-flex">
              <Moon size={11} className="inline mr-2" />
              Tirage gratuit · Sans inscription
            </div>

            <h2 className="font-serif-display text-4xl md:text-5xl mb-5 text-gradient-cream">
              Prêt pour votre lecture ?
            </h2>
            <p className="font-serif-text italic text-[#c9b88a] text-xl mb-3">
              Les cartes vous attendent
            </p>
            <p className="text-[#c9b88a] max-w-xl mx-auto mb-10 text-[14px]">
              Madame Céleste est disponible à toute heure pour interpréter vos cartes et éclairer votre chemin.
              Votre tirage de tarot gratuit ne prend que quelques instants.
            </p>

            <Link href="/tirage" className="btn-gold">
              <Sparkles size={14} />
              <span>Commencer votre tirage gratuit</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
