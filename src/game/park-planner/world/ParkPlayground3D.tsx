// ============================================================
// PARK PLANNER — 3D Playground Equipment (Quadrant I)
// Real timber swings with physical oscillation, adventure slide tower,
// geodesic climbing dome, seesaw, and spring rider.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Materials } from './ParkMaterials';

// ------------------------------------------------------------
// 1. DUAL TIMBER SWING SET
// ------------------------------------------------------------
export const SwingSet3D: React.FC<{ position?: [number, number, number]; rotationY?: number }> = ({
  position = [0, 0, 0],
  rotationY = 0,
}) => {
  const seat1Ref = useRef<THREE.Group>(null);
  const seat2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (seat1Ref.current) {
      seat1Ref.current.rotation.x = Math.sin(t * 2.2) * 0.35;
    }
    if (seat2Ref.current) {
      seat2Ref.current.rotation.x = Math.sin(t * 2.2 + 1.2) * 0.4;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Rubber safety mulch base */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[3.2, 0.04, 2.4]} />
        <meshStandardMaterial color="#854d0e" roughness={0.9} />
      </mesh>
      {/* Timber Border */}
      <mesh position={[0, 0.05, 1.2]}>
        <boxGeometry args={[3.3, 0.08, 0.1]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.05, -1.2]}>
        <boxGeometry args={[3.3, 0.08, 0.1]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.7} />
      </mesh>

      {/* Left A-Frame Post */}
      <group position={[-1.3, 0, 0]}>
        <mesh castShadow position={[0, 1.1, 0.4]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 2.3, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.1, -0.4]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 2.3, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
      </group>

      {/* Right A-Frame Post */}
      <group position={[1.3, 0, 0]}>
        <mesh castShadow position={[0, 1.1, 0.4]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 2.3, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.1, -0.4]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 2.3, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
      </group>

      {/* Top Crossbar */}
      <mesh castShadow position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 2.9, 12]} />
        <meshStandardMaterial color="#0284c7" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Swing Seat 1 */}
      <group position={[-0.6, 2.15, 0]} ref={seat1Ref}>
        {/* Left Chain */}
        <mesh position={[-0.2, -0.85, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.7, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Right Chain */}
        <mesh position={[0.2, -0.85, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.7, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Rubber Strap Seat */}
        <mesh castShadow position={[0, -1.7, 0]}>
          <boxGeometry args={[0.48, 0.04, 0.22]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
      </group>

      {/* Swing Seat 2 */}
      <group position={[0.6, 2.15, 0]} ref={seat2Ref}>
        {/* Left Chain */}
        <mesh position={[-0.2, -0.85, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.7, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Right Chain */}
        <mesh position={[0.2, -0.85, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.7, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Rubber Strap Seat */}
        <mesh castShadow position={[0, -1.7, 0]}>
          <boxGeometry args={[0.48, 0.04, 0.22]} />
          <meshStandardMaterial color="#e11d48" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 2. ADVENTURE SPIRAL SLIDE TOWER
// ------------------------------------------------------------
export const SlideTower3D: React.FC<{ position?: [number, number, number]; rotationY?: number }> = ({
  position = [0, 0, 0],
  rotationY = 0,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Platform Support Posts */}
      {[-0.6, 0.6].map((x, i) =>
        [-0.6, 0.6].map((z, j) => (
          <mesh key={`post_${i}_${j}`} castShadow position={[x, 0.9, z]}>
            <cylinderGeometry args={[0.06, 0.06, 1.8, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        ))
      )}

      {/* Wooden Observation Platform */}
      <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
        <boxGeometry args={[1.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>

      {/* Safety Railings */}
      <mesh position={[0, 2.15, -0.65]}>
        <boxGeometry args={[1.3, 0.6, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[-0.65, 2.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.3, 0.6, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Access Ladder (South side) */}
      <group position={[0, 0.9, 0.7]} rotation={[0.2, 0, 0]}>
        {/* Rails */}
        <mesh position={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.9, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.9, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Rungs */}
        {[-0.6, -0.2, 0.2, 0.6].map((y, idx) => (
          <mesh key={`rung_${idx}`} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.58, 8]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        ))}
      </group>

      {/* Curved Slide Chute (East side) */}
      <group position={[0.65, 1.75, 0]}>
        {/* Slide entrance arch */}
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.3, 0.04, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Slide Chute Body */}
        <mesh
          castShadow
          position={[0.8, -0.7, 0]}
          rotation={[0, 0, -0.6]}
        >
          <cylinderGeometry args={[0.32, 0.35, 2.0, 16, 1, true, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Slide Exit Ramp */}
        <mesh position={[1.65, -1.65, 0]}>
          <boxGeometry args={[0.7, 0.06, 0.55]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
      </group>

      {/* Pyramid Roof Canopy */}
      <mesh castShadow position={[0, 2.75, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.2, 0.7, 4]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 3. GEODESIC CLIMBING DOME
// ------------------------------------------------------------
export const ClimbingDome3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, 0],
}) => {
  return (
    <group position={position}>
      {/* Base ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.2, 16]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Geodesic Dome Wireframe Lattice */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <sphereGeometry args={[1.15, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.5}
          roughness={0.3}
          wireframe
          wireframeLinewidth={3}
        />
      </mesh>
      {/* Climbing Grip Nodes */}
      {[-0.8, 0, 0.8].map((x, i) =>
        [-0.8, 0, 0.8].map((z, j) => (
          <mesh key={`grip_${i}_${j}`} position={[x * 0.9, 0.75 + Math.random() * 0.3, z * 0.9]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#ef4444" roughness={0.4} />
          </mesh>
        ))
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 4. SEESAW / TEETER-TOTTER
// ------------------------------------------------------------
export const Seesaw3D: React.FC<{ position?: [number, number, number]; rotationY?: number }> = ({
  position = [0, 0, 0],
  rotationY = 0,
}) => {
  const plankRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (plankRef.current) {
      plankRef.current.rotation.z = Math.sin(t * 1.8) * 0.22;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Central Fulcrum / Base Triangle */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.3, 0.6, 4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>

      {/* Seesaw Plank & Seats */}
      <group position={[0, 0.55, 0]} ref={plankRef}>
        {/* Long Timber Plank */}
        <mesh castShadow position={[0, 0.04, 0]}>
          <boxGeometry args={[2.4, 0.07, 0.28]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
        {/* Left Seat */}
        <mesh position={[-1.0, 0.12, 0]}>
          <boxGeometry args={[0.32, 0.06, 0.3]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Left Handle */}
        <mesh position={[-0.8, 0.24, 0]}>
          <torusGeometry args={[0.1, 0.02, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Right Seat */}
        <mesh position={[1.0, 0.12, 0]}>
          <boxGeometry args={[0.32, 0.06, 0.3]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Right Handle */}
        <mesh position={[0.8, 0.24, 0]}>
          <torusGeometry args={[0.1, 0.02, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
};
