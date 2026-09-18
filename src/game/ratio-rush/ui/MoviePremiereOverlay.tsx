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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none animate-fadeIn">
      {/* ── PHASE 1: ACTIVE FILMING DIALOGUE BANNER ── */}
      {isFilmingActive && !isPremiereActive && (
        <div className="w-full max-w-2xl bg-white border-4 border-black rounded-2xl p-5 shadow-[8px_8px_0px_#000000] text-center flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-md bg-yellow-400 border-2 border-black text-black text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_#000000] animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-black" />
            LIVE SHOOTING • SCENE 1 TAKE 1
          </div>

          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black">
            <Clapperboard className="w-5 h-5 text-black stroke-[2.5]" />
            <span>{dialogues[dialogueStep].speaker}</span>
          </div>

          <p className="text-base sm:text-lg font-black text-black italic leading-relaxed px-4">
            {dialogues[dialogueStep].text}
          </p>
        </div>
      )}

      {/* ── PHASE 2: GRAND CINEMA PREMIERE SHOWCASE ── */}
      {isPremiereActive && (
        <div className="w-full max-w-3xl bg-white border-4 border-black rounded-3xl p-6 shadow-[10px_10px_0px_#000000] text-center flex flex-col items-center gap-4 animate-scaleUp">
          {/* Cinema Marquee Title */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-yellow-400 border-2 border-black text-black text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_#000000]">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>HOLLYWOOD GRAND PREMIERE</span>
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-black font-bank">
            {winningTeam === 'blue'
              ? 'BLUE STUDIO PRODUCTIONS PRESENTS'
              : winningTeam === 'red'
              ? 'RED STUDIO PRODUCTIONS PRESENTS'
              : 'SKILLIZEE CINEMA DUEL TIED PREMIERE'}
          </h1>

          <p className="text-xs sm:text-sm text-black font-extrabold max-w-lg">
            Outstanding filmmaking! All 5 mathematical ratio, rate & proportion challenges were solved with studio perfection!
          </p>

          {/* Scores Showcase */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md my-1">
            <div className="p-3.5 rounded-2xl bg-blue-100 border-3 border-black shadow-[3px_3px_0px_#000000] flex flex-col items-center">
              <div className="text-[11px] font-black uppercase tracking-wider text-black">
                Blue Studio Crew
              </div>
              <div className="text-2xl font-black font-mono text-black mt-1">
                {blueScore} PTS
              </div>
              {winningTeam === 'blue' && (
                <div className="mt-1 flex items-center gap-1 text-xs font-black text-black bg-yellow-400 px-2 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0px_#000000]">
                  <Award className="w-3.5 h-3.5 stroke-[2.5]" /> WINNER
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-red-100 border-3 border-black shadow-[3px_3px_0px_#000000] flex flex-col items-center">
              <div className="text-[11px] font-black uppercase tracking-wider text-black">
                Red Studio Crew
              </div>
              <div className="text-2xl font-black font-mono text-black mt-1">
                {redScore} PTS
              </div>
              {winningTeam === 'red' && (
                <div className="mt-1 flex items-center gap-1 text-xs font-black text-black bg-yellow-400 px-2 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0px_#000000]">
                  <Award className="w-3.5 h-3.5 stroke-[2.5]" /> WINNER
                </div>
              )}
            </div>
          </div>

          {/* 5 Solved Ratio Milestones */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-black font-black">
            <span className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3]" /> 2:3 Shots (9 Wide)
            </span>
            <span className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3]" /> 1:3 Chroma Mix (4 Cups)
            </span>
            <span className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3]" /> 1:4 Slow-Mo (12s)
            </span>
            <span className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3]" /> 1:10 Prop (50cm)
            </span>
            <span className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3]" /> 2:1 Budget ($20 Actors)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={resetGame}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 border-3 border-black text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_#000000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" /> PLAY AGAIN
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-yellow-200 border-3 border-black text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_#000000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> ARCADE LOBBY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
