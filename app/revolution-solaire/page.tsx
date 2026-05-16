"use client";

import { useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/api-client";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { getSunSign } from "@/lib/astrology";
import ReadingResult from "@/components/ReadingResult";
import { Star, Sparkles, ArrowRight, User } from "lucide-react";

// ── RS date helpers ───────────────────────────────────────────────

function parseDateNaissance(raw: string): { month: number; day: number } | null {
  // YYYY-MM-DD
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return { month: Number(iso[2]), day: Number(iso[3]) };
  // DD/MM/YYYY
  const fr = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (fr) return { month: Number(fr[2]), day: Number(fr[1]) };
  return null;
}

function getRSYear(dateNaissance: string): { rsDate: string; year: number } | null {
  const parsed = parseDateNaissance(dateNaissance);
  if (!parsed) return null;
  const { month, day } = parsed;
  const today = new Date();
  const todayYear = today.getFullYear();
  const rsThisYear = new Date(todayYear, month - 1, day);
  const year = rsThisYear < today ? todayYear + 1 : todayYear;
  const rsDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  return { rsDate, year };
}

// ── Page ─────────────────────────────────────────────────────────

export default function RevolutionSolairePage() {
  const { profile, addReading } = useUserProfile();
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // ── Profile guard ──
  if (!profile || !profile.dateNaissance) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center fade-in-up">
        <div className="mb-6">
          <Star size={40} className="text-[#d4af6f] mx-auto mb-4 float-slow" />
          <div className="badge-gold mb-5">Astrologie · VIP</div>
          <h1 className="font-serif-display text-4xl text-gradient-cream mb-4">
            Révolution Solaire
          </h1>
          <p className="font-serif-text italic text-[#c9b88a] mb-8">
            Votre profil est incomplet. Veuillez renseigner votre date de naissance pour accéder à votre Révolution Solaire.
          </p>
        </div>
        <Link href="/mon-profil" className="btn-gold inline-flex items-center gap-2">
          <User size={14} />
          <span>Compléter mon profil</span>
        </Link>
      </div>
    );
  }

  const { prenom, dateNaissance, heureNaissance, latNaissance, lonNaissance, villeNaissance } = profile;

  const sunSign = getSunSign(dateNaissance);
  const rsInfo = getRSYear(dateNaissance);

  const handleObtenir = async () => {
    if (!rsInfo) return;
    setIsStreaming(true);
    setReading("");

    try {
      const res = await authFetch("/api/revolution-solaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            prenom,
            dateNaissance,
            heureNaissance: heureNaissance || undefined,
            villeNaissance: villeNaissance || undefined,
            lat: latNaissance,
            lon: lonNaissance,
          },
        }),
      });

      if (!res.ok || !res.body) throw new Error("Erreur réseau");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setReading((prev) => prev + chunk);
      }

      addReading({
        type: "revolution-solaire",
        title: `Révolution Solaire ${rsInfo.year}`,
        content: full,
      });
    } catch {
      setReading("Les astres sont voilés… Réessayez dans quelques instants.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    setReading("");
    setIsStreaming(false);
  };

  const nextRsDate = rsInfo
    ? `${rsInfo.rsDate}`
    : null;

  const nextNextYear = rsInfo ? rsInfo.year + 1 : null;
  const parsedBirthday = parseDateNaissance(dateNaissance);
  const birthdayNextYear = parsedBirthday && nextNextYear
    ? `${String(parsedBirthday.day).padStart(2, "0")}/${String(parsedBirthday.month).padStart(2, "0")}/${nextNextYear}`
    : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="fade-in-up">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="badge-gold mb-5">
            <Star size={11} className="inline mr-2" />
            Astrologie · VIP
          </div>
          <div className="font-serif-display text-6xl text-[#d4af6f] mb-3 float-slow">☀</div>
          <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
            Révolution Solaire
          </h1>
          <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-xl mx-auto">
            Chaque année, le Soleil revient exactement à sa position natale — c&apos;est votre Révolution Solaire, carte du ciel de votre année à venir.
          </p>
        </div>

        {/* ── Info card ── */}
        <div className="luxe-card rounded-sm p-7 mb-8">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-6">
            Votre profil astral
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-[#d4af6f] bg-[rgba(212,175,111,0.08)] flex items-center justify-center shrink-0">
                <User size={16} className="text-[#d4af6f]" />
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-0.5">Prénom</div>
                <div className="font-serif-display text-cream text-lg">{prenom}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-[#d4af6f] bg-[rgba(212,175,111,0.08)] flex items-center justify-center shrink-0 text-[#d4af6f] font-serif-display text-2xl">
                {sunSign?.symbol ?? "☀"}
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-0.5">Signe solaire natal</div>
                <div className="font-serif-display text-cream text-lg">{sunSign?.name ?? "—"}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-[rgba(212,175,111,0.3)] bg-[rgba(212,175,111,0.04)] flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-[#d4af6f]" />
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-0.5">Date de naissance</div>
                <div className="text-cream text-[14px]">{dateNaissance}</div>
              </div>
            </div>

            {rsInfo && (
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full border border-[rgba(212,175,111,0.3)] bg-[rgba(212,175,111,0.04)] flex items-center justify-center shrink-0">
                  <Star size={14} className="text-[#d4af6f]" />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-0.5">Révolution Solaire</div>
                  <div className="text-cream text-[14px]">
                    {rsInfo.year}–{rsInfo.year + 1}
                  </div>
                  {nextRsDate && birthdayNextYear && (
                    <div className="text-[11px] text-[#8a6f3a] mt-0.5">
                      Du {nextRsDate} au {birthdayNextYear}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Explanation ── */}
        <div className="luxe-card-premium rounded-sm p-7 mb-8">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Qu&apos;est-ce que la Révolution Solaire ?</div>
          <p className="font-serif-text text-[#e8dcc0] text-[15px] leading-relaxed italic">
            La Révolution Solaire est le thème astral calculé au moment précis où le Soleil revient à sa position exacte de votre naissance, chaque année. Cette carte céleste dessine les grandes tendances de vos douze prochains mois — amour, carrière, croissance intérieure — et révèle les forces planétaires qui influenceront votre chemin.
          </p>
          <p className="font-serif-text text-[#c9b88a] text-[14px] leading-relaxed mt-3">
            Combinée à votre thème natal, elle offre une vision unique et personnalisée de l&apos;année à venir, permettant d&apos;anticiper les opportunités et de naviguer les défis avec sagesse.
          </p>
        </div>

        {/* ── CTA button ── */}
        {!reading && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleObtenir}
              disabled={isStreaming || !rsInfo}
              className="btn-gold"
            >
              {isStreaming ? (
                <>
                  <Sparkles size={14} className="animate-pulse" />
                  <span>Les astres parlent…</span>
                </>
              ) : (
                <>
                  <Star size={14} />
                  <span>Obtenir ma Révolution Solaire</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Streaming indicator (no reading yet) ── */}
        {isStreaming && !reading && (
          <div className="text-center mb-8">
            <Sparkles size={20} className="text-[#d4af6f] mx-auto animate-pulse" />
            <p className="font-serif-text italic text-[#c9b88a] text-sm mt-2">
              Madame Céleste consulte les astres…
            </p>
          </div>
        )}

        {/* ── Reading result ── */}
        <ReadingResult text={reading} isStreaming={isStreaming} />

        {/* ── Reset button ── */}
        {reading && !isStreaming && (
          <div className="flex justify-center mt-8">
            <button onClick={handleReset} className="btn-ghost">
              <span>Nouvelle lecture</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
