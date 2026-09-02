'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathChallenge, PlaceValueKey, PLACE_VALUE_SLOTS, TeamForgeState } from '../types';
import { soundManager } from '@/utils/audio';
import { Check, RotateCcw, Wrench, ShieldCheck, Flame, Compass, Search, UserCheck } from 'lucide-react';

interface DualTeamForgeConsoleProps {
  challenge: MathChallenge;
  teamBlue: TeamForgeState;
  teamRed: TeamForgeState;
  onSubmitAnswer: (team: 'blue' | 'red', value: any) => void;
}

// Single Team Interactive Console Station
const TeamStation: React.FC<{
  team: 'blue' | 'red';
  teamState: TeamForgeState;
  challenge: MathChallenge;
  onSubmit: (val: any) => void;
}> = ({ team, teamState, challenge, onSubmit }) => {
  const isBlue = team === 'blue';
  const isLocked = teamState.hasAnsweredCurrent;

  // Local state for this console
  const [selectedSlot, setSelectedSlot] = useState<PlaceValueKey>('hundredThousands');
  const [slotValues, setSlotValues] = useState<Record<PlaceValueKey, number>>({
    millions: 0,
    hundredThousands: 0,
    tenThousands: 0,
    thousands: 0,
    hundreds: 0,
    tens: 0,
    ones: 0,
  });
  const [selectedBenchmark, setSelectedBenchmark] = useState<number | null>(null);
  const [enteredNumber, setEnteredNumber] = useState<string>('');
  const [blueprintDigits, setBlueprintDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [selectedBpIdx, setSelectedBpIdx] = useState<number>(0);

  const slots = (challenge.targetNumber && challenge.targetNumber > 999999)
    ? PLACE_VALUE_SLOTS
    : PLACE_VALUE_SLOTS.filter((s) => s.key !== 'millions');

  // Place Value Builder Total
  const currentPvTotal =
    slotValues.millions * 1000000 +
    slotValues.hundredThousands * 100000 +
    slotValues.tenThousands * 10000 +
    slotValues.thousands * 1000 +
    slotValues.hundreds * 100 +
    slotValues.tens * 10 +
    slotValues.ones;

  const handleDigitTap = (d: number) => {
    if (isLocked) return;
    soundManager.playKeypadBeep();

    if (challenge.type === 'master-blueprint') {
      const newDigits = [...blueprintDigits];
      newDigits[selectedBpIdx] = String(d);
      setBlueprintDigits(newDigits);
      if (selectedBpIdx < 5) setSelectedBpIdx(selectedBpIdx + 1);
    } else if (challenge.type === 'place-value-builder' || challenge.type === 'digit-hunt' || challenge.type === 'expanded-form') {
      setSlotValues((prev) => ({ ...prev, [selectedSlot]: d }));
      const curIdx = slots.findIndex((s) => s.key === selectedSlot);
      if (curIdx < slots.length - 1) setSelectedSlot(slots[curIdx + 1].key);
    } else {
      setEnteredNumber((prev) => (prev.length < 8 ? prev + d : prev));
    }
  };

  const handleReset = () => {
    if (isLocked) return;
    soundManager.playClick();
    setSlotValues({ millions: 0, hundredThousands: 0, tenThousands: 0, thousands: 0, hundreds: 0, tens: 0, ones: 0 });
    setEnteredNumber('');
    setSelectedBenchmark(null);
    setBlueprintDigits(['', '', '', '', '', '']);
    setSelectedBpIdx(0);
  };

  const handleLockIn = () => {
    if (isLocked) return;
    if (challenge.type === 'master-blueprint') {
      const str = blueprintDigits.join('');
      if (str.length === 6) onSubmit(str);
    } else if (challenge.type === 'rounding-track') {
      if (selectedBenchmark !== null) onSubmit(selectedBenchmark);
    } else if (challenge.type === 'truth-or-trap' || challenge.type === 'which-student-is-right' || challenge.type === 'rounding-detective') {
      // Handled directly via option clicks
    } else {
      onSubmit(currentPvTotal);
    }
  };

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div
      className={`flex-1 flex flex-col justify-between p-3 sm:p-4 rounded-3xl border-3 shadow-2xl transition-all ${
        isBlue
          ? 'bg-[#13233b] border-blue-400/90 text-white'
          : 'bg-[#2b170a] border-amber-500/90 text-amber-50'
      }`}
    >
      {/* 1. CONSOLE TOP HEADER */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/15">
        <div className="flex items-center gap-2">
          <div className={`w-3.5 h-3.5 rounded-full ${isBlue ? 'bg-cyan-400' : 'bg-amber-400'} animate-pulse`} />
          <span className="text-xs sm:text-sm font-black font-game uppercase tracking-wider">
            {teamState.name}
          </span>
        </div>

        {isLocked ? (
          <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] font-game uppercase tracking-widest flex items-center gap-1 shadow">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> LOCKED IN
          </span>
        ) : (
          <span className={`px-3 py-0.5 rounded-full ${isBlue ? 'bg-blue-600' : 'bg-amber-600'} text-white font-black text-[10px] font-game uppercase tracking-widest shadow`}>
            ACTIVE CONSOLE
          </span>
        )}
      </div>

      {/* 2. DYNAMIC WORKSTATION INTERACTION */}
      <div className="my-auto py-2 flex flex-col items-center gap-3">
        
        {/* SCENARIO A: PLACE VALUE SLOTS */}
        {(challenge.type === 'place-value-builder' || challenge.type === 'digit-hunt' || challenge.type === 'expanded-form' || challenge.type === 'compare-numbers') && (
          <div className="w-full flex flex-col items-center gap-2.5">
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full flex-wrap">
              {slots.map((slot) => {
                const isSelected = selectedSlot === slot.key;
                const val = slotValues[slot.key];

                return (
                  <button
                    key={slot.key}
                    onClick={() => {
                      if (!isLocked) {
                        soundManager.playClick();
                        setSelectedSlot(slot.key);
                      }
                    }}
                    disabled={isLocked}
                    className={`flex-1 min-w-[42px] max-w-[65px] p-1.5 rounded-xl flex flex-col items-center justify-between border-2 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-300 border-white text-slate-950 ring-2 ring-amber-400 scale-105 shadow-md'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <span className="text-[8px] font-black font-game uppercase">{slot.shortLabel}</span>
                    <span className="text-xl sm:text-2xl font-black font-bank">{val}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Assembled Readout */}
            <div className="w-full py-1.5 px-3 rounded-xl bg-black/40 border border-white/20 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Total:</span>
              <span className="text-lg font-black text-amber-300 font-bank">{currentPvTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* SCENARIO B: ROUNDING TRACK BENCHMARKS */}
        {challenge.type === 'rounding-track' && (
          <div className="w-full flex flex-col gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 font-game text-center">
              SELECT NEAREST BENCHMARK:
            </span>
            <div className="grid grid-cols-2 gap-2 w-full">
              {challenge.data.benchmarkPegs && (
                <>
                  <button
                    onClick={() => {
                      if (!isLocked) {
                        soundManager.playClick();
                        setSelectedBenchmark(challenge.data.benchmarkPegs![0]);
                      }
                    }}
                    disabled={isLocked}
                    className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                      selectedBenchmark === challenge.data.benchmarkPegs![0]
                        ? 'bg-amber-400 border-white text-slate-950 font-black shadow-lg scale-102'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <span className="text-[9px] block uppercase font-game">LOWER</span>
                    <span className="text-base sm:text-lg font-black font-bank">
                      {challenge.data.benchmarkPegs[0].toLocaleString()}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      if (!isLocked) {
                        soundManager.playClick();
                        setSelectedBenchmark(challenge.data.benchmarkPegs![2]);
                      }
                    }}
                    disabled={isLocked}
                    className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                      selectedBenchmark === challenge.data.benchmarkPegs![2]
                        ? 'bg-amber-400 border-white text-slate-950 font-black shadow-lg scale-102'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <span className="text-[9px] block uppercase font-game">UPPER</span>
                    <span className="text-base sm:text-lg font-black font-bank">
                      {challenge.data.benchmarkPegs[2].toLocaleString()}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* SCENARIO C: TRUTH OR TRAP */}
        {challenge.type === 'truth-or-trap' && (
          <div className="w-full flex items-center gap-3">
            <button
              onClick={() => !isLocked && onSubmit(1)}
              disabled={isLocked}
              className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 border-2 border-white text-white font-black text-lg font-game uppercase tracking-wider shadow-lg transition cursor-pointer"
            >
              🛡️ TRUTH
            </button>
            <button
              onClick={() => !isLocked && onSubmit(0)}
              disabled={isLocked}
              className="flex-1 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 border-2 border-white text-white font-black text-lg font-game uppercase tracking-wider shadow-lg transition cursor-pointer"
            >
              ⚠️ TRAP
            </button>
          </div>
        )}

        {/* SCENARIO D: WHICH STUDENT IS RIGHT */}
        {challenge.type === 'which-student-is-right' && challenge.data.studentStatements && (
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={() => !isLocked && onSubmit(1)}
              disabled={isLocked}
              className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-cyan-400 text-left text-white font-bold text-xs font-game transition cursor-pointer"
            >
              VOTE: {challenge.data.studentStatements.studentA.name}
            </button>
            <button
              onClick={() => !isLocked && onSubmit(2)}
              disabled={isLocked}
              className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-yellow-400 text-left text-white font-bold text-xs font-game transition cursor-pointer"
            >
              VOTE: {challenge.data.studentStatements.studentB.name}
            </button>
          </div>
        )}

        {/* SCENARIO E: MASTER BLUEPRINT 6-SLOTS */}
        {challenge.type === 'master-blueprint' && (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-1 w-full">
              {['HTh', 'TTh', 'Th', 'H', 'T', 'O'].map((lbl, idx) => (
                <button
                  key={idx}
                  onClick={() => !isLocked && setSelectedBpIdx(idx)}
                  disabled={isLocked}
                  className={`w-10 h-14 rounded-xl flex flex-col items-center justify-between p-1 border-2 transition cursor-pointer ${
                    selectedBpIdx === idx
                      ? 'bg-amber-300 border-white text-slate-950 font-black scale-105'
                      : 'bg-white/10 border-white/20 text-white'
                  }`}
                >
                  <span className="text-[7px] font-black">{lbl}</span>
                  <span className="text-lg font-black font-bank">{blueprintDigits[idx] || '·'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3. PHYSICAL CHUNKY NUMBER BLOCKS (0-9) */}
      {challenge.type !== 'truth-or-trap' && challenge.type !== 'which-student-is-right' && (
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 py-2 border-t border-white/15">
          {digits.map((d) => (
            <button
              key={d}
              onClick={() => handleDigitTap(d)}
              disabled={isLocked}
              className={`w-8 h-9 sm:w-10 sm:h-11 rounded-xl flex items-center justify-center font-black font-bank text-base sm:text-lg shadow-md transition active:scale-90 cursor-pointer ${
                isLocked
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309] border-2 border-white text-slate-950 shadow-[0_3px_0_#78350f]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* 4. LOCK IN & RESET CONTROLS */}
      {challenge.type !== 'truth-or-trap' && challenge.type !== 'which-student-is-right' && (
        <div className="flex items-center gap-2 pt-2 border-t border-white/15">
          <button
            onClick={handleReset}
            disabled={isLocked}
            className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLockIn}
            disabled={isLocked}
            className={`flex-1 py-3 rounded-xl border-2 border-white font-black text-xs sm:text-sm font-game uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition ${
              isLocked
                ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed'
                : isBlue
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 hover:brightness-110 cursor-pointer'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 cursor-pointer'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>LOCK IN ({isBlue ? 'BLUE' : 'RED'})</span>
          </button>
        </div>
      )}

      {/* Feedback banner inside console */}
      {teamState.lastFeedback && (
        <div
          className={`mt-2 p-2 rounded-xl text-center text-[10px] font-black font-game uppercase tracking-wider ${
            teamState.lastFeedback.isCorrect
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-rose-500 text-white'
          }`}
        >
          {teamState.lastFeedback.message}
        </div>
      )}
    </div>
  );
};

export const DualTeamForgeConsole: React.FC<DualTeamForgeConsoleProps> = ({
  challenge,
  teamBlue,
  teamRed,
  onSubmitAnswer,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-4 select-none my-auto">
      {/* LEFT CONSOLE: TEAM BLUE */}
      <TeamStation
        team="blue"
        teamState={teamBlue}
        challenge={challenge}
        onSubmit={(val) => onSubmitAnswer('blue', val)}
      />

      {/* RIGHT CONSOLE: TEAM RED */}
      <TeamStation
        team="red"
        teamState={teamRed}
        challenge={challenge}
        onSubmit={(val) => onSubmitAnswer('red', val)}
      />
    </div>
  );
};
