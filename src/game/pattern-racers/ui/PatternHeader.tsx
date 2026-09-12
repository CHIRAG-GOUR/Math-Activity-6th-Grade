// ============================================================
// PATTERN RACERS — Top Mission Bar & Match Header
// Faithful to the Championship Broadcast UI:
// - Left: Stage Mission Title (e.g. MISSION 01 | STAGE 1: FIND THE PATTERN)
// - Center: 5-Stage Step Navigation Pills [1 PATTERN] [2 SEQUENCE] [3 FUNCTION] [4 REPAIR] [5 GRAND PRIX]
// - Right: Live Stopwatch ⏱️ 00:45, Sound Toggle & Hub Return
// ============================================================

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePatternStore } from '../store/patternStore';
import { patternAudio } from '../engine/patternAudio';
import { Home, Volume2, VolumeX, Maximize2, Flag, Timer } from 'lucide-react';

export const PatternHeader: React.FC = () => {
  const router = useRouter();
  const currentRound = usePatternStore((s) => s.currentRound);
  const timeRemaining = usePatternStore((s) => s.timeRemaining);
  const [isMuted, setIsMuted] = useState(patternAudio.getMuted());

  const handleToggleSound = () => {
    const muted = patternAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleReturnToHub = () => {
    patternAudio.stopBgm();
    router.push('/');
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const STAGE_STEPS = [
    { num: 1, label: 'GARAGE' },
    { num: 2, label: 'PIT CHECK' },
    { num: 3, label: 'GRID REV 1' },
    { num: 4, label: 'SIGNAL 2' },
    { num: 5, label: 'GRAND PRIX' },
  ];

  const stageTitles = [
    'STAGE 1: GARAGE DEPARTURE & TELEMETRY CHECK',
    'STAGE 2: PIT SERVICE & TYRE PRESSURE CHECK',
    'STAGE 3: STARTING GRID STAGING & 1ST SIGNAL GREEN',
    'STAGE 4: PRE-GRID REV & 2ND SIGNAL GREEN',
    'STAGE 5: LIVE GRAND PRIX RACING SPRINT!',
  ];

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Hide top bar during live grand prix race
  const phase = usePatternStore((s) => s.phase);
  if (phase === 'grand_prix_race') return null;

  return (
    <header className="w-full h-13 px-4 flex items-center justify-between z-30 select-none bg-transparent">
      {/* ── Center Unified Floating Glass Header Capsule ── */}
      <div className="mx-auto flex items-center gap-3.5 bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl border-2 border-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
        {/* Mission Badge */}
        <div className="flex items-center gap-2 pr-3 border-r-2 border-slate-300">
          <div className="w-7 h-7 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black shadow-xs">
            <Flag className="w-3.5 h-3.5 fill-slate-950" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block leading-none">
              MISSION 0{currentRound}
            </span>
            <span className="text-xs font-black uppercase text-slate-950 leading-tight">
              {stageTitles[Math.min(currentRound - 1, 4)]}
            </span>
          </div>
        </div>

        {/* 5 Physical Stage Progress Pills */}
        <div className="hidden lg:flex items-center gap-1.5 px-2">
          {STAGE_STEPS.map((step) => {
            const isCurrent = currentRound === step.num;
            const isPassed = currentRound > step.num;

            return (
              <div
                key={`step-pill-${step.num}`}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-xs scale-105'
                    : isPassed
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-mono ${
                    isCurrent
                      ? 'bg-slate-950 text-white'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {isPassed ? '✓' : step.num}
                </span>
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 font-mono font-black text-xs shadow-xs">
          <Timer className="w-3.5 h-3.5 text-emerald-600" />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        {/* Action Controls: Sound, Fullscreen, Hub */}
        <div className="flex items-center gap-1.5 pl-2 border-l-2 border-slate-300">
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-800 transition active:scale-95 cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-800 transition active:scale-95 cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReturnToHub}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-800 transition active:scale-95 cursor-pointer"
            title="Return to Arcade Lobby"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
