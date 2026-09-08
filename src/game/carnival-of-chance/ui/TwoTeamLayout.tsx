// ============================================================
// THE GREAT CARNIVAL OF CHANCE — RESPONSIVE NEUBRUTALIST TWO-TEAM LAYOUT
// Fully Responsive Across 1080p Classroom TVs, Desktops, Tablets & Mobile
// Exact Mirrored Side Consoles, Non-Overlapping Central 3D Machine Viewport
// ============================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TeamConsole } from './TeamConsole';
import { useCarnivalStore } from '../store/carnivalStore';
import { Users, Eye, Sparkles } from 'lucide-react';

export const TwoTeamLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Mobile / Tablet Tab Switcher ('both' on desktop, 'blue' | '3d' | 'red' on mobile/tablet)
  const [mobileTab, setMobileTab] = useState<'both' | 'blue' | '3d' | 'red'>('both');

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* ── 1. Tablet/Mobile Responsive Tab Switcher (<1024px only) ── */}
      <div className="lg:hidden fixed top-[88px] inset-x-4 z-40 flex justify-center pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border-[4px] border-black shadow-[5px_5px_0px_#000000]">
          <button
            onClick={() => setMobileTab('blue')}
            className={`px-3 py-1 rounded-xl border-2 border-black font-black text-xs transition-transform active:scale-95 cursor-pointer ${
              mobileTab === 'blue'
                ? 'bg-[#3B82F6] text-white shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-blue-100'
            }`}
          >
            TEAM BLUE
          </button>
          <button
            onClick={() => setMobileTab('3d')}
            className={`px-3 py-1 rounded-xl border-2 border-black font-black text-xs transition-transform active:scale-95 cursor-pointer ${
              mobileTab === '3d'
                ? 'bg-[#FFDE00] text-black shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-yellow-100'
            }`}
          >
            3D MACHINE
          </button>
          <button
            onClick={() => setMobileTab('red')}
            className={`px-3 py-1 rounded-xl border-2 border-black font-black text-xs transition-transform active:scale-95 cursor-pointer ${
              mobileTab === 'red'
                ? 'bg-[#FF2A6D] text-white shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-red-100'
            }`}
          >
            TEAM RED
          </button>
        </div>
      </div>

      {/* ── 2. Main Responsive Two-Team Container ── */}
      <div className="w-full h-full pt-[92px] sm:pt-[96px] pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex items-stretch justify-between gap-3 lg:gap-6">
        
        {/* ── LEFT CONSOLE: TEAM BLUE (Desktop side panel OR Mobile active tab) ── */}
        <motion.aside
          initial={{ x: -240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 160 }}
          className={`h-full pointer-events-auto shrink-0 flex flex-col ${
            mobileTab === 'red' || mobileTab === '3d' ? 'hidden lg:flex' : 'flex'
          } w-full sm:w-[320px] md:w-[340px] lg:w-[350px] xl:w-[370px]`}
        >
          <TeamConsole teamId="blue" />
        </motion.aside>

        {/* ── CENTER: 3D MACHINE VIEWPORT OVERLAY (Guidance speech-bubble & widgets) ── */}
        <div
          className={`flex-1 h-full relative pointer-events-none flex flex-col justify-between items-center py-1 ${
            mobileTab === 'blue' || mobileTab === 'red' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {children}
        </div>

        {/* ── RIGHT CONSOLE: TEAM RED (Desktop side panel OR Mobile active tab) ── */}
        <motion.aside
          initial={{ x: 240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 160 }}
          className={`h-full pointer-events-auto shrink-0 flex flex-col ${
            mobileTab === 'blue' || mobileTab === '3d' ? 'hidden lg:flex' : 'flex'
          } w-full sm:w-[320px] md:w-[340px] lg:w-[350px] xl:w-[370px]`}
        >
          <TeamConsole teamId="red" />
        </motion.aside>

      </div>
    </div>
  );
};
