// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Main Game Orchestrator
// Coordinates 3D Island Hub, Isolated 3D Activity Studio,
// Dual-Team Operator Consoles, and Flow Overlays
// ============================================================

'use client';

import React, { useEffect } from 'react';
import { useCarnivalStore } from '../store/carnivalStore';
import { CarnivalHUD } from './CarnivalHUD';
import { CarnivalIslandScene } from '../world/CarnivalIslandScene';
import { ActivityStudioScene } from '../world/ActivityStudioScene';
import { TeamOperatorConsoles } from './TeamOperatorConsole';
import { ActivityFlowOverlays } from './ActivityFlowOverlays';
import { carnivalAudio } from '../audio/CarnivalAudioManager';
import { Sparkles, Star } from 'lucide-react';

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
      {/* ── 1. Top HUD Header Bar ── */}
      <CarnivalHUD />

      {/* ── 2. Primary 3D Viewport (Strictly Isolated Mode) ── */}
      <div className="absolute inset-0 z-0">
        {activeActivity === 'hub' ? (
          <CarnivalIslandScene />
        ) : (
          <ActivityStudioScene />
        )}
      </div>

      {/* ── 3. Dual-Team Operator Consoles (Active inside Attraction) ── */}
      {activeActivity !== 'hub' && <TeamOperatorConsoles />}

      {/* ── 4. Flow Modals & Reasoning Overlays ── */}
      {activeActivity !== 'hub' && <ActivityFlowOverlays />}

      {/* ── 5. Island Hub Bottom Helper Ribbon ── */}
      {activeActivity === 'hub' && (
        <div className="fixed bottom-4 inset-x-0 z-30 flex justify-center pointer-events-none select-none">
          <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-100 via-white to-amber-100 border-3 border-amber-400 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex items-center gap-2.5">
            <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide text-center">
              Touch any 3D attraction building on the island to begin!
            </span>
            <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
          </div>
        </div>
      )}
    </main>
  );
};
