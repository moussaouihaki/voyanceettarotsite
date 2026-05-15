export type NotificationType = "bienvenue" | "carte_du_jour" | "transit" | "info" | "abonnement";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: number;
  read: boolean;
  href?: string;
}

const STORAGE_KEY = "voyance_notifications_v2";

export function getNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 30)));
  } catch {}
}

export function addNotification(n: Omit<AppNotification, "id" | "date" | "read">): void {
  const notifications = getNotifications();
  const newNotif: AppNotification = {
    ...n,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: Date.now(),
    read: false,
  };
  saveNotifications([newNotif, ...notifications]);
}

export function markAsRead(id: string): void {
  const notifications = getNotifications();
  saveNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
}

export function markAllAsRead(): void {
  const notifications = getNotifications();
  saveNotifications(notifications.map((n) => ({ ...n, read: true })));
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

export function deleteNotification(id: string): void {
  const notifications = getNotifications();
  saveNotifications(notifications.filter((n) => n.id !== id));
}

// Seed welcome notification for new users
export function seedWelcomeNotification(prenom: string): void {
  const existing = getNotifications();
  const hasWelcome = existing.some((n) => n.type === "bienvenue");
  if (!hasWelcome) {
    addNotification({
      type: "bienvenue",
      title: `Bienvenue ${prenom} ✦`,
      message: "Votre sanctuaire est prêt. Découvrez votre carte du jour et explorez vos astres.",
      href: "/carte-du-jour",
    });
  }
}

// Seed a daily card reminder (max once per day)
export function seedDailyReminder(): void {
  const existing = getNotifications();
  const today = new Date().toDateString();
  const hasToday = existing.some(
    (n) => n.type === "carte_du_jour" && new Date(n.date).toDateString() === today
  );
  if (!hasToday) {
    addNotification({
      type: "carte_du_jour",
      title: "Votre carte du jour vous attend",
      message: "Les astres ont un message pour vous ce jour. Consultez votre guidance quotidienne.",
      href: "/carte-du-jour",
    });
  }
}
