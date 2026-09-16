// ============================================================
// GRAPHWORKS — THE DATA CITY: Engineered Architecture & Central Data Tower
// Commercial skyscrapers, circular civic plaza, and the iconic Central Data Tower.
// Completely overhauled with structural cantilever supports, mechanical brackets,
// gear-toothed drive rings, and deterministic 25°-30° mechanical indexing
// triggered by graph completion and team achievements.
// ============================================================
'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITY_GEO, CITY_MAT } from './CityMaterials';
import { useGraphworksStore } from '../store/graphworksStore';

export function CityArchitecture3D() {
  const blueCompleted = useGraphworksStore((s) => s.blue.completedMissions);
  const redCompleted = useGraphworksStore((s) => s.red.completedMissions);
  const blueScore = useGraphworksStore((s) => s.blue.totalScore);
  const redScore = useGraphworksStore((s) => s.red.totalScore);
  const blueAccuracy = useGraphworksStore((s) => s.blue.graphAccuracy);
  const redAccuracy = useGraphworksStore((s) => s.red.graphAccuracy);

  // Mechanical ring rotation targets for deterministic indexing
  const lowerRingAngle = useRef(0);
  const targetLowerRingAngle = useRef(0);
  const middleRingAngle = useRef(0.5);
  const targetMiddleRingAngle = useRef(0.5);
  const upperRingAngle = useRef(-0.3);
  const targetUpperRingAngle = useRef(-0.3);

  // Mechanical pulse state on graph success
  const corePulse = useRef(0);
  const targetCorePulse = useRef(0);

  // Track state changes to trigger authentic mechanical adjustments
  const prevBlueMissions = useRef(blueCompleted);
  const prevRedMissions = useRef(redCompleted);
  const prevBlueScore = useRef(blueScore);
  const prevRedScore = useRef(redScore);

  useEffect(() => {
    // When Blue team completes a mission or scores, Lower Ring indexes 30 degrees (PI / 6)
    if (blueCompleted > prevBlueMissions.current || blueScore > prevBlueScore.current) {
      targetLowerRingAngle.current += Math.PI / 6;
      targetCorePulse.current = 1.0;
      prevBlueMissions.current = blueCompleted;
      prevBlueScore.current = blueScore;
    }
  }, [blueCompleted, blueScore]);

  useEffect(() => {
    // When Red team completes a mission or scores, Middle Ring indexes 30 degrees (-PI / 6)
    if (redCompleted > prevRedMissions.current || redScore > prevRedScore.current) {
      targetMiddleRingAngle.current -= Math.PI / 6;
      targetCorePulse.current = 1.0;
      prevRedMissions.current = redCompleted;
      prevRedScore.current = redScore;
    }
  }, [redCompleted, redScore]);

  // Three.js object refs
  const lowerRingRef = useRef<THREE.Group>(null);
  const middleRingRef = useRef<THREE.Group>(null);
  const upperRingRef = useRef<THREE.Group>(null);
  const coreGlowMeshRef = useRef<THREE.Mesh>(null);
  const fountainJetsRef = useRef<THREE.Group>(null);

  // Modern procedural commercial skyscrapers
  const towers = useMemo(() => [
    // Center-left commercial skyscrapers
    { pos: [-6.5, 7, -8] as [number, number, number], size: [3.4, 14, 3.4] as [number, number, number], color: '#f8fafc', glassColor: '#38bdf8', floors: 12 },
    { pos: [-10.5, 5, -5] as [number, number, number], size: [2.8, 10, 2.8] as [number, number, number], color: '#ffffff', glassColor: '#67e8f9', floors: 8 },
    { pos: [-8, 4, -13] as [number, number, number], size: [3.2, 8, 3.2] as [number, number, number], color: '#e2e8f0', glassColor: '#38bdf8', floors: 6 },

    // Center-right commercial skyscrapers
    { pos: [6.5, 7, -8] as [number, number, number], size: [3.4, 14, 3.4] as [number, number, number], color: '#f8fafc', glassColor: '#f87171', floors: 12 },
    { pos: [10.5, 5, -5] as [number, number, number], size: [2.8, 10, 2.8] as [number, number, number], color: '#ffffff', glassColor: '#fb7185', floors: 8 },
    { pos: [8, 4, -13] as [number, number, number], size: [3.2, 8, 3.2] as [number, number, number], color: '#e2e8f0', glassColor: '#f87171', floors: 6 },

    // Distant background skyline
    { pos: [-16, 6, -18] as [number, number, number], size: [4.2, 12, 3.8] as [number, number, number], color: '#cbd5e1', glassColor: '#67e8f9', floors: 9 },
    { pos: [16, 6, -18] as [number, number, number], size: [4.2, 12, 3.8] as [number, number, number], color: '#cbd5e1', glassColor: '#fb7185', floors: 9 },
    { pos: [0, 6, -22] as [number, number, number], size: [5.0, 12, 4.0] as [number, number, number], color: '#e2e8f0', glassColor: '#38bdf8', floors: 9 },
  ], []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // ── 1. DETERMINISTIC MECHANICAL RING INDEXING (SMOOTH GEAR EASING) ──
    // Lower Ring: heavy gear drive indexing
    lowerRingAngle.current = THREE.MathUtils.damp(
      lowerRingAngle.current,
      targetLowerRingAngle.current,
      2.8, // Controlled mechanical gear traverse speed
      delta
    );
    if (lowerRingRef.current) {
      lowerRingRef.current.rotation.y = lowerRingAngle.current;
    }

    // Middle Ring: telemetry ring indexing
    middleRingAngle.current = THREE.MathUtils.damp(
      middleRingAngle.current,
      targetMiddleRingAngle.current,
      2.8,
      delta
    );
    if (middleRingRef.current) {
      middleRingRef.current.rotation.y = middleRingAngle.current;
    }

    // Upper Ring: fine optical azimuth micro-adjustments
    if (upperRingRef.current) {
      upperRingRef.current.rotation.y = upperRingAngle.current + Math.sin(t * 0.15) * 0.04;
    }

    // ── 2. CORE CONDUIT LUMINANCE PULSE ON MISSION SUCCESS ──
    corePulse.current = THREE.MathUtils.damp(corePulse.current, targetCorePulse.current, 4, delta);
    targetCorePulse.current = THREE.MathUtils.damp(targetCorePulse.current, 0, 1.2, delta); // Fade out over ~2.5s

    if (coreGlowMeshRef.current) {
      const mat = coreGlowMeshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.3 + corePulse.current * 1.5;
      }
    }

    // ── 3. PLAZA FOUNTAIN DANCING JETS ──
    if (fountainJetsRef.current) {
      fountainJetsRef.current.children.forEach((jet, i) => {
        const h = 0.5 + Math.sin(t * 3.2 + i * 0.8) * 0.3;
        jet.scale.set(1, Math.max(0.2, h), 1);
      });
    }
  });

  return (
    <group>
      {/* ── 1. CENTRAL CIVIC PLAZA & BOULEVARD ── */}
      <group position={[0, 0, 0]}>
        {/* Outer Circular Ring Road / Boulevard */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
          <ringGeometry args={[6.8, 10.2, 32]} />
          <primitive object={CITY_MAT.asphalt} attach="material" />
        </mesh>
        {/* Yellow centerline on circular road */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[8.45, 8.55, 32]} />
          <primitive object={CITY_MAT.roadMarkingYellow} attach="material" />
        </mesh>

        {/* Circular Plaza Island */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <circleGeometry args={[6.75, 32]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
        </mesh>

        {/* Radiating Granite Paver Bands */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((ri) => {
          const angle = (ri / 8) * Math.PI * 2;
          return (
            <mesh key={ri} rotation={[-Math.PI / 2, 0, angle]} position={[0, 0.035, 0]}>
              <planeGeometry args={[0.3, 6.7]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
            </mesh>
          );
        })}

        {/* Plaza Ornamental Flowerbeds */}
        {[0, 1, 2, 3].map((idx) => {
          const angle = (idx / 4) * Math.PI * 2 + Math.PI / 4;
          const px = Math.cos(angle) * 4.6;
          const pz = Math.sin(angle) * 4.6;
          return (
            <group key={idx} position={[px, 0.04, pz]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.1, 16]} />
                <meshStandardMaterial color="#22c55e" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[1.15, 1.15, 0.15, 16]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
              </mesh>
            </group>
          );
        })}

        {/* Central Fountain Pool */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[2.5, 2.6, 0.4, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.38, 0]}>
          <circleGeometry args={[2.35, 24]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.9} />
        </mesh>

        {/* Dancing Water Fountain Jets */}
        <group ref={fountainJetsRef} position={[0, 0.4, 0]}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 1.5, 0.4, Math.sin(angle) * 1.5]}>
                <cylinderGeometry args={[0.04, 0.08, 1.2, 6]} />
                <meshStandardMaterial color="#bae6fd" transparent opacity={0.75} roughness={0.1} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* ── 2. THE ENGINEERED CENTRAL DATA TOWER ── */}
      <group position={[0, 0, 0]}>
        {/* ── A. TOWER BASE & FOUNDATION PYLONS ── */}
        {/* Heavy Octagonal Foundation Plinth */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.8, 1.2, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Beveled Concrete Pedestal Collar */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[1.6, 2.2, 0.8, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.2} />
        </mesh>

        {/* 4 Structural Hydraulic Anchor Struts at Base */}
        {[0, 1, 2, 3].map((si) => {
          const sAngle = (si / 4) * Math.PI * 2 + Math.PI / 4;
          const sx = Math.cos(sAngle) * 1.8;
          const sz = Math.sin(sAngle) * 1.8;
          return (
            <group key={si} position={[sx, 0.8, sz]} rotation={[0, sAngle, 0]}>
              <mesh rotation={[0, 0, 0.45]} castShadow>
                <boxGeometry args={[0.2, 1.2, 0.2]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Hydraulic Collar */}
              <mesh position={[0.15, 0.35, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.3, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          );
        })}

        {/* ── B. CENTRAL TOWER CORE COLUMN ── */}
        {/* Fluted Titanium/Steel Core Mast */}
        <mesh position={[0, 6.2, 0]} castShadow>
          <cylinderGeometry args={[0.95, 1.35, 8.8, 16]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Vertical Structural Ribs on Core Column */}
        {[0, 1, 2, 3, 4, 5].map((ri) => {
          const rAngle = (ri / 6) * Math.PI * 2;
          const rx = Math.cos(rAngle) * 1.1;
          const rz = Math.sin(rAngle) * 1.1;
          return (
            <mesh key={ri} position={[rx, 6.2, rz]} rotation={[0, -rAngle, 0]}>
              <boxGeometry args={[0.08, 8.6, 0.15]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.25} />
            </mesh>
          );
        })}

        {/* Vertical Illuminated Telemetry Conduits (Blue Team Left, Red Team Right) */}
        <mesh position={[-1.02, 6.2, 0]} scale={[0.08, 8.4, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={CITY_MAT.blueTeamGlow} attach="material" />
        </mesh>
        <mesh position={[1.02, 6.2, 0]} scale={[0.08, 8.4, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={CITY_MAT.redTeamGlow} attach="material" />
        </mesh>

        {/* Central Core Luminescent Status Column (Pulses on Mission Success) */}
        <mesh ref={coreGlowMeshRef} position={[0, 6.2, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 8.2, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.35}
            transparent
            opacity={0.3}
            roughness={0.1}
          />
        </mesh>

        {/* ── C. STRUCTURAL DATA RING ASSEMBLY (WITH VISIBLE MOUNTING BRACKETS) ── */}

        {/* 1. LOWER RING: Heavy Primary Power & Metric Drive Ring (Y = 4.8) */}
        <group position={[0, 4.8, 0]}>
          {/* Static Cantilever Support Arms (Firmly anchored to core column) */}
          {[0, 1, 2, 3].map((ai) => {
            const aAngle = (ai / 4) * Math.PI * 2;
            const ax = Math.cos(aAngle) * 1.5;
            const az = Math.sin(aAngle) * 1.5;
            return (
              <group key={ai} position={[ax, 0, az]} rotation={[0, -aAngle, 0]}>
                {/* Horizontal Cantilever Beam */}
                <mesh position={[-0.4, 0, 0]} castShadow>
                  <boxGeometry args={[0.9, 0.16, 0.2]} />
                  <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Diagonal Gusset Support Strut */}
                <mesh position={[-0.5, -0.3, 0]} rotation={[0, 0, 0.55]}>
                  <boxGeometry args={[0.8, 0.12, 0.14]} />
                  <meshStandardMaterial color="#64748b" metalness={0.8} />
                </mesh>
                {/* Mechanical Guide Caliper / Roller Casing */}
                <mesh position={[0.05, 0, 0]} castShadow>
                  <boxGeometry args={[0.26, 0.32, 0.28]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
                </mesh>
              </group>
            );
          })}

          {/* Rotating Structural Ring (Indexes 30° on Blue graph completion) */}
          <group ref={lowerRingRef}>
            {/* Outer Structural Metal Ring Chassis */}
            <mesh castShadow>
              <cylinderGeometry args={[2.0, 2.0, 0.24, 28, 1, true]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Inner Ring Channel */}
            <mesh>
              <cylinderGeometry args={[1.88, 1.88, 0.2, 28, 1, true]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
            {/* Upper Flange Lip */}
            <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.86, 2.02, 28]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Lower Flange Lip */}
            <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.86, 2.02, 28]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
            </mesh>

            {/* Precision Mechanical Gear Teeth around Inner Rim */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((ti) => {
              const tAngle = (ti / 12) * Math.PI * 2;
              return (
                <mesh
                  key={ti}
                  position={[Math.cos(tAngle) * 1.9, 0, Math.sin(tAngle) * 1.9]}
                  rotation={[0, -tAngle, 0]}
                >
                  <boxGeometry args={[0.06, 0.18, 0.08]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
                </mesh>
              );
            })}

            {/* Blue Team Telemetry Status Blocks on Ring */}
            <mesh position={[-1.96, 0, 0]}>
              <boxGeometry args={[0.1, 0.14, 0.4]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0284c7"
                emissiveIntensity={blueAccuracy > 0 ? 1.4 : 0.4}
              />
            </mesh>
            {/* Red Team Telemetry Status Blocks on Ring */}
            <mesh position={[1.96, 0, 0]}>
              <boxGeometry args={[0.1, 0.14, 0.4]} />
              <meshStandardMaterial
                color="#dc2626"
                emissive="#dc2626"
                emissiveIntensity={redAccuracy > 0 ? 1.4 : 0.4}
              />
            </mesh>
          </group>
        </group>

        {/* 2. MIDDLE RING: High-Precision Telemetry Calibration Ring (Y = 6.6) */}
        <group position={[0, 6.6, 0]}>
          {/* Static Cantilever Support Arms */}
          {[0, 1, 2].map((ai) => {
            const aAngle = (ai / 3) * Math.PI * 2 + Math.PI / 6;
            const ax = Math.cos(aAngle) * 1.4;
            const az = Math.sin(aAngle) * 1.4;
            return (
              <group key={ai} position={[ax, 0, az]} rotation={[0, -aAngle, 0]}>
                <mesh position={[-0.35, 0, 0]} castShadow>
                  <boxGeometry args={[0.8, 0.14, 0.18]} />
                  <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
                </mesh>
                <mesh position={[0.05, 0, 0]}>
                  <boxGeometry args={[0.22, 0.28, 0.24]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.7} />
                </mesh>
              </group>
            );
          })}

          {/* Rotating Titanium Telemetry Ring (Indexes -30° on Red graph completion) */}
          <group ref={middleRingRef}>
            <mesh castShadow>
              <cylinderGeometry args={[1.7, 1.7, 0.2, 24, 1, true]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.58, 1.72, 24]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.58, 1.72, 24]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Embedded Optical Data Nodes around Ring */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((oi) => {
              const oAngle = (oi / 8) * Math.PI * 2;
              return (
                <mesh
                  key={oi}
                  position={[Math.cos(oAngle) * 1.71, 0, Math.sin(oAngle) * 1.71]}
                  rotation={[0, -oAngle, 0]}
                >
                  <boxGeometry args={[0.04, 0.08, 0.12]} />
                  <meshStandardMaterial
                    color={oi % 2 === 0 ? '#38bdf8' : '#34d399'}
                    emissive={oi % 2 === 0 ? '#0284c7' : '#059669'}
                    emissiveIntensity={0.8}
                  />
                </mesh>
              );
            })}
          </group>
        </group>

        {/* 3. UPPER RING: Azimuth Grid Sensor Ring (Y = 8.4) */}
        <group position={[0, 8.4, 0]}>
          {/* Static Mounting Trusses */}
          {[0, 1, 2, 3].map((ai) => {
            const aAngle = (ai / 4) * Math.PI * 2;
            const ax = Math.cos(aAngle) * 1.25;
            const az = Math.sin(aAngle) * 1.25;
            return (
              <mesh key={ai} position={[ax, 0, az]} rotation={[0, -aAngle, 0]}>
                <boxGeometry args={[0.5, 0.12, 0.15]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} />
              </mesh>
            );
          })}

          {/* Micro-Calibrating Azimuth Ring */}
          <group ref={upperRingRef}>
            <mesh castShadow>
              <cylinderGeometry args={[1.45, 1.45, 0.16, 24, 1, true]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.36, 1.46, 24]} />
              <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.4} />
            </mesh>
          </group>
        </group>

        {/* ── D. UPPER TOWER & PANORAMIC OBSERVATION SAUCER ── */}
        {/* Saucer Lower Bevel */}
        <mesh position={[0, 10.1, 0]} castShadow>
          <cylinderGeometry args={[3.2, 2.2, 1.2, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.3} />
        </mesh>

        {/* 360° Viewing Glass Ribbon */}
        <mesh position={[0, 10.4, 0]}>
          <cylinderGeometry args={[3.22, 2.8, 0.8, 24]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#0284c7"
            emissiveIntensity={0.35}
            transparent
            opacity={0.88}
            roughness={0.1}
          />
        </mesh>

        {/* Structural Glass Mullions */}
        {[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11].map((mi) => {
          const mAngle = (mi / 12) * Math.PI * 2;
          return (
            <mesh
              key={mi}
              position={[Math.cos(mAngle) * 3.05, 10.4, Math.sin(mAngle) * 3.05]}
              rotation={[0, -mAngle, 0]}
            >
              <boxGeometry args={[0.08, 0.82, 0.06]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          );
        })}

        {/* Upper Observation Saucer Roof */}
        <mesh position={[0, 11.1, 0]} castShadow>
          <cylinderGeometry args={[2.0, 3.28, 0.5, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* ── E. COMMUNICATIONS SPIRE & AERIAL ARRAY ── */}
        <mesh position={[0, 13.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.28, 4.2, 8]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Crossarms on Spire */}
        <mesh position={[0, 14.2, 0]}>
          <boxGeometry args={[1.2, 0.06, 0.06]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        <mesh position={[0, 14.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.9, 0.05, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>

        {/* High-Intensity Daylight Navigational Beacon */}
        <mesh position={[0, 15.6, 0]}>
          <sphereGeometry args={[0.2, 14, 14]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* ── 3. MODERN METROPOLITAN SKYSCRAPERS ── */}
      <group>
        {towers.map((t, idx) => (
          <group key={idx} position={t.pos}>
            {/* Main Tower Core */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={t.size} />
              <meshStandardMaterial color={t.color} roughness={0.35} metalness={0.15} />
            </mesh>

            {/* Architectural Glass Curtain Wall Insets */}
            <mesh position={[0, 0, t.size[2] / 2 + 0.02]} scale={[t.size[0] * 0.85, t.size[1] * 0.88, 0.05]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color={t.glassColor}
                emissive={t.glassColor}
                emissiveIntensity={0.2}
                roughness={0.1}
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh position={[t.size[0] / 2 + 0.02, 0, 0]} scale={[0.05, t.size[1] * 0.88, t.size[2] * 0.85]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color={t.glassColor}
                emissive={t.glassColor}
                emissiveIntensity={0.2}
                roughness={0.1}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Penthouse Rooftop Box / Helipad */}
            <mesh position={[0, t.size[1] / 2 + 0.35, 0]}>
              <boxGeometry args={[t.size[0] * 0.65, 0.7, t.size[2] * 0.65]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
            {/* Rooftop Antenna Spire */}
            {idx % 2 === 0 && (
              <mesh position={[0, t.size[1] / 2 + 1.8, 0]}>
                <cylinderGeometry args={[0.03, 0.08, 2.4, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}
