// ============================================================
// GRAPHWORKS — THE DATA CITY: Architecture & Central Data Tower
// Modern skyscrapers, glass towers, circular civic plaza, and the
// iconic Data Tower with live pulsing team status data rings.
// ============================================================
'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITY_GEO, CITY_MAT, CITY_COLORS } from './CityMaterials';
import { useGraphworksStore } from '../store/graphworksStore';

export function CityArchitecture3D() {
  const blueCityLevel = useGraphworksStore((s) => s.blue.cityLevel);
  const redCityLevel = useGraphworksStore((s) => s.red.cityLevel);
  const blueAccuracy = useGraphworksStore((s) => s.blue.graphAccuracy);
  const redAccuracy = useGraphworksStore((s) => s.red.graphAccuracy);

  const dataRingsRef = useRef<THREE.Group>(null);
  const fountainJetsRef = useRef<THREE.Group>(null);

  // Modern procedural skyscrapers
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

  // Frame animation for Data Tower pulsing and fountain jets
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (dataRingsRef.current) {
      // Rotate data rings gently
      dataRingsRef.current.children.forEach((ring, i) => {
        ring.rotation.y = t * (0.3 + i * 0.15) * (i % 2 === 0 ? 1 : -1);
      });
    }

    if (fountainJetsRef.current) {
      fountainJetsRef.current.children.forEach((jet, i) => {
        const h = 0.5 + Math.sin(t * 3.5 + i * 0.8) * 0.35;
        jet.scale.set(1, Math.max(0.2, h), 1);
      });
    }
  });

  return (
    <group>
      {/* ── 1. CENTRAL CIVIC PLAZA & CIRCULAR BOULEVARD ── */}
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

      {/* ── 2. THE ICONIC DATA TOWER (CENTRAL MONUMENT) ── */}
      <group position={[0, 0, 0]}>
        {/* Tower Pedestal Base */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[1.5, 2.0, 2.0, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Aerodynamic Fluted Shaft */}
        <mesh position={[0, 6.0, 0]} castShadow>
          <cylinderGeometry args={[0.9, 1.3, 8.0, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.4} />
        </mesh>

        {/* Vertical Blue/Red LED Conduit Grooves */}
        <mesh position={[-0.92, 6.0, 0]} scale={[0.08, 7.8, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={CITY_MAT.blueTeamGlow} attach="material" />
        </mesh>
        <mesh position={[0.92, 6.0, 0]} scale={[0.08, 7.8, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={CITY_MAT.redTeamGlow} attach="material" />
        </mesh>

        {/* Panoramic Observation Deck (Saucer) */}
        <mesh position={[0, 10.2, 0]} castShadow>
          <cylinderGeometry args={[3.2, 2.4, 1.4, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* 360° Viewing Glass Ribbon */}
        <mesh position={[0, 10.2, 0]}>
          <cylinderGeometry args={[3.22, 2.42, 0.7, 24]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            transparent
            opacity={0.85}
            roughness={0.1}
          />
        </mesh>
        {/* Upper Observation Saucer Roof */}
        <mesh position={[0, 11.2, 0]} castShadow>
          <cylinderGeometry args={[1.8, 3.25, 0.6, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>

        {/* Communications Spire & Aerial Array */}
        <mesh position={[0, 13.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.25, 4.2, 8]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 15.8, 0]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} />
        </mesh>

        {/* Dynamic Holographic Data Status Rings */}
        <group ref={dataRingsRef} position={[0, 7.0, 0]}>
          {/* Blue Team Upper Data Ring */}
          <mesh position={[0, 2.0, 0]}>
            <torusGeometry args={[1.5, 0.08, 8, 24]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={blueAccuracy > 0 ? 1.2 : 0.4}
            />
          </mesh>
          {/* Green Efficiency Center Ring */}
          <mesh position={[0, 0.5, 0]}>
            <torusGeometry args={[1.7, 0.08, 8, 24]} />
            <meshStandardMaterial color="#4ade80" emissive="#16a34a" emissiveIntensity={0.8} />
          </mesh>
          {/* Red Team Lower Data Ring */}
          <mesh position={[0, -1.0, 0]}>
            <torusGeometry args={[1.9, 0.08, 8, 24]} />
            <meshStandardMaterial
              color="#f87171"
              emissive="#dc2626"
              emissiveIntensity={redAccuracy > 0 ? 1.2 : 0.4}
            />
          </mesh>
        </group>
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
                emissiveIntensity={0.25}
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
                emissiveIntensity={0.25}
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
                <cylinderGeometry args={[0.04, 0.08, 2.2, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}
