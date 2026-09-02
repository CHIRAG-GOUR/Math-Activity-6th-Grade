// ============================================================
// THE GREAT NUMBER RAILWAY — Overlays (light, warm, railway-themed)
//   Title (with match length) · Round intro · Route Decision board ·
//   Winner plaque · Network complete · Toast · Mission bar.
// Winners are announced as railway events, never as generic pop-ups.
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { NETWORK_STATIONS } from '../engine/challenges';

const BRASS = '3px solid #c9a24b';
const woodPanel: React.CSSProperties = {
  background: 'linear-gradient(180deg,#5b4326,#33240f)',
  border: BRASS,
  boxShadow: '0 18px 44px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.18)',
};
const parchment: React.CSSProperties = {
  background: 'linear-gradient(180deg,#f6ecd4,#e9d9b5)',
  border: BRASS,
  boxShadow: '0 14px 34px rgba(0,0,0,0.3)',
};

// ── 1. Title Screen with match length (rounds) selector ──
export const RailwayTitleScreen: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const totalRounds = useRailwayStore((s) => s.totalRounds);
  const setTotalRounds = useRailwayStore((s) => s.setTotalRounds);
  const startGame = useRailwayStore((s) => s.startGame);
  if (phase !== 'title') return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 select-none"
      style={{ background: 'radial-gradient(circle at 50% 20%,#7dd3fc,#38bdf8 55%,#0369a1)' }}>
      <div className="px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase mb-3" style={{ ...parchment, color: '#7c4a03' }}>
        Grade 6 Mathematics · Place Value & Rounding
      </div>
      <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-center text-white" style={{ textShadow: '0 3px 0 #0c4a6e, 0 6px 18px rgba(0,0,0,0.4)' }}>
        THE GREAT NUMBER RAILWAY
      </h1>
      <p className="text-white/90 text-sm font-bold max-w-xl text-center mt-3 leading-relaxed">
        Two teams race through five place-value challenges — then the railway itself decides the winner. Solve the maths, throw the switch, clear the signal, and send your train down the line.
      </p>

      <div className="flex items-center gap-6 my-5">
        <div className="flex flex-col items-center px-4 py-3 rounded-2xl w-40" style={{ background: 'linear-gradient(160deg,#3b82f6,#1e40af)', border: BRASS }}>
          <span className="font-black text-sm text-white tracking-wider">TEAM BLUE</span>
          <span className="text-[10px] text-amber-200/80 font-bold mt-0.5">LEFT CONSOLE</span>
        </div>
        <div className="text-2xl font-black text-white/90">VS</div>
        <div className="flex flex-col items-center px-4 py-3 rounded-2xl w-40" style={{ background: 'linear-gradient(160deg,#f05252,#991b1b)', border: BRASS }}>
          <span className="font-black text-sm text-white tracking-wider">TEAM RED</span>
          <span className="text-[10px] text-amber-200/80 font-bold mt-0.5">RIGHT CONSOLE</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mb-5">
        <span className="text-[11px] font-black uppercase tracking-widest text-white/90">Match length</span>
        <div className="flex gap-2">
          {[5, 10, 15].map((n) => {
            const sel = totalRounds === n;
            return (
              <button key={n} onClick={() => setTotalRounds(n)}
                className="px-5 py-2.5 rounded-xl text-sm font-black transition-all"
                style={{ background: sel ? 'linear-gradient(180deg,#fde68a,#f9d451)' : 'rgba(255,255,255,0.9)', border: sel ? '3px solid #b8862f' : '2px solid #cbd5e1', color: '#2a1d12', transform: sel ? 'scale(1.05)' : 'none' }}>
                {n} ROUNDS
              </button>
            );
          })}
        </div>
        <span className="text-[10px] text-white/70 font-semibold">Each round = 5 challenges + a railway showdown</span>
      </div>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} onClick={startGame}
        className="px-10 py-4 rounded-2xl text-white font-black text-base tracking-wider uppercase flex items-center gap-3"
        style={{ background: 'linear-gradient(180deg,#22c55e,#15803d)', border: '3px solid #14532d', boxShadow: '0 10px 26px rgba(21,128,61,0.5)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
        ALL ABOARD · START ({totalRounds} ROUNDS)
      </motion.button>
    </motion.div>
  );
};

// ── 2. Round Intro card ──
export const RoundIntroOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const roundIndex = useRailwayStore((s) => s.currentRoundIndex);
  const totalRounds = useRailwayStore((s) => s.totalRounds);
  const rounds = useRailwayStore((s) => s.rounds);
  if (phase !== 'round-intro') return null;
  const round = rounds[roundIndex];
  const dest = NETWORK_STATIONS.find((s) => s.id === round?.destinationStationId);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none p-4">
      <motion.div initial={{ scale: 0.85, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="px-8 py-5 rounded-3xl text-center flex flex-col items-center" style={woodPanel}>
        <div className="text-[11px] font-black tracking-widest text-amber-300">ROUND {roundIndex + 1} OF {totalRounds}</div>
        <h2 className="text-3xl font-black text-white mt-1 tracking-wide">{round?.name}</h2>
        <p className="text-amber-100/80 text-sm font-bold mt-1">{round?.subtitle}</p>
        <div className="mt-3 px-4 py-1.5 rounded-full text-[12px] font-black" style={{ ...parchment, color: '#7c4a03' }}>
          Destination: {dest?.name ?? 'The Highlands'}
        </div>
      </motion.div>
    </div>
  );
};

// ── 3. Route Decision board (showdown + tie-break) — not a modal ──
export const RouteDecisionBoard: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const step = useRailwayStore((s) => s.showdownStep);
  const winner = useRailwayStore((s) => s.roundWinner);
  const blue = useRailwayStore((s) => s.blueTeam);
  const red = useRailwayStore((s) => s.redTeam);
  if (phase !== 'showdown' && phase !== 'tie-break') return null;

  const wLabel = winner === 'blue' ? 'BLUE' : winner === 'red' ? 'RED' : '';
  let status = 'Both signals RED — awaiting route';
  if (phase === 'tie-break') status = 'RAILWAY TIE — first correct answer wins the route!';
  else if (step === 'switching') status = `Throwing the switch to ${wLabel}…`;
  else if (step === 'signal-yellow') status = `${wLabel} signal: RED → YELLOW`;
  else if (step === 'signal-green') status = `${wLabel} signal: GREEN — line cleared!`;
  else if (step === 'departing') status = `${wLabel} train departing down the line!`;

  return (
    <div className="absolute inset-x-0 top-24 z-40 flex justify-center pointer-events-none px-4">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
        className="px-6 py-3 rounded-2xl text-center" style={woodPanel}>
        <div className="text-[12px] font-black tracking-[0.3em] text-amber-300">ROUTE DECISION</div>
        <div className="text-[14px] font-black text-white mt-1">{status}</div>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="px-3 py-1 rounded-lg" style={{ background: winner === 'blue' ? 'linear-gradient(180deg,#3b82f6,#1e40af)' : 'rgba(255,255,255,0.12)', border: '2px solid #c9a24b' }}>
            <span className="text-[9px] font-black text-amber-200/80">BLUE</span>
            <span className="text-[15px] font-black text-white ml-1.5">{blue.roundScore}</span>
          </div>
          <span className="text-amber-200/70 text-[11px] font-black">ROUND</span>
          <div className="px-3 py-1 rounded-lg" style={{ background: winner === 'red' ? 'linear-gradient(180deg,#f05252,#991b1b)' : 'rgba(255,255,255,0.12)', border: '2px solid #c9a24b' }}>
            <span className="text-[9px] font-black text-amber-200/80">RED</span>
            <span className="text-[15px] font-black text-white ml-1.5">{red.roundScore}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── 4. Winner Plaque (railway destination board) ──
export const WinnerPlaque: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const winner = useRailwayStore((s) => s.roundWinner);
  const roundIndex = useRailwayStore((s) => s.currentRoundIndex);
  const totalRounds = useRailwayStore((s) => s.totalRounds);
  const rounds = useRailwayStore((s) => s.rounds);
  const blue = useRailwayStore((s) => s.blueTeam);
  const red = useRailwayStore((s) => s.redTeam);
  const proceed = useRailwayStore((s) => s.proceedToNextRound);
  if (phase !== 'winner-reveal') return null;

  const isBlue = winner === 'blue';
  const wTeam = isBlue ? blue : red;
  const accent = isBlue ? 'linear-gradient(160deg,#3b82f6,#1e40af)' : 'linear-gradient(160deg,#f05252,#991b1b)';
  const round = rounds[roundIndex];
  const dest = NETWORK_STATIONS.find((s) => s.id === round?.destinationStationId);
  const isLast = roundIndex + 1 >= totalRounds;

  return (
    <div className="absolute inset-x-0 bottom-6 z-40 flex justify-center pointer-events-none px-4">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto rounded-3xl overflow-hidden flex items-stretch" style={{ ...woodPanel, minWidth: 520 }}>
        <div className="flex flex-col items-center justify-center px-6 py-4" style={{ background: accent, borderRight: BRASS }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#f9d451"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.7L12 17.8 5.9 20.3l1.4-6.7L2.2 9l6.9-.7z" /></svg>
          <div className="text-[11px] font-black text-amber-100 tracking-widest mt-1">WINNER</div>
        </div>
        <div className="px-6 py-4 flex-1">
          <div className="text-[13px] font-black tracking-widest text-amber-300">{isBlue ? 'TEAM BLUE' : 'TEAM RED'} WINS THE ROUND</div>
          <div className="text-[15px] font-black text-white mt-0.5">Arrived at {dest?.name ?? 'the terminus'}</div>
          <div className="flex items-center gap-4 mt-2">
            <div className="px-3 py-1.5 rounded-xl" style={parchment}>
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7c4a03' }}>Round points</span>
              <div className="font-mono text-[20px] font-black" style={{ color: '#2a1d12' }}>+{wTeam.roundScore.toLocaleString()}</div>
            </div>
            <div className="text-amber-100/80 text-[11px] font-bold leading-tight">
              Rounds won<br /><span className="text-white text-[15px] font-black">{blue.roundsWon} – {red.roundsWon}</span>
            </div>
          </div>
        </div>
        <button onClick={proceed} className="px-6 font-black text-[13px] uppercase tracking-wider text-white flex items-center gap-2" style={{ background: 'linear-gradient(180deg,#22c55e,#15803d)', borderLeft: BRASS }}>
          {isLast ? 'FINAL RESULTS' : 'NEXT ROUND'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </motion.div>
    </div>
  );
};

// ── 5. Network Complete (grand finale) ──
export const NetworkCompleteOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const matchWinner = useRailwayStore((s) => s.matchWinner);
  const blue = useRailwayStore((s) => s.blueTeam);
  const red = useRailwayStore((s) => s.redTeam);
  const setPhase = useRailwayStore((s) => s.setPhase);
  if (phase !== 'network-complete') return null;

  const isBlue = matchWinner === 'blue';
  const isRed = matchWinner === 'red';
  const title = isBlue ? 'TEAM BLUE RESTORES THE RAILWAY!' : isRed ? 'TEAM RED RESTORES THE RAILWAY!' : 'THE RAILWAY IS RESTORED — A DRAW!';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 select-none" style={{ background: 'radial-gradient(circle at 50% 20%,rgba(56,189,248,0.95),rgba(3,105,161,0.97))' }}>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full rounded-3xl p-7 text-center flex flex-col items-center" style={woodPanel}>
        <svg width="72" height="72" viewBox="0 0 24 24" fill="#f9d451"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.7L12 17.8 5.9 20.3l1.4-6.7L2.2 9l6.9-.7z" /></svg>
        <div className="text-[12px] font-black tracking-widest text-amber-300 mt-2">GRAND EXPEDITION COMPLETE</div>
        <h2 className="text-3xl font-black text-white mt-1">{title}</h2>
        <div className="flex gap-4 justify-center w-full my-5">
          <div className="flex-1 rounded-2xl p-4" style={{ background: isBlue ? 'linear-gradient(160deg,#3b82f6,#1e40af)' : 'rgba(255,255,255,0.1)', border: BRASS }}>
            <div className="text-[11px] font-black text-amber-200 uppercase">Team Blue</div>
            <div className="text-3xl font-black text-white mt-1">{blue.score.toLocaleString()}</div>
            <div className="text-[10px] text-white/80 font-bold mt-0.5">{blue.roundsWon} routes won · {blue.correctAnswersCount} correct</div>
          </div>
          <div className="flex-1 rounded-2xl p-4" style={{ background: isRed ? 'linear-gradient(160deg,#f05252,#991b1b)' : 'rgba(255,255,255,0.1)', border: BRASS }}>
            <div className="text-[11px] font-black text-amber-200 uppercase">Team Red</div>
            <div className="text-3xl font-black text-white mt-1">{red.score.toLocaleString()}</div>
            <div className="text-[10px] text-white/80 font-bold mt-0.5">{red.roundsWon} routes won · {red.correctAnswersCount} correct</div>
          </div>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={() => setPhase('title')} className="flex-1 py-3.5 rounded-xl text-white font-black text-xs uppercase tracking-wider" style={{ background: 'linear-gradient(180deg,#22c55e,#15803d)', border: '2px solid #14532d' }}>
            NEW MATCH
          </button>
          <button onClick={() => (window.location.href = '/')} className="flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider" style={{ ...parchment, color: '#7c4a03' }}>
            ARCADE HUB
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── 6. Toast ──
export const RailwayToast: React.FC = () => {
  const msg = useRailwayStore((s) => s.toastMessage);
  const phase = useRailwayStore((s) => s.phase);
  // The showdown has its own board; suppress the plain toast there.
  if (phase === 'showdown' || phase === 'round-intro') return null;
  return (
    <AnimatePresence>
      {msg && (
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
          className="absolute left-1/2 -translate-x-1/2 z-40 px-5 py-2 rounded-2xl text-white font-black text-[12px] tracking-wide pointer-events-none"
          style={{ top: 96, background: 'linear-gradient(180deg,#15803d,#166534)', border: '2px solid #86efac' }}>
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── 7. Mission bar (bottom centre, during questions) ──
export const MissionBar: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const unlocked = useRailwayStore((s) => s.unlockedStationIds);
  const totalRounds = useRailwayStore((s) => s.totalRounds);
  if ((phase !== 'challenge' && phase !== 'tie-break' && phase !== 'question-reveal') || !challenge) return null;

  return (
    <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center pointer-events-none px-4">
      <div className="rounded-2xl px-5 py-2.5 flex items-center gap-4 max-w-[520px]" style={parchment}>
        <div className="flex flex-col items-center justify-center px-2" style={{ borderRight: '2px solid #d8c9a8' }}>
          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7c4a03' }}>Network</span>
          <span className="text-[16px] font-black" style={{ color: '#2a1d12' }}>{unlocked.length}/{totalRounds}</span>
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#b45309' }}>
            {challenge.isRouteAuthorization ? 'CHOOSE WISELY — YOUR ANSWER SETS THE TRAIN’S ROUTE' : 'TODAY’S MISSION'}
          </div>
          <div className="text-[12px] font-bold leading-tight mt-0.5" style={{ color: '#3b2a1a' }}>{challenge.railwayEffect}</div>
        </div>
      </div>
    </div>
  );
};
