// ============================================================
// PATTERN RACERS — 3D Mechanical Function Machine (Optimized)
// High-Fidelity Hero Machine with Sleeping Inactive States:
// - Motorized Conveyor Ramp with Rolling Number Capsules
// - Acrylic Processing Chamber with Rotating Bronze Gears
// - Mechanical Stamping Pistons and Operation Indicators
// - Dynamic Capsule Transfer: Input [5] -> [Rule] -> Output [13]
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePatternStore } from '../store/patternStore';
import { PBR_MATERIALS } from './materials';

export const FunctionMachine3D: React.FC = () => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const activeChallenge = usePatternStore((s) => s.activeChallenge);
  const functionMachineActive = currentRound === 3 || currentRound === 4;

  const isVisible = currentRound >= 2;
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const pistonRef = useRef<THREE.Mesh>(null);
  const capsuleRef = useRef<THREE.Group>(null);

  // Sleep animation when machine is completely idle to save GPU cycles
  useFrame((state, delta) => {
    if (!isVisible) return;

    const speed = functionMachineActive ? 6.0 : 0.8;
    if (gear1Ref.current) gear1Ref.current.rotation.z += delta * speed;
    if (gear2Ref.current) gear2Ref.current.rotation.z -= delta * speed * 1.5;

    if (pistonRef.current) {
      const t = state.clock.getElapsedTime() * (functionMachineActive ? 8 : 1.5);
      pistonRef.current.position.y = 2.4 + Math.sin(t) * 0.22;
    }

    if (capsuleRef.current) {
      const t = (state.clock.getElapsedTime() * (functionMachineActive ? 1.5 : 0.35)) % 1;
      capsuleRef.current.position.z = -4.5 - t * 4;
      capsuleRef.current.position.y = 1.1 + Math.sin(t * Math.PI) * 0.15;
    }
  });

  if (!isVisible) return null;

  const inputValue = activeChallenge.functionInput ?? 5;
  const outputValue = activeChallenge.expectedOutput ?? 13;

  return (
    <group position={[7.8, 0, -38]} rotation={[0, -0.3, 0]}>
      {/* ── 1. HEAVY STEEL BASE PLATFORM ── */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow material={PBR_MATERIALS.darkWall}>
        <boxGeometry args={[5.2, 0.8, 4.4]} />
      </mesh>
      {/* Hazard Caution Border Trim */}
      <mesh position={[0, 0.82, 0]} material={PBR_MATERIALS.workerHardhat}>
        <boxGeometry args={[5.3, 0.05, 4.5]} />
      </mesh>

      {/* ── 2. MOTORIZED CONVEYOR CHUTE ── */}
      <mesh position={[0, 0.95, 0]} castShadow material={PBR_MATERIALS.asphaltRunoff}>
        <boxGeometry args={[1.6, 0.25, 5.8]} />
      </mesh>
      {/* Conveyor Rubber Belt */}
      <mesh position={[0, 1.08, 0]} receiveShadow material={PBR_MATERIALS.vehicleRubber}>
        <planeGeometry args={[1.2, 5.6]} />
      </mesh>

      {/* ── 3. ACRYLIC PROCESSING CHAMBER ── */}
      <mesh position={[0, 2.2, 0]} castShadow material={PBR_MATERIALS.vehicleGlass}>
        <boxGeometry args={[3.2, 2.4, 2.4]} />
      </mesh>
      {/* Corner Steel Support Struts */}
      {[-1.55, 1.55].map((x, xi) =>
        [-1.15, 1.15].map((z, zi) => (
          <mesh key={`strut-${xi}-${zi}`} position={[x, 2.2, z]} castShadow material={PBR_MATERIALS.metalTruss}>
            <cylinderGeometry args={[0.08, 0.08, 2.4, 6]} />
          </mesh>
        ))
      )}

      {/* ── 4. INTERNAL ROTATING BRONZE GEARS ── */}
      <mesh ref={gear1Ref} position={[-0.65, 2.2, 0]} rotation={[0, 0, 0]} material={PBR_MATERIALS.spectatorYellow}>
        <cylinderGeometry args={[0.65, 0.65, 0.14, 12]} />
      </mesh>
      <mesh ref={gear2Ref} position={[0.65, 2.2, 0]} rotation={[0, 0, 0]} material={PBR_MATERIALS.workerVestOrange}>
        <cylinderGeometry args={[0.48, 0.48, 0.14, 10]} />
      </mesh>

      {/* ── 5. MECHANICAL STAMPING PISTON ── */}
      <mesh ref={pistonRef} position={[0, 2.4, 0]} castShadow material={PBR_MATERIALS.metalTruss}>
        <cylinderGeometry args={[0.22, 0.22, 1.2, 8]} />
      </mesh>

      {/* ── 6. NUMBER CAPSULES ON CONVEYOR ── */}
      {/* Input Capsule entering machine */}
      <group position={[0, 1.15, -1.8]}>
        <mesh castShadow material={PBR_MATERIALS.ledScreenYellow}>
          <capsuleGeometry args={[0.3, 0.5, 8, 8]} />
        </mesh>
      </group>

      {/* Dynamic Animated Capsule */}
      <group ref={capsuleRef} position={[0, 1.1, -4.5]}>
        <mesh castShadow material={PBR_MATERIALS.ledScreenGreen}>
          <capsuleGeometry args={[0.3, 0.5, 8, 8]} />
        </mesh>
      </group>
    </group>
  );
};
