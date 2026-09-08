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

export const TwoTeamLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [mobileTab, setMobileTab] = useState<'both' | 'blue' | '3d' | 'red'>('both');
  const phase = useCarnivalStore((s) => s.phase);

  const isActionPhase = phase === 'operating';

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* ── 1. Tablet/Mobile Responsive Tab Switcher (<1024px only) ── */}
      <div className="lg:hidden fixed top-[80px] inset-x-4 z-40 flex justify-center pointer-events-auto">
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '4px solid #000000',
            boxShadow: '4px 4px 0px #000000',
            borderRadius: '16px',
          }}
          className="flex items-center gap-1.5 p-1.5"
        >
          <button
            type="button"
            onClick={() => setMobileTab('blue')}
            style={{
              backgroundColor: mobileTab === 'blue' ? '#3B82F6' : '#FFFFFF',
              color: mobileTab === 'blue' ? '#FFFFFF' : '#000000',
              border: '2px solid #000000',
              borderRadius: '10px',
            }}
            className="px-3 py-1 font-black text-xs transition-transform active:scale-95 cursor-pointer"
          >
            TEAM BLUE
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('3d')}
            style={{
              backgroundColor: mobileTab === '3d' ? '#FED500' : '#FFFFFF',
              color: '#000000',
              border: '2px solid #000000',
              borderRadius: '10px',
            }}
            className="px-3 py-1 font-black text-xs transition-transform active:scale-95 cursor-pointer"
          >
            3D MACHINE
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('red')}
            style={{
              backgroundColor: mobileTab === 'red' ? '#FF2A6D' : '#FFFFFF',
              color: mobileTab === 'red' ? '#FFFFFF' : '#000000',
              border: '2px solid #000000',
              borderRadius: '10px',
            }}
            className="px-3 py-1 font-black text-xs transition-transform active:scale-95 cursor-pointer"
          >
            TEAM RED
          </button>
        </div>
      </div>

      {/* ── 2. Main Responsive Two-Team Container ── */}
      <div className="w-full h-full pt-[82px] sm:pt-[86px] pb-2 sm:pb-3 px-3 sm:px-5 md:px-6 flex items-stretch justify-between gap-3 lg:gap-5">
        
        {/* ── LEFT CONSOLE: TEAM BLUE ── */}
        <motion.aside
          initial={{ x: -240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 160 }}
          className={`h-full pointer-events-auto shrink-0 flex flex-col ${
            mobileTab === 'red' || mobileTab === '3d' ? 'hidden lg:flex' : 'flex'
          } w-full sm:w-[310px] md:w-[330px] lg:w-[340px] xl:w-[360px]`}
        >
          <TeamConsole teamId="blue" />
        </motion.aside>

        {/* ── CENTER: 3D MACHINE VIEWPORT OVERLAY ── */}
        <div
          className={`flex-1 h-full relative pointer-events-none flex flex-col justify-between items-center py-1 ${
            mobileTab === 'blue' || mobileTab === 'red' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {children}
        </div>

        {/* ── RIGHT CONSOLE: TEAM RED ── */}
        <motion.aside
          initial={{ x: 240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 160 }}
          className={`h-full pointer-events-auto shrink-0 flex flex-col ${
            mobileTab === 'blue' || mobileTab === '3d' ? 'hidden lg:flex' : 'flex'
          } w-full sm:w-[310px] md:w-[330px] lg:w-[340px] xl:w-[360px]`}
        >
          <TeamConsole teamId="red" />
        </motion.aside>

      </div>
    </div>
  );
};
