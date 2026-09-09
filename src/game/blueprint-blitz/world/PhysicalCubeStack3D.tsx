// ============================================================
// BLUEPRINT BLITZ — Physical 3D Cube Stacking & Volume Component
// Renders authentic physical unit cubes (1x1x1) stacked in L x W x H layers
// - Beveled cube geometry with metallic corner brackets & wood/steel faces
// - Layer separators and precise vertical stacking without illegal clipping
// - Dimensional markers for Length, Width, and Height
// - Realtime volume calculation and laser scanning glow
// ============================================================

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { TeamId } from '../types';

interface PhysicalCubeStack3DProps {
  length: number;  // X axis (columns)
  width: number;   // Z axis (rows)
  height: number;  // Y axis (layers)
  teamId: TeamId;
  totalBlocks?: number;
  isScanning?: boolean;
  scanProgress?: number;
}

export const PhysicalCubeStack3D: React.FC<PhysicalCubeStack3DProps> = ({
  length,
  width,
  height,
  teamId,
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
          glow: '#38bdf8',
          textBg: '#1e3a8a',
        }
      : {
          cubeBody: '#ef4444',
          cubeTrim: '#b91c1c',
          accent: '#f87171',
          glow: '#fb7185',
          textBg: '#7f1d1d',
        };
  }, [teamId]);

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
      {/* Heavy Steel Base Grid Platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[length + 0.8, 0.2, width + 0.8]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Concrete Support Blocks under Platform */}
      <mesh position={[-(length * 0.5) - 0.2, -0.3, -(width * 0.5) - 0.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[(length * 0.5) + 0.2, -0.3, -(width * 0.5) - 0.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[-(length * 0.5) - 0.2, -0.3, (width * 0.5) + 0.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[(length * 0.5) + 0.2, -0.3, (width * 0.5) + 0.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Render Individual Physical 3D Cubes */}
      {cubes.map((cube) => {
        // Laser scan plane check
        const isLaserActive =
          isScanning &&
          Math.abs(cube.y - (scanProgress * height)) < 0.7;

        return (
          <group key={cube.key} position={[cube.x, cube.y, cube.z]}>
            {/* Main Cube Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.94, 0.94, 0.94]} />
              <meshStandardMaterial
                color={isLaserActive ? '#fbbf24' : '#e2e8f0'}
                roughness={0.35}
                metalness={0.2}
                emissive={isLaserActive ? '#f59e0b' : '#000000'}
                emissiveIntensity={isLaserActive ? 0.9 : 0}
              />
            </mesh>

            {/* Team Colored Reinforcement Trim / Outer Frame */}
            <mesh>
              <boxGeometry args={[0.96, 0.96, 0.96]} />
              <meshStandardMaterial
                color={teamColors.cubeTrim}
                wireframe
                wireframeLinewidth={2}
              />
            </mesh>

            {/* Top Surface Texture Plate */}
            <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.8, 0.8]} />
              <meshStandardMaterial
                color={teamColors.cubeBody}
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>

            {/* Rivets / Corner Bolt studs */}
            <mesh position={[0.38, 0.38, 0.48]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
            <mesh position={[-0.38, 0.38, 0.48]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
            <mesh position={[0.38, -0.38, 0.48]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
            <mesh position={[-0.38, -0.38, 0.48]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Height Dimension Ruler (Right Post) */}
      <group position={[(length * 0.5) + 0.6, height * 0.5, (width * 0.5) + 0.4]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.12, height, 0.12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text
          position={[0.4, 0, 0]}
          rotation={[0, -Math.PI / 6, 0]}
          fontSize={0.38}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#0f172a"
        >
          {`HEIGHT: ${height} m`}
        </Text>
      </group>

      {/* Length Dimension Indicator (Front) */}
      <group position={[0, 0.2, (width * 0.5) + 0.65]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.38}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#0f172a"
        >
          {`LENGTH: ${length} m`}
        </Text>
      </group>

      {/* Live Volume Floating Header */}
      <group position={[0, height + 0.6, 0]}>
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[4.2, 0.8]} />
          <meshBasicMaterial color="#0f172a" opacity={0.9} transparent />
        </mesh>
        <Text
          position={[0, 0.15, 0]}
          fontSize={0.32}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {`${length} × ${width} × ${height}`}
        </Text>
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.44}
          color="#facc15"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          {`VOLUME = ${totalVolume} m³`}
        </Text>
      </group>
    </group>
  );
};
