"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  getAllEvents,
  getUpcomingEvents,
  getCurrentMonthEvents,
  type PlanetaryEvent,
} from "@/lib/planetary-events";
import { Calendar, List, Star, Moon, Sun, Zap, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

type FilterType = "all" | "retrograde" | "eclipse" | "fullmoon" | "newmoon" | "ingress" | "direct" | "special";

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  retrograde: { label: "Rétrograde", color: "text-[#e87070]", bg: "bg-[rgba(232,112,112,0.1)]", border: "border-[rgba(232,112,112,0.3)]" },
  direct:     { label: "Direct",     color: "text-[#70e8a0]", bg: "bg-[rgba(112,232,160,0.1)]", border: "border-[rgba(112,232,160,0.3)]" },
  eclipse:    { label: "Éclipse",    color: "text-[#e8c875]", bg: "bg-[rgba(232,200,117,0.15)]", border: "border-[rgba(232,200,117,0.4)]" },
  fullmoon:   { label: "Pleine Lune",color: "text-[#c9b8ff]", bg: "bg-[rgba(201,184,255,0.1)]", border: "border-[rgba(201,184,255,0.3)]" },
  newmoon:    { label: "Nouvelle Lune", color: "text-[#8a90d0]", bg: "bg-[rgba(138,144,208,0.1)]", border: "border-[rgba(138,144,208,0.3)]" },
  ingress:    { label: "Transit",    color: "text-[#d4af6f]", bg: "bg-[rgba(212,175,111,0.1)]", border: "border-[rgba(212,175,111,0.3)]" },
  special:    { label: "Spécial",    color: "text-[#f5ecd9]", bg: "bg-[rgba(245,236,217,0.08)]", border: "border-[rgba(245,236,217,0.2)]" },
};

const IMPACT_CONFIG = {
  majeur: { label: "Majeur", bg: "bg-[rgba(232,200,117,0.15)]", text: "text-[#e8c875]", border: "border-[rgba(232,200,117,0.35)]" },
  moyen:  { label: "Moyen",  bg: "bg-[rgba(192,192,192,0.1)]",  text: "text-[#c0c0c0]", border: "border-[rgba(192,192,192,0.25)]" },
  mineur: { label: "Mineur", bg: "bg-[rgba(120,120,120,0.08)]", text: "text-[#888]",    border: "border-[rgba(120,120,120,0.2)]" },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function EventCard({ event, expanded = false }: { event: PlanetaryEvent; expanded?: boolean }) {
  const [open, setOpen] = useState(expanded);
  const typeConf = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.special;
  const impactConf = IMPACT_CONFIG[event.impact];

  return (
    <div className="luxe-card rounded-sm overflow-hidden">
      <button
        className="w-full text-left p-5 flex items-start gap-4"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Emoji */}
        <div className="flex-shrink-0 w-11 h-11 rounded-sm flex items-center justify-center text-2xl bg-[rgba(212,175,111,0.08)] border border-[rgba(212,175,111,0.15)]">
          {event.emoji}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${typeConf.bg} ${typeConf.color} ${typeConf.border}`}>
              {typeConf.label}
            </span>
            <span className={`text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${impactConf.bg} ${impactConf.text} ${impactConf.border}`}>
              {impactConf.label}
            </span>
          </div>
          <h3 className="font-serif-display text-[#f5ecd9] text-base leading-snug">{event.title}</h3>
          <p className="text-[11px] text-[#8a6f3a] mt-0.5">
            {formatDate(event.date)}
            {event.endDate && ` → ${formatDate(event.endDate)}`}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex-shrink-0 text-[#8a6f3a] mt-1">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-[rgba(212,175,111,0.08)]">
          <p className="text-[13px] text-[#c9b88a] leading-relaxed mt-4">{event.description}</p>
          {event.rituel && (
            <div className="mt-4 p-3 rounded-sm bg-[rgba(212,175,111,0.06)] border border-[rgba(212,175,111,0.15)]">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-1.5">Rituel conseillé</p>
              <p className="text-[13px] font-serif-text italic text-[#e8dcc0] leading-relaxed">{event.rituel}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UpcomingEventCard({ event }: { event: PlanetaryEvent }) {
  const typeConf = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.special;
  const impactConf = IMPACT_CONFIG[event.impact];

  return (
    <div className="luxe-card-premium rounded-sm p-5 flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-sm flex items-center justify-center text-2xl bg-[rgba(212,175,111,0.1)] border border-[rgba(212,175,111,0.25)]">
        {event.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${typeConf.bg} ${typeConf.color} ${typeConf.border}`}>
            {typeConf.label}
          </span>
          <span className={`text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${impactConf.bg} ${impactConf.text} ${impactConf.border}`}>
            {impactConf.label}
          </span>
        </div>
        <h3 className="font-serif-display text-[#f5ecd9] text-base leading-snug">{event.title}</h3>
        <p className="text-[11px] text-[#8a6f3a] mt-0.5 mb-2">
          {formatDate(event.date)}
          {event.endDate && ` → ${formatDate(event.endDate)}`}
        </p>
        <p className="text-[12px] text-[#c9b88a] leading-relaxed line-clamp-2">{event.description}</p>
      </div>
    </div>
  );
}

// Group events by month
function groupByMonth(events: PlanetaryEvent[]): [string, PlanetaryEvent[]][] {
  const map = new Map<string, PlanetaryEvent[]>();
  for (const e of events) {
    const key = e.date.slice(0, 7); // YYYY-MM
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return Array.from(map.entries());
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

const FILTER_OPTIONS: { value: FilterType; label: string; icon: React.ReactNode }[] = [
  { value: "all",        label: "Tous",          icon: <Star size={14} /> },
  { value: "eclipse",    label: "Éclipses",       icon: <Sun size={14} /> },
  { value: "retrograde", label: "Rétrogrades",    icon: <Zap size={14} /> },
  { value: "fullmoon",   label: "Pleines Lunes",  icon: <Moon size={14} /> },
  { value: "newmoon",    label: "Nouvelles Lunes", icon: <Moon size={14} /> },
  { value: "ingress",    label: "Transits",       icon: <ArrowRight size={14} /> },
];

export default function CalendrierAstralPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [view, setView] = useState<"list" | "monthly">("monthly");

  const upcoming = useMemo(() => getUpcomingEvents(5), []);
  const currentMonth = useMemo(() => getCurrentMonthEvents(), []);
  const allEvents = useMemo(() => getAllEvents(), []);

  const filteredEvents = useMemo(() => {
    if (filter === "all") return allEvents;
    if (filter === "direct") return allEvents.filter((e) => e.type === "direct");
    return allEvents.filter((e) => e.type === filter);
  }, [filter, allEvents]);

  const grouped = useMemo(() => groupByMonth(filteredEvents), [filteredEvents]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* ─── Header ─── */}
      <div className="text-center mb-16 fade-in-up">
        <div className="badge-gold mb-6">
          <span>✦ Calendrier Astral 2026 ✦</span>
        </div>
        <h1 className="font-serif-display text-4xl md:text-6xl font-semibold leading-tight mb-5">
          <span className="text-shimmer-gold">Calendrier Astral</span>
        </h1>
        <p className="font-serif-text italic text-xl text-[#c9b88a] mb-3">
          Éclipses, rétrogrades, pleines lunes &amp; nouveaux cycles
        </p>
        <div className="divider-ornament max-w-sm mx-auto my-6"><span>✦</span></div>
        <p className="text-[#c9b88a] max-w-xl mx-auto text-[14px] leading-relaxed">
          Suivez les grands mouvements planétaires de 2025-2026. Chaque événement est accompagné
          d&apos;une description et d&apos;un rituel pour en tirer le meilleur.
        </p>
      </div>

      {/* ─── Upcoming (top 5) ─── */}
      {upcoming.length > 0 && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6 pb-3 border-b border-[rgba(212,175,111,0.15)]">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-1">Bientôt</div>
              <h2 className="font-serif-display text-2xl text-cream">Prochains Événements</h2>
            </div>
            <span className="text-[11px] text-[#8a6f3a] tracking-widest">{upcoming.length} à venir</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((e) => (
              <UpcomingEventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Ce mois-ci ─── */}
      {currentMonth.length > 0 && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6 pb-3 border-b border-[rgba(212,175,111,0.15)]">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-1">En cours</div>
              <h2 className="font-serif-display text-2xl text-cream">Ce Mois-ci</h2>
            </div>
            <span className="text-[11px] text-[#8a6f3a] tracking-widest">{currentMonth.length} événement{currentMonth.length > 1 ? "s" : ""}</span>
          </div>
          <div className="grid gap-3">
            {currentMonth.map((e) => (
              <EventCard key={e.id} event={e} expanded />
            ))}
          </div>
        </section>
      )}

      {/* ─── Filters & View Toggle ─── */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest px-3 py-2 rounded-sm border transition-all ${
                filter === opt.value
                  ? "bg-[rgba(212,175,111,0.15)] border-[rgba(212,175,111,0.5)] text-[#e8c875]"
                  : "border-[rgba(212,175,111,0.15)] text-[#8a6f3a] hover:border-[rgba(212,175,111,0.3)] hover:text-[#d4af6f]"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 border border-[rgba(212,175,111,0.2)] rounded-sm p-0.5">
          <button
            onClick={() => setView("monthly")}
            className={`flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-sm transition-all ${
              view === "monthly" ? "bg-[rgba(212,175,111,0.15)] text-[#e8c875]" : "text-[#8a6f3a] hover:text-[#d4af6f]"
            }`}
          >
            <Calendar size={13} /> Par mois
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-sm transition-all ${
              view === "list" ? "bg-[rgba(212,175,111,0.15)] text-[#e8c875]" : "text-[#8a6f3a] hover:text-[#d4af6f]"
            }`}
          >
            <List size={13} /> Liste
          </button>
        </div>
      </div>

      {/* ─── Events ─── */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 text-[#8a6f3a] font-serif-text italic">
          Aucun événement pour ce filtre.
        </div>
      ) : view === "list" ? (
        <div className="grid gap-3">
          {filteredEvents.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {grouped.map(([monthKey, events]) => (
            <div key={monthKey}>
              <div className="flex items-center gap-4 mb-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(212,175,111,0.2)]" />
                <h2 className="font-serif-display text-xl text-[#d4af6f] capitalize whitespace-nowrap">
                  {monthLabel(monthKey)}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(212,175,111,0.2)]" />
              </div>
              <div className="grid gap-3">
                {events.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── CTA Footer ─── */}
      <div className="mt-20 luxe-card-premium rounded-sm p-10 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(212,175,111,0.12),transparent_70%)]" />
        <div className="relative">
          <div className="text-3xl mb-4">✨</div>
          <h2 className="font-serif-display text-2xl md:text-3xl text-gradient-cream mb-3">
            Votre Profil Astral Complet
          </h2>
          <p className="font-serif-text italic text-[#c9b88a] text-lg mb-6">
            Découvrez comment ces événements vous touchent personnellement
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/profil-astral" className="btn-gold">
              <Star size={14} />
              <span>Mon profil astral</span>
            </Link>
            <Link href="/horoscope" className="btn-outline-gold">
              <span>Voir mon horoscope</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
