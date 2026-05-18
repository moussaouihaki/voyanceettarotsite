"use client";
import { authFetch } from '@/lib/api-client';
import { checkResponse, apiErrorMessage } from "@/lib/api-errors";
import { useState } from "react";
import { ZODIAC_SIGNS } from "@/lib/astrology";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Star, Sparkles } from "lucide-react";

type Period = "jour" | "semaine" | "mois";

export default function HoroscopePage() {
  const { profile, sunSignName, addReading } = useUserProfile();
  const [selectedSign, setSelectedSign] = useState<string | null>(sunSignName);
  const [period, setPeriod] = useState<Period>("jour");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const getHoroscope = async (signName: string) => {
    setSelectedSign(signName);
    setReading("");
    setIsStreaming(true);
    try {
      const res = await authFetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sign: signName, period, profile }),
      });
      checkResponse(res);
      if (!res.body) throw new Error("server");
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
      addReading({ type: "horoscope", title: `${signName} · ${period}`, content: full });
    } catch (err) {
      setReading(apiErrorMessage(err, "Les astres sont voilés en ce moment... Réessayez."));
    } finally {
      setIsStreaming(false);
    }
  };

  const selectedSignData = ZODIAC_SIGNS.find(s => s.name === selectedSign);
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12 fade-in-up">
        <div className="badge-gold mb-5">
          <Star size={11} className="inline mr-2" />
          Astrologie quotidienne
        </div>
        <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-3">Horoscope</h1>
        <p className="font-serif-text italic text-[#c9b88a] text-lg">Jour · Semaine · Mois — Amour, travail, santé, finances décryptés</p>
      </div>

      {/* Period selector */}
      <div className="flex justify-center mb-10">
        <div className="luxe-card rounded-sm p-1 inline-flex">
          {(["jour", "semaine", "mois"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => { setPeriod(p); setReading(""); }}
              className={`px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-all ${
                period === p ? "bg-[rgba(212,175,111,0.15)] text-[#e8c875]" : "text-[#c9b88a]"
              }`}
            >
              {p === "jour" ? "Aujourd'hui" : p === "semaine" ? "Cette semaine" : "Ce mois"}
            </button>
          ))}
        </div>
      </div>

      {/* Signs grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-10">
        {ZODIAC_SIGNS.map((sign) => (
          <button
            key={sign.id}
            onClick={() => getHoroscope(sign.name)}
            className={`luxe-card rounded-sm p-4 text-center transition-all group ${
              selectedSign === sign.name
                ? "border-[#d4af6f] bg-[rgba(212,175,111,0.08)] shadow-[0_0_30px_rgba(212,175,111,0.15)]"
                : ""
            }`}
          >
            <div className="font-serif-display text-3xl text-[#d4af6f] mb-1.5 group-hover:text-[#e8c875] transition-colors">{sign.symbol}</div>
            <div className="font-serif-display text-cream text-sm">{sign.name}</div>
            <div className="text-[9px] tracking-widest uppercase text-[#8a6f3a] mt-1">{sign.element}</div>
          </button>
        ))}
      </div>

      {/* Selected sign info */}
      {selectedSignData && (
        <div className="luxe-card-premium rounded-sm p-7 mb-8 fade-in-up">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full border-2 border-[#d4af6f] bg-[rgba(212,175,111,0.08)] flex items-center justify-center flex-shrink-0">
              <span className="font-serif-display text-3xl text-[#d4af6f]">{selectedSignData.symbol}</span>
            </div>
            <div className="flex-1">
              <div className="font-serif-display text-2xl text-gradient-cream mb-1">{selectedSignData.name}</div>
              <div className="text-[11px] tracking-wider text-[#c9b88a] mb-2">
                {selectedSignData.dates} · {selectedSignData.element} · Régi par {selectedSignData.ruler}
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedSignData.keywords.slice(0, 4).map(k => (
                  <span key={k} className="badge-soft !text-[9px]">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedSign && !isStreaming && (
        <div className="text-center text-[#c9b88a] py-16">
          <Sparkles size={28} className="text-[#d4af6f] mx-auto mb-4" />
          <p className="font-serif-text italic text-lg">Sélectionnez votre signe pour obtenir votre horoscope</p>
        </div>
      )}

      {(isStreaming || reading) && (
        <div className="luxe-card rounded-sm p-8 fade-in-up">
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[rgba(212,175,111,0.15)]">
            <span className="font-serif-display text-3xl text-[#d4af6f]">{selectedSignData?.symbol}</span>
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f]">
                Horoscope {period === "jour" ? "du jour" : period === "semaine" ? "de la semaine" : "du mois"}
              </div>
              <div className="font-serif-display text-xl text-cream">{selectedSign}</div>
            </div>
          </div>
          <div className="font-serif-text text-[#e8dcc0] text-[16px] leading-relaxed whitespace-pre-wrap">
            {reading}
            {isStreaming && <span className="typing-cursor" />}
          </div>
        </div>
      )}
    </div>
  );
}
