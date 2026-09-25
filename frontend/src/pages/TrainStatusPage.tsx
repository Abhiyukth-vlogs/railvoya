import React, { useState } from "react";
import { RunningStatus, RunningStop } from "../types";
import { api } from "../services/api";
import {
  Activity,
  Search,
  Train,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

export const TrainStatusPage: React.FC = () => {
  const [trainInput, setTrainInput] = useState("12952");
  const [runningData, setRunningData] = useState<RunningStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleTrains = [
    { no: "12952", name: "Mumbai Rajdhani" },
    { no: "22436", name: "Varanasi Vande Bharat" },
    { no: "20607", name: "Mysuru Vande Bharat" },
    { no: "12301", name: "Howrah Rajdhani" },
  ];

  const handleSearch = async (trainNo?: string) => {
    const val = trainNo || trainInput.trim();
    if (!val) {
      setError("Please enter a valid 5-digit train number.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await api.getRunningStatus(val);
      setRunningData(data);
      setTrainInput(val);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve train running status.");
      setRunningData(null);
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
            <Activity className="w-3.5 h-3.5" />
            <span>National Train Enquiry Simulation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-primary tracking-tight">
            Live Train Running Status
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            Track real-time train location, upcoming stations, platforms, and expected arrival delays.
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
                value={trainInput}
                onChange={(e) => setTrainInput(e.target.value)}
                placeholder="Enter Train Number (e.g. 12952, 22436)..."
                className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-border-main rounded-2xl text-base font-bold text-navy-primary focus:ring-2 focus:ring-action-orange focus:bg-white min-h-[48px]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-action-orange hover:bg-action-hover text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "Tracking..." : "Get Live Status"}</span>
            </button>
          </form>

          {/* Sample Train Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-text-secondary font-semibold">Try sample trains:</span>
            {sampleTrains.map((t) => (
              <button
                key={t.no}
                type="button"
                onClick={() => handleSearch(t.no)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-action-orange text-navy-primary font-bold border border-border-subtle transition-colors"
              >
                {t.no} ({t.name})
              </button>
            ))}
          </div>

          {error && <p className="text-xs font-bold text-status-error">{error}</p>}
        </div>

        {/* Live Running Results */}
        {runningData && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-6 animate-in fade-in duration-200">
            {/* Summary Top Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-navy-primary text-white">
              <div className="space-y-1">
                <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                  Train #{runningData.train_number}
                </span>
                <h2 className="text-xl font-extrabold text-white">{runningData.train_name}</h2>
                <p className="text-xs text-slate-300">
                  Current Station: <b>{runningData.current_station}</b>
                </p>
              </div>

              <div className="text-right sm:self-center">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold ${
                    runningData.delay_minutes === 0
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {runningData.delay_minutes === 0 ? "On Time" : `${runningData.delay_minutes} min late`}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Refreshed: {runningData.last_updated}</p>
              </div>
            </div>

            {/* Timeline Route Stops */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-extrabold text-navy-primary">Live Station Tracking Timeline</h3>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 ml-4 space-y-6">
                {runningData.stops.map((stop: RunningStop, idx: number) => {
                  return (
                    <div key={idx} className="relative group">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white ${
                          stop.is_current
                            ? "bg-action-orange ring-4 ring-orange-200 animate-pulse"
                            : stop.has_departed
                            ? "bg-status-success"
                            : "bg-slate-300"
                        }`}
                      ></div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-navy-primary text-sm">
                              {stop.station_code}
                            </span>
                            <span className="text-xs font-medium text-text-secondary">
                              ({stop.station_name})
                            </span>
                            {stop.is_current && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-action-orange">
                                Current Location
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5">
                            Platform: <b>{stop.platform}</b>
                          </p>
                        </div>

                        <div className="flex items-center gap-6 text-xs sm:text-right">
                          <div>
                            <span className="text-text-secondary block text-[10px]">Arr: {stop.scheduled_arrival}</span>
                            <span className="font-bold text-navy-primary">Act: {stop.actual_arrival}</span>
                          </div>
                          <div>
                            <span className="text-text-secondary block text-[10px]">Dep: {stop.scheduled_departure}</span>
                            <span className="font-bold text-navy-primary">Act: {stop.actual_departure}</span>
                          </div>
                          {stop.delay_arrival_minutes > 0 ? (
                            <span className="text-[11px] font-bold text-amber-700">
                              +{stop.delay_arrival_minutes}m
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-700">On time</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
