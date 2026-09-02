'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathChallenge } from '../types';
import { soundManager } from '@/utils/audio';
import { Check, Search, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { PhysicalNumberBlockDock } from './PhysicalNumberBlockDock';

interface DetectionLabInteractProps {
  challenge: MathChallenge;
  onSubmit: (answer: any) => void;
  disabled?: boolean;
}

export const DetectionLabInteract: React.FC<DetectionLabInteractProps> = ({
  challenge,
  onSubmit,
  disabled = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [enteredNumber, setEnteredNumber] = useState<string>('');

  // 1. TRUTH OR TRAP UI
  if (challenge.type === 'truth-or-trap') {
    return (
      <div className="w-full max-w-2xl flex flex-col items-center gap-6 select-none">
        <div className="w-full p-6 rounded-3xl bg-amber-950/90 border-3 border-amber-400 text-amber-100 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest font-game">MATHEMATICAL CLAIM:</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-display text-white leading-relaxed">
            "{challenge.data.claimStatement}"
          </p>
        </div>

        <div className="flex items-center gap-6 w-full justify-center">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              soundManager.playClick();
              onSubmit(1); // True
            }}
            disabled={disabled}
            className="flex-1 py-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 border-3 border-white text-white font-black text-2xl font-game uppercase tracking-wider shadow-[0_10px_25px_rgba(16,185,129,0.5)] cursor-pointer hover:brightness-110"
          >
            🛡️ TRUTH
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              soundManager.playClick();
              onSubmit(0); // False / Trap
            }}
            disabled={disabled}
            className="flex-1 py-5 rounded-3xl bg-gradient-to-r from-rose-600 to-red-500 border-3 border-white text-white font-black text-2xl font-game uppercase tracking-wider shadow-[0_10px_25px_rgba(244,63,94,0.5)] cursor-pointer hover:brightness-110"
          >
            ⚠️ TRAP
          </motion.button>
        </div>
      </div>
    );
  }

  // 2. WHICH STUDENT IS RIGHT UI
  if (challenge.type === 'which-student-is-right') {
    const stmts = challenge.data.studentStatements!;
    return (
      <div className="w-full max-w-4xl flex flex-col items-center gap-6 select-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Student A */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundManager.playClick();
              onSubmit(1);
            }}
            disabled={disabled}
            className="p-6 rounded-3xl bg-blue-950/90 border-3 border-blue-400 text-left text-white shadow-2xl flex flex-col justify-between hover:border-cyan-300 transition cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 text-cyan-300 font-black font-game text-sm uppercase">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <span>{stmts.studentA.name}</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed font-display">
                "{stmts.studentA.statement}"
              </p>
            </div>
            <span className="mt-4 px-4 py-2 rounded-xl bg-blue-600/80 text-center font-black font-game text-xs tracking-wider uppercase border border-cyan-400">
              VOTE FOR {stmts.studentA.name.toUpperCase()}
            </span>
          </motion.button>

          {/* Student B */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundManager.playClick();
              onSubmit(2);
            }}
            disabled={disabled}
            className="p-6 rounded-3xl bg-amber-950/90 border-3 border-amber-400 text-left text-white shadow-2xl flex flex-col justify-between hover:border-yellow-300 transition cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 text-amber-300 font-black font-game text-sm uppercase">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <span>{stmts.studentB.name}</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed font-display">
                "{stmts.studentB.statement}"
              </p>
            </div>
            <span className="mt-4 px-4 py-2 rounded-xl bg-amber-600/80 text-center font-black font-game text-xs tracking-wider uppercase border border-yellow-400">
              VOTE FOR {stmts.studentB.name.toUpperCase()}
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  // 3. ROUNDING DETECTIVE PLACE VALUE OPTIONS UI
  if (challenge.type === 'rounding-detective') {
    const options = [
      { label: 'Nearest 100 (Hundred)', val: 100 },
      { label: 'Nearest 1,000 (Thousand)', val: 1000 },
      { label: 'Nearest 10,000 (Ten Thousand)', val: 10000 },
      { label: 'Nearest 100,000 (Hundred Thousand)', val: 100000 },
    ];

    return (
      <div className="w-full max-w-3xl flex flex-col items-center gap-6 select-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
          {options.map((opt) => (
            <motion.button
              key={opt.val}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                soundManager.playClick();
                onSubmit(opt.val);
              }}
              disabled={disabled}
              className="p-5 rounded-2xl bg-amber-950/90 border-3 border-amber-400 text-white font-black text-base sm:text-lg font-game uppercase tracking-wider shadow-xl hover:bg-amber-900 transition flex items-center justify-between cursor-pointer"
            >
              <span>{opt.label}</span>
              <Check className="w-5 h-5 text-amber-400 opacity-60" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // 4. FIND THE MISTAKE / ERROR ANALYSIS NUMBER INPUT UI
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4 select-none">
      <div className="w-full p-4 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-amber-200 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest font-game">CORRECTED FORGED NUMBER:</span>
        <span className="text-3xl font-black font-bank text-amber-300">
          {enteredNumber ? Number(enteredNumber).toLocaleString() : '---,---'}
        </span>
      </div>

      <PhysicalNumberBlockDock
        onSelectDigit={(d) => setEnteredNumber((prev) => (prev.length < 8 ? prev + d : prev))}
        disabled={disabled}
      />

      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => {
            soundManager.playClick();
            setEnteredNumber('');
          }}
          disabled={disabled}
          className="px-5 py-2.5 rounded-2xl bg-white border-2 border-slate-300 text-slate-800 font-black text-xs font-game uppercase shadow hover:bg-slate-50 transition cursor-pointer"
        >
          CLEAR
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (enteredNumber) onSubmit(Number(enteredNumber));
          }}
          disabled={!enteredNumber || disabled}
          className="px-10 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-2 border-white text-slate-950 font-black text-base font-game uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>SUBMIT CALIBRATION</span>
        </motion.button>
      </div>
    </div>
  );
};
