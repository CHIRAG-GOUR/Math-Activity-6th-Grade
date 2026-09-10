// ============================================================
// EQUATION MISSION CONTROL — Stage 4 3D Navigation Calibration System
// Physical Trajectory Laser Alignment & Calibration Station:
// - Optical Telescope / Laser Targeter pointing toward Spacecraft
// - Calibrated Distance Dials (Speed & Time)
// - Alignment Laser Beam connecting Terminal to Rocket Guidance Sensor
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMissionControlStore } from '../store/missionControlStore';

export const NavigationCalibration3D: React.FC = () => {
  const trackerHeadRef = useRef<THREE.Group>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);
  const navLightRef = useRef<THREE.PointLight>(null);

  const stage = useMissionControlStore((s) => s.currentStageIndex);
  const navLocked = useMissionControlStore(
    (s) => s.blueSpacecraft.stage4NavDone || s.redSpacecraft.stage4NavDone
  );

  useFrame(() => {
    if (trackerHeadRef.current) {
      if (navLocked) {
        trackerHeadRef.current.rotation.y = 0.55;
        trackerHeadRef.current.rotation.x = -0.35;
      } else {
        const t = Date.now() * 0.003;
        trackerHeadRef.current.rotation.y = 0.55 + Math.sin(t) * 0.12;
        trackerHeadRef.current.rotation.x = -0.35 + Math.cos(t * 0.8) * 0.08;
      }
    }

    if (laserBeamRef.current) {
      const active = stage === 3 || navLocked;
      laserBeamRef.current.visible = active;
      const mat = laserBeamRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = navLocked ? 3.0 : 1.2 + Math.sin(Date.now() * 0.01) * 0.6;
      }
    }

    if (navLightRef.current) {
      navLightRef.current.intensity = navLocked ? 2.5 : stage === 3 ? 1.0 : 0.2;
    }
  });

  return (
    <group position={[2.8, 0.5, -1.6]} rotation={[0, -0.35, 0]} scale={[0.85, 0.85, 0.85]}>
      {/* Heavy Steel Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.32, 0.45, 1.0, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Rotating Optoelectronic Tracking Head */}
      <group ref={trackerHeadRef} position={[0, 1.15, 0]}>
        {/* Main Laser Housing */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.35, 0.65]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Optical Lens Aperture */}
        <mesh position={[0, 0, 0.34]}>
          <cylinderGeometry args={[0.14, 0.14, 0.06, 16]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.5} />
        </mesh>

        {/* Parabolic Telemetry Calibration Dish */}
        <mesh position={[0, 0.3, -0.1]} rotation={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>

        {/* Green Trajectory Alignment Laser Beam toward Spacecraft */}
        <mesh
          ref={laserBeamRef}
          position={[-1.6, 1.2, 1.8]}
          rotation={[0.4, 0.6, 0]}
        >
          <cylinderGeometry args={[0.02, 0.02, 4.2, 8]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={2.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      <pointLight
        ref={navLightRef}
        position={[0, 1.5, 0.3]}
        color="#10b981"
        distance={5}
        intensity={0.6}
      />
    </group>
  );
};
