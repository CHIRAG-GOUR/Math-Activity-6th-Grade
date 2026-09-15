// ============================================================
// THE SOLAR FORGE: Central Forge VIP Clubhouse & Party Observatory
// Architectural Desert Modernist Glass Pavilion directly under the Center Tower
// - Inactive during 5 questions: Dark, sleek, calm desert facility ("no lights in desert otherwise")
// - When 5 questions complete: Explosive VIP Party Mode activates!
//   * Blue winner  -> Brilliant Neon Blue / Cyan strobe lights, lasers & dancefloor
//   * Red winner   -> Radiant Crimson / Hot Pink strobe lights, lasers & dancefloor
//   * 3D animated dancing & cheering people inside & on rooftop terrace
//   * Exclusive VIP Party Invite banner for winning team
// ============================================================

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSolarForgeStore } from '../store/solarForgeStore';
import { solarAudio } from '../audio/solarAudio';

interface CentralForgeHouse3DProps {
  position?: [number, number, number];
}

export const CentralForgeHouse3D: React.FC<CentralForgeHouse3DProps> = ({
  position = [0, 1.0, 0],
}) => {
  const blue = useSolarForgeStore((s) => s.blue);
  const red = useSolarForgeStore((s) => s.red);
  const gamePhase = useSolarForgeStore((s) => s.gamePhase);
  const solarForge = useSolarForgeStore((s) => s.solarForge);

  // Determine if all 5 questions are complete or facility is at 100%
  const blueFinished = blue.currentQuestionIndex >= 4;
  const redFinished = red.currentQuestionIndex >= 4;
  const isAutoParty =
    gamePhase === 'cinematic_activation' ||
    gamePhase === 'victory' ||
    (blueFinished && redFinished) ||
    (blueFinished && blue.lastFeedback === 'beam_aligned') ||
    (redFinished && red.lastFeedback === 'beam_aligned') ||
    solarForge.powerLevel >= 100;

  // Local interactive toggle so teacher/tester can also click the house to test party anytime!
  const [manualPartyToggle, setManualPartyToggle] = useState(false);
  const isPartyActive = isAutoParty || manualPartyToggle;

  // Track winner
  const winner = blue.energyMegawatts >= red.energyMegawatts ? 'blue' : 'red';
  const isBlueWinner = winner === 'blue';
  const winnerName = isBlueWinner ? 'BLUE HELIO SQUADRON' : 'RED SOLAR CORPS';

  // Audio trigger on party activation
  const previousPartyRef = useRef(false);
  useEffect(() => {
    if (isPartyActive && !previousPartyRef.current) {
      solarAudio.playPartyCheer();
    }
    previousPartyRef.current = isPartyActive;
  }, [isPartyActive]);

  // Color Schemes
  const partyColors = useMemo(() => {
    if (isBlueWinner) {
      return {
        neon: '#00f5ff',
        primary: '#2563eb',
        accent: '#38bdf8',
        glow: '#06b6d4',
        strobe1: '#38bdf8',
        strobe2: '#93c5fd',
        shirt: '#0284c7',
        pants: '#1e293b',
      };
    }
    return {
      neon: '#ff0055',
      primary: '#dc2626',
      accent: '#f87171',
      glow: '#ef4444',
      strobe1: '#fb7185',
      strobe2: '#fca5a5',
      shirt: '#e11d48',
      pants: '#1e293b',
    };
  }, [isBlueWinner]);

  // 3D Animation Refs
  const houseGroupRef = useRef<THREE.Group>(null);
  const leftSpotlightRef = useRef<THREE.Group>(null);
  const rightSpotlightRef = useRef<THREE.Group>(null);
  const discoLightRef = useRef<THREE.PointLight>(null);
  const danceFloorTilesRef = useRef<THREE.Group>(null);

  // People Character Animation Refs
  const dancer1Ref = useRef<THREE.Group>(null);
  const dancer2Ref = useRef<THREE.Group>(null);
  const djRef = useRef<THREE.Group>(null);
  const djArmRef = useRef<THREE.Group>(null);
  const cheerer1Ref = useRef<THREE.Group>(null);
  const cheerer2Ref = useRef<THREE.Group>(null);
  const greeterRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (isPartyActive) {
      // 1. Moving Rooftop Spotlights sweeping sky and tower pylons
      if (leftSpotlightRef.current) {
        leftSpotlightRef.current.rotation.y = Math.sin(t * 2.2) * 0.7;
        leftSpotlightRef.current.rotation.x = -0.55 + Math.cos(t * 1.8) * 0.25;
      }
      if (rightSpotlightRef.current) {
        rightSpotlightRef.current.rotation.y = -Math.sin(t * 2.2) * 0.7;
        rightSpotlightRef.current.rotation.x = -0.55 - Math.cos(t * 1.8) * 0.25;
      }

      // 2. Interior Disco Light pulse
      if (discoLightRef.current) {
        discoLightRef.current.intensity = 5 + Math.sin(t * 10) * 3;
      }

      // 3. Dance Floor Tiles Pulsating
      if (danceFloorTilesRef.current) {
        danceFloorTilesRef.current.children.forEach((tileMesh, idx) => {
          const mat = (tileMesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) {
            const phase = (idx % 2 === 0 ? Math.sin(t * 9 + idx) : Math.cos(t * 9 + idx));
            mat.emissiveIntensity = 1.2 + Math.max(0, phase) * 1.8;
          }
        });
      }

      // 4. Dancing Characters
      // Lead Dancer (Center floor)
      if (dancer1Ref.current) {
        dancer1Ref.current.position.y = 0.5 + Math.abs(Math.sin(t * 8)) * 0.22;
        dancer1Ref.current.rotation.y = Math.sin(t * 4) * 0.45;
      }
      // Partner Dancer (Side floor)
      if (dancer2Ref.current) {
        dancer2Ref.current.position.y = 0.5 + Math.abs(Math.sin(t * 8 + 1.2)) * 0.22;
        dancer2Ref.current.position.x = -1.6 + Math.sin(t * 6) * 0.25;
      }
      // DJ bobbing head and raising turntable arm
      if (djRef.current) {
        djRef.current.rotation.x = Math.sin(t * 14) * 0.18;
      }
      if (djArmRef.current) {
        djArmRef.current.rotation.x = -2.2 + Math.sin(t * 7) * 0.5;
      }
      // Balcony Cheerer 1 (Left railing)
      if (cheerer1Ref.current) {
        cheerer1Ref.current.position.y = 3.25 + Math.abs(Math.sin(t * 6)) * 0.3;
        cheerer1Ref.current.rotation.z = Math.sin(t * 6) * 0.2;
      }
      // Balcony Cheerer 2 (Right railing)
      if (cheerer2Ref.current) {
        cheerer2Ref.current.position.y = 3.25 + Math.abs(Math.sin(t * 6 + 1.4)) * 0.3;
        cheerer2Ref.current.rotation.y = Math.sin(t * 5) * 0.3;
      }
      // Porch Greeter
      if (greeterRef.current) {
        greeterRef.current.rotation.y = Math.sin(t * 3) * 0.3;
      }
    } else {
      // Inactive (Calm desert daytime idle)
      if (dancer1Ref.current) {
        dancer1Ref.current.position.y = 0.5;
        dancer1Ref.current.rotation.y = 0;
      }
      if (dancer2Ref.current) {
        dancer2Ref.current.position.y = 0.5;
      }
      if (cheerer1Ref.current) {
        cheerer1Ref.current.position.y = 3.25;
      }
      if (cheerer2Ref.current) {
        cheerer2Ref.current.position.y = 3.25;
      }
    }
  });

  return (
    <group
      ref={houseGroupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setManualPartyToggle((prev) => !prev);
        if (!isPartyActive) {
          solarAudio.playPartyCheer();
        }
      }}
    >
      {/* ── 1. ARCHITECTURAL PODIUM & FOUNDATION ── */}
      {/* Modern sandstone concrete base deck */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[9.2, 0.4, 7.8]} />
        <meshStandardMaterial color="#c2a47e" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Front Entrance Staircase */}
      <group position={[0, 0.1, 4.2]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[4.2, 0.15, 0.7]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.05, 0.5]}>
          <boxGeometry args={[4.6, 0.15, 0.7]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>
      </group>

      {/* ── 2. STRUCTURAL PILLARS & ROOF SLAB ── */}
      {/* 4 Heavy Brushed Titanium Corner Columns */}
      {[
        [-4.2, 1.45, -3.5],
        [4.2, 1.45, -3.5],
        [-4.2, 1.45, 3.5],
        [4.2, 1.45, 3.5],
      ].map(([cx, cy, cz], i) => (
        <mesh key={i} position={[cx, cy, cz]} castShadow>
          <boxGeometry args={[0.45, 2.5, 0.45]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* Middle Floor Terrace Ceiling Slab */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <boxGeometry args={[9.4, 0.35, 8.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* ── 3. PANORAMIC GLASS CURTAIN WALLS ── */}
      {/* Left Glass Wall */}
      <mesh position={[-4.2, 1.45, 0]}>
        <boxGeometry args={[0.08, 2.3, 6.6]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.primary : '#38bdf8'}
          transparent
          opacity={0.38}
          roughness={0.08}
          metalness={0.3}
        />
      </mesh>
      {/* Right Glass Wall */}
      <mesh position={[4.2, 1.45, 0]}>
        <boxGeometry args={[0.08, 2.3, 6.6]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.primary : '#38bdf8'}
          transparent
          opacity={0.38}
          roughness={0.08}
          metalness={0.3}
        />
      </mesh>
      {/* Rear Panoramic Glass Wall */}
      <mesh position={[0, 1.45, -3.5]}>
        <boxGeometry args={[8.0, 2.3, 0.08]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.primary : '#38bdf8'}
          transparent
          opacity={0.38}
          roughness={0.08}
          metalness={0.3}
        />
      </mesh>

      {/* Front Entrance Facade with Open Sliding Glass Doors */}
      <mesh position={[-2.8, 1.45, 3.5]}>
        <boxGeometry args={[2.5, 2.3, 0.08]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.primary : '#38bdf8'}
          transparent
          opacity={0.35}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[2.8, 1.45, 3.5]}>
        <boxGeometry args={[2.5, 2.3, 0.08]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.primary : '#38bdf8'}
          transparent
          opacity={0.35}
          roughness={0.08}
        />
      </mesh>

      {/* ── 4. UPPER OBSERVATION TERRACE & BALCONY ── */}
      {/* Frameless Glass Perimeter Balustrades with Chrome Top Handrail */}
      {/* Front Balustrade */}
      <mesh position={[0, 3.45, 3.85]}>
        <boxGeometry args={[8.8, 0.9, 0.06]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.neon : '#94a3b8'}
          transparent
          opacity={0.45}
          roughness={0.1}
        />
      </mesh>
      {/* Front Handrail */}
      <mesh position={[0, 3.9, 3.85]}>
        <boxGeometry args={[9.0, 0.08, 0.12]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Left Balustrade */}
      <mesh position={[-4.4, 3.45, 0]}>
        <boxGeometry args={[0.06, 0.9, 7.6]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.45} roughness={0.1} />
      </mesh>
      {/* Right Balustrade */}
      <mesh position={[4.4, 3.45, 0]}>
        <boxGeometry args={[0.06, 0.9, 7.6]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.45} roughness={0.1} />
      </mesh>

      {/* Overhead Lighting Truss Arch */}
      <group position={[0, 4.4, 0]}>
        <mesh position={[-3.8, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[3.8, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 7.8, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
      </group>

      {/* ── 5. PARTY LIGHTS & DISCO EQUIPMENT ── */}
      {/* Only active when 5 questions completed / party active! */}
      {isPartyActive && (
        <>
          {/* Main Interior Club Glow */}
          <pointLight
            ref={discoLightRef}
            position={[0, 2.0, 0]}
            color={partyColors.neon}
            intensity={7}
            distance={16}
            decay={2}
          />
          {/* Secondary Warm Accent Light */}
          <pointLight
            position={[0, 2.3, -1.8]}
            color={isBlueWinner ? '#38bdf8' : '#fb7185'}
            intensity={4}
            distance={12}
          />

          {/* Dual Motorized Rooftop Searchlights */}
          {/* Left Searchlight */}
          <group ref={leftSpotlightRef} position={[-3.0, 4.8, 0]}>
            <spotLight
              color={partyColors.neon}
              intensity={18}
              angle={0.45}
              penumbra={0.35}
              distance={70}
              castShadow
            />
            {/* Lamp fixture housing */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            {/* Volumetric Glowing Light Cone */}
            <mesh position={[0, 0, -8]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 2.8, 16, 16, 1, true]} />
              <meshBasicMaterial
                color={partyColors.neon}
                transparent
                opacity={0.16}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* Right Searchlight */}
          <group ref={rightSpotlightRef} position={[3.0, 4.8, 0]}>
            <spotLight
              color={isBlueWinner ? '#60a5fa' : '#f43f5e'}
              intensity={18}
              angle={0.45}
              penumbra={0.35}
              distance={70}
              castShadow
            />
            {/* Lamp fixture housing */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            {/* Volumetric Glowing Light Cone */}
            <mesh position={[0, 0, -8]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 2.8, 16, 16, 1, true]} />
              <meshBasicMaterial
                color={isBlueWinner ? '#60a5fa' : '#f43f5e'}
                transparent
                opacity={0.16}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* Strobe Beacons on Roof Corners */}
          {[
            [-4.2, 4.0, -3.6],
            [4.2, 4.0, -3.6],
            [-4.2, 4.0, 3.6],
            [4.2, 4.0, 3.6],
          ].map(([sx, sy, sz], i) => (
            <mesh key={i} position={[sx, sy, sz]}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshBasicMaterial color={i % 2 === 0 ? partyColors.strobe1 : partyColors.strobe2} />
            </mesh>
          ))}
        </>
      )}

      {/* ── 6. INTERIOR LOUNGE & DANCE FLOOR ── */}
      {/* Perimeter Dark Wood Lounge Flooring */}
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[8.4, 0.05, 6.8]} />
        <meshStandardMaterial color="#1e1b18" roughness={0.7} />
      </mesh>

      {/* Central Illuminated Dance Floor (4x4 Grid) */}
      <group ref={danceFloorTilesRef} position={[0, 0.44, 0]}>
        {Array.from({ length: 16 }).map((_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const x = (col - 1.5) * 1.05;
          const z = (row - 1.5) * 1.05;
          const isEven = (row + col) % 2 === 0;

          return (
            <mesh key={i} position={[x, 0, z]}>
              <boxGeometry args={[0.98, 0.03, 0.98]} />
              <meshStandardMaterial
                color={isPartyActive ? (isEven ? partyColors.neon : partyColors.primary) : '#334155'}
                emissive={isPartyActive ? (isEven ? partyColors.neon : partyColors.primary) : '#000000'}
                emissiveIntensity={isPartyActive ? 1.5 : 0}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>

      {/* DJ Station at the back wall */}
      <group position={[0, 0.45, -2.6]}>
        {/* DJ Desk Console */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.8, 0.9, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Dual Turntables */}
        <mesh position={[-0.7, 0.96, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.03, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0.7, 0.96, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.03, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        {/* Glowing DJ Mixer Display */}
        <mesh position={[0, 0.97, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.5]} />
          <meshStandardMaterial
            color={isPartyActive ? partyColors.neon : '#475569'}
            emissive={isPartyActive ? partyColors.neon : '#000000'}
            emissiveIntensity={isPartyActive ? 2 : 0}
          />
        </mesh>
        {/* Left & Right Studio Sound Monitors */}
        <mesh position={[-1.9, 0.8, 0]}>
          <boxGeometry args={[0.6, 1.4, 0.6]} />
          <meshStandardMaterial color="#020617" roughness={0.5} />
        </mesh>
        <mesh position={[1.9, 0.8, 0]}>
          <boxGeometry args={[0.6, 1.4, 0.6]} />
          <meshStandardMaterial color="#020617" roughness={0.5} />
        </mesh>
      </group>

      {/* Lounge Seating Couches along sides */}
      <group position={[-3.2, 0.45, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.8, 0.5, 3.2]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        <mesh position={[-0.35, 0.6, 0]}>
          <boxGeometry args={[0.15, 0.6, 3.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>
      <group position={[3.2, 0.45, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.8, 0.5, 3.2]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        <mesh position={[0.35, 0.6, 0]}>
          <boxGeometry args={[0.15, 0.6, 3.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* ── 7. ANIMATED PARTYING PEOPLE (6 CHARACTERS) ── */}
      {/* 1. Lead Dancer (Center of Dance Floor) */}
      <group ref={dancer1Ref} position={[0, 0.5, 0]}>
        {/* Legs */}
        <mesh position={[-0.15, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
          <meshStandardMaterial color={partyColors.pants} />
        </mesh>
        <mesh position={[0.15, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
          <meshStandardMaterial color={partyColors.pants} />
        </mesh>
        {/* Torso & Shirt */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.6, 8]} />
          <meshStandardMaterial color={partyColors.shirt} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.7} />
        </mesh>
        {/* Party Visor / Hat */}
        <mesh position={[0, 1.48, 0.05]}>
          <boxGeometry args={[0.26, 0.08, 0.22]} />
          <meshStandardMaterial
            color={partyColors.neon}
            emissive={isPartyActive ? partyColors.neon : '#000000'}
            emissiveIntensity={isPartyActive ? 1.5 : 0}
          />
        </mesh>
        {/* Arms pumped high into the air in celebration! */}
        <mesh position={[-0.32, 1.25, 0]} rotation={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.55, 8]} />
          <meshStandardMaterial color={partyColors.shirt} />
        </mesh>
        <mesh position={[0.32, 1.25, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.55, 8]} />
          <meshStandardMaterial color={partyColors.shirt} />
        </mesh>
      </group>

      {/* 2. Partner Dancer (Left floor) */}
      <group ref={dancer2Ref} position={[-1.6, 0.5, 0.5]}>
        <mesh position={[-0.14, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
          <meshStandardMaterial color={partyColors.pants} />
        </mesh>
        <mesh position={[0.14, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
          <meshStandardMaterial color={partyColors.pants} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.6, 8]} />
          <meshStandardMaterial color={partyColors.accent} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#fbbbf24" roughness={0.7} />
        </mesh>
        {/* Glowstick in hand */}
        <mesh position={[0.3, 1.35, 0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial
            color={partyColors.neon}
            emissive={isPartyActive ? partyColors.neon : '#000000'}
            emissiveIntensity={isPartyActive ? 2 : 0}
          />
        </mesh>
      </group>

      {/* 3. DJ behind the booth */}
      <group ref={djRef} position={[0, 0.5, -2.1]}>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.2, 0.18, 0.6, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        {/* DJ Headphones */}
        <mesh position={[0, 1.45, 0]}>
          <torusGeometry args={[0.18, 0.03, 8, 16]} />
          <meshStandardMaterial color={partyColors.neon} />
        </mesh>
        {/* DJ Arm waving */}
        <group ref={djArmRef} position={[0.3, 1.1, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      </group>

      {/* 4. Rooftop Balcony Cheerer 1 (Left Railing) */}
      <group ref={cheerer1Ref} position={[-2.4, 3.25, 3.2]}>
        <mesh position={[-0.14, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
          <meshStandardMaterial color={partyColors.pants} />
        </mesh>
        <mesh position={[0.14, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
          <meshStandardMaterial color={partyColors.pants} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.6, 8]} />
          <meshStandardMaterial color={partyColors.shirt} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        {/* Victory team mini flag */}
        <mesh position={[0.35, 1.35, 0.2]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.7} />
        </mesh>
        <mesh position={[0.55, 1.5, 0.2]}>
          <boxGeometry args={[0.4, 0.25, 0.02]} />
          <meshStandardMaterial
            color={partyColors.neon}
            emissive={isPartyActive ? partyColors.neon : '#000000'}
            emissiveIntensity={isPartyActive ? 1.5 : 0}
          />
        </mesh>
      </group>

      {/* 5. Rooftop Balcony Cheerer 2 (Right Railing) */}
      <group ref={cheerer2Ref} position={[2.4, 3.25, 3.2]}>
        <mesh position={[-0.14, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
          <meshStandardMaterial color={partyColors.pants} />
        </mesh>
        <mesh position={[0.14, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 8]} />
          <meshStandardMaterial color={partyColors.pants} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.6, 8]} />
          <meshStandardMaterial color={partyColors.primary} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        {/* Cheering arms */}
        <mesh position={[-0.28, 1.25, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
          <meshStandardMaterial color={partyColors.primary} />
        </mesh>
        <mesh position={[0.28, 1.25, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
          <meshStandardMaterial color={partyColors.primary} />
        </mesh>
      </group>

      {/* 6. Front Porch Greeter */}
      <group ref={greeterRef} position={[1.4, 0.35, 4.4]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.6, 8]} />
          <meshStandardMaterial color={partyColors.accent} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        {/* Welcoming Waving Hand */}
        <mesh position={[0.3, 1.2, 0.1]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.45, 8]} />
          <meshStandardMaterial color={partyColors.accent} />
        </mesh>
      </group>

      {/* ── 8. FRONT FASCIA 3D MARQUEE SIGN & FLOATING VIP INVITE BANNER ── */}
      {/* 3D Physical Marquee Signboard across front fascia */}
      <mesh position={[0, 2.8, 4.05]}>
        <boxGeometry args={[6.8, 0.55, 0.12]} />
        <meshStandardMaterial
          color={isPartyActive ? (isBlueWinner ? '#082f49' : '#450a0a') : '#0f172a'}
          metalness={0.8}
        />
      </mesh>
      {/* Backlit Marquee Panel */}
      <mesh position={[0, 2.8, 4.12]}>
        <boxGeometry args={[6.5, 0.42, 0.02]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.neon : '#475569'}
          emissive={isPartyActive ? partyColors.neon : '#000000'}
          emissiveIntensity={isPartyActive ? 2.5 : 0}
        />
      </mesh>

      {/* ── 9. FLOATING 3D HTML VIP PARTY INVITE BANNER ── */}
      {/* Appears in full glory over the house when party is turned on */}
      {isPartyActive && (
        <Html position={[0, 5.8, 1.5]} center distanceFactor={26} zIndexRange={[100, 0]}>
          <div
            className={`px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border-2 ${
              isBlueWinner
                ? 'bg-slate-950/90 border-cyan-400 text-cyan-200 shadow-cyan-500/40'
                : 'bg-slate-950/90 border-rose-500 text-rose-200 shadow-rose-500/40'
            } text-center flex flex-col items-center gap-1 select-none pointer-events-none whitespace-nowrap animate-bounce`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base animate-pulse">🎉</span>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                5 MISSIONS COMPLETE · VIP CELEBRATION PARTY
              </span>
              <span className="text-base animate-pulse">🎉</span>
            </div>

            <div className="text-base font-black tracking-tight text-white drop-shadow-md">
              INVITED: {winnerName}
            </div>

            <div className="text-[10px] font-bold opacity-90 tracking-wide text-white/90">
              {isBlueWinner ? 'BLUE TEAM CHAMPION NIGHTCLUB' : 'RED TEAM CHAMPION NIGHTCLUB'} · LIGHTS TURNED ON!
            </div>
          </div>
        </Html>
      )}

      {/* Click prompt hint when hovering over house */}
      <Html position={[0, 0.8, 4.8]} center distanceFactor={32}>
        <div className="opacity-70 hover:opacity-100 transition-opacity text-[10px] font-extrabold bg-black/60 text-white/90 px-2 py-0.5 rounded-full border border-white/20 whitespace-nowrap pointer-events-none">
          {isPartyActive ? '⚡ Party Active (Click to toggle)' : '🏰 Central Forge House (Click to preview party)'}
        </div>
      </Html>
    </group>
  );
};
