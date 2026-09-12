// ============================================================
// PATTERN RACERS — Stylized 3D Facility Workers
// Animated Pit Engineers, Mechanics, Track Marshals & Telemetry Techs:
// - Anatomical Proportions with High-Vis Vests, Helmets & Boots
// - Individual Tools: Rugged Laptops, Torque Wrenches, Signal Batons
// - Offset Cyclic Animations: Typing, Waving, Inspecting & Cheering
// ============================================================

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePatternStore } from '../store/patternStore';
import { FacilityWorker } from '../types';

export const FacilityWorkers3D: React.FC = () => {
  const workers = usePatternStore((s) => s.workers);

  return (
    <group>
      {workers.map((worker, idx) => (
        <SingleWorker3D key={worker.id} worker={worker} animOffset={idx * 0.75} />
      ))}
    </group>
  );
};

interface SingleWorkerProps {
  worker: FacilityWorker;
  animOffset: number;
}

const SingleWorker3D: React.FC<SingleWorkerProps> = ({ worker, animOffset }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const vestColor =
    worker.role === 'telemetry'
      ? '#38bdf8' // Cyan
      : worker.role === 'marshal'
        ? '#f97316' // Orange
        : worker.role === 'inspector'
          ? '#eab308' // Yellow
          : '#22c55e'; // Green mechanic

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 2 + animOffset;

    // Head subtle look around
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
      headRef.current.rotation.x = Math.cos(t * 0.4) * 0.08;
    }

    // Role-specific arm motions
    if (worker.animationState === 'typing' && leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -0.9 + Math.sin(t * 4) * 0.08;
      rightArmRef.current.rotation.x = -0.9 + Math.cos(t * 4) * 0.08;
    } else if (worker.animationState === 'waving' && rightArmRef.current) {
      rightArmRef.current.rotation.z = 1.6 + Math.sin(t * 3) * 0.4;
      rightArmRef.current.rotation.x = -0.3;
    } else if (worker.animationState === 'working' && leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -0.6 + Math.sin(t * 2) * 0.2;
      rightArmRef.current.rotation.x = -0.8 + Math.cos(t * 2) * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={worker.position} rotation={[0, worker.rotationY, 0]}>
      {/* ── 1. BOOTS & LEGS ── */}
      {/* Left Boot & Pant */}
      <group position={[-0.14, 0.4, 0]}>
        <mesh position={[0, -0.28, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.22, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
      </group>

      {/* Right Boot & Pant */}
      <group position={[0.14, 0.4, 0]}>
        <mesh position={[0, -0.28, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.22, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
      </group>

      {/* ── 2. TORSO & HIGH-VISIBILITY SAFETY VEST ── */}
      <group position={[0, 0.95, 0]}>
        {/* Inner Work Shirt */}
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.55, 0.24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* High-Vis Vest */}
        <mesh position={[0, 0, 0.01]} castShadow>
          <boxGeometry args={[0.44, 0.5, 0.26]} />
          <meshStandardMaterial color={vestColor} roughness={0.4} />
        </mesh>
        {/* Reflective Silver Strips */}
        <mesh position={[0, 0.06, 0.14]}>
          <planeGeometry args={[0.4, 0.06]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* ── 3. HEAD & SAFETY HELMET ── */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        {/* Face / Skin */}
        <mesh castShadow>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
        {/* White Safety Helmet */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <sphereGeometry args={[0.18, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Helmet Peak */}
        <mesh position={[0, 0.06, 0.14]}>
          <boxGeometry args={[0.22, 0.03, 0.12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>

      {/* ── 4. ARMS & TOOL ACCESSORIES ── */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.26, 1.15, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.44, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.46, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.26, 1.15, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.44, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Hand with Tool */}
        <mesh position={[0, -0.46, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
        {/* Role Accessory */}
        {worker.role === 'telemetry' && (
          <group position={[0, -0.46, 0.2]} rotation={[-Math.PI / 4, 0, 0]}>
            {/* Rugged Field Laptop */}
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.03, 0.22]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.1, -0.1]} rotation={[Math.PI / 3, 0, 0]}>
              <boxGeometry args={[0.3, 0.2, 0.02]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
            </mesh>
          </group>
        )}
        {worker.role === 'marshal' && (
          <mesh position={[0, -0.52, 0.1]} rotation={[Math.PI / 3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} />
          </mesh>
        )}
      </group>
    </group>
  );
};
