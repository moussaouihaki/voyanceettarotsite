"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Upload, Camera, RotateCcw, Sparkles, Lock, Crown } from "lucide-react";

const STEPS = [
  {
    num: "1",
    label: "Préparez votre thé en feuilles",
    detail: "Utilisez un thé en feuilles non filtré dans votre tasse préférée.",
  },
  {
    num: "2",
    label: "Buvez en vous concentrant",
    detail: "Buvez votre thé en gardant une question ou intention à l'esprit.",
  },
  {
    num: "3",
    label: "Faites tourner la tasse",
    detail:
      "Faites tourner la tasse dans le sens anti-horaire 3 fois de suite.",
  },
  {
    num: "4",
    label: "Retournez sur la soucoupe",
    detail:
      "Retournez la tasse sur sa soucoupe et patientez 1 minute.",
  },
  {
    num: "5",
    label: "Photographiez le fond",
    detail:
      "Retournez la tasse à l'endroit et photographiez le fond sous bonne lumière.",
  },
];

export default function TasseomanciePage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Format non supporté. Veuillez choisir une image (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image est trop volumineuse (maximum 5 Mo).");
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setReading("");
    setError(null);
  }, [imagePreview]);

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
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setReading("");
    setError(null);
    setQuestion("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [imagePreview]);

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

        const res = await fetch("/api/tasseomancie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64,
            mimeType,
            question: question.trim() || undefined,
          }),
        });

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
          type: "tasseomancie",
          title: "Lecture des Feuilles de Thé",
          content: full,
        });
      } catch {
        setError(
          "Les feuilles de votre tasse gardent leurs secrets... Réessayez."
        );
      } finally {
        setIsStreaming(false);
      }
    };

    reader.readAsDataURL(imageFile);
  }, [imageFile, question, addReading]);

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
            Tasséomancie
          </h2>
          <p className="font-serif-text italic text-[#c9b88a] mb-8 leading-relaxed">
            Connectez-vous pour accéder à la lecture de vos feuilles de thé par
            Madame Céleste.
          </p>
          <Link
            href="/connexion?redirect=/tasseomancie"
            className="btn-gold inline-flex"
          >
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
            Vision IA · Art divinatoire ancestral
          </div>
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #8B5A2B, #4a2c0a)",
              boxShadow:
                "0 0 40px rgba(139,90,43,0.4), 0 0 80px rgba(74,44,10,0.2)",
            }}
          >
            🍵
          </div>
          <h1 className="font-serif-display text-5xl md:text-6xl mb-4" style={{ color: "#d4a96a" }}>
            Tasséomancie
          </h1>
          <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto leading-relaxed">
            L&apos;art ancestral de lire l&apos;avenir dans les feuilles de thé.
            Photographiez votre tasse et recevez votre guidance.
          </p>
          {profile.prenom && (
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] mt-4">
              Bienvenue, {profile.prenom}
            </p>
          )}
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(139,90,43,0.4)]" />
          <span className="text-lg">☕</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(139,90,43,0.4)]" />
        </div>

        {/* Instructions */}
        <div
          className="rounded-sm p-6 mb-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(74,44,10,0.3), rgba(139,90,43,0.1))",
            border: "1px solid rgba(139,90,43,0.35)",
          }}
        >
          <h2
            className="font-serif-display text-xl mb-5 text-center"
            style={{ color: "#d4a96a" }}
          >
            Préparez votre séance
          </h2>
          <div className="space-y-4">
            {STEPS.map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif-display font-bold"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(139,90,43,0.5), rgba(74,44,10,0.7))",
                    border: "1px solid rgba(212,169,106,0.5)",
                    color: "#d4a96a",
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <p
                    className="font-serif-display text-sm font-semibold mb-0.5"
                    style={{ color: "#d4a96a" }}
                  >
                    {step.label}
                  </p>
                  <p className="text-[12px] font-serif-text italic text-[#a08060] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={`relative rounded-sm border-2 border-dashed transition-all duration-300 min-h-48 cursor-pointer overflow-hidden mb-4 ${
            isDragging
              ? "bg-[rgba(139,90,43,0.12)]"
              : imagePreview
              ? "bg-[rgba(7,4,13,0.6)]"
              : "hover:bg-[rgba(139,90,43,0.06)]"
          }`}
          style={{
            borderColor: isDragging
              ? "rgba(212,169,106,0.9)"
              : imagePreview
              ? "rgba(212,169,106,0.5)"
              : "rgba(139,90,43,0.45)",
          }}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <div className="relative w-full min-h-48 flex items-center justify-center p-4">
              <img
                src={imagePreview}
                alt="Aperçu du fond de votre tasse"
                className="max-h-80 max-w-full rounded-sm object-contain"
                style={{ boxShadow: "0 0 30px rgba(139,90,43,0.3)" }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: "rgba(7,4,13,0.8)",
                  border: "1px solid rgba(212,169,106,0.4)",
                  color: "#d4a96a",
                }}
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
                  background:
                    "radial-gradient(circle, rgba(139,90,43,0.2), transparent)",
                  border: "1px solid rgba(139,90,43,0.4)",
                }}
              >
                {isDragging ? (
                  <Upload size={22} style={{ color: "#d4a96a" }} />
                ) : (
                  <Camera size={22} style={{ color: "#d4a96a" }} />
                )}
              </div>
              <div>
                <p
                  className="font-serif-display text-lg mb-1"
                  style={{ color: "#c9a870" }}
                >
                  {isDragging
                    ? "Déposez votre photo ici"
                    : "Glissez ou cliquez pour téléverser"}
                </p>
                <p
                  className="text-[11px] tracking-[0.15em] uppercase"
                  style={{ color: "#7a5a30" }}
                >
                  PNG, JPG, WEBP · Photographiez le fond de la tasse
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="btn-outline-gold text-sm mt-1"
              >
                <Upload size={13} />
                <span>Choisir une photo</span>
              </button>
            </div>
          )}

          {/* Corner ornaments */}
          <div
            className="absolute top-2 left-2 w-5 h-5 pointer-events-none"
            style={{
              borderTop: "1px solid rgba(212,169,106,0.4)",
              borderLeft: "1px solid rgba(212,169,106,0.4)",
            }}
          />
          <div
            className="absolute top-2 right-2 w-5 h-5 pointer-events-none"
            style={{
              borderTop: "1px solid rgba(212,169,106,0.4)",
              borderRight: "1px solid rgba(212,169,106,0.4)",
            }}
          />
          <div
            className="absolute bottom-2 left-2 w-5 h-5 pointer-events-none"
            style={{
              borderBottom: "1px solid rgba(212,169,106,0.4)",
              borderLeft: "1px solid rgba(212,169,106,0.4)",
            }}
          />
          <div
            className="absolute bottom-2 right-2 w-5 h-5 pointer-events-none"
            style={{
              borderBottom: "1px solid rgba(212,169,106,0.4)",
              borderRight: "1px solid rgba(212,169,106,0.4)",
            }}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Question focale */}
        <div className="mb-8">
          <label
            htmlFor="question-focale"
            className="block font-serif-display text-sm mb-2"
            style={{ color: "#d4a96a" }}
          >
            Question focale{" "}
            <span className="font-serif-text italic text-[12px] text-[#7a5a30]">
              (optionnel)
            </span>
          </label>
          <textarea
            id="question-focale"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Quelle question souhaitez-vous confier aux feuilles ?"
            rows={2}
            className="w-full rounded-sm resize-none font-serif-text italic text-sm placeholder:text-[#5a3a18] focus:outline-none transition-colors"
            style={{
              background: "rgba(74,44,10,0.2)",
              border: "1px solid rgba(139,90,43,0.35)",
              color: "#c9b88a",
              padding: "0.625rem 0.875rem",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(212,169,106,0.6)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(139,90,43,0.35)")
            }
          />
          <p className="text-[11px] text-[#5a3a18] mt-1 font-serif-text italic">
            Les feuilles répondront en tenant compte de votre intention.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center flex-wrap mb-4">
          {imageFile && (
            <button
              onClick={handleReset}
              className="btn-ghost"
              disabled={isStreaming}
            >
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
            <span>{isStreaming ? "Lecture en cours…" : "Lire les feuilles"}</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mt-4 p-4 rounded-sm text-center"
            style={{
              border: "1px solid rgba(139,90,43,0.3)",
              background: "rgba(74,44,10,0.15)",
            }}
          >
            <p className="font-serif-text italic text-[#c9b88a] text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Streaming result */}
        <ReadingResult text={reading} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
