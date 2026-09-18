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

  const stageWinners = useRatioStore((s) => s.stageWinners);
  const blueScenesWon = useRatioStore((s) => s.blueScenesWon);
  const redScenesWon = useRatioStore((s) => s.redScenesWon);

  const [dialogueStep, setDialogueStep] = useState(0);

  const dialogues = [
    { speaker: 'DIRECTOR', text: '“Quiet on set... Camera speed, sound rolling... ACTION!”', color: 'text-amber-400' },
    { speaker: 'HERO', text: '“The Ratio Energy Matrix is locked at 16 : 9! We have full panoramic sensor focus!”', color: 'text-sky-400' },
    { speaker: 'INVENTOR', text: '“Chroma mix at 1 : 3 and scale model calculated to 50cm! The Generator is fully charged!”', color: 'text-yellow-300' },
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
            <span>HOLLYWOOD GRAND PREMIERE • CO-OP MOVIE WRAP</span>
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Winner Banner with Contribution Score (e.g. 3-2, 4-1, 5-0) */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-black font-bank">
              {winningTeam === 'blue'
                ? `🏆 BLUE STUDIO WINS ${blueScenesWon} - ${redScenesWon}! 🎬`
                : winningTeam === 'red'
                ? `🏆 RED STUDIO WINS ${redScenesWon} - ${blueScenesWon}! 🎬`
                : `🎬 TIED CO-DIRECTORS ${blueScenesWon} - ${redScenesWon}! 🎬`}
            </h1>
            <p className="text-xs sm:text-sm font-black text-black max-w-lg">
              {winningTeam === 'blue'
                ? `Blue Studio contributed ${blueScenesWon} out of 5 scenes to co-produce the blockbuster!`
                : winningTeam === 'red'
                ? `Red Studio contributed ${redScenesWon} out of 5 scenes to co-produce the blockbuster!`
                : `Both studios equally contributed to creating this Grade 6 Mathematical Blockbuster!`}
            </p>
          </div>

          {/* Scene-by-Scene Production Breakdown */}
          <div className="w-full max-w-xl bg-yellow-50 border-3 border-black rounded-2xl p-3 shadow-[4px_4px_0px_#000000]">
            <div className="text-[11px] font-black uppercase tracking-widest text-black mb-2 flex items-center justify-between px-1">
              <span>5-SCENE MOVIE BREAKDOWN</span>
              <span className="font-mono">BLUE: {blueScenesWon} 🎬 {redScenesWon} :RED</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { stage: 1, name: '2:3 Shots' },
                { stage: 2, name: '1:3 Paint' },
                { stage: 3, name: '1:4 Slow-Mo' },
                { stage: 4, name: '1:10 Prop' },
                { stage: 5, name: '2:1 Budget' },
              ].map((s, idx) => {
                const winner = stageWinners[idx];
                return (
                  <div
                    key={s.stage}
                    className={`p-2 rounded-xl border-2 border-black flex flex-col items-center text-center shadow-[2px_2px_0px_#000000] ${
                      winner === 'blue'
                        ? 'bg-blue-200'
                        : winner === 'red'
                        ? 'bg-red-200'
                        : 'bg-yellow-100'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-black">
                      Scene {s.stage}
                    </span>
                    <span className="text-[9px] font-extrabold text-black/80 truncate w-full">
                      {s.name}
                    </span>
                    <div
                      className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase border border-black shadow-[1px_1px_0px_#000000] ${
                        winner === 'blue'
                          ? 'bg-blue-500 text-white'
                          : winner === 'red'
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-300 text-black'
                      }`}
                    >
                      {winner ? `${winner.toUpperCase()}` : 'CO-OP'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Studio Scores */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md my-1">
            <div
              className={`p-3.5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_#000000] flex flex-col items-center ${
                winningTeam === 'blue' ? 'bg-blue-200 ring-2 ring-blue-500' : 'bg-blue-50'
              }`}
            >
              <div className="text-[11px] font-black uppercase tracking-wider text-black">
                Blue Studio Crew
              </div>
              <div className="text-2xl font-black font-mono text-black mt-0.5">
                {blueScore} PTS
              </div>
              <div className="text-[10.5px] font-black text-black mt-0.5">
                🎬 {blueScenesWon} / 5 Scenes
              </div>
              {winningTeam === 'blue' && (
                <div className="mt-1.5 flex items-center gap-1 text-xs font-black text-black bg-yellow-400 px-2.5 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0px_#000000]">
                  <Award className="w-3.5 h-3.5 stroke-[2.5]" /> DIRECTING TROPHY
                </div>
              )}
            </div>

            <div
              className={`p-3.5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_#000000] flex flex-col items-center ${
                winningTeam === 'red' ? 'bg-red-200 ring-2 ring-red-500' : 'bg-red-50'
              }`}
            >
              <div className="text-[11px] font-black uppercase tracking-wider text-black">
                Red Studio Crew
              </div>
              <div className="text-2xl font-black font-mono text-black mt-0.5">
                {redScore} PTS
              </div>
              <div className="text-[10.5px] font-black text-black mt-0.5">
                🎬 {redScenesWon} / 5 Scenes
              </div>
              {winningTeam === 'red' && (
                <div className="mt-1.5 flex items-center gap-1 text-xs font-black text-black bg-yellow-400 px-2.5 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0px_#000000]">
                  <Award className="w-3.5 h-3.5 stroke-[2.5]" /> DIRECTING TROPHY
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={resetGame}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 border-3 border-black text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_#000000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" /> SHOOT NEXT MOVIE
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
