// ============================================================
// THE GREAT NUMBER RAILWAY — Environment & Storybook Stations
// Matching the reference image:
// - Blue curved canopy station with white/red "STATION" sign
// - Silver lattice truss frame and yellow column footings
// - Concrete platform with yellow hazard curb and park bench
// - Layered cartoon pine trees, fluffy bushes, and 3D floating clouds
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ── Storybook Cartoon Station Component ──
interface CartoonStationProps {
  position: [number, number, number];
  name: string;
  isCurrentStation?: boolean;
  isNextDestination?: boolean;
}

export const CartoonStation: React.FC<CartoonStationProps> = ({
  position,
  name,
  isCurrentStation = false,
  isNextDestination = false,
}) => {
  return (
    <group position={position}>
      {/* ── 1. Concrete Platform with Hazard Warning Stripe ── */}
      <group position={[-1.2, 0, 0]}>
        {/* Main Platform Slab */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[2.8, 0.2, 5.2]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
        </mesh>

        {/* Yellow Safety Hazard Stripe along Track Curb */}
        <mesh position={[1.36, 0.205, 0]}>
          <boxGeometry args={[0.08, 0.01, 5.2]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
        {/* Orange Hazard Accent */}
        <mesh position={[1.3, 0.205, 0]}>
          <boxGeometry args={[0.04, 0.01, 5.2]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} />
        </mesh>

        {/* Park Bench on Platform (Matching Reference Image!) */}
        <group position={[0, 0.2, 0.8]}>
          {/* Wooden Slats */}
          {[-0.08, 0.04, 0.16].map((z, i) => (
            <mesh key={i} position={[0, 0.22, z]}>
              <boxGeometry args={[1.4, 0.03, 0.09]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.5} />
            </mesh>
          ))}
          {/* Backrest Slats */}
          {[0.32, 0.44].map((y, i) => (
            <mesh key={`b-${i}`} position={[-0.12, y, -0.12]}>
              <boxGeometry args={[1.4, 0.08, 0.03]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.5} />
            </mesh>
          ))}
          {/* Bench Legs */}
          {[-0.6, 0.6].map((x, i) => (
            <group key={`leg-${i}`} position={[x, 0.12, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.06, 0.24, 0.35]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ── 2. Station Canopy Roof & Steel Truss Structure ── */}
      <group position={[-1.2, 0, 0]}>
        {/* Twin Steel Columns with Bright Yellow Footing Boots */}
        {[-1.8, 1.8].map((z, i) => (
          <group key={`col-${i}`} position={[0.9, 0, z]}>
            {/* Bright Yellow Base Cylinder Boot (Matching Reference Image!) */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.16, 0.18, 0.24, 16]} />
              <meshStandardMaterial color="#facc15" roughness={0.3} />
            </mesh>
            {/* Silver Steel Column Post */}
            <mesh position={[0, 1.35, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 2.1, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Silver Lattice Truss Network Support Beam */}
        <group position={[0.9, 2.35, 0]}>
          <mesh>
            <boxGeometry args={[0.12, 0.22, 4.0]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Zig-Zag Diagonal Truss Struts */}
          {[-1.4, -0.7, 0, 0.7, 1.4].map((z, i) => (
            <mesh key={`strut-${i}`} position={[0, 0, z]} rotation={[0.6 * (i % 2 === 0 ? 1 : -1), 0, 0]}>
              <boxGeometry args={[0.04, 0.28, 0.04]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* ── Curved Royal Blue Station Canopy Roof (Direct Match to Image!) ── */}
        <group position={[0.3, 2.65, 0]}>
          {/* Main Curved Blue Canopy Shell */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, -0.05]}>
            <boxGeometry args={[2.4, 0.18, 4.4]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Top Arch Ridge */}
          <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 4.4, 24, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#0369a1" roughness={0.3} />
          </mesh>

          {/* ── Prominent "STATION" Sign Board (Matching Image!) ── */}
          <group position={[0.65, -0.15, 0]}>
            {/* White Rectangular Sign Board with Red Frame */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.04, 0.46, 1.8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            {/* Red Border Frame */}
            <mesh position={[-0.01, 0, 0]}>
              <boxGeometry args={[0.04, 0.52, 1.86]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            {/* Dark "STATION" Letters Indicator Plate */}
            <mesh position={[0.025, 0, 0]}>
              <boxGeometry args={[0.02, 0.24, 1.4]} />
              <meshStandardMaterial color="#991b1b" roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* Station Name Board on Platform */}
        <group position={[-0.8, 1.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.35, 2.0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[0.02, 0.22, 1.8]} />
            <meshStandardMaterial
              color={isCurrentStation ? '#38bdf8' : isNextDestination ? '#4ade80' : '#facc15'}
              emissive={isCurrentStation ? '#0284c7' : isNextDestination ? '#16a34a' : '#ca8a04'}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ── Storybook Layered Pine Tree (Matching Cartoon Image!) ──
export const CartoonPineTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Brown Tree Trunk */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* Layer 1 (Bottom Tier) */}
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.85, 0.95, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>

      {/* Layer 2 (Middle Tier) */}
      <mesh position={[0, 1.9, 0]}>
        <coneGeometry args={[0.7, 0.9, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>

      {/* Layer 3 (Top Tier Pointy Peak) */}
      <mesh position={[0, 2.45, 0]}>
        <coneGeometry args={[0.5, 0.85, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.7} />
      </mesh>
    </group>
  );
};

// ── Fluffy Cartoon Bush / Shrub ──
export const CartoonBush: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.42, 10, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} />
      </mesh>
      <mesh position={[-0.24, 0.2, 0.1]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      <mesh position={[0.22, 0.22, -0.05]}>
        <sphereGeometry args={[0.32, 8, 6]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
};

// ── Fluffy 3D Cartoon Clouds Floating in Sky ──
export const CartoonCloud: React.FC<{ position: [number, number, number]; speed?: number; scale?: number }> = ({
  position,
  speed = 0.5,
  scale = 1,
}) => {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.position.x += speed * delta;
      if (cloudRef.current.position.x > 45) {
        cloudRef.current.position.x = -45;
      }
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 12, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[-1.2, -0.2, 0]}>
        <sphereGeometry args={[1.1, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[1.2, -0.2, 0.2]}>
        <sphereGeometry args={[1.0, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0.4, 0.6, -0.1]}>
        <sphereGeometry args={[1.2, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[-0.6, 0.5, 0.1]}>
        <sphereGeometry args={[1.0, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
    </group>
  );
};

// ── Landscape Ground with Ballast Roadway ──
export const StorybookGround: React.FC = () => {
  return (
    <group>
      {/* Vibrant Green Grass Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#65a30d" roughness={0.85} />
      </mesh>

      {/* Earthy Track Ballast Layer under track path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -16]} receiveShadow>
        <planeGeometry args={[5, 60]} />
        <meshStandardMaterial color="#78716c" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0.01, -16]} receiveShadow>
        <circleGeometry args={[16, 32]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.95} />
      </mesh>
    </group>
  );
};
