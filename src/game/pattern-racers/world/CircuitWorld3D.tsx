// ============================================================
// PATTERN RACERS — THE CIRCUIT: ROAD, KERBS, RUNOFF, BARRIERS, GANTRY
//
// Every surface here is swept from the CIRCUIT in engine/circuit.ts, and the
// barriers are drawn at exactly the offsets the collider generator uses. A
// wall you can see is a wall you can hit, and vice versa.
//
// Nothing in this file is transparent. The previous build's "see-through
// stadium" came partly from a wireframe fence material and single-sided
// marking planes that vanished when viewed from behind; both are gone.
// ============================================================

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CIRCUIT, TRACK, START_FINISH_S, GRID_S } from '../engine/circuit';
import { TYRE_STACKS, START_GANTRY } from '../engine/worldLayout';
import {
  buildRibbon, buildKerb, buildDashedLine, buildCrossQuad,
  makeCheckerTexture, makeAsphaltTexture,
} from './trackGeometry';
import { InstancedGroup, type Placement } from './InstancedGroup';
import { usePatternStore } from '../store/patternStore';

const ROAD_Y = TRACK.roadThickness;

export const CircuitWorld3D: React.FC = () => {
  const signalLights = usePatternStore((s) => s.signalLights);

  // ── SURFACES ──────────────────────────────────────────────────────────────
  const geo = useMemo(() => {
    const half = TRACK.halfWidth;
    const kerbOuter = half + TRACK.curbWidth;

    return {
      road: buildRibbon(CIRCUIT, {
        from: -half, to: half, y: ROAD_Y, step: 3, skirtTo: 0, uvPerMetre: 0.06,
      }),
      kerbLeft: buildKerb(CIRCUIT, -kerbOuter, -half, ROAD_Y + 0.02),
      kerbRight: buildKerb(CIRCUIT, half, kerbOuter, ROAD_Y + 0.02),
      runoffLeft: buildRibbon(CIRCUIT, {
        from: -TRACK.runoffOuter, to: -kerbOuter, y: ROAD_Y - 0.14, step: 5, skirtTo: 0,
      }),
      runoffRight: buildRibbon(CIRCUIT, {
        from: kerbOuter, to: TRACK.runoffOuter, y: ROAD_Y - 0.14, step: 5, skirtTo: 0,
      }),
      edgeLeft: buildRibbon(CIRCUIT, {
        from: -half + 0.15, to: -half + 0.42, y: ROAD_Y + 0.012, step: 3,
      }),
      edgeRight: buildRibbon(CIRCUIT, {
        from: half - 0.42, to: half - 0.15, y: ROAD_Y + 0.012, step: 3,
      }),
      centreDashes: buildDashedLine(CIRCUIT, 0, ROAD_Y + 0.012, 0.22, 5, 7),
      finishLine: buildCrossQuad(CIRCUIT, START_FINISH_S, TRACK.halfWidth, 2.4, ROAD_Y + 0.02),
    };
  }, []);

  const tex = useMemo(() => ({
    checker: makeCheckerTexture(10),
    asphalt: makeAsphaltTexture(),
  }), []);

  // ── MATERIALS ─────────────────────────────────────────────────────────────
  // All opaque, all high-roughness so the sun does not blow them out to white.
  const mats = useMemo(() => ({
    asphalt: new THREE.MeshStandardMaterial({
      map: tex.asphalt, color: '#8a8f97', roughness: 0.94, metalness: 0.02,
    }),
    kerb: new THREE.MeshStandardMaterial({
      vertexColors: true, roughness: 0.62, metalness: 0.0,
    }),
    runoff: new THREE.MeshStandardMaterial({ color: '#b9a98f', roughness: 0.98 }),
    paint: new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.55 }),
    checker: new THREE.MeshStandardMaterial({ map: tex.checker, roughness: 0.6 }),
    barrier: new THREE.MeshStandardMaterial({ color: '#dbe2ea', roughness: 0.7, metalness: 0.05 }),
    barrierStripe: new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.7 }),
    fencePost: new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.42, metalness: 0.72 }),
    tyre: new THREE.MeshStandardMaterial({ color: '#1c1f24', roughness: 0.95 }),
    tyreBand: new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.7 }),
    steel: new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.38, metalness: 0.8 }),
    gantryBody: new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.55, metalness: 0.3 }),
    lampRed: new THREE.MeshStandardMaterial({
      color: '#ef4444', emissive: '#b91c1c', emissiveIntensity: 1.4, roughness: 0.3,
    }),
    lampGreen: new THREE.MeshStandardMaterial({
      color: '#22c55e', emissive: '#15803d', emissiveIntensity: 1.9, roughness: 0.3,
    }),
  }), [tex]);

  // ── BARRIERS ──────────────────────────────────────────────────────────────
  // Drawn at TRACK.wallOffset, exactly where generateTrackBarriers() puts the
  // colliders, with the same pit entry/exit gaps.
  const barriers = useMemo(() => {
    const walls: Placement[] = [];
    const stripes: Placement[] = [];
    const posts: Placement[] = [];
    const rails: Placement[] = [];

    const step = 4;
    const count = Math.round(CIRCUIT.length / step);
    const spacing = CIRCUIT.length / count;

    for (let i = 0; i < count; i++) {
      const s = i * spacing;
      const f = CIRCUIT.sampleAt(s);

      for (const side of [1, -1] as const) {
        // Leave the pit entry and exit open on the right-hand side.
        const inGap = side === 1 && ((s > 0 && s < 74) || (s > 178 && s < 250));
        if (inGap) continue;

        const off = TRACK.wallOffset * side;
        const x = f.x + f.rx * off;
        const z = f.z + f.rz * off;

        walls.push({ x, y: TRACK.wallHeight / 2, z, rotY: f.heading });
        if (i % 2 === 0) stripes.push({ x, y: TRACK.wallHeight * 0.78, z, rotY: f.heading });
        if (i % 3 === 0) posts.push({ x, y: TRACK.wallHeight + 1.1, z, rotY: f.heading });
        rails.push({ x, y: TRACK.wallHeight + 2.2, z, rotY: f.heading });
      }
    }
    return { walls, stripes, posts, rails };
  }, []);

  const tyrePlacements = useMemo<Placement[]>(
    () => TYRE_STACKS.map((t) => ({ x: t.x, y: 0.45, z: t.z, rotY: t.heading })), []
  );
  const tyreBands = useMemo<Placement[]>(
    () => TYRE_STACKS.map((t) => ({ x: t.x, y: 0.92, z: t.z, rotY: t.heading })), []
  );

  const geos = useMemo(() => ({
    wall: new THREE.BoxGeometry(TRACK.wallThickness, TRACK.wallHeight, 4.1),
    stripe: new THREE.BoxGeometry(TRACK.wallThickness + 0.04, 0.26, 2.0),
    post: new THREE.BoxGeometry(0.1, 2.2, 0.1),
    rail: new THREE.BoxGeometry(0.07, 0.07, 4.1),
    tyre: new THREE.CylinderGeometry(1.0, 1.0, 0.9, 12),
    tyreBand: new THREE.CylinderGeometry(1.02, 1.02, 0.14, 12),
  }), []);

  // ── STARTING GRID BOXES ───────────────────────────────────────────────────
  const gridMarks = useMemo(() => {
    const out: { geo: THREE.BufferGeometry; key: string }[] = [];
    [GRID_S, GRID_S - 8].forEach((s, i) => {
      out.push({ geo: buildCrossQuad(CIRCUIT, s + 2.6, 2.4, 0.3, ROAD_Y + 0.016), key: `f${i}` });
      out.push({ geo: buildCrossQuad(CIRCUIT, s - 2.6, 2.4, 0.3, ROAD_Y + 0.016), key: `b${i}` });
    });
    return out;
  }, []);

  return (
    <group>
      {/* ── RACING SURFACE ── */}
      <mesh geometry={geo.road} material={mats.asphalt} receiveShadow />
      <mesh geometry={geo.runoffLeft} material={mats.runoff} receiveShadow />
      <mesh geometry={geo.runoffRight} material={mats.runoff} receiveShadow />
      <mesh geometry={geo.kerbLeft} material={mats.kerb} receiveShadow />
      <mesh geometry={geo.kerbRight} material={mats.kerb} receiveShadow />

      {/* ── MARKINGS ── */}
      <mesh geometry={geo.edgeLeft} material={mats.paint} />
      <mesh geometry={geo.edgeRight} material={mats.paint} />
      <mesh geometry={geo.centreDashes} material={mats.paint} />
      <mesh geometry={geo.finishLine} material={mats.checker} />
      {gridMarks.map((m) => <mesh key={m.key} geometry={m.geo} material={mats.paint} />)}

      {/* ── BARRIERS: SOLID, OPAQUE, EXACTLY WHERE THE COLLIDERS ARE ── */}
      <InstancedGroup geometry={geos.wall} material={mats.barrier}
        placements={barriers.walls} castShadow receiveShadow />
      <InstancedGroup geometry={geos.stripe} material={mats.barrierStripe}
        placements={barriers.stripes} />
      {/* The catch fence is real posts and rails. The old build used a
          `wireframe: true` material here — 99% empty pixels, and a large part
          of why the venue read as see-through. */}
      <InstancedGroup geometry={geos.post} material={mats.fencePost} placements={barriers.posts} />
      <InstancedGroup geometry={geos.rail} material={mats.fencePost} placements={barriers.rails} />

      <InstancedGroup geometry={geos.tyre} material={mats.tyre}
        placements={tyrePlacements} castShadow />
      <InstancedGroup geometry={geos.tyreBand} material={mats.tyreBand} placements={tyreBands} />

      {/* ── START GANTRY & SIGNAL LAMPS ── */}
      <group position={[START_GANTRY.x, 0, START_GANTRY.z]} rotation={[0, START_GANTRY.heading, 0]}>
        {[1, -1].map((sign) => (
          <mesh key={sign} position={[START_GANTRY.postOffset * sign, START_GANTRY.height / 2, 0]}
            material={mats.steel} castShadow>
            <boxGeometry args={[0.9, START_GANTRY.height, 0.9]} />
          </mesh>
        ))}
        <mesh position={[0, START_GANTRY.height, 0]} material={mats.gantryBody} castShadow>
          <boxGeometry args={[START_GANTRY.span, 1.5, 1.0]} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 3.4, START_GANTRY.height, 0.56]}
            rotation={[Math.PI / 2, 0, 0]}
            material={signalLights[i] ? mats.lampGreen : mats.lampRed}>
            <cylinderGeometry args={[0.52, 0.52, 0.18, 16]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
