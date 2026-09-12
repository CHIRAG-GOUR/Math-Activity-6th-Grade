// ============================================================
// PATTERN RACERS — 3D Mechanical Function Machine
// Physical Transformation Engine with Gears, Conveyors & Capsules:
// - Motorized Conveyor Ramp with Rolling Number Capsules
// - Acrylic Processing Chamber with Rotating Bronze Gears
// - Mechanical Stamping Pistons and Operation Indicators
// - Dynamic Capsule Transfer: Input [5] -> [Rule] -> Output [13]
// ============================================================

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePatternStore } from '../store/patternStore';

export const FunctionMachine3D: React.FC = () => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const functionMachineActive = usePatternStore((s) => s.functionMachineActive);
  const activeChallenge = usePatternStore((s) => s.activeChallenge);

  const isVisible = currentRound >= 3;
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const pistonRef = useRef<THREE.Mesh>(null);
  const capsuleRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!isVisible) return;

    // Continuous smooth gear rotation
    const speed = functionMachineActive ? 6 : 1.2;
    if (gear1Ref.current) gear1Ref.current.rotation.z += delta * speed;
    if (gear2Ref.current) gear2Ref.current.rotation.z -= delta * speed * 1.5;

    // Stamping piston oscillation
    if (pistonRef.current) {
      const t = state.clock.getElapsedTime() * (functionMachineActive ? 8 : 2);
      pistonRef.current.position.y = 2.4 + Math.sin(t) * 0.25;
    }

    // Number capsule conveyor translation
    if (capsuleRef.current) {
      const t = (state.clock.getElapsedTime() * (functionMachineActive ? 1.5 : 0.4)) % 1;
      // Interpolate capsule along conveyor from z = -4 to z = -8
      capsuleRef.current.position.z = -4.5 - t * 4;
      capsuleRef.current.position.y = 1.1 + Math.sin(t * Math.PI) * 0.15;
    }
  });

  if (!isVisible) return null;

  const inputValue = activeChallenge.functionInput ?? 5;
  const outputValue = activeChallenge.expectedOutput ?? 13;

  return (
    <group position={[0, 0, -6.5]}>
      {/* ── 1. HEAVY STEEL BASE PLATFORM ── */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 0.8, 4.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Hazard Caution Border Trim */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[5.3, 0.05, 4.5]} />
        <meshStandardMaterial color="#eab308" roughness={0.3} />
      </mesh>

      {/* ── 2. MOTORIZED CONVEYOR CHUTE ── */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[1.6, 0.25, 5.8]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      {/* Conveyor Rubber Belt */}
      <mesh position={[0, 1.08, 0]} receiveShadow>
        <planeGeometry args={[1.2, 5.6]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>

      {/* ── 3. ACRYLIC GLASS PROCESSING CHAMBER ── */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[3.2, 2.4, 2.4]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.45}
        />
      </mesh>
      {/* Corner Steel Support Struts */}
      {[-1.55, 1.55].map((x, xi) =>
        [-1.15, 1.15].map((z, zi) => (
          <mesh key={`strut-${xi}-${zi}`} position={[x, 2.2, z]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
        ))
      )}

      {/* ── 4. ROTATING BRONZE GEARS ── */}
      {/* Primary Driver Gear */}
      <mesh ref={gear1Ref} position={[-0.85, 2.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Secondary Interlocking Gear */}
      <mesh ref={gear2Ref} position={[0.85, 2.6, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 12]} />
        <meshStandardMaterial color="#b45309" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* ── 5. MECHANICAL STAMPING PISTON ── */}
      <mesh ref={pistonRef} position={[0, 2.4, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Piston Stamp Head */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.2, 16]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} />
      </mesh>

      {/* ── 6. ROLLING NUMBER CAPSULES ── */}
      <group ref={capsuleRef}>
        {/* Input/Output Capsule Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshStandardMaterial
            color={functionMachineActive ? '#22c55e' : '#f59e0b'}
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
        {/* Glow Halo */}
        <pointLight
          position={[0, 0, 0]}
          color={functionMachineActive ? '#4ade80' : '#fbbf24'}
          intensity={1.8}
          distance={2.5}
        />
      </group>

      {/* ── 7. OVERHEAD FUNCTION RULE DISPLAY BOARD ── */}
      <group position={[0, 3.8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 0.9, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* Blue Neon Status Frame */}
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[3.6, 0.7]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* Ambient Engine Lights */}
      <pointLight position={[0, 2.2, 0]} color="#38bdf8" intensity={functionMachineActive ? 3.0 : 0.8} distance={4} />
    </group>
  );
};
