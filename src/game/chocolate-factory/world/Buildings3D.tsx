// ============================================================
// THE CHOCOLATE FACTORY — ARCHITECTURE AND ENVIRONMENT
//
// The shell the two production lines live inside: ingredient warehouses,
// the shared central atrium with the live scoreboard, the delivery road and
// the customer buildings the trucks actually drive to.
//
// Everything in here is static, so each group is baked into merged geometry
// and drawn in a handful of calls.
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CustomerType, TeamId } from '../types';
import { sim } from '../engine/factorySim';
import { ATRIUM, BOULEVARD_Z, CUSTOMER_ZONES, sideOf, sideSign } from '../engine/factoryLayout';
import { GEO, MAT, TEAM_HEX, teamMat } from './materials';
import { drawScoreboard, LiveDisplay, makeSign } from './canvasText';
import { mergeBoxes, mergeCylinders, type BoxPart } from './mergeGeo';

// ── GROUND, ROADS AND YARD ──────────────────────────────────────────────

export const Ground3D: React.FC = () => {
  const markings = useMemo(() => {
    const parts: BoxPart[] = [];
    // Centre line down the delivery boulevard.
    for (let x = -60; x < 60; x += 4) parts.push({ x, y: 0.02, z: BOULEVARD_Z, sx: 2.2, sy: 0.02, sz: 0.4 });
    // Bay markings at each loading dock.
    for (const sgn of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        parts.push({ x: sgn * (12 + i * 3.6), y: 0.02, z: 35.5, sx: 0.28, sy: 0.02, sz: 6 });
      }
    }
    // Walkway edging down the middle of the plant.
    for (let z = -20; z < 30; z += 3) {
      parts.push({ x: -7.6, y: 0.02, z, sx: 0.22, sy: 0.02, sz: 1.8 });
      parts.push({ x: 7.6, y: 0.02, z, sx: 0.22, sy: 0.02, sz: 1.8 });
    }
    return mergeBoxes(parts);
  }, []);

  return (
    <group>
      {/* factory floor slab */}
      <mesh geometry={GEO.box} material={MAT.floor} position={[0, -0.1, 0]} scale={[84, 0.2, 82]} receiveShadow />
      {/* grass surround */}
      <mesh geometry={GEO.box} material={MAT.grass} position={[0, -0.2, 20]} scale={[240, 0.2, 260]} receiveShadow />
      {/* delivery boulevard across the front of both factories */}
      <mesh geometry={GEO.box} material={MAT.road} position={[0, 0.0, BOULEVARD_Z]} scale={[132, 0.16, 12]} receiveShadow />
      {/* the two dock approach roads feeding onto it */}
      {[-11, 11].map((x) => (
        <mesh key={x} geometry={GEO.box} material={MAT.road} position={[x, 0.0, 39]} scale={[9, 0.16, 12]} receiveShadow />
      ))}
      <mesh geometry={markings} material={MAT.roadLine} />
    </group>
  );
};

// ── TEAM INGREDIENT WAREHOUSE ───────────────────────────────────────────

export const Warehouse3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  const sign = sideSign(team);
  const w = s.warehouseSize;
  const signTex = useMemo(
    () => makeSign(team === 'blue' ? 'BLUE CHOCOLATE WORKS' : 'RED CHOCOLATE WORKS', 'INGREDIENT STORE', TEAM_HEX[team]),
    [team]
  );

  const shell = useMemo(() => mergeBoxes([
    // walls
    { x: 0, y: w.h / 2, z: -w.d / 2, sx: w.w, sy: w.h, sz: 0.6 },
    { x: -w.w / 2, y: w.h / 2, z: 0, sx: 0.6, sy: w.h, sz: w.d },
    { x: w.w / 2, y: w.h / 2, z: 0, sx: 0.6, sy: w.h, sz: w.d },
    // front wall with a wide doorway: two piers and a header
    { x: -w.w / 2 + 3, y: w.h / 2, z: w.d / 2, sx: 6, sy: w.h, sz: 0.6 },
    { x: w.w / 2 - 3, y: w.h / 2, z: w.d / 2, sx: 6, sy: w.h, sz: 0.6 },
    { x: 0, y: w.h - 1.6, z: w.d / 2, sx: w.w, sy: 3.2, sz: 0.6 },
  ]), [w]);

  const barrels = useMemo(() => mergeCylinders(
    Array.from({ length: 8 }, (_, i) => ({
      x: -4 + (i % 4) * 2.6, y: 0.75, z: -2 + Math.floor(i / 4) * 2.4, sx: 1.5, sy: 1.5, sz: 1.5,
    }))
  ), []);

  return (
    <group position={[s.warehouse.x, 0, s.warehouse.z]}>
      <mesh geometry={shell} material={MAT.wall} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={MAT.roof} position={[0, w.h + 0.4, 0]} scale={[w.w + 1.6, 0.8, w.d + 1.6]} castShadow />
      <mesh geometry={GEO.box} material={teamMat(team)} position={[0, w.h - 3.4, w.d / 2 + 0.05]} scale={[w.w, 0.5, 0.7]} />
      {/* signage */}
      <mesh position={[0, w.h - 5.6, w.d / 2 + 0.4]}>
        <planeGeometry args={[14, 4.4]} />
        <meshBasicMaterial map={signTex} />
      </mesh>
      {/* cocoa silos alongside */}
      {[0, 1].map((i) => (
        <group key={i} position={[sign * (w.w / 2 + 3.4), 0, -3 + i * 6]}>
          <mesh geometry={GEO.cyl} material={MAT.steelLight} position={[0, 5, 0]} scale={[4.4, 10, 4.4]} castShadow />
          <mesh geometry={GEO.cone} material={MAT.steel} position={[0, 10.8, 0]} scale={[4.6, 1.8, 4.6]} castShadow />
          <mesh geometry={GEO.cyl} material={teamMat(team)} position={[0, 7.4, 0]} scale={[4.5, 0.7, 4.5]} />
        </group>
      ))}
      {/* stored ingredients inside the doorway */}
      <mesh geometry={barrels} material={MAT.copper} position={[0, 0, 2]} castShadow />
    </group>
  );
};

/** Pallets of cocoa, sugar and milk powder waiting for the forklift. */
export const IngredientPallets3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const p = sideOf(team).palletStack;
  const stacks = useMemo(() => {
    const wood: BoxPart[] = [];
    const sacks: BoxPart[] = [];
    for (let i = 0; i < 4; i++) {
      const x = (i % 2) * 2.6;
      const z = Math.floor(i / 2) * 2.6;
      wood.push({ x, y: 0.12, z, sx: 2.2, sy: 0.24, sz: 2.2 });
      for (let j = 0; j < 4; j++) {
        sacks.push({
          x: x - 0.5 + (j % 2) * 1.0, y: 0.58, z: z - 0.5 + Math.floor(j / 2) * 1.0,
          sx: 0.92, sy: 0.64, sz: 0.92,
        });
      }
    }
    return { wood: mergeBoxes(wood), sacks: mergeBoxes(sacks) };
  }, []);

  return (
    <group position={[p.x, 0, p.z]}>
      <mesh geometry={stacks.wood} material={MAT.wood} castShadow receiveShadow />
      <mesh geometry={stacks.sacks} material={MAT.boxCard} castShadow />
      {/* a couple of open cocoa bins */}
      {[0, 1].map((i) => (
        <mesh key={i} geometry={GEO.cyl} material={MAT.woodDark}
          position={[-2.6, 0.7, i * 2.4]} scale={[1.5, 1.4, 1.5]} castShadow />
      ))}
    </group>
  );
};

// ── SHARED CENTRAL ATRIUM + LIVE SCOREBOARD ─────────────────────────────

export const CentralAtrium3D: React.FC = () => {
  const board = useMemo(() => new LiveDisplay(1024, 448), []);
  const nameTex = useMemo(() => makeSign('THE CHOCOLATE FACTORY', 'GRADE 6 · FRACTIONS', '#5b2d12', '#f8e3c0', 768, 192), []);
  const t = ATRIUM.towerSize;

  useFrame(() => {
    const b = sim.blue;
    const r = sim.red;
    const key = `${b.ordersCompleted}-${b.quality}-${b.deliveries}-${r.ordersCompleted}-${r.quality}-${r.deliveries}`;
    board.update(key, (ctx, w, h) => drawScoreboard(ctx, w, h,
      { orders: b.ordersCompleted, quality: b.quality, deliveries: b.deliveries },
      { orders: r.ordersCompleted, quality: r.quality, deliveries: r.deliveries }));
  });

  return (
    <group position={[ATRIUM.centre.x, 0, ATRIUM.centre.z]}>
      {/* tower */}
      <mesh geometry={GEO.box} material={MAT.wall} position={[0, t.h / 2, 0]} scale={[t.w, t.h, t.d]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={MAT.wallTrim} position={[0, t.h + 0.5, 0]} scale={[t.w + 1.4, 1, t.d + 1.4]} castShadow />
      {/* observation glazing */}
      {[-1, 1].map((sgn) => (
        <mesh key={sgn} geometry={GEO.box} material={MAT.glass} position={[sgn * (t.w / 2 + 0.05), 9, 0]} scale={[0.2, 7, t.d - 2.5]} />
      ))}
      <mesh geometry={GEO.box} material={MAT.glass} position={[0, 9, t.d / 2 + 0.05]} scale={[t.w - 2.5, 7, 0.2]} />
      {/* copper pipework, kept round the SIDES so the scoreboard stays clear */}
      {[-1, 1].map((sgn) => (
        <mesh key={sgn} geometry={GEO.cyl} material={MAT.copper}
          position={[sgn * (t.w / 2 + 0.45), 8, -1]} scale={[0.5, 16, 0.5]} />
      ))}
      {/* factory name over the entrance */}
      <mesh position={[0, 4.4, t.d / 2 + 0.35]}>
        <planeGeometry args={[11.5, 2.9]} />
        <meshBasicMaterial map={nameTex} />
      </mesh>
      {/* live scoreboard, facing the players */}
      <group position={[0, 17.5, t.d / 2 + 0.6]}>
        <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0, -0.2]} scale={[17, 7.6, 0.5]} castShadow />
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[16, 7]} />
          <meshBasicMaterial map={board.texture} />
        </mesh>
      </group>
      {/* chimney stacks, set behind the tower and out of the scoreboard's way */}
      {[-6.2, 6.2].map((x) => (
        <mesh key={x} geometry={GEO.cyl} material={MAT.brickWarm} position={[x, t.h + 2, -5.5]} scale={[2.0, 4, 2.0]} castShadow />
      ))}
    </group>
  );
};

/**
 * The shared heart of the plant: conching vessels and the chocolate mains
 * that run out to BOTH teams' measuring tanks. It fills the middle of the
 * shot and ties the two lines together into one factory.
 */
export const CentralProcessing3D: React.FC = () => {
  const stirrers = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!stirrers.current) return;
    const busy = sim.blue.phase === 'running' || sim.red.phase === 'running';
    stirrers.current.children.forEach((c, i) => {
      c.rotation.y += delta * (busy ? 1.1 : 0.25) * (i % 2 ? 1 : -1);
    });
  });

  return (
    <group position={[0, 0, -3]}>
      <mesh geometry={GEO.box} material={MAT.wallTrim} position={[0, 0.3, 0]} scale={[13, 0.6, 24]} receiveShadow />
      {[-8, 0, 8].map((z, i) => (
        <group key={z} position={[0, 0, z]}>
          <mesh geometry={GEO.cyl} material={MAT.steelLight} position={[0, 2.5, 0]} scale={[4.4, 4.2, 4.4]} castShadow receiveShadow />
          <mesh geometry={GEO.cyl} material={MAT.copper} position={[0, 4.5, 0]} scale={[4.6, 0.45, 4.6]} />
          <mesh geometry={GEO.cyl} material={MAT.steel} position={[0, 0.7, 0]} scale={[5.0, 0.5, 5.0]} />
          <mesh geometry={GEO.cone} material={MAT.steelLight} position={[0, 5.2, 0]} scale={[2.9, 1.1, 2.9]} castShadow />
          <mesh geometry={GEO.box} material={MAT.glass} position={[0, 2.7, 2.25]} scale={[2.0, 2.0, 0.16]} />
          <mesh geometry={GEO.box} material={MAT.chocolate} position={[0, 2.1, 2.14]} scale={[1.8, 1.0, 0.12]} />
          {i === 1 && <mesh geometry={GEO.box} material={MAT.screen} position={[0, 4.1, 2.3]} scale={[2.4, 0.8, 0.12]} />}
        </group>
      ))}
      <group ref={stirrers}>
        {[-8, 0, 8].map((z) => (
          <group key={z} position={[0, 6.1, z]}>
            <mesh geometry={GEO.box} material={MAT.steelDark} scale={[2.2, 0.4, 0.4]} castShadow />
            <mesh geometry={GEO.box} material={MAT.steelDark} scale={[0.4, 0.4, 2.2]} />
          </group>
        ))}
      </group>
      {[-1, 1].map((sgn) => (
        <group key={sgn}>
          <mesh geometry={GEO.cyl} material={MAT.copper} position={[sgn * 9, 5.2, -8]} rotation={[0, 0, Math.PI / 2]} scale={[0.42, 9, 0.42]} castShadow />
          <mesh geometry={GEO.cyl} material={MAT.copper} position={[sgn * 9, 4.6, 4]} rotation={[0, 0, Math.PI / 2]} scale={[0.34, 9, 0.34]} />
          {[-8, 4].map((z, i) => (
            <mesh key={i} geometry={GEO.box} material={MAT.steel} position={[sgn * 12.5, 2.4, z]} scale={[0.3, 4.8, 0.3]} />
          ))}
        </group>
      ))}
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 4.4, 13.4]} scale={[11, 0.16, 2.0]} castShadow />
      {[-5, 5].map((x) => (
        <mesh key={x} geometry={GEO.cyl} material={MAT.steel} position={[x, 2.2, 13.4]} scale={[0.22, 4.4, 0.22]} />
      ))}
    </group>
  );
};

// ── CUSTOMER BUILDINGS ──────────────────────────────────────────────────

const CUSTOMER_STYLE: Record<CustomerType, { bg: string; body: string; roof: string; w: number; h: number; d: number }> = {
  school: { bg: '#b45309', body: '#e7c9a2', roof: '#a1553a', w: 14, h: 7, d: 9 },
  cafe: { bg: '#7c3f12', body: '#f0dcc0', roof: '#8a5a33', w: 9, h: 5.5, d: 8 },
  hotel: { bg: '#1e3a8a', body: '#eef2f7', roof: '#94a3b8', w: 11, h: 12, d: 9 },
  supermarket: { bg: '#15803d', body: '#e8f0e4', roof: '#7f9a86', w: 16, h: 6.5, d: 10 },
  shop: { bg: '#9d174d', body: '#f7e3ec', roof: '#b06a86', w: 8, h: 5, d: 7 },
  festival: { bg: '#b91c1c', body: '#fde68a', roof: '#dc2626', w: 14, h: 8, d: 12 },
};

export const CustomerBuilding3D: React.FC<{ type: CustomerType }> = ({ type }) => {
  const zone = CUSTOMER_ZONES[type];
  const st = CUSTOMER_STYLE[type];
  const signTex = useMemo(() => makeSign(zone.label, '', st.bg), [zone.label, st.bg]);
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: st.body, roughness: 0.8 }), [st.body]);
  const roofMat = useMemo(() => new THREE.MeshStandardMaterial({ color: st.roof, roughness: 0.75 }), [st.roof]);

  // A happy customer lights up briefly when a delivery lands.
  const glow = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!glow.current) return;
    const lit = (['blue', 'red'] as TeamId[]).some((t) => {
      const s = sim[t];
      return s.reaction !== null && s.truck.customer === type;
    });
    glow.current.material = lit ? MAT.lampGreen : MAT.lampOff;
  });

  return (
    <group position={[zone.pos.x, 0, zone.pos.z]}>
      {type === 'festival' ? (
        <>
          {/* a marquee rather than a building */}
          <mesh geometry={GEO.cone} material={roofMat} position={[0, st.h * 0.75, 0]} scale={[st.w, st.h, st.d]} castShadow />
          <mesh geometry={GEO.cyl} material={MAT.wood} position={[0, st.h * 0.4, 0]} scale={[0.5, st.h * 0.8, 0.5]} />
        </>
      ) : (
        <>
          <mesh geometry={GEO.box} material={bodyMat} position={[0, st.h / 2, 0]} scale={[st.w, st.h, st.d]} castShadow receiveShadow />
          <mesh geometry={GEO.box} material={roofMat} position={[0, st.h + 0.4, 0]} scale={[st.w + 1.2, 0.8, st.d + 1.2]} castShadow />
          {/* windows */}
          {Array.from({ length: Math.max(2, Math.round(st.w / 4)) }, (_, i) => (
            <mesh key={i} geometry={GEO.box} material={MAT.glass}
              position={[-st.w / 2 + 2 + i * 3.6, st.h * 0.55, -st.d / 2 - 0.06]} scale={[2.2, 1.8, 0.14]} />
          ))}
          {/* door facing the road */}
          <mesh geometry={GEO.box} material={MAT.woodDark} position={[0, 1.5, -st.d / 2 - 0.08]} scale={[2.2, 3, 0.16]} />
          {/* awning */}
          <mesh geometry={GEO.box} material={MAT.awning} position={[0, 3.4, -st.d / 2 - 0.8]} scale={[st.w * 0.55, 0.22, 1.6]} castShadow />
        </>
      )}
      {/* sign facing the approaching trucks */}
      <mesh position={[0, st.h * 0.82, -st.d / 2 - 0.5]}>
        <planeGeometry args={[Math.min(st.w * 0.8, 8), 2.2]} />
        <meshBasicMaterial map={signTex} />
      </mesh>
      <mesh ref={glow} geometry={GEO.sphereLow} material={MAT.lampOff} position={[0, st.h + 1.2, -st.d / 2]} scale={[0.5, 0.5, 0.5]} />
      {/* small delivery apron */}
      <mesh geometry={GEO.box} material={MAT.road} position={[0, 0.01, -st.d / 2 - 4]} scale={[st.w * 0.9, 0.12, 6]} receiveShadow />
    </group>
  );
};

export const CustomerRow3D: React.FC = () => (
  <group>
    {(Object.keys(CUSTOMER_ZONES) as CustomerType[]).map((t) => (
      <CustomerBuilding3D key={t} type={t} />
    ))}
  </group>
);

// ── LOADING DOCK + YARD DETAIL ──────────────────────────────────────────

export const LoadingDock3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  const sign = sideSign(team);
  const signTex = useMemo(
    () => makeSign(team === 'blue' ? 'BLUE DISPATCH' : 'RED DISPATCH', 'LOADING DOCK', TEAM_HEX[team]),
    [team]
  );
  return (
    <group position={[s.loadingDock.x, 0, s.loadingDock.z]}>
      {/* dock platform */}
      <mesh geometry={GEO.box} material={MAT.wallTrim} position={[sign * -3.2, 0.6, 0]} scale={[6, 1.2, 8]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={teamMat(team)} position={[sign * -3.2, 1.24, 0]} scale={[6.1, 0.12, 8.1]} />
      {/* canopy */}
      <mesh geometry={GEO.box} material={MAT.roof} position={[sign * -3.2, 5.2, 0]} scale={[7.5, 0.4, 9]} castShadow />
      {[-3.6, 3.6].map((z) => (
        <mesh key={z} geometry={GEO.box} material={MAT.steel} position={[sign * -0.4, 3, z]} scale={[0.3, 4.4, 0.3]} />
      ))}
      <mesh position={[sign * -3.2, 5.9, 0]} rotation={[0, sign * Math.PI / 2, 0]}>
        <planeGeometry args={[7, 1.9]} />
        <meshBasicMaterial map={signTex} />
      </mesh>
      {/* safety bollards */}
      {[-3, 3].map((z) => (
        <mesh key={z} geometry={GEO.cylLow} material={MAT.guard} position={[sign * 0.6, 0.55, z]} scale={[0.35, 1.1, 0.35]} castShadow />
      ))}
    </group>
  );
};

// ── SKYLINE / PERIMETER DRESSING ────────────────────────────────────────

export const Surroundings3D: React.FC = () => {
  const trees = useMemo(() => {
    const trunks: BoxPart[] = [];
    const crowns: BoxPart[] = [];
    let seed = 7;
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    for (let i = 0; i < 44; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (48 + rnd() * 46);
      const z = -40 + rnd() * 140;
      trunks.push({ x, y: 1.4, z, sx: 0.7, sy: 2.8, sz: 0.7 });
      crowns.push({ x, y: 4.2, z, sx: 4.4 + rnd() * 1.6, sy: 4.4, sz: 4.4 + rnd() * 1.6 });
    }
    return { trunks: mergeBoxes(trunks), crowns: mergeBoxes(crowns) };
  }, []);

  const fence = useMemo(() => mergeBoxes(
    Array.from({ length: 60 }, (_, i) => ({ x: -58 + i * 2, y: 0.9, z: -44, sx: 0.16, sy: 1.8, sz: 0.16 }))
  ), []);

  return (
    <group>
      <mesh geometry={trees.trunks} material={MAT.woodDark} />
      <mesh geometry={trees.crowns} material={MAT.grass} castShadow />
      <mesh geometry={fence} material={MAT.steelDark} />
      {/* distant town silhouette behind the customers */}
      {[-40, -18, 16, 42].map((x, i) => (
        <mesh key={i} geometry={GEO.box} material={MAT.wallTrim}
          position={[x, 7 + (i % 2) * 4, 110]} scale={[16, 14 + (i % 2) * 8, 12]} />
      ))}
    </group>
  );
};
