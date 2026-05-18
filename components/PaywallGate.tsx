"use client";

import Link from "next/link";
import { Crown, Star, Sparkles, CheckCircle2, Lock } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface Props {
  feature: "profile" | "premium" | "vip";
  children: React.ReactNode;
  customMessage?: string;
}

const PREMIUM_FEATURES = [
  "Tirages illimités par jour",
  "Interprétation IA personnalisée",
  "Runes & I-Ching",
  "Bilan des chakras",
  "Numérologie avec IA",
];

export default function PaywallGate({ feature, children, customMessage }: Props) {
  const { profile, isHydrated } = useUserProfile();

  if (!isHydrated) return null;

  const tier = profile?.subscription;

  // Determine whether user has access
  const hasAccess = (() => {
    if (feature === "profile") return profile !== null;
    if (feature === "premium") return tier === "mystique" || tier === "vip";
    if (feature === "vip") return tier === "vip";
    return false;
  })();

  if (hasAccess) return <>{children}</>;

  // --- Registration prompt ---
  if (feature === "profile") {
    return (
      <div className="max-w-lg mx-auto text-center p-10 my-8">
        <div className="luxe-card rounded-sm">
          <div className="p-10">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(212, 175, 111, 0.08)", border: "1px solid rgba(212, 175, 111, 0.25)" }}
            >
              <Sparkles size={28} style={{ color: "#d4af6f" }} />
            </div>

            <h2 className="font-serif-display text-2xl mb-4 text-gradient-cream">
              Créez votre Sanctuaire
            </h2>

            <p className="text-sm leading-relaxed mb-8" style={{ color: "#c9b88a" }}>
              Inscrivez-vous pour accéder à toutes les lectures. Vos données de naissance permettent des lectures vraiment personnalisées.
            </p>

            <Link href="/mon-profil" className="btn-gold block w-full mb-4">
              Créer mon profil gratuit
            </Link>

            <p className="text-xs" style={{ color: "rgba(201, 184, 138, 0.5)" }}>
              Gratuit — aucune carte bancaire requise
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Premium paywall ---
  if (feature === "premium") {
    return (
      <div className="max-w-lg mx-auto text-center p-10 my-8">
        <div className="luxe-card rounded-sm">
          <div className="p-10">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(212, 175, 111, 0.08)", border: "1px solid rgba(212, 175, 111, 0.25)" }}
            >
              <Crown size={28} style={{ color: "#d4af6f" }} />
            </div>

            <span className="badge-premium mb-4 inline-block">Fonctionnalité Premium</span>

            <h2 className="font-serif-display text-2xl mt-4 mb-4 text-gradient-gold">
              Passez au niveau Mystique
            </h2>

            <p className="text-sm leading-relaxed mb-8" style={{ color: "#c9b88a" }}>
              {customMessage ??
                "Débloquez les lectures illimitées avec interprétation IA personnalisée, tous les tirages, runes, I-Ching et plus."}
            </p>

            <ul className="text-left space-y-3 mb-8">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "#e8dcc0" }}>
                  <CheckCircle2 size={16} style={{ color: "#d4af6f", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <p className="text-base font-semibold mb-5" style={{ color: "#d4af6f" }}>
              À partir de 9,90€/mois — satisfait ou remboursé 7 jours
            </p>

            <div className="flex flex-col gap-3">
              <Link href="/tarifs" className="btn-gold block w-full">
                Voir les offres
              </Link>
              <Link href="/mon-profil" className="btn-outline-gold block w-full">
                Mon profil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIP paywall ---
  return (
    <div className="max-w-lg mx-auto text-center p-10 my-8">
      <div className="luxe-card rounded-sm">
        <div className="p-10">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(212, 175, 111, 0.08)", border: "1px solid rgba(212, 175, 111, 0.25)" }}
          >
            <Star size={28} style={{ color: "#d4af6f" }} />
          </div>

          <span className="badge-gold mb-4 inline-block">Fonctionnalité VIP</span>

          <h2 className="font-serif-display text-2xl mt-4 mb-4 text-gradient-gold">
            Voyante VIP
          </h2>

          <p className="text-sm leading-relaxed mb-8" style={{ color: "#c9b88a" }}>
            {customMessage ?? "Cette fonctionnalité exclusive est réservée aux membres VIP."}
          </p>

          <Link href="/tarifs" className="btn-gold block w-full">
            Découvrir l&apos;offre VIP
          </Link>
        </div>
      </div>
    </div>
  );
}
