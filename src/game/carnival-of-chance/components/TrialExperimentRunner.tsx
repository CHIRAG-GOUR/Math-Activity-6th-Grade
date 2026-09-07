// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Trial Experiment Runner
// Interactive real-time probability simulator:
// - Run 10 Random Trials / Run 50 Random Trials
// - Visual frequency distribution bars & fraction comparisons
// - Direct comparison: Experimental vs Theoretical probability
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { Play, RotateCw, BarChart3, HelpCircle, ArrowRight } from 'lucide-react';

export const TrialExperimentRunner: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const trialResults = useCarnivalStore((s) => s.trialResults);
  const machineAnimState = useCarnivalStore((s) => s.machineAnimState);
  const runBatchTrials = useCarnivalStore((s) => s.runBatchTrials);
  const nextChallenge = useCarnivalStore((s) => s.nextChallenge);

  if (phase !== 'observation-reasoning' && phase !== 'experiment-trials') return null;
  if (!activeChallenge) return null;

  const items = activeChallenge.probabilityData.items;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-4 sm:inset-x-12 bottom-6 sm:bottom-8 z-50 max-w-2xl mx-auto p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-amber-400 shadow-[0_20px_50px_rgba(0,0,0,0.25)] select-none text-slate-900"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-600" />
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900">
            PROBABILITY LAB: EXPERIMENTAL TESTING
          </span>
        </div>
        <div className="text-[10px] sm:text-xs font-mono font-bold text-slate-500">
          Theoretical: {activeChallenge.probabilityData.theoreticalProbabilityFraction} (
          {Math.round(activeChallenge.probabilityData.theoreticalProbabilityDecimal * 100)}%)
        </div>
      </div>

      {/* ── Run Batch Buttons ── */}
      <div className="flex items-center justify-center gap-3 my-3">
        <button
          onClick={() => runBatchTrials(10)}
          disabled={machineAnimState === 'batch-simulating'}
          className="py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 font-black text-xs sm:text-sm text-amber-950 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 ${machineAnimState === 'batch-simulating' ? 'animate-spin' : ''}`} />
          <span>RUN 10 TRIALS</span>
        </button>

        <button
          onClick={() => runBatchTrials(50)}
          disabled={machineAnimState === 'batch-simulating'}
          className="py-2.5 px-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-300 font-black text-xs sm:text-sm text-emerald-950 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 ${machineAnimState === 'batch-simulating' ? 'animate-spin' : ''}`} />
          <span>RUN 50 TRIALS</span>
        </button>

        <button
          onClick={nextChallenge}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-105 border-2 border-amber-600 font-black text-xs sm:text-sm text-slate-950 flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ml-auto"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Trial Results Live Tally ── */}
      {trialResults && (
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-black uppercase text-slate-500 mb-2">
            Results over {trialResults.totalTrials} Random Draws:
          </div>
          <div className="space-y-2">
            {items.map((item) => {
              const count = trialResults.tally[item.label] || 0;
              const percentage = Math.round((count / trialResults.totalTrials) * 100);
              return (
                <div key={item.label} className="flex items-center gap-3 text-xs font-black">
                  <div className="w-20 sm:w-24 truncate text-left">{item.label}</div>
                  <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <div className="w-24 text-right font-mono text-[11px]">
                    {count}/{trialResults.totalTrials} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
