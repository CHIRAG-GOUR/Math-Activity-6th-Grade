// ============================================================
// BLUEPRINT BLITZ — 3D Physical House Construction Progression
// As teams answer questions across the 5 rounds, their house physically builds:
// - Round 1: Foundation Pad + Laid Decorative Floor Tiles
// - Round 2: 1st Floor Exterior Brick Walls + Front Entrance Door
// - Round 3: Interior Room Divider Walls + Glass Windows
// - Round 4: 2nd Story Multi-Room House Structure + Balcony Railing
// - Round 5 / Victory: Finished Dream House with Pitched Terracotta Roof,
//   Brick Chimney with Chimney Smoke, Porch Lights, & Victory Flags!
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TeamId } from '../types';

interface HouseBuildingStage3DProps {
  teamId: TeamId;
  currentRound: number;
  completedStages: number;
  isGameOver?: boolean;
}

export const HouseBuildingStage3D: React.FC<HouseBuildingStage3DProps> = ({
  teamId,
  currentRound,
  completedStages,
  isGameOver = false,
}) => {
  const smokeGroupRef = useRef<THREE.Group>(null);
  const flagRef = useRef<THREE.Group>(null);

  const isBlue = teamId === 'blue';
  const teamColor = isBlue ? '#2563eb' : '#dc2626';

  // Smoke & flag animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (smokeGroupRef.current) {
      smokeGroupRef.current.children.forEach((child, idx) => {
        const offset = idx * 0.8;
        child.position.y = 0.4 + ((t * 1.2 + offset) % 2.5);
        const scale = 0.15 + child.position.y * 0.25;
        child.scale.set(scale, scale, scale);
        child.position.x = Math.sin(t * 1.5 + offset) * 0.15;
      });
    }
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(t * 3) * 0.2;
    }
  });

  // Effective visible stage level (at least currentRound or completedStages)
  const activeLevel = Math.max(1, Math.min(5, isGameOver ? 5 : currentRound));

  return (
    <group position={[0, 0, 0]}>
      {/* ── STAGE 1: FOUNDATION PAD & FLOOR TILES (Visible for all rounds >= 1) ── */}
      {activeLevel >= 1 && (
        <group position={[0, 0, 0]}>
          {/* Foundation Screed Edge */}
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[7.4, 0.08, 6.4]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} metalness={0.1} />
          </mesh>
          {/* Laid Floor Tiles */}
          <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[7.0, 6.0]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>
          {/* Wood Tile Grout Lines */}
          <group position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {[-2.5, -1.25, 0, 1.25, 2.5].map((x, idx) => (
              <mesh key={`gx-${idx}`} position={[x, 0, 0]}>
                <planeGeometry args={[0.03, 5.8]} />
                <meshBasicMaterial color="#94a3b8" />
              </mesh>
            ))}
            {[-2, -1, 0, 1, 2].map((y, idx) => (
              <mesh key={`gy-${idx}`} position={[0, y, 0]}>
                <planeGeometry args={[6.8, 0.03]} />
                <meshBasicMaterial color="#94a3b8" />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* ── STAGE 2: 1ST FLOOR EXTERIOR BRICK WALLS & FRONT DOOR (Rounds >= 2) ── */}
      {activeLevel >= 2 && (
        <group position={[0, 0, 0]}>
          {/* Back Brick Wall */}
          <mesh position={[0, 1.1, -2.85]} castShadow>
            <boxGeometry args={[6.8, 2.0, 0.3]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.7} />
          </mesh>

          {/* Left Brick Wall */}
          <mesh position={[-3.25, 1.1, 0]} castShadow>
            <boxGeometry args={[0.3, 2.0, 5.8]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.7} />
          </mesh>

          {/* Right Brick Wall */}
          <mesh position={[3.25, 1.1, 0]} castShadow>
            <boxGeometry args={[0.3, 2.0, 5.8]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.7} />
          </mesh>

          {/* Front Wall with Doorway Opening */}
          <mesh position={[-1.8, 1.1, 2.85]} castShadow>
            <boxGeometry args={[3.0, 2.0, 0.3]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.7} />
          </mesh>
          <mesh position={[1.8, 1.1, 2.85]} castShadow>
            <boxGeometry args={[3.0, 2.0, 0.3]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.85, 2.85]} castShadow>
            <boxGeometry args={[1.2, 0.5, 0.3]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.7} />
          </mesh>

          {/* Front Wooden Entrance Door */}
          <group position={[0, 0.75, 2.85]}>
            <mesh castShadow>
              <boxGeometry args={[0.95, 1.5, 0.08]} />
              <meshStandardMaterial color="#78350f" roughness={0.6} />
            </mesh>
            {/* Brass Doorknob */}
            <mesh position={[0.35, 0, 0.05]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Door Frame Trim */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.05, 1.58, 0.12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      )}

      {/* ── STAGE 3: INTERIOR ROOM DIVIDER WALLS & WINDOWS (Rounds >= 3) ── */}
      {activeLevel >= 3 && (
        <group position={[0, 0, 0]}>
          {/* Interior Room Divider Wall */}
          <mesh position={[0.6, 1.0, 0]} castShadow>
            <boxGeometry args={[0.15, 1.8, 4.5]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <mesh position={[-1.3, 1.0, -0.6]} castShadow>
            <boxGeometry args={[3.8, 1.8, 0.15]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>

          {/* Front Glass Windows */}
          <group position={[-1.8, 1.1, 2.86]}>
            <mesh>
              <planeGeometry args={[1.1, 1.0]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
            </mesh>
            {/* White Window Mullions */}
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[1.15, 0.04, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[0.04, 1.05, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>

          <group position={[1.8, 1.1, 2.86]}>
            <mesh>
              <planeGeometry args={[1.1, 1.0]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[1.15, 0.04, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[0.04, 1.05, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      )}

      {/* ── STAGE 4: 2ND STORY UPPER LIVING SPACE & BALCONY (Rounds >= 4) ── */}
      {activeLevel >= 4 && (
        <group position={[0, 2.1, 0]}>
          {/* 2nd Story Floor Intermediate Slab */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[7.0, 0.16, 6.2]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
          </mesh>

          {/* 2nd Floor Walls */}
          <mesh position={[0, 1.0, -2.85]} castShadow>
            <boxGeometry args={[6.8, 1.8, 0.3]} />
            <meshStandardMaterial color="#dc2626" roughness={0.7} />
          </mesh>
          <mesh position={[-3.25, 1.0, 0]} castShadow>
            <boxGeometry args={[0.3, 1.8, 5.8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.7} />
          </mesh>
          <mesh position={[3.25, 1.0, 0]} castShadow>
            <boxGeometry args={[0.3, 1.8, 5.8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.0, 2.85]} castShadow>
            <boxGeometry args={[6.8, 1.8, 0.3]} />
            <meshStandardMaterial color="#dc2626" roughness={0.7} />
          </mesh>

          {/* 2nd Floor Windows */}
          {[-1.8, 0, 1.8].map((wx, idx) => (
            <group key={`w2-${idx}`} position={[wx, 1.0, 2.86]}>
              <mesh>
                <planeGeometry args={[0.9, 0.9]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <boxGeometry args={[0.95, 0.04, 0.02]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <boxGeometry args={[0.04, 0.95, 0.02]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}

          {/* Front Balcony Railing */}
          <group position={[0, 0.45, 3.2]}>
            <mesh>
              <boxGeometry args={[4.2, 0.06, 0.06]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            {[-1.8, -0.9, 0, 0.9, 1.8].map((rx, idx) => (
              <mesh key={`post-${idx}`} position={[rx, -0.22, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.45, 6]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* ── STAGE 5 / VICTORY: PITCHED ROOF, CHIMNEY & CELEBRATION (Round 5 / Game Over) ── */}
      {activeLevel >= 5 && (
        <group position={[0, 4.0, 0]}>
          {/* Pitched Terracotta Roof (Left Slope) */}
          <mesh position={[-1.75, 0.8, 0]} rotation={[0, 0, 0.45]} castShadow>
            <boxGeometry args={[3.9, 0.18, 6.6]} />
            <meshStandardMaterial color="#ea580c" roughness={0.5} />
          </mesh>

          {/* Pitched Terracotta Roof (Right Slope) */}
          <mesh position={[1.75, 0.8, 0]} rotation={[0, 0, -0.45]} castShadow>
            <boxGeometry args={[3.9, 0.18, 6.6]} />
            <meshStandardMaterial color="#ea580c" roughness={0.5} />
          </mesh>

          {/* Front Gable Triangle Endwall */}
          <mesh position={[0, 0.7, 2.9]} rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0, 3.4, 1.5, 4]} />
            <meshStandardMaterial color="#fef08a" roughness={0.6} />
          </mesh>

          {/* Back Gable Triangle Endwall */}
          <mesh position={[0, 0.7, -2.9]} rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0, 3.4, 1.5, 4]} />
            <meshStandardMaterial color="#fef08a" roughness={0.6} />
          </mesh>

          {/* Brick Chimney */}
          <group position={[1.8, 1.5, -1.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.7, 1.6, 0.7]} />
              <meshStandardMaterial color="#7f1d1d" roughness={0.8} />
            </mesh>
            {/* Chimney Cap */}
            <mesh position={[0, 0.82, 0]}>
              <boxGeometry args={[0.82, 0.12, 0.82]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Rising Chimney Smoke Particles */}
            <group ref={smokeGroupRef} position={[0, 0.9, 0]}>
              {[0, 1, 2].map((idx) => (
                <mesh key={`smoke-${idx}`} position={[0, 0.3 * idx, 0]}>
                  <sphereGeometry args={[0.18, 8, 8]} />
                  <meshStandardMaterial
                    color="#e2e8f0"
                    transparent
                    opacity={0.45 - idx * 0.1}
                    roughness={0.9}
                  />
                </mesh>
              ))}
            </group>
          </group>

          {/* Victory Team Flag on Rooftop Ridge */}
          <group ref={flagRef} position={[0, 1.7, 2.2]}>
            {/* Flagpole */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.1, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Team Flag Banner */}
            <mesh position={[0.3, 0.85, 0]}>
              <boxGeometry args={[0.55, 0.32, 0.02]} />
              <meshStandardMaterial color={teamColor} roughness={0.3} />
            </mesh>
            {/* Gold Finial Ball */}
            <mesh position={[0, 1.06, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
          </group>

          {/* Front Entrance Porch Awning with Lantern Lamp */}
          <group position={[0, -2.4, 3.2]}>
            <mesh castShadow>
              <boxGeometry args={[1.6, 0.1, 0.9]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            {/* Glowing Porch Lantern */}
            <mesh position={[0, -0.15, 0.25]}>
              <cylinderGeometry args={[0.06, 0.08, 0.14, 8]} />
              <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
