// ============================================================
// THE GREAT CARNIVAL OF CHANCE — 3D Carnival Island Hub
// Masterpiece 3D Carnival Island with detailed architectural booths:
// 1. The Odds Wheel (Ferris prize wheel with A-frame & marquee)
// 2. The Mystery Chests (Circus stage with 3 treasure chests & sack)
// 3. Central Clock Tower & Carousel Pavilion (Victorian landmark)
// 4. Giant Ball Drop (Transparent gumball silo with helical slide)
// 5. The Probability Lab (Stone & copper alchemy lab with liquid tubes)
// 6. Build A Game Workshop (Artisan workshop with pegboard & giant dice)
// 7. Grand Carnival Gateway (Twin circus spires, arch & floating trophy)
// Connecting stone paths, festive bunting, pier boardwalk, trees & ocean
// ============================================================

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../store/carnivalStore';
import { ATTRACTIONS_META } from '../engine/probabilityData';

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
      {/* String Cable */}
      <mesh>
        <boxGeometry args={[width, 0.03, 0.03]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Triangle Pennants */}
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
// HELPER: Grand Marquee Signboard with Incandescent Bulbs
// ═══════════════════════════════════════════════════════════════
const GrandMarqueeSign: React.FC<{
  position: [number, number, number];
  titleColor: string;
  width?: number;
  height?: number;
}> = ({ position, titleColor, width = 3.6, height = 0.75 }) => {
  const bulbCount = 8;
  return (
    <group position={position}>
      {/* Mounting Posts */}
      {[-width * 0.4, width * 0.4].map((x, i) => (
        <mesh key={i} position={[x, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.2, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
      ))}
      {/* Wooden Backing Board */}
      <mesh castShadow>
        <boxGeometry args={[width, height, 0.14]} />
        <meshStandardMaterial color={titleColor} roughness={0.4} />
      </mesh>
      {/* Gold Inner Bevel Plaque */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[width - 0.2, height - 0.16, 0.02]} />
        <meshStandardMaterial color="#fef08a" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Warm Incandescent Bulbs Around Frame */}
      {Array.from({ length: bulbCount }).map((_, i) => {
        const x = ((i / (bulbCount - 1)) - 0.5) * (width - 0.3);
        return (
          <mesh key={`top-${i}`} position={[x, height * 0.4, 0.09]} castShadow>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>
        );
      })}
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
    <group position={[0, 0, -1.0]}>
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
        {/* Central Fountain Spout */}
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

      {/* 4 Clock Faces (Front, Back, Left, Right) */}
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

      {/* Rotating Clock Hands on Front Face */}
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
      position={[-7.8, 0, -5.8]}
      rotation={[0, 0.5, 0]}
      onClick={() => openActivity('mystery-bag')}
    >
      {/* ── Foundation Platform ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.4, 0.3, 4.2]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* ── 4 Ornate Carved Wooden Corner Posts ── */}
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

      {/* ── Red Velvet Back Wall ── */}
      <mesh position={[0, 2.2, -1.8]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 3.8, 0.15]} />
        <meshStandardMaterial color="#991b1b" roughness={0.7} />
      </mesh>

      {/* ── Side Half-Walls ── */}
      {[-2.4, 2.4].map((x, i) => (
        <mesh key={i} position={[x, 1.3, 0]} castShadow>
          <boxGeometry args={[0.15, 2.2, 3.6]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
      ))}

      {/* ── Front Stage Counter Shelf ── */}
      <mesh position={[0, 1.05, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.18, 1.0]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 1.95]} castShadow>
        <boxGeometry args={[5.0, 0.85, 0.12]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>

      {/* ── Striped Red & White Scalloped Awning Roof ── */}
      <StripedAwning
        width={5.8}
        depth={4.6}
        position={[0, 4.2, 0.15]}
        rotation={[0.12, 0, 0]}
        stripeCount={10}
        color1="#dc2626"
        color2="#ffffff"
      />

      {/* ═════════════════════════════════════════════════════════════
          3 ORNATE 3D TREASURE CHESTS ON THE STAGE COUNTER
          ═════════════════════════════════════════════════════════════ */}
      {[-1.6, 0, 1.6].map((x, idx) => (
        <group key={idx} position={[x, 1.35, 1.3]} rotation={[0, (idx - 1) * 0.15, 0]}>
          {/* Wooden Chest Box */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.5, 0.6]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
          {/* Gold Straps & Corners */}
          {[-0.32, 0.32].map((bx, j) => (
            <mesh key={j} position={[bx, 0, 0]} castShadow>
              <boxGeometry args={[0.07, 0.52, 0.62]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
            </mesh>
          ))}
          {/* Keyhole */}
          <mesh position={[0, 0, 0.31]} castShadow>
            <boxGeometry args={[0.14, 0.16, 0.02]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} />
          </mesh>
          {/* Curved Lid */}
          <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.9, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#b45309" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* ── Iconic Glowing Magic Sack in the Center ── */}
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

      {/* ── Marquee Sign on Roof ── */}
      <GrandMarqueeSign
        position={[0, 5.1, 0.3]}
        titleColor="#b91c1c"
        width={3.8}
        height={0.8}
      />
      <BuntingFlags width={5.0} position={[0, 4.0, 2.1]} count={8} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2B. BUILDING: THE ODDS WHEEL (Left)
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
  const wheelRadius = 2.1;

  return (
    <group
      position={[-9.5, 0, 1.2]}
      rotation={[0, 0.75, 0]}
      onClick={() => openActivity('odds-wheel')}
    >
      {/* ── Foundation Deck ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.2, 3.5, 0.3, 24]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* ── Navy Blue Booth Pavilion Structure ── */}
      <mesh position={[0, 2.2, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 4.0, 0.15]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.5} />
      </mesh>
      {/* Counter */}
      <mesh position={[0, 0.95, 0.9]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.18, 1.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 1.45]} castShadow>
        <boxGeometry args={[5.0, 0.8, 0.12]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>

      {/* ── Red & Gold Steel A-Frame Lattice Truss Support ── */}
      <mesh position={[-0.95, 3.0, -0.8]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.22, 4.6, 0.22]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.95, 3.0, -0.8]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.22, 4.6, 0.22]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 2.4, -0.8]} castShadow>
        <boxGeometry args={[1.8, 0.14, 0.18]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ═════════════════════════════════════════════════════════════
          GIANT ROTATING CARNIVAL ODDS WHEEL (Accurate Pie Wedges)
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 3.8, -0.6]}>
        <group ref={wheelRef}>
          {/* Backing Disc */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[wheelRadius, wheelRadius, 0.1, 48]} />
            <meshStandardMaterial color="#451a03" roughness={0.6} />
          </mesh>
          {/* Thick Brass Outer Ring Tyre */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[wheelRadius + 0.1, wheelRadius + 0.1, 0.14, 48, 1, true]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* ── True Pie-Slice Wedges ── */}
          {segmentColors.map((col, i) => (
            <mesh
              key={i}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry
                args={[
                  wheelRadius - 0.06,
                  wheelRadius - 0.06,
                  0.12,
                  16,
                  1,
                  false,
                  i * segAngle,
                  segAngle * 0.98,
                ]}
              />
              <meshStandardMaterial color={col} roughness={0.3} metalness={0.1} />
            </mesh>
          ))}

          {/* ── Brass Pegs & Incandescent Lights on Edge ── */}
          {Array.from({ length: segCount }).map((_, i) => {
            const angle = i * segAngle + segAngle / 2;
            return (
              <mesh
                key={`peg-${i}`}
                position={[
                  Math.cos(angle) * (wheelRadius - 0.15),
                  Math.sin(angle) * (wheelRadius - 0.15),
                  0.08,
                ]}
                castShadow
              >
                <sphereGeometry args={[0.07, 10, 10]} />
                <meshStandardMaterial
                  color="#fef08a"
                  emissive="#f59e0b"
                  emissiveIntensity={0.5}
                  metalness={0.9}
                />
              </mesh>
            );
          })}

          {/* Center Golden Star Medal Hub */}
          <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.16, 24]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.18]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} />
          </mesh>
        </group>

        {/* Flapper Clicker Pointer at Top */}
        <mesh position={[0, wheelRadius + 0.15, 0.1]} rotation={[0, 0, Math.PI]} castShadow>
          <coneGeometry args={[0.2, 0.6, 16]} />
          <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Blue/Gold Striped Awning ── */}
      <StripedAwning
        width={5.6}
        depth={3.2}
        position={[0, 5.2, 0.2]}
        rotation={[0.1, 0, 0]}
        stripeCount={8}
        color1="#1e3a5f"
        color2="#f59e0b"
      />

      {/* ── Marquee Sign ── */}
      <GrandMarqueeSign
        position={[0, 6.0, 0.5]}
        titleColor="#1e3a5f"
        width={3.8}
        height={0.8}
      />
      <BuntingFlags width={5.2} position={[0, 4.8, 1.4]} count={9} />
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
      position={[7.8, 0, -5.8]}
      rotation={[0, -0.5, 0]}
      onClick={() => openActivity('ball-drop')}
    >
      {/* ── Foundation Platform ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.8, 0.3, 3.8]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* ── Building Back & Side Walls (Slate Stone) ── */}
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

      {/* ═════════════════════════════════════════════════════════════
          THE GUMBALL SILO TOWER (Clear Glass + 3D Balls + Red Spiral)
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 0.4, -0.1]}>
        {/* Brass Base Ring */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[1.3, 1.5, 0.4, 24]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* 4 Brass Pillars */}
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

        {/* Transparent Glass Silo Chamber */}
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

        {/* 3D Colorful Balls Inside Silo */}
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

        {/* Rotating Agitator Paddle */}
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

        {/* Red Helical Chute Coiling Around Silo */}
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

      {/* ── Awning ── */}
      <StripedAwning
        width={5.2}
        depth={3.6}
        position={[0, 3.6, 0.1]}
        rotation={[0.1, 0, 0]}
        stripeCount={8}
        color1="#334155"
        color2="#16a34a"
      />

      {/* ── Marquee Sign ── */}
      <GrandMarqueeSign
        position={[0, 4.5, 1.1]}
        titleColor="#334155"
        width={3.6}
        height={0.75}
      />
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
      position={[9.5, 0, 1.2]}
      rotation={[0, -0.75, 0]}
      onClick={() => openActivity('probability-lab')}
    >
      {/* ── Stone Foundation ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.2, 0.3, 3.8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* ── Victorian Stone Lab Building ── */}
      <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 3.4, 3.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Purple & Gold Frieze Band */}
      <mesh position={[0, 3.4, 0]} castShadow>
        <boxGeometry args={[5.0, 0.2, 3.6]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.4} />
      </mesh>

      {/* Arched Stone Entrance Doorway */}
      <mesh position={[0, 1.4, 1.65]} castShadow>
        <boxGeometry args={[2.2, 2.4, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Counter */}
      <mesh position={[0, 1.0, 1.9]} castShadow>
        <boxGeometry args={[4.8, 0.15, 0.7]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* ── Rooftop Glass Alchemy Dome with Orbiting Particles ── */}
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

      {/* ── Twin Calibrated Liquid Columns (Left Red, Right Blue) ── */}
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

      {/* ── Marquee Sign ── */}
      <GrandMarqueeSign
        position={[0, 5.6, 0.5]}
        titleColor="#7c3aed"
        width={3.8}
        height={0.8}
      />
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
      position={[-6.5, 0, 7.5]}
      rotation={[0, 0.35, 0]}
      onClick={() => openActivity('game-builder')}
    >
      {/* ── Timber Deck Foundation ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.2, 0.3, 3.8]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* ── Artisan Timber Workshop Body ── */}
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

      {/* ── Carpenter Workbench Counter ── */}
      <mesh position={[0, 1.05, 1.3]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.16, 1.0]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>

      {/* ── Pitched Roof ── */}
      <mesh position={[-1.2, 4.7, 0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[2.9, 0.1, 4.0]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} />
      </mesh>
      <mesh position={[1.2, 4.7, 0]} rotation={[0, 0, -0.35]} castShadow>
        <boxGeometry args={[2.9, 0.1, 4.0]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} />
      </mesh>

      {/* ── Giant 3D Colorful Dice on Workbench ── */}
      <mesh position={[-1.4, 1.35, 1.3]} rotation={[0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} />
      </mesh>
      <mesh position={[1.4, 1.35, 1.3]} rotation={[-0.2, -0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} />
      </mesh>

      {/* ── Pegboard Game Mounted on Back Wall ── */}
      <group position={[0, 2.9, -1.4]} rotation={[-0.05, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2.7, 0.12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Brass Pegs */}
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
        {/* Target Slots */}
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

      {/* ── Spinning Brass Gears on Outer Wall ── */}
      <mesh position={[-2.4, 3.6, 0.5]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.35, 0.07, 8, 12]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.85} />
      </mesh>

      {/* ── Marquee Sign ── */}
      <GrandMarqueeSign
        position={[0, 5.2, 0.5]}
        titleColor="#ea580c"
        width={3.6}
        height={0.75}
      />
      <BuntingFlags width={4.6} position={[0, 4.1, 1.5]} count={7} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2F. BUILDING: GRAND CARNIVAL ENTRANCE GATEWAY (Bottom-Center)
// ═══════════════════════════════════════════════════════════════
const GrandCarnivalBuilding: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const carouselRef = useRef<THREE.Group>(null);
  const trophyRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (carouselRef.current) {
      carouselRef.current.rotation.y += delta * 0.5;
    }
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 1.2;
      trophyRef.current.position.y =
        3.9 + Math.sin(state.clock.getElapsedTime() * 2) * 0.12;
    }
  });

  return (
    <group
      position={[0, 0, 9.8]}
      onClick={() => openActivity('grand-carnival')}
    >
      {/* ── Grand Foundation Pedestal ── */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.0, 4.4, 0.4, 32]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.6, 3.9, 0.1, 32]} />
        <meshStandardMaterial color="#fef08a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ── Twin Circus Towers (Left & Right) ── */}
      {[-2.2, 2.2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Tower Body */}
          <mesh position={[0, 2.6, 0]} castShadow>
            <boxGeometry args={[1.3, 4.6, 1.3]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          {/* White Stripe Band */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <boxGeometry args={[1.4, 0.18, 1.4]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Gold Cornice */}
          <mesh position={[0, 5.0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.22, 1.6]} />
            <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Scalloped Red/White Cone Turret */}
          <mesh position={[0, 6.0, 0]} castShadow>
            <coneGeometry args={[0.95, 1.6, 12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
          {/* Golden Finial Ball & Flag */}
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

      {/* ── Central Arch Connecting Towers ── */}
      <mesh position={[0, 4.6, 0]} castShadow>
        <boxGeometry args={[3.0, 0.65, 1.1]} />
        <meshStandardMaterial color="#fef08a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.1, 0]} castShadow>
        <boxGeometry args={[2.6, 0.22, 0.9]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>

      {/* ── Rotating Scalloped Carousel Canopy On Arch ── */}
      <group ref={carouselRef} position={[0, 5.6, 0]}>
        <mesh castShadow>
          <coneGeometry args={[2.4, 1.1, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 7) * 2.3,
              -0.18,
              Math.sin((i * Math.PI) / 7) * 2.3,
            ]}
            castShadow
          >
            <boxGeometry args={[0.22, 0.28, 0.06]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#fbbf24' : '#ffffff'} />
          </mesh>
        ))}
      </group>

      {/* ── Floating Glowing Championship Trophy Cup ── */}
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

      {/* ── Grand Marquee Sign ── */}
      <GrandMarqueeSign
        position={[0, 7.6, 0]}
        titleColor="#b91c1c"
        width={3.8}
        height={0.8}
      />
      <BuntingFlags width={5.2} position={[0, 4.3, 2.2]} count={9} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. ISLAND TERRAIN, BOARDWALK PIER, BOATS, PATHS, FLORA
// ═══════════════════════════════════════════════════════════════
const IslandEnvironment: React.FC = () => {
  return (
    <group>
      {/* ── Multi-Tier Lush Grass Island ── */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[18, 20, 1.6, 48]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>
      {/* Sandy Beach Shore Ring */}
      <mesh position={[0, -1.0, 0]} receiveShadow>
        <cylinderGeometry args={[20, 22, 0.8, 48]} />
        <meshStandardMaterial color="#fef08a" roughness={0.9} />
      </mesh>
      {/* Sparkling Turquoise Ocean */}
      <mesh position={[0, -1.3, 0]} receiveShadow>
        <cylinderGeometry args={[48, 48, 0.4, 48]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          roughness={0.12}
          metalness={0.1}
          transmission={0.65}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* ── Wooden Boardwalk Pier Extends Forward ── */}
      <mesh position={[0, 0.05, 17]} receiveShadow castShadow>
        <boxGeometry args={[3.4, 0.22, 10.5]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      {/* Pier Railings & Posts */}
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

      {/* ── Sailboat in the Bay ── */}
      <group position={[15, -0.6, 14]} rotation={[0, -0.6, 0]}>
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

      {/* ── Cobblestone Pathways Linking Booths ── */}
      {[
        { pos: [-4.5, 0.06, -3.2] as [number, number, number], w: 7.5, d: 1.8, rot: 0.5 },
        { pos: [4.5, 0.06, -3.2] as [number, number, number], w: 7.5, d: 1.8, rot: -0.5 },
        { pos: [-5.2, 0.06, 0.5] as [number, number, number], w: 8.0, d: 1.8, rot: -0.2 },
        { pos: [5.2, 0.06, 0.5] as [number, number, number], w: 8.0, d: 1.8, rot: 0.2 },
        { pos: [-3.5, 0.06, 4.5] as [number, number, number], w: 7.0, d: 1.8, rot: -0.6 },
        { pos: [0, 0.06, 5.5] as [number, number, number], w: 2.6, d: 8.5, rot: 0 },
      ].map((path, i) => (
        <mesh key={i} position={path.pos} rotation={[0, path.rot, 0]} receiveShadow>
          <boxGeometry args={[path.w, 0.06, path.d]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>
      ))}

      {/* ── Pine Trees ── */}
      {[
        [-14, 0, -8], [-15, 0, 2], [-13, 0, 12],
        [14, 0, -8], [15, 0, 2], [13, 0, 12],
        [-5, 0, -14], [5, 0, -14],
        [-10, 0, -12], [10, 0, -12],
        [-16, 0, 6], [16, 0, 6],
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

      {/* ── Warm Street Lanterns ── */}
      {[
        [-3.2, 0, 1.2], [3.2, 0, 1.2],
        [-6.2, 0, -4.2], [6.2, 0, -4.2],
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
// 4. MAIN ISLAND CANVAS
// ═══════════════════════════════════════════════════════════════
export const CarnivalIslandScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 22, 28], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
        }}
      >
        <color attach="background" args={['#bae6fd']} />

        {/* ── Sun & Ambient Lighting ── */}
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

        {/* ── Island World Environment ── */}
        <IslandEnvironment />
        <CentralClockTower />

        {/* ── 6 Detailed 3D Carnival Attraction Buildings ── */}
        <MysteryChestsBuilding />
        <OddsWheelBuilding />
        <BallDropBuilding />
        <ProbabilityLabBuilding />
        <GameBuilderBuilding />
        <GrandCarnivalBuilding />
      </Canvas>
    </div>
  );
};
