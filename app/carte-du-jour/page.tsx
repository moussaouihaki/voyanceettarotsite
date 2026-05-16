"use client";
import { authFetch } from '@/lib/api-client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { ALL_CARDS } from "@/lib/tarot-cards";
import { getTarotImage } from "@/lib/tarot-images";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Sun, Sparkles } from "lucide-react";

type CardOfDay = {
  id: string;
  name: string;
  emoji: string;
  suit: string;
  number: string;
  reversed: boolean;
  keywords: string[];
  upright: string;
  meaningReversed: string;
};

function getDailyCard(): CardOfDay {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % ALL_CARDS.length;
  const card = ALL_CARDS[index];
  const reversed = (seed % 3) === 0;
  return { ...card, reversed };
}

export default function CarteDuJourPage() {
  const [card, setCard] = useState<CardOfDay | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [intention, setIntention] = useState("");
  const { profile, addReading } = useUserProfile();

  useEffect(() => {
    setCard(getDailyCard());
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const getReading = async () => {
    if (!card) return;
    setIsStreaming(true);
    setReading("");
    try {
      const res = await authFetch("/api/carte-du-jour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card, intention, profile }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setReading((p) => p + chunk);
      }
      addReading({ type: "carte du jour", title: `${card.name}${card.reversed ? " (inversée)" : ""}`, content: full });
    } catch {
      setReading("La carte du jour garde son mystère... Réessayez dans quelques instants.");
    } finally {
      setIsStreaming(false);
    }
  };

  if (!card) return null;

  const imageUrl = getTarotImage(card.id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="fade-in-up">
        <div className="text-center mb-12">
          <div className="badge-gold mb-5">
            <Sun size={11} className="inline mr-2" />
            Votre guidance du jour
          </div>
          <h1 className="font-serif-display text-5xl text-gradient-cream mb-4">Carte du Jour</h1>
          <p className="font-serif-text italic text-[#c9b88a] text-lg capitalize">{today}</p>
        </div>

        {!revealed ? (
          <div className="flex flex-col items-center gap-8">
            <p className="text-[#c9b88a] text-center max-w-md font-serif-text italic text-lg">
              &ldquo;Une carte unique vous accompagne aujourd&apos;hui. Concentrez-vous sur votre journée, puis révélez votre guidance.&rdquo;
            </p>

            <div className="w-full max-w-md">
              <label className="luxe-label">Votre intention du jour (optionnel)</label>
              <input
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Ce sur quoi vous souhaitez une guidance..."
                className="luxe-input"
              />
            </div>

            <div
              onClick={() => setRevealed(true)}
              className="card-scene cursor-pointer group"
              style={{ width: 200, height: 340 }}
            >
              <div className="card-3d">
                <div className="card-face card-back-face">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-[#d4af6f] text-3xl">✦</div>
                    <div className="w-16 h-16 rounded-full border-2 border-[rgba(212,175,111,0.5)] flex items-center justify-center">
                      <div className="text-[#d4af6f] text-2xl">☽</div>
                    </div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f]">Cliquez</div>
                    <div className="text-[#d4af6f] text-3xl">✦</div>
                  </div>
                  <div className="absolute inset-0 opacity-15" style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212,175,111,0.25) 10px, rgba(212,175,111,0.25) 11px)",
                  }} />
                </div>
              </div>
            </div>

            <p className="text-[11px] tracking-widest uppercase text-[#8a6f3a]">Une seule carte par jour, immuable</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {/* Revealed card with real image */}
            <div className="relative" style={{ width: 220, height: 380 }}>
              {imageUrl ? (
                <div className={`relative w-full h-full rounded-sm overflow-hidden border-2 border-[#d4af6f] shadow-[0_0_60px_rgba(212,175,111,0.3)] ${card.reversed ? "rotate-180" : ""}`}>
                  <Image src={imageUrl} alt={card.name} fill unoptimized className="object-cover" sizes="220px" />
                </div>
              ) : (
                <div className="w-full h-full rounded-sm border-2 border-[#d4af6f] bg-gradient-to-b from-[#15102b] to-[#07040d] flex flex-col items-center justify-center">
                  <div className={`text-7xl text-[#d4af6f] mb-4 ${card.reversed ? "rotate-180" : ""}`}>{card.emoji}</div>
                  <div className="font-serif-display text-cream text-center px-4">{card.name}</div>
                </div>
              )}
              {card.reversed && (
                <div className="absolute -top-2 right-2 badge-premium !text-[9px]">Inversée</div>
              )}
            </div>

            {/* Card details */}
            <div className="luxe-card-premium rounded-sm p-8 w-full max-w-2xl">
              <div className="text-center mb-6">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">{card.suit}</div>
                <h2 className="font-serif-display text-3xl text-gradient-cream mb-1">{card.name}</h2>
                <p className="text-[11px] tracking-widest text-[#8a6f3a]">
                  {card.number} {card.reversed && "· Position inversée"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {card.keywords.map(k => (
                  <span key={k} className="badge-soft">{k}</span>
                ))}
              </div>

              <div className="gold-line mb-6" />

              <p className="font-serif-text text-[#e8dcc0] text-center text-lg leading-relaxed italic mb-6">
                {card.reversed ? card.meaningReversed : card.upright}
              </p>

              {intention && (
                <div className="bg-[rgba(13,8,32,0.6)] border border-[rgba(212,175,111,0.15)] rounded-sm p-4 mb-6">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] mb-1">Votre intention</div>
                  <p className="font-serif-text italic text-[#c9b88a]">&ldquo;{intention}&rdquo;</p>
                </div>
              )}

              {!reading && !isStreaming && (
                <div className="text-center">
                  <button onClick={getReading} className="btn-gold">
                    <Sparkles size={14} />
                    <span>Recevoir le message complet</span>
                  </button>
                </div>
              )}
            </div>

            <ReadingResult text={reading} isStreaming={isStreaming} />

            <div className="luxe-card rounded-sm p-6 w-full max-w-2xl text-center">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">Affirmation du jour</div>
              <p className="font-serif-text italic text-[#e8dcc0] text-lg leading-relaxed">
                &ldquo;Aujourd&apos;hui, je m&apos;ouvre aux messages de {card.name} et accueille sa guidance avec gratitude.&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
