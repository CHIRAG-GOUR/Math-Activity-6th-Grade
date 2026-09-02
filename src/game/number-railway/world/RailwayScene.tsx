// ============================================================
// THE GREAT NUMBER RAILWAY — Main 3D Canvas Scene
// Dynamic Stage-Aware Camera System:
// - Step 1: Frames Vehicle Flatbed Car as cars/trucks load
// - Step 2: Frames Cargo Box Car as building materials stack
// - Step 3: Frames Passenger Coach as people board & windows light up
// - Step 4: Frames Locomotive Engine as brakes lift & steam builds
// - Step 5: Panoramic departure & smooth tracking to next station
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
  [0, 0.1, 3],       // Sunny Valley Central platform start
  [0, 0.1, -4],
  [-3.0, 0.1, -11],  // Smooth curve past hills
  [-2.0, 0.1, -18],  // Trestle Bridge section
  [3.0, 0.1, -25],   // Mountain Pass / Tunnel section
  [0, 0.1, -31],     // Approach Pine Ridge Platform
  [0, 0.1, -35],     // Pine Ridge Terminal stop
];

// ── Dynamic Stage-Aware Cinematic Camera Controller ──
const DynamicStageCameraController: React.FC = () => {
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
      // ── Train Journey Mode: Smooth Dynamic Tracking ──
      const t = Math.min(Math.max(trainState.progress, 0), 0.99);
      const trainPos = curve.getPointAt(t);

      const targetCamPos = new THREE.Vector3(trainPos.x + 5.5, trainPos.y + 5.0, trainPos.z + 7.5);
      const targetLookAt = new THREE.Vector3(trainPos.x, trainPos.y + 0.8, trainPos.z);

      camera.position.lerp(targetCamPos, 0.06);
      camera.lookAt(targetLookAt);
    } else {
      // ── Staged Camera Angles per Loading Step ──
      let targetCamPos = new THREE.Vector3(6.5, 5.0, 3.5);
      let targetLookAt = new THREE.Vector3(0, 0.6, -1.5);

      if (currentStep === 1) {
        // Step 1: Focus on Vehicle Flatbed Carriage
        targetCamPos = new THREE.Vector3(5.8, 4.2, 1.2);
        targetLookAt = new THREE.Vector3(0, 0.5, -1.8);
      } else if (currentStep === 2) {
        // Step 2: Focus on Building Materials Cargo Car
        targetCamPos = new THREE.Vector3(5.8, 4.2, -0.4);
        targetLookAt = new THREE.Vector3(0, 0.5, -3.4);
      } else if (currentStep === 3) {
        // Step 3: Focus on Passenger Coach & Boarding Platform
        targetCamPos = new THREE.Vector3(5.5, 4.2, -1.8);
        targetLookAt = new THREE.Vector3(0, 0.6, -5.1);
      } else if (currentStep === 4) {
        // Step 4: Focus on Locomotive Engine, Steam & Brakes
        targetCamPos = new THREE.Vector3(5.5, 3.8, 3.2);
        targetLookAt = new THREE.Vector3(0, 0.7, 0.4);
      } else if (currentStep === 5) {
        // Step 5: Wide overview showing Green Signal & Full Train Ready to Depart
        targetCamPos = new THREE.Vector3(7.5, 5.8, 4.5);
        targetLookAt = new THREE.Vector3(0, 0.8, -1.5);
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
      {/* ── Sunlit Daylight Lighting ── */}
      <ambientLight intensity={0.75} color="#fffbeb" />
      <directionalLight
        position={[15, 24, 14]}
        intensity={1.3}
        color="#fffdf5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-10, 14, -8]} intensity={0.4} color="#bae6fd" />
      <hemisphereLight args={['#38bdf8', '#65a30d', 0.5]} />

      {/* ── Ground & Ballast Layer ── */}
      <StorybookGround />

      {/* ── 3D Floating Cartoon Clouds ── */}
      <CartoonCloud position={[-18, 14, -20]} speed={0.8} scale={1.2} />
      <CartoonCloud position={[8, 16, -30]} speed={0.5} scale={1.4} />
      <CartoonCloud position={[22, 13, -10]} speed={0.6} scale={1.0} />
      <CartoonCloud position={[-8, 15, 5]} speed={0.7} scale={1.1} />

      {/* ── Station 1: Sunny Valley Central (Origin Station at X = 2.5) ── */}
      <CartoonStation
        position={[2.5, 0, 0]}
        name={stations[0]?.name || 'Sunny Valley Central'}
        isCurrentStation={currentStationIdx === 0}
        isNextDestination={currentStationIdx !== 0}
      />

      {/* ── Station 2: Pine Ridge Terminal (Destination Station at X = 2.5, Z = -34) ── */}
      <CartoonStation
        position={[2.5, 0, -34]}
        name={stations[1]?.name || 'Pine Ridge Terminal'}
        isCurrentStation={currentStationIdx === 1}
        isNextDestination={currentStationIdx === 0}
      />

      {/* ── Semaphore Signals ── */}
      <DynamicRailwaySignal position={[-1.6, 0, 2.0]} signalState={signalState} />
      <DynamicRailwaySignal position={[-1.6, 0, -32]} signalState={signalState} />

      {/* ── Continuous Railway Tracks ── */}
      <ContinuousRailwayTrack
        controlPoints={MAIN_TRACK_POINTS}
        active={true}
        hasBridge={true}
        hasTunnel={true}
      />

      {/* ── Hero Cartoon Locomotive & 3 Loaded Carriages ── */}
      <CartoonTrain trackPoints={MAIN_TRACK_POINTS} />

      {/* ── Layered Cartoon Pine Trees & Foliage ── */}
      <CartoonPineTree position={[-5.2, 0, -2]} scale={1.3} />
      <CartoonPineTree position={[-6.5, 0, 3]} scale={1.1} />
      <CartoonPineTree position={[-6.8, 0, -7]} scale={1.5} />
      <CartoonPineTree position={[6.5, 0, -3]} scale={1.2} />
      <CartoonPineTree position={[7.2, 0, 4]} scale={1.0} />

      {/* Trackside Scenic Forest */}
      <CartoonPineTree position={[-7.2, 0, -13]} scale={1.4} />
      <CartoonPineTree position={[-8.2, 0, -19]} scale={1.6} />
      <CartoonPineTree position={[6.8, 0, -15]} scale={1.3} />
      <CartoonPineTree position={[7.5, 0, -23]} scale={1.5} />

      {/* Station 2 Surroundings */}
      <CartoonPineTree position={[-5.2, 0, -29]} scale={1.4} />
      <CartoonPineTree position={[-6.0, 0, -35]} scale={1.2} />
      <CartoonPineTree position={[6.2, 0, -31]} scale={1.3} />
      <CartoonPineTree position={[7.0, 0, -37]} scale={1.5} />

      {/* Fluffy Cartoon Bushes */}
      <CartoonBush position={[-3.2, 0, 1.8]} scale={1.1} />
      <CartoonBush position={[-3.6, 0, -2.5]} scale={1.3} />
      <CartoonBush position={[5.2, 0, 1.2]} scale={1.0} />
      <CartoonBush position={[-3.8, 0, -21]} scale={1.3} />
      <CartoonBush position={[5.5, 0, -27]} scale={1.2} />
    </>
  );
};

export const RailwayScene: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [6.5, 5.0, 3.5], fov: 42, near: 0.1, far: 200 }}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 60%, #bae6fd 100%)',
      }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <DynamicStageCameraController />
      <CartoonRailwayWorld />
    </Canvas>
  );
};
