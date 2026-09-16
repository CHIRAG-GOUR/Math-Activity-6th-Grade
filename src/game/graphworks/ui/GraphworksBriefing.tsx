// ============================================================
// GRAPHWORKS — BRIEFING & 3D VICTORY RESULTS CARD
// 5-Question Mathematical City Building Simulation
// Light-theme frosted glass UI with animated typography and full background transparency!
// ============================================================
'use client';

import React, { useState } from 'react';
import { useGraphworksStore } from '../store/graphworksStore';

const FIVE_MILESTONES = [
  { num: 1, type: 'LINE GRAPH', name: 'Sunrise Temperature', icon: '☀️', unlock: 'Stage 1: Sky & Weather' },
  { num: 2, type: 'BAR GRAPH', name: 'City Market Stalls', icon: '🏪', unlock: 'Stage 2: Market Hall' },
  { num: 3, type: 'PICTOGRAPH', name: 'Botanical Park Visitors', icon: '🌸', unlock: 'Stage 3: Fountain & Citizens' },
  { num: 4, type: 'BAR GRAPH', name: 'Boulevard Traffic Flow', icon: '🚗', unlock: 'Stage 4: Vehicles & Signals' },
  { num: 5, type: 'CIRCLE GRAPH', name: 'Clean Energy Grid Mix', icon: '⚡', unlock: 'Stage 5: Data Tower & Grid' },
];

export function GraphworksBriefing() {
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const startGame = useGraphworksStore((s) => s.startGame);

  if (gamePhase !== 'briefing') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none bg-slate-900/35 backdrop-blur-md transition-all">
      {/* Subtle Floating Ambient Glow Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/20 animate-pulse"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              left: `${(i * 23) % 100}%`,
              top: `${(i * 31) % 100}%`,
              animationDelay: `${(i % 5) * 0.5}s`,
              animationDuration: `${2.5 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Main Light Glass Modal (Activity 3D World shown clearly through blur & transparency) */}
      <div className="relative z-10 max-w-3xl w-full mx-auto text-center px-8 py-7 bg-white/90 rounded-3xl border border-white/95 shadow-[0_25px_70px_rgba(15,23,42,0.22)] backdrop-blur-2xl text-slate-900">
        {/* Machine Badge */}
        <div className="anim-slide-up-1 inline-block mb-2">
          <div className="bg-amber-100 border border-amber-300 text-amber-900 rounded-full px-4 py-1 text-xs font-black tracking-[0.2em] shadow-xs">
            ARCADE MACHINE 10 · GRADE 6 MATHEMATICS
          </div>
        </div>

        {/* Title */}
        <h1 className="anim-slide-up-2 text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-none font-game mb-1">
          GRAPHWORKS
        </h1>
        <p className="anim-slide-up-2 anim-shimmer-title text-sm md:text-base font-black tracking-widest uppercase mb-3">
          5-Question Mathematical City-Building Simulation
        </p>

        {/* Core Game Hook */}
        <p className="anim-slide-up-3 text-xs md:text-sm text-slate-600 mb-5 max-w-xl mx-auto leading-relaxed font-medium">
          The Data City begins as an open construction ground. Each time a team plots a graph accurately,{' '}
          <span className="text-cyan-700 font-bold">weather activates</span>,{' '}
          <span className="text-emerald-700 font-bold">markets build</span>,{' '}
          <span className="text-amber-700 font-bold">citizens arrive</span>, and{' '}
          <span className="text-blue-700 font-bold">highways power up</span>.
          At the end of 5 questions,{' '}
          <span className="text-amber-600 font-black">the winning team&apos;s graph becomes the city&apos;s permanent architectural blueprint!</span>
        </p>

        {/* 5 Canonical Milestones Breakdown */}
        <div className="anim-slide-up-4 bg-slate-100/80 rounded-2xl border border-slate-200/80 p-3.5 mb-5 shadow-inner">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
              5 CITY DEVELOPMENT MILESTONES
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              5 Questions Total · First to Plot Correctly Wins
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {FIVE_MILESTONES.map((q) => (
              <div
                key={q.num}
                className="bg-white rounded-xl border border-slate-200/90 p-2.5 flex flex-col items-center text-center shadow-xs transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-cyan-400"
              >
                <span className="text-2xl mb-1">{q.icon}</span>
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-wide">
                  Q{q.num}: {q.type}
                </span>
                <span className="text-[10px] text-slate-800 font-bold leading-tight mt-0.5">
                  {q.name}
                </span>
                <span className="text-[8px] text-cyan-600 font-semibold mt-1 leading-tight">
                  {q.unlock}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Setup: Blue vs Red Studios */}
        <div className="anim-slide-up-5 flex justify-center items-center gap-6 mb-6">
          <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 shadow-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-600 animate-pulse shadow-md shadow-blue-400" />
            <div className="text-left">
              <span className="text-blue-900 font-black text-xs block">BLUE STUDIO</span>
              <span className="text-[10px] text-blue-600 font-medium">Plays from LEFT</span>
            </div>
          </div>

          <div className="px-3.5 py-1 bg-amber-100 border border-amber-300 rounded-full shadow-2xs">
            <span className="text-amber-900 font-black text-xs tracking-wider">SIMULTANEOUS RACE</span>
          </div>

          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-2 shadow-xs">
            <div className="text-right">
              <span className="text-red-900 font-black text-xs block">RED STUDIO</span>
              <span className="text-[10px] text-red-600 font-medium">Plays from RIGHT</span>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 animate-pulse shadow-md shadow-red-400" />
          </div>
        </div>

        {/* Start Match Button */}
        <button
          onClick={startGame}
          className="anim-slide-up-5 px-12 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-2xl text-white font-black text-base tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          ▶ COMMENCE CITY SIMULATION
        </button>
      </div>
    </div>
  );
}

// ============================================================
// GRAPHWORKS — ELEGANT FLOATING 3D VICTORY RESULTS CARD
// Light-theme glass card that keeps the continuous 3D world,
// sky proclamation, moving traffic, and celebrating citizens fully visible!
// ============================================================

export function GraphworksVictory() {
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const blue = useGraphworksStore((s) => s.blue);
  const red = useGraphworksStore((s) => s.red);
  const roundWins = useGraphworksStore((s) => s.roundWins);
  const roundWinnersHistory = useGraphworksStore((s) => s.roundWinnersHistory);
  const winningBlueprint = useGraphworksStore((s) => s.winningBlueprint);
  const restartGame = useGraphworksStore((s) => s.restartGame);

  const [minimized, setMinimized] = useState(false);

  if (gamePhase !== 'victory') return null;

  const blueWins = roundWins.blue;
  const redWins = roundWins.red;
  const winner = winningBlueprint ?? (blueWins > redWins ? 'blue' : redWins > blueWins ? 'red' : 'tie');
  const winnerColor = winner === 'blue' ? '#0284c7' : winner === 'red' ? '#e11d48' : '#d97706';
  const winnerTitle =
    winner === 'blue'
      ? '★ BLUE CITY FORMED ★'
      : winner === 'red'
      ? '★ RED CITY FORMED ★'
      : '★ JOINT METROPOLIS FORMED ★';

  // Minimized floating banner
  if (minimized) {
    return (
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button
          onClick={() => setMinimized(false)}
          className="px-5 py-2 rounded-full bg-white/92 border border-slate-200 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-black text-slate-900 hover:bg-white transition-all cursor-pointer"
        >
          <span className="text-base">🏆</span>
          <span style={{ color: winnerColor }} className="tracking-wide font-black">
            {winnerTitle} ({blueWins} — {redWins})
          </span>
          <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Show Scorecard ↗
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-30 max-w-xl w-[92vw] pointer-events-auto select-none">
      <div className="bg-white/92 border border-white/90 rounded-3xl p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl text-center text-slate-900">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏆</span>
            <span className="text-[10px] font-black text-amber-600 tracking-widest uppercase">
              CITY BLUEPRINT COMPLETE · 100% BUILT
            </span>
          </div>
          <button
            onClick={() => setMinimized(true)}
            title="Minimize to inspect 3D city"
            className="text-[10px] font-black text-slate-500 hover:text-slate-900 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
          >
            👁️ Inspect City
          </button>
        </div>

        {/* Winner Proclamation Headline */}
        <h2 className="text-2xl md:text-3xl font-black tracking-wider mb-1 font-game" style={{ color: winnerColor }}>
          {winnerTitle}
        </h2>

        {/* Narrative Description */}
        <p className="text-[11.5px] text-slate-600 font-medium mb-3.5 max-w-md mx-auto leading-relaxed">
          {winner === 'blue'
            ? "Blue Team's mathematical graphs have formed the permanent architectural blueprint! Citizens assemble in the central plaza celebrating their architects!"
            : winner === 'red'
            ? "Red Team's mathematical graphs have formed the permanent architectural blueprint! Citizens assemble in the central plaza celebrating their architects!"
            : 'Both teams contributed equally to the completed city blueprint! Citizens assemble in the central plaza celebrating both studios!'}
        </p>

        {/* Score Comparison Pill */}
        <div className="flex items-center justify-center gap-4 mb-3.5">
          <div
            className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 ${
              winner === 'blue'
                ? 'bg-blue-50 border-blue-400 shadow-sm'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-blue-900 font-black text-xs">BLUE</span>
            <span className="text-base font-black font-mono text-slate-900">{blueWins}</span>
            <span className="text-[9px] text-slate-500">({blue.totalScore} pts)</span>
          </div>

          <span className="text-amber-500 font-black text-sm tracking-widest">—</span>

          <div
            className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 ${
              winner === 'red'
                ? 'bg-red-50 border-red-400 shadow-sm'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[9px] text-slate-500">({red.totalScore} pts)</span>
            <span className="text-base font-black font-mono text-slate-900">{redWins}</span>
            <span className="text-red-900 font-black text-xs">RED</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          </div>
        </div>

        {/* 5-Question Milestone Results Grid */}
        <div className="bg-slate-100/90 rounded-2xl border border-slate-200 p-2.5 mb-3.5">
          <div className="grid grid-cols-5 gap-1.5">
            {FIVE_MILESTONES.map((m, i) => {
              const qWinner = roundWinnersHistory[i];
              return (
                <div
                  key={m.num}
                  className={`flex flex-col items-center p-1.5 rounded-xl border text-center ${
                    qWinner === 'blue'
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : qWinner === 'red'
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-sm">{m.icon}</span>
                  <span className="text-[8.5px] font-black mt-0.5">Q{m.num}</span>
                  <span className="text-[7.5px] font-bold uppercase truncate max-w-[70px]">
                    {qWinner === 'blue' ? '🔵 Blue' : qWinner === 'red' ? '🔴 Red' : 'Tie'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Play Again Rematch Action */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={restartGame}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-black text-xs tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            🔄 PLAY REMATCH (NEW CITY)
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 font-bold text-xs tracking-wider border border-slate-200 transition-all cursor-pointer"
          >
            👁️ INSPECT 3D CITY
          </button>
        </div>
      </div>
    </div>
  );
}
