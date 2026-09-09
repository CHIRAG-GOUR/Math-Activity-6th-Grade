// ============================================================
// BLUEPRINT BLITZ — Team Construction Plot 3D Component
// Bright, realistic daytime building site for a team:
// - Concrete foundation pad with team safety boundary & hazard stripes
// - Dynamic switcher between Floor Tiles (Area) and Cube Stacking (Volume)
// - Integrated Tower Crane and Measurement Gantry Scanner
// - Team billboard, blueprint drafting stand, pallets & props
// - 100% Sunny Daytime palette — Zero Dark Navy / Black surfaces
// ============================================================

import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { MechanicType, TeamBuild, TeamId } from '../types';
import { useBlueprintStore } from '../store/blueprintStore';
import { PhysicalTileGrid3D } from './PhysicalTileGrid3D';
import { PhysicalCubeStack3D } from './PhysicalCubeStack3D';
import { CraneRig3D } from './CraneRig3D';
import { MeasurementScanner3D } from './MeasurementScanner3D';
import { HouseBuildingStage3D } from './HouseBuildingStage3D';

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
  const { currentRound, blueTeam, redTeam, phase } = useBlueprintStore();
  const team = teamId === 'blue' ? blueTeam : redTeam;
  const isGameOver = phase === 'game-over';
  const [scanProgress, setScanProgress] = useState(0);

  const isBlue = teamId === 'blue';
  const teamColor = isBlue ? '#2563eb' : '#dc2626';
  const teamLight = isBlue ? '#93c5fd' : '#fca5a5';

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
      {/* ── 1. LIGHT CONCRETE FOUNDATION SLAB ── */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[14, 0.4, 14]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* ── 2. TEAM PAINTED SAFETY BORDER CURB ── */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[13.6, 0.04, 13.6]} />
        <meshStandardMaterial color={teamColor} roughness={0.4} />
      </mesh>

      {/* ── 3. INNER ACTIVE BUILD BED (Light Smooth Concrete with Chalk Grid) ── */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12.8, 12.8]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.9}
        />
      </mesh>

      {/* Chalk / Yellow Foundation Grid Marking Lines */}
      <group position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {[-4, -2, 0, 2, 4].map((coord, idx) => (
          <React.Fragment key={idx}>
            <mesh position={[coord, 0, 0]}>
              <planeGeometry args={[0.04, 12.0]} />
              <meshBasicMaterial color="#facc15" />
            </mesh>
            <mesh position={[0, coord, 0]}>
              <planeGeometry args={[12.0, 0.04]} />
              <meshBasicMaterial color="#facc15" />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* ── 4. TEAM IDENTITY BILLBOARD & SCOREBOARD (Bright Solid Daytime Styling) ── */}
      <group position={[0, 3.8, -6.6]}>
        {/* Support Steel Posts */}
        <mesh position={[-3, -1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.8, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[3, -1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.8, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>

        {/* Board Outer Yellow Frame */}
        <mesh castShadow>
          <boxGeometry args={[6.8, 1.8, 0.2]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Solid Vibrant Team Colored Background (Blue or Red, No Black!) */}
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[6.5, 1.5]} />
          <meshBasicMaterial color={teamColor} />
        </mesh>

        <Text
          position={[0, 0.35, 0.13]}
          fontSize={0.52}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#0f172a"
        >
          {`🏗️ ${teamName}`}
        </Text>

        <Text
          position={[0, -0.32, 0.13]}
          fontSize={0.38}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0f172a"
        >
          {`★ SCORE: ${score} PTS`}
        </Text>
      </group>

      {/* ── 5. ACTIVE BUILDING STRUCTURE (Floor Tiles or 3D Cubes) ── */}
      {isAreaMode ? (
        <PhysicalTileGrid3D
          length={build.length}
          width={build.width}
          teamId={teamId}
          materialType={build.shapeType}
          isScanning={isScanning}
          scanProgress={scanProgress}
        />
      ) : (
        <PhysicalCubeStack3D
          length={build.length}
          width={build.width}
          height={build.height}
          teamId={teamId}
          materialType={build.shapeType}
          totalBlocks={mechanic === 'modify' ? build.blocks : undefined}
          isScanning={isScanning}
          scanProgress={scanProgress}
        />
      )}

      {/* ── 5B. HOUSE BUILDING STAGE PROGRESSION (Rounds 1-5) ── */}
      <HouseBuildingStage3D
        teamId={teamId}
        currentRound={currentRound}
        completedStages={team.completedChallengesCount}
        isGameOver={isGameOver}
      />

      {/* ── 6. DEDICATED SITE TOWER CRANE RIG ── */}
      <CraneRig3D
        teamId={teamId}
        angle={build.craneAngle}
        height={build.craneHeight}
        position={isBlue ? [-5.5, 0, -5.5] : [5.5, 0, -5.5]}
        isHolding={build.craneHolding}
      />

      {/* ── 7. MEASUREMENT GANTRY SCANNER ARCHES ── */}
      <MeasurementScanner3D
        length={build.length}
        width={build.width}
        height={build.height}
        isScanning={isScanning}
        scanProgress={scanProgress}
        teamId={teamId}
      />

      {/* ── 8. ON-SITE MATERIAL PALLETS & CRATES ── */}
      <group position={isBlue ? [-4.5, 0, 4.8] : [4.5, 0, 4.8]}>
        {/* Wooden Pallet Base */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[1.8, 0.2, 1.8]} />
          <meshStandardMaterial color="#d97706" roughness={0.8} />
        </mesh>
        {/* Stacked Building Material Blocks on Pallet */}
        <group position={[0, 0.45, 0]}>
          <mesh position={[-0.4, 0, -0.4]} castShadow>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <meshStandardMaterial color={teamColor} roughness={0.4} />
          </mesh>
          <mesh position={[0.4, 0, -0.4]} castShadow>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <meshStandardMaterial color={teamColor} roughness={0.4} />
          </mesh>
          <mesh position={[-0.4, 0, 0.4]} castShadow>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <meshStandardMaterial color={teamColor} roughness={0.4} />
          </mesh>
          <mesh position={[0.4, 0, 0.4]} castShadow>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <meshStandardMaterial color={teamColor} roughness={0.4} />
          </mesh>
          {/* Top Layer */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.8, 0.4, 0.8]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
