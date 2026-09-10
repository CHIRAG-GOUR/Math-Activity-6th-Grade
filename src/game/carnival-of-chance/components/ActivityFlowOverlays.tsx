// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Activity Flow & Modals
// Bold Carnival Yellow, Red, Black & White Modals:
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
import { Play, Award, CheckCircle2, ArrowRight, Star, MapPin, BarChart3, Trophy } from 'lucide-react';

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
  const questionCountConfig = useCarnivalStore((s) => s.questionCountConfig);
  const setQuestionCount = useCarnivalStore((s) => s.setQuestionCount);

  if (activeActivity === 'hub') return null;
  const meta = ATTRACTIONS_META[activeActivity];

  return (
    <AnimatePresence>
      {/* ── 1. Attraction Intro Modal ── */}
      {phase === 'intro' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none pointer-events-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg p-5 sm:p-7 rounded-2xl bg-[#fef08a] border-4 border-black shadow-[8px_8px_0px_#000000] text-center text-black"
          >
            {/* Header Badge */}
            <div className="w-14 h-14 mx-auto rounded-xl bg-red-600 border-3 border-black flex items-center justify-center text-yellow-300 shadow-[3px_3px_0px_#000000] mb-3">
              <Award className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="inline-block px-4 py-1 rounded-xl bg-red-600 border-3 border-black shadow-[3px_3px_0px_#000000] mb-2">
              <h2 className="text-lg sm:text-xl font-black uppercase text-yellow-300 tracking-wide">
                {meta.name}
              </h2>
            </div>
            
            <p className="text-xs font-black uppercase tracking-widest text-red-700">
              {meta.tagline}
            </p>

            {/* Description Box */}
            <div className="mt-3 p-3 rounded-xl bg-white border-3 border-black shadow-[3px_3px_0px_#000000] text-left">
              <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                {meta.description}
              </p>
            </div>

            {/* 5, 10, 15, 20 Questions Selector */}
            <div className="mt-3 p-3 rounded-xl bg-yellow-200 border-3 border-black shadow-[3px_3px_0px_#000000] text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block mb-1.5">
                SELECT ACTIVITY LENGTH:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {([5, 10, 15, 20] as const).map((qCount) => (
                  <button
                    key={qCount}
                    type="button"
                    onClick={() => setQuestionCount(qCount)}
                    className={`py-1.5 rounded-lg border-2 border-black font-black text-xs transition-all cursor-pointer ${
                      questionCountConfig === qCount
                        ? 'bg-red-600 text-yellow-300 shadow-[2px_2px_0px_#000000] scale-105'
                        : 'bg-white text-black hover:bg-yellow-100 shadow-[1px_1px_0px_#000000]'
                    }`}
                  >
                    {qCount} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Ready to Operate Action Buttons */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={returnToHub}
                className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-black border-3 border-black font-black text-xs shadow-[3px_3px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer active:scale-95"
              >
                CARNIVAL MAP
              </button>
              <button
                onClick={startPredicting}
                className="py-2.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-yellow-300 border-3 border-black font-black text-sm shadow-[4px_4px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span>START PREDICTION</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 2. Observation & Reasoning Overlay ── */}
      {phase === 'observation' && activeChallenge && (
        <div className="fixed top-18 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-xl w-full select-none pointer-events-auto">
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="p-4 sm:p-5 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_#000000] text-center text-black"
          >
            {/* Observation Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-600 border-2 border-black text-yellow-300 mb-2.5 shadow-[2px_2px_0px_#000000]">
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span className="text-[11px] font-black uppercase tracking-wider">
                PHYSICAL EXPERIMENT COMPLETED
              </span>
            </div>

            {/* Outcome Comparison Dual Cards */}
            <div className="grid grid-cols-2 gap-3 my-2 text-left">
              {/* Left: Theoretical */}
              <div className="p-2.5 rounded-xl bg-yellow-100 border-3 border-black shadow-[3px_3px_0px_#000000] flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-red-700 block mb-1">
                  THEORETICAL PROBABILITY
                </span>
                <MathFractionDisplay fraction={activeChallenge.setup.theoreticalFraction} large />
              </div>

              {/* Right: Random Outcome */}
              <div className="p-2.5 rounded-xl bg-red-100 border-3 border-black shadow-[3px_3px_0px_#000000] flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-red-700 block mb-1">
                  PHYSICAL DRAW OUTCOME
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-black shadow-xs shrink-0"
                    style={{ backgroundColor: drawnOutcome?.color || '#dc2626' }}
                  />
                  <span className="text-sm sm:text-base font-black text-black uppercase truncate">
                    {drawnOutcome?.colorName}
                  </span>
                </div>
              </div>
            </div>

            {/* Mathematical Explanation Box */}
            <div className="p-2.5 rounded-xl bg-[#fef08a] border-3 border-black shadow-[2px_2px_0px_#000000] text-left text-xs font-bold text-black leading-snug my-2">
              {activeChallenge.explanation}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2.5 mt-3 pt-2 border-t-2 border-black/20">
              <button
                onClick={() => runBatchTrials(10)}
                className="py-2 px-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black border-3 border-black font-black text-xs shadow-[3px_3px_0px_#000000] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 stroke-[2.5]" />
                <span>RUN 10 TRIALS</span>
              </button>
              <button
                onClick={nextChallengeOrComplete}
                className="py-2 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-yellow-300 border-3 border-black font-black text-xs shadow-[3px_3px_0px_#000000] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 3. 10-Trial Experimental Results Modal ── */}
      {phase === 'batch-trials' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none pointer-events-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg p-5 sm:p-6 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_#000000] text-center text-black"
          >
            <div className="inline-block px-4 py-1 rounded-xl bg-red-600 border-3 border-black shadow-[3px_3px_0px_#000000] mb-2">
              <h3 className="text-sm sm:text-base font-black uppercase text-yellow-300 flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4 text-yellow-300 stroke-[2.5]" />
                <span>10 PHYSICAL TRIALS SIMULATION</span>
              </h3>
            </div>
            
            <p className="text-xs font-bold text-slate-700 mb-3">
              Here are the 10 consecutive random outcomes generated by this machine:
            </p>

            {/* Trial Balls Sequence */}
            <div className="flex items-center justify-center gap-2 flex-wrap my-3 p-3 rounded-xl bg-yellow-100 border-3 border-black shadow-[3px_3px_0px_#000000]">
              {batchTrialResults.map((t) => (
                <div key={t.trialIndex} className="flex flex-col items-center">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-black shadow-xs"
                    style={{ backgroundColor: t.outcomeColor }}
                  />
                  <span className="text-[9px] font-mono font-black text-black mt-0.5">#{t.trialIndex}</span>
                </div>
              ))}
            </div>

            {/* Insight Card */}
            <div className="p-3 rounded-xl bg-[#fef08a] border-3 border-black shadow-[2px_2px_0px_#000000] text-xs text-black font-bold leading-relaxed my-3 text-left">
              <strong>Carnival Math Insight:</strong> Did the 10 experimental trials produce the exact theoretical percentage? With small sample sizes, random variations occur. As you run hundreds or thousands of trials, experimental probability gets closer and closer to theoretical probability!
            </div>

            <button
              onClick={nextChallengeOrComplete}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-yellow-300 border-3 border-black font-black text-sm shadow-[4px_4px_0px_#000000] transition active:scale-95 cursor-pointer"
            >
              CONTINUE TO COMPLETION
            </button>
          </motion.div>
        </div>
      )}

      {/* ── 4. Attraction Complete & Stars Award Modal ── */}
      {phase === 'completed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none pointer-events-auto">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="w-full max-w-md p-6 sm:p-7 rounded-2xl bg-[#fef08a] border-4 border-black shadow-[10px_10px_0px_#000000] text-center text-black"
          >
            <div className="w-16 h-16 mx-auto rounded-xl bg-red-600 border-3 border-black flex items-center justify-center text-yellow-300 shadow-[3px_3px_0px_#000000] mb-3">
              <Trophy className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="inline-block px-4 py-1.5 rounded-xl bg-red-600 border-3 border-black shadow-[3px_3px_0px_#000000] mb-1">
              <h2 className="text-xl font-black uppercase text-yellow-300">
                {meta.name} MASTERED!
              </h2>
            </div>
            
            <p className="text-xs font-black uppercase tracking-widest text-red-700 mt-1">
              ATTRACTION ACTIVATED ON THE ISLAND
            </p>

            <div className="my-4 p-3.5 rounded-xl bg-white border-3 border-black shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center justify-center gap-2 text-black font-black">
                <Star className="w-5 h-5 fill-yellow-400 text-black stroke-black stroke-[1.5]" />
                <span className="text-sm uppercase tracking-wider">+2 GOLD TICKETS AWARDED</span>
                <Star className="w-5 h-5 fill-yellow-400 text-black stroke-black stroke-[1.5]" />
              </div>
            </div>

            <button
              onClick={returnToHub}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-yellow-300 border-3 border-black font-black text-sm shadow-[4px_4px_0px_#000000] transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 stroke-[2.5]" />
              <span>RETURN TO CARNIVAL ISLAND</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

