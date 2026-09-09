// ============================================================
// BLUEPRINT BLITZ — Physical 3D Tile Grid Component
// Renders modular concrete/wood/brick floor tiles (L x W)
// - Supports different physical materials (Brick, Concrete, Wood, Tile, Cube)
// - Edge coordinate rulers and live area formula display
// - Laser scanning wave effect during Site Inspection
// ============================================================

import React, { useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { TeamId } from '../types';

interface PhysicalTileGrid3DProps {
  length: number; // Columns (X axis)
  width: number;  // Rows (Z axis)
  teamId: TeamId;
  materialType?: string;
  isScanning?: boolean;
  scanProgress?: number;
}

export const PhysicalTileGrid3D: React.FC<PhysicalTileGrid3DProps> = ({
  length,
  width,
  teamId,
  materialType = 'tile',
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
        }
      : {
          base: '#dc2626',
          accent: '#f87171',
          edge: '#b91c1c',
          label: '#fca5a5',
        };
  }, [teamId]);

  // Material-specific surface appearance
  const matColors = useMemo(() => {
    switch (materialType) {
      case 'brick':
        return { body: '#c2410c', trim: '#9a3412', roughness: 0.85, metalness: 0.1 };
      case 'concrete':
        return { body: '#94a3b8', trim: '#64748b', roughness: 0.9, metalness: 0.2 };
      case 'wood':
        return { body: '#d97706', trim: '#b45309', roughness: 0.7, metalness: 0.1 };
      case 'cube':
        return { body: teamColors.base, trim: teamColors.edge, roughness: 0.35, metalness: 0.3 };
      default:
        return { body: '#e2e8f0', trim: teamColors.base, roughness: 0.4, metalness: 0.1 };
    }
  }, [materialType, teamColors]);

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

  const totalArea = length * width;

  return (
    <group ref={groupRef}>
      {/* Base Floor Foundation Tray */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[length + 0.6, 0.16, width + 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Hazard Warning Trim Frame */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[length + 0.4, 0.08, width + 0.4]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Individual Modular Tiles */}
      {tiles.map((tile) => {
        const isLaserActive =
          isScanning &&
          Math.abs(tile.z - (-(width - 1) * 0.5 + scanProgress * width)) < 0.6;

        return (
          <group key={tile.key} position={[tile.x, 0.06, tile.z]}>
            {/* Tile Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.92, 0.12, 0.92]} />
              <meshStandardMaterial
                color={isLaserActive ? '#fbbf24' : matColors.body}
                roughness={matColors.roughness}
                metalness={matColors.metalness}
                emissive={isLaserActive ? '#f59e0b' : '#000000'}
                emissiveIntensity={isLaserActive ? 0.8 : 0}
              />
            </mesh>

            {/* Inner Accent Ring / Inset */}
            <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.76, 0.76]} />
              <meshStandardMaterial
                color={matColors.trim}
                roughness={0.5}
                opacity={0.85}
                transparent
              />
            </mesh>

            {/* Subtle Corner Studs */}
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
      <group position={[0, 0.45, 0]}>
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
