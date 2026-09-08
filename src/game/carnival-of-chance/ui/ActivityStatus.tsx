// ============================================================
// THE GREAT CARNIVAL OF CHANCE — COMIC SPEECH-BUBBLE INSTRUCTION
// 100% Solid Yellow Comic Speech Bubble with Downward Pointer
// Dynamic Real-Time Operator Status & In-Game Direction
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { Dices, CheckCircle2, Sparkles, Eye, BarChart3 } from 'lucide-react';

export const ActivityStatus: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);
  const phase = useCarnivalStore((s) => s.phase);
  const blueConfirmed = useCarnivalStore((s) => s.blueTeam.isConfirmed);
  const redConfirmed = useCarnivalStore((s) => s.redTeam.isConfirmed);

  if (activeActivity === 'hub') return null;

  let stepText = 'PREDICT BEFORE YOU SPIN!';
  let Icon = Dices;
  let bgClass = 'bg-[#FFC928] text-[#111111]';

  if (phase === 'predicting') {
    if (blueConfirmed && !redConfirmed) {
      stepText = 'BLUE LOCKED IN! WAITING FOR RED OPERATOR...';
      Icon = CheckCircle2;
      bgClass = 'bg-[#2463EB] text-[#FFFFFF]';
    } else if (redConfirmed && !blueConfirmed) {
      stepText = 'RED LOCKED IN! WAITING FOR BLUE OPERATOR...';
      Icon = CheckCircle2;
      bgClass = 'bg-[#E53935] text-[#FFFFFF]';
    } else if (blueConfirmed && redConfirmed) {
      stepText = 'BOTH TEAMS LOCKED IN! EXECUTING 3D EXPERIMENT...';
      Icon = CheckCircle2;
      bgClass = 'bg-[#2E9B57] text-[#FFFFFF]';
    } else {
      stepText = 'PREDICT BEFORE YOU ACT — LOCK IN YOUR CHOICE!';
      Icon = Dices;
      bgClass = 'bg-[#FFC928] text-[#111111]';
    }
  } else if (phase === 'operating') {
    stepText = '3D MACHINE RUNNING EXPERIMENT — WATCH CLOSELY!';
    Icon = Sparkles;
    bgClass = 'bg-[#E53935] text-[#FFC928]';
  } else if (phase === 'observation') {
    stepText = 'OBSERVE THE OUTCOME — COMPARE THEORETICAL VS ACTUAL!';
    Icon = Eye;
    bgClass = 'bg-[#2E9B57] text-[#FFFFFF]';
  } else if (phase === 'batch-trials') {
    stepText = '10-TRIAL BATCH SIMULATION — LAW OF LARGE NUMBERS';
    Icon = BarChart3;
    bgClass = 'bg-[#2463EB] text-[#FFFFFF]';
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="pointer-events-none select-none z-20 flex flex-col items-center pb-2"
    >
      {/* Speech Bubble Plaque */}
      <div
        className={`relative px-6 py-2 rounded-[18px] border-[4px] border-[#111111] shadow-[6px_6px_0px_#111111] flex items-center gap-2.5 ${bgClass}`}
      >
        <Icon className="w-5 h-5 stroke-[3]" />
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
          {stepText}
        </span>
      </div>
    </motion.div>
  );
};
