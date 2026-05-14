"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Que me réserve l'amour dans les prochains mois ?",
  "Comment évolue ma situation professionnelle ?",
  "Quel est mon chemin de vie ?",
  "Y a-t-il des obstacles dans mon avenir proche ?",
];

export default function VoyancePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "✨ Bonsoir, je suis Madame Céleste. Les astres m'ont annoncé votre venue...\n\nPouvez-vous me confier ce qui occupe votre esprit et votre cœur ? Je lis dans les énergies de l'univers pour vous guider. Posez-moi votre question, sans retenue.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      <div className="text-center mb-4">
        <div className="text-3xl float-anim">🔮</div>
        <h1 className="font-cinzel text-xl text-purple-200">Voyance avec Madame Céleste</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scroll-custom space-y-4 mb-4 pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} fade-in-up`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-purple-800/60 border border-purple-600/40 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                🔮
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-purple-700/40 border border-purple-600/30 text-purple-100 rounded-tr-sm"
                  : "mystical-card text-purple-100/90 rounded-tl-sm"
              }`}
            >
              {msg.content}
              {msg.role === "assistant" && isStreaming && i === messages.length - 1 && (
                <span className="typing-cursor" />
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-indigo-800/60 border border-indigo-600/40 flex items-center justify-center text-sm ml-2 flex-shrink-0 mt-1">
                👤
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs text-purple-400 border border-purple-700/40 rounded-full px-3 py-1.5 hover:bg-purple-900/40 hover:text-purple-300 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Posez votre question aux astres..."
          disabled={isStreaming}
          className="flex-1 bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-500 text-sm disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isStreaming || !input.trim()}
          className="gradient-btn px-5 py-3 rounded-xl text-white text-sm font-semibold min-w-[80px]"
        >
          {isStreaming ? "..." : "Envoyer ✦"}
        </button>
      </div>
    </div>
  );
}
