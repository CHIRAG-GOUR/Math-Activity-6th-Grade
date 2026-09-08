// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Activity Studio 3D Scene
// Isolated studio staging for the active physical machine:
// - ONLY the selected 3D machine is mounted & rendered
// - Studio spotlighting & soft shadows
// - Close-up cinematic camera framing with zero background contamination
// ============================================================

'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../store/carnivalStore';
import { MysteryBagMachine3D } from './machines/MysteryBagMachine3D';
import { OddsWheelMachine3D } from './machines/OddsWheelMachine3D';
import { BallDropMachine3D } from './machines/BallDropMachine3D';
import { ProbabilityLabMachine3D } from './machines/ProbabilityLabMachine3D';
import { GameBuilderMachine3D } from './machines/GameBuilderMachine3D';
import { GrandCarnivalMachine3D } from './machines/GrandCarnivalMachine3D';

export const ActivityStudioScene: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 2.0, 10.5], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
        }}
      >
        <color attach="background" args={['#BAE6FD']} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.8} color="#ffffff" />
        <directionalLight
          position={[6, 12, 8]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color="#fffbeb"
        />
        <directionalLight position={[-6, 6, -4]} intensity={0.4} color="#38bdf8" />

        {/* Soft Ground Floor */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <cylinderGeometry args={[12, 12, 0.2, 36]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
        </mesh>

        {/* Conditional Rendering: Strictly Isolated Active Machine */}
        {activeActivity === 'mystery-bag' && <MysteryBagMachine3D />}
        {activeActivity === 'odds-wheel' && <OddsWheelMachine3D />}
        {activeActivity === 'ball-drop' && <BallDropMachine3D />}
        {activeActivity === 'probability-lab' && <ProbabilityLabMachine3D />}
        {activeActivity === 'game-builder' && <GameBuilderMachine3D />}
        {activeActivity === 'grand-carnival' && <GrandCarnivalMachine3D />}
      </Canvas>
    </div>
  );
};
