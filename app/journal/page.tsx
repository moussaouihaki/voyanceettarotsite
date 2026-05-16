"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useUserProfile, type ReadingHistory } from "@/contexts/UserProfileContext";
import { BookOpen, Search, PenLine, Check, X, Trash2, ChevronDown, ChevronUp, Sparkles, Star, Filter } from "lucide-react";

const TYPE_META: Record<string, { label: string; emoji: string; color: string }> = {
  tarot:             { label: "Tarot",             emoji: "🃏", color: "#d4af6f" },
  voyance:           { label: "Voyance",           emoji: "🔮", color: "#a78bfa" },
  runes:             { label: "Runes",             emoji: "ᚠ",  color: "#60a5fa" },
  lenormand:         { label: "Lenormand",         emoji: "🌸", color: "#f9a8d4" },
  iching:            { label: "I-Ching",           emoji: "☯",  color: "#86efac" },
  ogham:             { label: "Ogham",             emoji: "🌿", color: "#4ade80" },
  belline:           { label: "Belline",           emoji: "⭐", color: "#fbbf24" },
  cartomancie:       { label: "Cartomancie",       emoji: "♠",  color: "#e2e8f0" },
  "revolution-solaire": { label: "Révolution Solaire", emoji: "☀", color: "#fb923c" },
  reves:             { label: "Rêves",             emoji: "💭", color: "#c4b5fd" },
  chiromancie:       { label: "Chiromancie",       emoji: "✋", color: "#fda4af" },
  bibliomancie:      { label: "Bibliomancie",      emoji: "📖", color: "#93c5fd" },
};

function getMeta(type: string) {
  return TYPE_META[type] ?? { label: type, emoji: "✦", color: "#d4af6f" };
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

// Group readings by month
function groupByMonth(readings: ReadingHistory[]) {
  const groups: { label: string; items: ReadingHistory[] }[] = [];
  const map: Record<string, ReadingHistory[]> = {};
  for (const r of readings) {
    const key = new Date(r.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    if (!map[key]) { map[key] = []; groups.push({ label: key, items: map[key] }); }
    map[key].push(r);
  }
  return groups;
}

function JournalEntry({
  reading: r,
  onSaveNotes,
  onDelete,
}: {
  reading: ReadingHistory;
  onSaveNotes: (notes: string) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [draft, setDraft] = useState(r.notes ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const meta = getMeta(r.type);

  const preview = r.content.slice(0, 280);
  const hasMore = r.content.length > 280;
  const question = r.meta?.question as string | undefined;

  return (
    <div className="rounded-sm border border-[rgba(212,175,111,0.12)] bg-[rgba(13,8,32,0.5)] hover:border-[rgba(212,175,111,0.22)] transition-all overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        {/* Type badge */}
        <div
          className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0 mt-0.5 text-lg"
          style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
        >
          <span style={{ filter: "none" }}>{meta.emoji}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: meta.color }}>
              {meta.label}
            </span>
            <span className="text-[#8a6f3a] text-[10px]">·</span>
            <span className="text-[10px] text-[#8a6f3a]">{formatDate(r.date)}</span>
            <span className="text-[#8a6f3a] text-[10px]">·</span>
            <span className="text-[10px] text-[#8a6f3a]">{formatTime(r.date)}</span>
          </div>

          <h3 className="text-[15px] text-[#f5ecd9] font-medium leading-snug mb-1">{r.title}</h3>

          {question && (
            <p className="text-[12px] font-serif-text italic text-[#c9b88a] mb-2 opacity-80">
              &ldquo;{question}&rdquo;
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#c9b88a] mr-1">Supprimer ?</span>
              <button onClick={onDelete} className="text-red-400 hover:text-red-300 p-1 transition-colors" title="Confirmer">
                <Check size={12} />
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-[#8a6f3a] hover:text-[#c9b88a] p-1 transition-colors" title="Annuler">
                <X size={12} />
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-[rgba(212,175,111,0.2)] hover:text-red-400/60 p-1 transition-colors" title="Supprimer">
              <Trash2 size={12} />
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[#8a6f3a] hover:text-[#d4af6f] p-1 transition-colors"
            title={expanded ? "Réduire" : "Lire la lecture complète"}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Content preview / full */}
      <div className="px-4 pb-2">
        <div
          className="text-[13px] text-[#c9b88a] leading-relaxed"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {expanded ? r.content : preview}
          {!expanded && hasMore && (
            <button
              onClick={() => setExpanded(true)}
              className="ml-1 text-[#d4af6f] hover:text-[#e8c875] text-[12px] transition-colors"
            >
              … lire la suite
            </button>
          )}
        </div>
      </div>

      {/* Notes section */}
      <div className="px-4 pb-4 pt-2 border-t border-[rgba(212,175,111,0.06)]">
        {!editingNotes ? (
          <div className="flex items-start gap-2">
            <PenLine size={11} className="text-[#8a6f3a] mt-0.5 shrink-0" />
            {r.notes ? (
              <p className="text-[12px] text-[#c9b88a] italic flex-1 leading-relaxed">{r.notes}</p>
            ) : (
              <p className="text-[11px] text-[#8a6f3a] flex-1">Ajoutez vos impressions personnelles...</p>
            )}
            <button
              onClick={() => { setDraft(r.notes ?? ""); setEditingNotes(true); }}
              className="text-[#8a6f3a] hover:text-[#d4af6f] transition-colors shrink-0 text-[10px] tracking-widest uppercase"
            >
              {r.notes ? "Modifier" : "Ajouter"}
            </button>
          </div>
        ) : (
          <div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ce qui s'est passé, ce que j'ai ressenti, si la prédiction s'est réalisée..."
              rows={3}
              className="luxe-input w-full resize-none text-[12px] !py-2"
              autoFocus
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button onClick={() => setEditingNotes(false)} className="text-[#8a6f3a] hover:text-[#c9b88a] transition-colors p-1 text-[11px] flex items-center gap-1">
                <X size={11} /> Annuler
              </button>
              <button
                onClick={() => { onSaveNotes(draft); setEditingNotes(false); }}
                className="text-[#d4af6f] hover:text-[#e8c875] transition-colors p-1 flex items-center gap-1.5 text-[11px] tracking-wide"
              >
                <Check size={11} /> Sauvegarder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ALL_TYPES = Object.keys(TYPE_META);

export default function JournalPage() {
  const { profile, history, updateReadingNotes, deleteReading, clearHistory, isHydrated } = useUserProfile();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("tous");
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    let result = history;
    if (activeType !== "tous") result = result.filter((r) => r.type === activeType);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q) ||
          (r.notes ?? "").toLowerCase().includes(q) ||
          ((r.meta?.question as string) ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [history, activeType, search]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  // Stats
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of history) counts[r.type] = (counts[r.type] ?? 0) + 1;
    return counts;
  }, [history]);

  const usedTypes = ALL_TYPES.filter((t) => typeCounts[t]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-2 border-[rgba(212,175,111,0.2)] border-t-[#d4af6f] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-lg mx-auto px-6 py-32 text-center fade-in-up">
        <div className="font-serif-display text-6xl text-[#d4af6f] mb-6">📖</div>
        <h1 className="font-serif-display text-4xl text-gradient-cream mb-4">Mon Journal Mystique</h1>
        <p className="text-[#c9b88a] mb-8 font-serif-text italic">
          Votre journal personnel garde la mémoire de chaque tirage, chaque vision, chaque message reçu.
        </p>
        <Link href="/mon-profil" className="btn-primary">Se connecter</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12 fade-in-up">
        <div className="badge-gold mb-5 inline-flex items-center gap-2">
          <BookOpen size={11} />
          Mémoire des Astres
        </div>
        <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
          Mon Journal Mystique
        </h1>
        <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-xl mx-auto">
          Chaque tirage est une page de votre voyage intérieur. Retrouvez, annotez, méditez.
        </p>
      </div>

      {/* Stats */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="luxe-card rounded-sm p-4 text-center">
            <div className="font-serif-display text-3xl text-gradient-gold mb-1">{history.length}</div>
            <div className="text-[10px] tracking-widest uppercase text-[#8a6f3a]">Tirages</div>
          </div>
          <div className="luxe-card rounded-sm p-4 text-center">
            <div className="font-serif-display text-3xl text-gradient-gold mb-1">
              {new Set(history.map((r) => new Date(r.date).toDateString())).size}
            </div>
            <div className="text-[10px] tracking-widest uppercase text-[#8a6f3a]">Jours</div>
          </div>
          <div className="luxe-card rounded-sm p-4 text-center">
            <div className="font-serif-display text-3xl text-gradient-gold mb-1">
              {history.filter((r) => r.notes).length}
            </div>
            <div className="text-[10px] tracking-widest uppercase text-[#8a6f3a]">Notes</div>
          </div>
          <div className="luxe-card rounded-sm p-4 text-center">
            <div className="font-serif-display text-3xl text-gradient-gold mb-1">{usedTypes.length}</div>
            <div className="text-[10px] tracking-widest uppercase text-[#8a6f3a]">Oracles</div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-24 fade-in-up">
          <div className="font-serif-display text-6xl text-[#d4af6f] mb-6 opacity-30">✦</div>
          <h2 className="font-serif-display text-2xl text-gradient-cream mb-3">Votre journal est vierge</h2>
          <p className="text-[#8a6f3a] mb-8">Commencez un tirage pour que vos premiers messages s&apos;y inscrivent.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/tirage" className="btn-gold gap-2">
              <Sparkles size={14} /> Tirage de Tarot
            </Link>
            <Link href="/voyance" className="btn-outline-gold gap-2">
              <Star size={14} /> Voyance Libre
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Search + Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a6f3a]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher dans vos tirages, notes, questions..."
                className="luxe-input w-full pl-9 text-[13px]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a6f3a] hover:text-[#d4af6f]">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Type filter chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={11} className="text-[#8a6f3a]" />
              <button
                onClick={() => setActiveType("tous")}
                className={`px-3 py-1 rounded-full text-[11px] tracking-wide border transition-all ${
                  activeType === "tous"
                    ? "border-[#d4af6f] bg-[rgba(212,175,111,0.12)] text-[#d4af6f]"
                    : "border-[rgba(212,175,111,0.15)] text-[#8a6f3a] hover:border-[rgba(212,175,111,0.3)] hover:text-[#c9b88a]"
                }`}
              >
                Tous ({history.length})
              </button>
              {usedTypes.map((type) => {
                const m = getMeta(type);
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type === activeType ? "tous" : type)}
                    className={`px-3 py-1 rounded-full text-[11px] tracking-wide border transition-all flex items-center gap-1.5 ${
                      activeType === type
                        ? "text-[#f5ecd9]"
                        : "border-[rgba(212,175,111,0.12)] text-[#8a6f3a] hover:text-[#c9b88a]"
                    }`}
                    style={
                      activeType === type
                        ? { borderColor: `${m.color}60`, background: `${m.color}18`, color: m.color }
                        : {}
                    }
                  >
                    <span>{m.emoji}</span>
                    {m.label}
                    <span className="opacity-60">({typeCounts[type]})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          {(search || activeType !== "tous") && (
            <p className="text-[11px] text-[#8a6f3a] tracking-wide mb-6">
              {filtered.length} entrée{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#8a6f3a]">
              <p className="font-serif-text italic">Aucun tirage ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {grouped.map(({ label, items }) => (
                <div key={label}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-px flex-1 bg-[rgba(212,175,111,0.1)]" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] capitalize">{label}</span>
                    <div className="h-px flex-1 bg-[rgba(212,175,111,0.1)]" />
                  </div>
                  <div className="space-y-3">
                    {items.map((r) => (
                      <JournalEntry
                        key={r.id}
                        reading={r}
                        onSaveNotes={(notes) => updateReadingNotes(r.id, notes)}
                        onDelete={() => deleteReading(r.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clear all */}
          <div className="mt-16 pt-8 border-t border-[rgba(212,175,111,0.08)] text-center">
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-[11px] text-[#8a6f3a] hover:text-red-400/60 transition-colors tracking-widest uppercase flex items-center gap-2 mx-auto"
              >
                <Trash2 size={11} /> Effacer tout le journal
              </button>
            ) : (
              <div className="flex items-center gap-4 justify-center">
                <span className="text-[12px] text-[#c9b88a]">Effacer définitivement tous vos tirages ?</span>
                <button
                  onClick={() => { clearHistory(); setConfirmClear(false); }}
                  className="text-red-400 hover:text-red-300 text-[12px] flex items-center gap-1 transition-colors"
                >
                  <Check size={12} /> Confirmer
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-[#8a6f3a] hover:text-[#c9b88a] text-[12px] flex items-center gap-1 transition-colors"
                >
                  <X size={12} /> Annuler
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
