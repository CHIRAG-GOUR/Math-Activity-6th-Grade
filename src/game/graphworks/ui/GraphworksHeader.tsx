// ============================================================
// GRAPHWORKS — TOP SCOREBOARD & ARCADE HUD
// Sleek floating glassmorphism HUD with live dual-team telemetry,
// digital match countdown clock, and integrated round progress.
// ============================================================
'use client';

import React, { useEffect, useState } from 'react';
import { useGraphworksStore } from '../store/graphworksStore';
import { soundManager } from '@/utils/audio';

export function GraphworksHeader() {
  const blue = useGraphworksStore((s) => s.blue);
  const red = useGraphworksStore((s) => s.red);
  const currentRound = useGraphworksStore((s) => s.currentRound);
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const timer = useGraphworksStore((s) => s.timer);
  const isTimerRunning = useGraphworksStore((s) => s.isTimerRunning);
  const advanceRound = useGraphworksStore((s) => s.advanceRound);

  const [displayTimer, setDisplayTimer] = useState(timer);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setDisplayTimer((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const minutes = Math.floor(displayTimer / 60);
  const seconds = displayTimer % 60;

  const roundWins = useGraphworksStore((s) => s.roundWins);
  const cityEventState = useGraphworksStore((s) => s.cityEventState);

  return (
    <header className="w-full px-4 py-1.5 flex items-center justify-between bg-slate-900/90 backdrop-blur-md border-b border-white/15 text-white select-none shadow-xl z-20">
      {/* ── LEFT: GAME LOGO & TAGLINE ── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Logo icon */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 19h16v2H4zm2-4h3v2H6zm5-6h3v8h-3zm5-6h3v14h-3z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-white font-game">GRAPHWORKS</span>
              <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30">
                THE DATA CITY
              </span>
            </div>
            <span className="text-[9.5px] text-slate-300 font-medium tracking-wide">
              50 City Data Tasks · 10 Progressive City Events · First to plot wins!
            </span>
          </div>
        </div>

        {/* BLUE TEAM TELEMETRY POD */}
        <div className="hidden md:flex items-center gap-2 bg-blue-950/70 border border-blue-500/40 rounded-xl px-2.5 py-1 ml-2 shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-xs shadow-blue-400" />
            <span className="font-black text-xs text-blue-400 tracking-wider">BLUE</span>
            <span className="text-[10px] font-black px-1.5 py-0.2 bg-blue-600 text-white rounded-full">
              {roundWins.blue} WINS
            </span>
          </div>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-2 text-[10px]">
            <div>
              <span className="text-slate-400 block text-[8px] uppercase font-bold">Accuracy</span>
              <span className="font-black text-white font-mono">{blue.graphAccuracy}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[8px] uppercase font-bold">Score</span>
              <span className="font-black text-yellow-400 font-mono">{blue.totalScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTER: 5-QUESTION CITY EVENT HUD & FIRST-TO-ANSWER SCOREBOARD ── */}
      <div className="flex flex-col items-center gap-1 max-w-xl">
        {/* Top Mini Pill: Match Timer & Wins Scoreboard */}
        <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-full px-3 py-0.5 shadow-inner">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-400 font-black text-[11px]">BLUE</span>
            <span className="font-mono font-black text-[11px] text-white bg-blue-900/80 px-1.5 py-0.1 rounded border border-blue-500/40">
              {roundWins.blue}
            </span>
          </div>
          <span className="text-yellow-400 font-black text-[9px] tracking-widest px-0.5">WINS</span>
          <div className="flex items-center gap-1">
            <span className="font-mono font-black text-[11px] text-white bg-red-900/80 px-1.5 py-0.1 rounded border border-red-500/40">
              {roundWins.red}
            </span>
            <span className="text-red-400 font-black text-[11px]">RED</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="h-3 w-px bg-white/20 mx-0.5" />
          <span className="font-mono font-bold text-[11px] text-amber-300 tracking-widest tabular-nums">
            ⏱️ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Compact 5-Phase City Event Tracker */}
        <div className="flex items-center gap-2 bg-slate-950/75 border border-cyan-500/40 rounded-full px-3 py-0.5 shadow-md">
          <span className="text-[10px] font-black tracking-wider text-cyan-300 uppercase">
            EVENT {cityEventState.eventIndex + 1}/10: {cityEventState.currentEvent.title}
          </span>

          <div className="h-3 w-px bg-white/20" />

          {/* 5 Event Phase Dots */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((phaseNum) => {
              const currentPhase = cityEventState.eventPhase;
              const isPast = currentPhase > phaseNum;
              const isCurrent = currentPhase === phaseNum;
              const qNum = (cityEventState.eventIndex * 5) + phaseNum;

              return (
                <div
                  key={phaseNum}
                  title={`Question ${qNum}: Phase ${phaseNum}`}
                  className={`flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[8.5px] font-black transition-all ${
                    isPast
                      ? 'bg-emerald-600 text-white border border-emerald-300 shadow-xs'
                      : isCurrent
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse font-extrabold shadow-sm'
                      : 'bg-white/10 text-slate-400 border border-white/10'
                  }`}
                >
                  <span>{isPast ? '✓' : isCurrent ? '●' : '○'}</span>
                  <span>{phaseNum}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase subtitle / completion toast */}
        <div className="text-center min-h-[14px]">
          {cityEventState.completionToast ? (
            <span className="text-[10px] font-black text-emerald-300 tracking-wide bg-emerald-950/90 border border-emerald-400/60 px-2.5 py-0.5 rounded-full animate-bounce inline-block shadow-md">
              🎉 {cityEventState.completionToast}! NEXT EVENT COMMENCING...
            </span>
          ) : (
            <span className="text-[9.5px] text-cyan-200/90 font-medium tracking-wide">
              {cityEventState.phaseDescription}
            </span>
          )}
        </div>
      </div>

      {/* ── RIGHT: RED TEAM TELEMETRY & MACHINE BADGE ── */}
      <div className="flex items-center gap-3">
        {/* RED TEAM TELEMETRY POD */}
        <div className="hidden md:flex items-center gap-2.5 bg-red-950/70 border border-red-500/40 rounded-xl px-3 py-1 mr-3 shadow-inner">
          <div className="flex items-center gap-2.5 text-[10px]">
            <div>
              <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Accuracy</span>
              <span className="font-black text-white font-mono">{red.graphAccuracy}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[8.5px] uppercase font-bold">City</span>
              <span className="font-black text-rose-300 font-mono">Lv.{red.cityLevel}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Score</span>
              <span className="font-black text-yellow-400 font-mono">{red.totalScore}</span>
            </div>
          </div>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs text-red-400 tracking-wider">RED</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-xs shadow-red-400" />
          </div>
        </div>

        {/* Arcade Machine 10 Badge */}
        <div className="flex items-center gap-1.5 bg-yellow-400/15 border border-yellow-400/40 px-2.5 py-1 rounded-xl">
          <span className="text-xs">🕹️</span>
          <div className="flex flex-col">
            <span className="text-[8px] font-black tracking-widest text-yellow-400 uppercase leading-none">
              ARCADE MACHINE
            </span>
            <span className="text-[10px] font-black text-white tracking-wider leading-tight">
              #10
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
