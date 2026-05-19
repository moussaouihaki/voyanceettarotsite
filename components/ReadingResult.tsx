"use client";

import { Sparkles, Volume2, VolumeX } from "lucide-react";
import { cleanAIText } from "@/lib/format-ai-text";
import { useEffect, useState } from "react";

interface Props {
  text: string;
  isStreaming: boolean;
}

export default function ReadingResult({ text, isStreaming }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Cancel speech on unmount only
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  }

  function handleTTS() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const plainText = stripHtml(cleanAIText(text));
    if (!plainText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.9;
    utterance.pitch = 1.05;

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const frenchFemale = voices.find(
        (v) => v.lang.startsWith("fr") && v.name.toLowerCase().includes("fem")
      );
      const frenchAny = voices.find((v) => v.lang.startsWith("fr"));
      utterance.voice = frenchFemale || frenchAny || null;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    };

    // Voices may not be loaded yet
    if (window.speechSynthesis.getVoices().length > 0) {
      trySpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = trySpeak;
    }
  }

  if (!text && !isStreaming) return null;

  return (
    <div className="luxe-card-premium rounded-sm p-8 md:p-10 mt-10 fade-in-up relative">
      <div className="absolute top-3 left-3 w-7 h-7 border-t border-l border-[rgba(212,175,111,0.4)]" />
      <div className="absolute top-3 right-3 w-7 h-7 border-t border-r border-[rgba(212,175,111,0.4)]" />
      <div className="absolute bottom-3 left-3 w-7 h-7 border-b border-l border-[rgba(212,175,111,0.4)]" />
      <div className="absolute bottom-3 right-3 w-7 h-7 border-b border-r border-[rgba(212,175,111,0.4)]" />

      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[rgba(212,175,111,0.15)]">
        <Sparkles size={18} className="text-[#d4af6f]" />
        <div className="flex-1">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f]">La Lecture</div>
          <div className="font-serif-display text-xl text-cream">Par Madame Céleste</div>
        </div>
        {text && !isStreaming && (
          <button
            onClick={handleTTS}
            className="flex items-center gap-1.5 text-[#d4af6f] text-[11px] tracking-wider uppercase opacity-80 hover:opacity-100 transition-opacity"
            aria-label={isSpeaking ? "Arrêter la lecture" : "Écouter la lecture"}
          >
            {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {isSpeaking ? "Arrêter" : "Écouter"}
          </button>
        )}
      </div>

      <div
        className="font-serif-text text-[#e8dcc0] text-[16px] leading-[1.85]"
        dangerouslySetInnerHTML={{ __html: cleanAIText(text) }}
        aria-live="polite"
        aria-atomic="false"
      />
      {isStreaming && <span className="typing-cursor" />}
    </div>
  );
}
