import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Booking, BookingPassenger } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Luggage,
  Calendar,
  Clock,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export const MyTripsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "cancelled">("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancellationResult, setCancellationResult] = useState<string | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      if (user) {
        const data = await api.getMyBookings();
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setCancellingId(cancelModalBooking.id);
    try {
      const res = await api.cancelBooking(cancelModalBooking.id);
      setCancellationResult(res.message);
      // Refresh list
      await fetchTrips();
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter === "cancelled") return b.status === "CANCELLED";
    if (filter === "upcoming") return b.status !== "CANCELLED";
    return true;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-action-orange uppercase tracking-wider mb-1">
              <Luggage className="w-4 h-4" />
              <span>Trip Management</span>
            </div>
            <h1 className="text-3xl font-extrabold text-navy-primary tracking-tight">My Booked Trips</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Review your railway bookings, download e-tickets, or manage cancellations.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filter === "all" ? "bg-white text-navy-primary shadow-sm" : "text-text-secondary hover:text-navy-primary"
              }`}
            >
              All Trips ({bookings.length})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filter === "upcoming" ? "bg-white text-navy-primary shadow-sm" : "text-text-secondary hover:text-navy-primary"
              }`}
            >
              Upcoming ({bookings.filter((b) => b.status !== "CANCELLED").length})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filter === "cancelled" ? "bg-white text-navy-primary shadow-sm" : "text-text-secondary hover:text-navy-primary"
              }`}
            >
              Cancelled ({bookings.filter((b) => b.status === "CANCELLED").length})
            </button>
          </div>
        </div>

        {/* Guest Warning */}
        {!user && (
          <div className="p-6 rounded-3xl bg-white border border-border-main shadow-card text-center space-y-3">
            <h3 className="text-base font-extrabold text-navy-primary">Sign in to view your stored bookings</h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              You are currently viewing RailVoya as a guest. Log in to sync bookings across devices, download previous tickets, and request cancellations.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link to="/login" className="px-5 py-2.5 bg-action-orange text-white text-xs font-bold rounded-xl shadow-sm">
                Log In
              </Link>
              <Link to="/signup" className="px-5 py-2.5 border border-border-main text-navy-primary text-xs font-bold rounded-xl hover:bg-slate-50">
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Trips List */}
        {loading ? (
          <div className="py-16 text-center text-text-secondary text-sm">Loading your trips...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-border-main text-center space-y-4 shadow-card">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 text-action-orange flex items-center justify-center mx-auto">
              <Luggage className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-navy-primary">No Trips Found</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              You have no {filter !== "all" ? filter : ""} train bookings recorded.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-xl bg-action-orange text-white font-bold text-xs hover:bg-action-hover"
            >
              Search Trains
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((trip) => {
              const isCancelled = trip.status === "CANCELLED";
              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl border border-border-main p-6 shadow-card hover:shadow-elevated transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-navy-primary text-base">
                        {trip.pnr_number}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                          isCancelled
                            ? "bg-red-100 text-status-error"
                            : "bg-emerald-100 text-status-success"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>

                    <div className="text-xs text-text-secondary">
                      Booked on: {new Date(trip.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </div>

                  {/* Route & Times */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div>
                      <p className="text-xs text-text-secondary uppercase font-bold">From</p>
                      <p className="text-lg font-extrabold text-navy-primary">{trip.origin_code}</p>
                      <p className="text-xs text-text-secondary">{trip.departure_time} • {trip.journey_date}</p>
                    </div>

                    <div className="text-center sm:text-center">
                      <span className="text-xs font-bold text-navy-primary">{trip.train_name}</span>
                      <p className="text-[11px] text-text-secondary">Train #{trip.train_number} • Class {trip.travel_class}</p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-text-secondary uppercase font-bold">To</p>
                      <p className="text-lg font-extrabold text-navy-primary">{trip.destination_code}</p>
                      <p className="text-xs text-text-secondary">{trip.arrival_time}</p>
                    </div>
                  </div>

                  {/* Passengers Roster Strip */}
                  <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span>Passengers ({trip.passengers.length}):</span>
                      <span className="font-semibold text-navy-primary">
                        {trip.passengers.map((p: BookingPassenger) => p.full_name).join(", ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={api.getTicketPdfUrl(trip.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-primary font-bold text-xs flex items-center gap-1.5 transition-colors min-h-[36px]"
                      >
                        <Download className="w-3.5 h-3.5 text-action-orange" />
                        <span>PDF E-Ticket</span>
                      </a>

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => {
                            setCancelModalBooking(trip);
                            setCancellationResult(null);
                          }}
                          className="px-3.5 py-2 rounded-xl border border-red-200 text-status-error hover:bg-red-50 font-bold text-xs transition-colors min-h-[36px]"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border-main space-y-4">
            <div className="flex items-center gap-3 text-status-error">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-extrabold text-navy-primary">Cancel Railway Booking?</h3>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to cancel booking <b>{cancelModalBooking.pnr_number}</b> ({cancelModalBooking.train_name})?
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-border-subtle text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-text-secondary">Original Amount Paid:</span>
                <span className="font-bold text-navy-primary">₹{cancelModalBooking.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Est. Cancellation Deductions:</span>
                <span className="font-bold text-status-error">
                  -₹{cancelModalBooking.travel_class === "1A" ? 240 * cancelModalBooking.passengers.length : 180 * cancelModalBooking.passengers.length}
                </span>
              </div>
              <div className="pt-1.5 border-t border-border-subtle flex justify-between font-bold text-sm">
                <span className="text-navy-primary">Estimated Demo Refund:</span>
                <span className="text-status-success">
                  ₹{Math.max(0, cancelModalBooking.total_amount - 180 * cancelModalBooking.passengers.length)}
                </span>
              </div>
            </div>

            {cancellationResult ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-status-success text-xs font-bold text-center">
                {cancellationResult}
              </div>
            ) : null}

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2.5 rounded-xl border border-border-main text-xs font-semibold text-navy-primary hover:bg-slate-50 min-h-[44px]"
              >
                Close
              </button>

              {!cancellationResult && (
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancellingId !== null}
                  className="px-5 py-2.5 rounded-xl bg-status-error hover:bg-red-700 text-white text-xs font-bold transition-colors min-h-[44px]"
                >
                  {cancellingId ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
