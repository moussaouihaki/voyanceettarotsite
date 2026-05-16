"use client";
import { authFetch } from '@/lib/api-client';

import { useState, useRef, useEffect } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Sparkles, Send, User, MessageCircle, Crown, Lock } from "lucide-react";
import { cleanAIText } from "@/lib/format-ai-text";
import Link from "next/link";
import { canUse, increment, remaining } from "@/lib/daily-limits";

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

const ANON_LIMIT = 3;

function getGreeting(prenom?: string) {
  const hour = new Date().getHours();
  const time = hour < 6 ? "douce nuit" : hour < 12 ? "bonjour" : hour < 18 ? "bel après-midi" : "bonsoir";
  const intro = prenom
    ? `${time.charAt(0).toUpperCase() + time.slice(1)} ${prenom}, je suis Madame Céleste. Les astres m'ont annoncé votre venue.`
    : `${time.charAt(0).toUpperCase() + time.slice(1)}, je suis Madame Céleste. Les astres m'ont annoncé votre venue.`;
  return `${intro}\n\nPouvez-vous me confier ce qui occupe votre esprit et votre cœur ? Je lis dans les énergies de l'univers pour vous guider. Posez votre question, sans retenue.`;
}

export default function VoyancePage() {
  const { profile, isHydrated } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [continueAnon, setContinueAnon] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const tier = profile?.subscription ?? "decouverte";
  const isUnlimited = tier === "mystique" || tier === "vip";

  // Count only user messages sent (excluding the initial greeting)
  const userMessageCount = messages.filter((m) => m.role === "user").length;

  // For anonymous users, limit to ANON_LIMIT total user messages
  const anonLimitReached = !profile && continueAnon && userMessageCount >= ANON_LIMIT;

  // For decouverte tier, use daily-limits
  const decouverteLimitReached = !!profile && tier === "decouverte" && !canUse("voyanceMessages", tier);
  const decouverteRemaining = profile && tier === "decouverte" ? remaining("voyanceMessages", tier) : null;

  const limitReached = anonLimitReached || decouverteLimitReached;

  useEffect(() => {
    if (messages.length === 0 && (profile || continueAnon)) {
      setMessages([{ role: "assistant", content: getGreeting(profile?.prenom) }]);
    }
  }, [profile?.prenom, messages.length, profile, continueAnon]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming || limitReached) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMessage]);

    try {
      const res = await authFetch("/api/voyance", {
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
      // Increment daily counter for decouverte tier after successful send
      if (profile && tier === "decouverte") {
        increment("voyanceMessages");
      }
    }
  };

  // Wait for hydration before rendering gate logic
  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-center" style={{ height: "calc(100vh - 100px)" }}>
        <Sparkles size={24} className="text-[#d4af6f] animate-pulse" />
      </div>
    );
  }

  // Paywall / profile gate
  if (!profile && !continueAnon) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-center" style={{ height: "calc(100vh - 100px)" }}>
        <div className="luxe-card p-10 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-[#d4af6f] bg-[rgba(212,175,111,0.08)] flex items-center justify-center mx-auto">
            <Sparkles size={24} className="text-[#d4af6f]" />
          </div>
          <div>
            <h2 className="font-serif-display text-2xl text-gradient-cream mb-3">Créez votre profil</h2>
            <p className="font-serif-text text-[#c9b88a] text-sm leading-relaxed">
              Madame Céleste vous appellera par votre prénom et adaptera ses lectures à votre thème natal.
            </p>
          </div>
          <Link href="/mon-profil" className="btn-gold w-full flex items-center justify-center gap-2">
            <Crown size={14} />
            <span>Créer mon profil</span>
          </Link>
          <div className="pt-2 border-t border-[rgba(212,175,111,0.1)]">
            <p className="text-[11px] text-[#8a6f3a] mb-3">Vous pouvez aussi continuer en anonyme</p>
            <button
              onClick={() => setContinueAnon(true)}
              className="btn-outline-gold text-xs w-full"
            >
              Continuer sans profil ({ANON_LIMIT} messages)
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              className={`max-w-[78%] px-5 py-4 leading-relaxed font-serif-text text-[15px] ${
                msg.role === "user"
                  ? "bg-[rgba(212,175,111,0.08)] border border-[rgba(212,175,111,0.25)] text-[#f5ecd9] rounded-sm whitespace-pre-wrap"
                  : "luxe-card text-[#e8dcc0] rounded-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <>
                  <div dangerouslySetInnerHTML={{ __html: cleanAIText(msg.content) }} />
                  {isStreaming && i === messages.length - 1 && <span className="typing-cursor" />}
                </>
              ) : (
                msg.content
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

      {/* Limit reached — inline paywall card */}
      {limitReached && (
        <div className="luxe-card px-5 py-4 mb-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 fade-in-up">
          <Lock size={18} className="text-[#d4af6f] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[#e8dcc0] font-serif-text text-sm leading-relaxed">
              {anonLimitReached
                ? `Vous avez utilisé vos ${ANON_LIMIT} messages anonymes. Créez un profil ou passez en Mystique pour continuer.`
                : "Vous avez utilisé vos 3 consultations gratuites aujourd'hui. Revenez demain ou passez en Mystique."}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link href="/tarifs" className="btn-gold !text-[11px] !py-2 !px-4 flex items-center gap-1.5">
              <Crown size={11} />
              <span>Mystique</span>
            </Link>
            {!anonLimitReached && (
              <span className="btn-outline-gold !text-[11px] !py-2 !px-4 cursor-default opacity-60">Demain</span>
            )}
            {anonLimitReached && (
              <Link href="/mon-profil" className="btn-outline-gold !text-[11px] !py-2 !px-4">Mon profil</Link>
            )}
          </div>
        </div>
      )}

      {/* Daily counter for decouverte */}
      {!limitReached && profile && tier === "decouverte" && decouverteRemaining !== null && (
        <div className="text-center mb-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#8a6f3a]">
            {decouverteRemaining}/{3} consultations aujourd'hui
          </span>
        </div>
      )}

      {/* Anonymous counter */}
      {!limitReached && !profile && continueAnon && (
        <div className="text-center mb-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#8a6f3a]">
            {ANON_LIMIT - userMessageCount}/{ANON_LIMIT} messages anonymes restants
          </span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 items-stretch">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder={limitReached ? "Limite atteinte pour aujourd'hui..." : "Posez votre question aux astres..."}
          disabled={isStreaming || limitReached}
          className="luxe-input flex-1 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isStreaming || !input.trim() || limitReached}
          className="btn-gold !px-6"
        >
          <Send size={13} />
          <span>Envoyer</span>
        </button>
      </div>
    </div>
  );
}
