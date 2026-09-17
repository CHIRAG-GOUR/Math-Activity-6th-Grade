// ============================================================
// PERCENTAGE HARVEST — THE SMART FARM MASTER SHELL
// Full-screen arcade composition with central 3D farm, top header,
// left & right farm stations and bottom growth timeline
// ============================================================

'use client';

import React, { useState, useEffect } from 'react';
import { FarmScene3D } from '../world/FarmScene3D';
import { TeamFarmConsole } from './TeamFarmConsole';
import { FarmHeader } from './FarmHeader';
import { FarmBottomBar } from './FarmBottomBar';
import { FarmBriefingModal } from './FarmBriefingModal';
import { FarmVictoryOverlay } from './FarmVictoryOverlay';
import { FarmClockTransitionOverlay } from './FarmClockTransitionOverlay';
import { useFarmStore } from '../store/farmStore';
import { drainSimEvents } from '../engine/farmSim';
import { farmAudio } from '../engine/farmAudio';

const SimAudioBridge: React.FC = () => {
  useEffect(() => {
    let raf = 0;
    const pump = () => {
      const events = drainSimEvents();
      for (const ev of events) {
        farmAudio.onSimEvent(ev);
      }
      raf = requestAnimationFrame(pump);
    };
    raf = requestAnimationFrame(pump);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
};

export const PercentageHarvestGame: React.FC = () => {
  const [mobileTab, setMobileTab] = useState<'blue' | 'red'>('blue');
  const [isMobile, setIsMobile] = useState(false);
  const muted = useFarmStore((s) => s.muted);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1080);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    farmAudio.startAmbience();
    farmAudio.startBgm();

    const handleFirstGesture = () => {
      farmAudio.unlock();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);
    window.addEventListener('click', handleFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      farmAudio.shutdown();
    };
  }, []);

  useEffect(() => {
    farmAudio.setMuted(muted);
  }, [muted]);

  return (
    <div className="fixed inset-0 flex flex-col justify-between overflow-hidden select-none bg-sky-300 font-sans">
      <SimAudioBridge />

      {/* ── 3D LIVING FARM CANVAS IN BACKGROUND ── */}
      <FarmScene3D />

      {/* ── TOP HEADER & FLOATING MATH CHALLENGE BANNER ── */}
      <FarmHeader />

      {/* ── CENTER AREA: DUAL FARM STATIONS (LEFT & RIGHT) ── */}
      <main className="relative flex-1 w-full max-w-[1920px] mx-auto px-4 flex items-center justify-between pointer-events-none z-20">
        {/* Mobile Viewport Team Switcher (< 1080px) */}
        {isMobile && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 flex p-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 shadow-xl pointer-events-auto">
            <button
              type="button"
              onClick={() => setMobileTab('blue')}
              className={`px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                mobileTab === 'blue'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BLUE FARM
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('red')}
              className={`px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                mobileTab === 'red'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RED FARM
            </button>
          </div>
        )}

        {/* ── LEFT: BLUE FARM CONTROL STATION ── */}
        <div
          className={`transition-all duration-300 ${
            isMobile && mobileTab !== 'blue' ? 'hidden' : 'block'
          }`}
        >
          <TeamFarmConsole teamId="blue" />
        </div>

        {/* ── RIGHT: RED FARM CONTROL STATION ── */}
        <div
          className={`transition-all duration-300 ${
            isMobile && mobileTab !== 'red' ? 'hidden' : 'block'
          }`}
        >
          <TeamFarmConsole teamId="red" />
        </div>
      </main>

      {/* ── BOTTOM STATUS BAR & CROP GROWTH TIMELINE ── */}
      <FarmBottomBar />

      {/* ── MODALS & VICTORY OVERLAYS ── */}
      <FarmClockTransitionOverlay />
      <FarmBriefingModal />
      <FarmVictoryOverlay />
    </div>
  );
};
