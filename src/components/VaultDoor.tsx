'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Key, ShieldAlert } from 'lucide-react';

interface VaultDoorProps {
  blueKeys: number;
  redKeys: number;
  isCracked?: boolean;
  isUnlocking?: boolean;
  children?: React.ReactNode;
}

export const VaultDoor: React.FC<VaultDoorProps> = ({
  blueKeys,
  redKeys,
  isCracked = false,
  isUnlocking = false,
  children,
}) => {
  const totalKeys = Math.min(3, Math.max(blueKeys, redKeys));

  return (
    <div className="relative flex items-center justify-center w-[500px] h-[500px] sm:w-[580px] sm:h-[580px] md:w-[640px] md:h-[640px] lg:w-[680px] lg:h-[680px] select-none">
      
      {/* Background Volumetric Golden Cavern Aura */}
      <motion.div
        animate={{
          scale: isCracked ? [1.1, 1.4, 1.25] : isUnlocking ? [1, 1.2, 1.08] : [1, 1.06, 1],
          opacity: isCracked ? [0.8, 1, 0.85] : isUnlocking ? [0.6, 0.85, 0.7] : [0.4, 0.65, 0.4],
        }}
        transition={{ duration: isCracked ? 1.5 : 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -inset-10 rounded-full bg-gradient-to-tr from-amber-600/35 via-yellow-400/45 to-amber-500/25 blur-3xl pointer-events-none"
      />

      {/* Rotating God Rays on Victory / Vault Crack */}
      {isCracked && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-36 pointer-events-none opacity-90"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.35) 15deg, transparent 30deg, rgba(255,245,180,0.5) 60deg, transparent 90deg, rgba(255,215,0,0.35) 135deg, transparent 180deg, rgba(255,245,180,0.5) 225deg, transparent 270deg, rgba(255,215,0,0.35) 315deg, transparent 360deg)',
          }}
        />
      )}

      {/* 1. LAYER 1: OUTSIDE HEAVY REINFORCED TITANIUM BULWARK */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#3c4a68] via-[#1a2337] to-[#0a0f1c] p-[12px] shadow-[0_20px_80px_rgba(0,0,0,0.95),inset_0_3px_8px_rgba(255,255,255,0.3)] border-4 border-[#687d9f]/70 flex items-center justify-center">
        
        {/* 16 Heavy 3D Golden/Steel Perimeter Hex Bolts */}
        {Array.from({ length: 16 }).map((_, idx) => {
          const angle = (idx * 360) / 16;
          return (
            <div
              key={idx}
              className="absolute w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-gradient-to-br from-[#fff3b0] via-[#c68a0c] to-[#3a2202] border border-[#ffecb3] shadow-[0_3px_8px_rgba(0,0,0,0.9),inset_0_1px_3px_rgba(255,255,255,0.8)] flex items-center justify-center"
              style={{
                transform: `rotate(${angle}deg) translate(0, -${315}px) rotate(-${angle}deg)`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-950/80 shadow-inner" />
            </div>
          );
        })}

        {/* 4 Heavy Steel Interlocking Locking Deadbolts */}
        {[
          { pos: 'top-0 -translate-y-3', rot: '0deg' },
          { pos: 'bottom-0 translate-y-3', rot: '180deg' },
          { pos: 'left-0 -translate-x-3', rot: '270deg' },
          { pos: 'right-0 translate-x-3', rot: '90deg' },
        ].map((item, i) => (
          <motion.div
            key={i}
            animate={{
              scaleY: isUnlocking ? [1, 0.75, 1] : 1,
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className={`absolute ${item.pos} w-10 sm:w-12 h-8 sm:h-9 bg-gradient-to-b from-[#a3b3cc] via-[#4f5f7d] to-[#1c2436] border-2 border-amber-400/80 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.4)] z-20 flex items-center justify-center`}
          >
            <div className="w-5 h-1.5 bg-amber-400/90 rounded-full shadow-[0_0_8px_#ffd700]" />
          </motion.div>
        ))}

        {/* 2. LAYER 2: GLEAMING BURNISHED GOLD GEAR BEVEL */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-[#7c4f03] via-[#ffd700] via-[#fff4b8] to-[#9c6a0c] p-[10px] shadow-[inset_0_0_35px_rgba(0,0,0,0.9),0_0_30px_rgba(255,215,0,0.4)] flex items-center justify-center">
          
          {/* Rotating Mechanical Dial Markings & Gear Teeth */}
          <motion.div
            animate={{ rotate: isUnlocking ? [0, 120] : [0, 360] }}
            transition={{
              rotate: isUnlocking
                ? { duration: 1.2, ease: 'easeOut' }
                : { duration: 80, repeat: Infinity, ease: 'linear' },
            }}
            className="absolute inset-[4px] rounded-full border-2 border-amber-950/50 pointer-events-none flex items-center justify-center"
          >
            {Array.from({ length: 36 }).map((_, idx) => {
              const deg = (idx * 360) / 36;
              const isMajor = idx % 3 === 0;
              return (
                <div
                  key={idx}
                  className={`absolute ${
                    isMajor
                      ? 'w-1 sm:w-1.5 h-6 sm:h-7 bg-gradient-to-b from-amber-950 to-amber-900 shadow-sm'
                      : 'w-0.5 sm:w-1 h-3.5 sm:h-4 bg-amber-900/60'
                  }`}
                  style={{
                    transform: `rotate(${deg}deg) translate(0, -${288}px)`,
                  }}
                />
              );
            })}
          </motion.div>

          {/* 3. LAYER 3: INNER VAULT HYDRAULIC CORE PLATE */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#1c263c] via-[#0e1422] to-[#04060c] p-6 sm:p-8 shadow-[inset_0_15px_50px_rgba(0,0,0,0.98),0_0_25px_rgba(0,0,0,0.9)] border-2 border-[#45587a]/70 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Dual Counter-rotating Laser-Etched Mechanical Gears */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[86%] h-[86%] rounded-full border-2 border-dashed border-amber-400/25 pointer-events-none opacity-50"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[68%] h-[68%] rounded-full border-2 border-dotted border-cyan-400/25 pointer-events-none opacity-50"
            />

            {/* Glowing Golden Arc Accent Conduits */}
            <div className="absolute inset-4 rounded-full border border-amber-400/20 pointer-events-none" />

            {/* VAULT KEY STATUS HUD BADGE */}
            <div className="absolute top-6 sm:top-8 flex items-center gap-2.5 z-20 px-4 py-1 rounded-full bg-black/80 border-2 border-amber-400/60 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.9),0_0_15px_rgba(255,215,0,0.3)]">
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-amber-300 uppercase font-game">
                VAULT LOCK CONDUIT
              </span>
              <div className="flex gap-1.5">
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
                                'drop-shadow(0 0 4px #ffd700)',
                                'drop-shadow(0 0 12px #ffd700)',
                                'drop-shadow(0 0 6px #ffd700)',
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-5 sm:w-6 h-5 sm:h-6 rounded-md flex items-center justify-center border ${
                        isSlotActive
                          ? 'bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 border-white text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.9)]'
                          : 'bg-slate-950 border-slate-700/80 text-slate-600'
                      }`}
                    >
                      <Key className="w-3 h-3 stroke-[3]" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* MAIN CENTER CONTENT: The Giant Bolted Question Plate */}
            <div className="relative z-30 w-full h-full flex flex-col items-center justify-center pt-6 sm:pt-8">
              {children}
            </div>

            {/* HEAVY 3-SPOKE VAULT HANDWHEEL MECHANISM (Bottom core) */}
            <motion.div
              animate={{
                rotate: isUnlocking ? [0, 180] : isCracked ? [0, 720] : 0,
              }}
              transition={{ duration: isCracked ? 2 : 1.2, ease: 'easeInOut' }}
              className="absolute bottom-4 sm:bottom-6 flex items-center justify-center opacity-85 pointer-events-none z-10"
            >
              <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-full border-4 border-amber-400 bg-gradient-to-br from-[#c68a0c] via-[#ffd700] to-[#784e03] shadow-[0_4px_25px_rgba(0,0,0,0.9),0_0_20px_rgba(255,215,0,0.6)] flex items-center justify-center">
                {/* 3 Wheel Spokes */}
                {[0, 120, 240].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-2.5 h-9 bg-gradient-to-t from-slate-900 to-amber-200 rounded shadow"
                    style={{ transform: `rotate(${deg}deg) translate(0, -10px)` }}
                  />
                ))}
                <div className="relative w-7 h-7 rounded-full bg-slate-950 border-2 border-amber-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#ffd700]" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};
