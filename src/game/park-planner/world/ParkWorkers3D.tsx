// ============================================================
// PARK PLANNER — 3D Construction Workers & Utility Carts
// Real human worker models with hard hats, safety vests, tools,
// and believable walking / construction animations.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { lerp3D, easeInOutCubic } from '../engine/coordinateMath';

// ------------------------------------------------------------
// 1. STYLIZED HUMAN CONSTRUCTION WORKER
// ------------------------------------------------------------
export const ConstructionWorker3D: React.FC<{
  position?: [number, number, number];
  targetPosition?: [number, number, number];
  isConstructing?: boolean;
}> = ({ position = [0, 0, 0], targetPosition, isConstructing = false }) => {
  const workerGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (isConstructing) {
      // Hammering / Assembling animation
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 4 + Math.sin(t * 10) * 0.5;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    } else {
      // Walking leg swing
      const walkCycle = Math.sin(t * 6);
      if (leftLegRef.current) leftLegRef.current.rotation.x = walkCycle * 0.4;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * 0.4;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -walkCycle * 0.3;
    }
  });

  return (
    <group position={position} ref={workerGroupRef}>
      {/* Boots / Left Leg */}
      <mesh ref={leftLegRef} castShadow position={[-0.12, 0.35, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
      </mesh>
      {/* Boots / Right Leg */}
      <mesh ref={rightLegRef} castShadow position={[0.12, 0.35, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
      </mesh>

      {/* Safety Vest Torso */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <boxGeometry args={[0.38, 0.52, 0.22]} />
        <meshStandardMaterial color="#ea580c" roughness={0.5} />
      </mesh>
      {/* Reflective Yellow Stripes */}
      <mesh position={[0, 0.98, 0.12]}>
        <boxGeometry args={[0.36, 0.08, 0.01]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.88, 0.12]}>
        <boxGeometry args={[0.36, 0.08, 0.01]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.3} />
      </mesh>

      {/* Left Arm (holding clipboard or resting) */}
      <mesh castShadow position={[-0.24, 0.9, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.45, 8]} />
        <meshStandardMaterial color="#ea580c" />
      </mesh>

      {/* Right Arm (Holding Hammer / Tool) */}
      <group position={[0.24, 1.1, 0]} ref={rightArmRef}>
        <mesh castShadow position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.45, 8]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
        {/* Steel Hammer */}
        <group position={[0, -0.42, 0.08]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.28, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.1, 0.05, 0.05]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Head */}
      <mesh castShadow position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>

      {/* Yellow Safety Hard Hat */}
      <group position={[0, 1.45, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Helmet Brim */}
        <mesh position={[0, -0.02, 0.04]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.34, 0.02, 0.36]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 2. PARK MAINTENANCE UTILITY VEHICLE CART
// ------------------------------------------------------------
export const ConstructionCart3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Chassis Body */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[1.6, 0.35, 0.9]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>

      {/* Cabin Windshield Frame */}
      <mesh position={[0.4, 0.65, 0]}>
        <boxGeometry args={[0.5, 0.45, 0.85]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Front Windshield Glass */}
      <mesh position={[0.66, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.75, 0.35]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.6} roughness={0.1} />
      </mesh>

      {/* Cargo Bed in Rear with Tool Chest */}
      <mesh castShadow position={[-0.35, 0.55, 0]}>
        <boxGeometry args={[0.7, 0.25, 0.8]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Traffic Cones on Cargo Bed */}
      <mesh position={[-0.3, 0.78, 0.2]}>
        <coneGeometry args={[0.1, 0.26, 8]} />
        <meshStandardMaterial color="#ea580c" />
      </mesh>

      {/* 4 Heavy Rubber Wheels */}
      {[-0.55, 0.55].map((x, i) =>
        [-0.48, 0.48].map((z, j) => (
          <mesh key={`wheel_${i}_${j}`} position={[x, 0.18, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.14, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
};
