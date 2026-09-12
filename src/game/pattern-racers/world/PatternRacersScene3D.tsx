// ============================================================
// PATTERN RACERS — Main 3D Scene & Dynamic Camera Rig
// 5-Stage Cinematic Grand Prix Facility:
// - Stage 1: Garage Diagnostics & Telemetry
// - Stage 2: Rapid Pit Stop Tire Change & Hydraulic Lift
// - Stage 3: Factory Rollout onto Pit Lane
// - Stage 4: Starting Grid Lineup & Stadium Perspective
// - Stage 5: High-Speed Grand Prix Chase Camera
// ============================================================

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DaylightFacilityEnvironment3D } from './DaylightFacilityEnvironment3D';
import { GrandPrixTrack3D } from './GrandPrixTrack3D';
import { RaceVehicle3D } from './RaceVehicle3D';
import { FunctionMachine3D } from './FunctionMachine3D';
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
    const isRacing = phase === 'grand_prix_race' || currentRound === 5;

    let targetCamPos = new THREE.Vector3(0, 8, 14);
    let targetLook = new THREE.Vector3(0, 1.2, 0);

    if (isRacing) {
      // Dynamic chase camera tracking both vehicles along the curving track
      const avgZ = (blueVehicle.worldPosition[2] + redVehicle.worldPosition[2]) / 2;
      const avgX = (blueVehicle.worldPosition[0] + redVehicle.worldPosition[0]) / 2;
      const isNitro = blueVehicle.boostActive || redVehicle.boostActive;

      // Follow behind the cars based on road angle
      const camDist = isNitro ? 10.5 : 8.8;
      const camHeight = isNitro ? 3.6 : 4.4;

      targetCamPos = new THREE.Vector3(avgX + pointer.x * 0.5, camHeight + pointer.y * 0.3, avgZ + camDist);
      targetLook = new THREE.Vector3(avgX * 0.8, 1.3, avgZ - 12);
    } else if (currentRound === 1) {
      // Stage 1: Close inspection inside garage / pit bays
      targetCamPos = new THREE.Vector3(0 + pointer.x * 0.8, 5.2 + pointer.y * 0.4, 9.5);
      targetLook = new THREE.Vector3(0, 0.9, 4.5);
    } else if (currentRound === 2) {
      // Stage 2: Low tactical view of tire change and hydraulic lifts
      targetCamPos = new THREE.Vector3(0 + pointer.x * 0.8, 4.0 + pointer.y * 0.4, 8.8);
      targetLook = new THREE.Vector3(0, 0.8, 4.5);
    } else if (currentRound === 3) {
      // Stage 3: Factory rollout onto pit apron
      targetCamPos = new THREE.Vector3(-2.5 + pointer.x * 0.8, 6.0 + pointer.y * 0.4, 11.5);
      targetLook = new THREE.Vector3(0, 1.2, 4.0);
    } else if (currentRound === 4) {
      // Stage 4: Epic low-angle view from grid looking down the stadium straight towards finish line
      targetCamPos = new THREE.Vector3(0 + pointer.x * 0.6, 3.8 + pointer.y * 0.3, 10.5);
      targetLook = new THREE.Vector3(0, 2.0, -45);
    }

    state.camera.position.lerp(targetCamPos, delta * 3.5);
    targetLookAt.current.lerp(targetLook, delta * 4.0);
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
        camera={{ position: [0, 8, 14], fov: 48, near: 0.1, far: 250 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <color attach="background" args={['#e0f2fe']} />
        <fog attach="fog" args={['#e0f2fe', 45, 120]} />

        {/* Dynamic Camera Rig */}
        <CameraRig />

        {/* ── 3D WORLD ASSETS ── */}
        <DaylightFacilityEnvironment3D />
        <GrandPrixTrack3D />
        <FunctionMachine3D />
        <FacilityWorkers3D />

        {/* ── DUAL TEAM FORMULA RACE VEHICLES ── */}
        <RaceVehicle3D
          teamId="blue"
          position={blueVehicle.worldPosition}
          rotationY={blueVehicle.rotationY}
          boostActive={blueVehicle.boostActive}
          isRacing={blueVehicle.isRacing}
          speed={blueVehicle.speed}
        />
        <RaceVehicle3D
          teamId="red"
          position={redVehicle.worldPosition}
          rotationY={redVehicle.rotationY}
          boostActive={redVehicle.boostActive}
          isRacing={redVehicle.isRacing}
          speed={redVehicle.speed}
        />
      </Canvas>
    </div>
  );
};
