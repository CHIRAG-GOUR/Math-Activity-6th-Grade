// ============================================================
// THE GREAT CARNIVAL OF CHANCE — 3D Carnival Island Scene
// Stylized Miniature Theme Park Island with Smooth Camera Rig,
// Central Clock Tower, Paths, Water, and 6 Physical Attractions
// ============================================================

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../store/carnivalStore';
import { ATTRACTIONS } from '../engine/probabilityData';
import { GiantBallDrop3D } from './attractions/GiantBallDrop3D';
import { OddsWheel3D } from './attractions/OddsWheel3D';
import { MysteryChests3D } from './attractions/MysteryChests3D';
import { ChanceLab3D } from './attractions/ChanceLab3D';
import { CarnivalWorkshop3D } from './attractions/CarnivalWorkshop3D';
import { GrandCarnival3D } from './attractions/GrandCarnival3D';

// ── 1. Smooth Cinematic Camera Rig ──
const CameraRig: React.FC = () => {
  const { camera } = useThree();
  const cameraMode = useCarnivalStore((s) => s.cameraMode);
  const activeAttractionId = useCarnivalStore((s) => s.activeAttractionId);
  const zoomLevel = useCarnivalStore((s) => s.zoomLevel);

  const targetPos = useRef(new THREE.Vector3(0, 16, 24));
  const targetLook = useRef(new THREE.Vector3(0, 1.5, 0));
  const currentLook = useRef(new THREE.Vector3(0, 1.5, 0));

  useFrame((_, delta) => {
    const activeInfo = ATTRACTIONS.find((a) => a.id === activeAttractionId);

    if (cameraMode === 'attraction-focus' && activeInfo) {
      targetPos.current.set(...activeInfo.cameraPosition).multiplyScalar(1 / zoomLevel);
      targetLook.current.set(...activeInfo.cameraTarget);
    } else if (cameraMode === 'machine-run' && activeInfo) {
      targetPos.current.set(
        activeInfo.cameraPosition[0] * 0.9,
        activeInfo.cameraPosition[1] * 0.85,
        activeInfo.cameraPosition[2] * 0.85
      ).multiplyScalar(1 / zoomLevel);
      targetLook.current.set(...activeInfo.cameraTarget);
    } else if (cameraMode === 'grand-celebration') {
      targetPos.current.set(0, 18, 28).multiplyScalar(1 / zoomLevel);
      targetLook.current.set(0, 3, 2);
    } else {
      // Default: Elevated 3/4 Island Overview
      targetPos.current.set(0, 16, 24).multiplyScalar(1 / zoomLevel);
      targetLook.current.set(0, 1.5, 0);
    }

    // Smooth spherical interpolation for cinematic camera moves
    camera.position.lerp(targetPos.current, delta * 3.5);
    currentLook.current.lerp(targetLook.current, delta * 4.0);
    camera.lookAt(currentLook.current);
  });

  return null;
};

// ── 2. Central Plaza Clock Tower & Progress Dial ──
const CentralClockTower: React.FC = () => {
  const selectAttraction = useCarnivalStore((s) => s.selectAttraction);
  const attractions = useCarnivalStore((s) => s.attractions);
  const clockHandsRef = useRef<THREE.Group>(null);

  const completedCount = attractions.filter((a) => a.id !== 'central-plaza' && a.completed).length;

  useFrame((_, delta) => {
    if (clockHandsRef.current) {
      clockHandsRef.current.rotation.z -= delta * 0.8;
    }
  });

  return (
    <group position={[0, 0, 0]} onClick={() => selectAttraction('central-plaza')}>
      {/* Stone Plaza Base Octagon */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.3, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.8, 0.15, 8]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
      </mesh>

      {/* Main Brick Clock Tower Body */}
      <mesh position={[0, 3.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 5.2, 2.0]} />
        <meshStandardMaterial color="#b45309" roughness={0.65} />
      </mesh>
      {/* Upper Cornice Trim */}
      <mesh position={[0, 5.8, 0]} castShadow>
        <boxGeometry args={[2.4, 0.4, 2.4]} />
        <meshStandardMaterial color="#fef08a" roughness={0.4} />
      </mesh>

      {/* Clock Face Housing & Hands */}
      <mesh position={[0, 4.4, 1.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.1, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <group ref={clockHandsRef} position={[0, 4.4, 1.12]}>
        {/* Hour Hand */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.06, 0.4, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Minute Hand */}
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <boxGeometry args={[0.04, 0.55, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Pyramid Spire & Weather Vane Flag */}
      <mesh position={[0, 7.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.4, 2.4, 4]} />
        <meshStandardMaterial color="#0369a1" roughness={0.4} />
      </mesh>
      <mesh position={[0, 8.6, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} />
      </mesh>
      <mesh position={[0.25, 8.8, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.02]} />
        <meshStandardMaterial color="#e11d48" roughness={0.3} />
      </mesh>
    </group>
  );
};

// ── 3. Island Terrain & Ocean Water ──
const IslandTerrain: React.FC = () => {
  return (
    <group>
      {/* Main Lush Island Plateau */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[16, 17.5, 1.4, 48]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>
      {/* Sandy Embankment Ring */}
      <mesh position={[0, -0.9, 0]} receiveShadow>
        <cylinderGeometry args={[17.5, 19.5, 0.8, 48]} />
        <meshStandardMaterial color="#fef08a" roughness={0.9} />
      </mesh>

      {/* Surrounding Calm Ocean Water */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <cylinderGeometry args={[36, 36, 0.4, 48]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          roughness={0.15}
          metalness={0.1}
          transmission={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Cobblestone Pathways Connecting Central Plaza to Attractions */}
      {/* Path to Odds Wheel (Left-North) */}
      <mesh position={[-3.8, 0.05, -2.2]} rotation={[0, 0.55, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.06, 7.5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Path to Mystery Chests (Right-North) */}
      <mesh position={[3.8, 0.05, -2.2]} rotation={[0, -0.55, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.06, 7.5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Path to Giant Ball Drop (Left-South) */}
      <mesh position={[-3.8, 0.05, 3.2]} rotation={[0, -0.7, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.06, 8.5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Path to Chance Lab (Right-South) */}
      <mesh position={[3.8, 0.05, 3.2]} rotation={[0, 0.7, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.06, 8.5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Path to Workshop (North) */}
      <mesh position={[0, 0.05, -5.0]} receiveShadow>
        <boxGeometry args={[1.8, 0.06, 6.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Path to Grand Carnival (South) */}
      <mesh position={[0, 0.05, 5.5]} receiveShadow>
        <boxGeometry args={[2.2, 0.06, 7.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Stylized Low-Poly Trees Around Island Edges */}
      {[
        [-11, 0, -8],
        [-13, 0, 0],
        [-11, 0, 11],
        [11, 0, -8],
        [13, 0, 0],
        [11, 0, 11],
        [-4, 0, -12],
        [4, 0, -12],
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

// ── 4. Main Carnival Island Canvas ──
export const CarnivalIslandScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 16, 24], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <color attach="background" args={['#bae6fd']} />

        {/* Cinematic Sunlight Lighting */}
        <ambientLight intensity={0.7} color="#f0f9ff" />
        <directionalLight
          position={[14, 26, 16]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={60}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          color="#fffbeb"
        />
        <directionalLight position={[-12, 10, -10]} intensity={0.4} color="#38bdf8" />

        {/* Camera Rig */}
        <CameraRig />

        {/* Island World Base */}
        <IslandTerrain />
        <CentralClockTower />

        {/* Physical Attractions */}
        <GiantBallDrop3D position={[-7.5, 0, 6.5]} />
        <OddsWheel3D position={[-7.5, 0, -4.5]} />
        <MysteryChests3D position={[7.5, 0, -4.5]} />
        <ChanceLab3D position={[7.5, 0, 6.5]} />
        <CarnivalWorkshop3D position={[0, 0, -9.5]} />
        <GrandCarnival3D position={[0, 0, 11]} />
      </Canvas>
    </div>
  );
};
