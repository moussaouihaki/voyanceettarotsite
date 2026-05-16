"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { ChevronDown, User, Crown, Menu, X, LogIn, LogOut } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

const NAV_GROUPS = [
  {
    label: "Tarot",
    items: [
      { href: "/tirage", label: "Tirage de Tarot", desc: "55+ tirages disponibles" },
      { href: "/carte-du-jour", label: "Carte du Jour", desc: "Guidance quotidienne" },
      { href: "/voyance", label: "Voyance Libre", desc: "Chat avec Madame Céleste" },
    ],
  },
  {
    label: "Astrologie",
    items: [
      { href: "/mes-astres", label: "Mes Astres", desc: "Votre ciel personnel", premium: true },
      { href: "/horoscope", label: "Horoscope", desc: "Jour / Semaine / Mois" },
      { href: "/profil-astral", label: "Profil Astral", desc: "Thème natal complet" },
      { href: "/synastrie", label: "Synastrie", desc: "Compatibilité amoureuse", premium: true },
    ],
  },
  {
    label: "Traditions",
    items: [
      { href: "/runes", label: "Runes Nordiques", desc: "Elder Futhark · 24 runes", premium: true },
      { href: "/i-ching", label: "I-Ching", desc: "Livre des Transformations", premium: true },
      { href: "/lenormand", label: "Oracle Lenormand", desc: "36 cartes · Tradition française", premium: true },
      { href: "/ogham", label: "Ogham Celtique", desc: "25 feadha · Tradition druidique", premium: true },
    ],
  },
  {
    label: "Énergies",
    items: [
      { href: "/chakras", label: "Chakras", desc: "Bilan énergétique", premium: true },
      { href: "/numerologie", label: "Numérologie", desc: "Profil numérologique" },
      { href: "/lithotherapie", label: "Lithothérapie", desc: "30 cristaux · Guérison vibratoire", premium: true },
      { href: "/aura", label: "Lecture d'Aura", desc: "Couleurs vibratoires · Énergie subtile", premium: true },
    ],
  },
  {
    label: "Vision IA",
    items: [
      { href: "/chiromancie", label: "Chiromancie", desc: "Lignes de la main · Analyse photo", premium: true },
      { href: "/reves", label: "Analyse des Rêves", desc: "Oniromancie · Symbolisme jungien" },
    ],
  },
];

const SECONDARY_LINKS = [
  { href: "/blog", label: "Journal" },
  { href: "/tarifs", label: "Tarifs" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { profile, firebaseUser, logout } = useUserProfile();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on ESC + focus trap in mobile menu
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeMobile(); return; }
      if (e.key !== "Tab") return;
      const menu = mobileMenuRef.current;
      if (!menu) return;
      const focusable = Array.from(
        menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.closest("[hidden]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // Move focus into menu on open
    const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>("a, button");
    firstFocusable?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  return (
    <nav
      className={`sticky top-0 z-30 transition-all duration-500 ${
        scrolled ? "bg-[#07040d]/95 backdrop-blur-xl border-b border-[rgba(212,175,111,0.15)]" : "bg-[#07040d]/70 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" onClick={() => { setOpenGroup(null); setMobileOpen(false); }}>
          <Image src="/logo-celeste.svg" alt="Céleste Voyance" width={38} height={38} className="rounded-full group-hover:scale-105 transition-transform duration-300" />
          <div className="leading-tight">
            <div className="font-serif-display text-[15px] font-semibold tracking-wider text-gradient-cream">MADAME&nbsp;CÉLESTE</div>
            <div className="text-[9px] tracking-[0.3em] text-[#8a6f3a] uppercase">Arts Divinatoires</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_GROUPS.map((group) => {
            const isActive = group.items.some((item) => pathname === item.href);
            const isOpen = openGroup === group.label;
            return (
              <div key={group.label} className="relative">
                <button
                  onClick={() => setOpenGroup(isOpen ? null : group.label)}
                  className={`px-4 py-2 text-[12px] tracking-[0.15em] uppercase font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive ? "text-[#e8c875]" : "text-[#c9b88a] hover:text-[#f5ecd9]"
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenGroup(null)} />
                    <div className="absolute right-0 top-full mt-3 w-72 z-20 luxe-card overflow-hidden rounded-sm">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenGroup(null)}
                          className={`block px-5 py-4 transition-all hover:bg-[rgba(212,175,111,0.06)] border-b border-[rgba(212,175,111,0.08)] last:border-b-0 ${
                            pathname === item.href ? "bg-[rgba(212,175,111,0.08)]" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-serif-display text-[14px] text-[#f5ecd9]">{item.label}</div>
                            {"premium" in item && item.premium && (
                              <Crown size={11} className="text-[#d4af6f]" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#8a6f3a] tracking-wide">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div className="w-px h-6 bg-[rgba(212,175,111,0.2)] mx-2" />

          {SECONDARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-[12px] tracking-[0.15em] uppercase font-medium transition-all ${
                pathname === link.href ? "text-[#e8c875]" : "text-[#c9b88a] hover:text-[#f5ecd9]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Profile + CTA */}
        <div className="flex items-center gap-1.5 flex-shrink-0 min-w-0">
          <NotificationBell />

          <Link
            href="/mon-profil"
            title="Mon profil"
            className={`hidden md:flex items-center gap-1.5 px-2 py-2 text-[12px] tracking-wider transition-all ${
              pathname === "/mon-profil" ? "text-[#e8c875]" : "text-[#c9b88a] hover:text-[#f5ecd9]"
            }`}
          >
            {profile?.subscription === "vip" ? (
              <Crown size={14} className="text-[#d4af6f]" />
            ) : (
              <User size={14} />
            )}
            <span className="hidden xl:inline max-w-[80px] truncate">{profile?.prenom || "Profil"}</span>
          </Link>

          {!profile?.subscription || profile.subscription === "decouverte" ? (
            <Link href="/tarifs" className="btn-gold !text-[11px] !py-2 !px-3 hidden lg:inline-flex">
              <Crown size={12} />
              <span>Membre</span>
            </Link>
          ) : (
            <span className="badge-premium hidden lg:inline-flex items-center gap-1">
              <Crown size={11} />
              {profile.subscription === "vip" ? "VIP" : "✦"}
            </span>
          )}

          {firebaseUser ? (
            <button
              onClick={() => logout()}
              title="Se déconnecter"
              aria-label="Se déconnecter"
              className="hidden md:flex items-center justify-center w-8 h-8 text-[#8a6f3a] hover:text-[#c9b88a] transition-colors rounded-sm hover:bg-[rgba(212,175,111,0.08)]"
            >
              <LogOut size={13} />
            </button>
          ) : (
            <Link
              href="/connexion"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-[11px] tracking-[0.1em] uppercase font-medium border border-[rgba(212,175,111,0.45)] text-[#d4af6f] hover:bg-[rgba(212,175,111,0.1)] hover:border-[rgba(212,175,111,0.7)] transition-all rounded-sm whitespace-nowrap"
            >
              <LogIn size={13} />
              <span>Connexion</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-[#c9b88a] p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="lg:hidden border-t border-[rgba(212,175,111,0.15)] bg-[#07040d]/98 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          <div className="px-6 py-4 space-y-1 max-h-[80vh] overflow-y-auto scroll-custom">
            <Link href="/mon-profil" onClick={closeMobile} className="flex items-center gap-2 px-3 py-3.5 min-h-[44px] text-[#f5ecd9] border-b border-[rgba(212,175,111,0.1)]">
              <User size={15} />
              <span className="font-serif-display">{profile?.prenom ? `Bonjour, ${profile.prenom}` : "Mon profil"}</span>
            </Link>
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="py-2">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] px-3 py-2">{group.label}</div>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={`flex items-center gap-2 px-3 min-h-[44px] py-3 text-[14px] font-serif-display ${pathname === item.href ? "text-[#e8c875]" : "text-[#c9b88a]"}`}
                  >
                    {item.label}
                    {"premium" in item && item.premium && <Crown size={10} className="text-[#d4af6f]" />}
                  </Link>
                ))}
              </div>
            ))}
            <div className="border-t border-[rgba(212,175,111,0.1)] pt-3 mt-2">
              {SECONDARY_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMobile} className="flex items-center px-3 min-h-[44px] py-3 text-[14px] font-serif-display text-[#c9b88a]">
                  {link.label}
                </Link>
              ))}
              <Link href="/tarifs" onClick={closeMobile} className="btn-gold !w-full !text-[11px] !py-3 !min-h-[44px] mt-3">
                <Crown size={13} />
                <span>Devenir membre</span>
              </Link>
              {firebaseUser ? (
                <button
                  onClick={() => { logout(); closeMobile(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] mt-2 border border-[rgba(212,175,111,0.2)] rounded-sm text-[#8a6f3a] text-[11px] tracking-widest uppercase hover:text-[#c9b88a] transition-colors"
                >
                  <LogOut size={13} />
                  <span>Se déconnecter</span>
                </button>
              ) : (
                <Link href="/connexion" onClick={closeMobile} className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] mt-2 border border-[rgba(212,175,111,0.45)] rounded-sm text-[#d4af6f] text-[11px] tracking-widest uppercase hover:bg-[rgba(212,175,111,0.1)] transition-colors">
                  <LogIn size={13} />
                  <span>Connexion</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
