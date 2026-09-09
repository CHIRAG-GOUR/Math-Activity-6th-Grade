// ============================================================
// BLUEPRINT BLITZ — Construction District 3D Environment
// A bright, stylized architecture & construction world featuring:
// - Blue Team Site on the LEFT (x: -9)
// - Central Architectural Inspection Tower (x: 0)
// - Red Team Site on the RIGHT (x: +9)
// - Background: Stylized skyscrapers, cranes, blueprint grid horizon
// - Foreground: Safety fences, roads, scaffolding & construction trucks
// ============================================================

import React, { useMemo } from 'react';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useBlueprintStore } from '../store/blueprintStore';
import { ConstructionPlot3D } from './ConstructionPlot3D';

export const ConstructionDistrict3D: React.FC = () => {
  const { blueTeam, redTeam, activeChallenge, phase } = useBlueprintStore();

  const isScanning = phase === 'scanning';
  const mechanic = activeChallenge?.mechanic || 'cubes';

  // Background stylized miniature buildings
  const buildings = useMemo(() => {
    const list: Array<{ x: number; z: number; width: number; height: number; depth: number; color: string }> = [];
    const colors = ['#3b82f6', '#0284c7', '#f59e0b', '#10b981', '#6366f1', '#475569', '#64748b'];

    for (let i = -10; i <= 10; i++) {
      if (Math.abs(i) < 2) continue; // Keep center clear
      const h = 8 + (Math.sin(i * 1.5) * 4) + (Math.cos(i * 3) * 3);
      list.push({
        x: i * 3.5,
        z: -24 - Math.abs(i) * 1.2,
        width: 2.8,
        height: h,
        depth: 2.8,
        color: colors[(Math.abs(i) + 2) % colors.length],
      });
    }
    return list;
  }, []);

  return (
    <group>
      {/* ── ENVIRONMENT LIGHTING ── */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[15, 25, 20]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-15, 15, -10]} intensity={0.5} color="#bae6fd" />
      <hemisphereLight groundColor="#334155" color="#f8fafc" intensity={0.6} />

      {/* ── GROUND TERRAIN / DISTRICT ASPHALT ── */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* District Road Markings */}
      <group position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Yellow Central Dividing Stripe */}
        {[-30, -20, -10, 0, 10, 20, 30].map((x, idx) => (
          <mesh key={idx} position={[x, 9, 0]}>
            <planeGeometry args={[4, 0.4]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
        ))}
      </group>

      {/* ── LEFT SITE: BLUE TEAM CONSTRUCTION PLOT (x = -9) ── */}
      <ConstructionPlot3D
        teamId="blue"
        teamName={blueTeam.name}
        score={blueTeam.score}
        build={blueTeam.build}
        mechanic={mechanic}
        isScanning={isScanning}
        position={[-9, 0, 0]}
      />

      {/* ── RIGHT SITE: RED TEAM CONSTRUCTION PLOT (x = +9) ── */}
      <ConstructionPlot3D
        teamId="red"
        teamName={redTeam.name}
        score={redTeam.score}
        build={redTeam.build}
        mechanic={mechanic}
        isScanning={isScanning}
        position={[9, 0, 0]}
      />

      {/* ── CENTRAL ARCHITECTURAL INSPECTION TOWER & BLUEPRINT EASEL (x = 0) ── */}
      <group position={[0, 0, -5]}>
        {/* Central Pedestal */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.6, 2.0, 2.4, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Golden Central Compass Emblem */}
        <mesh position={[0, 2.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 1.2, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Central Hologram Banner */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[0, 4.2, 0]}>
            <mesh>
              <boxGeometry args={[3.6, 1.2, 0.15]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.09]}>
              <planeGeometry args={[3.4, 1.0]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
            <Text
              position={[0, 0.2, 0.11]}
              fontSize={0.36}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#0f172a"
            >
              📐 BLUEPRINT BLITZ
            </Text>
            <Text
              position={[0, -0.22, 0.11]}
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

      {/* ── BACKGROUND STYLIZED SKYLINE & CONSTRUCTION CRANES ── */}
      <group position={[0, 0, 0]}>
        {buildings.map((b, i) => (
          <group key={i} position={[b.x, b.height * 0.5, b.z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[b.width, b.height, b.depth]} />
              <meshStandardMaterial color={b.color} roughness={0.7} metalness={0.2} />
            </mesh>
            {/* Window rows */}
            {Array.from({ length: Math.floor(b.height / 2) }).map((_, wIdx) => (
              <mesh key={wIdx} position={[0, -(b.height * 0.5) + (wIdx + 1) * 2, b.depth * 0.5 + 0.05]}>
                <planeGeometry args={[b.width * 0.8, 0.8]} />
                <meshBasicMaterial color="#fef08a" opacity={0.7} transparent />
              </mesh>
            ))}
          </group>
        ))}

        {/* Distant Giant Construction Cranes */}
        <group position={[-18, 0, -28]} rotation={[0, 0.4, 0]}>
          <mesh position={[0, 8, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 16, 6]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[4, 16, 0]}>
            <boxGeometry args={[12, 0.3, 0.3]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
        <group position={[18, 0, -28]} rotation={[0, -0.4, 0]}>
          <mesh position={[0, 9, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 18, 6]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[-4, 18, 0]}>
            <boxGeometry args={[12, 0.3, 0.3]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      </group>

      {/* ── FOREGROUND FENCES & PROPS ── */}
      <group position={[0, 0, 8]}>
        {[-14, -10, -6, 6, 10, 14].map((x, idx) => (
          <group key={idx} position={[x, 0.6, 0]}>
            <mesh>
              <boxGeometry args={[3.2, 1.2, 0.1]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[3.0, 0.4]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <Text
              position={[0, 0, 0.07]}
              fontSize={0.22}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
            >
              ⚠ CAUTION: ACTIVE ZONE
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
};
