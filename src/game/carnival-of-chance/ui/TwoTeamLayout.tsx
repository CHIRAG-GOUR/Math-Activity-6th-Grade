// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Two-Team Strict Layout System
// Enforces Perfect Mirrored Positioning for Blue (Left) and Red (Right)
// Zero Layout Drift, Guaranteed Safe Central 3D Machine Viewport
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TeamConsole } from './TeamConsole';
import { CARNIVAL_THEME } from './tokens';

export const TwoTeamLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* ── Outer Safe Container (Starts below Top HUD) ── */}
      <div className="w-full h-full pt-[96px] pb-[16px] px-4 sm:px-8 flex items-stretch justify-between gap-4">
        {/* ── LEFT: TEAM BLUE OPERATOR CONSOLE ── */}
        <motion.aside
          initial={{ x: -240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -240, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 160 }}
          className="w-[320px] sm:w-[340px] lg:w-[360px] h-full pointer-events-auto shrink-0 flex flex-col"
        >
          <TeamConsole teamId="blue" />
        </motion.aside>

        {/* ── CENTER: SAFE 3D MACHINE VIEWPORT CONTAINER (Transparent overlay for center widgets) ── */}
        <div className="flex-1 h-full relative pointer-events-none flex flex-col justify-between items-center py-2">
          {children}
        </div>

        {/* ── RIGHT: TEAM RED OPERATOR CONSOLE (EXACT MIRROR) ── */}
        <motion.aside
          initial={{ x: 240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 240, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 160 }}
          className="w-[320px] sm:w-[340px] lg:w-[360px] h-full pointer-events-auto shrink-0 flex flex-col"
        >
          <TeamConsole teamId="red" />
        </motion.aside>
      </div>
    </div>
  );
};
