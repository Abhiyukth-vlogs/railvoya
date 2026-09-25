import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronRight, BookOpen, Clock, ShieldCheck, Ticket } from "lucide-react";

export const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-action-orange uppercase tracking-wider">Help & Guidelines</span>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-primary tracking-tight">
            Traveler Help Center
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            Everything you need to know about Indian train travel rules, quota limits, and RailVoya features.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-action-orange flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-primary">Tatkal Booking Windows</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Tatkal quotas open 1 day in advance at 10:00 AM IST for AC classes (1A, 2A, 3A, CC) and 11:00 AM IST for Non-AC classes (SL). Maximum 4 passengers per booking.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-status-success flex items-center justify-center font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-primary">Understanding Status</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              <b>CNF:</b> Confirmed coach and berth.<br />
              <b>RAC:</b> Reservation Against Cancellation (entitled to board, shared berth).<br />
              <b>WL:</b> Waitlist (eligible only if confirmed before chart prep).
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-navy-100 text-navy-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-primary">Cancellation & Refunds</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Confirmed tickets cancelled more than 48 hours before departure incur standard clerkage deductions. In RailVoya Demo Mode, refunds are calculated and updated persistently to your account.
            </p>
          </div>
        </div>

        {/* Extended FAQs Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-4">
          <h3 className="text-lg font-extrabold text-navy-primary pb-3 border-b border-border-subtle">
            General Inquiries
          </h3>

          <div className="space-y-3">
            <details className="group border border-border-subtle rounded-2xl p-4 open:bg-slate-50/50">
              <summary className="font-bold text-sm text-navy-primary cursor-pointer flex items-center justify-between list-none">
                <span>How are berth numbers assigned?</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-2 text-xs text-text-secondary leading-relaxed pt-2 border-t border-border-subtle">
                Indian Railways PRS computerized logic assigns berths based on coach balance, passenger age, and gender preferences. Senior citizens traveling alone are automatically prioritized for lower berths when available.
              </p>
            </details>

            <details className="group border border-border-subtle rounded-2xl p-4 open:bg-slate-50/50">
              <summary className="font-bold text-sm text-navy-primary cursor-pointer flex items-center justify-between list-none">
                <span>Can I download e-tickets offline?</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-2 text-xs text-text-secondary leading-relaxed pt-2 border-t border-border-subtle">
                Yes. After completing your booking or from the "My Trips" dashboard, click "Download E-Ticket (PDF)" to obtain a printable vector PDF ticket clearly labeled with demo watermarks.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};
