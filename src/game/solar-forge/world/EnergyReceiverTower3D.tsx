// ============================================================
// THE SOLAR FORGE: Modern High-Tech Solar Power Receiver Tower 3D
// High-albedo white & silver open-lattice truss tower,
// photovoltaic ceramic cavity, illuminated molten salt conduits,
// safety access ladder & glowing high-flux focal aperture.
// REPLACES the ambiguous black poles with recognizable solar equipment!
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SOLAR_MATERIALS } from './materials';
import { TeamId } from '../types';

interface EnergyReceiverTower3DProps {
  team: TeamId;
  position: [number, number, number];
  powerLevel?: number;        // 0 to 100%
  isActive?: boolean;
  isStruckByBeam?: boolean;
}

export const EnergyReceiverTower3D: React.FC<EnergyReceiverTower3DProps> = ({
  team,
  position,
  powerLevel = 0,
  isActive = false,
  isStruckByBeam = false,
}) => {
  const collectorHeadRef = useRef<THREE.Group>(null);
  const fluxHaloRef = useRef<THREE.Mesh>(null);
  const conduitGlowRef = useRef<THREE.Mesh>(null);

  const isBlue = team === 'blue';
  const teamColor = isBlue ? '#38bdf8' : '#f87171';
  const teamAccentHex = isBlue ? '#0284c7' : '#dc2626';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle micro-yaw tracking optimal focus
    if (collectorHeadRef.current) {
      collectorHeadRef.current.rotation.y = (isBlue ? 0.35 : -0.35) + Math.sin(t * 0.7) * 0.02;
    }

    // High-flux thermal pulsation when beam strikes
    if (fluxHaloRef.current && isStruckByBeam) {
      const scale = 1.0 + Math.sin(t * 4.5) * 0.14;
      fluxHaloRef.current.scale.setScalar(scale);
    }

    // Energy pulse through vertical conduit
    if (conduitGlowRef.current) {
      const mat = conduitGlowRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.4 + Math.sin(t * 3.0 + (isBlue ? 0 : Math.PI)) * 0.3;
      }
    }
  });

  return (
    <group position={position}>
      {/* ── 1. HEAVY REINFORCED CONCRETE PLATFORM ── */}
      <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.2, 3.6, 0.7, 8]} />
        <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
      </mesh>

      {/* Yellow Safety Warning Chevron Rim */}
      <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.4, 24]} />
        <primitive object={SOLAR_MATERIALS.safetyYellow} attach="material" />
      </mesh>

      {/* ── 2. WHITE & SILVER OPEN-LATTICE TRUSS TOWER (12m Tall) ── */}
      {/* Central White Architectural Column */}
      <mesh position={[0, 6.2, 0]} castShadow>
        <cylinderGeometry args={[0.7, 1.2, 11.0, 16]} />
        <primitive object={SOLAR_MATERIALS.solarWhiteCeramic} attach="material" />
      </mesh>

      {/* 4 Silver Lattice Girders flanking column */}
      {[
        [-0.9, -0.9],
        [0.9, -0.9],
        [-0.9, 0.9],
        [0.9, 0.9],
      ].map(([ox, oz], idx) => (
        <mesh key={idx} position={[ox, 6.2, oz]} castShadow>
          <cylinderGeometry args={[0.07, 0.12, 11.2, 8]} />
          <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
        </mesh>
      ))}

      {/* Horizontal Cross-Bracing Rings every 2.5m */}
      {[3.0, 5.5, 8.0, 10.5].map((yHeight, idx) => (
        <group key={idx} position={[0, yHeight, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[1.0 - idx * 0.08, 0.05, 8, 16]} />
            <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Vertical Maintenance Ladder (Yellow) */}
      <group position={[0, 6.0, 0.85]}>
        <mesh position={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 10.5, 6]} />
          <primitive object={SOLAR_MATERIALS.safetyYellow} attach="material" />
        </mesh>
        <mesh position={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 10.5, 6]} />
          <primitive object={SOLAR_MATERIALS.safetyYellow} attach="material" />
        </mesh>
        {/* Rungs */}
        {Array.from({ length: 18 }).map((_, rIdx) => (
          <mesh key={rIdx} position={[0, -5.0 + rIdx * 0.58, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.38, 6]} />
            <primitive object={SOLAR_MATERIALS.safetyYellow} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Vertical Glowing Energy Conduit running down tower */}
      <mesh ref={conduitGlowRef} position={[0, 6.0, -0.75]}>
        <cylinderGeometry args={[0.06, 0.06, 10.5, 8]} />
        <meshBasicMaterial color={teamColor} transparent opacity={0.6} />
      </mesh>

      {/* Team Insignia Band with Squad Color */}
      <group position={[0, 10.8, 0]}>
        <mesh>
          <cylinderGeometry args={[0.88, 0.88, 1.4, 16]} />
          <meshStandardMaterial color={teamAccentHex} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.9]}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ── 3. HIGH-TEMPERATURE SOLAR FLUX RECEIVER HEAD ── */}
      <group ref={collectorHeadRef} position={[0, 12.6, 0]}>
        {/* Upper Service Walkway Deck */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[2.2, 2.2, 0.25, 16]} />
          <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
        </mesh>
        {/* Railing */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[2.15, 2.15, 0.7, 16, 1, true]} />
          <meshStandardMaterial color="#94a3b8" wireframe />
        </mesh>

        {/* High-Flux Cylindrical Cavity Boiler (Gleaming white & brushed silver) */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[1.4, 1.6, 2.4, 16]} />
          <primitive object={SOLAR_MATERIALS.solarWhiteCeramic} attach="material" />
        </mesh>

        {/* Forward Facing Solar Aperture Lens (Aims at mirrors) */}
        <group position={[0, 1.2, 0.8]}>
          {/* Ceramic Shield Bezel */}
          <mesh>
            <torusGeometry args={[0.95, 0.15, 8, 24]} />
            <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
          </mesh>
          {/* Deep Photovoltaic / Solar Honeycomb Absorber Face */}
          <mesh position={[0, 0, -0.05]}>
            <circleGeometry args={[0.9, 24]} />
            <primitive object={SOLAR_MATERIALS.receiverCeramic} attach="material" />
          </mesh>

          {/* Glowing Golden High-Flux Focal Spot when beam connects */}
          {isStruckByBeam && (
            <group>
              <mesh position={[0, 0, 0.02]}>
                <circleGeometry args={[0.7, 24]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              {/* Luminous outward flare */}
              <mesh ref={fluxHaloRef} position={[0, 0, 0.05]}>
                <ringGeometry args={[0.65, 1.3, 24]} />
                <meshBasicMaterial color={teamColor} transparent opacity={0.65} />
              </mesh>
            </group>
          )}
        </group>

        {/* Top-Mounted Telemetric Anemometer / Solar Pyranometer */}
        <mesh position={[0, 2.7, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.7, 8]} />
          <primitive object={SOLAR_MATERIALS.chromePlate} attach="material" />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <sphereGeometry args={[0.16, 8, 8]} />
          <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
        </mesh>
      </group>

      {/* ── 4. GROUND LEVEL POWER CONVERTER CABINET ── */}
      <group position={[0, 1.2, -1.4]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.4, 1.0]} />
          <primitive object={SOLAR_MATERIALS.solarWhiteCeramic} attach="material" />
        </mesh>
        {/* LED Operational Status Light */}
        <mesh position={[0, 0.3, 0.52]}>
          <planeGeometry args={[0.7, 0.2]} />
          <meshBasicMaterial color={isStruckByBeam ? '#22c55e' : '#38bdf8'} />
        </mesh>
      </group>
    </group>
  );
};
