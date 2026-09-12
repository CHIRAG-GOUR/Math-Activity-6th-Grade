// ============================================================
// PATTERN RACERS — 3D Heavy Track Builder Deployer
// Engineering Crane Machine for Round 2 Sequence Assembly:
// - Heavy Yellow Industrial Chassis with Caterpillar Tracks
// - Articulated Hydraulic Boom Arm & Hex-Slab Gripper
// - Flashing Amber Safety Beacon & Hydraulic Stabilizer Legs
// ============================================================

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePatternStore } from '../store/patternStore';

export const TrackBuilderMachine3D: React.FC = () => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const trackBuilderDeploying = usePatternStore((s) => s.trackBuilderDeploying);

  const isVisible = currentRound >= 2;
  const boomRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!isVisible) return;

    // Articulated boom arm motion
    if (boomRef.current) {
      const t = state.clock.getElapsedTime() * (trackBuilderDeploying ? 4 : 0.8);
      boomRef.current.rotation.z = -0.3 + Math.sin(t) * 0.18;
    }

    // Flashing safety beacon
    if (beaconRef.current) {
      beaconRef.current.intensity = Math.sin(state.clock.getElapsedTime() * 10) > 0 ? 2.2 : 0.2;
    }
  });

  if (!isVisible) return null;

  return (
    <group position={[-5.8, 0, -1]}>
      {/* ── 1. INDUSTRIAL TRACK BASE ── */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.7, 4.2]} />
        <meshStandardMaterial color="#eab308" roughness={0.35} metalness={0.6} />
      </mesh>

      {/* Rubber Caterpillar Treads (Left & Right) */}
      {[-1.5, 1.5].map((x, i) => (
        <group key={`tread-${i}`} position={[x, 0.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.65, 4.4]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          {/* Bogie Wheels */}
          {[-1.5, -0.5, 0.5, 1.5].map((z, zi) => (
            <mesh key={`bogie-${zi}`} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.45, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── 2. ROTATING CABIN & CRANE HOUSING ── */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[2.2, 1.1, 2.6]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.4} />
      </mesh>
      {/* Operator Glass Canopy */}
      <mesh position={[0.5, 1.5, 0.8]}>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.6} />
      </mesh>

      {/* Flashing Amber Beacon */}
      <group position={[0, 2.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.2, 8]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <pointLight ref={beaconRef} color="#f59e0b" intensity={1.5} distance={4} />
      </group>

      {/* ── 3. ARTICULATED HYDRAULIC BOOM ARM ── */}
      <group ref={boomRef} position={[0, 1.6, -0.6]}>
        {/* Main Boom Arm */}
        <mesh position={[1.4, 0.9, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.3, 2.6, 0.3]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
        {/* Concrete Slab Claw Gripper */}
        <group position={[2.5, 1.8, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.3, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Held Concrete Hex Slab */}
          <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <circleGeometry args={[0.65, 6]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
