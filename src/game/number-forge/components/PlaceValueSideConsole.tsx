'use client';

import React, { useState } from 'react';
import { MathChallenge, PlaceValueKey, GRADE_6_PLACE_SLOTS, TeamForgeState } from '../types';
import { soundManager } from '@/utils/audio';
import { Check, RotateCcw, CheckCircle2 } from 'lucide-react';

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

  // Calculate current total
  const currentTotal =
    slotValues.hundredThousands * 100000 +
    slotValues.tenThousands * 10000 +
    slotValues.thousands * 1000 +
    slotValues.hundreds * 100 +
    slotValues.tens * 10 +
    slotValues.ones;

  const handleDigitTap = (d: number) => {
    if (isLocked) return;
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
      className={`relative w-full h-full max-h-[640px] flex flex-col justify-between p-3.5 rounded-3xl border-4 shadow-xl select-none transition-all ${
        isBlue
          ? 'bg-[#ffffff] border-blue-600 text-slate-900 shadow-[0_12px_30px_rgba(37,99,235,0.2)]'
          : 'bg-[#ffffff] border-amber-600 text-slate-900 shadow-[0_12px_30px_rgba(217,119,6,0.2)]'
      }`}
    >
      {/* 1. TOP HEADER (Clean Team Name & Score) */}
      <div
        className={`w-full py-2 px-3.5 rounded-2xl flex items-center justify-between border-2 shadow-sm ${
          isBlue
            ? 'bg-blue-600 border-blue-700 text-white'
            : 'bg-amber-600 border-amber-700 text-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
          <span className="text-sm sm:text-base font-black font-bank uppercase tracking-wider truncate max-w-[150px]">
            {teamState.name}
          </span>
        </div>

        {isLocked ? (
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-white font-black text-xs font-game uppercase tracking-widest flex items-center gap-1 shadow">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> LOCKED
          </span>
        ) : (
          <span className="text-xs sm:text-sm font-black font-bank tracking-widest text-white">
            {teamState.score} PTS
          </span>
        )}
      </div>

      {/* 2. PLACE VALUE SLOTS GRID (6 Large Clean White Slots) */}
      <div className="grid grid-cols-3 gap-2 my-1.5">
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
                  ? 'bg-rose-100 border-rose-600 text-rose-950 ring-2 ring-rose-500 animate-pulse'
                  : isSelected
                  ? isBlue
                    ? 'bg-blue-50 border-blue-600 text-blue-950 ring-4 ring-blue-400 scale-102 shadow-md'
                    : 'bg-amber-50 border-amber-600 text-amber-950 ring-4 ring-amber-400 scale-102 shadow-md'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              {/* 2-Line Place Name Label */}
              <div className="text-center leading-tight py-0.5">
                <span className="text-[11px] sm:text-xs font-black font-game uppercase block text-slate-800">
                  {slot.line1}
                </span>
                {slot.line2 && (
                  <span className="text-[10px] sm:text-[11px] font-bold font-game uppercase block text-slate-600">
                    {slot.line2}
                  </span>
                )}
              </div>

              {/* Large Digit Box */}
              <div
                className={`w-full py-1 rounded-xl text-center my-0.5 border ${
                  isSelected
                    ? isBlue
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white text-slate-900 border-slate-200'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black font-bank">
                  {val}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. ASSEMBLED NUMBER READOUT */}
      <div className="w-full py-1.5 px-3 rounded-xl bg-slate-100 border-2 border-slate-300 flex items-center justify-between">
        <span className="text-xs font-black font-game text-slate-600 uppercase">
          YOUR NUMBER:
        </span>
        <span className="text-xl sm:text-2xl font-black font-bank text-slate-950 tracking-wider">
          {currentTotal.toLocaleString()}
        </span>
      </div>

      {/* 4. CHUNKY DIGIT BUTTONS (0-9) */}
      <div className="flex flex-col gap-1.5 my-1">
        <span className="text-[10px] font-black font-game uppercase tracking-widest text-slate-500 text-center">
          TOUCH DIGIT TO PLACE
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {digitsRow1.map((d) => (
            <button
              key={d}
              onClick={() => handleDigitTap(d)}
              disabled={isLocked}
              className={`h-10 sm:h-11 rounded-xl flex items-center justify-center font-black font-bank text-xl sm:text-2xl border-2 transition active:scale-95 cursor-pointer shadow-sm ${
                isLocked
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : isBlue
                  ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white border-blue-700 hover:brightness-105'
                  : 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-amber-700 hover:brightness-105'
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
              className={`h-10 sm:h-11 rounded-xl flex items-center justify-center font-black font-bank text-xl sm:text-2xl border-2 transition active:scale-95 cursor-pointer shadow-sm ${
                isLocked
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : isBlue
                  ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white border-blue-700 hover:brightness-105'
                  : 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-amber-700 hover:brightness-105'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 5. ACTION BUTTONS (CONFIRM / RESET) */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={handleReset}
          disabled={isLocked}
          title="Reset Slots"
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 font-bold transition cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleConfirm}
          disabled={isLocked}
          className={`flex-1 py-3 rounded-2xl border-2 font-black text-sm sm:text-base font-game uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition cursor-pointer ${
            isLocked
              ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
              : isBlue
              ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-700 active:scale-95'
              : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-700 active:scale-95'
          }`}
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>CONFIRM ANSWER</span>
        </button>
      </div>

      {/* 6. PER-SLOT ERROR FEEDBACK */}
      {teamState.lastFeedback && (
        <div
          className={`mt-1.5 p-1.5 rounded-xl text-center text-xs font-black font-game uppercase tracking-wide border-2 ${
            teamState.lastFeedback.isCorrect
              ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
              : 'bg-rose-100 border-rose-500 text-rose-950'
          }`}
        >
          {teamState.lastFeedback.message}
        </div>
      )}
    </div>
  );
};
