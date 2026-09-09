// ============================================================
// BLUEPRINT BLITZ — Bright Sunny Daytime Construction District
// A cheerful, realistic, warm and premium 3D work site:
// - Blue Team Site on LEFT (x = -9)
// - Central Architectural Inspection Tower (x = 0)
// - Red Team Site on RIGHT (x = +9)
// - Active Heavy Machinery: Yellow Excavator, Articulated Dump Truck, Rotating Cement Mixer
// - 3D Construction Crew: Hard hats, high-vis reflective safety vests, surveyor instruments
// - Architecture: Unfinished concrete building with scaffolding, sunny city skyline, flying birds
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useBlueprintStore } from '../store/blueprintStore';
import { ConstructionPlot3D } from './ConstructionPlot3D';
import { Excavator3D, DumpTruck3D, CementMixer3D } from './ConstructionMachinery3D';
import { ConstructionCrew3D } from './ConstructionWorkers3D';
import { UnfinishedBuilding3D, FlyingBirds3D, SunnyCityBackdrop3D } from './DaytimeSkyAndCity3D';

export const ConstructionDistrict3D: React.FC = () => {
  const { blueTeam, redTeam, activeChallenge, phase } = useBlueprintStore();
  const bgCraneRef = useRef<THREE.Group>(null);

  const isScanning = phase === 'scanning';
  const mechanic = activeChallenge?.mechanic || 'cubes';

  // Background crane rotation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (bgCraneRef.current) {
      bgCraneRef.current.rotation.y = Math.sin(t * 0.25) * 0.4 + 0.3;
    }
  });

  return (
    <group>
      {/* ── 1. BRIGHT SUNNY DAYTIME LIGHTING ── */}
      <ambientLight intensity={1.0} color="#ffffff" />
      <directionalLight
        position={[20, 32, 24]}
        intensity={1.9}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-20, 18, -12]} intensity={0.7} color="#bae6fd" />
      <hemisphereLight groundColor="#78350f" color="#fef08a" intensity={0.7} />

      {/* ── 2. SUNNY SKY & CLOUDS & BIRDS ── */}
      <FlyingBirds3D />

      {/* Low-Poly Fluffy Daytime Clouds */}
      <group position={[0, 22, -28]}>
        {[-30, -12, 10, 28].map((x, idx) => (
          <group key={idx} position={[x, (idx % 2) * 2, idx * 2]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[3.5, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[2.2, -0.4, 0]}>
              <sphereGeometry args={[2.5, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[-2.2, -0.4, 0]}>
              <sphereGeometry args={[2.5, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 3. WARM SANDY / GRAVEL CONSTRUCTION TERRAIN ── */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[130, 90]} />
        <meshStandardMaterial color="#d4b895" roughness={0.9} />
      </mesh>

      {/* Concrete Paved Haul Roads */}
      <mesh position={[0, -0.58, 8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[130, 7]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>
      {/* Road Yellow Hazard Markings */}
      <group position={[0, -0.56, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        {[-40, -25, -10, 5, 20, 35].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]}>
            <planeGeometry args={[4, 0.4]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
        ))}
      </group>

      {/* ── 4. MODERN SUNNY CITY & UNFINISHED BUILDING BACKDROP ── */}
      <SunnyCityBackdrop3D />
      <UnfinishedBuilding3D position={[0, 0, -22]} />

      {/* ── 5. LEFT SITE: BLUE TEAM CONSTRUCTION PLOT (x = -9) ── */}
      <ConstructionPlot3D
        teamId="blue"
        teamName={blueTeam.name}
        score={blueTeam.score}
        build={blueTeam.build}
        mechanic={mechanic}
        isScanning={isScanning}
        position={[-9, 0, 0]}
      />

      {/* ── 6. RIGHT SITE: RED TEAM CONSTRUCTION PLOT (x = +9) ── */}
      <ConstructionPlot3D
        teamId="red"
        teamName={redTeam.name}
        score={redTeam.score}
        build={redTeam.build}
        mechanic={mechanic}
        isScanning={isScanning}
        position={[9, 0, 0]}
      />

      {/* ── 7. CENTRAL ARCHITECTURAL INSPECTION PEDESTAL (x = 0) ── */}
      <group position={[0, 0, -4.5]}>
        {/* Concrete Foundation Base */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 2.2, 2.4, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Golden Central Compass Emblem */}
        <mesh position={[0, 2.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 1.4, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Central Holographic Architecture Tower Title */}
        <Float speed={2} rotationIntensity={0.06} floatIntensity={0.15}>
          <group position={[0, 4.3, 0]}>
            <mesh>
              <boxGeometry args={[4.2, 1.3, 0.2]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.12]}>
              <planeGeometry args={[4.0, 1.1]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
            <Text
              position={[0, 0.22, 0.14]}
              fontSize={0.38}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#0f172a"
            >
              📐 BLUEPRINT BLITZ
            </Text>
            <Text
              position={[0, -0.22, 0.14]}
              fontSize={0.22}
              color="#fef08a"
              anchorX="center"
              anchorY="middle"
            >
              BUILD IT • MEASURE IT • BEAT THE CLOCK
            </Text>
          </group>
        </Float>
      </group>

      {/* ── 8. ACTIVE 3D CONSTRUCTION MACHINERY ── */}
      {/* Heavy Yellow Tracked Excavator (Left Worksite) */}
      <Excavator3D position={[-14.5, 0, 1.8]} rotation={[0, 0.6, 0]} />

      {/* Articulated Heavy Red Dump Truck (Right Worksite, Reference Image 1) */}
      <DumpTruck3D position={[15.0, 0, 1.5]} rotation={[0, -0.7, 0]} />

      {/* Rotating Cement Mixer Truck (Rear Center-Left) */}
      <CementMixer3D position={[-6.5, 0, -11]} rotation={[0, 0.4, 0]} />

      {/* Distant Active Tower Crane */}
      <group ref={bgCraneRef} position={[16, 0, -26]}>
        <mesh position={[0, 9, 0]}>
          <cylinderGeometry args={[0.25, 0.3, 18, 6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.6} />
        </mesh>
        <mesh position={[-4, 18, 0]}>
          <boxGeometry args={[12, 0.3, 0.3]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* ── 9. 3D CONSTRUCTION CREW (Hard Hats, Safety Vests) ── */}
      <ConstructionCrew3D />

      {/* ── 10. REALISTIC FOREGROUND CONSTRUCTION SITE PROPS ── */}
      {/* Wooden Cargo Crates (Reference Image 1) */}
      <group position={[-2.5, 0, 5.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.0, 1.0, 1.0]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
        {/* X Braces on Wood Crate */}
        <mesh position={[0, 0.5, 0.51]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshStandardMaterial color="#78350f" wireframe />
        </mesh>
      </group>
      <group position={[2.8, 0, 5.8]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
      </group>

      {/* Orange Traffic Cones with Reflective White Rings (Reference Image 1) */}
      {[-5, -1.5, 1.5, 5].map((x, idx) => (
        <group key={idx} position={[x, 0, 6.4]}>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.35, 0.08, 0.35]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <coneGeometry args={[0.16, 0.65, 12]} />
            <meshStandardMaterial color="#ea580c" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.11, 0.13, 0.14, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Steel I-Beams Stack */}
      <group position={[-16, 0, 6]}>
        {[0, 0.3, 0.6].map((y, idx) => (
          <mesh key={idx} position={[0, y + 0.15, 0]} castShadow>
            <boxGeometry args={[3.2, 0.25, 0.4]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Concrete Drainage Pipes Stack */}
      <group position={[16, 0, 6]}>
        <mesh position={[-0.6, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 2.8, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        <mesh position={[0.6, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 2.8, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 2.8, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};
