// ============================================================
// EQUATION MISSION CONTROL — Genuine 3D Spacecraft Model
// Detailed Multi-Stage Heavy Aerospace Rocket:
// - Aerodynamic Fuselage with White Thermal Tiles & Team Striping
// - Front Cockpit Canopy with Pilot, HUD Instruments & Interior Glow
// - High-Lift Delta Wings with Winglet Strobes & Elevons
// - Main Propulsion Module: 3 Rocket Engine Bell Nozzles with Combustion Glow
// - Dual Solid Rocket Boosters (SRBs) on Left & Right Sides
// - Dynamic Volumetric Thrust Plume & Billowing Smoke Particles on Ignition
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMissionControlStore } from '../store/missionControlStore';

export const Spacecraft3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const flameGroupRef = useRef<THREE.Group>(null);
  const smokePuffsRef = useRef<THREE.Mesh[]>([]);
  const cockpitLightRef = useRef<THREE.PointLight>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);
  const strobeLightRef = useRef<THREE.PointLight>(null);

  const spacecraftState = useMissionControlStore((s) => s.spacecraft);
  const winner = useMissionControlStore((s) => s.winnerTeam);
  const currentStage = useMissionControlStore((s) => s.currentStageIndex);

  // Colors
  const primaryWhite = '#f8fafc';
  const heatShieldBlack = '#0f172a';
  const aerospaceOrange = '#f97316';
  const teamAccent = winner === 'blue' ? '#2563eb' : winner === 'red' ? '#dc2626' : '#0284c7';
  const chromeMetal = '#cbd5e1';
  const goldFoil = '#fbbf24';

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const alt = spacecraftState.altitude;
    const isLaunching = spacecraftState.launchStage !== 'idle' && spacecraftState.launchStage !== 'arming';

    // Vertical liftoff position
    groupRef.current.position.y = 2.2 + alt;

    // Slight aerodynamic pitch during ascent
    if (alt > 15) {
      const targetPitch = Math.min(0.25, (alt - 15) * 0.003);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, -targetPitch, 2.0, delta);
    } else {
      // Stage 4 Gimbal alignment test
      const gimbal = spacecraftState.gimbalPitchAngle || 0;
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, Math.sin(Date.now() * 0.002) * (gimbal * 0.15), 3.0, delta);
    }

    // Cockpit avionics glow
    if (cockpitLightRef.current) {
      const active = spacecraftState.avionicsPower || currentStage >= 1;
      cockpitLightRef.current.intensity = active ? 1.5 + Math.sin(Date.now() * 0.005) * 0.3 : 0;
    }

    // Engine ignition light & flame scale
    if (engineLightRef.current) {
      const igniting = isLaunching && spacecraftState.launchStage !== 'hazard-lights';
      engineLightRef.current.intensity = igniting ? 8.0 + Math.random() * 3.0 : (spacecraftState.enginePowerGrid ? 0.8 : 0);
    }

    // Wingtip strobe flash
    if (strobeLightRef.current) {
      const flash = Math.floor(Date.now() / 600) % 2 === 0;
      strobeLightRef.current.intensity = flash ? 2.5 : 0.1;
    }

    // Volumetric flame animation
    if (flameGroupRef.current) {
      const showFlame = isLaunching && alt > 0;
      flameGroupRef.current.visible = showFlame;
      if (showFlame) {
        const flicker = 1.0 + (Math.random() - 0.5) * 0.2;
        const scale = spacecraftState.exhaustFlameScale * flicker;
        flameGroupRef.current.scale.set(scale, scale * (1.2 + Math.random() * 0.3), scale);
      }
    }

    // Billowing smoke puff particles
    smokePuffsRef.current.forEach((puff, i) => {
      if (puff) {
        const isSmoking = (isLaunching && alt < 90) || (spacecraftState.ventingVapor && !isLaunching);
        puff.visible = isSmoking;
        if (isSmoking) {
          const t = (Date.now() * 0.0025 + i * 0.25) % 1.5;
          puff.position.y = -2.2 - t * 6.5;
          puff.position.x = Math.sin(Date.now() * 0.004 + i) * (0.8 + t * 2.2);
          puff.position.z = Math.cos(Date.now() * 0.004 + i) * (0.8 + t * 2.2);

          const s = 0.4 + t * 1.8;
          puff.scale.set(s, s, s);

          const mat = puff.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.opacity = Math.max(0, 0.75 - (t / 1.5) * 0.75);
          }
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 2.2, 0]}>
      {/* ── 1. MAIN CYLINDRICAL FUSELAGE ── */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 0.96, 5.2, 32]} />
        <meshStandardMaterial color={primaryWhite} roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Team Accent Striping on Fuselage */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[0.93, 0.93, 0.4, 32]} />
        <meshStandardMaterial color={teamAccent} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.15, 32]} />
        <meshStandardMaterial color={aerospaceOrange} roughness={0.3} metalness={0.3} />
      </mesh>
      <mesh position={[0, 4.6, 0]}>
        <cylinderGeometry args={[0.91, 0.91, 0.15, 32]} />
        <meshStandardMaterial color={aerospaceOrange} roughness={0.3} metalness={0.3} />
      </mesh>

      {/* ── 2. AERODYNAMIC NOSE CONE ── */}
      <group position={[0, 5.8, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.92, 2.2, 32]} />
          <meshStandardMaterial color={primaryWhite} roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Heat Shield Nose Cap */}
        <mesh position={[0, 0.95, 0]}>
          <coneGeometry args={[0.3, 0.4, 24]} />
          <meshStandardMaterial color={heatShieldBlack} roughness={0.5} />
        </mesh>
      </group>

      {/* ── 3. COCKPIT CANOPY WITH TINTED GLASS & PILOT ── */}
      <group position={[0, 4.2, 0.72]}>
        {/* Tinted Canopy Window */}
        <mesh rotation={[Math.PI / 8, 0, 0]}>
          <boxGeometry args={[0.62, 0.95, 0.42]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Cockpit Canopy Frame */}
        <mesh position={[0, 0, -0.04]} rotation={[Math.PI / 8, 0, 0]}>
          <boxGeometry args={[0.68, 1.02, 0.38]} />
          <meshStandardMaterial color={heatShieldBlack} roughness={0.6} />
        </mesh>
        {/* Interior Cockpit Pilot Figure */}
        <group position={[0, -0.1, -0.1]} scale={[0.65, 0.65, 0.65]}>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.3, 0.08]}>
            <boxGeometry args={[0.18, 0.1, 0.08]} />
            <meshStandardMaterial color={goldFoil} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.32, 0.38, 0.18]} />
            <meshStandardMaterial color={teamAccent} roughness={0.4} />
          </mesh>
        </group>
        {/* Cockpit Light Source */}
        <pointLight
          ref={cockpitLightRef}
          position={[0, 0, 0.2]}
          color="#38bdf8"
          distance={4}
          intensity={0}
        />
      </group>

      {/* ── 4. DELTA WINGS & WINGLET FINS ── */}
      {/* Left Delta Wing */}
      <group position={[-1.7, 1.8, 0]} rotation={[0, 0, -Math.PI / 16]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 2.2]} />
          <meshStandardMaterial color={primaryWhite} roughness={0.3} />
        </mesh>
        {/* Wing Leading Edge Heat Shield */}
        <mesh position={[0, 0, 1.08]}>
          <boxGeometry args={[1.82, 0.09, 0.12]} />
          <meshStandardMaterial color={heatShieldBlack} roughness={0.6} />
        </mesh>
        {/* Vertical Winglet Stabilizer */}
        <mesh position={[-0.85, 0.45, -0.2]}>
          <boxGeometry args={[0.08, 0.95, 1.1]} />
          <meshStandardMaterial color={teamAccent} roughness={0.3} />
        </mesh>
      </group>

      {/* Right Delta Wing */}
      <group position={[1.7, 1.8, 0]} rotation={[0, 0, Math.PI / 16]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 2.2]} />
          <meshStandardMaterial color={primaryWhite} roughness={0.3} />
        </mesh>
        {/* Wing Leading Edge Heat Shield */}
        <mesh position={[0, 0, 1.08]}>
          <boxGeometry args={[1.82, 0.09, 0.12]} />
          <meshStandardMaterial color={heatShieldBlack} roughness={0.6} />
        </mesh>
        {/* Vertical Winglet Stabilizer */}
        <mesh position={[0.85, 0.45, -0.2]}>
          <boxGeometry args={[0.08, 0.95, 1.1]} />
          <meshStandardMaterial color={teamAccent} roughness={0.3} />
        </mesh>
      </group>

      {/* Wingtip Navigation Strobes */}
      <pointLight
        ref={strobeLightRef}
        position={[-2.6, 2.2, -0.2]}
        color="#ef4444"
        distance={6}
        intensity={0.5}
      />

      {/* ── 5. DUAL SOLID ROCKET BOOSTERS (SRBs) ── */}
      {/* Left SRB */}
      <group position={[-1.25, 2.8, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.38, 0.38, 5.6, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <coneGeometry args={[0.38, 0.7, 24]} />
          <meshStandardMaterial color={aerospaceOrange} roughness={0.3} />
        </mesh>
        {/* SRB Engine Nozzle */}
        <mesh position={[0, -2.95, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.18, 0.45, 20]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Right SRB */}
      <group position={[1.25, 2.8, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.38, 0.38, 5.6, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <coneGeometry args={[0.38, 0.7, 24]} />
          <meshStandardMaterial color={aerospaceOrange} roughness={0.3} />
        </mesh>
        {/* SRB Engine Nozzle */}
        <mesh position={[0, -2.95, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.18, 0.45, 20]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 6. MAIN ENGINE PROPULSION BAY & 3 BELL NOZZLES ── */}
      <group position={[0, 0.3, 0]}>
        {/* Engine Base Heat Shield Shielding */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.96, 0.98, 0.45, 32]} />
          <meshStandardMaterial color={heatShieldBlack} roughness={0.7} />
        </mesh>

        {/* 3 Main Bell Nozzles */}
        {([
          [0, 0, 0.4],
          [-0.45, 0, -0.3],
          [0.45, 0, -0.3],
        ] as [number, number, number][]).map((pos, i) => (
          <group key={`engine-nozzle-${i}`} position={pos}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[0.34, 0.18, 0.65, 24]} />
              <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Interior combustion glow ring */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
              <meshStandardMaterial
                color="#f97316"
                emissive="#f97316"
                emissiveIntensity={spacecraftState.enginePowerGrid ? 2.5 : 0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Engine Light */}
        <pointLight
          ref={engineLightRef}
          position={[0, -0.5, 0]}
          color="#f97316"
          distance={12}
          intensity={0}
        />
      </group>

      {/* ── 7. VOLUMETRIC EXHAUST FLAME PLUME (ON LAUNCH) ── */}
      <group ref={flameGroupRef} position={[0, -0.4, 0]} visible={false}>
        {/* Inner Core Bright White/Cyan Flame */}
        <mesh position={[0, -1.2, 0]}>
          <coneGeometry args={[0.45, 2.5, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Mid Yellow/Orange Plume */}
        <mesh position={[0, -1.8, 0]}>
          <coneGeometry args={[0.85, 3.8, 16]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.85} />
        </mesh>
        {/* Outer Crimson/Orange Billowing Flame */}
        <mesh position={[0, -2.4, 0]}>
          <coneGeometry args={[1.3, 5.0, 16]} />
          <meshBasicMaterial color="#ea580c" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* ── 8. BILLOWING SMOKE PARTICLES ── */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={`smoke-${i}`}
          ref={(el) => {
            if (el) smokePuffsRef.current[i] = el;
          }}
          position={[0, -1.5, 0]}
          visible={false}
        >
          <sphereGeometry args={[0.65, 12, 12]} />
          <meshStandardMaterial color="#f8fafc" transparent opacity={0.7} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};
