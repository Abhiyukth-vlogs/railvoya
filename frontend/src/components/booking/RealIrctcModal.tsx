import React, { useState } from "react";
import { TrainSearchResult, ClassAvailability } from "../../types";
import {
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  X,
  Train,
  ArrowRight,
  Info,
  Sparkles,
  Lock,
} from "lucide-react";

interface RealIrctcModalProps {
  train: TrainSearchResult;
  selectedClass: ClassAvailability | null;
  journeyDate: string;
  quota: string;
  onClose: () => void;
}

export const RealIrctcModal: React.FC<RealIrctcModalProps> = ({
  train,
  selectedClass,
  journeyDate,
  quota,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const irctcUrl = "https://www.irctc.co.in/nget/train-search";

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(`${train.origin_code} to ${train.destination_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchIrctc = () => {
    window.open(irctcUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-border-main shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-navy-primary hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Official IRCTC Fast Handoff</span>
          </div>
          <h2 className="text-2xl font-black text-navy-primary">
            Buy Real Train Ticket
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Purchase an authentic, travel-ready Indian Railways ticket issued directly by CRIS & IRCTC.
          </p>
        </div>

        {/* Journey Quick Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-extrabold text-navy-primary text-sm flex items-center gap-1.5">
              <Train className="w-4 h-4 text-action-orange" />
              {train.train_number} - {train.train_name}
            </span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {train.train_type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-text-main">
            <div>
              <span className="text-slate-400 block text-[11px]">From</span>
              <span className="font-extrabold text-navy-primary text-xs">
                {train.origin_code} ({train.origin_name})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">To</span>
              <span className="font-extrabold text-navy-primary text-xs">
                {train.destination_code} ({train.destination_name})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Date</span>
              <span className="font-bold text-navy-primary">{journeyDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Selected Class</span>
              <span className="font-bold text-action-orange">
                {selectedClass ? `${selectedClass.class_code} (₹${selectedClass.fare})` : "Standard"}
              </span>
            </div>
          </div>
        </div>

        {/* Real Booking Instructions */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-navy-primary uppercase tracking-wider">
            How It Works (Direct Official IRCTC Booking):
          </h3>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <p>
                Click <b>Open Official IRCTC Portal</b> below to jump straight to the Indian Railways e-Ticketing gateway.
              </p>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <p>
                Log in with your personal <b>IRCTC User ID</b> (or create a free account on irctc.co.in if you don't have one).
              </p>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <p>
                Pay Indian Railways directly via <b>UPI (GPay / PhonePe / Paytm), Debit/Credit Card, or NetBanking</b>.
              </p>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </span>
              <p>
                Get your legal <b>10-digit PNR e-Ticket</b> immediately via official Indian Railways SMS and email!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleLaunchIrctc}
            className="w-full py-4 px-6 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 min-h-[50px]"
          >
            <span>🚀 Open Official IRCTC Portal (irctc.co.in)</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleCopyCodes}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-navy-primary font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Station codes copied to clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Station Codes ({train.origin_code} ➔ {train.destination_code})</span>
              </>
            )}
          </button>
        </div>

        {/* B2B In-App Direct Connect Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <b>Want in-app direct booking without leaving RailVoya?</b> In production, platforms integrate the <b>IRCTC B2B Web Service Partner API</b>. RailVoya's backend architecture already supports CRIS endpoints!
          </p>
        </div>
      </div>
    </div>
  );
};
