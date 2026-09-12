// ============================================================
// PATTERN RACERS — Daylight Facility Environment 3D
// High-Resolution Daylight Mathematical Grand Prix Facility:
// - Crisp sun lighting, realistic soft shadows & azure sky
// - Distant mountain silhouettes, lush grass terrain & low-poly pine trees
// - Asphalt racetrack with red/white curbs, painted team pit boxes & tarmac skid marks
// - Detailed Pit Equipment: Rolling Tool Chests, Tire Stacks, Cones & Pit Wall Terminals
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

  const rubberTireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#18181b',
        roughness: 0.9,
        metalness: 0.1,
      }),
    []
  );

  const chromeRimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.9,
        roughness: 0.2,
      }),
    []
  );

  return (
    <group>
      {/* ── 1. DAYLIGHT LIGHTING & SUN RIG ── */}
      <ambientLight intensity={0.9} color="#ffffff" />
      <directionalLight
        position={[18, 28, 14]}
        intensity={1.75}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0001}
        color="#fffbeb"
      />
      {/* Soft Blue Sky Fill */}
      <directionalLight position={[-12, 16, -10]} intensity={0.5} color="#bae6fd" />

      {/* ── 2. GROUND PLANES (Grass + Asphalt Main Pad + Pit Aprons) ── */}
      {/* Outer lush grass terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow material={grassMat}>
        <planeGeometry args={[140, 140]} />
      </mesh>

      {/* Facility Asphalt Paved Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={asphaltMat}>
        <planeGeometry args={[28, 54]} />
      </mesh>

      {/* Left Pit Lane Concrete Apron (Blue Team Garage Front) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.5, 0.02, 0]} receiveShadow material={concreteMat}>
        <planeGeometry args={[9, 48]} />
      </mesh>

      {/* Right Pit Lane Concrete Apron (Red Team Garage Front) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8.5, 0.02, 0]} receiveShadow material={concreteMat}>
        <planeGeometry args={[9, 48]} />
      </mesh>

      {/* ── PAINTED TEAM PIT BOXES (On Asphalt) ── */}
      {/* Blue Team Box #01 */}
      <group position={[-2.2, 0.03, 6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.8, 5.0]} />
          <meshBasicMaterial color="#1d4ed8" transparent opacity={0.25} />
        </mesh>
        {/* White Border Lines */}
        {[-1.4, 1.4].map((x, i) => (
          <mesh key={`b-border-${i}`} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.12, 5.0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Red Team Box #02 */}
      <group position={[2.2, 0.03, 6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.8, 5.0]} />
          <meshBasicMaterial color="#b91c1c" transparent opacity={0.25} />
        </mesh>
        {/* White Border Lines */}
        {[-1.4, 1.4].map((x, i) => (
          <mesh key={`r-border-${i}`} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.12, 5.0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* ── 3. RACETRACK CURBS (Red & White Alternating Slabs) ── */}
      {[-4.6, 4.6].map((xPos, sideIdx) => (
        <group key={`curb-side-${sideIdx}`} position={[xPos, 0.04, 0]}>
          {Array.from({ length: 24 }).map((_, i) => (
            <mesh
              key={`curb-${i}`}
              position={[0, 0, -23 + i * 2]}
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
      <group position={[-12.5, 0, -2]}>
        {/* Main Hangar Building */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[7, 5.6, 26]} />
        </mesh>
        {/* Blue Accent Trim */}
        <mesh position={[3.3, 5.1, 0]}>
          <boxGeometry args={[0.45, 0.6, 26.1]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} />
        </mesh>
        {/* Garage Bay Openings */}
        {[-8, -2, 4].map((z, idx) => (
          <group key={`blue-bay-${idx}`} position={[3.3, 1.5, z]}>
            <mesh material={darkMetalMat}>
              <boxGeometry args={[0.4, 3.0, 4.2]} />
            </mesh>
            {/* Glass Viewing Window */}
            <mesh position={[-0.1, 2.1, 0]} material={glassMat}>
              <boxGeometry args={[0.2, 0.8, 4.0]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Garage Complex (Red Operations) */}
      <group position={[12.5, 0, -2]}>
        {/* Main Hangar Building */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[7, 5.6, 26]} />
        </mesh>
        {/* Red Accent Trim */}
        <mesh position={[-3.3, 5.1, 0]}>
          <boxGeometry args={[0.45, 0.6, 26.1]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        {/* Garage Bay Openings */}
        {[-8, -2, 4].map((z, idx) => (
          <group key={`red-bay-${idx}`} position={[-3.3, 1.5, z]}>
            <mesh material={darkMetalMat}>
              <boxGeometry args={[0.4, 3.0, 4.2]} />
            </mesh>
            {/* Glass Viewing Window */}
            <mesh position={[0.1, 2.1, 0]} material={glassMat}>
              <boxGeometry args={[0.2, 0.8, 4.0]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 5. DETAILED PIT EQUIPMENT (Tool Chests, Tire Stacks, Cones) ── */}
      {/* Blue Team Tool Chest & Equipment Station */}
      <group position={[-6.8, 0, 5.5]}>
        {/* Heavy Blue Tool Cabinet */}
        <mesh position={[0, 0.6, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#1e40af', roughness: 0.3 })}>
          <boxGeometry args={[1.2, 1.2, 0.8]} />
        </mesh>
        {/* Chrome Drawer Handles */}
        {[0.3, 0.6, 0.9].map((y, i) => (
          <mesh key={`b-handle-${i}`} position={[0, y, 0.42]}>
            <boxGeometry args={[0.6, 0.04, 0.04]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} />
          </mesh>
        ))}
        {/* Diagnostic Laptop on Top */}
        <group position={[0, 1.22, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.03, 0.3]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.15, -0.12]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.4, 0.25, 0.02]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>

      {/* Blue Team Tire Stacks (Racing Slicks) */}
      <group position={[-8.5, 0, 4.0]}>
        {[0.16, 0.48, 0.8].map((y, i) => (
          <group key={`b-tire-stack-${i}`} position={[0, y, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow material={rubberTireMat}>
              <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeRimMat}>
              <cylinderGeometry args={[0.2, 0.2, 0.31, 12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Red Team Tool Chest & Equipment Station */}
      <group position={[6.8, 0, 5.5]}>
        {/* Heavy Red Tool Cabinet */}
        <mesh position={[0, 0.6, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#991b1b', roughness: 0.3 })}>
          <boxGeometry args={[1.2, 1.2, 0.8]} />
        </mesh>
        {/* Chrome Drawer Handles */}
        {[0.3, 0.6, 0.9].map((y, i) => (
          <mesh key={`r-handle-${i}`} position={[0, y, 0.42]}>
            <boxGeometry args={[0.6, 0.04, 0.04]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} />
          </mesh>
        ))}
        {/* Diagnostic Laptop on Top */}
        <group position={[0, 1.22, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.03, 0.3]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.15, -0.12]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.4, 0.25, 0.02]} />
            <meshStandardMaterial color="#f87171" emissive="#dc2626" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>

      {/* Red Team Tire Stacks (Racing Slicks) */}
      <group position={[8.5, 0, 4.0]}>
        {[0.16, 0.48, 0.8].map((y, i) => (
          <group key={`r-tire-stack-${i}`} position={[0, y, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow material={rubberTireMat}>
              <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeRimMat}>
              <cylinderGeometry args={[0.2, 0.2, 0.31, 12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Safety Traffic Cones (High-Vis Orange with Reflective Band) */}
      {[
        [-4.2, 0, 8.5],
        [-4.2, 0, 10.5],
        [4.2, 0, 8.5],
        [4.2, 0, 10.5],
      ].map(([x, y, z], idx) => (
        <group key={`cone-${idx}`} position={[x, y, z]}>
          {/* Base */}
          <mesh position={[0, 0.025, 0]} castShadow>
            <boxGeometry args={[0.35, 0.05, 0.35]} />
            <meshStandardMaterial color="#ea580c" roughness={0.5} />
          </mesh>
          {/* Cone Body */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <coneGeometry args={[0.14, 0.45, 12]} />
            <meshStandardMaterial color="#f97316" roughness={0.4} />
          </mesh>
          {/* White Reflective Band */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.1, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ── 6. REAR OBSERVATION & TIMING TOWER ── */}
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

      {/* ── 7. PIT WALL SAFETY BARRIERS ── */}
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

      {/* ── 8. ENVIRONMENTAL LOW-POLY TREES & LANDSCAPING ── */}
      {[
        [-19, 0, -10],
        [-21, 0, 2],
        [-20, 0, 14],
        [19, 0, -10],
        [21, 0, 4],
        [20, 0, 16],
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

      {/* ── 9. DISTANT MOUNTAIN SILHOUETTES ── */}
      <group position={[0, 0, -48]}>
        {[-32, -12, 12, 32].map((x, i) => (
          <mesh key={`mountain-${i}`} position={[x, 10 + (i % 2) * 4, 0]}>
            <coneGeometry args={[24 + (i % 3) * 5, 24, 5]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
