"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserProfile, TIER_LIMITS } from "@/contexts/UserProfileContext";
import { getSunSign } from "@/lib/astrology";
import { calculerProfil } from "@/lib/numerology";
import { computeNatalChart, formatPosition, ZODIAC_SYMBOLS, estimateTimezone } from "@/lib/astro-engine";
import CityAutocomplete from "@/components/CityAutocomplete";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Crown,
  CheckCircle2,
  Edit3,
  Trash2,
  Star,
  Sun,
  Moon,
  Heart,
  ScrollText,
} from "lucide-react";


export default function MonProfilPage() {
  const { profile, firebaseUser, saveProfile, clearProfile, history, clearHistory, isHydrated } = useUserProfile();
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [heureNaissance, setHeureNaissance] = useState("");
  const [villeNaissance, setVilleNaissance] = useState("");
  const [latNaissance, setLatNaissance] = useState<number | undefined>();
  const [lonNaissance, setLonNaissance] = useState<number | undefined>();
  const [genre, setGenre] = useState<"femme" | "homme" | "autre" | "">("");

  useEffect(() => {
    if (profile) {
      setPrenom(profile.prenom);
      setNom(profile.nom);
      setEmail(profile.email || "");
      setDateNaissance(profile.dateNaissance);
      setHeureNaissance(profile.heureNaissance || "");
      setVilleNaissance(profile.villeNaissance);
      setLatNaissance(profile.latNaissance);
      setLonNaissance(profile.lonNaissance);
      setGenre(profile.genre || "");
    }
  }, [profile]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isHydrated && !firebaseUser) {
      router.replace("/connexion?redirect=/mon-profil");
    }
  }, [isHydrated, firebaseUser, router]);

  if (!isHydrated || !firebaseUser) return null;

  const showForm = !profile || editing;

  const handleSave = () => {
    if (!prenom || !dateNaissance || !villeNaissance) return;
    saveProfile({
      prenom,
      nom,
      email,
      dateNaissance,
      heureNaissance,
      villeNaissance,
      latNaissance,
      lonNaissance,
      genre: genre || undefined,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre profil ?")) {
      clearProfile();
      clearHistory();
    }
  };

  const sunSign = profile?.dateNaissance ? getSunSign(profile.dateNaissance) : null;
  const numProfile = profile?.dateNaissance && profile?.prenom && profile?.nom
    ? calculerProfil(profile.prenom, profile.nom, profile.dateNaissance)
    : null;

  const tier = profile?.subscription || "decouverte";
  const tierLabel = tier === "vip" ? "Voyante VIP" : tier === "mystique" ? "Mystique" : "Découverte";

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {showForm ? (
        <div className="fade-in-up max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">Votre Sanctuaire</div>
            <h1 className="font-serif-display text-4xl md:text-5xl text-gradient-cream mb-4">
              {profile ? "Modifier mon Profil" : "Créer mon Sanctuaire"}
            </h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg">
              {profile ? "Mettez à jour vos informations sacrées" : "Vos coordonnées de naissance définissent votre carte céleste"}
            </p>
          </div>

          {/* Form card */}
          <div className="luxe-card rounded-sm p-8 md:p-10 space-y-6">
            <div className="text-center pb-4 border-b border-[rgba(212,175,111,0.15)]">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">Identité</div>
              <p className="font-serif-text italic text-[#8a6f3a] text-sm">Pour une lecture authentique et personnalisée</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="luxe-label">Prénom *</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Votre prénom"
                  className="luxe-input"
                />
              </div>
              <div>
                <label className="luxe-label">Nom de famille</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Votre nom"
                  className="luxe-input"
                />
              </div>
            </div>

            <div>
              <label className="luxe-label">Email (optionnel)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="luxe-input"
              />
            </div>

            <div>
              <label className="luxe-label">Genre (optionnel)</label>
              <div className="grid grid-cols-3 gap-3">
                {(["femme", "homme", "autre"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenre(g)}
                    className={`py-3 text-[12px] tracking-wider uppercase transition-all border ${
                      genre === g
                        ? "border-[#d4af6f] bg-[rgba(212,175,111,0.1)] text-[#e8c875]"
                        : "border-[rgba(212,175,111,0.18)] text-[#c9b88a] hover:border-[rgba(212,175,111,0.4)]"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 pb-4 border-b border-[rgba(212,175,111,0.15)]">
              <div className="divider-ornament">
                <span>Naissance</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="luxe-label flex items-center gap-2">
                  <Calendar size={11} /> Date de naissance *
                </label>
                <input
                  type="date"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  className="luxe-input"
                />
                <p className="text-[10px] text-[#8a6f3a] mt-1.5 tracking-wide">Indispensable pour votre signe solaire</p>
              </div>
              <div>
                <label className="luxe-label flex items-center gap-2">
                  <Clock size={11} /> Heure de naissance
                </label>
                <input
                  type="time"
                  value={heureNaissance}
                  onChange={(e) => setHeureNaissance(e.target.value)}
                  className="luxe-input"
                />
                <p className="text-[10px] text-[#8a6f3a] mt-1.5 tracking-wide">Requise pour ascendant & maisons</p>
              </div>
            </div>

            <div>
              <label className="luxe-label flex items-center gap-2">
                <MapPin size={11} /> Ville de naissance *
              </label>
              <CityAutocomplete
                value={villeNaissance}
                onChange={(city, lat, lon) => {
                  setVilleNaissance(city);
                  if (lat !== undefined) setLatNaissance(lat);
                  if (lon !== undefined) setLonNaissance(lon);
                }}
                placeholder="Ex: Paris, Lyon, Genève..."
                required
              />
              <p className="text-[10px] text-[#8a6f3a] mt-1.5 tracking-wide">Tapez pour rechercher parmi toutes les villes du monde</p>
            </div>

            <div className="pt-6 flex flex-wrap gap-3 justify-center">
              {profile && (
                <button onClick={() => setEditing(false)} className="btn-ghost">
                  Annuler
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!prenom || !dateNaissance || !villeNaissance}
                className="btn-gold"
              >
                <Sparkles size={14} />
                <span>{profile ? "Mettre à jour" : "Créer mon profil"}</span>
              </button>
            </div>

            <p className="text-center text-[10px] text-[#8a6f3a] tracking-wider mt-4">
              Vos données sont stockées localement et ne sont jamais partagées.
            </p>
          </div>
        </div>
      ) : (
        // ─── PROFILE DISPLAY ─────────────────────────────
        <div className="fade-in-up">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="badge-gold mb-5">
              <Crown size={11} className="inline mr-2" />
              {tierLabel}
            </div>
            <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
              Bonjour {profile?.prenom}
            </h1>
            <p className="font-serif-text italic text-[#c9b88a] text-lg">
              Votre sanctuaire personnel — vos étoiles vous accompagnent
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Identity card */}
            <div className="md:col-span-2 luxe-card-premium rounded-sm p-8 relative">
              <div className="absolute top-3 left-3 w-7 h-7 border-t border-l border-[rgba(212,175,111,0.4)]" />
              <div className="absolute bottom-3 right-3 w-7 h-7 border-b border-r border-[rgba(212,175,111,0.4)]" />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">Identité</div>
                  <h2 className="font-serif-display text-3xl text-cream">{profile?.prenom} {profile?.nom}</h2>
                </div>
                <button onClick={() => setEditing(true)} className="btn-ghost !p-2">
                  <Edit3 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-[14px]">
                <div>
                  <div className="text-[10px] tracking-wider uppercase text-[#8a6f3a] mb-1">Date de naissance</div>
                  <div className="text-cream">
                    {new Date(profile!.dateNaissance + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
                {profile?.heureNaissance && (
                  <div>
                    <div className="text-[10px] tracking-wider uppercase text-[#8a6f3a] mb-1">Heure</div>
                    <div className="text-cream">{profile.heureNaissance}</div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] tracking-wider uppercase text-[#8a6f3a] mb-1">Lieu</div>
                  <div className="text-cream">{profile?.villeNaissance}</div>
                </div>
                {profile?.email && (
                  <div>
                    <div className="text-[10px] tracking-wider uppercase text-[#8a6f3a] mb-1">Email</div>
                    <div className="text-cream truncate">{profile.email}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Sun sign card */}
            {sunSign && (
              <Link href="/horoscope" className="luxe-card rounded-sm p-8 text-center group hover:luxe-card-premium transition-all">
                <Sun size={32} className="text-[#d4af6f] mx-auto mb-4" />
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6f3a] mb-2">Signe solaire</div>
                <div className="font-serif-display text-3xl text-gradient-gold mb-2">{sunSign.symbol}</div>
                <div className="text-cream text-lg mb-1">{sunSign.name}</div>
                <div className="text-[11px] text-[#8a6f3a] mb-4">{sunSign.dates}</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {sunSign.keywords.slice(0, 3).map(k => (
                    <span key={k} className="text-[9px] text-[#c9b88a] tracking-wide">· {k}</span>
                  ))}
                </div>
              </Link>
            )}
          </div>

          {/* Quick stats */}
          {numProfile && (
            <div className="luxe-card rounded-sm p-8 mb-12">
              <div className="text-center mb-6">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2">Votre Profil Numérologique</div>
                <h3 className="font-serif-display text-2xl text-cream">Les nombres de votre destinée</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { label: "Chemin de vie", value: numProfile.cheminDeVie, highlight: true },
                  { label: "Expression", value: numProfile.expression },
                  { label: "Âme", value: numProfile.ame },
                  { label: "Année personnelle", value: numProfile.anneePersonnelle },
                ].map(({ label, value, highlight }) => (
                  <div key={label}>
                    <div className={`font-serif-display text-5xl mb-2 ${highlight ? "text-gradient-gold" : "text-cream"}`}>{value}</div>
                    <div className="text-[10px] tracking-widest uppercase text-[#8a6f3a]">{label}</div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href="/numerologie" className="text-[12px] tracking-widest uppercase text-[#d4af6f] hover:text-[#e8c875] transition-colors">
                  Voir le profil complet →
                </Link>
              </div>
            </div>
          )}

          {/* Natal chart quick view */}
          {profile?.dateNaissance && (() => {
            try {
              const chart = computeNatalChart({
                date: profile.dateNaissance,
                time: profile.heureNaissance || undefined,
                latitude: profile.latNaissance,
                longitude: profile.lonNaissance,
                timezoneOffset: estimateTimezone(profile.lonNaissance),
              });
              const sun = chart.planets["Soleil"];
              const moon = chart.planets["Lune"];
              const asc = chart.ascendant;
              return (
                <div className="luxe-card rounded-sm p-6 mb-6">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4 flex items-center gap-2">
                    <Star size={11} /> Votre Ciel Natal
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { label: "Soleil", symbol: "☉", position: sun },
                      { label: "Lune", symbol: "☽", position: moon },
                      { label: "Ascendant", symbol: "AC", position: profile.heureNaissance ? asc : null },
                    ].map(({ label, symbol, position }) => (
                      <div key={label} className="space-y-1">
                        <div className="text-2xl text-[#d4af6f]">{symbol}</div>
                        <div className="text-[10px] tracking-widest uppercase text-[#8a6f3a]">{label}</div>
                        {position ? (
                          <>
                            <div className="text-[14px] text-cream font-serif-display">{position.sign}</div>
                            <div className="text-[11px] text-[#8a6f3a]">{Math.floor(position.degreeInSign)}°</div>
                          </>
                        ) : (
                          <div className="text-[11px] text-[#5a4a2a] italic">Heure requise</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/mes-astres" className="text-[11px] tracking-widest uppercase text-[#d4af6f] hover:text-[#e8c875] transition-colors">
                      Voir ma carte du ciel complète →
                    </Link>
                  </div>
                </div>
              );
            } catch { return null; }
          })()}

          {/* Reading stats */}
          {history.length > 0 && (
            <div className="luxe-card rounded-sm p-6 mb-6">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-4">Vos statistiques</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-serif-display text-3xl text-gradient-gold">{history.length}</div>
                  <div className="text-[10px] tracking-widest uppercase text-[#8a6f3a] mt-1">Tirages</div>
                </div>
                <div>
                  <div className="font-serif-display text-3xl text-gradient-gold">
                    {(() => {
                      const days = new Set(history.map(r => new Date(r.date).toDateString())).size;
                      return days;
                    })()}
                  </div>
                  <div className="text-[10px] tracking-widest uppercase text-[#8a6f3a] mt-1">Jours actifs</div>
                </div>
                <div>
                  <div className="font-serif-display text-3xl text-gradient-gold">
                    {(() => {
                      const counts: Record<string, number> = {};
                      history.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
                      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]?.slice(0, 5) || "—";
                    })()}
                  </div>
                  <div className="text-[10px] tracking-widest uppercase text-[#8a6f3a] mt-1">Favori</div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription status */}
          <div className="luxe-card-premium rounded-sm p-10 mb-12 text-center">
            <Crown size={36} className="text-[#d4af6f] mx-auto mb-4" />
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-3">Votre abonnement</div>
            <h3 className="font-serif-display text-3xl text-cream mb-2">{tierLabel}</h3>
            <p className="font-serif-text italic text-[#c9b88a] mb-6">
              {tier === "decouverte" && "Vous profitez de l'expérience découverte"}
              {tier === "mystique" && "Vous êtes membre Mystique — toutes les lectures s'offrent à vous"}
              {tier === "vip" && "Vous êtes Voyante VIP — privilège suprême"}
            </p>

            <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
              {TIER_LIMITS[tier].features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-[#c9b88a]">
                  <CheckCircle2 size={15} className="text-[#d4af6f] flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {tier === "decouverte" && (
              <Link href="/tarifs" className="btn-gold">
                <Crown size={14} />
                <span>Passer Premium</span>
              </Link>
            )}
            {tier !== "decouverte" && (
              <Link href="/tarifs" className="btn-outline-gold">
                <span>Gérer mon abonnement</span>
              </Link>
            )}
          </div>

          {/* Quick links */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
              { href: "/carte-du-jour", icon: Sun, label: "Carte du Jour" },
              { href: "/profil-astral", icon: Moon, label: "Profil Astral" },
              { href: "/synastrie", icon: Heart, label: "Synastrie" },
              { href: "/tirage", icon: Sparkles, label: "Nouveau Tirage" },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="luxe-card rounded-sm p-5 text-center group">
                <Icon size={20} className="text-[#d4af6f] mx-auto mb-3" />
                <div className="text-[12px] tracking-wider uppercase text-[#c9b88a] group-hover:text-[#e8c875]">{label}</div>
              </Link>
            ))}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="luxe-card rounded-sm p-8 mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-2 flex items-center gap-2">
                    <ScrollText size={11} />
                    Historique
                  </div>
                  <h3 className="font-serif-display text-2xl text-cream">Vos lectures récentes</h3>
                </div>
                <button onClick={() => { if (confirm("Effacer l'historique ?")) clearHistory(); }} className="text-[#8a6f3a] hover:text-[#d4af6f] transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {history.slice(0, 10).map((r) => (
                  <div key={r.id} className="flex items-start gap-4 p-4 rounded-sm bg-[rgba(13,8,32,0.5)] border border-[rgba(212,175,111,0.1)]">
                    <div className="text-[#d4af6f] mt-1"><Star size={12} /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] tracking-widest uppercase text-[#d4af6f]">{r.type}</span>
                        <span className="text-[10px] text-[#8a6f3a]">{new Date(r.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <div className="text-[14px] text-cream">{r.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger zone */}
          <div className="text-center pt-8 border-t border-[rgba(212,175,111,0.1)]">
            <button onClick={handleDelete} className="text-[11px] tracking-widest uppercase text-[#8a6f3a] hover:text-red-400 transition-colors">
              Supprimer mon profil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
