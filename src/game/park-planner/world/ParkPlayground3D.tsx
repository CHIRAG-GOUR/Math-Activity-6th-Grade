// ============================================================
// PARK PLANNER — High-Graphics 3D Playground Equipment (Quadrant I)
// Timber swings with seated children swinging naturally, adventure slide tower,
// geodesic climbing dome, seesaw, and safety rubber turf.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { StylizedHuman3D } from './ParkCharacters3D';

// ------------------------------------------------------------
// 1. DUAL TIMBER SWING SET WITH SEATED CHILD
// ------------------------------------------------------------
export const SwingSet3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  const seat1Ref = useRef<THREE.Group>(null);
  const seat2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (seat1Ref.current) {
      seat1Ref.current.rotation.x = Math.sin(t * 2.2) * 0.38;
    }
    if (seat2Ref.current) {
      seat2Ref.current.rotation.x = Math.sin(t * 2.2 + 1.2) * 0.42;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Rubberized Safety Mulch Turf */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[3.4, 0.04, 2.6]} />
        <meshStandardMaterial color="#854d0e" roughness={0.9} />
      </mesh>
      {/* Timber Edging Curbs */}
      <mesh position={[0, 0.05, 1.3]}>
        <boxGeometry args={[3.5, 0.08, 0.12]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.05, -1.3]}>
        <boxGeometry args={[3.5, 0.08, 0.12]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.7} />
      </mesh>

      {/* Left A-Frame Post */}
      <group position={[-1.35, 0, 0]}>
        <mesh castShadow position={[0, 1.15, 0.42]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 2.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.15, -0.42]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 2.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        {/* Cross Strut */}
        <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>

      {/* Right A-Frame Post */}
      <group position={[1.35, 0, 0]}>
        <mesh castShadow position={[0, 1.15, 0.42]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 2.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.15, -0.42]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 2.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        {/* Cross Strut */}
        <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>

      {/* Top Heavy Steel Crossbar */}
      <mesh castShadow position={[0, 2.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 3.0, 12]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Swing Seat 1 (with child riding) */}
      <group position={[-0.65, 2.25, 0]} ref={seat1Ref}>
        {/* Steel Chains */}
        <mesh position={[-0.22, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0.22, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Seat Plank */}
        <mesh castShadow position={[0, -1.8, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        {/* Seated Child Playing */}
        <group position={[0, -1.8, 0]}>
          <StylizedHuman3D
            position={[0, 0, 0]}
            scale={0.58}
            shirtColor="#f59e0b"
            pantsColor="#1e3a8a"
            isWalking={false}
            isSeated={true}
          />
        </group>
      </group>

      {/* Swing Seat 2 */}
      <group position={[0.65, 2.25, 0]} ref={seat2Ref}>
        <mesh position={[-0.22, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0.22, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -1.8, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.24]} />
          <meshStandardMaterial color="#e11d48" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 2. ADVENTURE SPIRAL SLIDE TOWER
// ------------------------------------------------------------
export const SlideTower3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Platform Heavy Timber Posts */}
      {[-0.65, 0.65].map((x, i) =>
        [-0.65, 0.65].map((z, j) => (
          <mesh key={`post_${i}_${j}`} castShadow position={[x, 0.95, z]}>
            <cylinderGeometry args={[0.07, 0.07, 1.9, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        ))
      )}

      {/* Timber Floor Platform */}
      <mesh castShadow receiveShadow position={[0, 1.9, 0]}>
        <boxGeometry args={[1.5, 0.08, 1.5]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>

      {/* Safety Railings */}
      <mesh position={[0, 2.25, -0.7]}>
        <boxGeometry args={[1.4, 0.65, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[-0.7, 2.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.4, 0.65, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Access Ladder (South) */}
      <group position={[0, 0.95, 0.75]} rotation={[0.2, 0, 0]}>
        <mesh position={[-0.32, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 2.0, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.32, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 2.0, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {[-0.65, -0.25, 0.15, 0.55].map((y, idx) => (
          <mesh key={`ladder_step_${idx}`} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.62, 8]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        ))}
      </group>

      {/* Curved Slide Chute (East) */}
      <group position={[0.7, 1.85, 0]}>
        {/* Chute Arch Entrance */}
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.32, 0.04, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Spiral Chute Tube */}
        <mesh castShadow position={[0.85, -0.75, 0]} rotation={[0, 0, -0.62]}>
          <cylinderGeometry args={[0.34, 0.36, 2.1, 16, 1, true, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Soft Exit Ramp */}
        <mesh position={[1.75, -1.75, 0]}>
          <boxGeometry args={[0.75, 0.06, 0.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
      </group>

      {/* Pyramid Shingled Roof */}
      <mesh castShadow position={[0, 2.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.3, 0.8, 4]} />
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
      {/* Base Anchor Ring */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.25, 16]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Geodesic Dome Steel Struts */}
      <mesh castShadow position={[0, 0.85, 0]}>
        <sphereGeometry args={[1.2, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.6}
          roughness={0.3}
          wireframe
          wireframeLinewidth={3}
        />
      </mesh>
      {/* Colorful Climbing Node Grips */}
      {[-0.8, 0, 0.8].map((x, i) =>
        [-0.8, 0, 0.8].map((z, j) => (
          <mesh key={`climb_grip_${i}_${j}`} position={[x * 0.92, 0.8 + ((i + j) % 3) * 0.15, z * 0.92]}>
            <sphereGeometry args={[0.075, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#ef4444' : '#10b981'} roughness={0.4} />
          </mesh>
        ))
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 4. BALANCED SEESAW
// ------------------------------------------------------------
export const Seesaw3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  const plankRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (plankRef.current) {
      plankRef.current.rotation.z = Math.sin(t * 1.8) * 0.24;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy Steel Fulcrum Base */}
      <mesh castShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.09, 0.32, 0.65, 4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.32, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>

      {/* Balanced Seesaw Plank & Seats */}
      <group position={[0, 0.58, 0]} ref={plankRef}>
        <mesh castShadow position={[0, 0.04, 0]}>
          <boxGeometry args={[2.5, 0.08, 0.3]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
        {/* Left Seat */}
        <mesh position={[-1.05, 0.12, 0]}>
          <boxGeometry args={[0.34, 0.06, 0.32]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[-0.85, 0.25, 0]}>
          <torusGeometry args={[0.1, 0.02, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Right Seat */}
        <mesh position={[1.05, 0.12, 0]}>
          <boxGeometry args={[0.34, 0.06, 0.32]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.85, 0.25, 0]}>
          <torusGeometry args={[0.1, 0.02, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
};
