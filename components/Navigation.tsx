"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_GROUPS = [
  {
    label: "Tarot",
    icon: "🃏",
    items: [
      { href: "/tirage", label: "Tirage", desc: "55 tirages disponibles" },
      { href: "/carte-du-jour", label: "Carte du Jour", desc: "Guidance quotidienne" },
      { href: "/voyance", label: "Voyance Libre", desc: "Chat avec Madame Céleste" },
    ],
  },
  {
    label: "Astrologie",
    icon: "⭐",
    items: [
      { href: "/horoscope", label: "Horoscope", desc: "Jour / Semaine / Mois" },
      { href: "/profil-astral", label: "Profil Astral", desc: "Thème astral complet" },
    ],
  },
  {
    label: "Traditions",
    icon: "☯️",
    items: [
      { href: "/runes", label: "Runes Nordiques", desc: "Elder Futhark • 24 runes" },
      { href: "/i-ching", label: "I-Ching", desc: "Livre des Transformations" },
    ],
  },
  {
    label: "Énergie",
    icon: "🌈",
    items: [
      { href: "/chakras", label: "Chakras", desc: "Bilan énergétique complet" },
      { href: "/numerologie", label: "Numérologie", desc: "Profil numérologique" },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <nav className="relative z-20 border-b border-purple-900/30 bg-[#050010]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-cinzel text-lg font-bold shimmer-text flex-shrink-0" onClick={() => setOpenGroup(null)}>
          ✦ Madame Céleste ✦
        </Link>

        <div className="flex gap-1 items-center">
          {NAV_GROUPS.map((group) => {
            const isActive = group.items.some((item) => pathname === item.href);
            const isOpen = openGroup === group.label;

            return (
              <div key={group.label} className="relative">
                <button
                  onClick={() => setOpenGroup(isOpen ? null : group.label)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-purple-800/60 text-purple-100 border border-purple-600/40"
                      : "text-purple-300/70 hover:text-purple-200 hover:bg-purple-900/30"
                  }`}
                >
                  <span className="hidden sm:inline">{group.icon}</span>
                  <span className="hidden md:inline">{group.label}</span>
                  <span className="text-[10px] opacity-60">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenGroup(null)} />
                    <div className="absolute right-0 top-full mt-2 w-52 z-20 mystical-card rounded-xl overflow-hidden border border-purple-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenGroup(null)}
                          className={`block px-4 py-3 transition-all hover:bg-purple-800/40 ${
                            pathname === item.href ? "bg-purple-800/30 border-l-2 border-yellow-400" : ""
                          }`}
                        >
                          <div className="text-sm text-purple-100 font-cinzel">{item.label}</div>
                          <div className="text-xs text-purple-500 mt-0.5">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
