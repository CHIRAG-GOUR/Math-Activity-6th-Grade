// ============================================================
// GRAPHWORKS — BRIEFING & VICTORY SCREENS
// 5-Question Competitive Race: Whoever answers first wins!
// ============================================================
'use client';

import React from 'react';
import { useGraphworksStore } from '../store/graphworksStore';

export function GraphworksBriefing() {
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const startGame = useGraphworksStore((s) => s.startGame);

  if (gamePhase !== 'briefing') return null;

  const questionsList = [
    { num: 1, type: 'CIRCLE GRAPH', name: 'Clean Energy Grid Mix', icon: '⚡' },
    { num: 2, type: 'BAR GRAPH', name: 'Weekly Rainfall Distribution', icon: '🌧️' },
    { num: 3, type: 'LINE GRAPH', name: 'Metro Train Journey & Station Stop', icon: '🚆' },
    { num: 4, type: 'PICTOGRAPH', name: 'Eco-Bike Commuters (1 🚲 = 5)', icon: '🚲' },
    { num: 5, type: 'CHAMPIONSHIP', name: 'Reservoir Emergency Surge', icon: '💧' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #1A237E 0%, #0D1B3E 100%)' }}>
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} className="absolute rounded-full bg-white/30 animate-pulse"
            style={{
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-4">
        {/* Machine badge */}
        <div className="inline-block mb-3">
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1">
            <span className="text-yellow-300 text-xs font-black tracking-[0.25em]">
              ARCADE GAME MACHINE 10 · GRADE 6 MATHEMATICS
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight leading-none">
          GRAPHWORKS
        </h1>
        <p className="text-lg md:text-xl font-black text-cyan-400 mb-2 tracking-widest">
          5-QUESTION FIRST-TO-ANSWER SPEED RACE
        </p>

        {/* Tagline */}
        <p className="text-sm md:text-base text-white/80 mb-5 font-medium">
          Both teams race on the same graph challenge. <span className="text-yellow-400 font-black">Whoever answers first wins the round!</span>
        </p>

        {/* 5 Questions breakdown */}
        <div className="bg-white/5 rounded-2xl border border-white/15 p-4 mb-5 shadow-xl backdrop-blur-xs">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-black text-yellow-300 uppercase tracking-wider">
              5 MATCH QUESTIONS (6TH GRADE SYLLABUS)
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              Best of 5 Rounds
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {questionsList.map((q) => (
              <div key={q.num} className="bg-black/40 rounded-xl border border-white/10 p-2.5 flex flex-col items-center text-center">
                <span className="text-xl mb-1">{q.icon}</span>
                <span className="text-[9px] font-black text-yellow-400 uppercase tracking-wide">
                  Q{q.num}: {q.type}
                </span>
                <span className="text-[9.5px] text-white/80 font-medium leading-tight mt-1 line-clamp-2">
                  {q.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Rules Callout */}
        <div className="bg-gradient-to-r from-blue-950/60 via-purple-950/60 to-red-950/60 rounded-xl border border-white/15 p-3 mb-5 flex items-center justify-center gap-3">
          <span className="text-xl">⚡</span>
          <p className="text-xs text-white/90 font-semibold leading-relaxed">
            Touch, drag, or use <span className="text-yellow-300 font-bold">±1, ±5, ±10</span> buttons to plot. The first team with <span className="text-emerald-400 font-bold">80%+ accuracy</span> to click <span className="text-cyan-300 font-black">CHECK GRAPH</span> instantly wins that round!
          </p>
        </div>

        {/* Teams */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 rounded-xl px-4 py-2">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-300 font-black text-sm">BLUE TEAM — LEFT CONSOLE</span>
          </div>
          <span className="text-yellow-400 text-xl font-black">VS</span>
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-2">
            <span className="text-red-300 font-black text-sm">RED TEAM — RIGHT CONSOLE</span>
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={startGame}
          className="px-12 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl text-slate-950 font-black text-lg tracking-wider shadow-lg shadow-yellow-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          ▶ START 5-QUESTION MATCH
        </button>
      </div>
    </div>
  );
}

// ============================================================
// GRAPHWORKS — VICTORY CINEMATIC
// End-game celebration with winning team display
// ============================================================

export function GraphworksVictory() {
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const blue = useGraphworksStore((s) => s.blue);
  const red = useGraphworksStore((s) => s.red);
  const roundWins = useGraphworksStore((s) => s.roundWins);
  const roundWinnersHistory = useGraphworksStore((s) => s.roundWinnersHistory);
  const restartGame = useGraphworksStore((s) => s.restartGame);

  if (gamePhase !== 'victory') return null;

  const blueWins = roundWins.blue;
  const redWins = roundWins.red;
  const winner = blueWins > redWins ? 'blue' : redWins > blueWins ? 'red' : (blue.totalScore > red.totalScore ? 'blue' : red.totalScore > blue.totalScore ? 'red' : 'tie');
  const winnerColor = winner === 'blue' ? '#38BDF8' : winner === 'red' ? '#F87171' : '#FFC107';
  const winnerName = winner === 'blue' ? 'BLUE TEAM' : winner === 'red' ? 'RED TEAM' : 'TIE MATCH';

  const roundNames = ['Circle Graph (Clean Energy)', 'Bar Graph (Rainfall)', 'Line Graph (Train Journey)', 'Pictograph (Cyclists)', 'Championship (Reservoir)'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: `radial-gradient(ellipse at center, ${winnerColor}30 0%, #080E21 100%)` }}>
      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="absolute rounded-full animate-bounce"
            style={{
              width: 4 + Math.random() * 8,
              height: 4 + Math.random() * 8,
              background: i % 3 === 0 ? '#FFC107' : i % 3 === 1 ? winnerColor : '#FFFFFF',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: 0.5 + Math.random() * 0.5,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center px-6 py-6 bg-slate-900/90 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-md">
        {/* Trophy */}
        <div className="text-6xl mb-2 animate-bounce" style={{ animationDuration: '2s' }}>
          🏆
        </div>

        {/* Winner */}
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          DATA CITY CHAMPIONSHIP
        </h1>
        <div className="text-3xl md:text-4xl font-black mb-4 tracking-wider" style={{ color: winnerColor }}>
          {winnerName} WINS!
        </div>

        {/* Round Scores Pill */}
        <div className="flex justify-center items-center gap-6 mb-5">
          <div className={`px-5 py-3 rounded-2xl border-2 flex flex-col items-center ${winner === 'blue' ? 'border-sky-400 bg-sky-500/20' : 'border-white/10 bg-white/5'}`}>
            <span className="text-sky-300 font-black text-xs uppercase">BLUE TEAM</span>
            <span className="text-3xl font-mono font-black text-white">{blueWins} WINS</span>
            <span className="text-[10px] text-slate-300 mt-1">{blue.totalScore} pts · {blue.graphAccuracy}% avg</span>
          </div>
          <div className="text-slate-500 font-black text-lg">VS</div>
          <div className={`px-5 py-3 rounded-2xl border-2 flex flex-col items-center ${winner === 'red' ? 'border-rose-400 bg-rose-500/20' : 'border-white/10 bg-white/5'}`}>
            <span className="text-rose-300 font-black text-xs uppercase">RED TEAM</span>
            <span className="text-3xl font-mono font-black text-white">{redWins} WINS</span>
            <span className="text-[10px] text-slate-300 mt-1">{red.totalScore} pts · {red.graphAccuracy}% avg</span>
          </div>
        </div>

        {/* Round-by-Round Breakdown */}
        <div className="bg-black/50 rounded-2xl border border-white/10 p-3.5 mb-6 text-left">
          <h3 className="text-[11px] font-black text-yellow-300 uppercase tracking-wider mb-2.5 text-center">
            MATCH RECAP — 5 QUESTIONS
          </h3>
          <div className="space-y-1.5">
            {roundNames.map((rName, i) => {
              const rWinner = roundWinnersHistory[i];
              return (
                <div key={i} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-300 font-semibold">
                    Q{i + 1}: {rName}
                  </span>
                  <span className={`font-black px-2 py-0.5 rounded text-[10.5px] ${
                    rWinner === 'blue'
                      ? 'bg-blue-600 text-white'
                      : rWinner === 'red'
                      ? 'bg-red-600 text-white'
                      : 'bg-white/10 text-slate-400'
                  }`}>
                    {rWinner === 'blue' ? '🔵 BLUE ANSWERED FIRST' : rWinner === 'red' ? '🔴 RED ANSWERED FIRST' : 'DRAW'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Replay */}
        <button
          onClick={restartGame}
          className="px-10 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl text-slate-950 font-black text-base tracking-wider shadow-lg shadow-yellow-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          ▶ PLAY NEW 5-QUESTION MATCH
        </button>
      </div>
    </div>
  );
}

