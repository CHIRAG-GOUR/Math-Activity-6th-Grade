// ============================================================
// THE GREAT CARNIVAL OF CHANCE — DUAL-CONSOLE CARNIVAL LAYOUT
// Left: Team Blue Console (320px-340px) | Center: Wide 3D Machine Viewport | Right: Team Red Console (320px-340px)
// Perfect Symmetrical Bounds, Zero Overlap, Full 3D Visibility
// ============================================================

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TeamConsole } from './TeamConsole';

export const TwoTeamLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'blue' | '3d' | 'red'>('blue');

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth < 960);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* ── 1. Tablet/Mobile Switcher (Only visible when screen width < 960px) ── */}
      {isMobileScreen && (
        <div className="fixed top-[70px] inset-x-4 z-50 flex justify-center pointer-events-auto">
          <div
            style={{
              backgroundColor: '#FED500',
              border: '3.5px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              borderRadius: '16px',
            }}
            className="flex items-center gap-1.5 p-1.5"
          >
            <button
              type="button"
              onClick={() => setMobileActiveTab('blue')}
              style={{
                backgroundColor: mobileActiveTab === 'blue' ? '#3B82F6' : '#FFFFFF',
                color: mobileActiveTab === 'blue' ? '#FFFFFF' : '#000000',
                border: '2px solid #000000',
                borderRadius: '10px',
              }}
              className="px-3 py-1 font-black text-xs cursor-pointer active:scale-95"
            >
              TEAM BLUE
            </button>
            <button
              type="button"
              onClick={() => setMobileActiveTab('3d')}
              style={{
                backgroundColor: mobileActiveTab === '3d' ? '#FF2A6D' : '#FFFFFF',
                color: mobileActiveTab === '3d' ? '#FFFFFF' : '#000000',
                border: '2px solid #000000',
                borderRadius: '10px',
              }}
              className="px-3 py-1 font-black text-xs cursor-pointer active:scale-95"
            >
              3D MACHINE
            </button>
            <button
              type="button"
              onClick={() => setMobileActiveTab('red')}
              style={{
                backgroundColor: mobileActiveTab === 'red' ? '#FF2A6D' : '#FFFFFF',
                color: mobileActiveTab === 'red' ? '#FFFFFF' : '#000000',
                border: '2px solid #000000',
                borderRadius: '10px',
              }}
              className="px-3 py-1 font-black text-xs cursor-pointer active:scale-95"
            >
              TEAM RED
            </button>
          </div>
        </div>
      )}

      {/* ── 2. Main Two-Team Layout Container ── */}
      <div className="w-full h-full pt-[72px] pb-3 px-3 sm:px-5 flex items-stretch justify-between gap-3 sm:gap-4">
        
        {/* ── LEFT CONSOLE: TEAM BLUE (Strictly 320px-340px wide) ── */}
        {(!isMobileScreen || mobileActiveTab === 'blue') && (
          <motion.aside
            initial={{ x: -140, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              width: isMobileScreen ? '100%' : '330px',
              maxWidth: isMobileScreen ? '420px' : '340px',
              minWidth: isMobileScreen ? 'auto' : '300px',
            }}
            className="h-full pointer-events-auto shrink-0 flex flex-col mx-auto sm:mx-0"
          >
            <TeamConsole teamId="blue" />
          </motion.aside>
        )}

        {/* ── CENTER: WIDE 3D MACHINE VIEWPORT (Always flex-1, fully open) ── */}
        {(!isMobileScreen || mobileActiveTab === '3d') && (
          <div
            style={{ minWidth: isMobileScreen ? '100%' : '320px' }}
            className="flex-1 h-full relative pointer-events-none flex flex-col justify-between items-center py-1"
          >
            {children}
          </div>
        )}

        {/* ── RIGHT CONSOLE: TEAM RED (Strictly 320px-340px wide) ── */}
        {(!isMobileScreen || mobileActiveTab === 'red') && (
          <motion.aside
            initial={{ x: 140, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              width: isMobileScreen ? '100%' : '330px',
              maxWidth: isMobileScreen ? '420px' : '340px',
              minWidth: isMobileScreen ? 'auto' : '300px',
            }}
            className="h-full pointer-events-auto shrink-0 flex flex-col mx-auto sm:mx-0"
          >
            <TeamConsole teamId="red" />
          </motion.aside>
        )}

      </div>
    </div>
  );
};
