// ============================================================
// EQUATION MISSION CONTROL — Daytime Atmosphere 3D Environment
// Pure Bright Sunny Aerospace Testing Campus:
// - Bright Blue Sky Dome with Soft Volumetric Clouds
// - Distant White Research Buildings & Hangar Structures
// - Manicured Green Lawns & Perimeter Security Fencing
// - Flapping Aerospace Mission Flags & Soaring Birds
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ── Low-Poly Gliding Bird ──
const SoaringBird: React.FC<{
  initialPos: [number, number, number];
  speed: number;
  radius: number;
}> = ({ initialPos, speed, radius }) => {
  const birdRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!birdRef.current) return;
    const t = Date.now() * 0.001 * speed;
    birdRef.current.position.x = initialPos[0] + Math.cos(t) * radius;
    birdRef.current.position.z = initialPos[2] + Math.sin(t) * radius;
    birdRef.current.position.y = initialPos[1] + Math.sin(t * 1.5) * 0.4;
    birdRef.current.rotation.y = -t - Math.PI / 2;

    const flap = Math.sin(Date.now() * 0.012) * 0.4;
    if (leftWingRef.current) leftWingRef.current.rotation.z = flap;
    if (rightWingRef.current) rightWingRef.current.rotation.z = -flap;
  });

  return (
    <group ref={birdRef} position={initialPos} scale={[0.35, 0.35, 0.35]}>
      {/* Body */}
      <mesh>
        <coneGeometry args={[0.08, 0.4, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Left Wing */}
      <mesh ref={leftWingRef} position={[-0.22, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.14]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Right Wing */}
      <mesh ref={rightWingRef} position={[0.22, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.14]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
};

// ── Drifting Volumetric Cloud ──
const CartoonCloud: React.FC<{
  position: [number, number, number];
  scale?: number;
  speed?: number;
}> = ({ position, scale = 1, speed = 0.5 }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += delta * speed;
      if (ref.current.position.x > 35) ref.current.position.x = -35;
    }
  });

  return (
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[-1.2, -0.2, 0.3]}>
        <sphereGeometry args={[1.1, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[1.3, -0.1, -0.2]}>
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.6, 0.2]}>
        <sphereGeometry args={[1.0, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
};

// ── Flapping Aerospace Flag ──
const AerospaceFlag: React.FC<{
  position: [number, number, number];
  color: string;
}> = ({ position, color }) => {
  const flagClothRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (flagClothRef.current) {
      const wave = Math.sin(Date.now() * 0.008 + position[0]) * 0.18;
      flagClothRef.current.rotation.y = wave;
    }
  });

  return (
    <group position={position}>
      {/* Flagpole */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 5.0, 10]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      {/* Gold Finial */}
      <mesh position={[0, 5.05, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#facc15" metalness={0.9} />
      </mesh>
      {/* Cloth */}
      <group ref={flagClothRef} position={[0.45, 4.3, 0]}>
        <mesh>
          <boxGeometry args={[0.85, 0.55, 0.02]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

export const DaytimeAtmosphere3D: React.FC = () => {
  return (
    <group>
      {/* ── 1. GROUND PLANE (CAMPUS ASPHALT & GREEN LAWNS) ── */}
      {/* Main Concrete Runway & Apron */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[32, 32, 0.1, 32]} />
        <meshStandardMaterial color="#64748b" roughness={0.95} />
      </mesh>

      {/* Surrounding Green Campus Grass */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </mesh>

      {/* ── 2. DISTANT RESEARCH BUILDINGS & HANGARS ── */}
      {/* Main Vehicle Assembly Building (VAB Hangar) in Background */}
      <group position={[-16, 0, -22]}>
        <mesh position={[0, 5.5, 0]} castShadow>
          <boxGeometry args={[12, 11, 14]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Blue Center Stripe */}
        <mesh position={[0, 5.5, 7.02]}>
          <boxGeometry args={[3.2, 11, 0.05]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        {/* Large Hangar Door */}
        <mesh position={[0, 4.0, 7.04]}>
          <boxGeometry args={[6.5, 8.0, 0.05]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Mission Operations Facility (Right Background) */}
      <group position={[18, 0, -18]}>
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[14, 7, 10]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        {/* Glass Windows Ribbon */}
        {[-3.0, 3.0].map((x, i) => (
          <mesh key={`win-ribbon-${i}`} position={[x, 4.5, 5.02]}>
            <boxGeometry args={[5.2, 1.2, 0.05]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* ── 3. AEROSPACE MISSION FLAGS ── */}
      <AerospaceFlag position={[-8.5, 0, 8]} color="#2563eb" />
      <AerospaceFlag position={[8.5, 0, 8]} color="#dc2626" />
      <AerospaceFlag position={[0, 0, 12]} color="#f59e0b" />

      {/* ── 4. DRIFTING CLOUDS IN BRIGHT SUNNY SKY ── */}
      <CartoonCloud position={[-18, 16, -20]} scale={1.4} speed={0.4} />
      <CartoonCloud position={[12, 18, -30]} scale={1.8} speed={0.3} />
      <CartoonCloud position={[22, 15, -10]} scale={1.2} speed={0.5} />
      <CartoonCloud position={[-10, 20, 10]} scale={1.5} speed={0.4} />

      {/* ── 5. SOARING BIRDS ── */}
      <SoaringBird initialPos={[-12, 12, -8]} speed={0.8} radius={10} />
      <SoaringBird initialPos={[14, 14, -14]} speed={0.6} radius={12} />
    </group>
  );
};
