// ============================================================
// PARK PLANNER â€” 3D Park Citizens & Living Visitors
// Stylized humans: Children, Joggers, Cyclists, Bench Sitters
// Natural kinematic animations with waypoint paths.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { UNIT_SIZE } from '../engine/coordinateMath';

// ------------------------------------------------------------
// 1. ACTIVE JOGGER (Follows Promenade Loop)
// ------------------------------------------------------------
export const ActiveJogger3D: React.FC<{ speed?: number }> = ({ speed = 0.8 }) => {
  const joggerRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (joggerRef.current) {
      // Loop around the outer quadrant promenades
      const radius = UNIT_SIZE * 3.8;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      const nextX = Math.cos(t + 0.05) * radius;
      const nextZ = Math.sin(t + 0.05) * radius;

      joggerRef.current.position.set(x, 0, z);
      joggerRef.current.rotation.y = Math.atan2(nextX - x, nextZ - z);
    }

    // Fast jogging leg oscillation
    const runCycle = Math.sin(t * 10);
    if (leftLegRef.current) leftLegRef.current.rotation.x = runCycle * 0.6;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -runCycle * 0.6;
  });

  return (
    <group ref={joggerRef} position={[0, 0, 0]}>
      {/* Jogging Shorts & Legs */}
      <mesh ref={leftLegRef} position={[-0.1, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.7, 8]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      <mesh ref={rightLegRef} position={[0.1, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.7, 8]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Running Tank Top Torso */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.34, 0.5, 0.2]} />
        <meshStandardMaterial color="#ec4899" />
      </mesh>

      {/* Head & Headband */}
      <mesh position={[0, 1.32, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[0, 1.34, 0]}>
        <torusGeometry args={[0.125, 0.02, 6, 12]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 2. CYCLIST ON PATHWAY
// ------------------------------------------------------------
export const Cyclist3D: React.FC<{ speed?: number }> = ({ speed = 1.1 }) => {
  const cyclistRef = useRef<THREE.Group>(null);
  const wheelFrontRef = useRef<THREE.Mesh>(null);
  const wheelRearRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (cyclistRef.current) {
      // Travels East-West along the X-axis promenade
      const span = UNIT_SIZE * 4.2;
      const x = Math.sin(t * 0.4) * span;
      const dir = Math.cos(t * 0.4) >= 0 ? 1 : -1;

      cyclistRef.current.position.set(x, 0, 0.4);
      cyclistRef.current.rotation.y = dir === 1 ? Math.PI / 2 : -Math.PI / 2;
    }

    if (wheelFrontRef.current) wheelFrontRef.current.rotation.z += 0.2;
    if (wheelRearRef.current) wheelRearRef.current.rotation.z += 0.2;
  });

  return (
    <group ref={cyclistRef} position={[0, 0, 0]}>
      {/* Bicycle Frame */}
      <group position={[0, 0.35, 0]}>
        {/* Wheels */}
        <mesh ref={wheelRearRef} position={[-0.45, 0, 0]}>
          <torusGeometry args={[0.22, 0.025, 6, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh ref={wheelFrontRef} position={[0.45, 0, 0]}>
          <torusGeometry args={[0.22, 0.025, 6, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Diamond Frame Tubes */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.65, 0.04, 0.04]} />
          <meshStandardMaterial color="#ef4444" metalness={0.7} />
        </mesh>
        {/* Handlebars */}
        <mesh position={[0.38, 0.42, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.04, 0.04, 0.38]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* Rider Body */}
      <group position={[-0.05, 0.65, 0]}>
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.24, 0.42, 0.2]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        <mesh position={[0.12, 0.58, 0]}>
          <sphereGeometry args={[0.11, 10, 10]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        {/* Helmet */}
        <mesh position={[0.12, 0.66, 0]}>
          <sphereGeometry args={[0.13, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 3. BENCH SITTER / CITIZEN
// ------------------------------------------------------------
export const BenchSitter3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Seated Torso */}
      <mesh position={[0, 0.62, -0.05]}>
        <boxGeometry args={[0.3, 0.38, 0.2]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      {/* Seated Thighs (Horizontal) */}
      <mesh position={[0, 0.44, 0.12]}>
        <boxGeometry args={[0.26, 0.12, 0.28]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      {/* Lower Legs (Vertical) */}
      <mesh position={[-0.07, 0.22, 0.24]}>
        <cylinderGeometry args={[0.05, 0.05, 0.38, 6]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <mesh position={[0.07, 0.22, 0.24]}>
        <cylinderGeometry args={[0.05, 0.05, 0.38, 6]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.92, -0.05]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      {/* Book on lap */}
      <mesh position={[0, 0.52, 0.12]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.03, 0.14]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
};
