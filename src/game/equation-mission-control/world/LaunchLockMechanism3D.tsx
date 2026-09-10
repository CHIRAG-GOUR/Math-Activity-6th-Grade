// ============================================================
// EQUATION MISSION CONTROL — Stage 5 3D Launch Lock & Arm Mechanism
// Physical Combination Lock Housing & Heavy Guarded ARM LAUNCH Handle:
// - Heavy Steel Armor Vault Housing in Front Center of Launch Pad
// - Dual Rotating Numeric Code Tumbler Wheels (0-9)
// - Guarded Red Ball Launch Arm Lever (Flips down on Arming)
// - Strobing Launch Ready Strobes & Warning Beacon
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMissionControlStore } from '../store/missionControlStore';

export const LaunchLockMechanism3D: React.FC = () => {
  const leverRef = useRef<THREE.Group>(null);
  const tumbler1Ref = useRef<THREE.Mesh>(null);
  const tumbler2Ref = useRef<THREE.Mesh>(null);
  const lockLightRef = useRef<THREE.PointLight>(null);

  const stage = useMissionControlStore((s) => s.currentStageIndex);
  const isArmed =
    useMissionControlStore((s) => s.blueTeam.isArmed) ||
    useMissionControlStore((s) => s.redTeam.isArmed);
  const launchStage = useMissionControlStore((s) => s.blueSpacecraft.launchStage);

  useFrame((_, delta) => {
    // Arm Lever Flip (0 deg up -> -70 deg down when armed)
    const targetLever = isArmed || launchStage !== 'idle' ? -1.2 : 0;
    if (leverRef.current) {
      leverRef.current.rotation.x = THREE.MathUtils.damp(
        leverRef.current.rotation.x,
        targetLever,
        4.0,
        delta
      );
    }

    // Rotating number tumblers when solving
    if (tumbler1Ref.current && stage === 4) {
      tumbler1Ref.current.rotation.x += 0.015;
    }
    if (tumbler2Ref.current && stage === 4) {
      tumbler2Ref.current.rotation.x -= 0.02;
    }

    if (lockLightRef.current) {
      const active = isArmed || launchStage !== 'idle';
      lockLightRef.current.intensity = active
        ? 3.0 + Math.sin(Date.now() * 0.015) * 2.0
        : stage === 4
          ? 1.2
          : 0.3;
    }
  });

  return (
    <group position={[0, 0.5, 3.8]} scale={[0.85, 0.85, 0.85]}>
      {/* Heavy Steel Pedestal Box */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.5, 0.9, 0.9]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Yellow Caution Bezel Border */}
      <mesh position={[0, 0.91, 0]}>
        <boxGeometry args={[1.54, 0.04, 0.94]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>

      {/* Dual Combination Tumbler Cylinders */}
      <group position={[-0.32, 0.65, 0.46]}>
        <mesh ref={tumbler1Ref} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.28, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Brass Number Ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.185, 0.02, 8, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
      </group>

      <group position={[0.32, 0.65, 0.46]}>
        <mesh ref={tumbler2Ref} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.28, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Brass Number Ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.185, 0.02, 8, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
      </group>

      {/* Guarded ARM LAUNCH Heavy Lever */}
      <group ref={leverRef} position={[0, 0.95, 0.15]}>
        {/* Lever Base Fulcrum */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.15, 0.15]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Steel Lever Handle */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {/* Large Red Sphere Gripper */}
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={isArmed ? 2.5 : 0.5}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Launch Authorized Indicator Lamp */}
      <pointLight
        ref={lockLightRef}
        position={[0, 1.2, 0.4]}
        color={isArmed ? '#ef4444' : '#f59e0b'}
        distance={6}
        intensity={0.8}
      />
    </group>
  );
};
