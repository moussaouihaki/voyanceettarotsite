"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "pwa-install-dismissed";
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type Platform = "android" | "ios" | null;

export default function InstallBanner() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed as standalone app — don't show
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Already dismissed recently
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed && Date.now() - Number(dismissed) < DISMISS_DURATION_MS) return;

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroidChrome = /Android/.test(ua) && /Chrome/.test(ua);

    if (isIOS) {
      setPlatform("ios");
      setVisible(true);
    } else if (isAndroidChrome) {
      // Android: wait for beforeinstallprompt
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setPlatform("android");
        setVisible(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  async function installAndroid() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    } else {
      dismiss();
    }
    setDeferredPrompt(null);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Installer l'application"
      className="fixed bottom-0 left-0 right-0 z-[999] p-4 pb-safe"
    >
      <div className="mx-auto max-w-sm rounded-2xl border border-[#e8c875]/20 bg-[#0d0a1a]/95 p-4 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon-192.png"
              alt=""
              width={40}
              height={40}
              className="rounded-xl"
            />
            <div>
              <p className="text-sm font-semibold text-[#e8c875]">Céleste Voyance</p>
              <p className="text-xs text-[#b8a89a]">Installer sur l'écran d'accueil</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            aria-label="Fermer"
            className="mt-0.5 rounded-full p-1 text-[#b8a89a] transition hover:text-[#e8c875] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c875]/50"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* iOS instructions */}
        {platform === "ios" && (
          <p className="mb-3 text-xs leading-relaxed text-[#b8a89a]">
            Appuyez sur{" "}
            <span className="inline-flex items-center gap-1 font-medium text-[#e8c875]">
              <ShareIcon />
              Partager
            </span>{" "}
            en bas de votre navigateur, puis sur{" "}
            <span className="font-medium text-[#e8c875]">« Sur l'écran d'accueil »</span>.
          </p>
        )}

        {/* Android button */}
        {platform === "android" && (
          <button
            onClick={installAndroid}
            className="w-full rounded-xl bg-gradient-to-r from-[#c9943a] to-[#e8c875] py-2.5 text-sm font-semibold text-[#07040d] transition active:opacity-80"
          >
            Ajouter à l'écran d'accueil
          </button>
        )}

        {/* iOS arrow hint */}
        {platform === "ios" && (
          <div className="flex justify-center">
            <div className="text-[#e8c875]/40 text-xs">↓ bouton en bas de Safari</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
