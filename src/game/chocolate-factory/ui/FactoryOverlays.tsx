// ============================================================
// THE CHOCOLATE FACTORY — OVERLAYS
//
// Only two: the opening card and a COMPACT final result. The result card
// deliberately covers just the middle of the screen — both factories, both
// consoles and the winner's celebration stay visible around it.
// ============================================================

'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { TeamId } from '../types';
import { useFactoryStore, TOTAL_MISSIONS } from '../store/factoryStore';
import { factoryAudio } from '../engine/factoryAudio';

const Metric: React.FC<{ label: string; value: string; tint: string }> = ({ label, value, tint }) => (
  <div className="text-center">
    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</div>
    <div className={`text-xl font-black tabular-nums ${tint}`}>{value}</div>
  </div>
);

export const FactoryOverlays: React.FC = () => {
  const phase = useFactoryStore((s) => s.phase);
  const winner = useFactoryStore((s) => s.winner);
  const blue = useFactoryStore((s) => s.blue);
  const red = useFactoryStore((s) => s.red);
  const startGame = useFactoryStore((s) => s.startGame);
  const resetGame = useFactoryStore((s) => s.resetGame);

  const championName = (t: TeamId) => (t === 'blue' ? 'BLUE CHOCOLATE WORKS' : 'RED CHOCOLATE WORKS');

  return (
    <AnimatePresence>
      {/* ── OPENING ── */}
      {phase === 'intro' && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/45 backdrop-blur-[2px] px-4"
        >
          <motion.div
            initial={{ scale: 0.94, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, opacity: 0 }}
            className="w-full max-w-2xl rounded-3xl border-4 border-amber-900/70 bg-[#fdf6ec] p-6 text-center shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-amber-900 bg-amber-300 px-4 py-1 text-[11px] font-black uppercase tracking-widest text-amber-950">
              GRADE 6 · FRACTIONS
            </div>
            <h1 className="mt-3 text-3xl xl:text-4xl font-black uppercase tracking-tight text-amber-950">
              THE CHOCOLATE FACTORY
            </h1>
            <p className="mt-1 text-sm font-bold text-amber-900/80">
              The Great Chocolate Production Challenge
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">LEFT CONSOLE</div>
                <div className="text-lg font-black text-blue-800">BLUE CHOCOLATE WORKS</div>
              </div>
              <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-red-600">RIGHT CONSOLE</div>
                <div className="text-lg font-black text-red-800">RED CHOCOLATE WORKS</div>
              </div>
            </div>

            <p className="mt-4 text-xs xl:text-sm font-bold text-slate-600 leading-relaxed">
              Both factories run at the same time. Every fraction you apply sets the real amount of
              chocolate your line produces — the tank fills to it, the molds take it, the truck carries
              it to the customer. {TOTAL_MISSIONS} missions each across 5 production rounds.
            </p>

            <button
              onPointerDown={() => { factoryAudio.unlock(); startGame(); }}
              className="mt-5 w-full rounded-2xl border-b-4 border-amber-900 bg-amber-500 py-4 text-base xl:text-lg font-black uppercase tracking-wider text-amber-950 shadow active:scale-95 active:border-b-2 transition"
            >
              START PRODUCTION
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* ── COMPACT FINAL RESULT ── */}
      {phase === 'final_results' && (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="absolute left-1/2 top-[16%] z-40 w-[min(620px,44vw)] -translate-x-1/2 rounded-3xl border-4 border-amber-900/70 bg-[#fdf6ec]/97 p-5 shadow-2xl"
        >
          <div className="text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-800">
              {winner === 'tie' ? 'PRODUCTION TIED' : '🏆 FACTORY CHAMPIONS'}
            </div>
            <div
              className={
                'mt-1 text-2xl xl:text-3xl font-black uppercase tracking-tight ' +
                (winner === 'blue' ? 'text-blue-700' : winner === 'red' ? 'text-red-700' : 'text-amber-900')
              }
            >
              {winner === 'tie' ? 'BOTH FACTORIES' : championName(winner as TeamId)}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {([['blue', blue], ['red', red]] as const).map(([team, t]) => (
              <div
                key={team}
                className={
                  'rounded-2xl border-2 p-3 ' +
                  (team === 'blue' ? 'border-blue-300 bg-blue-50/70' : 'border-red-300 bg-red-50/70') +
                  (winner === team ? ' ring-4 ring-amber-400' : '')
                }
              >
                <div className={`text-[10px] font-black uppercase tracking-widest ${team === 'blue' ? 'text-blue-700' : 'text-red-700'}`}>
                  {team === 'blue' ? 'BLUE' : 'RED'} · SCORE {t.score}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Metric label="ORDERS" value={`${t.ordersCompleted}`} tint="text-slate-800" />
                  <Metric label="QUALITY" value={`${t.quality}%`} tint="text-slate-800" />
                  <Metric label="ON TIME" value={`${t.onTime}`} tint="text-slate-800" />
                  <Metric label="CUSTOMER" value={`${t.satisfaction}%`} tint="text-slate-800" />
                </div>
                <div className="mt-2 text-center text-[9px] font-bold uppercase tracking-widest text-slate-500">
                  {t.waste} WASTED · {t.rework} REWORKED
                </div>
              </div>
            ))}
          </div>

          <button
            onPointerDown={resetGame}
            className="mt-4 w-full rounded-xl border-b-4 border-slate-900 bg-slate-800 py-3 text-sm font-black uppercase tracking-wider text-white active:scale-95 active:border-b-2 transition"
          >
            RUN ANOTHER SHIFT
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
