// ============================================================
// PATTERN RACERS — Daylight Facility Environment 3D
// High-Resolution Daylight Mathematical Grand Prix Facility:
// - Crisp sun lighting, realistic soft shadows & azure sky
// - Distant mountain silhouettes, trees, modern pit garages
// - Asphalt racetrack with red/white curbs & concrete work bays
// - Observation towers, safety barriers, and timing gantry
// ============================================================

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export const DaylightFacilityEnvironment3D: React.FC = () => {
  // Shared materials for optimized 60fps rendering
  const asphaltMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#27272a',
        roughness: 0.85,
        metalness: 0.1,
      }),
    []
  );

  const grassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4ade80',
        roughness: 0.9,
        metalness: 0.05,
      }),
    []
  );

  const concreteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.65,
        metalness: 0.2,
      }),
    []
  );

  const curbRedMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dc2626',
        roughness: 0.6,
      }),
    []
  );

  const curbWhiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.6,
      }),
    []
  );

  const buildingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f1f5f9',
        roughness: 0.4,
        metalness: 0.3,
      }),
    []
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.6,
      }),
    []
  );

  const yellowSafetyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#eab308',
        roughness: 0.4,
      }),
    []
  );

  const darkMetalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.5,
        metalness: 0.8,
      }),
    []
  );

  return (
    <group>
      {/* ── 1. DAYLIGHT LIGHTING & SUN RIG ── */}
      <ambientLight intensity={0.85} color="#ffffff" />
      <directionalLight
        position={[15, 25, 12]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
        color="#fffbeb"
      />
      {/* Soft Blue Sky Fill */}
      <directionalLight position={[-10, 15, -10]} intensity={0.45} color="#bae6fd" />

      {/* ── 2. GROUND PLANES (Grass + Asphalt Main Pad) ── */}
      {/* Outer lush grass terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow material={grassMat}>
        <planeGeometry args={[120, 120]} />
      </mesh>

      {/* Facility Asphalt Paved Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={asphaltMat}>
        <planeGeometry args={[26, 50]} />
      </mesh>

      {/* Left Pit Lane Concrete Apron (Blue Team Garage Front) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7.5, 0.02, 0]} receiveShadow material={concreteMat}>
        <planeGeometry args={[8, 46]} />
      </mesh>

      {/* Right Pit Lane Concrete Apron (Red Team Garage Front) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.5, 0.02, 0]} receiveShadow material={concreteMat}>
        <planeGeometry args={[8, 46]} />
      </mesh>

      {/* ── 3. RACETRACK CURBS (Red & White Alternating Slabs) ── */}
      {[-4.6, 4.6].map((xPos, sideIdx) => (
        <group key={`curb-side-${sideIdx}`} position={[xPos, 0.04, 0]}>
          {Array.from({ length: 22 }).map((_, i) => (
            <mesh
              key={`curb-${i}`}
              position={[0, 0, -22 + i * 2]}
              receiveShadow
              material={i % 2 === 0 ? curbRedMat : curbWhiteMat}
            >
              <boxGeometry args={[0.55, 0.08, 1.9]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── 4. PIT GARAGES & ENGINEERING BUILDINGS ── */}
      {/* Left Garage Complex (Blue Operations) */}
      <group position={[-11.5, 0, -2]}>
        {/* Main Hangar Building */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[6, 5, 24]} />
        </mesh>
        {/* Blue Accent Trim */}
        <mesh position={[2.8, 4.5, 0]}>
          <boxGeometry args={[0.45, 0.6, 24.1]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} />
        </mesh>
        {/* Garage Bay Openings */}
        {[-8, -2, 4].map((z, idx) => (
          <group key={`blue-bay-${idx}`} position={[2.8, 1.4, z]}>
            <mesh material={darkMetalMat}>
              <boxGeometry args={[0.4, 2.8, 3.8]} />
            </mesh>
            {/* Glass Viewing Window */}
            <mesh position={[-0.1, 1.9, 0]} material={glassMat}>
              <boxGeometry args={[0.2, 0.8, 3.6]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Garage Complex (Red Operations) */}
      <group position={[11.5, 0, -2]}>
        {/* Main Hangar Building */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[6, 5, 24]} />
        </mesh>
        {/* Red Accent Trim */}
        <mesh position={[-2.8, 4.5, 0]}>
          <boxGeometry args={[0.45, 0.6, 24.1]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        {/* Garage Bay Openings */}
        {[-8, -2, 4].map((z, idx) => (
          <group key={`red-bay-${idx}`} position={[-2.8, 1.4, z]}>
            <mesh material={darkMetalMat}>
              <boxGeometry args={[0.4, 2.8, 3.8]} />
            </mesh>
            {/* Glass Viewing Window */}
            <mesh position={[0.1, 1.9, 0]} material={glassMat}>
              <boxGeometry args={[0.2, 0.8, 3.6]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 5. REAR OBSERVATION & TIMING TOWER ── */}
      <group position={[0, 0, -18]}>
        {/* Central Arch Base */}
        <mesh position={[0, 4, 0]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[14, 8, 4]} />
        </mesh>
        {/* Panoramic Glass Observation Lounge */}
        <mesh position={[0, 6.5, 1.2]} material={glassMat}>
          <boxGeometry args={[12, 2.2, 2]} />
        </mesh>
        {/* Grand Prix Marquee Sign */}
        <mesh position={[0, 7.8, 2.1]} castShadow>
          <boxGeometry args={[10, 1.1, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>

      {/* ── 6. PIT WALL SAFETY BARRIERS & AD SPONSOR BOARDS ── */}
      {[-5.2, 5.2].map((x, sideIdx) => (
        <group key={`barrier-${sideIdx}`} position={[x, 0.45, 4]}>
          <mesh castShadow receiveShadow material={concreteMat}>
            <boxGeometry args={[0.4, 0.9, 26]} />
          </mesh>
          <mesh position={[0, 0.35, 0]} material={yellowSafetyMat}>
            <boxGeometry args={[0.42, 0.15, 26]} />
          </mesh>
        </group>
      ))}

      {/* ── 7. ENVIRONMENTAL LOW-POLY TREES & LANDSCAPING ── */}
      {[
        [-18, 0, -10],
        [-20, 0, 2],
        [-19, 0, 14],
        [18, 0, -10],
        [20, 0, 4],
        [19, 0, 16],
      ].map(([x, y, z], idx) => (
        <group key={`tree-${idx}`} position={[x, y, z]}>
          {/* Trunk */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.45, 2.4, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {/* Foliage Cones */}
          <mesh position={[0, 3.2, 0]} castShadow>
            <coneGeometry args={[1.8, 2.8, 6]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.6, 0]} castShadow>
            <coneGeometry args={[1.3, 2.2, 6]} />
            <meshStandardMaterial color="#16a34a" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ── 8. DISTANT MOUNTAIN SILHOUETTES ── */}
      <group position={[0, 0, -45]}>
        {[-30, -10, 12, 32].map((x, i) => (
          <mesh key={`mountain-${i}`} position={[x, 10 + (i % 2) * 4, 0]}>
            <coneGeometry args={[22 + (i % 3) * 5, 24, 5]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
