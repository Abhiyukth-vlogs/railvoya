import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Booking, BookingPassenger } from "../types";
import { api } from "../services/api";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Download,
  Luggage,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Train,
  Share2,
} from "lucide-react";

export const ConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      setLoading(true);
      try {
        const b = await api.getBooking(bookingId);
        setBooking(b);
        if (b.status === "CONFIRMED") {
          // Trigger celebratory confetti
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#C2410C", "#F97316", "#102A43", "#16734B"],
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center text-text-secondary">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-action-orange border-t-transparent animate-spin mx-auto"></div>
          <p className="font-semibold text-sm">Loading your journey confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-100 text-status-error flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-navy-primary">Booking Not Found</h2>
        <p className="text-xs text-text-secondary">{error || "Could not retrieve booking details."}</p>
        <Link to="/" className="inline-block px-6 py-3 bg-action-orange text-white font-bold rounded-xl text-xs">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Status Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-status-success flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-status-success border border-emerald-300">
              Demo Ticket {booking.status}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-navy-primary tracking-tight">
              Booking Completed!
            </h1>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Your demo journey reservation has been recorded. Reference details and e-ticket are available below.
            </p>
          </div>

          {/* Prominent PNR Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-border-subtle max-w-sm mx-auto flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Demo PNR Number</span>
              <p className="text-2xl font-extrabold text-navy-primary tracking-wider">{booking.pnr_number}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-action-orange">
              {booking.travel_class} • {booking.quota}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href={api.getTicketPdfUrl(booking.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-action-orange hover:bg-action-hover text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Download E-Ticket (PDF)</span>
            </a>

            <Link
              to="/trips"
              className="px-6 py-3.5 rounded-xl border border-border-main hover:bg-slate-50 text-navy-primary font-bold text-sm shadow-sm transition-all flex items-center gap-2 min-h-[44px]"
            >
              <Luggage className="w-4 h-4 text-action-orange" />
              <span>Go to My Trips</span>
            </Link>
          </div>
        </div>

        {/* Demo Watermark Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">DEMO TICKET NOTICE — NOT VALID FOR TRAVEL</p>
            <p className="text-amber-800 leading-relaxed mt-0.5">
              This confirmation and the downloadable PDF are simulated travel documents generated on RailVoya for demonstration purposes. It does not constitute a valid railway booking on Indian Railways.
            </p>
          </div>
        </div>

        {/* Journey Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div>
              <span className="text-xs font-bold text-action-orange uppercase tracking-wider">Train Details</span>
              <h2 className="text-xl font-extrabold text-navy-primary mt-0.5">
                {booking.train_number} - {booking.train_name}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-navy-primary">
              Class {booking.travel_class}
            </span>
          </div>

          {/* Origin -> Destination Route Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase">Departure</p>
              <p className="text-2xl font-extrabold text-navy-primary">{booking.departure_time}</p>
              <p className="text-sm font-bold text-text-main mt-0.5">
                {booking.origin_code} ({booking.origin_name})
              </p>
              <p className="text-xs text-text-secondary">{booking.journey_date}</p>
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-text-secondary flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-action-orange" />
                {booking.duration}
              </span>
              <div className="w-full h-1 bg-slate-200 rounded-full my-2 relative">
                <div className="absolute inset-x-0 h-1 bg-action-orange rounded-full"></div>
              </div>
              <span className="text-[11px] font-semibold text-text-secondary">Direct Express</span>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-bold text-text-secondary uppercase">Arrival</p>
              <div className="flex items-baseline sm:justify-end gap-1.5">
                <p className="text-2xl font-extrabold text-navy-primary">{booking.arrival_time}</p>
                {booking.arrival_day_offset > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    +{booking.arrival_day_offset} Day
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-text-main mt-0.5">
                {booking.destination_code} ({booking.destination_name})
              </p>
            </div>
          </div>

          {/* Passenger Berth Allocations */}
          <div className="pt-4 border-t border-border-subtle space-y-3">
            <h3 className="text-sm font-extrabold text-navy-primary">Confirmed Travelers & Berth Allocation</h3>
            <div className="divide-y divide-border-subtle border border-border-subtle rounded-2xl overflow-hidden">
              {booking.passengers.map((p: BookingPassenger, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                  <div>
                    <span className="font-bold text-navy-primary">
                      {idx + 1}. {p.full_name}
                    </span>
                    <p className="text-xs text-text-secondary">
                      {p.age} Yrs • {p.gender}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-status-success font-extrabold text-xs">
                      {p.current_status}
                    </span>
                    <span className="text-xs font-bold text-navy-primary">
                      Coach {p.assigned_coach} • Berth {p.assigned_berth} ({p.assigned_berth_type})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Tax Breakdown */}
          <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-text-secondary">
                Confirmation sent to: <b>{booking.contact_email}</b> • <b>{booking.contact_phone}</b>
              </p>
              <p className="text-slate-400">Transaction ID: {booking.id}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-text-secondary font-medium">Total Paid (Demo):</span>
              <p className="text-2xl font-black text-navy-primary">
                ₹{booking.total_amount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="text-center pt-4">
          <Link
            to="/"
            className="text-sm font-bold text-action-orange hover:text-action-hover underline-offset-4 hover:underline"
          >
            ← Search and book another journey
          </Link>
        </div>
      </div>
    </div>
  );
};
