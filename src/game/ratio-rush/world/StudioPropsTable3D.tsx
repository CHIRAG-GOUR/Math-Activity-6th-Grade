// ============================================================
// RATIO RUSH — 3D PHYSICAL MATH PROPS TABLE
// Spawns interactive 3D ratio props on the studio set table:
// - Tray A (Blue) holding ratioA items
// - Tray B (Red) holding ratioB items
// - Proportional scaling & golden celebration glow upon correct answer
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RatioQuestion } from '../types';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoCylinder16,
  geoSphere12,
  geoSphere16,
  MAT_STEEL_DARK,
  MAT_STEEL_BRIGHT,
  MAT_DIRECTOR_WOOD,
  MAT_STAGE_TAPE_YELLOW,
  MAT_STAGE_TAPE_BLUE,
  MAT_STAGE_TAPE_RED,
  MAT_GOLD_BRASS,
  MAT_SCREEN_GLOW,
} from './StudioMaterials';

interface StudioPropsTable3DProps {
  position: [number, number, number];
  activeQuestion?: RatioQuestion | null;
  feedbackStatus?: 'idle' | 'correct' | 'incorrect';
}

export const StudioPropsTable3D: React.FC<StudioPropsTable3DProps> = React.memo(
  ({ position, activeQuestion = null, feedbackStatus = 'idle' }) => {
    const tableGroupRef = useRef<THREE.Group>(null);
    const trayARef = useRef<THREE.Group>(null);
    const trayBRef = useRef<THREE.Group>(null);
    const glowRingRef = useRef<THREE.Mesh>(null);

    const isCorrect = feedbackStatus === 'correct';

    // Theme-based prop materials
    const coinMat = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: '#fbbf24',
          metalness: 0.85,
          roughness: 0.2,
        }),
      []
    );

    const crystalMat = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: '#38bdf8',
          metalness: 0.2,
          roughness: 0.1,
          emissive: '#0284c7',
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.88,
        }),
      []
    );

    const redCrystalMat = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: '#f87171',
          metalness: 0.2,
          roughness: 0.1,
          emissive: '#dc2626',
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.88,
        }),
      []
    );

    const glowMat = useMemo(
      () =>
        new THREE.MeshBasicMaterial({
          color: '#fde047',
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        }),
      []
    );

    const ratioA = activeQuestion?.ratioA ?? 3;
    const ratioB = activeQuestion?.ratioB ?? 2;
    const countA = isCorrect ? Math.min(12, ratioA * (activeQuestion?.diagram?.multiplier || 2)) : Math.min(8, ratioA);
    const countB = isCorrect ? Math.min(12, ratioB * (activeQuestion?.diagram?.multiplier || 2)) : Math.min(8, ratioB);

    useFrame((state, delta) => {
      const t = state.clock.getElapsedTime();
      if (glowRingRef.current) {
        glowRingRef.current.rotation.z += delta * 1.5;
        const pulse = Math.sin(t * 4.0) * 0.15 + 1.0;
        glowRingRef.current.scale.set(pulse, pulse, pulse);
        glowRingRef.current.visible = isCorrect;
      }

      if (trayARef.current && isCorrect) {
        trayARef.current.position.y = 0.85 + Math.sin(t * 3.0) * 0.03;
      } else if (trayARef.current) {
        trayARef.current.position.y = 0.85;
      }

      if (trayBRef.current && isCorrect) {
        trayBRef.current.position.y = 0.85 + Math.cos(t * 3.0) * 0.03;
      } else if (trayBRef.current) {
        trayBRef.current.position.y = 0.85;
      }
    });

    return (
      <group ref={tableGroupRef} position={position}>
        {/* ── 1. HEAVY-DUTY FILM STUDIO PROP TABLE ── */}
        {/* Table Top Surface */}
        <mesh
          geometry={geoBox}
          material={MAT_DIRECTOR_WOOD}
          scale={[2.2, 0.08, 1.1]}
          position={[0, 0.8, 0]}
          castShadow
          receiveShadow
        />
        {/* Metal Edge Trim */}
        <mesh
          geometry={geoBox}
          material={MAT_STEEL_DARK}
          scale={[2.24, 0.03, 1.14]}
          position={[0, 0.77, 0]}
        />
        {/* Four Sturdy Steel Table Legs */}
        <mesh geometry={geoCylinder12} material={MAT_STEEL_DARK} scale={[0.04, 0.8, 0.04]} position={[-0.95, 0.4, -0.45]} castShadow />
        <mesh geometry={geoCylinder12} material={MAT_STEEL_DARK} scale={[0.04, 0.8, 0.04]} position={[0.95, 0.4, -0.45]} castShadow />
        <mesh geometry={geoCylinder12} material={MAT_STEEL_DARK} scale={[0.04, 0.8, 0.04]} position={[-0.95, 0.4, 0.45]} castShadow />
        <mesh geometry={geoCylinder12} material={MAT_STEEL_DARK} scale={[0.04, 0.8, 0.04]} position={[0.95, 0.4, 0.45]} castShadow />

        {/* ── 2. TRAY A (BLUE STUDIO TRAY FOR RATIO A) ── */}
        <group ref={trayARef} position={[-0.55, 0.85, 0]}>
          <mesh
            geometry={geoBox}
            material={MAT_STAGE_TAPE_BLUE}
            scale={[0.85, 0.04, 0.8]}
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          />
          {/* Blue Neon Trim */}
          <mesh
            geometry={geoBox}
            material={MAT_SCREEN_GLOW}
            scale={[0.89, 0.015, 0.84]}
            position={[0, 0.02, 0]}
          />
          {/* Props A Grid */}
          {Array.from({ length: countA }).map((_, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const px = (col - 1.5) * 0.18;
            const pz = (row - 0.5) * 0.22;
            return (
              <group key={`propA-${i}`} position={[px, 0.06, pz]}>
                {/* Gold Stunt Coin or Sci-Fi Crystal */}
                <mesh
                  geometry={geoCylinder16}
                  material={coinMat}
                  scale={[0.07, 0.04, 0.07]}
                  rotation={[0, (i * Math.PI) / 6, 0]}
                  castShadow
                />
                <mesh
                  geometry={geoSphere12}
                  material={crystalMat}
                  scale={[0.045, 0.07, 0.045]}
                  position={[0, 0.05, 0]}
                  castShadow
                />
              </group>
            );
          })}
        </group>

        {/* ── 3. TRAY B (RED STUDIO TRAY FOR RATIO B) ── */}
        <group ref={trayBRef} position={[0.55, 0.85, 0]}>
          <mesh
            geometry={geoBox}
            material={MAT_STAGE_TAPE_RED}
            scale={[0.85, 0.04, 0.8]}
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          />
          {/* Red Neon Trim */}
          <mesh
            geometry={geoBox}
            material={MAT_STAGE_TAPE_RED}
            scale={[0.89, 0.015, 0.84]}
            position={[0, 0.02, 0]}
          />
          {/* Props B Grid */}
          {Array.from({ length: countB }).map((_, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const px = (col - 1.5) * 0.18;
            const pz = (row - 0.5) * 0.22;
            return (
              <group key={`propB-${i}`} position={[px, 0.06, pz]}>
                {/* Red Crystal / Film Reel */}
                <mesh
                  geometry={geoCylinder16}
                  material={MAT_STEEL_BRIGHT}
                  scale={[0.065, 0.035, 0.065]}
                  castShadow
                />
                <mesh
                  geometry={geoSphere12}
                  material={redCrystalMat}
                  scale={[0.045, 0.07, 0.045]}
                  position={[0, 0.05, 0]}
                  castShadow
                />
              </group>
            );
          })}
        </group>

        {/* ── 4. GOLDEN GLOW EFFECT ON CORRECT PROPORTION MATCH ── */}
        <mesh ref={glowRingRef} position={[0, 1.25, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.7, 1.1, 32]} />
          <primitive object={glowMat} attach="material" />
        </mesh>
      </group>
    );
  }
);

StudioPropsTable3D.displayName = 'StudioPropsTable3D';
