// ============================================================
// PATTERN RACERS — EXHAUST SMOKE & NITROUS BLASTS
//
// Mounted once per car and parented to that car's root, so it inherits the
// simulation-owned transform and never needs to know where the car is.
//
// Active in two situations:
//   - the grid-rev questions, where both cars sit on their marks revving
//   - any time nitrous is burning during the race
//
// Smoke is a small ring of instanced puffs recycled on a fixed schedule rather
// than a particle pool with lifetimes, which keeps it to one draw call and
// completely deterministic.
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PUFF_COUNT = 14;
/** Local exhaust positions on the car, matching the tailpipes in RaceVehicle3D. */
const PIPES = [-0.16, 0.16];

interface Props {
  /** Team tint for the nitrous flame. */
  teamId: 'blue' | 'red';
  /** Revving on the grid — continuous smoke and flame. */
  revving: boolean;
  /** Nitrous burning during the race. */
  boosting: boolean;
}

export const ExhaustFX3D: React.FC<Props> = ({ teamId, revving, boosting }) => {
  const smokeRef = useRef<THREE.InstancedMesh>(null);
  const flameRef = useRef<THREE.Group>(null);

  const geos = useMemo(() => ({
    puff: new THREE.SphereGeometry(1, 7, 6),
    flame: new THREE.ConeGeometry(0.14, 1.0, 10),
    core: new THREE.ConeGeometry(0.07, 0.62, 8),
  }), []);

  const mats = useMemo(() => ({
    // Smoke is the one place transparency is legitimate — it is a volumetric
    // effect, not a structure standing in for a solid object.
    smoke: new THREE.MeshBasicMaterial({
      color: '#cfd6de',
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      toneMapped: false,
    }),
    flame: new THREE.MeshBasicMaterial({
      color: teamId === 'blue' ? '#38bdf8' : '#fb923c',
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      toneMapped: false,
    }),
    core: new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      toneMapped: false,
    }),
  }), [teamId]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const active = revving || boosting;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // ── SMOKE ──
    if (smokeRef.current) {
      smokeRef.current.visible = active;
      if (active) {
        for (let i = 0; i < PUFF_COUNT; i++) {
          const pipe = PIPES[i % PIPES.length];
          // Each puff runs its own offset phase through a 1-second cycle, so
          // the ring reads as a continuous stream.
          const phase = (t * (boosting ? 1.6 : 1.0) + i / PUFF_COUNT) % 1;

          // Drift backwards and up, spreading as it goes.
          const back = 1.5 + phase * 3.4;
          const rise = 0.28 + phase * 0.9;
          const spread = phase * 0.55;
          const wobble = Math.sin(t * 3 + i) * spread * 0.6;

          const scale = (0.16 + phase * 0.62) * (boosting ? 1.25 : 1);
          dummy.position.set(pipe + wobble, rise, back);
          dummy.scale.setScalar(scale);
          dummy.rotation.set(0, 0, t * 0.6 + i);
          dummy.updateMatrix();
          smokeRef.current.setMatrixAt(i, dummy.matrix);
        }
        smokeRef.current.instanceMatrix.needsUpdate = true;
        // Fade the whole stream out as it disperses.
        mats.smoke.opacity = boosting ? 0.46 : 0.34;
      }
    }

    // ── NITROUS FLAME ──
    if (flameRef.current) {
      flameRef.current.visible = active;
      if (active) {
        // Sharp flicker while revving, a steadier roar under boost.
        const flick = boosting
          ? 1.1 + Math.sin(t * 38) * 0.22
          : 0.55 + Math.abs(Math.sin(t * 24)) * 0.75;
        flameRef.current.scale.set(1, 1, flick);
        mats.flame.opacity = 0.55 + Math.abs(Math.sin(t * 30)) * 0.4;
      }
    }
  });

  return (
    <group>
      {/* Smoke stream behind the car. */}
      <instancedMesh
        ref={smokeRef}
        args={[geos.puff, mats.smoke, PUFF_COUNT]}
        frustumCulled={false}
      />

      {/* Twin nitrous jets at the tailpipes, pointing astern. */}
      <group ref={flameRef} position={[0, 0.25, 1.55]}>
        {PIPES.map((x, i) => (
          <group key={i} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={geos.flame} material={mats.flame} position={[0, -0.5, 0]} />
            <mesh geometry={geos.core} material={mats.core} position={[0, -0.3, 0]} />
          </group>
        ))}
      </group>
    </group>
  );
};
