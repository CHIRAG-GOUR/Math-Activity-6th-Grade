// ============================================================
// BLUEPRINT BLITZ — Physical 3D Tile Grid Component
// Renders an authentic physical modular grid of floor tiles (L x W)
// - Each unit tile is 1x1 with beveled borders and physical relief
// - Clear coordinate grid & dimension labels along edges
// - Dynamic placement animation and scanner laser responsiveness
// ============================================================

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { TeamId } from '../types';

interface PhysicalTileGrid3DProps {
  length: number; // Columns (X axis)
  width: number;  // Rows (Z axis)
  teamId: TeamId;
  isScanning?: boolean;
  scanProgress?: number;
}

export const PhysicalTileGrid3D: React.FC<PhysicalTileGrid3DProps> = ({
  length,
  width,
  teamId,
  isScanning = false,
  scanProgress = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const teamColors = useMemo(() => {
    return teamId === 'blue'
      ? {
          base: '#2563eb',
          accent: '#60a5fa',
          edge: '#1d4ed8',
          label: '#93c5fd',
          glow: '#38bdf8',
        }
      : {
          base: '#dc2626',
          accent: '#f87171',
          edge: '#b91c1c',
          label: '#fca5a5',
          glow: '#fb7185',
        };
  }, [teamId]);

  // Generate grid tiles
  const tiles = useMemo(() => {
    const list: Array<{ x: number; z: number; key: string; index: number }> = [];
    let idx = 0;
    const offsetX = -(length - 1) * 0.5;
    const offsetZ = -(width - 1) * 0.5;

    for (let l = 0; l < length; l++) {
      for (let w = 0; w < width; w++) {
        list.push({
          x: offsetX + l,
          z: offsetZ + w,
          key: `tile-${l}-${w}`,
          index: idx++,
        });
      }
    }
    return list;
  }, [length, width]);

  // Dimensions & Area
  const totalArea = length * width;

  return (
    <group ref={groupRef}>
      {/* Base Floor Foundation Tray */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[length + 0.6, 0.16, width + 0.6]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Hazard Warning Trim Frame */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[length + 0.4, 0.08, width + 0.4]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* Individual Modular Tiles */}
      {tiles.map((tile) => {
        // Calculate scanning laser wave distance
        const isLaserActive =
          isScanning &&
          Math.abs(tile.z - (-(width - 1) * 0.5 + scanProgress * width)) < 0.6;

        return (
          <group key={tile.key} position={[tile.x, 0.06, tile.z]}>
            {/* Tile Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.92, 0.12, 0.92]} />
              <meshStandardMaterial
                color={isLaserActive ? '#fbbf24' : '#e2e8f0'}
                roughness={0.4}
                metalness={0.1}
                emissive={isLaserActive ? '#f59e0b' : '#000000'}
                emissiveIntensity={isLaserActive ? 0.8 : 0}
              />
            </mesh>

            {/* Inner Accent Ring / Inset */}
            <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.76, 0.76]} />
              <meshStandardMaterial
                color={teamColors.base}
                roughness={0.5}
                opacity={0.85}
                transparent
              />
            </mesh>

            {/* Subtle Tile Index Dots/Corners */}
            <mesh position={[0.3, 0.07, 0.3]}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.3, 0.07, -0.3]}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}

      {/* Length Dimension Indicator (Front Edge) */}
      <group position={[0, 0.2, (width * 0.5) + 0.55]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[length, 0.06, 0.12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text
          position={[0, 0.25, 0]}
          fontSize={0.42}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#0f172a"
        >
          {`LENGTH: ${length} m`}
        </Text>
      </group>

      {/* Width Dimension Indicator (Left Edge) */}
      <group position={[-(length * 0.5) - 0.55, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[width, 0.06, 0.12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text
          position={[0, 0.25, 0]}
          fontSize={0.42}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#0f172a"
        >
          {`WIDTH: ${width} m`}
        </Text>
      </group>

      {/* Center Live Area Hologram Badge */}
      <group position={[0, 0.4, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.55}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor={teamColors.edge}
        >
          {`${length} × ${width} = ${totalArea} m²`}
        </Text>
      </group>
    </group>
  );
};
