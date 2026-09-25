import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { useAuth } from "../../context/AuthContext";
import {
  Train,
  FileSearch,
  Activity,
  Luggage,
  HelpCircle,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Info,
} from "lucide-react";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Trains", path: "/", icon: Train },
    { name: "PNR Status", path: "/pnr", icon: FileSearch },
    { name: "Train Status", path: "/train-status", icon: Activity },
    { name: "My Trips", path: "/trips", icon: Luggage },
    { name: "Help", path: "/help", icon: HelpCircle },
  ];

  return (
    <>
      {/* Top Demo Banner */}
      <div className="bg-navy-900 text-slate-300 text-xs py-1.5 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              DEMO MODE
            </span>
            <span className="hidden sm:inline">
              Simulated Indian Railways booking environment. No real tickets are issued.
            </span>
            <span className="sm:hidden">Demo environment. No real tickets.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1">
              <Info className="w-3 h-3" /> Independent Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-main transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Logo showTagline={true} />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "text-action-orange bg-orange-50 font-bold"
                      : "text-text-secondary hover:text-navy-primary hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-action-orange" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-border-main hover:border-slate-300 bg-white text-sm font-medium text-navy-primary transition-all shadow-sm"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-action-orange flex items-center justify-center font-bold text-xs">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.full_name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-elevated border border-border-main py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-border-subtle">
                      <p className="text-xs text-text-secondary">Signed in as</p>
                      <p className="text-sm font-bold text-navy-primary truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-main hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account & Saved Passengers
                    </Link>
                    <Link
                      to="/trips"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-main hover:bg-slate-50 transition-colors"
                    >
                      <Luggage className="w-4 h-4 text-slate-400" />
                      My Booked Trips
                    </Link>
                    <div className="border-t border-border-subtle my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-status-error hover:bg-red-50 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4 text-status-error" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-navy-primary hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-action-orange hover:bg-action-hover shadow-sm transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-navy-primary hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-action-orange min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-main bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors min-h-[48px] ${
                      active ? "bg-orange-50 text-action-orange font-bold" : "text-text-main hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-action-orange" : "text-slate-400"}`} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border-main">
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 rounded-xl bg-slate-50">
                    <p className="text-xs text-text-secondary">Logged in as</p>
                    <p className="text-sm font-bold text-navy-primary">{user.full_name}</p>
                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-text-main hover:bg-slate-50 font-medium min-h-[44px]"
                  >
                    <User className="w-5 h-5 text-slate-400" />
                    Account & Saved Passengers
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base text-status-error hover:bg-red-50 font-medium min-h-[44px]"
                  >
                    <LogOut className="w-5 h-5 text-status-error" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-3 rounded-xl border border-border-main font-semibold text-navy-primary text-center hover:bg-slate-50 min-h-[44px]"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-3 rounded-xl bg-action-orange text-white font-semibold text-center hover:bg-action-hover min-h-[44px]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
