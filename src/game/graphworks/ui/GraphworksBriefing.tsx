// ============================================================
// GRAPHWORKS — BRIEFING & 3D VICTORY RESULTS CARD
// 5-Question Mathematical City Building Simulation
// The winning team's graph becomes the physical blueprint for the city!
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ background: 'radial-gradient(ellipse at center, #1A237E 0%, #0D1B3E 100%)' }}
    >
      {/* Dynamic Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 45 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-200/40 animate-pulse"
            style={{
              width: 2 + (i % 3) * 1.5,
              height: 2 + (i % 3) * 1.5,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${(i % 5) * 0.7}s`,
              animationDuration: `${2 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-5 bg-slate-950/80 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-md">
        {/* Machine Badge */}
        <div className="inline-block mb-2.5">
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1">
            <span className="text-yellow-300 text-xs font-black tracking-[0.25em]">
              ARCADE MACHINE 10 · GRADE 6 MATHEMATICS
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight leading-none font-game">
          GRAPHWORKS
        </h1>
        <p className="text-base md:text-lg font-black text-cyan-400 mb-2 tracking-widest">
          5-QUESTION MATHEMATICAL CITY-BUILDING SIMULATION
        </p>

        {/* Core Game Hook */}
        <p className="text-xs md:text-sm text-white/85 mb-4 max-w-xl mx-auto leading-relaxed">
          The city begins almost empty. As each team plots graphs accurately,{' '}
          <span className="text-cyan-300 font-bold">weather transitions</span>,{' '}
          <span className="text-emerald-300 font-bold">markets build</span>,{' '}
          <span className="text-amber-300 font-bold">citizens arrive</span>, and{' '}
          <span className="text-purple-300 font-bold">traffic powers on</span>.
          At the end of 5 questions,{' '}
          <span className="text-yellow-300 font-black">the winning team&apos;s graph becomes the city&apos;s permanent blueprint!</span>
        </p>

        {/* 5 Canonical Milestones Breakdown */}
        <div className="bg-white/5 rounded-2xl border border-white/15 p-3.5 mb-4 shadow-xl backdrop-blur-xs">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-black text-yellow-300 uppercase tracking-wider">
              5 CITY DEVELOPMENT MILESTONES
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              5 Questions Total · First to Plot Correctly Wins
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {FIVE_MILESTONES.map((q) => (
              <div
                key={q.num}
                className="bg-black/50 rounded-xl border border-white/10 p-2 flex flex-col items-center text-center transition-transform hover:scale-105"
              >
                <span className="text-xl mb-1">{q.icon}</span>
                <span className="text-[9px] font-black text-yellow-400 uppercase tracking-wide">
                  Q{q.num}: {q.type}
                </span>
                <span className="text-[9.5px] text-white font-semibold leading-tight mt-0.5">
                  {q.name}
                </span>
                <span className="text-[8px] text-cyan-300/80 font-medium mt-1 leading-tight">
                  {q.unlock}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Setup: Blue vs Red */}
        <div className="flex justify-center items-center gap-6 mb-5">
          <div className="flex items-center gap-2.5 bg-blue-950/70 border border-blue-500/50 rounded-xl px-4 py-2 shadow-lg">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-pulse shadow-md shadow-blue-500" />
            <div className="text-left">
              <span className="text-blue-300 font-black text-xs block">BLUE STUDIO</span>
              <span className="text-[10px] text-slate-300 font-medium">Plays from LEFT</span>
            </div>
          </div>

          <div className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 rounded-full">
            <span className="text-yellow-400 font-black text-xs">SIMULTANEOUS RACE</span>
          </div>

          <div className="flex items-center gap-2.5 bg-red-950/70 border border-red-500/50 rounded-xl px-4 py-2 shadow-lg">
            <div className="text-right">
              <span className="text-red-300 font-black text-xs block">RED STUDIO</span>
              <span className="text-[10px] text-slate-300 font-medium">Plays from RIGHT</span>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse shadow-md shadow-red-500" />
          </div>
        </div>

        {/* Start Match Button */}
        <button
          onClick={startGame}
          className="px-12 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-xl text-slate-950 font-black text-base tracking-wider shadow-lg shadow-yellow-500/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          ▶ COMMENCE CITY SIMULATION
        </button>
      </div>
    </div>
  );
}

// ============================================================
// GRAPHWORKS — ELEGANT FLOATING 3D VICTORY RESULTS CARD
// Does NOT block the 3D world! The living city, sky proclamation,
// moving traffic, and celebrating citizens remain fully visible!
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
  const winnerColor = winner === 'blue' ? '#38BDF8' : winner === 'red' ? '#F87171' : '#FBBF24';
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
          className="px-5 py-2 rounded-full bg-slate-900/90 border border-white/25 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-black text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <span className="text-base">🏆</span>
          <span style={{ color: winnerColor }} className="tracking-wide">
            {winnerTitle} ({blueWins} — {redWins})
          </span>
          <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
            Show Scorecard ↗
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-30 max-w-xl w-[92vw] pointer-events-auto select-none">
      <div className="bg-slate-950/85 border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-center text-white">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-1.5 px-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🏆</span>
            <span className="text-[10px] font-black text-yellow-400 tracking-widest uppercase">
              CITY BLUEPRINT COMPLETE · 100% BUILT
            </span>
          </div>
          <button
            onClick={() => setMinimized(true)}
            title="Minimize to inspect 3D city"
            className="text-[10px] font-black text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            👁️ Inspect City
          </button>
        </div>

        {/* Winner Proclamation Headline */}
        <h2 className="text-xl md:text-2xl font-black tracking-wider mb-1 font-game" style={{ color: winnerColor }}>
          {winnerTitle}
        </h2>

        {/* Narrative Description */}
        <p className="text-[11px] text-slate-300 font-medium mb-3 max-w-md mx-auto leading-relaxed">
          {winner === 'blue'
            ? "Blue Team's mathematical graphs have formed the permanent architectural blueprint! Citizens assemble in the central plaza celebrating their architects!"
            : winner === 'red'
            ? "Red Team's mathematical graphs have formed the permanent architectural blueprint! Citizens assemble in the central plaza celebrating their architects!"
            : 'Both teams contributed equally to the completed city blueprint! Citizens assemble in the central plaza to celebrate both studios!'}
        </p>

        {/* Score Comparison Pill */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <div
            className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 ${
              winner === 'blue'
                ? 'bg-blue-950/80 border-blue-400 shadow-sm shadow-blue-500/30'
                : 'bg-black/40 border-white/10'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-300 font-black text-xs">BLUE</span>
            <span className="text-base font-black font-mono text-white">{blueWins}</span>
            <span className="text-[9px] text-slate-400">({blue.totalScore} pts)</span>
          </div>

          <span className="text-yellow-400 font-black text-xs tracking-widest">—</span>

          <div
            className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 ${
              winner === 'red'
                ? 'bg-red-950/80 border-red-400 shadow-sm shadow-red-500/30'
                : 'bg-black/40 border-white/10'
            }`}
          >
            <span className="text-[9px] text-slate-400">({red.totalScore} pts)</span>
            <span className="text-base font-black font-mono text-white">{redWins}</span>
            <span className="text-red-300 font-black text-xs">RED</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        {/* 5-Question Milestone Results Grid */}
        <div className="bg-black/50 rounded-xl border border-white/10 p-2.5 mb-3">
          <div className="grid grid-cols-5 gap-1.5">
            {FIVE_MILESTONES.map((m, i) => {
              const qWinner = roundWinnersHistory[i];
              return (
                <div
                  key={m.num}
                  className={`flex flex-col items-center p-1.5 rounded-lg border text-center ${
                    qWinner === 'blue'
                      ? 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                      : qWinner === 'red'
                      ? 'bg-red-950/60 border-red-500/40 text-red-300'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  <span className="text-xs">{m.icon}</span>
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
            className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl text-slate-950 font-black text-xs tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            🔄 PLAY REMATCH (NEW CITY)
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-black text-xs tracking-wider border border-white/15 transition-all cursor-pointer"
          >
            👁️ INSPECT CITY
          </button>
        </div>
      </div>
    </div>
  );
}
