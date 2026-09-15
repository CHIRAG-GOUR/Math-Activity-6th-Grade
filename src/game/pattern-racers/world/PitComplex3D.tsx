// ============================================================
// PATTERN RACERS — PIT COMPLEX: LANE, GARAGES, TYRE BAY, PIT BUILDING
//
// The garages are real shells — floor, back wall, two side walls, roof and a
// header beam over the door — with only the opening left open, and that
// opening faces directly onto the pit lane asphalt. The car therefore starts
// physically INSIDE its garage and drives out onto a real road.
//
// Wall positions here mirror garageColliders() in engine/worldLayout.ts.
// ============================================================

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PIT_LANE, PIT, PIT_STATIONS } from '../engine/circuit';
import { GARAGES, PIT_BUILDING, TYRE_BAY } from '../engine/worldLayout';
import { buildRibbon, buildDashedLine, makeAsphaltTexture } from './trackGeometry';
import { InstancedGroup, type Placement } from './InstancedGroup';

const LANE_Y = 0.26;

export const PitComplex3D: React.FC = () => {
  const tex = useMemo(() => makeAsphaltTexture(), []);

  const mats = useMemo(() => ({
    asphalt: new THREE.MeshStandardMaterial({
      map: tex, color: '#82878f', roughness: 0.93, metalness: 0.02,
    }),
    apron: new THREE.MeshStandardMaterial({ color: '#9aa3ad', roughness: 0.9 }),
    paint: new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.55 }),
    laneLine: new THREE.MeshStandardMaterial({ color: '#3b82f6', roughness: 0.6 }),
    wall: new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.78 }),
    garageBlue: new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.55, metalness: 0.15 }),
    garageRed: new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.55, metalness: 0.15 }),
    garageFloor: new THREE.MeshStandardMaterial({ color: '#dfe5ec', roughness: 0.42 }),
    roof: new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.6, metalness: 0.25 }),
    building: new THREE.MeshStandardMaterial({ color: '#e7ecf2', roughness: 0.72 }),
    buildingTrim: new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.5, metalness: 0.3 }),
    // Opaque dark glass. Real windows, no alpha — transparency is what made the
    // old venue look like a ghost.
    glass: new THREE.MeshStandardMaterial({ color: '#23405c', roughness: 0.12, metalness: 0.65 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#1c1f24', roughness: 0.95 }),
    rack: new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.5, metalness: 0.3 }),
    steel: new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.4, metalness: 0.75 }),
  }), [tex]);

  // ── PIT LANE SURFACE ──────────────────────────────────────────────────────
  const geo = useMemo(() => ({
    lane: buildRibbon(PIT_LANE, {
      from: -PIT.laneHalfWidth, to: PIT.laneHalfWidth, y: LANE_Y, step: 4, skirtTo: 0,
    }),
    // Apron in front of the garages, where the cars are worked on.
    apron: buildRibbon(PIT_LANE, {
      from: PIT.laneHalfWidth, to: PIT.laneHalfWidth + 12, y: LANE_Y - 0.02, step: 4, skirtTo: 0,
    }),
    edgeInner: buildRibbon(PIT_LANE, {
      from: -PIT.laneHalfWidth + 0.2, to: -PIT.laneHalfWidth + 0.45, y: LANE_Y + 0.012, step: 4,
    }),
    guide: buildDashedLine(PIT_LANE, 0, LANE_Y + 0.012, 0.2, 3, 4),
  }), []);

  // ── PIT WALL ──────────────────────────────────────────────────────────────
  const pitWall = useMemo<Placement[]>(() => {
    const out: Placement[] = [];
    const step = 4;
    for (let s = 60; s < PIT_LANE.length - 60; s += step) {
      const f = PIT_LANE.sampleAt(s);
      out.push({
        x: f.x - f.rx * PIT.laneHalfWidth,
        y: 0.55,
        z: f.z - f.rz * PIT.laneHalfWidth,
        rotY: f.heading,
      });
    }
    return out;
  }, []);

  const pitWallGeo = useMemo(() => new THREE.BoxGeometry(0.5, 1.1, 4.05), []);

  // ── TYRE BAY EQUIPMENT ────────────────────────────────────────────────────
  const tyreProps = useMemo(() => {
    const stacks: Placement[] = [];
    const racks: Placement[] = [];
    const base = PIT_STATIONS.tyreBay;

    for (let i = -2; i <= 2; i++) {
      const f = PIT_LANE.sampleAt(base + i * 7);
      for (const lat of [13.5, 15.5]) {
        stacks.push({
          x: f.x + f.rx * lat, y: 0.36, z: f.z + f.rz * lat, rotY: f.heading,
        });
      }
      racks.push({
        x: f.x + f.rx * 16.6, y: 1.1, z: f.z + f.rz * 16.6, rotY: f.heading,
      });
    }
    return { stacks, racks };
  }, []);

  const propGeos = useMemo(() => ({
    tyre: new THREE.CylinderGeometry(0.36, 0.36, 0.72, 14),
    rack: new THREE.BoxGeometry(0.16, 2.2, 3.2),
  }), []);

  return (
    <group>
      {/* ── LANE & APRON ── */}
      <mesh geometry={geo.lane} material={mats.asphalt} receiveShadow />
      <mesh geometry={geo.apron} material={mats.apron} receiveShadow />
      <mesh geometry={geo.edgeInner} material={mats.paint} />
      <mesh geometry={geo.guide} material={mats.laneLine} />

      <InstancedGroup geometry={pitWallGeo} material={mats.wall}
        placements={pitWall} castShadow receiveShadow />

      {/* ── GARAGES ── */}
      {GARAGES.map((g) => {
        const teamMat = g.team === 'blue' ? mats.garageBlue : mats.garageRed;
        const t = 0.45;
        return (
          <group key={g.team} position={[g.x, 0, g.z]} rotation={[0, g.heading, 0]}>
            {/* Local +X is "deeper into the bay"; the opening is at -X. */}
            <mesh position={[0, 0.02, 0]} material={mats.garageFloor} receiveShadow>
              <boxGeometry args={[g.depth, 0.16, g.width]} />
            </mesh>
            {/* Back wall */}
            <mesh position={[g.depth / 2, g.height / 2, 0]} material={teamMat} castShadow receiveShadow>
              <boxGeometry args={[t, g.height, g.width]} />
            </mesh>
            {/* Two side walls — the old build had only one, leaving the bay open. */}
            {[1, -1].map((sign) => (
              <mesh key={sign} position={[0, g.height / 2, (g.width / 2) * sign]}
                material={mats.wall} castShadow receiveShadow>
                <boxGeometry args={[g.depth, g.height, t]} />
              </mesh>
            ))}
            {/* Roof */}
            <mesh position={[0, g.height + 0.2, 0]} material={mats.roof} castShadow>
              <boxGeometry args={[g.depth + 0.6, 0.4, g.width + 0.6]} />
            </mesh>
            {/* Header beam over the opening, so only the doorway is open */}
            <mesh position={[-g.depth / 2, g.height - 0.9, 0]} material={teamMat} castShadow>
              <boxGeometry args={[t + 0.1, 1.8, g.width]} />
            </mesh>
            {/* Team livery band across the header */}
            <mesh position={[-g.depth / 2 - 0.3, g.height - 0.9, 0]} material={mats.buildingTrim}>
              <boxGeometry args={[0.12, 1.0, g.width * 0.82]} />
            </mesh>
          </group>
        );
      })}

      {/* ── PIT BUILDING BEHIND THE GARAGES ── */}
      <group position={[PIT_BUILDING.x, 0, PIT_BUILDING.z]} rotation={[0, PIT_BUILDING.heading, 0]}>
        <mesh position={[0, PIT_BUILDING.height / 2, 0]} material={mats.building} castShadow receiveShadow>
          <boxGeometry args={[PIT_BUILDING.depth, PIT_BUILDING.height, PIT_BUILDING.length]} />
        </mesh>
        {/* Two window bands, opaque dark glass */}
        {[0.55, 0.78].map((h) => (
          <mesh key={h} position={[-PIT_BUILDING.depth / 2 - 0.06, PIT_BUILDING.height * h, 0]}
            material={mats.glass}>
            <boxGeometry args={[0.16, 1.5, PIT_BUILDING.length * 0.9]} />
          </mesh>
        ))}
        <mesh position={[0, PIT_BUILDING.height + 0.3, 0]} material={mats.buildingTrim} castShadow>
          <boxGeometry args={[PIT_BUILDING.depth + 1.2, 0.6, PIT_BUILDING.length + 1.2]} />
        </mesh>
      </group>

      {/* ── TYRE / SERVICE BAY EQUIPMENT ── */}
      <InstancedGroup geometry={propGeos.tyre} material={mats.rubber}
        placements={tyreProps.stacks} castShadow />
      <InstancedGroup geometry={propGeos.rack} material={mats.rack}
        placements={tyreProps.racks} castShadow />

      {/* Service bay gantry light over the working area */}
      <group position={[TYRE_BAY.centre.x, 0, TYRE_BAY.centre.z]} rotation={[0, TYRE_BAY.heading, 0]}>
        {[1, -1].map((sign) => (
          <mesh key={sign} position={[0, 2.4, 9 * sign]} material={mats.steel} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 4.8, 8]} />
          </mesh>
        ))}
        <mesh position={[0, 4.9, 0]} material={mats.steel} castShadow>
          <boxGeometry args={[0.9, 0.3, 18]} />
        </mesh>
      </group>
    </group>
  );
};
