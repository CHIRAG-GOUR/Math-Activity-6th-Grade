// ============================================================
// THE GREAT NUMBER RAILWAY — Main 3D Canvas Scene
// High-Graphics Cartoon Railway World:
// - Connected track loop between stations
// - Cartoon locomotive with 3 loaded carriages
// - Storybook stations matching user's image reference
// - Dynamic cinematic camera tracking train between stations
// - Lush layered pine trees, fluffy bushes, and 3D floating clouds
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
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
  [0, 0.1, 2],       // Sunny Valley Central start
  [0, 0.1, -4],
  [-3.5, 0.1, -10],  // Sweeping curve past hills
  [-2.0, 0.1, -17],  // Timber Trestle Bridge section
  [2.5, 0.1, -24],   // Mountain Pass / Tunnel section
  [0, 0.1, -30],     // Approach Pine Ridge Terminal
  [0, 0.1, -34],     // Pine Ridge Platform
];

// ── Dynamic Cinematic Camera Controller ──
const CinematicCameraController: React.FC = () => {
  const { camera } = useThree();
  const trainState = useRailwayStore((s) => s.train);
  const phase = useRailwayStore((s) => s.phase);

  const curve = useMemo(() => {
    const pts = MAIN_TRACK_POINTS.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  }, []);

  useFrame(() => {
    if (phase === 'train-journey' && curve) {
      // Dynamic camera tracking train as it journeys along track!
      const t = Math.min(Math.max(trainState.progress, 0), 0.99);
      const trainPos = curve.getPointAt(t);

      // Position camera offset behind & above train
      const targetCamPos = new THREE.Vector3(trainPos.x + 6, trainPos.y + 6, trainPos.z + 8);
      const targetLookAt = new THREE.Vector3(trainPos.x, trainPos.y + 1, trainPos.z);

      camera.position.lerp(targetCamPos, 0.05);
      camera.lookAt(targetLookAt);
    } else {
      // Default elevated 3/4 overview of current station
      const targetCamPos = new THREE.Vector3(6.5, 7.5, 7.0);
      const targetLookAt = new THREE.Vector3(0, 0.8, -1.5);

      camera.position.lerp(targetCamPos, 0.03);
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
      {/* ── Sunlit Daylight Lighting (Warm, Vibrant & Bright) ── */}
      <ambientLight intensity={0.7} color="#fffbeb" />
      <directionalLight
        position={[14, 22, 12]}
        intensity={1.4}
        color="#fffdf5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-10, 14, -8]} intensity={0.4} color="#bae6fd" />
      <hemisphereLight args={['#38bdf8', '#65a30d', 0.5]} />

      {/* ── Ground & Ballast ── */}
      <StorybookGround />

      {/* ── Floating 3D Cartoon Clouds in Sky ── */}
      <CartoonCloud position={[-18, 14, -20]} speed={0.8} scale={1.2} />
      <CartoonCloud position={[8, 16, -30]} speed={0.5} scale={1.4} />
      <CartoonCloud position={[22, 13, -10]} speed={0.6} scale={1.0} />
      <CartoonCloud position={[-8, 15, 5]} speed={0.7} scale={1.1} />

      {/* ── Station 1: Sunny Valley Central (Origin Station) ── */}
      <CartoonStation
        position={[0, 0, 0]}
        name={stations[0]?.name || 'Sunny Valley Central'}
        isCurrentStation={currentStationIdx === 0}
        isNextDestination={currentStationIdx !== 0}
      />

      {/* ── Station 2: Pine Ridge Terminal (Destination Station) ── */}
      <CartoonStation
        position={[0, 0, -32]}
        name={stations[1]?.name || 'Pine Ridge Terminal'}
        isCurrentStation={currentStationIdx === 1}
        isNextDestination={currentStationIdx === 0}
      />

      {/* ── Railway Signal ── */}
      <DynamicRailwaySignal position={[1.4, 0, 1.8]} signalState={signalState} />
      <DynamicRailwaySignal position={[1.4, 0, -30]} signalState={signalState} />

      {/* ── Continuous Railway Tracks ── */}
      <ContinuousRailwayTrack
        controlPoints={MAIN_TRACK_POINTS}
        active={true}
        hasBridge={true}
        hasTunnel={true}
      />

      {/* ── Hero Cartoon Locomotive & 3 Loaded Carriages ── */}
      <CartoonTrain trackPoints={MAIN_TRACK_POINTS} />

      {/* ── Storybook Layered Pine Trees & Foliage (Matching Reference Image!) ── */}
      {/* Station 1 Surroundings */}
      <CartoonPineTree position={[-4.5, 0, -3]} scale={1.3} />
      <CartoonPineTree position={[-5.8, 0, 2]} scale={1.1} />
      <CartoonPineTree position={[-6.2, 0, -6]} scale={1.5} />
      <CartoonPineTree position={[4.2, 0, -2]} scale={1.2} />
      <CartoonPineTree position={[5.5, 0, 3]} scale={1.0} />

      {/* Trackside Scenic Forest */}
      <CartoonPineTree position={[-6.5, 0, -12]} scale={1.4} />
      <CartoonPineTree position={[-7.8, 0, -18]} scale={1.6} />
      <CartoonPineTree position={[5.8, 0, -14]} scale={1.3} />
      <CartoonPineTree position={[6.5, 0, -22]} scale={1.5} />

      {/* Station 2 Surroundings */}
      <CartoonPineTree position={[-4.8, 0, -28]} scale={1.4} />
      <CartoonPineTree position={[-5.5, 0, -34]} scale={1.2} />
      <CartoonPineTree position={[4.8, 0, -30]} scale={1.3} />
      <CartoonPineTree position={[5.8, 0, -36]} scale={1.5} />

      {/* Cartoon Bushes */}
      <CartoonBush position={[-2.8, 0, 1.5]} scale={1.1} />
      <CartoonBush position={[-3.2, 0, -1.8]} scale={1.3} />
      <CartoonBush position={[3.2, 0, 1.0]} scale={1.0} />
      <CartoonBush position={[3.5, 0, -4.5]} scale={1.2} />
      <CartoonBush position={[-3.5, 0, -20]} scale={1.3} />
      <CartoonBush position={[3.8, 0, -26]} scale={1.2} />
      <CartoonBush position={[-2.8, 0, -33]} scale={1.1} />

      {/* Mountain Viaduct Pillars */}
      <mesh position={[-2.0, -0.6, -17]}>
        <boxGeometry args={[1.2, 1.4, 0.4]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
    </>
  );
};

export const RailwayScene: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [6.5, 7.5, 7.0], fov: 42, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 60%, #bae6fd 100%)' }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <CinematicCameraController />
      <CartoonRailwayWorld />
    </Canvas>
  );
};
