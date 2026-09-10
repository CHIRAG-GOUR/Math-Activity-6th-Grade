// ============================================================
// EQUATION MISSION CONTROL 2.0 — Dual Launch Complex 3D
// High-Fidelity Aerospace Launch Complex featuring:
// - Left Blue Launch Pad (x = -7.0) with 14m Steel Umbilical Tower
// - Right Red Launch Pad (x = +7.0) with 14m Steel Umbilical Tower
// - Motorized Animated Service Arms & Cryogenic Propellant Lines
// - Concrete Blast Deflectors, Flame Trenches & Pad Clamps
// - Liquid Oxygen (LOX) Spherical Tanks with Cryo Boil-off Plumes
// - Central Hub: Rotating Parabolic Radar, Yellow Gantry Crane & Power Station
// - Service Vehicles: Fuel Tanker, Utility Buggy & Mobile Generators
// - Floodlight Towers, Cable Raceways & Safety Markings
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Spacecraft3DState } from '../types';

interface FacilityProps {
  blueState: Spacecraft3DState;
  redState: Spacecraft3DState;
}

// Single Launch Pad & 14m Steel Lattice Umbilical Tower Assembly
const LaunchPadTowerAssembly: React.FC<{
  padPos: [number, number, number];
  team: 'blue' | 'red';
  shipState: Spacecraft3DState;
}> = ({ padPos, team, shipState }) => {
  const serviceArmUpperRef = useRef<THREE.Group>(null);
  const serviceArmLowerRef = useRef<THREE.Group>(null);
  const cryoVaporRef = useRef<THREE.Group>(null);

  const isBlue = team === 'blue';
  const teamColor = isBlue ? '#2563eb' : '#dc2626';
  const teamDarkColor = isBlue ? '#1d4ed8' : '#b91c1c';

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Smooth motorized retraction of upper and lower service arms
    if (serviceArmUpperRef.current && serviceArmLowerRef.current) {
      const targetAngle = isBlue
        ? -shipState.serviceArmsAngle * 1.45
        : shipState.serviceArmsAngle * 1.45;

      serviceArmUpperRef.current.rotation.y = THREE.MathUtils.lerp(
        serviceArmUpperRef.current.rotation.y,
        targetAngle,
        delta * 3.2
      );
      serviceArmLowerRef.current.rotation.y = THREE.MathUtils.lerp(
        serviceArmLowerRef.current.rotation.y,
        targetAngle * 1.1,
        delta * 3.0
      );
    }

    // 2. Cryo vapor plume pulsation during Stage 2 (Fuel loading)
    if (cryoVaporRef.current) {
      if (shipState.stage2FuelDone && shipState.launchStage === 'idle') {
        cryoVaporRef.current.visible = true;
        cryoVaporRef.current.scale.set(
          1 + Math.sin(time * 8) * 0.15,
          1 + Math.cos(time * 6) * 0.2,
          1 + Math.sin(time * 8) * 0.15
        );
      } else {
        cryoVaporRef.current.visible = false;
      }
    }
  });

  return (
    <group position={padPos}>
      {/* ── 1. OCTAGONAL REINFORCED CONCRETE LAUNCH PAD ── */}
      <group position={[0, 0, 0]}>
        {/* Main Base Foundation */}
        <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[4.2, 4.8, 0.7, 8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.75} metalness={0.15} />
        </mesh>

        {/* Painted Team Perimeter Hex Ring */}
        <mesh position={[0, 0.71, 0]}>
          <cylinderGeometry args={[4.0, 4.0, 0.04, 8]} />
          <meshStandardMaterial color={teamColor} roughness={0.4} />
        </mesh>

        {/* Concrete Pad Surface Ring */}
        <mesh position={[0, 0.73, 0]} receiveShadow>
          <cylinderGeometry args={[3.8, 3.8, 0.04, 8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>

        {/* Steel Flame Exhaust Trench Hole */}
        <mesh position={[0, 0.74, 0]}>
          <ringGeometry args={[1.3, 2.0, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* 4 Heavy Steel Hold-Down Clamps */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <group
            key={i}
            position={[Math.cos(angle) * 1.5, 0.75, Math.sin(angle) * 1.5]}
            rotation={[0, -angle, 0]}
          >
            <mesh castShadow>
              <boxGeometry args={[0.35, 0.4, 0.5]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.25, -0.1]}>
              <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Yellow/Black Pad Safety Line Squares */}
        {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map(
          (angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 3.2, 0.76, Math.sin(angle) * 3.2]}
              rotation={[-Math.PI / 2, 0, angle]}
            >
              <planeGeometry args={[0.6, 0.35]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#f59e0b' : '#0f172a'} />
            </mesh>
          )
        )}
      </group>

      {/* ── 2. SUBSTANTIAL 14M STEEL LATTICE UMBILICAL TOWER ── */}
      <group position={[isBlue ? -3.5 : 3.5, 0, 0]}>
        {/* Reinforced Concrete Tower Footing */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.8, 1.8]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>

        {/* 4 Main Steel Tubular Columns */}
        {[-0.6, 0.6].map((x) =>
          [-0.6, 0.6].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 7.5, z]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, 13.5, 12]} />
              <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.35} />
            </mesh>
          ))
        )}

        {/* Steel Gantry Platform Levels (5 Decks with Safety Grate) */}
        {[2.8, 5.4, 8.0, 10.6, 13.2].map((y, idx) => (
          <group key={y} position={[0, y, 0]}>
            {/* Deck Floor */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.12, 1.5]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.3} />
            </mesh>
            {/* Perimeter Yellow Safety Handrails */}
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[1.55, 0.8, 1.55]} />
              <meshStandardMaterial color="#f59e0b" wireframe />
            </mesh>
            {/* Cross-bracing trusses between levels */}
            <mesh position={[0, -1.2, 0]}>
              <boxGeometry args={[1.2, 0.08, 1.2]} />
              <meshStandardMaterial color="#dc2626" metalness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Vertical Access Ladder along back of tower */}
        <group position={[0, 7.5, isBlue ? -0.7 : 0.7]}>
          <mesh>
            <boxGeometry args={[0.4, 13.0, 0.05]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        </group>

        {/* Top Crane Gantry & Lightning Mast */}
        <mesh position={[0, 14.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.08, 2.4, 8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} />
        </mesh>

        {/* Flashing Red Aviation Beacon at Mast Apex */}
        <mesh position={[0, 16.0, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={3.5}
          />
        </mesh>

        {/* ── 3. MOTORIZED GANTRY SERVICE ARMS ── */}
        {/* Upper Crew & Avionics Walkway Arm (Level 8.0m) */}
        <group ref={serviceArmUpperRef} position={[0, 8.0, 0]}>
          <group position={[isBlue ? 1.8 : -1.8, 0, 0]}>
            {/* Steel Walkway Arm Truss */}
            <mesh castShadow>
              <boxGeometry args={[3.2, 0.35, 0.6]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            {/* Yellow Safety Handrail on Walkway */}
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[3.0, 0.7, 0.62]} />
              <meshStandardMaterial color="#f59e0b" wireframe />
            </mesh>
            {/* Rubber Interface Mating Seal Collar */}
            <mesh position={[isBlue ? 1.6 : -1.6, 0, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        </group>

        {/* Lower Cryogenic Fuel Umbilical Arm (Level 5.4m) */}
        <group ref={serviceArmLowerRef} position={[0, 5.4, 0]}>
          <group position={[isBlue ? 1.6 : -1.6, 0, 0]}>
            {/* Arm Boom */}
            <mesh castShadow>
              <boxGeometry args={[2.8, 0.28, 0.45]} />
              <meshStandardMaterial color="#64748b" roughness={0.4} />
            </mesh>
            {/* Cryogenic Flexible Insulated LOX Pipe */}
            <mesh position={[0, -0.25, 0]} rotation={[0, 0, 1.57]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 2.6, 16]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.25} />
            </mesh>
            {/* Quick-Disconnect Fuel Coupling Valve */}
            <mesh position={[isBlue ? 1.4 : -1.4, -0.25, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.9} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 4. CRYOGENIC LIQUID OXYGEN (LOX) STORAGE TANK ── */}
      <group position={[isBlue ? -5.8 : 5.8, 0, -3.2]}>
        {/* Reinforced Concrete Foundation Cradle */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.9, 2.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>
        {/* Spherical Cryo Storage Vessel */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.3} />
        </mesh>
        {/* Team Color Stencil on Tank */}
        <mesh position={[0, 2.1, 1.51]}>
          <planeGeometry args={[1.2, 0.5]} />
          <meshStandardMaterial color={teamDarkColor} roughness={0.3} />
        </mesh>
        {/* Pressure Relief Vent Valve */}
        <mesh position={[0, 3.7, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.6, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
        {/* Cryo Boil-off Frost Vapor Plume */}
        <group ref={cryoVaporRef} position={[0, 4.1, 0]}>
          <mesh>
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={1} />
          </mesh>
        </group>
        {/* Insulated Steel Cryo Pipeline feeding the pad */}
        <mesh
          position={[isBlue ? 2.2 : -2.2, 0.6, 1.8]}
          rotation={[0, isBlue ? 0.65 : -0.65, 1.57]}
          castShadow
        >
          <cylinderGeometry args={[0.09, 0.09, 4.0, 16]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ── 5. PAD FLOODLIGHT MAST ── */}
      <group position={[isBlue ? 4.5 : -4.5, 0, 4.0]}>
        <mesh position={[0, 3.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 6.4, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
        {/* Light Fixture Bank */}
        <mesh position={[0, 6.4, 0]}>
          <boxGeometry args={[1.0, 0.4, 0.3]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Bright Lamp Glow */}
        <mesh position={[0, 6.35, 0.15]}>
          <planeGeometry args={[0.9, 0.3]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* ── 6. SAFETY BARRIERS & HEAVY TOOL CARTS ── */}
      <group position={[0, 0, 4.2]}>
        {/* Heavy Duty Stanchions & Warning Barriers */}
        {[-2.2, 2.2].map((x, idx) => (
          <group key={idx} position={[x, 0.5, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.0, 0.8, 0.12]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.07]}>
              <boxGeometry args={[1.8, 0.5, 0.01]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>
        ))}

        {/* Mobile Red Diagnostic Tool Chest */}
        <mesh position={[isBlue ? -1.2 : 1.2, 0.4, 0.6]} castShadow>
          <boxGeometry args={[0.8, 0.6, 0.6]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

export const LaunchFacility3D: React.FC<FacilityProps> = ({
  blueState,
  redState,
}) => {
  const radarRef = useRef<THREE.Group>(null);
  const craneArmRef = useRef<THREE.Group>(null);
  const hookRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // 1. Continuous smooth rotation of master tracking radar array
    if (radarRef.current) {
      radarRef.current.rotation.y = time * 0.35;
    }
    // 2. Gentle sway of heavy yellow gantry crane boom & hook
    if (craneArmRef.current) {
      craneArmRef.current.rotation.y = Math.sin(time * 0.18) * 0.12;
    }
    if (hookRef.current) {
      hookRef.current.position.y = -3.2 + Math.sin(time * 0.4) * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. MAIN TARMAC LAUNCH APRON ── */}
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[44, 28]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Painted Yellow Center Corridor Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 26]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} />
      </mesh>

      {/* Painted White Crosswalk Markings in Center Operations Hub */}
      {[-5, -3, -1, 1, 3, 5].map((z) => (
        <mesh key={z} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 0.45]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}

      {/* ── 2. BLUE TEAM LAUNCH COMPLEX (Left: x = -7.0) ── */}
      <LaunchPadTowerAssembly
        padPos={[-7.0, 0, 0]}
        team="blue"
        shipState={blueState}
      />

      {/* ── 3. RED TEAM LAUNCH COMPLEX (Right: x = +7.0) ── */}
      <LaunchPadTowerAssembly
        padPos={[7.0, 0, 0]}
        team="red"
        shipState={redState}
      />

      {/* ── 4. CENTRAL OPERATIONS HUB (Center: x = 0) ── */}
      <group position={[0, 0, -4.8]}>
        {/* Master Tracking Radar Dish Array */}
        <group ref={radarRef} position={[0, 3.6, 0]}>
          {/* Heavy Steel Support Pylon */}
          <mesh position={[0, -1.4, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.3, 2.8, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          {/* Parabolic Dish Antenna */}
          <mesh rotation={[0.45, 0, 0]} castShadow>
            <sphereGeometry args={[1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.25}
              metalness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Center Feed Horn & Reflector */}
          <mesh position={[0, 0.6, 0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
        </group>

        {/* High-Voltage Power Transformer Substation */}
        <group position={[0, 0.7, 1.8]}>
          {[-1.4, 0, 1.4].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1.1, 1.4, 0.9]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
              {/* Ceramic High-Voltage Bushings */}
              <mesh position={[0, 0.85, 0]}>
                <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
                <meshStandardMaterial color="#78350f" roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Heavy Yellow Service Gantry Crane spanning in Background */}
        <group ref={craneArmRef} position={[0, 0, -2.5]}>
          {/* Left Main Pylon Column */}
          <mesh position={[-3.8, 5.2, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.28, 10.4, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Right Main Pylon Column */}
          <mesh position={[3.8, 5.2, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.28, 10.4, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Top Horizontal Gantry Crane Truss */}
          <mesh position={[0, 10.2, 0]} castShadow>
            <boxGeometry args={[8.6, 0.7, 0.9]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
          {/* Trolley Unit */}
          <mesh position={[0.6, 9.8, 0]} castShadow>
            <boxGeometry args={[1.0, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Suspended Steel Hoist Cable & Hook */}
          <group ref={hookRef} position={[0.6, 6.5, 0]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 6.0, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh position={[0, -3.0, 0]} castShadow>
              <boxGeometry args={[0.35, 0.4, 0.35]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 5. SERVICE VEHICLES ON ACCESS ROADS ── */}
      {/* Heavy Cryogenic Fuel Tanker Truck (Parked on Left Access Road) */}
      <group position={[-14.5, 0.6, -1.0]} rotation={[0, 0.3, 0]}>
        {/* Truck Cab */}
        <mesh position={[0, 0.6, 1.6]} castShadow>
          <boxGeometry args={[1.6, 1.2, 1.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Cab Windshield */}
        <mesh position={[0, 0.8, 2.52]}>
          <planeGeometry args={[1.4, 0.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Cylindrical Fuel Tanker Trailer */}
        <mesh position={[0, 0.8, -1.2]} rotation={[1.57, 0, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.9, 3.8, 24]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Tanker Chassis */}
        <mesh position={[0, 0.1, -0.2]} castShadow>
          <boxGeometry args={[1.5, 0.3, 5.2]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Wheels */}
        {[-0.85, 0.85].map((x) =>
          [-2.2, -1.2, 1.4, 2.2].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.15, z]} rotation={[0, 0, 1.57]} castShadow>
              <cylinderGeometry args={[0.38, 0.38, 0.22, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* Electric Utility Buggy (Right Access Road) */}
      <group position={[14.2, 0.4, 2.5]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.4, 0.45, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.7]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* 4 Buggy Wheels */}
        {[-0.55, 0.55].map((x) =>
          [-0.45, 0.45].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.15, z]} rotation={[1.57, 0, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.14, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
};
