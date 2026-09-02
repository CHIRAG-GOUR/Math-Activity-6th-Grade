'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceValueKey, PLACE_VALUE_SLOTS, MathChallenge } from '../types';
import { PhysicalNumberBlockDock } from './PhysicalNumberBlockDock';
import { soundManager } from '@/utils/audio';
import { Check, RotateCcw, Wrench } from 'lucide-react';

interface PlaceValueBuilderInteractProps {
  challenge: MathChallenge;
  team: 'blue' | 'red';
  onSubmit: (constructedNumber: number) => void;
  disabled?: boolean;
}

export const PlaceValueBuilderInteract: React.FC<PlaceValueBuilderInteractProps> = ({
  challenge,
  team,
  onSubmit,
  disabled = false,
}) => {
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

  const slots = (challenge.targetNumber && challenge.targetNumber > 999999)
    ? PLACE_VALUE_SLOTS
    : PLACE_VALUE_SLOTS.filter((s) => s.key !== 'millions');

  const handleDigitSelect = (digit: number) => {
    if (disabled) return;
    setSlotValues((prev) => ({
      ...prev,
      [selectedSlot]: digit,
    }));

    // Auto-advance to next slot to the right for speed
    const currentIndex = slots.findIndex((s) => s.key === selectedSlot);
    if (currentIndex < slots.length - 1) {
      setSelectedSlot(slots[currentIndex + 1].key);
    }
  };

  const handleReset = () => {
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
  };

  // Calculate current forged total value
  const currentTotal =
    slotValues.millions * 1000000 +
    slotValues.hundredThousands * 100000 +
    slotValues.tenThousands * 10000 +
    slotValues.thousands * 1000 +
    slotValues.hundreds * 100 +
    slotValues.tens * 10 +
    slotValues.ones;

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(currentTotal);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 select-none">
      
      {/* 1. PLACE VALUE TOWER SLOTS */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.key;
          const val = slotValues[slot.key];

          return (
            <motion.button
              key={slot.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundManager.playClick();
                setSelectedSlot(slot.key);
              }}
              disabled={disabled}
              className={`flex-1 min-w-[70px] sm:min-w-[95px] max-w-[120px] p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-between border-3 transition-all cursor-pointer shadow-xl ${
                isSelected
                  ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-400/50 scale-105'
                  : 'bg-white/95 border-slate-300 hover:border-amber-300'
              }`}
            >
              {/* Slot Header Label */}
              <span className="text-[9px] sm:text-[11px] font-black tracking-wider text-slate-700 font-game uppercase text-center leading-tight">
                {slot.shortLabel}
              </span>
              <span className="text-[8px] font-bold text-slate-500 font-mono">
                ×{slot.multiplier.toLocaleString()}
              </span>

              {/* Physical Number Value Display */}
              <div className="w-12 h-14 sm:w-16 sm:h-18 my-2 rounded-xl bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-600 border-2 border-white flex items-center justify-center shadow-inner">
                <span className="text-3xl sm:text-4xl font-black font-bank text-slate-950">
                  {val}
                </span>
              </div>

              {/* Contribution to full value */}
              <span className="text-[9px] font-black text-amber-900 font-mono">
                ={(val * slot.multiplier).toLocaleString()}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 2. LIVE ASSEMBLED VALUE BAR */}
      <div className="flex items-center justify-between w-full max-w-2xl px-6 py-3 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-amber-200 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-black uppercase tracking-wider font-game">FORGED NUMBER:</span>
        </div>
        <span className="text-2xl sm:text-3xl font-black font-bank text-amber-300 tracking-wider">
          {currentTotal.toLocaleString()}
        </span>
      </div>

      {/* 3. PHYSICAL NUMBER BLOCKS DOCK */}
      <PhysicalNumberBlockDock onSelectDigit={handleDigitSelect} disabled={disabled} />

      {/* 4. ACTION CONTROLS */}
      <div className="flex items-center gap-4 mt-1">
        <button
          onClick={handleReset}
          disabled={disabled}
          className="px-5 py-2.5 rounded-2xl bg-white border-2 border-slate-300 text-slate-800 font-black text-xs font-game uppercase tracking-wider shadow hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET SLOTS</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={disabled}
          className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-2 border-white text-slate-950 font-black text-base sm:text-lg font-game uppercase tracking-wider shadow-[0_0_25px_rgba(255,215,0,0.6)] flex items-center gap-2 cursor-pointer hover:brightness-110"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>LOCK IN FORGED NUMBER</span>
        </motion.button>
      </div>

    </div>
  );
};
