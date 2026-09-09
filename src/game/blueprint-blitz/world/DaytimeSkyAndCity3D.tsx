// ============================================================
// BLUEPRINT BLITZ — Bright Sunny Daytime Sky & Modern City
// Features:
// - Clear bright blue sky with procedural drifting clouds
// - Animated distant birds soaring across the horizon
// - Unfinished multi-story concrete building under active construction
// - Sunny modern city backdrop: Warm brick, beige concrete, glass windows, green trees
// ============================================================

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── 1. UNFINISHED MULTI-STORY CONCRETE BUILDING (Reference Image 1) ──
export const UnfinishedBuilding3D: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* 4 Open Concrete Floor Slabs */}
      {[0, 2.5, 5.0, 7.5].map((y, floorIdx) => (
        <group key={floorIdx} position={[0, y, 0]}>
          {/* Main Floor Plate */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[14, 0.25, 7]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
          </mesh>

          {/* Concrete Vertical Columns & Outer Pillars */}
          {[-6, -3, 0, 3, 6].map((x, colIdx) => (
            <group key={colIdx}>
              <mesh position={[x, 1.3, -3]} castShadow>
                <boxGeometry args={[0.5, 2.4, 0.5]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.7} />
              </mesh>
              <mesh position={[x, 1.3, 3]} castShadow>
                <boxGeometry args={[0.5, 2.4, 0.5]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.7} />
              </mesh>
            </group>
          ))}

          {/* Curved Corner Balconies */}
          <mesh position={[-6.8, 0.1, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.25, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>

          {/* Orange/Red Safety Guardrails & Rebar */}
          <mesh position={[0, 0.6, 3.4]}>
            <boxGeometry args={[13.8, 0.06, 0.06]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
          <mesh position={[0, 0.6, -3.4]}>
            <boxGeometry args={[13.8, 0.06, 0.06]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
        </group>
      ))}

      {/* Rooftop Construction Formwork & Rebar Spikes */}
      <group position={[0, 10, 0]}>
        {[-5, -2, 1, 4].map((x, idx) => (
          <mesh key={idx} position={[x, 0.6, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ── 2. ANIMATED SOARING BIRDS ──
export const FlyingBirds3D: React.FC = () => {
  const birdsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (birdsRef.current) {
      birdsRef.current.position.x = ((t * 2) % 60) - 30;
      birdsRef.current.position.y = 18 + Math.sin(t * 1.5) * 0.8;
    }
  });

  return (
    <group ref={birdsRef} position={[-20, 18, -25]}>
      {[0, 2, 3.5].map((xOffset, idx) => (
        <group key={idx} position={[xOffset, (idx % 2) * 0.5, idx * 0.8]}>
          <mesh rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.3, 0.04, 0.1]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.25, 0, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.3, 0.04, 0.1]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ── 3. SUNNY MODERN CITY SKYLINE & RESIDENTIAL BUILDINGS ──
export const SunnyCityBackdrop3D: React.FC = () => {
  const cityBuildings = useMemo(() => {
    const list: Array<{ x: number; z: number; width: number; height: number; depth: number; color: string; roofColor?: string }> = [];
    const wallColors = ['#f8fafc', '#fef3c7', '#fed7aa', '#e2e8f0', '#ffedd5', '#f1f5f9'];
    const roofColors = ['#b91c1c', '#c2410c', '#334155', '#7c2d12', '#475569'];

    for (let i = -12; i <= 12; i++) {
      if (Math.abs(i) < 3) continue; // Keep center clear for unfinished building
      const h = 7 + (Math.sin(i * 1.2) * 3) + (Math.cos(i * 2.5) * 2.5);
      list.push({
        x: i * 3.8,
        z: -26 - Math.abs(i) * 0.8,
        width: 3.2,
        height: h,
        depth: 3.2,
        color: wallColors[(Math.abs(i) + 1) % wallColors.length],
        roofColor: roofColors[Math.abs(i) % roofColors.length],
      });
    }
    return list;
  }, []);

  return (
    <group>
      {/* City Buildings */}
      {cityBuildings.map((b, idx) => (
        <group key={idx} position={[b.x, b.height * 0.5, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} roughness={0.6} />
          </mesh>
          {/* Pitched Roof */}
          <mesh position={[0, b.height * 0.5 + 0.6, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[b.width * 0.75, 1.2, 4]} />
            <meshStandardMaterial color={b.roofColor} roughness={0.5} />
          </mesh>

          {/* Window grids */}
          {Array.from({ length: Math.floor(b.height / 2) }).map((_, wIdx) => (
            <mesh key={wIdx} position={[0, -(b.height * 0.5) + (wIdx + 1) * 1.8, b.depth * 0.5 + 0.05]}>
              <planeGeometry args={[b.width * 0.75, 0.7]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Green Street Trees */}
      {[-24, -20, -16, 16, 20, 24].map((x, idx) => (
        <group key={idx} position={[x, 0, -20]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 2.0, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 2.8, 0]} castShadow>
            <sphereGeometry args={[1.2, 12, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
