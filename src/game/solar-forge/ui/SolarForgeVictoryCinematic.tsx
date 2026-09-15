'use client';

// ============================================================
// THE SOLAR FORGE: Victory & Solar Forge Activation Cinematic
// Triumphal banner, Forge ignition statistics & restart options
// ============================================================

import React from 'react';
import { useSolarForgeStore } from '../store/solarForgeStore';

export const SolarForgeVictoryCinematic: React.FC = () => {
  const gamePhase = useSolarForgeStore((s) => s.gamePhase);
  const blue = useSolarForgeStore((s) => s.blue);
  const red = useSolarForgeStore((s) => s.red);
  const restartChallenge = useSolarForgeStore((s) => s.restartChallenge);

  if (gamePhase !== 'cinematic_activation' && gamePhase !== 'victory') return null;

  const winner = blue.energyMegawatts >= red.energyMegawatts ? 'blue' : 'red';
  const winnerName = winner === 'blue' ? 'BLUE HELIO SQUADRON' : 'RED SOLAR CORPS';
  const winnerColor = winner === 'blue' ? 'text-sky-600' : 'text-red-600';
  const bannerBg = winner === 'blue' ? 'bg-sky-50 border-sky-300' : 'bg-red-50 border-red-300';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs pointer-events-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-md border border-amber-300 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 text-slate-800 pointer-events-auto">
        {/* Glowing Badge */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 animate-bounce">
          ⚡
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
            FACILITY AT 100% OPERATIONAL CAPACITY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            SOLAR FORGE ONLINE
          </h2>
          <p className="text-xs font-semibold text-slate-600">
            All sunlight beams aligned. Molten core at maximum thermal efficiency.
          </p>
        </div>

        {/* Winner Banner */}
        <div className={`w-full p-4 rounded-2xl border ${bannerBg} flex flex-col items-center gap-1`}>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Facility Engineering Champion
          </span>
          <span className={`text-lg font-black tracking-tight ${winnerColor}`}>
            🏆 {winnerName}
          </span>
          <div className="flex items-center gap-4 mt-2 text-xs font-bold">
            <span className="text-sky-700">Blue: {blue.energyMegawatts} MW</span>
            <span className="text-slate-300">|</span>
            <span className="text-red-700">Red: {red.energyMegawatts} MW</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full mt-2">
          <button
            onClick={restartChallenge}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            Launch New Expedition ↺
          </button>
        </div>
      </div>
    </div>
  );
};
