// ============================================================
// THE GREAT NUMBER RAILWAY — Overlays & Celebration Screens
// - Title Screen (Storybook Adventure Style)
// - Mission Briefing & Step Checklist
// - Next Station Arrival Celebration (Journey Payoff)
// - Live Step Loading Notification Toast
// - Network Complete Grand Victory
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { Trophy, ArrowRight, Play, CheckCircle } from 'lucide-react';

// ── 1. Storybook Title Screen ──
export const RailwayTitleScreen: React.FC = () => {
  const startGame = useRailwayStore((s) => s.startGame);
  const phase = useRailwayStore((s) => s.phase);

  if (phase !== 'title') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 text-white select-none overflow-hidden p-6"
    >
      {/* Decorative Track Stripes */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[repeating-linear-gradient(90deg,#475569_0px,#475569_24px,transparent_24px,transparent_36px)] border-t-4 border-slate-600 opacity-30" />

      {/* Hero Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black tracking-widest uppercase mb-4"
      >
        GRADE 6 MATHEMATICS • PLACE VALUE & ROUNDING
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-5xl sm:text-6xl font-black tracking-tight text-center max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 drop-shadow-lg"
      >
        THE GREAT NUMBER RAILWAY
      </motion.h1>

      <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl text-center mt-3 leading-relaxed">
        Operate a 3D railway! Solve place value & rounding to load <strong className="text-amber-300">Vehicles</strong>, <strong className="text-amber-300">Building Materials</strong>, and <strong className="text-amber-300">Passengers</strong>, lift brakes, turn the signal <strong className="text-emerald-400">GREEN</strong>, and cruise to the next station!
      </p>

      {/* Dual Team Preview */}
      <div className="flex items-center gap-8 my-8">
        <div className="flex flex-col items-center p-4 rounded-2xl bg-blue-950/80 border border-blue-500/50 shadow-xl shadow-blue-500/20 w-44">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl shadow-lg mb-2">
            🔵
          </div>
          <span className="font-black text-xs text-blue-300 tracking-wider">TEAM BLUE</span>
          <span className="text-[10px] text-slate-400 font-bold mt-0.5">LEFT CONSOLE</span>
        </div>

        <div className="text-2xl font-black text-amber-400">VS</div>

        <div className="flex flex-col items-center p-4 rounded-2xl bg-red-950/80 border border-red-500/50 shadow-xl shadow-red-500/20 w-44">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-3xl shadow-lg mb-2">
            🔴
          </div>
          <span className="font-black text-xs text-red-300 tracking-wider">TEAM RED</span>
          <span className="text-[10px] text-slate-400 font-bold mt-0.5">RIGHT CONSOLE</span>
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGame}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 font-black text-lg tracking-wider uppercase shadow-2xl shadow-amber-500/40 border border-amber-300 flex items-center gap-3 cursor-pointer"
      >
        <Play className="w-6 h-6 fill-slate-950" />
        <span>ALL ABOARD • START RUN</span>
      </motion.button>
    </motion.div>
  );
};

// ── 2. Mission Briefing Overlay ──
export const MissionBriefing: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const fromStation = useRailwayStore((s) => s.fromStationName);
  const toStation = useRailwayStore((s) => s.toStationName);
  const setPhase = useRailwayStore((s) => s.setPhase);
  const setTimerActive = useRailwayStore((s) => s.setTimerActive);
  const setTimeRemaining = useRailwayStore((s) => s.setTimeRemaining);

  if (phase !== 'briefing' || !challenge) return null;

  const handleStartMission = () => {
    setTimeRemaining(challenge.timeLimit);
    setTimerActive(true);
    setPhase('challenge');
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm select-none p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl text-white text-center flex flex-col items-center"
      >
        <div className="text-4xl mb-2">{challenge.stepIcon}</div>
        <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
          {challenge.stepTitle}
        </span>
        <h2 className="text-2xl font-black mt-1 mb-2 text-white">
          {challenge.missionTitle}
        </h2>

        {/* Station Path */}
        <div className="px-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 mb-4 flex items-center gap-2">
          <span>🚉 {fromStation}</span>
          <span className="text-amber-400">➔</span>
          <span className="text-emerald-400">🏁 {toStation}</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium mb-6">
          {challenge.context.narrative}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartMission}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>BEGIN STEP 1 • LOAD VEHICLES</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

// ── 3. Next Station Arrival Celebration (Journey Payoff) ──
export const StationArrivalOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const currentStationIdx = useRailwayStore((s) => s.currentStationIndex);
  const stations = useRailwayStore((s) => s.stations);
  const fromStation = useRailwayStore((s) => s.fromStationName);
  const nextStepOrDepart = useRailwayStore((s) => s.nextStepOrDepart);

  if (phase !== 'station-arrived') return null;

  const arrivedStation = stations[currentStationIdx]?.name || 'Pine Ridge Terminal';

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/85 backdrop-blur-md select-none p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg w-full bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-8 shadow-2xl text-white text-center flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 mb-4 animate-bounce">
          🏁
        </div>

        <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
          SUCCESSFUL RAILWAY DELIVERY
        </span>
        <h2 className="text-3xl font-black mt-1 mb-2 text-white">
          WELCOME TO {arrivedStation.toUpperCase()}!
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed font-medium mb-4">
          All 5 stages completed: Vehicles, Building Materials, and Passengers have arrived safely from {fromStation}!
        </p>

        <div className="px-5 py-2.5 rounded-2xl bg-emerald-950 border border-emerald-400/40 text-emerald-300 text-sm font-black mb-6">
          🎉 +500 BONUS POINTS AWARDED TO BOTH TEAMS!
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextStepOrDepart}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>CONTINUE TO NEXT STATION ADVENTURE</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

// ── 4. Live Step Loading Toast Notification ──
export const StepLoadingToast: React.FC = () => {
  const stepMsg = useRailwayStore((s) => s.stepAnimationMessage);

  return (
    <AnimatePresence>
      {stepMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 border-2 border-emerald-300 text-white font-black text-sm tracking-wide shadow-2xl shadow-emerald-500/50 flex items-center gap-3 select-none pointer-events-none"
        >
          <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{stepMsg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── 5. Network Complete Victory Screen ──
export const NetworkCompleteOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);

  if (phase !== 'network-complete') return null;

  const winner =
    blueTeam.score > redTeam.score
      ? 'BLUE ENGINEERS'
      : redTeam.score > blueTeam.score
        ? 'RED ENGINEERS'
        : 'DRAW';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg select-none p-6 text-white text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full flex flex-col items-center"
      >
        <Trophy className="w-24 h-24 text-amber-400 drop-shadow-lg mb-4 animate-bounce" />
        <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
          RAILWAY NETWORK FULLY OPERATIONAL
        </span>
        <h2 className="text-4xl font-black mt-1 mb-6 text-white">
          THE GRAND EXPEDITION COMPLETE!
        </h2>

        {/* Scores */}
        <div className="flex gap-6 justify-center w-full mb-8">
          <div className="flex-1 p-6 rounded-3xl bg-blue-950/80 border border-blue-500/50 shadow-xl">
            <span className="text-xs font-black text-blue-400 uppercase">TEAM BLUE</span>
            <div className="text-4xl font-black text-white mt-2">{blueTeam.score}</div>
          </div>
          <div className="flex-1 p-6 rounded-3xl bg-red-950/80 border border-red-500/50 shadow-xl">
            <span className="text-xs font-black text-red-400 uppercase">TEAM RED</span>
            <div className="text-4xl font-black text-white mt-2">{redTeam.score}</div>
          </div>
        </div>

        <div className="text-2xl font-black text-amber-300 mb-8">
          {winner === 'DRAW' ? '🤝 IT\'S A DRAW! PERFECT COOPERATION!' : `🏆 WINNER: ${winner}!`}
        </div>

        <button
          onClick={() => (window.location.href = '/')}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-base uppercase tracking-wider shadow-xl shadow-amber-500/40 cursor-pointer"
        >
          RETURN TO ARCADE HUB
        </button>
      </motion.div>
    </div>
  );
};
