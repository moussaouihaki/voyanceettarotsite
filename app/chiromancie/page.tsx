"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/api-client";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Hand, Upload, Camera, RotateCcw, Sparkles, Lock, Crown } from "lucide-react";

export default function ChiromancePage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 7 * 1024 * 1024) {
      setError("Image trop volumineuse (maximum 7 Mo).");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setReading("");
    setError(null);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleReset = useCallback(() => {
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setImageFile(null);
    setReading("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    setIsStreaming(true);
    setReading("");
    setError(null);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const dataUrl = ev.target?.result as string;
        const imageBase64 = dataUrl.split(",")[1];
        const mimeType = imageFile.type;

        const res = await authFetch("/api/chiromancie", {
          method: "POST",
          body: JSON.stringify({
            imageBase64,
            mimeType,
            profile: {
              prenom: profile?.prenom,
              dateNaissance: profile?.dateNaissance,
            },
          }),
        });

        if (res.status === 401) {
          setError("Vous devez être connecté pour accéder à cette lecture.");
          setIsStreaming(false);
          return;
        }

        if (!res.ok || !res.body) {
          setError("Une erreur est survenue. Veuillez réessayer.");
          setIsStreaming(false);
          return;
        }

        const streamReader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await streamReader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          setReading((prev) => prev + chunk);
        }

        addReading({
          type: "chiromancie",
          title: "Lecture de la Main",
          content: full,
        });
      } catch {
        setError("Les lignes de votre main gardent leurs secrets... Réessayez.");
      } finally {
        setIsStreaming(false);
      }
    };

    reader.readAsDataURL(imageFile);
  }, [imageFile, profile, addReading]);

  if (!isHydrated) return null;

  if (!profile) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="luxe-card rounded-sm p-10 fade-in-up">
          <div className="absolute top-3 left-3 w-7 h-7 border-t border-l border-[rgba(212,175,111,0.4)]" />
          <div className="absolute top-3 right-3 w-7 h-7 border-t border-r border-[rgba(212,175,111,0.4)]" />
          <Lock size={36} className="text-[#d4af6f] mx-auto mb-5" />
          <div className="badge-gold mb-5">Accès requis</div>
          <h2 className="font-serif-display text-3xl text-gradient-cream mb-4">
            Chiromancie
          </h2>
          <p className="font-serif-text italic text-[#c9b88a] mb-8 leading-relaxed">
            Connectez-vous pour accéder à la lecture de votre paume par Madame Céleste.
          </p>
          <Link href="/connexion?redirect=/chiromancie" className="btn-gold inline-flex">
            <Crown size={14} />
            <span>Se connecter</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="fade-in-up">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-gold mb-5">
            <Sparkles size={11} className="inline mr-2" />
            Vision IA · Nouvelle fonctionnalité
          </div>
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6"
            style={{
              background: "radial-gradient(circle at 35% 35%, #d4af6f, #8a6f3a)",
              boxShadow: "0 0 40px rgba(212,175,111,0.3), 0 0 80px rgba(138,111,58,0.15)",
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Hand size={28} className="text-[#07040d]" />
            </div>
          </div>
          <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
            Chiromancie
          </h1>
          <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
            Téléversez une photo de votre paume
          </p>
          {profile.prenom && (
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">
              Bienvenue, {profile.prenom}
            </p>
          )}
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(212,175,111,0.3)]" />
          <Sparkles size={12} className="text-[#d4af6f]" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(212,175,111,0.3)]" />
        </div>

        {/* Drop zone */}
        <div
          className={`relative rounded-sm border-2 border-dashed transition-all duration-300 min-h-48 cursor-pointer overflow-hidden mb-4 ${
            isDragging
              ? "border-[#d4af6f] bg-[rgba(212,175,111,0.08)]"
              : imagePreview
              ? "border-[rgba(212,175,111,0.5)] bg-[rgba(7,4,13,0.6)]"
              : "border-[rgba(212,175,111,0.3)] bg-[rgba(7,4,13,0.4)] hover:border-[rgba(212,175,111,0.6)] hover:bg-[rgba(212,175,111,0.04)]"
          }`}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <div className="relative w-full min-h-48 flex items-center justify-center p-4">
              <img
                src={imagePreview}
                alt="Aperçu de votre paume"
                className="max-h-80 max-w-full rounded-sm object-contain"
                style={{ boxShadow: "0 0 30px rgba(212,175,111,0.2)" }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[rgba(7,4,13,0.8)] border border-[rgba(212,175,111,0.4)] flex items-center justify-center text-[#d4af6f] hover:bg-[rgba(212,175,111,0.15)] transition-colors"
                title="Supprimer l'image"
              >
                <span className="text-sm leading-none">✕</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-48 py-10 px-6 text-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(212,175,111,0.15), transparent)",
                  border: "1px solid rgba(212,175,111,0.3)",
                }}
              >
                {isDragging ? (
                  <Upload size={22} className="text-[#d4af6f]" />
                ) : (
                  <Camera size={22} className="text-[#d4af6f]" />
                )}
              </div>
              <div>
                <p className="font-serif-display text-[#c9b88a] text-lg mb-1">
                  {isDragging ? "Déposez votre photo ici" : "Glissez ou cliquez pour téléverser"}
                </p>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#8a6f3a]">
                  PNG, JPG, WEBP · Paume ouverte recommandée
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="btn-outline-gold text-sm mt-1"
              >
                <Upload size={13} />
                <span>Choisir une photo</span>
              </button>
            </div>
          )}

          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-[rgba(212,175,111,0.4)] pointer-events-none" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-[rgba(212,175,111,0.4)] pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[rgba(212,175,111,0.4)] pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[rgba(212,175,111,0.4)] pointer-events-none" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Tip */}
        <div className="flex items-start gap-3 mb-8 px-4 py-3 rounded-sm bg-[rgba(212,175,111,0.05)] border border-[rgba(212,175,111,0.1)]">
          <Hand size={14} className="text-[#d4af6f] mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-[#8a6f3a] font-serif-text italic leading-relaxed">
            Conseil : Photographiez votre main gauche (main de naissance) sous bonne lumière, paume ouverte face à l&apos;objectif
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center flex-wrap mb-4">
          {imageFile && (
            <button onClick={handleReset} className="btn-ghost" disabled={isStreaming}>
              <RotateCcw size={13} className="inline mr-2" />
              <span>Recommencer</span>
            </button>
          )}
          <button
            onClick={handleAnalyze}
            className="btn-gold"
            disabled={!imageFile || isStreaming}
          >
            <Sparkles size={14} />
            <span>
              {isStreaming ? "Lecture en cours…" : "Lire ma paume"}
            </span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-sm border border-[rgba(212,175,111,0.2)] bg-[rgba(212,175,111,0.05)] text-center">
            <p className="font-serif-text italic text-[#c9b88a] text-sm">{error}</p>
          </div>
        )}

        {/* Streaming result */}
        <ReadingResult text={reading} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
