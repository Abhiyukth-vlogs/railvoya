import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ShieldCheck, Info, Heart, ArrowUpRight } from "lucide-react";
import { BRAND_CONFIG } from "../../config/brand";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-primary text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" showTagline={true} />
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              RailVoya is a fresh, modern railway travel discovery experience for India. Designed for speed, calm spacing, transparent pricing, and effortless journeys.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-navy-800/80 p-3 rounded-xl border border-navy-700 max-w-md">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <b>Demo Mode Active:</b> Sample stations, fares, and schedules are provided for local simulation. No real bookings or bank charges occur.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Travel Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Search Trains</Link>
              </li>
              <li>
                <Link to="/pnr" className="hover:text-white transition-colors">PNR Status Check</Link>
              </li>
              <li>
                <Link to="/train-status" className="hover:text-white transition-colors">Live Running Status</Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-white transition-colors">My Stored Trips</Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Support & Guides</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/help" className="hover:text-white transition-colors">FAQs & Booking Rules</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About RailVoya</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
              <li>
                <a
                  href="https://www.irctc.co.in/eticket/train-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-slate-400"
                >
                  Official IRCTC Portal <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Legal & Privacy</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Independent Status</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Independent Disclosure Callout */}
        <div className="py-8 border-b border-navy-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 text-slate-300 mt-0.5" />
            <p>
              <b>Independent Service Notice:</b> {BRAND_CONFIG.disclaimer}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} RailVoya ({BRAND_CONFIG.domain}). All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for Indian railway travelers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
