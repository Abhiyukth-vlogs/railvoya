import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchCard } from "../components/search/SearchCard";
import { useSearch, getTomorrowDate } from "../context/SearchContext";
import { BRAND_CONFIG } from "../config/brand";
import { VandeBharatHeroAnimation } from "../components/home/VandeBharatHeroAnimation";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Compass,
  CreditCard,
  Ticket,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Train,
  ArrowRight,
  Coins,
  TrendingUp,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { recentSearches, setFromStation, setToStation, setJourneyDate, setQuota } = useSearch();

  const handleRouteClick = (route: typeof BRAND_CONFIG.popularRoutes[0]) => {
    setFromStation({
      code: route.fromCode,
      name: route.fromName,
      city: route.fromName,
      state: "India",
      is_major_junction: true,
    });
    setToStation({
      code: route.toCode,
      name: route.toName,
      city: route.toName,
      state: "India",
      is_major_junction: true,
    });
    setJourneyDate(getTomorrowDate());

    const params = new URLSearchParams({
      origin: route.fromCode,
      destination: route.toCode,
      date: getTomorrowDate(),
      quota: "GN",
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Spacious Navy Hero Section */}
      <section className="relative bg-navy-primary text-white pt-16 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative train track vectors & glowing gradient backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600">
            <path d="M-100 200 C 300 150, 700 450, 1100 300" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeDasharray="16, 12" />
            <path d="M-100 220 C 300 170, 700 470, 1100 320" stroke="#F97316" strokeWidth="4" fill="none" strokeDasharray="16, 12" />
          </svg>
        </div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-orange-200 text-xs font-bold border border-white/15 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-action-orange" />
            <span>Modern Indian Train Travel Experience</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {BRAND_CONFIG.heroHeadline}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto">
            {BRAND_CONFIG.tagline} Discover routes across 180+ stations, track Vande Bharat telemetry, and book tickets with direct IRCTC connectivity.
          </p>

          {/* Quick Monetization & IRCTC Handoff Ribbon */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <Link
              to="/business-model"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all shadow-sm"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>How Platforms Make Money (Revenue Calculator)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href="https://www.irctc.co.in/eticket/train-search"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 hover:bg-blue-500/30 transition-all shadow-sm"
            >
              <span>Direct Official IRCTC Gateway</span>
              <ArrowRight className="w-3 h-3 text-blue-300" />
            </a>
          </div>
        </div>
      </section>

      {/* Vande Bharat Express Interactive Animation & Overlapping Search Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-20 space-y-6">
        <VandeBharatHeroAnimation />
        <SearchCard />
      </section>


      {/* Recent Searches (If Any) */}
      {recentSearches.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-text-secondary">
            <RotateCcw className="w-3.5 h-3.5 text-action-orange" />
            <span>Recent Searches</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {recentSearches.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const params = new URLSearchParams({
                    origin: s.fromCode,
                    destination: s.toCode,
                    date: s.date,
                    quota: s.quota,
                  });
                  navigate(`/search?${params.toString()}`);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-border-main hover:border-action-orange text-xs font-semibold text-navy-primary shadow-sm hover:shadow transition-all group"
              >
                <span>
                  {s.fromCode} → {s.toCode}
                </span>
                <span className="text-text-secondary font-normal">({s.date})</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-action-orange transition-colors" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Popular Routes Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-action-orange">High Frequency Corridors</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-primary tracking-tight mt-1">
              Popular Express Routes
            </h2>
          </div>
          <p className="text-sm text-text-secondary max-w-sm">
            Quickly plan your next trip with pre-configured high-speed trains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BRAND_CONFIG.popularRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => handleRouteClick(route)}
              className="bg-white rounded-2xl p-5 border border-border-main hover:border-action-orange shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-action-orange">
                    {route.type}
                  </span>
                  <span className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {route.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-xs text-text-secondary">Origin</p>
                    <p className="text-base font-extrabold text-navy-primary">{route.fromName}</p>
                    <span className="text-xs font-bold text-action-orange uppercase">({route.fromCode})</span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-action-orange group-hover:translate-x-1 transition-all" />

                  <div className="text-right">
                    <p className="text-xs text-text-secondary">Destination</p>
                    <p className="text-base font-extrabold text-navy-primary">{route.toName}</p>
                    <span className="text-xs font-bold text-action-orange uppercase">({route.toCode})</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle mt-4 flex items-center justify-between text-xs font-bold text-navy-primary group-hover:text-action-orange transition-colors">
                <span>Search available seats</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Step Simple Booking Guide */}
      <section className="bg-white py-16 border-y border-border-main">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-action-orange">How It Works</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-primary tracking-tight">
              Train Booking in Three Simple Steps
            </h2>
            <p className="text-sm text-text-secondary">
              A calmer, modern workflow designed to eliminate clutter and uncertainty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-border-subtle relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-navy-primary text-white flex items-center justify-center font-extrabold text-xl shadow-md mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-navy-primary mb-2">Search & Filter Trains</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Enter your station pair, choose from General or Tatkal quotas, and see live seat counts and transparent fares instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-border-subtle relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-action-orange text-white flex items-center justify-center font-extrabold text-xl shadow-md mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-navy-primary mb-2">Enter Passenger Details</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Add up to 6 travelers with berth preferences and meal selections. Opt-in to securely save frequent passengers for 1-click entry.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-border-subtle relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-status-success text-white flex items-center justify-center font-extrabold text-xl shadow-md mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-navy-primary mb-2">Instant Confirmation</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Review your itemized tax invoice, complete the simulated payment, receive your demo PNR, and download your branded e-ticket PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Helpful FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-action-orange">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-primary tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <details className="group bg-white rounded-2xl border border-border-main p-5 open:shadow-sm">
            <summary className="font-bold text-sm text-navy-primary cursor-pointer flex items-center justify-between list-none">
              <span>What is RailVoya?</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-3 text-xs text-text-secondary leading-relaxed border-t border-border-subtle pt-3">
              RailVoya is an independent train travel search and discovery website. We redesigned the train booking experience to feature generous whitespace, intuitive station autocomplete, calm color contrast, and instant accessibility.
            </p>
          </details>

          <details className="group bg-white rounded-2xl border border-border-main p-5 open:shadow-sm">
            <summary className="font-bold text-sm text-navy-primary cursor-pointer flex items-center justify-between list-none">
              <span>Are tickets booked on RailVoya valid for real train travel?</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-3 text-xs text-text-secondary leading-relaxed border-t border-border-subtle pt-3">
              No. RailVoya is currently running in <b>Honest Demo Mode</b>. All bookings, PNRs, and PDF tickets generated are simulated for software demonstration and user experience testing. No real railway reservations are created and no real bank charges are made.
            </p>
          </details>

          <details className="group bg-white rounded-2xl border border-border-main p-5 open:shadow-sm">
            <summary className="font-bold text-sm text-navy-primary cursor-pointer flex items-center justify-between list-none">
              <span>What quotas are supported in RailVoya?</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-3 text-xs text-text-secondary leading-relaxed border-t border-border-subtle pt-3">
              RailVoya models the authentic Indian Railways quota system: General Quota (GN), Tatkal Quota (TQ), Premium Tatkal (PT), Ladies Quota (LD), Lower Berth / Senior Citizen Quota (SS), and Divyangjan (HP).
            </p>
          </details>

          <details className="group bg-white rounded-2xl border border-border-main p-5 open:shadow-sm">
            <summary className="font-bold text-sm text-navy-primary cursor-pointer flex items-center justify-between list-none">
              <span>Are berth preferences guaranteed?</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-3 text-xs text-text-secondary leading-relaxed border-t border-border-subtle pt-3">
              No. Berth preferences submitted (e.g. Lower Berth, Window) are passenger requests. Actual coach and berth allocation is determined by Indian Railways PRS computerized charting algorithms.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};
