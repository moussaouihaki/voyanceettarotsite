"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Accueil", icon: "🌙" },
    { href: "/tirage", label: "Tirage", icon: "🃏" },
    { href: "/voyance", label: "Voyance", icon: "🔮" },
  ];

  return (
    <nav className="relative z-20 border-b border-purple-900/30 bg-[#050010]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-cinzel text-lg font-bold shimmer-text">
          ✦ Madame Céleste ✦
        </Link>
        <div className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 ${
                pathname === l.href
                  ? "bg-purple-800/60 text-purple-100 border border-purple-600/40"
                  : "text-purple-300/70 hover:text-purple-200 hover:bg-purple-900/30"
              }`}
            >
              <span>{l.icon}</span>
              <span className="hidden sm:inline">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
