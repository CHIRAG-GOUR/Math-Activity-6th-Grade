'use client';

// ============================================================
// THE SOLAR FORGE: Victory & VIP Celebration Party Cinematic
// - Plays at least 8-10 seconds of unobstructed full-screen party view
//   showing the Central Forge House, dancing characters, and winner lights!
// - Smoothly displays the summary results card afterwards, with an option
//   to return to the party camera anytime!
// ============================================================

import React, { useState, useEffect } from 'react';
import { useSolarForgeStore } from '../store/solarForgeStore';

export const SolarForgeVictoryCinematic: React.FC = () => {
  const gamePhase = useSolarForgeStore((s) => s.gamePhase);
  const isPartyActive = useSolarForgeStore((s) => s.isPartyActive);
  const partyWinner = useSolarForgeStore((s) => s.partyWinner);
  const blue = useSolarForgeStore((s) => s.blue);
  const red = useSolarForgeStore((s) => s.red);
  const restartChallenge = useSolarForgeStore((s) => s.restartChallenge);

  const isActive = isPartyActive || gamePhase === 'cinematic_activation' || gamePhase === 'victory';

  // 8-10 second party celebration timer before the modal appears
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive) {
      setSecondsRemaining(10);
      setShowSummaryModal(false);
      return;
    }

    setSecondsRemaining(10);
    setShowSummaryModal(false);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowSummaryModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  const winner = partyWinner || (blue.energyMegawatts >= red.energyMegawatts ? 'blue' : 'red');
  const isBlueWinner = winner === 'blue';
  const winnerName = isBlueWinner ? 'BLUE HELIO SQUADRON' : 'RED SOLAR CORPS';
  const winnerColor = isBlueWinner ? 'text-cyan-400' : 'text-rose-400';
  const badgeBorder = isBlueWinner ? 'border-cyan-400 shadow-cyan-500/30' : 'border-rose-400 shadow-rose-500/30';

  return (
    <>
      {/* ── 1. NON-BLOCKING TOP CELEBRATION HUD (VISIBLE DURING THE 8+ SECOND PARTY) ── */}
      <div className="fixed top-14 left-0 right-0 z-30 flex flex-col items-center pointer-events-none animate-fadeIn">
        <div
          className={`pointer-events-auto px-6 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md border-2 ${
            isBlueWinner
              ? 'bg-slate-950/90 border-cyan-400 text-cyan-200'
              : 'bg-slate-950/90 border-rose-500 text-rose-200'
          } flex items-center gap-4 text-center max-w-2xl mx-4 transition-all`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">🎉</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                5 MISSIONS COMPLETE · VIP WINNER PARTY ACTIVE
              </span>
              <span className="text-sm sm:text-base font-black tracking-tight text-white">
                CHAMPION: <span className={winnerColor}>{winnerName}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* 8s Countdown Chip */}
            <span className={`px-3 py-1 rounded-xl text-xs font-black tabular-nums border ${badgeBorder} bg-black/40 text-white animate-pulse`}>
              {secondsRemaining > 0 ? `Party Cam: ${secondsRemaining}s` : 'Party Ongoing'}
            </span>

            {/* View Summary Early Button */}
            {!showSummaryModal && (
              <button
                onClick={() => setShowSummaryModal(true)}
                className="px-3 py-1 rounded-xl bg-white text-slate-900 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-200 active:scale-95 transition shadow-sm cursor-pointer"
              >
                View Scorecard →
              </button>
            )}
          </div>
        </div>

        {/* Camera Hint */}
        <span className="mt-1.5 text-[10px] font-bold text-slate-900/80 bg-white/70 backdrop-blur-xs px-3 py-0.5 rounded-full shadow-xs">
          🎥 Camera focused directly on Central Forge House · Watch them dancing & celebrating!
        </span>
      </div>

      {/* ── 2. SUMMARY RESULTS MODAL (APPEARS AFTER 8-10 SECONDS OR UPON CLICK) ── */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn pointer-events-auto">
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-md border-2 border-amber-300 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 text-slate-800 animate-scaleUp">
            {/* Glowing Badge */}
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg border-2 ${
              isBlueWinner
                ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-white border-cyan-300 shadow-cyan-500/40'
                : 'bg-gradient-to-tr from-rose-400 to-red-600 text-white border-rose-300 shadow-rose-500/40'
            } animate-bounce`}>
              🏆
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                5 SOLAR ENGINEERING MISSIONS COMPLETED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                SOLAR FORGE VICTORY
              </h2>
              <p className="text-xs font-semibold text-slate-600">
                All sunlight mirrors calibrated with geometric precision. The VIP Celebration is live at the Central Forge House!
              </p>
            </div>

            {/* Winner Banner */}
            <div className={`w-full p-4 rounded-2xl border-2 ${
              isBlueWinner ? 'bg-sky-50 border-sky-400' : 'bg-red-50 border-red-400'
            } flex flex-col items-center gap-1 shadow-sm`}>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Exclusive VIP Party Host & Champion
              </span>
              <span className={`text-lg sm:text-xl font-black tracking-tight ${isBlueWinner ? 'text-sky-700' : 'text-red-700'}`}>
                {winnerName}
              </span>
              <div className="flex items-center gap-4 mt-2 text-xs font-bold">
                <span className="text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-md">
                  Blue: {blue.energyMegawatts} MW
                </span>
                <span className="text-slate-300">vs</span>
                <span className="text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md">
                  Red: {red.energyMegawatts} MW
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full mt-2">
              {/* Back to Party View button */}
              <button
                onClick={() => setShowSummaryModal(false)}
                className={`flex-1 w-full py-3 px-4 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                  isBlueWinner
                    ? 'bg-sky-600 hover:bg-sky-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <span>🎪 Return to Party Cam</span>
              </button>

              {/* Restart Button */}
              <button
                onClick={restartChallenge}
                className="flex-1 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
              >
                New Expedition ↺
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
