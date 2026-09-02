// ============================================================
// THE GREAT NUMBER RAILWAY — Overlays & Celebration Screens
// Authentic Comic Red VS Blue Lightning Showdown Arena:
// - Left: TEAM 1 (RED) in a compact Square Card with Original Image
// - Center: Jagged Comic Lightning Bolt & Iconic 3D "VS" Emblem
// - Right: TEAM 2 (BLUE) in a compact Square Card with Original Image
// - Pure Solid Graphic Red/Blue Sunburst Background (No 3D bleed)
// - Compact Start Button & Questions Bar (Not stretched)
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { Trophy, ArrowRight, Play, CheckCircle, Sparkles } from 'lucide-react';

// ── 1. Comic Red VS Blue Lightning Showdown Title Screen ──
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-between select-none overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6"
    >
      {/* ── 1. Animated HD Comic Background with Soft Blur & Brightness Comfort ── */}
      <motion.img
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.04, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        src="/images/comic_vs_bg_hd.png"
        alt="Comic Red vs Blue Background HD"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none blur-[2.5px] brightness-90"
      />
      {/* Subtle Comfort Vignette Overlay */}
      <div className="absolute inset-0 bg-slate-950/15 pointer-events-none z-0" />

      {/* ── 2. Top Header Title & Badge with Opening Spring Animation ── */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 120, delay: 0.1 }}
        className="relative z-10 flex flex-col items-center text-center mt-1 sm:mt-2 shrink-0"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full bg-white/95 border-2 border-amber-400 text-slate-950 text-[9px] sm:text-xs font-black tracking-widest uppercase shadow-xl flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">GRADE 6 MATHEMATICS • PLACE VALUE & ROUNDING</span>
        </motion.div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight mt-1 sm:mt-1.5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] px-2">
          THE GREAT NUMBER RAILWAY
        </h1>
      </motion.div>

      {/* ── 3. Central Side-by-Side Square Team Cards (Goldilocks Size & Responsive) ── */}
      <div className="relative z-10 w-full max-w-5xl flex flex-row items-center justify-center gap-2 xs:gap-3 sm:gap-6 md:gap-8 my-auto px-2 sm:px-4">
        {/* ── TEAM 1 (Left RED Square Card) ── */}
        <motion.div
          initial={{ x: -90, scale: 0.85, opacity: 0 }}
          animate={{ x: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 110, delay: 0.2 }}
          className="flex-1 max-w-[200px] xs:max-w-[240px] sm:max-w-[290px] md:max-w-[315px] lg:max-w-[330px] p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border-3 sm:border-4 border-red-500 shadow-[0_15px_35px_rgba(220,38,38,0.55)] flex flex-col items-center justify-between text-center relative overflow-hidden group shrink-0"
        >
          {/* Top Label */}
          <div className="w-full flex items-center justify-between border-b sm:border-b-2 border-red-200 pb-1">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-600 shadow-xs" />
              <span className="text-[10px] sm:text-xs md:text-sm font-black text-red-900 tracking-wider uppercase truncate">
                TEAM 1 (RED)
              </span>
            </div>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded bg-red-100 text-red-700 uppercase">
              LEFT
            </span>
          </div>

          {/* Original Red Train Illustration (Animated Engine Rumble) */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
            className="relative w-full h-24 xs:h-28 sm:h-34 md:h-38 rounded-xl sm:rounded-2xl overflow-hidden border border-red-200 shadow-xs flex items-center justify-center my-1.5 sm:my-2 bg-slate-50"
          >
            <img
              src="/images/red_locomotive.png"
              alt="Team 1 Red Train"
              className="w-full h-full object-cover scale-x-[-1] transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>

          {/* Team 1 Name Input */}
          <div className="w-full text-left">
            <label className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wider text-slate-700 block mb-0.5">
              OPERATOR NAME
            </label>
            <input
              type="text"
              value={redTeam.name}
              onChange={(e) => setTeamName('red', e.target.value)}
              placeholder="Team 1 Name"
              maxLength={20}
              className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-red-50/80 border sm:border-2 border-red-300 focus:border-red-600 font-black text-[10px] sm:text-xs md:text-sm text-red-950 text-center outline-none shadow-inner"
            />
          </div>
        </motion.div>

        {/* ── Center Dynamic Animated Comic VS ── */}
        <motion.div
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: [1, 1.08, 1], rotate: [0, 2, 0], opacity: 1 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
          className="relative flex flex-col items-center justify-center shrink-0 z-20 mx-1 sm:mx-2"
        >
          {/* Comic Lightning Pulse Glow */}
          <div className="absolute w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-amber-400/40 blur-xl pointer-events-none" />

          <span
            className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter text-white select-none"
            style={{
              WebkitTextStroke: '3px #000000',
              textShadow: '3px 3px 0px #000000, 0 0 15px rgba(255,255,255,0.9)',
              filter: 'drop-shadow(0 6px 15px rgba(0,0,0,0.85))',
            }}
          >
            VS
          </span>
        </motion.div>

        {/* ── TEAM 2 (Right BLUE Square Card) ── */}
        <motion.div
          initial={{ x: 90, scale: 0.85, opacity: 0 }}
          animate={{ x: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 110, delay: 0.2 }}
          className="flex-1 max-w-[200px] xs:max-w-[240px] sm:max-w-[290px] md:max-w-[315px] lg:max-w-[330px] p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border-3 sm:border-4 border-blue-500 shadow-[0_15px_35px_rgba(37,99,235,0.55)] flex flex-col items-center justify-between text-center relative overflow-hidden group shrink-0"
        >
          {/* Top Label */}
          <div className="w-full flex items-center justify-between border-b sm:border-b-2 border-blue-200 pb-1">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-600 shadow-xs" />
              <span className="text-[10px] sm:text-xs md:text-sm font-black text-blue-900 tracking-wider uppercase truncate">
                TEAM 2 (BLUE)
              </span>
            </div>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
              RIGHT
            </span>
          </div>

          {/* Original Blue Train Illustration (Animated Engine Rumble) */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 0.4 }}
            className="relative w-full h-24 xs:h-28 sm:h-34 md:h-38 rounded-xl sm:rounded-2xl overflow-hidden border border-blue-200 shadow-xs flex items-center justify-center my-1.5 sm:my-2 bg-slate-50"
          >
            <img
              src="/images/blue_locomotive.png"
              alt="Team 2 Blue Train"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>

          {/* Team 2 Name Input */}
          <div className="w-full text-left">
            <label className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wider text-slate-700 block mb-0.5">
              OPERATOR NAME
            </label>
            <input
              type="text"
              value={blueTeam.name}
              onChange={(e) => setTeamName('blue', e.target.value)}
              placeholder="Team 2 Name"
              maxLength={20}
              className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-blue-50/80 border sm:border-2 border-blue-300 focus:border-blue-600 font-black text-[10px] sm:text-xs md:text-sm text-blue-950 text-center outline-none shadow-inner"
            />
          </div>
        </motion.div>
      </div>

      {/* ── 4. Bottom Controls: Animated Opening & Fully Responsive ── */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 16, stiffness: 120, delay: 0.4 }}
        className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 shrink-0"
      >
        {/* Match Length Selector (5, 10, 15) - Responsive Inline Pill */}
        <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 shadow-xl flex items-center gap-1.5 sm:gap-2">
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-800">
            🎯 QUESTIONS:
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {([5, 10, 15] as const).map((cnt) => {
              const isSelected = questionCountConfig === cnt;
              const stageText = cnt === 5 ? '1 STAGE' : cnt === 10 ? '2 STAGES' : '3 STAGES';
              return (
                <button
                  key={cnt}
                  onClick={() => setQuestionCountConfig(cnt)}
                  className={`py-0.5 sm:py-1 px-2 sm:px-3 rounded-lg font-black text-[10px] sm:text-[11px] transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-amber-600 shadow-sm scale-105'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-amber-400'
                  }`}
                >
                  {cnt} Qs <span className="text-[7px] sm:text-[8px] font-bold opacity-80 hidden xs:inline">({stageText})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Game Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="w-56 sm:w-64 max-w-xs py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_8px_25px_rgba(245,158,11,0.6)] border-2 border-amber-500 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950 shrink-0" />
          <span>START SHOWDOWN 🚂</span>
        </motion.button>
      </motion.div>
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
          <span className="text-red-700 font-black">🚉 Skillizee Junction</span>
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
          <div className={`flex-1 p-2 rounded-xl border ${redTeam.lastResult === 'correct' ? 'bg-red-50 border-red-400 text-red-900' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
            <span className="text-[9px] font-black uppercase">{redTeam.name}</span>
            <div className="text-xs font-black mt-0.5">
              {redTeam.lastResult === 'correct' ? `+${redTeam.lastScoreGained} PTS` : '0 PTS'}
            </div>
          </div>
          <div className={`flex-1 p-2 rounded-xl border ${blueTeam.lastResult === 'correct' ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
            <span className="text-[9px] font-black uppercase">{blueTeam.name}</span>
            <div className="text-xs font-black mt-0.5">
              {blueTeam.lastResult === 'correct' ? `+${blueTeam.lastScoreGained} PTS` : '0 PTS'}
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
  const winnerName = isRed ? redTeam.name : isBlue ? blueTeam.name : 'PERFECT DRAW';

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
  const championName = isRed ? redTeam.name : isBlue ? blueTeam.name : 'PERFECT CHAMPIONSHIP DRAW';

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
          <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${isRed ? 'bg-red-50 border-red-500 shadow-lg scale-105' : 'bg-slate-50 border-slate-200 opacity-85'}`}>
            <span className="text-[11px] font-black text-red-800 uppercase">{redTeam.name}</span>
            <div className="text-3xl font-black text-slate-950 mt-1">{redTeam.score}</div>
            <div className="text-[9px] text-slate-600 font-bold mt-0.5">
              {redTeam.roundsWon} Routes Cleared
            </div>
          </div>

          <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${isBlue ? 'bg-blue-50 border-blue-500 shadow-lg scale-105' : 'bg-slate-50 border-slate-200 opacity-85'}`}>
            <span className="text-[11px] font-black text-blue-800 uppercase">{blueTeam.name}</span>
            <div className="text-3xl font-black text-slate-950 mt-1">{blueTeam.score}</div>
            <div className="text-[9px] text-slate-600 font-bold mt-0.5">
              {blueTeam.roundsWon} Routes Cleared
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
