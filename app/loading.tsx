import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border border-[rgba(212,175,111,0.3)] mandala-spin" />
        <div className="absolute inset-2 rounded-full border border-[rgba(212,175,111,0.2)]" style={{ animation: "orbit 25s linear infinite reverse" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={20} className="text-[#d4af6f]" />
        </div>
      </div>
      <p className="font-serif-text italic text-[#c9b88a]">Les astres s&apos;alignent...</p>
    </div>
  );
}
