import React, { useState } from "react";
import { Zap, Gauge, Wind, Sparkles, Volume2, VolumeX } from "lucide-react";

export const VandeBharatHeroAnimation: React.FC = () => {
  const [speed, setSpeed] = useState<130 | 160>(160);
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-navy-900 via-navy-primary to-[#071324] border border-white/10 shadow-2xl p-4 sm:p-6 my-6">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-extrabold border border-orange-500/30">
            <Zap className="w-3.5 h-3.5 text-action-orange animate-pulse" />
            <span>VANDE BHARAT 2.0 • SEMI-HIGH SPEED</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            RTIS Satellite Tracking Active
          </span>
        </div>

        {/* Speed Toggle Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/10 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setSpeed(130)}
              className={`px-3 py-1 rounded-lg transition-all ${
                speed === 130 ? "bg-action-orange text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              130 km/h
            </button>
            <button
              type="button"
              onClick={() => setSpeed(160)}
              className={`px-3 py-1 rounded-lg transition-all ${
                speed === 160 ? "bg-action-orange text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              160 km/h MAX
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            title={soundEnabled ? "Mute Rail Ambience" : "Enable Rail Ambience"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Animation Stage */}
      <div className="relative h-44 sm:h-52 w-full flex items-center justify-center overflow-hidden select-none">
        {/* Dynamic Speed Lines in Background */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div
            className="w-full h-full flex flex-col justify-around animate-speedLines"
            style={{ animationDuration: speed === 160 ? "0.4s" : "0.7s" }}
          >
            <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent w-3/4"></div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-400 to-transparent w-full"></div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-2/3"></div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white to-transparent w-5/6"></div>
          </div>
        </div>

        {/* Overhead Catenary Electric Wire with Sparks */}
        <div className="absolute top-4 left-0 right-0 h-4 border-b border-cyan-400/40 pointer-events-none">
          <div className="absolute right-1/3 top-2 w-2 h-2 rounded-full bg-cyan-300 animate-ping"></div>
        </div>

        {/* Scaled Vande Bharat Train Composition */}
        <div className="relative z-10 w-full max-w-4xl flex items-center justify-center translate-y-3">
          <svg
            viewBox="0 0 1000 220"
            className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* White Aerodynamic Body Gradient */}
              <linearGradient id="vbWhiteBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#EDEDF2" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              {/* Vande Bharat Signature Royal Blue Stripe */}
              <linearGradient id="vbBlueStripe" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B3C95" />
                <stop offset="50%" stopColor="#1E40AF" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>

              {/* Tinted Aerodynamic Glass */}
              <linearGradient id="vbWindowGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="40%" stopColor="#1E293B" />
                <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              {/* Headlight Beam */}
              <linearGradient id="headlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#FDE047" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Powerful Projector Headlight Beam */}
            <polygon points="865,128 1050,90 1050,175 865,145" fill="url(#headlightBeam)" />

            {/* --- COACH 3 (Trailing Executive Chair Car) --- */}
            <g transform="translate(10, 50)">
              <rect x="0" y="30" width="220" height="90" rx="10" fill="url(#vbWhiteBody)" />
              {/* Royal Blue Top Stripe */}
              <rect x="0" y="42" width="220" height="12" fill="url(#vbBlueStripe)" />
              {/* Continuous Panoramic Glass Window Strip */}
              <rect x="15" y="60" width="190" height="28" rx="4" fill="url(#vbWindowGlass)" />
              {/* Individual Passenger Bay dividers */}
              <line x1="50" y1="60" x2="50" y2="88" stroke="#0F172A" strokeWidth="2" />
              <line x1="90" y1="60" x2="90" y2="88" stroke="#0F172A" strokeWidth="2" />
              <line x1="130" y1="60" x2="130" y2="88" stroke="#0F172A" strokeWidth="2" />
              <line x1="170" y1="60" x2="170" y2="88" stroke="#0F172A" strokeWidth="2" />
              {/* Orange Accent Stripe */}
              <rect x="0" y="94" width="220" height="6" fill="#F97316" />
              {/* Coach Skirt */}
              <rect x="10" y="118" width="200" height="12" fill="#334155" rx="3" />
              {/* Bogie Wheels */}
              <circle cx="45" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="45" cy="135" r="5" fill="#E2E8F0" />
              <circle cx="85" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="85" cy="135" r="5" fill="#E2E8F0" />
              <circle cx="145" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="145" cy="135" r="5" fill="#E2E8F0" />
              <circle cx="185" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="185" cy="135" r="5" fill="#E2E8F0" />
              <text x="110" y="112" fill="#1E293B" fontSize="9" fontWeight="bold" textAnchor="middle">
                EC • 22436
              </text>
            </g>

            {/* Vestibule Gangway 1 */}
            <rect x="232" y="90" width="16" height="46" rx="3" fill="#1E293B" />

            {/* --- COACH 2 (Middle Chair Car with Pantograph) --- */}
            <g transform="translate(250, 50)">
              {/* Roof Pantograph (Collector Arm) */}
              <line x1="100" y1="30" x2="115" y2="2" stroke="#EF4444" strokeWidth="3" />
              <line x1="115" y1="2" x2="135" y2="2" stroke="#EF4444" strokeWidth="4" />
              <line x1="135" y1="2" x2="150" y2="30" stroke="#EF4444" strokeWidth="3" />
              <circle cx="125" cy="2" r="3" fill="#38BDF8" className="animate-ping" />

              <rect x="0" y="30" width="240" height="90" rx="10" fill="url(#vbWhiteBody)" />
              <rect x="0" y="42" width="240" height="12" fill="url(#vbBlueStripe)" />
              <rect x="15" y="60" width="210" height="28" rx="4" fill="url(#vbWindowGlass)" />
              <line x1="55" y1="60" x2="55" y2="88" stroke="#0F172A" strokeWidth="2" />
              <line x1="95" y1="60" x2="95" y2="88" stroke="#0F172A" strokeWidth="2" />
              <line x1="135" y1="60" x2="135" y2="88" stroke="#0F172A" strokeWidth="2" />
              <line x1="175" y1="60" x2="175" y2="88" stroke="#0F172A" strokeWidth="2" />
              <rect x="0" y="94" width="240" height="6" fill="#F97316" />
              <rect x="10" y="118" width="220" height="12" fill="#334155" rx="3" />
              {/* Bogie Wheels */}
              <circle cx="50" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="50" cy="135" r="5" fill="#E2E8F0" />
              <circle cx="90" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="90" cy="135" r="5" fill="#E2E8F0" />
              <circle cx="160" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="160" cy="135" r="5" fill="#E2E8F0" />
              <circle cx="200" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="200" cy="135" r="5" fill="#E2E8F0" />
              <text x="120" y="112" fill="#1E293B" fontSize="9" fontWeight="bold" textAnchor="middle">
                C1 • VANDE BHARAT
              </text>
            </g>

            {/* Vestibule Gangway 2 */}
            <rect x="492" y="90" width="16" height="46" rx="3" fill="#1E293B" />

            {/* --- COACH 1: AERODYNAMIC NOSE CABIN (Locomotive Driving Trailer) --- */}
            <g transform="translate(510, 50)">
              {/* Bullet Aerodynamic Nose Contour */}
              <path
                d="M 0,30 
                   L 260,30 
                   C 310,30 350,60 365,85 
                   C 375,100 375,115 355,120 
                   L 0,120 Z"
                fill="url(#vbWhiteBody)"
              />

              {/* Aerodynamic Cockpit Windshield (Tinted Sloped Glass) */}
              <path
                d="M 230,36 
                   C 265,36 295,50 315,70 
                   L 275,70 
                   C 255,54 235,46 220,46 Z"
                fill="url(#vbWindowGlass)"
              />

              {/* Royal Blue Swept Swoosh Stripe */}
              <path
                d="M 0,42 
                   L 245,42 
                   C 290,46 325,72 345,95 
                   L 330,102 
                   C 310,82 280,56 235,54 
                   L 0,54 Z"
                fill="url(#vbBlueStripe)"
              />

              {/* Side Passenger Windows */}
              <rect x="20" y="60" width="180" height="28" rx="4" fill="url(#vbWindowGlass)" />
              <line x1="60" y1="60" x2="60" y2="88" stroke="#0F172A" strokeWidth="2" />
              <line x1="100" y1="60" x2="100" y2="88" stroke="#0F172A" strokeWidth="2" />
              <line x1="140" y1="60" x2="140" y2="88" stroke="#0F172A" strokeWidth="2" />

              {/* Saffron / Orange Bottom Accent */}
              <path d="M 0,94 L 280,94 C 310,98 335,110 345,116 L 0,116 Z" fill="#F97316" />

              {/* High-Intensity Dual LED Projector Headlights */}
              <ellipse cx="355" cy="98" rx="6" ry="4" fill="#FFFFFF" />
              <ellipse cx="355" cy="98" rx="3" ry="2" fill="#FDE047" />

              {/* Pilot Cow-Catcher Skirt */}
              <path d="M 270,120 L 360,120 L 350,132 L 250,132 Z" fill="#0F172A" />

              {/* Wheels */}
              <circle cx="60" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="60" cy="135" r="5" fill="#E2E8F0" />
              <circle cx="100" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="100" cy="135" r="5" fill="#E2E8F0" />
              <circle cx="190" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="190" cy="135" r="5" fill="#E2E8F0" />
              <circle cx="230" cy="135" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
              <circle cx="230" cy="135" r="5" fill="#E2E8F0" />

              {/* Indian Railways Ashoka Emblem / Vande Bharat Inscription */}
              <text x="130" y="110" fill="#0F172A" fontSize="9" fontWeight="900" letterSpacing="1">
                VANDE BHARAT
              </text>
            </g>

            {/* High-Speed Track Rails and Fast-Moving Sleepers */}
            <line x1="0" y1="198" x2="1000" y2="198" stroke="#94A3B8" strokeWidth="4" />
            <line x1="0" y1="205" x2="1000" y2="205" stroke="#475569" strokeWidth="6" />

            {/* Track Ballast Sleepers */}
            <g stroke="#334155" strokeWidth="3" opacity="0.8">
              {Array.from({ length: 25 }).map((_, i) => (
                <line key={i} x1={i * 42} y1="205" x2={i * 42 + 20} y2="216" />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom Live Rail Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <Gauge className="w-3.5 h-3.5 text-action-orange" />
            <span>Speed: {speed} km/h (Live Sensor)</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
            <Wind className="w-3 h-3 text-cyan-400" />
            Aerodynamic Drag: 0.28 Cd • 16-Coach EMU Rake
          </span>
        </div>

        <div className="flex items-center gap-2 font-medium text-[11px] text-slate-400">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Equipped with KAVACH Automatic Train Protection (ATP)</span>
        </div>
      </div>
    </div>
  );
};
