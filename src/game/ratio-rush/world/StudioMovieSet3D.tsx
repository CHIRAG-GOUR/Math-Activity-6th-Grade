// ============================================================
// RATIO RUSH — STUDIO MOVIE SET 3D (DYNAMIC SET PIECES & RATIO PROPS)
// Evolves through the 5 math production stages:
// - Stage 0: Chalk marks, blueprint stands, setup framing
// - Stage 1: Main elevated futuristic set platform & LED stairs
// - Stage 2: Miniature sci-fi skyscrapers & backdrop citadel
// - Stage 3: The Central Ratio Energy Generator Core prop
// - Stage 4: Energy conduits & rotating crystalline rings
// - Stage 5: Full climax laser effects & triumphant cinematic lighting
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoSphere12,
  getStudioMaterial,
  MAT_STEEL_DARK,
  MAT_STEEL_BRIGHT,
  MAT_DIRECTOR_WOOD,
  MAT_SCREEN_GLOW,
  MAT_STAGE_TAPE_YELLOW,
  MAT_STAGE_TAPE_BLUE,
  MAT_STAGE_TAPE_RED,
  MAT_ROAD_CASE_BLACK,
  MAT_WARM_BULB,
} from './StudioMaterials';

export const StudioMovieSet3D: React.FC<{
  productionLevel: number;
  isFilming: boolean;
}> = React.memo(({ productionLevel, isFilming }) => {
  const crystalRingRef = useRef<THREE.Group>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (crystalRingRef.current) {
      crystalRingRef.current.rotation.y += delta * (isFilming ? 2.5 : 0.8);
      crystalRingRef.current.rotation.z += delta * (isFilming ? 1.2 : 0.4);
    }
    if (coreGlowRef.current) {
      const pulse = Math.sin(Date.now() * 0.005) * 0.15 + 0.95;
      coreGlowRef.current.scale.set(pulse * 0.65, pulse * 0.65, pulse * 0.65);
    }
  });

  return (
    <group position={[0, 0, -3.8]}>
      {/* ── STAGE 0+: BLUEPRINT STAND & SET MARKERS ── */}
      <group position={[-5.5, 0, 1]}>
        {/* Wooden Blueprint Easel */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.04, 1.8, 0.04]}
          position={[-0.3, 0.9, -0.2]}
          rotation={[0.1, 0, -0.1]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.04, 1.8, 0.04]}
          position={[0.3, 0.9, -0.2]}
          rotation={[0.1, 0, 0.1]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.04, 1.7, 0.04]}
          position={[0, 0.85, 0.3]}
          rotation={[-0.25, 0, 0]}
        />
        {/* Blueprint Board with Ratio Schematics */}
        <mesh
          geometry={geoBox}
          material={MAT_STAGE_TAPE_BLUE}
          scale={[0.9, 0.65, 0.04]}
          position={[0, 1.1, -0.05]}
          rotation={[-0.1, 0, 0]}
        />
      </group>

      {/* ── STAGE 1+: ELEVATED MOVIE PLATFORM & SCI-FI DAIS ── */}
      {productionLevel >= 1 && (
        <group position={[0, 0, 0]}>
          {/* Hexagonal / Beveled Raised Stage Platform */}
          <mesh
            geometry={geoBox}
            material={MAT_STEEL_DARK}
            scale={[9.2, 0.3, 5.8]}
            position={[0, 0.15, 0]}
          />
          {/* Glowing Stage Edge Strips */}
          <mesh
            geometry={geoBox}
            material={MAT_SCREEN_GLOW}
            scale={[9.25, 0.05, 0.08]}
            position={[0, 0.28, 2.9]}
          />
          <mesh
            geometry={geoBox}
            material={MAT_SCREEN_GLOW}
            scale={[9.25, 0.05, 0.08]}
            position={[0, 0.28, -2.9]}
          />
          {/* Front Center Steps */}
          <mesh
            geometry={geoBox}
            material={MAT_STEEL_BRIGHT}
            scale={[2.4, 0.15, 0.8]}
            position={[0, 0.08, 3.3]}
          />
        </group>
      )}

      {/* ── STAGE 2+: BACKDROP MINIATURE CITADEL & ENERGY TOWERS ── */}
      {productionLevel >= 2 && (
        <group position={[0, 0, -2.2]}>
          {/* Left Miniature Skyscraper Tower */}
          <group position={[-3.6, 0, 0]}>
            <mesh
              geometry={geoBox}
              material={MAT_STEEL_DARK}
              scale={[1.1, 3.2, 1.1]}
              position={[0, 1.6, 0]}
            />
            {/* Illuminated Windows / Louvers */}
            <mesh
              geometry={geoBox}
              material={MAT_SCREEN_GLOW}
              scale={[1.12, 0.08, 0.9]}
              position={[0, 2.6, 0]}
            />
            <mesh
              geometry={geoBox}
              material={MAT_SCREEN_GLOW}
              scale={[1.12, 0.08, 0.9]}
              position={[0, 1.8, 0]}
            />
          </group>

          {/* Right Miniature Skyscraper Tower */}
          <group position={[3.6, 0, 0]}>
            <mesh
              geometry={geoBox}
              material={MAT_STEEL_DARK}
              scale={[1.1, 3.2, 1.1]}
              position={[0, 1.6, 0]}
            />
            <mesh
              geometry={geoBox}
              material={MAT_STAGE_TAPE_RED}
              scale={[1.12, 0.08, 0.9]}
              position={[0, 2.6, 0]}
            />
            <mesh
              geometry={geoBox}
              material={MAT_STAGE_TAPE_RED}
              scale={[1.12, 0.08, 0.9]}
              position={[0, 1.8, 0]}
            />
          </group>

          {/* Sci-Fi Citadel Arch & Connecting Energy Beam */}
          <mesh
            geometry={geoBox}
            material={MAT_STEEL_BRIGHT}
            scale={[8.4, 0.25, 0.5]}
            position={[0, 3.3, 0]}
          />
        </group>
      )}

      {/* ── STAGE 3+: THE CENTRAL RATIO ENERGY GENERATOR PROP ── */}
      {productionLevel >= 3 && (
        <group position={[0, 0.3, 0]}>
          {/* Heavy Octagonal Pedestal Base */}
          <mesh
            geometry={geoCylinder12}
            material={MAT_ROAD_CASE_BLACK}
            scale={[1.4, 0.5, 1.4]}
            position={[0, 0.25, 0]}
          />
          {/* Chrome Pillar & Containment Coils */}
          <mesh
            geometry={geoCylinder12}
            material={MAT_STEEL_BRIGHT}
            scale={[0.7, 1.2, 0.7]}
            position={[0, 1.0, 0]}
          />
          {/* Glowing Floating Crystalline Core */}
          <mesh
            ref={coreGlowRef}
            geometry={geoSphere12}
            material={isFilming ? MAT_STAGE_TAPE_YELLOW : MAT_SCREEN_GLOW}
            scale={[0.6, 0.6, 0.6]}
            position={[0, 1.9, 0]}
          />
        </group>
      )}

      {/* ── STAGE 4+: ROTATING ENERGY CONDUITS & RATIO ORBS ── */}
      {productionLevel >= 4 && (
        <group position={[0, 2.2, 0]} ref={crystalRingRef}>
          {/* Orbital Ring 1 */}
          <mesh
            geometry={geoCylinder12}
            material={MAT_STAGE_TAPE_YELLOW}
            scale={[1.6, 0.04, 1.6]}
            rotation={[0.3, 0, 0.4]}
          />
          {/* Orbital Ring 2 */}
          <mesh
            geometry={geoCylinder12}
            material={MAT_SCREEN_GLOW}
            scale={[1.9, 0.04, 1.9]}
            rotation={[-0.4, 0, 0.3]}
          />
          {/* Floating Ratio Energy Orbs on Ring */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <mesh
              key={`orb-${idx}`}
              geometry={geoSphere12}
              material={MAT_WARM_BULB}
              scale={[0.16, 0.16, 0.16]}
              position={[Math.cos(angle) * 1.6, Math.sin(angle) * 0.3, Math.sin(angle) * 1.6]}
            />
          ))}
        </group>
      )}

      {/* ── STAGE 5 / FILMING: CLIMAX LASER SHOW & TRIUMPH PARTICLES ── */}
      {productionLevel >= 5 && isFilming && (
        <group position={[0, 2.2, 0]}>
          {/* Pulsing Vertical Energy Pillar into Sky */}
          <mesh
            geometry={geoCylinder8}
            material={MAT_WARM_BULB}
            scale={[0.2, 10, 0.2]}
            position={[0, 5, 0]}
          />
          {/* Radial Spotlight Beams */}
          {[-1.5, 0, 1.5].map((bx, idx) => (
            <mesh
              key={`laser-${idx}`}
              geometry={geoCylinder8}
              material={MAT_SCREEN_GLOW}
              scale={[0.08, 8, 0.08]}
              position={[bx, 4, -1]}
              rotation={[0.1, 0, bx * 0.15]}
            />
          ))}
        </group>
      )}
    </group>
  );
});

StudioMovieSet3D.displayName = 'StudioMovieSet3D';
