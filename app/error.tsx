"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RotateCcw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("[App error]", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <AlertCircle size={48} className="text-[#d4af6f] mx-auto mb-6" />
      <div className="badge-gold mb-5">Erreur mystique</div>
      <h1 className="font-serif-display text-4xl text-gradient-cream mb-4">Les étoiles sont voilées</h1>
      <p className="font-serif-text italic text-[#c9b88a] text-lg mb-10">
        Quelque chose s&apos;est dérobé dans l&apos;ombre. Tentez à nouveau, l&apos;univers vous attend.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={reset} className="btn-gold">
          <RotateCcw size={14} />
          <span>Réessayer</span>
        </button>
        <Link href="/" className="btn-outline-gold">
          <Home size={14} />
          <span>Accueil</span>
        </Link>
      </div>
    </div>
  );
}
