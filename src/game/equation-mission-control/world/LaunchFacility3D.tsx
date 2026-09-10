// ============================================================
// EQUATION MISSION CONTROL — Launch Facility 3D Environment
// Bright Daytime Aerospace Launch Facility:
// - Reinforced Concrete Launch Platform with Blast Deflector Trench
// - Tall Umbilical Steel Lattice Launch Tower with Catwalks & Beacons
// - Articulated Umbilical Service Arms with Hydraulic Pistons (Retract on Launch)
// - Insulated Cryogenic Fuel Pipelines & Storage Tanks
// - Yellow/Black Hazard Safety Barriers, Power Cables & Tool Crates
// - Maintenance Rover Vehicle & 3D Aerospace Technicians in Safety Suits
// - Rotating Weather Radar & Ventilation Exhaust Fans
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMissionControlStore } from '../store/missionControlStore';

// ── 3D Aerospace Technician Figure ──
export const AerospaceTechnician: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  suitColor?: string;
  hasClipboard?: boolean;
}> = ({ position, rotation = [0, 0, 0], scale = 0.85, suitColor = '#f8fafc', hasClipboard = false }) => {
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const walk = Math.sin(Date.now() * 0.005 + position[0]) * 0.35;
    if (leftLegRef.current) leftLegRef.current.rotation.x = walk;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -walk;
  });

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Safety Hardhat (Yellow) */}
      <mesh position={[0, 1.48, 0]}>
        <sphereGeometry args={[0.13, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.47, 0.05]}>
        <boxGeometry args={[0.18, 0.02, 0.12]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.38, 0]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      {/* Torso & High-Vis Safety Vest */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.34, 0.44, 0.18]} />
        <meshStandardMaterial color={suitColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.08, 0.01]}>
        <boxGeometry args={[0.35, 0.28, 0.19]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} />
      </mesh>
      {/* Reflective Stripes */}
      <mesh position={[0, 1.12, 0.1]}>
        <boxGeometry args={[0.32, 0.04, 0.02]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.22, 1.05, 0]}>
        <boxGeometry args={[0.08, 0.38, 0.08]} />
        <meshStandardMaterial color={suitColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.22, 1.05, 0]}>
        <boxGeometry args={[0.08, 0.38, 0.08]} />
        <meshStandardMaterial color={suitColor} roughness={0.5} />
      </mesh>

      {/* Clipboard Tool */}
      {hasClipboard && (
        <group position={[0.18, 0.95, 0.14]} rotation={[0.4, -0.2, 0]}>
          <mesh>
            <boxGeometry args={[0.14, 0.18, 0.02]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[0.12, 0.15, 0.005]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* Legs */}
      <group ref={leftLegRef} position={[-0.1, 0.72, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.1, 0.52, 0.1]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.1, 0.72, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.1, 0.52, 0.1]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

export const LaunchFacility3D: React.FC = () => {
  const serviceArm1Ref = useRef<THREE.Group>(null);
  const serviceArm2Ref = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);
  const ventFanRef = useRef<THREE.Group>(null);
  const warningBeaconRef = useRef<THREE.PointLight>(null);

  const spacecraftState = useMissionControlStore((s) => s.spacecraft);

  // Animate articulated service arms, radar dish, and hazard beacons
  useFrame((_, delta) => {
    // Service arms retract during launch sequence
    const armAngle = (spacecraftState.serviceArmsAngle || 0) * (Math.PI * 0.45);

    if (serviceArm1Ref.current) {
      serviceArm1Ref.current.rotation.y = THREE.MathUtils.damp(
        serviceArm1Ref.current.rotation.y,
        -armAngle,
        2.5,
        delta
      );
    }
    if (serviceArm2Ref.current) {
      serviceArm2Ref.current.rotation.y = THREE.MathUtils.damp(
        serviceArm2Ref.current.rotation.y,
        -armAngle * 0.9,
        2.5,
        delta
      );
    }

    // Rotating weather telemetry radar
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 1.2;
    }

    // Ventilation fan spinning
    if (ventFanRef.current) {
      ventFanRef.current.rotation.z += delta * 8.0;
    }

    // Rotating warning beacon light
    if (warningBeaconRef.current) {
      const active = spacecraftState.launchStage !== 'idle';
      warningBeaconRef.current.intensity = active ? 2.5 + Math.sin(Date.now() * 0.01) * 2.0 : 0.4;
    }
  });

  return (
    <group>
      {/* ========================================================= */}
      {/* ── 1. LAUNCH PAD PLATFORM & FLAME TRENCH ── */}
      {/* ========================================================= */}
      {/* Heavy Base Octagonal Concrete Pad */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 5.8, 1.0, 8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>

      {/* Flame Deflector Blast Ring */}
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[1.7, 1.9, 0.12, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Yellow & Black Perimeter Safety Ring */}
      <mesh position={[0, 1.01, 0]}>
        <ringGeometry args={[4.4, 4.8, 32]} />
        <meshStandardMaterial color="#facc15" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Launch Pad Retention Clamps (4 Hydraulic Hold-Down Pins) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => {
        const x = Math.cos(ang) * 1.4;
        const z = Math.sin(ang) * 1.4;
        const released = spacecraftState.clampsReleased;
        return (
          <group key={`clamp-${i}`} position={[x, 1.05, z]} rotation={[0, -ang, 0]}>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.28, 0.5, 0.35]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Clamping Jaw */}
            <mesh position={[0, 0.45, released ? 0.25 : 0.05]} rotation={[released ? 0.5 : 0, 0, 0]}>
              <boxGeometry args={[0.22, 0.15, 0.2]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* ========================================================= */}
      {/* ── 2. UMBILICAL STEEL LATTICE LAUNCH TOWER ── */}
      {/* ========================================================= */}
      <group position={[-3.2, 0, 0]}>
        {/* Foundation Base */}
        <mesh position={[0, 0.6, 0]} receiveShadow>
          <boxGeometry args={[2.2, 1.2, 2.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.8} />
        </mesh>

        {/* 4 Corner Heavy Steel Pillars (White & Red Lattice) */}
        {[-0.85, 0.85].map((x, xi) =>
          [-0.85, 0.85].map((z, zi) => (
            <mesh key={`tower-col-${xi}-${zi}`} position={[x, 7.2, z]}>
              <cylinderGeometry args={[0.07, 0.07, 12.0, 8]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.3} />
            </mesh>
          ))
        )}

        {/* Horizontal Girders & Safety Cross-Bracing */}
        {[2.5, 4.5, 6.5, 8.5, 10.5, 12.5].map((y, li) => (
          <group key={`level-${li}`} position={[0, y, 0]}>
            {/* Catwalk Floor */}
            <mesh>
              <boxGeometry args={[1.9, 0.08, 1.9]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Yellow Safety Railings */}
            <mesh position={[0, 0.25, 0.9]}>
              <boxGeometry args={[1.8, 0.45, 0.04]} />
              <meshStandardMaterial color="#facc15" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.25, -0.9]}>
              <boxGeometry args={[1.8, 0.45, 0.04]} />
              <meshStandardMaterial color="#facc15" roughness={0.4} />
            </mesh>
            <mesh position={[-0.9, 0.25, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[1.8, 0.45, 0.04]} />
              <meshStandardMaterial color="#facc15" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* Top Lightning Mast & Aircraft Warning Strobe */}
        <mesh position={[0, 14.2, 0]}>
          <cylinderGeometry args={[0.03, 0.06, 2.2, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <pointLight
          ref={warningBeaconRef}
          position={[0, 15.3, 0]}
          color="#ef4444"
          distance={16}
          intensity={1.5}
        />

        {/* ========================================================= */}
        {/* ── 3. ARTICULATED RETRACTING SERVICE ARMS ── */}
        {/* ========================================================= */}
        {/* Upper Crew & Avionics Umbilical Arm (at y = 8.5) */}
        <group ref={serviceArm1Ref} position={[0.85, 8.5, 0]}>
          <mesh position={[1.1, 0, 0]}>
            <boxGeometry args={[2.2, 0.22, 0.28]} />
            <meshStandardMaterial color="#f97316" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Hydraulic Extension Piston */}
          <mesh position={[0.6, -0.22, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.04, 0.05, 0.9, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          {/* Umbilical Quick-Disconnect Head */}
          <mesh position={[2.25, 0, 0]}>
            <boxGeometry args={[0.25, 0.35, 0.35]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
        </group>

        {/* Lower Cryogenic Fuel Umbilical Arm (at y = 4.5) */}
        <group ref={serviceArm2Ref} position={[0.85, 4.5, 0]}>
          <mesh position={[1.0, 0, 0]}>
            <boxGeometry args={[2.0, 0.22, 0.28]} />
            <meshStandardMaterial color="#f97316" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Fuel Delivery Hoses */}
          <mesh position={[1.0, -0.15, 0.12]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 1.8, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[2.05, 0, 0]}>
            <boxGeometry args={[0.22, 0.3, 0.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* ── 4. CRYOGENIC FUEL STORAGE TANKS & PIPELINES ── */}
      {/* ========================================================= */}
      <group position={[4.2, 0, -2.5]}>
        {/* Main Spherical LOX Tank */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[1.2, 24, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.3} />
        </mesh>
        {/* Tank Steel Support Cradle */}
        {[-0.8, 0.8].map((x, i) => (
          <mesh key={`tank-leg-${i}`} position={[x, 0.6, 0]}>
            <boxGeometry args={[0.15, 1.2, 1.6]} />
            <meshStandardMaterial color="#475569" roughness={0.6} />
          </mesh>
        ))}
        {/* Cryogenic Liquid Oxygen Label Plaque */}
        <mesh position={[0, 1.6, 1.22]}>
          <boxGeometry args={[0.9, 0.35, 0.04]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>

        {/* Connecting Stainless Steel Pipeline toward the launch pad */}
        <mesh position={[-1.8, 0.3, 1.0]} rotation={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.4, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* ── 5. MAINTENANCE ROVER & 3D TECHNICIANS ── */}
      {/* ========================================================= */}
      {/* Aerospace Maintenance Rover Vehicle */}
      <group position={[3.6, 0.35, 2.8]} rotation={[0, -0.6, 0]} scale={[0.85, 0.85, 0.85]}>
        {/* Rover Chassis */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[1.2, 0.35, 1.9]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Orange Roof Cab */}
        <mesh position={[0, 0.65, -0.2]}>
          <boxGeometry args={[1.0, 0.5, 0.9]} />
          <meshStandardMaterial color="#f97316" roughness={0.3} />
        </mesh>
        {/* Front Windshield */}
        <mesh position={[0, 0.65, 0.28]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.88, 0.42, 0.05]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.7} />
        </mesh>
        {/* 4 Heavy-Duty All-Terrain Wheels */}
        {[-0.65, 0.65].map((x, xi) =>
          [-0.6, 0.6].map((z, zi) => (
            <mesh key={`rover-w-${xi}-${zi}`} position={[x, 0.15, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.16, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* 3D Aerospace Technicians Walking & Inspecting */}
      <AerospaceTechnician position={[2.2, 1.0, 1.8]} rotation={[0, -1.8, 0]} hasClipboard={true} />
      <AerospaceTechnician position={[-2.4, 1.0, 2.0]} rotation={[0, 1.5, 0]} />
      <AerospaceTechnician position={[-3.2, 3.5, 0.4]} rotation={[0, 0.4, 0]} suitColor="#0284c7" />

      {/* ========================================================= */}
      {/* ── 6. HAZARD BARRIERS, TOOL CRATES & CABLES ── */}
      {/* ========================================================= */}
      {/* Yellow Safety Barriers */}
      {[
        [-2.5, 0, 4.2, 0.1],
        [0, 0, 4.6, 0],
        [2.5, 0, 4.2, -0.1],
      ].map(([x, y, z, rot], bi) => (
        <group key={`barrier-${bi}`} position={[x, 0.4, z]} rotation={[0, rot, 0]}>
          <mesh>
            <boxGeometry args={[1.8, 0.6, 0.1]} />
            <meshStandardMaterial color="#facc15" roughness={0.4} />
          </mesh>
          {/* Black Hazard Stripes */}
          {[-0.5, 0, 0.5].map((sx, si) => (
            <mesh key={`stripe-${si}`} position={[sx, 0, 0.052]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.15, 0.7, 0.01]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
          ))}
          {/* Barrier Feet */}
          {[-0.7, 0.7].map((fx, fi) => (
            <mesh key={`foot-${fi}`} position={[fx, -0.25, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.45]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Tool Crates & Power Equipment Cases */}
      <mesh position={[-2.2, 0.25, 3.2]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.5]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
      </mesh>
      <mesh position={[2.8, 0.2, 1.8]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.6]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>

      {/* Rotating Radar Antenna on Side Substation */}
      <group position={[4.6, 0, -4.5]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 2.4, 12]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>
        <group ref={radarRef} position={[0, 2.6, 0]}>
          <mesh rotation={[0.4, 0, 0]}>
            <sphereGeometry args={[0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.35]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
