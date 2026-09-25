import React, { useState } from "react";
import { PnrStatus, PnrPassenger } from "../types";
import { api } from "../services/api";
import {
  FileSearch,
  Search,
  CheckCircle2,
  Clock,
  Train,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const PnrStatusPage: React.FC = () => {
  const [pnrInput, setPnrInput] = useState("");
  const [pnrData, setPnrData] = useState<PnrStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoExamples = ["RV-DEMO-4829104", "RV-DEMO-7391028", "RV-DEMO-9182374"];

  const handleSearch = async (targetPnr?: string) => {
    const val = targetPnr || pnrInput.trim();
    if (!val) {
      setError("Please enter a valid 10-digit PNR or demo identifier.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await api.getPnrStatus(val);
      setPnrData(data);
      setPnrInput(val);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve PNR status.");
      setPnrData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-action-orange text-xs font-bold">
            <FileSearch className="w-3.5 h-3.5" />
            <span>Passenger Reservation Status</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-primary tracking-tight">
            Check Live PNR Status
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            Enter your 10-digit Indian Railways PNR or demo reference number to inspect coach, berth, and charting status.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                placeholder="Enter 10-digit PNR (e.g. RV-DEMO-4829104)..."
                className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-border-main rounded-2xl text-base font-bold text-navy-primary focus:ring-2 focus:ring-action-orange focus:bg-white uppercase tracking-wider min-h-[48px]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-action-orange hover:bg-action-hover text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "Checking..." : "Check Status"}</span>
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-text-secondary font-semibold">Try sample demo PNRs:</span>
            {demoExamples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleSearch(ex)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-action-orange text-navy-primary font-bold border border-border-subtle transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          {error && <p className="text-xs font-bold text-status-error">{error}</p>}
        </div>

        {/* Results Card */}
        {pnrData && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
              <div>
                <span className="text-xs font-bold text-action-orange uppercase tracking-wider">PNR Summary</span>
                <h2 className="text-2xl font-black text-navy-primary mt-0.5 tracking-wider">{pnrData.pnr_number}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold ${
                    pnrData.chart_status === "CHART PREPARED"
                      ? "bg-emerald-100 text-status-success"
                      : "bg-amber-100 text-status-warning"
                  }`}
                >
                  {pnrData.chart_status}
                </span>
              </div>
            </div>

            {/* Train & Journey Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-border-subtle text-xs">
              <div>
                <p className="text-text-secondary">Train</p>
                <p className="font-extrabold text-navy-primary mt-0.5">{pnrData.train_number}</p>
                <p className="text-[11px] text-text-secondary truncate">{pnrData.train_name}</p>
              </div>
              <div>
                <p className="text-text-secondary">Journey Date</p>
                <p className="font-extrabold text-navy-primary mt-0.5">{pnrData.journey_date}</p>
                <p className="text-[11px] text-text-secondary">Class: {pnrData.travel_class}</p>
              </div>
              <div>
                <p className="text-text-secondary">From Station</p>
                <p className="font-extrabold text-navy-primary mt-0.5">{pnrData.origin_code}</p>
                <p className="text-[11px] text-text-secondary">{pnrData.origin_name}</p>
              </div>
              <div>
                <p className="text-text-secondary">To Station</p>
                <p className="font-extrabold text-navy-primary mt-0.5">{pnrData.destination_code}</p>
                <p className="text-[11px] text-text-secondary">{pnrData.destination_name}</p>
              </div>
            </div>

            {/* Passenger Current Status Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-navy-primary">Passenger Current Status</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-main text-xs uppercase font-bold text-text-secondary">
                      <th className="pb-3 pl-2">Passenger #</th>
                      <th className="pb-3">Booking Status</th>
                      <th className="pb-3">Current Status</th>
                      <th className="pb-3">Coach / Berth</th>
                      <th className="pb-3 text-right pr-2">Berth Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {pnrData.passengers.map((p: PnrPassenger) => (
                      <tr key={p.passenger_number} className="hover:bg-slate-50/70">
                        <td className="py-3 pl-2 font-bold text-navy-primary text-xs">Passenger {p.passenger_number}</td>
                        <td className="py-3 font-semibold text-text-secondary text-xs">{p.booking_status}</td>
                        <td className="py-3 font-extrabold text-status-success text-xs">
                          {p.current_status}
                        </td>
                        <td className="py-3 font-bold text-navy-primary text-xs">
                          {p.coach} - {p.berth_number}
                        </td>
                        <td className="py-3 text-right pr-2 text-xs font-semibold text-text-secondary">
                          {p.berth_type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary">
              <span>Last refreshed: {pnrData.last_updated}</span>
              <span className="font-semibold text-amber-700">Demo Simulation Data</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
