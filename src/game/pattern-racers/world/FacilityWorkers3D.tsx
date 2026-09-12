// ============================================================
// PATTERN RACERS — Stylized 3D Facility Workers
// Animated Pit Engineers, Mechanics, Track Marshals & Telemetry Techs:
// - Anatomically Grounded Proportions (Soles resting firmly at y = 0)
// - High-Vis Vests, Hardhats with Peaks, Steel-Toe Work Boots
// - Individual Tools: Rugged Diagnostic Tablets, Torque Wrenches, Signal Batons, Clipboards
// - Cyclic Organic Animations: Typing, Flag Waving, Hydraulic Calibrations & Cheering
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
  const torsoRef = useRef<THREE.Group>(null);

  const vestColor =
    worker.role === 'telemetry'
      ? '#38bdf8' // Cyan Tech
      : worker.role === 'marshal'
        ? '#f97316' // Orange Safety Marshal
        : worker.role === 'inspector'
          ? '#eab308' // Yellow Inspector
          : worker.role === 'engineer'
            ? '#a855f7' // Purple Engineering Lead
            : '#22c55e'; // Green Pit Mechanic

  const helmetColor =
    worker.role === 'marshal'
      ? '#f97316'
      : worker.role === 'telemetry'
        ? '#0284c7'
        : '#ffffff';

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 2 + animOffset;

    // Subtle torso breathing
    if (torsoRef.current) {
      torsoRef.current.position.y = 0.85 + Math.sin(t * 0.8) * 0.01;
    }

    // Head natural scanning motion
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.6) * 0.3;
      headRef.current.rotation.x = Math.cos(t * 0.5) * 0.06;
    }

    // Role-specific organic limb animations
    if (worker.animationState === 'typing' && leftArmRef.current && rightArmRef.current) {
      // Hands typing on diagnostic tablet
      leftArmRef.current.rotation.x = -1.1 + Math.sin(t * 4) * 0.06;
      leftArmRef.current.rotation.y = 0.3;
      rightArmRef.current.rotation.x = -1.1 + Math.cos(t * 4) * 0.06;
      rightArmRef.current.rotation.y = -0.3;
    } else if (worker.animationState === 'waving' && rightArmRef.current) {
      // Marshal waving green checkered flag
      rightArmRef.current.rotation.z = 1.5 + Math.sin(t * 3.5) * 0.45;
      rightArmRef.current.rotation.x = -0.4 + Math.cos(t * 2) * 0.15;
    } else if (worker.animationState === 'working' && leftArmRef.current && rightArmRef.current) {
      // Mechanic tightening bolts / adjusting valves
      leftArmRef.current.rotation.x = -0.7 + Math.sin(t * 2.5) * 0.2;
      rightArmRef.current.rotation.x = -0.9 + Math.cos(t * 2.5) * 0.25;
      rightArmRef.current.rotation.z = -0.2;
    }
  });

  return (
    <group ref={groupRef} position={worker.position} rotation={[0, worker.rotationY, 0]}>
      {/* ── 1. GROUNDED BOOTS & LEGS (Boot sole is strictly at y = 0) ── */}
      {/* Left Leg & Boot */}
      <group position={[-0.14, 0, 0]}>
        {/* Boot Sole & Upper */}
        <mesh position={[0, 0.1, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.2, 0.28]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Trouser Leg */}
        <mesh position={[0, 0.46, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.52, 10]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
      </group>

      {/* Right Leg & Boot */}
      <group position={[0.14, 0, 0]}>
        {/* Boot Sole & Upper */}
        <mesh position={[0, 0.1, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.2, 0.28]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Trouser Leg */}
        <mesh position={[0, 0.46, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.52, 10]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
      </group>

      {/* ── 2. TORSO & HIGH-VISIBILITY SAFETY VEST ── */}
      <group ref={torsoRef} position={[0, 0.85, 0]}>
        {/* Dark Work Shirt / Undersuit */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.42, 0.48, 0.24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* High-Vis Safety Vest */}
        <mesh position={[0, 0.22, 0.01]} castShadow>
          <boxGeometry args={[0.44, 0.44, 0.26]} />
          <meshStandardMaterial color={vestColor} roughness={0.35} />
        </mesh>
        {/* Dual Reflective Silver Safety Strips */}
        <mesh position={[0, 0.28, 0.14]}>
          <planeGeometry args={[0.4, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.14, 0.14]}>
          <planeGeometry args={[0.4, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.9} />
        </mesh>

        {/* ── 3. HEAD & INDUSTRIAL SAFETY HELMET ── */}
        <group ref={headRef} position={[0, 0.58, 0]}>
          {/* Face */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.14, 14, 14]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.55} />
          </mesh>
          {/* Hardhat Dome */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <sphereGeometry args={[0.17, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={helmetColor} roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Hardhat Sun Peak */}
          <mesh position={[0, 0.06, 0.14]}>
            <boxGeometry args={[0.22, 0.025, 0.12]} />
            <meshStandardMaterial color={helmetColor} roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Radio Headset with Boom Mic */}
          <mesh position={[-0.14, 0.02, 0]}>
            <boxGeometry args={[0.04, 0.08, 0.08]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[-0.12, -0.04, 0.1]}>
            <cylinderGeometry args={[0.01, 0.01, 0.12, 6]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* ── 4. ARMS & SPECIALIZED TOOLS ── */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.26, 0.38, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.38, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Hand / Work Glove */}
          <mesh position={[0, -0.38, 0]} castShadow>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.7} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.26, 0.38, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.38, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Hand / Work Glove */}
          <mesh position={[0, -0.38, 0]} castShadow>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.7} />
          </mesh>

          {/* ── Handheld Tools Based On Role ── */}
          {worker.role === 'telemetry' && (
            <group position={[0, -0.4, 0.22]} rotation={[-Math.PI / 4, 0, 0]}>
              {/* Rugged Diagnostic Tablet */}
              <mesh castShadow>
                <boxGeometry args={[0.32, 0.03, 0.24]} />
                <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
              </mesh>
              {/* Illuminated Cyan Screen */}
              <mesh position={[0, 0.02, 0]}>
                <planeGeometry args={[0.28, 0.2]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          )}

          {worker.role === 'mechanic' && (
            <group position={[0, -0.42, 0.1]} rotation={[Math.PI / 3, 0, 0]}>
              {/* Heavy Chrome Torque Wrench */}
              <mesh castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.38, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
              </mesh>
              <mesh position={[0, 0.18, 0]}>
                <boxGeometry args={[0.08, 0.06, 0.05]} />
                <meshStandardMaterial color="#0284c7" roughness={0.3} />
              </mesh>
            </group>
          )}

          {worker.role === 'marshal' && (
            <group position={[0, -0.44, 0.1]} rotation={[Math.PI / 3, 0, 0]}>
              {/* Signal Flag Mast & Cloth */}
              <mesh castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
              <mesh position={[0.22, 0.2, 0]}>
                <planeGeometry args={[0.42, 0.28]} />
                <meshStandardMaterial color="#22c55e" side={THREE.DoubleSide} roughness={0.6} />
              </mesh>
            </group>
          )}

          {worker.role === 'engineer' && (
            <group position={[0, -0.4, 0.18]} rotation={[-Math.PI / 4, 0, 0]}>
              {/* Aluminum Clipboard with Telemetry Sheets */}
              <mesh castShadow>
                <boxGeometry args={[0.26, 0.02, 0.34]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.015, 0]}>
                <planeGeometry args={[0.22, 0.28]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
};
