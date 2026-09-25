import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { TrainSearchResult } from "../types";
import { api } from "../services/api";
import { TrainCard } from "../components/train/TrainCard";
import {
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Clock,
  X,
  Search,
} from "lucide-react";

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const origin = searchParams.get("origin") || "NDLS";
  const destination = searchParams.get("destination") || "MMCT";
  const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const quota = searchParams.get("quota") || "GN";
  const classFilter = searchParams.get("travelClass") || "ALL";

  const [trains, setTrains] = useState<TrainSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [timeFilters, setTimeFilters] = useState<string[]>([]);
  const [trainTypeFilters, setTrainTypeFilters] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"departure" | "duration" | "fare">("departure");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch trains when parameters change
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await api.searchTrains(origin, destination, dateStr, classFilter, quota);
        setTrains(results);
      } catch (err: any) {
        setError(err.message || "Failed to load train results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [origin, destination, dateStr, quota, classFilter]);

  // Adjacent date stepper logic
  const handleDateStep = (days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    const newDateStr = d.toISOString().split("T")[0];
    
    // Prevent past date
    const today = new Date().toISOString().split("T")[0];
    if (newDateStr < today) return;

    searchParams.set("date", newDateStr);
    setSearchParams(searchParams);
  };

  // Filter & Sort logic
  const filteredTrains = useMemo(() => {
    return trains.filter((t) => {
      // 1. Time filter
      if (timeFilters.length > 0) {
        const depHour = parseInt(t.departure_time.split(":")[0], 10);
        let matchesTime = false;
        if (timeFilters.includes("early") && depHour < 6) matchesTime = true;
        if (timeFilters.includes("morning") && depHour >= 6 && depHour < 12) matchesTime = true;
        if (timeFilters.includes("afternoon") && depHour >= 12 && depHour < 18) matchesTime = true;
        if (timeFilters.includes("night") && depHour >= 18) matchesTime = true;
        if (!matchesTime) return false;
      }

      // 2. Train type filter
      if (trainTypeFilters.length > 0) {
        if (!trainTypeFilters.includes(t.train_type)) return false;
      }

      // 3. Available seats only
      if (availableOnly) {
        const hasAvail = t.classes.some((c) => c.status === "AVAILABLE");
        if (!hasAvail) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "departure") {
        return a.departure_time.localeCompare(b.departure_time);
      } else if (sortBy === "duration") {
        const parseDuration = (d: string) => {
          const parts = d.match(/(\d+)h\s*(\d+)?m?/);
          if (!parts) return 0;
          return parseInt(parts[1], 10) * 60 + (parts[2] ? parseInt(parts[2], 10) : 0);
        };
        return parseDuration(a.duration) - parseDuration(b.duration);
      } else if (sortBy === "fare") {
        const minFare = (t: TrainSearchResult) => Math.min(...t.classes.map((c) => c.fare));
        return minFare(a) - minFare(b);
      }
      return 0;
    });
  }, [trains, timeFilters, trainTypeFilters, availableOnly, sortBy]);

  const resetFilters = () => {
    setTimeFilters([]);
    setTrainTypeFilters([]);
    setAvailableOnly(false);
    setSortBy("departure");
  };

  const activeFiltersCount = timeFilters.length + trainTypeFilters.length + (availableOnly ? 1 : 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Top Search Summary & Date Stepper */}
      <div className="bg-navy-primary text-white border-b border-navy-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-200 uppercase tracking-wider mb-1">
              <span>Train Search</span>
              <span>•</span>
              <span>{quota} Quota</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{origin}</span>
              <span className="text-action-orange">→</span>
              <span>{destination}</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Showing trains on <b>{new Date(dateStr).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}</b>
            </p>
          </div>

          {/* Adjacent Date Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-navy-800/80 p-1.5 rounded-2xl border border-navy-700">
            <button
              onClick={() => handleDateStep(-1)}
              className="p-2.5 rounded-xl hover:bg-navy-700 text-slate-200 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="px-3 py-1 text-center">
              <span className="block text-[11px] uppercase font-bold text-slate-400">Journey Date</span>
              <span className="font-extrabold text-sm text-white">{dateStr}</span>
            </div>

            <button
              onClick={() => handleDateStep(1)}
              className="p-2.5 rounded-xl hover:bg-navy-700 text-slate-200 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Next Day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div className="flex items-center gap-2 font-extrabold text-navy-primary text-base">
                  <Filter className="w-4 h-4 text-action-orange" />
                  <span>Filters</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold text-action-orange hover:text-action-hover"
                  >
                    Reset all ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort Results By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange min-h-[44px]"
                >
                  <option value="departure">Departure Time (Earliest First)</option>
                  <option value="duration">Journey Duration (Fastest First)</option>
                  <option value="fare">Fare (Lowest First)</option>
                </select>
              </div>

              {/* Available Seats Only Toggle */}
              <div className="pt-2 border-t border-border-subtle">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-bold text-navy-primary">Available Seats Only</span>
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="w-5 h-5 rounded text-action-orange focus:ring-action-orange border-border-main cursor-pointer"
                  />
                </label>
              </div>

              {/* Departure Time Slots */}
              <div className="pt-4 border-t border-border-subtle">
                <span className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                  Departure Time
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: "early", label: "Early Morning", time: "00:00 - 06:00" },
                    { id: "morning", label: "Morning", time: "06:00 - 12:00" },
                    { id: "afternoon", label: "Afternoon", time: "12:00 - 18:00" },
                    { id: "night", label: "Night", time: "18:00 - 24:00" },
                  ].map((slot) => {
                    const isChecked = timeFilters.includes(slot.id);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => {
                          setTimeFilters((prev) =>
                            isChecked ? prev.filter((id) => id !== slot.id) : [...prev, slot.id]
                          );
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all min-h-[48px] ${
                          isChecked
                            ? "border-action-orange bg-orange-50/70 text-action-orange font-bold"
                            : "border-border-main bg-white hover:bg-slate-50 text-text-secondary"
                        }`}
                      >
                        <p className="font-bold text-xs">{slot.label}</p>
                        <p className="text-[10px] opacity-80">{slot.time}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Train Types */}
              <div className="pt-4 border-t border-border-subtle">
                <span className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                  Train Type
                </span>
                <div className="space-y-2">
                  {["Vande Bharat", "Rajdhani", "Shatabdi", "Superfast"].map((type) => {
                    const isChecked = trainTypeFilters.includes(type);
                    return (
                      <label key={type} className="flex items-center gap-2.5 text-sm font-medium text-text-main cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setTrainTypeFilters((prev) =>
                              isChecked ? prev.filter((t) => t !== type) : [...prev, type]
                            );
                          }}
                          className="w-4 h-4 rounded text-action-orange focus:ring-action-orange border-border-main"
                        />
                        <span>{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Main Column */}
          <main className="lg:col-span-9 space-y-4">
            {/* Mobile Filter & Sort Bar */}
            <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-border-main shadow-sm">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-navy-primary min-h-[44px]"
              >
                <SlidersHorizontal className="w-4 h-4 text-action-orange" />
                <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-border-main rounded-lg text-xs font-bold text-navy-primary min-h-[36px]"
                >
                  <option value="departure">Departure</option>
                  <option value="duration">Duration</option>
                  <option value="fare">Fare</option>
                </select>
              </div>
            </div>

            {/* Results Header Status */}
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-bold text-navy-primary">
                {loading ? "Searching trains..." : `${filteredTrains.length} Trains available for booking`}
              </p>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Data checked just now</span>
              </span>
            </div>

            {/* Loading Skeletons */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-6 border border-border-main shadow-card animate-pulse space-y-4">
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-12 bg-slate-100 rounded w-full"></div>
                    <div className="h-10 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 rounded-3xl p-8 border border-red-200 text-center space-y-3">
                <p className="text-sm font-bold text-status-error">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-action-orange text-white text-xs font-bold rounded-xl"
                >
                  Retry Search
                </button>
              </div>
            ) : filteredTrains.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-border-main text-center space-y-4 shadow-card">
                <div className="w-16 h-16 rounded-3xl bg-orange-100 text-action-orange flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-navy-primary">No Trains Found</h3>
                <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                  No direct trains match your selected filters between {origin} and {destination} on {dateStr}. Try adjusting your departure time filters or checking the next day.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2.5 rounded-xl border border-border-main font-semibold text-xs text-navy-primary hover:bg-slate-50"
                  >
                    Clear Active Filters
                  </button>
                  <button
                    onClick={() => handleDateStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-action-orange text-white font-bold text-xs hover:bg-action-hover"
                  >
                    Check Next Day (+1 Day)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTrains.map((train) => (
                  <TrainCard
                    key={train.train_number}
                    train={train}
                    journeyDate={dateStr}
                    quota={quota}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-border-main">
                <h3 className="text-lg font-extrabold text-navy-primary">Filter Trains</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-slate-400 hover:text-navy-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Available Toggle */}
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-bold text-navy-primary">Available Seats Only</span>
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="w-5 h-5 rounded text-action-orange focus:ring-action-orange border-border-main"
                  />
                </label>
              </div>

              {/* Train Types */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Train Type</span>
                <div className="space-y-2">
                  {["Vande Bharat", "Rajdhani", "Shatabdi", "Superfast"].map((type) => {
                    const isChecked = trainTypeFilters.includes(type);
                    return (
                      <label key={type} className="flex items-center gap-2.5 text-sm font-medium text-text-main cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setTrainTypeFilters((prev) =>
                              isChecked ? prev.filter((t) => t !== type) : [...prev, type]
                            );
                          }}
                          className="w-4 h-4 rounded text-action-orange focus:ring-action-orange border-border-main"
                        />
                        <span>{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-main">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 rounded-xl bg-action-orange text-white font-bold text-sm text-center shadow-md min-h-[48px]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
