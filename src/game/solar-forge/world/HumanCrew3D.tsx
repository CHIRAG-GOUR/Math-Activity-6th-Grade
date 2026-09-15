'use client';

// ============================================================
// THE SOLAR FORGE: High-Fidelity Human Expedition Crew 3D
// Recognizable human solar engineers, horology researchers & maintenance
// technicians with believable proportions, visible facial features,
// helmets, vests, tablets, and responsive behavioral animations.
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SOLAR_MATERIALS } from './materials';
import { useSolarForgeStore } from '../store/solarForgeStore';

// ── REUSABLE RECOGNIZABLE HUMAN FIGURE ──
interface HumanFigureProps {
  position: [number, number, number];
  rotationY?: number;
  role: 'engineer_blue' | 'engineer_red' | 'researcher' | 'director' | 'maintenance';
  isReacting?: boolean;
}

const RecognizableHuman3D: React.FC<HumanFigureProps> = ({
  position,
  rotationY = 0,
  role,
  isReacting = false,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);

  // Clothing color schemes by role
  const isBlueEng = role === 'engineer_blue';
  const isRedEng = role === 'engineer_red';
  const isResearcher = role === 'researcher';
  const isDirector = role === 'director';

  const vestColor = isBlueEng
    ? '#0284c7'
    : isRedEng
    ? '#dc2626'
    : isResearcher
    ? '#e2e8f0'
    : isDirector
    ? '#047857'
    : '#f59e0b';

  const pantsColor = isResearcher ? '#d4b996' : isDirector ? '#334155' : '#1e293b';
  const helmetColor = isResearcher ? '#d4b996' : '#fbbf24'; // Safari hat vs yellow hardhat

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Natural subtle breathing / idle posture
    if (rootRef.current) {
      rootRef.current.position.y = position[1] + Math.sin(t * 1.8 + position[0]) * 0.015;
    }

    // Head animation: looking between tablet and machinery / sundial
    if (headRef.current) {
      if (isReacting) {
        // Look up toward mirror or central tower
        headRef.current.rotation.x = -0.35 + Math.sin(t * 2.0) * 0.05;
        headRef.current.rotation.y = Math.sin(t * 1.2) * 0.15;
      } else if (isResearcher) {
        // Studying sundial shadow then checking tablet
        const lookCycle = Math.sin(t * 0.8);
        headRef.current.rotation.x = lookCycle > 0 ? 0.35 : 0.05; // Head down at tablet vs up at dial
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
      } else {
        // General inspection
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.3;
        headRef.current.rotation.x = Math.sin(t * 0.9) * 0.08;
      }
    }

    // Right arm holding tablet / pointing / operating tool
    if (rightArmRef.current) {
      if (isReacting) {
        // Arm raised in approval / pointing
        rightArmRef.current.rotation.x = -1.2 + Math.sin(t * 3.0) * 0.1;
        rightArmRef.current.rotation.z = -0.2;
      } else if (isResearcher || isBlueEng || isRedEng) {
        // Holding tablet in front
        rightArmRef.current.rotation.x = -0.65 + Math.sin(t * 1.5) * 0.04;
        rightArmRef.current.rotation.z = -0.15;
      } else {
        rightArmRef.current.rotation.x = Math.sin(t * 1.2) * 0.1;
      }
    }

    // Left arm holding clipboard or resting on hip
    if (leftArmRef.current) {
      if (isResearcher) {
        leftArmRef.current.rotation.x = -0.55;
        leftArmRef.current.rotation.z = 0.2;
      } else {
        leftArmRef.current.rotation.x = 0.1 + Math.sin(t * 1.2) * 0.05;
      }
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={[0, rotationY, 0]}>
      {/* ── 1. REALISTIC WORK BOOTS ── */}
      {/* Left Boot */}
      <mesh position={[-0.14, 0.14, 0.04]} castShadow>
        <boxGeometry args={[0.16, 0.28, 0.32]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>
      {/* Right Boot */}
      <mesh position={[0.14, 0.14, 0.04]} castShadow>
        <boxGeometry args={[0.16, 0.28, 0.32]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>

      {/* ── 2. LEGS & WORK TROUSERS ── */}
      {/* Left Leg */}
      <mesh position={[-0.14, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.09, 0.62, 8]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.14, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.09, 0.62, 8]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>
      {/* Pelvis / Belt */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[0.42, 0.14, 0.24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* ── 3. TORSO & UTILITY VEST / FIELD JACKET ── */}
      {/* Inner Shirt */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.46, 0.48, 0.26]} />
        <meshStandardMaterial color={vestColor} roughness={0.6} />
      </mesh>
      {/* High-Vis Vest Reflective Silver Stripes */}
      {!isResearcher && (
        <>
          <mesh position={[0, 1.22, 0.14]}>
            <boxGeometry args={[0.44, 0.06, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 1.05, 0.14]}>
            <boxGeometry args={[0.44, 0.06, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Vertical shoulder suspender stripes */}
          <mesh position={[-0.14, 1.25, 0.14]}>
            <boxGeometry args={[0.05, 0.24, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.14, 1.25, 0.14]}>
            <boxGeometry args={[0.05, 0.24, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </>
      )}

      {/* Researcher Field Satchel / Backpack */}
      {isResearcher && (
        <mesh position={[0, 1.18, -0.16]} castShadow>
          <boxGeometry args={[0.34, 0.42, 0.16]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      )}

      {/* ── 4. RECOGNIZABLE HEAD & POLISHED FACIAL FEATURES ── */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.14, 8]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.5} />
        </mesh>
        {/* Head Cranium */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.15, 14, 14]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
        </mesh>

        {/* Visible Facial Features: Nose & Eyes */}
        <mesh position={[0, 0.07, 0.15]} castShadow>
          <boxGeometry args={[0.04, 0.06, 0.04]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        {/* Left & Right Eyes */}
        <mesh position={[-0.05, 0.1, 0.14]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.05, 0.1, 0.14]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>

        {/* Headwear: Safety Hardhat or Safari Sun Hat */}
        {isResearcher ? (
          // Wide-brim Safari Field Sun Hat
          <group position={[0, 0.14, 0]}>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.16, 0.18, 0.14, 16]} />
              <meshStandardMaterial color={helmetColor} roughness={0.7} />
            </mesh>
            {/* Wide Brim */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.02, 16]} />
              <meshStandardMaterial color={helmetColor} roughness={0.7} />
            </mesh>
          </group>
        ) : (
          // Industrial Safety Hardhat with Peak & Headlamp
          <group position={[0, 0.14, 0]}>
            <mesh position={[0, 0.05, 0]} castShadow>
              <sphereGeometry args={[0.18, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={helmetColor} roughness={0.4} metalness={0.2} />
            </mesh>
            {/* Front Peak */}
            <mesh position={[0, 0.04, 0.1]}>
              <boxGeometry args={[0.26, 0.03, 0.12]} />
              <meshStandardMaterial color={helmetColor} roughness={0.4} />
            </mesh>
            {/* Mini Headlamp */}
            <mesh position={[0, 0.12, 0.18]}>
              <boxGeometry args={[0.08, 0.05, 0.04]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}
      </group>

      {/* ── 5. LEFT ARM & HAND ── */}
      <group ref={leftArmRef} position={[-0.28, 1.32, 0]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.44, 8]} />
          <meshStandardMaterial color={vestColor} />
        </mesh>
        {/* Forearm & Hand */}
        <mesh position={[0, -0.48, 0.06]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.38, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
      </group>

      {/* ── 6. RIGHT ARM WITH TABLET TOOL ── */}
      <group ref={rightArmRef} position={[0.28, 1.32, 0]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.44, 8]} />
          <meshStandardMaterial color={vestColor} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.48, 0.12]} rotation={[0.6, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.38, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
        {/* Hand holding Scientific Tablet */}
        <mesh position={[0, -0.68, 0.26]} rotation={[0.8, 0, 0]} castShadow>
          <boxGeometry args={[0.28, 0.38, 0.02]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Glowing Tablet Screen */}
        <mesh position={[0, -0.68, 0.275]} rotation={[0.8, 0, 0]}>
          <planeGeometry args={[0.24, 0.32]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  );
};

// Fluttering Team Wind Flag
const TeamWindFlag3D: React.FC<{
  position: [number, number, number];
  team: 'blue' | 'red';
}> = ({ position, team }) => {
  const clothRef = useRef<THREE.Mesh>(null);
  const flagColor = team === 'blue' ? '#0284c7' : '#dc2626';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (clothRef.current) {
      clothRef.current.rotation.y = 0.2 + Math.sin(t * 2.8) * 0.12;
      clothRef.current.scale.x = 1.0 + Math.sin(t * 3.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Flagpole Mast */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 9, 8]} />
        <primitive object={SOLAR_MATERIALS.machinerySteel} attach="material" />
      </mesh>
      {/* Finial Ball */}
      <mesh position={[0, 9.1, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
      </mesh>
      {/* Fluttering Cloth Banner */}
      <mesh ref={clothRef} position={[1.4, 7.8, 0]}>
        <planeGeometry args={[2.6, 1.4]} />
        <meshStandardMaterial color={flagColor} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Electric Maintenance Utility Cart with Roll Cage
const UtilityCart3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Chassis Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.45, 3.2]} />
        <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
      </mesh>
      {/* Cargo Bed */}
      <mesh position={[0, 0.85, -0.7]}>
        <boxGeometry args={[1.6, 0.35, 1.5]} />
        <primitive object={SOLAR_MATERIALS.machinerySteel} attach="material" />
      </mesh>
      {/* Roll Cage Pillars & Roof */}
      <mesh position={[0, 1.6, 0.4]}>
        <boxGeometry args={[1.6, 0.06, 1.5]} />
        <primitive object={SOLAR_MATERIALS.darkTitanium} attach="material" />
      </mesh>
      {/* 4 Wheels */}
      {[
        [-0.95, 0.3, 0.9],
        [0.95, 0.3, 0.9],
        [-0.95, 0.3, -0.9],
        [0.95, 0.3, -0.9],
      ].map(([wx, wy, wz], idx) => (
        <mesh key={idx} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.22, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      ))}
      {/* Warning Flashing Beacon */}
      <mesh position={[0, 1.7, 0.4]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
};

// ── TIME-CHECKING HOROLOGY OBSERVER (Checking Watch & Writing Notes) ──
interface TimeCheckerProps {
  position: [number, number, number];
  rotationY?: number;
  name: string;
}

const TimeCheckingObserver3D: React.FC<TimeCheckerProps> = ({ position, rotationY = 0 }) => {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const penRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Idle breathing
    if (rootRef.current) {
      rootRef.current.position.y = position[1] + Math.sin(t * 1.6 + position[0]) * 0.012;
    }

    // 8-Second Behavioral Loop: Check Watch -> Look at Sundial -> Write Notes
    const cycle = (t * 0.75 + position[0]) % 8;

    if (cycle < 3.0) {
      // Phase 1: Checking Wristwatch
      if (headRef.current) {
        headRef.current.rotation.x = 0.42; // Tilt down toward watch
        headRef.current.rotation.y = -0.22;
      }
      if (leftArmRef.current) {
        // Raise left forearm to chest level to show watch
        leftArmRef.current.rotation.x = -1.25 + Math.sin(t * 1.5) * 0.03;
        leftArmRef.current.rotation.y = 0.45;
        leftArmRef.current.rotation.z = -0.25;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.3;
        rightArmRef.current.rotation.z = -0.1;
      }
    } else if (cycle < 5.0) {
      // Phase 2: Looking up at Sundial / Sun
      if (headRef.current) {
        headRef.current.rotation.x = -0.18 + Math.sin(t * 1.2) * 0.04; // Look up
        headRef.current.rotation.y = 0.25;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.65;
        leftArmRef.current.rotation.y = 0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.4;
      }
    } else {
      // Phase 3: Writing observations onto clipboard
      if (headRef.current) {
        headRef.current.rotation.x = 0.38; // Look at clipboard
        headRef.current.rotation.y = 0.05;
      }
      if (leftArmRef.current) {
        // Holding clipboard steady in front
        leftArmRef.current.rotation.x = -0.75;
        leftArmRef.current.rotation.y = 0.2;
        leftArmRef.current.rotation.z = -0.1;
      }
      if (rightArmRef.current) {
        // Right hand holding pen and writing
        const writeStroke = Math.sin(t * 7.5) * 0.06;
        rightArmRef.current.rotation.x = -0.82 + writeStroke;
        rightArmRef.current.rotation.y = -0.15;
        rightArmRef.current.rotation.z = 0.15 + writeStroke * 0.5;
      }
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={[0, rotationY, 0]}>
      {/* ── 1. BOOTS & PANTS ── */}
      <mesh position={[-0.13, 0.14, 0.04]} castShadow>
        <boxGeometry args={[0.15, 0.28, 0.3]} />
        <meshStandardMaterial color="#3f2305" roughness={0.9} />
      </mesh>
      <mesh position={[0.13, 0.14, 0.04]} castShadow>
        <boxGeometry args={[0.15, 0.28, 0.3]} />
        <meshStandardMaterial color="#3f2305" roughness={0.9} />
      </mesh>

      <mesh position={[-0.13, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.62, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      <mesh position={[0.13, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.62, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[0.4, 0.14, 0.24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* ── 2. TORSO & KHAKI EXPEDITION SHIRT ── */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.44, 0.48, 0.24]} />
        <meshStandardMaterial color="#e2d4b7" roughness={0.7} />
      </mesh>
      {/* Chest Pocket & ID badge */}
      <mesh position={[-0.1, 1.22, 0.13]}>
        <boxGeometry args={[0.1, 0.12, 0.02]} />
        <meshStandardMaterial color="#c8b594" />
      </mesh>
      <mesh position={[0.1, 1.25, 0.13]}>
        <boxGeometry args={[0.08, 0.06, 0.02]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* ── 3. HEAD & SUN CAP ── */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.14, 8]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
        </mesh>
        {/* Facial features: nose & eyes */}
        <mesh position={[0, 0.07, 0.15]}>
          <boxGeometry args={[0.04, 0.05, 0.04]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        <mesh position={[-0.05, 0.1, 0.14]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.05, 0.1, 0.14]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        {/* Expedition Cap with Forward Sun Visor */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.17, 0.1, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.16, 0.14]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.24, 0.02, 0.14]} />
          <meshStandardMaterial color="#9a3412" roughness={0.6} />
        </mesh>
      </group>

      {/* ── 4. LEFT ARM WITH WRIST WATCH & CLIPBOARD ── */}
      <group ref={leftArmRef} position={[-0.26, 1.32, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.44, 8]} />
          <meshStandardMaterial color="#e2d4b7" />
        </mesh>
        <mesh position={[0, -0.46, 0.08]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.36, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
        {/* GOLDEN WRISTWATCH on left wrist! */}
        <mesh position={[0, -0.44, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Watch Dial Face */}
        <mesh position={[0, -0.44, 0.14]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.045, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Hand holding Field Clipboard / Logbook */}
        <mesh position={[0, -0.65, 0.22]} rotation={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.26, 0.36, 0.02]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* White Log Paper on Clipboard */}
        <mesh position={[0, -0.65, 0.235]} rotation={[0.6, 0, 0]}>
          <planeGeometry args={[0.22, 0.3]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* ── 5. RIGHT ARM WITH PEN / STYLUS WRITING NOTES ── */}
      <group ref={rightArmRef} position={[0.26, 1.32, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.44, 8]} />
          <meshStandardMaterial color="#e2d4b7" />
        </mesh>
        <mesh position={[0, -0.46, 0.1]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.36, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
        {/* Hand holding Pen */}
        <mesh position={[0, -0.62, 0.24]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
        {/* Slim Stylus / Ballpoint Pen */}
        <mesh ref={penRef} position={[0, -0.62, 0.28]} rotation={[0.8, 0, 0.3]}>
          <cylinderGeometry args={[0.012, 0.008, 0.16, 6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

export const HumanCrew3D: React.FC = () => {
  const blue = useSolarForgeStore((s) => s.blue);
  const red = useSolarForgeStore((s) => s.red);
  const forge = useSolarForgeStore((s) => s.solarForge);

  const isBlueActive = blue.isRotatingMirror || blue.lastFeedback === 'beam_aligned';
  const isRedActive = red.isRotatingMirror || red.lastFeedback === 'beam_aligned';
  const isForgeActive = forge.isFullyOperational || forge.powerLevel > 50;

  return (
    <group>
      {/* ── 1. RESEARCHER DR. ELENA CHEN AT SUNDIAL PLAZA ── */}
      <RecognizableHuman3D
        position={[3.8, 0, 8.2]}
        rotationY={-0.6}
        role="researcher"
        isReacting={isBlueActive || isRedActive}
      />

      {/* ── 2. OBSERVER 1: DR. RAYMOND SCOTT CHECKING WRISTWATCH & LOGGING TIME ── */}
      {/* Specifically checks watch time against sundial shadow and records it */}
      <TimeCheckingObserver3D
        name="Dr. Scott"
        position={[4.6, 0, 4.2]}
        rotationY={-0.45}
      />

      {/* ── 3. OBSERVER 2: MAYA LIN CHECKING WATCH & MEASURING SOLAR TIME ── */}
      {/* Compares solar progression and writes observations on clipboard */}
      <TimeCheckingObserver3D
        name="Maya Lin"
        position={[-6.2, 0, 7.2]}
        rotationY={0.55}
      />

      {/* ── 4. BLUE HELIO ENGINEER MARCUS AT WEST ARRAY ── */}
      <RecognizableHuman3D
        position={[-21.2, 0, -4.5]}
        rotationY={0.8}
        role="engineer_blue"
        isReacting={isBlueActive}
      />

      {/* ── 5. RED SOLAR ENGINEER KAVITA AT EAST ARRAY ── */}
      <RecognizableHuman3D
        position={[21.2, 0, -4.5]}
        rotationY={-0.8}
        role="engineer_red"
        isReacting={isRedActive}
      />

      {/* ── 6. SENIOR SYSTEMS DIRECTOR DR. HAYES AT CENTRAL FORGE ── */}
      <RecognizableHuman3D
        position={[-3.8, 0, -16.5]}
        rotationY={0.3}
        role="director"
        isReacting={isForgeActive}
      />

      {/* ── 7. FIELD MAINTENANCE SPECIALIST TARIQ ON SERVICE ROAD ── */}
      <RecognizableHuman3D
        position={[-12.5, 0, 4.2]}
        rotationY={1.2}
        role="maintenance"
        isReacting={isBlueActive}
      />

      {/* ── 8. TEAM WIND BANNERS & SERVICE VEHICLES ── */}
      <TeamWindFlag3D position={[-28, 0, 2]} team="blue" />
      <TeamWindFlag3D position={[28, 0, 2]} team="red" />
      <UtilityCart3D position={[-16, 0, 5]} rotationY={0.3} />
      <UtilityCart3D position={[16, 0, 5]} rotationY={-0.3} />
    </group>
  );
};
