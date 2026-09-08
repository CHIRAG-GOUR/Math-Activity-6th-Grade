// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST OBSERVATION & REWARD MODALS
// Dead-Center Positioning, Guaranteed Zero Side-Console Overlap
// Strict Neubrutalist Palette: Yellow with Black, Red with White & Black
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { CARNIVAL_THEME } from './tokens';
import { MathFractionDisplay } from './MathFraction';
import {
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Trophy,
  Star,
  MapPin,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const FeedbackBanner: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);
  const batchTrialResults = useCarnivalStore((s) => s.batchTrialResults);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);
  const activityWinner = useCarnivalStore((s) => s.activityWinner);
  const runBatchTrials = useCarnivalStore((s) => s.runBatchTrials);
  const nextChallengeOrComplete = useCarnivalStore((s) => s.nextChallengeOrComplete);
  const restartCurrentActivity = useCarnivalStore((s) => s.restartCurrentActivity);
  const returnToHub = useCarnivalStore((s) => s.returnToHub);

  if (activeActivity === 'hub') return null;
  const meta = CARNIVAL_THEME.activityAccents[activeActivity] || CARNIVAL_THEME.activityAccents.hub;
  const isRightAnswer =
    blueTeam.lastResult === 'correct' ||
    redTeam.lastResult === 'correct' ||
    (drawnOutcome &&
      activeChallenge?.setup.targetColor &&
      drawnOutcome.color === activeChallenge.setup.targetColor);

  return (
    <AnimatePresence>
      {/* ── 1. OBSERVATION & REASONING CARD (Exact Center of Screen) ── */}
      {phase === 'observation' && activeChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none select-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{
              backgroundColor: isRightAnswer ? '#00F0A8' : '#FF2A6D',
              border: '5px solid #000000',
              boxShadow: '8px 8px 0px #000000',
              borderRadius: '24px',
              color: isRightAnswer ? '#000000' : '#FFFFFF',
            }}
            className="pointer-events-auto max-w-lg w-full p-5 sm:p-6 text-center"
          >
            {/* Header Stamp (Black with Green or Red) */}
            <div
              style={{
                backgroundColor: '#000000',
                border: '3px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                borderRadius: '10px',
                color: isRightAnswer ? '#00F0A8' : '#FF2A6D',
              }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 font-black text-xs uppercase tracking-wider"
            >
              <CheckCircle2
                className={`w-4 h-4 stroke-[3.5] ${
                  isRightAnswer ? 'text-[#00F0A8]' : 'text-[#FF2A6D]'
                }`}
              />
              <span>
                {isRightAnswer
                  ? '🎉 PREDICTION CORRECT! (+POINTS)'
                  : '❌ PREDICTION INCORRECT!'}
              </span>
            </div>

            {/* Side-by-Side Comparison Panels */}
            <div className="grid grid-cols-2 gap-3 my-2 text-left">
              {/* Theoretical Probability */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #000000',
                  boxShadow: '3px 3px 0px #000000',
                  borderRadius: '14px',
                  color: '#000000',
                }}
                className="p-3 flex flex-col justify-between"
              >
                <span className="text-[10px] font-black uppercase text-black block mb-1">
                  THEORETICAL PROBABILITY
                </span>
                <MathFractionDisplay
                  fraction={activeChallenge.setup.theoreticalFraction}
                  size="md"
                />
              </div>

              {/* Actual Random Outcome */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #000000',
                  boxShadow: '3px 3px 0px #000000',
                  borderRadius: '14px',
                  color: '#000000',
                }}
                className="p-3 flex flex-col justify-between"
              >
                <span className="text-[10px] font-black uppercase text-black block mb-1">
                  PHYSICAL DRAW OUTCOME
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-7 h-7 rounded-full border-[3px] border-black shadow-xs shrink-0"
                    style={{ backgroundColor: drawnOutcome?.color || '#FF2A6D' }}
                  />
                  <span className="text-sm sm:text-base font-black text-black uppercase truncate">
                    {drawnOutcome?.colorName || 'Result'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mathematical Reasoning Narration Box */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '3px solid #000000',
                boxShadow: '2px 2px 0px #000000',
                borderRadius: '14px',
                color: '#000000',
              }}
              className="p-3 text-left text-xs font-bold leading-relaxed my-3"
            >
              {activeChallenge.explanation}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 mt-4 pt-2 border-t-2 border-black">
              <button
                onClick={() => runBatchTrials(10)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '3.5px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  borderRadius: '14px',
                  color: '#000000',
                }}
                className="py-2.5 px-4 font-black text-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <BarChart3 className="w-4 h-4 stroke-[3]" />
                <span>RUN 10-TRIAL BATCH</span>
              </button>
              <button
                onClick={nextChallengeOrComplete}
                style={{
                  backgroundColor: isRightAnswer ? '#000000' : '#FFFFFF',
                  border: '3.5px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  borderRadius: '14px',
                  color: isRightAnswer ? '#00F0A8' : '#000000',
                }}
                className="py-2.5 px-6 font-black text-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <span className="font-black uppercase tracking-wider">CONTINUE</span>
                <ArrowRight className="w-4 h-4 stroke-[3.5]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 2. 10-TRIAL BATCH EXPERIMENT MODAL (Exact Center) ── */}
      {phase === 'batch-trials' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none select-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: '#FED500',
              border: '5px solid #000000',
              boxShadow: '8px 8px 0px #000000',
              borderRadius: '24px',
              color: '#000000',
            }}
            className="pointer-events-auto max-w-lg w-full p-6 text-center"
          >
            <div
              style={{
                backgroundColor: '#FF2A6D',
                border: '3px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                borderRadius: '10px',
                color: '#FFFFFF',
              }}
              className="inline-block px-4 py-1.5 mb-2 font-black text-xs sm:text-sm uppercase tracking-wider"
            >
              <h3 className="flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4 stroke-[3]" />
                <span>10 PHYSICAL TRIALS SIMULATION</span>
              </h3>
            </div>

            <p className="text-xs font-bold text-black mb-3">
              10 consecutive random outcomes drawn from this machine:
            </p>

            {/* Trial Balls Sequence */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '3px solid #000000',
                borderRadius: '14px',
              }}
              className="flex items-center justify-center gap-2 flex-wrap my-3 p-3"
            >
              {batchTrialResults.map((t) => (
                <div key={t.trialIndex} className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full border-[2.5px] border-black shadow-xs"
                    style={{ backgroundColor: t.outcomeColor }}
                  />
                  <span className="text-[10px] font-mono font-black text-black mt-0.5">
                    #{t.trialIndex}
                  </span>
                </div>
              ))}
            </div>

            {/* Law of Large Numbers Insight */}
            <div
              style={{
                backgroundColor: '#FFF7E5',
                border: '3px solid #000000',
                boxShadow: '2px 2px 0px #000000',
                borderRadius: '14px',
                color: '#000000',
              }}
              className="p-3 text-xs text-black font-bold leading-relaxed my-3 text-left"
            >
              <strong>Carnival Math Insight:</strong> Did the 10 experimental trials match the theoretical fraction? With small sample sizes, random fluctuations occur. As more trials are run, the experimental frequency converges toward the exact theoretical probability!
            </div>

            <button
              onClick={nextChallengeOrComplete}
              style={{
                backgroundColor: '#FF2A6D',
                border: '4px solid #000000',
                boxShadow: '5px 5px 0px #000000',
                borderRadius: '16px',
                color: '#FFFFFF',
              }}
              className="w-full py-3 font-black text-sm uppercase tracking-wider cursor-pointer active:scale-95 transition-transform"
            >
              CONTINUE TO FINAL SCORES
            </button>
          </motion.div>
        </div>
      )}

      {/* ── 3. ATTRACTION WINNER & MASTERED SHOWDOWN MODAL ── */}
      {phase === 'completed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none select-none">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            style={{
              backgroundColor: '#FED500',
              border: '5px solid #000000',
              boxShadow: '8px 8px 0px #000000',
              borderRadius: '24px',
              color: '#000000',
            }}
            className="pointer-events-auto max-w-lg w-full p-5 sm:p-6 text-center"
          >
            {/* Trophy Icon */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '4px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                borderRadius: '18px',
                color: '#000000',
              }}
              className="w-14 h-14 mx-auto flex items-center justify-center mb-2 animate-bounce"
            >
              <Trophy className="w-8 h-8 stroke-[3]" />
            </div>

            {/* Winner Announcement Plaque */}
            <div
              style={{
                backgroundColor:
                  activityWinner === 'blue'
                    ? '#2563EB'
                    : activityWinner === 'red'
                    ? '#FF2A6D'
                    : '#FED500',
                border: '3.5px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                borderRadius: '14px',
                color: activityWinner === 'tie' ? '#000000' : '#FFFFFF',
              }}
              className="inline-block px-5 py-2 mb-2"
            >
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide">
                {activityWinner === 'blue' && '🏆 TEAM BLUE WINS THE ATTRACTION!'}
                {activityWinner === 'red' && '🏆 TEAM RED WINS THE ATTRACTION!'}
                {activityWinner === 'tie' && '🤝 IT’S A TIED MATCH!'}
              </h2>
            </div>

            <p className="text-[11px] font-black uppercase tracking-widest text-black mb-3">
              {meta.name} • 5 QUESTIONS COMPLETED
            </p>

            {/* Side-by-Side Activity Scores Comparison */}
            <div className="grid grid-cols-2 gap-3 mb-3 text-left">
              {/* Blue Team Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #000000',
                  boxShadow: '3px 3px 0px #000000',
                  borderRadius: '14px',
                }}
                className="p-3 flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-4 h-4 rounded bg-[#2563EB] border border-black" />
                  <span className="text-[11px] font-black uppercase text-black">
                    TEAM BLUE
                  </span>
                </div>
                <div className="text-xl font-black font-mono text-black">
                  +{blueTeam.activityScore} <span className="text-xs font-sans">PTS</span>
                </div>
                <span className="text-[10px] font-bold text-gray-700 mt-0.5">
                  {blueTeam.correctAnswersCount} / 5 Questions First
                </span>
              </div>

              {/* Red Team Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #000000',
                  boxShadow: '3px 3px 0px #000000',
                  borderRadius: '14px',
                }}
                className="p-3 flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-4 h-4 rounded bg-[#FF2A6D] border border-black" />
                  <span className="text-[11px] font-black uppercase text-black">
                    TEAM RED
                  </span>
                </div>
                <div className="text-xl font-black font-mono text-black">
                  +{redTeam.activityScore} <span className="text-xs font-sans">PTS</span>
                </div>
                <span className="text-[10px] font-bold text-gray-700 mt-0.5">
                  {redTeam.correctAnswersCount} / 5 Questions First
                </span>
              </div>
            </div>

            {/* Tickets Award Plaque */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '3px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                borderRadius: '12px',
                color: '#000000',
              }}
              className="mb-4 p-2 flex items-center justify-center gap-2 font-black text-xs"
            >
              <Star className="w-4 h-4 fill-[#FED500] text-black stroke-[2.5]" />
              <span>
                {activityWinner === 'tie'
                  ? '+1 GOLD TICKET AWARDED TO BOTH TEAMS'
                  : `+2 GOLD TICKETS AWARDED TO ${activityWinner === 'blue' ? 'TEAM BLUE' : 'TEAM RED'}`}
              </span>
              <Star className="w-4 h-4 fill-[#FED500] text-black stroke-[2.5]" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={restartCurrentActivity}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '3.5px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  borderRadius: '14px',
                  color: '#000000',
                }}
                className="py-2.5 font-black text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-4 h-4 stroke-[3]" />
                <span>PLAY AGAIN</span>
              </button>

              <button
                onClick={returnToHub}
                style={{
                  backgroundColor: '#FF2A6D',
                  border: '3.5px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  borderRadius: '14px',
                  color: '#FFFFFF',
                }}
                className="py-2.5 font-black text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <MapPin className="w-4 h-4 stroke-[3] text-white" />
                <span className="text-white font-black">CARNIVAL ISLAND</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
