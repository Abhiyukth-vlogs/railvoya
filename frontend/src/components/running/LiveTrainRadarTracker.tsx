import React, { useState, useEffect } from "react";
import {
  Satellite,
  Gauge,
  Radio,
  Clock,
  Compass,
  Zap,
  ShieldCheck,
  Volume2,
  VolumeX,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface LiveTrainRadarProps {
  trainNumber: string;
  trainName: string;
  currentStation: string;
  delayMinutes: number;
  stops?: any[];
}

export const LiveTrainRadarTracker: React.FC<LiveTrainRadarProps> = ({
  trainNumber,
  trainName,
  currentStation,
  delayMinutes,
  stops = [],
}) => {
  const [speed, setSpeed] = useState(128);
  const [satelliteCount, setSatelliteCount] = useState(18);
  const [radarPing, setRadarPing] = useState(false);
  const [distanceCovered, setDistanceCovered] = useState(482);
  const [totalDistance] = useState(790);

  // Speedometer fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const delta = (Math.random() - 0.48) * 3;
        const next = Math.round(prev + delta);
        return Math.min(160, Math.max(90, next));
      });
      setRadarPing(true);
      setTimeout(() => setRadarPing(false), 800);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round((distanceCovered / totalDistance) * 100));

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#061224] via-navy-primary to-[#030914] border border-cyan-500/20 shadow-2xl p-5 sm:p-7 text-white space-y-6">
      {/* Satellite Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/30">
            <Satellite className={`w-3.5 h-3.5 text-cyan-400 ${radarPing ? "animate-spin" : ""}`} />
            <span>ISRO RTIS SATELLITE RADAR</span>
          </div>

          <span className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Lock: {satelliteCount} NavIC Sats</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            {delayMinutes === 0 ? "● On Time" : `▲ ${delayMinutes}m Delay`}
          </span>
          <span className="text-slate-400">GPS Ping: Just now</span>
        </div>
      </div>

      {/* Main 3D Satellite Tracking Viewport */}
      <div className="relative h-60 sm:h-72 w-full rounded-2xl bg-gradient-to-b from-[#030a16] via-[#05142a] to-[#081b38] border border-cyan-500/30 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
        {/* Radar Circular Sweep Effect */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full border border-cyan-500/20 pointer-events-none">
          <div className="w-full h-full rounded-full border border-cyan-400/10 animate-ping"></div>
        </div>

        {/* Dynamic Starfield & Night Ground Grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {/* Telemetry Header Inside Radar */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
              Live Satellite Telemetry
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white">
              {trainNumber} — {trainName}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-action-orange" />
              <span>Current Proximity: <b>{currentStation}</b></span>
            </p>
          </div>

          {/* Speedometer Radial Gauge */}
          <div className="flex flex-col items-center bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-cyan-500/30 shadow-lg">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
              <Gauge className="w-3 h-3 text-action-orange" />
              Speedometer
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-3xl font-black text-white font-mono">{speed}</span>
              <span className="text-[10px] font-bold text-cyan-400">KM/H</span>
            </div>
            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-action-orange transition-all duration-500"
                style={{ width: `${(speed / 160) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Animated 3D Isometric High-Speed Train on Track */}
        <div className="relative z-10 my-auto py-2">
          {/* Signal Light Indicator */}
          <div className="flex items-center justify-between mb-2 px-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SIGNAL: PROCEED (DOUBLE GREEN)</span>
              </div>
              <span className="text-[11px] text-slate-400">Next Signal: 2.4 km</span>
            </div>

            <span className="text-[11px] font-bold text-cyan-300">
              Platform Expected: <b className="text-white">PF #3</b>
            </span>
          </div>

          {/* Isometric Perspective Track Canvas */}
          <div className="relative h-16 w-full flex items-center overflow-hidden rounded-xl bg-slate-900/60 border border-slate-700/60">
            {/* Rapidly Moving Ground Ties */}
            <div className="absolute inset-0 flex justify-between items-center opacity-30 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-1.5 h-12 bg-slate-400 transform -skew-x-12 animate-pulse"></div>
              ))}
            </div>

            {/* Twin Glowing Steel Rails */}
            <div className="absolute inset-x-0 top-3 h-[2px] bg-gradient-to-r from-cyan-400/40 via-cyan-300 to-cyan-400/40 shadow-[0_0_8px_#38bdf8]"></div>
            <div className="absolute inset-x-0 bottom-3 h-[2px] bg-gradient-to-r from-cyan-400/40 via-cyan-300 to-cyan-400/40 shadow-[0_0_8px_#38bdf8]"></div>

            {/* Glowing Moving Train Icon & Beacon */}
            <div
              className="absolute flex items-center gap-2 transition-all duration-1000 ease-out"
              style={{ left: `calc(${progressPercent}% - 50px)` }}
            >
              {/* Electric Spark at Pantograph */}
              <div className="relative">
                <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-action-orange to-amber-500 text-white font-black text-xs shadow-lg shadow-orange-500/50 flex items-center gap-1.5 border border-white/30 animate-bounce">
                  <Zap className="w-3.5 h-3.5" />
                  <span>TRAIN HERE</span>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-action-orange"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Journey Progress Slider */}
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Distance Traveled: <b>{distanceCovered} km</b></span>
            <span className="font-bold text-cyan-400">{progressPercent}% Completed</span>
            <span>Remaining: <b>{totalDistance - distanceCovered} km</b></span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-action-orange transition-all duration-700 shadow-[0_0_10px_#06b6d4]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Real-Time Safety & KAVACH Certification Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">
            Real-Time Automated Collision Prevention & KAVACH ATP Operational
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Telemetry Standard: RDSO Spec 2024</span>
          <span>•</span>
          <span>Refresh Rate: 1000ms</span>
        </div>
      </div>
    </div>
  );
};
