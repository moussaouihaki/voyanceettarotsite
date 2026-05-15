"use client";

import { Sparkles } from "lucide-react";
import { cleanAIText } from "@/lib/format-ai-text";

interface Props {
  text: string;
  isStreaming: boolean;
}

export default function ReadingResult({ text, isStreaming }: Props) {
  if (!text && !isStreaming) return null;

  return (
    <div className="luxe-card-premium rounded-sm p-8 md:p-10 mt-10 fade-in-up relative">
      <div className="absolute top-3 left-3 w-7 h-7 border-t border-l border-[rgba(212,175,111,0.4)]" />
      <div className="absolute top-3 right-3 w-7 h-7 border-t border-r border-[rgba(212,175,111,0.4)]" />
      <div className="absolute bottom-3 left-3 w-7 h-7 border-b border-l border-[rgba(212,175,111,0.4)]" />
      <div className="absolute bottom-3 right-3 w-7 h-7 border-b border-r border-[rgba(212,175,111,0.4)]" />

      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[rgba(212,175,111,0.15)]">
        <Sparkles size={18} className="text-[#d4af6f]" />
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f]">La Lecture</div>
          <div className="font-serif-display text-xl text-cream">Par Madame Céleste</div>
        </div>
      </div>

      <div
        className="font-serif-text text-[#e8dcc0] text-[16px] leading-[1.85]"
        dangerouslySetInnerHTML={{ __html: cleanAIText(text) }}
      />
      {isStreaming && <span className="typing-cursor" />}
    </div>
  );
}
