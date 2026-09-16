// ============================================================
// THE CHOCOLATE FACTORY — FORKLIFTS AND DELIVERY TRUCKS
//
// Both read the simulation every frame. Nothing teleports: the forklift
// drives its route out of the ingredient store, and the truck only carries
// boxes that a worker physically walked into its bed.
// ============================================================

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TeamId } from '../types';
import { sim } from '../engine/factorySim';
import { CARGO_SLOTS } from '../engine/factoryLayout';
import { GEO, MAT, teamMat } from './materials';
import { SeatedDriver3D } from './Humans3D';

// ── FORKLIFT ─────────────────────────────────────────────────────────────

export const Forklift3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const root = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);
  const forks = useRef<THREE.Group>(null);
  const pallet = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.Mesh>(null);
  const last = useRef<{ x: number; z: number } | null>(null);

  useFrame((state) => {
    const f = sim[team].forklift;
    if (root.current) {
      root.current.position.set(f.pos.x, 0, f.pos.z);
      root.current.rotation.y = f.heading;
    }
    const prev = last.current;
    const moved = prev ? Math.hypot(f.pos.x - prev.x, f.pos.z - prev.z) : 0;
    last.current = { x: f.pos.x, z: f.pos.z };
    if (wheels.current) wheels.current.children.forEach((w) => { w.rotation.x -= moved / 0.3; });

    // Carrying a pallet of cocoa out to the tank, empty on the way back.
    const carrying = f.task === 'to_tank' || f.task === 'at_tank';
    if (pallet.current) pallet.current.visible = carrying;
    if (forks.current) forks.current.position.y = carrying ? 0.55 : 0.18;
    if (beacon.current) {
      beacon.current.material = f.task !== 'idle' && Math.sin(state.clock.elapsedTime * 8) > 0 ? MAT.lampAmber : MAT.lampOff;
    }
  });

  return (
    <group ref={root}>
      {/* chassis */}
      <mesh geometry={GEO.box} material={MAT.guard} position={[0, 0.7, 0.45]} scale={[1.3, 0.9, 1.8]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={teamMat(team)} position={[0, 1.12, 0.45]} scale={[1.34, 0.12, 1.84]} />
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0.36, 1.35]} scale={[1.2, 0.5, 0.4]} />
      {/* overhead guard */}
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 2.2, 0.45]} scale={[1.25, 0.08, 1.4]} castShadow />
      {[[-0.55, -0.15], [0.55, -0.15], [-0.55, 1.05], [0.55, 1.05]].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.box} material={MAT.steelDark} position={[x, 1.65, z]} scale={[0.07, 1.1, 0.07]} />
      ))}
      <mesh ref={beacon} geometry={GEO.sphereLow} material={MAT.lampOff} position={[0, 2.32, 0.9]} scale={[0.16, 0.16, 0.16]} />
      <SeatedDriver3D team={team} />
      {/* mast */}
      {[-0.38, 0.38].map((x) => (
        <mesh key={x} geometry={GEO.box} material={MAT.steel} position={[x, 1.4, -0.55]} scale={[0.1, 2.6, 0.12]} castShadow />
      ))}
      {/* forks + load */}
      <group ref={forks} position={[0, 0.18, 0]}>
        <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0.3, -0.66]} scale={[1.0, 0.5, 0.08]} />
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} geometry={GEO.box} material={MAT.steel} position={[x, 0.06, -1.45]} scale={[0.12, 0.06, 1.55]} castShadow />
        ))}
        <group ref={pallet} position={[0, 0.18, -1.45]} visible={false}>
          <mesh geometry={GEO.box} material={MAT.wood} scale={[1.1, 0.12, 1.2]} castShadow />
          {/* sacks of cocoa on the pallet */}
          {[[-0.26, -0.28], [0.26, -0.28], [-0.26, 0.28], [0.26, 0.28]].map(([x, z], i) => (
            <mesh key={i} geometry={GEO.box} material={i % 2 ? MAT.boxCard : MAT.woodDark}
              position={[x, 0.3, z]} scale={[0.48, 0.46, 0.5]} castShadow />
          ))}
        </group>
      </group>
      <group ref={wheels}>
        {[[-0.58, -0.2], [0.58, -0.2], [-0.5, 1.15], [0.5, 1.15]].map(([x, z], i) => (
          <mesh key={i} geometry={GEO.cylLow} material={MAT.rubber} position={[x, 0.3, z]} rotation={[0, 0, Math.PI / 2]} scale={[0.6, 0.24, 0.6]} castShadow />
        ))}
      </group>
    </group>
  );
};

// ── DELIVERY TRUCK ───────────────────────────────────────────────────────

export const DeliveryTruck3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const root = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);
  const cargo = useRef<THREE.Group>(null);
  const lights = useRef<THREE.Group>(null);
  const last = useRef<{ x: number; z: number } | null>(null);

  useFrame(() => {
    const s = sim[team];
    const t = s.truck;
    if (root.current) {
      root.current.position.set(t.pos.x, 0, t.pos.z);
      root.current.rotation.y = t.heading;
    }
    const prev = last.current;
    const moved = prev ? Math.hypot(t.pos.x - prev.x, t.pos.z - prev.z) : 0;
    last.current = { x: t.pos.x, z: t.pos.z };
    if (wheels.current) wheels.current.children.forEach((w) => { w.rotation.x -= moved / 0.45; });

    // Only boxes that were actually loaded are in the bed.
    if (cargo.current) {
      cargo.current.children.forEach((c, i) => { c.visible = i < s.boxesInTruck; });
    }
    if (lights.current) {
      const driving = s.logistics === 'outbound' || s.logistics === 'returning';
      lights.current.children.forEach((l) => {
        (l as THREE.Mesh).material = driving ? MAT.lampAmber : MAT.lampOff;
      });
    }
  });

  return (
    <group ref={root}>
      {/* cab */}
      <mesh geometry={GEO.box} material={teamMat(team)} position={[0, 1.35, -2.5]} scale={[2.3, 1.7, 2.0]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={MAT.glass} position={[0, 1.75, -3.45]} scale={[2.0, 0.9, 0.16]} />
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0.55, -2.5]} scale={[2.4, 0.5, 2.2]} />
      {/* box body with team livery */}
      <mesh geometry={GEO.box} material={MAT.wall} position={[0, 1.75, 0.6]} scale={[2.5, 2.3, 5.0]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={teamMat(team)} position={[0, 0.72, 0.6]} scale={[2.56, 0.5, 5.06]} />
      <mesh geometry={GEO.box} material={teamMat(team)} position={[0, 2.86, 0.6]} scale={[2.56, 0.22, 5.06]} />
      {/* chocolate roundel on the side */}
      {[-1.28, 1.28].map((x) => (
        <mesh key={x} geometry={GEO.cylLow} material={MAT.chocolate} position={[x, 1.8, 0.6]} rotation={[0, 0, Math.PI / 2]} scale={[1.3, 0.06, 1.3]} />
      ))}
      {/* open bed deck for the cargo */}
      <mesh geometry={GEO.box} material={MAT.woodDark} position={[0, 0.98, 0.6]} scale={[2.3, 0.1, 4.8]} />
      <group ref={cargo}>
        {CARGO_SLOTS.map((slot, i) => (
          <mesh key={i} geometry={GEO.box}
            material={team === 'blue' ? MAT.boxBlue : MAT.boxRed}
            position={[slot.x, slot.y + 0.45, slot.z - 1.6]} scale={[0.66, 0.52, 0.56]} castShadow visible={false} />
        ))}
      </group>
      {/* wheels */}
      <group ref={wheels}>
        {[[-1.15, -2.4], [1.15, -2.4], [-1.15, 1.3], [1.15, 1.3], [-1.15, 2.5], [1.15, 2.5]].map(([x, z], i) => (
          <mesh key={i} geometry={GEO.cylLow} material={MAT.rubber} position={[x, 0.52, z]} rotation={[0, 0, Math.PI / 2]} scale={[1.02, 0.34, 1.02]} castShadow />
        ))}
      </group>
      {/* lamps */}
      <group ref={lights}>
        {[-0.8, 0.8].map((x) => (
          <mesh key={x} geometry={GEO.sphereLow} material={MAT.lampOff} position={[x, 1.0, -3.55]} scale={[0.22, 0.18, 0.12]} />
        ))}
      </group>
    </group>
  );
};
