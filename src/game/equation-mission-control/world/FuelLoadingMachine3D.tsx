// ============================================================
// EQUATION MISSION CONTROL — Stage 2 3D Variable Fuel Loading Machine
// Physical Formula Substitution Mechanism:
// - Heavy Mechanical Feeding Piston
// - Large Rotary Variable Input Dial
// - Vertical Cylindrical Glass Fuel Tank with Rising Liquid Level & Bubbles
// - Stainless Steel Cryogenic Flow Hoses to Rocket Tanks
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMissionControlStore } from '../store/missionControlStore';

export const FuelLoadingMachine3D: React.FC = () => {
  const pistonRef = useRef<THREE.Group>(null);
  const liquidLevelRef = useRef<THREE.Mesh>(null);
  const dialRef = useRef<THREE.Mesh>(null);
  const pumpLightRef = useRef<THREE.PointLight>(null);

  const stage = useMissionControlStore((s) => s.currentStageIndex);
  const fuelPercent = useMissionControlStore(
    (s) => Math.max(s.blueSpacecraft.fuelTankPercent, s.redSpacecraft.fuelTankPercent)
  );

  useFrame(() => {
    // Mechanical Piston Pump Reciprocation
    if (pistonRef.current) {
      const isPumping = stage === 1 || fuelPercent > 0;
      const t = isPumping ? Math.sin(Date.now() * 0.008) * 0.15 : 0;
      pistonRef.current.position.y = 1.35 + t;
    }

    // Dynamic Liquid Fuel Level in Glass Cylinder
    if (liquidLevelRef.current) {
      const targetHeight = (fuelPercent / 100) * 1.4;
      liquidLevelRef.current.scale.y = THREE.MathUtils.damp(
        liquidLevelRef.current.scale.y,
        Math.max(0.02, targetHeight),
        3.0,
        0.016
      );
      liquidLevelRef.current.position.y = 0.4 + (liquidLevelRef.current.scale.y * 1.4) / 2;
    }

    // Variable Input Dial Rotation
    if (dialRef.current) {
      dialRef.current.rotation.z += 0.01;
    }

    // Cryogenic Glow
    if (pumpLightRef.current) {
      pumpLightRef.current.intensity = fuelPercent > 0 ? 2.2 : stage === 1 ? 1.0 : 0.2;
    }
  });

  return (
    <group position={[2.6, 0.5, 2.0]} rotation={[0, -0.4, 0]} scale={[0.85, 0.85, 0.85]}>
      {/* Heavy Base Machine Frame */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.4, 0.7, 1.2]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Hydraulic Piston Housing */}
      <group position={[-0.35, 0, 0]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.8, 16]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} />
        </mesh>
        {/* Reciprocating Piston Rod */}
        <group ref={pistonRef} position={[0, 1.35, 0]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Transparent Glass Fuel Sight Tank */}
      <group position={[0.35, 0.4, 0]}>
        {/* Glass Cylinder Outer Shell */}
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 1.4, 16]} />
          <meshStandardMaterial
            color="#bae6fd"
            roughness={0.1}
            metalness={0.1}
            transparent
            opacity={0.35}
          />
        </mesh>
        {/* Rising Liquid Fuel Core */}
        <mesh ref={liquidLevelRef} position={[0, 0.4, 0]} scale={[1, 0.05, 1]}>
          <cylinderGeometry args={[0.24, 0.24, 1.4, 16]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={1.5}
            roughness={0.2}
          />
        </mesh>
        {/* Top/Bottom Brass Flanges */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.08, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.08, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Rotary Variable Dial on Front */}
      <mesh
        ref={dialRef}
        position={[0, 0.45, 0.62]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
        <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Digital Process Readout Display */}
      <mesh position={[0, 0.95, 0.55]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.04]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#0284c7"
          emissiveIntensity={fuelPercent > 0 ? 1.2 : 0.3}
          roughness={0.3}
        />
      </mesh>

      <pointLight
        ref={pumpLightRef}
        position={[0.35, 1.2, 0.4]}
        color="#38bdf8"
        distance={4}
        intensity={0.5}
      />
    </group>
  );
};
