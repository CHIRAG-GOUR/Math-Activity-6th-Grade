'use client';

// ============================================================
// THE SOLAR FORGE: Distant Desert Camel Caravan 3D
// Authentic background desert wildlife: 3-4 recognizable dromedary camels
// with curved arching necks, prominent humps, articulated walking legs,
// head bobbing, and gentle tail sway traversing the distant sandy foothills.
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CamelProps {
  leadOffset: number; // Distance behind caravan leader
  pathSpeed: number;
  scale?: number;
}

const SingleCamel3D: React.FC<CamelProps> = ({ leadOffset, pathSpeed, scale = 1.0 }) => {
  const rootRef = useRef<THREE.Group>(null);
  const headNeckRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const legFLRef = useRef<THREE.Group>(null);
  const legFRRef = useRef<THREE.Group>(null);
  const legBLRef = useRef<THREE.Group>(null);
  const legBRRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // ── DISTANT DESERT TRAIL ROUTE (West to East along foothills) ──
    // Path range: X from -75 to +75, Z between -92 and -102
    const totalLoop = 140; // Total length of path
    const loopTime = (t * pathSpeed * 2.2 + leadOffset) % totalLoop;
    const progress = loopTime / totalLoop; // 0 to 1

    // Traverse from west to east
    const currentX = -70 + progress * 140;
    // Gentle winding trail in the dunes
    const currentZ = -95 + Math.sin(progress * Math.PI * 3) * 6;
    // Slight undulation over sand dunes
    const currentY = 0.6 + Math.sin(progress * Math.PI * 4) * 0.4;

    if (rootRef.current) {
      rootRef.current.position.set(currentX, currentY, currentZ);

      // Facing direction along the path (+X with slight curve)
      const nextProgress = (progress + 0.01) % 1;
      const nextX = -70 + nextProgress * 140;
      const nextZ = -95 + Math.sin(nextProgress * Math.PI * 3) * 6;
      const angle = Math.atan2(nextX - currentX, nextZ - currentZ);
      rootRef.current.rotation.y = angle;
    }

    // ── RHYTHMIC CAMEL WALKING GAIT ──
    const walkCycle = t * 2.8;

    // Head bobbing characteristic of camels
    if (headNeckRef.current) {
      headNeckRef.current.rotation.x = 0.15 + Math.sin(walkCycle) * 0.08;
      headNeckRef.current.rotation.y = Math.cos(walkCycle * 0.5) * 0.06;
    }

    // Gentle tail sway
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(walkCycle * 0.8) * 0.18;
    }

    // 4-Leg Stride Motion (Diagonal gait pairing)
    const legSwing = 0.38;
    if (legFLRef.current) legFLRef.current.rotation.x = Math.sin(walkCycle) * legSwing;
    if (legBRRef.current) legBRRef.current.rotation.x = Math.sin(walkCycle) * legSwing;
    if (legFRRef.current) legFRRef.current.rotation.x = -Math.sin(walkCycle) * legSwing;
    if (legBLRef.current) legBLRef.current.rotation.x = -Math.sin(walkCycle) * legSwing;
  });

  const camelSkin = '#c29b68'; // Warm camel tan
  const camelHump = '#b88f58'; // Slightly darker fur on hump
  const hoofColor = '#574128'; // Dark horn hooves

  return (
    <group ref={rootRef} scale={[scale, scale, scale]}>
      {/* ── 1. MAIN TORSO (Barrel body) ── */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[0.9, 1.15, 2.2]} />
        <meshStandardMaterial color={camelSkin} roughness={0.8} />
      </mesh>

      {/* ── 2. DROMEDARY HUMP ── */}
      <mesh position={[0, 2.45, -0.1]} castShadow>
        <coneGeometry args={[0.65, 0.95, 10]} />
        <meshStandardMaterial color={camelHump} roughness={0.85} />
      </mesh>

      {/* ── 3. LONG ARCHED NECK & HEAD ── */}
      <group ref={headNeckRef} position={[0, 2.1, 1.0]}>
        {/* Lower Arching Neck */}
        <mesh position={[0, 0.55, 0.35]} rotation={[-0.48, 0, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.38, 1.25, 8]} />
          <meshStandardMaterial color={camelSkin} roughness={0.8} />
        </mesh>
        {/* Upper Neck */}
        <mesh position={[0, 1.25, 0.7]} rotation={[0.25, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 0.85, 8]} />
          <meshStandardMaterial color={camelSkin} roughness={0.8} />
        </mesh>
        {/* Sculpted Head & Snout */}
        <mesh position={[0, 1.62, 0.9]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.45, 0.85]} />
          <meshStandardMaterial color={camelSkin} roughness={0.8} />
        </mesh>
        {/* Muzzle */}
        <mesh position={[0, 1.5, 1.38]} castShadow>
          <boxGeometry args={[0.32, 0.3, 0.45]} />
          <meshStandardMaterial color="#ab814c" roughness={0.85} />
        </mesh>
        {/* Left & Right Ears */}
        <mesh position={[-0.22, 1.88, 0.65]} rotation={[-0.3, 0, -0.4]}>
          <coneGeometry args={[0.07, 0.22, 5]} />
          <meshStandardMaterial color={camelSkin} />
        </mesh>
        <mesh position={[0.22, 1.88, 0.65]} rotation={[-0.3, 0, 0.4]}>
          <coneGeometry args={[0.07, 0.22, 5]} />
          <meshStandardMaterial color={camelSkin} />
        </mesh>
      </group>

      {/* ── 4. TAIL WITH TUFT ── */}
      <group ref={tailRef} position={[0, 1.9, -1.1]}>
        <mesh position={[0, -0.4, -0.05]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.85, 6]} />
          <meshStandardMaterial color={camelSkin} />
        </mesh>
        {/* Dark Tail Tuft */}
        <mesh position={[0, -0.85, -0.1]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#4a3722" />
        </mesh>
      </group>

      {/* ── 5. FOUR ARTICULATED LEGS ── */}
      {/* Front Left Leg */}
      <group ref={legFLRef} position={[-0.38, 1.2, 0.75]}>
        <mesh position={[0, -0.58, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.1, 1.2, 6]} />
          <meshStandardMaterial color={camelSkin} roughness={0.8} />
        </mesh>
        <mesh position={[0, -1.18, 0.04]}>
          <boxGeometry args={[0.18, 0.12, 0.24]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>

      {/* Front Right Leg */}
      <group ref={legFRRef} position={[0.38, 1.2, 0.75]}>
        <mesh position={[0, -0.58, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.1, 1.2, 6]} />
          <meshStandardMaterial color={camelSkin} roughness={0.8} />
        </mesh>
        <mesh position={[0, -1.18, 0.04]}>
          <boxGeometry args={[0.18, 0.12, 0.24]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>

      {/* Back Left Leg */}
      <group ref={legBLRef} position={[-0.38, 1.2, -0.75]}>
        <mesh position={[0, -0.58, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.11, 1.2, 6]} />
          <meshStandardMaterial color={camelSkin} roughness={0.8} />
        </mesh>
        <mesh position={[0, -1.18, 0.04]}>
          <boxGeometry args={[0.18, 0.12, 0.24]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>

      {/* Back Right Leg */}
      <group ref={legBRRef} position={[0.38, 1.2, -0.75]}>
        <mesh position={[0, -0.58, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.11, 1.2, 6]} />
          <meshStandardMaterial color={camelSkin} roughness={0.8} />
        </mesh>
        <mesh position={[0, -1.18, 0.04]}>
          <boxGeometry args={[0.18, 0.12, 0.24]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>
    </group>
  );
};

export const CamelCaravan3D: React.FC = () => {
  return (
    <group>
      {/* Caravan Leader */}
      <SingleCamel3D leadOffset={0} pathSpeed={1.0} scale={1.05} />
      {/* Caravan Second Camel */}
      <SingleCamel3D leadOffset={-7.5} pathSpeed={1.0} scale={0.98} />
      {/* Caravan Third Camel */}
      <SingleCamel3D leadOffset={-14.8} pathSpeed={1.0} scale={1.0} />
      {/* Caravan Calf / Fourth Camel */}
      <SingleCamel3D leadOffset={-21.2} pathSpeed={1.0} scale={0.82} />
    </group>
  );
};
