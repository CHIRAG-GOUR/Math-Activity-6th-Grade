// ============================================================
// THE SOLAR FORGE: Heavy Heliostat Solar Mirror 3D Machine
// Precision dual-axis tracking heliostat: rotating azimuth ring,
// elevation tilt yoke, dual linear actuators, specular reflective pane,
// warning markings, maintenance platform & team livery
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SOLAR_MATERIALS } from './materials';
import { TeamId } from '../types';

interface HeliostatMirror3DProps {
  team: TeamId;
  index: number;
  position: [number, number, number];
  azimuthDeg: number;
  elevationDeg: number;
  targetAzimuthDeg?: number;
  targetElevationDeg?: number;
  isActive?: boolean;
  isLockedOnTarget?: boolean;
}

export const HeliostatMirror3D: React.FC<HeliostatMirror3DProps> = ({
  team,
  index,
  position,
  azimuthDeg,
  elevationDeg,
  targetAzimuthDeg,
  targetElevationDeg,
  isActive = false,
  isLockedOnTarget = false,
}) => {
  const azimuthYokeRef = useRef<THREE.Group>(null);
  const elevationMirrorRef = useRef<THREE.Group>(null);
  const actuatorRodRef = useRef<THREE.Mesh>(null);

  const isBlue = team === 'blue';
  const teamHullMat = isBlue ? SOLAR_MATERIALS.blueTeamHull : SOLAR_MATERIALS.redTeamHull;
  const teamAccentMat = isBlue ? SOLAR_MATERIALS.blueTeamAccent : SOLAR_MATERIALS.redTeamAccent;
  const teamColor = isBlue ? '#38bdf8' : '#f87171';

  useFrame((_, delta) => {
    // Smooth Azimuth (Yaw) Rotation
    if (azimuthYokeRef.current) {
      const wantAzim = targetAzimuthDeg !== undefined ? targetAzimuthDeg : azimuthDeg;
      const targetRad = (-wantAzim * Math.PI) / 180;
      azimuthYokeRef.current.rotation.y = THREE.MathUtils.damp(
        azimuthYokeRef.current.rotation.y,
        targetRad,
        2.8,
        delta
      );
    }

    // Smooth Elevation (Pitch) Tilt
    if (elevationMirrorRef.current) {
      const wantElev = targetElevationDeg !== undefined ? targetElevationDeg : elevationDeg;
      const targetPitchRad = (wantElev * Math.PI) / 180;
      elevationMirrorRef.current.rotation.x = THREE.MathUtils.damp(
        elevationMirrorRef.current.rotation.x,
        targetPitchRad,
        2.8,
        delta
      );
    }

    // Linear hydraulic actuator stroke animation
    if (actuatorRodRef.current && elevationMirrorRef.current) {
      const pitch = elevationMirrorRef.current.rotation.x;
      actuatorRodRef.current.position.y = 1.4 + Math.sin(pitch) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* ── 1. OCTAGONAL REINFORCED CONCRETE PEDESTAL ── */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.4, 2.8, 0.8, 8]} />
        <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
      </mesh>

      {/* Maintenance Steel Grating Platform */}
      <mesh position={[0, 0.82, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.05, 16]} />
        <primitive object={SOLAR_MATERIALS.machinerySteel} attach="material" />
      </mesh>

      {/* Safety Yellow Perimeter Ring */}
      <mesh position={[0, 0.84, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.35, 2.48, 24]} />
        <primitive object={SOLAR_MATERIALS.safetyYellow} attach="material" />
      </mesh>

      {/* ── 2. ROTATING AZIMUTH YOKE MECHANISM ── */}
      <group ref={azimuthYokeRef} position={[0, 0.85, 0]}>
        {/* Massive Central Ring Bearing */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.5, 24]} />
          <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
        </mesh>

        {/* Dual Vertical Yoke Towers (Left & Right Arms) */}
        <mesh position={[-1.2, 1.8, 0]} castShadow>
          <boxGeometry args={[0.38, 2.6, 0.6]} />
          <primitive object={teamHullMat} attach="material" />
        </mesh>
        <mesh position={[1.2, 1.8, 0]} castShadow>
          <boxGeometry args={[0.38, 2.6, 0.6]} />
          <primitive object={teamHullMat} attach="material" />
        </mesh>

        {/* Team Racing Stripes on Yoke Arms */}
        <mesh position={[-1.4, 1.8, 0]}>
          <boxGeometry args={[0.02, 1.8, 0.25]} />
          <primitive object={teamAccentMat} attach="material" />
        </mesh>
        <mesh position={[1.4, 1.8, 0]}>
          <boxGeometry args={[0.02, 1.8, 0.25]} />
          <primitive object={teamAccentMat} attach="material" />
        </mesh>

        {/* Main Elevation Pivot Axle Pins */}
        <mesh position={[0, 2.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 2.8, 16]} />
          <primitive object={SOLAR_MATERIALS.chromePlate} attach="material" />
        </mesh>

        {/* Hydraulic Piston Actuator Housing (Rear of Yoke) */}
        <mesh position={[0, 1.2, -0.7]} rotation={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 1.4, 12]} />
          <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
        </mesh>
        {/* Shiny Chrome Actuator Rod */}
        <mesh ref={actuatorRodRef} position={[0, 1.8, -0.5]} rotation={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 1.2, 12]} />
          <primitive object={SOLAR_MATERIALS.chromePlate} attach="material" />
        </mesh>

        {/* ── 3. ELEVATION TILT MIRROR ASSEMBLY ── */}
        <group ref={elevationMirrorRef} position={[0, 2.8, 0]}>
          {/* Heavy Space-Frame Support Grid (Back of Mirror) */}
          <mesh position={[0, 0, -0.18]} castShadow>
            <boxGeometry args={[4.8, 3.4, 0.15]} />
            <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
          </mesh>

          {/* Diagonal Structural Stiffener Trusses */}
          <mesh position={[0, 0, -0.32]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[5.2, 0.12, 0.1]} />
            <primitive object={SOLAR_MATERIALS.chromePlate} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.32]} rotation={[0, 0, -0.6]}>
            <boxGeometry args={[5.2, 0.12, 0.1]} />
            <primitive object={SOLAR_MATERIALS.chromePlate} attach="material" />
          </mesh>

          {/* ── THE HIGH-SPECULAR SOLAR MIRROR PANE (Front) ── */}
          <mesh position={[0, 0, 0.02]} receiveShadow>
            <boxGeometry args={[4.6, 3.2, 0.08]} />
            <primitive object={SOLAR_MATERIALS.mirrorSurface} attach="material" />
          </mesh>

          {/* Beveled Perimeter Protective Border */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[4.68, 3.28, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} wireframe />
          </mesh>

          {/* Active Target Sensor Hub (Center of Mirror Face) */}
          <mesh position={[0, 0, 0.08]}>
            <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
            <primitive object={SOLAR_MATERIALS.machinerySteel} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.11]}>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color={isLockedOnTarget ? '#22c55e' : teamColor} />
          </mesh>

          {/* Station Identifier Tag (e.g. M-1, M-2) */}
          <mesh position={[-2.0, 1.3, 0.08]}>
            <planeGeometry args={[0.5, 0.3]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
        </group>
      </group>

      {/* Electrical Conduit Feed Line to Base */}
      <mesh position={[1.4, 0.4, 1.2]} rotation={[0, 0.8, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.5]} />
        <primitive object={SOLAR_MATERIALS.machinerySteel} attach="material" />
      </mesh>
    </group>
  );
};
