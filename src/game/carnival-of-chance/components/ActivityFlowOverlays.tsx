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
import { Play, Award, CheckCircle2, ArrowRight, Star, MapPin, BarChart3, Trophy } from 'lucide-react';
import { ChampionshipCertificateModal } from '@/components/shared/ChampionshipCertificateModal';

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
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);
  const activityWinner = useCarnivalStore((s) => s.activityWinner);
  const [isCertificateOpen, setIsCertificateOpen] = React.useState(false);

  if (activeActivity === 'hub') return null;
  const meta = ATTRACTIONS_META[activeActivity];

  const winnerTeam = activityWinner === 'red' ? redTeam : blueTeam;
  const runnerUpTeam = activityWinner === 'red' ? blueTeam : redTeam;

  return (
    <>
      <AnimatePresence>
        {/* ── 1. Attraction Intro Modal ── */}
        {phase === 'intro' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none pointer-events-auto">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-[#fef08a] border-4 border-black shadow-[10px_10px_0px_#000000] text-center text-black"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-red-600 border-2 border-black text-yellow-300 font-black text-xs uppercase tracking-widest mb-3 shadow-[2px_2px_0px_#000000]">
                {meta.subtitle}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-2">
                {meta.name}
              </h2>

              <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed mb-4">
                {meta.description}
              </p>

              {/* Question Count Selection */}
              <div className="mb-4 p-3 rounded-xl bg-white border-3 border-black shadow-[3px_3px_0px_#000000]">
                <span className="text-[10px] font-black uppercase tracking-wider text-black block mb-2">
                  CHALLENGE PACING
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {([5, 10, 15, 20] as const).map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-1.5 rounded-lg border-2 border-black font-black text-xs transition cursor-pointer ${
                        questionCountConfig === cnt
                          ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_#000000]'
                          : 'bg-slate-100 text-slate-600 hover:bg-yellow-100'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startPredicting}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-yellow-300 border-3 border-black font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000000] transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-yellow-300" />
                <span>START ATTRACTION CHALLENGES</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* ── 2. Observation & Reasoning Modal ── */}
        {phase === 'observation' && activeChallenge && drawnOutcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none pointer-events-auto">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-[#fef08a] border-4 border-black shadow-[10px_10px_0px_#000000] text-center text-black"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-yellow-400 border-2 border-black text-black font-black text-xs uppercase tracking-wider mb-2">
                EXPERIMENTAL OUTCOME
              </div>

              {/* Physical Outcome Ball */}
              <div className="flex items-center justify-center gap-3 my-3 p-3 rounded-xl bg-white border-3 border-black shadow-[3px_3px_0px_#000000]">
                <div
                  className="w-12 h-12 rounded-full border-3 border-black shadow-[2px_2px_0px_#000000] animate-bounce"
                  style={{ backgroundColor: drawnOutcome.color }}
                />
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">DRAWN ITEM</span>
                  <span className="text-lg font-black text-black uppercase">{drawnOutcome.colorName}</span>
                </div>
              </div>

              {/* Theoretical vs Experimental Math Reasoning */}
              <div className="p-3 rounded-xl bg-white border-3 border-black shadow-[3px_3px_0px_#000000] text-left my-3">
                <span className="text-[10px] font-black uppercase text-red-700 block mb-1">
                  THEORETICAL PROBABILITY REASONING
                </span>
                <p className="text-xs font-bold text-black leading-relaxed">
                  {activeChallenge.explanation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => runBatchTrials(10)}
                  className="py-2.5 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black border-3 border-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000] transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>RUN 10 TRIALS</span>
                </button>
                <button
                  onClick={nextChallengeOrComplete}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-yellow-300 border-3 border-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000] transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>NEXT QUESTION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── 3. 10 Batch Trials Experimental vs Theoretical Modal ── */}
        {phase === 'batch-trials' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none pointer-events-auto">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-white border-4 border-black shadow-[10px_10px_0px_#000000] text-center text-black"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-red-600 border-2 border-black text-yellow-300 font-black text-xs uppercase tracking-wider mb-2">
                10 EXPERIMENTAL TRIALS
              </div>

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
                🏆 {activityWinner === 'tie' ? 'PERFECT DRAW' : `${winnerTeam.name} WINS THE ATTRACTION!`}
              </p>

              {/* Team Scores Card */}
              <div className="my-3 p-3 rounded-xl bg-white border-3 border-black shadow-[4px_4px_0px_#000000] flex justify-between gap-2">
                <div className="flex-1 p-2 rounded-lg bg-blue-50 border-2 border-blue-400 text-center">
                  <span className="text-[10px] font-black text-blue-900 block">{blueTeam.name}</span>
                  <span className="text-lg font-black text-black font-mono">{blueTeam.score} PTS</span>
                  <div className="text-[9px] font-bold text-slate-600">{blueTeam.goldTickets} Tickets</div>
                </div>
                <div className="flex-1 p-2 rounded-lg bg-red-50 border-2 border-red-400 text-center">
                  <span className="text-[10px] font-black text-red-900 block">{redTeam.name}</span>
                  <span className="text-lg font-black text-black font-mono">{redTeam.score} PTS</span>
                  <div className="text-[9px] font-bold text-slate-600">{redTeam.goldTickets} Tickets</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setIsCertificateOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000000] transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-black" />
                  <span>🏆 PRINT CHAMPIONSHIP CERTIFICATE</span>
                </button>

                <button
                  onClick={returnToHub}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-yellow-300 border-3 border-black font-black text-sm shadow-[4px_4px_0px_#000000] transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 stroke-[2.5]" />
                  <span>RETURN TO CARNIVAL ISLAND</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChampionshipCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        winnerName={winnerTeam.name}
        winnerScore={winnerTeam.score}
        gameTitle="Carnival of Chance"
        topicTitle="Grade 6 Probability, Statistics & Fractions"
        runnerUpName={runnerUpTeam.name}
        runnerUpScore={runnerUpTeam.score}
      />
    </>
  );
};
