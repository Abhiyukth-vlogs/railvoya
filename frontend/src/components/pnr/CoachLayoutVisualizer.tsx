import React from "react";
import { Train, Info, Zap, Shield, Sparkles } from "lucide-react";

interface CoachLayoutVisualizerProps {
  coach: string;
  berthNumber: number;
  berthType: string;
  travelClass: string;
  trainNumber?: string;
  trainName?: string;
}

export const CoachLayoutVisualizer: React.FC<CoachLayoutVisualizerProps> = ({
  coach,
  berthNumber,
  berthType,
  travelClass,
  trainNumber,
  trainName,
}) => {
  // Typical coach rake sequence
  const sampleRake = [
    { code: "LOCO", name: "Locomotive WAP-7", type: "engine" },
    { code: "EOG", name: "Generator Car", type: "power" },
    { code: "GS1", name: "General Unreserved", type: "gen" },
    { code: "S1", name: "Sleeper Class", type: "sl" },
    { code: "S2", name: "Sleeper Class", type: "sl" },
    { code: "B1", name: "AC 3-Tier", type: "3a" },
    { code: coach || "B2", name: `Your Coach (${coach || "B2"})`, type: "user", isUser: true },
    { code: "B3", name: "AC 3-Tier", type: "3a" },
    { code: "A1", name: "AC 2-Tier", type: "2a" },
    { code: "H1", name: "First AC", type: "1a" },
    { code: "SLR", name: "Guard & Luggage", type: "guard" },
  ];

  // Determine bay berth position (in a standard 8-berth Indian Railways 3A/SL bay)
  const bayIndex = Math.floor((berthNumber - 1) / 8);
  const bayStart = bayIndex * 8 + 1;
  const bayEnd = bayStart + 7;

  const bayBerths = [
    { no: bayStart + 0, type: "Lower Berth", short: "LB", position: "cabin-left-low" },
    { no: bayStart + 1, type: "Middle Berth", short: "MB", position: "cabin-left-mid" },
    { no: bayStart + 2, type: "Upper Berth", short: "UB", position: "cabin-left-high" },
    { no: bayStart + 3, type: "Lower Berth", short: "LB", position: "cabin-right-low" },
    { no: bayStart + 4, type: "Middle Berth", short: "MB", position: "cabin-right-mid" },
    { no: bayStart + 5, type: "Upper Berth", short: "UB", position: "cabin-right-high" },
    { no: bayStart + 6, type: "Side Lower", short: "SL", position: "side-low" },
    { no: bayStart + 7, type: "Side Upper", short: "SU", position: "side-high" },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-700 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/30">
              <Sparkles className="w-3 h-3" /> Visual Rake & Seat Map
            </span>
            <span className="text-xs text-slate-400">IRCTC Standard LHB Layout</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1">
            Coach Position: <span className="text-action-orange">{coach}</span> — Berth #{berthNumber} ({berthType})
          </h3>
        </div>

        <div className="text-right sm:text-right">
          <span className="text-xs text-slate-400">Class:</span>
          <span className="ml-1.5 px-2.5 py-1 bg-navy-800 rounded-lg text-xs font-bold text-amber-300 border border-navy-700">
            {travelClass}
          </span>
        </div>
      </div>

      {/* 1. Train Rake Formation Diagram */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-action-orange" />
            Train Rake Position (Engine to Guard)
          </span>
          <span className="text-[11px] text-slate-400">Facing Direction: Left ➔ Right</span>
        </div>

        <div className="overflow-x-auto pb-3 pt-1">
          <div className="flex items-center gap-1.5 min-w-max">
            {sampleRake.map((car, idx) => {
              const isTarget = car.code === coach || (car.isUser && !sampleRake.some(c => c.code === coach && !c.isUser));
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl text-center transition-all ${
                    isTarget
                      ? "bg-gradient-to-b from-action-orange to-orange-600 text-white ring-2 ring-orange-300 ring-offset-2 ring-offset-navy-900 shadow-lg scale-105"
                      : car.type === "engine"
                      ? "bg-blue-950/80 text-blue-200 border border-blue-800/80"
                      : "bg-navy-800/60 text-slate-300 border border-navy-700/60 hover:bg-navy-800"
                  }`}
                  style={{ minWidth: car.type === "engine" ? "92px" : "68px" }}
                >
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">
                    {car.type === "engine" ? "⚡ LOCO" : car.type === "guard" ? "SLR" : "COACH"}
                  </span>
                  <span className="text-xs font-black tracking-wide">
                    {car.code}
                  </span>
                  {isTarget && (
                    <span className="mt-1 px-1.5 py-0.2 rounded-full bg-white text-action-orange text-[9px] font-black uppercase shadow-xs">
                      YOUR COACH
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Berth Layout (Cabin Compartment) */}
      <div className="bg-navy-950/70 p-5 rounded-2xl border border-navy-800 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-white">Bay #{bayIndex + 1} Berth Matrix</span>
            <span className="text-slate-400 ml-2">(Berths {bayStart} to {bayEnd})</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span> Your Berth
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-700 inline-block"></span> Other Berths
            </span>
          </div>
        </div>

        {/* 3A/Sleeper Bay Floor Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Main Cabin (6 berths) */}
          <div className="bg-navy-900/90 p-4 rounded-xl border border-navy-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Main Cabin Section</span>
              <span className="text-[10px] text-slate-400">6 Berths</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {bayBerths.slice(0, 6).map((b) => {
                const isSelected = b.no === berthNumber;
                return (
                  <div
                    key={b.no}
                    className={`p-2.5 rounded-xl text-center border transition-all ${
                      isSelected
                        ? "bg-action-orange text-white border-orange-400 shadow-lg ring-2 ring-orange-300"
                        : "bg-navy-800/80 text-slate-300 border-navy-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-75">{b.short}</div>
                    <div className="text-base font-black">#{b.no}</div>
                    <div className="text-[10px] font-medium opacity-90 truncate">{b.type.split(" ")[0]}</div>
                    {isSelected && (
                      <div className="mt-1 text-[9px] font-black bg-white text-action-orange rounded px-1">
                        YOU
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Corridor Section (2 berths) */}
          <div className="bg-navy-900/90 p-4 rounded-xl border border-navy-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Corridor Side Section</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Window Side
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {bayBerths.slice(6, 8).map((b) => {
                const isSelected = b.no === berthNumber;
                return (
                  <div
                    key={b.no}
                    className={`p-2.5 rounded-xl text-center border transition-all ${
                      isSelected
                        ? "bg-action-orange text-white border-orange-400 shadow-lg ring-2 ring-orange-300"
                        : "bg-navy-800/80 text-slate-300 border-navy-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-75">{b.short}</div>
                    <div className="text-base font-black">#{b.no}</div>
                    <div className="text-[10px] font-medium opacity-90 truncate">{b.type}</div>
                    {isSelected && (
                      <div className="mt-1 text-[9px] font-black bg-white text-action-orange rounded px-1">
                        YOU
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Coach Amenities Guide */}
            <div className="mt-3 pt-3 border-t border-navy-800 grid grid-cols-3 gap-2 text-[10px] text-slate-400 text-center">
              <div className="bg-navy-950/60 p-1.5 rounded-lg border border-navy-800">
                <span className="block font-bold text-slate-200">🔌 Charging</span>
                <span>At every bay</span>
              </div>
              <div className="bg-navy-950/60 p-1.5 rounded-lg border border-navy-800">
                <span className="block font-bold text-slate-200">🛏️ Linen Kit</span>
                <span>Included in AC</span>
              </div>
              <div className="bg-navy-950/60 p-1.5 rounded-lg border border-navy-800">
                <span className="block font-bold text-slate-200">🚽 Bio-Toilets</span>
                <span>Both ends</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
