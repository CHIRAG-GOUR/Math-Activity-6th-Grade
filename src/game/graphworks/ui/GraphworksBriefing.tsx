// ============================================================
// GRAPHWORKS — BRIEFING MODAL
// Intro/mission briefing before gameplay starts
// ============================================================
'use client';

import React from 'react';
import { useGraphworksStore } from '../store/graphworksStore';

export function GraphworksBriefing() {
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const startGame = useGraphworksStore((s) => s.startGame);

  if (gamePhase !== 'briefing') return null;

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

      <div className="relative z-10 max-w-3xl mx-auto text-center px-8">
        {/* Machine badge */}
        <div className="inline-block mb-4">
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1">
            <span className="text-yellow-300 text-xs font-black tracking-[0.3em]">
              ARCADE GAME MACHINE 10
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight leading-none">
          GRAPHWORKS
        </h1>
        <p className="text-xl font-bold text-blue-300 mb-6 tracking-wider">
          THE DATA CITY
        </p>

        {/* Tagline */}
        <p className="text-lg text-white/80 mb-8 font-medium">
          Build graphs. Power your city. Win the data challenge.
        </p>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: '📊', title: 'BUILD GRAPHS', desc: 'Construct line, bar & coordinate graphs from real data' },
            { icon: '🏙️', title: 'POWER YOUR CITY', desc: 'Watch your graph data drive the living 3D city' },
            { icon: '🏆', title: 'WIN THE CHALLENGE', desc: 'Compete as Blue or Red team across 5 rounds' },
          ].map((item) => (
            <div key={item.title} className="bg-white/5 rounded-xl border border-white/10 p-4">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-white/50 text-xs leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Round breakdown */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-8">
          <h3 className="text-white font-bold text-sm mb-3">5 ROUNDS</h3>
          <div className="flex justify-center gap-2">
            {['READ', 'COMPLETE', 'BUILD', 'INTERPRET', 'CREATE'].map((r, i) => (
              <div key={r} className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <span className="text-yellow-300 text-[10px] font-black">{i + 1}</span>
                </div>
                <span className="text-white/60 text-[10px] font-semibold">{r}</span>
                {i < 4 && <span className="text-white/20 mx-1">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Teams */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-lg px-4 py-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-blue-300 font-black text-sm">BLUE TEAM — LEFT</span>
          </div>
          <span className="text-white/30 text-2xl font-black self-center">VS</span>
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-2">
            <span className="text-red-300 font-black text-sm">RED TEAM — RIGHT</span>
            <div className="w-4 h-4 rounded bg-red-500" />
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={startGame}
          className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-black text-xl tracking-wider shadow-lg shadow-yellow-500/30 hover:brightness-110 active:scale-95 transition-all"
        >
          ▶ START GAME
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
  const restartGame = useGraphworksStore((s) => s.restartGame);

  if (gamePhase !== 'victory') return null;

  const blueTotal = blue.totalScore;
  const redTotal = red.totalScore;
  const winner = blueTotal > redTotal ? 'blue' : blueTotal < redTotal ? 'red' : 'tie';
  const winnerColor = winner === 'blue' ? '#1976D2' : winner === 'red' ? '#D32F2F' : '#FFC107';
  const winnerName = winner === 'blue' ? 'BLUE TEAM' : winner === 'red' ? 'RED TEAM' : 'TIE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: `radial-gradient(ellipse at center, ${winnerColor}40 0%, #0D1B3E 100%)` }}>
      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }, (_, i) => (
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

      <div className="relative z-10 text-center px-8">
        {/* Trophy */}
        <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
          🏆
        </div>

        {/* Winner */}
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
          DATA CITY CHAMPION
        </h1>
        <div className="text-3xl font-black mb-4" style={{ color: winnerColor }}>
          {winnerName}
        </div>

        {/* Scores */}
        <div className="flex justify-center gap-8 mb-6">
          <div className={`p-4 rounded-xl border-2 ${winner === 'blue' ? 'border-blue-400 bg-blue-500/20' : 'border-white/10 bg-white/5'}`}>
            <div className="text-blue-300 font-bold text-sm mb-1">BLUE TEAM</div>
            <div className="text-white font-black text-3xl">{blueTotal}</div>
            <div className="text-white/40 text-xs mt-1">
              Accuracy: {blue.graphAccuracy}% | City Lv.{blue.cityLevel}
            </div>
          </div>
          <div className={`p-4 rounded-xl border-2 ${winner === 'red' ? 'border-red-400 bg-red-500/20' : 'border-white/10 bg-white/5'}`}>
            <div className="text-red-300 font-bold text-sm mb-1">RED TEAM</div>
            <div className="text-white font-black text-3xl">{redTotal}</div>
            <div className="text-white/40 text-xs mt-1">
              Accuracy: {red.graphAccuracy}% | City Lv.{red.cityLevel}
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-white/70 text-lg mb-6 font-medium">
          "Your graphs powered the city."
        </p>

        {/* Loser encouragement */}
        {winner !== 'tie' && (
          <p className="text-white/40 text-sm mb-6">
            {winner === 'blue' ? 'Red' : 'Blue'} Team: Great work — your city is fully operational!
          </p>
        )}

        {/* Replay */}
        <button
          onClick={restartGame}
          className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-black text-lg tracking-wider shadow-lg shadow-yellow-500/30 hover:brightness-110 active:scale-95 transition-all"
        >
          ▶ PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
