// ============================================================
// THE GREAT CARNIVAL OF CHANCE — 3D Carnival Island Hub
// Masterpiece 3D Island with Cursor Parallax Interaction,
// Spacious Non-Overlapping Building Placement,
// Neo-Brutalist 3D Name Cards on every attraction,
// Open-air Odds Wheel & Grand Carnival (no obstructive roofs)
// ============================================================

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useCarnivalStore } from '../store/carnivalStore';

// ═══════════════════════════════════════════════════════════════
// HELPER: Neo-Brutalist Interactive 3D Name Badge
// ═══════════════════════════════════════════════════════════════
const NeoBrutalistNameCard: React.FC<{
  name: string;
  subtitle: string;
  tagColor?: string;
  position: [number, number, number];
  onClick?: () => void;
}> = ({ name, subtitle, tagColor = '#facc15', position, onClick }) => {
  return (
    <group position={position}>
      <Html
        center
        distanceFactor={28}
        position={[0, 0, 0]}
        className="pointer-events-auto select-none"
      >
        <button
          onClick={onClick}
          className="flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl border-3 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          style={{ backgroundColor: tagColor }}
        >
          <span className="text-[12px] sm:text-[13px] font-black uppercase tracking-wider text-black font-sans leading-tight">
            {name}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-red-900 bg-white/90 px-1.5 py-0.2 rounded border border-black mt-0.5">
            {subtitle}
          </span>
        </button>
      </Html>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Striped Carnival Scalloped Awning
// ═══════════════════════════════════════════════════════════════
const StripedAwning: React.FC<{
  width: number;
  depth: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  stripeCount?: number;
  color1?: string;
  color2?: string;
}> = ({
  width,
  depth,
  position,
  rotation = [0, 0, 0],
  stripeCount = 8,
  color1 = '#dc2626',
  color2 = '#ffffff',
}) => {
  const sliceWidth = width / stripeCount;
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: stripeCount }).map((_, i) => (
        <mesh
          key={i}
          position={[(i - (stripeCount - 1) / 2) * sliceWidth, 0, 0]}
          castShadow
        >
          <boxGeometry args={[sliceWidth * 0.98, 0.1, depth]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? color1 : color2}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Front Scalloped Trim */}
      {Array.from({ length: stripeCount }).map((_, i) => (
        <mesh
          key={`scallop-${i}`}
          position={[(i - (stripeCount - 1) / 2) * sliceWidth, -0.08, depth / 2 + 0.05]}
          castShadow
        >
          <boxGeometry args={[sliceWidth * 0.9, 0.16, 0.06]} />
          <meshStandardMaterial color={i % 2 === 0 ? color1 : color2} />
        </mesh>
      ))}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Carnival Bunting Pennant Flags
// ═══════════════════════════════════════════════════════════════
const BuntingFlags: React.FC<{
  width: number;
  position: [number, number, number];
  count?: number;
}> = ({ width, position, count = 8 }) => {
  const colors = ['#dc2626', '#2563eb', '#f59e0b', '#16a34a', '#9333ea', '#f97316'];
  const spacing = width / count;
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, 0.03, 0.03]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          position={[(i - (count - 1) / 2) * spacing, -0.2, 0]}
          castShadow
        >
          <coneGeometry args={[0.13, 0.35, 3]} />
          <meshStandardMaterial color={colors[i % colors.length]} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 1. CENTRAL CLOCK TOWER & CAROUSEL PAVILION
// ═══════════════════════════════════════════════════════════════
const CentralClockTower: React.FC = () => {
  const clockHandsRef = useRef<THREE.Group>(null);
  const fountainWaterRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (clockHandsRef.current) {
      clockHandsRef.current.rotation.z -= delta * 0.6;
    }
    if (fountainWaterRef.current) {
      fountainWaterRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group position={[0, 0, -2.5]}>
      {/* ── Octagonal Stone Central Plaza ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 5.8, 0.3, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.32, 0]} receiveShadow>
        <cylinderGeometry args={[4.6, 4.9, 0.08, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>

      {/* ── Front Fountain Basin ── */}
      <group position={[0, 0.4, 3.4]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.5, 0.3, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[1.15, 1.15, 0.06, 16]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.8} transparent opacity={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 0.5, 12]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
        <mesh ref={fountainWaterRef} position={[0, 0.85, 0]}>
          <coneGeometry args={[0.35, 0.7, 8]} />
          <meshPhysicalMaterial color="#bae6fd" transmission={0.9} transparent opacity={0.75} />
        </mesh>
      </group>

      {/* ── Victorian Carousel Ground Tier ── */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 2.9, 0.8, 24]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      {/* White & Gold Carnival Base Bands */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[2.55, 2.55, 0.14, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[2.6, 2.6, 0.1, 24]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ── Red-Brick Clock Tower Middle Tier ── */}
      <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 4.8, 2.2]} />
        <meshStandardMaterial color="#b45309" roughness={0.65} />
      </mesh>
      {/* White Corner Stone Quoins */}
      {[-1.1, 1.1].map((x, i) =>
        [-1.1, 1.1].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 3.6, z]} castShadow>
            <boxGeometry args={[0.18, 4.85, 0.18]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        ))
      )}
      {/* Golden Cornice Balustrade */}
      <mesh position={[0, 6.1, 0]} castShadow>
        <boxGeometry args={[2.7, 0.35, 2.7]} />
        <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 4 Clock Faces */}
      {[
        { pos: [0, 4.8, 1.15] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
        { pos: [0, 4.8, -1.15] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] },
        { pos: [1.15, 4.8, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] },
        { pos: [-1.15, 4.8, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] },
      ].map((face, idx) => (
        <group key={idx} position={face.pos} rotation={face.rot}>
          <mesh>
            <circleGeometry args={[0.65, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[0.6, 0.68, 32]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Rotating Clock Hands */}
      <group ref={clockHandsRef} position={[0, 4.8, 1.18]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.04, 0.42, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <boxGeometry args={[0.03, 0.48, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* ── Blue Conical Slate Spire Roof ── */}
      <mesh position={[0, 7.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.7, 2.8, 4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.35} />
      </mesh>
      {/* Golden Finial Ball */}
      <mesh position={[0, 9.1, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Flagpole & Fluttering Red Flag */}
      <mesh position={[0, 9.8, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.9} />
      </mesh>
      <mesh position={[0.3, 10.0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.32, 0.02]} />
        <meshStandardMaterial color="#e11d48" roughness={0.3} />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2A. BUILDING: THE MYSTERY CHESTS (Top-Left)
// ═══════════════════════════════════════════════════════════════
const MysteryChestsBuilding: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);

  return (
    <group
      position={[-8.5, 0, -8.5]}
      rotation={[0, 0.65, 0]}
      onClick={() => openActivity('mystery-bag')}
    >
      {/* Neo-Brutalist Name Card on Top */}
      <NeoBrutalistNameCard
        name="THE MYSTERY CHESTS"
        subtitle="3D BALL DRAW"
        tagColor="#facc15"
        position={[0, 5.4, 0.4]}
        onClick={() => openActivity('mystery-bag')}
      />

      {/* Foundation Platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.4, 0.3, 4.2]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* 4 Carved Wooden Corner Posts */}
      {[
        [-2.4, 2.2, -1.8],
        [2.4, 2.2, -1.8],
        [-2.4, 2.2, 1.8],
        [2.4, 2.2, 1.8],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.15, 4.0, 12]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.9, 0]} castShadow>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Red Velvet Back Wall */}
      <mesh position={[0, 2.2, -1.8]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 3.8, 0.15]} />
        <meshStandardMaterial color="#991b1b" roughness={0.7} />
      </mesh>

      {/* Side Half-Walls */}
      {[-2.4, 2.4].map((x, i) => (
        <mesh key={i} position={[x, 1.3, 0]} castShadow>
          <boxGeometry args={[0.15, 2.2, 3.6]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
      ))}

      {/* Front Stage Counter */}
      <mesh position={[0, 1.05, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.18, 1.0]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 1.95]} castShadow>
        <boxGeometry args={[5.0, 0.85, 0.12]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>

      {/* Striped Red & White Scalloped Canopy Roof */}
      <StripedAwning
        width={5.8}
        depth={4.6}
        position={[0, 4.2, 0.15]}
        rotation={[0.12, 0, 0]}
        stripeCount={10}
        color1="#dc2626"
        color2="#ffffff"
      />

      {/* 3 3D Treasure Chests on Stage */}
      {[-1.6, 0, 1.6].map((x, idx) => (
        <group key={idx} position={[x, 1.35, 1.3]} rotation={[0, (idx - 1) * 0.15, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.5, 0.6]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
          {[-0.32, 0.32].map((bx, j) => (
            <mesh key={j} position={[bx, 0, 0]} castShadow>
              <boxGeometry args={[0.07, 0.52, 0.62]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.31]} castShadow>
            <boxGeometry args={[0.14, 0.16, 0.02]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.9, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#b45309" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Glowing Magic Sack in Center */}
      <group position={[0, 1.3, -0.4]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <sphereGeometry args={[0.75, 20, 16]} />
          <meshStandardMaterial color="#9a3412" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.7, 0.5, 16]} />
          <meshStandardMaterial color="#c2410c" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <torusGeometry args={[0.45, 0.04, 10, 20]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
      </group>

      <BuntingFlags width={5.0} position={[0, 4.0, 2.1]} count={8} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2B. BUILDING: THE ODDS WHEEL (Left - Open Air, No Awning Roof)
// ═══════════════════════════════════════════════════════════════
const OddsWheelBuilding: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const wheelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z -= delta * 0.5;
    }
  });

  const segmentColors = [
    '#2563eb', '#dc2626', '#2563eb', '#f59e0b',
    '#2563eb', '#dc2626', '#2563eb', '#16a34a',
    '#2563eb', '#dc2626',
  ];
  const segCount = segmentColors.length;
  const segAngle = (Math.PI * 2) / segCount;
  const wheelRadius = 2.4;

  return (
    <group
      position={[-11.0, 0, 0.5]}
      rotation={[0, 0.85, 0]}
      onClick={() => openActivity('odds-wheel')}
    >
      {/* Neo-Brutalist Name Card on Top */}
      <NeoBrutalistNameCard
        name="THE ODDS WHEEL"
        subtitle="PRIZE SPINNER"
        tagColor="#facc15"
        position={[0, 6.8, 0.2]}
        onClick={() => openActivity('odds-wheel')}
      />

      {/* Stepped Wooden Foundation Deck */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.4, 3.8, 0.4, 32]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.0, 3.3, 0.15, 32]} />
        <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Red & Gold Steel A-Frame Lattice Truss Towers */}
      <mesh position={[-1.1, 2.6, 0]} rotation={[0, 0, -0.18]} castShadow>
        <boxGeometry args={[0.24, 5.0, 0.24]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[1.1, 2.6, 0]} rotation={[0, 0, 0.18]} castShadow>
        <boxGeometry args={[0.24, 5.0, 0.24]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[2.2, 0.16, 0.2]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <boxGeometry args={[1.7, 0.16, 0.2]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ═════════════════════════════════════════════════════════════
          GIANT ROTATING OPEN CARNIVAL ODDS WHEEL (Accurate Pie Wedges)
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 4.0, 0.2]}>
        <group ref={wheelRef}>
          {/* Backing Disc */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[wheelRadius, wheelRadius, 0.12, 48]} />
            <meshStandardMaterial color="#451a03" roughness={0.6} />
          </mesh>
          {/* Thick Brass Outer Ring Tyre */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[wheelRadius + 0.12, wheelRadius + 0.12, 0.16, 48, 1, true]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* True Pie-Slice Wedges */}
          {segmentColors.map((col, i) => (
            <mesh
              key={i}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry
                args={[
                  wheelRadius - 0.08,
                  wheelRadius - 0.08,
                  0.14,
                  16,
                  1,
                  false,
                  i * segAngle,
                  segAngle * 0.98,
                ]}
              />
              <meshStandardMaterial color={col} roughness={0.3} metalness={0.15} />
            </mesh>
          ))}

          {/* Brass Pegs & Lights on Edge */}
          {Array.from({ length: segCount }).map((_, i) => {
            const angle = i * segAngle + segAngle / 2;
            return (
              <mesh
                key={`peg-${i}`}
                position={[
                  Math.cos(angle) * (wheelRadius - 0.16),
                  Math.sin(angle) * (wheelRadius - 0.16),
                  0.1,
                ]}
                castShadow
              >
                <sphereGeometry args={[0.08, 10, 10]} />
                <meshStandardMaterial
                  color="#fef08a"
                  emissive="#f59e0b"
                  emissiveIntensity={0.6}
                  metalness={0.9}
                />
              </mesh>
            );
          })}

          {/* Center Golden Star Hub */}
          <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.18, 24]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.22]} castShadow>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} />
          </mesh>
        </group>

        {/* Flapper Pointer at 12 O'Clock */}
        <mesh position={[0, wheelRadius + 0.18, 0.12]} rotation={[0, 0, Math.PI]} castShadow>
          <coneGeometry args={[0.22, 0.65, 16]} />
          <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2C. BUILDING: GIANT BALL DROP TOWER (Top-Right)
// ═══════════════════════════════════════════════════════════════
const BallDropBuilding: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const agitatorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (agitatorRef.current) {
      agitatorRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <group
      position={[8.5, 0, -8.5]}
      rotation={[0, -0.65, 0]}
      onClick={() => openActivity('ball-drop')}
    >
      {/* Neo-Brutalist Name Card on Top */}
      <NeoBrutalistNameCard
        name="GIANT BALL DROP"
        subtitle="10-TRIAL PACHINKO"
        tagColor="#facc15"
        position={[0, 5.8, 0.4]}
        onClick={() => openActivity('ball-drop')}
      />

      {/* Foundation Platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.8, 0.3, 3.8]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* Building Slate Walls */}
      <mesh position={[0, 2.0, -1.6]} castShadow>
        <boxGeometry args={[4.6, 3.6, 0.15]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      {[-2.2, 2.2].map((x, i) => (
        <mesh key={i} position={[x, 2.0, 0]} castShadow>
          <boxGeometry args={[0.15, 3.6, 3.2]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
      ))}

      {/* Counter */}
      <mesh position={[0, 1.0, 1.4]} castShadow>
        <boxGeometry args={[4.6, 0.16, 0.8]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>

      {/* Transparent Glass Silo Chamber with 3D Balls */}
      <group position={[0, 0.4, -0.1]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[1.3, 1.5, 0.4, 24]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>

        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
          <mesh
            key={i}
            position={[Math.cos(ang) * 1.15, 2.4, Math.sin(ang) * 1.15]}
            castShadow
          >
            <cylinderGeometry args={[0.07, 0.07, 3.6, 12]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}

        <mesh position={[0, 2.6, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 2.8, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transmission={0.92}
            transparent
            opacity={1}
            roughness={0.06}
          />
        </mesh>

        {/* 3D Colorful Balls */}
        {[
          { c: '#16a34a', p: [-0.3, 1.8, 0.2] },
          { c: '#16a34a', p: [0.3, 2.2, -0.15] },
          { c: '#16a34a', p: [-0.1, 2.6, 0.3] },
          { c: '#16a34a', p: [0.2, 3.0, -0.3] },
          { c: '#eab308', p: [0, 1.6, -0.1] },
          { c: '#16a34a', p: [-0.35, 2.8, 0.1] },
          { c: '#16a34a', p: [0.15, 2.0, 0.25] },
          { c: '#eab308', p: [0.3, 2.5, 0.2] },
          { c: '#2563eb', p: [-0.2, 2.3, -0.25] },
          { c: '#dc2626', p: [0.25, 1.9, -0.2] },
        ].map((b, i) => (
          <mesh key={i} position={b.p as [number, number, number]} castShadow>
            <sphereGeometry args={[0.15, 14, 14]} />
            <meshStandardMaterial color={b.c} roughness={0.25} metalness={0.15} />
          </mesh>
        ))}

        <group ref={agitatorRef} position={[0, 2.5, 0]}>
          {[0, 1, 2].map((p) => (
            <mesh
              key={p}
              position={[0, -0.3 + p * 0.4, 0]}
              rotation={[0, (p * Math.PI) / 3, 0]}
            >
              <boxGeometry args={[0.85, 0.04, 0.08]} />
              <meshStandardMaterial color="#eab308" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Red Helical Chute */}
        {Array.from({ length: 16 }).map((_, i) => {
          const prog = i / 16;
          const angle = prog * Math.PI * 3.5;
          const y = 3.4 - prog * 2.2;
          const x = Math.sin(angle) * 1.25;
          const z = Math.cos(angle) * 1.25;
          return (
            <mesh key={`chute-${i}`} position={[x, y, z]} rotation={[0, -angle, 0.25]} castShadow>
              <boxGeometry args={[0.2, 0.05, 0.3]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
            </mesh>
          );
        })}

        {/* Golden Onion Dome Roof */}
        <mesh position={[0, 4.2, 0]} castShadow>
          <sphereGeometry args={[1.15, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#eab308" metalness={0.88} roughness={0.18} />
        </mesh>
        <mesh position={[0, 4.85, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} />
        </mesh>
      </group>

      <BuntingFlags width={4.6} position={[0, 3.4, 1.6]} count={7} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2D. BUILDING: THE PROBABILITY LAB (Right)
// ═══════════════════════════════════════════════════════════════
const ProbabilityLabBuilding: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const orbRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group
      position={[11.0, 0, 0.5]}
      rotation={[0, -0.85, 0]}
      onClick={() => openActivity('probability-lab')}
    >
      {/* Neo-Brutalist Name Card on Top */}
      <NeoBrutalistNameCard
        name="THE PROBABILITY LAB"
        subtitle="SAMPLE SPACE ALCHEMY"
        tagColor="#facc15"
        position={[0, 5.8, 0.4]}
        onClick={() => openActivity('probability-lab')}
      />

      {/* Stone Foundation */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.2, 0.3, 3.8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Victorian Stone Lab Body */}
      <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 3.4, 3.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <boxGeometry args={[5.0, 0.2, 3.6]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.4} />
      </mesh>

      {/* Arched Stone Door */}
      <mesh position={[0, 1.4, 1.65]} castShadow>
        <boxGeometry args={[2.2, 2.4, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Counter */}
      <mesh position={[0, 1.0, 1.9]} castShadow>
        <boxGeometry args={[4.8, 0.15, 0.7]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Rooftop Glass Alchemy Dome with Orbiting Particles */}
      <mesh position={[0, 4.3, 0]}>
        <sphereGeometry args={[1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.88}
          transparent
          opacity={1}
          roughness={0.05}
        />
      </mesh>

      <group ref={orbRef} position={[0, 4.4, 0]}>
        {[
          { c: '#2563eb', p: [0.45, 0.2, 0.35] },
          { c: '#dc2626', p: [-0.35, 0.1, -0.45] },
          { c: '#2563eb', p: [0.15, 0.45, -0.25] },
          { c: '#f59e0b', p: [0, 0.2, 0] },
        ].map((b, i) => (
          <mesh key={i} position={b.p as [number, number, number]} castShadow>
            <sphereGeometry args={[0.16, 14, 14]} />
            <meshStandardMaterial
              color={b.c}
              roughness={0.2}
              emissive={b.c}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Twin Liquid Columns */}
      <group position={[-1.6, 4.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.24, 0.24, 1.7, 14]} />
          <meshPhysicalMaterial color="#e2e8f0" transmission={0.9} transparent opacity={1} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.9, 14]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <group position={[1.6, 4.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.24, 0.24, 1.7, 14]} />
          <meshPhysicalMaterial color="#e2e8f0" transmission={0.9} transparent opacity={1} />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.2, 14]} />
          <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={0.3} />
        </mesh>
      </group>

      <BuntingFlags width={4.8} position={[0, 3.5, 1.7]} count={8} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2E. BUILDING: BUILD A GAME WORKSHOP (Bottom-Left)
// ═══════════════════════════════════════════════════════════════
const GameBuilderBuilding: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);

  return (
    <group
      position={[-7.5, 0, 8.5]}
      rotation={[0, 0.35, 0]}
      onClick={() => openActivity('game-builder')}
    >
      {/* Neo-Brutalist Name Card on Top */}
      <NeoBrutalistNameCard
        name="BUILD A GAME"
        subtitle="PEG TARGETS"
        tagColor="#facc15"
        position={[0, 5.4, 0.4]}
        onClick={() => openActivity('game-builder')}
      />

      {/* Timber Deck Foundation */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.2, 0.3, 3.8]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* Artisan Timber Workshop Body */}
      <mesh position={[0, 2.3, -1.6]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 4.2, 0.15]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>
      {[-2.3, 2.3].map((x, i) => (
        <mesh key={i} position={[x, 2.3, 0]} castShadow>
          <boxGeometry args={[0.15, 4.2, 3.2]} />
          <meshStandardMaterial color="#a3622a" roughness={0.6} />
        </mesh>
      ))}

      {/* Workbench Counter */}
      <mesh position={[0, 1.05, 1.3]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.16, 1.0]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>

      {/* Striped Workshop Awning */}
      <StripedAwning
        width={5.4}
        depth={3.8}
        position={[0, 4.3, 0.1]}
        rotation={[0.12, 0, 0]}
        stripeCount={8}
        color1="#ea580c"
        color2="#facc15"
      />

      {/* Giant 3D Colorful Dice on Workbench */}
      <mesh position={[-1.4, 1.35, 1.3]} rotation={[0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} />
      </mesh>
      <mesh position={[1.4, 1.35, 1.3]} rotation={[-0.2, -0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} />
      </mesh>

      {/* Pegboard Game Mounted on Back Wall */}
      <group position={[0, 2.9, -1.4]} rotation={[-0.05, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2.7, 0.12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <mesh
              key={`${row}-${col}`}
              position={[
                (col - 2) * 0.5 + (row % 2 === 0 ? 0.25 : 0),
                (row - 1.5) * 0.5,
                0.08,
              ]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, 0.16, 8]} />
              <meshStandardMaterial color="#fef08a" metalness={0.9} />
            </mesh>
          ))
        )}
        {Array.from({ length: 8 }).map((_, i) => {
          const isWin = i === 1 || i === 4 || i === 6;
          return (
            <mesh key={i} position={[(i - 3.5) * 0.36, -1.15, 0.08]} castShadow>
              <boxGeometry args={[0.3, 0.32, 0.12]} />
              <meshStandardMaterial color={isWin ? '#16a34a' : '#dc2626'} roughness={0.4} />
            </mesh>
          );
        })}
      </group>

      <BuntingFlags width={4.6} position={[0, 3.8, 1.8]} count={7} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2F. BUILDING: GRAND CARNIVAL GATEWAY (Bottom-Center - Open Arch, No Covering Cone Roof)
// ═══════════════════════════════════════════════════════════════
const GrandCarnivalBuilding: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const trophyRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 1.2;
      trophyRef.current.position.y =
        3.9 + Math.sin(state.clock.getElapsedTime() * 2) * 0.12;
    }
  });

  return (
    <group
      position={[3.5, 0, 9.5]}
      rotation={[0, -0.25, 0]}
      onClick={() => openActivity('grand-carnival')}
    >
      {/* Neo-Brutalist Name Card on Top */}
      <NeoBrutalistNameCard
        name="GRAND CARNIVAL"
        subtitle="CHAMPIONSHIP ARENA"
        tagColor="#facc15"
        position={[0, 6.8, 0.2]}
        onClick={() => openActivity('grand-carnival')}
      />

      {/* Grand Foundation Pedestal */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.0, 4.4, 0.4, 32]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.6, 3.9, 0.1, 32]} />
        <meshStandardMaterial color="#fef08a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Twin Circus Towers (Left & Right) */}
      {[-2.2, 2.2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 2.6, 0]} castShadow>
            <boxGeometry args={[1.3, 4.6, 1.3]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.0, 0]} castShadow>
            <boxGeometry args={[1.4, 0.18, 1.4]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0, 5.0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.22, 1.6]} />
            <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 6.0, 0]} castShadow>
            <coneGeometry args={[0.95, 1.6, 12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
          <mesh position={[0, 6.9, 0]} castShadow>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
          <mesh position={[x > 0 ? 0.3 : -0.3, 7.2, 0]} castShadow>
            <boxGeometry args={[0.4, 0.25, 0.02]} />
            <meshStandardMaterial color={i === 0 ? '#2563eb' : '#dc2626'} />
          </mesh>
        </group>
      ))}

      {/* Central Arch Connecting Towers (Open Sky) */}
      <mesh position={[0, 4.6, 0]} castShadow>
        <boxGeometry args={[3.0, 0.65, 1.1]} />
        <meshStandardMaterial color="#fef08a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.1, 0]} castShadow>
        <boxGeometry args={[2.6, 0.22, 0.9]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>

      {/* Floating Glowing Championship Trophy Cup */}
      <group ref={trophyRef} position={[0, 3.9, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.45, 0.22, 0.6, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.08} />
        </mesh>
        {[-0.5, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 0.1, 0]} rotation={[0, 0, x > 0 ? -0.3 : 0.3]} castShadow>
            <torusGeometry args={[0.18, 0.045, 8, 12, Math.PI]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} />
          </mesh>
        ))}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.42, 0.18, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
      </group>

      <BuntingFlags width={5.2} position={[0, 4.3, 1.8]} count={9} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. ISLAND TERRAIN, BOARDWALK PIER, BOATS, PATHS, FLORA
// ═══════════════════════════════════════════════════════════════
const IslandEnvironment: React.FC = () => {
  return (
    <group>
      {/* Multi-Tier Lush Grass Island */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[19, 21, 1.6, 48]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>
      {/* Sandy Beach Shore Ring */}
      <mesh position={[0, -1.0, 0]} receiveShadow>
        <cylinderGeometry args={[21, 23, 0.8, 48]} />
        <meshStandardMaterial color="#fef08a" roughness={0.9} />
      </mesh>
      {/* Sparkling Ocean */}
      <mesh position={[0, -1.3, 0]} receiveShadow>
        <cylinderGeometry args={[50, 50, 0.4, 48]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          roughness={0.12}
          metalness={0.1}
          transmission={0.65}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Boardwalk Pier */}
      <mesh position={[0, 0.05, 17]} receiveShadow castShadow>
        <boxGeometry args={[3.4, 0.22, 10.5]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      {[-1.5, 1.5].map((x, i) => (
        <group key={i}>
          {[12.5, 14.5, 16.5, 18.5, 20.5].map((z, j) => (
            <mesh key={j} position={[x, 0.55, z]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.9, 8]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          ))}
          <mesh position={[x, 0.95, 17]} castShadow>
            <boxGeometry args={[0.08, 0.08, 10.5]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </group>
      ))}

      {/* Sailboat */}
      <group position={[16, -0.6, 14]} rotation={[0, -0.6, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.3, 0.45, 2.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.9, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 3.0, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 1.9, 0.5]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <coneGeometry args={[0.85, 2.4, 3]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      </group>

      {/* Cobblestone Pathways */}
      {[
        { pos: [-4.5, 0.06, -5.2] as [number, number, number], w: 7.5, d: 1.8, rot: 0.6 },
        { pos: [4.5, 0.06, -5.2] as [number, number, number], w: 7.5, d: 1.8, rot: -0.6 },
        { pos: [-6.0, 0.06, -0.5] as [number, number, number], w: 7.5, d: 1.8, rot: 0.1 },
        { pos: [6.0, 0.06, -0.5] as [number, number, number], w: 7.5, d: 1.8, rot: -0.1 },
        { pos: [-4.5, 0.06, 5.2] as [number, number, number], w: 7.0, d: 1.8, rot: -0.5 },
        { pos: [2.5, 0.06, 5.5] as [number, number, number], w: 6.5, d: 1.8, rot: 0.3 },
        { pos: [0, 0.06, 6.5] as [number, number, number], w: 2.6, d: 8.5, rot: 0 },
      ].map((path, i) => (
        <mesh key={i} position={path.pos} rotation={[0, path.rot, 0]} receiveShadow>
          <boxGeometry args={[path.w, 0.06, path.d]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>
      ))}

      {/* Pine Trees */}
      {[
        [-15, 0, -9], [-16, 0, 2], [-14, 0, 13],
        [15, 0, -9], [16, 0, 2], [14, 0, 13],
        [-5, 0, -15], [5, 0, -15],
        [-11, 0, -13], [11, 0, -13],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.24, 1.6, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[1.15, 2.0, 7]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.2, 0]} castShadow>
            <coneGeometry args={[0.9, 1.6, 7]} />
            <meshStandardMaterial color="#16a34a" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.9, 0]} castShadow>
            <coneGeometry args={[0.65, 1.1, 7]} />
            <meshStandardMaterial color="#22c55e" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Street Lanterns */}
      {[
        [-3.2, 0, 1.2], [3.2, 0, 1.2],
        [-6.5, 0, -4.5], [6.5, 0, -4.5],
        [0, 0, 8.5],
      ].map(([x, y, z], i) => (
        <group key={`lamp-${i}`} position={[x, y, z]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 2.4, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. PARALLAX RIG CONTAINER (Responds Smoothly to Cursor)
// ═══════════════════════════════════════════════════════════════
const IslandParallaxRig: React.FC = () => {
  const rigRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (rigRef.current) {
      // Smooth dynamic parallax based on pointer coordinates
      const targetRotY = state.pointer.x * 0.18;
      const targetRotX = -state.pointer.y * 0.08;
      rigRef.current.rotation.y = THREE.MathUtils.lerp(rigRef.current.rotation.y, targetRotY, delta * 3);
      rigRef.current.rotation.x = THREE.MathUtils.lerp(rigRef.current.rotation.x, targetRotX, delta * 3);
    }
  });

  return (
    <group ref={rigRef}>
      <IslandEnvironment />
      <CentralClockTower />
      <MysteryChestsBuilding />
      <OddsWheelBuilding />
      <BallDropBuilding />
      <ProbabilityLabBuilding />
      <GameBuilderBuilding />
      <GrandCarnivalBuilding />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. MAIN ISLAND CANVAS
// ═══════════════════════════════════════════════════════════════
export const CarnivalIslandScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 24, 30], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
        }}
      >
        <color attach="background" args={['#bae6fd']} />

        {/* Sun & Lighting */}
        <ambientLight intensity={0.8} color="#f0f9ff" />
        <directionalLight
          position={[16, 30, 18]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color="#fffbeb"
        />
        <directionalLight position={[-14, 12, -12]} intensity={0.45} color="#38bdf8" />

        {/* Parallax-enabled 3D Island */}
        <IslandParallaxRig />
      </Canvas>
    </div>
  );
};
