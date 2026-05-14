"use client";
import { useState } from "react";
import { ZODIAC_SIGNS } from "@/lib/astrology";
import ReadingResult from "@/components/ReadingResult";

type Period = "jour" | "semaine" | "mois";

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("jour");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const getHoroscope = async (signName: string) => {
    setSelectedSign(signName);
    setReading("");
    setIsStreaming(true);
    try {
      const res = await fetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sign: signName, period }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setReading((p) => p + decoder.decode(value, { stream: true }));
      }
    } catch {
      setReading("Les astres sont voilés en ce moment... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const selectedSignData = ZODIAC_SIGNS.find(s => s.name === selectedSign);
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8 fade-in-up">
        <div className="text-5xl mb-4 float-anim">⭐</div>
        <h1 className="text-3xl font-bold text-purple-100 mb-2">Horoscope</h1>
        <p className="text-purple-400 text-sm capitalize">{today}</p>
      </div>

      {/* Period selector */}
      <div className="flex gap-2 justify-center mb-8">
        {(["jour", "semaine", "mois"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => { setPeriod(p); setReading(""); setSelectedSign(null); }}
            className={`px-5 py-2 rounded-full text-sm transition-all capitalize ${period === p ? "bg-purple-700 text-white" : "border border-purple-700/40 text-purple-400 hover:bg-purple-900/30"}`}
          >
            {p === "jour" ? "Aujourd'hui" : p === "semaine" ? "Cette semaine" : "Ce mois"}
          </button>
        ))}
      </div>

      {/* Signs grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8 fade-in-up-delay-2">
        {ZODIAC_SIGNS.map((sign) => (
          <button
            key={sign.id}
            onClick={() => getHoroscope(sign.name)}
            className={`mystical-card rounded-xl p-3 text-center transition-all duration-300 hover:scale-[1.05] ${selectedSign === sign.name ? "border-yellow-500/60 shadow-[0_0_20px_rgba(255,215,0,0.2)]" : "hover:border-purple-500/50"}`}
          >
            <div className="text-2xl mb-1">{sign.emoji}</div>
            <div className="text-xs font-cinzel text-yellow-300">{sign.symbol}</div>
            <div className="text-xs text-purple-300 mt-0.5">{sign.name}</div>
            <div className="text-[10px] text-purple-500 mt-0.5">{sign.element}</div>
          </button>
        ))}
      </div>

      {/* Selected sign info */}
      {selectedSignData && (
        <div className="mystical-card rounded-xl p-4 mb-6 flex items-center gap-4 fade-in-up">
          <div className="text-4xl">{selectedSignData.emoji}</div>
          <div>
            <div className="font-cinzel text-yellow-300 font-bold">{selectedSignData.symbol} {selectedSignData.name}</div>
            <div className="text-xs text-purple-400">{selectedSignData.dates} · {selectedSignData.element} · {selectedSignData.ruler}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedSignData.keywords.slice(0, 4).map(k => (
                <span key={k} className="text-[10px] bg-purple-900/40 text-purple-400 px-1.5 py-0.5 rounded">{k}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!selectedSign && !isStreaming && (
        <div className="text-center text-purple-500 py-12">
          <div className="text-4xl mb-3">⬆️</div>
          <p>Sélectionnez votre signe pour obtenir votre horoscope</p>
        </div>
      )}

      {isStreaming && (
        <div className="mystical-card rounded-2xl p-6 mt-4 fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl float-anim">⭐</span>
            <h3 className="font-cinzel text-lg text-yellow-300">
              Horoscope {period === "jour" ? "du jour" : period === "semaine" ? "de la semaine" : "du mois"} — {selectedSign}
            </h3>
          </div>
          <div className="text-purple-100/90 leading-relaxed whitespace-pre-wrap text-sm">
            {reading}<span className="typing-cursor" />
          </div>
        </div>
      )}

      {!isStreaming && reading && (
        <div className="mystical-card rounded-2xl p-6 mt-4 fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{selectedSignData?.emoji}</span>
            <h3 className="font-cinzel text-lg text-yellow-300">
              Horoscope {period === "jour" ? "du jour" : period === "semaine" ? "de la semaine" : "du mois"} — {selectedSign}
            </h3>
          </div>
          <div className="text-purple-100/90 leading-relaxed whitespace-pre-wrap text-sm">{reading}</div>
        </div>
      )}
    </div>
  );
}
