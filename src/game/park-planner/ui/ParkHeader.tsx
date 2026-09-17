'use client';

// ============================================================
// PARK PLANNER — Header Navigation & Arcade Status Bar
// ============================================================

import React from 'react';
import Link from 'next/link';
import { parkAudio } from '../engine/parkAudio';
import { useParkStore } from '../store/parkStore';

interface ParkHeaderProps {
  onOpenBriefing: () => void;
}

export const ParkHeader: React.FC<ParkHeaderProps> = ({ onOpenBriefing }) => {
  const matchQuestionCount = useParkStore((s) => s.matchQuestionCount);
  const restartGame = useParkStore((s) => s.restartGame);
  const [isMuted, setIsMuted] = React.useState(parkAudio.getIsMuted());

  const toggleSound = () => {
    const muted = parkAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="w-full bg-slate-900/90 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-700 shadow-md backdrop-blur-md z-20">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold border border-slate-600 transition"
        >
          <span>⬅</span>
          <span>Arcade Lobby</span>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-black text-sm tracking-wider uppercase">
              PARK PLANNER
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-700">
              Grade 6 Math
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Position & Transformation • Cartesian Coordinate Plane
          </div>
        </div>
      </div>

      {/* Match Rounds Selector */}
      <div className="hidden md:flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-bold">
        <span className="text-slate-400 px-2">Match Length:</span>
        {[5, 10, 15].map((cnt) => (
          <button
            key={`rounds_${cnt}`}
            type="button"
            onClick={() => restartGame(cnt as 5 | 10 | 15)}
            className={`px-2.5 py-1 rounded transition ${
              matchQuestionCount === cnt
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cnt} Rounds
          </button>
        ))}
      </div>

      {/* Right Utility Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenBriefing}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg border border-indigo-500 shadow transition flex items-center gap-1.5"
        >
          <span>📖</span>
          <span>Math Guide</span>
        </button>

        <button
          type="button"
          onClick={toggleSound}
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600 transition"
        >
          {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
        </button>
      </div>
    </header>
  );
};
