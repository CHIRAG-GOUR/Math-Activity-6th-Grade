// ============================================================
// BLUEPRINT BLITZ — Team Construction Plot 3D Component
// Assembles complete physical building site for a team:
// - Foundation pad with safety boundary & team hazard stripes
// - Dynamic switcher between Floor Tiles (Area) and Cube Stacking (Volume)
// - Integrated Tower Crane and Measurement Gantry Scanner
// - Team billboard, blueprint drafting stand, pallets & props
// ============================================================

import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { MechanicType, TeamBuild, TeamId } from '../types';
import { PhysicalTileGrid3D } from './PhysicalTileGrid3D';
import { PhysicalCubeStack3D } from './PhysicalCubeStack3D';
import { CraneRig3D } from './CraneRig3D';
import { MeasurementScanner3D } from './MeasurementScanner3D';

interface ConstructionPlot3DProps {
  teamId: TeamId;
  teamName: string;
  score: number;
  build: TeamBuild;
  mechanic: MechanicType;
  isScanning: boolean;
  position: [number, number, number];
}

export const ConstructionPlot3D: React.FC<ConstructionPlot3DProps> = ({
  teamId,
  teamName,
  score,
  build,
  mechanic,
  isScanning,
  position,
}) => {
  const [scanProgress, setScanProgress] = useState(0);

  const isBlue = teamId === 'blue';
  const teamColor = isBlue ? '#2563eb' : '#dc2626';
  const teamGlow = isBlue ? '#60a5fa' : '#f87171';
  const bannerColor = isBlue ? '#1e3a8a' : '#7f1d1d';

  // Animate scan progress when active
  useFrame((_, delta) => {
    if (isScanning) {
      setScanProgress((prev) => (prev + delta * 0.7) % 1);
    } else {
      setScanProgress(0);
    }
  });

  const isAreaMode = mechanic === 'floor';

  return (
    <group position={position}>
      {/* ── HEAVY CONCRETE FOUNDATION SLAB ── */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[14, 0.4, 14]} />
        <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* ── TEAM HAZARD BORDER TRIM ── */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[13.6, 0.04, 13.6]} />
        <meshStandardMaterial color={teamColor} roughness={0.5} />
      </mesh>

      {/* Inner Active Build Bed */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12.8, 12.8]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.9}
        />
      </mesh>

      {/* ── TEAM IDENTITY BILLBOARD & SCOREBOARD ── */}
      <group position={[0, 3.8, -6.6]}>
        {/* Support Steel Posts */}
        <mesh position={[-3, -1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.8, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <mesh position={[3, -1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.8, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {/* Board Panel */}
        <mesh castShadow>
          <boxGeometry args={[6.8, 1.8, 0.2]} />
          <meshStandardMaterial color={bannerColor} roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[6.5, 1.5]} />
          <meshBasicMaterial color="#020617" />
        </mesh>

        <Text
          position={[0, 0.35, 0.13]}
          fontSize={0.52}
          color={teamGlow}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          {`🏗️ ${teamName}`}
        </Text>

        <Text
          position={[0, -0.32, 0.13]}
          fontSize={0.38}
          color="#facc15"
          anchorX="center"
          anchorY="middle"
        >
          {`SCORE: ★ ${score} PTS`}
        </Text>
      </group>

      {/* ── PHYSICAL MATHEMATICAL STRUCTURE (TILES OR CUBES) ── */}
      <group position={[0, 0.1, 0]}>
        {isAreaMode ? (
          <PhysicalTileGrid3D
            length={build.length}
            width={build.width}
            teamId={teamId}
            isScanning={isScanning}
            scanProgress={scanProgress}
          />
        ) : (
          <PhysicalCubeStack3D
            length={build.length}
            width={build.width}
            height={build.height}
            totalBlocks={build.blocks}
            teamId={teamId}
            isScanning={isScanning}
            scanProgress={scanProgress}
          />
        )}
      </group>

      {/* ── INTERACTIVE MEASUREMENT SCANNER GANTRY ── */}
      <MeasurementScanner3D
        teamId={teamId}
        length={build.length}
        width={build.width}
        height={build.height}
        isScanning={isScanning}
        scanProgress={scanProgress}
        position={[0, 0, 0]}
      />

      {/* ── TOWER CRANE RIG ── */}
      <CraneRig3D
        teamId={teamId}
        angle={build.craneAngle}
        height={build.craneHeight}
        isHolding={build.craneHolding}
        position={[isBlue ? -5.5 : 5.5, 0, -4.5]}
      />

      {/* ── CONSTRUCTION SITE PROPS (Pallets, Cones, Floodlights) ── */}
      {/* Material Pallet with Stored Blocks */}
      <group position={[isBlue ? 5.2 : -5.2, 0, -4.5]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.8, 0.2, 1.8]} />
          <meshStandardMaterial color="#854d0e" roughness={0.9} />
        </mesh>
        {[0, 1].map((layer) => (
          <group key={layer} position={[0, 0.5 + layer * 0.6, 0]}>
            <mesh position={[-0.4, 0, -0.4]} castShadow>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
              <meshStandardMaterial color={teamColor} />
            </mesh>
            <mesh position={[0.4, 0, -0.4]} castShadow>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
              <meshStandardMaterial color={teamColor} />
            </mesh>
            <mesh position={[-0.4, 0, 0.4]} castShadow>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
              <meshStandardMaterial color={teamColor} />
            </mesh>
            <mesh position={[0.4, 0, 0.4]} castShadow>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
              <meshStandardMaterial color={teamColor} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Safety Cones along the front */}
      {[-4.5, -2.2, 2.2, 4.5].map((xPos, i) => (
        <group key={i} position={[xPos, 0, 6.2]}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.4, 0.08, 0.4]} />
            <meshStandardMaterial color="#f97316" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.18, 0.7, 12]} />
            <meshStandardMaterial color="#ea580c" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.12, 0.14, 0.15, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Floodlight Mast */}
      <group position={[isBlue ? -5.8 : 5.8, 0, 5.5]}>
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 5, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        <mesh position={[0, 5.1, 0]} rotation={[0.4, isBlue ? 0.6 : -0.6, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.3]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.6} />
        </mesh>
        <pointLight
          position={[0, 5.0, 0]}
          intensity={1.5}
          distance={15}
          color="#fef08a"
        />
      </group>
    </group>
  );
};
