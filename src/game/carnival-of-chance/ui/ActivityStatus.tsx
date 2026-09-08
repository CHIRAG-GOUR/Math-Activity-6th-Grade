// ============================================================
// THE GREAT CARNIVAL OF CHANCE — COMIC SPEECH-BUBBLE INSTRUCTION
// 100% Solid Opaque Comic Speech Bubble with Guaranteed Inline Styles
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

  let stepText = 'PREDICT BEFORE YOU ACT — LOCK IN YOUR CHOICE!';
  let Icon = Dices;
  let bgHex = '#FED500';
  let textHex = '#000000';

  if (phase === 'predicting') {
    if (blueConfirmed && !redConfirmed) {
      stepText = 'BLUE LOCKED IN! WAITING FOR RED OPERATOR...';
      Icon = CheckCircle2;
      bgHex = '#2563EB';
      textHex = '#FFFFFF';
    } else if (redConfirmed && !blueConfirmed) {
      stepText = 'RED LOCKED IN! WAITING FOR BLUE OPERATOR...';
      Icon = CheckCircle2;
      bgHex = '#FF2A6D';
      textHex = '#FFFFFF';
    } else if (blueConfirmed && redConfirmed) {
      stepText = 'BOTH TEAMS LOCKED IN! RUNNING 3D EXPERIMENT...';
      Icon = CheckCircle2;
      bgHex = '#00F0A8';
      textHex = '#000000';
    } else {
      stepText = 'PREDICT BEFORE YOU ACT — LOCK IN YOUR CHOICE!';
      Icon = Dices;
      bgHex = '#FED500';
      textHex = '#000000';
    }
  } else if (phase === 'operating') {
    stepText = '3D MACHINE EXECUTING PHYSICAL EXPERIMENT...';
    Icon = Sparkles;
    bgHex = '#FF2A6D';
    textHex = '#FED500';
  } else if (phase === 'observation') {
    stepText = 'OBSERVE THE OUTCOME — THEORETICAL VS ACTUAL!';
    Icon = Eye;
    bgHex = '#FED500';
    textHex = '#000000';
  } else if (phase === 'batch-trials') {
    stepText = '10-TRIAL BATCH SIMULATION — LAW OF LARGE NUMBERS';
    Icon = BarChart3;
    bgHex = '#FED500';
    textHex = '#000000';
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="pointer-events-none select-none z-20 flex flex-col items-center pb-2"
    >
      {/* Speech Bubble Plaque with Guaranteed Inline Styles */}
      <div
        style={{
          backgroundColor: bgHex,
          color: textHex,
          border: '4px solid #000000',
          boxShadow: '5px 5px 0px #000000',
          borderRadius: '16px',
        }}
        className="relative px-5 sm:px-6 py-2 flex items-center gap-2.5"
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] shrink-0" />
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-center">
          {stepText}
        </span>
      </div>
    </motion.div>
  );
};
