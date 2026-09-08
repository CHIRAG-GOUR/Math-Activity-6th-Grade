// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Feedback & Modals
// Flow modals for:
// 1. Attraction Intro & Mission Rules
// 2. Observation & Reasoning (Theoretical vs Actual Draw)
// 3. 10-Trial Experimental Batch Comparison
// 4. Attraction Mastery & Gold Ticket Reward
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { CARNIVAL_THEME } from './tokens';
import { MathFractionDisplay } from './MathFraction';
import {
  Award,
  Play,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Trophy,
  Star,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const FeedbackBanner: React.FC = () => {
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
  const meta = CARNIVAL_THEME.activityAccents[activeActivity] || CARNIVAL_THEME.activityAccents.hub;

  return (
    <AnimatePresence>
      {/* ── 1. ATTRACTION INTRO MODAL ── */}
      {phase === 'intro' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none pointer-events-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg p-6 rounded-3xl bg-[#FFF8E7] border-4 border-[#111111] shadow-[8px_8px_0px_#111111] text-center text-[#111111]"
          >
            {/* Header Plaque */}
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E53935] border-3 border-[#111111] flex items-center justify-center text-[#FFC928] shadow-[3px_3px_0px_#111111] mb-3">
              <Award className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="inline-block px-5 py-1.5 rounded-2xl bg-[#E53935] border-3 border-[#111111] shadow-[3px_3px_0px_#111111] mb-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FFC928] tracking-wide">
                {meta.name}
              </h2>
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-[#E53935]">
              {meta.tagline}
            </p>

            {/* Description Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#FFFFFF] border-3 border-[#111111] shadow-[3px_3px_0px_#111111] text-left">
              <div className="text-[10px] font-black uppercase text-[#E53935] mb-1">
                ATTRACTION RULES & EXPERIMENT
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#111111] leading-relaxed">
                {meta.instruction}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={returnToHub}
                className={`py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 text-[#111111] border-3 border-[#111111] font-black text-xs shadow-[3px_3px_0px_#111111] ${CARNIVAL_THEME.pressPhysics} cursor-pointer`}
              >
                CARNIVAL MAP
              </button>
              <button
                onClick={startPredicting}
                className={`py-3 px-7 rounded-2xl bg-[#FFC928] hover:bg-[#FFE380] text-[#111111] border-3 border-[#111111] font-black text-sm shadow-[5px_5px_0px_#111111] ${CARNIVAL_THEME.pressPhysics} cursor-pointer flex items-center gap-2`}
              >
                <Play className="w-4 h-4 fill-[#111111] text-[#111111]" />
                <span>START PREDICTION</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 2. OBSERVATION & REASONING MODAL (CENTER STAGE) ── */}
      {phase === 'observation' && activeChallenge && (
        <div className="fixed top-24 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-xl w-full select-none pointer-events-auto">
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="p-5 sm:p-6 rounded-3xl bg-[#FFFFFF] border-4 border-[#111111] shadow-[10px_10px_0px_#111111] text-center text-[#111111]"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#2E9B57] border-3 border-[#111111] text-white mb-3 shadow-[3px_3px_0px_#111111]">
              <CheckCircle2 className="w-5 h-5 stroke-[3]" />
              <span className="text-xs font-black uppercase tracking-wider">
                PHYSICAL EXPERIMENT COMPLETED
              </span>
            </div>

            {/* Side-by-Side Comparison Panels */}
            <div className="grid grid-cols-2 gap-3 my-2 text-left">
              {/* Theoretical Probability */}
              <div className="p-3 rounded-2xl bg-[#FFF8E7] border-3 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-[#E53935] block mb-1">
                  THEORETICAL PROBABILITY
                </span>
                <MathFractionDisplay
                  fraction={activeChallenge.setup.theoreticalFraction}
                  size="lg"
                />
              </div>

              {/* Actual Random Draw Outcome */}
              <div className="p-3 rounded-2xl bg-[#FEE2E2] border-3 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-[#E53935] block mb-1">
                  PHYSICAL DRAW OUTCOME
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-6 h-6 rounded-full border-3 border-[#111111] shadow-xs shrink-0"
                    style={{ backgroundColor: drawnOutcome?.color || '#E53935' }}
                  />
                  <span className="text-base sm:text-lg font-black text-[#111111] uppercase truncate">
                    {drawnOutcome?.colorName}
                  </span>
                </div>
              </div>
            </div>

            {/* Mathematical Reasoning Box */}
            <div className="p-3 rounded-2xl bg-[#FFF8E7] border-3 border-[#111111] shadow-[2px_2px_0px_#111111] text-left text-xs font-bold text-[#111111] leading-relaxed my-3">
              {activeChallenge.explanation}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 mt-4 pt-2 border-t-2 border-[#111111]/20">
              <button
                onClick={() => runBatchTrials(10)}
                className={`py-2.5 px-4 rounded-xl bg-[#FFC928] hover:bg-[#FFE380] text-[#111111] border-3 border-[#111111] font-black text-xs shadow-[3px_3px_0px_#111111] ${CARNIVAL_THEME.pressPhysics} flex items-center gap-2 cursor-pointer`}
              >
                <BarChart3 className="w-4 h-4 stroke-[2.5]" />
                <span>RUN 10-TRIAL BATCH</span>
              </button>
              <button
                onClick={nextChallengeOrComplete}
                className={`py-2.5 px-6 rounded-xl bg-[#E53935] hover:bg-[#B71C1C] text-[#FFF8E7] border-3 border-[#111111] font-black text-xs shadow-[4px_4px_0px_#111111] ${CARNIVAL_THEME.pressPhysics} flex items-center gap-2 cursor-pointer`}
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 3. 10-TRIAL BATCH EXPERIMENT MODAL ── */}
      {phase === 'batch-trials' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none pointer-events-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg p-6 rounded-3xl bg-[#FFFFFF] border-4 border-[#111111] shadow-[10px_10px_0px_#111111] text-center text-[#111111]"
          >
            <div className="inline-block px-4 py-1.5 rounded-2xl bg-[#2463EB] border-3 border-[#111111] shadow-[3px_3px_0px_#111111] text-white mb-2">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4 stroke-[2.5]" />
                <span>10 PHYSICAL TRIALS SIMULATION</span>
              </h3>
            </div>

            <p className="text-xs font-bold text-[#111111]/80 mb-3">
              10 consecutive random outcomes drawn from this machine:
            </p>

            {/* Trial Balls Sequence */}
            <div className="flex items-center justify-center gap-2 flex-wrap my-3 p-3 rounded-2xl bg-[#FFF8E7] border-3 border-[#111111] shadow-[3px_3px_0px_#111111]">
              {batchTrialResults.map((t) => (
                <div key={t.trialIndex} className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full border-3 border-[#111111] shadow-xs"
                    style={{ backgroundColor: t.outcomeColor }}
                  />
                  <span className="text-[10px] font-mono font-black text-[#111111] mt-0.5">
                    #{t.trialIndex}
                  </span>
                </div>
              ))}
            </div>

            {/* Mathematical Law of Large Numbers Insight */}
            <div className="p-3.5 rounded-2xl bg-[#FFFDF6] border-3 border-[#111111] shadow-[2px_2px_0px_#111111] text-xs text-[#111111] font-bold leading-relaxed my-3 text-left">
              <strong>Carnival Math Insight:</strong> Did the 10 experimental trials produce the exact theoretical percentage? With small sample sizes, random fluctuations occur. As you run hundreds or thousands of trials, experimental probability gets closer and closer to the exact theoretical probability!
            </div>

            <button
              onClick={nextChallengeOrComplete}
              className={`w-full py-3 rounded-2xl bg-[#E53935] hover:bg-[#B71C1C] text-[#FFF8E7] border-3 border-[#111111] font-black text-sm shadow-[5px_5px_0px_#111111] ${CARNIVAL_THEME.pressPhysics} cursor-pointer`}
            >
              CONTINUE TO COMPLETION
            </button>
          </motion.div>
        </div>
      )}

      {/* ── 4. ATTRACTION MASTERED & GOLD TICKETS AWARD ── */}
      {phase === 'completed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none pointer-events-auto">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#FFF8E7] border-4 border-[#111111] shadow-[12px_12px_0px_#111111] text-center text-[#111111]"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFC928] border-3 border-[#111111] flex items-center justify-center text-[#111111] shadow-[4px_4px_0px_#111111] mb-3 animate-bounce">
              <Trophy className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="inline-block px-4 py-1.5 rounded-2xl bg-[#E53935] border-3 border-[#111111] shadow-[3px_3px_0px_#111111] mb-1">
              <h2 className="text-xl font-black uppercase text-[#FFC928]">
                {meta.name} MASTERED!
              </h2>
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-[#E53935] mt-1">
              ATTRACTION ACTIVATED ON THE ISLAND
            </p>

            <div className="my-5 p-4 rounded-2xl bg-white border-3 border-[#111111] shadow-[4px_4px_0px_#111111]">
              <div className="flex items-center justify-center gap-2 text-[#111111] font-black">
                <Star className="w-5 h-5 fill-[#FFC928] text-[#111111] stroke-[2]" />
                <span className="text-sm uppercase tracking-wider">+2 GOLD TICKETS AWARDED</span>
                <Star className="w-5 h-5 fill-[#FFC928] text-[#111111] stroke-[2]" />
              </div>
            </div>

            <button
              onClick={returnToHub}
              className={`w-full py-3.5 rounded-2xl bg-[#FFC928] hover:bg-[#FFE380] text-[#111111] border-3 border-[#111111] font-black text-sm shadow-[5px_5px_0px_#111111] ${CARNIVAL_THEME.pressPhysics} cursor-pointer flex items-center justify-center gap-2`}
            >
              <MapPin className="w-5 h-5 stroke-[2.5]" />
              <span>RETURN TO CARNIVAL ISLAND</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
