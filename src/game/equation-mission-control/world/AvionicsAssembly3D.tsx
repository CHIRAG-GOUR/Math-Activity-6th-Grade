// ============================================================
// EQUATION MISSION CONTROL — Stage 1 3D Avionics Assembly Machine
// Physical Expression Terminal on the Pad:
// - Pedestal Terminal beside the Spacecraft
// - Holographic / Illuminated Snap Slots for Mathematical Tiles
// - Glowing Data Conduits routing into the Spacecraft Fuselage
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMissionControlStore } from '../store/missionControlStore';

export const AvionicsAssembly3D: React.FC = () => {
  const terminalGlowRef = useRef<THREE.PointLight>(null);
  const dataFlowRef = useRef<THREE.Mesh>(null);

  const stage = useMissionControlStore((s) => s.currentStageIndex);
  const avionicsPower = useMissionControlStore((s) => s.spacecraft.avionicsPower);

  useFrame(() => {
    if (terminalGlowRef.current) {
      const active = stage === 0 || avionicsPower;
      terminalGlowRef.current.intensity = active
        ? 1.5 + Math.sin(Date.now() * 0.006) * 0.5
        : 0.2;
    }
    if (dataFlowRef.current) {
      const mat = dataFlowRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = avionicsPower ? 2.2 + Math.sin(Date.now() * 0.008) * 0.8 : 0.4;
      }
    }
  });

  return (
    <group position={[-2.4, 0.5, 2.2]} rotation={[0, 0.45, 0]} scale={[0.85, 0.85, 0.85]}>
      {/* Terminal Base Pillar */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 1.0, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Slanted Work Deck */}
      <mesh position={[0, 1.05, 0]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.1, 0.65, 0.12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Illuminated Expression Snap Rack (3D Display Surface) */}
      <mesh position={[0, 1.07, 0.06]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.95, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0284c7"
          emissiveIntensity={avionicsPower ? 1.8 : 0.6}
          roughness={0.2}
        />
      </mesh>

      {/* 4 Snap Target Sockets */}
      {[-0.32, -0.11, 0.11, 0.32].map((x, i) => (
        <mesh key={`slot-${i}`} position={[x, 1.09, 0.07]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.18, 0.22, 0.02]} />
          <meshStandardMaterial
            color={avionicsPower ? '#38bdf8' : '#1e3a8a'}
            emissive={avionicsPower ? '#38bdf8' : '#0369a1'}
            emissiveIntensity={avionicsPower ? 2.0 : 0.4}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Status LED Bar */}
      <mesh position={[0, 1.34, -0.05]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.04]} />
        <meshStandardMaterial
          color={avionicsPower ? '#10b981' : '#f59e0b'}
          emissive={avionicsPower ? '#10b981' : '#f59e0b'}
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Glowing Fiber-Optic Data Conduit to Spacecraft Fuselage */}
      <mesh ref={dataFlowRef} position={[0.9, 0.6, -0.8]} rotation={[0, -0.4, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.0, 12]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      <pointLight
        ref={terminalGlowRef}
        position={[0, 1.3, 0.2]}
        color="#38bdf8"
        distance={4}
        intensity={0.8}
      />
    </group>
  );
};
