// ============================================================
// GRAPHWORKS — THE DATA CITY: Main Game Component
// Orchestrates 3D world + Graph Studios + Scoring + Rounds
// ============================================================
'use client';

import React, { Suspense, useEffect, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DataCity3D } from '../world/DataCity3D';
import { GraphStudio } from './GraphStudio';
import { GraphworksHeader } from './GraphworksHeader';
import { GraphworksBriefing, GraphworksVictory } from './GraphworksBriefing';
import { useGraphworksStore } from '../store/graphworksStore';
import { getCompetitiveQuestion } from '../data/questions';

// ── MISSION FLOW CONTROLLER ──
// Synchronizes both teams with identical 5-round competitive questions
function MissionController() {
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const currentRound = useGraphworksStore((s) => s.currentRound);
  const blue = useGraphworksStore((s) => s.blue);
  const red = useGraphworksStore((s) => s.red);
  const setMission = useGraphworksStore((s) => s.setMission);

  useEffect(() => {
    if (gamePhase !== 'playing') return;

    if (!blue.currentMission) {
      const mission = getCompetitiveQuestion(currentRound);
      setMission('blue', mission);
    }
    if (!red.currentMission) {
      const mission = getCompetitiveQuestion(currentRound);
      setMission('red', mission);
    }
  }, [gamePhase, currentRound, blue.currentMission, red.currentMission, setMission]);

  return null;
}

// ── ARCADE FIRST-TO-ANSWER ROUND WINNER BANNER ──
function RoundWinBanner() {
  const roundBanner = useGraphworksStore((s) => s.roundBanner);
  const roundWins = useGraphworksStore((s) => s.roundWins);

  if (!roundBanner || !roundBanner.visible) return null;

  const isBlue = roundBanner.team === 'blue';
  const teamColor = isBlue ? '#38BDF8' : '#F87171';
  const teamBorder = isBlue ? 'border-sky-400 shadow-sky-500/50' : 'border-rose-400 shadow-rose-500/50';
  const teamGlow = isBlue ? 'bg-sky-500/20' : 'bg-rose-500/20';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Dark overlay backdrop with subtle blur */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200" />

      {/* Floating arcade victory card */}
      <div
        className={`relative z-10 max-w-md w-full bg-slate-900/95 border-2 ${teamBorder} rounded-3xl p-6 text-center text-white shadow-2xl animate-in zoom-in-90 duration-200`}
      >
        {/* Floating trophy badge */}
        <div className="mx-auto -mt-12 w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/50 border-2 border-white animate-bounce">
          🏆
        </div>

        {/* First to answer badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-black tracking-widest uppercase">
          <span>⚡ FIRST TO ANSWER CORRECTLY! ⚡</span>
        </div>

        <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight" style={{ color: teamColor }}>
          {roundBanner.title}
        </h2>

        <p className="mt-1 text-xs md:text-sm font-semibold text-slate-300">
          {roundBanner.subtitle}
        </p>

        {/* Live Match Round Scoreboard */}
        <div className="mt-4 py-2.5 px-5 rounded-2xl bg-black/60 border border-white/15 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black tracking-wider text-sky-400 uppercase">BLUE TEAM</span>
            <span className="text-2xl font-mono font-black text-white">{roundWins.blue} WINS</span>
          </div>
          <div className="text-slate-500 font-black text-sm px-2">VS</div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black tracking-wider text-rose-400 uppercase">RED TEAM</span>
            <span className="text-2xl font-mono font-black text-white">{roundWins.red} WINS</span>
          </div>
        </div>

        {/* Animated countdown / transition bar */}
        <div className="mt-4">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-[2600ms] ease-linear"
              style={{
                width: '100%',
                background: isBlue
                  ? 'linear-gradient(90deg, #38BDF8, #60A5FA)'
                  : 'linear-gradient(90deg, #F87171, #FB7185)',
              }}
            />
          </div>
          <span className="block mt-1.5 text-[9.5px] font-bold text-slate-400 tracking-wider uppercase">
            {roundBanner.round >= 5 ? 'Calculating Championship Results...' : `Loading Question ${roundBanner.round + 1} of 5...`}
          </span>
        </div>
      </div>
    </div>
  );
}



// ── GRAPH RUN INDICATOR ──
function GraphRunIndicator() {
  const isRunningGraph = useGraphworksStore((s) => s.isRunningGraph);
  const runningTeam = useGraphworksStore((s) => s.runningTeam);
  const graphRunProgress = useGraphworksStore((s) => s.graphRunProgress);

  if (!isRunningGraph) return null;

  const color = runningTeam === 'blue' ? '#1976D2' : '#D32F2F';
  const teamName = runningTeam === 'blue' ? 'BLUE' : 'RED';

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
      <div className="bg-white rounded-xl shadow-xl px-5 py-3 border-2 flex items-center gap-3"
        style={{ borderColor: color }}>
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${color} transparent ${color} ${color}` }} />
        <div>
          <div className="font-black text-xs" style={{ color }}>
            {teamName} GRAPH RUNNING
          </div>
          <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${graphRunProgress * 100}%`, background: color }} />
          </div>
        </div>
        <span className="text-lg">🏙️</span>
      </div>
    </div>
  );
}

import dynamic from 'next/dynamic';

const DataCityCanvas = dynamic(
  () => import('../world/DataCityCanvas').then((m) => m.DataCityCanvas),
  { ssr: false }
);

// ── MAIN GAME COMPONENT ──
export function GraphworksGame() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-sky-100"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Load Inter font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── FULLSCREEN 3D DATA CITY CANVAS ── */}
      <div className="absolute inset-0 z-0">
        <DataCityCanvas />
        <GraphRunIndicator />
      </div>

      {/* ── BRIEFING MODAL ── */}
      <GraphworksBriefing />

      {/* ── VICTORY CINEMATIC ── */}
      <GraphworksVictory />

      {/* ── ARCADE FIRST-TO-ANSWER ROUND WINNER BANNER ── */}
      <RoundWinBanner />

      {/* ── TOP SCOREBOARD & CONTROLS HEADER ── */}
      <div className="relative z-20 pointer-events-auto">
        <GraphworksHeader />
      </div>

      {/* ── MISSION CONTROLLER LOGIC ── */}
      <MissionController />

      {/* ── BOTTOM-LEFT CORNER: BLUE GRAPH STUDIO ── */}
      <div className="fixed z-30 bottom-2.5 left-2.5 w-[310px] min-w-[310px] max-w-[310px] pointer-events-auto">
        <GraphStudio team="blue" />
      </div>

      {/* ── BOTTOM-RIGHT CORNER: RED GRAPH STUDIO ── */}
      <div className="fixed z-30 bottom-2.5 right-2.5 w-[310px] min-w-[310px] max-w-[310px] pointer-events-auto">
        <GraphStudio team="red" />
      </div>
    </div>
  );
}
