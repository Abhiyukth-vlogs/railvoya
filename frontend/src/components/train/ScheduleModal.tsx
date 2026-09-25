import React, { useEffect, useState } from "react";
import { TrainSchedule } from "../../types";
import { api } from "../../services/api";
import { X, Clock, MapPin, Train as TrainIcon, Navigation } from "lucide-react";

interface ScheduleModalProps {
  trainNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ trainNumber, isOpen, onClose }) => {
  const [schedule, setSchedule] = useState<TrainSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !trainNumber) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const data = await api.getTrainSchedule(trainNumber);
        setSchedule(data);
      } catch (err) {
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [trainNumber, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-elevated border border-border-main overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border-main flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-action-orange flex items-center justify-center">
              <TrainIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-navy-primary text-base">Train #{trainNumber}</span>
                {schedule && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-navy-100 text-navy-primary">
                    {schedule.train_type}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-text-secondary truncate max-w-md">
                {schedule ? schedule.train_name : "Loading route..."}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-navy-primary hover:bg-slate-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close schedule modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center text-text-secondary">Loading route timeline...</div>
          ) : !schedule ? (
            <div className="py-12 text-center text-status-error">Failed to load schedule for train {trainNumber}.</div>
          ) : (
            <div className="space-y-6">
              {/* Route Summary Stats */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-border-subtle text-center text-xs">
                <div>
                  <p className="text-text-secondary font-medium">Total Distance</p>
                  <p className="text-sm font-bold text-navy-primary mt-0.5">{schedule.total_distance_km} km</p>
                </div>
                <div>
                  <p className="text-text-secondary font-medium">Total Duration</p>
                  <p className="text-sm font-bold text-navy-primary mt-0.5">{schedule.total_duration}</p>
                </div>
                <div>
                  <p className="text-text-secondary font-medium">Total Halts</p>
                  <p className="text-sm font-bold text-navy-primary mt-0.5">{schedule.stops.length} Stations</p>
                </div>
              </div>

              {/* Stops Table / Timeline */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-main text-xs uppercase font-bold text-text-secondary">
                      <th className="pb-3 pl-2">#</th>
                      <th className="pb-3">Station</th>
                      <th className="pb-3">Arrival</th>
                      <th className="pb-3">Departure</th>
                      <th className="pb-3">Halt</th>
                      <th className="pb-3">Platform</th>
                      <th className="pb-3 text-right pr-2">Distance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {schedule.stops.map((stop, idx) => (
                      <tr key={stop.station_code} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 pl-2 text-xs text-text-secondary font-bold">{idx + 1}</td>
                        <td className="py-3 font-bold text-navy-primary">
                          <div className="flex items-center gap-1.5">
                            <span className="text-action-orange">{stop.station_code}</span>
                            <span className="text-xs font-medium text-text-secondary">({stop.station_name})</span>
                          </div>
                        </td>
                        <td className="py-3 font-semibold text-text-main text-xs">{stop.arrival_time}</td>
                        <td className="py-3 font-semibold text-text-main text-xs">{stop.departure_time}</td>
                        <td className="py-3 text-xs text-text-secondary font-medium">
                          {stop.halt_minutes > 0 ? `${stop.halt_minutes}m` : "-"}
                        </td>
                        <td className="py-3 text-xs font-semibold text-slate-700">PF {stop.platform}</td>
                        <td className="py-3 text-xs text-text-secondary text-right pr-2 font-mono">
                          {stop.distance_km} km
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border-main bg-slate-50 flex items-center justify-between text-xs text-text-secondary">
          <span>Times shown in Asia/Kolkata (IST).</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-navy-primary text-white font-semibold hover:bg-navy-800 transition-colors min-h-[36px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
