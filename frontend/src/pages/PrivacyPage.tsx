import React from "react";
import { Shield } from "lucide-react";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-border-main shadow-card space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-action-orange flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-primary">Privacy Policy</h1>
            <p className="text-xs text-text-secondary">Last updated: September 2026</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
          <h2 className="text-sm font-bold text-navy-primary">1. Information We Collect</h2>
          <p>
            RailVoya operates with strict privacy hygiene. In local demo mode, passenger names, ages, contact emails, and phone numbers are stored in your local application database strictly for demonstrating booking lifecycle states, ticket generation, and trip history.
          </p>

          <h2 className="text-sm font-bold text-navy-primary">2. No Real Financial Data Collection</h2>
          <p>
            We do NOT collect, process, or store credit card numbers, debit card numbers, CVVs, UPI PINs, or bank passwords. All payment actions are simulated sandbox triggers.
          </p>

          <h2 className="text-sm font-bold text-navy-primary">3. Data Hygiene & Security</h2>
          <p>
            Passphrases are salted and hashed using PBKDF2 with 600,000 iterations. Sessions are authenticated via HttpOnly cookies that protect against cross-site scripting (XSS) extraction. Passenger data and PNRs are never placed in public URLs or plaintext analytics feeds.
          </p>

          <h2 className="text-sm font-bold text-navy-primary">4. Cookies</h2>
          <p>
            We use only strictly necessary session cookies (`railvoya_session`) to maintain user authentication. We do not use intrusive third-party cross-site advertising trackers.
          </p>
        </div>
      </div>
    </div>
  );
};
