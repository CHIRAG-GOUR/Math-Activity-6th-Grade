// ============================================================
// THE CHOCOLATE FACTORY — FACTORY STAFF
//
// Stylised but unmistakably human: head with a face, hair, torso with work
// clothing, arms with hands, legs and shoes. Proportions are deliberately
// gentle (roughly six heads tall) so the crew reads as people at a distance
// rather than as blocks.
//
// Each person owns ONE useFrame that reads the simulation directly and drives
// its own limbs, so nothing here re-renders React while the factory runs.
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TeamId } from '../types';
import { runningStep, sim } from '../engine/factorySim';
import { sideOf, sideSign } from '../engine/factoryLayout';
import { GEO, MAT, teamVestMat } from './materials';
import { angleDelta, type Vec3 } from './geom';

export type Gesture = 'none' | 'operate' | 'inspect' | 'talk';

export interface PersonState {
  pos: Vec3;
  heading: number;
  moving: boolean;
  carrying: boolean;
  gesture: Gesture;
}

interface Look {
  skin: THREE.Material;
  hair: THREE.Material;
  top: THREE.Material;
  hat?: 'hardhat' | 'cap' | 'none';
  coat?: boolean;
}

/**
 * One worker. `read` is called every frame and must return the person's
 * current position/pose — normally straight out of the simulation.
 */
export const Person3D: React.FC<{ look: Look; read: () => PersonState; scale?: number }> = ({ look, read, scale = 1 }) => {
  const root = useRef<THREE.Group>(null);
  const hips = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const phase = useRef(Math.random() * 6);

  useFrame((_, delta) => {
    const s = read();
    const g = root.current;
    if (!g) return;
    g.position.set(s.pos.x, 0, s.pos.z);
    g.rotation.y += angleDelta(g.rotation.y, s.heading) * (1 - Math.exp(-9 * delta));

    phase.current += delta * (s.moving ? 8.5 : 1.5);
    const p = phase.current;
    const swing = s.moving ? 0.62 : 0.06;

    if (legL.current) legL.current.rotation.x = Math.sin(p) * swing;
    if (legR.current) legR.current.rotation.x = -Math.sin(p) * swing;
    if (hips.current) hips.current.position.y = s.moving ? Math.abs(Math.sin(p)) * 0.06 : 0;

    if (armL.current && armR.current) {
      if (s.carrying) {
        // Both arms forward, holding the load against the chest.
        armL.current.rotation.x = -1.35;
        armR.current.rotation.x = -1.35;
        armL.current.rotation.z = 0.28;
        armR.current.rotation.z = -0.28;
      } else if (s.gesture === 'operate') {
        armL.current.rotation.x = -1.1 + Math.sin(p * 0.9) * 0.16;
        armR.current.rotation.x = -0.25;
        armL.current.rotation.z = 0.1; armR.current.rotation.z = -0.1;
      } else if (s.gesture === 'inspect') {
        armL.current.rotation.x = -1.25;
        armR.current.rotation.x = -0.95 + Math.sin(p * 0.7) * 0.2;
        armL.current.rotation.z = 0.22; armR.current.rotation.z = -0.22;
      } else {
        armL.current.rotation.x = -Math.sin(p) * swing * 0.8;
        armR.current.rotation.x = Math.sin(p) * swing * 0.8;
        armL.current.rotation.z = 0.08; armR.current.rotation.z = -0.08;
      }
    }

    if (head.current) {
      head.current.rotation.y = s.gesture === 'inspect' ? Math.sin(p * 0.5) * 0.35 : Math.sin(p * 0.25) * 0.18;
      head.current.rotation.x = s.gesture === 'inspect' ? 0.25 : 0;
    }
  });

  const faceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.6 }), []);

  return (
    <group ref={root} scale={scale}>
      <group ref={hips}>
        {/* legs */}
        <group ref={legL} position={[-0.12, 0.78, 0]}>
          <mesh geometry={GEO.box} material={MAT.trousers} position={[0, -0.36, 0]} scale={[0.19, 0.76, 0.21]} castShadow />
          <mesh geometry={GEO.box} material={MAT.shoe} position={[0, -0.76, 0.05]} scale={[0.21, 0.12, 0.34]} castShadow />
        </group>
        <group ref={legR} position={[0.12, 0.78, 0]}>
          <mesh geometry={GEO.box} material={MAT.trousers} position={[0, -0.36, 0]} scale={[0.19, 0.76, 0.21]} castShadow />
          <mesh geometry={GEO.box} material={MAT.shoe} position={[0, -0.76, 0.05]} scale={[0.21, 0.12, 0.34]} castShadow />
        </group>

        {/* torso */}
        <mesh geometry={GEO.box} material={look.top} position={[0, 1.12, 0]} scale={[0.46, 0.62, 0.26]} castShadow />
        {look.coat && (
          <mesh geometry={GEO.box} material={MAT.coatWhite} position={[0, 0.94, 0]} scale={[0.5, 0.42, 0.29]} castShadow />
        )}
        {/* hi-vis band, so roles read at a glance */}
        <mesh geometry={GEO.box} material={MAT.vestHi} position={[0, 1.2, 0.135]} scale={[0.47, 0.12, 0.02]} />
        {/* neck */}
        <mesh geometry={GEO.cylLow} material={look.skin} position={[0, 1.47, 0]} scale={[0.13, 0.1, 0.13]} />

        {/* arms */}
        <group ref={armL} position={[-0.3, 1.36, 0]}>
          <mesh geometry={GEO.box} material={look.top} position={[0, -0.24, 0]} scale={[0.15, 0.5, 0.17]} castShadow />
          <mesh geometry={GEO.sphereLow} material={look.skin} position={[0, -0.52, 0]} scale={[0.15, 0.15, 0.15]} />
        </group>
        <group ref={armR} position={[0.3, 1.36, 0]}>
          <mesh geometry={GEO.box} material={look.top} position={[0, -0.24, 0]} scale={[0.15, 0.5, 0.17]} castShadow />
          <mesh geometry={GEO.sphereLow} material={look.skin} position={[0, -0.52, 0]} scale={[0.15, 0.15, 0.15]} />
        </group>

        {/* head + face */}
        <group ref={head} position={[0, 1.62, 0]}>
          <mesh geometry={GEO.box} material={look.skin} scale={[0.3, 0.32, 0.28]} castShadow />
          {/* eyes */}
          <mesh geometry={GEO.box} material={faceMat} position={[-0.07, 0.04, -0.15]} scale={[0.05, 0.05, 0.02]} />
          <mesh geometry={GEO.box} material={faceMat} position={[0.07, 0.04, -0.15]} scale={[0.05, 0.05, 0.02]} />
          {/* mouth */}
          <mesh geometry={GEO.box} material={faceMat} position={[0, -0.08, -0.15]} scale={[0.1, 0.02, 0.02]} />
          {/* hair */}
          <mesh geometry={GEO.box} material={look.hair} position={[0, 0.15, 0.01]} scale={[0.32, 0.1, 0.3]} />
          <mesh geometry={GEO.box} material={look.hair} position={[0, 0.04, 0.14]} scale={[0.31, 0.22, 0.04]} />
          {look.hat === 'hardhat' && (
            <>
              <mesh geometry={GEO.sphereLow} material={MAT.hardHat} position={[0, 0.2, 0]} scale={[0.34, 0.26, 0.34]} castShadow />
              <mesh geometry={GEO.box} material={MAT.hardHat} position={[0, 0.13, -0.16]} scale={[0.34, 0.04, 0.14]} />
            </>
          )}
          {look.hat === 'cap' && (
            <>
              <mesh geometry={GEO.box} material={look.top} position={[0, 0.2, 0]} scale={[0.32, 0.1, 0.3]} />
              <mesh geometry={GEO.box} material={look.top} position={[0, 0.16, -0.2]} scale={[0.3, 0.03, 0.14]} />
            </>
          )}
        </group>
      </group>
    </group>
  );
};

// ── ROLE PRESETS ──

const looks = (team: TeamId) => ({
  handler: { skin: MAT.skin, hair: MAT.hair, top: MAT.vestHi, hat: 'hardhat' as const },
  handlerB: { skin: MAT.skinDark, hair: MAT.hairLight, top: MAT.vestHi, hat: 'hardhat' as const },
  operator: { skin: MAT.skin, hair: MAT.hair, top: teamVestMat(team), hat: 'hardhat' as const },
  inspector: { skin: MAT.skinDark, hair: MAT.hair, top: MAT.coatWhite, hat: 'none' as const },
  packer: { skin: MAT.skin, hair: MAT.hairLight, top: teamVestMat(team), hat: 'cap' as const },
});

const headingTowards = (from: Vec3, to: Vec3) => Math.atan2(-(to.x - from.x), -(to.z - from.z));

/**
 * Ingredient handler: fetches a sack of cocoa from the pallet stack, carries
 * it to the measuring tank and tips it in. Between batches they keep working
 * the store rather than standing about.
 */
export const IngredientHandler3D: React.FC<{ team: TeamId; index: 0 | 1 }> = ({ team, index }) => {
  const sack = useRef<THREE.Mesh>(null);
  const tank = sideOf(team).measuringTank;

  const read = (): PersonState => {
    const w = sim[team].handlers[index];
    const walking = w.task === 'to_pallet' || w.task === 'to_tank' || w.task === 'back' || w.task === 'ambient';
    return {
      pos: w.pos,
      heading: w.task === 'tipping' ? headingTowards(w.pos, tank) : w.heading,
      moving: walking && w.task !== 'ambient' ? true : w.task === 'ambient',
      carrying: w.carrying,
      gesture: w.task === 'tipping' ? 'operate' : 'none',
    };
  };

  useFrame(() => {
    const w = sim[team].handlers[index];
    if (!sack.current) return;
    sack.current.visible = w.carrying;
    if (!w.carrying) return;
    const tipping = w.task === 'tipping';
    const f = { x: -Math.sin(w.heading), z: -Math.cos(w.heading) };
    // Held at the chest while walking, raised and tilted over the tank to pour.
    sack.current.position.set(
      w.pos.x + f.x * (tipping ? 0.75 : 0.5),
      tipping ? 1.85 : 1.05,
      w.pos.z + f.z * (tipping ? 0.75 : 0.5)
    );
    sack.current.rotation.set(tipping ? -1.15 : 0, w.heading, 0);
  });

  return (
    <group>
      <Person3D look={index === 0 ? looks(team).handler : looks(team).handlerB} read={read} />
      <mesh ref={sack} geometry={GEO.box} material={MAT.boxCard} scale={[0.5, 0.46, 0.42]} castShadow visible={false} />
    </group>
  );
};

/** Works the mixer control panel while a batch is running. */
export const MixerOperator3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const mixer = sideOf(team).mixer;
  const read = (): PersonState => {
    const w = sim[team].operator;
    const step = runningStep(team);
    return {
      pos: w.pos,
      heading: headingTowards(w.pos, mixer),
      moving: false,
      carrying: false,
      gesture: step === 'mixing' || step === 'molding' ? 'operate' : 'inspect',
    };
  };
  return <Person3D look={looks(team).operator} read={read} />;
};

/** Checks the bars as they come off the cutter. */
export const QualityInspector3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const station = sideOf(team).qcStation;
  const read = (): PersonState => {
    const w = sim[team].inspector;
    return {
      pos: w.pos,
      heading: headingTowards(w.pos, station),
      moving: false,
      carrying: false,
      gesture: 'inspect',
    };
  };
  return (
    <group>
      <Person3D look={looks(team).inspector} read={read} />
      <mesh
        geometry={GEO.box} material={MAT.wood}
        position={[sideOf(team).inspectorHome.x + sideSign(team) * 0.7, 1.02, sideOf(team).inspectorHome.z + 0.6]}
        scale={[0.34, 0.03, 0.44]}
      />
    </group>
  );
};

/** Boxes the wrapped bars at the packaging machine. */
export const PackingWorker3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const machine = sideOf(team).packagingMachine;
  const box = useRef<THREE.Mesh>(null);
  const read = (): PersonState => {
    const w = sim[team].packer;
    const step = runningStep(team);
    return {
      pos: w.pos,
      heading: headingTowards(w.pos, machine),
      moving: false,
      carrying: step === 'packaging',
      gesture: step === 'packaging' ? 'operate' : 'inspect',
    };
  };
  useFrame(() => {
    const s = sim[team];
    if (!box.current) return;
    const packing = runningStep(team) === 'packaging';
    box.current.visible = packing;
    if (!packing) return;
    const w = s.packer;
    const f = { x: -Math.sin(w.heading), z: -Math.cos(w.heading) };
    box.current.position.set(w.pos.x + f.x * 0.48, 1.04 + Math.sin(w.phase * 3) * 0.06, w.pos.z + f.z * 0.48);
    box.current.rotation.y = w.heading;
  });
  return (
    <group>
      <Person3D look={looks(team).packer} read={read} />
      <mesh ref={box} geometry={GEO.box} material={team === 'blue' ? MAT.boxBlue : MAT.boxRed}
        scale={[0.5, 0.38, 0.42]} castShadow visible={false} />
    </group>
  );
};

/** Seated driver for the forklift — simplified pose, built into the cab. */
export const SeatedDriver3D: React.FC<{ team: TeamId }> = ({ team }) => (
  <group position={[0, 0.72, 0.28]}>
    <mesh geometry={GEO.box} material={teamVestMat(team)} position={[0, 0.42, 0]} scale={[0.42, 0.5, 0.26]} castShadow />
    <mesh geometry={GEO.box} material={MAT.vestHi} position={[0, 0.46, 0.14]} scale={[0.43, 0.12, 0.02]} />
    <mesh geometry={GEO.box} material={MAT.trousers} position={[0, 0.12, -0.2]} scale={[0.36, 0.18, 0.44]} />
    <mesh geometry={GEO.box} material={MAT.skin} position={[0, 0.84, 0]} scale={[0.27, 0.29, 0.25]} castShadow />
    <mesh geometry={GEO.box} material={MAT.hair} position={[0, 0.98, 0.01]} scale={[0.29, 0.09, 0.27]} />
    <mesh geometry={GEO.sphereLow} material={MAT.hardHat} position={[0, 1.03, 0]} scale={[0.31, 0.22, 0.31]} />
    <mesh geometry={GEO.box} material={teamVestMat(team)} position={[-0.24, 0.5, -0.22]} scale={[0.13, 0.13, 0.42]} />
    <mesh geometry={GEO.box} material={teamVestMat(team)} position={[0.24, 0.5, -0.22]} scale={[0.13, 0.13, 0.42]} />
  </group>
);
