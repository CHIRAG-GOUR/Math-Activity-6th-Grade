// ============================================================
// EQUATION MISSION CONTROL 2.0 — Dual Launch Facility 3D
// Complete Aerospace Launch Complex featuring:
// - Left Blue Launch Pad & Lattice Umbilical Tower
// - Right Red Launch Pad & Lattice Umbilical Tower
// - Central Campus Gantry Crane, Radar Array & Power Station
// - Motorized Service Arms, Umbilicals & Cryo LOX Tanks
// - Tarmac Road Markings, Safety Barriers & Maintenance Vehicles
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Spacecraft3DState } from '../types';

interface FacilityProps {
  blueState: Spacecraft3DState;
  redState: Spacecraft3DState;
}

// Reusable Single Launch Pad & Umbilical Tower Assembly
const LaunchPadTowerAssembly: React.FC<{
  padPos: [number, number, number];
  team: 'blue' | 'red';
  shipState: Spacecraft3DState;
}> = ({ padPos, team, shipState }) => {
  const serviceArmRef = useRef<THREE.Group>(null);
  const isBlue = team === 'blue';
  const teamColor = isBlue ? '#2563eb' : '#dc2626';

  useFrame((_, delta) => {
    if (serviceArmRef.current) {
      // Swing service arms away based on state (0 = docked, 1 = swung 80 degrees back)
      const targetAngle = isBlue
        ? -shipState.serviceArmsAngle * 1.35
        : shipState.serviceArmsAngle * 1.35;
      serviceArmRef.current.rotation.y = THREE.MathUtils.lerp(
        serviceArmRef.current.rotation.y,
        targetAngle,
        delta * 3.0
      );
    }
  });

  return (
    <group position={padPos}>
      {/* ── 1. OCTAGONAL LAUNCH PAD CONCRETE DECK ── */}
      <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.8, 4.4, 0.7, 8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Team Color Trim Perimeter Ring */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[3.6, 3.6, 0.05, 8]} />
        <meshStandardMaterial color={teamColor} roughness={0.4} />
      </mesh>

      {/* Steel Flame Exhaust Deflector Trench Ring */}
      <mesh position={[0, 0.74, 0]}>
        <ringGeometry args={[1.2, 1.8, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Pad Surface Safety Markings (Yellow Squares) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 2.8, 0.76, Math.sin(angle) * 2.8]}
          rotation={[-Math.PI / 2, 0, angle]}
        >
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      ))}

      {/* ── 2. TALL STEEL LATTICE UMBILICAL SERVICE TOWER ── */}
      <group position={[isBlue ? -3.4 : 3.4, 0, 0]}>
        {/* Main Tower Base Foundation */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 1.6, 1.4]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>

        {/* Vertical Steel Truss Tower Legs */}
        {[-0.5, 0.5].map((x) =>
          [-0.5, 0.5].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 6.2, z]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 10.0, 8]} />
              <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.3} />
            </mesh>
          ))
        )}

        {/* Horizontal & Diagonal Cross Braces */}
        {[2.5, 4.5, 6.5, 8.5, 10.5].map((y) => (
          <group key={y} position={[0, y, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.1, 1.1]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
            {/* Safety Railing Platforms */}
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[1.2, 0.5, 1.2]} />
              <meshStandardMaterial color="#94a3b8" wireframe />
            </mesh>
          </group>
        ))}

        {/* Tower Top Crane Gantry & Lightning Mast */}
        <mesh position={[0, 11.6, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.08, 1.8, 8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} />
        </mesh>

        {/* Flashing Red Aviation Warning Beacon */}
        <mesh position={[0, 12.5, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={2.5}
          />
        </mesh>

        {/* ── 3. MOTORIZED GANTRY SERVICE ARMS (Swing Retract) ── */}
        <group ref={serviceArmRef} position={[0, 6.8, 0]}>
          {/* Upper Crew & Avionics Service Arm */}
          <group position={[isBlue ? 1.6 : -1.6, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.8, 0.28, 0.45]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            {/* Connection Clamp Collar */}
            <mesh position={[isBlue ? 1.4 : -1.4, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.35, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
          </group>

          {/* Lower Fuel Umbilical Arm */}
          <group position={[isBlue ? 1.4 : -1.4, -2.4, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.4, 0.22, 0.35]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.4} />
            </mesh>
            {/* Insulated Cryogenic Delivery Pipe */}
            <mesh position={[0, -0.2, 0]} rotation={[0, 0, 1.57]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, 2.2, 12]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.7} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 4. CRYOGENIC LIQUID OXYGEN (LOX) STORAGE SPHERE ── */}
      <group position={[isBlue ? -5.2 : 5.2, 0, -2.8]}>
        {/* Concrete Cradle Foundation */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.8, 1.8]} />
          <meshStandardMaterial color="#64748b" roughness={0.6} />
        </mesh>
        {/* Insulated Cryo Sphere */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <sphereGeometry args={[1.2, 24, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
        </mesh>
        {/* Pressure Valve & Gauge */}
        <mesh position={[0, 3.1, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.4, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} />
        </mesh>
        {/* Pipeline connecting LOX Tank to Pad */}
        <mesh position={[isBlue ? 1.8 : -1.8, 0.5, 1.4]} rotation={[0, isBlue ? 0.7 : -0.7, 1.57]}>
          <cylinderGeometry args={[0.08, 0.08, 3.2, 12]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.7} />
        </mesh>
      </group>

      {/* ── 5. SAFETY BARRIERS & TOOL CRATES ── */}
      <group position={[0, 0, 3.6]}>
        {/* Yellow Construction Safety Railings */}
        {[-2.0, 2.0].map((x, idx) => (
          <group key={idx} position={[x, 0.45, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.8, 0.7, 0.1]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
              <boxGeometry args={[1.6, 0.4, 0.01]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        ))}

        {/* Heavy Equipment Tool Box */}
        <mesh position={[isBlue ? -1.0 : 1.0, 0.35, 0.4]} castShadow>
          <boxGeometry args={[0.7, 0.5, 0.5]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
      </group>

      {/* ── 6. COMPACT ELECTRIC MAINTENANCE ROVER ── */}
      <group position={[isBlue ? -4.5 : 4.5, 0.3, 2.8]} rotation={[0, isBlue ? 0.4 : -0.4, 0]}>
        {/* Chassis */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.2, 0.35, 0.7]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Cabin Roll Cage */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.7, 0.4, 0.6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* 4 Rover Wheels */}
        {[-0.45, 0.45].map((x) =>
          [-0.38, 0.38].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.1, z]} rotation={[1.57, 0, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          ))
        )}
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

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Smooth rotation of central tracking radar dish
    if (radarRef.current) {
      radarRef.current.rotation.y = time * 0.4;
    }
    // Gentle sway of central gantry crane
    if (craneArmRef.current) {
      craneArmRef.current.rotation.y = Math.sin(time * 0.2) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. EXPANSIVE CAMPUS TARMAC APRON ── */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[38, 26]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Painted Yellow Center Perimeter Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, 22]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} />
      </mesh>

      {/* Painted White Crosswalk Markings in Center */}
      {[-4, -2, 0, 2, 4].map((z) => (
        <mesh key={z} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 0.4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}

      {/* ── 2. BLUE TEAM LAUNCH COMPLEX (Left: x = -7.5) ── */}
      <LaunchPadTowerAssembly
        padPos={[-7.5, 0, 0]}
        team="blue"
        shipState={blueState}
      />

      {/* ── 3. RED TEAM LAUNCH COMPLEX (Right: x = +7.5) ── */}
      <LaunchPadTowerAssembly
        padPos={[7.5, 0, 0]}
        team="red"
        shipState={redState}
      />

      {/* ── 4. CENTRAL AEROSPACE CAMPUS HUB (Center: x = 0) ── */}
      <group position={[0, 0, -4.5]}>
        {/* Master Tracking Radar Dish Array */}
        <group ref={radarRef} position={[0, 3.2, 0]}>
          {/* Mast */}
          <mesh position={[0, -1.2, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.25, 2.4, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          {/* Parabolic Dish */}
          <mesh rotation={[0.4, 0, 0]} castShadow>
            <sphereGeometry args={[1.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} side={THREE.DoubleSide} />
          </mesh>
          {/* Dish Feed Probe */}
          <mesh position={[0, 0.5, 0.4]}>
            <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
        </group>

        {/* Power Sub-Station Transformer Units */}
        <group position={[0, 0.6, 1.8]}>
          {[-1.2, 0, 1.2].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} castShadow>
              <boxGeometry args={[0.9, 1.2, 0.8]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
          ))}
        </group>

        {/* Heavy Overhead Gantry Crane Arch */}
        <group ref={craneArmRef} position={[0, 0, -2.0]}>
          {/* Left Pylon */}
          <mesh position={[-3.2, 4.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 9.0, 12]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
          {/* Right Pylon */}
          <mesh position={[3.2, 4.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 9.0, 12]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
          {/* Horizontal Gantry Truss */}
          <mesh position={[0, 8.8, 0]} castShadow>
            <boxGeometry args={[7.2, 0.6, 0.8]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
