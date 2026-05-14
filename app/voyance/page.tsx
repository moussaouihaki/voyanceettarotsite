"use client";

import { useState, useRef, useEffect } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Sparkles, Send, User, MessageCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Que me réserve l'amour dans les prochains mois ?",
  "Comment évolue ma situation professionnelle ?",
  "Quel est mon chemin de vie selon les astres ?",
  "Y a-t-il des obstacles dans mon avenir proche ?",
];

function getGreeting(prenom?: string) {
  const hour = new Date().getHours();
  const time = hour < 6 ? "douce nuit" : hour < 12 ? "bonjour" : hour < 18 ? "bel après-midi" : "bonsoir";
  const intro = prenom
    ? `${time.charAt(0).toUpperCase() + time.slice(1)} ${prenom}, je suis Madame Céleste. Les astres m'ont annoncé votre venue.`
    : `${time.charAt(0).toUpperCase() + time.slice(1)}, je suis Madame Céleste. Les astres m'ont annoncé votre venue.`;
  return `${intro}\n\nPouvez-vous me confier ce qui occupe votre esprit et votre cœur ? Je lis dans les énergies de l'univers pour vous guider. Posez votre question, sans retenue.`;
}

export default function VoyancePage() {
  const { profile } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: getGreeting(profile?.prenom) }]);
    }
  }, [profile?.prenom, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMessage]);

    try {
      const res = await fetch("/api/voyance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          profile,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Erreur");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setMessages([...newMessages, { role: "assistant", content: full }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Les étoiles sont voilées en ce moment... Réessayez dans quelques instants." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col" style={{ height: "calc(100vh - 100px)" }}>
      <div className="text-center mb-6 pb-5 border-b border-[rgba(212,175,111,0.15)]">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full border border-[#d4af6f] bg-[rgba(212,175,111,0.08)] flex items-center justify-center">
            <Sparkles size={18} className="text-[#d4af6f]" />
          </div>
          <div className="text-left">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f]">En consultation avec</div>
            <div className="font-serif-display text-xl text-gradient-cream">Madame Céleste</div>
          </div>
        </div>
        <p className="font-serif-text italic text-[#8a6f3a] text-sm mt-1">
          Voyance libre · Posez votre question, sans retenue
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scroll-custom space-y-5 mb-5 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} fade-in-up`}>
            {msg.role === "assistant" && (
              <div className="w-9 h-9 rounded-full border border-[#d4af6f] bg-[rgba(212,175,111,0.08)] flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                <Sparkles size={13} className="text-[#d4af6f]" />
              </div>
            )}
            <div
              className={`max-w-[78%] px-5 py-4 leading-relaxed whitespace-pre-wrap font-serif-text text-[15px] ${
                msg.role === "user"
                  ? "bg-[rgba(212,175,111,0.08)] border border-[rgba(212,175,111,0.25)] text-[#f5ecd9] rounded-sm"
                  : "luxe-card text-[#e8dcc0] rounded-sm"
              }`}
            >
              {msg.content}
              {msg.role === "assistant" && isStreaming && i === messages.length - 1 && (
                <span className="typing-cursor" />
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-9 h-9 rounded-full border border-[rgba(212,175,111,0.25)] bg-[rgba(13,8,32,0.6)] flex items-center justify-center ml-3 flex-shrink-0 mt-1">
                <User size={13} className="text-[#c9b88a]" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-[11px] tracking-wide text-[#c9b88a] border border-[rgba(212,175,111,0.2)] px-3 py-2 hover:border-[#d4af6f] hover:bg-[rgba(212,175,111,0.06)] hover:text-[#f5ecd9] transition-all rounded-sm"
            >
              <MessageCircle size={10} className="inline mr-1.5" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 items-stretch">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Posez votre question aux astres..."
          disabled={isStreaming}
          className="luxe-input flex-1 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isStreaming || !input.trim()}
          className="btn-gold !px-6"
        >
          <Send size={13} />
          <span>Envoyer</span>
        </button>
      </div>
    </div>
  );
}
