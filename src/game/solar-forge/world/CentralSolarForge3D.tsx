// ============================================================
// THE SOLAR FORGE: Giant Central Solar Forge 3D Engineering Machine
// Structural white & brushed titanium pylon tower, rotating gyro-rings,
// glowing molten core receiver, steam manifolds & heat exchangers
// NO thick black poles — elegant, high-tech architectural design!
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SOLAR_MATERIALS } from './materials';

interface CentralSolarForge3DProps {
  position?: [number, number, number];
  powerLevel?: number;           // 0 to 100%
  turbineRPM?: number;
  ringRotationSpeed?: number;
  isBlueConnected?: boolean;
  isRedConnected?: boolean;
  isFullyOperational?: boolean;
}

export const CentralSolarForge3D: React.FC<CentralSolarForge3DProps> = ({
  position = [0, 0, -35],
  powerLevel = 0,
  turbineRPM = 0,
  ringRotationSpeed = 0.2,
  isBlueConnected = false,
  isRedConnected = false,
  isFullyOperational = false,
}) => {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const moltenCoreRef = useRef<THREE.Mesh>(null);
  const steamTurbineRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speed = ringRotationSpeed + (powerLevel / 100) * 0.9;

    // Counter-rotating mechanical gyro rings
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * speed;
      outerRingRef.current.rotation.z = Math.sin(t * 0.5) * 0.08;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * speed * 1.4;
      innerRingRef.current.rotation.x = Math.cos(t * 0.5) * 0.08;
    }

    // Molten core pulsation
    if (moltenCoreRef.current) {
      const pulse = 1.0 + Math.sin(t * 3.5) * (0.05 + (powerLevel / 100) * 0.1);
      moltenCoreRef.current.scale.setScalar(pulse);
    }

    // High-speed steam turbine fan
    if (steamTurbineRef.current && (turbineRPM > 0 || isFullyOperational)) {
      steamTurbineRef.current.rotation.z += delta * 18;
    }
  });

  return (
    <group position={position}>
      {/* ── 1. HEAVY REINFORCED CONCRETE FOUNDATION & ROTUNDA PLAZA ── */}
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[14.5, 16.5, 0.9, 24]} />
        <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
      </mesh>
      <mesh position={[0, 0.95, 0]} receiveShadow>
        <cylinderGeometry args={[13.2, 13.2, 0.12, 24]} />
        <primitive object={SOLAR_MATERIALS.roadAsphalt} attach="material" />
      </mesh>

      {/* Outer Plaza Safety Chevrons */}
      <mesh position={[0, 0.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[12.8, 13.1, 32]} />
        <primitive object={SOLAR_MATERIALS.safetyYellow} attach="material" />
      </mesh>

      {/* ── 2. FOUR ELEGANT WHITE & BRUSHED TITANIUM ARCHITECTURAL PYLONS ── */}
      {[
        [-6.5, 0, -6.5],
        [6.5, 0, -6.5],
        [-6.5, 0, 6.5],
        [6.5, 0, 6.5],
      ].map(([px, py, pz], idx) => (
        <group key={idx} position={[px, 1.0, pz]}>
          {/* Main White Ceramic Structural Column */}
          <mesh position={[0, 9.2, 0]} castShadow>
            <cylinderGeometry args={[0.75, 1.4, 18.5, 16]} />
            <primitive object={SOLAR_MATERIALS.solarWhiteCeramic} attach="material" />
          </mesh>

          {/* Titanium Reinforcement Collars at 3 Heights */}
          {[4.5, 9.5, 14.5].map((yCollar, cIdx) => (
            <mesh key={cIdx} position={[0, yCollar, 0]}>
              <cylinderGeometry args={[1.05 - cIdx * 0.08, 1.05 - cIdx * 0.08, 0.4, 16]} />
              <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
            </mesh>
          ))}

          {/* Top Spherical Anchor Joint */}
          <mesh position={[0, 18.6, 0]}>
            <sphereGeometry args={[1.0, 16, 16]} />
            <primitive object={SOLAR_MATERIALS.chromePlate} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Horizontal Brushed Aluminum Cross-Girders */}
      <mesh position={[0, 10.5, -6.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.35, 13, 0.35]} />
        <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
      </mesh>
      <mesh position={[0, 10.5, 6.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.35, 13, 0.35]} />
        <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
      </mesh>

      {/* ── 3. CENTRAL RECEIVER PLATFORM & MOLTEN SALT CORE ── */}
      <group position={[0, 18.6, 0]}>
        {/* Upper Observation & Service Deck */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[6.6, 7.2, 0.6, 24]} />
          <primitive object={SOLAR_MATERIALS.solarWhiteCeramic} attach="material" />
        </mesh>
        {/* Perimeter Safety Railing (Yellow) */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[6.5, 6.5, 0.9, 24, 1, true]} />
          <primitive object={SOLAR_MATERIALS.safetyYellow} attach="material" wireframe />
        </mesh>

        {/* ── THE MOLTEN CORE SOLAR RECEIVER (Center Glow) ── */}
        <mesh ref={moltenCoreRef} position={[0, 2.0, 0]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <primitive object={SOLAR_MATERIALS.moltenCoreGlow} attach="material" />
        </mesh>

        {/* Outer Hexagonal Heat Shield Lattice */}
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[3.1, 3.1, 4.4, 16, 1, true]} />
          <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" wireframe />
        </mesh>

        {/* ── 4. ROTATING MECHANICAL GYRO-RINGS ── */}
        {/* Outer Heavy Ring (Brushed Aluminum) */}
        <group ref={outerRingRef} position={[0, 2.0, 0]}>
          <mesh>
            <torusGeometry args={[4.4, 0.25, 16, 40]} />
            <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
          </mesh>
          {/* Ring Counterweight Nodes */}
          {[-4.4, 4.4].map((rx, idx) => (
            <mesh key={idx} position={[rx, 0, 0]}>
              <boxGeometry args={[0.5, 0.7, 0.5]} />
              <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
            </mesh>
          ))}
        </group>

        {/* Inner Counter-Rotating Golden Ring */}
        <group ref={innerRingRef} position={[0, 2.0, 0]}>
          <mesh>
            <torusGeometry args={[3.6, 0.18, 16, 40]} />
            <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
          </mesh>
        </group>

        {/* ── 5. STEAM TURBINE MANIFOLD (Base of Tower) ── */}
        <group position={[0, -14.2, 0]}>
          {/* Main Boiler Drum (White & Silver) */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[2.4, 2.4, 6.8, 20]} />
            <primitive object={SOLAR_MATERIALS.solarWhiteCeramic} attach="material" />
          </mesh>
          {/* Stainless Steel Piping */}
          <mesh position={[-2.5, 1.8, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.3, 0.3, 3.2, 12]} />
            <primitive object={SOLAR_MATERIALS.chromePlate} attach="material" />
          </mesh>
          <mesh position={[2.5, 1.8, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.3, 0.3, 3.2, 12]} />
            <primitive object={SOLAR_MATERIALS.chromePlate} attach="material" />
          </mesh>

          {/* Steam Fan Housing */}
          <group ref={steamTurbineRef} position={[0, 0, 3.5]}>
            <mesh>
              <cylinderGeometry args={[1.3, 1.3, 0.22, 20]} />
              <primitive object={SOLAR_MATERIALS.brushedAluminum} attach="material" />
            </mesh>
            {/* Golden Turbine Blades */}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
                <boxGeometry args={[0.16, 2.4, 0.05]} />
                <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
              </mesh>
            ))}
          </group>
        </group>

        {/* ── 6. DUAL TEAM CONDUIT TERMINALS ── */}
        {/* Left (Blue Team) Terminal */}
        <group position={[-6.2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.65, 1.3, 16]} />
            <primitive object={SOLAR_MATERIALS.blueTeamHull} attach="material" />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.35, 14, 14]} />
            <meshBasicMaterial color={isBlueConnected ? '#38bdf8' : '#cbd5e1'} />
          </mesh>
        </group>

        {/* Right (Red Team) Terminal */}
        <group position={[6.2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.65, 1.3, 16]} />
            <primitive object={SOLAR_MATERIALS.redTeamHull} attach="material" />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.35, 14, 14]} />
            <meshBasicMaterial color={isRedConnected ? '#f87171' : '#cbd5e1'} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
