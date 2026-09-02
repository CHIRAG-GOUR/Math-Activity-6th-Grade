// ============================================================
// THE GREAT NUMBER RAILWAY — Overlays & Celebration Screens
// Bright, Light-Themed Storybook Modals:
// - Title Screen (Sunny Sky & Warm Cards)
// - Mission Briefing (Crisp White Card + Amber Button)
// - Round Reveal Solution & Points Feedback
// - Station Arrival & Game Over Champion Celebrations
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
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 via-sky-300 to-amber-100 text-slate-900 select-none overflow-hidden p-6"
    >
      {/* Decorative Track Stripes */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[repeating-linear-gradient(90deg,#94a3b8_0px,#94a3b8_24px,transparent_24px,transparent_36px)] border-t-4 border-slate-400 opacity-40" />

      {/* Hero Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-1.5 rounded-full bg-white/95 border-2 border-amber-400 text-amber-800 text-xs font-black tracking-widest uppercase mb-3 shadow-md"
      >
        GRADE 6 MATHEMATICS • PLACE VALUE & ROUNDING
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-center max-w-4xl text-slate-950 drop-shadow-sm"
      >
        THE GREAT NUMBER RAILWAY
      </motion.h1>

      <p className="text-slate-800 text-sm sm:text-base font-bold max-w-xl text-center mt-2 leading-relaxed">
        Solve place value & rounding to load <strong className="text-blue-700">Vehicles</strong>, <strong className="text-amber-800">Materials</strong>, and <strong className="text-purple-700">Passengers</strong>, lift brakes, turn signal <strong className="text-emerald-700">GREEN</strong>, and cruise to the next station!
      </p>

      {/* Dual Team Preview Cards */}
      <div className="flex items-center gap-6 my-6">
        <div className="flex flex-col items-center p-4 rounded-2xl bg-white border-2 border-blue-400 shadow-xl w-44">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl shadow-md mb-1.5 text-white">
            🔵
          </div>
          <span className="font-black text-xs text-blue-800 tracking-wider">TEAM BLUE</span>
          <span className="text-[10px] text-slate-500 font-bold mt-0.5">LEFT CONSOLE</span>
        </div>

        <div className="text-2xl font-black text-amber-600">VS</div>

        <div className="flex flex-col items-center p-4 rounded-2xl bg-white border-2 border-red-400 shadow-xl w-44">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-2xl shadow-md mb-1.5 text-white">
            🔴
          </div>
          <span className="font-black text-xs text-red-800 tracking-wider">TEAM RED</span>
          <span className="text-[10px] text-slate-500 font-bold mt-0.5">RIGHT CONSOLE</span>
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGame}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 font-black text-base tracking-wider uppercase shadow-xl shadow-amber-500/30 border-2 border-amber-500 flex items-center gap-3 cursor-pointer"
      >
        <Play className="w-5 h-5 fill-slate-950" />
        <span>ALL ABOARD • START RUN</span>
      </motion.button>
    </motion.div>
  );
};

// ── 2. Mission Briefing Overlay (Bright Light Theme!) ──
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
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs select-none p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-slate-900 text-center flex flex-col items-center"
      >
        <div className="text-4xl mb-1.5">{challenge.stepIcon}</div>
        <span className="text-[11px] font-black tracking-widest text-amber-700 uppercase">
          {challenge.stepTitle}
        </span>
        <h2 className="text-2xl font-black mt-0.5 mb-2 text-slate-950">
          {challenge.missionTitle}
        </h2>

        {/* Station Path */}
        <div className="px-3.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="text-blue-700 font-black">🚉 {fromStation}</span>
          <span className="text-amber-500 font-bold">➔</span>
          <span className="text-emerald-700 font-black">🏁 {toStation}</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-semibold mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
          {challenge.context.narrative}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartMission}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 border border-amber-500 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>BEGIN STEP 1 • LOAD VEHICLES</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

// ── 3. Round Reveal Overlay (Light Theme) ──
export const RoundRevealOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);

  if (phase !== 'round-reveal' || !challenge) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs select-none p-4 pointer-events-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-md w-full bg-white border-2 border-emerald-400 rounded-3xl p-5 shadow-2xl text-slate-900 text-center flex flex-col items-center"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
          ROUND SOLUTION REVEAL
        </span>
        <h3 className="text-base font-black text-slate-950 mt-0.5 mb-2">
          {challenge.prompt}
        </h3>

        {/* Correct Answer */}
        <div className="px-5 py-1.5 rounded-xl bg-emerald-600 border border-emerald-700 text-white font-mono text-xl font-black shadow-md mb-2.5">
          CORRECT: {String(challenge.correctAnswer)}
        </div>

        {/* Mathematical Explanation */}
        <p className="text-[11px] text-slate-700 leading-snug font-medium mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left">
          💡 {challenge.explanation}
        </p>

        {/* Scores */}
        <div className="flex gap-3 w-full justify-center">
          <div className={`flex-1 p-2 rounded-xl border ${blueTeam.lastResult === 'correct' ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
            <span className="text-[9px] font-black uppercase">TEAM BLUE</span>
            <div className="text-xs font-black mt-0.5">
              {blueTeam.lastResult === 'correct' ? `+${blueTeam.lastScoreGained} PTS` : '0 PTS'}
            </div>
          </div>
          <div className={`flex-1 p-2 rounded-xl border ${redTeam.lastResult === 'correct' ? 'bg-red-50 border-red-400 text-red-900' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
            <span className="text-[9px] font-black uppercase">TEAM RED</span>
            <div className="text-xs font-black mt-0.5">
              {redTeam.lastResult === 'correct' ? `+${redTeam.lastScoreGained} PTS` : '0 PTS'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── 4. Next Station Arrival Celebration (Light Theme) ──
export const StationArrivalOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const currentStationIdx = useRailwayStore((s) => s.currentStationIndex);
  const stations = useRailwayStore((s) => s.stations);
  const fromStation = useRailwayStore((s) => s.fromStationName);
  const nextStepOrDepart = useRailwayStore((s) => s.advanceToNextQuestion);

  if (phase !== 'station-arrived') return null;

  const arrivedStation = stations[currentStationIdx]?.name || 'Pine Ridge Terminal';

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs select-none p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg w-full bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl text-slate-900 text-center flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-400 flex items-center justify-center text-3xl shadow-md mb-2 animate-bounce">
          🏁
        </div>

        <span className="text-xs font-black tracking-widest text-emerald-800 uppercase">
          SUCCESSFUL RAILWAY ARRIVAL
        </span>
        <h2 className="text-2xl font-black mt-0.5 mb-2 text-slate-950">
          WELCOME TO {arrivedStation.toUpperCase()}!
        </h2>

        <p className="text-xs text-slate-700 leading-relaxed font-semibold mb-4 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
          All 5 stages completed: Vehicles, Building Materials, and Passengers have arrived safely from {fromStation}!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextStepOrDepart}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>PROCEED TO CHAMPIONSHIP CEREMONY</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

// ── 5. Live Step Loading Toast Notification ──
export const StepLoadingToast: React.FC = () => {
  const stepMsg = useRailwayStore((s) => s.stepAnimationMessage);

  return (
    <AnimatePresence>
      {stepMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute top-18 left-1/2 -translate-x-1/2 z-40 px-5 py-2 rounded-2xl bg-emerald-600 border-2 border-emerald-300 text-white font-black text-xs tracking-wide shadow-xl shadow-emerald-600/30 flex items-center gap-2 select-none pointer-events-none"
        >
          <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{stepMsg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── 6. Game Over / Grand Champion Victory Screen (Light Theme) ──
export const NetworkCompleteOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const winner = useRailwayStore((s) => s.winner);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);
  const startGame = useRailwayStore((s) => s.startGame);

  if (phase !== 'game-over') return null;

  const isBlueWinner = winner === 'blue';
  const isRedWinner = winner === 'red';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md select-none p-6 text-slate-900 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full bg-white border-2 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center"
      >
        <Trophy className="w-20 h-20 text-amber-500 drop-shadow-md mb-2 animate-bounce" />
        <span className="text-xs font-black tracking-widest text-amber-800 uppercase">
          RAILWAY GRAND EXPEDITION COMPLETE
        </span>

        <h2 className="text-3xl sm:text-4xl font-black mt-1 mb-4 text-slate-950">
          {isBlueWinner
            ? '🏆 TEAM BLUE WINS!'
            : isRedWinner
              ? '🏆 TEAM RED WINS!'
              : '🤝 PERFECT DRAW!'}
        </h2>

        {/* Score Comparison Podium */}
        <div className="flex gap-4 justify-center w-full my-4">
          <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${isBlueWinner ? 'bg-blue-50 border-blue-500 shadow-lg scale-105' : 'bg-slate-50 border-slate-200 opacity-85'}`}>
            <span className="text-[11px] font-black text-blue-800 uppercase">TEAM BLUE</span>
            <div className="text-3xl font-black text-slate-950 mt-1">{blueTeam.score}</div>
            <div className="text-[9px] text-slate-600 font-bold mt-0.5">
              {blueTeam.correctAnswersCount} Correct Answers
            </div>
          </div>

          <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${isRedWinner ? 'bg-red-50 border-red-500 shadow-lg scale-105' : 'bg-slate-50 border-slate-200 opacity-85'}`}>
            <span className="text-[11px] font-black text-red-800 uppercase">TEAM RED</span>
            <div className="text-3xl font-black text-slate-950 mt-1">{redTeam.score}</div>
            <div className="text-[9px] text-slate-600 font-bold mt-0.5">
              {redTeam.correctAnswersCount} Correct Answers
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full justify-center mt-2">
          <button
            onClick={startGame}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            PLAY AGAIN 🔄
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 cursor-pointer"
          >
            RETURN TO ARCADE HUB
          </button>
        </div>
      </motion.div>
    </div>
  );
};
