// ============================================================
// BLUEPRINT BLITZ — 3D Construction Tower Crane Component
// Interactive physics-inspired tower crane featuring:
// - Heavy ballast foundation & lattice steel mast
// - Slew ring deck with 360-degree smooth rotation
// - Horizontal jib arm, operator cabin, and moving trolley
// - Steel hoist cable, spreader bar, and magnetic block grabber
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TeamId } from '../types';

interface CraneRig3DProps {
  teamId: TeamId;
  angle: number;           // Rotation in radians
  height: number;          // Cable extension height
  position?: [number, number, number];
  isHolding?: boolean;
}

export const CraneRig3D: React.FC<CraneRig3DProps> = ({
  teamId,
  angle,
  height,
  position = [0, 0, 0],
  isHolding = true,
}) => {
  const slewGroupRef = useRef<THREE.Group>(null);
  const hookGroupRef = useRef<THREE.Group>(null);

  const teamColor = teamId === 'blue' ? '#2563eb' : '#dc2626';

  // Smooth lerping of crane rotation and hoist cable
  useFrame((_, delta) => {
    if (slewGroupRef.current) {
      slewGroupRef.current.rotation.y = THREE.MathUtils.damp(
        slewGroupRef.current.rotation.y,
        angle,
        6,
        delta
      );
    }
    if (hookGroupRef.current) {
      const targetY = 4.2 - height * 0.6;
      hookGroupRef.current.position.y = THREE.MathUtils.damp(
        hookGroupRef.current.position.y,
        targetY,
        8,
        delta
      );
    }
  });

  return (
    <group position={position}>
      {/* ── HEAVY CONCRETE BASE & BALLAST ── */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.5, 2.2]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.9, 1.0, 0.2, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* ── VERTICAL LATTICE TOWER MAST ── */}
      <group position={[0, 0.6, 0]}>
        {/* Central Mast Core */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[0.45, 5.0, 0.45]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Lattice Strut Details */}
        {[1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, i, 0]}>
            <boxGeometry args={[0.55, 0.08, 0.55]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        ))}
      </group>

      {/* ── ROTATING SLEW DECK & JIB ASSEMBLY ── */}
      <group ref={slewGroupRef} position={[0, 5.7, 0]}>
        {/* Slew Gear Ring & Operator Cabin */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>

        {/* Operator Cabin */}
        <mesh position={[0.4, 0.35, 0.2]} castShadow>
          <boxGeometry args={[0.6, 0.7, 0.5]} />
          <meshStandardMaterial color={teamColor} roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0.42, 0.4, 0.46]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Counterweight Arm (Rear Jib) */}
        <mesh position={[-1.2, 0.3, 0]} castShadow>
          <boxGeometry args={[2.0, 0.25, 0.3]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.5} />
        </mesh>
        {/* Heavy Concrete Counter-weights */}
        <mesh position={[-1.8, 0.3, 0]} castShadow>
          <boxGeometry args={[0.8, 0.6, 0.6]} />
          <meshStandardMaterial color="#64748b" roughness={0.8} />
        </mesh>

        {/* Front Working Jib (Arm) */}
        <mesh position={[2.5, 0.3, 0]} castShadow>
          <boxGeometry args={[5.0, 0.28, 0.28]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* A-Frame Tower Peak */}
        <mesh position={[0, 1.0, 0]}>
          <coneGeometry args={[0.5, 1.6, 4]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Moving Trolley & Hook Assembly */}
        <group position={[3.2, 0.1, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.2, 0.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Steel Hoist Cable */}
          <mesh position={[0, -1.8, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 3.6, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>

          {/* Hook / Block Rig */}
          <group ref={hookGroupRef} position={[0, -2.5, 0]}>
            {/* Spreader Bar & Hook */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.6, 0.1, 0.2]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <torusGeometry args={[0.1, 0.03, 8, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>

            {/* Held Building Module / Unit Cube */}
            {isHolding && (
              <group position={[0, -0.6, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.9, 0.9, 0.9]} />
                  <meshStandardMaterial
                    color={teamColor}
                    roughness={0.4}
                    metalness={0.3}
                  />
                </mesh>
                <mesh>
                  <boxGeometry args={[0.94, 0.94, 0.94]} />
                  <meshStandardMaterial color="#ffffff" wireframe />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>
    </group>
  );
};
