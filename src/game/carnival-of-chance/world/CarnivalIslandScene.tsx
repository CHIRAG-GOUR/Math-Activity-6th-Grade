// ============================================================
// THE GREAT CARNIVAL OF CHANCE — 3D Carnival Island Hub
// Detailed 3D buildings for each attraction with proper architecture:
// walls, striped awnings, pitched roofs, entrance arches, windows,
// and the signature activity element prominently on display
// ============================================================

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../store/carnivalStore';
import { ATTRACTIONS_META } from '../engine/probabilityData';

// ═══════════════════════════════════════════════════════════════
// HELPER: Striped Carnival Awning (alternating red/white slats)
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
  stripeCount = 6,
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
          <boxGeometry args={[sliceWidth * 0.98, 0.08, depth]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? color1 : color2}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Carnival Bunting Flags (small triangular pennants)
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
      {/* String */}
      <mesh>
        <boxGeometry args={[width, 0.02, 0.02]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          position={[(i - (count - 1) / 2) * spacing, -0.18, 0]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <coneGeometry args={[0.12, 0.3, 3]} />
          <meshStandardMaterial color={colors[i % colors.length]} />
        </mesh>
      ))}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Wooden Sign Post with Text Panel
// ═══════════════════════════════════════════════════════════════
const WoodenSign: React.FC<{
  position: [number, number, number];
  panelColor: string;
  width?: number;
  height?: number;
}> = ({ position, panelColor, width = 2.8, height = 0.6 }) => (
  <group position={position}>
    {/* Post */}
    <mesh position={[0, -0.6, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
      <meshStandardMaterial color="#92400e" roughness={0.7} />
    </mesh>
    {/* Panel */}
    <mesh castShadow>
      <boxGeometry args={[width, height, 0.08]} />
      <meshStandardMaterial color={panelColor} roughness={0.4} />
    </mesh>
    {/* Gold trim */}
    <mesh position={[0, 0, 0.045]}>
      <boxGeometry args={[width - 0.1, height - 0.1, 0.01]} />
      <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.3} />
    </mesh>
  </group>
);

// ═══════════════════════════════════════════════════════════════
// 1. CENTRAL CLOCK TOWER & PLAZA
// ═══════════════════════════════════════════════════════════════
const CentralClockTower: React.FC = () => {
  const clockHandsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (clockHandsRef.current) {
      clockHandsRef.current.rotation.z -= delta * 0.8;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Octagonal Stone Plaza */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[4.5, 5.0, 0.3, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.32, 0]} receiveShadow>
        <cylinderGeometry args={[3.8, 4.0, 0.06, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>

      {/* Red & White Striped Base Ring */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.4, 0.7, 24]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      {/* White stripe band */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[2.05, 2.05, 0.12, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* Brick Tower Body */}
      <mesh position={[0, 3.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 5.2, 2.0]} />
        <meshStandardMaterial color="#b45309" roughness={0.65} />
      </mesh>
      {/* Decorative stone band mid */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[2.15, 0.2, 2.15]} />
        <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Gold Cornice */}
      <mesh position={[0, 5.9, 0]} castShadow>
        <boxGeometry args={[2.4, 0.3, 2.4]} />
        <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* 4 Clock Faces (N, S, E, W) */}
      {[
        { pos: [0, 4.6, 1.05] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
        { pos: [0, 4.6, -1.05] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] },
        { pos: [1.05, 4.6, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] },
        { pos: [-1.05, 4.6, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] },
      ].map((face, idx) => (
        <group key={idx} position={face.pos} rotation={face.rot}>
          <mesh>
            <circleGeometry args={[0.6, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[0.55, 0.6, 32]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}

      {/* Rotating hands on front face */}
      <group ref={clockHandsRef} position={[0, 4.6, 1.08]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.04, 0.35, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <boxGeometry args={[0.03, 0.42, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Blue Spire Roof */}
      <mesh position={[0, 7.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.5, 2.6, 4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Golden Finial */}
      <mesh position={[0, 8.7, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Flagpole & Flag */}
      <mesh position={[0, 9.3, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} />
      </mesh>
      <mesh position={[0.25, 9.5, 0]} castShadow>
        <boxGeometry args={[0.45, 0.28, 0.02]} />
        <meshStandardMaterial color="#e11d48" roughness={0.3} />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2A. MYSTERY SACK BOOTH — Proper Tent/Booth Building
// Open-front carnival tent with giant sack inside on a table
// ═══════════════════════════════════════════════════════════════
const MysterySackBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['mystery-bag'];

  return (
    <group
      position={meta.islandPosition}
      onClick={() => openActivity('mystery-bag')}
    >
      {/* ── Foundation Platform ── */}
      <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.0, 0.24, 3.8]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* ── 4 Corner Posts (wooden) ── */}
      {[
        [-2.2, 2.0, -1.6],
        [2.2, 2.0, -1.6],
        [-2.2, 2.0, 1.6],
        [2.2, 2.0, 1.6],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 3.7, 12]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
      ))}

      {/* ── Back Wall (closed) ── */}
      <mesh position={[0, 2.0, -1.6]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 3.5, 0.12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>

      {/* ── Side Walls (half height) ── */}
      <mesh position={[-2.2, 1.2, 0]} castShadow>
        <boxGeometry args={[0.12, 2.1, 3.2]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>
      <mesh position={[2.2, 1.2, 0]} castShadow>
        <boxGeometry args={[0.12, 2.1, 3.2]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>

      {/* ── Counter / Front Shelf ── */}
      <mesh position={[0, 1.0, 1.6]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.15, 0.7]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      {/* Counter front panel */}
      <mesh position={[0, 0.55, 1.85]} castShadow>
        <boxGeometry args={[4.6, 0.8, 0.1]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>

      {/* ── Striped Red/White Awning Roof ── */}
      <StripedAwning
        width={5.4}
        depth={4.2}
        position={[0, 3.9, 0.15]}
        rotation={[0.1, 0, 0]}
        stripeCount={8}
      />
      {/* Awning front lip (scalloped effect via larger depth) */}
      <mesh position={[0, 3.75, 2.1]} castShadow>
        <boxGeometry args={[5.4, 0.2, 0.06]} />
        <meshStandardMaterial color="#fef08a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ── MAIN ATTRACTION: Giant 3D Cloth Sack on Table ── */}
      <group position={[0, 1.2, -0.2]}>
        {/* Table */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.12, 1.6]} />
          <meshStandardMaterial color="#d97706" roughness={0.5} />
        </mesh>
        {/* Sack Body */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <sphereGeometry args={[0.85, 24, 20]} />
          <meshStandardMaterial color="#9a3412" roughness={0.85} />
        </mesh>
        {/* Sack Neck */}
        <mesh position={[0, 1.65, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.8, 0.55, 20]} />
          <meshStandardMaterial color="#c2410c" roughness={0.8} />
        </mesh>
        {/* Gold Drawstring */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <torusGeometry args={[0.55, 0.04, 12, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Visible balls peeking out */}
        {[
          { c: '#dc2626', p: [-0.2, 1.85, 0.05] },
          { c: '#2563eb', p: [0.15, 1.9, -0.1] },
          { c: '#dc2626', p: [0.05, 1.8, 0.15] },
        ].map((b, i) => (
          <mesh key={i} position={b.p as [number, number, number]} castShadow>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial
              color={b.c}
              roughness={0.2}
              metalness={0.15}
            />
          </mesh>
        ))}
      </group>

      {/* ── Sign Panel on Top ── */}
      <WoodenSign position={[0, 4.6, 0.3]} panelColor="#b45309" width={3.2} />

      {/* ── Bunting Decorations ── */}
      <BuntingFlags width={4.4} position={[0, 3.6, 1.7]} count={7} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2B. ODDS WHEEL BOOTH — Proper Building with Giant Spinning Wheel
// Tall structure with proper colorful segmented wheel on display
// ═══════════════════════════════════════════════════════════════
const OddsWheelBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['odds-wheel'];
  const wheelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z -= delta * 0.6;
    }
  });

  // Proper wheel segments using CylinderGeometry pie slices
  const segmentColors = [
    '#2563eb', '#dc2626', '#2563eb', '#f59e0b',
    '#2563eb', '#dc2626', '#2563eb', '#16a34a',
    '#2563eb', '#dc2626',
  ];
  const segCount = segmentColors.length;
  const segAngle = (Math.PI * 2) / segCount;

  return (
    <group
      position={meta.islandPosition}
      onClick={() => openActivity('odds-wheel')}
    >
      {/* ── Foundation ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.0, 3.3, 0.3, 24]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* ── Booth Structure: Back Wall + Counter ── */}
      <mesh position={[0, 2.2, -1.4]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 4.0, 0.15]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.5} />
      </mesh>
      {/* Counter */}
      <mesh position={[0, 0.9, 0.8]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.15, 1.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 1.3]} castShadow>
        <boxGeometry args={[5.0, 0.7, 0.1]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>

      {/* ── Side Frames ── */}
      <mesh position={[-2.4, 2.6, -0.3]} castShadow>
        <boxGeometry args={[0.15, 4.8, 2.4]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.5} />
      </mesh>
      <mesh position={[2.4, 2.6, -0.3]} castShadow>
        <boxGeometry args={[0.15, 4.8, 2.4]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.5} />
      </mesh>

      {/* ── Red & Gold A-Frame Supports for Wheel ── */}
      <mesh position={[-0.85, 3.0, -0.9]} rotation={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[0.2, 4.6, 0.2]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.85, 3.0, -0.9]} rotation={[0, 0, 0.12]} castShadow>
        <boxGeometry args={[0.2, 4.6, 0.2]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Cross brace */}
      <mesh position={[0, 2.4, -0.9]} castShadow>
        <boxGeometry args={[1.6, 0.12, 0.15]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* ═══ THE GIANT SPINNING WHEEL (proper pie segments) ═══ */}
      <group position={[0, 3.8, -0.7]}>
        <group ref={wheelRef}>
          {/* Wheel Rim (flat disc) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[2.0, 2.0, 0.06, 36]} />
            <meshStandardMaterial color="#d4a574" roughness={0.5} />
          </mesh>
          {/* Gold outer ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[2.05, 2.05, 0.08, 36]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Colored Pie Segments */}
          {segmentColors.map((col, i) => (
            <mesh
              key={i}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry
                args={[1.9, 1.9, 0.1, 1, 1, false, i * segAngle, segAngle * 0.95]}
              />
              <meshStandardMaterial color={col} roughness={0.3} />
            </mesh>
          ))}

          {/* Brass Pegs on rim */}
          {Array.from({ length: segCount }).map((_, i) => {
            const angle = i * segAngle + segAngle / 2;
            return (
              <mesh
                key={`peg-${i}`}
                position={[Math.cos(angle) * 1.85, 0.08, Math.sin(angle) * 1.85]}
                castShadow
              >
                <sphereGeometry args={[0.06, 10, 10]} />
                <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
              </mesh>
            );
          })}

          {/* Center Hub */}
          <mesh position={[0, 0.09, 0]} castShadow>
            <sphereGeometry args={[0.3, 20, 20]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Flapper Pointer (stationary, points down from top) */}
        <mesh position={[0, 2.15, 0.08]} rotation={[0, 0, Math.PI]} castShadow>
          <coneGeometry args={[0.18, 0.55, 12]} />
          <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Striped Awning Roof ── */}
      <StripedAwning
        width={5.6}
        depth={3.0}
        position={[0, 5.1, 0.2]}
        rotation={[0.08, 0, 0]}
        stripeCount={8}
        color1="#1e3a5f"
        color2="#f59e0b"
      />

      {/* ── Sign ── */}
      <WoodenSign position={[0, 5.8, 0.5]} panelColor="#1e3a5f" width={3.6} />
      <BuntingFlags width={5.0} position={[0, 4.9, 1.2]} count={9} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2C. GIANT BALL DROP BOOTH — Tall Tower Building
// Transparent gumball tower with visible balls and brass frame
// ═══════════════════════════════════════════════════════════════
const BallDropBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['ball-drop'];
  const agitatorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (agitatorRef.current) {
      agitatorRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group
      position={meta.islandPosition}
      onClick={() => openActivity('ball-drop')}
    >
      {/* ── Foundation ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.6, 0.3, 3.6]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* ── Building Walls (stone/dark) ── */}
      {/* Back wall */}
      <mesh position={[0, 1.8, -1.5]} castShadow>
        <boxGeometry args={[4.4, 3.2, 0.15]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-2.1, 1.8, 0]} castShadow>
        <boxGeometry args={[0.15, 3.2, 3.0]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>
      <mesh position={[2.1, 1.8, 0]} castShadow>
        <boxGeometry args={[0.15, 3.2, 3.0]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>

      {/* ── Counter ── */}
      <mesh position={[0, 1.0, 1.3]} castShadow>
        <boxGeometry args={[4.4, 0.15, 0.8]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>

      {/* ── THE GUMBALL TOWER (centerpiece) ── */}
      <group position={[0, 0.4, -0.2]}>
        {/* Brass Base Ring */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[1.3, 1.5, 0.35, 24]} />
          <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 4 Brass Pillars */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
          <mesh
            key={i}
            position={[Math.cos(ang) * 1.1, 2.4, Math.sin(ang) * 1.1]}
            castShadow
          >
            <cylinderGeometry args={[0.06, 0.06, 3.6, 12]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.15} />
          </mesh>
        ))}

        {/* Transparent Chamber */}
        <mesh position={[0, 2.8, 0]}>
          <cylinderGeometry args={[1.0, 1.0, 2.6, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transmission={0.92}
            transparent
            opacity={1}
            roughness={0.06}
          />
        </mesh>

        {/* Visible Balls Inside */}
        {[
          { c: '#16a34a', p: [-0.3, 2.0, 0.2] },
          { c: '#16a34a', p: [0.3, 2.4, -0.15] },
          { c: '#16a34a', p: [-0.1, 2.8, 0.3] },
          { c: '#16a34a', p: [0.2, 3.2, -0.3] },
          { c: '#eab308', p: [0, 1.8, -0.1] },
          { c: '#16a34a', p: [-0.35, 3.0, 0.1] },
          { c: '#16a34a', p: [0.15, 2.2, 0.25] },
          { c: '#eab308', p: [0.3, 2.6, 0.2] },
        ].map((b, i) => (
          <mesh key={i} position={b.p as [number, number, number]} castShadow>
            <sphereGeometry args={[0.14, 14, 14]} />
            <meshStandardMaterial color={b.c} roughness={0.25} metalness={0.15} />
          </mesh>
        ))}

        {/* Agitator spinner inside */}
        <group ref={agitatorRef} position={[0, 2.6, 0]}>
          {[0, 1, 2].map((p) => (
            <mesh
              key={p}
              position={[0, -0.3 + p * 0.35, 0]}
              rotation={[0, (p * Math.PI) / 3, 0]}
            >
              <boxGeometry args={[0.8, 0.03, 0.06]} />
              <meshStandardMaterial color="#eab308" metalness={0.7} />
            </mesh>
          ))}
        </group>

        {/* Gold Dome Top */}
        <mesh position={[0, 4.2, 0]} castShadow>
          <sphereGeometry
            args={[1.05, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Gold Finial on top */}
        <mesh position={[0, 4.8, 0]} castShadow>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* ── Awning ── */}
      <StripedAwning
        width={5.0}
        depth={3.4}
        position={[0, 3.45, 0.1]}
        rotation={[0.08, 0, 0]}
        stripeCount={8}
        color1="#334155"
        color2="#16a34a"
      />

      {/* ── Sign ── */}
      <WoodenSign position={[0, 4.2, 1.0]} panelColor="#334155" width={3.2} />
      <BuntingFlags width={4.4} position={[0, 3.3, 1.5]} count={7} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2D. PROBABILITY LAB BOOTH — Science Building
// Lab-like structure with glass dome and calibrated columns
// ═══════════════════════════════════════════════════════════════
const ProbabilityLabBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['probability-lab'];
  const orbRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group
      position={meta.islandPosition}
      onClick={() => openActivity('probability-lab')}
    >
      {/* ── Foundation ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.0, 0.3, 3.6]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* ── Lab Building Body (dark scientific look) ── */}
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 3.2, 3.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Lighter trim band */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[4.8, 0.15, 3.4]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.4} />
      </mesh>
      {/* Front opening */}
      <mesh position={[0, 1.4, 1.55]} castShadow>
        <boxGeometry args={[2.0, 2.4, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* ── Counter ── */}
      <mesh position={[0, 1.0, 1.8]} castShadow>
        <boxGeometry args={[4.6, 0.12, 0.6]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* ── Glass Dome on Roof ── */}
      <mesh position={[0, 4.0, 0]}>
        <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.88}
          transparent
          opacity={1}
          roughness={0.05}
        />
      </mesh>

      {/* ── Orbiting Particles in Dome ── */}
      <group ref={orbRef} position={[0, 4.2, 0]}>
        {[
          { c: '#2563eb', p: [0.4, 0.2, 0.3] },
          { c: '#dc2626', p: [-0.3, 0.1, -0.4] },
          { c: '#2563eb', p: [0.1, 0.4, -0.2] },
        ].map((b, i) => (
          <mesh key={i} position={b.p as [number, number, number]} castShadow>
            <sphereGeometry args={[0.15, 14, 14]} />
            <meshStandardMaterial
              color={b.c}
              roughness={0.2}
              emissive={b.c}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* ── Calibrated Liquid Columns (Left Red, Right Blue) ── */}
      <group position={[-1.5, 4.0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 1.6, 14]} />
          <meshPhysicalMaterial
            color="#e2e8f0"
            transmission={0.88}
            transparent
            opacity={1}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.8, 14]} />
          <meshStandardMaterial
            color="#dc2626"
            roughness={0.3}
            emissive="#dc2626"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>
      <group position={[1.5, 4.0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 1.6, 14]} />
          <meshPhysicalMaterial
            color="#e2e8f0"
            transmission={0.88}
            transparent
            opacity={1}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 1.1, 14]} />
          <meshStandardMaterial
            color="#2563eb"
            roughness={0.3}
            emissive="#2563eb"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>

      {/* ── Sign ── */}
      <WoodenSign position={[0, 5.4, 0.4]} panelColor="#7c3aed" width={3.4} />
      <BuntingFlags width={4.6} position={[0, 3.3, 1.6]} count={8} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2E. GAME BUILDER BOOTH — Workshop Building
// Craft workshop with visible pegboard game on the wall
// ═══════════════════════════════════════════════════════════════
const GameBuilderBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['game-builder'];

  return (
    <group
      position={meta.islandPosition}
      onClick={() => openActivity('game-builder')}
    >
      {/* ── Foundation ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.0, 0.3, 3.6]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* ── Workshop Shed Body (warm wood tones) ── */}
      {/* Back Wall */}
      <mesh position={[0, 2.2, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 4.0, 0.15]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>
      {/* Side Walls */}
      <mesh position={[-2.2, 2.2, 0]} castShadow>
        <boxGeometry args={[0.15, 4.0, 3.0]} />
        <meshStandardMaterial color="#a3622a" roughness={0.6} />
      </mesh>
      <mesh position={[2.2, 2.2, 0]} castShadow>
        <boxGeometry args={[0.15, 4.0, 3.0]} />
        <meshStandardMaterial color="#a3622a" roughness={0.6} />
      </mesh>

      {/* ── Counter / Workbench ── */}
      <mesh position={[0, 1.0, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.15, 1.0]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>

      {/* ── Pitched Roof (two angled halves) ── */}
      <mesh position={[-1.15, 4.5, 0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[2.8, 0.1, 3.8]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} />
      </mesh>
      <mesh position={[1.15, 4.5, 0]} rotation={[0, 0, -0.35]} castShadow>
        <boxGeometry args={[2.8, 0.1, 3.8]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} />
      </mesh>

      {/* ── PEGBOARD GAME (on back wall) ── */}
      <group position={[0, 2.8, -1.3]} rotation={[-0.05, 0, 0]}>
        {/* Blue Board */}
        <mesh castShadow>
          <boxGeometry args={[3.0, 2.6, 0.12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Acrylic cover */}
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[2.8, 2.4, 0.03]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transmission={0.9}
            transparent
            opacity={1}
            roughness={0.08}
          />
        </mesh>

        {/* Brass Deflection Pegs */}
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
              <meshStandardMaterial
                color="#fef08a"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          )),
        )}

        {/* Bottom Target Slots */}
        {Array.from({ length: 8 }).map((_, i) => {
          const isWin = i === 1 || i === 4 || i === 6;
          return (
            <mesh
              key={i}
              position={[(i - 3.5) * 0.34, -1.1, 0.08]}
              castShadow
            >
              <boxGeometry args={[0.28, 0.3, 0.12]} />
              <meshStandardMaterial
                color={isWin ? '#16a34a' : '#dc2626'}
                roughness={0.4}
              />
            </mesh>
          );
        })}
      </group>

      {/* ── Gear Decorations on Outside ── */}
      {[
        [-2.3, 3.5, 0.5],
        [2.3, 3.0, -0.3],
      ].map(([x, y, z], i) => (
        <mesh
          key={i}
          position={[x, y, z]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        >
          <torusGeometry args={[0.3, 0.06, 8, 12]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ── Sign ── */}
      <WoodenSign position={[0, 5.0, 0.5]} panelColor="#ea580c" width={3.2} />
      <BuntingFlags width={4.4} position={[0, 4.0, 1.4]} count={7} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2F. GRAND CARNIVAL BOOTH — Entrance Pavilion with Trophy
// Grand twin-tower gate with central arch and rotating trophy
// ═══════════════════════════════════════════════════════════════
const GrandCarnivalBooth: React.FC = () => {
  const openActivity = useCarnivalStore((s) => s.openActivity);
  const meta = ATTRACTIONS_META['grand-carnival'];
  const carouselRef = useRef<THREE.Group>(null);
  const trophyRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (carouselRef.current) {
      carouselRef.current.rotation.y += delta * 0.5;
    }
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 1.2;
      trophyRef.current.position.y =
        3.8 + Math.sin(state.clock.getElapsedTime() * 2) * 0.12;
    }
  });

  return (
    <group
      position={meta.islandPosition}
      onClick={() => openActivity('grand-carnival')}
    >
      {/* ── Grand Foundation ── */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.8, 4.2, 0.4, 32]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.5, 3.8, 0.1, 32]} />
        <meshStandardMaterial color="#fef08a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ── Twin Towers (Left & Right) ── */}
      {[-2.0, 2.0].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Tower body */}
          <mesh position={[0, 2.6, 0]} castShadow>
            <boxGeometry args={[1.2, 4.6, 1.2]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          {/* White band */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <boxGeometry args={[1.3, 0.15, 1.3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Gold cornice */}
          <mesh position={[0, 4.95, 0]} castShadow>
            <boxGeometry args={[1.5, 0.2, 1.5]} />
            <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Cone Turret */}
          <mesh position={[0, 5.8, 0]} castShadow>
            <coneGeometry args={[0.85, 1.4, 12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
          {/* Gold ball on tip */}
          <mesh position={[0, 6.6, 0]} castShadow>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
          {/* Small flag */}
          <mesh position={[x > 0 ? 0.25 : -0.25, 6.9, 0]} castShadow>
            <boxGeometry args={[0.35, 0.22, 0.02]} />
            <meshStandardMaterial color={i === 0 ? '#2563eb' : '#dc2626'} />
          </mesh>
        </group>
      ))}

      {/* ── Central Arch Connecting Towers ── */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[2.8, 0.6, 1.0]} />
        <meshStandardMaterial color="#fef08a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.0, 0]} castShadow>
        <boxGeometry args={[2.4, 0.2, 0.8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>

      {/* ── Rotating Carousel Roof (on arch) ── */}
      <group ref={carouselRef} position={[0, 5.4, 0]}>
        <mesh castShadow>
          <coneGeometry args={[2.2, 1.0, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Scalloped pendants */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 6) * 2.1,
              -0.15,
              Math.sin((i * Math.PI) / 6) * 2.1,
            ]}
            castShadow
          >
            <boxGeometry args={[0.2, 0.25, 0.06]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#fbbf24' : '#ffffff'}
            />
          </mesh>
        ))}
      </group>

      {/* ── Floating Grand Master Trophy ── */}
      <group ref={trophyRef} position={[0, 3.8, 0]}>
        {/* Cup */}
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.2, 0.55, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        {/* Handles */}
        <mesh position={[-0.45, 0.1, 0]} rotation={[0, 0, 0.3]} castShadow>
          <torusGeometry args={[0.15, 0.04, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} />
        </mesh>
        <mesh position={[0.45, 0.1, 0]} rotation={[0, 0, -0.3]} castShadow>
          <torusGeometry args={[0.15, 0.04, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.15, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
      </group>

      {/* ── Sign ── */}
      <WoodenSign position={[0, 7.4, 0]} panelColor="#b91c1c" width={3.6} height={0.7} />
      <BuntingFlags width={5.0} position={[0, 4.2, 2.0]} count={9} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. ISLAND TERRAIN, PATHS, BOARDWALK, OCEAN
// ═══════════════════════════════════════════════════════════════
const IslandEnvironment: React.FC = () => {
  return (
    <group>
      {/* Main Lush Green Island */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[18, 20, 1.6, 48]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>
      {/* Sandy Beach Ring */}
      <mesh position={[0, -1.0, 0]} receiveShadow>
        <cylinderGeometry args={[20, 22, 0.8, 48]} />
        <meshStandardMaterial color="#fef08a" roughness={0.9} />
      </mesh>
      {/* Ocean */}
      <mesh position={[0, -1.3, 0]} receiveShadow>
        <cylinderGeometry args={[44, 44, 0.4, 48]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          roughness={0.15}
          metalness={0.1}
          transmission={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Boardwalk Pier */}
      <mesh position={[0, 0.05, 15]} receiveShadow castShadow>
        <boxGeometry args={[2.8, 0.2, 8]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      {/* Pier railings */}
      {[-1.2, 1.2].map((x, i) => (
        <group key={i}>
          {[12, 14, 16, 18].map((z, j) => (
            <mesh key={j} position={[x, 0.5, z]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          ))}
          <mesh position={[x, 0.85, 15]} castShadow>
            <boxGeometry args={[0.06, 0.06, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </group>
      ))}

      {/* Sailboat */}
      <group position={[14, -0.6, 14]} rotation={[0, -0.6, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 2.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.8, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 1.8, 0.5]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <coneGeometry args={[0.8, 2.2, 3]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      </group>

      {/* Cobblestone Paths */}
      {[
        { pos: [-5, 0.05, -1.5] as [number, number, number], w: 8, d: 1.6, rot: 0 },
        { pos: [5, 0.05, -1.5] as [number, number, number], w: 8, d: 1.6, rot: 0 },
        { pos: [-3.5, 0.05, -3.5] as [number, number, number], w: 1.6, d: 8, rot: 0.6 },
        { pos: [3.5, 0.05, -3.5] as [number, number, number], w: 1.6, d: 8, rot: -0.6 },
        { pos: [-3.5, 0.05, 3.5] as [number, number, number], w: 1.6, d: 8, rot: -0.6 },
        { pos: [0, 0.05, 5] as [number, number, number], w: 2.2, d: 7, rot: 0 },
        { pos: [5.5, 0.05, 2] as [number, number, number], w: 1.6, d: 6, rot: 0.3 },
      ].map((path, i) => (
        <mesh key={i} position={path.pos} rotation={[0, path.rot, 0]} receiveShadow>
          <boxGeometry args={[path.w, 0.06, path.d]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>
      ))}

      {/* Pine Trees */}
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
            <coneGeometry args={[1.1, 2.0, 7]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.1, 0]} castShadow>
            <coneGeometry args={[0.85, 1.5, 7]} />
            <meshStandardMaterial color="#16a34a" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.8, 0]} castShadow>
            <coneGeometry args={[0.6, 1.0, 7]} />
            <meshStandardMaterial color="#22c55e" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Lantern Posts Along Paths */}
      {[
        [-3, 0, 1], [3, 0, 1],
        [-6, 0, -4], [6, 0, -4],
        [0, 0, 8],
      ].map(([x, y, z], i) => (
        <group key={`lamp-${i}`} position={[x, y, z]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 2.4, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. MAIN ISLAND HUB CANVAS
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
          gl.toneMappingExposure = 1.15;
        }}
      >
        <color attach="background" args={['#bae6fd']} />

        {/* Sunlight */}
        <ambientLight intensity={0.75} color="#f0f9ff" />
        <directionalLight
          position={[14, 28, 16]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color="#fffbeb"
        />
        <directionalLight position={[-12, 10, -10]} intensity={0.4} color="#38bdf8" />

        {/* Island */}
        <IslandEnvironment />
        <CentralClockTower />

        {/* 6 Detailed Attraction Buildings */}
        <MysterySackBooth />
        <OddsWheelBooth />
        <BallDropBooth />
        <ProbabilityLabBooth />
        <GameBuilderBooth />
        <GrandCarnivalBooth />
      </Canvas>
    </div>
  );
};
