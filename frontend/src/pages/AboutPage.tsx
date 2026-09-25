import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Info, Sparkles, Train, Code2, HeartHandshake } from "lucide-react";
import { BRAND_CONFIG } from "../config/brand";

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-action-orange text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design Mission & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-primary tracking-tight">
            About RailVoya
          </h1>
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            {BRAND_CONFIG.tagline} A modern, high-contrast, clutter-free reimagining of the Indian train travel booking journey.
          </p>
        </div>

        {/* Independent Status Disclosure Banner */}
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
            <Info className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Independent Travel Portal Disclosure</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
            RailVoya is an independent web application. We are <b>not an official affiliate, government agency, or authorized representative</b> of Indian Railways or IRCTC (Indian Railway Catering and Tourism Corporation). RailVoya does not issue actual government railway tickets in demo mode. All data, train numbers, and simulated bookings are presented purely for software demonstration and user experience exploration.
          </p>
        </div>

        {/* The Problem & Our Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-status-error flex items-center justify-center font-bold">
              ✕
            </div>
            <h3 className="text-lg font-bold text-navy-primary">Traditional Booking Stress</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Traditional railway booking interfaces are crowded with flashy advertisements, tiny font sizes, complex captcha obstacles, ambiguous error codes, and confusing booking states that induce anxiety during time-sensitive bookings.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-status-success flex items-center justify-center font-bold">
              ✓
            </div>
            <h3 className="text-lg font-bold text-navy-primary">The RailVoya Difference</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              RailVoya provides generous whitespace, accessible high-contrast colors, 1-click station swapping, instant keyboard autocomplete, transparent itemized fare breakdowns, and deterministic reconciliation.
            </p>
          </div>
        </div>

        {/* Technology Architecture */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-4">
          <div className="flex items-center gap-2 font-extrabold text-navy-primary text-lg">
            <Code2 className="w-5 h-5 text-action-orange" />
            <span>Technology Stack</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            RailVoya is built using modern production-grade engineering principles:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-main font-semibold">
            <li className="p-3 rounded-xl bg-slate-50 border border-border-subtle flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-action-orange"></span>
              <span>Frontend: React 18, TypeScript, Vite, Tailwind CSS</span>
            </li>
            <li className="p-3 rounded-xl bg-slate-50 border border-border-subtle flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-action-orange"></span>
              <span>Backend: Python 3.12, FastAPI, Pydantic v2</span>
            </li>
            <li className="p-3 rounded-xl bg-slate-50 border border-border-subtle flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-action-orange"></span>
              <span>Database: SQLite (local) / PostgreSQL ready with Alembic</span>
            </li>
            <li className="p-3 rounded-xl bg-slate-50 border border-border-subtle flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-action-orange"></span>
              <span>E-Ticket Engine: ReportLab vector PDF generator</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
