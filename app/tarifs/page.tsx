"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserProfile, type SubscriptionTier } from "@/contexts/UserProfileContext";
import { authFetch } from "@/lib/api-client";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Heart,
  Star,
  Shield,
  Infinity as InfinityIcon,
  MessageCircle,
  Zap,
} from "lucide-react";

type Period = "monthly" | "yearly";

const PLANS = [
  {
    id: "decouverte" as SubscriptionTier,
    name: "Découverte",
    tagline: "Initiez-vous aux arts divinatoires",
    icon: Sparkles,
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      { label: "Carte du jour personnalisée", included: true },
      { label: "1 tirage 3 cartes par jour", included: true },
      { label: "Horoscope général quotidien", included: true },
      { label: "Profil astral basique (signe solaire)", included: true },
      { label: "Numérologie — chemin de vie", included: true },
      { label: "Tirages Tarot illimités (55+)", included: false },
      { label: "Profil astral complet avec ascendant", included: false },
      { label: "Runes & I-Ching", included: false },
      { label: "Chat voyance illimité", included: false },
      { label: "Synastrie & compatibilité", included: false },
      { label: "Historique complet sauvegardé", included: false },
    ],
    cta: "Commencer gratuitement",
    badge: null,
    accent: "bone",
  },
  {
    id: "mystique" as SubscriptionTier,
    name: "Mystique",
    tagline: "L'expérience complète pour les chercheurs de vérité",
    icon: Star,
    priceMonthly: 9.90,
    priceYearly: 95.00, // 20% reduction
    features: [
      { label: "Tout ce que comprend Découverte", included: true },
      { label: "Plus de 55 tirages de Tarot", included: true },
      { label: "Profil astral complet (ascendant, lune)", included: true },
      { label: "Runes nordiques (Elder Futhark)", included: true },
      { label: "I-Ching (64 hexagrammes)", included: true },
      { label: "Bilan complet des chakras", included: true },
      { label: "Numérologie pythagoricienne complète", included: true },
      { label: "Horoscope semaine + mois détaillés", included: true },
      { label: "Chat voyance illimité avec Madame Céleste", included: true },
      { label: "Synastrie & compatibilité amoureuse", included: true },
      { label: "Historique illimité sauvegardé", included: true },
    ],
    cta: "Devenir Mystique",
    badge: "Le plus populaire",
    accent: "gold",
  },
  {
    id: "vip" as SubscriptionTier,
    name: "Voyante VIP",
    tagline: "L'élite de la voyance — privilège suprême",
    icon: Crown,
    priceMonthly: 29.90,
    priceYearly: 287.00,
    features: [
      { label: "Tout ce que comprend Mystique", included: true },
      { label: "Chat voyance illimité avec Madame Céleste", included: true },
      { label: "Synastrie & compatibilité amoureuse", included: true },
      { label: "Lectures personnalisées approfondies (1500+ mots)", included: true },
      { label: "Calendrier lunaire interactif", included: true },
      { label: "Tirages exclusifs (Lenormand, Tzigane, etc.)", included: true },
      { label: "Historique illimité (jusqu'à 200 lectures)", included: true },
      { label: "Profil astral chinois bonus", included: true },
      { label: "Support prioritaire — réponse sous 24h", included: true },
      { label: "Newsletter mystique hebdomadaire", included: true },
      { label: "Accès anticipé aux nouvelles fonctionnalités", included: true },
    ],
    cta: "Accéder au VIP",
    badge: "Suprême",
    accent: "premium",
  },
];

const FAQ = [
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre profil. Aucune question, aucune justification — votre liberté est sacrée.",
  },
  {
    q: "Mes données sont-elles protégées ?",
    a: "Absolument. Vos informations de naissance et vos lectures restent strictement confidentielles et chiffrées. Nous ne partageons jamais rien avec des tiers.",
  },
  {
    q: "L'abonnement annuel est-il plus avantageux ?",
    a: "Oui, l'abonnement annuel offre une réduction de 20% par rapport au mensuel — l'équivalent de 2,4 mois offerts.",
  },
  {
    q: "Puis-je changer de formule en cours de route ?",
    a: "Bien entendu. Vous pouvez passer de Mystique à VIP (ou inversement) à tout moment. Le tarif est ajusté au prorata.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Carte bancaire (Visa, Mastercard, Amex), Apple Pay, Google Pay, PayPal. Tous les paiements sont sécurisés par Stripe.",
  },
  {
    q: "Y a-t-il une période d'essai ?",
    a: "La formule Découverte est gratuite à vie. Les formules Mystique et VIP sont des abonnements mensuels ou annuels sans période d'essai.",
  },
];

export default function TarifsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { profile, updateSubscription } = useUserProfile();

  const handleSubscribe = async (tier: SubscriptionTier) => {
    setCheckoutError(null);

    if (tier === "decouverte") {
      if (profile?.subscription && profile.subscription !== "decouverte") {
        const ok = window.confirm("Êtes-vous sûr de vouloir rétrograder vers Découverte ? Vous perdrez l'accès aux fonctionnalités premium.");
        if (!ok) return;
      }
      if (profile) updateSubscription("decouverte");
      window.location.href = "/mon-profil";
      return;
    }

    if (!profile) {
      window.location.href = "/connexion?redirect=/tarifs";
      return;
    }

    setLoading(tier);
    try {
      const res = await authFetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ tier, period, email: profile.email, prenom: profile.prenom }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.simulated) {
        updateSubscription(tier);
        window.location.href = `/tarifs/succes?tier=${tier}`;
      } else {
        setCheckoutError(data.error ?? "Erreur lors du paiement. Veuillez réessayer.");
      }
    } catch {
      setCheckoutError("Erreur de connexion. Vérifiez votre réseau et réessayez.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16 fade-in-up">
        <div className="badge-gold mb-6">Abonnements Premium</div>
        <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-5">
          Choisissez votre Voie
        </h1>
        <p className="font-serif-text italic text-[#c9b88a] text-xl max-w-2xl mx-auto">
          Trois formules pour s&apos;adapter à votre quête spirituelle.<br />
          Une seule certitude : l&apos;univers vous attend.
        </p>
      </div>

      {/* Period toggle */}
      <div className="flex justify-center mb-12">
        <div className="luxe-card rounded-sm p-1 inline-flex">
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-all ${
              period === "monthly" ? "bg-[rgba(212,175,111,0.15)] text-[#e8c875]" : "text-[#c9b88a]"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={`px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-all relative ${
              period === "yearly" ? "bg-[rgba(212,175,111,0.15)] text-[#e8c875]" : "text-[#c9b88a]"
            }`}
          >
            Annuel
            <span className="absolute -top-2 -right-2 badge-premium !text-[8px] !py-0.5 !px-1.5">−20%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const price = period === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const isCurrentTier = profile?.subscription === plan.id;
          const isPremium = plan.accent === "premium";
          const isGold = plan.accent === "gold";

          return (
            <div
              key={plan.id}
              className={`rounded-sm p-8 relative flex flex-col ${
                isGold ? "luxe-card-premium" : isPremium ? "luxe-card-premium" : "luxe-card"
              }`}
              style={isPremium ? { background: "linear-gradient(135deg, rgba(74, 14, 46, 0.5), rgba(45, 10, 62, 0.7), rgba(26, 18, 52, 0.95))" } : undefined}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-premium">{plan.badge}</span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center border ${
                  isPremium || isGold ? "border-[#d4af6f] bg-[rgba(212,175,111,0.1)]" : "border-[rgba(212,175,111,0.3)]"
                }`}>
                  <Icon size={26} className="text-[#d4af6f]" />
                </div>
                <div className="text-[10px] tracking-[0.4em] uppercase text-[#d4af6f] mb-2">
                  {plan.id === "decouverte" ? "Gratuit" : "Premium"}
                </div>
                <h2 className="font-serif-display text-3xl text-cream mb-2">{plan.name}</h2>
                <p className="font-serif-text italic text-[#c9b88a] text-[14px] min-h-[40px]">{plan.tagline}</p>
              </div>

              <div className="text-center mb-8 pb-8 border-b border-[rgba(212,175,111,0.15)]">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-serif-display text-5xl text-gradient-gold">
                    {price === 0 ? "0" : price.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="font-serif-display text-2xl text-[#d4af6f]">€</span>
                </div>
                <div className="text-[11px] text-[#8a6f3a] tracking-wider uppercase mt-2">
                  {price === 0 ? "Pour toujours" : period === "monthly" ? "par mois" : "par an"}
                </div>
                {period === "yearly" && price > 0 && (
                  <div className="text-[10px] text-[#d4af6f] mt-1">
                    Soit {(price / 12).toFixed(2).replace(".", ",")}€ / mois
                  </div>
                )}
              </div>

              <ul className="space-y-3.5 mb-10 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-3 text-[13px] ${f.included ? "text-[#c9b88a]" : "text-[#5a4e35] line-through"}`}>
                    {f.included ? (
                      <Check size={15} className="text-[#d4af6f] flex-shrink-0 mt-0.5" />
                    ) : (
                      <X size={15} className="text-[#5a4e35] flex-shrink-0 mt-0.5" />
                    )}
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id || isCurrentTier}
                className={`w-full ${isPremium || isGold ? "btn-gold" : "btn-outline-gold"} !justify-center disabled:opacity-50`}
              >
                {loading === plan.id ? (
                  <span>Redirection...</span>
                ) : isCurrentTier ? (
                  <>
                    <Check size={14} />
                    <span>Formule active</span>
                  </>
                ) : (
                  <>
                    {plan.id !== "decouverte" && <Crown size={13} />}
                    <span>{plan.cta}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Checkout error */}
      {checkoutError && (
        <div className="mb-8 max-w-lg mx-auto text-center text-sm text-red-400 bg-[rgba(220,50,50,0.08)] border border-[rgba(220,50,50,0.2)] rounded-sm px-5 py-3">
          {checkoutError}
        </div>
      )}

      {/* Trust signals */}
      <div className="grid md:grid-cols-4 gap-6 mb-20">
        {[
          { icon: Shield, label: "Paiement sécurisé Stripe" },
          { icon: InfinityIcon, label: "Résiliable à tout moment" },
          { icon: Heart, label: "Support bienveillant" },
          { icon: Zap, label: "Activation immédiate" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="luxe-card rounded-sm p-5 text-center">
            <Icon size={20} className="text-[#d4af6f] mx-auto mb-3" />
            <div className="text-[12px] tracking-wider text-[#c9b88a]">{label}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="divider-ornament max-w-sm mx-auto mb-5">
            <span>Questions</span>
          </div>
          <h2 className="font-serif-display text-3xl md:text-4xl text-gradient-cream mb-3">Questions Fréquentes</h2>
          <p className="font-serif-text italic text-[#c9b88a]">Tout ce que vous devez savoir avant de plonger</p>
        </div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <details key={i} className="luxe-card rounded-sm group">
              <summary className="cursor-pointer p-5 text-[15px] text-cream flex items-center justify-between font-serif-display">
                <span>{item.q}</span>
                <span className="text-[#d4af6f] group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
              </summary>
              <div className="px-5 pb-5 text-[14px] text-[#c9b88a] leading-relaxed font-serif-text">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="text-center mt-16 pt-12 border-t border-[rgba(212,175,111,0.15)]">
          <MessageCircle size={32} className="text-[#d4af6f] mx-auto mb-4" />
          <h3 className="font-serif-display text-2xl text-cream mb-3">Une autre question ?</h3>
          <p className="text-[#c9b88a] mb-6">Notre équipe est disponible pour vous accompagner</p>
          <a href="mailto:info@celestevoyance.com" className="btn-outline-gold">
            <MessageCircle size={14} />
            <span>Nous contacter par email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
