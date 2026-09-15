// ============================================================
// PATTERN RACERS — CROWD LIFE: CHEERING SPECTATORS & TRACKSIDE PHOTOGRAPHERS
//
// The grandstands in Grandstands3D are static geometry — solid, cheap, and
// drawn in a handful of instanced calls. This file adds the motion on top:
// a front row of spectators who bob and wave, and photographers along the
// barrier whose flashguns pop as the cars come past.
//
// Everything is instanced and everything is deterministic (index hashes, never
// Math.random), so the venue looks alive without costing draw calls and
// without two clients ever disagreeing about what the crowd is doing.
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GRANDSTANDS } from '../engine/worldLayout';
import { CIRCUIT, TRACK } from '../engine/circuit';
import { sim } from '../engine/raceSim';
import { usePatternStore } from '../store/patternStore';

/** Deterministic 0..1 hash. */
function hash01(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

interface Waver {
  x: number; z: number; face: number;
  phase: number;
  colour: THREE.Color;
}

interface Photographer {
  x: number; z: number; face: number;
  /** Distance along the circuit, so flashes can fire as a car passes. */
  s: number;
  phase: number;
}

const CHEER_COLOURS = ['#ef4444', '#3b82f6', '#fbbf24', '#22c55e', '#f8fafc', '#a855f7'];

export const CrowdLife3D: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const racing = phase === 'grand_prix_race' || phase === 'pre_race_countdown';

  // ── FRONT-ROW WAVERS ──────────────────────────────────────────────────────
  // Only the front row animates. Deeper rows are already drawn as static
  // instances by Grandstands3D; animating all of them would cost far more than
  // it adds, because at race speed you only ever read the front edge.
  const wavers = useMemo<Waver[]>(() => {
    const out: Waver[] = [];
    let n = 0;
    for (const g of GRANDSTANDS) {
      const rx = Math.cos(g.heading), rz = -Math.sin(g.heading);
      const fx = -Math.sin(g.heading), fz = -Math.cos(g.heading);
      // Front tier, a little in from the retaining wall.
      const depth = 2.6 * g.side;
      const perRow = Math.max(5, Math.floor(g.length / 2.0));
      for (let i = 0; i < perRow; i++) {
        const h = hash01(n++);
        if (h < 0.25) continue; // thin them out so it is not a solid wall
        const along = (i / (perRow - 1) - 0.5) * g.length * 0.9;
        out.push({
          x: g.x + rx * depth + fx * along,
          z: g.z + rz * depth + fz * along,
          face: g.faceHeading,
          phase: h * Math.PI * 2,
          colour: new THREE.Color(CHEER_COLOURS[Math.floor(h * 997) % CHEER_COLOURS.length]),
        });
      }
    }
    return out;
  }, []);

  // ── TRACKSIDE PHOTOGRAPHERS ───────────────────────────────────────────────
  // Placed just behind the barrier, lenses pointed at the racing surface.
  const photographers = useMemo<Photographer[]>(() => {
    const out: Photographer[] = [];
    // Clustered where the action is: the grid, both fast corners, the chicane.
    const spots = [120, 180, 250, 330, 380, 560, 700, 760, 880, 940, 1080, 1150];
    spots.forEach((s, i) => {
      const f = CIRCUIT.sampleAt(s);
      const off = (TRACK.wallOffset + 1.8) * -1;
      out.push({
        x: f.x + f.rx * off,
        z: f.z + f.rz * off,
        face: f.heading - Math.PI / 2,
        s,
        phase: hash01(i * 13.7) * Math.PI * 2,
      });
    });
    return out;
  }, []);

  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const armRef = useRef<THREE.InstancedMesh>(null);
  const photogRef = useRef<THREE.InstancedMesh>(null);
  const flashRef = useRef<THREE.InstancedMesh>(null);

  const geos = useMemo(() => ({
    body: new THREE.BoxGeometry(0.4, 0.62, 0.3),
    arm: new THREE.BoxGeometry(0.52, 0.12, 0.12),
    photog: new THREE.BoxGeometry(0.44, 1.5, 0.34),
    flash: new THREE.PlaneGeometry(0.5, 0.5),
  }), []);

  const mats = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82 }),
    arm: new THREE.MeshStandardMaterial({ color: '#e8b48c', roughness: 0.85 }),
    photog: new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.7 }),
    // Flashes are unlit and double-sided so they read from any camera angle.
    flash: new THREE.MeshBasicMaterial({
      color: '#ffffff', side: THREE.DoubleSide, toneMapped: false,
    }),
  }), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colour = useMemo(() => new THREE.Color(), []);
  const initialised = useRef(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Cheering gets noticeably more energetic once the race is on.
    const energy = racing ? 1 : 0.35;

    // ── WAVERS ──
    if (bodyRef.current && armRef.current) {
      for (let i = 0; i < wavers.length; i++) {
        const w = wavers[i];
        const bob = Math.sin(t * (racing ? 6 : 2.2) + w.phase) * 0.09 * energy;

        dummy.position.set(w.x, 1.9 + Math.max(0, bob), w.z);
        dummy.rotation.set(0, w.face, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        bodyRef.current.setMatrixAt(i, dummy.matrix);

        // Arms up and swaying — the actual "cheering" read.
        const swing = Math.sin(t * (racing ? 7.5 : 2.6) + w.phase * 1.7) * 0.55 * energy;
        dummy.position.set(w.x, 2.42 + Math.max(0, bob), w.z);
        dummy.rotation.set(0, w.face, swing);
        dummy.updateMatrix();
        armRef.current.setMatrixAt(i, dummy.matrix);

        if (!initialised.current) {
          colour.copy(w.colour);
          bodyRef.current.setColorAt(i, colour);
        }
      }
      bodyRef.current.instanceMatrix.needsUpdate = true;
      armRef.current.instanceMatrix.needsUpdate = true;
      if (!initialised.current && bodyRef.current.instanceColor) {
        bodyRef.current.instanceColor.needsUpdate = true;
      }
    }

    // ── PHOTOGRAPHERS & FLASHES ──
    if (photogRef.current && flashRef.current) {
      for (let i = 0; i < photographers.length; i++) {
        const p = photographers[i];

        // Small tracking lean, as though panning with a car.
        const lean = Math.sin(t * 1.4 + p.phase) * 0.12;
        dummy.position.set(p.x, 0.75, p.z);
        dummy.rotation.set(0, p.face + lean, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        photogRef.current.setMatrixAt(i, dummy.matrix);

        // A flash fires when a car is near this photographer, plus a slow
        // idle pop the rest of the time so the venue is never dead.
        let firing = false;
        if (racing) {
          const near =
            Math.min(
              Math.abs(sim.blue.trackS - p.s),
              Math.abs(sim.red.trackS - p.s)
            ) < 55;
          // Stutter at a few Hz while a car is in range.
          firing = near && Math.sin(t * 17 + p.phase * 3) > 0.55;
        } else {
          firing = Math.sin(t * 2.1 + p.phase * 5) > 0.97;
        }

        const size = firing ? 1 : 0.0001;
        dummy.position.set(p.x, 1.62, p.z);
        // Billboard the flash toward the camera so it always reads.
        dummy.rotation.set(0, Math.atan2(
          state.camera.position.x - p.x,
          state.camera.position.z - p.z
        ), 0);
        dummy.scale.set(size, size, size);
        dummy.updateMatrix();
        flashRef.current.setMatrixAt(i, dummy.matrix);
      }
      photogRef.current.instanceMatrix.needsUpdate = true;
      flashRef.current.instanceMatrix.needsUpdate = true;
    }

    initialised.current = true;
  });

  if (wavers.length === 0) return null;

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[geos.body, mats.body, wavers.length]} />
      <instancedMesh ref={armRef} args={[geos.arm, mats.arm, wavers.length]} />
      <instancedMesh
        ref={photogRef}
        args={[geos.photog, mats.photog, photographers.length]}
        castShadow
      />
      <instancedMesh ref={flashRef} args={[geos.flash, mats.flash, photographers.length]} />
    </group>
  );
};
