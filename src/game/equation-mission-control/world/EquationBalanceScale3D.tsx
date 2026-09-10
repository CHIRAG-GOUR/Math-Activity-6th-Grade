// ============================================================
// EQUATION MISSION CONTROL — Stage 3 3D Physical Equation Balance Scale
// Signature 3D Mechanical Balance Mechanism:
// - Central Pivot Fulcrum & Tilting Crossbeam
// - Suspended Left & Right Brass Balance Weight Pans
// - Physical Leveling Indicator Needle & Balanced Lock Pin
// - Operates with Real Inverse Operations to Level Out
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMissionControlStore } from '../store/missionControlStore';

export const EquationBalanceScale3D: React.FC = () => {
  const beamRef = useRef<THREE.Group>(null);
  const leftPanRef = useRef<THREE.Group>(null);
  const rightPanRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Mesh>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);

  const stage = useMissionControlStore((s) => s.currentStageIndex);
  const enginePower = useMissionControlStore(
    (s) => s.blueSpacecraft.stage3EngineDone || s.redSpacecraft.stage3EngineDone
  );
  const blueState = useMissionControlStore((s) => s.blueTeam);
  const redState = useMissionControlStore((s) => s.redTeam);

  const isBalanced =
    enginePower ||
    blueState.balanceTiltedSide === 'balanced' ||
    redState.balanceTiltedSide === 'balanced';

  useFrame((_, delta) => {
    // Determine physical tilt angle
    let targetAngle = 0;
    if (stage === 2 && !isBalanced) {
      // Tilted left when unbalanced
      targetAngle = -0.22;
    } else if (isBalanced) {
      // Perfectly level 0
      targetAngle = 0;
    } else {
      targetAngle = Math.sin(Date.now() * 0.002) * 0.05;
    }

    if (beamRef.current) {
      beamRef.current.rotation.z = THREE.MathUtils.damp(
        beamRef.current.rotation.z,
        targetAngle,
        3.5,
        delta
      );
    }

    // Pans stay vertically aligned via counter-rotation
    if (leftPanRef.current && beamRef.current) {
      leftPanRef.current.rotation.z = -beamRef.current.rotation.z;
    }
    if (rightPanRef.current && beamRef.current) {
      rightPanRef.current.rotation.z = -beamRef.current.rotation.z;
    }

    // Needle alignment
    if (needleRef.current && beamRef.current) {
      needleRef.current.rotation.z = -beamRef.current.rotation.z * 1.5;
    }

    if (glowLightRef.current) {
      glowLightRef.current.intensity = isBalanced ? 2.5 : stage === 2 ? 1.2 : 0.3;
    }
  });

  return (
    <group position={[-2.8, 0.5, -1.8]} rotation={[0, 0.3, 0]} scale={[0.85, 0.85, 0.85]}>
      {/* Heavy Steel Pedestal & Fulcrum Tower */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 1.0, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.22, 0.45, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Central Dial Scale Plate (Green Balanced Zone) */}
      <group position={[0, 1.5, 0.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.04, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.15, 0.03]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.06, 0.22, 0.02]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.5} />
        </mesh>
        {/* Indicator Needle */}
        <mesh ref={needleRef} position={[0, 0, 0.04]}>
          <boxGeometry args={[0.025, 0.28, 0.01]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
      </group>

      {/* ── TILTING CROSSBEAM (Length 2.4m) ── */}
      <group ref={beamRef} position={[0, 1.45, 0]}>
        <mesh>
          <boxGeometry args={[2.4, 0.1, 0.12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Pivot Center Pin */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>

        {/* Left Suspended Pan System */}
        <group ref={leftPanRef} position={[-1.1, -0.6, 0]}>
          {/* Chains / Suspension Rods */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Brass Pan Disc */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.06, 24]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Left Algebraic Weight (x + 7) */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.26, 0.24, 0.26]} />
            <meshStandardMaterial color="#2563eb" roughness={0.4} />
          </mesh>
        </group>

        {/* Right Suspended Pan System */}
        <group ref={rightPanRef} position={[1.1, -0.6, 0]}>
          {/* Chains / Suspension Rods */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Brass Pan Disc */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.06, 24]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Right Constant Weight (15) */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 0.3, 16]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
        </group>
      </group>

      <pointLight
        ref={glowLightRef}
        position={[0, 1.8, 0.4]}
        color={isBalanced ? '#10b981' : '#f59e0b'}
        distance={5}
        intensity={0.8}
      />
    </group>
  );
};
