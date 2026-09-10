// ============================================================
// EQUATION MISSION CONTROL 2.0 — Bright Daytime Atmosphere 3D
// Premium Sunlit Aerospace Campus Environment featuring:
// - Bright Blue Sky Dome + Soft Drifting 3D Cumulus Clouds
// - Warm Golden Sunlight with Soft Shadow Directional Rig
// - Soaring 3D High-Altitude Birds in Gentle Loops
// - White VAB Assembly Hangars & Blue-Glass Mission Control Buildings
// - Landscaped Manicured Lawns, Stylized Campus Trees & Shrubs
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Animated Fluffy Cumulus Cloud
const FluffyCloud3D: React.FC<{
  position: [number, number, number];
  scale?: number;
  speed?: number;
}> = ({ position, scale = 1, speed = 0.05 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * speed * 2.0;
      if (groupRef.current.position.x > 35) {
        groupRef.current.position.x = -35;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.0, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[-1.4, -0.3, 0.4]}>
        <sphereGeometry args={[1.5, 14, 14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[1.4, -0.2, -0.3]}>
        <sphereGeometry args={[1.6, 14, 14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.7, 0.2]}>
        <sphereGeometry args={[1.3, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
};

// Soaring 3D Birds in Sky
const SoaringBirds3D: React.FC = () => {
  const birdsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (birdsRef.current) {
      birdsRef.current.rotation.y = time * 0.15;
    }
  });

  const birdPositions = useMemo(
    () => [
      [14, 18, -6],
      [16, 19, -8],
      [15, 18.5, -4],
      [18, 20, -10],
      [13, 17.8, -7],
    ],
    []
  );

  return (
    <group ref={birdsRef} position={[0, 0, 0]}>
      {birdPositions.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Left Wing */}
          <mesh rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.4, 0.02, 0.1]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
          {/* Right Wing */}
          <mesh rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.4, 0.02, 0.1]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Stylized Campus Tree
const CampusTree3D: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 1.6, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Lower Foliage */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} />
      </mesh>
      {/* Upper Foliage */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[0.65, 10, 10]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
};

export const DaytimeAtmosphere3D: React.FC = () => {
  return (
    <group>
      {/* ── 1. LIGHTING RIG (Warm Golden Daylight) ── */}
      <ambientLight intensity={1.1} color="#f0f9ff" />
      <directionalLight
        position={[15, 30, 20]}
        intensity={2.2}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0002}
      />
      {/* Secondary Soft Skylight Fill */}
      <directionalLight position={[-15, 20, -10]} intensity={0.6} color="#bae6fd" />

      {/* ── 2. SKY DOME & ATMOSPHERIC FOG ── */}
      <color attach="background" args={['#7dd3fc']} />
      <fog attach="fog" args={['#bae6fd', 30, 75]} />

      {/* ── 3. DISTANT VAB & MISSION CONTROL RESEARCH BUILDINGS ── */}
      <group position={[0, 0, -12]}>
        {/* Main Vehicle Assembly Building (VAB) Hangar */}
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 9, 7]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Blue Tinted Thermal Glass Facade */}
        <mesh position={[0, 4.5, 3.52]}>
          <planeGeometry args={[10, 6.5]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.1}
            metalness={0.85}
          />
        </mesh>
        {/* VAB Roof HVAC Units & Communications Mast */}
        <mesh position={[0, 9.4, 0]}>
          <boxGeometry args={[4, 0.8, 3]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0, 10.8, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 2.0, 8]} />
          <meshStandardMaterial color="#dc2626" metalness={0.8} />
        </mesh>

        {/* Left Aerospace Research Annex Building */}
        <mesh position={[-13, 3.2, 2]} castShadow receiveShadow>
          <boxGeometry args={[8, 6.4, 6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        <mesh position={[-13, 3.2, 5.02]}>
          <planeGeometry args={[6, 3.5]} />
          <meshStandardMaterial color="#0369a1" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Right Operations & Logistics Building */}
        <mesh position={[13, 3.2, 2]} castShadow receiveShadow>
          <boxGeometry args={[8, 6.4, 6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        <mesh position={[13, 3.2, 5.02]}>
          <planeGeometry args={[6, 3.5]} />
          <meshStandardMaterial color="#0369a1" roughness={0.1} metalness={0.8} />
        </mesh>
      </group>

      {/* ── 4. MANICURED LAWNS & GREEN CAMPUS PERIMETER ── */}
      {/* Background Lawn */}
      <mesh position={[0, -0.08, -8.5]} receiveShadow>
        <planeGeometry args={[44, 10]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </mesh>

      {/* Left Perimeter Lawn */}
      <mesh position={[-17, -0.08, 2]} receiveShadow>
        <planeGeometry args={[10, 26]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </mesh>

      {/* Right Perimeter Lawn */}
      <mesh position={[17, -0.08, 2]} receiveShadow>
        <planeGeometry args={[10, 26]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </mesh>

      {/* ── 5. CAMPUS TREES & SHRUBS ── */}
      {[
        [-14, 0, -5],
        [-16, 0, -2],
        [-15, 0, 3],
        [-17, 0, 7],
        [14, 0, -5],
        [16, 0, -2],
        [15, 0, 3],
        [17, 0, 7],
      ].map((pos, i) => (
        <CampusTree3D
          key={i}
          position={pos as [number, number, number]}
          scale={0.9 + (i % 3) * 0.15}
        />
      ))}

      {/* ── 6. FLUFFY DRIFTING 3D CUMULUS CLOUDS ── */}
      <FluffyCloud3D position={[-18, 16, -14]} scale={1.2} speed={0.06} />
      <FluffyCloud3D position={[8, 19, -16]} scale={1.5} speed={0.04} />
      <FluffyCloud3D position={[-5, 21, -20]} scale={1.8} speed={0.05} />
      <FluffyCloud3D position={[22, 17, -12]} scale={1.1} speed={0.07} />

      {/* ── 7. SOARING 3D BIRDS IN SUNNY SKY ── */}
      <SoaringBirds3D />
    </group>
  );
};
