"use client";

import { useMemo } from "react";

export default function StarBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 180 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.3,
      dur: `${Math.random() * 5 + 2}s`,
      delay: `${Math.random() * 6}s`,
      goldChance: Math.random() > 0.85,
    }));
  }, []);

  return (
    <div className="star-bg" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: s.goldChance ? "#d4af6f" : "white",
            boxShadow: s.goldChance ? "0 0 4px rgba(212, 175, 111, 0.6)" : undefined,
            "--dur": s.dur,
            "--delay": s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
