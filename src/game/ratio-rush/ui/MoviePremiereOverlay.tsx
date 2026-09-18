// ============================================================
// RATIO RUSH — MOVIE PREMIERE & CINEMATIC CLIMAX OVERLAY
// Displays the finished 20-30s cinematic film shoot dialogue,
// clapperboard snap, and the red carpet cinema premiere theater!
// ============================================================

import React, { useState, useEffect } from 'react';
import { useRatioStore } from '../store/ratioStore';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Film,
  Sparkles,
  Clapperboard,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Award,
} from 'lucide-react';

export const MoviePremiereOverlay: React.FC = () => {
  const router = useRouter();
  const isPremiereActive = useRatioStore((s) => s.isPremiereActive);
  const isFilmingActive = useRatioStore((s) => s.isFilmingActive);
  const winningTeam = useRatioStore((s) => s.winningTeam);
  const blueScore = useRatioStore((s) => s.blueTeam.score);
  const redScore = useRatioStore((s) => s.redTeam.score);
  const resetGame = useRatioStore((s) => s.resetGame);

  const [dialogueStep, setDialogueStep] = useState(0);

  const dialogues = [
    { speaker: 'DIRECTOR', text: '“Quiet on set... Camera speed, sound rolling... ACTION!”', color: 'text-amber-400' },
    { speaker: 'HERO', text: '“The Ratio Energy Matrix is locked at 16 : 9! We have full panoramic sensor focus!”', color: 'text-sky-400' },
    { speaker: 'INVENTOR', text: '“Chroma mix at 3 : 5 and scale model calculated to 2 meters! The Generator is fully charged!”', color: 'text-yellow-300' },
    { speaker: 'VILLAIN', text: '“No! My budget sabotage failed against your unit rate math!”', color: 'text-rose-400' },
    { speaker: 'DIRECTOR', text: '“CUT! Print that! That’s a wrap on a Grade 6 Mathematical Blockbuster!”', color: 'text-amber-400' },
  ];

  useEffect(() => {
    if (isFilmingActive && !isPremiereActive) {
      const interval = setInterval(() => {
        setDialogueStep((prev) => (prev < dialogues.length - 1 ? prev + 1 : prev));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isFilmingActive, isPremiereActive, dialogues.length]);

  if (!isFilmingActive && !isPremiereActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md select-none animate-fadeIn">
      {/* ── PHASE 1: ACTIVE FILMING DIALOGUE BANNER ── */}
      {isFilmingActive && !isPremiereActive && (
        <div className="w-full max-w-2xl bg-white/95 border-2 border-red-500 rounded-2xl p-4 shadow-2xl text-center flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-black uppercase tracking-widest animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            LIVE SHOOTING • SCENE 1 TAKE 1
          </div>

          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-amber-700">
            <Clapperboard className="w-5 h-5 text-amber-600" />
            <span>{dialogues[dialogueStep].speaker}</span>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-800 italic leading-relaxed px-4">
            {dialogues[dialogueStep].text}
          </p>
        </div>
      )}

      {/* ── PHASE 2: GRAND CINEMA PREMIERE SHOWCASE ── */}
      {isPremiereActive && (
        <div className="w-full max-w-3xl bg-white/95 border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4 animate-scaleUp">
          {/* Cinema Marquee Title */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-widest shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>HOLLYWOOD GRAND PREMIERE</span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-950 font-bank">
            {winningTeam === 'blue'
              ? 'BLUE STUDIO PRODUCTIONS PRESENTS'
              : winningTeam === 'red'
              ? 'RED STUDIO PRODUCTIONS PRESENTS'
              : 'SKILLIZEE CINEMA DUEL TIED PREMIERE'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg">
            Outstanding filmmaking! All 5 mathematical ratio, rate & proportion challenges were solved with studio perfection!
          </p>

          {/* Scores Showcase */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md my-1">
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-300 flex flex-col items-center">
              <div className="text-[10px] font-black uppercase tracking-wider text-sky-800">
                Blue Studio Crew
              </div>
              <div className="text-2xl font-black font-mono text-sky-950 mt-1">
                {blueScore} PTS
              </div>
              {winningTeam === 'blue' && (
                <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-700">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> WINNER
                </div>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-red-50 border border-red-300 flex flex-col items-center">
              <div className="text-[10px] font-black uppercase tracking-wider text-red-800">
                Red Studio Crew
              </div>
              <div className="text-2xl font-black font-mono text-red-950 mt-1">
                {redScore} PTS
              </div>
              {winningTeam === 'red' && (
                <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-700">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> WINNER
                </div>
              )}
            </div>
          </div>

          {/* 5 Solved Ratio Milestones */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-emerald-800 font-bold">
            <span className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 16:9 Framing (800mm)
            </span>
            <span className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 3:5 Chroma Mix (15L)
            </span>
            <span className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 1:5 Slow-Mo (20s)
            </span>
            <span className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 1:30 Scale Prop (2m)
            </span>
            <span className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 4:3 VFX Split ($40k)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={resetGame}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> PLAY AGAIN
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> ARCADE LOBBY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
