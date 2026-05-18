"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  // Disable browser's native scroll restoration so it doesn't fight us
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    // rAF runs after paint — after any browser scroll restoration attempt
    const id = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
