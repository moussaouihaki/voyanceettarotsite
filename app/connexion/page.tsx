"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveFirestoreUser, getFirestoreUser } from "@/lib/firebase-db";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Crown, Star, Eye, EyeOff } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, firebaseUser, isHydrated } = useUserProfile();
  const redirect = searchParams.get("redirect") || "/mon-profil";
  const [mode, setMode] = useState<"login" | "register">("login");

  // Already logged in → redirect
  useEffect(() => {
    if (isHydrated && firebaseUser) {
      router.replace(redirect);
    }
  }, [isHydrated, firebaseUser, redirect, router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prenom, setPrenom] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError("Entrez votre email pour recevoir le lien de réinitialisation.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/connexion`,
      });
      setResetSent(true);
    } catch {
      setError("Impossible d'envoyer l'email. Vérifiez l'adresse saisie.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await saveFirestoreUser(cred.user.uid, {
          uid: cred.user.uid,
          email,
          prenom,
          nom: "",
          dateNaissance: "",
          heureNaissance: "",
          villeNaissance: "",
          paysNaissance: "",
          subscription: profile?.subscription ?? "decouverte",
          createdAt: Date.now(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push(redirect);
    } catch (err: unknown) {
      const msg = (err as { code?: string })?.code;
      if (msg === "auth/email-already-in-use") setError("Cet email est déjà utilisé.");
      else if (msg === "auth/invalid-credential" || msg === "auth/wrong-password") setError("Email ou mot de passe incorrect.");
      else if (msg === "auth/weak-password") setError("Mot de passe trop faible (minimum 6 caractères).");
      else if (msg === "auth/user-not-found") setError("Aucun compte avec cet email.");
      else setError("Une erreur s'est produite. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      // Only create profile if user doesn't already have one — never overwrite existing data
      const existing = await getFirestoreUser(cred.user.uid);
      if (!existing) {
        await saveFirestoreUser(cred.user.uid, {
          uid: cred.user.uid,
          email: cred.user.email ?? "",
          prenom: cred.user.displayName?.split(" ")[0] ?? "",
          nom: cred.user.displayName?.split(" ").slice(1).join(" ") ?? "",
          dateNaissance: "",
          heureNaissance: "",
          villeNaissance: "",
          subscription: "decouverte",
          createdAt: Date.now(),
        });
      }
      router.push(redirect);
    } catch {
      setError("Connexion Google annulée ou impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border border-[rgba(212,175,111,0.4)] flex items-center justify-center bg-[rgba(212,175,111,0.06)]">
                <Star size={28} className="text-[#d4af6f]" />
              </div>
              <div className="absolute inset-0 rounded-full border border-[rgba(212,175,111,0.2)] mandala-spin pointer-events-none" />
            </div>
          </div>
          <h1 className="font-serif-display text-3xl text-gradient-cream mb-2">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="text-[#8a6f3a] text-sm tracking-wide">
            {mode === "login"
              ? "Retrouvez votre espace personnel"
              : "Rejoignez Madame Céleste"}
          </p>
        </div>

        <div className="luxe-card rounded-sm p-8">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 border border-[rgba(212,175,111,0.3)] rounded-sm text-[#c9b88a] hover:text-[#f5ecd9] hover:border-[rgba(212,175,111,0.5)] transition-all text-sm tracking-wider disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M47.5 24.5c0-1.6-.15-3.2-.4-4.7H24v9h13.2c-.6 3.1-2.3 5.7-4.9 7.5v6.2h7.9c4.6-4.2 7.3-10.5 7.3-18z" fill="#4285F4"/>
              <path d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6.2c-2.1 1.4-4.9 2.3-8.1 2.3-6.2 0-11.5-4.2-13.4-9.8H2.4v6.4C6.4 42.5 14.6 48 24 48z" fill="#34A853"/>
              <path d="M10.6 28.5c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5V13H2.4C.9 16 0 19.9 0 24s.9 8 2.4 11l8.2-6.5z" fill="#FBBC05"/>
              <path d="M24 9.5c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.4 5.5 2.4 13.5l8.2 6.5C12.5 13.7 17.8 9.5 24 9.5z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[rgba(212,175,111,0.15)]" />
            <span className="text-[#8a6f3a] text-xs tracking-widest">OU</span>
            <div className="flex-1 h-px bg-[rgba(212,175,111,0.15)]" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-2">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                  placeholder="Votre prénom"
                  className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(212,175,111,0.2)] rounded-sm px-4 py-3 text-[#f5ecd9] placeholder-[#8a6f3a] focus:outline-none focus:border-[rgba(212,175,111,0.5)] text-sm transition-colors"
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(212,175,111,0.2)] rounded-sm px-4 py-3 text-[#f5ecd9] placeholder-[#8a6f3a] focus:outline-none focus:border-[rgba(212,175,111,0.5)] text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8a6f3a] mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(212,175,111,0.2)] rounded-sm px-4 py-3 pr-12 text-[#f5ecd9] placeholder-[#8a6f3a] focus:outline-none focus:border-[rgba(212,175,111,0.5)] text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a6f3a] hover:text-[#c9b88a] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs tracking-wide bg-[rgba(220,50,50,0.08)] border border-[rgba(220,50,50,0.2)] rounded-sm px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full !py-3.5 !text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Crown size={14} />
                  <span>{mode === "login" ? "Se connecter" : "Créer mon compte"}</span>
                </>
              )}
            </button>
          </form>

          {/* Forgot password */}
          {mode === "login" && (
            <div className="text-center mt-4">
              {resetSent ? (
                <p className="text-[11px] text-[#d4af6f] tracking-wide">
                  Un email de réinitialisation a été envoyé à {email}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="text-[11px] text-[#8a6f3a] hover:text-[#c9b88a] transition-colors tracking-wide underline underline-offset-2"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
          )}

          {/* Toggle mode */}
          <p className="text-center mt-5 text-[#8a6f3a] text-xs tracking-wide">
            {mode === "login" ? (
              <>
                Pas encore de compte ?{" "}
                <button onClick={() => { setMode("register"); setError(null); setResetSent(false); }} className="text-[#c9b88a] hover:text-[#f5ecd9] transition-colors underline underline-offset-2">
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                Déjà membre ?{" "}
                <button onClick={() => { setMode("login"); setError(null); setResetSent(false); }} className="text-[#c9b88a] hover:text-[#f5ecd9] transition-colors underline underline-offset-2">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center mt-6 text-[#8a6f3a] text-[11px] tracking-wider">
          <Link href="/cgv" className="hover:text-[#c9b88a] transition-colors">CGV</Link>
          {" · "}
          <Link href="/mentions-legales" className="hover:text-[#c9b88a] transition-colors">Mentions légales</Link>
        </p>
      </div>
    </main>
  );
}
