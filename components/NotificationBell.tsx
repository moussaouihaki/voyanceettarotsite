"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Star, Sun, Crown, Info } from "lucide-react";
import Link from "next/link";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  type AppNotification,
} from "@/lib/notifications";

const TYPE_ICONS: Record<AppNotification["type"], React.ReactNode> = {
  bienvenue: <Star size={14} className="text-[#d4af6f]" />,
  carte_du_jour: <Sun size={14} className="text-[#d4af6f]" />,
  transit: <Star size={14} className="text-[#c9b88a]" />,
  info: <Info size={14} className="text-[#c9b88a]" />,
  abonnement: <Crown size={14} className="text-[#d4af6f]" />,
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = () => {
    setNotifications(getNotifications());
    setUnread(getUnreadCount());
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
  };

  const handleMarkAll = () => {
    markAllAsRead();
    refresh();
  };

  const handleRead = (id: string) => {
    markAsRead(id);
    refresh();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
    refresh();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 text-[#8a6f3a] hover:text-[#c9b88a] transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#d4af6f] text-[#07040d] text-[9px] font-bold flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50 luxe-card rounded-sm overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(212,175,111,0.12)]">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f]">Notifications</span>
            {unread > 0 && (
              <button onClick={handleMarkAll} className="text-[10px] text-[#8a6f3a] hover:text-[#c9b88a] transition-colors tracking-wide">
                Tout lire
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto scroll-custom">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-[#8a6f3a] text-sm font-serif-text italic">
                Aucune notification
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleRead(n.id)}
                  className={`relative flex items-start gap-3 px-4 py-3 border-b border-[rgba(212,175,111,0.07)] last:border-b-0 transition-colors cursor-pointer ${
                    n.read ? "opacity-60" : "hover:bg-[rgba(212,175,111,0.04)]"
                  }`}
                >
                  {!n.read && (
                    <span className="absolute left-2 top-4 w-1.5 h-1.5 rounded-full bg-[#d4af6f]" />
                  )}
                  <div className="mt-0.5 shrink-0">{TYPE_ICONS[n.type]}</div>
                  <div className="flex-1 min-w-0">
                    {n.href ? (
                      <Link href={n.href} onClick={() => { handleRead(n.id); setOpen(false); }} className="block">
                        <div className="text-[13px] text-[#f5ecd9] font-serif-display leading-snug">{n.title}</div>
                        <div className="text-[11px] text-[#8a6f3a] mt-0.5 leading-relaxed">{n.message}</div>
                        <div className="text-[10px] text-[#5a4a2a] mt-1">
                          {new Date(n.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </Link>
                    ) : (
                      <>
                        <div className="text-[13px] text-[#f5ecd9] font-serif-display leading-snug">{n.title}</div>
                        <div className="text-[11px] text-[#8a6f3a] mt-0.5 leading-relaxed">{n.message}</div>
                        <div className="text-[10px] text-[#5a4a2a] mt-1">
                          {new Date(n.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, n.id)}
                    className="shrink-0 text-[#5a4a2a] hover:text-[#c9b88a] transition-colors mt-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
