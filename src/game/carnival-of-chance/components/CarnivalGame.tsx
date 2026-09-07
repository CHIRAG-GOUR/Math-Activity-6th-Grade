// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Main Game Orchestrator
// Full 3D Interactive Carnival Island with Dual-Team Touchscreens
// ============================================================

'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useCarnivalStore } from '../store/carnivalStore';
import { CarnivalHUD } from './CarnivalHUD';
import { TeamConsoles } from './TeamConsoles';
import { TrialExperimentRunner } from './TrialExperimentRunner';
import {
  TitleScreenOverlay,
  AttractionIntroModal,
  ObservationReasoningOverlay,
  GrandCelebrationOverlay,
} from './CarnivalOverlays';
import { soundManager } from '@/utils/audio';

const CarnivalIslandScene = dynamic(
  () => import('../world/CarnivalIslandScene').then((m) => ({ default: m.CarnivalIslandScene })),
  { ssr: false }
);

export const CarnivalGame: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);

  // Audio isolation: stop other activities' BGM on mount and cleanup on unmount
  useEffect(() => {
    soundManager.stopBgm();
    soundManager.stopRailwayBgm();
    return () => {
      soundManager.stopBgm();
      soundManager.stopRailwayBgm();
      soundManager.stopTrainRunningAudio();
    };
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none font-sans bg-sky-300">
      {/* ── 1. Full-Bleed 3D Carnival Island Canvas ── */}
      <div className="absolute inset-0 z-0">
        <CarnivalIslandScene />
      </div>

      {/* ── 2. Top Navigation & Progress HUD ── */}
      <CarnivalHUD />

      {/* ── 3. Dual-Team Touchscreen Consoles (Left: Blue, Right: Red) ── */}
      <TeamConsoles />

      {/* ── 4. Interactive Experimental Trial Runner (10/50 Trials) ── */}
      <TrialExperimentRunner />

      {/* ── 5. Modals & Overlays ── */}
      <TitleScreenOverlay />
      <AttractionIntroModal />
      <ObservationReasoningOverlay />
      <GrandCelebrationOverlay />
    </main>
  );
};
