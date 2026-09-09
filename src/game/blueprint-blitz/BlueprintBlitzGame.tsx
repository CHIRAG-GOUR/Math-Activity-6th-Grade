'use client';

// ============================================================
// BLUEPRINT BLITZ — Root Game Orchestrator & 3D Canvas
// Grade 6 Shapes, Area & Volume Multi-player Construction Game
// ============================================================

import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useBlueprintStore } from './store/blueprintStore';
import { ConstructionDistrict3D } from './world/ConstructionDistrict3D';
import { BlueprintCameraRig } from './world/BlueprintCameraRig';
import { BlueprintHUD } from './ui/BlueprintHUD';
import { blueprintAudio } from './audio/blueprintAudio';
import './blueprint-theme.css';

export const BlueprintBlitzGame: React.FC = () => {
  const initGame = useBlueprintStore((state) => state.initGame);

  useEffect(() => {
    initGame();
    return () => {
      blueprintAudio.stopBgm();
    };
  }, [initGame]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* ── 3D THREE.JS CANVAS (Center 60-65% Gameplay Arena) ── */}
      <Canvas
        shadows
        camera={{ position: [0, 11, 20], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        className="w-full h-full"
      >
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 30, 75]} />

        {/* 3D District Scene & Buildings */}
        <ConstructionDistrict3D />

        {/* Dynamic Smooth Parallax Camera Rig */}
        <BlueprintCameraRig />
      </Canvas>

      {/* ── HIGH-CONTRAST OPAQUE ARCADE HUD (Left: Blue, Right: Red) ── */}
      <BlueprintHUD />
    </div>
  );
};
