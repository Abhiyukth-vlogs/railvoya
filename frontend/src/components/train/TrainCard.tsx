import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrainSearchResult, ClassAvailability } from "../../types";
import { ScheduleModal } from "./ScheduleModal";
import {
  Train,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Utensils,
  ChevronRight,
} from "lucide-react";

interface TrainCardProps {
  train: TrainSearchResult;
  journeyDate: string;
  quota: string;
}

export const TrainCard: React.FC<TrainCardProps> = ({ train, journeyDate, quota }) => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<ClassAvailability | null>(
    train.classes.length > 0 ? train.classes[0] : null
  );
  const [showSchedule, setShowSchedule] = useState(false);

  const handleBookNow = () => {
    if (!selectedClass) return;
    const params = new URLSearchParams({
      trainNumber: train.train_number,
      trainName: train.train_name,
      origin: train.origin_code,
      destination: train.destination_code,
      journeyDate,
      travelClass: selectedClass.class_code,
      quota,
      fare: selectedClass.fare.toString(),
    });
    navigate(`/booking?${params.toString()}`);
  };

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <>
      <div className="bg-white rounded-3xl border border-border-main p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all duration-200">
        {/* Top Header: Train Info & Running Days */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-navy-light text-navy-primary flex items-center justify-center font-bold text-sm shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-navy-primary text-base sm:text-lg">
                  {train.train_number}
                </span>
                <span className="text-sm font-bold text-navy-800">
                  {train.train_name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-action-orange border border-orange-200/60">
                  {train.train_type}
                </span>
              </div>
            </div>
          </div>

          {/* Running Days */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <span className="text-xs font-semibold text-text-secondary mr-1">Runs on:</span>
            {dayLabels.map((day, idx) => {
              const runs = train.running_days.includes(day);
              return (
                <span
                  key={idx}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    runs
                      ? "bg-navy-primary text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                  title={runs ? `Runs on ${day}` : `Does not run on ${day}`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>

        {/* Middle Section: Origin -> Timeline -> Destination */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Origin */}
          <div className="md:col-span-4 flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-primary tracking-tight">
              {train.departure_time}
            </span>
            <span className="text-base font-bold text-text-main flex items-center gap-1.5">
              <span>{train.origin_code}</span>
              <span className="text-xs font-normal text-text-secondary">({train.origin_name})</span>
            </span>
          </div>

          {/* Journey Duration & Track */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center px-2">
            <div className="flex items-center gap-1 text-xs font-bold text-text-secondary mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{train.duration}</span>
            </div>

            {/* Styled railway track bar */}
            <div className="w-full relative flex items-center justify-center my-1">
              <div className="w-full h-1 bg-slate-200 rounded-full"></div>
              <div className="absolute w-2 h-2 rounded-full bg-navy-primary left-0"></div>
              <div className="absolute w-2 h-2 rounded-full bg-action-orange right-0"></div>
              <div className="absolute p-1 bg-white rounded-full border border-slate-300 text-slate-500 shadow-sm">
                <ArrowRight className="w-3 h-3 text-action-orange" />
              </div>
            </div>

            <button
              onClick={() => setShowSchedule(true)}
              className="mt-1.5 text-xs font-semibold text-action-orange hover:text-action-hover transition-colors underline-offset-2 hover:underline"
            >
              View Route & Stops
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-4 flex flex-col md:items-end">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-navy-primary tracking-tight">
                {train.arrival_time}
              </span>
              {train.arrival_day_offset > 0 && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  +{train.arrival_day_offset} Day
                </span>
              )}
            </div>
            <span className="text-base font-bold text-text-main flex items-center gap-1.5">
              <span>{train.destination_code}</span>
              <span className="text-xs font-normal text-text-secondary">({train.destination_name})</span>
            </span>
          </div>
        </div>

        {/* Classes Strip & Booking Action */}
        <div className="pt-4 border-t border-border-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Class Chips List */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full">
            {train.classes.map((cls) => {
              const isSelected = selectedClass?.class_code === cls.class_code;
              const isAvailable = cls.status === "AVAILABLE";
              const isRac = cls.status === "RAC";
              const isWl = cls.status === "WL";

              let badgeBg = "bg-slate-100 text-slate-700";
              let StatusIcon = HelpCircle;
              if (isAvailable) {
                badgeBg = "bg-status-success-bg text-status-success border-emerald-200";
                StatusIcon = CheckCircle2;
              } else if (isRac) {
                badgeBg = "bg-status-warning-bg text-status-warning border-amber-200";
                StatusIcon = AlertCircle;
              } else if (isWl) {
                badgeBg = "bg-status-error-bg text-status-error border-red-200";
                StatusIcon = Clock;
              }

              return (
                <button
                  key={cls.class_code}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`min-w-[124px] p-3 rounded-2xl border text-left transition-all shrink-0 ${
                    isSelected
                      ? "border-action-orange bg-orange-50/50 ring-2 ring-action-orange/20 shadow-sm"
                      : "border-border-main bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm text-navy-primary">{cls.class_code}</span>
                    <span className="text-xs font-bold text-navy-primary">₹{cls.fare.toLocaleString("en-IN")}</span>
                  </div>

                  <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${badgeBg}`}>
                    <StatusIcon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{cls.status_detail}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[10px] text-text-secondary">
                    <span>{cls.class_name.split("(")[0]}</span>
                    {cls.catering_available && (
                      <span title="Catering Available">
                        <Utensils className="w-2.5 h-2.5 text-slate-400" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Book Action Button */}
          <div className="shrink-0 flex items-center gap-3">
            {selectedClass && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-text-secondary font-medium">Class: <b>{selectedClass.class_code}</b></span>
                <span className="text-lg font-extrabold text-navy-primary">₹{selectedClass.fare.toLocaleString("en-IN")}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleBookNow}
              disabled={!selectedClass}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-action-orange hover:bg-action-hover text-white font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Book Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        trainNumber={train.train_number}
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
      />
    </>
  );
};
