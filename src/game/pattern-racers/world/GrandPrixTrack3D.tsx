// ============================================================
// PATTERN RACERS — Dynamic 3D Grand Prix Track & Stadium
// Forza Horizon / Formula 1 Stadium Racetrack:
// - Long Asphalt Straightaway stretching to distant Finish Line (z = -55)
// - Massive Multi-Tier Spectator Grandstands with Cheering Animated Fans
// - Distance Countdown Marker Boards (500m, 400m, 300m, 200m, 100m, 50m)
// - Starting Gantry with 5 LED Lights + Giant Checkered Finish Arch
// - Sponsor Arches, Tire Walls, FIA Curbs, and Skid Marks
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePatternStore } from '../store/patternStore';

export const GrandPrixTrack3D: React.FC = () => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const raceLights = usePatternStore((s) => s.raceLights);
  const crowdsRef = useRef<THREE.Group>(null);
  const confettiRef = useRef<THREE.Group>(null);
  const raceWinner = usePatternStore((s) => s.raceWinner);

  // Animated cheering crowd simulation
  useFrame((state) => {
    if (crowdsRef.current) {
      const t = state.clock.getElapsedTime() * 4;
      crowdsRef.current.children.forEach((child, i) => {
        child.position.y = (child.userData.baseY || 0) + Math.sin(t + i * 0.4) * 0.12;
      });
    }

    // Confetti burst on race winner
    if (confettiRef.current && raceWinner) {
      const t = state.clock.getElapsedTime() * 3;
      confettiRef.current.children.forEach((particle, i) => {
        particle.position.y -= 0.05;
        particle.rotation.x += 0.05;
        particle.rotation.y += 0.08;
        if (particle.position.y < 0) {
          particle.position.y = 8 + (i % 5);
        }
      });
    }
  });

  // Material definitions
  const trackAsphaltMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.85, metalness: 0.15 }),
    []
  );
  const curbRedMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.6 }),
    []
  );
  const curbWhiteMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.6 }),
    []
  );
  const grandstandMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.7, metalness: 0.3 }),
    []
  );
  const canopyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.4 }),
    []
  );
  const trussMetalMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.9, roughness: 0.2 }),
    []
  );

  return (
    <group>
      {/* ── 1. MAIN GRAND PRIX RACETRACK ASPHALT STRIP (Z = 12 to -70) ── */}
      <mesh position={[0, 0.02, -28]} receiveShadow material={trackAsphaltMat}>
        <boxGeometry args={[9.2, 0.05, 84]} />
      </mesh>

      {/* Center Dashed White/Yellow Lane Markings */}
      {Array.from({ length: 28 }).map((_, i) => (
        <mesh
          key={`lane-div-${i}`}
          position={[0, 0.055, 10 - i * 3]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.2, 1.8]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      ))}

      {/* Left/Right Inner Lane Dividers for 3-Lane Track */}
      {[-2.4, 2.4].map((xOffset, sideIdx) => (
        <group key={`lane-side-${sideIdx}`}>
          {Array.from({ length: 28 }).map((_, i) => (
            <mesh
              key={`side-div-${sideIdx}-${i}`}
              position={[xOffset, 0.055, 10 - i * 3]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.12, 1.4]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── 2. FIA ALTERNATING RED & WHITE APEX CURBS ── */}
      {[-4.8, 4.8].map((xPos, sideIdx) => (
        <group key={`curb-track-${sideIdx}`} position={[xPos, 0.04, -28]}>
          {Array.from({ length: 42 }).map((_, i) => (
            <mesh
              key={`trk-curb-${i}`}
              position={[0, 0, -40 + i * 2]}
              receiveShadow
              material={i % 2 === 0 ? curbRedMat : curbWhiteMat}
            >
              <boxGeometry args={[0.6, 0.08, 1.95]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── 3. MASSIVE SPECTATOR GRANDSTANDS (LEFT & RIGHT) ── */}
      {/* Left Grandstand Complex */}
      <group position={[-10.5, 0, -28]}>
        {/* Tiered Concrete Seating Bleachers */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={grandstandMat}>
          <boxGeometry args={[8, 5, 80]} />
        </mesh>
        {/* Stadium Overhanging Roof Canopy */}
        <mesh position={[2, 6.5, 0]} castShadow material={canopyMat}>
          <boxGeometry args={[11, 0.4, 82]} />
        </mesh>
        {/* Support Steel Trusses */}
        {[-30, -10, 10, 30].map((z, idx) => (
          <mesh key={`l-truss-${idx}`} position={[5, 3.2, z]} castShadow material={trussMetalMat}>
            <cylinderGeometry args={[0.15, 0.18, 6.5, 8]} />
          </mesh>
        ))}
      </group>

      {/* Right Grandstand Complex */}
      <group position={[10.5, 0, -28]}>
        {/* Tiered Concrete Seating Bleachers */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={grandstandMat}>
          <boxGeometry args={[8, 5, 80]} />
        </mesh>
        {/* Stadium Overhanging Roof Canopy */}
        <mesh position={[-2, 6.5, 0]} castShadow material={canopyMat}>
          <boxGeometry args={[11, 0.4, 82]} />
        </mesh>
        {/* Support Steel Trusses */}
        {[-30, -10, 10, 30].map((z, idx) => (
          <mesh key={`r-truss-${idx}`} position={[-5, 3.2, z]} castShadow material={trussMetalMat}>
            <cylinderGeometry args={[0.15, 0.18, 6.5, 8]} />
          </mesh>
        ))}
      </group>

      {/* ── 4. THOUSANDS OF ANIMATED SPECTATORS (CHEERING CROWD) ── */}
      <group ref={crowdsRef}>
        {/* Left Side Audience */}
        {Array.from({ length: 60 }).map((_, i) => {
          const z = 10 - i * 1.3;
          const tier = (i % 3) + 1;
          const x = -8.5 - tier * 0.8;
          const y = 1.2 + tier * 1.1;
          const colors = ['#38bdf8', '#ef4444', '#eab308', '#22c55e', '#a855f7', '#f97316', '#ec4899'];
          const spectatorColor = colors[i % colors.length];

          return (
            <group key={`fan-l-${i}`} position={[x, y, z]} userData={{ baseY: y }}>
              {/* Fan Head / Torso Capsule */}
              <mesh position={[0, 0.25, 0]} castShadow>
                <sphereGeometry args={[0.22, 8, 8]} />
                <meshStandardMaterial color={spectatorColor} roughness={0.6} />
              </mesh>
              {/* Waving Team Flag */}
              {i % 4 === 0 && (
                <mesh position={[0.2, 0.5, 0]} rotation={[0, 0, 0.4]}>
                  <boxGeometry args={[0.35, 0.25, 0.02]} />
                  <meshStandardMaterial color={i % 2 === 0 ? '#2563eb' : '#dc2626'} />
                </mesh>
              )}
            </group>
          );
        })}

        {/* Right Side Audience */}
        {Array.from({ length: 60 }).map((_, i) => {
          const z = 10 - i * 1.3;
          const tier = (i % 3) + 1;
          const x = 8.5 + tier * 0.8;
          const y = 1.2 + tier * 1.1;
          const colors = ['#ef4444', '#38bdf8', '#22c55e', '#eab308', '#ec4899', '#f97316', '#a855f7'];
          const spectatorColor = colors[i % colors.length];

          return (
            <group key={`fan-r-${i}`} position={[x, y, z]} userData={{ baseY: y }}>
              {/* Fan Head / Torso Capsule */}
              <mesh position={[0, 0.25, 0]} castShadow>
                <sphereGeometry args={[0.22, 8, 8]} />
                <meshStandardMaterial color={spectatorColor} roughness={0.6} />
              </mesh>
              {/* Waving Team Flag */}
              {i % 4 === 0 && (
                <mesh position={[-0.2, 0.5, 0]} rotation={[0, 0, -0.4]}>
                  <boxGeometry args={[0.35, 0.25, 0.02]} />
                  <meshStandardMaterial color={i % 2 === 0 ? '#dc2626' : '#2563eb'} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* ── 5. DISTANCE COUNTDOWN BOARDS (500m, 400m, 300m, 200m, 100m, 50m) ── */}
      {[
        { dist: '500M', z: 0 },
        { dist: '400M', z: -12 },
        { dist: '300M', z: -24 },
        { dist: '200M', z: -36 },
        { dist: '100M', z: -46 },
        { dist: '50M', z: -51 },
      ].map(({ dist, z }, idx) => (
        <group key={`dist-board-${idx}`} position={[5.4, 0, z]}>
          {/* Post */}
          <mesh position={[0, 1.0, 0]} castShadow material={trussMetalMat}>
            <cylinderGeometry args={[0.06, 0.06, 2.0, 8]} />
          </mesh>
          {/* Signboard */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[0.1, 0.7, 1.4]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
          {/* White High-Vis Text Plate */}
          <mesh position={[-0.06, 1.8, 0]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* ── 6. STARTING LINE GANTRY ARCH (Z = 4) ── */}
      <group position={[0, 0, 4]}>
        {/* Left Truss Pillar */}
        <mesh position={[-5.2, 2.6, 0]} castShadow material={trussMetalMat}>
          <cylinderGeometry args={[0.22, 0.28, 5.2, 8]} />
        </mesh>
        {/* Right Truss Pillar */}
        <mesh position={[5.2, 2.6, 0]} castShadow material={trussMetalMat}>
          <cylinderGeometry args={[0.22, 0.28, 5.2, 8]} />
        </mesh>
        {/* Overhead Beam */}
        <mesh position={[0, 5.0, 0]} castShadow>
          <boxGeometry args={[11.0, 0.5, 0.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>

        {/* 5 Gantry Signal Lights (3 Red, 1 Yellow, 1 Green) */}
        {[-2.0, -1.0, 0, 1.0, 2.0].map((x, lightIdx) => {
          const isLit = raceLights[lightIdx];
          const isGreen = lightIdx === 4;
          const isYellow = lightIdx === 3;
          const activeColor = isGreen ? '#22c55e' : isYellow ? '#eab308' : '#ef4444';
          const offColor = '#1e293b';

          return (
            <group key={`start-gantry-${lightIdx}`} position={[x, 5.0, 0.45]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
              <mesh position={[0, 0, 0.08]}>
                <circleGeometry args={[0.24, 16]} />
                <meshBasicMaterial color={isLit ? activeColor : offColor} />
              </mesh>
              {isLit && <pointLight position={[0, 0, 0.3]} color={activeColor} intensity={2.5} distance={4} />}
            </group>
          );
        })}
      </group>

      {/* ── 7. MIDWAY GRAND PRIX SPONSOR ARCH (Z = -25) ── */}
      <group position={[0, 0, -25]}>
        <mesh position={[-5.2, 3.0, 0]} castShadow material={trussMetalMat}>
          <boxGeometry args={[0.5, 6, 0.5]} />
        </mesh>
        <mesh position={[5.2, 3.0, 0]} castShadow material={trussMetalMat}>
          <boxGeometry args={[0.5, 6, 0.5]} />
        </mesh>
        <mesh position={[0, 5.6, 0]} castShadow>
          <boxGeometry args={[11.0, 1.2, 0.6]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} />
        </mesh>
        {/* Glow Trim */}
        <mesh position={[0, 5.6, 0.32]}>
          <planeGeometry args={[10.2, 0.9]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ── 8. GIANT CHECKERED FINISH LINE ARCHWAY (Z = -55) ── */}
      <group position={[0, 0, -55]}>
        {/* Left Massive Victory Pillar */}
        <mesh position={[-5.4, 3.5, 0]} castShadow material={trussMetalMat}>
          <boxGeometry args={[0.8, 7.0, 0.8]} />
        </mesh>
        {/* Right Massive Victory Pillar */}
        <mesh position={[5.4, 3.5, 0]} castShadow material={trussMetalMat}>
          <boxGeometry args={[0.8, 7.0, 0.8]} />
        </mesh>
        {/* Overhead Victory Arch Frame */}
        <mesh position={[0, 6.2, 0]} castShadow>
          <boxGeometry args={[11.6, 1.8, 1.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>

        {/* Checkered Finish Arch Face */}
        <group position={[0, 6.2, 0.52]}>
          {Array.from({ length: 14 }).map((_, col) =>
            Array.from({ length: 3 }).map((__, row) => (
              <mesh
                key={`chk-arch-${col}-${row}`}
                position={[-4.8 + col * 0.74, -0.6 + row * 0.6, 0]}
              >
                <planeGeometry args={[0.74, 0.6]} />
                <meshBasicMaterial color={(col + row) % 2 === 0 ? '#ffffff' : '#000000'} />
              </mesh>
            ))
          )}
        </group>

        {/* Checkered Finish Line on Asphalt Track */}
        <group position={[0, 0.06, 0]}>
          {Array.from({ length: 12 }).map((_, col) =>
            Array.from({ length: 2 }).map((__, row) => (
              <mesh
                key={`chk-track-${col}-${row}`}
                position={[-4.2 + col * 0.76, 0, -0.4 + row * 0.8]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[0.76, 0.8]} />
                <meshBasicMaterial color={(col + row) % 2 === 0 ? '#ffffff' : '#000000'} />
              </mesh>
            ))
          )}
        </group>

        {/* Victory Flashing Beacons */}
        {[-4.5, 0, 4.5].map((x, idx) => (
          <pointLight
            key={`finish-beacon-${idx}`}
            position={[x, 7.5, 0.5]}
            color="#fbbf24"
            intensity={2.8}
            distance={8}
          />
        ))}

        {/* Confetti Cannons on Victory */}
        {raceWinner && (
          <group ref={confettiRef} position={[0, 6, 0]}>
            {Array.from({ length: 80 }).map((_, i) => {
              const colors = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];
              return (
                <mesh
                  key={`confetti-${i}`}
                  position={[-4 + (i % 9), 1 + (i % 6), (i % 5) - 2]}
                  rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
                >
                  <planeGeometry args={[0.15, 0.15]} />
                  <meshBasicMaterial color={colors[i % colors.length]} side={THREE.DoubleSide} />
                </mesh>
              );
            })}
          </group>
        )}
      </group>
    </group>
  );
};
