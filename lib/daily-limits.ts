export type LimitKey = "tirages" | "voyanceMessages" | "runesTirages";

interface DailyUsage {
  date: string; // YYYY-MM-DD
  tirages: number;
  voyanceMessages: number;
  runesTirages: number;
}

const STORAGE_KEY = "voyance_daily_limits_v1";
const FREE_LIMITS: Record<LimitKey, number> = {
  tirages: 1,
  voyanceMessages: 3,
  runesTirages: 1,
};

function todayStr(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getUsage(): DailyUsage {
  const today = todayStr();
  if (typeof window === "undefined") {
    return { date: today, tirages: 0, voyanceMessages: 0, runesTirages: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DailyUsage = JSON.parse(raw);
      if (parsed.date === today) {
        return parsed;
      }
    }
  } catch {
    // ignore parse errors
  }
  return { date: today, tirages: 0, voyanceMessages: 0, runesTirages: 0 };
}

function setUsage(usage: DailyUsage): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // ignore write errors
  }
}

export function getCount(key: LimitKey): number {
  return getUsage()[key];
}

export function increment(key: LimitKey): void {
  const usage = getUsage();
  usage[key] = (usage[key] ?? 0) + 1;
  setUsage(usage);
}

export function canUse(key: LimitKey, tier: string): boolean {
  if (tier === "mystique" || tier === "vip") return true;
  if (tier === "decouverte") return getCount(key) < FREE_LIMITS[key];
  return false;
}

export function remaining(key: LimitKey, tier: string): number {
  if (tier === "mystique" || tier === "vip") return 999;
  const used = getCount(key);
  const limit = FREE_LIMITS[key];
  return Math.max(0, limit - used);
}
