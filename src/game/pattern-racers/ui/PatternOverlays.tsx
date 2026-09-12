// ============================================================
// PATTERN RACERS — Match Overlays, Final Race Gantry & Winner Podium
// - Intro Match Briefing & Pacing Selector
// - Starting Lights Countdown Sequence
// - Sudden Death 15-Second Speed Duel
// - Victory Podium & Championship Certificate Export
// ============================================================

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatternStore } from '../store/patternStore';
import { ChampionshipCertificateModal } from '@/components/shared/ChampionshipCertificateModal';
import {
  Trophy,
  Play,
  RotateCcw,
  Home,
  Printer,
  Sparkles,
  Zap,
  Timer,
  CheckCircle2,
} from 'lucide-react';

export const PatternOverlays: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const startMatch = usePatternStore((s) => s.startMatch);
  const restartGame = usePatternStore((s) => s.restartGame);
  const raceLights = usePatternStore((s) => s.raceLights);
  const raceWinner = usePatternStore((s) => s.raceWinner);
  const blueTeam = usePatternStore((s) => s.blueTeam);
  const redTeam = usePatternStore((s) => s.redTeam);
  const questionCountConfig = usePatternStore((s) => s.questionCountConfig);
  const setQuestionCount = usePatternStore((s) => s.setQuestionCount);

  const [showCertificate, setShowCertificate] = useState(false);

  const winningTeam =
    raceWinner === 'red' ? redTeam : raceWinner === 'blue' ? blueTeam : blueTeam.score >= redTeam.score ? blueTeam : redTeam;
  const losingTeam = winningTeam.id === 'blue' ? redTeam : blueTeam;

  return (
    <>
      <AnimatePresence>
        {/* ── 1. PRE-MATCH INTRO & PACING BRIEFING ── */}
        {phase === 'intro' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl p-6 sm:p-8 bg-white border-4 border-slate-900 rounded-3xl shadow-[10px_10px_0px_#000000] text-slate-950 text-center flex flex-col gap-4"
            >
              {/* Header Badge */}
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 border-2 border-slate-900 text-slate-950 font-black text-xs uppercase tracking-widest mx-auto shadow-[2px_2px_0px_#000000]">
                <span>🏎️</span>
                <span>GRADE 6 MATHEMATICAL GRAND PRIX</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950">
                PATTERN RACERS
              </h2>

              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed max-w-md mx-auto">
                Discover arithmetic sequence patterns, manipulate mechanical sequence builders, and operate physical 3D function machines to build the racetrack and power your team to victory!
              </p>

              {/* 5 Physical Rounds Summary */}
              <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-slate-100 border-2 border-slate-300 text-[10px] font-black uppercase">
                <div className="p-1 rounded bg-white border border-slate-300">1. STEP DIAL</div>
                <div className="p-1 rounded bg-white border border-slate-300">2. BUILDER</div>
                <div className="p-1 rounded bg-white border border-slate-300">3. MACHINE</div>
                <div className="p-1 rounded bg-white border border-slate-300">4. REPAIR</div>
                <div className="p-1 rounded bg-white border border-slate-300">5. RACE!</div>
              </div>

              {/* Question Pacing Selection */}
              <div className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-300">
                <span className="text-[10px] font-black uppercase text-slate-600 block mb-2">
                  SELECT MATCH PACING
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {([5, 10, 15, 20] as const).map((cnt) => (
                    <button
                      key={`intro-pacing-${cnt}`}
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-2 rounded-xl border-2 font-black text-xs transition cursor-pointer ${
                        questionCountConfig === cnt
                          ? 'bg-amber-400 text-slate-950 border-slate-900 shadow-[2px_2px_0px_#000000]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {cnt} QUESTIONS
                    </button>
                  ))}
                </div>
              </div>

              {/* Launch Match Button */}
              <button
                onClick={startMatch}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wider border-3 border-slate-900 shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>START QUALIFYING ROUNDS</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* ── 2. STARTING LIGHTS COUNTDOWN OVERLAY ── */}
        {phase === 'grand_prix_race' && (
          <div className="fixed top-18 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none select-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="px-6 py-3 bg-slate-950 border-4 border-slate-900 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              {raceLights.map((isLit, idx) => {
                const isGreen = idx === 4;
                const isYellow = idx === 3;
                const color = isGreen ? 'bg-emerald-500 shadow-emerald-500/80' : isYellow ? 'bg-amber-400 shadow-amber-400/80' : 'bg-red-600 shadow-red-600/80';
                return (
                  <div
                    key={`overlay-light-${idx}`}
                    className={`w-6 h-6 rounded-full border-2 border-black transition-all ${
                      isLit ? `${color} shadow-lg scale-110` : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </motion.div>
            <span className="text-xs font-black uppercase text-yellow-300 tracking-widest bg-black/80 px-3 py-1 rounded-full border border-yellow-400/40">
              {raceLights[4] ? '🟢 RACERS AWAY!' : '🔴 START GRID LOCKED'}
            </span>
          </div>
        )}

        {/* ── 3. CHAMPIONSHIP VICTORY PODIUM ── */}
        {phase === 'podium_ceremony' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md select-none pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-xl p-6 sm:p-8 bg-white border-4 border-slate-900 rounded-3xl shadow-[12px_12px_0px_#000000] text-slate-950 text-center flex flex-col gap-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-400 border-3 border-slate-900 flex items-center justify-center text-slate-950 shadow-[3px_3px_0px_#000000]">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-700">
                  CHAMPIONSHIP GRAND PRIX WINNER
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase text-slate-950 mt-1">
                  {raceWinner === 'tie' ? '🤝 DEADLOCK TIE!' : `🏆 ${winningTeam.name} WINS!`}
                </h2>
              </div>

              {/* Final Score Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 border-2 border-blue-500 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-blue-900 block">{blueTeam.name}</span>
                  <span className="text-xl font-mono font-black text-slate-950">{blueTeam.score} PTS</span>
                </div>
                <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-red-900 block">{redTeam.name}</span>
                  <span className="text-xl font-mono font-black text-slate-950">{redTeam.score} PTS</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => setShowCertificate(true)}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider border-3 border-slate-900 shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <Trophy className="w-4 h-4" />
                  <span>🏆 PRINT CHAMPIONSHIP CERTIFICATE</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={restartGame}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase border-3 border-slate-900 shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>PLAY AGAIN</span>
                  </button>
                  <button
                    onClick={() => (window.location.href = '/')}
                    className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-950 font-black text-xs uppercase border-3 border-slate-900 shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                  >
                    <Home className="w-4 h-4" />
                    <span>ARCADE HUB</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 4. OFFICIAL CHAMPIONSHIP CERTIFICATE MODAL ── */}
      <ChampionshipCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        winnerName={winningTeam.name}
        winnerScore={winningTeam.score}
        gameTitle="Pattern Racers: Sequence & Function Grand Prix"
        topicTitle="Grade 6 Linear Sequences, Common Differences & Functions"
        runnerUpName={losingTeam.name}
        runnerUpScore={losingTeam.score}
      />
    </>
  );
};
