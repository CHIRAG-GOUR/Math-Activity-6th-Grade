// ============================================================
// THE DECIMAL DELIVERY NETWORK — MACHINES
//
// Every machine here shows the state it is genuinely in (section 18):
//   - conveyor rollers and belt chevrons move only while a parcel rides them
//   - the weighing platform dips under a parcel and its digital display
//     settles on the reading (or stays withheld while the weight IS the
//     question, then confirms it once answered)
//   - the lamp goes amber while processing, green on approval, orange on
//     rejection; the status plate reads WAITING / PROCESSING / APPROVED / ...
//   - the scanner arch fires as a parcel passes, and the diverter flap swings
//     to route the parcel to the truck spur or down the reject chute
// ============================================================

'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GEO, MAT } from './DepotMaterials';
import { laneSim, sideSim, sim } from '../engine/depotSim';
import {
  laneOf, sideOf, mainBelt, rejectChute, HUB, headingTo,
  type LaneId, type Vec3,
} from '../engine/depotLayout';
import { LiveDisplay, makeSign } from './canvasText';
import { mergeBoxes, place, type BoxPart } from './mergeGeo';
import type { TeamId } from '../types';
import { TRUCK_CAPACITY } from '../store/depotStore';

interface Segment { mid: Vec3; heading: number; length: number; from: Vec3 }

function segmentsOf(points: Vec3[]): Segment[] {
  const out: Segment[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    out.push({
      from: a,
      mid: { x: (a.x + b.x) / 2, y: 0, z: (a.z + b.z) / 2 },
      heading: headingTo(a, b),
      length: Math.hypot(b.x - a.x, b.z - a.z),
    });
  }
  return out;
}

// ── CONVEYOR ────────────────────────────────────────────────────────────────

const BELT_TOP = 1.12;

export const Conveyor3D: React.FC<{ team: TeamId; lane: LaneId }> = ({ team, lane }) => {
  const l = laneOf(team, lane);
  const feed = useMemo(() => segmentsOf([l.staging, ...mainBelt(team, lane)]), [team, lane, l.staging]);
  const chute = useMemo(() => segmentsOf(rejectChute(team, lane)), [team, lane]);
  const all = useMemo(() => [...feed.map((s) => ({ s, reject: false })), ...chute.map((s) => ({ s, reject: true }))], [feed, chute]);

  // Rollers and moving chevrons are instanced across every segment.
  const rollerCount = useMemo(() => all.reduce((n, { s }) => n + Math.max(2, Math.round(s.length / 0.55)), 0), [all]);
  const chevronCount = useMemo(() => all.reduce((n, { s }) => n + Math.max(1, Math.round(s.length / 1.3)), 0), [all]);
  const rollers = useRef<THREE.InstancedMesh>(null);
  const chevrons = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lamp = useRef<THREE.Mesh>(null);

  const chevronMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5b6472', roughness: 0.8 }), []);

  useFrame(() => {
    const ls = laneSim(team, lane);
    const phase = ls.beltPhase;

    if (rollers.current) {
      let i = 0;
      for (const { s } of all) {
        const n = Math.max(2, Math.round(s.length / 0.55));
        const fx = -Math.sin(s.heading);
        const fz = -Math.cos(s.heading);
        for (let k = 0; k < n; k++) {
          const along = -s.length / 2 + ((k + 0.5) / n) * s.length;
          dummy.position.set(s.mid.x + fx * along, BELT_TOP - 0.1, s.mid.z + fz * along);
          // Rollers spin only while the belt runs (beltPhase is frozen otherwise).
          dummy.rotation.set(0, s.heading, Math.PI / 2);
          dummy.rotateY(phase * Math.PI * 8);
          dummy.scale.set(0.14, 1.6, 0.14);
          dummy.updateMatrix();
          rollers.current.setMatrixAt(i++, dummy.matrix);
        }
      }
      rollers.current.instanceMatrix.needsUpdate = true;
    }

    // Chevrons printed on the belt slide along it: the clearest possible
    // signal that the machine has started because of a correct answer.
    if (chevrons.current) {
      let i = 0;
      for (const { s } of all) {
        const n = Math.max(1, Math.round(s.length / 1.3));
        const fx = -Math.sin(s.heading);
        const fz = -Math.cos(s.heading);
        for (let k = 0; k < n; k++) {
          const t = ((k / n) + phase) % 1;
          const along = -s.length / 2 + t * s.length;
          dummy.position.set(s.mid.x + fx * along, BELT_TOP + 0.005, s.mid.z + fz * along);
          dummy.rotation.set(-Math.PI / 2, 0, -s.heading);
          dummy.scale.set(1.2, 0.18, 1);
          dummy.updateMatrix();
          chevrons.current.setMatrixAt(i++, dummy.matrix);
        }
      }
      chevrons.current.instanceMatrix.needsUpdate = true;
    }

    if (lamp.current) {
      lamp.current.material = ls.beltRunning ? MAT.lampAmber : MAT.lampOff;
    }
  });

  // Frame, belt, rails and legs never move: bake each material into one mesh
  // per lane instead of ~60 separate meshes.
  const baked = useMemo(() => {
    const frame: BoxPart[] = [];
    const belt: BoxPart[] = [];
    const railY: BoxPart[] = [];
    const railO: BoxPart[] = [];
    const legs: BoxPart[] = [];
    for (const { s, reject } of all) {
      const at = (part: BoxPart) => place(s.mid.x, s.mid.z, s.heading, part);
      frame.push(at({ x: 0, y: BELT_TOP - 0.32, z: 0, sx: 1.9, sy: 0.22, sz: s.length + 0.1 }));
      belt.push(at({ x: 0, y: BELT_TOP - 0.03, z: 0, sx: 1.6, sy: 0.06, sz: s.length + 0.05 }));
      for (const x of [-0.92, 0.92]) {
        (reject ? railO : railY).push(at({
          x, y: BELT_TOP + (reject ? 0.22 : 0.12), z: 0,
          sx: 0.08, sy: reject ? 0.44 : 0.24, sz: s.length + 0.05,
        }));
      }
      const n = Math.max(2, Math.ceil(s.length / 2.6));
      for (let k = 0; k < n; k++) {
        const z = -s.length / 2 + 0.3 + (k / (n - 1)) * (s.length - 0.6);
        for (const x of [-0.78, 0.78]) {
          legs.push(at({ x, y: (BELT_TOP - 0.43) / 2, z, sx: 0.1, sy: BELT_TOP - 0.43, sz: 0.1 }));
        }
      }
    }
    return {
      frame: mergeBoxes(frame), belt: mergeBoxes(belt),
      railY: mergeBoxes(railY), railO: mergeBoxes(railO), legs: mergeBoxes(legs),
    };
  }, [all]);

  useEffect(() => () => { Object.values(baked).forEach((g) => g.dispose()); }, [baked]);

  return (
    <group>
      <mesh geometry={baked.frame} material={MAT.steelDark} castShadow receiveShadow />
      <mesh geometry={baked.belt} material={MAT.beltRubber} receiveShadow />
      <mesh geometry={baked.railY} material={MAT.guardYellow} />
      <mesh geometry={baked.railO} material={MAT.guardOrange} />
      <mesh geometry={baked.legs} material={MAT.steel} castShadow />

      <instancedMesh ref={rollers} args={[GEO.unitCylLow, MAT.roller, rollerCount]} />
      <instancedMesh ref={chevrons} args={[GEO.plane, chevronMat, chevronCount]} />

      {/* belt head: intake end stop with the running lamp */}
      <group position={[l.staging.x, 0, l.staging.z]} rotation={[0, headingTo(l.staging, l.entry), 0]}>
        <mesh geometry={GEO.unitBox} material={MAT.trim}
          position={[0, 1.0, 0.7]} scale={[2.0, 1.1, 0.25]} castShadow />
        <mesh ref={lamp} geometry={GEO.unitSphere} material={MAT.lampOff}
          position={[0.75, 1.72, 0.7]} scale={[0.2, 0.2, 0.2]} />
      </group>
    </group>
  );
};

// ── WEIGHING / PROCESSING STATION ───────────────────────────────────────────

export const WeighStation3D: React.FC<{ team: TeamId; lane: LaneId }> = ({ team, lane }) => {
  const l = laneOf(team, lane);
  const s = sideOf(team);
  const platform = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.Mesh>(null);

  const display = useMemo(() => new LiveDisplay(512, 200), []);
  const status = useMemo(() => new LiveDisplay(512, 110), []);
  const mats = useMemo(() => ({
    display: new THREE.MeshBasicMaterial({ map: display.texture, toneMapped: false }),
    status: new THREE.MeshBasicMaterial({ map: status.texture, toneMapped: false }),
  }), [display, status]);

  useEffect(() => () => { display.dispose(); status.dispose(); }, [display, status]);

  // The readout pillar stands on the player's side of the belt and faces the
  // player character, so the student at the station and the camera both read it.
  const pillarSide = lane === 'A' ? 1 : -1;
  const pillarPos = { x: l.station.x, z: l.station.z + pillarSide * 1.7 };
  const pillarHeading = headingTo({ ...pillarPos, y: 0 }, s.player);

  useFrame(() => {
    const ls = laneSim(team, lane);
    if (platform.current) platform.current.position.y = BELT_TOP - 0.1 - ls.scaleDepress;
    if (lamp.current) {
      lamp.current.material = ls.lamp === 'ok' ? MAT.lampGreen
        : ls.lamp === 'error' ? MAT.lampRed
          : ls.lamp === 'working' ? MAT.lampAmber : MAT.lampOff;
    }
    display.drawScale(ls.scaleDisplay, ls.lamp);
    status.drawStatus(ls.status, lane);
  });

  return (
    <group>
      {/* the weighing platform replaces a section of belt */}
      <group position={[l.station.x, 0, l.station.z]} rotation={[0, headingTo(l.entry, l.station), 0]}>
        <mesh geometry={GEO.unitBox} material={MAT.concreteDark}
          position={[0, 0.05, 0]} scale={[3.2, 0.1, 3.2]} receiveShadow />
        <mesh geometry={GEO.unitBox} material={MAT.guardYellow}
          position={[0, 0.12, 0]} scale={[3.3, 0.04, 3.3]} />
        <mesh geometry={GEO.unitBox} material={MAT.steelDark}
          position={[0, 0.55, 0]} scale={[2.3, 0.9, 2.3]} castShadow />
        <mesh ref={platform} geometry={GEO.unitBox} material={MAT.steel}
          position={[0, BELT_TOP - 0.1, 0]} scale={[2.1, 0.12, 2.1]} castShadow receiveShadow />
        {/* load cell feet */}
        {[[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]].map(([x, z], i) => (
          <mesh key={i} geometry={GEO.unitCylLow} material={MAT.chrome}
            position={[x, 0.95, z]} scale={[0.14, 0.18, 0.14]} />
        ))}
      </group>

      {/* readout pillar facing the player character */}
      <group position={[pillarPos.x, 0, pillarPos.z]} rotation={[0, pillarHeading, 0]}>
        <mesh geometry={GEO.unitBox} material={MAT.steel}
          position={[0, 1.1, 0.12]} scale={[0.18, 2.2, 0.18]} castShadow />
        <mesh geometry={GEO.unitBox} material={MAT.trim}
          position={[0, 2.35, 0]} scale={[1.9, 1.05, 0.2]} castShadow />
        <mesh geometry={GEO.plane} material={mats.display}
          position={[0, 2.42, -0.105]} rotation={[0, Math.PI, 0]} scale={[1.7, 0.66, 1]} />
        <mesh geometry={GEO.plane} material={mats.status}
          position={[0, 1.66, -0.105]} rotation={[0, Math.PI, 0]} scale={[1.5, 0.32, 1]} />
        <mesh ref={lamp} geometry={GEO.unitSphere} material={MAT.lampOff}
          position={[0, 3.05, 0]} scale={[0.26, 0.26, 0.26]} />
      </group>
    </group>
  );
};

// ── SCANNER ARCH ────────────────────────────────────────────────────────────

export const Scanner3D: React.FC<{ team: TeamId; lane: LaneId }> = ({ team, lane }) => {
  const l = laneOf(team, lane);
  const beam = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const ls = laneSim(team, lane);
    const hot = ls.scannerFlash > 0.02;
    if (beam.current) {
      beam.current.visible = hot;
      beam.current.scale.y = 0.05 + ls.scannerFlash * 1.3;
    }
    if (lamp.current) lamp.current.material = hot ? MAT.lampGreen : MAT.lampOff;
  });

  return (
    <group position={[l.scanner.x, 0, l.scanner.z]} rotation={[0, headingTo(l.station, l.scanner), 0]}>
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={MAT.steel}
          position={[x, 1.45, 0]} scale={[0.18, 2.9, 0.42]} castShadow />
      ))}
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 2.95, 0]} scale={[2.6, 0.38, 0.55]} castShadow />
      <mesh ref={lamp} geometry={GEO.unitSphere} material={MAT.lampOff}
        position={[0, 3.25, 0]} scale={[0.2, 0.2, 0.2]} />
      <mesh ref={beam} geometry={GEO.unitBox} material={MAT.lampGreen}
        position={[0, 1.85, 0]} scale={[2.05, 0.3, 0.04]} visible={false} />
    </group>
  );
};

// ── DIVERTER ────────────────────────────────────────────────────────────────

export const Diverter3D: React.FC<{ team: TeamId; lane: LaneId }> = ({ team, lane }) => {
  const l = laneOf(team, lane);
  const flap = useRef<THREE.Group>(null);
  const angle = useRef(0);
  const toTruck = headingTo(l.diverter, l.approvedExit);
  const toReject = headingTo(l.diverter, l.rejectExit);

  useFrame((_, dt) => {
    const ls = laneSim(team, lane);
    angle.current += (ls.diverter - angle.current) * (1 - Math.exp(-6 * dt));
    if (flap.current) {
      // Swing the guide arm between the two routes.
      let d = toReject - toTruck;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      flap.current.rotation.y = toTruck + d * angle.current;
    }
  });

  return (
    <group position={[l.diverter.x, 0, l.diverter.z]}>
      <mesh geometry={GEO.unitCyl} material={MAT.trim}
        position={[0, 0.7, 0]} scale={[0.5, 1.4, 0.5]} castShadow />
      <group ref={flap} position={[0, BELT_TOP + 0.3, 0]}>
        <mesh geometry={GEO.unitBox} material={MAT.guardOrange}
          position={[0, 0, -0.9]} scale={[0.1, 0.3, 1.8]} castShadow />
      </group>
    </group>
  );
};

// ── REJECT ZONE ─────────────────────────────────────────────────────────────
// A clean, clearly signed discard area (section 64). Rejected parcels land
// inside it and accumulate as a visible record of mistakes.

export const RejectZone3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  const r = s.reject;
  const sign = useMemo(() => new THREE.MeshBasicMaterial({
    map: makeSign('REJECTED PARCELS', 'ORDERS NOT DISPATCHED', '#ea7a1f'),
    toneMapped: false,
  }), []);
  const counter = useMemo(() => new LiveDisplay(256, 96), []);
  const counterMat = useMemo(() => new THREE.MeshBasicMaterial({ map: counter.texture, toneMapped: false }), [counter]);
  useEffect(() => () => counter.dispose(), [counter]);

  useFrame(() => {
    const n = sideSim(team).rejected.length;
    counter.drawSign(`${n}`, n === 1 ? 'PARCEL' : 'PARCELS', '#3b2a1a');
  });

  const heading = 0;
  return (
    <group position={[r.x, 0, r.z]} rotation={[0, heading, 0]}>
      {/* painted floor zone */}
      <mesh geometry={GEO.plane} material={MAT.guardOrange}
        rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} scale={[5.2, 4.2, 1]} />
      <mesh geometry={GEO.plane} material={MAT.concreteDark}
        rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} scale={[4.7, 3.7, 1]} receiveShadow />
      {/* low bin walls on three sides, open toward the chutes */}
      <mesh geometry={GEO.unitBox} material={MAT.steelDark}
        position={[0, 0.4, -1.95]} scale={[4.7, 0.8, 0.14]} castShadow />
      {[-2.35, 2.35].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={MAT.steelDark}
          position={[x, 0.4, 0]} scale={[0.14, 0.8, 3.9]} castShadow />
      ))}
      {/* hazard-striped barrier posts */}
      {[-2.4, 2.4].map((x) => (
        <group key={`p${x}`} position={[x, 0, 2.05]}>
          <mesh geometry={GEO.unitCylLow} material={MAT.guardYellow}
            position={[0, 0.55, 0]} scale={[0.18, 1.1, 0.18]} castShadow />
          <mesh geometry={GEO.unitCylLow} material={MAT.trim}
            position={[0, 0.8, 0]} scale={[0.19, 0.14, 0.19]} />
        </group>
      ))}
      {/* sign board and running count */}
      <group position={[0, 0, -2.2]}>
        {[-1.6, 1.6].map((x) => (
          <mesh key={x} geometry={GEO.unitBox} material={MAT.steel}
            position={[x, 1.3, 0]} scale={[0.1, 2.6, 0.1]} />
        ))}
        <mesh geometry={GEO.plane} material={sign} position={[0, 2.35, 0.06]} scale={[3.4, 1.06, 1]} />
        <mesh geometry={GEO.plane} material={counterMat} position={[0, 1.55, 0.06]} scale={[1.2, 0.45, 1]} />
      </group>
    </group>
  );
};

// ── DISPATCH READINESS SIGN ─────────────────────────────────────────────────

export const DispatchSign3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  const board = useMemo(() => new LiveDisplay(512, 180), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ map: board.texture, toneMapped: false }), [board]);
  useEffect(() => () => board.dispose(), [board]);

  useFrame(() => {
    const n = sideSim(team).cargo.length;
    const ready = n >= Math.round(TRUCK_CAPACITY * 0.8);
    board.drawSign(
      ready ? 'READY FOR DISPATCH' : `LOADING ${n} / ${TRUCK_CAPACITY}`,
      ready ? `${n} PARCELS ON BOARD` : n === 0 ? 'TRUCK EMPTY' : 'PARCELS ON BOARD',
      ready ? '#15803d' : team === 'blue' ? '#1e4fa8' : '#a8292a'
    );
  });

  const heading = headingTo(s.dispatchSign, { x: 0, y: 0, z: 70 });
  return (
    <group position={[s.dispatchSign.x, 0, s.dispatchSign.z]} rotation={[0, heading, 0]}>
      <mesh geometry={GEO.unitBox} material={MAT.steel} position={[0, 1.6, 0.1]} scale={[0.18, 3.2, 0.18]} />
      <mesh geometry={GEO.unitBox} material={MAT.trim} position={[0, 3.3, 0]} scale={[3.1, 1.2, 0.16]} castShadow />
      <mesh geometry={GEO.plane} material={mat} position={[0, 3.3, -0.09]}
        rotation={[0, Math.PI, 0]} scale={[2.9, 1.02, 1]} />
    </group>
  );
};

// ── CENTRAL HUB ─────────────────────────────────────────────────────────────

export const CentralHub3D: React.FC = () => {
  const rollers = useRef<THREE.InstancedMesh>(null);
  const arms = useRef<THREE.Group>(null);
  const lights = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const COUNT = 36;
  const board = useMemo(() => new THREE.MeshBasicMaterial({
    map: makeSign('CENTRAL SORTING HUB', 'BLUE DEPOT  ◀  ▶  RED DEPOT', '#1f2937', 1024, 220),
    toneMapped: false,
  }), []);

  useFrame(() => {
    const phase = sim.hubPhase;
    if (rollers.current) {
      for (let i = 0; i < COUNT; i++) {
        const row = i % 2;
        const col = Math.floor(i / 2);
        dummy.position.set(-HUB.crossBeltHalfWidth + 0.5 + col * 1.15, 2.05, HUB.crossBeltZ - 1.2 + row * 2.4);
        dummy.rotation.set(0, 0, Math.PI / 2);
        dummy.rotateY(phase * 6 + col);
        dummy.scale.set(0.18, 4.4, 0.18);
        dummy.updateMatrix();
        rollers.current.setMatrixAt(i, dummy.matrix);
      }
      rollers.current.instanceMatrix.needsUpdate = true;
    }
    if (arms.current) arms.current.children.forEach((a, i) => { a.rotation.z = Math.sin(phase * 1.4 + i * 1.1) * 0.35; });
    if (lights.current) lights.current.children.forEach((l, i) => {
      (l as THREE.Mesh).material = Math.sin(phase * 2.2 + i * 1.6) > 0.1 ? MAT.lampGreen : MAT.lampOff;
    });
  });

  return (
    <group position={[HUB.centre.x, 0, HUB.centre.z]}>
      <mesh geometry={GEO.unitBox} material={MAT.wallNeutral}
        position={[0, 3.0, 0]} scale={[HUB.machineSize.w, 6, HUB.machineSize.d]} castShadow receiveShadow />
      {/* roof: light grey with team-coloured edge bands, not a dark slab */}
      <mesh geometry={GEO.unitBox} material={MAT.roof}
        position={[0, 6.2, 0]} scale={[HUB.machineSize.w + 1.2, 0.6, HUB.machineSize.d + 1.2]} castShadow />
      <mesh geometry={GEO.unitBox} material={MAT.wallBlue}
        position={[-HUB.machineSize.w / 2 - 0.35, 5.6, 0]} scale={[0.5, 0.7, HUB.machineSize.d + 1.2]} />
      <mesh geometry={GEO.unitBox} material={MAT.wallRed}
        position={[HUB.machineSize.w / 2 + 0.35, 5.6, 0]} scale={[0.5, 0.7, HUB.machineSize.d + 1.2]} />
      {/* rooftop plant: extractor units and a skylight row */}
      {[-5, 0, 5].map((x) => (
        <mesh key={`vent${x}`} geometry={GEO.unitCyl} material={MAT.steel}
          position={[x, 7.1, -3]} scale={[1.6, 1.2, 1.6]} castShadow />
      ))}
      <mesh geometry={GEO.unitBox} material={MAT.glass}
        position={[0, 6.55, 3]} scale={[14, 0.12, 2.2]} />
      <mesh geometry={GEO.unitBox} material={MAT.guardYellow}
        position={[0, 0.35, 0]} scale={[HUB.machineSize.w + 0.6, 0.7, HUB.machineSize.d + 0.6]} />
      <mesh geometry={GEO.unitBox} material={MAT.steelDark}
        position={[0, 1.85, HUB.crossBeltZ - HUB.centre.z]} scale={[HUB.crossBeltHalfWidth * 2, 0.3, 5]} receiveShadow />
      <group position={[0, 0, -HUB.centre.z]}>
        <instancedMesh ref={rollers} args={[GEO.unitCylLow, MAT.roller, COUNT]} />
      </group>
      <group ref={arms} position={[0, 5.0, 0]}>
        {[-6, -2, 2, 6].map((x) => (
          <mesh key={x} geometry={GEO.unitBox} material={MAT.guardOrange}
            position={[x, 0, 6.8]} scale={[0.3, 2.2, 0.3]} castShadow />
        ))}
      </group>
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, HUB.boardHeight, -5.8]} scale={[17, 3.2, 0.5]} castShadow />
      <mesh geometry={GEO.plane} material={board}
        position={[0, HUB.boardHeight, -5.53]} scale={[16.4, 2.7, 1]} />
      <group ref={lights} position={[0, HUB.boardHeight + 2.0, -5.8]}>
        {[-6, -2, 2, 6].map((x) => (
          <mesh key={x} geometry={GEO.unitSphere} material={MAT.lampOff}
            position={[x, 0, 0]} scale={[0.32, 0.32, 0.32]} />
        ))}
      </group>
    </group>
  );
};

// ── DISPATCH GATE ───────────────────────────────────────────────────────────

export const DispatchGate3D: React.FC = () => {
  const barrier = useRef<THREE.Mesh>(null);
  const board = useMemo(() => new THREE.MeshBasicMaterial({
    map: makeSign('DISPATCH GATE', 'TO THE CITY', '#15803d', 1024, 200),
    toneMapped: false,
  }), []);

  useFrame(() => {
    if (barrier.current) barrier.current.rotation.z = sim.dispatchGate * 1.45;
  });

  return (
    <group position={[HUB.gate.x, 0, HUB.gate.z]}>
      {[-HUB.gateWidth / 2, HUB.gateWidth / 2].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={MAT.steel}
          position={[x, 3.2, 0]} scale={[0.8, 6.4, 0.8]} castShadow />
      ))}
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 6.8, 0]} scale={[HUB.gateWidth + 1.6, 1.3, 1.0]} castShadow />
      <mesh geometry={GEO.plane} material={board}
        position={[0, 6.8, 0.52]} scale={[HUB.gateWidth - 1, 1.1, 1]} />
      <group position={[HUB.gateWidth / 2 - 0.6, 1.4, 0]}>
        <mesh ref={barrier} geometry={GEO.unitBox} material={MAT.guardOrange}
          position={[-HUB.gateWidth / 2 + 0.6, 0, 0]} scale={[HUB.gateWidth - 1.2, 0.22, 0.22]} />
      </group>
    </group>
  );
};

