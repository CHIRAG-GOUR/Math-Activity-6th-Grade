// ============================================================
// PATTERN RACERS — SOLID GRANDSTANDS & CROWD
//
// This is the main fix for "the stadium turns transparent".
//
// The previous grandstands were five floating boxes 1.3 m deep stepped every
// 1.4 m — a 0.1 m gap between every tier — with no back wall, no side walls,
// and a roof hanging unsupported in mid-air. From any angle you could see
// straight through the structure, and the near-white concrete under 4.9 units
// of light finished the job.
//
// Here each stand is a closed volume: a solid seating wedge with NO gaps, a
// back wall, two side walls, a supported roof and a front retaining wall.
// Every spectator is turned to face the racing surface using the faceHeading
// computed from the circuit.
// ============================================================

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { GRANDSTANDS } from '../engine/worldLayout';
import { InstancedGroup, type Placement } from './InstancedGroup';

const TIER_COUNT = 6;
const TIER_RISE = 0.8;
const TIER_DEPTH = 1.6;
const FRONT_OFFSET = 1.2;

const ACCENT: Record<string, string> = {
  blue: '#2563eb',
  red: '#dc2626',
  neutral: '#e2e8f0',
};

export const Grandstands3D: React.FC = () => {
  const mats = useMemo(() => ({
    // Mid-grey concrete. The old value was #f8fafc — 97% white, which under
    // bright sun clipped to pure white and dissolved into the sky.
    concrete: new THREE.MeshStandardMaterial({ color: '#b6bec9', roughness: 0.88 }),
    concreteDark: new THREE.MeshStandardMaterial({ color: '#94a0ae', roughness: 0.9 }),
    seat: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.68 }),
    roof: new THREE.MeshStandardMaterial({
      color: '#f1f5f9', roughness: 0.45, metalness: 0.3, side: THREE.DoubleSide,
    }),
    column: new THREE.MeshStandardMaterial({ color: '#7c8796', roughness: 0.5, metalness: 0.5 }),
    facade: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 }),
    person: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82 }),
    head: new THREE.MeshStandardMaterial({ color: '#d9a77c', roughness: 0.85 }),
  }), []);

  const layout = useMemo(() => {
    const tiers: Placement[] = [];
    const seats: Placement[] = [];
    const backWalls: Placement[] = [];
    const sideWalls: Placement[] = [];
    const roofs: Placement[] = [];
    const columns: Placement[] = [];
    const facades: Placement[] = [];
    const bodies: Placement[] = [];
    const heads: Placement[] = [];

    const CROWD_COLORS = ['#ef4444', '#3b82f6', '#fbbf24', '#22c55e', '#f8fafc', '#a855f7'];

    for (const g of GRANDSTANDS) {
      // Local basis: `right` points away from the track (into the stand).
      const rx = Math.cos(g.heading);
      const rz = -Math.sin(g.heading);
      const inward = g.side; // +1 or -1: direction from track into the stand

      const at = (depth: number) => ({
        x: g.x + rx * depth * inward,
        z: g.z + rz * depth * inward,
      });

      const totalDepth = TIER_COUNT * TIER_DEPTH;

      // ── SEATING WEDGE ──
      // The step equals the tier depth exactly, so consecutive tiers touch and
      // the structure is airtight. Each tier box extends down to ground level,
      // which is what makes it a solid wedge rather than a floating stair.
      for (let t = 0; t < TIER_COUNT; t++) {
        const depth = FRONT_OFFSET + t * TIER_DEPTH + TIER_DEPTH / 2;
        const top = (t + 1) * TIER_RISE;
        const p = at(depth);

        tiers.push({
          x: p.x, y: top / 2, z: p.z, rotY: g.heading,
          sx: TIER_DEPTH, sy: top, sz: g.length,
        });

        seats.push({
          x: p.x, y: top + 0.06, z: p.z, rotY: g.heading,
          sx: TIER_DEPTH * 0.86, sy: 1, sz: g.length * 0.97,
          color: ACCENT[g.accent],
        });

        // ── CROWD, FACING THE TRACK ──
        const perRow = Math.max(4, Math.floor(g.length / 1.5));
        for (let i = 0; i < perRow; i++) {
          // Deterministic thinning so the stands are busy but not solid.
          const hash = (t * 73856093) ^ (i * 19349663) ^ Math.round(g.x * 83492791);
          if ((hash & 7) === 0) continue;

          const along = (i / (perRow - 1) - 0.5) * g.length * 0.92;
          const fx = -Math.sin(g.heading);
          const fz = -Math.cos(g.heading);
          const px = p.x + fx * along;
          const pz = p.z + fz * along;

          bodies.push({
            x: px, y: top + 0.52, z: pz,
            rotY: g.faceHeading,
            color: CROWD_COLORS[Math.abs(hash) % CROWD_COLORS.length],
          });
          heads.push({ x: px, y: top + 0.92, z: pz, rotY: g.faceHeading });
        }
      }

      // ── BACK WALL ──
      const back = at(FRONT_OFFSET + totalDepth + 0.4);
      backWalls.push({
        x: back.x, y: (TIER_COUNT * TIER_RISE + 1.4) / 2, z: back.z, rotY: g.heading,
        sx: 0.8, sy: TIER_COUNT * TIER_RISE + 1.4, sz: g.length,
      });

      // ── SIDE WALLS ──
      for (const sign of [1, -1]) {
        const mid = at(FRONT_OFFSET + totalDepth / 2);
        const fx = -Math.sin(g.heading);
        const fz = -Math.cos(g.heading);
        sideWalls.push({
          x: mid.x + fx * (g.length / 2) * sign,
          y: (TIER_COUNT * TIER_RISE) / 2,
          z: mid.z + fz * (g.length / 2) * sign,
          rotY: g.heading,
          sx: totalDepth + 1.2, sy: TIER_COUNT * TIER_RISE + 0.6, sz: 0.5,
        });
      }

      // ── FRONT RETAINING WALL ──
      const front = at(FRONT_OFFSET * 0.4);
      facades.push({
        x: front.x, y: 1.0, z: front.z, rotY: g.heading,
        sx: 0.6, sy: 2.0, sz: g.length,
        color: ACCENT[g.accent],
      });

      // ── ROOF, ON REAL COLUMNS ──
      const roofDepth = totalDepth + 2.5;
      const roofCentre = at(FRONT_OFFSET + totalDepth / 2);
      const roofY = TIER_COUNT * TIER_RISE + 4.2;
      roofs.push({
        x: roofCentre.x, y: roofY, z: roofCentre.z, rotY: g.heading,
        sx: roofDepth, sy: 0.35, sz: g.length + 1.0,
      });

      for (const sign of [1, -1]) {
        const fx = -Math.sin(g.heading);
        const fz = -Math.cos(g.heading);
        const cp = at(FRONT_OFFSET + totalDepth + 0.2);
        columns.push({
          x: cp.x + fx * (g.length / 2 - 1.2) * sign,
          y: roofY / 2,
          z: cp.z + fz * (g.length / 2 - 1.2) * sign,
          rotY: g.heading,
          sy: roofY,
        });
      }
    }

    return { tiers, seats, backWalls, sideWalls, roofs, columns, facades, bodies, heads };
  }, []);

  const geos = useMemo(() => ({
    unit: new THREE.BoxGeometry(1, 1, 1),
    seat: new THREE.BoxGeometry(1, 0.12, 1),
    column: new THREE.CylinderGeometry(0.35, 0.45, 1, 8),
    body: new THREE.BoxGeometry(0.4, 0.62, 0.3),
    head: new THREE.SphereGeometry(0.14, 8, 6),
  }), []);

  return (
    <group>
      <InstancedGroup geometry={geos.unit} material={mats.concrete}
        placements={layout.tiers} castShadow receiveShadow />
      <InstancedGroup geometry={geos.seat} material={mats.seat} placements={layout.seats} />
      <InstancedGroup geometry={geos.unit} material={mats.concreteDark}
        placements={layout.backWalls} castShadow receiveShadow />
      <InstancedGroup geometry={geos.unit} material={mats.concreteDark}
        placements={layout.sideWalls} castShadow receiveShadow />
      <InstancedGroup geometry={geos.unit} material={mats.facade}
        placements={layout.facades} castShadow receiveShadow />
      <InstancedGroup geometry={geos.column} material={mats.column}
        placements={layout.columns} castShadow />
      <InstancedGroup geometry={geos.unit} material={mats.roof}
        placements={layout.roofs} castShadow />

      {/* Crowd — every one of them turned to face the racing surface. */}
      <InstancedGroup geometry={geos.body} material={mats.person} placements={layout.bodies} />
      <InstancedGroup geometry={geos.head} material={mats.head} placements={layout.heads} />
    </group>
  );
};
