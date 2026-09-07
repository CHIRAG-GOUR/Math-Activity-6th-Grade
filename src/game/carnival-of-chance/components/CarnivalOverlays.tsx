// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Game Overlays & Modals
// Clean, warm, stylized porcelain dialogs and victory celebrations
// ============================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { Play, Compass, Trophy, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { ATTRACTIONS } from '../engine/probabilityData';

// ── 1. Carnival Title Screen ──
export const TitleScreenOverlay: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const startGame = useCarnivalStore((s) => s.startGame);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);
  const setTeamName = useCarnivalStore((s) => s.setTeamName);

  if (phase !== 'title') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 bg-sky-300/40 backdrop-blur-sm select-none overflow-y-auto"
    >
      {/* ── Top Carnival Title ── */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 16 }}
        className="text-center mt-2 sm:mt-6"
      >
        <h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wider text-yellow-400 uppercase leading-tight drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)]"
          style={{
            WebkitTextStroke: '2.5px #000000',
            textShadow:
              '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 4px 0 #000, 0 8px 18px rgba(0,0,0,0.85)',
          }}
        >
          THE GREAT CARNIVAL OF CHANCE
        </h1>
        <p className="text-xs sm:text-sm md:text-base font-black tracking-widest text-slate-900 uppercase mt-1">
          GRADE 6 PROBABILITY & CHANCE THEME PARK
        </p>
      </motion.div>

      {/* ── Center Two-Team Operator Registration ── */}
      <div className="w-full max-w-5xl flex flex-row items-center justify-between my-auto px-4 sm:px-10 gap-6">
        {/* Team Blue (Left) */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.15 }}
          className="w-72 sm:w-80 md:w-96 p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border-4 border-blue-500 shadow-[0_20px_45px_rgba(37,99,235,0.4)] flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-sm mb-2">
            B
          </div>
          <span className="text-xs sm:text-sm font-black text-blue-900 uppercase tracking-wider">
            TEAM 1 (BLUE) • LEFT OPERATOR
          </span>
          <input
            type="text"
            value={blueTeam.name}
            onChange={(e) => setTeamName('blue', e.target.value)}
            placeholder="Team Blue Name"
            maxLength={20}
            className="w-full mt-3 px-3 py-2 rounded-xl bg-blue-50 border-2 border-blue-300 font-black text-sm text-blue-950 text-center outline-none"
          />
        </motion.div>

        {/* Center Festival Emblem */}
        <div className="text-center font-black text-2xl sm:text-3xl text-slate-800 drop-shadow-md shrink-0">
          VS
        </div>

        {/* Team Red (Right) */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.15 }}
          className="w-72 sm:w-80 md:w-96 p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border-4 border-red-500 shadow-[0_20px_45px_rgba(220,38,38,0.4)] flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-sm mb-2">
            R
          </div>
          <span className="text-xs sm:text-sm font-black text-red-900 uppercase tracking-wider">
            TEAM 2 (RED) • RIGHT OPERATOR
          </span>
          <input
            type="text"
            value={redTeam.name}
            onChange={(e) => setTeamName('red', e.target.value)}
            placeholder="Team Red Name"
            maxLength={20}
            className="w-full mt-3 px-3 py-2 rounded-xl bg-red-50 border-2 border-red-300 font-black text-sm text-red-950 text-center outline-none"
          />
        </motion.div>
      </div>

      {/* ── Start Button ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGame}
        className="w-auto min-w-[280px] sm:min-w-[340px] py-3.5 sm:py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 font-black text-base sm:text-lg md:text-xl tracking-wider uppercase shadow-[0_12px_35px_rgba(245,158,11,0.65)] border-3 border-amber-500 flex items-center justify-center gap-3 cursor-pointer hover:brightness-110 active:scale-95 transition-all mb-4"
      >
        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950" />
        <span>ENTER THE CARNIVAL</span>
      </motion.button>
    </motion.div>
  );
};

// ── 2. Attraction Briefing Intro Modal ──
export const AttractionIntroModal: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeAttractionId = useCarnivalStore((s) => s.activeAttractionId);
  const startPredicting = useCarnivalStore((s) => s.startPredicting);
  const returnToIsland = useCarnivalStore((s) => s.returnToIsland);

  if (phase !== 'attraction-intro') return null;

  const attr = ATTRACTIONS.find((a) => a.id === activeAttractionId);
  if (!attr) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg p-6 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-amber-400 shadow-2xl text-center text-slate-900"
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mb-3">
          <Compass className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-950">{attr.name}</h2>
        <p className="text-xs font-black text-amber-700 uppercase tracking-wider mt-0.5">{attr.subtitle}</p>
        <p className="text-sm text-slate-700 mt-3 leading-relaxed">{attr.description}</p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={returnToIsland}
            className="py-2.5 px-4 rounded-xl border-2 border-slate-300 font-black text-xs text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            RETURN TO ISLAND
          </button>
          <button
            onClick={startPredicting}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-105 border-2 border-amber-600 font-black text-sm text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>START EXPERIMENT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── 3. Observation & Reasoning Overlay ──
export const ObservationReasoningOverlay: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const latestRandomOutcome = useCarnivalStore((s) => s.latestRandomOutcome);
  const nextChallenge = useCarnivalStore((s) => s.nextChallenge);

  if (phase !== 'observation-reasoning') return null;
  if (!activeChallenge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/35 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg p-6 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-emerald-400 shadow-2xl text-center text-slate-900"
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
          PHYSICAL MACHINE RESULT
        </div>
        <div className="text-2xl font-black text-slate-950 mt-1">
          Outcome: {latestRandomOutcome || 'Event Selected'}
        </div>

        {/* Mathematical Explanation */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs font-bold text-slate-800 leading-relaxed">
          <div className="text-[9px] font-black uppercase text-slate-700 mb-1">
            MATHEMATICAL EXPLANATION:
          </div>
          {activeChallenge.explanation}
        </div>

        {activeChallenge.reflectionQuestion && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-[11px] font-bold text-amber-950">
            <span className="font-black text-amber-700">Reflect: </span>
            {activeChallenge.reflectionQuestion}
          </div>
        )}

        <button
          onClick={nextChallenge}
          className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 border-2 border-emerald-700 font-black text-sm text-white shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>NEXT CHALLENGE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

// ── 4. Grand Celebration & Victory Overlay ──
export const GrandCelebrationOverlay: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);
  const startGame = useCarnivalStore((s) => s.startGame);

  if (phase !== 'grand-celebration') return null;

  const winner =
    blueTeam.score > redTeam.score
      ? { name: blueTeam.name, color: 'text-blue-600', score: blueTeam.score }
      : redTeam.score > blueTeam.score
      ? { name: redTeam.name, color: 'text-red-600', score: redTeam.score }
      : { name: 'IT IS A TIE!', color: 'text-amber-600', score: blueTeam.score };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md select-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl p-8 rounded-3xl bg-white/95 backdrop-blur-md border-4 border-amber-400 shadow-[0_25px_60px_rgba(245,158,11,0.5)] text-center text-slate-900"
      >
        <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
        <h2 className="text-3xl font-black uppercase text-slate-950 mt-2">
          CARNIVAL OF CHANCE COMPLETE!
        </h2>
        <p className="text-xs font-black uppercase tracking-widest text-amber-700 mt-1">
          GRADE 6 PROBABILITY MASTERY ACHIEVED
        </p>

        {/* Winner Announcement */}
        <div className="my-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300">
          <div className="text-xs font-black text-slate-500 uppercase">Grand Carnival Champion</div>
          <div className={`text-2xl font-black ${winner.color} mt-1`}>{winner.name}</div>
        </div>

        {/* Dual Scores Comparison */}
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="text-[10px] font-black text-blue-800 uppercase">{blueTeam.name}</div>
            <div className="text-xl font-black text-blue-950 font-mono mt-1">
              {blueTeam.score.toLocaleString()} PTS
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200">
            <div className="text-[10px] font-black text-red-800 uppercase">{redTeam.name}</div>
            <div className="text-xl font-black text-red-950 font-mono mt-1">
              {redTeam.score.toLocaleString()} PTS
            </div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-105 border-2 border-amber-600 font-black text-sm text-slate-950 shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>PLAY AGAIN</span>
        </button>
      </motion.div>
    </div>
  );
};
