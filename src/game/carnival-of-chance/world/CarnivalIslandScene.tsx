// ============================================================
// THE GREAT CARNIVAL OF CHANCE — 3D Carnival Island Hub
// Elevated cinematic 3/4 overview of the miniature carnival island,
// with 6 touchable 3D attraction booths, central clock tower, and ocean
// ============================================================

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../store/carnivalStore';
import { ATTRACTIONS_META } from '../engine/probabilityData';

// ── 1. Central Clock Tower & Plaza ──
const CentralClockTower: React.FC = () => {
  const clockHandsRef = useRef<THREE.Group>(null);
  const attractions = useCarnivalStore((s) => s.attractions);
  const completedCount = Object.values(attractions).filter((a) => a.id !== 'hub' && a.completed).length;

  useFrame((_, delta) => {
    if (clockHandsRef.current) {
      clockHandsRef.current.rotation.z -= delta * 0.8;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Octagonal Stone Plaza Base */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.3, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.8, 0.15, 8]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
      </mesh>

      {/* Red & White Striped Circus Base */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 2.2, 0.8, 16]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>

      {/* Brick Clock Tower Body */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 4.8, 1.8]} />
        <meshStandardMaterial color="#b45309" roughness={0.65} />
      </mesh>
      {/* Gold Trim Cornice */}
      <mesh position={[0, 5.7, 0]} castShadow>
        <boxGeometry args={[2.2, 0.35, 2.2]} />
        <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Clock Face & Hands */}
      <mesh position={[0, 4.4, 0.95]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <group ref={clockHandsRef} position={[0, 4.4, 1.02]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.05, 0.38, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Blue Spire & Flag */}
      <mesh position={[0, 7.0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.3, 2.4, 4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      <mesh position={[0, 8.4, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} />
      </mesh>
      <mesh position={[0.25, 8.6, 0]} castShadow>
        <boxGeometry args={[0.45, 0.28, 0.02]} />
        <meshStandardMaterial color="#e11d48" roughness={0.3} />
      </mesh>
    </group>
  );
};

// ── 2. Touchable 3D Island Booths (Representing Each Activity on Their Heads) ──

// A. Mystery Sack Booth
const MysterySackBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['mystery-bag'];

  return (
    <group position={meta.islandPosition} onClick={() => openActivity('mystery-bag')}>
      {/* Booth Base Table */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.8, 2.6]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.0, 0.1, 2.8]} />
        <meshStandardMaterial color="#fef08a" roughness={0.4} />
      </mesh>

      {/* Giant 3D Physical Sack on the Booth Table */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[1.0, 24, 24]} />
        <meshStandardMaterial color="#9a3412" roughness={0.85} />
      </mesh>
      {/* Sack Drawstring Neck */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.9, 0.7, 16]} />
        <meshStandardMaterial color="#c2410c" roughness={0.8} />
      </mesh>
      {/* Visible 3D Colored Spheres Around Sack Opening */}
      {[
        { color: '#dc2626', pos: [-0.25, 2.8, 0] },
        { color: '#2563eb', pos: [0.25, 2.85, 0.1] },
        { color: '#dc2626', pos: [0, 2.9, -0.2] },
      ].map((b, i) => (
        <mesh key={i} position={b.pos as [number, number, number]} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={b.color} roughness={0.3} metalness={0.2} />
        </mesh>
      ))}

      {/* Scalloped Red Striped Canopy */}
      <mesh position={[0, 3.8, 0]} rotation={[0.12, 0, 0]} castShadow>
        <boxGeometry args={[4.2, 0.15, 3.0]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
    </group>
  );
};

// B. Odds Wheel Booth
const OddsWheelBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['odds-wheel'];
  const wheelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <group position={meta.islandPosition} onClick={() => openActivity('odds-wheel')}>
      {/* Platform */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.2, 0.4, 24]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {/* Red A-Frame */}
      <mesh position={[-0.6, 1.8, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.18, 3.2, 0.18]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[0.6, 1.8, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.18, 3.2, 0.18]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>

      {/* Rotating Colorful Wheel */}
      <group ref={wheelRef} position={[0, 2.8, 0.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.14, 24]} />
          <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Colorful Segments */}
        {['#2563eb', '#dc2626', '#f59e0b', '#16a34a'].map((col, i) => (
          <mesh key={i} position={[0, 0.7, 0.08]} rotation={[0, 0, (i * Math.PI) / 2]} castShadow>
            <boxGeometry args={[0.5, 1.0, 0.04]} />
            <meshStandardMaterial color={col} />
          </mesh>
        ))}
        {/* Center Brass Hub */}
        <mesh position={[0, 0, 0.12]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#fef08a" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// C. Giant Ball Drop Booth
const BallDropBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['ball-drop'];

  return (
    <group position={meta.islandPosition} onClick={() => openActivity('ball-drop')}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.5, 24]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>

      {/* Transparent Acrylic Chamber */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 1.8, 24, 1, true]} />
        <meshPhysicalMaterial color="#e0f2fe" transmission={0.9} transparent opacity={1} roughness={0.1} />
      </mesh>
      {/* Golden Dome Top */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <sphereGeometry args={[0.92, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Internal Balls */}
      {[
        { color: '#16a34a', pos: [-0.3, 1.6, 0.2] },
        { color: '#16a34a', pos: [0.2, 1.8, -0.2] },
        { color: '#eab308', pos: [0, 2.2, 0.1] },
      ].map((b, i) => (
        <mesh key={i} position={b.pos as [number, number, number]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}
    </group>
  );
};

// D. Probability Lab Booth
const ProbabilityLabBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['probability-lab'];

  return (
    <group position={meta.islandPosition} onClick={() => openActivity('probability-lab')}>
      {/* Bench Platform */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.7, 2.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Glass Reaction Sphere */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshPhysicalMaterial color="#f1f5f9" transmission={0.9} transparent opacity={1} roughness={0.05} />
      </mesh>
      {/* Left Red & Right Blue Measuring Columns */}
      <mesh position={[-1.1, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.4, 12]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[1.1, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.4, 12]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
    </group>
  );
};

// E. Game Builder Booth
const GameBuilderBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['game-builder'];

  return (
    <group position={meta.islandPosition} onClick={() => openActivity('game-builder')}>
      {/* Workbench */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.7, 2.0]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>
      {/* Upright Slanted Pegboard */}
      <mesh position={[0, 1.8, -0.2]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[3.0, 2.2, 0.15]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      {/* Awning */}
      <mesh position={[0, 3.2, 0.1]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[3.8, 0.15, 1.8]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
    </group>
  );
};

// F. Grand Carnival Entrance & Pavilion
const GrandCarnivalBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['grand-carnival'];

  return (
    <group position={meta.islandPosition} onClick={() => openActivity('grand-carnival')}>
      {/* Stage Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.6, 2.8, 0.6, 24]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>
      {/* Red & Gold Carousel Pavilion Roof */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <coneGeometry args={[2.6, 1.4, 16]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      {/* Floating Trophy */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.15, 0.5, 12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.95} />
      </mesh>
    </group>
  );
};

// ── 3. Island Terrain, Paths, Boardwalk Pier, and Ocean ──
const IslandEnvironment: React.FC = () => {
  return (
    <group>
      {/* Main Lush Green Island Plateau */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[17, 18.5, 1.6, 48]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>
      {/* Sandy Beach Embankment Ring */}
      <mesh position={[0, -1.0, 0]} receiveShadow>
        <cylinderGeometry args={[18.5, 20.5, 0.8, 48]} />
        <meshStandardMaterial color="#fef08a" roughness={0.9} />
      </mesh>

      {/* Surrounding Calm Ocean Water */}
      <mesh position={[0, -1.3, 0]} receiveShadow>
        <cylinderGeometry args={[42, 42, 0.4, 48]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          roughness={0.15}
          metalness={0.1}
          transmission={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Boardwalk Pier Extending South */}
      <mesh position={[0, 0.05, 14.5]} receiveShadow castShadow>
        <boxGeometry args={[2.6, 0.2, 7.5]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>

      {/* Miniature Sailboat in Bay */}
      <group position={[13, -0.6, 13]} rotation={[0, -0.6, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 2.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.8, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 1.8, 0.5]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <coneGeometry args={[0.8, 2.2, 3]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      </group>

      {/* Cobblestone Pathways Connecting Central Plaza to Attractions */}
      <mesh position={[-4.5, 0.05, 0.5]} receiveShadow>
        <boxGeometry args={[6.5, 0.06, 1.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[4.5, 0.05, 0.5]} receiveShadow>
        <boxGeometry args={[6.5, 0.06, 1.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[-3.0, 0.05, -3.0]} rotation={[0, 0.7, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.06, 7.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[3.0, 0.05, -3.0]} rotation={[0, -0.7, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.06, 7.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[-3.0, 0.05, 3.2]} rotation={[0, -0.7, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.06, 7.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.05, 4.5]} receiveShadow>
        <boxGeometry args={[2.2, 0.06, 6.5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Low-Poly Pine Trees Around Island Edges */}
      {[
        [-13, 0, -7],
        [-14, 0, 2],
        [-12, 0, 11],
        [13, 0, -7],
        [14, 0, 2],
        [12, 0, 11],
        [-4, 0, -13],
        [4, 0, -13],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.28, 1.6, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[1.2, 2.0, 7]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.2, 0]} castShadow>
            <coneGeometry args={[0.9, 1.6, 7]} />
            <meshStandardMaterial color="#16a34a" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ── 4. Main Hub Island Canvas ──
export const CarnivalIslandScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 22, 28], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <color attach="background" args={['#bae6fd']} />

        {/* Sunlight Lighting */}
        <ambientLight intensity={0.75} color="#f0f9ff" />
        <directionalLight
          position={[14, 28, 16]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color="#fffbeb"
        />
        <directionalLight position={[-12, 10, -10]} intensity={0.4} color="#38bdf8" />

        {/* Island Environment */}
        <IslandEnvironment />
        <CentralClockTower />

        {/* 6 Touchable 3D Booths */}
        <MysterySackBooth />
        <OddsWheelBooth />
        <BallDropBooth />
        <ProbabilityLabBooth />
        <GameBuilderBooth />
        <GrandCarnivalBooth />
      </Canvas>
    </div>
  );
};
