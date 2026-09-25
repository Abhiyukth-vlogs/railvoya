import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("demo.traveler@railvoya.co.in");
    setPassword("DemoPassword123!");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-navy-primary tracking-tight">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Sign in to your RailVoya account to manage trips and saved passengers.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-status-error text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-action-orange" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. traveler@example.com"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange focus:bg-white min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-action-orange" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange focus:bg-white min-h-[44px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-action-orange hover:bg-action-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50"
            >
              <span>{loading ? "Signing in..." : "Sign In to RailVoya"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo shortcut */}
          <div className="pt-2 border-t border-border-subtle">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-action-orange text-xs font-bold transition-colors border border-orange-200 flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Fill Sample Demo Credentials</span>
            </button>
          </div>

          <div className="text-center text-xs text-text-secondary pt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-action-orange hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
