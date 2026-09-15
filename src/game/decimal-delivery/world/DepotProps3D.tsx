// ============================================================
// THE DECIMAL DELIVERY NETWORK — DEPOT PROPS
//
// The reusable physical pieces: trucks, forklifts, workers, parcels, conveyor,
// weighing platform, scanner arch. Each is driven by the simulation in
// engine/depotSim.ts — they read that state every frame and never hold
// positions of their own, so what you see is always what the sim believes.
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MAT, GEO, PARCEL_TINTS, parcelDimensions } from './DepotMaterials';
import { sideSim, type SideSim } from '../engine/depotSim';
import { sideOf, sideSign, type Vec3 } from '../engine/depotLayout';
import type { TeamId } from '../types';

// ── DELIVERY TRUCK ──────────────────────────────────────────────────────────
// Cab, box body, wheels, lights and doors. Load is visible through the open
// rear doors, so a fuller truck genuinely looks fuller.

export const Truck3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const root = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);
  const doorL = useRef<THREE.Mesh>(null);
  const doorR = useRef<THREE.Mesh>(null);
  const lampRef = useRef<THREE.Mesh>(null);
  const isBlue = team === 'blue';
  const body = isBlue ? MAT.truckBlue : MAT.truckRed;

  useFrame((_, dt) => {
    const s = sideSim(team);
    if (root.current) {
      root.current.position.set(s.truckPos.x, 0, s.truckPos.z);
      root.current.rotation.y = s.truckHeading;
    }
    // Wheels only turn while the truck is actually moving.
    if (wheels.current && s.truckDeparting) {
      wheels.current.children.forEach((w) => { w.rotation.x += dt * 6; });
    }
    // Rear doors swing shut as the truck prepares to leave.
    const open = s.truckDoorsOpen;
    if (doorL.current) doorL.current.rotation.y = -open * 1.5;
    if (doorR.current) doorR.current.rotation.y = open * 1.5;
    if (lampRef.current) {
      (lampRef.current.material as THREE.Material) = s.truckLights ? MAT.glassLight : MAT.lampOff;
    }
  });

  // Visible cargo stack, grown from the sim's loaded count.
  const cargo = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);
  const cargoRef = useRef<THREE.Group>(null);
  useFrame(() => {
    const s = sideSim(team);
    if (!cargoRef.current) return;
    cargoRef.current.children.forEach((c, i) => {
      c.visible = i < s.loadedCount;
    });
  });

  return (
    <group ref={root}>
      {/* box body */}
      <mesh geometry={GEO.unitBox} material={MAT.truckBox}
        position={[0, 2.25, 1.6]} scale={[3.0, 2.7, 5.4]} castShadow receiveShadow />
      {/* livery band */}
      <mesh geometry={GEO.unitBox} material={body}
        position={[0, 1.55, 1.6]} scale={[3.06, 0.9, 5.46]} castShadow />
      {/* cab */}
      <mesh geometry={GEO.unitBox} material={body}
        position={[0, 1.7, -2.1]} scale={[2.85, 2.0, 2.3]} castShadow receiveShadow />
      {/* windscreen */}
      <mesh geometry={GEO.unitBox} material={MAT.glass}
        position={[0, 2.25, -3.2]} scale={[2.5, 1.0, 0.16]} />
      {/* chassis */}
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 0.72, 0.4]} scale={[2.7, 0.45, 8.0]} />

      {/* headlamps */}
      {[-1.0, 1.0].map((x) => (
        <mesh key={x} ref={x > 0 ? lampRef : undefined} geometry={GEO.unitBox}
          material={MAT.glassLight} position={[x, 1.25, -3.3]} scale={[0.5, 0.3, 0.12]} />
      ))}

      {/* rear doors */}
      <group position={[0, 2.25, 4.3]}>
        <mesh ref={doorL} geometry={GEO.unitBox} material={MAT.truckBox}
          position={[-0.75, 0, 0]} scale={[1.48, 2.6, 0.12]} />
        <mesh ref={doorR} geometry={GEO.unitBox} material={MAT.truckBox}
          position={[0.75, 0, 0]} scale={[1.48, 2.6, 0.12]} />
      </group>

      {/* cargo visible through the doors */}
      <group ref={cargoRef}>
        {cargo.map((i) => (
          <mesh key={i} geometry={GEO.unitBox} material={MAT.cardboard}
            position={[
              -0.85 + (i % 3) * 0.85,
              1.35 + Math.floor(i / 3) * 0.75,
              0.4 + (i % 2) * 0.6,
            ]}
            scale={[0.75, 0.65, 0.75]} castShadow />
        ))}
      </group>

      {/* wheels */}
      <group ref={wheels}>
        {[[-1.4, -2.2], [1.4, -2.2], [-1.4, 2.2], [1.4, 2.2], [-1.4, 3.4], [1.4, 3.4]].map(
          ([x, z], i) => (
            <mesh key={i} geometry={GEO.unitCyl} material={MAT.tyre}
              position={[x, 0.68, z]} rotation={[0, 0, Math.PI / 2]}
              scale={[1.35, 0.42, 1.35]} castShadow />
          )
        )}
      </group>
    </group>
  );
};

// ── FORKLIFT ────────────────────────────────────────────────────────────────

export const Forklift3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const root = useRef<THREE.Group>(null);
  const forks = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);
  const pallet = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const s = sideSim(team);
    const f = s.forklift;
    if (root.current) {
      root.current.position.set(f.pos.x, 0, f.pos.z);
      root.current.rotation.y = f.heading;
    }
    if (forks.current) forks.current.position.y = f.forkY;
    if (wheels.current) {
      wheels.current.children.forEach((w) => { w.rotation.x += dt * f.speed * 1.6; });
    }
    if (pallet.current) pallet.current.visible = f.laden;
  });

  return (
    <group ref={root}>
      {/* counterweight body */}
      <mesh geometry={GEO.unitBox} material={MAT.guardOrange}
        position={[0, 0.72, 0.55]} scale={[1.4, 1.0, 1.9]} castShadow receiveShadow />
      {/* operator cage */}
      <mesh geometry={GEO.unitBox} material={MAT.steelDark}
        position={[0, 1.95, 0.6]} scale={[1.35, 0.1, 1.5]} />
      {[[-0.55, 0.0], [0.55, 0.0], [-0.55, 1.2], [0.55, 1.2]].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.unitBox} material={MAT.steelDark}
          position={[x, 1.35, z]} scale={[0.08, 1.2, 0.08]} />
      ))}
      {/* seat */}
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 1.2, 0.95]} scale={[0.7, 0.5, 0.2]} />
      {/* mast */}
      <mesh geometry={GEO.unitBox} material={MAT.steel}
        position={[0, 1.4, -0.5]} scale={[0.14, 2.6, 0.14]} />
      <mesh geometry={GEO.unitBox} material={MAT.steel}
        position={[0.5, 1.4, -0.5]} scale={[0.14, 2.6, 0.14]} />

      {/* forks + any pallet they carry */}
      <group ref={forks} position={[0, 0.25, 0]}>
        {[-0.3, 0.55].map((x) => (
          <mesh key={x} geometry={GEO.unitBox} material={MAT.steel}
            position={[x, 0.08, -1.25]} scale={[0.16, 0.08, 1.5]} castShadow />
        ))}
        <group ref={pallet}>
          <mesh geometry={GEO.unitBox} material={MAT.cardboardDark}
            position={[0.12, 0.2, -1.2]} scale={[1.3, 0.16, 1.3]} castShadow />
          <mesh geometry={GEO.unitBox} material={MAT.cardboard}
            position={[0.12, 0.6, -1.2]} scale={[1.0, 0.7, 1.0]} castShadow />
        </group>
      </group>

      <group ref={wheels}>
        {[[-0.62, -0.1], [0.62, -0.1], [-0.5, 1.3], [0.5, 1.3]].map(([x, z], i) => (
          <mesh key={i} geometry={GEO.unitCyl} material={MAT.tyre}
            position={[x, 0.32, z]} rotation={[0, 0, Math.PI / 2]}
            scale={[0.64, 0.26, 0.64]} castShadow />
        ))}
      </group>
    </group>
  );
};

// ── WORKER ──────────────────────────────────────────────────────────────────
// Walk cycle is a simple leg swing plus a body bob — cheap, but it reads as
// purposeful movement rather than a sliding statue. Arms rise when carrying.

export const Worker3D: React.FC<{ team: TeamId; index: number }> = ({ team, index }) => {
  const root = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Mesh>(null);
  const legR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Mesh>(null);
  const armR = useRef<THREE.Mesh>(null);
  const torso = useRef<THREE.Group>(null);

  const vest = index === 0 ? MAT.vest : MAT.vestRed;

  useFrame(() => {
    const s = sideSim(team);
    const w = s.workers[index];
    if (!w || !root.current) return;

    root.current.position.set(w.pos.x, 0, w.pos.z);
    root.current.rotation.y = w.heading;

    const moving = w.task === 'walk_to_pickup' || w.task === 'carry_to_truck' || w.task === 'return';
    const swing = moving ? Math.sin(w.phase) * 0.6 : Math.sin(w.phase * 0.5) * 0.06;

    if (legL.current) legL.current.rotation.x = swing;
    if (legR.current) legR.current.rotation.x = -swing;

    // Carrying: arms forward and level. Picking up: bend down.
    const bend = w.task === 'pick_up' ? Math.min(1, w.t) * 0.7 : 0;
    if (torso.current) {
      torso.current.rotation.x = bend;
      torso.current.position.y = moving ? Math.abs(Math.sin(w.phase)) * 0.05 : 0;
    }
    const armFwd = w.carrying ? -1.25 : -swing * 0.8;
    if (armL.current) armL.current.rotation.x = armFwd;
    if (armR.current) armR.current.rotation.x = armFwd;
  });

  return (
    <group ref={root}>
      <group ref={torso} position={[0, 0, 0]}>
        {/* torso + hi-vis */}
        <mesh geometry={GEO.unitBox} material={MAT.overall}
          position={[0, 1.12, 0]} scale={[0.52, 0.62, 0.3]} castShadow />
        <mesh geometry={GEO.unitBox} material={vest}
          position={[0, 1.14, 0]} scale={[0.56, 0.48, 0.34]} />
        {/* head + helmet */}
        <mesh geometry={GEO.unitSphere} material={MAT.skin}
          position={[0, 1.58, 0]} scale={[0.29, 0.32, 0.28]} castShadow />
        <mesh geometry={GEO.unitSphere} material={MAT.helmet}
          position={[0, 1.66, 0]} scale={[0.34, 0.26, 0.34]} />
        {/* arms */}
        <mesh ref={armL} geometry={GEO.unitBox} material={vest}
          position={[-0.34, 1.2, 0]} scale={[0.13, 0.55, 0.13]} />
        <mesh ref={armR} geometry={GEO.unitBox} material={vest}
          position={[0.34, 1.2, 0]} scale={[0.13, 0.55, 0.13]} />
      </group>
      {/* legs */}
      <mesh ref={legL} geometry={GEO.unitBox} material={MAT.overall}
        position={[-0.14, 0.42, 0]} scale={[0.17, 0.85, 0.18]} />
      <mesh ref={legR} geometry={GEO.unitBox} material={MAT.overall}
        position={[0.14, 0.42, 0]} scale={[0.17, 0.85, 0.18]} />
      <mesh geometry={GEO.unitBox} material={MAT.boot}
        position={[-0.14, 0.06, 0.04]} scale={[0.2, 0.12, 0.3]} />
      <mesh geometry={GEO.unitBox} material={MAT.boot}
        position={[0.14, 0.06, 0.04]} scale={[0.2, 0.12, 0.3]} />
    </group>
  );
};

// ── LIVE PARCEL ─────────────────────────────────────────────────────────────

export const Parcel3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const root = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const tapeRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Mesh>(null);
  const tint = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const s = sideSim(team);
    const p = s.parcel;
    if (!root.current) return;

    root.current.visible = !!p;
    if (!p) return;

    root.current.position.set(p.pos.x, p.pos.y, p.pos.z);
    root.current.rotation.y = p.heading;

    const [w, h, d] = parcelDimensions(p.shape);
    if (boxRef.current) {
      boxRef.current.scale.set(w, h, d);
      tint.copy(PARCEL_TINTS[p.colorIndex % PARCEL_TINTS.length]);
      (boxRef.current.material as THREE.MeshStandardMaterial).color.copy(tint);
    }
    if (tapeRef.current) tapeRef.current.scale.set(w * 0.16, h * 1.02, d * 1.02);
    if (labelRef.current) {
      labelRef.current.scale.set(w * 0.5, h * 0.3, 0.02);
      labelRef.current.position.set(0, 0, d / 2 + 0.012);
    }
  });

  // Own material instance so per-parcel tinting does not affect other meshes.
  const boxMat = useMemo(() => MAT.cardboard.clone(), []);

  return (
    <group ref={root}>
      <mesh ref={boxRef} geometry={GEO.unitBox} material={boxMat} castShadow receiveShadow />
      <mesh ref={tapeRef} geometry={GEO.unitBox} material={MAT.tape} />
      <mesh ref={labelRef} geometry={GEO.unitBox} material={MAT.labelWhite} />
    </group>
  );
};

// ── CONVEYOR ────────────────────────────────────────────────────────────────
// Rollers actually turn, and only while the belt is running — the visible
// confirmation that a correct answer started the machine.

export const Conveyor3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const rollers = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const s0 = sideOf(team);

  // Build the belt run from the same waypoints the parcel uses.
  const segments = useMemo(() => {
    const pts: Vec3[] = [s0.conveyorStart, s0.scanner, s0.sortGate, s0.loadPoint];
    const out: { pos: Vec3; heading: number; length: number }[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const len = Math.hypot(b.x - a.x, b.z - a.z);
      out.push({
        pos: { x: (a.x + b.x) / 2, y: 0, z: (a.z + b.z) / 2 },
        heading: Math.atan2(-(b.x - a.x), -(b.z - a.z)),
        length: len,
      });
    }
    return out;
  }, [s0]);

  const totalRollers = 46;

  useFrame(() => {
    const s = sideSim(team);
    if (!rollers.current) return;
    let idx = 0;
    for (const seg of segments) {
      const count = Math.max(2, Math.round(seg.length / 0.75));
      for (let i = 0; i < count && idx < totalRollers; i++, idx++) {
        const t = (i + 0.5) / count;
        const halfL = seg.length / 2;
        const local = -halfL + t * seg.length;
        const fx = -Math.sin(seg.heading);
        const fz = -Math.cos(seg.heading);
        dummy.position.set(seg.pos.x + fx * local, 1.0, seg.pos.z + fz * local);
        dummy.rotation.set(0, seg.heading, Math.PI / 2);
        // Roller spin is the cause-and-effect cue: still when idle, turning
        // the instant a correct answer starts the belt.
        dummy.rotation.y += s.beltPhase * Math.PI * 2 * 0;
        dummy.scale.set(0.16, 1.5, 0.16);
        dummy.updateMatrix();
        rollers.current.setMatrixAt(idx, dummy.matrix);
      }
    }
    for (; idx < totalRollers; idx++) {
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      rollers.current.setMatrixAt(idx, dummy.matrix);
    }
    rollers.current.instanceMatrix.needsUpdate = true;
  });

  const beltRef = useRef<THREE.Group>(null);
  useFrame(() => {
    const s = sideSim(team);
    if (!beltRef.current) return;
    // Slide the belt texture stand-in (chevrons) to show motion.
    beltRef.current.children.forEach((c, i) => {
      const base = (i / beltRef.current!.children.length);
      const p = (base + s.beltPhase) % 1;
      c.visible = s.beltRunning;
      c.scale.setScalar(s.beltRunning ? 1 : 0);
      void p;
    });
  });

  return (
    <group>
      {/* frames */}
      {segments.map((seg, i) => (
        <group key={i} position={[seg.pos.x, 0, seg.pos.z]} rotation={[0, seg.heading, 0]}>
          <mesh geometry={GEO.unitBox} material={MAT.steelDark}
            position={[0, 0.5, 0]} scale={[1.9, 0.14, seg.length]} receiveShadow />
          <mesh geometry={GEO.unitBox} material={MAT.beltRubber}
            position={[0, 1.06, 0]} scale={[1.7, 0.06, seg.length]} receiveShadow />
          {/* side guards */}
          {[-0.95, 0.95].map((x) => (
            <mesh key={x} geometry={GEO.unitBox} material={MAT.guardYellow}
              position={[x, 0.85, 0]} scale={[0.1, 0.5, seg.length]} />
          ))}
          {/* legs */}
          {[-seg.length / 2 + 0.6, seg.length / 2 - 0.6].map((z) => (
            <mesh key={z} geometry={GEO.unitBox} material={MAT.steel}
              position={[0, 0.25, z]} scale={[1.4, 0.5, 0.14]} />
          ))}
        </group>
      ))}
      <instancedMesh ref={rollers} args={[GEO.unitCylLow, MAT.roller, totalRollers]} />
    </group>
  );
};
