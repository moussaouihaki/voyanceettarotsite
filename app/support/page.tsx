"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Crown, Mail, MessageSquare, Sparkles, CheckCircle2, Star } from "lucide-react";

const SUBJECTS = [
  "Mon abonnement",
  "Problème technique",
  "Question sur une lecture",
  "Facturation / paiement",
  "Demande de remboursement",
  "Autre",
];

export default function SupportPage() {
  const { profile, firebaseUser } = useUserProfile();
  const isVip = profile?.subscription === "vip";
  const isMystique = profile?.subscription === "mystique";
  const isPaid = isVip || isMystique;

  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(`${profile.prenom} ${profile.nom}`.trim());
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim() || message.trim().length < 20) {
      setError("Veuillez décrire votre demande en au moins 20 caractères.");
      return;
    }
    if (!email.trim()) {
      setError("L'adresse email est requise pour vous répondre.");
      return;
    }

    const tier = profile?.subscription ?? "non connecté";
    const body = [
      `Nom : ${name || "Non renseigné"}`,
      `Email : ${email}`,
      `Abonnement : ${tier}`,
      `Objet : ${subject}`,
      "",
      message.trim(),
    ].join("\n");

    const mailtoUrl = `mailto:info@celestevoyance.com?subject=${encodeURIComponent(`[Support ${tier.toUpperCase()}] ${subject}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center fade-in-up">
        <CheckCircle2 size={48} className="text-[#d4af6f] mx-auto mb-6" />
        <h1 className="font-serif-display text-4xl text-gradient-cream mb-4">Message préparé</h1>
        <p className="font-serif-text italic text-[#c9b88a] text-lg mb-8">
          Votre client de messagerie s&apos;est ouvert avec votre message pré-rempli.
          Envoyez-le depuis votre boîte email habituelle.
        </p>
        {isVip && (
          <div className="luxe-card-premium rounded-sm p-4 mb-8 text-sm text-[#c9b88a]">
            <Crown size={14} className="inline mr-2 text-[#d4af6f]" />
            En tant que membre VIP, votre demande sera traitée en priorité dans les 24h.
          </div>
        )}
        <p className="text-[#8a6f3a] text-sm mb-6">
          Si votre client email ne s&apos;est pas ouvert, écrivez directement à{" "}
          <a href="mailto:info@celestevoyance.com" className="text-[#d4af6f] hover:text-[#e8c875] underline underline-offset-2">
            info@celestevoyance.com
          </a>
        </p>
        <Link href="/" className="btn-outline-gold">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 fade-in-up">
      {/* Header */}
      <div className="text-center mb-12">
        <div className={`badge-gold mb-5 inline-flex items-center gap-2 ${isVip ? "badge-premium" : ""}`}>
          {isVip ? <Crown size={11} /> : <Star size={11} />}
          {isVip ? "Support VIP Prioritaire" : isPaid ? "Support Mystique" : "Nous contacter"}
        </div>
        <h1 className="font-serif-display text-4xl md:text-5xl text-gradient-cream mb-4">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="font-serif-text italic text-[#c9b88a] text-lg">
          {isVip
            ? "Votre demande sera traitée en priorité — réponse sous 24h."
            : isPaid
            ? "Réponse garantie sous 48h pour les membres Mystique."
            : "Réponse sous 3-5 jours ouvrables."}
        </p>
      </div>

      {/* VIP priority banner */}
      {isVip && (
        <div className="luxe-card-premium rounded-sm p-4 mb-8 flex items-center gap-3">
          <Crown size={20} className="text-[#d4af6f] flex-shrink-0" />
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mb-0.5">File prioritaire VIP</div>
            <div className="text-[13px] text-[#c9b88a]">Votre demande passe en tête de file — réponse personnalisée sous 24h.</div>
          </div>
        </div>
      )}

      {/* Not logged in notice */}
      {!firebaseUser && (
        <div className="luxe-card rounded-sm p-4 mb-8 flex items-start gap-3 text-sm">
          <Sparkles size={16} className="text-[#d4af6f] flex-shrink-0 mt-0.5" />
          <div className="text-[#c9b88a]">
            <Link href="/connexion?redirect=/support" className="text-[#d4af6f] hover:text-[#e8c875] underline underline-offset-2">
              Connectez-vous
            </Link>{" "}
            pour que vos informations soient pré-remplies et que votre abonnement soit identifié.
          </div>
        </div>
      )}

      {/* Form */}
      <div className="luxe-card rounded-sm p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="luxe-label">Votre nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Prénom Nom"
                className="luxe-input"
              />
            </div>
            <div>
              <label className="luxe-label">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="luxe-input"
              />
            </div>
          </div>

          <div>
            <label className="luxe-label">Objet de votre demande</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="luxe-input"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s} className="bg-[#0d0820]">{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="luxe-label flex items-center gap-2">
              <MessageSquare size={11} /> Votre message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre demande en détail…"
              rows={6}
              required
              className="luxe-input w-full resize-none"
            />
            <p className="text-[10px] text-[#8a6f3a] mt-1.5 tracking-wide">
              {message.length} / 20 caractères minimum
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-[rgba(220,50,50,0.08)] border border-[rgba(220,50,50,0.2)] rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" className="btn-gold w-full !py-4">
            <Mail size={14} />
            <span>Envoyer ma demande</span>
          </button>

          <p className="text-center text-[10px] text-[#8a6f3a] tracking-wide">
            Votre client de messagerie s&apos;ouvrira avec le message pré-rempli.
            {" "}Ou écrivez directement à{" "}
            <a href="mailto:info@celestevoyance.com" className="text-[#d4af6f] hover:text-[#e8c875]">
              info@celestevoyance.com
            </a>
          </p>
        </form>
      </div>

      {/* FAQ rapide */}
      <div className="mt-12 space-y-4">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-6">Questions fréquentes</div>
        {[
          {
            q: "Comment annuler mon abonnement ?",
            a: "Depuis votre page Profil → Gérer mon abonnement → Annuler. L'accès reste actif jusqu'à la fin de la période payée.",
          },
          {
            q: "Mon paiement a été débité mais mon abonnement n'est pas activé.",
            a: "Envoyez-nous votre reçu de paiement Stripe via ce formulaire. Nous activons manuellement votre compte sous 2h.",
          },
          {
            q: "Puis-je obtenir un remboursement ?",
            a: "Oui, dans les 14 jours suivant l'achat si vous n'avez pas utilisé plus de 5 lectures. Contactez-nous via ce formulaire.",
          },
        ].map(({ q, a }) => (
          <div key={q} className="luxe-card rounded-sm p-5">
            <div className="text-[13px] font-serif-display text-cream mb-2">{q}</div>
            <div className="text-[12px] text-[#c9b88a] leading-relaxed">{a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
