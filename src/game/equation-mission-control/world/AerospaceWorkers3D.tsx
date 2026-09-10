// ============================================================
// EQUATION MISSION CONTROL 2.0 — Stylized 3D Aerospace Workers & Workstations
// Human Aerospace Technicians & Real 3D Workstations featuring:
// - Detailed Human Anatomy (Head, Hard Hat, Comms Headset, Hi-Vis Vest, Utility Belt, Boots)
// - Blue / Red Team Livery Accents & Identification Badges
// - Physical 3D Workstation Desks with Glowing Telemetry Monitors & Laptops
// - Role-Specific Looping Animations (Typing, Tablet Scanning, Engine Inspection, Radio Talking)
// - Real-Time Stage Reactions (Cheering & Fist Pumps) & Evacuation to Safety Line
// ============================================================

import React, { useRef } from 'react';
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

interface CharacterProps {
  initialPos: [number, number, number];
  rotationY?: number;
  team: TeamId;
  job: 'flight-director' | 'fuel-tech' | 'engine-scan' | 'comms-marshall' | 'walking-tech';
  isEvacuated: boolean;
  isCheering: boolean;
}

const AerospaceCharacter: React.FC<CharacterProps> = ({
  initialPos,
  rotationY = 0,
  team,
  job,
  isEvacuated,
  isCheering,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

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

    // 3. Role-Specific Realistic Looping Animations
    if (job === 'flight-director') {
      // Typing at laptop & looking between monitors
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.1 + Math.sin(time * 5) * 0.15;
        rightArmRef.current.rotation.y = -0.2;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.1 + Math.cos(time * 5) * 0.15;
        leftArmRef.current.rotation.y = 0.2;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.25;
        headRef.current.rotation.x = 0.15;
      }
    } else if (job === 'fuel-tech') {
      // Diagnostic tablet checking & valve adjustments
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.1;
        leftArmRef.current.rotation.y = 0.3;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.2 + Math.sin(time * 3) * 0.12;
        rightArmRef.current.rotation.y = -0.35;
      }
      if (headRef.current) headRef.current.rotation.x = 0.3 + Math.sin(time * 2) * 0.05;
    } else if (job === 'engine-scan') {
      // Aiming optical scanner with blue laser/probe light
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.4 + Math.sin(time * 2) * 0.08;
        rightArmRef.current.rotation.z = 0.25;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.2 + Math.sin(time * 1.5) * 0.1;
      }
    } else if (job === 'comms-marshall') {
      // Holding handheld radio walkie-talkie to head
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -2.1 + Math.sin(time * 2) * 0.05;
        rightArmRef.current.rotation.y = -0.4;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 1.2) * 0.3;
      }
    } else if (job === 'walking-tech') {
      // Walking with toolbox along access path
      const walkOffset = Math.sin(time * 1.6) * 1.8;
      groupRef.current.position.x = initialPos[0] + walkOffset;
      groupRef.current.rotation.y = walkOffset >= 0 ? 1.57 : -1.57;

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 6) * 0.4;
        rightLegRef.current.rotation.x = -Math.sin(time * 6) * 0.4;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(time * 6) * 0.35;
        rightArmRef.current.rotation.x = Math.sin(time * 6) * 0.35;
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

        {/* Diagnostic Tablet Item (if fuel tech) */}
        {job === 'fuel-tech' && (
          <mesh position={[0.12, -0.48, 0.22]} rotation={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.24, 0.32, 0.02]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
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

        {/* Handheld Optical Scanner Probe (if engine-scan) */}
        {job === 'engine-scan' && (
          <group position={[0, -0.6, 0.18]} rotation={[0.85, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.24, 10]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.7} />
            </mesh>
            <pointLight color="#38bdf8" intensity={2.0} distance={3.5} />
          </group>
        )}

        {/* Handheld Walkie-Talkie Radio (if comms-marshall) */}
        {job === 'comms-marshall' && (
          <mesh position={[0, -0.6, 0.1]} castShadow>
            <boxGeometry args={[0.06, 0.16, 0.05]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        )}

        {/* Heavy Tool Box (if walking-tech) */}
        {job === 'walking-tech' && (
          <mesh position={[0, -0.65, 0]} castShadow>
            <boxGeometry args={[0.2, 0.25, 0.4]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
        )}
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

      {/* Blue Worker 1: Lead Flight Director (at desk typing) */}
      <AerospaceCharacter
        initialPos={[-9.8, 0, 3.0]}
        rotationY={-3.0}
        team="blue"
        job="flight-director"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* Blue Worker 2: Cryo Propellant Specialist (near fuel manifold) */}
      <AerospaceCharacter
        initialPos={[-5.4, 0, 1.6]}
        rotationY={-0.65}
        team="blue"
        job="fuel-tech"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* Blue Worker 3: Propulsion Inspection Specialist (near rocket engines) */}
      <AerospaceCharacter
        initialPos={[-6.2, 0, -1.8]}
        rotationY={2.1}
        team="blue"
        job="engine-scan"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* Blue Worker 4: Safety & Comms Marshall */}
      <AerospaceCharacter
        initialPos={[-10.6, 0, -1.2]}
        rotationY={0.8}
        team="blue"
        job="comms-marshall"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* ── 2. RED TEAM ENGINEERING WORKSTATION & CREW (Right Pad: x = +7.0) ── */}
      {/* Red Team Workstation Desk */}
      <WorkstationDesk3D position={[9.8, 0, 2.4]} rotationY={-0.45} team="red" />

      {/* Red Worker 1: Lead Flight Director (at desk typing) */}
      <AerospaceCharacter
        initialPos={[9.8, 0, 3.0]}
        rotationY={3.0}
        team="red"
        job="flight-director"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />

      {/* Red Worker 2: Cryo Propellant Specialist */}
      <AerospaceCharacter
        initialPos={[5.4, 0, 1.6]}
        rotationY={0.65}
        team="red"
        job="fuel-tech"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />

      {/* Red Worker 3: Propulsion Inspection Specialist */}
      <AerospaceCharacter
        initialPos={[6.2, 0, -1.8]}
        rotationY={-2.1}
        team="red"
        job="engine-scan"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />

      {/* Red Worker 4: Safety & Comms Marshall */}
      <AerospaceCharacter
        initialPos={[10.6, 0, -1.2]}
        rotationY={-0.8}
        team="red"
        job="comms-marshall"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />

      {/* ── 3. CENTRAL HUB WORKERS ── */}
      {/* Central Command Workstation */}
      <WorkstationDesk3D position={[0, 0, 3.4]} rotationY={0} team="blue" />

      {/* Central Flight Marshall */}
      <AerospaceCharacter
        initialPos={[0, 0, 4.0]}
        rotationY={3.14}
        team="blue"
        job="flight-director"
        isEvacuated={isEvac}
        isCheering={blueCheering || redCheering}
      />

      {/* Mobile Systems Technician walking across central corridor */}
      <AerospaceCharacter
        initialPos={[0, 0, 0.6]}
        rotationY={1.57}
        team="red"
        job="walking-tech"
        isEvacuated={isEvac}
        isCheering={false}
      />
    </group>
  );
};
