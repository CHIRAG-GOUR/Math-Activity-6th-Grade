'use client';

// ============================================================
// PARK PLANNER — Match Victory & Park Completion Celebration
// Shows park statistics, citizen satisfaction, and restart options
// ============================================================

import React from 'react';
import Link from 'next/link';
import { useParkStore } from '../store/parkStore';

export const ParkVictoryOverlay: React.FC = () => {
  const isMatchOver = useParkStore((s) => s.isMatchOver);
  const blueTeam = useParkStore((s) => s.blueTeam);
  const redTeam = useParkStore((s) => s.redTeam);
  const winner = useParkStore((s) => s.winnerTeam);
  const restartGame = useParkStore((s) => s.restartGame);

  if (!isMatchOver) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-4 border-amber-400 text-center animate-scaleUp">
        {/* Trophy Header */}
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner border border-amber-300">
          🏆
        </div>
        <h2 className="font-black text-2xl text-slate-900 tracking-wide uppercase">
          PARK DESIGN COMPLETE!
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          The Cartesian Coordinate System has come to life as a vibrant four-quadrant city park.
        </p>

        {/* Winner Banner */}
        <div className="my-4 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-black text-sm shadow">
          {winner === 'blue'
            ? '🎉 BLUE TEAM CONSTRUCTED THE TOP-RATED PARK!'
            : winner === 'red'
            ? '🎉 RED TEAM CONSTRUCTED THE TOP-RATED PARK!'
            : '🤝 EQUAL URBAN HARMONY — IT’S A TIE!'}
        </div>

        {/* Team Comparison Cards */}
        <div className="grid grid-cols-2 gap-3 my-4 text-left">
          {/* Blue Team Card */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-3.5 text-xs text-slate-700">
            <div className="font-black text-blue-800 text-sm mb-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Blue Planners</span>
            </div>
            <div className="space-y-1 font-semibold">
              <div className="flex justify-between">
                <span>Happiness:</span>
                <span className="text-emerald-700 font-bold">{blueTeam.citizenHappiness}%</span>
              </div>
              <div className="flex justify-between">
                <span>Park Rating:</span>
                <span className="text-amber-600 font-bold">★ {blueTeam.parkRating}</span>
              </div>
              <div className="flex justify-between">
                <span>Structures Built:</span>
                <span className="text-blue-700 font-bold">{blueTeam.installedObjects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Math Accuracy:</span>
                <span className="text-slate-800 font-bold">{blueTeam.accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Red Team Card */}
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3.5 text-xs text-slate-700">
            <div className="font-black text-rose-800 text-sm mb-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Red Planners</span>
            </div>
            <div className="space-y-1 font-semibold">
              <div className="flex justify-between">
                <span>Happiness:</span>
                <span className="text-emerald-700 font-bold">{redTeam.citizenHappiness}%</span>
              </div>
              <div className="flex justify-between">
                <span>Park Rating:</span>
                <span className="text-amber-600 font-bold">★ {redTeam.parkRating}</span>
              </div>
              <div className="flex justify-between">
                <span>Structures Built:</span>
                <span className="text-rose-700 font-bold">{redTeam.installedObjects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Math Accuracy:</span>
                <span className="text-slate-800 font-bold">{redTeam.accuracy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Restart Options */}
        <div className="space-y-2 mt-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Restart Match With New Challenges:
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15].map((cnt) => (
              <button
                key={`restart_${cnt}`}
                type="button"
                onClick={() => restartGame(cnt as 5 | 10 | 15)}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition"
              >
                {cnt} Questions
              </button>
            ))}
          </div>

          <Link
            href="/"
            className="block w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow mt-3 transition"
          >
            🕹️ Return to Arcade Lobby
          </Link>
        </div>
      </div>
    </div>
  );
};
