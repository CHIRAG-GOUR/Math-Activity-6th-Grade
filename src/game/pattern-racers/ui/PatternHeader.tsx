// ============================================================
// PATTERN RACERS — Top Navigation & Match Status Header
// ============================================================

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePatternStore } from '../store/patternStore';
import { patternAudio } from '../engine/patternAudio';
import { Trophy, Home, Volume2, VolumeX, Sparkles, Timer } from 'lucide-react';

export const PatternHeader: React.FC = () => {
  const router = useRouter();
  const currentRound = usePatternStore((s) => s.currentRound);
  const questionCountConfig = usePatternStore((s) => s.questionCountConfig);
  const setQuestionCount = usePatternStore((s) => s.setQuestionCount);
  const blueScore = usePatternStore((s) => s.blueTeam.score);
  const redScore = usePatternStore((s) => s.redTeam.score);
  const [isMuted, setIsMuted] = useState(patternAudio.getMuted());

  const handleToggleSound = () => {
    const muted = patternAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleReturnToHub = () => {
    patternAudio.stopBgm();
    router.push('/');
  };

  return (
    <header className="w-full h-14 bg-white/95 backdrop-blur-md border-b-3 border-slate-900 px-3 sm:px-6 flex items-center justify-between shadow-sm z-30 select-none">
      {/* ── Left: Title & Round Badge ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReturnToHub}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 shadow-[2px_2px_0px_#000000] active:scale-95 transition cursor-pointer flex items-center gap-1.5"
          title="Return to Arcade Lobby"
        >
          <Home className="w-4 h-4 text-slate-800" />
          <span className="text-xs font-black text-slate-900 hidden md:inline">LOBBY</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl">🏎️</span>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tight text-slate-950 leading-none">
              PATTERN RACERS
            </h1>
            <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">
              Sequence & Function Grand Prix
            </span>
          </div>
        </div>

        {/* Round Badge */}
        <div className="px-2.5 py-1 rounded-lg bg-amber-400 border-2 border-slate-900 text-slate-950 font-black text-xs shadow-[2px_2px_0px_#000000]">
          ROUND {currentRound} / 5
        </div>
      </div>

      {/* ── Center: Team Live Scores ── */}
      <div className="flex items-center gap-4">
        {/* Blue Team Score */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border-2 border-blue-500 rounded-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-black text-blue-900 font-mono">{blueScore} PTS</span>
        </div>

        <span className="text-xs font-black text-slate-400">VS</span>

        {/* Red Team Score */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border-2 border-red-500 rounded-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-xs font-black text-red-900 font-mono">{redScore} PTS</span>
        </div>
      </div>

      {/* ── Right: Pacing Switcher & Audio Controls ── */}
      <div className="flex items-center gap-2">
        {/* Question Pacing */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-lg border-2 border-slate-300">
          {([5, 10, 15, 20] as const).map((cnt) => (
            <button
              key={`pacing-${cnt}`}
              onClick={() => setQuestionCount(cnt)}
              className={`px-2 py-0.5 rounded font-black text-[10px] transition cursor-pointer ${
                questionCountConfig === cnt
                  ? 'bg-amber-400 text-slate-950 border border-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {cnt}Q
            </button>
          ))}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 shadow-[2px_2px_0px_#000000] active:scale-95 transition cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
        </button>
      </div>
    </header>
  );
};
