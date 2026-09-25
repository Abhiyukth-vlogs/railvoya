import React, { useState, useEffect, useRef } from "react";
import { Station } from "../../types";
import { api } from "../../services/api";
import { MapPin, Search, X, Check } from "lucide-react";

interface StationAutocompleteProps {
  label: string;
  placeholder?: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
  id: string;
  excludeCode?: string;
  error?: string;
}

export const StationAutocomplete: React.FC<StationAutocompleteProps> = ({
  label,
  placeholder = "Search station or city...",
  value,
  onChange,
  id,
  excludeCode,
  error,
}) => {
  const [query, setQuery] = useState(value ? `${value.name} (${value.code})` : "");
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(`${value.name} (${value.code})`);
    } else {
      setQuery("");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset query text to current value if user clicked away without picking
        if (value) {
          setQuery(`${value.name} (${value.code})`);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await api.searchStations(query.trim());
        const filtered = excludeCode ? results.filter((s) => s.code !== excludeCode) : results;
        setSuggestions(filtered);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, isOpen, excludeCode]);

  const handleSelect = (station: Station) => {
    onChange(station);
    setQuery(`${station.name} (${station.code})`);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <MapPin className="w-5 h-5 text-action-orange/80" />
        </div>

        <input
          id={id}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className={`w-full pl-10 pr-10 py-3.5 bg-white border text-text-main font-semibold text-base rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-action-orange focus:border-action-orange min-h-[48px] ${
            error ? "border-status-error focus:ring-status-error" : "border-border-main hover:border-slate-300"
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 min-w-[36px] justify-center"
            aria-label="Clear station"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-status-error font-medium">{error}</p>}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-elevated border border-border-main overflow-hidden z-50 max-h-72 overflow-y-auto animate-in fade-in duration-100">
          {loading ? (
            <div className="p-4 text-center text-sm text-text-secondary">Searching stations...</div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-sm text-text-secondary">
              No matching stations found. Try "NDLS", "Delhi", or "Mumbai".
            </div>
          ) : (
            <div className="py-1 divide-y divide-border-subtle" role="listbox">
              {suggestions.map((station, idx) => {
                const isSelected = selectedIndex === idx || value?.code === station.code;
                return (
                  <button
                    key={station.code}
                    type="button"
                    onClick={() => handleSelect(station)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors min-h-[48px] ${
                      isSelected ? "bg-orange-50 text-navy-primary" : "hover:bg-slate-50 text-text-main"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-navy-primary shrink-0">
                        {station.code}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-navy-primary flex items-center gap-1.5">
                          <span>{station.name}</span>
                          {station.hindi_name && (
                            <span className="text-xs font-normal text-text-secondary">({station.hindi_name})</span>
                          )}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {station.city}, {station.state}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {station.code}
                      </span>
                      {value?.code === station.code && (
                        <Check className="w-4 h-4 text-action-orange" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
