'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';
import { TeamId } from '@/types/game';

interface VaultKeysProps {
  team: TeamId;
  keysCount: number; // 0 to 3
}

export const VaultKeys: React.FC<VaultKeysProps> = ({ team, keysCount }) => {
  const isBlue = team === 'blue';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase font-game text-slate-300">
        <span>Vault Keys</span>
        <span className={isBlue ? 'text-cyan-400' : 'text-rose-400'}>
          {keysCount}/3
        </span>
      </div>

      <div className="flex items-center gap-2 p-1.5 rounded-lg bg-black/40 border border-slate-700/60 shadow-inner">
        {[1, 2, 3].map((slotIndex) => {
          const isFilled = keysCount >= slotIndex;
          return (
            <div
              key={slotIndex}
              className="relative w-8 h-8 rounded-md bg-slate-900/90 border border-slate-700 flex items-center justify-center overflow-hidden"
            >
              {isFilled ? (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className={`w-full h-full flex items-center justify-center rounded-md ${
                    isBlue
                      ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.8)] border border-cyan-200'
                      : 'bg-gradient-to-br from-rose-400 via-red-500 to-amber-600 text-slate-950 shadow-[0_0_12px_rgba(255,51,102,0.8)] border border-rose-200'
                  }`}
                >
                  <Key className="w-4 h-4 stroke-[2.5]" />
                </motion.div>
              ) : (
                <Key className="w-4 h-4 text-slate-700/60 stroke-[1.5]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
