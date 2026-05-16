import Link from "next/link";
import { Sparkles } from "lucide-react";

const FOOTER_LINKS = {
  "Tarot & Cartomancie": [
    { href: "/tirage", label: "Tirage de Tarot" },
    { href: "/carte-du-jour", label: "Carte du Jour" },
    { href: "/voyance", label: "Voyance Libre" },
  ],
  "Astrologie": [
    { href: "/horoscope", label: "Horoscope" },
    { href: "/profil-astral", label: "Profil Astral" },
    { href: "/synastrie", label: "Synastrie" },
  ],
  "Traditions": [
    { href: "/runes", label: "Runes Nordiques" },
    { href: "/i-ching", label: "I-Ching" },
    { href: "/lenormand", label: "Oracle Lenormand" },
    { href: "/belline", label: "Oracle de Belline" },
    { href: "/cartomancie", label: "Cartomancie 32 cartes" },
    { href: "/ogham", label: "Ogham Celtique" },
  ],
  "Vision IA & Rituels": [
    { href: "/chiromancie", label: "Chiromancie" },
    { href: "/reves", label: "Analyse des Rêves" },
    { href: "/sigil", label: "Générateur de Sigils" },
    { href: "/bibliomancie", label: "Bibliomancie" },
    { href: "/autel", label: "Autel Virtuel" },
    { href: "/revolution-solaire", label: "Révolution Solaire" },
  ],
  "Le Sanctuaire": [
    { href: "/tarifs", label: "Abonnements" },
    { href: "/mon-profil", label: "Mon Profil" },
    { href: "/support", label: "Support" },
    { href: "/journal", label: "Mon Journal" },
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgv", label: "Conditions générales" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[rgba(212,175,111,0.15)] bg-[#07040d]/90 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full border border-[rgba(212,175,111,0.4)] flex items-center justify-center bg-gradient-to-br from-[rgba(45,10,62,0.6)] to-[rgba(13,8,32,0.8)]">
                <Sparkles size={18} className="text-[#d4af6f]" />
              </div>
              <div>
                <div className="font-serif-display text-lg tracking-wider text-gradient-cream">MADAME CÉLESTE</div>
                <div className="text-[10px] tracking-[0.3em] text-[#8a6f3a] uppercase">Arts Divinatoires</div>
              </div>
            </div>
            <p className="font-serif-text italic text-[15px] text-[#c9b88a] leading-relaxed max-w-sm mb-6">
              &ldquo;Les astres murmurent leurs secrets à celui qui sait les écouter. Bienvenue dans un sanctuaire où l&apos;ancien et le moderne s&apos;unissent pour éclairer votre chemin.&rdquo;
            </p>
            <div className="text-[11px] tracking-widest uppercase text-[#8a6f3a]">
              Sanctuaire numérique · Voyance personnalisée par IA
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-5 font-serif-display">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[13px] text-[#c9b88a] hover:text-[#f5ecd9] transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="gold-line mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-[#8a6f3a]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Madame Céleste — Tous droits réservés</span>
          </div>
          <div className="flex items-center gap-5 tracking-wider">
            <Link href="/journal" className="hover:text-[#d4af6f] transition-colors">Mon Journal</Link>
            <span>·</span>
            <Link href="/tarifs" className="hover:text-[#d4af6f] transition-colors">Abonnements</Link>
            <span>·</span>
            <span>À but de divertissement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
