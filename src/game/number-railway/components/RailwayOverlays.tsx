// ============================================================
// THE GREAT NUMBER RAILWAY — Overlays & Celebration Screens
// Dynamic Red VS Blue Showdown Environment:
// - Left: Team Blue Locomotive with Blue Energy Glow & Custom Naming
// - Center: Fiery Animated VS Clash with Smoke & Fire Effects
// - Right: Team Red Locomotive with Red Energy Glow & Custom Naming
// - 5, 10, 15 Question Match Selector
// - Solution Reveal & Victory Celebration Modals
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { Trophy, ArrowRight, Play, CheckCircle, Flame, Sparkles } from 'lucide-react';
import Image from 'next/image';

// ── 1. Epic Red VS Blue Showdown Title Screen ──
export const RailwayTitleScreen: React.FC = () => {
  const startGame = useRailwayStore((s) => s.startGame);
  const phase = useRailwayStore((s) => s.phase);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);
  const setTeamName = useRailwayStore((s) => s.setTeamName);
  const questionCountConfig = useRailwayStore((s) => s.questionCountConfig);
  const setQuestionCountConfig = useRailwayStore((s) => s.setQuestionCountConfig);

  if (phase !== 'title') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-sky-400 via-sky-300 to-amber-100 text-slate-900 select-none overflow-y-auto p-3 sm:p-5"
    >
      {/* Background Animated Railway Track Ties */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[repeating-linear-gradient(90deg,#94a3b8_0px,#94a3b8_24px,transparent_24px,transparent_36px)] border-t-4 border-slate-400 opacity-25 pointer-events-none" />

      {/* ── Header Title & Badge ── */}
      <div className="flex flex-col items-center text-center mt-1 z-10">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-4 py-1 rounded-full bg-white/95 border border-amber-400 text-amber-900 text-[10px] sm:text-xs font-black tracking-widest uppercase mb-1 shadow-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>GRADE 6 MATHEMATICS • PLACE VALUE & ROUNDING</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 uppercase leading-none drop-shadow-sm">
          THE GREAT NUMBER RAILWAY
        </h1>
        <p className="text-slate-700 text-xs sm:text-sm font-bold mt-1 max-w-xl text-center">
          Race across the junction, answer first to board passengers & clear green signals!
        </p>
      </div>

      {/* ── Central RED vs BLUE Showdown Environment ── */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-11 gap-3 my-auto items-center z-10 px-2">
        {/* ── TEAM BLUE (Left Operator) ── */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-5 p-4 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-blue-400 shadow-2xl flex flex-col items-center relative overflow-hidden group"
          style={{
            boxShadow: '0 12px 35px rgba(37,99,235,0.25)',
          }}
        >
          {/* Blue Ambient Smoke Glow */}
          <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

          {/* Blue Train Illustration (Facing Right → Toward Center) */}
          <div className="relative w-full h-32 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100 to-blue-50 border border-blue-200 flex items-center justify-center mb-3">
            <img
              src="/images/blue_locomotive.png"
              alt="Team Blue Locomotive"
              className="w-full h-full object-contain scale-x-[-1] drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-blue-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
              LEFT TRACK SIDING
            </div>
          </div>

          {/* Blue Team Name Input */}
          <div className="w-full text-left">
            <label className="text-[10px] font-black uppercase tracking-wider text-blue-900 flex items-center justify-between mb-1">
              <span>TEAM 1 (BLUE)</span>
              <span className="text-[9px] text-blue-600 font-bold">LEFT OPERATOR</span>
            </label>
            <input
              type="text"
              value={blueTeam.name}
              onChange={(e) => setTeamName('blue', e.target.value)}
              placeholder="Enter Team Name"
              maxLength={20}
              className="w-full px-3.5 py-2.5 rounded-xl bg-blue-50/70 border-2 border-blue-300 focus:border-blue-600 font-black text-xs text-blue-950 outline-none shadow-inner transition-all"
            />
          </div>
        </motion.div>

        {/* ── FIERY VS CLASH CENTER EMBLEM ── */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0 relative"
        >
          {/* Pulsing Fire & Smoke Aura */}
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-amber-500 to-red-500 blur-xl opacity-60 animate-pulse pointer-events-none" />

          {/* Golden Shield VS Emblem */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-amber-300 via-orange-500 to-red-600 p-0.5 shadow-2xl flex items-center justify-center transform rotate-45 border-2 border-yellow-200">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center transform -rotate-45">
              <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]">
                VS
              </span>
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce -mt-1" />
            </div>
          </div>
        </motion.div>

        {/* ── TEAM RED (Right Operator) ── */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-5 p-4 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-red-400 shadow-2xl flex flex-col items-center relative overflow-hidden group"
          style={{
            boxShadow: '0 12px 35px rgba(220,38,38,0.25)',
          }}
        >
          {/* Red Ambient Smoke Glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-red-400/20 blur-2xl pointer-events-none" />

          {/* Red Train Illustration (Facing Left ← Toward Center) */}
          <div className="relative w-full h-32 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-b from-rose-100 to-red-50 border border-red-200 flex items-center justify-center mb-3">
            <img
              src="/images/red_locomotive.png"
              alt="Team Red Locomotive"
              className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-lg bg-red-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
              RIGHT TRACK SIDING
            </div>
          </div>

          {/* Red Team Name Input */}
          <div className="w-full text-left">
            <label className="text-[10px] font-black uppercase tracking-wider text-red-900 flex items-center justify-between mb-1">
              <span>TEAM 2 (RED)</span>
              <span className="text-[9px] text-red-600 font-bold">RIGHT OPERATOR</span>
            </label>
            <input
              type="text"
              value={redTeam.name}
              onChange={(e) => setTeamName('red', e.target.value)}
              placeholder="Enter Team Name"
              maxLength={20}
              className="w-full px-3.5 py-2.5 rounded-xl bg-red-50/70 border-2 border-red-300 focus:border-red-600 font-black text-xs text-red-950 outline-none shadow-inner transition-all"
            />
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Section: Question Selector & Action Start ── */}
      <div className="w-full max-w-xl flex flex-col items-center gap-3 z-10 mb-1">
        {/* Match Length Selector (5, 10, 15) */}
        <div className="w-full p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-300 shadow-md flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 ml-2">
            🎯 QUESTIONS:
          </span>
          <div className="flex items-center gap-2">
            {([5, 10, 15] as const).map((cnt) => {
              const isSelected = questionCountConfig === cnt;
              const stageText = cnt === 5 ? '1 STAGE' : cnt === 10 ? '2 STAGES' : '3 STAGES';
              return (
                <button
                  key={cnt}
                  onClick={() => setQuestionCountConfig(cnt)}
                  className={`py-1.5 px-3 rounded-xl font-black text-xs transition-all border-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-amber-600 shadow-md scale-105'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-amber-400'
                  }`}
                >
                  {cnt} Qs • <span className="text-[9px] font-bold">{stageText}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Game Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={startGame}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase shadow-2xl shadow-amber-500/40 border-2 border-amber-500 flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>ALL ABOARD • START SHOWDOWN 🚂</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// ── 2. Round Intro Card (Light Theme) ──
export const RoundIntroModal: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const roundIndex = useRailwayStore((s) => s.currentRoundIndex);
  const totalRounds = useRailwayStore((s) => s.totalRounds);
  const rounds = useRailwayStore((s) => s.rounds);
  const beginChallenge = useRailwayStore((s) => s.beginChallenge);

  if (phase !== 'round-intro') return null;

  const round = rounds[roundIndex];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/35 backdrop-blur-xs select-none p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-slate-900 text-center flex flex-col items-center"
      >
        <div className="text-4xl mb-1.5">🚂</div>
        <span className="text-[11px] font-black tracking-widest text-amber-700 uppercase">
          STAGE {roundIndex + 1} OF {totalRounds}
        </span>
        <h2 className="text-2xl font-black mt-0.5 mb-2 text-slate-950">
          {round?.name}
        </h2>

        <div className="px-3.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="text-blue-700 font-black">🚉 Skillizee Junction</span>
          <span className="text-amber-500 font-bold">➔</span>
          <span className="text-emerald-700 font-black">🏁 {round?.subtitle}</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-semibold mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
          5 Place Value & Rounding questions. First correct team claims the question, seats a team passenger, and turns the signal green!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={beginChallenge}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 border border-amber-500 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>BEGIN STAGE {roundIndex + 1}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

// ── 3. Question Solution Reveal Card (Light Theme) ──
export const QuestionRevealOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);
  const advance = useRailwayStore((s) => s.advanceQuestion);

  if (phase !== 'question-reveal' || !challenge) return null;

  const correctOption = challenge.options.find(
    (o) => String(o.value) === String(challenge.correctAnswer)
  );
  const answerDisplay = correctOption ? correctOption.label : String(challenge.correctAnswer);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs select-none p-4 pointer-events-auto">
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

        {/* Correct Answer Display */}
        <div
          className="w-full py-3 px-4 rounded-2xl text-center font-black shadow-sm mb-3 border-2"
          style={{
            backgroundColor: '#ecfdf5',
            borderColor: '#10b981',
          }}
        >
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 block mb-0.5">
            CORRECT ANSWER
          </span>
          <div className="font-mono text-xl font-black text-emerald-950">
            {answerDisplay}
          </div>
        </div>

        {/* Mathematical Explanation */}
        <p className="text-[11px] text-slate-700 leading-snug font-medium mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left w-full">
          💡 {challenge.explanation}
        </p>

        {/* Performance Scores */}
        <div className="flex gap-3 w-full justify-center mb-3">
          <div className={`flex-1 p-2 rounded-xl border ${blueTeam.lastResult === 'correct' ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
            <span className="text-[9px] font-black uppercase">{blueTeam.name}</span>
            <div className="text-xs font-black mt-0.5">
              {blueTeam.lastResult === 'correct' ? `+${blueTeam.lastScoreGained} PTS` : '0 PTS'}
            </div>
          </div>
          <div className={`flex-1 p-2 rounded-xl border ${redTeam.lastResult === 'correct' ? 'bg-red-50 border-red-400 text-red-900' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
            <span className="text-[9px] font-black uppercase">{redTeam.name}</span>
            <div className="text-xs font-black mt-0.5">
              {redTeam.lastResult === 'correct' ? `+${redTeam.lastScoreGained} PTS` : '0 PTS'}
            </div>
          </div>
        </div>

        <button
          onClick={advance}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
        >
          CONTINUE TO NEXT QUESTION ➔
        </button>
      </motion.div>
    </div>
  );
};

// ── 4. Live Toast Notification ──
export const LiveToast: React.FC = () => {
  const msg = useRailwayStore((s) => s.toastMessage);

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute top-18 left-1/2 -translate-x-1/2 z-40 px-5 py-2 rounded-2xl bg-white border-2 border-emerald-500 text-slate-900 font-black text-xs tracking-wide shadow-2xl flex items-center gap-2 select-none pointer-events-none"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── 5. Winner Plaque Overlay ──
export const WinnerPlaqueOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const roundWinner = useRailwayStore((s) => s.roundWinner);
  const roundIndex = useRailwayStore((s) => s.currentRoundIndex);
  const rounds = useRailwayStore((s) => s.rounds);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);
  const proceed = useRailwayStore((s) => s.proceedToNextRound);

  if (phase !== 'winner-reveal') return null;

  const round = rounds[roundIndex];
  const isBlue = roundWinner === 'blue';
  const isRed = roundWinner === 'red';
  const winnerName = isBlue ? blueTeam.name : isRed ? redTeam.name : 'PERFECT DRAW';

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs select-none p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-slate-900 text-center flex flex-col items-center"
      >
        <div className="text-4xl mb-2 animate-bounce">🏆</div>
        <span className="text-[11px] font-black tracking-widest text-amber-700 uppercase">
          ROUTE CLEARED • STAGE {roundIndex + 1}
        </span>
        <h2 className="text-3xl font-black mt-0.5 mb-2 text-slate-950">
          {winnerName} WINS ROUTE!
        </h2>

        <p className="text-xs text-slate-700 leading-relaxed font-semibold mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
          Destination <strong className="text-emerald-700">{round?.subtitle}</strong> successfully reached on the railway network!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={proceed}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 border border-amber-500 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>PROCEED TO NEXT STAGE</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

// ── 6. Grand Network Restoration Ceremony ──
export const NetworkCompleteOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const matchWinner = useRailwayStore((s) => s.matchWinner);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);
  const startGame = useRailwayStore((s) => s.startGame);

  if (phase !== 'network-complete') return null;

  const isBlue = matchWinner === 'blue';
  const isRed = matchWinner === 'red';
  const championName = isBlue ? blueTeam.name : isRed ? redTeam.name : 'PERFECT CHAMPIONSHIP DRAW';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md select-none p-6 text-slate-900 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full bg-white border-2 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center"
      >
        <Trophy className="w-20 h-20 text-amber-500 drop-shadow-md mb-2 animate-bounce" />
        <span className="text-xs font-black tracking-widest text-amber-800 uppercase">
          RAILWAY NETWORK RESTORED
        </span>

        <h2 className="text-3xl sm:text-4xl font-black mt-1 mb-4 text-slate-950">
          🏆 {championName} WINS CHAMPIONSHIP!
        </h2>

        {/* Scores */}
        <div className="flex gap-4 justify-center w-full my-4">
          <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${isBlue ? 'bg-blue-50 border-blue-500 shadow-lg scale-105' : 'bg-slate-50 border-slate-200 opacity-85'}`}>
            <span className="text-[11px] font-black text-blue-800 uppercase">{blueTeam.name}</span>
            <div className="text-3xl font-black text-slate-950 mt-1">{blueTeam.score}</div>
            <div className="text-[9px] text-slate-600 font-bold mt-0.5">
              {blueTeam.roundsWon} Routes Cleared
            </div>
          </div>

          <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${isRed ? 'bg-red-50 border-red-500 shadow-lg scale-105' : 'bg-slate-50 border-slate-200 opacity-85'}`}>
            <span className="text-[11px] font-black text-red-800 uppercase">{redTeam.name}</span>
            <div className="text-3xl font-black text-slate-950 mt-1">{redTeam.score}</div>
            <div className="text-[9px] text-slate-600 font-bold mt-0.5">
              {redTeam.roundsWon} Routes Cleared
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full justify-center mt-2">
          <button
            onClick={startGame}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
          >
            PLAY AGAIN 🔄
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
          >
            RETURN TO ARCADE HUB
          </button>
        </div>
      </motion.div>
    </div>
  );
};
