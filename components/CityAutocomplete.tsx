"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin } from "lucide-react";

interface GeocodedPlace {
  displayName: string;
  shortName: string;
  country: string;
  lat: number;
  lon: number;
}

interface Props {
  value: string;
  onChange: (city: string, lat?: number, lon?: number) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  label?: string;
}

export default function CityAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  required,
  label,
}: Props) {
  const [results, setResults] = useState<GeocodedPlace[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(query)}`
      );
      if (res.ok) {
        const data: GeocodedPlace[] = await res.json();
        setResults(data);
        setHasSearched(true);
        setIsOpen(true);
      }
    } catch {
      setResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!newValue.trim()) {
      setResults([]);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(newValue);
    }, 400);
  };

  const handleSelect = (place: GeocodedPlace) => {
    const cityValue = `${place.shortName}, ${place.country}`;
    onChange(cityValue, place.lat, place.lon);
    setIsOpen(false);
    setResults([]);
    setHasSearched(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const inputClass = className ?? "luxe-input";

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-[#f5ecd9] mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <MapPin
          className="absolute left-3 pointer-events-none text-[#8a6f3a]"
          size={16}
        />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className={`${inputClass} pl-9 pr-9 w-full`}
          autoComplete="off"
        />
        {isLoading && (
          <span className="absolute right-3 pointer-events-none">
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="rgba(212,175,111,0.3)"
                strokeWidth="2"
              />
              <path
                d="M8 2a6 6 0 0 1 6 6"
                stroke="#d4af6f"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute left-0 right-0 mt-1 z-50 rounded-md border border-[rgba(212,175,111,0.3)] bg-[rgba(13,8,32,0.98)] shadow-lg overflow-hidden"
        >
          {results.length === 0 && hasSearched ? (
            <div className="px-4 py-3 text-sm text-[#8a6f3a] select-none">
              Aucune ville trouvée
            </div>
          ) : (
            <ul>
              {results.map((place, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelect(place)}
                    className="w-full text-left px-4 py-2 hover:bg-[rgba(212,175,111,0.08)] transition-colors"
                  >
                    <span className="block font-semibold text-[#f5ecd9]">
                      {place.shortName}
                    </span>
                    <span className="block text-xs text-[#8a6f3a]">
                      {place.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
