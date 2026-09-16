// ============================================================
// GRAPHWORKS — THE DATA CITY: Engineered Architecture & Central Data Tower
// Master 5-Question City-Building Simulation Architecture:
// 1. Stage 0 (Start): Unbuilt foundation slab with safety striping,
//    rebar columns, safety cones, and construction crane.
// 2. Stage 2: Market Building physically completes (Foundation -> Frame ->
//    Walls -> Roof -> Striped Awnings -> 4 Stalls -> Illuminated Sign -> Open!)
// 3. Stage 5: Full Central Data Tower superstructure powers up, mechanical
//    rings lock in, observation saucer illuminates, skyscrapers complete!
// 4. Victory: Winning team's graph becomes final city blueprint. Tower projects
//    glorious 3D sky title: "★ BLUE CITY ★" or "★ RED CITY ★"!
// ============================================================
'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITY_GEO, CITY_MAT } from './CityMaterials';
import { useGraphworksStore, type Team } from '../store/graphworksStore';

// Helper to create glowing floating sky proclamation banner texture
function createSkyProclamationTexture(text: string, color: string, glowColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark translucent background badge
  ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
  ctx.beginPath();
  ctx.roundRect(20, 20, 984, 216, 42);
  ctx.fill();

  // Double neon border
  ctx.strokeStyle = color;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.roundRect(20, 20, 984, 216, 42);
  ctx.stroke();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(32, 32, 960, 192, 34);
  ctx.stroke();

  // Vibrant text with glow
  ctx.font = '900 82px "Inter", -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 36;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, 512, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ── 1. 3D SKY CITY PROCLAMATION (ARCHITECTURAL DISPLAY PROJECTED FROM TOWER) ──
function SkyCityProclamation3D({ winner }: { winner: Team | 'tie' }) {
  const isBlue = winner !== 'red';
  const themeColor = isBlue ? '#38bdf8' : '#f87171';
  const glowColor = isBlue ? '#0284c7' : '#dc2626';
  const labelText = isBlue ? '★  BLUE CITY  ★' : '★  RED CITY  ★';

  const skyTexture = useMemo(
    () => createSkyProclamationTexture(labelText, themeColor, glowColor),
    [labelText, themeColor, glowColor]
  );

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating hover & micro-bobbing in sky
      groupRef.current.position.y = 21.5 + Math.sin(t * 1.5) * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 21.5, 0]}>
      {/* 4 Upward Volumetric Projection Beams from Data Tower Saucer */}
      {[-3.2, -1.1, 1.1, 3.2].map((bx, idx) => (
        <mesh key={idx} position={[bx, -5.5, 0]} rotation={[0, 0, (idx - 1.5) * 0.05]}>
          <cylinderGeometry args={[0.08, 0.45, 11, 8]} />
          <meshBasicMaterial color={themeColor} transparent opacity={0.35} />
        </mesh>
      ))}

      {/* Holographic Projection Plinth */}
      <mesh position={[0, 0, 0]} castShadow>
        <planeGeometry args={[13.5, 3.4]} />
        <meshBasicMaterial map={skyTexture} transparent opacity={0.96} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating 3D Star Beacons */}
      <mesh position={[-7.2, 0, 0]}>
        <octahedronGeometry args={[0.55]} />
        <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[7.2, 0, 0]}>
        <octahedronGeometry args={[0.55]} />
        <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

// ── 2. MARKET DISTRICT BUILDING (QUESTION 2 PHYSICAL MILESTONE) ──
function MarketDistrictBuilding({ stage, winningBlueprint }: { stage: number; winningBlueprint: Team | 'tie' | null }) {
  const isComplete = stage >= 2;
  const isBlueWin = winningBlueprint === 'blue';
  const isRedWin = winningBlueprint === 'red';

  const roofColor = isBlueWin ? '#0284c7' : isRedWin ? '#dc2626' : '#78350f';

  return (
    <group position={[-11.5, 0, 1.2]}>
      {/* Foundation Concrete Base Pad */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[7.2, 0.2, 5.0]} />
        <primitive object={CITY_MAT.concrete} attach="material" />
      </mesh>

      {!isComplete ? (
        // ── STAGE 0–1: UNBUILT FOUNDATION & CONSTRUCTION ZONE ──
        <group>
          {/* Yellow/Black Safety Striping on Slab Perimeter */}
          {[-3.4, 3.4].map((px) => (
            <mesh key={px} position={[px, 0.22, 0]}>
              <boxGeometry args={[0.25, 0.04, 4.8]} />
              <primitive object={CITY_MAT.hazardStripe} attach="material" />
            </mesh>
          ))}
          {/* Construction Scaffolding Framework */}
          {[-2.5, 0, 2.5].map((sx) => (
            <group key={sx} position={[sx, 0, 0]}>
              <mesh position={[0, 1.2, -1.8]}>
                <cylinderGeometry args={[0.04, 0.04, 2.4, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
              <mesh position={[0, 1.2, 1.8]}>
                <cylinderGeometry args={[0.04, 0.04, 2.4, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
            </group>
          ))}
          {/* Lumber Stacks & Construction Pallets */}
          <mesh position={[-1.2, 0.35, -0.6]} castShadow>
            <boxGeometry args={[1.4, 0.45, 0.9]} />
            <meshStandardMaterial color="#b45309" roughness={0.9} />
          </mesh>
          {/* Surveyor Tripod */}
          <group position={[1.5, 0.2, 0.8]}>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.02, 0.22, 1.1, 3]} />
              <meshStandardMaterial color="#eab308" metalness={0.6} />
            </mesh>
            <mesh position={[0, 1.15, 0]}>
              <boxGeometry args={[0.2, 0.15, 0.2]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>
          {/* Safety Cones */}
          {[-2.8, -1.4, 1.4, 2.8].map((cx, i) => (
            <mesh key={i} position={[cx, 0.3, 2.2]}>
              <cylinderGeometry args={[0.02, 0.12, 0.45, 8]} />
              <meshStandardMaterial color="#f97316" roughness={0.4} />
            </mesh>
          ))}
          {/* Future Site Notice Board */}
          <group position={[0, 0.8, 2.0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.8, 0.8, 0.06]} />
              <meshStandardMaterial color="#fef08a" />
            </mesh>
            <mesh position={[0, 0.5, 0.04]}>
              <boxGeometry args={[1.6, 0.18, 0.02]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
        </group>
      ) : (
        // ── STAGE 2+: FULLY COMPLETED MARKET HALL & 4 STALLS ──
        <group>
          {/* Timber Columns & Framework */}
          {[-3.0, -1.0, 1.0, 3.0].map((cx) => (
            <React.Fragment key={cx}>
              <mesh position={[cx, 1.4, -2.0]} castShadow>
                <boxGeometry args={[0.22, 2.6, 0.22]} />
                <meshStandardMaterial color="#451a03" roughness={0.7} />
              </mesh>
              <mesh position={[cx, 1.4, 2.0]} castShadow>
                <boxGeometry args={[0.22, 2.6, 0.22]} />
                <meshStandardMaterial color="#451a03" roughness={0.7} />
              </mesh>
            </React.Fragment>
          ))}

          {/* Pitched Wooden Roof with Trim */}
          <mesh position={[0, 3.1, 0]} rotation={[0, 0, 0]} castShadow>
            <coneGeometry args={[4.4, 1.6, 4]} />
            <meshStandardMaterial color={roofColor} roughness={0.6} />
          </mesh>

          {/* Illuminated Overhead Sign: "★ CITY MARKET ★" */}
          <group position={[0, 2.8, 2.1]}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[4.2, 0.55, 0.12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.07]}>
              <boxGeometry args={[4.0, 0.42, 0.04]} />
              <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* 4 DISTINCT MARKET STALLS */}
          {/* Stall 1: PRODUCE (Green/White Awnings + Crates) */}
          <group position={[-2.2, 0.2, 0.8]}>
            {/* Counter */}
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[1.3, 0.7, 0.9]} />
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </mesh>
            {/* Striped Awning */}
            <mesh position={[0, 1.5, 0.5]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[1.35, 0.06, 0.9]} />
              <meshStandardMaterial color="#16a34a" roughness={0.5} />
            </mesh>
            {/* Green and Red Produce Crates */}
            <mesh position={[-0.3, 0.85, 0]}>
              <boxGeometry args={[0.45, 0.18, 0.35]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
            <mesh position={[0.3, 0.85, 0]}>
              <boxGeometry args={[0.45, 0.18, 0.35]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>

          {/* Stall 2: BAKERY (Golden/White Awnings + Loaves) */}
          <group position={[-0.7, 0.2, 0.8]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[1.3, 0.7, 0.9]} />
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.5, 0.5]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[1.35, 0.06, 0.9]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.5} />
            </mesh>
            {/* Bread Loaves Display */}
            <mesh position={[0, 0.85, 0]}>
              <boxGeometry args={[0.85, 0.16, 0.35]} />
              <meshStandardMaterial color="#d97706" roughness={0.9} />
            </mesh>
          </group>

          {/* Stall 3: CAFE (Cyan/White Awnings + Coffee Cups) */}
          <group position={[0.8, 0.2, 0.8]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[1.3, 0.7, 0.9]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.5, 0.5]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[1.35, 0.06, 0.9]} />
              <meshStandardMaterial color="#0284c7" roughness={0.5} />
            </mesh>
            {/* Espresso Machine */}
            <mesh position={[0.25, 0.92, 0]}>
              <boxGeometry args={[0.32, 0.28, 0.28]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          </group>

          {/* Stall 4: FLORIST (Rose/Pink Awnings + Flower Buckets) */}
          <group position={[2.3, 0.2, 0.8]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[1.3, 0.7, 0.9]} />
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.5, 0.5]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[1.35, 0.06, 0.9]} />
              <meshStandardMaterial color="#ec4899" roughness={0.5} />
            </mesh>
            {/* Flower Buckets */}
            {[-0.3, 0.3].map((bx, bi) => (
              <mesh key={bi} position={[bx, 0.85, 0]}>
                <cylinderGeometry args={[0.12, 0.08, 0.22, 8]} />
                <meshStandardMaterial color={bi === 0 ? '#f43f5e' : '#a855f7'} />
              </mesh>
            ))}
          </group>

          {/* Outdoor Cafe Seating Tables */}
          {[-2.0, 2.0].map((tx) => (
            <group key={tx} position={[tx, 0.1, 3.2]}>
              <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.45, 0.45, 0.04, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.17, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}

export function CityArchitecture3D() {
  const cityStage = useGraphworksStore((s) => s.cityStage);
  const winningBlueprint = useGraphworksStore((s) => s.winningBlueprint);
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const blueCompleted = useGraphworksStore((s) => s.blue.completedMissions);
  const redCompleted = useGraphworksStore((s) => s.red.completedMissions);
  const blueScore = useGraphworksStore((s) => s.blue.totalScore);
  const redScore = useGraphworksStore((s) => s.red.totalScore);

  // Mechanical ring rotation targets for deterministic indexing
  const lowerRingAngle = useRef(0);
  const targetLowerRingAngle = useRef(0);
  const middleRingAngle = useRef(0.5);
  const targetMiddleRingAngle = useRef(0.5);
  const upperRingAngle = useRef(-0.3);

  // Mechanical pulse state on graph success
  const corePulse = useRef(0);
  const targetCorePulse = useRef(0);

  const prevBlueMissions = useRef(blueCompleted);
  const prevRedMissions = useRef(redCompleted);
  const prevBlueScore = useRef(blueScore);
  const prevRedScore = useRef(redScore);

  useEffect(() => {
    if (blueCompleted > prevBlueMissions.current || blueScore > prevBlueScore.current) {
      targetLowerRingAngle.current += Math.PI / 6;
      targetCorePulse.current = 1.0;
      prevBlueMissions.current = blueCompleted;
      prevBlueScore.current = blueScore;
    }
  }, [blueCompleted, blueScore]);

  useEffect(() => {
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

  // Skyscrapers definition: glassColor dynamically shifts on winningBlueprint
  const towers = useMemo(() => {
    const isBlueWin = winningBlueprint === 'blue';
    const isRedWin = winningBlueprint === 'red';

    const getGlass = (defaultCol: string) => {
      if (isBlueWin) return '#38bdf8';
      if (isRedWin) return '#f87171';
      return defaultCol;
    };

    return [
      { pos: [-6.5, 7, -8] as [number, number, number], size: [3.4, 14, 3.4] as [number, number, number], color: '#f8fafc', glassColor: getGlass('#38bdf8'), minStage: 2 },
      { pos: [-10.5, 5, -5] as [number, number, number], size: [2.8, 10, 2.8] as [number, number, number], color: '#ffffff', glassColor: getGlass('#67e8f9'), minStage: 0 },
      { pos: [-8, 4, -13] as [number, number, number], size: [3.2, 8, 3.2] as [number, number, number], color: '#e2e8f0', glassColor: getGlass('#38bdf8'), minStage: 4 },
      { pos: [6.5, 7, -8] as [number, number, number], size: [3.4, 14, 3.4] as [number, number, number], color: '#f8fafc', glassColor: getGlass('#f87171'), minStage: 2 },
      { pos: [10.5, 5, -5] as [number, number, number], size: [2.8, 10, 2.8] as [number, number, number], color: '#ffffff', glassColor: getGlass('#fb7185'), minStage: 0 },
      { pos: [8, 4, -13] as [number, number, number], size: [3.2, 8, 3.2] as [number, number, number], color: '#e2e8f0', glassColor: getGlass('#f87171'), minStage: 4 },
      { pos: [-16, 6, -18] as [number, number, number], size: [4.2, 12, 3.8] as [number, number, number], color: '#cbd5e1', glassColor: getGlass('#67e8f9'), minStage: 5 },
      { pos: [16, 6, -18] as [number, number, number], size: [4.2, 12, 3.8] as [number, number, number], color: '#cbd5e1', glassColor: getGlass('#fb7185'), minStage: 5 },
      { pos: [0, 6, -22] as [number, number, number], size: [5.0, 12, 4.0] as [number, number, number], color: '#e2e8f0', glassColor: getGlass('#38bdf8'), minStage: 5 },
    ];
  }, [winningBlueprint]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Mechanical Ring Indexing
    lowerRingAngle.current = THREE.MathUtils.damp(lowerRingAngle.current, targetLowerRingAngle.current, 2.8, delta);
    if (lowerRingRef.current) lowerRingRef.current.rotation.y = lowerRingAngle.current;

    middleRingAngle.current = THREE.MathUtils.damp(middleRingAngle.current, targetMiddleRingAngle.current, 2.8, delta);
    if (middleRingRef.current) middleRingRef.current.rotation.y = middleRingAngle.current;

    if (upperRingRef.current) upperRingRef.current.rotation.y = upperRingAngle.current + Math.sin(t * 0.15) * 0.04;

    // 2. Core Glow Pulse
    corePulse.current = THREE.MathUtils.damp(corePulse.current, targetCorePulse.current, 4, delta);
    targetCorePulse.current = THREE.MathUtils.damp(targetCorePulse.current, 0, 1.2, delta);

    if (coreGlowMeshRef.current) {
      const mat = coreGlowMeshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        const baseIntensity = winningBlueprint ? 1.2 : 0.35;
        mat.emissiveIntensity = baseIntensity + corePulse.current * 1.5;
        if (winningBlueprint === 'blue') mat.color.set('#38bdf8');
        else if (winningBlueprint === 'red') mat.color.set('#f87171');
      }
    }

    // 3. Plaza Fountain Jets (Active from Stage 3 onwards)
    if (fountainJetsRef.current) {
      const isFountainActive = cityStage >= 3;
      fountainJetsRef.current.children.forEach((jet, i) => {
        const targetScale = isFountainActive ? 0.5 + Math.sin(t * 3.2 + i * 0.8) * 0.3 : 0.02;
        jet.scale.set(1, Math.max(0.02, targetScale), 1);
      });
    }
  });

  const isDataTowerComplete = cityStage >= 5;

  return (
    <group>
      {/* ── 1. CENTRAL CIVIC PLAZA & BOULEVARD ── */}
      <group position={[0, 0, 0]}>
        {/* Outer Circular Ring Road / Boulevard */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
          <ringGeometry args={[6.8, 10.2, 32]} />
          <primitive object={CITY_MAT.asphalt} attach="material" />
        </mesh>
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
                <meshStandardMaterial color={cityStage >= 3 ? '#22c55e' : '#84cc16'} roughness={0.8} />
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
          <meshStandardMaterial
            color={winningBlueprint === 'blue' ? '#38bdf8' : winningBlueprint === 'red' ? '#f87171' : '#0ea5e9'}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Dancing Water Fountain Jets (Activates at Stage 3) */}
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

      {/* ── 2. THE CENTRAL DATA TOWER (STAGE 0 FOUNDATION VS STAGE 5 SUPERSTRUCTURE) ── */}
      <group position={[0, 0, 0]}>
        {/* Foundation Plinth (Always Grounded) */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.8, 1.2, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
        </mesh>

        {!isDataTowerComplete ? (
          // ── STAGE 0–4: ACTIVE CONSTRUCTION SITE & SKELETAL FOUNDATION ──
          <group>
            {/* Safety Hazard Warning Striping on Plinth Edge */}
            {[0, 1, 2, 3].map((hi) => {
              const hAngle = (hi / 4) * Math.PI * 2 + Math.PI / 8;
              return (
                <mesh key={hi} position={[Math.cos(hAngle) * 2.3, 1.22, Math.sin(hAngle) * 2.3]} rotation={[-Math.PI / 2, 0, hAngle]}>
                  <planeGeometry args={[1.4, 0.2]} />
                  <primitive object={CITY_MAT.hazardStripe} attach="material" />
                </mesh>
              );
            })}

            {/* Exposed Steel Rebar Columns */}
            {[0, 1, 2, 3, 4, 5].map((ri) => {
              const rAngle = (ri / 6) * Math.PI * 2;
              return (
                <mesh key={ri} position={[Math.cos(rAngle) * 1.1, 2.1, Math.sin(rAngle) * 1.1]}>
                  <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
                  <meshStandardMaterial color="#64748b" metalness={0.8} />
                </mesh>
              );
            })}

            {/* Safety Cones Surrounding Tower Foundation */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((ci) => {
              const cAngle = (ci / 8) * Math.PI * 2;
              return (
                <mesh key={ci} position={[Math.cos(cAngle) * 2.9, 0.3, Math.sin(cAngle) * 2.9]}>
                  <cylinderGeometry args={[0.02, 0.12, 0.5, 8]} />
                  <meshStandardMaterial color="#f97316" roughness={0.4} />
                </mesh>
              );
            })}

            {/* Site Construction Crane */}
            <group position={[-3.5, 0, -2.5]}>
              <mesh position={[0, 4.5, 0]} castShadow>
                <boxGeometry args={[0.4, 9.0, 0.4]} />
                <meshStandardMaterial color="#eab308" metalness={0.6} />
              </mesh>
              {/* Crane Jib Arm */}
              <mesh position={[2.0, 9.0, 0]} castShadow>
                <boxGeometry args={[5.2, 0.35, 0.35]} />
                <meshStandardMaterial color="#eab308" metalness={0.6} />
              </mesh>
              {/* Counterweight */}
              <mesh position={[-1.2, 9.0, 0]}>
                <boxGeometry args={[0.9, 0.6, 0.6]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
              {/* Hoist Cable */}
              <mesh position={[3.0, 7.2, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 3.4, 4]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
          </group>
        ) : (
          // ── STAGE 5+: FULLY COMPLETED CENTRAL DATA TOWER SUPERSTRUCTURE ──
          <group>
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
                  <mesh position={[0.15, 0.35, 0]}>
                    <cylinderGeometry args={[0.14, 0.14, 0.3, 8]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
                  </mesh>
                </group>
              );
            })}

            {/* Central Tower Core Column */}
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

            {/* Vertical Telemetry Conduits */}
            <mesh position={[-1.02, 6.2, 0]} scale={[0.08, 8.4, 0.08]}>
              <boxGeometry args={[1, 1, 1]} />
              <primitive object={winningBlueprint === 'red' ? CITY_MAT.redTeamGlow : CITY_MAT.blueTeamGlow} attach="material" />
            </mesh>
            <mesh position={[1.02, 6.2, 0]} scale={[0.08, 8.4, 0.08]}>
              <boxGeometry args={[1, 1, 1]} />
              <primitive object={winningBlueprint === 'blue' ? CITY_MAT.blueTeamGlow : CITY_MAT.redTeamGlow} attach="material" />
            </mesh>

            {/* Central Core Luminescent Status Column */}
            <mesh ref={coreGlowMeshRef} position={[0, 6.2, 0]}>
              <cylinderGeometry args={[0.78, 0.78, 8.2, 12]} />
              <meshStandardMaterial
                color={winningBlueprint === 'red' ? '#f87171' : '#38bdf8'}
                emissive={winningBlueprint === 'red' ? '#dc2626' : '#0284c7'}
                emissiveIntensity={0.6}
                transparent
                opacity={0.35}
                roughness={0.1}
              />
            </mesh>

            {/* LOWER RING: Heavy Primary Drive Ring */}
            <group position={[0, 4.8, 0]}>
              {[0, 1, 2, 3].map((ai) => {
                const aAngle = (ai / 4) * Math.PI * 2;
                const ax = Math.cos(aAngle) * 1.5;
                const az = Math.sin(aAngle) * 1.5;
                return (
                  <group key={ai} position={[ax, 0, az]} rotation={[0, -aAngle, 0]}>
                    <mesh position={[-0.4, 0, 0]} castShadow>
                      <boxGeometry args={[0.9, 0.16, 0.2]} />
                      <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
                    </mesh>
                  </group>
                );
              })}
              <group ref={lowerRingRef}>
                <mesh castShadow>
                  <cylinderGeometry args={[2.0, 2.0, 0.24, 28, 1, true]} />
                  <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[-1.96, 0, 0]}>
                  <boxGeometry args={[0.1, 0.14, 0.4]} />
                  <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.4} />
                </mesh>
                <mesh position={[1.96, 0, 0]}>
                  <boxGeometry args={[0.1, 0.14, 0.4]} />
                  <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={1.4} />
                </mesh>
              </group>
            </group>

            {/* MIDDLE RING: Telemetry Calibration Ring */}
            <group position={[0, 6.6, 0]}>
              <group ref={middleRingRef}>
                <mesh castShadow>
                  <cylinderGeometry args={[1.7, 1.7, 0.2, 24, 1, true]} />
                  <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} side={THREE.DoubleSide} />
                </mesh>
              </group>
            </group>

            {/* UPPER RING: Azimuth Grid Ring */}
            <group position={[0, 8.4, 0]}>
              <group ref={upperRingRef}>
                <mesh castShadow>
                  <cylinderGeometry args={[1.45, 1.45, 0.16, 24, 1, true]} />
                  <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
                </mesh>
              </group>
            </group>

            {/* Observation Saucer */}
            <mesh position={[0, 10.1, 0]} castShadow>
              <cylinderGeometry args={[3.2, 2.2, 1.2, 24]} />
              <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.3} />
            </mesh>
            <mesh position={[0, 10.4, 0]}>
              <cylinderGeometry args={[3.22, 2.8, 0.8, 24]} />
              <meshStandardMaterial
                color={winningBlueprint === 'red' ? '#fca5a5' : '#67e8f9'}
                emissive={winningBlueprint === 'red' ? '#dc2626' : '#0284c7'}
                emissiveIntensity={0.4}
                transparent
                opacity={0.88}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, 11.1, 0]} castShadow>
              <cylinderGeometry args={[2.0, 3.28, 0.5, 24]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.5} />
            </mesh>

            {/* Communications Spire */}
            <mesh position={[0, 13.4, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.28, 4.2, 8]} />
              <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 14.2, 0]}>
              <boxGeometry args={[1.2, 0.06, 0.06]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh position={[0, 15.6, 0]}>
              <sphereGeometry args={[0.2, 14, 14]} />
              <meshStandardMaterial
                color={winningBlueprint === 'red' ? '#ef4444' : winningBlueprint === 'blue' ? '#0ea5e9' : '#f59e0b'}
                emissive={winningBlueprint === 'red' ? '#ef4444' : winningBlueprint === 'blue' ? '#0ea5e9' : '#f59e0b'}
                emissiveIntensity={2.0}
              />
            </mesh>
          </group>
        )}
      </group>

      {/* ── 3. MARKET DISTRICT BUILDING (QUESTION 2 MILESTONE) ── */}
      <MarketDistrictBuilding stage={cityStage} winningBlueprint={winningBlueprint} />

      {/* ── 4. MODERN METROPOLITAN SKYSCRAPERS ── */}
      <group>
        {towers.map((t, idx) => {
          const isVisible = cityStage >= t.minStage;
          if (!isVisible) {
            // Render skeletal foundation frame when unbuilt
            return (
              <group key={idx} position={t.pos}>
                <mesh position={[0, 0.4, 0]} receiveShadow>
                  <boxGeometry args={[t.size[0], 0.8, t.size[2]]} />
                  <meshStandardMaterial color="#334155" roughness={0.8} />
                </mesh>
                {/* Structural framework poles */}
                {[-t.size[0] / 2 + 0.2, t.size[0] / 2 - 0.2].map((fx, fi) => (
                  <mesh key={fi} position={[fx, 1.8, 0]}>
                    <boxGeometry args={[0.1, 2.2, 0.1]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.7} />
                  </mesh>
                ))}
              </group>
            );
          }

          return (
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
                  emissiveIntensity={winningBlueprint ? 0.45 : 0.2}
                  roughness={0.1}
                  transparent
                  opacity={0.85}
                />
              </mesh>

              {/* Penthouse Rooftop Box */}
              <mesh position={[0, t.size[1] / 2 + 0.35, 0]}>
                <boxGeometry args={[t.size[0] * 0.65, 0.7, t.size[2] * 0.65]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── 5. 3D SKY PROCLAMATION (VICTORY FINALE) ── */}
      {gamePhase === 'victory' && winningBlueprint && (
        <SkyCityProclamation3D winner={winningBlueprint} />
      )}
    </group>
  );
}
