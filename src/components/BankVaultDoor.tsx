'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lightbulb, Sparkles } from 'lucide-react';
import { OrnateKey } from './OrnateKey';
import { Question } from '@/types/game';

interface BankVaultDoorProps {
  blueKeys: number;
  redKeys: number;
  question: Question | null;
  roundNumber: number;
  isCracked?: boolean;
  isUnlocking?: boolean;
}

export const BankVaultDoor: React.FC<BankVaultDoorProps> = ({
  blueKeys,
  redKeys,
  question,
  roundNumber,
  isCracked = false,
  isUnlocking = false,
}) => {
  const [showHint, setShowHint] = useState(false);
  const totalKeys = Math.min(3, Math.max(blueKeys, redKeys));

  useEffect(() => {
    setShowHint(false);
  }, [question?.id]);

  return (
    <div className="relative flex items-center justify-center w-[480px] h-[480px] sm:w-[540px] sm:h-[540px] md:w-[600px] md:h-[600px] lg:w-[650px] lg:h-[650px] select-none">
      
      {/* 1. BANK WALL RECESSED ARCHITECTURAL FRAME */}
      <div className="absolute -inset-8 rounded-full bg-gradient-to-b from-[#e8c77b] via-[#d9a441] to-[#a87532] shadow-[0_20px_60px_rgba(120,80,20,0.35),inset_0_4px_12px_rgba(255,255,255,0.8)] border-4 border-[#fff3b0] flex items-center justify-center" />

      {/* 2. ROTATING GOD RAYS ON VICTORY */}
      {isCracked && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-36 pointer-events-none opacity-95"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.4) 15deg, transparent 30deg, rgba(255,245,180,0.6) 60deg, transparent 90deg, rgba(255,215,0,0.4) 135deg, transparent 180deg, rgba(255,245,180,0.6) 225deg, transparent 270deg, rgba(255,215,0,0.4) 315deg, transparent 360deg)',
          }}
        />
      )}

      {/* 3. LAYER 1: HEAVY BRUSHED STEEL SAFE BULWARK */}
      <div className="bank-vault-frame absolute inset-0 rounded-full p-[12px] flex items-center justify-center">
        
        {/* 20 Polished Gold / Steel Perimeter Rivets */}
        {Array.from({ length: 20 }).map((_, idx) => {
          const angle = (idx * 360) / 20;
          return (
            <div
              key={idx}
              className="absolute w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-gradient-to-br from-[#ffffff] via-[#ffd700] to-[#784e03] border border-[#ffecb3] shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-center"
              style={{
                transform: `rotate(${angle}deg) translate(0, -${305}px) rotate(-${angle}deg)`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-950/70" />
            </div>
          );
        })}

        {/* 4 Heavy Steel Locking Deadbolts (Top, Bottom, Left, Right) */}
        {[
          { pos: 'top-0 -translate-y-3', rot: '0deg' },
          { pos: 'bottom-0 translate-y-3', rot: '180deg' },
          { pos: 'left-0 -translate-x-3', rot: '270deg' },
          { pos: 'right-0 translate-x-3', rot: '90deg' },
        ].map((item, i) => (
          <motion.div
            key={i}
            animate={{
              scaleY: isUnlocking ? [1, 0.72, 1] : 1,
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className={`absolute ${item.pos} w-11 sm:w-13 h-8 sm:h-9 bg-gradient-to-b from-[#ffffff] via-[#cbd5e1] to-[#64748b] border-2 border-amber-400 rounded-md shadow-[0_6px_18px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.8)] z-20 flex items-center justify-center`}
          >
            <div className="w-6 h-1.5 bg-gradient-to-r from-amber-400 to-yellow-200 rounded-full shadow-[0_0_8px_#ffd700]" />
          </motion.div>
        ))}

        {/* 4. LAYER 2: 24K BURNISHED GOLD SEGMENTED RING */}
        <div className="bank-vault-gold-ring relative w-full h-full rounded-full p-[10px] flex items-center justify-center">
          
          {/* Rotating Mechanical Dial Markings */}
          <motion.div
            animate={{ rotate: isUnlocking ? [0, 90] : [0, 360] }}
            transition={{
              rotate: isUnlocking
                ? { duration: 1.2, ease: 'easeOut' }
                : { duration: 90, repeat: Infinity, ease: 'linear' },
            }}
            className="absolute inset-[4px] rounded-full border-2 border-amber-900/40 pointer-events-none flex items-center justify-center"
          >
            {Array.from({ length: 36 }).map((_, idx) => {
              const deg = (idx * 360) / 36;
              const isMajor = idx % 3 === 0;
              return (
                <div
                  key={idx}
                  className={`absolute ${
                    isMajor
                      ? 'w-1 sm:w-1.5 h-6 sm:h-7 bg-amber-950 shadow-sm'
                      : 'w-0.5 sm:w-1 h-3.5 sm:h-4 bg-amber-900/60'
                  }`}
                  style={{
                    transform: `rotate(${deg}deg) translate(0, -${275}px)`,
                  }}
                />
              );
            })}
          </motion.div>

          {/* 5. LAYER 3: INNER SECURE VAULT CORE PLATE */}
          <div className="bank-vault-core-plate relative w-full h-full rounded-full p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Counter-rotating Laser-Etched Mechanical Gears */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[86%] h-[86%] rounded-full border-2 border-dashed border-amber-400/30 pointer-events-none opacity-60"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[68%] h-[68%] rounded-full border-2 border-dotted border-cyan-400/30 pointer-events-none opacity-60"
            />

            {/* VAULT KEY STATUS RECEPTACLE BADGE (Top of core) */}
            <div className="absolute top-5 sm:top-7 flex items-center gap-2.5 z-20 px-4 py-1 rounded-full bg-black/85 border-2 border-amber-400/80 shadow-[0_4px_18px_rgba(0,0,0,0.6),0_0_15px_rgba(255,215,0,0.4)]">
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-amber-300 uppercase font-game">
                VAULT LOCK CONDUIT
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((slot) => {
                  const isSlotActive = totalKeys >= slot;
                  return (
                    <div
                      key={slot}
                      className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                        isSlotActive
                          ? 'bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 border-white shadow-[0_0_14px_rgba(255,215,0,1)]'
                          : 'bg-slate-900 border-slate-700'
                      }`}
                    >
                      {isSlotActive ? (
                        <OrnateKey size={16} color="gold" glow={false} />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. CENTER QUESTION SECURITY DISPLAY (Mounted in core) */}
            {question && (
              <div className="relative z-30 w-full max-w-[460px] flex flex-col items-center justify-center pt-6 sm:pt-8 text-center">
                {/* Header Tag */}
                <div className="flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black tracking-widest uppercase font-game mb-2 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>SOLVE TO UNLOCK • ROUND {roundNumber}</span>
                </div>

                {/* Massive Bolted Question Plaque */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.06 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] border-2 border-amber-400 shadow-[0_15px_35px_rgba(0,0,0,0.9),inset_0_1px_3px_rgba(255,255,255,0.3)] flex flex-col items-center justify-center"
                  >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display drop-shadow-[0_2px_12px_rgba(0,0,0,1)] my-0.5">
                      {question.text}
                    </h2>

                    {question.subText && (
                      <p className="text-xs sm:text-sm font-bold text-amber-200 mt-0.5">
                        {question.subText}
                      </p>
                    )}

                    {/* Hint Button */}
                    {question.hint && (
                      <div className="mt-2">
                        {!showHint ? (
                          <button
                            onClick={() => setShowHint(true)}
                            className="flex items-center gap-1 text-[11px] font-black text-amber-300 bg-amber-950/80 hover:bg-amber-900 px-3 py-1 rounded-full border border-amber-400/60 transition shadow cursor-pointer"
                          >
                            <Lightbulb className="w-3 h-3 text-yellow-300" />
                            <span>TAP FOR HINT</span>
                          </button>
                        ) : (
                          <div className="text-xs font-semibold text-amber-200 bg-black/90 border border-amber-400/60 px-3 py-1.5 rounded-lg shadow mt-1 max-w-[360px]">
                            💡 {question.hint}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* 7. MECHANICAL 3-SPOKE VAULT HANDWHEEL (Bottom of core) */}
            <motion.div
              animate={{
                rotate: isUnlocking ? [0, 180] : isCracked ? [0, 720] : 0,
              }}
              transition={{ duration: isCracked ? 2 : 1.2, ease: 'easeInOut' }}
              className="absolute bottom-3 sm:bottom-5 flex items-center justify-center opacity-85 pointer-events-none z-10"
            >
              <div className="relative w-16 sm:w-18 h-16 sm:h-18 rounded-full border-4 border-amber-400 bg-gradient-to-br from-[#d49a17] via-[#ffd700] to-[#734200] shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_18px_rgba(255,215,0,0.6)] flex items-center justify-center">
                {[0, 120, 240].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-2.5 h-9 bg-gradient-to-t from-slate-950 to-amber-200 rounded-sm shadow"
                    style={{ transform: `rotate(${deg}deg) translate(0, -10px)` }}
                  />
                ))}
                <div className="w-6 h-6 rounded-full bg-slate-950 border-2 border-amber-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};
