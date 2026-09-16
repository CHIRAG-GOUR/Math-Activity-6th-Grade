// ============================================================
// THE SOLAR FORGE: Central Forge VIP Clubhouse & Party Observatory
// Architectural Desert Modernist Glass Pavilion directly under the Center Tower
// - Inactive during 5 questions: Dark, sleek, calm desert facility ("no lights in desert otherwise")
// - When 5 questions complete: Explosive VIP Party Mode activates!
//   * Blue winner  -> Brilliant Neon Blue / Cyan strobe lights, lasers & dancefloor
//   * Red winner   -> Radiant Crimson / Hot Pink strobe lights, lasers & dancefloor
//   * Realistic 3D human figures with faces, hair, detailed bodies & shoes
//   * 128 BPM dance kinematics, DJ booth, balcony cheerers, team flags & lasers
//   * Strictly starts ONLY at the end of the game!
// ============================================================

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSolarForgeStore } from '../store/solarForgeStore';
import { solarAudio } from '../audio/solarAudio';
import { RealisticPartyHuman3D } from './RealisticPartyHuman3D';

interface CentralForgeHouse3DProps {
  position?: [number, number, number];
}

// 3D Confetti system for celebration
const ConfettiField3D: React.FC<{ color1: string; color2: string }> = ({ color1, color2 }) => {
  const count = 36;
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: (Math.random() - 0.5) * 10,
      y: 2.0 + Math.random() * 5.5,
      z: (Math.random() - 0.5) * 8 + 1,
      speed: 0.8 + Math.random() * 1.2,
      spinSpeed: 2 + Math.random() * 4,
      color: i % 2 === 0 ? color1 : color2,
      size: 0.12 + Math.random() * 0.08,
    }));
  }, [count, color1, color2]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      child.position.y -= delta * p.speed;
      child.rotation.x += delta * p.spinSpeed;
      child.rotation.z += delta * p.spinSpeed * 0.7;
      if (child.position.y < 0.4) {
        child.position.y = 6.8 + Math.random() * 1.5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <planeGeometry args={[p.size, p.size * 0.6]} />
          <meshBasicMaterial color={p.color} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

export const CentralForgeHouse3D: React.FC<CentralForgeHouse3DProps> = ({
  position = [0, 1.0, 0],
}) => {
  const blue = useSolarForgeStore((s) => s.blue);
  const red = useSolarForgeStore((s) => s.red);
  const gamePhase = useSolarForgeStore((s) => s.gamePhase);
  const solarForge = useSolarForgeStore((s) => s.solarForge);
  const storePartyActive = useSolarForgeStore((s) => s.isPartyActive);
  const storePartyWinner = useSolarForgeStore((s) => s.partyWinner);

  // Determine if all 5 questions are complete or facility is in victory phase
  // Strictly only starts at the end of the game!
  const blueFinished = blue.currentQuestionIndex >= 4;
  const redFinished = red.currentQuestionIndex >= 4;
  const isGameComplete =
    gamePhase === 'cinematic_activation' ||
    gamePhase === 'victory' ||
    (blueFinished && redFinished && (blue.lastFeedback === 'beam_aligned' || red.lastFeedback === 'beam_aligned')) ||
    solarForge.powerLevel >= 100;

  const isPartyActive = storePartyActive || isGameComplete;

  // Track winner: strictly respects storePartyWinner when provided, or highest energy score
  const isBlueWinner = storePartyWinner ? storePartyWinner === 'blue' : blue.energyMegawatts >= red.energyMegawatts;
  const winnerTeam = isBlueWinner ? 'blue' : 'red';
  const winnerName = isBlueWinner ? 'BLUE HELIO SQUADRON' : 'RED SOLAR CORPS';

  // Audio trigger on party activation
  const previousPartyRef = useRef(false);
  useEffect(() => {
    if (isPartyActive && !previousPartyRef.current) {
      solarAudio.playPartyCheer();
    }
    previousPartyRef.current = isPartyActive;
  }, [isPartyActive]);

  // Color Schemes (Strict Blue vs Red enforcement)
  const partyColors = useMemo(() => {
    if (isBlueWinner) {
      return {
        neon: '#00f5ff',
        primary: '#2563eb',
        accent: '#38bdf8',
        glow: '#06b6d4',
        strobe1: '#00f5ff',
        strobe2: '#60a5fa',
        shirt: '#0284c7',
        pants: '#0f172a',
        laser: '#00f5ff',
      };
    }
    return {
      neon: '#ff0055',
      primary: '#dc2626',
      accent: '#f87171',
      glow: '#ef4444',
      strobe1: '#ff0055',
      strobe2: '#fb7185',
      shirt: '#dc2626',
      pants: '#0f172a',
      laser: '#ff0055',
    };
  }, [isBlueWinner]);

  // 3D Animation Refs
  const houseGroupRef = useRef<THREE.Group>(null);
  const leftSpotlightRef = useRef<THREE.Group>(null);
  const rightSpotlightRef = useRef<THREE.Group>(null);
  const discoLightRef = useRef<THREE.PointLight>(null);
  const danceFloorTilesRef = useRef<THREE.Group>(null);
  const laserBeamsRef = useRef<THREE.Group>(null);

  // Sliding doors refs
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // ── SLIDING GLASS DOORS ANIMATION ──
    // Doors slide wide open during party mode for 100% unobstructed interior view
    if (leftDoorRef.current && rightDoorRef.current) {
      const targetLeftX = isPartyActive ? -3.9 : -2.8;
      const targetRightX = isPartyActive ? 3.9 : 2.8;
      leftDoorRef.current.position.x = THREE.MathUtils.damp(leftDoorRef.current.position.x, targetLeftX, 4, delta);
      rightDoorRef.current.position.x = THREE.MathUtils.damp(rightDoorRef.current.position.x, targetRightX, 4, delta);
    }

    if (isPartyActive) {
      // 1. Moving Rooftop Spotlights sweeping sky and tower
      if (leftSpotlightRef.current) {
        leftSpotlightRef.current.rotation.y = Math.sin(t * 2.4) * 0.8;
        leftSpotlightRef.current.rotation.x = -0.5 + Math.cos(t * 2.0) * 0.3;
      }
      if (rightSpotlightRef.current) {
        rightSpotlightRef.current.rotation.y = -Math.sin(t * 2.4) * 0.8;
        rightSpotlightRef.current.rotation.x = -0.5 - Math.cos(t * 2.0) * 0.3;
      }

      // 2. Interior Disco Light pulse
      if (discoLightRef.current) {
        discoLightRef.current.intensity = 8 + Math.sin(t * 12) * 5;
      }

      // 3. Dance Floor Tiles Pulsating in Sync
      if (danceFloorTilesRef.current) {
        danceFloorTilesRef.current.children.forEach((tileMesh, idx) => {
          const mat = (tileMesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) {
            const phase = idx % 2 === 0 ? Math.sin(t * 10 + idx) : Math.cos(t * 10 + idx);
            mat.emissiveIntensity = 1.4 + Math.max(0, phase) * 2.2;
          }
        });
      }

      // 4. Laser Beams Scanning Across Desert Sky
      if (laserBeamsRef.current) {
        laserBeamsRef.current.children.forEach((laser, idx) => {
          laser.rotation.z = Math.sin(t * 3 + idx * 1.5) * 0.4;
          laser.rotation.x = -0.6 + Math.cos(t * 2.5 + idx) * 0.35;
        });
      }
    }
  });

  return (
    <group ref={houseGroupRef} position={position}>
      {/* ── 1. ARCHITECTURAL PODIUM & FOUNDATION ── */}
      {/* Modern sandstone concrete base deck */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[9.4, 0.4, 8.0]} />
        <meshStandardMaterial color="#b89a74" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Front Entrance Staircase */}
      <group position={[0, 0.1, 4.3]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[4.4, 0.15, 0.8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.05, 0.6]}>
          <boxGeometry args={[4.8, 0.15, 0.8]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>
      </group>

      {/* ── 2. STRUCTURAL COLUMNS & ROOF SLAB ── */}
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
        <boxGeometry args={[9.6, 0.35, 8.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* ── 3. PANORAMIC GLASS CURTAIN WALLS ── */}
      {/* Left Glass Wall */}
      <mesh position={[-4.2, 1.45, 0]}>
        <boxGeometry args={[0.08, 2.3, 6.6]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.primary : '#38bdf8'}
          transparent
          opacity={isPartyActive ? 0.12 : 0.38}
          roughness={0.05}
          metalness={0.2}
        />
      </mesh>
      {/* Right Glass Wall */}
      <mesh position={[4.2, 1.45, 0]}>
        <boxGeometry args={[0.08, 2.3, 6.6]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.primary : '#38bdf8'}
          transparent
          opacity={isPartyActive ? 0.12 : 0.38}
          roughness={0.05}
          metalness={0.2}
        />
      </mesh>
      {/* Rear Panoramic Glass Wall */}
      <mesh position={[0, 1.45, -3.5]}>
        <boxGeometry args={[8.0, 2.3, 0.08]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.primary : '#38bdf8'}
          transparent
          opacity={isPartyActive ? 0.15 : 0.38}
          roughness={0.05}
          metalness={0.2}
        />
      </mesh>

      {/* Front Entrance Sliding Glass Doors - Open wide during party! */}
      <mesh ref={leftDoorRef} position={[-2.8, 1.45, 3.5]}>
        <boxGeometry args={[2.4, 2.3, 0.08]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.neon : '#38bdf8'}
          transparent
          opacity={isPartyActive ? 0.08 : 0.32}
          roughness={0.05}
        />
      </mesh>
      <mesh ref={rightDoorRef} position={[2.8, 1.45, 3.5]}>
        <boxGeometry args={[2.4, 2.3, 0.08]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.neon : '#38bdf8'}
          transparent
          opacity={isPartyActive ? 0.08 : 0.32}
          roughness={0.05}
        />
      </mesh>

      {/* ── 4. UPPER OBSERVATION TERRACE & BALCONY ── */}
      {/* Front Balustrade with illuminated handrail */}
      <mesh position={[0, 3.45, 3.85]}>
        <boxGeometry args={[8.8, 0.9, 0.06]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.neon : '#94a3b8'}
          transparent
          opacity={isPartyActive ? 0.18 : 0.45}
          roughness={0.08}
        />
      </mesh>
      {/* Front Handrail */}
      <mesh position={[0, 3.9, 3.85]}>
        <boxGeometry args={[9.0, 0.08, 0.12]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.neon : '#f8fafc'}
          emissive={isPartyActive ? partyColors.neon : '#000000'}
          emissiveIntensity={isPartyActive ? 1.5 : 0}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Left Balustrade */}
      <mesh position={[-4.4, 3.45, 0]}>
        <boxGeometry args={[0.06, 0.9, 7.6]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} roughness={0.1} />
      </mesh>
      {/* Right Balustrade */}
      <mesh position={[4.4, 3.45, 0]}>
        <boxGeometry args={[0.06, 0.9, 7.6]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} roughness={0.1} />
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

      {/* ── 5. PARTY LIGHTS, LASERS & CONFETTI ── */}
      {/* Only active when 5 questions completed / party active! */}
      {isPartyActive && (
        <>
          {/* Main Interior Club Flood Light - brightly illuminates all dancers */}
          <pointLight
            ref={discoLightRef}
            position={[0, 2.4, 0.5]}
            color={partyColors.neon}
            intensity={14}
            distance={20}
            decay={2}
          />
          {/* Secondary Team Color Accent Light */}
          <pointLight
            position={[0, 2.3, -1.8]}
            color={partyColors.accent}
            intensity={9}
            distance={15}
          />
          {/* Front Entrance Spotlight pointed at Porch greeters */}
          <pointLight
            position={[0, 2.8, 4.0]}
            color={partyColors.neon}
            intensity={7}
            distance={12}
          />

          {/* Dual Motorized Rooftop Searchlights */}
          <group ref={leftSpotlightRef} position={[-3.0, 4.8, 0]}>
            <spotLight
              color={partyColors.neon}
              intensity={22}
              angle={0.45}
              penumbra={0.35}
              distance={80}
              castShadow
            />
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            {/* Glowing Light Cone */}
            <mesh position={[0, 0, -8]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 2.8, 16, 16, 1, true]} />
              <meshBasicMaterial
                color={partyColors.neon}
                transparent
                opacity={0.22}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          <group ref={rightSpotlightRef} position={[3.0, 4.8, 0]}>
            <spotLight
              color={partyColors.strobe2}
              intensity={22}
              angle={0.45}
              penumbra={0.35}
              distance={80}
              castShadow
            />
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            {/* Glowing Light Cone */}
            <mesh position={[0, 0, -8]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 2.8, 16, 16, 1, true]} />
              <meshBasicMaterial
                color={partyColors.strobe2}
                transparent
                opacity={0.22}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* 4 Angled Laser Beams shooting into sky */}
          <group ref={laserBeamsRef} position={[0, 4.8, 0]}>
            {[-2.2, -0.8, 0.8, 2.2].map((lx, idx) => (
              <mesh key={idx} position={[lx, 8, -6]} rotation={[-0.6, 0, (idx - 1.5) * 0.2]}>
                <cylinderGeometry args={[0.04, 0.08, 18, 8]} />
                <meshBasicMaterial color={partyColors.laser} transparent opacity={0.65} />
              </mesh>
            ))}
          </group>

          {/* Strobe Beacons on Roof Corners */}
          {[
            [-4.2, 4.0, -3.6],
            [4.2, 4.0, -3.6],
            [-4.2, 4.0, 3.6],
            [4.2, 4.0, 3.6],
          ].map(([sx, sy, sz], i) => (
            <mesh key={i} position={[sx, sy, sz]}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshBasicMaterial color={i % 2 === 0 ? partyColors.strobe1 : partyColors.strobe2} />
            </mesh>
          ))}

          {/* Floating Swirling 3D Confetti */}
          <ConfettiField3D color1={partyColors.neon} color2={partyColors.accent} />
        </>
      )}

      {/* ── 6. INTERIOR LOUNGE & DANCE FLOOR ── */}
      {/* Lounge Floor */}
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[8.6, 0.05, 7.0]} />
        <meshStandardMaterial color="#1e1b18" roughness={0.7} />
      </mesh>

      {/* Central Illuminated Dance Floor (4x4 Grid) */}
      <group ref={danceFloorTilesRef} position={[0, 0.44, 0]}>
        {Array.from({ length: 16 }).map((_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const x = (col - 1.5) * 1.1;
          const z = (row - 1.5) * 1.1;
          const isEven = (row + col) % 2 === 0;

          return (
            <mesh key={i} position={[x, 0, z]}>
              <boxGeometry args={[1.02, 0.04, 1.02]} />
              <meshStandardMaterial
                color={isPartyActive ? (isEven ? partyColors.neon : partyColors.primary) : '#334155'}
                emissive={isPartyActive ? (isEven ? partyColors.neon : partyColors.primary) : '#000000'}
                emissiveIntensity={isPartyActive ? 2.0 : 0}
                roughness={0.15}
              />
            </mesh>
          );
        })}
      </group>

      {/* DJ Station at the back wall */}
      <group position={[0, 0.45, -2.6]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3.0, 0.9, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.7, 0.96, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.03, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0.7, 0.96, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.03, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.97, 0]}>
          <boxGeometry args={[0.7, 0.04, 0.5]} />
          <meshStandardMaterial
            color={isPartyActive ? partyColors.neon : '#475569'}
            emissive={isPartyActive ? partyColors.neon : '#000000'}
            emissiveIntensity={isPartyActive ? 2.5 : 0}
          />
        </mesh>
        <mesh position={[-2.0, 0.8, 0]}>
          <boxGeometry args={[0.6, 1.4, 0.6]} />
          <meshStandardMaterial color="#020617" roughness={0.5} />
        </mesh>
        <mesh position={[2.0, 0.8, 0]}>
          <boxGeometry args={[0.6, 1.4, 0.6]} />
          <meshStandardMaterial color="#020617" roughness={0.5} />
        </mesh>
      </group>

      {/* ── 7. REALISTIC DETAILED PARTY HUMANOIDS (FACES, BODIES, SNEAKERS & DANCE KINEMATICS) ── */}
      {/* 1. Lead Dancer (Center Dance Floor) */}
      <RealisticPartyHuman3D
        position={[0, 0.44, 0]}
        rotationY={0}
        scale={1.22}
        role="lead_dancer"
        skinTone="#f5d0b5"
        hairStyle="pompadour"
        hairColor="#1e1b18"
        shirtColor={partyColors.shirt}
        accentColor={partyColors.accent}
        pantsColor={partyColors.pants}
        isPartyActive={isPartyActive}
        winnerTeam={winnerTeam}
      />

      {/* 2. Co-Lead Dancer (Left Floor) with Dual Neon Glowsticks */}
      <RealisticPartyHuman3D
        position={[-1.6, 0.44, 0.3]}
        rotationY={0.35}
        scale={1.22}
        role="partner_dancer"
        skinTone="#e0ac69"
        hairStyle="ponytail"
        hairColor="#451a03"
        shirtColor={partyColors.accent}
        accentColor={partyColors.neon}
        pantsColor="#1e293b"
        isPartyActive={isPartyActive}
        winnerTeam={winnerTeam}
      />

      {/* 3. Groove Dancer (Right Floor) with Neon Accents */}
      <RealisticPartyHuman3D
        position={[1.6, 0.44, 0.3]}
        rotationY={-0.35}
        scale={1.22}
        role="groove_dancer"
        skinTone="#c68642"
        hairStyle="curly"
        hairColor="#0f172a"
        shirtColor={partyColors.primary}
        accentColor={partyColors.neon}
        pantsColor={partyColors.pants}
        isPartyActive={isPartyActive}
        winnerTeam={winnerTeam}
      />

      {/* 4. Resident DJ behind the illuminated booth */}
      <RealisticPartyHuman3D
        position={[0, 0.44, -2.1]}
        rotationY={0}
        scale={1.22}
        role="dj"
        skinTone="#f5d0b5"
        hairStyle="headphones"
        hairColor="#1e1b18"
        shirtColor="#0f172a"
        accentColor={partyColors.neon}
        pantsColor="#020617"
        isPartyActive={isPartyActive}
        winnerTeam={winnerTeam}
      />

      {/* 5. Rooftop Balcony VIP 1 (Left Railing) with Winner Pennant */}
      <RealisticPartyHuman3D
        position={[-2.4, 3.15, 3.2]}
        rotationY={0.25}
        scale={1.22}
        role="balcony_flag"
        skinTone="#8d5524"
        hairStyle="cap"
        hairColor="#1e1b18"
        shirtColor={partyColors.shirt}
        accentColor={partyColors.accent}
        pantsColor={partyColors.pants}
        isPartyActive={isPartyActive}
        winnerTeam={winnerTeam}
      />

      {/* 6. Rooftop Balcony VIP 2 (Right Railing) Cheering */}
      <RealisticPartyHuman3D
        position={[2.4, 3.15, 3.2]}
        rotationY={-0.25}
        scale={1.22}
        role="balcony_cheerer"
        skinTone="#fcd34d"
        hairStyle="short"
        hairColor="#78350f"
        shirtColor={partyColors.primary}
        accentColor={partyColors.neon}
        pantsColor="#334155"
        isPartyActive={isPartyActive}
        winnerTeam={winnerTeam}
      />

      {/* 7. Front Deck Hype Person (Left Steps) */}
      <RealisticPartyHuman3D
        position={[-1.8, 0.25, 4.4]}
        rotationY={0.3}
        scale={1.22}
        role="porch_hype"
        skinTone="#e0ac69"
        hairStyle="pompadour"
        hairColor="#1e1b18"
        shirtColor={partyColors.shirt}
        accentColor={partyColors.neon}
        pantsColor="#1e293b"
        isPartyActive={isPartyActive}
        winnerTeam={winnerTeam}
      />

      {/* 8. Front Deck Dancer (Right Steps) */}
      <RealisticPartyHuman3D
        position={[1.8, 0.25, 4.4]}
        rotationY={-0.3}
        scale={1.22}
        role="porch_dancer"
        skinTone="#f5d0b5"
        hairStyle="ponytail"
        hairColor="#312e81"
        shirtColor={partyColors.accent}
        accentColor={partyColors.primary}
        pantsColor={partyColors.pants}
        isPartyActive={isPartyActive}
        winnerTeam={winnerTeam}
      />

      {/* ── 8. FRONT FASCIA 3D MARQUEE SIGN ── */}
      <mesh position={[0, 2.8, 4.05]}>
        <boxGeometry args={[7.0, 0.55, 0.12]} />
        <meshStandardMaterial
          color={isPartyActive ? (isBlueWinner ? '#082f49' : '#450a0a') : '#0f172a'}
          metalness={0.8}
        />
      </mesh>
      {/* Backlit Marquee Panel */}
      <mesh position={[0, 2.8, 4.12]}>
        <boxGeometry args={[6.7, 0.42, 0.02]} />
        <meshStandardMaterial
          color={isPartyActive ? partyColors.neon : '#475569'}
          emissive={isPartyActive ? partyColors.neon : '#000000'}
          emissiveIntensity={isPartyActive ? 3.0 : 0}
        />
      </mesh>

      {/* ── 9. FLOATING 3D HTML VIP PARTY INVITE BANNER (ONLY AT END OF GAME) ── */}
      {isPartyActive && (
        <Html position={[0, 6.2, 1.5]} center distanceFactor={24} zIndexRange={[100, 0]}>
          <div
            className={`px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border-2 ${
              isBlueWinner
                ? 'bg-slate-950/95 border-cyan-400 text-cyan-200 shadow-cyan-500/50'
                : 'bg-slate-950/95 border-rose-500 text-rose-200 shadow-rose-500/50'
            } text-center flex flex-col items-center gap-1 select-none pointer-events-none whitespace-nowrap animate-bounce`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg animate-pulse">🎉</span>
              <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                5 MISSIONS COMPLETE · VIP CELEBRATION PARTY
              </span>
              <span className="text-lg animate-pulse">🎉</span>
            </div>

            <div className="text-lg font-black tracking-tight text-white drop-shadow-md">
              INVITED: {winnerName}
            </div>

            <div className="text-xs font-bold opacity-90 tracking-wide text-white/90">
              {isBlueWinner ? 'BLUE TEAM CHAMPION NIGHTCLUB' : 'RED TEAM CHAMPION NIGHTCLUB'} · ALL LIGHTS TURNED ON!
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
