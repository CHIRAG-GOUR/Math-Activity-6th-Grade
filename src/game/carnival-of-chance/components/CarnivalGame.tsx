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

export const CarnivalGame: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleFirstTouch = () => {
      carnivalAudio.setMode(activeActivity === 'hub' ? 'hub' : 'game');
      window.removeEventListener('pointerdown', handleFirstTouch);
    };
    window.addEventListener('pointerdown', handleFirstTouch);
    return () => {
      window.removeEventListener('pointerdown', handleFirstTouch);
      carnivalAudio.stopBGM();
    };
  }, []);

  // Switch BGM dynamically when transitioning between Island Hub and Mini-Games
  useEffect(() => {
    carnivalAudio.setMode(activeActivity === 'hub' ? 'hub' : 'game');
  }, [activeActivity]);

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
    </main>
  );
};

