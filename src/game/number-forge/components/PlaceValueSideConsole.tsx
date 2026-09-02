'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathChallenge, PlaceValueKey, GRADE_6_PLACE_SLOTS, TeamForgeState } from '../types';
import { soundManager } from '@/utils/audio';
import { Check, RotateCcw, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface PlaceValueSideConsoleProps {
  team: 'blue' | 'red';
  teamState: TeamForgeState;
  challenge: MathChallenge;
  onSubmit: (slots: Record<PlaceValueKey, number>, totalValue: number) => void;
}

export const PlaceValueSideConsole: React.FC<PlaceValueSideConsoleProps> = ({
  team,
  teamState,
  challenge,
  onSubmit,
}) => {
  const isBlue = team === 'blue';
  const isLocked = teamState.hasAnsweredCurrent;

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
  const [isFocused, setIsFocused] = useState(false);

  // Compute Current Total
  const currentTotal =
    slotValues.hundredThousands * 100000 +
    slotValues.tenThousands * 10000 +
    slotValues.thousands * 1000 +
    slotValues.hundreds * 100 +
    slotValues.tens * 10 +
    slotValues.ones;

  const handleDigitTap = (d: number) => {
    if (isLocked) return;
    setIsFocused(true);
    soundManager.playKeypadBeep();

    setSlotValues((prev) => ({ ...prev, [selectedSlot]: d }));

    // Advance to next slot automatically
    const curIdx = GRADE_6_PLACE_SLOTS.findIndex((s) => s.key === selectedSlot);
    if (curIdx < GRADE_6_PLACE_SLOTS.length - 1) {
      setSelectedSlot(GRADE_6_PLACE_SLOTS[curIdx + 1].key);
    }
  };

  const handleReset = () => {
    if (isLocked) return;
    soundManager.playClick();
    setSlotValues({
      millions: 0,
      hundredThousands: 0,
      tenThousands: 0,
      thousands: 0,
      hundreds: 0,
      tens: 0,
      ones: 0,
    });
    setSelectedSlot('hundredThousands');
  };

  const handleConfirm = () => {
    if (isLocked) return;
    onSubmit(slotValues, currentTotal);
  };

  const digitsRow1 = [1, 2, 3, 4, 5];
  const digitsRow2 = [6, 7, 8, 9, 0];

  return (
    <div
      onPointerDown={() => setIsFocused(true)}
      onPointerUp={() => setTimeout(() => setIsFocused(false), 800)}
      className={`relative w-full h-full flex flex-col justify-between p-3 sm:p-4 rounded-3xl border-4 shadow-2xl transition-all select-none ${
        isBlue
          ? 'bg-[#0a1829] border-blue-500/90 text-slate-100 shadow-[0_15px_40px_rgba(37,99,235,0.25)]'
          : 'bg-[#1f0d04] border-amber-500/90 text-amber-50 shadow-[0_15px_40px_rgba(217,119,6,0.25)]'
      } ${isFocused ? (isBlue ? 'ring-4 ring-cyan-400' : 'ring-4 ring-amber-400') : ''}`}
    >
      {/* 1. CONSOLE TOP BANNER (Team Name & Status) */}
      <div
        className={`w-full py-2 px-3.5 rounded-2xl flex items-center justify-between border-2 ${
          isBlue
            ? 'bg-blue-900/90 border-blue-400 text-white'
            : 'bg-amber-900/90 border-amber-400 text-amber-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-3.5 h-3.5 rounded-full ${isBlue ? 'bg-cyan-400' : 'bg-amber-400'} animate-ping`} />
          <span className="text-base sm:text-lg font-black font-bank uppercase tracking-wider">
            {teamState.name}
          </span>
        </div>

        {isLocked ? (
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs font-game uppercase tracking-widest flex items-center gap-1 shadow">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> LOCKED
          </span>
        ) : (
          <span className="text-xs font-bold font-game uppercase tracking-widest text-slate-300">
            {teamState.score} PTS
          </span>
        )}
      </div>

      {/* 2. PLACE VALUE SLOTS GRID (6 Large Slots with 2-line labels) */}
      <div className="grid grid-cols-3 gap-2 my-2">
        {GRADE_6_PLACE_SLOTS.map((slot) => {
          const isSelected = selectedSlot === slot.key;
          const val = slotValues[slot.key];
          const isIncorrect = teamState.incorrectSlots?.includes(slot.key);

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
              className={`p-2 rounded-2xl flex flex-col items-center justify-between border-3 transition-all cursor-pointer ${
                isIncorrect
                  ? 'bg-rose-900/90 border-rose-500 text-white ring-2 ring-rose-400 animate-pulse'
                  : isSelected
                  ? isBlue
                    ? 'bg-blue-600 border-white text-white ring-4 ring-cyan-400 scale-102 shadow-lg'
                    : 'bg-amber-500 border-white text-slate-950 ring-4 ring-amber-300 scale-102 shadow-lg'
                  : 'bg-black/40 border-white/20 text-slate-200 hover:bg-black/60'
              }`}
            >
              {/* 2-Line Place Name Label */}
              <div className="text-center leading-tight py-0.5">
                <span className="text-[11px] sm:text-xs font-black font-game uppercase block">
                  {slot.line1}
                </span>
                {slot.line2 && (
                  <span className="text-[10px] sm:text-[11px] font-bold font-game uppercase block opacity-80">
                    {slot.line2}
                  </span>
                )}
              </div>

              {/* Large Digit Box */}
              <div className="w-full py-1 rounded-xl bg-black/50 border border-white/20 text-center my-0.5">
                <span className="text-2xl sm:text-3xl font-black font-bank text-amber-300">
                  {val}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. ASSEMBLED NUMBER READOUT */}
      <div className="w-full py-2 px-3 rounded-2xl bg-black/70 border-2 border-white/20 flex items-center justify-between">
        <span className="text-xs font-black font-game text-slate-400 uppercase">
          YOUR NUMBER:
        </span>
        <span className="text-xl sm:text-2xl font-black font-bank text-amber-300 tracking-wider">
          {currentTotal.toLocaleString()}
        </span>
      </div>

      {/* 4. INDEPENDENT DIGIT KEYPAD (0-9) */}
      <div className="flex flex-col gap-1.5 my-2">
        <span className="text-[10px] font-black font-game uppercase tracking-widest text-slate-400 text-center">
          TOUCH TO PLACE DIGIT
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {digitsRow1.map((d) => (
            <button
              key={d}
              onClick={() => handleDigitTap(d)}
              disabled={isLocked}
              className={`h-11 sm:h-12 rounded-xl flex items-center justify-center font-black font-bank text-xl sm:text-2xl border-2 transition active:scale-90 cursor-pointer shadow-md ${
                isLocked
                  ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#fde68a] via-[#f59e0b] to-[#b45309] border-white text-slate-950 hover:brightness-110'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {digitsRow2.map((d) => (
            <button
              key={d}
              onClick={() => handleDigitTap(d)}
              disabled={isLocked}
              className={`h-11 sm:h-12 rounded-xl flex items-center justify-center font-black font-bank text-xl sm:text-2xl border-2 transition active:scale-90 cursor-pointer shadow-md ${
                isLocked
                  ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#fde68a] via-[#f59e0b] to-[#b45309] border-white text-slate-950 hover:brightness-110'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 5. ACTION CONTROLS (CONFIRM / RESET) */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={handleReset}
          disabled={isLocked}
          title="Reset Slots"
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold transition cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleConfirm}
          disabled={isLocked}
          className={`flex-1 py-3.5 rounded-2xl border-2 border-white font-black text-sm sm:text-base font-game uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition cursor-pointer ${
            isLocked
              ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed'
              : isBlue
              ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-slate-950 hover:brightness-110 active:scale-95'
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 hover:brightness-110 active:scale-95'
          }`}
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>CONFIRM ANSWER</span>
        </button>
      </div>

      {/* 6. PER-SLOT ERROR OR SUCCESS FEEDBACK */}
      {teamState.lastFeedback && (
        <div
          className={`mt-2 p-2 rounded-2xl text-center text-xs font-black font-game uppercase tracking-wide border-2 ${
            teamState.lastFeedback.isCorrect
              ? 'bg-emerald-500/90 border-white text-slate-950'
              : 'bg-rose-600/95 border-rose-300 text-white'
          }`}
        >
          {teamState.lastFeedback.message}
        </div>
      )}
    </div>
  );
};
