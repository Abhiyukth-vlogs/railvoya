import React, { useState } from "react";
import {
  Coins,
  TrendingUp,
  ShieldCheck,
  Building2,
  Utensils,
  CreditCard,
  Car,
  Calculator,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export const BusinessMonetizationPage: React.FC = () => {
  const [dailyBookings, setDailyBookings] = useState<number>(10000);
  const [assuredOptInRate, setAssuredOptInRate] = useState<number>(35); // 35% opt-in
  const [acClassRatio, setAcClassRatio] = useState<number>(45); // 45% AC, 55% Non-AC

  // Financial Calculations based on real OTA unit economics (ixigo / ConfirmTkt)
  const acBookings = dailyBookings * (acClassRatio / 100);
  const nonAcBookings = dailyBookings * ((100 - acClassRatio) / 100);

  // 1. IRCTC Authorized Service Convenience Fee
  // ₹40 per AC ticket, ₹20 per Non-AC ticket
  const dailyConvenienceFee = acBookings * 40 + nonAcBookings * 20;

  // 2. ixigo Assured / Trip Protection (₹99 per passenger, with ~80% gross margin)
  const assuredBookings = dailyBookings * (assuredOptInRate / 100);
  const dailyAssuredRevenue = assuredBookings * 99;
  const dailyAssuredGrossProfit = dailyAssuredRevenue * 0.72; // net of claims (~28% claim/cancel rate)

  // 3. Travel Insurance Commission (₹0.45 per passenger, 25% agent commission)
  const dailyInsuranceCommission = dailyBookings * 0.45 * 0.25;

  // 4. Ancillaries (Food delivery, station cabs, hotels ~ ₹12 per booking average)
  const dailyAncillaryRevenue = dailyBookings * 12;

  // Totals
  const totalDailyRevenue = dailyConvenienceFee + dailyAssuredGrossProfit + dailyInsuranceCommission + dailyAncillaryRevenue;
  const monthlyRevenue = totalDailyRevenue * 30;
  const annualRevenue = totalDailyRevenue * 365;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-action-orange text-xs font-black">
            <Coins className="w-4 h-4" />
            <span>BUSINESS MODEL & REVENUE ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-primary tracking-tight">
            How Railway Travel Platforms Like ixigo Make Money
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Detailed breakdown of the exact monetization architecture, legal IRCTC fee structures, value-added products, and interactive revenue model used by top Indian travel tech companies.
          </p>
        </div>

        {/* Interactive Revenue Simulator */}
        <div className="bg-gradient-to-br from-navy-900 via-navy-primary to-[#071324] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl text-white space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-action-orange uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                Interactive Simulator
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Estimate Daily & Annual Revenue Potential
              </h2>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
              Real OTA Economics
            </span>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Bookings Slider */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">Daily Bookings</span>
                <span className="text-base font-black text-orange-400 font-mono">
                  {dailyBookings.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={dailyBookings}
                onChange={(e) => setDailyBookings(Number(e.target.value))}
                className="w-full accent-action-orange cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block">ixigo processes ~150,000+ bookings/day</span>
            </div>

            {/* ixigo Assured Opt-in Slider */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">Assured Protection Opt-In</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {assuredOptInRate}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={assuredOptInRate}
                onChange={(e) => setAssuredOptInRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block">₹99/pax with ₹0 cancellation fee</span>
            </div>

            {/* AC vs Non-AC Split */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">AC Travel Class Ratio</span>
                <span className="text-base font-black text-cyan-400 font-mono">
                  {acClassRatio}% AC
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={acClassRatio}
                onChange={(e) => setAcClassRatio(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block">AC: ₹40 fee • Non-AC: ₹20 fee</span>
            </div>
          </div>

          {/* Revenue Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Daily Estimated Gross Margin
              </span>
              <p className="text-3xl font-black text-white font-mono">
                ₹{Math.round(totalDailyRevenue).toLocaleString("en-IN")}
              </p>
              <span className="text-[11px] text-emerald-400 font-bold block pt-1">
                +₹{Math.round(dailyConvenienceFee).toLocaleString("en-IN")} from Agent Fees
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Monthly Net Revenue
              </span>
              <p className="text-3xl font-black text-orange-400 font-mono">
                ₹{Math.round(monthlyRevenue / 100000).toLocaleString("en-IN")} Lakhs
              </p>
              <span className="text-[11px] text-slate-400 block pt-1">
                ₹{Math.round(monthlyRevenue).toLocaleString("en-IN")} / month
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-1">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Annual Run-Rate (ARR)
              </span>
              <p className="text-3xl font-black text-emerald-300 font-mono">
                ₹{(annualRevenue / 10000000).toFixed(2)} Crores
              </p>
              <span className="text-[11px] text-emerald-400 font-bold block pt-1">
                Scale comparable to mid-market OTAs
              </span>
            </div>
          </div>
        </div>

        {/* The 6 Core Monetization Pillars */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-primary">
              The 6 Primary Revenue Pillars of Train Platforms
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
              How tech platforms turn high transaction frequency in railway tickets into sustainable profitability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-action-orange flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-navy-primary">
                1. IRCTC Authorized Service Fee
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                As an IRCTC Principal Service Provider (PSP) partner, the platform legally charges:
                <br />
                • <b>₹20 + GST</b> for Non-AC classes (Sleeper, 2S).
                <br />
                • <b>₹40 + GST</b> for AC classes (1A, 2A, 3A, CC, EC).
                <br />
                With 50,000 daily bookings, this alone yields <b>₹15 - ₹18 Lakhs daily</b>.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-status-success flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-navy-primary">
                2. ixigo Assured / Trip Protection
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                The highest-margin product on rail apps. The traveler pays <b>₹99 to ₹199</b> for a 100% full refund guarantee. Since most confirmed passengers do travel and cancellation rates are statistically modest (~5%), the platform retains a <b>65-75% gross margin</b>.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-navy-primary">
                3. Travel Insurance Distribution
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Partnering with insurers (Chola MS, Bajaj Allianz) to offer passenger cover at <b>₹0.45 per traveler</b>. The platform earns a recurring <b>20% to 30% distribution commission</b> across millions of active bookings.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-navy-primary">
                4. At-Seat Meal Delivery (E-Catering)
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Integration with restaurant aggregator APIs (RailRestro, Zoop, IRCTC E-Catering). Passengers order food delivered straight to their coach & berth, giving the platform a <b>10% to 15% net cut</b> on every order.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-navy-primary">
                5. Hotels & Station Cab Aggregation
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                When a passenger books a ticket to New Delhi or Mumbai, the app offers station pickup cabs (Uber/Ola) and budget hotels near the station, earning <b>15% to 25% affiliate commissions</b>.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-navy-primary">
                6. Co-Branded Credit Cards & Fintech
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Co-branded credit cards (e.g. ixigo AU Bank Credit Card) provide <b>₹200 - ₹500 bounty</b> per approval, plus interchange fees whenever the traveler uses the card for fuel, shopping, and train bookings.
              </p>
            </div>
          </div>
        </div>

        {/* How to Become an Official IRCTC B2B Partner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-4">
          <div className="flex items-center gap-2 text-action-orange text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Official Licensing Guide</span>
          </div>
          <h3 className="text-xl font-black text-navy-primary">
            How Platforms Officially Connect to IRCTC (Real Production Setup)
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            In the real world, no third-party website can book train tickets without an official agreement with <b>IRCTC (Indian Railway Catering and Tourism Corporation)</b>. Here is how companies execute this:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-extrabold text-navy-primary block text-sm">
                A. IRCTC Principal Service Provider (PSP)
              </span>
              <p className="text-text-secondary leading-relaxed">
                Companies sign a formal B2B Agreement with IRCTC, deposit a security bank guarantee, and undergo security audits to receive official SOAP/REST Direct Connect credentials.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-extrabold text-navy-primary block text-sm">
                B. Fast-Track Handoff & Auto-Redirect
              </span>
              <p className="text-text-secondary leading-relaxed">
                Emerging travel portals use smart pre-filled deep-linking to hand passengers over to the official IRCTC portal (<code>irctc.co.in</code>) where the booking and payment are authenticated directly on Indian Railways' secure server.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-action-orange text-white font-bold text-xs hover:bg-action-hover transition-colors inline-flex items-center gap-2"
            >
              <span>Back to Train Search</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://www.irctc.co.in/eticket/train-search"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-border-main text-navy-primary font-bold text-xs hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
            >
              <span>Official IRCTC Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
