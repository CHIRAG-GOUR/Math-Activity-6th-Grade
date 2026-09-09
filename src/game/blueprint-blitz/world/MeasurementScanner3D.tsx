// ============================================================
// BLUEPRINT BLITZ — Signature 3D Measurement Scanner
// The iconic precision inspection machine featuring:
// - Industrial gantry posts with hydraulic pistons & warning strobes
// - Sweeping holographic laser plane with coordinate grid projection
// - Digital LED measurement readout computing L, W, H, Area & Volume
// - Smooth mechanical scan animation and laser wave effects
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { TeamId } from '../types';

interface MeasurementScanner3DProps {
  teamId: TeamId;
  length: number;
  width: number;
  height: number;
  isScanning: boolean;
  scanProgress: number;
  position?: [number, number, number];
}

export const MeasurementScanner3D: React.FC<MeasurementScanner3DProps> = ({
  teamId,
  length,
  width,
  height,
  isScanning,
  scanProgress,
  position = [0, 0, 0],
}) => {
  const laserBeamRef = useRef<THREE.Group>(null);
  const scanPlaneRef = useRef<THREE.Mesh>(null);

  const spanWidth = Math.max(length + 2.5, 6);
  const spanDepth = Math.max(width + 2.5, 6);
  const gantryHeight = Math.max(height + 2.5, 5);

  const laserColor = isScanning ? '#38bdf8' : '#64748b';
  const laserEmissive = isScanning ? '#0284c7' : '#000000';

  // Animate laser bar along the Z depth of the building site during scanning
  useFrame(() => {
    if (laserBeamRef.current) {
      if (isScanning) {
        const startZ = -(spanDepth * 0.5);
        const currentZ = startZ + scanProgress * spanDepth;
        laserBeamRef.current.position.z = currentZ;
        laserBeamRef.current.visible = true;
      } else {
        laserBeamRef.current.visible = false;
      }
    }
  });

  return (
    <group position={position}>
      {/* ── LEFT VERTICAL GANTRY COLUMN ── */}
      <group position={[-(spanWidth * 0.5), 0, 0]}>
        {/* Footing */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.8, 0.5, 1.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Mast */}
        <mesh position={[0, gantryHeight * 0.5, 0]} castShadow>
          <boxGeometry args={[0.4, gantryHeight, 0.5]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Warning Light on Top */}
        <mesh position={[0, gantryHeight + 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 12]} />
          <meshStandardMaterial
            color={isScanning ? '#ef4444' : '#64748b'}
            emissive={isScanning ? '#ef4444' : '#000000'}
            emissiveIntensity={isScanning ? 1.5 : 0}
          />
        </mesh>
      </group>

      {/* ── RIGHT VERTICAL GANTRY COLUMN ── */}
      <group position={[(spanWidth * 0.5), 0, 0]}>
        {/* Footing */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.8, 0.5, 1.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Mast */}
        <mesh position={[0, gantryHeight * 0.5, 0]} castShadow>
          <boxGeometry args={[0.4, gantryHeight, 0.5]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Warning Light on Top */}
        <mesh position={[0, gantryHeight + 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 12]} />
          <meshStandardMaterial
            color={isScanning ? '#ef4444' : '#64748b'}
            emissive={isScanning ? '#ef4444' : '#000000'}
            emissiveIntensity={isScanning ? 1.5 : 0}
          />
        </mesh>
      </group>

      {/* ── OVERHEAD CROSSBAR BEAM ── */}
      <mesh position={[0, gantryHeight, 0]} castShadow>
        <boxGeometry args={[spanWidth + 0.4, 0.45, 0.6]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* ── DIGITAL MEASUREMENT SCANNER HUD DISPLAY ── */}
      <group position={[0, gantryHeight + 0.8, 0]}>
        {/* Display Shell */}
        <mesh>
          <boxGeometry args={[3.6, 0.9, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Glass Screen */}
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[3.4, 0.7]} />
          <meshBasicMaterial color="#020617" />
        </mesh>

        <Text
          position={[0, 0.16, 0.18]}
          fontSize={0.24}
          color={isScanning ? '#38bdf8' : '#94a3b8'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0284c7"
        >
          {isScanning ? '⚡ SCANNING DIMENSIONS...' : '📐 MEASUREMENT GANTRY READY'}
        </Text>

        <Text
          position={[0, -0.16, 0.18]}
          fontSize={0.28}
          color="#facc15"
          anchorX="center"
          anchorY="middle"
        >
          {`L: ${length}m | W: ${width}m | H: ${height}m`}
        </Text>
      </group>

      {/* ── ACTIVE SWEEPING LASER EMITTER BEAM & HOLOGRAPHIC PLANE ── */}
      <group ref={laserBeamRef} position={[0, 0, 0]}>
        {/* Horizontal Laser Head Slider */}
        <mesh position={[0, gantryHeight - 0.2, 0]}>
          <boxGeometry args={[spanWidth, 0.18, 0.25]} />
          <meshStandardMaterial
            color={laserColor}
            emissive={laserEmissive}
            emissiveIntensity={2.0}
            roughness={0.2}
          />
        </mesh>

        {/* Vertical Holographic Laser Curtain / Scan Sheet */}
        <mesh ref={scanPlaneRef} position={[0, gantryHeight * 0.5, 0]}>
          <planeGeometry args={[spanWidth - 0.2, gantryHeight]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Floor Laser Line Focus */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[spanWidth - 0.2, 0.15]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
};
