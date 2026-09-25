import React from "react";
import { Scale } from "lucide-react";

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-border-main shadow-card space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-action-orange flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-primary">Terms of Service</h1>
            <p className="text-xs text-text-secondary">Effective: September 2026</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
          <h2 className="text-sm font-bold text-navy-primary">1. Independent Service Agreement</h2>
          <p>
            RailVoya (`railvoya.co.in`) is an independent software design demonstration. By accessing or using this website, you acknowledge that RailVoya is not an official affiliate, authorized representative, or booking agency of Indian Railways, the Ministry of Railways, or IRCTC.
          </p>

          <h2 className="text-sm font-bold text-navy-primary">2. Demonstration Purpose Only</h2>
          <p>
            All tickets, PNR references, seat assignments, and journey documents generated on this site are for demonstration and UI exploration only. They are not valid travel credentials on Indian Railways.
          </p>

          <h2 className="text-sm font-bold text-navy-primary">3. Simulated Transactions</h2>
          <p>
            No real monetary charges are incurred. Any references to currency, fares, taxes, and refunds are calculated for simulation accuracy and do not involve real bank transactions.
          </p>
        </div>
      </div>
    </div>
  );
};
