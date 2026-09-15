// ============================================================
// THE DECIMAL DELIVERY NETWORK — OVERLAYS
//
// Intro title, round cards, results and the dispatch payoff. Every overlay is
// deliberately light and, apart from the intro, sits over the depot rather
// than hiding it — the world reacting is most of the reward.
// ============================================================

'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDepotStore } from '../store/depotStore';
import { ROUND_TITLES, ROUND_BRIEFS } from '../engine/questionEngine';
import { depotAudio } from '../engine/depotAudio';

export const DepotOverlays: React.FC = () => {
  const phase = useDepotStore((s) => s.phase);
  const round = useDepotStore((s) => s.round);
  const result = useDepotStore((s) => s.result);
  const blue = useDepotStore((s) => s.blue);
  const red = useDepotStore((s) => s.red);
  const tieWinner = useDepotStore((s) => s.tieBreakWinner);
  const startGame = useDepotStore((s) => s.startGame);
  const resetGame = useDepotStore((s) => s.resetGame);

  const winnerName = result?.winner === 'red' ? 'RED LOGISTICS' : 'BLUE LOGISTICS';
  const winnerIsBlue = result?.winner !== 'red';

  return (
    <AnimatePresence>
      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-end pb-10 px-4 pointer-events-none bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/35"
        >
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-auto mt-16 text-center"
          >
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              THE DECIMAL DELIVERY NETWORK
            </h1>
            <p className="mt-3 text-xs sm:text-sm xl:text-base font-black uppercase tracking-[0.35em] text-amber-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              RUN THE DEPOT · PROCESS THE ORDERS · EARN THE MOST
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="pointer-events-auto w-full max-w-2xl rounded-3xl border-4 border-slate-900 bg-white p-5 xl:p-6 text-center shadow-[10px_10px_0px_#0f172a]"
          >
            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-amber-400 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-slate-900 shadow-[2px_2px_0px_#0f172a]">
              GRADE 6 · DECIMALS
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  LEFT DEPOT
                </div>
                <div className="text-lg font-black text-blue-800">BLUE LOGISTICS</div>
              </div>
              <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-red-600">
                  RIGHT DEPOT
                </div>
                <div className="text-lg font-black text-red-800">RED LOGISTICS</div>
              </div>
            </div>

            <p className="mt-3 text-xs xl:text-sm font-bold text-slate-600">
              Both depots run at the same time. Weigh, sort, price and dispatch every
              parcel correctly — the depot that banks the most earns delivery priority.
            </p>

            <button
              onClick={() => {
                // Browsers block audio until a real gesture, so unlock here.
                depotAudio.unlock();
                startGame();
              }}
              className="mt-4 w-full rounded-2xl border-b-4 border-emerald-800 bg-emerald-600 py-4 text-base xl:text-lg font-black uppercase tracking-wider text-white shadow active:scale-95 active:border-b-2 transition"
            >
              OPEN THE DEPOT
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* ── ROUND CARD ── */}
      {phase === 'round_intro' && (
        <motion.div
          key={`round-${round}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="absolute inset-x-0 top-1/3 z-40 flex justify-center pointer-events-none px-4"
        >
          <div className="rounded-3xl border-4 border-slate-900 bg-white px-8 py-5 text-center shadow-[8px_8px_0px_#0f172a]">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
              ROUND {round}
            </div>
            <div className="text-2xl xl:text-4xl font-black uppercase text-slate-900">
              {ROUND_TITLES[round]}
            </div>
            <div className="mt-1 text-xs xl:text-sm font-bold text-slate-600">
              {ROUND_BRIEFS[round]}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TIE BREAKER ── */}
      {phase === 'tie_breaker' && !tieWinner && (
        <motion.div
          key="tie"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute inset-x-0 top-20 z-40 flex justify-center pointer-events-none px-4"
        >
          <div className="rounded-2xl border-4 border-amber-500 bg-amber-300 px-6 py-3 text-center shadow-[6px_6px_0px_#0f172a]">
            <div className="text-lg xl:text-2xl font-black uppercase tracking-wide text-slate-900">
              FINAL EXPRESS ORDER
            </div>
            <div className="text-[11px] xl:text-xs font-black uppercase tracking-widest text-slate-700">
              Exact tie — first depot to dispatch takes priority
            </div>
          </div>
        </motion.div>
      )}

      {/* ── FINAL RESULTS ── */}
      {phase === 'final_results' && result && (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center px-4 pointer-events-none bg-slate-900/35"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-3xl rounded-3xl border-4 border-slate-900 bg-white p-6 shadow-[10px_10px_0px_#0f172a]"
          >
            <div className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
              END OF SHIFT · FINAL LEDGER
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className={`rounded-2xl border-4 p-4 text-center ${winnerIsBlue ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}>
                <div className="text-xs font-black uppercase tracking-widest text-blue-600">
                  BLUE LOGISTICS
                </div>
                <div className="text-3xl xl:text-4xl font-black tabular-nums text-blue-800">
                  ₹{result.blueBalance.toFixed(2)}
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-1">
                  {blue.ordersCompleted} ORDERS · {blue.loadedWeight.toFixed(2)} kg
                </div>
              </div>

              <div className={`rounded-2xl border-4 p-4 text-center ${!winnerIsBlue ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'}`}>
                <div className="text-xs font-black uppercase tracking-widest text-red-600">
                  RED LOGISTICS
                </div>
                <div className="text-3xl xl:text-4xl font-black tabular-nums text-red-800">
                  ₹{result.redBalance.toFixed(2)}
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-1">
                  {red.ordersCompleted} ORDERS · {red.loadedWeight.toFixed(2)} kg
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border-4 border-amber-500 bg-amber-300 py-3 text-center shadow-inner">
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-700">
                DELIVERY PRIORITY
              </div>
              <div className="text-2xl xl:text-3xl font-black uppercase text-slate-900">
                {winnerName}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ── DISPATCH BANNER ── */}
      {phase === 'dispatch_showdown' && (
        <motion.div
          key="dispatch"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute inset-x-0 top-20 z-40 flex justify-center pointer-events-none px-4"
        >
          <div className={`rounded-2xl border-4 px-7 py-3 text-center shadow-[6px_6px_0px_#0f172a] ${winnerIsBlue ? 'border-blue-700 bg-blue-600' : 'border-red-700 bg-red-600'}`}>
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/80">
              DISPATCH GATE OPEN
            </div>
            <div className="text-xl xl:text-3xl font-black uppercase text-white">
              {winnerName} ROLLING OUT
            </div>
          </div>
        </motion.div>
      )}

      {/* ── COMPLETE ── */}
      {phase === 'game_complete' && result && (
        <motion.div
          key="complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-40 flex items-center justify-center px-4 bg-slate-900/45"
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-xl rounded-3xl border-4 border-slate-900 bg-white p-6 text-center shadow-[10px_10px_0px_#0f172a]"
          >
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
              DELIVERY COMPLETE
            </div>
            <div className={`mt-2 text-3xl xl:text-4xl font-black uppercase ${winnerIsBlue ? 'text-blue-700' : 'text-red-700'}`}>
              {winnerName}
            </div>
            <div className="mt-1 text-sm font-black uppercase tracking-wider text-slate-600">
              banked ₹{(winnerIsBlue ? result.blueBalance : result.redBalance).toFixed(2)}
            </div>

            <button
              onClick={resetGame}
              className="mt-5 w-full rounded-2xl border-b-4 border-slate-900 bg-slate-800 py-4 text-base font-black uppercase tracking-wider text-white active:scale-95 active:border-b-2 transition"
            >
              RUN ANOTHER SHIFT
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
