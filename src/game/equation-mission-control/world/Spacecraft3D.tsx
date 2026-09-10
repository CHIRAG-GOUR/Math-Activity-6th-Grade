// ============================================================
// EQUATION MISSION CONTROL 2.0 — 3D Spacecraft Model
// High-Quality Stylized Aerospace Launch Vehicle with:
// - Blue / Red Team Livery + Large Physical Team Name Plate
// - Cockpit with Glowing HUD & Pilot Canopy
// - Aerodynamic Swept Delta Wings with Wingtip Strobe Strobes
// - Triple Engine Cluster + Dual Solid Rocket Boosters (SRBs)
// - 4 Heavy Hydraulic Landing Legs with Pad Clamps
// - Animated 3D Waving Team Flag that Flutters in the Wind
// - 5 Real Mechanical Preparation Stages + Dynamic Liftoff Physics
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Spacecraft3DState, TeamId } from '../types';

interface SpacecraftProps {
  state: Spacecraft3DState;
  position: [number, number, number];
  team: TeamId;
  isHeroWinner?: boolean;
}

export const Spacecraft3D: React.FC<SpacecraftProps> = ({
  state,
  position,
  team,
  isHeroWinner = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const flagMeshRef = useRef<THREE.Mesh>(null);
  const flameMeshRef = useRef<THREE.Mesh>(null);
  const smokeMeshRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Group>(null);
  const engineClusterRef = useRef<THREE.Group>(null);

  const isBlue = team === 'blue';

  // Livery Colors
  const primaryColor = isBlue ? '#2563eb' : '#dc2626'; // Vibrant Blue / Red
  const primaryDark = isBlue ? '#1d4ed8' : '#b91c1c';
  const accentColor = '#f59e0b'; // Amber / Yellow safety trim
  const bodyColor = '#f8fafc';   // Clean White Aerospace Ceramic
  const darkMetal = '#1e293b';   // Slate / Titanium
  const engineMetal = '#334155'; // Dark Chrome Nozzles

  // Frame loop for liftoff physics, flag wave, vibration, and animations
  useFrame((stateThree, delta) => {
    const time = stateThree.clock.getElapsedTime();

    if (groupRef.current) {
      // 1. Smooth Altitude Ascent
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        position[1] + state.altitude,
        delta * 3.5
      );

      // 2. Engine Vibration during Ignition & Thrust Ramp
      if (state.launchStage === 'ignition' || state.launchStage === 'thrust-ramp') {
        const shake = (Math.random() - 0.5) * 0.08;
        groupRef.current.position.x = position[0] + shake;
        groupRef.current.position.z = position[2] + shake;
      } else {
        groupRef.current.position.x = position[0];
        groupRef.current.position.z = position[2];
      }

      // 3. Stage 4 Navigation Gimbal Pitch / Flight Alignment
      if (state.stage4NavDone && state.launchStage === 'idle') {
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          isBlue ? -0.04 : 0.04,
          delta * 2
        );
      }
    }

    // 4. Animated 3D Waving Flag (Sine wave displacement)
    if (flagMeshRef.current) {
      const geom = flagMeshRef.current.geometry as THREE.PlaneGeometry;
      if (geom && geom.attributes.position) {
        const posAttr = geom.attributes.position;
        const waveSpeed = state.flagWaveSpeed * 4.0;
        const prominence = state.flagProminence || 1;

        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i);
          // Wave increases away from the flagpole (u > 0)
          const wave = Math.sin(time * waveSpeed + u * 3.0) * (0.15 * prominence * (u + 0.5));
          posAttr.setZ(i, wave);
        }
        posAttr.needsUpdate = true;
      }
    }

    // 5. High-Gain Antenna Scanning Rotation (Stage 4)
    if (antennaRef.current && state.antennaDeployed) {
      antennaRef.current.rotation.y = time * 1.5;
    }

    // 6. Engine Flame Pulsing
    if (flameMeshRef.current && state.exhaustFlameScale > 0) {
      const pulse = 1 + Math.sin(time * 30) * 0.15;
      flameMeshRef.current.scale.set(
        state.exhaustFlameScale * pulse,
        state.exhaustFlameScale * (1.2 + Math.cos(time * 25) * 0.2),
        state.exhaustFlameScale * pulse
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ── 1. MAIN FUSELAGE BODY (Aerodynamic White Ceramic) ── */}
      <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.15, 6.0, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      {/* Middle Livery Color Band with Team Accents */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[0.91, 1.05, 2.2, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Team Name Badge Plaque on Fuselage */}
      <group position={[0, 4.2, 0.98]}>
        <mesh>
          <boxGeometry args={[1.5, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.4, 0.5, 0.04]} />
          <meshStandardMaterial
            color={primaryDark}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ── 2. AERODYNAMIC NOSE CONE ── */}
      <mesh position={[0, 7.8, 0]} castShadow>
        <coneGeometry args={[0.9, 2.4, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.2}
          metalness={0.2}
        />
      </mesh>

      {/* Nose Cone Tip (Titanium Probe) */}
      <mesh position={[0, 9.1, 0]}>
        <cylinderGeometry args={[0.04, 0.08, 0.8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── 3. COCKPIT / AVIONICS CANOPY (Stage 1 Activated) ── */}
      <group position={[0, 6.4, 0.65]} rotation={[-0.35, 0, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.35, 0.9, 8, 16]} />
          <meshStandardMaterial
            color={state.stage1StructureDone ? '#38bdf8' : '#0f172a'}
            emissive={state.stage1StructureDone ? '#0284c7' : '#000000'}
            emissiveIntensity={state.cockpitGlowIntensity * 1.5}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>

      {/* ── 4. CANARD FOREPLANES (Upper Aerodynamic Stabilizers) ── */}
      <group position={[0, 6.6, 0]}>
        {/* Left Canard */}
        <mesh position={[-0.9, 0, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.8, 0.06, 0.4]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </mesh>
        {/* Right Canard */}
        <mesh position={[0.9, 0, 0]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[0.8, 0.06, 0.4]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 5. MAIN SWEPT DELTA WINGS (With Wingtip Strobe Lights) ── */}
      <group position={[0, 2.2, 0]}>
        {/* Left Main Delta Wing */}
        <mesh position={[-1.7, 0, 0]} rotation={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[1.8, 0.12, 1.6]} />
          <meshStandardMaterial color={primaryColor} roughness={0.3} />
        </mesh>
        {/* Left Winglet */}
        <mesh position={[-2.55, 0.35, 0]} castShadow>
          <boxGeometry args={[0.08, 0.7, 0.9]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </mesh>
        {/* Left Wing Navigation Strobe (Red Port Light) */}
        <mesh position={[-2.6, 0.72, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={2.0}
          />
        </mesh>

        {/* Right Main Delta Wing */}
        <mesh position={[1.7, 0, 0]} rotation={[0, 0, -0.08]} castShadow>
          <boxGeometry args={[1.8, 0.12, 1.6]} />
          <meshStandardMaterial color={primaryColor} roughness={0.3} />
        </mesh>
        {/* Right Winglet */}
        <mesh position={[2.55, 0.35, 0]} castShadow>
          <boxGeometry args={[0.08, 0.7, 0.9]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </mesh>
        {/* Right Wing Navigation Strobe (Green Starboard Light) */}
        <mesh position={[2.6, 0.72, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={2.0}
          />
        </mesh>

        {/* Dorsal Vertical Stabilizer Fin */}
        <mesh position={[0, 0.9, -1.1]} rotation={[-0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 1.6, 1.2]} />
          <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 6. DUAL SOLID ROCKET BOOSTERS (SRBs) ── */}
      {/* Left SRB */}
      <group position={[-1.35, 3.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.38, 0.38, 5.2, 24]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.2} roughness={0.3} />
        </mesh>
        {/* SRB Nose Cone */}
        <mesh position={[0, 2.9, 0]} castShadow>
          <coneGeometry args={[0.38, 0.9, 24]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </mesh>
        {/* SRB Nozzle */}
        <mesh position={[0, -2.8, 0]}>
          <cylinderGeometry args={[0.25, 0.38, 0.5, 20]} />
          <meshStandardMaterial color={darkMetal} metalness={0.8} />
        </mesh>
      </group>

      {/* Right SRB */}
      <group position={[1.35, 3.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.38, 0.38, 5.2, 24]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.2} roughness={0.3} />
        </mesh>
        {/* SRB Nose Cone */}
        <mesh position={[0, 2.9, 0]} castShadow>
          <coneGeometry args={[0.38, 0.9, 24]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </mesh>
        {/* SRB Nozzle */}
        <mesh position={[0, -2.8, 0]}>
          <cylinderGeometry args={[0.25, 0.38, 0.5, 20]} />
          <meshStandardMaterial color={darkMetal} metalness={0.8} />
        </mesh>
      </group>

      {/* ── 7. PRIMARY ENGINE SECTION & TRIPLE NOZZLES (Stage 3) ── */}
      <group ref={engineClusterRef} position={[0, 0.7, 0]}>
        {/* Center Main Engine Bell Nozzle */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.55, 0.9, 24]} />
          <meshStandardMaterial
            color={engineMetal}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
        {/* Left Auxiliary Bell Nozzle */}
        <mesh position={[-0.45, -0.3, -0.25]} castShadow>
          <cylinderGeometry args={[0.2, 0.38, 0.7, 20]} />
          <meshStandardMaterial color={engineMetal} metalness={0.85} />
        </mesh>
        {/* Right Auxiliary Bell Nozzle */}
        <mesh position={[0.45, -0.3, -0.25]} castShadow>
          <cylinderGeometry args={[0.2, 0.38, 0.7, 20]} />
          <meshStandardMaterial color={engineMetal} metalness={0.85} />
        </mesh>

        {/* Engine Glow & Heat Ignition Shield */}
        {state.stage3EngineDone && (
          <pointLight
            position={[0, -0.8, 0]}
            color="#f97316"
            intensity={state.engineGlowIntensity * 3.5}
            distance={5}
          />
        )}
      </group>

      {/* ── 8. HYDRAULIC LANDING LEGS & CLAMPS (Stage 1) ── */}
      <group position={[0, 0.8, 0]}>
        {[
          { pos: [-1.1, -0.4, 1.0], rot: [0.3, 0.4, -0.3] },
          { pos: [1.1, -0.4, 1.0], rot: [0.3, -0.4, 0.3] },
          { pos: [-1.1, -0.4, -1.0], rot: [-0.3, -0.4, -0.3] },
          { pos: [1.1, -0.4, -1.0], rot: [-0.3, 0.4, 0.3] },
        ].map((leg, i) => (
          <group key={i} position={leg.pos as [number, number, number]} rotation={leg.rot as [number, number, number]}>
            {/* Hydraulic Strut */}
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.4, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} />
            </mesh>
            {/* Hexagonal Footpad */}
            <mesh position={[0, -0.7, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.08, 6]} />
              <meshStandardMaterial color={darkMetal} metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 9. STAGE 2: CRYOGENIC FUEL LEVEL INDICATOR ── */}
      {state.stage2FuelDone && (
        <group position={[0.95, 4.2, 0]}>
          {/* Vertical Glass Sight Gauge */}
          <mesh>
            <boxGeometry args={[0.1, 2.0, 0.1]} />
            <meshStandardMaterial color="#0284c7" transparent opacity={0.6} />
          </mesh>
          {/* Rising Liquid Column */}
          <mesh position={[0, (state.fuelTankPercent / 100 - 1) * 0.9, 0]}>
            <boxGeometry args={[0.08, (state.fuelTankPercent / 100) * 1.8, 0.08]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      )}

      {/* ── 10. STAGE 4: HIGH-GAIN GUIDANCE ANTENNA ── */}
      <group ref={antennaRef} position={[0, 8.4, 0.4]}>
        {state.stage4NavDone && (
          <>
            <mesh rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.05, 0.1, 16]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.2, 0.1]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </>
        )}
      </group>

      {/* ── 11. PHYSICAL ANIMATED 3D WAVING TEAM FLAG ── */}
      <group position={[isBlue ? -2.2 : 2.2, 3.8, -0.5]}>
        {/* Steel Flagpole */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 2.6, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 2.15, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>

        {/* 3D Segmented Cloth Flag with Wave Shader */}
        <mesh
          ref={flagMeshRef}
          position={[isBlue ? 0.6 : -0.6, 1.6, 0]}
          scale={[isHeroWinner ? 1.6 : 1.0, isHeroWinner ? 1.6 : 1.0, 1.0]}
          castShadow
        >
          <planeGeometry args={[1.1, 0.7, 12, 8]} />
          <meshStandardMaterial
            color={primaryColor}
            side={THREE.DoubleSide}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* ── 12. VOLUMETRIC EXHAUST FLAME & IGNITION PLUME (Liftoff) ── */}
      {state.exhaustFlameScale > 0 && (
        <group position={[0, -0.4, 0]}>
          {/* Intense Inner Core Flame */}
          <mesh ref={flameMeshRef}>
            <coneGeometry args={[0.7, 3.5, 24]} />
            <meshBasicMaterial color="#ffedd5" />
          </mesh>

          {/* Outer Fiery Corona */}
          <mesh scale={[1.4, 1.2, 1.4]} position={[0, -0.4, 0]}>
            <coneGeometry args={[0.9, 4.2, 20]} />
            <meshStandardMaterial
              color="#ea580c"
              emissive="#f97316"
              emissiveIntensity={3.0}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Dynamic Ground Launch Glow */}
          <pointLight
            position={[0, -1.5, 0]}
            color="#fb923c"
            intensity={state.exhaustFlameScale * 6.0}
            distance={20}
          />
        </group>
      )}
    </group>
  );
};
