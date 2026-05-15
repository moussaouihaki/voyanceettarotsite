"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  glow?: boolean;
  spin?: boolean;
}

const SIZES = {
  xs:  "w-16 h-16",
  sm:  "w-28 h-28",
  md:  "w-44 h-44",
  lg:  "w-64 h-64",
  xl:  "w-80 h-80 md:w-96 md:h-96",
};

export default function CircleVideo({ size = "md", className = "", glow = true, spin = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  if (error) return null;

  return (
    <div className={`relative shrink-0 ${SIZES[size]} ${className}`}>
      {/* Rotating gold ring */}
      <div className="absolute inset-0 rounded-full border border-[rgba(212,175,111,0.35)] mandala-spin pointer-events-none" />
      <div className="absolute inset-1 rounded-full border border-[rgba(212,175,111,0.15)] pointer-events-none" style={{ animation: "orbit 30s linear infinite reverse" }} />

      {/* Glow */}
      {glow && (
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "0 0 40px rgba(212,175,111,0.15), 0 0 80px rgba(212,175,111,0.08)" }} />
      )}

      {/* Video circle */}
      <div className={`absolute inset-2 rounded-full overflow-hidden border border-[rgba(212,175,111,0.4)] bg-[#07040d] ${spin ? "animate-spin-slow" : ""}`}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#07040d]">
            <div className="w-8 h-8 rounded-full border border-[rgba(212,175,111,0.3)] mandala-spin" />
          </div>
        )}
        <video
          ref={videoRef}
          src="/videos/ambiance.mp4"
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
