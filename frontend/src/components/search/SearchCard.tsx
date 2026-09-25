import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StationAutocomplete } from "./StationAutocomplete";
import { useSearch, getTodayDate, getTomorrowDate } from "../../context/SearchContext";
import { BRAND_CONFIG } from "../../config/brand";
import { ArrowLeftRight, Calendar, Sparkles, Search, Layers, UserCheck } from "lucide-react";

export const SearchCard: React.FC = () => {
  const navigate = useNavigate();
  const {
    fromStation,
    toStation,
    journeyDate,
    travelClass,
    quota,
    setFromStation,
    setToStation,
    setJourneyDate,
    setTravelClass,
    setQuota,
    swapStations,
    saveRecentSearch,
  } = useSearch();

  const [fromError, setFromError] = useState("");
  const [toError, setToError] = useState("");
  const [dateError, setDateError] = useState("");
  const [swapAnim, setSwapAnim] = useState(false);
  const [flexibleWithDate, setFlexibleWithDate] = useState(false);
  const [trainWithAvailableBerth, setTrainWithAvailableBerth] = useState(false);
  const [divyangjanConcession, setDivyangjanConcession] = useState(false);
  const [railwayPassConcession, setRailwayPassConcession] = useState(false);

  const handleSwap = () => {
    setSwapAnim(true);
    swapStations();
    setTimeout(() => setSwapAnim(false), 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    setFromError("");
    setToError("");
    setDateError("");

    if (!fromStation) {
      setFromError("Please select an origin station.");
      hasError = true;
    }

    if (!toStation) {
      setToError("Please select a destination station.");
      hasError = true;
    }

    if (fromStation && toStation && fromStation.code === toStation.code) {
      setToError("Origin and destination cannot be the same station.");
      hasError = true;
    }

    if (!journeyDate) {
      setDateError("Please select a journey date.");
      hasError = true;
    } else if (journeyDate < getTodayDate()) {
      setDateError("Journey date cannot be in the past.");
      hasError = true;
    }

    if (hasError || !fromStation || !toStation) return;

    // Save to recent searches
    saveRecentSearch({
      fromCode: fromStation.code,
      fromName: fromStation.name,
      toCode: toStation.code,
      toName: toStation.name,
      date: journeyDate,
      quota,
      travelClass,
    });

    // Navigate to Search Results with query parameters
    const params = new URLSearchParams({
      origin: fromStation.code,
      destination: toStation.code,
      date: journeyDate,
      quota: divyangjanConcession ? "HP" : quota,
      travelClass,
      availableOnly: trainWithAvailableBerth ? "true" : "false",
      flexible: flexibleWithDate ? "true" : "false",
    });
    navigate(`/search?${params.toString()}`);
  };

  const isToday = journeyDate === getTodayDate();
  const isTomorrow = journeyDate === getTomorrowDate();

  return (
    <div className="w-full bg-white rounded-3xl shadow-elevated border border-border-main p-5 sm:p-6 lg:p-8">
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Main Station & Date Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Origin Station */}
          <div className="lg:col-span-4">
            <StationAutocomplete
              id="origin-station-input"
              label="From Station"
              placeholder="e.g. New Delhi (NDLS)"
              value={fromStation}
              onChange={(s) => {
                setFromStation(s);
                if (fromError) setFromError("");
              }}
              excludeCode={toStation?.code}
              error={fromError}
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center lg:col-span-1 -my-2 lg:my-0">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap origin and destination stations"
              className={`p-3 rounded-full bg-slate-100 text-navy-primary hover:bg-orange-100 hover:text-action-orange border border-border-main transition-all duration-300 shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center ${
                swapAnim ? "rotate-180 scale-110" : ""
              }`}
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Destination Station */}
          <div className="lg:col-span-4">
            <StationAutocomplete
              id="destination-station-input"
              label="To Station"
              placeholder="e.g. Mumbai Central (MMCT)"
              value={toStation}
              onChange={(s) => {
                setToStation(s);
                if (toError) setToError("");
              }}
              excludeCode={fromStation?.code}
              error={toError}
            />
          </div>

          {/* Journey Date */}
          <div className="lg:col-span-3">
            <label htmlFor="journey-date-input" className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Journey Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-5 h-5 text-action-orange/80" />
              </div>
              <input
                id="journey-date-input"
                type="date"
                min={getTodayDate()}
                value={journeyDate}
                onChange={(e) => {
                  setJourneyDate(e.target.value);
                  if (dateError) setDateError("");
                }}
                className={`w-full pl-10 pr-3 py-3.5 bg-white border text-text-main font-semibold text-base rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-action-orange focus:border-action-orange min-h-[48px] ${
                  dateError ? "border-status-error focus:ring-status-error" : "border-border-main hover:border-slate-300"
                }`}
              />
            </div>
            {dateError && <p className="mt-1 text-xs text-status-error font-medium">{dateError}</p>}

            {/* Quick Date Shortcuts */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setJourneyDate(getTodayDate())}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all min-h-[32px] ${
                  isToday ? "bg-action-orange text-white" : "bg-slate-100 text-text-secondary hover:bg-slate-200"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setJourneyDate(getTomorrowDate())}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all min-h-[32px] ${
                  isTomorrow ? "bg-action-orange text-white" : "bg-slate-100 text-text-secondary hover:bg-slate-200"
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Row: Class, Quota & Search Action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end pt-2 border-t border-border-subtle">
          {/* Travel Class Selector */}
          <div className="lg:col-span-4">
            <label htmlFor="travel-class-select" className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Travel Class
            </label>
            <select
              id="travel-class-select"
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="w-full px-3.5 py-3.5 bg-white border border-border-main hover:border-slate-300 text-text-main font-semibold text-sm rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-action-orange focus:border-action-orange min-h-[48px]"
            >
              {BRAND_CONFIG.travelClasses.map((cls) => (
                <option key={cls.code} value={cls.code}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quota Selector */}
          <div className="lg:col-span-4">
            <label htmlFor="quota-select" className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Quota
            </label>
            <select
              id="quota-select"
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className="w-full px-3.5 py-3.5 bg-white border border-border-main hover:border-slate-300 text-text-main font-semibold text-sm rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-action-orange focus:border-action-orange min-h-[48px]"
            >
              {BRAND_CONFIG.quotas.map((q) => (
                <option key={q.code} value={q.code}>
                  {q.name} ({q.code})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Search Button */}
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              id="search-trains-submit-btn"
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-action-orange hover:bg-action-hover text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-[0.99] min-h-[48px]"
            >
              <Search className="w-5 h-5 text-white" />
              <span>Search trains</span>
            </button>
          </div>
        </div>

        {/* IRCTC-Style Concessions & Quick Filters */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-text-secondary">
          <label className="flex items-center gap-2 cursor-pointer hover:text-navy-primary transition-colors">
            <input
              type="checkbox"
              checked={flexibleWithDate}
              onChange={(e) => setFlexibleWithDate(e.target.checked)}
              className="w-4 h-4 rounded text-action-orange focus:ring-action-orange border-slate-300"
            />
            <span>Flexible With Date</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-navy-primary transition-colors">
            <input
              type="checkbox"
              checked={trainWithAvailableBerth}
              onChange={(e) => setTrainWithAvailableBerth(e.target.checked)}
              className="w-4 h-4 rounded text-action-orange focus:ring-action-orange border-slate-300"
            />
            <span>Train with Available Berth</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-navy-primary transition-colors">
            <input
              type="checkbox"
              checked={divyangjanConcession}
              onChange={(e) => setDivyangjanConcession(e.target.checked)}
              className="w-4 h-4 rounded text-action-orange focus:ring-action-orange border-slate-300"
            />
            <span>Person With Disability Concession</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-navy-primary transition-colors">
            <input
              type="checkbox"
              checked={railwayPassConcession}
              onChange={(e) => setRailwayPassConcession(e.target.checked)}
              className="w-4 h-4 rounded text-action-orange focus:ring-action-orange border-slate-300"
            />
            <span>Railway Pass Concession</span>
          </label>
        </div>
      </form>
    </div>
  );
};
