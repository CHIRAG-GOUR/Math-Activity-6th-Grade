// ============================================================
// THE GREAT NUMBER RAILWAY — Main 3D Canvas Scene
// Skillizee Junction ➔ CCIS Junction
// Stage-Aware Camera System:
// - Step 1: 👥 Passenger Coach & Platform with Boarding Figures
// - Step 2: 🚗 Vehicle Flatbed with Cyan Sedan & Yellow Pickup
// - Step 3: 🪜 Cargo Wagon with Ladders, Planks, Steel & Bricks
// - Step 4: ⚙️ Locomotive Engine, Wheels & 3D Driver in Cabin
// - Step 5: 🚦 Green Semaphore & 15-Second Scenic Journey
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

// Continuous Main Scenic Track Route between Skillizee & CCIS Junctions
export const MAIN_TRACK_POINTS: [number, number, number][] = [
  [0, 0.1, 4],       // Skillizee Junction Platform
  [0, 0.1, -4],
  [-3.5, 0.1, -12],  // Scenic curve past timber hills
  [-2.5, 0.1, -19],  // Scenic trestle bridge section
  [3.2, 0.1, -26],   // Highland mountain pass
  [0, 0.1, -33],     // Approach CCIS Junction
  [0, 0.1, -38],     // CCIS Junction Terminal stop
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
      // 15-Second Cinematic Dynamic Chase Camera
      const t = Math.min(Math.max(trainState.progress, 0), 0.999);
      const trainPos = curve.getPointAt(t);

      const targetCamPos = new THREE.Vector3(trainPos.x + 4.8, trainPos.y + 3.6, trainPos.z + 6.2);
      const targetLookAt = new THREE.Vector3(trainPos.x, trainPos.y + 0.6, trainPos.z);

      camera.position.lerp(targetCamPos, 0.05);
      camera.lookAt(targetLookAt);
    } else if (phase === 'train-approaching') {
      // Camera viewing train steaming into Skillizee Junction
      const targetCamPos = new THREE.Vector3(5.5, 3.2, 3.5);
      const targetLookAt = new THREE.Vector3(0, 0.6, -1.0);
      camera.position.lerp(targetCamPos, 0.04);
      camera.lookAt(targetLookAt);
    } else {
      // Front-Side Unobstructed Angles per Loading Step
      let targetCamPos = new THREE.Vector3(5.2, 3.2, 1.0);
      let targetLookAt = new THREE.Vector3(0, 0.5, -1.8);

      if (currentStep === 1) {
        // Step 1: 👥 Passenger Coach & Platform Close-Up
        targetCamPos = new THREE.Vector3(4.5, 2.5, -4.2);
        targetLookAt = new THREE.Vector3(0, 0.5, -6.0);
      } else if (currentStep === 2) {
        // Step 2: 🚗 Vehicle Flatbed (Sedan & Pickup) Close-Up
        targetCamPos = new THREE.Vector3(4.5, 2.5, -0.4);
        targetLookAt = new THREE.Vector3(0, 0.4, -2.1);
      } else if (currentStep === 3) {
        // Step 3: 🪜 Building Materials (Ladders & Planks) Close-Up
        targetCamPos = new THREE.Vector3(4.5, 2.5, -2.2);
        targetLookAt = new THREE.Vector3(0, 0.4, -4.0);
      } else if (currentStep === 4) {
        // Step 4: ⚙️ Locomotive Engine, Wheels & 3D Driver in Cabin
        targetCamPos = new THREE.Vector3(4.5, 2.4, 2.2);
        targetLookAt = new THREE.Vector3(0, 0.6, 0.2);
      } else if (currentStep === 5) {
        // Step 5: 🚦 Semaphore Green Signal & Full Train Departure View
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

  return (
    <>
      <ambientLight intensity={0.85} color="#fffbeb" />
      <directionalLight
        position={[14, 22, 14]}
        intensity={1.4}
        color="#fffdf5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-10, 14, -8]} intensity={0.45} color="#bae6fd" />
      <hemisphereLight args={['#38bdf8', '#65a30d', 0.55]} />

      {/* Ground & Ballast */}
      <StorybookGround />

      {/* Floating 3D Clouds */}
      <CartoonCloud position={[-18, 14, -20]} speed={0.8} scale={1.2} />
      <CartoonCloud position={[8, 16, -30]} speed={0.5} scale={1.4} />
      <CartoonCloud position={[22, 13, -10]} speed={0.6} scale={1.0} />
      <CartoonCloud position={[-8, 15, 5]} speed={0.7} scale={1.1} />

      {/* Station 1: Skillizee Junction (Origin Platform with Waiting Passengers) */}
      <CartoonStation
        position={[-2.2, 0, -2.0]}
        name="Skillizee Junction"
        isSkillizeeJunction={true}
      />

      {/* Station 2: CCIS Junction (Highlands Destination Terminal) */}
      <CartoonStation
        position={[-2.2, 0, -35]}
        name="CCIS Junction"
        isSkillizeeJunction={false}
      />

      {/* Dynamic Semaphore Signals */}
      <DynamicRailwaySignal position={[1.4, 0, 2.2]} signalState={signalState} />
      <DynamicRailwaySignal position={[1.4, 0, -34]} signalState={signalState} />

      {/* Continuous Tracks with Bridge & Tunnel */}
      <ContinuousRailwayTrack
        controlPoints={MAIN_TRACK_POINTS}
        active={true}
        hasBridge={true}
        hasTunnel={true}
      />

      {/* Hero Locomotive with 3D Driver & 3 Articulated Carriages */}
      <CartoonTrain trackPoints={MAIN_TRACK_POINTS} />

      {/* Scenic Pine Trees */}
      <CartoonPineTree position={[-5.8, 0, -2]} scale={1.3} />
      <CartoonPineTree position={[-6.8, 0, 3]} scale={1.1} />
      <CartoonPineTree position={[-7.2, 0, -8]} scale={1.5} />
      <CartoonPineTree position={[5.8, 0, -5]} scale={1.2} />
      <CartoonPineTree position={[6.5, 0, 4]} scale={1.0} />

      <CartoonPineTree position={[-7.5, 0, -14]} scale={1.4} />
      <CartoonPineTree position={[-8.5, 0, -20]} scale={1.6} />
      <CartoonPineTree position={[6.2, 0, -16]} scale={1.3} />
      <CartoonPineTree position={[7.0, 0, -24]} scale={1.5} />

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
