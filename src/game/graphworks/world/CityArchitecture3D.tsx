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

// ── 2. METRO CAFE & BISTRO BUILDING (QUESTION 2 PHYSICAL MILESTONE) ──
function MarketDistrictBuilding({ stage, winningBlueprint }: { stage: number; winningBlueprint: Team | 'tie' | null }) {
  const isComplete = stage >= 2;
  const isBlueWin = winningBlueprint === 'blue';
  const isRedWin = winningBlueprint === 'red';

  const roofColor = isBlueWin ? '#0284c7' : isRedWin ? '#dc2626' : '#1e3a8a';

  return (
    <group position={[-14.5, 0, -2.5]}>
      {/* Foundation Concrete Base Pad */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[7.6, 0.2, 5.4]} />
        <primitive object={CITY_MAT.concrete} attach="material" />
      </mesh>

      {!isComplete ? (
        // ── STAGE 0–1: PREPARED DEVELOPMENT LOT ──
        <group>
          {/* Clean Ground Survey Markings */}
          {[-3.2, 3.2].map((px) => (
            <mesh key={px} position={[px, 0.22, 0]}>
              <boxGeometry args={[0.06, 0.02, 5.0]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
            </mesh>
          ))}
          {[-2.2, 2.2].map((pz) => (
            <mesh key={pz} position={[0, 0.22, pz]}>
              <boxGeometry args={[6.8, 0.02, 0.06]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
            </mesh>
          ))}
          {/* Corner Stakes */}
          {[-3.2, 3.2].map((sx) =>
            [-2.2, 2.2].map((sz) => (
              <mesh key={`${sx}_${sz}`} position={[sx, 0.4, sz]}>
                <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} />
              </mesh>
            ))
          )}
          {/* Future Site Information Board */}
          <group position={[0, 0.6, 2.3]}>
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[1.8, 0.7, 0.06]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.52, 0.04]}>
              <boxGeometry args={[1.6, 0.16, 0.02]} />
              <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.4} />
            </mesh>
          </group>
        </group>
      ) : (
        // ── STAGE 2+: FULLY COMPLETED ARCHITECTURAL CAFE & BISTRO ──
        <group>
          {/* 1. Main Cafe Building Body */}
          <group position={[0, 0, -0.6]}>
            {/* Main Building Walls (Solid Modern Structure) */}
            <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[6.6, 2.6, 3.4]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>

            {/* Warm Cedar Wood Accent Facade (Front) */}
            <mesh position={[0, 1.4, 1.72]}>
              <boxGeometry args={[6.5, 2.5, 0.04]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>

            {/* Floor-to-Ceiling Panoramic Glass Picture Windows with Warm Interior Glow */}
            {[-2.0, 2.0].map((wx) => (
              <group key={wx} position={[wx, 1.35, 1.74]}>
                {/* Glass Pane */}
                <mesh>
                  <boxGeometry args={[1.8, 1.6, 0.04]} />
                  <meshStandardMaterial
                    color="#fef08a"
                    emissive="#f59e0b"
                    emissiveIntensity={0.65}
                    roughness={0.1}
                  />
                </mesh>
                {/* Black Metal Mullion Window Frame */}
                <mesh position={[0, 0, 0.02]}>
                  <boxGeometry args={[1.85, 0.04, 0.02]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0, 0.02]}>
                  <boxGeometry args={[0.04, 1.65, 0.02]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </mesh>
              </group>
            ))}

            {/* Center Entrance Double Glass Doors */}
            <group position={[0, 1.15, 1.74]}>
              <mesh>
                <boxGeometry args={[1.3, 2.1, 0.04]} />
                <meshStandardMaterial
                  color="#fef08a"
                  emissive="#f59e0b"
                  emissiveIntensity={0.5}
                  roughness={0.1}
                />
              </mesh>
              {/* Door Frame */}
              <mesh position={[0, 0, 0.02]}>
                <boxGeometry args={[0.04, 2.1, 0.02]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} />
              </mesh>
              {/* Brass Handles */}
              {[-0.08, 0.08].map((hx) => (
                <mesh key={hx} position={[hx, 0, 0.05]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
                </mesh>
              ))}
            </group>

            {/* 2. PROPER SHAPED MODERN ARCHITECTURAL PITCHED ROOF */}
            <group position={[0, 2.7, 0]}>
              {/* Horizontal Timber Rafter Beam Framework */}
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[7.2, 0.16, 3.8]} />
                <meshStandardMaterial color="#451a03" roughness={0.7} />
              </mesh>

              {/* Left Sloped Standing-Seam Azure Roof Plane */}
              <mesh position={[-1.75, 0.65, 0]} rotation={[0, 0, 0.28]} castShadow>
                <boxGeometry args={[3.8, 0.12, 4.1]} />
                <meshStandardMaterial color={roofColor} roughness={0.35} metalness={0.3} />
              </mesh>

              {/* Right Sloped Standing-Seam Azure Roof Plane */}
              <mesh position={[1.75, 0.65, 0]} rotation={[0, 0, -0.28]} castShadow>
                <boxGeometry args={[3.8, 0.12, 4.1]} />
                <meshStandardMaterial color={roofColor} roughness={0.35} metalness={0.3} />
              </mesh>

              {/* Central Sleek Ridge Cap */}
              <mesh position={[0, 1.2, 0]} castShadow>
                <boxGeometry args={[0.22, 0.1, 4.14]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} />
              </mesh>

              {/* Wooden Gable End Walls (Left & Right) */}
              {[-3.3, 3.3].map((gx) => (
                <mesh key={gx} position={[gx, 0.6, 0]}>
                  <cylinderGeometry args={[0, 1.9, 1.1, 3]} />
                  <meshStandardMaterial color="#78350f" roughness={0.8} />
                </mesh>
              ))}
            </group>

            {/* 3. Illuminated Overhead Cafe Sign: "★ METRO BISTRO & CAFE ★" */}
            <group position={[0, 2.85, 1.85]}>
              <mesh castShadow>
                <boxGeometry args={[4.4, 0.5, 0.1]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[4.2, 0.38, 0.02]} />
                <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.9} />
              </mesh>
            </group>
          </group>

          {/* 4. Covered Front Porch & Striped Canvas Awnings */}
          <group position={[0, 0, 1.3]}>
            {/* Timber Decking Floor */}
            <mesh position={[0, 0.12, 0]} receiveShadow>
              <boxGeometry args={[6.8, 0.08, 1.8]} />
              <meshStandardMaterial color="#92400e" roughness={0.85} />
            </mesh>

            {/* Modern Blue/White Striped Overhang Awning */}
            <mesh position={[0, 2.2, 0.3]} rotation={[0.25, 0, 0]} castShadow>
              <boxGeometry args={[6.6, 0.05, 1.2]} />
              <meshStandardMaterial color={roofColor} roughness={0.4} />
            </mesh>

            {/* Steel Porch Support Columns */}
            {[-3.2, 3.2].map((px) => (
              <mesh key={px} position={[px, 1.1, 0.8]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
                <meshStandardMaterial color="#0f172a" metalness={0.85} />
              </mesh>
            ))}

            {/* 5. Outdoor Cafe Bistro Seating & Terrace Props */}
            {/* Table 1 (Left) */}
            <group position={[-1.8, 0.12, 0.3]}>
              {/* Round Table */}
              <mesh position={[0, 0.42, 0]} castShadow>
                <cylinderGeometry args={[0.42, 0.42, 0.03, 16]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.21, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.42, 8]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} />
              </mesh>
              {/* Coffee Cups */}
              <mesh position={[-0.12, 0.46, 0.05]}>
                <cylinderGeometry args={[0.04, 0.03, 0.06, 8]} />
                <meshStandardMaterial color="#0284c7" />
              </mesh>
              {/* Croissant / Pastry plate */}
              <mesh position={[0.1, 0.45, -0.05]}>
                <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
                <meshStandardMaterial color="#d97706" />
              </mesh>
              {/* 2 Chairs */}
              {[-0.55, 0.55].map((cx) => (
                <group key={cx} position={[cx, 0, 0]}>
                  <mesh position={[0, 0.28, 0]}>
                    <boxGeometry args={[0.26, 0.03, 0.26]} />
                    <meshStandardMaterial color="#451a03" roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 0.52, -0.11]}>
                    <boxGeometry args={[0.26, 0.32, 0.03]} />
                    <meshStandardMaterial color="#451a03" roughness={0.7} />
                  </mesh>
                  {[-0.1, 0.1].map((lx) => (
                    <mesh key={lx} position={[lx, 0.14, 0]}>
                      <cylinderGeometry args={[0.015, 0.015, 0.28, 6]} />
                      <meshStandardMaterial color="#0f172a" />
                    </mesh>
                  ))}
                </group>
              ))}
            </group>

            {/* Table 2 (Right) */}
            <group position={[1.8, 0.12, 0.3]}>
              <mesh position={[0, 0.42, 0]} castShadow>
                <cylinderGeometry args={[0.42, 0.42, 0.03, 16]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.21, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.42, 8]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} />
              </mesh>
              {/* Coffee Cups */}
              <mesh position={[0.1, 0.46, 0.05]}>
                <cylinderGeometry args={[0.04, 0.03, 0.06, 8]} />
                <meshStandardMaterial color="#ef4444" />
              </mesh>
              {/* 2 Chairs */}
              {[-0.55, 0.55].map((cx) => (
                <group key={cx} position={[cx, 0, 0]}>
                  <mesh position={[0, 0.28, 0]}>
                    <boxGeometry args={[0.26, 0.03, 0.26]} />
                    <meshStandardMaterial color="#451a03" roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 0.52, -0.11]}>
                    <boxGeometry args={[0.26, 0.32, 0.03]} />
                    <meshStandardMaterial color="#451a03" roughness={0.7} />
                  </mesh>
                  {[-0.1, 0.1].map((lx) => (
                    <mesh key={lx} position={[lx, 0.14, 0]}>
                      <cylinderGeometry args={[0.015, 0.015, 0.28, 6]} />
                      <meshStandardMaterial color="#0f172a" />
                    </mesh>
                  ))}
                </group>
              ))}
            </group>

            {/* Takeaway Coffee Bar / Counter */}
            <group position={[0, 0.12, 0.6]}>
              <mesh position={[0, 0.45, 0]} castShadow>
                <boxGeometry args={[1.2, 0.7, 0.5]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} />
              </mesh>
              {/* Espresso Machine on counter */}
              <mesh position={[0.2, 0.92, 0]}>
                <boxGeometry args={[0.3, 0.25, 0.25]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
              </mesh>
              {/* Menu Blackboard */}
              <mesh position={[-0.3, 0.95, 0]}>
                <boxGeometry args={[0.26, 0.35, 0.04]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>
      )}
    </group>
  );
}

// ── 3. PROCEDURAL SKYSCRAPER ARCHITECTURAL TEXTURES & GEOMETRY ──
function createSkyscraperFacadeTexture(options: {
  theme: 'blue' | 'red' | 'cyan' | 'amber' | 'corporate';
  floors: number;
  columns: number;
  winningTeam: Team | 'tie' | null;
  seed: number;
}): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const width = 512;
  const height = 1024;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const { theme, floors, columns, winningTeam, seed } = options;

  // Background structural wall
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  const floorHeight = height / floors;
  const colWidth = width / columns;
  const padX = colWidth * 0.12;
  const padY = floorHeight * 0.16;
  const winW = colWidth - padX * 2;
  const winH = floorHeight - padY * 2;

  // Palette selection
  const isRed = winningTeam === 'red';
  const isBlue = winningTeam === 'blue';

  let primaryGlow = '#38bdf8';
  let secondaryGlow = '#0284c7';
  if (isRed || (!winningTeam && (theme === 'red' || theme === 'amber'))) {
    primaryGlow = '#fb7185';
    secondaryGlow = '#e11d48';
  } else if (isBlue || (!winningTeam && (theme === 'blue' || theme === 'cyan'))) {
    primaryGlow = '#38bdf8';
    secondaryGlow = '#0284c7';
  } else if (theme === 'corporate') {
    primaryGlow = isRed ? '#fb7185' : '#38bdf8';
    secondaryGlow = isRed ? '#e11d48' : '#0284c7';
  }

  for (let f = 0; f < floors; f++) {
    const y = f * floorHeight;
    const isLobby = f >= floors - 2;

    // Floor Spandrel structural divider band
    ctx.fillStyle = f % 2 === 0 ? '#1e293b' : '#334155';
    ctx.fillRect(0, y + floorHeight - padY, width, padY);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, y + floorHeight - padY, width, 2);

    if (isLobby) {
      // 2-story Grand Ground Lobby with warm chandeliers and illuminated glass
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, y, width, floorHeight);
      for (let c = 0; c < columns; c++) {
        const x = c * colWidth;
        const lobbyGrad = ctx.createLinearGradient(x, y, x, y + floorHeight);
        lobbyGrad.addColorStop(0, '#fef9c3');
        lobbyGrad.addColorStop(0.4, '#fed7aa');
        lobbyGrad.addColorStop(1, '#fde68a');
        ctx.fillStyle = lobbyGrad;
        ctx.fillRect(x + padX * 0.4, y + padY * 0.4, colWidth - padX * 0.8, floorHeight - padY * 0.8);

        // Lobby structural column
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, y, 4, floorHeight);
      }
      continue;
    }

    for (let c = 0; c < columns; c++) {
      const x = c * colWidth;
      const winX = x + padX;
      const winY = y + padY;

      // Pseudo-random light state
      const hash = Math.sin(seed * 1000 + f * 43.17 + c * 89.31) * 10000;
      const rand = hash - Math.floor(hash);

      const isLit = rand < 0.52;
      const isAccent = rand < 0.22;

      if (isLit) {
        const grad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
        if (isAccent || winningTeam) {
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, primaryGlow);
          grad.addColorStop(1, secondaryGlow);
        } else if (rand > 0.35) {
          // Warm interior office lights
          grad.addColorStop(0, '#fef9c3');
          grad.addColorStop(0.5, '#fde047');
          grad.addColorStop(1, '#f59e0b');
        } else {
          // Cool daylight office lights
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, '#bae6fd');
          grad.addColorStop(1, '#38bdf8');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(winX, winY, winW, winH);

        // Venetian blinds in some lit windows
        if (rand > 0.28) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
          const blinds = 3;
          const bh = winH / (blinds * 2);
          for (let b = 0; b < blinds; b++) {
            ctx.fillRect(winX, winY + b * bh * 2, winW, 1.2);
          }
        }
      } else {
        // Dark reflective glass with diagonal sky reflection
        const darkGrad = ctx.createLinearGradient(winX, winY, winX + winW, winY + winH);
        darkGrad.addColorStop(0, '#090d16');
        darkGrad.addColorStop(0.5, '#1e293b');
        darkGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = darkGrad;
        ctx.fillRect(winX, winY, winW, winH);

        // Diagonal glass reflection highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.moveTo(winX, winY + winH * 0.6);
        ctx.lineTo(winX + winW * 0.6, winY);
        ctx.lineTo(winX + winW, winY);
        ctx.lineTo(winX, winY + winH);
        ctx.closePath();
        ctx.fill();
      }

      // Sleek Window Frame Border
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(winX, winY, winW, winH);

      // Central Vertical Mullion
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2, winY);
      ctx.lineTo(winX + winW / 2, winY + winH);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function SkyscraperTower3D({
  pos,
  size,
  floors,
  columns,
  theme,
  minStage,
  seed,
  cityStage,
  winningBlueprint,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  floors: number;
  columns: number;
  theme: 'blue' | 'red' | 'cyan' | 'amber' | 'corporate';
  minStage: number;
  seed: number;
  cityStage: number;
  winningBlueprint: Team | 'tie' | null;
}) {
  const isVisible = cityStage >= minStage;
  const beaconRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(
    () =>
      createSkyscraperFacadeTexture({
        theme,
        floors,
        columns,
        winningTeam: winningBlueprint,
        seed,
      }),
    [theme, floors, columns, winningBlueprint, seed]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (beaconRef.current) {
      // Blinking red aviation warning light at top of antenna
      const blink = Math.sin(t * 6 + seed) > 0.2;
      (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = blink ? 2.5 : 0.2;
    }
  });

  if (!isVisible) {
    // Skeletal foundation frame when unbuilt
    return (
      <group position={pos}>
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <boxGeometry args={[size[0], 0.8, size[2]]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {[-size[0] / 2 + 0.2, size[0] / 2 - 0.2].map((fx, fi) => (
          <mesh key={fi} position={[fx, 1.8, 0]}>
            <boxGeometry args={[0.1, 2.2, 0.1]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} />
          </mesh>
        ))}
      </group>
    );
  }

  const [w, h, d] = size;
  const cornerCols = [
    [-w / 2, 0, -d / 2],
    [w / 2, 0, -d / 2],
    [-w / 2, 0, d / 2],
    [w / 2, 0, d / 2],
  ];

  const spandrelHeights = [h * 0.25 - h / 2, h * 0.5 - h / 2, h * 0.75 - h / 2];

  return (
    <group position={pos}>
      {/* Main Textured Skyscraper Core */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial map={texture} roughness={0.25} metalness={0.35} />
      </mesh>

      {/* Dark Roof Gravel Cap */}
      <mesh position={[0, h / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} metalness={0.2} />
      </mesh>

      {/* 4 Full-Height Vertical Structural Corner Columns */}
      {cornerCols.map((cPos, ci) => (
        <mesh key={ci} position={[cPos[0], 0, cPos[2]]} castShadow>
          <boxGeometry args={[0.16, h + 0.08, 0.16]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}

      {/* Horizontal Architectural Floor Ledge Bands */}
      {spandrelHeights.map((sh, si) => (
        <mesh key={si} position={[0, sh, 0]} castShadow>
          <boxGeometry args={[w + 0.12, 0.18, d + 0.12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}

      {/* Ground-Level Grand Modern Entrance Canopy (+Z Front) */}
      <group position={[0, -h / 2 + 1.8, d / 2 + 0.55]}>
        <mesh castShadow>
          <boxGeometry args={[w * 0.75, 0.08, 1.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Recessed Warm Under-Canopy Spotlight */}
        <mesh position={[0, -0.045, 0]}>
          <boxGeometry args={[w * 0.65, 0.01, 0.9]} />
          <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={1.4} />
        </mesh>
        {/* Twin Steel Canopy Support Struts */}
        {[-w * 0.3, w * 0.3].map((cx, ci) => (
          <mesh key={ci} position={[cx, -0.9, 0.45]}>
            <cylinderGeometry args={[0.035, 0.035, 1.8, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
          </mesh>
        ))}
      </group>

      {/* Rooftop Parapet Perimeter Safety Rails */}
      {[-w / 2 + 0.05, w / 2 - 0.05].map((px, pi) => (
        <mesh key={pi} position={[px, h / 2 + 0.22, 0]}>
          <boxGeometry args={[0.08, 0.42, d]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
      ))}
      {[-d / 2 + 0.05, d / 2 - 0.05].map((pz, pi) => (
        <mesh key={pi} position={[0, h / 2 + 0.22, pz]}>
          <boxGeometry args={[w, 0.42, 0.08]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
      ))}

      {/* Rooftop Stepped Mechanical Penthouse Box */}
      <mesh position={[0, h / 2 + 0.55, 0]} castShadow>
        <boxGeometry args={[w * 0.55, 1.1, d * 0.55]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Rooftop Dual HVAC Industrial Chillers with Fan Grilles */}
      {[-w * 0.2, w * 0.2].map((cx, ci) => (
        <group key={ci} position={[cx, h / 2 + 0.3, d * 0.22]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.48, 0.45]} />
            <meshStandardMaterial color="#475569" roughness={0.7} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Communications Antenna Spire */}
      <mesh position={[0, h / 2 + 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.12, 2.8, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Pulsing Red Aviation Warning Beacon */}
      <mesh ref={beaconRef} position={[0, h / 2 + 3.9, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={2.0} />
      </mesh>
    </group>
  );
}

const SKYSCRAPERS = [
  { id: 'west_tower_1', pos: [-10.5, 7, -12] as [number, number, number], size: [3.4, 14, 3.4] as [number, number, number], floors: 18, cols: 6, theme: 'blue' as const, minStage: 2, seed: 1 },
  { id: 'west_tower_2', pos: [-15.5, 6, -8] as [number, number, number], size: [2.8, 10, 2.8] as [number, number, number], floors: 14, cols: 5, theme: 'cyan' as const, minStage: 0, seed: 2 },
  { id: 'west_tower_3', pos: [-11.5, 5, -18] as [number, number, number], size: [3.2, 8, 3.2] as [number, number, number], floors: 11, cols: 6, theme: 'blue' as const, minStage: 4, seed: 3 },
  { id: 'east_tower_1', pos: [10.5, 7, -12] as [number, number, number], size: [3.4, 14, 3.4] as [number, number, number], floors: 18, cols: 6, theme: 'red' as const, minStage: 2, seed: 4 },
  { id: 'east_tower_2', pos: [15.5, 6, -8] as [number, number, number], size: [2.8, 10, 2.8] as [number, number, number], floors: 14, cols: 5, theme: 'amber' as const, minStage: 0, seed: 5 },
  { id: 'east_tower_3', pos: [11.5, 5, -18] as [number, number, number], size: [3.2, 8, 3.2] as [number, number, number], floors: 11, cols: 6, theme: 'red' as const, minStage: 4, seed: 6 },
  { id: 'west_metro',   pos: [-21, 7, -24] as [number, number, number], size: [4.2, 12, 3.8] as [number, number, number], floors: 16, cols: 7, theme: 'cyan' as const, minStage: 5, seed: 7 },
  { id: 'east_metro',   pos: [21, 7, -24] as [number, number, number], size: [4.2, 12, 3.8] as [number, number, number], floors: 16, cols: 7, theme: 'amber' as const, minStage: 5, seed: 8 },
  { id: 'civic_center', pos: [0, 7, -26] as [number, number, number], size: [5.0, 12, 4.0] as [number, number, number], floors: 16, cols: 8, theme: 'corporate' as const, minStage: 5, seed: 9 },
];

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
                <circleGeometry args={[0.82, 16]} />
                <meshStandardMaterial color={cityStage >= 3 ? '#22c55e' : '#84cc16'} roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.04, 0]}>
                <cylinderGeometry args={[0.85, 0.85, 0.08, 16]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── 2. THE CENTRAL DATA TOWER (STAGE 0 FOUNDATION VS STAGE 5 SUPERSTRUCTURE) ── */}
      <group position={[0, 0, 0]}>
        {/* Foundation Plinth (Always Grounded) */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.8, 1.2, 8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.15} />
        </mesh>

        {!isDataTowerComplete ? (
          // ── STAGE 0–4: ELEGANT TOWER FOUNDATION & FUTURE SITE ──
          <group>
            {/* Polished White Granite Pedestal Cap */}
            <mesh position={[0, 1.25, 0]} castShadow>
              <cylinderGeometry args={[2.0, 2.2, 0.12, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.15} />
            </mesh>

            {/* Subtle Radial Geometric Floor Engravings */}
            {[0, 1, 2, 3, 4, 5].map((ri) => {
              const rAngle = (ri / 6) * Math.PI * 2;
              return (
                <mesh key={ri} rotation={[-Math.PI / 2, 0, rAngle]} position={[0, 1.32, 0]}>
                  <planeGeometry args={[0.08, 3.8]} />
                  <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
                </mesh>
              );
            })}

            {/* Central Tower Core Preview (Short structural column) */}
            <mesh position={[0, 2.2, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.7, 2.0, 12]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Core cap */}
            <mesh position={[0, 3.3, 0]}>
              <cylinderGeometry args={[0.65, 0.5, 0.2, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.5} />
            </mesh>

            {/* 4 Decorative Brushed Steel Bollards */}
            {[0, 1, 2, 3].map((bi) => {
              const bAngle = (bi / 4) * Math.PI * 2 + Math.PI / 4;
              const bx = Math.cos(bAngle) * 2.6;
              const bz = Math.sin(bAngle) * 2.6;
              return (
                <group key={bi} position={[bx, 0.1, bz]}>
                  <mesh position={[0, 0.35, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.1, 0.7, 8]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
                  </mesh>
                  <mesh position={[0, 0.72, 0]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
                  </mesh>
                </group>
              );
            })}

            {/* Subtle Blue Glow Ring at Base (Data conduit preview) */}
            <mesh position={[0, 1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.85, 1.95, 24]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} transparent opacity={0.6} />
            </mesh>

            {/* Information Kiosk: "FUTURE DATA TOWER" */}
            <group position={[2.2, 0.1, 1.8]}>
              <mesh position={[0, 0.6, 0]} castShadow>
                <boxGeometry args={[0.6, 1.2, 0.1]} />
                <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.6, 0.06]}>
                <boxGeometry args={[0.5, 0.28, 0.02]} />
                <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.3} />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.06, 0.12, 8]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} />
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
        {SKYSCRAPERS.map((t) => (
          <SkyscraperTower3D
            key={t.id}
            pos={t.pos}
            size={t.size}
            floors={t.floors}
            columns={t.cols}
            theme={t.theme}
            minStage={t.minStage}
            seed={t.seed}
            cityStage={cityStage}
            winningBlueprint={winningBlueprint}
          />
        ))}
      </group>

      {/* ── 5. 3D SKY PROCLAMATION (VICTORY FINALE) ── */}
      {gamePhase === 'victory' && winningBlueprint && (
        <SkyCityProclamation3D winner={winningBlueprint} />
      )}
    </group>
  );
}
