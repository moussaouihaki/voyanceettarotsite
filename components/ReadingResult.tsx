"use client";

interface Props {
  text: string;
  isStreaming: boolean;
}

export default function ReadingResult({ text, isStreaming }: Props) {
  if (!text && !isStreaming) return null;

  return (
    <div className="mystical-card rounded-2xl p-6 md:p-8 mt-8 fade-in-up">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl float-anim">🔮</span>
        <h3 className="font-cinzel text-lg text-yellow-300">La Lecture de Madame Céleste</h3>
      </div>
      <div className="text-purple-100/90 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
        {text}
        {isStreaming && <span className="typing-cursor" />}
      </div>
    </div>
  );
}
