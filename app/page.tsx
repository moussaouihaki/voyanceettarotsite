"use client";

import Link from "next/link";

const FEATURES = [
  {
    category: "Tarot & Oracles",
    emoji: "🃏",
    items: [
      { href: "/tirage", emoji: "🃏", title: "Tirage de Tarot", desc: "55 tirages • du simple 1 carte aux complexes à 15 cartes", badge: "55 tirages" },
      { href: "/carte-du-jour", emoji: "🌅", title: "Carte du Jour", desc: "Une carte unique vous guide chaque jour", badge: "Quotidien" },
      { href: "/voyance", emoji: "🔮", title: "Voyance Libre", desc: "Conversation directe avec Madame Céleste", badge: "Chat IA" },
    ],
  },
  {
    category: "Astrologie",
    emoji: "⭐",
    items: [
      { href: "/horoscope", emoji: "⭐", title: "Horoscope", desc: "Votre horoscope du jour, de la semaine ou du mois", badge: "12 signes" },
      { href: "/profil-astral", emoji: "♈", title: "Profil Astral", desc: "Thème natal complet • solaire, lunaire, ascendant", badge: "Complet" },
    ],
  },
  {
    category: "Traditions Ancestrales",
    emoji: "🌍",
    items: [
      { href: "/runes", emoji: "ᚠ", title: "Runes Nordiques", desc: "Elder Futhark • 24 runes de la tradition vikingue", badge: "24 runes" },
      { href: "/i-ching", emoji: "☯️", title: "I-Ching", desc: "Le Livre des Transformations • 64 hexagrammes", badge: "64 hex." },
    ],
  },
  {
    category: "Énergies & Vibrations",
    emoji: "🌈",
    items: [
      { href: "/chakras", emoji: "🌈", title: "Bilan des Chakras", desc: "Évaluez et équilibrez vos 7 centres d'énergie", badge: "7 chakras" },
      { href: "/numerologie", emoji: "🔢", title: "Numérologie", desc: "Chemin de vie, expression, âme & influences", badge: "Profil complet" },
    ],
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16 fade-in-up">
        <div className="text-6xl mb-6 float-anim">🌙</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          <span className="shimmer-text">Madame Céleste</span>
        </h1>
        <p className="text-xl md:text-2xl text-purple-300 font-cinzel mb-4">
          Voyance & Arts Divinatoires par IA
        </p>
        <p className="text-purple-400/70 max-w-2xl mx-auto text-sm md:text-base mb-8">
          Tarot, Astrologie, Numérologie, Runes, I-Ching, Chakras... Explorez les arts divinatoires du monde entier, éclairés par l'intelligence artificielle.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/tirage" className="gradient-btn glow-btn px-8 py-4 rounded-xl text-white font-semibold text-lg">
            🃏 Commencer un tirage
          </Link>
          <Link href="/voyance" className="px-8 py-4 rounded-xl border border-purple-600/50 text-purple-200 hover:bg-purple-900/30 transition-all font-semibold text-lg">
            🔮 Consulter Madame Céleste
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 fade-in-up-delay-2">
        {[
          { num: "55+", label: "Tirages de Tarot" },
          { num: "78", label: "Cartes du Tarot" },
          { num: "64", label: "Hexagrammes I-Ching" },
          { num: "10+", label: "Disciplines" },
        ].map(({ num, label }) => (
          <div key={label} className="mystical-card rounded-xl p-4 text-center">
            <div className="font-cinzel text-2xl font-bold text-yellow-300">{num}</div>
            <div className="text-xs text-purple-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Feature sections */}
      <div className="space-y-12">
        {FEATURES.map((section) => (
          <div key={section.category} className="fade-in-up">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{section.emoji}</span>
              <h2 className="font-cinzel text-xl text-purple-200">{section.category}</h2>
              <div className="flex-1 h-px bg-purple-800/30" />
            </div>
            <div className={`grid gap-4 ${section.items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {section.items.map((item) => (
                <Link key={item.href} href={item.href} className="group">
                  <div className="mystical-card rounded-xl p-5 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/30">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-cinzel font-bold text-yellow-300 mb-2">{item.title}</h3>
                    <p className="text-purple-400/70 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-16 text-center mystical-card rounded-2xl p-8">
        <div className="text-4xl mb-4 float-anim">✨</div>
        <h2 className="font-cinzel text-2xl text-yellow-300 mb-3">Prêt à explorer ?</h2>
        <p className="text-purple-400/70 text-sm max-w-md mx-auto mb-6">
          Chaque consultation est unique, personnalisée par l'IA. Posez vos questions, tirez vos cartes, découvrez votre chemin.
        </p>
        <Link href="/carte-du-jour" className="gradient-btn glow-btn px-8 py-3 rounded-xl text-white font-semibold inline-block">
          🌅 Découvrir ma carte du jour
        </Link>
      </div>
    </div>
  );
}
