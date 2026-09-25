import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PassengerInput, AvailabilityResponse, FareBreakdown } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Users,
  Plus,
  Trash2,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Clock,
  Train,
  Check,
} from "lucide-react";

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const trainNumber = searchParams.get("trainNumber") || "12952";
  const trainName = searchParams.get("trainName") || "Mumbai Rajdhani";
  const origin = searchParams.get("origin") || "NDLS";
  const destination = searchParams.get("destination") || "MMCT";
  const journeyDate = searchParams.get("journeyDate") || new Date().toISOString().split("T")[0];
  const travelClass = searchParams.get("travelClass") || "3A";
  const quota = searchParams.get("quota") || "GN";

  // Steps: 1 = Passengers, 2 = Review, 3 = Payment / Demo Completion
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Passengers state
  const [passengers, setPassengers] = useState<PassengerInput[]>([
    {
      full_name: user?.full_name || "",
      age: 30,
      gender: "Male",
      berth_preference: "Lower Berth",
      food_preference: "Veg",
      save_to_account: false,
    },
  ]);

  // Contact details
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "9876543210");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Live Fare Quote & Availability
  const [quote, setQuote] = useState<AvailabilityResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [simulationScenario, setSimulationScenario] = useState<"SUCCESS" | "PAYMENT_FAILED" | "GATEWAY_TIMEOUT">("SUCCESS");
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Fetch live fare quote
  const fetchFareQuote = async (pCount: number) => {
    setLoadingQuote(true);
    try {
      const q = await api.checkAvailability({
        train_number: trainNumber,
        origin,
        destination,
        journey_date: journeyDate,
        travel_class: travelClass,
        quota,
        passenger_count: pCount,
      });
      setQuote(q);
    } catch (err: any) {
      setGeneralError(err.message || "Failed to load live fare quote.");
    } finally {
      setLoadingQuote(false);
    }
  };

  useEffect(() => {
    fetchFareQuote(passengers.length);
  }, [passengers.length]);

  const addPassenger = () => {
    const maxPassengers = quota === "TQ" || quota === "PT" ? 4 : 6;
    if (passengers.length >= maxPassengers) {
      alert(`Maximum ${maxPassengers} passengers allowed under ${quota} quota.`);
      return;
    }
    setPassengers([
      ...passengers,
      {
        full_name: "",
        age: 28,
        gender: "Female",
        berth_preference: "Window",
        food_preference: "Veg",
        save_to_account: false,
      },
    ]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, idx) => idx !== index));
  };

  const updatePassenger = (index: number, field: keyof PassengerInput, val: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: val };
    setPassengers(updated);
  };

  const validatePassengersAndContact = () => {
    const errs: { [key: string]: string } = {};

    passengers.forEach((p, idx) => {
      if (!p.full_name.trim() || p.full_name.trim().length < 2) {
        errs[`name_${idx}`] = "Enter a valid full name (min 2 characters).";
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        errs[`age_${idx}`] = "Enter a valid age (1-120).";
      }
    });

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errs["email"] = "Enter a valid email address.";
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      errs["phone"] = "Enter a valid 10-digit Indian mobile number.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToReview = async () => {
    if (!validatePassengersAndContact()) return;
    // Revalidate live availability
    await fetchFareQuote(passengers.length);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProceedToPayment = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompleteBooking = async () => {
    setSubmitting(true);
    setGeneralError(null);
    try {
      const idempotencyKey = `rv-txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const res = await api.createBooking({
        train_number: trainNumber,
        origin_code: origin,
        destination_code: destination,
        boarding_station_code: origin,
        journey_date: journeyDate,
        travel_class: travelClass,
        quota,
        passengers,
        contact_email: email,
        contact_phone: phone,
        idempotency_key: idempotencyKey,
        simulation_scenario: simulationScenario,
      });

      // Navigate to confirmation page
      navigate(`/booking/confirmation/${res.id}`);
    } catch (err: any) {
      setGeneralError(err.message || "Booking submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const maxAllowed = quota === "TQ" || quota === "PT" ? 4 : 6;

  return (
    <div className="min-h-screen pb-24 bg-page-bg">
      {/* Top Journey Summary Banner */}
      <div className="bg-navy-primary text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-200 uppercase tracking-wider mb-1">
              <span>Booking Journey</span>
              <span>•</span>
              <span>Step {step} of 3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{origin}</span>
              <span className="text-action-orange">→</span>
              <span>{destination}</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              <b>{trainNumber} - {trainName}</b> • Class: <b>{travelClass}</b> • Quota: <b>{quota}</b> • Date: <b>{journeyDate}</b>
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 self-start md:self-auto text-xs font-bold">
            <span className={`px-3 py-1.5 rounded-xl border ${step === 1 ? "bg-action-orange text-white border-action-orange" : "bg-navy-800 text-slate-400 border-navy-700"}`}>
              1. Passengers
            </span>
            <span className="text-slate-600">→</span>
            <span className={`px-3 py-1.5 rounded-xl border ${step === 2 ? "bg-action-orange text-white border-action-orange" : "bg-navy-800 text-slate-400 border-navy-700"}`}>
              2. Review
            </span>
            <span className="text-slate-600">→</span>
            <span className={`px-3 py-1.5 rounded-xl border ${step === 3 ? "bg-action-orange text-white border-action-orange" : "bg-navy-800 text-slate-400 border-navy-700"}`}>
              3. Payment
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {generalError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-status-error text-sm font-semibold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Booking Step Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: PASSENGERS */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <div>
                    <h2 className="text-xl font-extrabold text-navy-primary">Enter Passenger Details</h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Max {maxAllowed} passengers allowed under {quota} quota.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addPassenger}
                    disabled={passengers.length >= maxAllowed}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-action-orange text-action-orange hover:bg-orange-50 font-bold text-xs transition-colors min-h-[44px] disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Traveler</span>
                  </button>
                </div>

                {/* Passengers List */}
                <div className="space-y-6">
                  {passengers.map((p, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-border-subtle space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-navy-primary uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-4 h-4 text-action-orange" />
                          Traveler {idx + 1}
                        </span>
                        {passengers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePassenger(idx)}
                            className="text-xs font-bold text-status-error hover:text-red-700 flex items-center gap-1 min-h-[36px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        {/* Name */}
                        <div className="sm:col-span-6">
                          <label className="block text-xs font-bold text-text-secondary mb-1">
                            Full Name (as on Govt ID) *
                          </label>
                          <input
                            type="text"
                            value={p.full_name}
                            onChange={(e) => updatePassenger(idx, "full_name", e.target.value)}
                            placeholder="e.g. Aarav Sharma"
                            className="w-full px-3.5 py-2.5 bg-white border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange min-h-[44px]"
                          />
                          {errors[`name_${idx}`] && (
                            <p className="mt-1 text-xs text-status-error font-medium">{errors[`name_${idx}`]}</p>
                          )}
                        </div>

                        {/* Age */}
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-bold text-text-secondary mb-1">Age *</label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={p.age}
                            onChange={(e) => updatePassenger(idx, "age", parseInt(e.target.value, 10) || 0)}
                            className="w-full px-3.5 py-2.5 bg-white border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange min-h-[44px]"
                          />
                          {errors[`age_${idx}`] && (
                            <p className="mt-1 text-xs text-status-error font-medium">{errors[`age_${idx}`]}</p>
                          )}
                        </div>

                        {/* Gender */}
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-bold text-text-secondary mb-1">Gender *</label>
                          <select
                            value={p.gender}
                            onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange min-h-[44px]"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                          </select>
                        </div>

                        {/* Berth Preference */}
                        <div className="sm:col-span-6">
                          <label className="block text-xs font-bold text-text-secondary mb-1">
                            Berth Preference (Request)
                          </label>
                          <select
                            value={p.berth_preference}
                            onChange={(e) => updatePassenger(idx, "berth_preference", e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange min-h-[44px]"
                          >
                            <option value="No Preference">No Preference</option>
                            <option value="Lower Berth">Lower Berth</option>
                            <option value="Middle Berth">Middle Berth</option>
                            <option value="Upper Berth">Upper Berth</option>
                            <option value="Side Lower">Side Lower</option>
                            <option value="Side Upper">Side Upper</option>
                            <option value="Window">Window Seat</option>
                          </select>
                        </div>

                        {/* Food Choice */}
                        <div className="sm:col-span-6">
                          <label className="block text-xs font-bold text-text-secondary mb-1">
                            Meal Choice
                          </label>
                          <select
                            value={p.food_preference}
                            onChange={(e) => updatePassenger(idx, "food_preference", e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange min-h-[44px]"
                          >
                            <option value="No Food">No Food</option>
                            <option value="Veg">Vegetarian Meal</option>
                            <option value="Non-Veg">Non-Vegetarian Meal</option>
                          </select>
                        </div>
                      </div>

                      {/* Save Passenger Opt-in */}
                      {user && (
                        <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-text-secondary cursor-pointer">
                          <input
                            type="checkbox"
                            checked={p.save_to_account || false}
                            onChange={(e) => updatePassenger(idx, "save_to_account", e.target.checked)}
                            className="w-4 h-4 rounded text-action-orange focus:ring-action-orange border-border-main"
                          />
                          <span>Save this traveler to my account for faster future bookings</span>
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                {/* Berth Preference Disclaimer */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                  <p>
                    <b>Berth Request Notice:</b> Berth preferences are requests submitted to Indian Railways. Actual berth allocation is decided dynamically by computerized PRS algorithms during charting.
                  </p>
                </div>

                {/* Contact Details */}
                <div className="pt-6 border-t border-border-subtle space-y-4">
                  <h3 className="text-base font-extrabold text-navy-primary">Contact & Ticket Updates</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. traveler@example.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange min-h-[44px]"
                      />
                      {errors["email"] && <p className="mt-1 text-xs text-status-error font-medium">{errors["email"]}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">Mobile Phone (10 digits) *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 bg-white border border-border-main rounded-xl text-sm font-semibold text-text-main focus:ring-2 focus:ring-action-orange min-h-[44px]"
                      />
                      {errors["phone"] && <p className="mt-1 text-xs text-status-error font-medium">{errors["phone"]}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToReview}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-action-orange hover:bg-action-hover text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: REVIEW */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <div>
                    <h2 className="text-xl font-extrabold text-navy-primary">Review Journey & Travelers</h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Verify your travel roster before proceeding to confirmation.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-action-orange hover:underline min-h-[36px]"
                  >
                    Edit Details
                  </button>
                </div>

                {/* Passengers Roster */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-navy-primary">Travelers Roster ({passengers.length})</h3>
                  <div className="divide-y divide-border-subtle border border-border-subtle rounded-2xl overflow-hidden">
                    {passengers.map((p, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/60 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-bold text-navy-primary">
                            {idx + 1}. {p.full_name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {p.age} Yrs • {p.gender} • Pref: {p.berth_preference}
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-50 text-status-success">
                          Valid for Ticket
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Confirmation */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-border-subtle text-xs space-y-1">
                  <p className="font-bold text-navy-primary">Booking Confirmation Recipient:</p>
                  <p className="text-text-secondary">Email: <b>{email}</b> • Mobile: <b>{phone}</b></p>
                </div>

                {/* Proceed to Payment Action */}
                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl border border-border-main font-semibold text-xs text-navy-primary hover:bg-slate-50 min-h-[44px]"
                  >
                    Back to Passengers
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="px-8 py-3.5 rounded-xl bg-action-orange hover:bg-action-hover text-white font-bold text-base transition-all shadow-md flex items-center gap-2 min-h-[48px]"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT & SIMULATION */}
            {step === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-6">
                <div className="pb-4 border-b border-border-subtle">
                  <h2 className="text-xl font-extrabold text-navy-primary">Payment & Confirmation</h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    RailVoya Demo Mode: No actual money is debited.
                  </p>
                </div>

                {/* Honest Demo Notice Box */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <span>Honest Demo Simulation Active</span>
                  </div>
                  <p className="leading-relaxed">
                    You are in <b>Local Demo Mode</b>. No credit card or net banking details are requested. You can select a test outcome below to simulate successful ticket allocation, bank decline, or gateway timeout reconciliation.
                  </p>
                </div>

                {/* Simulation Scenario Radio Group */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Select Test Scenario:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSimulationScenario("SUCCESS")}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        simulationScenario === "SUCCESS"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20"
                          : "border-border-main bg-white hover:bg-slate-50 text-text-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">Success</span>
                        {simulationScenario === "SUCCESS" && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-xs opacity-90">Simulate approved booking and confirmed ticket.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSimulationScenario("PAYMENT_FAILED")}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        simulationScenario === "PAYMENT_FAILED"
                          ? "border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500/20"
                          : "border-border-main bg-white hover:bg-slate-50 text-text-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">Bank Decline</span>
                        {simulationScenario === "PAYMENT_FAILED" && <Check className="w-4 h-4 text-red-600" />}
                      </div>
                      <p className="text-xs opacity-90">Simulate bank decline and failed booking state.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSimulationScenario("GATEWAY_TIMEOUT")}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        simulationScenario === "GATEWAY_TIMEOUT"
                          ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                          : "border-border-main bg-white hover:bg-slate-50 text-text-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">Timeout</span>
                        {simulationScenario === "GATEWAY_TIMEOUT" && <Check className="w-4 h-4 text-amber-600" />}
                      </div>
                      <p className="text-xs opacity-90">Simulate gateway timeout and pending reconciliation.</p>
                    </button>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl border border-border-main font-semibold text-xs text-navy-primary hover:bg-slate-50 min-h-[44px]"
                  >
                    Back to Review
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteBooking}
                    disabled={submitting}
                    className="px-8 py-3.5 rounded-xl bg-action-orange hover:bg-action-hover text-white font-bold text-base transition-all shadow-md flex items-center gap-2 min-h-[48px] disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Processing Demo Booking...</span>
                    ) : (
                      <>
                        <span>Complete Demo Booking (₹{quote?.fare_breakdown.total_amount || 0})</span>
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Journey & Fare Summary Sidebar */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-border-main shadow-card space-y-6">
              <div className="pb-3 border-b border-border-subtle">
                <span className="text-xs font-bold uppercase tracking-wider text-action-orange">Journey Summary</span>
                <h3 className="text-base font-extrabold text-navy-primary mt-0.5">{trainName}</h3>
                <p className="text-xs text-text-secondary">Train #{trainNumber}</p>
              </div>

              {/* Station Route Mini-Timeline */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Boarding Station</span>
                  <span className="font-bold text-navy-primary">{origin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Destination Station</span>
                  <span className="font-bold text-navy-primary">{destination}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Journey Date</span>
                  <span className="font-bold text-navy-primary">{journeyDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Travel Class</span>
                  <span className="font-bold text-action-orange">{travelClass}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Selected Quota</span>
                  <span className="font-bold text-navy-primary">{quota} Quota</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Total Passengers</span>
                  <span className="font-bold text-navy-primary">{passengers.length} Adult(s)</span>
                </div>
              </div>

              {/* Itemized Fare Breakdown */}
              <div className="pt-4 border-t border-border-subtle space-y-2 text-xs">
                <span className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                  Itemized Fare Breakdown
                </span>

                {loadingQuote || !quote ? (
                  <div className="py-4 text-center text-text-secondary text-xs">Calculating fare...</div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Base Ticket Fare</span>
                      <span>₹{quote.fare_breakdown.base_fare.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Reservation & Superfast</span>
                      <span>₹{(quote.fare_breakdown.reservation_charge + quote.fare_breakdown.superfast_charge).toFixed(2)}</span>
                    </div>
                    {quote.fare_breakdown.tatkal_charge > 0 && (
                      <div className="flex items-center justify-between text-text-secondary">
                        <span>Tatkal Charge</span>
                        <span>₹{quote.fare_breakdown.tatkal_charge.toFixed(2)}</span>
                      </div>
                    )}
                    {quote.fare_breakdown.gst_amount > 0 && (
                      <div className="flex items-center justify-between text-text-secondary">
                        <span>GST (5% AC Tax)</span>
                        <span>₹{quote.fare_breakdown.gst_amount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-border-subtle flex items-baseline justify-between">
                      <span className="font-extrabold text-sm text-navy-primary">Total Fare (INR)</span>
                      <span className="text-2xl font-black text-navy-primary">
                        ₹{quote.fare_breakdown.total_amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
