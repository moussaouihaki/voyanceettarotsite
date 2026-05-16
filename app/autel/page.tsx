"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Flame, Plus, X, Lock } from "lucide-react";

interface Candle {
  id: string;
  color: string;
  hex: string;
  meaning: string;
  intention: string;
  litAt: number;
  duration: 86400000 | 604800000; // 24h or 7 days in ms
}

const CANDLE_TYPES = [
  { color: "white",  hex: "#f5f0e8", meaning: "Pureté & Clarté" },
  { color: "red",    hex: "#dc3545", meaning: "Amour & Passion" },
  { color: "green",  hex: "#28a745", meaning: "Prospérité & Santé" },
  { color: "blue",   hex: "#4a90d9", meaning: "Paix & Communication" },
  { color: "gold",   hex: "#d4af6f", meaning: "Succès & Abondance" },
  { color: "purple", hex: "#9b59b6", meaning: "Spiritualité & Intuition" },
  { color: "black",  hex: "#666",    meaning: "Protection & Ancrage" },
  { color: "pink",   hex: "#e91e8c", meaning: "Amitié & Bienveillance" },
];

const STORAGE_KEY = "celeste_altar_candles";

function timeLeft(candle: Candle): string {
  const remaining = (candle.litAt + candle.duration) - Date.now();
  if (remaining <= 0) return "Éteinte";
  const h = Math.floor(remaining / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}j ${h % 24}h restantes`;
  const m = Math.floor((remaining % 3600000) / 60000);
  return `${h}h ${m}m restantes`;
}

function isActive(candle: Candle): boolean {
  return Date.now() < candle.litAt + candle.duration;
}

export default function AutolPage() {
  const { profile, firebaseUser } = useUserProfile();
  const [candles, setCandles] = useState<Candle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedColor, setSelectedColor] = useState(CANDLE_TYPES[4]);
  const [intention, setIntention] = useState("");
  const [duration, setDuration] = useState<86400000 | 604800000>(86400000);
  const [, setTick] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCandles(JSON.parse(stored));
    } catch {}
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const save = (next: Candle[]) => {
    setCandles(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const lightCandle = () => {
    if (!intention.trim()) return;
    const newCandle: Candle = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      color: selectedColor.color,
      hex: selectedColor.hex,
      meaning: selectedColor.meaning,
      intention: intention.trim(),
      litAt: Date.now(),
      duration,
    };
    save([...candles, newCandle]);
    setIntention("");
    setShowForm(false);
  };

  const removeCandle = (id: string) => save(candles.filter((c) => c.id !== id));

  const active = candles.filter(isActive);
  const expired = candles.filter((c) => !isActive(c));

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 fade-in-up">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="badge-gold mb-5 inline-flex items-center gap-2">
          <Flame size={11} />
          Sanctuaire Virtuel
        </div>
        <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">L&apos;Autel de Madame Céleste</h1>
        <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-xl mx-auto">
          Allumez une bougie virtuelle pour ancrer vos intentions. La flamme numérique porte votre prière jusqu&apos;aux étoiles.
        </p>
      </div>

      {!firebaseUser && (
        <div className="luxe-card rounded-sm p-6 mb-10 flex items-center gap-4 max-w-lg mx-auto">
          <Lock size={18} className="text-[#d4af6f] shrink-0" />
          <div className="flex-1 text-[13px] text-[#c9b88a]">
            <Link href="/connexion?redirect=/autel" className="text-[#d4af6f] hover:text-[#e8c875] underline underline-offset-2">Connectez-vous</Link>{" "}
            pour sauvegarder vos bougies entre les sessions.
          </div>
        </div>
      )}

      {/* Altar surface */}
      <div
        className="relative rounded-sm border border-[rgba(212,175,111,0.2)] mb-10 p-8 min-h-64"
        style={{ background: "radial-gradient(ellipse at center bottom, rgba(30,15,45,0.95) 0%, rgba(7,4,13,0.98) 70%)" }}
      >
        {/* Altar cloth line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,111,0.3)] to-transparent" />

        {active.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-[rgba(212,175,111,0.2)] text-6xl mb-4">🕯️</div>
            <p className="text-[#8a6f3a] font-serif-text italic text-sm">L&apos;autel attend vos intentions...</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {active.map((candle) => (
              <div key={candle.id} className="flex flex-col items-center gap-2 group relative">
                <button
                  onClick={() => removeCandle(candle.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[rgba(13,8,32,0.9)] border border-[rgba(212,175,111,0.3)] text-[#8a6f3a] hover:text-[#d4af6f] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
                >
                  <X size={9} />
                </button>

                {/* Flame */}
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-3 h-5 rounded-full"
                    style={{
                      background: `radial-gradient(ellipse at center, #fff8 0%, ${candle.hex} 40%, transparent 100%)`,
                      boxShadow: `0 0 12px 4px ${candle.hex}80`,
                      animation: "flicker 2s ease-in-out infinite",
                    }}
                  />
                  {/* Candle body */}
                  <div
                    className="w-6 h-14 rounded-sm mt-0.5"
                    style={{ background: `linear-gradient(to bottom, ${candle.hex}dd, ${candle.hex}88)`, boxShadow: `0 0 8px ${candle.hex}40` }}
                  />
                  {/* Wax drip */}
                  <div className="w-7 h-1 rounded-sm mt-0.5 opacity-50" style={{ background: candle.hex }} />
                </div>

                <div className="text-center max-w-[80px]">
                  <p className="text-[9px] tracking-wider uppercase font-serif-display mb-0.5" style={{ color: candle.hex }}>
                    {candle.meaning}
                  </p>
                  <p className="text-[9px] text-[#c9b88a] italic leading-tight line-clamp-2">{candle.intention}</p>
                  <p className="text-[7px] text-[#8a6f3a] mt-1">{timeLeft(candle)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <style>{`
          @keyframes flicker {
            0%,100%{transform:scaleY(1) scaleX(1) translateY(0);}
            25%{transform:scaleY(1.15) scaleX(0.9) translateY(-1px);}
            50%{transform:scaleY(0.9) scaleX(1.1) translateY(1px);}
            75%{transform:scaleY(1.1) scaleX(0.95) translateY(-0.5px);}
          }
        `}</style>
      </div>

      {/* Stats */}
      {active.length > 0 && (
        <p className="text-center text-[11px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-8">
          {active.length} flamme{active.length > 1 ? "s" : ""} active{active.length > 1 ? "s" : ""} sur l&apos;autel
        </p>
      )}

      {/* Add candle button */}
      {active.length < 7 && !showForm && (
        <div className="text-center mb-8">
          <button onClick={() => setShowForm(true)} className="btn-gold gap-2">
            <Flame size={14} />
            Allumer une bougie
          </button>
        </div>
      )}

      {/* Add candle form */}
      {showForm && (
        <div className="luxe-card rounded-sm p-8 mb-10 fade-in-up max-w-lg mx-auto">
          <h3 className="font-serif-display text-xl text-cream mb-6 text-center">Choisissez votre bougie</h3>

          {/* Color picker */}
          <div className="mb-6">
            <label className="luxe-label">Couleur & Intention</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {CANDLE_TYPES.map((type) => (
                <button
                  key={type.color}
                  onClick={() => setSelectedColor(type)}
                  className={`p-2 rounded-sm border transition-all text-center ${selectedColor.color === type.color ? "border-[#d4af6f] bg-[rgba(212,175,111,0.1)]" : "border-[rgba(212,175,111,0.15)] hover:border-[rgba(212,175,111,0.4)]"}`}
                >
                  <div className="w-6 h-6 rounded-full mx-auto mb-1 border border-[rgba(255,255,255,0.2)]" style={{ background: type.hex }} />
                  <p className="text-[8px] text-[#c9b88a] leading-tight">{type.meaning}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Intention */}
          <div className="mb-5">
            <label className="luxe-label">Votre intention</label>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="Ex: Je manifeste la santé et la sérénité dans ma vie..."
              rows={3}
              className="luxe-input w-full resize-none"
            />
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="luxe-label">Durée de la flamme</label>
            <div className="flex gap-3 mt-2">
              {([86400000, 604800000] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2 text-[12px] tracking-wider border transition-all ${duration === d ? "border-[#d4af6f] text-[#d4af6f] bg-[rgba(212,175,111,0.08)]" : "border-[rgba(212,175,111,0.2)] text-[#8a6f3a] hover:border-[rgba(212,175,111,0.4)]"}`}
                >
                  {d === 86400000 ? "24 heures" : "7 jours"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-ghost flex-1">Annuler</button>
            <button onClick={lightCandle} disabled={!intention.trim()} className="btn-gold flex-1 gap-2">
              <Flame size={14} />
              Allumer
            </button>
          </div>
        </div>
      )}

      {/* Expired candles */}
      {expired.length > 0 && (
        <div className="mt-8">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] text-center mb-4">Bougies éteintes</div>
          <div className="space-y-2">
            {expired.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3 rounded-sm bg-[rgba(13,8,32,0.4)] border border-[rgba(212,175,111,0.08)] opacity-50">
                <div className="w-3 h-3 rounded-full border" style={{ borderColor: c.hex }} />
                <p className="text-[12px] text-[#8a6f3a] flex-1 italic">{c.intention}</p>
                <button onClick={() => removeCandle(c.id)} className="text-[#8a6f3a] hover:text-[#d4af6f]"><X size={11} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info section */}
      <div className="mt-12 grid sm:grid-cols-3 gap-4">
        {[
          { title: "La Symbolique des Couleurs", text: "Chaque couleur vibre à une fréquence différente. L'or attire l'abondance, le rouge enflamme la passion, le blanc purifie l'espace." },
          { title: "Comment Ancrer l'Intention", text: "Formulez votre intention au présent et à la forme affirmative. 'Je suis' et 'J'ai' sont plus puissants que 'Je veux'." },
          { title: "La Durée Sacrée", text: "24h pour les intentions immédiates, 7 jours pour les désirs profonds. Les grandes manifestations demandent du temps." },
        ].map((item) => (
          <div key={item.title} className="luxe-card rounded-sm p-5">
            <div className="text-[11px] font-serif-display text-[#d4af6f] mb-2">{item.title}</div>
            <p className="text-[12px] text-[#c9b88a] leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
