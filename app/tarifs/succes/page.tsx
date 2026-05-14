"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUserProfile, SubscriptionTier } from "@/contexts/UserProfileContext";
import { Crown, Sparkles, CheckCircle2 } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const tier = (params.get("tier") || "mystique") as SubscriptionTier;
  const { profile, updateSubscription } = useUserProfile();

  useEffect(() => {
    if (profile && profile.subscription !== tier && tier !== "decouverte") {
      updateSubscription(tier);
    }
  }, [profile, tier, updateSubscription]);

  const tierLabel = tier === "vip" ? "Voyante VIP" : "Mystique";

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center fade-in-up">
      <div className="mb-10">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border border-[rgba(212,175,111,0.3)] mandala-spin" />
          <div className="absolute inset-3 rounded-full border border-[rgba(212,175,111,0.2)]" style={{ animation: "orbit 30s linear infinite reverse" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e8c875] to-[#d4af6f] flex items-center justify-center">
              <Crown size={28} className="text-[#15102b]" />
            </div>
          </div>
        </div>

        <div className="badge-premium mb-6">
          <Sparkles size={11} className="inline mr-2" />
          Abonnement Actif
        </div>

        <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
          Bienvenue, {profile?.prenom || "membre"}
        </h1>

        <p className="font-serif-text italic text-xl text-[#c9b88a] mb-3">
          Vous êtes désormais <span className="text-[#d4af6f]">{tierLabel}</span>
        </p>

        <p className="text-[#c9b88a] max-w-xl mx-auto leading-relaxed">
          Les portes du sanctuaire complet s&apos;ouvrent à vous. Toutes les disciplines divinatoires
          sont maintenant à votre disposition, sans limite ni restriction.
        </p>
      </div>

      <div className="luxe-card-premium rounded-sm p-10 mb-10 text-left">
        <h2 className="font-serif-display text-2xl text-cream mb-6 text-center">Ce qui vous attend</h2>
        <ul className="space-y-3">
          {[
            "Plus de 55 tirages de Tarot premium",
            "Profil astral complet avec maisons astrologiques",
            "Runes nordiques et I-Ching illimités",
            "Bilan énergétique des chakras",
            ...(tier === "vip" ? [
              "Chat voyance illimité avec Madame Céleste",
              "Synastrie & compatibilité amoureuse",
              "Lectures personnalisées approfondies",
              "Support prioritaire 24/7",
            ] : []),
          ].map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] text-[#c9b88a]">
              <CheckCircle2 size={16} className="text-[#d4af6f] flex-shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/tirage" className="btn-gold">
          <Sparkles size={14} />
          <span>Premier tirage premium</span>
        </Link>
        <Link href="/mon-profil" className="btn-outline-gold">
          <span>Mon sanctuaire</span>
        </Link>
      </div>

      <p className="text-[11px] tracking-wider text-[#8a6f3a] mt-12">
        Un email de confirmation vous sera envoyé sous peu.
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-6 py-20 text-center text-[#c9b88a]">Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
