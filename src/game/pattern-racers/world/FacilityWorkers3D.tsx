// ============================================================
// PATTERN RACERS — Stylized 3D Pit Crew & Marshals
// Round-Specific Physical Behaviors:
// - Round 1 (Garages): Telemetry typing & tool adjustments inside garages
// - Round 2 (Pit Lane): Kneeling tyre pressure inspection & thumbs-up ready signal
// - Round 3-4 (Grid Staging): Track marshals waving green flags from safety aprons
// - Round 5 & Live Race: Safely behind safety barriers
// ============================================================

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePatternStore } from '../store/patternStore';
import { FacilityWorker } from '../types';
import { PBR_MATERIALS } from './materials';

export const FacilityWorkers3D: React.FC = () => {
  const workers = usePatternStore((s) => s.workers);
  const phase = usePatternStore((s) => s.phase);
  const currentRound = usePatternStore((s) => s.currentRound);

  // During Live Grand Prix Race, marshals stand behind barriers
  if (phase === 'grand_prix_race') {
    return null;
  }

  // Filter workers visible for the current phase/round
  const activeWorkers = workers.filter((w) => {
    if (currentRound === 1) return w.targetRound === 1;
    if (currentRound === 2) return w.targetRound === 2;
    return w.targetRound === 3;
  });

  return (
    <group>
      {activeWorkers.map((worker, idx) => (
        <SingleWorker3D key={worker.id} worker={worker} animOffset={idx * 0.75} currentRound={currentRound} />
      ))}
    </group>
  );
};

interface SingleWorkerProps {
  worker: FacilityWorker;
  animOffset: number;
  currentRound: number;
}

const SingleWorker3D: React.FC<SingleWorkerProps> = ({ worker, animOffset, currentRound }) => {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  const vestMat =
    worker.role === 'telemetry'
      ? PBR_MATERIALS.workerVestCyan
      : worker.role === 'marshal'
      ? PBR_MATERIALS.workerVestOrange
      : worker.role === 'inspector'
      ? PBR_MATERIALS.workerVestYellow
      : PBR_MATERIALS.ledScreenPurple;

  const suitMat = worker.position[0] < 0 ? PBR_MATERIALS.workerSuitBlue : PBR_MATERIALS.workerSuitRed;

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 2.5 + animOffset;

    // Head scanning
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.6) * 0.25;
    }

    // Role-specific physical actions
    if (worker.role === 'telemetry' && leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -1.1 + Math.sin(t * 4) * 0.05;
      rightArmRef.current.rotation.x = -1.1 + Math.cos(t * 4) * 0.05;
    } else if (worker.role === 'inspector' && rightArmRef.current) {
      // Kneeling tire inspection / torque wrench tightening
      if (bodyRef.current) {
        bodyRef.current.position.y = -0.3 + Math.sin(t * 1.5) * 0.05;
      }
      rightArmRef.current.rotation.x = -0.8 + Math.sin(t * 3.5) * 0.3;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.6;
    } else if (worker.role === 'marshal' && rightArmRef.current) {
      // Waving green starting flag
      rightArmRef.current.rotation.z = 1.3 + Math.sin(t * 3.0) * 0.45;
    } else if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -0.7 + Math.sin(t * 2) * 0.15;
      rightArmRef.current.rotation.x = -0.9 + Math.cos(t * 2) * 0.15;
    }
  });

  return (
    <group ref={bodyRef} position={worker.position} rotation={[0, worker.rotationY, 0]}>
      {/* ── 1. LEGS & STEEL-TOE BOOTS ── */}
      {[-0.14, 0.14].map((x, i) => (
        <group key={`leg-${i}`} position={[x, 0, 0]}>
          <mesh position={[0, 0.38, 0]} castShadow material={suitMat}>
            <cylinderGeometry args={[0.08, 0.09, 0.72, 8]} />
          </mesh>
          <mesh position={[0, 0.06, 0.06]} castShadow material={PBR_MATERIALS.workerBoots}>
            <boxGeometry args={[0.16, 0.12, 0.26]} />
          </mesh>
        </group>
      ))}

      {/* ── 2. TORSO & HIGH-VISIBILITY SAFETY VEST ── */}
      <mesh position={[0, 1.05, 0]} castShadow material={vestMat}>
        <boxGeometry args={[0.48, 0.58, 0.32]} />
      </mesh>
      <mesh position={[0, 1.05, 0.165]}>
        <planeGeometry args={[0.42, 0.08]} />
        <meshBasicMaterial color="#f1f5f9" />
      </mesh>

      {/* ── 3. HEAD & SAFETY HARDHAT ── */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        <mesh castShadow material={PBR_MATERIALS.workerSkin}>
          <sphereGeometry args={[0.16, 8, 8]} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow material={PBR_MATERIALS.workerHardhat}>
          <sphereGeometry args={[0.18, 8, 8]} />
        </mesh>
        <mesh position={[0, 0.04, 0.12]} material={PBR_MATERIALS.workerHardhat}>
          <boxGeometry args={[0.26, 0.03, 0.12]} />
        </mesh>
      </group>

      {/* ── 4. ARTICULATED ARMS & PROPS ── */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.3, 1.25, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow material={suitMat}>
          <cylinderGeometry args={[0.065, 0.065, 0.44, 6]} />
        </mesh>
        <mesh position={[0, -0.46, 0]} castShadow material={PBR_MATERIALS.workerSkin}>
          <sphereGeometry args={[0.07, 6, 6]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.3, 1.25, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow material={suitMat}>
          <cylinderGeometry args={[0.065, 0.065, 0.44, 6]} />
        </mesh>
        <mesh position={[0, -0.46, 0]} castShadow material={PBR_MATERIALS.workerSkin}>
          <sphereGeometry args={[0.07, 6, 6]} />
        </mesh>

        {/* Flag for Marshal */}
        {worker.role === 'marshal' && (
          <group position={[0, -0.48, 0.4]} rotation={[0.8, 0, 0]}>
            <mesh position={[0, 0.35, 0]} material={PBR_MATERIALS.metalTruss}>
              <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
            </mesh>
            <mesh position={[0.3, 0.55, 0]}>
              <planeGeometry args={[0.55, 0.35]} />
              <meshBasicMaterial color="#22c55e" side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}

        {/* Diagnostic Tablet for Telemetry */}
        {worker.role === 'telemetry' && (
          <mesh position={[-0.2, -0.38, 0.25]} rotation={[0.4, 0, 0]} material={PBR_MATERIALS.ledScreenBlue}>
            <boxGeometry args={[0.32, 0.02, 0.24]} />
          </mesh>
        )}
      </group>
    </group>
  );
};
