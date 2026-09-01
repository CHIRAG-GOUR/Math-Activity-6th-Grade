'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { OrnateKey } from './OrnateKey';

interface VaultCenterpieceProps {
  blueKeys: number;
  redKeys: number;
  isCracked?: boolean;
  isUnlocking?: boolean;
  children?: React.ReactNode;
}

export const VaultCenterpiece: React.FC<VaultCenterpieceProps> = ({
  blueKeys,
  redKeys,
  isCracked = false,
  isUnlocking = false,
  children,
}) => {
  const totalKeys = Math.min(3, Math.max(blueKeys, redKeys));

  return (
    <div className="relative flex items-center justify-center w-[520px] h-[520px] sm:w-[600px] sm:h-[600px] md:w-[680px] md:h-[680px] lg:w-[730px] lg:h-[730px] select-none">
      
      {/* 1. Volumetric Golden Cavern Halo */}
      <motion.div
        animate={{
          scale: isCracked ? [1.1, 1.45, 1.3] : isUnlocking ? [1, 1.25, 1.1] : [1, 1.06, 1],
          opacity: isCracked ? [0.85, 1, 0.9] : isUnlocking ? [0.65, 0.9, 0.75] : [0.45, 0.7, 0.45],
        }}
        transition={{ duration: isCracked ? 1.5 : 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -inset-12 rounded-full bg-gradient-to-tr from-amber-600/40 via-yellow-400/50 to-amber-500/30 blur-3xl pointer-events-none"
      />

      {/* 2. Rotating God Rays on Victory / Vault Crack */}
      {isCracked && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-40 pointer-events-none opacity-95"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.4) 15deg, transparent 30deg, rgba(255,245,180,0.6) 60deg, transparent 90deg, rgba(255,215,0,0.4) 135deg, transparent 180deg, rgba(255,245,180,0.6) 225deg, transparent 270deg, rgba(255,215,0,0.4) 315deg, transparent 360deg)',
          }}
        />
      )}

      {/* 3. LAYER 1: HEAVY REINFORCED TITANIUM OUTER FRAME */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#445475] via-[#1c263c] to-[#090e18] p-[14px] shadow-[0_25px_90px_rgba(0,0,0,0.98),inset_0_3px_10px_rgba(255,255,255,0.35)] border-4 border-[#768cb2]/80 flex items-center justify-center">
        
        {/* 24 Heavy 3D Golden/Steel Perimeter Hex Bolts */}
        {Array.from({ length: 24 }).map((_, idx) => {
          const angle = (idx * 360) / 24;
          return (
            <div
              key={idx}
              className="absolute w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-gradient-to-br from-[#fff6c7] via-[#d49a17] to-[#452803] border border-[#ffecb3] shadow-[0_3px_8px_rgba(0,0,0,0.95),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
              style={{
                transform: `rotate(${angle}deg) translate(0, -${340}px) rotate(-${angle}deg)`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-950/90 shadow-inner" />
            </div>
          );
        })}

        {/* 4 Heavy Steel Interlocking Locking Deadbolts */}
        {[
          { pos: 'top-0 -translate-y-3.5', rot: '0deg' },
          { pos: 'bottom-0 translate-y-3.5', rot: '180deg' },
          { pos: 'left-0 -translate-x-3.5', rot: '270deg' },
          { pos: 'right-0 translate-x-3.5', rot: '90deg' },
        ].map((item, i) => (
          <motion.div
            key={i}
            animate={{
              scaleY: isUnlocking ? [1, 0.72, 1] : 1,
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className={`absolute ${item.pos} w-12 sm:w-14 h-9 sm:h-10 bg-gradient-to-b from-[#a8b9d4] via-[#526382] to-[#1e2638] border-2 border-amber-400/90 rounded-md shadow-[0_8px_25px_rgba(0,0,0,0.95),inset_0_1px_3px_rgba(255,255,255,0.5)] z-20 flex items-center justify-center`}
          >
            <div className="w-6 h-2 bg-gradient-to-r from-amber-400 to-yellow-200 rounded-full shadow-[0_0_10px_#ffd700]" />
          </motion.div>
        ))}

        {/* 4. LAYER 2: BURNISHED GOLD SEGMENTED BEVEL RING */}
        <div className="vault-gold-rim relative w-full h-full rounded-full p-[12px] flex items-center justify-center">
          
          {/* Rotating Mechanical Dial Markings & Degree Teeth */}
          <motion.div
            animate={{ rotate: isUnlocking ? [0, 120] : [0, 360] }}
            transition={{
              rotate: isUnlocking
                ? { duration: 1.2, ease: 'easeOut' }
                : { duration: 90, repeat: Infinity, ease: 'linear' },
            }}
            className="absolute inset-[4px] rounded-full border-2 border-amber-950/60 pointer-events-none flex items-center justify-center"
          >
            {Array.from({ length: 48 }).map((_, idx) => {
              const deg = (idx * 360) / 48;
              const isMajor = idx % 4 === 0;
              return (
                <div
                  key={idx}
                  className={`absolute ${
                    isMajor
                      ? 'w-1.5 h-7 sm:h-8 bg-gradient-to-b from-amber-950 to-amber-900 shadow-sm'
                      : 'w-0.5 sm:w-1 h-4 sm:h-5 bg-amber-900/70'
                  }`}
                  style={{
                    transform: `rotate(${deg}deg) translate(0, -${310}px)`,
                  }}
                />
              );
            })}
          </motion.div>

          {/* 5. LAYER 3: INNER VAULT CORE STEEL PLATE */}
          <div className="vault-plate-surface relative w-full h-full rounded-full p-6 sm:p-8 border-2 border-[#546a94]/80 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Dual Counter-rotating Laser-Etched Mechanical Gears */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[88%] h-[88%] rounded-full border-2 border-dashed border-amber-400/30 pointer-events-none opacity-60"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[70%] h-[70%] rounded-full border-2 border-dotted border-cyan-400/30 pointer-events-none opacity-60"
            />

            {/* Glowing Golden Arc Channel */}
            <div className="absolute inset-5 rounded-full border-2 border-amber-400/25 pointer-events-none shadow-[inset_0_0_20px_rgba(255,215,0,0.15)]" />

            {/* VAULT KEY STATUS RECEPTACLE (Top of core) */}
            <div className="absolute top-6 sm:top-8 flex items-center gap-3 z-20 px-5 py-1.5 rounded-full bg-black/85 border-2 border-amber-400/70 backdrop-blur-md shadow-[0_6px_25px_rgba(0,0,0,0.95),0_0_20px_rgba(255,215,0,0.4)]">
              <span className="text-[11px] sm:text-[12px] font-black tracking-widest text-amber-300 uppercase font-game">
                VAULT LOCK CONDUIT
              </span>
              <div className="flex gap-2">
                {[1, 2, 3].map((slot) => {
                  const isSlotActive = totalKeys >= slot;
                  return (
                    <motion.div
                      key={slot}
                      animate={
                        isSlotActive
                          ? {
                              scale: [1, 1.25, 1],
                              filter: [
                                'drop-shadow(0 0 6px #ffd700)',
                                'drop-shadow(0 0 16px #ffd700)',
                                'drop-shadow(0 0 8px #ffd700)',
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border-2 transition-all ${
                        isSlotActive
                          ? 'bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 border-white shadow-[0_0_20px_rgba(255,215,0,1)]'
                          : 'bg-slate-950/90 border-slate-700/80'
                      }`}
                    >
                      {isSlotActive ? (
                        <OrnateKey size={20} color="gold" glow={false} />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* MAIN CORE CONTENT: Bolted Question Console */}
            <div className="relative z-30 w-full h-full flex flex-col items-center justify-center pt-8 sm:pt-10">
              {children}
            </div>

            {/* HEAVY 3-SPOKE VAULT HANDWHEEL MECHANISM (Bottom core) */}
            <motion.div
              animate={{
                rotate: isUnlocking ? [0, 180] : isCracked ? [0, 720] : 0,
              }}
              transition={{ duration: isCracked ? 2 : 1.2, ease: 'easeInOut' }}
              className="absolute bottom-4 sm:bottom-6 flex items-center justify-center opacity-90 pointer-events-none z-10"
            >
              <div className="relative w-18 sm:w-22 h-18 sm:h-22 rounded-full border-4 border-amber-400 bg-gradient-to-br from-[#d49a17] via-[#ffd700] to-[#734200] shadow-[0_6px_30px_rgba(0,0,0,0.95),0_0_25px_rgba(255,215,0,0.7)] flex items-center justify-center">
                {/* 3 Wheel Spokes */}
                {[0, 120, 240].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-3 h-11 bg-gradient-to-t from-slate-950 via-slate-800 to-amber-200 rounded-sm shadow-md"
                    style={{ transform: `rotate(${deg}deg) translate(0, -12px)` }}
                  />
                ))}
                <div className="relative w-8 h-8 rounded-full bg-slate-950 border-2 border-amber-300 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#ffd700]" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};
