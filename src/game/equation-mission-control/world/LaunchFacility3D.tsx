// ============================================================
// EQUATION MISSION CONTROL 2.0 — Dual Launch Complex 3D
// Solid, Non-Flickering Industrial Aerospace Launch Campus:
// - Left Blue Launch Pad (x = -7.0) with 15m Steel Umbilical Tower
// - Right Red Launch Pad (x = +7.0) with 15m Steel Umbilical Tower
// - Motorized Animated Service Arms & Cryogenic Propellant Lines
// - Reinforced Concrete Blast Deflectors, Flame Trenches & Pad Clamps
// - Liquid Oxygen (LOX) Spherical Tanks with Cryo Boil-off Plumes
// - Central Hub: Rotating Parabolic Radar, Yellow Gantry Crane & Power Station
// - Service Vehicles: Heavy Fuel Tanker, Utility Buggies & Mobile Tool Chests
// - Floodlight Towers, Concrete Access Ramps & Safety Markings
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Spacecraft3DState } from '../types';

interface FacilityProps {
  blueState: Spacecraft3DState;
  redState: Spacecraft3DState;
}

// Single Launch Pad & 15m Steel Lattice Umbilical Tower Assembly
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

    // 1. Motorized retraction of service arms
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
        {/* Concrete Foundation Base (Y = 0.4) */}
        <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[4.4, 4.9, 0.6, 8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.75} metalness={0.15} />
        </mesh>

        {/* Concrete Pad Deck (Y = 0.75) */}
        <mesh position={[0, 0.75, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[4.2, 4.2, 0.12, 8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>

        {/* Painted Team Perimeter Hex Ring (Y = 0.82) */}
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[4.0, 4.0, 0.04, 8]} />
          <meshStandardMaterial color={teamColor} roughness={0.4} />
        </mesh>

        {/* Steel Flame Exhaust Trench Hole (Y = 0.85) */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[1.6, 1.6, 0.04, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* 4 Heavy Steel Hold-Down Clamps (Y = 0.88) */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <group
            key={i}
            position={[Math.cos(angle) * 1.6, 0.88, Math.sin(angle) * 1.6]}
            rotation={[0, -angle, 0]}
          >
            <mesh castShadow>
              <boxGeometry args={[0.36, 0.45, 0.5]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.28, -0.1]}>
              <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Yellow/Black Hazard Border Stripes around Pad Deck (Y = 0.85) */}
        {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map(
          (angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 3.3, 0.85, Math.sin(angle) * 3.3]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[0.65, 0.02, 0.35]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#f59e0b' : '#0f172a'} />
            </mesh>
          )
        )}
      </group>

      {/* ── 2. SUBSTANTIAL 15M STEEL LATTICE UMBILICAL TOWER ── */}
      <group position={[isBlue ? -3.6 : 3.6, 0, 0]}>
        {/* Reinforced Concrete Tower Footing (Y = 0.9) */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 1.8, 1.9]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>

        {/* 4 Main Steel Tubular Columns */}
        {[-0.65, 0.65].map((x) =>
          [-0.65, 0.65].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 8.2, z]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, 14.6, 12]} />
              <meshStandardMaterial color="#dc2626" metalness={0.65} roughness={0.35} />
            </mesh>
          ))
        )}

        {/* Steel Gantry Platform Levels (5 Decks with Safety Handrails) */}
        {[3.0, 5.8, 8.6, 11.4, 14.2].map((y, idx) => (
          <group key={y} position={[0, y, 0]}>
            {/* Deck Floor */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.12, 1.6]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.3} />
            </mesh>
            {/* Perimeter Yellow Safety Handrails */}
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[1.65, 0.8, 1.65]} />
              <meshStandardMaterial color="#f59e0b" wireframe />
            </mesh>
            {/* Cross-bracing trusses between levels */}
            <mesh position={[0, -1.3, 0]}>
              <boxGeometry args={[1.3, 0.08, 1.3]} />
              <meshStandardMaterial color="#dc2626" metalness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Vertical Access Ladder along back of tower */}
        <group position={[0, 8.2, isBlue ? -0.75 : 0.75]}>
          <mesh>
            <boxGeometry args={[0.45, 14.0, 0.06]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        </group>

        {/* Top Crane Gantry & Lightning Mast */}
        <mesh position={[0, 16.0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.09, 2.6, 8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} />
        </mesh>

        {/* Flashing Red Aviation Beacon at Mast Apex */}
        <mesh position={[0, 17.4, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={3.5}
          />
        </mesh>

        {/* ── 3. MOTORIZED GANTRY SERVICE ARMS ── */}
        {/* Upper Crew & Avionics Walkway Arm (Level 8.6m) */}
        <group ref={serviceArmUpperRef} position={[0, 8.6, 0]}>
          <group position={[isBlue ? 1.9 : -1.9, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[3.4, 0.35, 0.65]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[3.2, 0.7, 0.68]} />
              <meshStandardMaterial color="#f59e0b" wireframe />
            </mesh>
            {/* Rubber Mating Seal Collar */}
            <mesh position={[isBlue ? 1.7 : -1.7, 0, 0]}>
              <cylinderGeometry args={[0.38, 0.38, 0.45, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        </group>

        {/* Lower Cryogenic Fuel Umbilical Arm (Level 5.8m) */}
        <group ref={serviceArmLowerRef} position={[0, 5.8, 0]}>
          <group position={[isBlue ? 1.7 : -1.7, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[3.0, 0.3, 0.45]} />
              <meshStandardMaterial color="#64748b" roughness={0.4} />
            </mesh>
            {/* Cryogenic Flexible Insulated LOX Pipe */}
            <mesh position={[0, -0.25, 0]} rotation={[0, 0, 1.57]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 2.8, 16]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.75} roughness={0.25} />
            </mesh>
            {/* Quick-Disconnect Fuel Coupling Valve */}
            <mesh position={[isBlue ? 1.5 : -1.5, -0.25, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.35, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.9} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 4. CRYOGENIC LIQUID OXYGEN (LOX) STORAGE VESSEL ── */}
      <group position={[isBlue ? -6.0 : 6.0, 0, -3.4]}>
        {/* Concrete Saddle Foundation (Y = 0.5) */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.0, 2.4]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>
        {/* Spherical Cryo Vessel (Y = 2.2) */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.3} />
        </mesh>
        {/* Team Color Stripe on Tank */}
        <mesh position={[0, 2.2, 1.55]}>
          <boxGeometry args={[1.4, 0.6, 0.1]} />
          <meshStandardMaterial color={teamDarkColor} roughness={0.3} />
        </mesh>
        {/* Pressure Relief Vent Valve */}
        <mesh position={[0, 3.9, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.6, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
        {/* Cryo Boil-off Frost Vapor Plume */}
        <group ref={cryoVaporRef} position={[0, 4.3, 0]}>
          <mesh>
            <sphereGeometry args={[0.45, 12, 12]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.65} roughness={1} />
          </mesh>
        </group>
        {/* Insulated Steel Cryo Pipeline feeding the pad */}
        <mesh
          position={[isBlue ? 2.4 : -2.4, 0.7, 2.0]}
          rotation={[0, isBlue ? 0.65 : -0.65, 1.57]}
          castShadow
        >
          <cylinderGeometry args={[0.1, 0.1, 4.4, 16]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ── 5. PAD FLOODLIGHT MAST ── */}
      <group position={[isBlue ? 4.8 : -4.8, 0, 4.2]}>
        <mesh position={[0, 3.5, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.13, 7.0, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
        <mesh position={[0, 7.0, 0]}>
          <boxGeometry args={[1.1, 0.45, 0.35]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 6.95, 0.18]}>
          <boxGeometry args={[0.95, 0.32, 0.05]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* ── 6. SAFETY BARRIERS & HEAVY TOOL CHESTS ── */}
      <group position={[0, 0, 4.5]}>
        {[-2.4, 2.4].map((x, idx) => (
          <group key={idx} position={[x, 0.55, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.2, 0.85, 0.14]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.08]}>
              <boxGeometry args={[2.0, 0.55, 0.02]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>
        ))}

        {/* Mobile Diagnostic Tool Chest */}
        <mesh position={[isBlue ? -1.3 : 1.3, 0.45, 0.6]} castShadow>
          <boxGeometry args={[0.9, 0.65, 0.65]} />
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
    // 1. Smooth rotation of master tracking radar dish
    if (radarRef.current) {
      radarRef.current.rotation.y = time * 0.35;
    }
    // 2. Gentle sway of heavy yellow gantry crane boom & hook
    if (craneArmRef.current) {
      craneArmRef.current.rotation.y = Math.sin(time * 0.18) * 0.12;
    }
    if (hookRef.current) {
      hookRef.current.position.y = -3.4 + Math.sin(time * 0.4) * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. MAIN CONCRETE LAUNCH APRON (Solid Box, Y = 0.05) ── */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[46, 0.1, 30]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Asphalt Service Roads (Left & Right, Solid Boxes, Y = 0.08) */}
      <mesh position={[-19, 0.08, 0]} receiveShadow>
        <boxGeometry args={[6.5, 0.08, 30]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[19, 0.08, 0]} receiveShadow>
        <boxGeometry args={[6.5, 0.08, 30]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Painted Yellow Center Corridor Line (Solid Box, Y = 0.12) */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.3, 0.02, 28]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} />
      </mesh>

      {/* Painted White Crosswalk Markings in Center Hub (Solid Boxes, Y = 0.12) */}
      {[-6, -4, -2, 0, 2, 4, 6].map((z) => (
        <mesh key={z} position={[0, 0.12, z]}>
          <boxGeometry args={[3.5, 0.02, 0.5]} />
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
      <group position={[0, 0, -5.2]}>
        {/* Master Tracking Radar Dish Array */}
        <group ref={radarRef} position={[0, 3.8, 0]}>
          <mesh position={[0, -1.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.32, 3.0, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          {/* Parabolic Dish Antenna */}
          <mesh rotation={[0.45, 0, 0]} castShadow>
            <sphereGeometry args={[1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.25}
              metalness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Center Feed Horn */}
          <mesh position={[0, 0.65, 0.55]}>
            <cylinderGeometry args={[0.045, 0.045, 1.0, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
        </group>

        {/* High-Voltage Power Transformer Substation */}
        <group position={[0, 0.75, 2.0]}>
          {[-1.5, 0, 1.5].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1.2, 1.5, 1.0]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.9, 0]}>
                <cylinderGeometry args={[0.09, 0.13, 0.35, 8]} />
                <meshStandardMaterial color="#78350f" roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Heavy Yellow Service Gantry Crane spanning in Background */}
        <group ref={craneArmRef} position={[0, 0, -2.8]}>
          {/* Left Main Pylon Column */}
          <mesh position={[-4.0, 5.5, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.3, 11.0, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Right Main Pylon Column */}
          <mesh position={[4.0, 5.5, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.3, 11.0, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Top Horizontal Gantry Crane Truss */}
          <mesh position={[0, 10.8, 0]} castShadow>
            <boxGeometry args={[9.2, 0.75, 0.95]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
          {/* Trolley Unit */}
          <mesh position={[0.7, 10.4, 0]} castShadow>
            <boxGeometry args={[1.1, 0.45, 0.85]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Suspended Steel Hoist Cable & Hook */}
          <group ref={hookRef} position={[0.7, 6.8, 0]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 6.5, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh position={[0, -3.2, 0]} castShadow>
              <boxGeometry args={[0.4, 0.45, 0.4]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 5. SERVICE VEHICLES ON ACCESS ROADS ── */}
      {/* Heavy Cryogenic Fuel Tanker Truck (Left Road) */}
      <group position={[-15.5, 0.65, -1.0]} rotation={[0, 0.25, 0]}>
        <mesh position={[0, 0.65, 1.8]} castShadow>
          <boxGeometry args={[1.7, 1.3, 1.9]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.85, 2.76]}>
          <boxGeometry args={[1.5, 0.65, 0.05]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Cylindrical Fuel Tanker Trailer */}
        <mesh position={[0, 0.85, -1.3]} rotation={[1.57, 0, 0]} castShadow>
          <cylinderGeometry args={[0.95, 0.95, 4.0, 24]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.12, -0.2]} castShadow>
          <boxGeometry args={[1.6, 0.32, 5.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Wheels */}
        {[-0.9, 0.9].map((x) =>
          [-2.4, -1.3, 1.5, 2.4].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.15, z]} rotation={[0, 0, 1.57]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.24, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* Electric Utility Maintenance Buggy (Right Road) */}
      <group position={[15.2, 0.45, 2.8]} rotation={[0, -0.35, 0]}>
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[1.5, 0.48, 0.85]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.85, 0.55, 0.75]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* 4 Buggy Wheels */}
        {[-0.6, 0.6].map((x) =>
          [-0.5, 0.5].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.16, z]} rotation={[1.57, 0, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
};
