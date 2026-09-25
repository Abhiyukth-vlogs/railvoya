import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = "dark", className = "", showTagline = false }) => {
  const isLight = variant === "light";

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* Original SVG Monogram combining parallel tracks & train window */}
      <div className="relative w-10 h-10 rounded-xl bg-navy-primary flex items-center justify-center shadow-md border border-navy-700/50 group-hover:scale-105 transition-transform duration-200">
        <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
          {/* Train Front Silhouette */}
          <rect x="8" y="6" width="24" height="24" rx="6" fill="#1A3654" stroke="#DCE3ED" strokeWidth="1.5" />
          {/* Window */}
          <rect x="12" y="10" width="16" height="8" rx="2" fill="#E7F0F9" />
          {/* Headlights */}
          <circle cx="14" cy="23" r="2" fill="#F97316" />
          <circle cx="26" cy="23" r="2" fill="#F97316" />
          {/* Rail Track Accent */}
          <path d="M6 34L14 28H26L34 34" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="20" y1="28" x2="20" y2="35" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight font-extrabold text-2xl leading-none">
          <span className={isLight ? "text-white" : "text-navy-primary"}>Rail</span>
          <span className="text-action-orange">Voya</span>
        </div>
        {showTagline && (
          <span className={`text-[10px] tracking-wide font-medium mt-0.5 ${isLight ? "text-slate-300" : "text-text-secondary"}`}>
            Every journey, made simpler.
          </span>
        )}
      </div>
    </Link>
  );
};
