"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirestoreUser, saveFirestoreUser, saveReadingToFirestore, getReadingsFromFirestore, clearReadingsFromFirestore, deleteReadingFromFirestore, updateReadingNotesInFirestore } from "@/lib/firebase-db";
import { getSunSign } from "@/lib/astrology";

export type SubscriptionTier = "decouverte" | "mystique" | "vip";

export interface UserProfile {
  prenom: string;
  nom: string;
  email: string;
  dateNaissance: string; // YYYY-MM-DD
  heureNaissance: string; // HH:MM
  villeNaissance: string;
  paysNaissance?: string;
  latNaissance?: number;
  lonNaissance?: number;
  genre?: "femme" | "homme" | "autre";
  subscription: SubscriptionTier;
  createdAt: number;
}

export interface ReadingHistory {
  id: string;
  type: string;
  title: string;
  date: number;
  content: string;
  meta?: Record<string, unknown>;
  notes?: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  history: ReadingHistory[];
  firebaseUser: FirebaseUser | null;
  saveProfile: (p: Omit<UserProfile, "createdAt" | "subscription"> & Partial<Pick<UserProfile, "createdAt" | "subscription">>) => Promise<{ ok: boolean; error?: string }>;
  updateSubscription: (tier: SubscriptionTier) => void;
  clearProfile: () => void;
  logout: () => Promise<void>;
  addReading: (r: Omit<ReadingHistory, "id" | "date">) => void;
  updateReadingNotes: (id: string, notes: string) => void;
  deleteReading: (id: string) => void;
  clearHistory: () => void;
  isHydrated: boolean;
  sunSignName: string | null;
}

const STORAGE_KEY = "voyance_user_profile_v1";
const HISTORY_KEY = "voyance_reading_history_v1";

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load local history on mount (will be overridden by Firestore once auth resolves)
  useEffect(() => {
    try {
      const histRaw = localStorage.getItem(HISTORY_KEY);
      if (histRaw) setHistory(JSON.parse(histRaw));
    } catch {}
  }, []);

  // Firebase Auth listener — loads profile from Firestore when logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const isAdmin = user.email === "info@celestevoyance.com";

        // Always try to read local data first
        let localProfile: UserProfile | null = null;
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) localProfile = JSON.parse(raw) as UserProfile;
        } catch {}

        const fsUser = await getFirestoreUser(user.uid);
        if (fsUser) {
          const { uid: _uid, updatedAt: _updatedAt, ...fsData } = fsUser;
          const fs = fsData as UserProfile;

          // Merge: prefer non-empty values — Firestore wins for filled fields,
          // localStorage fills gaps (handles case where Firestore write failed previously)
          const merged: UserProfile = {
            ...fs,
            prenom: fs.prenom || localProfile?.prenom || "",
            nom: fs.nom || localProfile?.nom || "",
            dateNaissance: fs.dateNaissance || localProfile?.dateNaissance || "",
            heureNaissance: fs.heureNaissance || localProfile?.heureNaissance || "",
            villeNaissance: fs.villeNaissance || localProfile?.villeNaissance || "",
            latNaissance: fs.latNaissance ?? localProfile?.latNaissance,
            lonNaissance: fs.lonNaissance ?? localProfile?.lonNaissance,
            genre: fs.genre || localProfile?.genre,
            subscription: isAdmin ? "vip" : (fs.subscription || localProfile?.subscription || "decouverte"),
          };

          // If localStorage had data that Firestore was missing, sync it back
          const needsSync = (!fs.prenom && merged.prenom) || (!fs.dateNaissance && merged.dateNaissance);
          if (needsSync || (isAdmin && fs.subscription !== "vip")) {
            saveFirestoreUser(user.uid, merged).catch(console.error);
          }

          setProfile(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } else {
          // No Firestore doc — create one from local data or defaults
          const mergedProfile: UserProfile = {
            prenom: localProfile?.prenom ?? "",
            nom: localProfile?.nom ?? "",
            email: user.email ?? localProfile?.email ?? "",
            dateNaissance: localProfile?.dateNaissance ?? "",
            heureNaissance: localProfile?.heureNaissance ?? "",
            villeNaissance: localProfile?.villeNaissance ?? "",
            latNaissance: localProfile?.latNaissance,
            lonNaissance: localProfile?.lonNaissance,
            genre: localProfile?.genre,
            subscription: isAdmin ? "vip" : (localProfile?.subscription ?? "decouverte"),
            createdAt: localProfile?.createdAt ?? Date.now(),
          };
          setProfile(mergedProfile);
          await saveFirestoreUser(user.uid, mergedProfile);
        }

        // Load reading history from Firestore (merges with any local-only readings)
        const fsReadings = await getReadingsFromFirestore(user.uid, 50);
        if (fsReadings.length > 0) {
          // Merge: combine Firestore + localStorage readings, deduplicate by id, sort by date
          let localHistory: ReadingHistory[] = [];
          try {
            const raw = localStorage.getItem(HISTORY_KEY);
            if (raw) localHistory = JSON.parse(raw);
          } catch {}
          const merged = [...fsReadings, ...localHistory]
            .reduce((acc, r) => (acc.some(x => x.id === r.id) ? acc : [...acc, r]), [] as ReadingHistory[])
            .sort((a, b) => b.date - a.date)
            .slice(0, 500);
          setHistory(merged);
          localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));
        }
      } else {
        // Not logged in — load from localStorage
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setProfile(JSON.parse(raw));
        } catch {}
      }
      setIsHydrated(true);
    });
    return () => unsub();
  }, []);

  const persistProfile = async (p: UserProfile | null): Promise<{ ok: boolean; error?: string }> => {
    if (p) localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    else localStorage.removeItem(STORAGE_KEY);
    setProfile(p);

    if (firebaseUser && p) {
      try {
        await saveFirestoreUser(firebaseUser.uid, {
          ...p,
          email: firebaseUser.email ?? p.email,
        });
        return { ok: true };
      } catch (e) {
        const msg = (e as { code?: string; message?: string })?.code === "permission-denied"
          ? "Accès Firestore refusé. Vérifiez les règles de sécurité Firebase."
          : "Erreur de sauvegarde sur le serveur. Réessayez.";
        console.error("[Firestore] persistProfile error", e);
        return { ok: false, error: msg };
      }
    }
    return { ok: true };
  };

  const persistHistory = (h: ReadingHistory[]) => {
    const trimmed = h.slice(0, 500);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    setHistory(trimmed);
  };

  const saveProfile: UserProfileContextType["saveProfile"] = (p) => {
    const full: UserProfile = {
      ...p,
      subscription: p.subscription ?? profile?.subscription ?? "decouverte",
      createdAt: profile?.createdAt ?? Date.now(),
    };
    return persistProfile(full);
  };

  const updateSubscription = (tier: SubscriptionTier) => {
    if (!profile) return;
    persistProfile({ ...profile, subscription: tier }).catch(console.error);
  };

  const clearProfile = () => { persistProfile(null).catch(console.error); };

  const logout = async () => {
    await signOut(auth);
    clearProfile();
  };

  const addReading: UserProfileContextType["addReading"] = (r) => {
    const next: ReadingHistory = {
      ...r,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: Date.now(),
    };
    persistHistory([next, ...history]);
    if (firebaseUser) {
      saveReadingToFirestore(firebaseUser.uid, next).catch(console.error);
    }
  };

  const clearHistory = () => {
    persistHistory([]);
    if (firebaseUser) {
      clearReadingsFromFirestore(firebaseUser.uid).catch(console.error);
    }
  };

  const updateReadingNotes: UserProfileContextType["updateReadingNotes"] = (id, notes) => {
    const updated = history.map((r) => r.id === id ? { ...r, notes } : r);
    persistHistory(updated);
    if (firebaseUser) {
      updateReadingNotesInFirestore(firebaseUser.uid, id, notes).catch(console.error);
    }
  };

  const deleteReading: UserProfileContextType["deleteReading"] = (id) => {
    const updated = history.filter((r) => r.id !== id);
    persistHistory(updated);
    if (firebaseUser) {
      deleteReadingFromFirestore(firebaseUser.uid, id).catch(console.error);
    }
  };

  const sunSignName = profile?.dateNaissance ? getSunSign(profile.dateNaissance).name : null;

  return (
    <UserProfileContext.Provider
      value={{ profile, history, firebaseUser, saveProfile, updateSubscription, clearProfile, logout, addReading, updateReadingNotes, deleteReading, clearHistory, isHydrated, sunSignName }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}

export const TIER_LIMITS: Record<SubscriptionTier, { readingsPerDay: number; features: string[] }> = {
  decouverte: {
    readingsPerDay: 1,
    features: ["Carte du jour", "1 tirage 3 cartes par jour", "Horoscope général", "Profil astral basique"],
  },
  mystique: {
    readingsPerDay: 999,
    features: ["Tirages illimités", "Tous les tirages (55+)", "Runes & I-Ching", "Profil astral complet", "Bilan des chakras", "Numérologie complète"],
  },
  vip: {
    readingsPerDay: 999,
    features: ["Tout Mystique inclus", "Chat voyance illimité", "Synastrie & compatibilité", "Lectures personnalisées approfondies", "Historique illimité", "Support prioritaire"],
  },
};

export function canAccessFeature(tier: SubscriptionTier | undefined, feature: "premium" | "vip"): boolean {
  if (!tier || tier === "decouverte") return false;
  if (feature === "premium") return tier === "mystique" || tier === "vip";
  if (feature === "vip") return tier === "vip";
  return false;
}
