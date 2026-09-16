// ============================================================
// GRAPHWORKS — THE DATA CITY: Subtle Visual Data Pulse Conduits
// Connects graph commands directly from Blue and Red consoles
// to the target city district with sleek fiber-optic pulses.
// ============================================================
'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGraphworksStore, CityDistrict, Team } from '../store/graphworksStore';

// District target coordinates in 3D city space
const DISTRICT_COORDS: Record<CityDistrict, [number, number, number]> = {
  weather: [-25, 1.6, -4],
  water: [-16, 0.8, -11],
  power: [18, 1.2, -10],
  train: [0, 1.0, -14],
  traffic: [0, 0.3, 5.5],
  park: [0, 0.4, 11],
  city: [0, 6.5, -4],
  construction: [18, 1.2, -10],
};

const BLUE_CONSOLE_ORIGIN: [number, number, number] = [-15, 0.1, 16];
const RED_CONSOLE_ORIGIN: [number, number, number] = [15, 0.1, 16];

export function DataPulseConduits3D() {
  const activePulses = useGraphworksStore((s) => s.activePulses);

  // Pool of pulse mesh instances
  const pulsesGroupRef = useRef<THREE.Group>(null);
  const ringsGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const now = Date.now();

    if (pulsesGroupRef.current) {
      pulsesGroupRef.current.children.forEach((child, i) => {
        const pulse = activePulses[i];
        if (!pulse) {
          child.visible = false;
          return;
        }

        const elapsed = (now - pulse.timestamp) / 1000;
        const duration = 0.55; // 550ms flight
        const p = Math.min(1, Math.max(0, elapsed / duration));

        if (p >= 1) {
          child.visible = false;
          return;
        }

        child.visible = true;

        const origin = pulse.team === 'blue' ? BLUE_CONSOLE_ORIGIN : RED_CONSOLE_ORIGIN;
        const dest = DISTRICT_COORDS[pulse.district] || [0, 0, 0];

        // Smooth cubic curve path with gentle arc height
        const midY = 0.8 + Math.sin(p * Math.PI) * 1.6;
        const curX = THREE.MathUtils.lerp(origin[0], dest[0], p);
        const curY = THREE.MathUtils.lerp(origin[1], dest[1], p) + midY * 0.4;
        const curZ = THREE.MathUtils.lerp(origin[2], dest[2], p);

        child.position.set(curX, curY, curZ);
      });
    }

    // Impact arrival rings
    if (ringsGroupRef.current) {
      ringsGroupRef.current.children.forEach((child, i) => {
        const pulse = activePulses[i];
        if (!pulse) {
          child.visible = false;
          return;
        }

        const elapsed = (now - pulse.timestamp) / 1000;
        const duration = 0.55;

        // Trigger ring once pulse arrives
        if (elapsed >= duration && elapsed < duration + 0.5) {
          const ringProgress = (elapsed - duration) / 0.5;
          child.visible = true;
          const dest = DISTRICT_COORDS[pulse.district] || [0, 0, 0];
          child.position.set(dest[0], dest[1] + 0.1, dest[2]);
          child.scale.setScalar(0.4 + ringProgress * 1.8);
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = (1 - ringProgress) * 0.7;
          }
        } else {
          child.visible = false;
        }
      });
    }
  });

  return (
    <group>
      {/* ── GROUND EMBEDDED FIBER-OPTIC PATHS (Subtle Tech Conduits) ── */}
      <group position={[0, 0.022, 0]}>
        {/* Blue Main Conduit Line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-15, 0, 0]}>
          <planeGeometry args={[0.08, 30]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
        </mesh>
        {/* Red Main Conduit Line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, 0, 0]}>
          <planeGeometry args={[0.08, 30]} />
          <meshBasicMaterial color="#f87171" transparent opacity={0.25} />
        </mesh>
        {/* Central Cross Data Spine */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[32, 0.08]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* ── ACTIVE TRAVELING DATA BEADS (Subtle High-Tech Pulses) ── */}
      <group ref={pulsesGroupRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <group key={i} visible={false}>
            {/* Core glowing data sphere */}
            <mesh>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Ambient soft glow aura */}
            <mesh>
              <sphereGeometry args={[0.42, 10, 10]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? '#38bdf8' : '#f87171'}
                transparent
                opacity={0.65}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── DISTRICT ARRIVAL RIPPLE RINGS ── */}
      <group ref={ringsGroupRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
            <ringGeometry args={[0.4, 0.52, 24]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#38bdf8' : '#f87171'}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
