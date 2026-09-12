// ============================================================
// PATTERN RACERS — Main 3D Scene & Cinematic Camera Engine
// Strict 5-Round Physical Camera Progression:
// - Round 1: Wide shot of Garages & both cars inside
// - Round 1->2 Transition: Camera glides with cars as they exit garage to pit lane
// - Round 2: Focused view of Pit Service Area with mechanics inspecting tires
// - Round 2->3 Transition: Camera glides with cars moving onto starting grid
// - Round 3-4: Dramatic three-quarter grid view showing revving cars & starting lamps
// - Round 5 & Countdown: Dynamic grid-to-track broadcast chase camera
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
import { PerformanceCollector } from '../ui/PerformanceMonitorOverlay';
import { usePatternStore } from '../store/patternStore';

// ── 0. CENTRAL 60 FPS PHYSICS DRIVER ──
const CentralPhysicsDriver: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const updateRacePhysics = usePatternStore((s) => s.updateRacePhysics);

  useFrame((_, delta) => {
    if (phase === 'grand_prix_race') {
      updateRacePhysics(delta);
    }
  });

  return null;
};

// ── 1. CINEMATIC CAMERA RIG (Follows the 5-Round Continuous Physical Journey) ──
const CinematicCameraRig: React.FC = () => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const phase = usePatternStore((s) => s.phase);
  const blueVehicle = usePatternStore((s) => s.blueVehicle);
  const redVehicle = usePatternStore((s) => s.redVehicle);

  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame((state, delta) => {
    const pointer = state.pointer;
    let targetCamPos = new THREE.Vector3(0, 5.2, 32);
    let targetLook = new THREE.Vector3(0, 1.2, 20);

    // ── ROUND 1: GARAGES (Wide shot showing both cars in garages) ──
    if (currentRound === 1 && phase === 'round_active') {
      targetCamPos = new THREE.Vector3(pointer.x * 1.5, 5.2 + pointer.y * 0.5, 32);
      targetLook = new THREE.Vector3(0, 1.2, 20);
    }
    // ── ROUND 1->2 TRANSITION: CARS DRIVING TO PIT LANE ──
    else if (currentRound === 1 && phase === 'phase_transition') {
      const avgZ = (blueVehicle.worldPosition[2] + redVehicle.worldPosition[2]) / 2;
      targetCamPos = new THREE.Vector3(0, 4.8, avgZ + 9);
      targetLook = new THREE.Vector3(0, 1.2, avgZ - 6);
    }
    // ── ROUND 2: PIT INSPECTION & TYRE CHECK ──
    else if (currentRound === 2 && phase === 'round_active') {
      targetCamPos = new THREE.Vector3(pointer.x * 1.2, 4.2 + pointer.y * 0.4, 22);
      targetLook = new THREE.Vector3(0, 1.2, 12);
    }
    // ── ROUND 2->3 TRANSITION: CARS DRIVING TO STARTING GRID ──
    else if (currentRound === 2 && phase === 'phase_transition') {
      const avgZ = (blueVehicle.worldPosition[2] + redVehicle.worldPosition[2]) / 2;
      targetCamPos = new THREE.Vector3(0, 4.2, avgZ + 8);
      targetLook = new THREE.Vector3(0, 1.2, avgZ - 5);
    }
    // ── ROUND 3 & 4: STARTING GRID REVVING & SIGNAL LIGHTS ──
    else if ((currentRound === 3 || currentRound === 4) && phase === 'round_active') {
      targetCamPos = new THREE.Vector3(pointer.x * 1.5, 3.8 + pointer.y * 0.4, 14);
      targetLook = new THREE.Vector3(0, 1.2, 0);
    }
    // ── ROUND 5: FINAL LAUNCH CHALLENGE & 3-2-1 COUNTDOWN ──
    else if (currentRound === 5 && (phase === 'round_active' || phase === 'pre_race_countdown')) {
      targetCamPos = new THREE.Vector3(0, 3.8, 13.5);
      targetLook = new THREE.Vector3(0, 1.2, 0);
    }
    // ── STAGE 5: LIVE GRAND PRIX RACE (Dynamic Chase Cam) ──
    else if (phase === 'grand_prix_race') {
      const avgZ = (blueVehicle.worldPosition[2] + redVehicle.worldPosition[2]) / 2;
      const avgX = (blueVehicle.worldPosition[0] + redVehicle.worldPosition[0]) / 2;
      const isNitro = blueVehicle.boostActive || redVehicle.boostActive;

      const camDist = isNitro ? 9.2 : 7.6;
      const camHeight = isNitro ? 3.0 : 3.6;

      targetCamPos = new THREE.Vector3(avgX + pointer.x * 0.5, camHeight + pointer.y * 0.3, avgZ + camDist);
      targetLook = new THREE.Vector3(avgX * 0.7, 1.2, avgZ - 14);
    }

    // Smooth camera lerp
    state.camera.position.lerp(targetCamPos, delta * 3.5);
    targetLookAt.current.lerp(targetLook, delta * 4.0);
    state.camera.lookAt(targetLookAt.current);
  });

  return null;
};

// ── 2. DEDICATED TEAM CHASE CAMERA (For Split Viewport Mode) ──
const DedicatedChaseCameraRig: React.FC<{ focusTeam: 'blue' | 'red' }> = ({ focusTeam }) => {
  const blueVehicle = usePatternStore((s) => s.blueVehicle);
  const redVehicle = usePatternStore((s) => s.redVehicle);
  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame((state, delta) => {
    const veh = focusTeam === 'blue' ? blueVehicle : redVehicle;
    const isNitro = veh.boostActive;

    const targetPos = new THREE.Vector3(
      veh.worldPosition[0],
      isNitro ? 2.8 : 3.4,
      veh.worldPosition[2] + (isNitro ? 8.5 : 7.0)
    );
    const targetLook = new THREE.Vector3(veh.worldPosition[0], 1.1, veh.worldPosition[2] - 16);

    state.camera.position.lerp(targetPos, delta * 5.5);
    targetLookAt.current.lerp(targetLook, delta * 6.0);
    state.camera.lookAt(targetLookAt.current);
  });

  return null;
};

// ── 3. WORLD CONTENT (Shared across viewports) ──
const WorldContent: React.FC = () => {
  const blueVehicle = usePatternStore((s) => s.blueVehicle);
  const redVehicle = usePatternStore((s) => s.redVehicle);

  return (
    <>
      <DaylightFacilityEnvironment3D />
      <GrandPrixTrack3D />
      <FunctionMachine3D />
      <FacilityWorkers3D />

      {/* ── TWO HERO FORMULA RACE CARS (BLUE & RED) ── */}
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
    </>
  );
};

export const PatternRacersScene3D: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const splitViewMode = usePatternStore((s) => s.splitViewMode);

  const isRaceActive = phase === 'grand_prix_race';

  // If in Live Race Mode and Split View is active -> Side-by-Side Dual Viewport
  if (isRaceActive && splitViewMode) {
    return (
      <div className="w-full h-full flex flex-row relative select-none overflow-hidden bg-slate-950">
        {/* LEFT VIEWPORT: BLUE TEAM CHASE CAM */}
        <div className="w-1/2 h-full relative border-r-2 border-cyan-400 shadow-[inset_-10px_0_20px_rgba(37,99,235,0.3)]">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [-2.0, 3.8, 14], fov: 52, near: 0.1, far: 320 }}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
          >
            <CentralPhysicsDriver />
            <DedicatedChaseCameraRig focusTeam="blue" />
            <WorldContent />
          </Canvas>

          <div className="absolute top-16 left-4 z-20 pointer-events-none bg-blue-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-blue-400/60 text-[11px] font-black text-blue-200 uppercase tracking-widest shadow-md flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span>BLUE VELOCITY #01</span>
          </div>
        </div>

        {/* RIGHT VIEWPORT: RED TEAM CHASE CAM */}
        <div className="w-1/2 h-full relative border-l-2 border-red-500 shadow-[inset_10px_0_20px_rgba(220,38,38,0.3)]">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [2.0, 3.8, 14], fov: 52, near: 0.1, far: 320 }}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
          >
            <DedicatedChaseCameraRig focusTeam="red" />
            <WorldContent />
          </Canvas>

          <div className="absolute top-16 right-4 z-20 pointer-events-none bg-red-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-red-400/60 text-[11px] font-black text-red-200 uppercase tracking-widest shadow-md flex items-center gap-1.5">
            <span>RED TURBO #02</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          </div>
        </div>

        {/* Center Split Screen Glowing Divider Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-amber-400 via-white to-amber-400 shadow-[0_0_15px_#f59e0b] pointer-events-none z-20" />
      </div>
    );
  }

  // Single Wide Viewport (For Questions 1-5 & Fullscreen Camera)
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 5.2, 32], fov: 48, near: 0.1, far: 320 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <PerformanceCollector />
        <CentralPhysicsDriver />
        <CinematicCameraRig />
        <WorldContent />
      </Canvas>
    </div>
  );
};
