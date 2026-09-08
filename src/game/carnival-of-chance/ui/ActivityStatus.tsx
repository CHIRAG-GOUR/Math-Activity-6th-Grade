// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Activity Status & Machine Instruction
// Real-Time Arcade Step Guidance Banner for Classroom Students
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { CARNIVAL_THEME } from './tokens';
import { Sparkles, Dices, Eye, BarChart3, CheckCircle2 } from 'lucide-react';

export const ActivityStatus: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);
  const phase = useCarnivalStore((s) => s.phase);
  const blueConfirmed = useCarnivalStore((s) => s.blueTeam.isConfirmed);
  const redConfirmed = useCarnivalStore((s) => s.redTeam.isConfirmed);

  if (activeActivity === 'hub') return null;

  let stepText = 'STEP 1: BOTH TEAMS MAKE PREDICTION ON CONSOLES';
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
      stepText = 'BOTH TEAMS LOCKED IN! STARTING 3D EXPERIMENT...';
      Icon = CheckCircle2;
      bgClass = 'bg-[#2E9B57] text-[#FFFFFF]';
    } else {
      stepText = 'STEP 1: PREDICT PROBABILITY & PRESS LOCK IN';
      Icon = Dices;
      bgClass = 'bg-[#FFC928] text-[#111111]';
    }
  } else if (phase === 'operating') {
    stepText = 'STEP 2: 3D MACHINE IN MOTION — RUNNING EXPERIMENT!';
    Icon = Sparkles;
    bgClass = 'bg-[#E53935] text-[#FFC928]';
  } else if (phase === 'observation') {
    stepText = 'STEP 3: OBSERVE RESULT — COMPARE THEORETICAL VS ACTUAL';
    Icon = Eye;
    bgClass = 'bg-[#2E9B57] text-[#FFFFFF]';
  } else if (phase === 'batch-trials') {
    stepText = 'STEP 4: 10-TRIAL BATCH EXPERIMENT — LAW OF LARGE NUMBERS';
    Icon = BarChart3;
    bgClass = 'bg-[#2463EB] text-[#FFFFFF]';
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="pointer-events-none select-none z-20 flex justify-center pb-1"
    >
      <div
        className={`px-5 py-1.5 rounded-2xl border-4 border-[#111111] shadow-[4px_4px_0px_#111111] flex items-center gap-2.5 ${bgClass}`}
      >
        <Icon className="w-4 h-4 stroke-[2.5]" />
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
          {stepText}
        </span>
      </div>
    </motion.div>
  );
};
