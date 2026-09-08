// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Main Game Orchestrator
// Coordinates 3D Island Hub, Isolated 3D Activity Studio,
// Two-Team Operator Consoles, and Flow State Machine
// ============================================================

'use client';

import React, { useEffect } from 'react';
import { useCarnivalStore } from '../store/carnivalStore';
import { CarnivalHUD, ActivityShell } from '../ui';
import { CarnivalIslandScene } from '../world/CarnivalIslandScene';
import { ActivityStudioScene } from '../world/ActivityStudioScene';
import { carnivalAudio } from '../audio/CarnivalAudioManager';
import { Star } from 'lucide-react';

export const CarnivalGame: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleFirstTouch = () => {
      carnivalAudio.startBGM();
      window.removeEventListener('pointerdown', handleFirstTouch);
    };
    window.addEventListener('pointerdown', handleFirstTouch);
    return () => {
      window.removeEventListener('pointerdown', handleFirstTouch);
      carnivalAudio.stopBGM();
    };
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* ── 1. Top Neo-Brutalist Carnival HUD ── */}
      <CarnivalHUD />

      {/* ── 2. Primary 3D Viewport (Strictly Isolated Mode) ── */}
      <div className="absolute inset-0 z-0">
        {activeActivity === 'hub' ? (
          <CarnivalIslandScene />
        ) : (
          <ActivityStudioScene />
        )}
      </div>

      {/* ── 3. Shared Activity Shell (Two-Team Consoles, Step Guide & Modals) ── */}
      <ActivityShell />

      {/* ── 4. Island Hub Bottom Helper Ribbon ── */}
      {activeActivity === 'hub' && (
        <div className="fixed bottom-4 inset-x-0 z-30 flex justify-center pointer-events-none select-none">
          <div className="px-6 py-2.5 rounded-2xl bg-[#FFC928] border-4 border-[#111111] shadow-[5px_5px_0px_#111111] flex items-center gap-2.5">
            <Star className="w-5 h-5 fill-[#E53935] text-[#111111] stroke-[2]" />
            <span className="text-xs sm:text-sm font-black text-[#111111] uppercase tracking-wider text-center">
              Touch any 3D attraction building on the island to begin!
            </span>
            <Star className="w-5 h-5 fill-[#E53935] text-[#111111] stroke-[2]" />
          </div>
        </div>
      )}
    </main>
  );
};

