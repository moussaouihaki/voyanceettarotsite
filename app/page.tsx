"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16 fade-in-up">
        <div className="text-6xl mb-6 float-anim">🌙</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          <span className="shimmer-text">Madame Céleste</span>
        </h1>
        <p className="text-xl md:text-2xl text-purple-300 font-cinzel mb-3">
          Voyance & Tarot par Intelligence Artificielle
        </p>
        <p className="text-purple-400/70 max-w-lg mx-auto text-sm md:text-base">
          Laissez les astres guider votre chemin. Consultez les cartes du tarot
          ou posez vos questions à Madame Céleste.
        </p>
      </div>

      {/* CTA Cards */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl fade-in-up-delay-2">
        <Link href="/tirage" className="group">
          <div className="mystical-card rounded-2xl p-8 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] cursor-pointer">
            <div className="text-5xl mb-5 text-center float-anim">🃏</div>
            <h2 className="text-2xl font-bold text-center text-purple-100 mb-3">
              Tirage de Tarot
            </h2>
            <p className="text-purple-300/80 text-center text-sm leading-relaxed">
              Tirez vos cartes du tarot et recevez une lecture approfondie.
              Choisissez entre le tirage à 3 cartes ou la Croix Celtique.
            </p>
            <div className="mt-6 flex justify-center gap-2 text-xs text-purple-400">
              <span className="bg-purple-900/40 px-3 py-1 rounded-full border border-purple-700/30">3 Cartes</span>
              <span className="bg-purple-900/40 px-3 py-1 rounded-full border border-purple-700/30">Croix Celtique</span>
            </div>
          </div>
        </Link>

        <Link href="/voyance" className="group">
          <div className="mystical-card rounded-2xl p-8 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] cursor-pointer">
            <div className="text-5xl mb-5 text-center float-anim-slow">🔮</div>
            <h2 className="text-2xl font-bold text-center text-purple-100 mb-3">
              Voyance Libre
            </h2>
            <p className="text-purple-300/80 text-center text-sm leading-relaxed">
              Posez vos questions directement à Madame Céleste. Amour, carrière,
              famille... les astres ont une réponse pour vous.
            </p>
            <div className="mt-6 flex justify-center gap-2 text-xs text-purple-400">
              <span className="bg-purple-900/40 px-3 py-1 rounded-full border border-purple-700/30">Chat IA</span>
              <span className="bg-purple-900/40 px-3 py-1 rounded-full border border-purple-700/30">En temps réel</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Features */}
      <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl text-center fade-in-up-delay-4">
        {[
          { icon: "⭐", label: "78 cartes du Tarot" },
          { icon: "✨", label: "Lectures personnalisées" },
          { icon: "🌟", label: "IA mystique avancée" },
        ].map((f) => (
          <div key={f.label} className="text-purple-400/60">
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="text-xs">{f.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
