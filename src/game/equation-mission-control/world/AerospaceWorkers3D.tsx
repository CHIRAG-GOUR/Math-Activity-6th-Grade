// ============================================================
// EQUATION MISSION CONTROL 2.0 — Highly Active 3D Aerospace Workers
// Authentic Aerospace Technicians & Real 3D Workstations:
// - Detailed Human Anatomy (Head, Hard Hat, Comms Headset, Hi-Vis Vest, Utility Belt, Boots)
// - NO STATIC WORKERS — Every single worker has dedicated tools & animated jobs:
//     1. Flight Directors: Two-handed keyboard typing, sipping coffee from mug, pointing at telemetry
//     2. Cryo Propellant Specialists: Torque wrench valve adjustments, manifold pressure checking on glowing tablet
//     3. Propulsion Specialists: Active optical laser scanner sweeping visible laser cone across engine bells
//     4. Safety & Comms Marshalls: Aviation marshalling with glowing orange wands & radio headset coordination
//     5. LOX Tank Technicians: Monitoring cryogenic pressure valves & boil-off lines at spherical tanks
//     6. Roving Field Inspection Officer: 15s cycle (walk -> inspect/logbook writing -> walk -> discuss with engineer)
// - Elevated Launch Pad Technicians (Y = 0.85) standing cleanly with boots on pad deck
// - Real-Time Stage Reactions (Cheering Fist Pumps) & Evacuation to Safety Line
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TeamId, LaunchStep } from '../types';

// Physical 3D Engineering Workstation Desk
export const WorkstationDesk3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  team: TeamId;
}> = ({ position, rotationY = 0, team }) => {
  const isBlue = team === 'blue';
  const monitorGlow = isBlue ? '#38bdf8' : '#f87171';
  const screenColor = isBlue ? '#0369a1' : '#991b1b';

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* ── DESK BASE FRAME ── */}
      {/* Aluminum Tabletop */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.08, 0.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Steel Table Legs */}
      {[-0.65, 0.65].map((x) =>
        [-0.32, 0.32].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.46, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.92, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        ))
      )}

      {/* ── DUAL GLOWING LCD TELEMETRY MONITORS ── */}
      {/* Left Monitor */}
      <group position={[-0.35, 1.32, -0.18]} rotation={[0, 0.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.42, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.024]}>
          <boxGeometry args={[0.5, 0.36, 0.01]} />
          <meshStandardMaterial
            color={screenColor}
            emissive={monitorGlow}
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Right Monitor */}
      <group position={[0.35, 1.32, -0.18]} rotation={[0, -0.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.42, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.024]}>
          <boxGeometry args={[0.5, 0.36, 0.01]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#22c55e"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* ── OPEN FIELD LAPTOP ── */}
      <group position={[0, 1.02, 0.12]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.02, 0.24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <group position={[0, 0.1, -0.11]} rotation={[-0.4, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.22, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[0.29, 0.19, 0.005]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} />
          </mesh>
        </group>
      </group>

      {/* Ceramic Coffee Mug */}
      <mesh position={[-0.55, 1.04, 0.18]} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.09, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
    </group>
  );
};

// Cryogenic Fuel Manifold Junction Stand for Pad Technicians
const CryoManifoldStand: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Mounting Post */}
    <mesh position={[0, 0.4, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.08, 0.8, 10]} />
      <meshStandardMaterial color="#475569" metalness={0.7} />
    </mesh>
    {/* Junction Box */}
    <mesh position={[0, 0.82, 0]} castShadow>
      <boxGeometry args={[0.28, 0.24, 0.2]} />
      <meshStandardMaterial color="#1e293b" metalness={0.8} />
    </mesh>
    {/* Brass Handwheel Valve */}
    <group position={[0, 0.82, 0.12]} rotation={[1.57, 0, 0]}>
      <mesh castShadow>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>
    </group>
    {/* Analog Dial Pressure Gauge */}
    <group position={[0, 0.98, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[-1.57, 0, 0]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  </group>
);

interface CharacterProps {
  initialPos: [number, number, number];
  rotationY?: number;
  team: TeamId;
  job: 'flight-director' | 'fuel-tech' | 'engine-scan' | 'comms-marshall' | 'tank-tech';
  isEvacuated: boolean;
  isCheering: boolean;
  isCentralOperator?: boolean;
}

const AerospaceCharacter: React.FC<CharacterProps> = ({
  initialPos,
  rotationY = 0,
  team,
  job,
  isEvacuated,
  isCheering,
  isCentralOperator = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);

  const isBlue = team === 'blue';
  const teamAccent = isBlue ? '#2563eb' : '#dc2626';

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // 1. Evacuation Movement during Rocket Ignition & Ascent
    if (isEvacuated) {
      const targetZ = initialPos[2] + 5.0;
      const targetX = initialPos[0] + (isBlue ? -2.5 : 2.5);
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        delta * 2.8
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        delta * 2.8
      );
      // Jogging leg movement
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 10) * 0.5;
        rightLegRef.current.rotation.x = -Math.sin(time * 10) * 0.5;
      }
      return;
    }

    // 2. Stage Celebration Cheer (Both hands raised high with fist pumps)
    if (isCheering) {
      if (leftArmRef.current)
        leftArmRef.current.rotation.z = 2.4 + Math.sin(time * 10) * 0.25;
      if (rightArmRef.current)
        rightArmRef.current.rotation.z = -2.4 - Math.sin(time * 10) * 0.25;
      if (headRef.current) headRef.current.rotation.x = -0.3;
      return;
    }

    // 3. Central Operator Discussion Reaction (Interacts when roving inspector arrives)
    if (isCentralOperator) {
      const loopTime = time % 15.0;
      const isDiscussing = loopTime >= 12.0 && loopTime < 15.0;
      const cycleIndex = Math.floor(time / 15.0);
      const rovingIsLeft = cycleIndex % 2 === 0;

      if (isDiscussing) {
        if (headRef.current) {
          headRef.current.rotation.y = (rovingIsLeft ? 0.35 : -0.35) + Math.sin(time * 4) * 0.12;
          headRef.current.rotation.x = 0.1 + Math.sin(time * 6) * 0.08;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.1 + Math.sin(time * 3) * 0.2;
          rightArmRef.current.rotation.y = rovingIsLeft ? -0.4 : 0.4;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.9 + Math.cos(time * 3) * 0.15;
          leftArmRef.current.rotation.y = 0.1;
        }
        return;
      }
    }

    // 4. Role-Specific Dynamic Looping Animations

    // ── ROLE A: FLIGHT DIRECTOR / COMPUTER ENGINEER (Typing, sipping coffee, checking screens) ──
    if (job === 'flight-director') {
      const cycleTime = (time + (isBlue ? 0 : 4.5)) % 9.0;

      if (cycleTime < 4.0) {
        // Phase 1: Rapid two-handed typing on keyboard & scanning dual monitors
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.1 + Math.sin(time * 11) * 0.08;
          rightArmRef.current.rotation.y = -0.2;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.1 + Math.cos(time * 11) * 0.08;
          leftArmRef.current.rotation.y = 0.2;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(time * 2.2) * 0.28;
          headRef.current.rotation.x = 0.14;
        }
      } else if (cycleTime < 7.0) {
        // Phase 2: Lifts coffee mug for a sip, then sets it back down
        const sipP = (cycleTime - 4.0) / 3.0;
        const sipCurve = Math.sin(sipP * Math.PI);
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(-1.1, -1.95, sipCurve);
          rightArmRef.current.rotation.y = THREE.MathUtils.lerp(-0.2, -0.45, sipCurve);
        }
        if (headRef.current) {
          headRef.current.rotation.x = THREE.MathUtils.lerp(0.14, -0.22, sipCurve);
          headRef.current.rotation.y = 0;
        }
      } else {
        // Phase 3: Points at main telemetry monitor to verify data spikes
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.35 + Math.sin(time * 3) * 0.15;
          rightArmRef.current.rotation.y = -0.15;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.1;
          headRef.current.rotation.y = 0.2;
        }
      }
    }

    // ── ROLE B: CRYO PROPELLANT SPECIALIST (Wrench adjustments & tablet telemetry) ──
    else if (job === 'fuel-tech') {
      const cycleTime = (time + (isBlue ? 0 : 3.0)) % 6.0;

      if (cycleTime < 2.5) {
        // Phase 1: Bends forward slightly, turns the cryogenic valve with torque wrench
        groupRef.current.position.y = initialPos[1] - 0.05;
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.25;
          rightArmRef.current.rotation.y = -0.3;
          rightArmRef.current.rotation.z = Math.sin(time * 8) * 0.35; // Wrench twisting strokes
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.9;
          leftArmRef.current.rotation.y = 0.35;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.35;
          headRef.current.rotation.y = 0.1;
        }
      } else if (cycleTime < 4.5) {
        // Phase 2: Straightens up, raises tablet, taps screen with right finger
        groupRef.current.position.y = initialPos[1];
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.25;
          leftArmRef.current.rotation.y = 0.3;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.15 + Math.sin(time * 6) * 0.1;
          rightArmRef.current.rotation.y = -0.35;
          rightArmRef.current.rotation.z = 0;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.32;
          headRef.current.rotation.y = 0.1;
        }
      } else {
        // Phase 3: Looks up at cryogenic umbilical line, shifts stance with approval
        groupRef.current.position.y = initialPos[1];
        if (headRef.current) {
          headRef.current.rotation.x = -0.42;
          headRef.current.rotation.y = Math.sin(time * 2) * 0.15;
        }
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = Math.sin(time * 4) * 0.1;
          rightLegRef.current.rotation.x = -Math.sin(time * 4) * 0.1;
        }
      }
    }

    // ── ROLE C: PROPULSION INSPECTION SPECIALIST (Sweeping laser scanner across rocket engines) ──
    else if (job === 'engine-scan') {
      const cycleTime = (time + (isBlue ? 0 : 3.0)) % 6.0;

      // Smooth sweeping of optical laser scanner across rocket nozzle
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.35 + Math.sin(time * 2.4) * 0.22;
        rightArmRef.current.rotation.y = Math.sin(time * 1.8) * 0.32;
        rightArmRef.current.rotation.z = 0.2;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.28 + Math.sin(time * 2.4) * 0.15;
        headRef.current.rotation.y = Math.sin(time * 1.8) * 0.28;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.8;
        leftArmRef.current.rotation.y = 0.2;
      }

      // Laser beam cone pulse
      if (laserBeamRef.current) {
        laserBeamRef.current.scale.set(
          1 + Math.sin(time * 12) * 0.15,
          1,
          1 + Math.cos(time * 12) * 0.15
        );
      }

      // Subtle stepping inspection stance
      if (cycleTime > 3.0 && cycleTime < 4.5) {
        groupRef.current.position.y = initialPos[1] - 0.06;
      } else {
        groupRef.current.position.y = initialPos[1];
      }
    }

    // ── ROLE D: SAFETY & COMMS MARSHALL (Glowing marshalling wands & radio headset) ──
    else if (job === 'comms-marshall') {
      const cycleTime = (time + (isBlue ? 0 : 3.5)) % 7.0;

      if (cycleTime < 3.5) {
        // Phase 1: Aviation Marshalling Signals — Synchronized wand waving
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = 1.4 + Math.sin(time * 3.2) * 0.45;
          leftArmRef.current.rotation.x = -0.4 + Math.cos(time * 3.2) * 0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = -1.4 - Math.sin(time * 3.2) * 0.45;
          rightArmRef.current.rotation.x = -0.4 + Math.cos(time * 3.2) * 0.2;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(time * 2.0) * 0.2;
          headRef.current.rotation.x = 0;
        }
      } else if (cycleTime < 5.5) {
        // Phase 2: Talks into radio headset, looks up at 15m umbilical tower
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = 0.3;
          leftArmRef.current.rotation.x = -0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -2.15 + Math.sin(time * 2) * 0.05;
          rightArmRef.current.rotation.y = -0.45;
          rightArmRef.current.rotation.z = 0;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(time * 1.6) * 0.35;
          headRef.current.rotation.x = -0.28;
        }
      } else {
        // Phase 3: Extends right wand forward in an authoritative "Clear for Launch" gesture
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.5;
          rightArmRef.current.rotation.y = -0.2;
          rightArmRef.current.rotation.z = -0.15;
        }
        if (headRef.current) {
          headRef.current.rotation.x = -0.1;
          headRef.current.rotation.y = 0.15;
        }
      }
    }

    // ── ROLE E: LOX TANK TECHNICIAN (Operates cryo spherical tank valves & gauges) ──
    else if (job === 'tank-tech') {
      const cycleTime = (time + (isBlue ? 0 : 2.5)) % 6.0;

      if (cycleTime < 3.0) {
        // Reaching and turning steam release valve wheel
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.35;
          rightArmRef.current.rotation.z = Math.sin(time * 6) * 0.4;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.2;
          leftArmRef.current.rotation.y = 0.3;
        }
        if (headRef.current) {
          headRef.current.rotation.x = -0.2;
          headRef.current.rotation.y = 0.2;
        }
      } else {
        // Inspecting pressure gauge on tank
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.3;
          leftArmRef.current.rotation.y = 0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.9 + Math.sin(time * 4) * 0.15;
          rightArmRef.current.rotation.y = -0.3;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.25;
          headRef.current.rotation.y = Math.sin(time * 2) * 0.2;
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={initialPos} rotation={[0, rotationY, 0]}>
      {/* ── PELVIS & WORK TROUSERS ── */}
      <mesh position={[0, 0.76, 0]} castShadow>
        <boxGeometry args={[0.38, 0.22, 0.25]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.11, 0.66, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.62, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Steel-Toe Heavy Boot */}
        <mesh position={[0, -0.66, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.15, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.11, 0.66, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.62, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Steel-Toe Heavy Boot */}
        <mesh position={[0, -0.66, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.15, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* ── TORSO & HIGH-VISIBILITY NEON ORANGE SAFETY VEST ── */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.44, 0.6, 0.28]} />
        <meshStandardMaterial color="#ea580c" roughness={0.45} />
      </mesh>

      {/* Reflective Fluorescent Yellow Safety Stripes */}
      <mesh position={[0, 1.28, 0.15]}>
        <boxGeometry args={[0.4, 0.06, 0.02]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fef08a"
          emissiveIntensity={0.65}
        />
      </mesh>
      <mesh position={[0, 1.04, 0.15]}>
        <boxGeometry args={[0.4, 0.06, 0.02]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fef08a"
          emissiveIntensity={0.65}
        />
      </mesh>

      {/* Team ID Badge on Chest */}
      <mesh position={[0.13, 1.32, 0.16]}>
        <boxGeometry args={[0.09, 0.11, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.13, 1.34, 0.165]}>
        <boxGeometry args={[0.07, 0.035, 0.01]} />
        <meshStandardMaterial color={teamAccent} />
      </mesh>

      {/* Utility Tool Belt with Radio Holster */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[0.46, 0.08, 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh position={[-0.22, 0.95, 0]} castShadow>
        <boxGeometry args={[0.06, 0.14, 0.08]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* ── HEAD & SAFETY HARD HAT / COMMS HEADSET ── */}
      <group ref={headRef} position={[0, 1.62, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 0.12, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {/* Aerodynamic Hard Hat */}
        <mesh position={[0, 0.09, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
        </mesh>
        {/* Hard Hat Protective Brim */}
        <mesh position={[0, 0.08, 0.04]} rotation={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.03, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} />
        </mesh>
        {/* Team Center Stripe on Hard Hat */}
        <mesh position={[0, 0.17, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.34]} />
          <meshStandardMaterial color={teamAccent} />
        </mesh>

        {/* Comms Headset Boom */}
        <mesh position={[-0.18, 0.02, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ── LEFT ARM ── */}
      <group ref={leftArmRef} position={[-0.28, 1.42, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.32, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.28, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[0.09, 0.11, 0.09]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {/* Diagnostic Tablet Item (if fuel-tech or tank-tech) */}
        {(job === 'fuel-tech' || job === 'tank-tech') && (
          <group position={[0.12, -0.48, 0.22]} rotation={[0.4, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.24, 0.32, 0.02]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <boxGeometry args={[0.21, 0.28, 0.005]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.0} />
            </mesh>
          </group>
        )}

        {/* Glowing Marshalling Wand (if comms-marshall) */}
        {job === 'comms-marshall' && (
          <group position={[0, -0.65, 0.12]} rotation={[1.57, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.34, 12]} />
              <meshStandardMaterial
                color="#f97316"
                emissive="#f97316"
                emissiveIntensity={2.5}
              />
            </mesh>
            <mesh position={[0, -0.16, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        )}
      </group>

      {/* ── RIGHT ARM ── */}
      <group ref={rightArmRef} position={[0.28, 1.42, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.32, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.28, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[0.09, 0.11, 0.09]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {/* Heavy Torque Wrench (if fuel-tech) */}
        {job === 'fuel-tech' && (
          <group position={[0, -0.62, 0.14]} rotation={[0.6, 0, 0]}>
            {/* Wrench Shaft */}
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.38, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Yellow Rubber Grip */}
            <mesh position={[0, -0.12, 0]}>
              <cylinderGeometry args={[0.026, 0.026, 0.14, 8]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            {/* Socket Head */}
            <mesh position={[0, 0.18, 0]} rotation={[0, 0, 1.57]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 6]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
          </group>
        )}

        {/* Handheld Optical Laser Scanner with Visible Laser Cone Beam (if engine-scan) */}
        {job === 'engine-scan' && (
          <group position={[0, -0.6, 0.18]} rotation={[0.85, 0, 0]}>
            {/* Scanner Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.24, 10]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.7} />
            </mesh>
            {/* Pulsating Light Emitter */}
            <pointLight color="#38bdf8" intensity={2.8} distance={4.5} />
            {/* Visible Laser Scanning Cone Beam */}
            <mesh ref={laserBeamRef} position={[0, 0.75, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.22, 1.4, 16]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}

        {/* Glowing Marshalling Wand (if comms-marshall) */}
        {job === 'comms-marshall' && (
          <group position={[0, -0.65, 0.12]} rotation={[1.57, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.34, 12]} />
              <meshStandardMaterial
                color="#f97316"
                emissive="#f97316"
                emissiveIntensity={2.5}
              />
            </mesh>
            <mesh position={[0, -0.16, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// ============================================================
// ROVING FIELD INSPECTION TECHNICIAN (15-Second Continuous Routine)
// 1. Walk from central computer desk to rocket pad (0s - 4.5s)
// 2. Read markings/telemetry on rocket & write in logbook (4.5s - 8.5s)
// 3. Walk back to central computer engineer (8.5s - 12.0s)
// 4. Discuss findings with computer engineer gesturing & nodding (12.0s - 15.0s)
// ============================================================
const RovingInspectorCharacter: React.FC<{ isEvacuated: boolean }> = ({ isEvacuated }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // Evacuation Behavior during liftoff
    if (isEvacuated) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, delta * 2.5);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 8.0, delta * 2.5);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, delta * 2.5);
      groupRef.current.rotation.y = 0;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 11) * 0.5;
        rightLegRef.current.rotation.x = -Math.sin(time * 11) * 0.5;
      }
      return;
    }

    const CYCLE = 15.0;
    const loopTime = time % CYCLE;
    const cycleIndex = Math.floor(time / CYCLE);
    // Alternates between inspecting Blue Rocket (even cycles) and Red Rocket (odd cycles)
    const targetIsBlue = cycleIndex % 2 === 0;

    const deskX = targetIsBlue ? -0.8 : 0.8;
    const deskZ = 2.7;
    const padX = targetIsBlue ? -4.8 : 4.8;
    const padZ = 1.3;
    const padElevation = 0.75; // Relative to group Y = 0.1, total world Y = 0.85

    // PHASE 1: Walk to Rocket Pad (0.0s - 4.5s)
    if (loopTime < 4.5) {
      const p = loopTime / 4.5;
      const ease = p * p * (3 - 2 * p);
      groupRef.current.position.x = THREE.MathUtils.lerp(deskX, padX, ease);
      groupRef.current.position.z = THREE.MathUtils.lerp(deskZ, padZ, ease);
      groupRef.current.position.y = p < 0.4 ? 0 : THREE.MathUtils.lerp(0, padElevation, (p - 0.4) / 0.6);
      groupRef.current.rotation.y = Math.atan2(padX - deskX, padZ - deskZ);

      // Walk cycle
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 9) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(time * 9) * 0.45;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.0;
        leftArmRef.current.rotation.y = 0.2;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(time * 9) * 0.35;
        rightArmRef.current.rotation.y = 0;
      }
      if (headRef.current) headRef.current.rotation.set(0, 0, 0);
    }
    // PHASE 2: Inspect Rocket & Write in Book (4.5s - 8.5s)
    else if (loopTime < 8.5) {
      const inspectT = loopTime - 4.5;
      groupRef.current.position.set(padX, padElevation, padZ);
      groupRef.current.rotation.y = targetIsBlue ? -1.8 : 1.8;

      // Stable standing posture
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }

      // Head scanning up & across rocket fuselage
      if (headRef.current) {
        headRef.current.rotation.x = -0.32 + Math.sin(inspectT * 2.2) * 0.12;
        headRef.current.rotation.y = (targetIsBlue ? -0.2 : 0.2) + Math.sin(inspectT * 1.6) * 0.16;
      }

      // Left arm holding inspection clipboard up at chest height
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.25;
        leftArmRef.current.rotation.y = targetIsBlue ? 0.35 : -0.35;
      }

      // Right arm holding stylus scribbling notes in the book
      if (rightArmRef.current) {
        const scribble = Math.sin(time * 14) * 0.08;
        const scribbleY = Math.cos(time * 14) * 0.06;
        rightArmRef.current.rotation.x = -1.35 + scribble;
        rightArmRef.current.rotation.y = -0.25 + scribbleY;
      }
    }
    // PHASE 3: Walk back to Central Workstation (8.5s - 12.0s)
    else if (loopTime < 12.0) {
      const p = (loopTime - 8.5) / 3.5;
      const ease = p * p * (3 - 2 * p);
      groupRef.current.position.x = THREE.MathUtils.lerp(padX, deskX, ease);
      groupRef.current.position.z = THREE.MathUtils.lerp(padZ, deskZ, ease);
      groupRef.current.position.y = p < 0.6 ? THREE.MathUtils.lerp(padElevation, 0, p / 0.6) : 0;
      groupRef.current.rotation.y = Math.atan2(deskX - padX, deskZ - padZ);

      // Walk cycle
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 9) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(time * 9) * 0.45;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.9;
        leftArmRef.current.rotation.y = 0.2;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(time * 9) * 0.35;
        rightArmRef.current.rotation.y = 0;
      }
      if (headRef.current) headRef.current.rotation.set(0, 0, 0);
    }
    // PHASE 4: Discuss with Central Computer Operator (12.0s - 15.0s)
    else {
      const discussT = loopTime - 12.0;
      groupRef.current.position.set(deskX, 0, deskZ);
      groupRef.current.rotation.y = targetIsBlue ? 2.5 : -2.5;

      // Stable standing
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }

      // Head nodding and talking
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(discussT * 5.0) * 0.12;
        headRef.current.rotation.y = (targetIsBlue ? 0.2 : -0.2) + Math.sin(discussT * 3.0) * 0.15;
      }

      // Left arm presenting open logbook to computer operator
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.1;
        leftArmRef.current.rotation.y = targetIsBlue ? -0.25 : 0.25;
      }

      // Right arm gesturing and pointing at telemetry
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.85 + Math.sin(discussT * 3.5) * 0.3;
        rightArmRef.current.rotation.y = -0.3 + Math.cos(discussT * 3.5) * 0.15;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 2.7]}>
      {/* ── PELVIS & WORK TROUSERS ── */}
      <mesh position={[0, 0.76, 0]} castShadow>
        <boxGeometry args={[0.38, 0.22, 0.25]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.11, 0.66, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.62, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Steel-Toe Heavy Boot */}
        <mesh position={[0, -0.66, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.15, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.11, 0.66, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.62, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Steel-Toe Heavy Boot */}
        <mesh position={[0, -0.66, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.15, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* ── TORSO & HI-VIS ORANGE VEST ── */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.44, 0.6, 0.28]} />
        <meshStandardMaterial color="#ea580c" roughness={0.45} />
      </mesh>
      {/* Reflective Fluorescent Yellow Stripes */}
      <mesh position={[0, 1.28, 0.15]}>
        <boxGeometry args={[0.4, 0.06, 0.02]} />
        <meshStandardMaterial color="#fde047" emissive="#fef08a" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[0, 1.04, 0.15]}>
        <boxGeometry args={[0.4, 0.06, 0.02]} />
        <meshStandardMaterial color="#fde047" emissive="#fef08a" emissiveIntensity={0.65} />
      </mesh>

      {/* Field Inspection Officer Badge */}
      <mesh position={[0.13, 1.32, 0.16]}>
        <boxGeometry args={[0.09, 0.11, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.13, 1.34, 0.165]}>
        <boxGeometry args={[0.07, 0.035, 0.01]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Utility Tool Belt */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[0.46, 0.08, 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* ── HEAD & WHITE SAFETY HARD HAT ── */}
      <group ref={headRef} position={[0, 1.62, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 0.12, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.09, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0.04]} rotation={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.03, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} />
        </mesh>
        {/* Blue Center Stripe on Hard Hat */}
        <mesh position={[0, 0.17, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.34]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
        {/* Comms Headset Boom */}
        <mesh position={[-0.18, 0.02, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ── LEFT ARM CARRYING PHYSICAL 3D LOGBOOK / CLIPBOARD ── */}
      <group ref={leftArmRef} position={[-0.28, 1.42, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.32, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.28, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[0.09, 0.11, 0.09]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {/* Physical 3D Hardcover Logbook / Clipboard */}
        <group position={[0.12, -0.52, 0.16]} rotation={[0.4, 0.15, 0]}>
          {/* Blue Clipboard Backer */}
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.36, 0.02]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* White Paper Sheets */}
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[0.22, 0.31, 0.005]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          {/* Top Metal Clip */}
          <mesh position={[0, 0.15, 0.02]}>
            <boxGeometry args={[0.1, 0.035, 0.015]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ── RIGHT ARM HOLDING WRITING PEN / STYLUS ── */}
      <group ref={rightArmRef} position={[0.28, 1.42, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.32, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.28, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[0.09, 0.11, 0.09]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {/* Stylus / Pen for Writing */}
        <mesh position={[0, -0.62, 0.1]} rotation={[0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

interface WorkersProps {
  launchStage: LaunchStep;
  blueCheering: boolean;
  redCheering: boolean;
}

export const AerospaceWorkers3D: React.FC<WorkersProps> = ({
  launchStage,
  blueCheering,
  redCheering,
}) => {
  const isEvac =
    launchStage === 'ignition' ||
    launchStage === 'thrust-ramp' ||
    launchStage === 'liftoff' ||
    launchStage === 'tower-clear' ||
    launchStage === 'sky-ascent';

  return (
    <group position={[0, 0.1, 0]}>
      {/* ── 1. BLUE TEAM ENGINEERING WORKSTATION & CREW (Left Pad: x = -7.0) ── */}
      {/* Blue Team Workstation Desk */}
      <WorkstationDesk3D position={[-9.8, 0, 2.4]} rotationY={0.45} team="blue" />

      {/* Blue Worker 1: Lead Flight Director (at desk typing, sipping coffee, checking screens) */}
      <AerospaceCharacter
        initialPos={[-9.8, 0, 3.0]}
        rotationY={-3.0}
        team="blue"
        job="flight-director"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* Blue Manifold Stand Prop for Cryo Specialist */}
      <CryoManifoldStand position={[-4.8, 0.85, 2.35]} rotationY={3.14} />

      {/* Blue Worker 2: Cryo Propellant Specialist (actively adjusting valve with wrench & checking tablet) */}
      <AerospaceCharacter
        initialPos={[-4.8, 0.85, 1.9]}
        rotationY={-2.28}
        team="blue"
        job="fuel-tech"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* Blue Worker 3: Propulsion Inspection Specialist (actively sweeping laser scanner across engine bells) */}
      <AerospaceCharacter
        initialPos={[-4.8, 0.85, -1.9]}
        rotationY={-0.86}
        team="blue"
        job="engine-scan"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* Blue Worker 4: Safety & Comms Marshall (actively signalling with glowing wands & coordinating radio) */}
      <AerospaceCharacter
        initialPos={[-10.6, 0, -1.2]}
        rotationY={0.8}
        team="blue"
        job="comms-marshall"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* Blue Worker 5: LOX Spherical Tank Cryo Technician */}
      <AerospaceCharacter
        initialPos={[-6.0, 0, -2.1]}
        rotationY={3.14}
        team="blue"
        job="tank-tech"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* ── 2. RED TEAM ENGINEERING WORKSTATION & CREW (Right Pad: x = +7.0) ── */}
      {/* Red Team Workstation Desk */}
      <WorkstationDesk3D position={[9.8, 0, 2.4]} rotationY={-0.45} team="red" />

      {/* Red Worker 1: Lead Flight Director (at desk typing, sipping coffee, checking screens) */}
      <AerospaceCharacter
        initialPos={[9.8, 0, 3.0]}
        rotationY={3.0}
        team="red"
        job="flight-director"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />

      {/* Red Manifold Stand Prop for Cryo Specialist */}
      <CryoManifoldStand position={[4.8, 0.85, 2.35]} rotationY={3.14} />

      {/* Red Worker 2: Cryo Propellant Specialist (actively adjusting valve with wrench & checking tablet) */}
      <AerospaceCharacter
        initialPos={[4.8, 0.85, 1.9]}
        rotationY={2.28}
        team="red"
        job="fuel-tech"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />

      {/* Red Worker 3: Propulsion Inspection Specialist (actively sweeping laser scanner across engine bells) */}
      <AerospaceCharacter
        initialPos={[4.8, 0.85, -1.9]}
        rotationY={0.86}
        team="red"
        job="engine-scan"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />

      {/* Red Worker 4: Safety & Comms Marshall (actively signalling with glowing wands & coordinating radio) */}
      <AerospaceCharacter
        initialPos={[10.6, 0, -1.2]}
        rotationY={-0.8}
        team="red"
        job="comms-marshall"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />

      {/* Red Worker 5: LOX Spherical Tank Cryo Technician */}
      <AerospaceCharacter
        initialPos={[6.0, 0, -2.1]}
        rotationY={3.14}
        team="red"
        job="tank-tech"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />

      {/* ── 3. CENTRAL HUB WORKERS & ROVING INSPECTOR ── */}
      {/* Central Command Workstation Desk */}
      <WorkstationDesk3D position={[0, 0, 3.4]} rotationY={0} team="blue" />

      {/* Central Flight Marshall / Computer Engineer (behind desk, typing & interacting with roving officer) */}
      <AerospaceCharacter
        initialPos={[0, 0, 4.0]}
        rotationY={3.14}
        team="blue"
        job="flight-director"
        isEvacuated={isEvac}
        isCheering={blueCheering || redCheering}
        isCentralOperator={true}
      />

      {/* Continuous 15-Second Roving Field Inspection Officer (walking, inspecting with logbook, discussing) */}
      <RovingInspectorCharacter isEvacuated={isEvac} />
    </group>
  );
};
