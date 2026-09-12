// ============================================================
// PATTERN RACERS — Main 3D Scene & Dynamic Camera Rig
// Daylight 3D Mathematical Grand Prix Facility:
// - Elevated 3/4 Panoramic Camera with Smooth Round Framing
// - Parallax Pointer Rig with Environmental Depth
// - Real-time Vehicle Tracking During Grand Prix Race Simulation
// ============================================================

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DaylightFacilityEnvironment3D } from './DaylightFacilityEnvironment3D';
import { GrandPrixTrack3D } from './GrandPrixTrack3D';
import { RaceVehicle3D } from './RaceVehicle3D';
import { FunctionMachine3D } from './FunctionMachine3D';
import { TrackBuilderMachine3D } from './TrackBuilderMachine3D';
import { FacilityWorkers3D } from './FacilityWorkers3D';
import { usePatternStore } from '../store/patternStore';

const CameraRig: React.FC = () => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const phase = usePatternStore((s) => s.phase);
  const blueVehicle = usePatternStore((s) => s.blueVehicle);
  const redVehicle = usePatternStore((s) => s.redVehicle);

  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame((state, delta) => {
    const pointer = state.pointer;
    const isRacing = phase === 'grand_prix_race';

    let targetCamPos = new THREE.Vector3(0, 9, 14);
    let targetLook = new THREE.Vector3(0, 1.2, 0);

    if (isRacing) {
      // Dynamic chase camera tracking both vehicles
      const avgZ = (blueVehicle.worldPosition[2] + redVehicle.worldPosition[2]) / 2;
      targetCamPos = new THREE.Vector3(0, 6.5, avgZ + 11);
      targetLook = new THREE.Vector3(0, 1.0, avgZ - 4);
    } else if (currentRound === 1) {
      // Elevated start view
      targetCamPos = new THREE.Vector3(0 + pointer.x * 0.8, 8.5 + pointer.y * 0.5, 13);
      targetLook = new THREE.Vector3(0, 1.0, 3);
    } else if (currentRound === 2) {
      // Framed toward Track Builder machine
      targetCamPos = new THREE.Vector3(-1.5 + pointer.x * 0.8, 7.8 + pointer.y * 0.5, 9.5);
      targetLook = new THREE.Vector3(-1.5, 1.2, -1);
    } else if (currentRound === 3 || currentRound === 4) {
      // Dolly into Function Machine
      targetCamPos = new THREE.Vector3(0 + pointer.x * 0.8, 6.2 + pointer.y * 0.5, 4.2);
      targetLook = new THREE.Vector3(0, 1.8, -6.5);
    } else if (currentRound === 5) {
      // Wide Championship Grid View
      targetCamPos = new THREE.Vector3(0 + pointer.x * 0.8, 9.5 + pointer.y * 0.5, 8.5);
      targetLook = new THREE.Vector3(0, 1.5, -12);
    }

    state.camera.position.lerp(targetCamPos, delta * 2.5);
    targetLookAt.current.lerp(targetLook, delta * 3.0);
    state.camera.lookAt(targetLookAt.current);
  });

  return null;
};

export const PatternRacersScene3D: React.FC = () => {
  const blueVehicle = usePatternStore((s) => s.blueVehicle);
  const redVehicle = usePatternStore((s) => s.redVehicle);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [0, 9, 14], fov: 48, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <color attach="background" args={['#e0f2fe']} />
        <fog attach="fog" args={['#e0f2fe', 35, 95]} />

        {/* Dynamic Camera Rig */}
        <CameraRig />

        {/* ── 3D WORLD ASSETS ── */}
        <DaylightFacilityEnvironment3D />
        <GrandPrixTrack3D />
        <FunctionMachine3D />
        <TrackBuilderMachine3D />
        <FacilityWorkers3D />

        {/* ── DUAL TEAM RACE VEHICLES ── */}
        <RaceVehicle3D
          teamId="blue"
          position={blueVehicle.worldPosition}
          boostActive={blueVehicle.boostActive}
          isRacing={blueVehicle.isRacing}
          speed={blueVehicle.speed}
        />
        <RaceVehicle3D
          teamId="red"
          position={redVehicle.worldPosition}
          boostActive={redVehicle.boostActive}
          isRacing={redVehicle.isRacing}
          speed={redVehicle.speed}
        />
      </Canvas>
    </div>
  );
};
