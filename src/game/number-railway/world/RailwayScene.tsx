// ============================================================
// THE GREAT NUMBER RAILWAY — Main 3D Canvas Scene
// Crystal-Clear Stage-Aware Camera System:
// - Camera positioned in front of track with Station cleanly in background
// - ZERO roof canopy obstruction!
// - Step 1: Smooth close-up on Vehicle Flatbed Carriage
// - Step 2: Smooth close-up on Cargo Box Carriage
// - Step 3: Smooth close-up on Passenger Coach & Platform
// - Step 4: Smooth close-up on Locomotive Engine, Steam & Brakes
// - Step 5: 10-Second High-Graphics Cinematic Journey Tracking
// ============================================================

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRailwayStore } from '../store/railwayStore';
import { ContinuousRailwayTrack, DynamicRailwaySignal } from './RailwayTrack';
import { CartoonTrain } from './Locomotive';
import {
  CartoonStation,
  CartoonPineTree,
  CartoonBush,
  CartoonCloud,
  StorybookGround,
} from './Environment';

// ── Continuous Main Scenic Track Route between Stations ──
export const MAIN_TRACK_POINTS: [number, number, number][] = [
  [0, 0.1, 4],       // Station 1 platform start
  [0, 0.1, -4],
  [-3.5, 0.1, -12],  // Scenic curve past hills
  [-2.5, 0.1, -19],  // Timber Trestle Bridge section
  [3.2, 0.1, -26],   // Mountain Pass / Tunnel section
  [0, 0.1, -33],     // Approach Station 2
  [0, 0.1, -38],     // Station 2 Terminal stop
];

// ── Stage-Aware Cinematic Camera Controller ──
const StageAwareCameraController: React.FC = () => {
  const { camera } = useThree();
  const trainState = useRailwayStore((s) => s.train);
  const phase = useRailwayStore((s) => s.phase);
  const currentStep = useRailwayStore((s) => s.currentStepIndex);

  const curve = useMemo(() => {
    const pts = MAIN_TRACK_POINTS.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  }, []);

  useFrame(() => {
    if (phase === 'train-journey' && curve) {
      // ── 10-Second Dynamic Chase Camera ──
      const t = Math.min(Math.max(trainState.progress, 0), 0.999);
      const trainPos = curve.getPointAt(t);

      // Camera flies slightly behind and above train
      const targetCamPos = new THREE.Vector3(trainPos.x + 4.8, trainPos.y + 3.8, trainPos.z + 6.2);
      const targetLookAt = new THREE.Vector3(trainPos.x, trainPos.y + 0.6, trainPos.z);

      camera.position.lerp(targetCamPos, 0.05);
      camera.lookAt(targetLookAt);
    } else {
      // ── Unobstructed Front-Side Staged Angles per Loading Step ──
      let targetCamPos = new THREE.Vector3(5.2, 3.2, 1.0);
      let targetLookAt = new THREE.Vector3(0, 0.5, -1.8);

      if (currentStep === 1) {
        // Step 1: Vehicle Flatbed Carriage Close-Up
        targetCamPos = new THREE.Vector3(4.5, 2.5, -0.4);
        targetLookAt = new THREE.Vector3(0, 0.4, -2.1);
      } else if (currentStep === 2) {
        // Step 2: Building Materials Cargo Car Close-Up
        targetCamPos = new THREE.Vector3(4.5, 2.5, -2.2);
        targetLookAt = new THREE.Vector3(0, 0.4, -4.0);
      } else if (currentStep === 3) {
        // Step 3: Passenger Coach & Platform Close-Up
        targetCamPos = new THREE.Vector3(4.5, 2.5, -4.2);
        targetLookAt = new THREE.Vector3(0, 0.5, -6.0);
      } else if (currentStep === 4) {
        // Step 4: Locomotive Engine, Wheels & Steam Close-Up
        targetCamPos = new THREE.Vector3(4.5, 2.4, 2.2);
        targetLookAt = new THREE.Vector3(0, 0.6, 0.2);
      } else if (currentStep === 5) {
        // Step 5: Full Train Overview & Green Semaphore Signal
        targetCamPos = new THREE.Vector3(6.0, 4.0, 3.0);
        targetLookAt = new THREE.Vector3(0, 0.6, -1.5);
      }

      camera.position.lerp(targetCamPos, 0.04);
      camera.lookAt(targetLookAt);
    }
  });

  return null;
};

// ── 3D Scene Composition ──
const CartoonRailwayWorld: React.FC = () => {
  const signalState = useRailwayStore((s) => s.signalState);
  const currentStationIdx = useRailwayStore((s) => s.currentStationIndex);
  const stations = useRailwayStore((s) => s.stations);

  return (
    <>
      {/* ── Warm Sunlit Lighting ── */}
      <ambientLight intensity={0.8} color="#fffbeb" />
      <directionalLight
        position={[14, 22, 14]}
        intensity={1.4}
        color="#fffdf5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-10, 14, -8]} intensity={0.4} color="#bae6fd" />
      <hemisphereLight args={['#38bdf8', '#65a30d', 0.55]} />

      {/* ── Ground & Ballast ── */}
      <StorybookGround />

      {/* ── Floating 3D Cartoon Clouds ── */}
      <CartoonCloud position={[-18, 14, -20]} speed={0.8} scale={1.2} />
      <CartoonCloud position={[8, 16, -30]} speed={0.5} scale={1.4} />
      <CartoonCloud position={[22, 13, -10]} speed={0.6} scale={1.0} />
      <CartoonCloud position={[-8, 15, 5]} speed={0.7} scale={1.1} />

      {/* ── Station 1: Sunny Valley Central (Placed on LEFT side of track at X = -2.2) ── */}
      <CartoonStation
        position={[-2.2, 0, -2.0]}
        name={stations[0]?.name || 'Sunny Valley Central'}
        isCurrentStation={currentStationIdx === 0}
        isNextDestination={currentStationIdx !== 0}
      />

      {/* ── Station 2: Pine Ridge Terminal (Destination Station at X = -2.2, Z = -35) ── */}
      <CartoonStation
        position={[-2.2, 0, -35]}
        name={stations[1]?.name || 'Pine Ridge Terminal'}
        isCurrentStation={currentStationIdx === 1}
        isNextDestination={currentStationIdx === 0}
      />

      {/* ── Semaphore Signals ── */}
      <DynamicRailwaySignal position={[1.4, 0, 2.2]} signalState={signalState} />
      <DynamicRailwaySignal position={[1.4, 0, -34]} signalState={signalState} />

      {/* ── Continuous Railway Tracks ── */}
      <ContinuousRailwayTrack
        controlPoints={MAIN_TRACK_POINTS}
        active={true}
        hasBridge={true}
        hasTunnel={true}
      />

      {/* ── Hero Cartoon Locomotive & 3 Loaded Carriages ── */}
      <CartoonTrain trackPoints={MAIN_TRACK_POINTS} />

      {/* ── Scenic Forest Trees ── */}
      <CartoonPineTree position={[-5.8, 0, -2]} scale={1.3} />
      <CartoonPineTree position={[-6.8, 0, 3]} scale={1.1} />
      <CartoonPineTree position={[-7.2, 0, -8]} scale={1.5} />
      <CartoonPineTree position={[5.8, 0, -5]} scale={1.2} />
      <CartoonPineTree position={[6.5, 0, 4]} scale={1.0} />

      {/* Trackside Forest */}
      <CartoonPineTree position={[-7.5, 0, -14]} scale={1.4} />
      <CartoonPineTree position={[-8.5, 0, -20]} scale={1.6} />
      <CartoonPineTree position={[6.2, 0, -16]} scale={1.3} />
      <CartoonPineTree position={[7.0, 0, -24]} scale={1.5} />

      {/* Station 2 Forest */}
      <CartoonPineTree position={[-5.8, 0, -30]} scale={1.4} />
      <CartoonPineTree position={[-6.5, 0, -37]} scale={1.2} />
      <CartoonPineTree position={[5.8, 0, -32]} scale={1.3} />
      <CartoonPineTree position={[6.8, 0, -38]} scale={1.5} />

      {/* Cartoon Bushes */}
      <CartoonBush position={[-3.8, 0, 1.8]} scale={1.1} />
      <CartoonBush position={[-4.2, 0, -4.5]} scale={1.3} />
      <CartoonBush position={[3.8, 0, 1.5]} scale={1.0} />
      <CartoonBush position={[-4.2, 0, -22]} scale={1.3} />
      <CartoonBush position={[4.5, 0, -28]} scale={1.2} />
    </>
  );
};

export const RailwayScene: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [5.2, 3.2, 1.0], fov: 42, near: 0.1, far: 200 }}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 60%, #bae6fd 100%)',
      }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <StageAwareCameraController />
      <CartoonRailwayWorld />
    </Canvas>
  );
};
