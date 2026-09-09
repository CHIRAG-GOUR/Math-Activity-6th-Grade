// ============================================================
// BLUEPRINT BLITZ — Physical 3D Cube Stacking & Volume Component
// Renders physical unit cubes (1x1x1) stacked in L x W x H layers
// - Supports Brick, Concrete Block, Wood Beam, Ceramic Tile & Unit Cube materials
// - Dimensional markers for Length, Width, Height
// - Realtime volume calculation and laser scanning glow
// - 100% Sunny Daytime palette — Zero Dark Navy / Black surfaces
// ============================================================

import React, { useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { TeamId } from '../types';

interface PhysicalCubeStack3DProps {
  length: number;  // X axis (columns)
  width: number;   // Z axis (rows)
  height: number;  // Y axis (layers)
  teamId: TeamId;
  materialType?: string;
  totalBlocks?: number;
  isScanning?: boolean;
  scanProgress?: number;
}

export const PhysicalCubeStack3D: React.FC<PhysicalCubeStack3DProps> = ({
  length,
  width,
  height,
  teamId,
  materialType = 'cube',
  totalBlocks,
  isScanning = false,
  scanProgress = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const teamColors = useMemo(() => {
    return teamId === 'blue'
      ? {
          cubeBody: '#3b82f6',
          cubeTrim: '#1d4ed8',
          accent: '#60a5fa',
        }
      : {
          cubeBody: '#ef4444',
          cubeTrim: '#b91c1c',
          accent: '#f87171',
        };
  }, [teamId]);

  // Material-specific surface appearance
  const matColors = useMemo(() => {
    switch (materialType) {
      case 'brick':
        return { body: '#c2410c', trim: '#7c2d12', roughness: 0.85, metalness: 0.1 };
      case 'concrete':
        return { body: '#94a3b8', trim: '#475569', roughness: 0.9, metalness: 0.2 };
      case 'wood':
        return { body: '#d97706', trim: '#92400e', roughness: 0.75, metalness: 0.1 };
      case 'tile':
        return { body: '#f1f5f9', trim: '#cbd5e1', roughness: 0.4, metalness: 0.1 };
      default:
        return { body: teamColors.cubeBody, trim: teamColors.cubeTrim, roughness: 0.35, metalness: 0.3 };
    }
  }, [materialType, teamColors]);

  // Generate 3D unit cubes
  const cubes = useMemo(() => {
    const list: Array<{ x: number; y: number; z: number; key: string; layer: number }> = [];
    const offsetX = -(length - 1) * 0.5;
    const offsetZ = -(width - 1) * 0.5;
    let count = 0;
    const maxCount = totalBlocks || length * width * height;

    for (let h = 0; h < height; h++) {
      for (let l = 0; l < length; l++) {
        for (let w = 0; w < width; w++) {
          if (count < maxCount) {
            list.push({
              x: offsetX + l,
              y: 0.5 + h, // 1 unit high per layer
              z: offsetZ + w,
              key: `cube-${l}-${h}-${w}`,
              layer: h + 1,
            });
            count++;
          }
        }
      }
    }
    return list;
  }, [length, width, height, totalBlocks]);

  const totalVolume = totalBlocks || length * width * height;

  return (
    <group ref={groupRef}>
      {/* Light Steel Base Grid Platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[length + 0.8, 0.2, width + 0.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Concrete Support Blocks under Platform */}
      <mesh position={[-(length * 0.5) - 0.2, -0.3, -(width * 0.5) - 0.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[(length * 0.5) + 0.2, -0.3, -(width * 0.5) - 0.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-(length * 0.5) - 0.2, -0.3, (width * 0.5) + 0.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[(length * 0.5) + 0.2, -0.3, (width * 0.5) + 0.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Render Individual Physical 3D Cubes */}
      {cubes.map((cube) => {
        const isLaserActive =
          isScanning &&
          Math.abs(cube.y - (scanProgress * height)) < 0.7;

        return (
          <group key={cube.key} position={[cube.x, cube.y, cube.z]}>
            {/* Main Cube Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.94, 0.94, 0.94]} />
              <meshStandardMaterial
                color={isLaserActive ? '#fbbf24' : matColors.body}
                roughness={matColors.roughness}
                metalness={matColors.metalness}
                emissive={isLaserActive ? '#f59e0b' : '#000000'}
                emissiveIntensity={isLaserActive ? 0.9 : 0}
              />
            </mesh>

            {/* Reinforcement Trim / Beveled Outer Frame */}
            <mesh>
              <boxGeometry args={[0.96, 0.96, 0.96]} />
              <meshStandardMaterial
                color={matColors.trim}
                wireframe
                wireframeLinewidth={2}
              />
            </mesh>

            {/* Corner Bolts */}
            <mesh position={[0.38, 0.38, 0.48]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} />
            </mesh>
            <mesh position={[-0.38, 0.38, 0.48]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} />
            </mesh>
            <mesh position={[0.38, -0.38, 0.48]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} />
            </mesh>
            <mesh position={[-0.38, -0.38, 0.48]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Height Dimension Ruler (Right Post) */}
      <group position={[(length * 0.5) + 0.6, height * 0.5, (width * 0.5) + 0.4]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.12, height, 0.12]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        <Text
          position={[0.4, 0, 0]}
          rotation={[0, -Math.PI / 6, 0]}
          fontSize={0.38}
          color="#0f172a"
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          {`HEIGHT: ${height} m`}
        </Text>
      </group>

      {/* Length Dimension Indicator (Front) */}
      <group position={[0, 0.2, (width * 0.5) + 0.65]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.38}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          {`LENGTH: ${length} m`}
        </Text>
      </group>

      {/* Width Dimension Indicator (Left) */}
      <group position={[-(length * 0.5) - 0.65, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.38}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          {`WIDTH: ${width} m`}
        </Text>
      </group>

      {/* Live Volume Hologram Readout */}
      <group position={[0, height + 0.65, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.55}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor={teamColors.cubeTrim}
        >
          {`${length} × ${width} × ${height} = ${totalVolume} m³`}
        </Text>
      </group>
    </group>
  );
};
