// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Activity Flow & Experiment Modals
// Clean, warm, porcelain carnival modals for:
// - Physical Attraction Intro
// - Observation & Reasoning (Theoretical vs Actual Draw)
// - 10-Trial Experimental vs Theoretical Comparison
// - Attraction Victory & Star Rewards
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { ATTRACTIONS_META } from '../engine/probabilityData';
import { MathFractionDisplay } from './TeamOperatorConsole';
import { Play, RotateCcw, Award, CheckCircle2, ArrowRight, Star, Sparkles, MapPin, BarChart3, Trophy } from 'lucide-react';

export const ActivityFlowOverlays: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);
  const batchTrialResults = useCarnivalStore((s) => s.batchTrialResults);
  const startPredicting = useCarnivalStore((s) => s.startPredicting);
  const runBatchTrials = useCarnivalStore((s) => s.runBatchTrials);
  const nextChallengeOrComplete = useCarnivalStore((s) => s.nextChallengeOrComplete);
  const returnToHub = useCarnivalStore((s) => s.returnToHub);

  if (activeActivity === 'hub') return null;
  const meta = ATTRACTIONS_META[activeActivity];

  return (
    <AnimatePresence>
      {/* ── 1. Attraction Intro Modal ── */}
      {phase === 'intro' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs select-none pointer-events-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white to-amber-50/95 border-3 border-amber-400 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center text-slate-900"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-amber-600 flex items-center justify-center text-slate-950 shadow-md mb-3">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-950 tracking-wide">
              {meta.name}
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-amber-700 mt-0.5">
              {meta.tagline}
            </p>
            <p className="text-sm text-slate-700 mt-3 leading-relaxed">
              {meta.description}
            </p>

            {/* Ready to Operate Button */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={returnToHub}
                className="py-3 px-5 rounded-2xl border-2 border-slate-300 hover:bg-slate-100 font-black text-xs text-slate-700 transition cursor-pointer"
              >
                CARNIVAL MAP
              </button>
              <button
                onClick={startPredicting}
                className="py-3 px-7 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-105 border-2 border-amber-600 font-black text-sm text-slate-950 shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>START PREDICTION</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 2. Observation & Reasoning Overlay ── */}
      {phase === 'observation' && activeChallenge && (
        <div className="fixed top-20 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-xl w-full select-none pointer-events-auto">
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-amber-400 shadow-2xl text-center text-slate-900"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                PHYSICAL EXPERIMENT COMPLETED
              </span>
            </div>

            {/* Outcome Announcement */}
            <div className="flex items-center justify-center gap-6 my-2 p-3 rounded-2xl bg-amber-50 border border-amber-300">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 block">THEORETICAL PROBABILITY</span>
                <MathFractionDisplay fraction={activeChallenge.setup.theoreticalFraction} />
              </div>
              <div className="w-px h-8 bg-amber-300" />
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 block">RANDOM DRAW OUTCOME</span>
                <div className="flex items-center gap-1.5 justify-center mt-1">
                  <div
                    className="w-4 h-4 rounded-full border border-slate-400 shadow-xs"
                    style={{ backgroundColor: drawnOutcome?.color || '#dc2626' }}
                  />
                  <span className="text-base font-black text-slate-900">{drawnOutcome?.colorName}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-snug my-2">
              {activeChallenge.explanation}
            </p>

            {/* Action Buttons: 10 Trials Batch OR Next Challenge */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-slate-200">
              <button
                onClick={() => runBatchTrials(10)}
                className="py-2.5 px-4 rounded-xl bg-blue-50 border-2 border-blue-400 text-blue-900 font-black text-xs hover:bg-blue-100 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>RUN 10 TRIALS</span>
              </button>
              <button
                onClick={nextChallengeOrComplete}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 border-2 border-amber-600 text-slate-950 font-black text-xs hover:brightness-105 shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 3. 10-Trial Experimental Results Modal ── */}
      {phase === 'batch-trials' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs select-none pointer-events-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg p-6 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-amber-400 shadow-2xl text-center text-slate-900"
          >
            <h3 className="text-lg font-black uppercase text-slate-950 flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              <span>10 PHYSICAL TRIALS SIMULATION</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Here are the 10 consecutive random outcomes generated by this machine:
            </p>

            {/* Trial Balls Sequence */}
            <div className="flex items-center justify-center gap-2 flex-wrap my-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              {batchTrialResults.map((t) => (
                <div key={t.trialIndex} className="flex flex-col items-center">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: t.outcomeColor }}
                  />
                  <span className="text-[9px] font-mono font-bold text-slate-500 mt-0.5">#{t.trialIndex}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-slate-800 leading-relaxed my-3 text-left">
              <strong>Mathematical Insight:</strong> Did the 10 experimental trials produce the exact theoretical percentage? Not necessarily! With small sample sizes, random variation occurs. As you run more trials (e.g. 100 or 1,000), experimental probability approaches theoretical probability!
            </div>

            <button
              onClick={nextChallengeOrComplete}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 border-2 border-amber-600 font-black text-sm text-slate-950 shadow-lg hover:brightness-105 transition active:scale-95 cursor-pointer"
            >
              CONTINUE TO COMPLETION
            </button>
          </motion.div>
        </div>
      )}

      {/* ── 4. Attraction Complete & Stars Award Modal ── */}
      {phase === 'completed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm select-none pointer-events-auto">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white via-amber-50 to-amber-100 border-4 border-amber-400 shadow-[0_25px_60px_rgba(245,158,11,0.5)] text-center text-slate-900"
          >
            <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black uppercase text-slate-950 mt-2">
              {meta.name} MASTERED!
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-amber-700 mt-0.5">
              ATTRACTION ACTIVATED ON THE ISLAND
            </p>

            <div className="my-5 p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-amber-700">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <span className="text-sm font-black uppercase tracking-wider">+2 GOLD TICKETS AWARDED</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
            </div>

            <button
              onClick={returnToHub}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-105 border-2 border-amber-600 font-black text-sm text-slate-950 shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-slate-950" />
              <span>RETURN TO CARNIVAL ISLAND</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
