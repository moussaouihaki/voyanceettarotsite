"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSunSign } from "@/lib/astrology";

export type SubscriptionTier = "decouverte" | "mystique" | "vip";

export interface UserProfile {
  prenom: string;
  nom: string;
  email: string;
  dateNaissance: string; // YYYY-MM-DD
  heureNaissance: string; // HH:MM
  villeNaissance: string;
  paysNaissance: string;
  genre?: "femme" | "homme" | "autre";
  subscription: SubscriptionTier;
  createdAt: number;
}

export interface ReadingHistory {
  id: string;
  type: string; // "tarot" | "rune" | "iching" | etc.
  title: string;
  date: number;
  content: string;
  meta?: Record<string, unknown>;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  history: ReadingHistory[];
  saveProfile: (p: Omit<UserProfile, "createdAt" | "subscription"> & Partial<Pick<UserProfile, "createdAt" | "subscription">>) => void;
  updateSubscription: (tier: SubscriptionTier) => void;
  clearProfile: () => void;
  addReading: (r: Omit<ReadingHistory, "id" | "date">) => void;
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
      const histRaw = localStorage.getItem(HISTORY_KEY);
      if (histRaw) setHistory(JSON.parse(histRaw));
    } catch {}
    setIsHydrated(true);
  }, []);

  const persistProfile = (p: UserProfile | null) => {
    if (p) localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    else localStorage.removeItem(STORAGE_KEY);
    setProfile(p);
  };

  const persistHistory = (h: ReadingHistory[]) => {
    const trimmed = h.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    setHistory(trimmed);
  };

  const saveProfile: UserProfileContextType["saveProfile"] = (p) => {
    const full: UserProfile = {
      ...p,
      subscription: p.subscription ?? profile?.subscription ?? "decouverte",
      createdAt: profile?.createdAt ?? Date.now(),
    };
    persistProfile(full);
  };

  const updateSubscription = (tier: SubscriptionTier) => {
    if (!profile) return;
    persistProfile({ ...profile, subscription: tier });
  };

  const clearProfile = () => persistProfile(null);

  const addReading: UserProfileContextType["addReading"] = (r) => {
    const next: ReadingHistory = {
      ...r,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: Date.now(),
    };
    persistHistory([next, ...history]);
  };

  const clearHistory = () => persistHistory([]);

  const sunSignName = profile?.dateNaissance ? getSunSign(profile.dateNaissance).name : null;

  return (
    <UserProfileContext.Provider
      value={{ profile, history, saveProfile, updateSubscription, clearProfile, addReading, clearHistory, isHydrated, sunSignName }}
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
