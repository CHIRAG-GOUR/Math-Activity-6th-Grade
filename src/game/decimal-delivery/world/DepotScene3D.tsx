// ============================================================
// THE DECIMAL DELIVERY NETWORK — SCENE, ENVIRONMENT & CAMERAS
//
// One canvas, one scene, one simulation step per frame, rendered through up
// to three cameras:
//
//   MAIN     the whole facility — intro fly-through, round cards, the live
//            overview during play, the results, and the dispatch chase
//   BLUE     Blue's own station window: follows Blue's current parcel from
//            the belt, onto the scale, and on to the truck or the reject bin
//   RED      the same for Red
//
// The two station cameras are independent (section 92): Blue zooming in on a
// parcel never moves Red's view, and neither ever takes over the main camera.
// All three render the SAME scene, so what each window shows is exactly where
// things physically are (section 111).
// ============================================================

'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { MAT, GEO } from './DepotMaterials';
import { Conveyor3D, WeighStation3D, Scanner3D, Diverter3D, RejectZone3D, DispatchSign3D, CentralHub3D, DispatchGate3D } from './Machines3D';
import { PlayerCharacter3D, CrewMember3D, IntakeWorker3D } from './People3D';
import { Truck3D, Forklift3D } from './Vehicles3D';
import { TeamParcels3D } from './Parcels3D';
import { makeSign } from './canvasText';
import { mergeBoxes, mergeCylinders, mergeCones, type BoxPart } from './mergeGeo';
import { stepSim, sim, focusParcel, sideSim } from '../engine/depotSim';
import {
  sideOf, sideSign, LANES, HUB, DEPOT, CAMERAS, OPERATING_SHOT,
  stationShot, followShot, type Shot, type Vec3,
} from '../engine/depotLayout';
import { useDepotStore } from '../store/depotStore';
import { screenLayout } from '../ui/stationWindows';
import type { TeamId } from '../types';

// ── SKY & LIGHT ─────────────────────────────────────────────────────────────

const HORIZON = '#cfe6f5';
const ZENITH = '#4f9fd8';

const SkyDome: React.FC = () => {
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { topColor: { value: new THREE.Color(ZENITH) }, bottomColor: { value: new THREE.Color(HORIZON) } },
    vertexShader: 'varying vec3 vW; void main(){ vW=(modelMatrix*vec4(position,1.0)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'uniform vec3 topColor; uniform vec3 bottomColor; varying vec3 vW; void main(){ float h=clamp(normalize(vW).y*1.5+0.18,0.0,1.0); gl_FragColor=vec4(mix(bottomColor,topColor,pow(h,0.7)),1.0);}',
  }), []);
  return (
    <mesh material={material} renderOrder={-1000} frustumCulled={false}>
      <sphereGeometry args={[900, 24, 16]} />
    </mesh>
  );
};

const Lighting: React.FC = () => {
  const { scene, gl } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    scene.background = new THREE.Color(HORIZON);
    scene.fog = new THREE.Fog(HORIZON, 190, 760);
    // Shadow maps are refreshed once per frame by the render director, not
    // once per camera — three passes of shadows would be wasted work.
    gl.shadowMap.autoUpdate = false;
  }, [scene, gl]);

  useEffect(() => {
    const l = sun.current;
    if (!l) return;
    l.shadow.camera.left = -80;
    l.shadow.camera.right = 80;
    l.shadow.camera.top = 70;
    l.shadow.camera.bottom = -70;
    l.shadow.camera.near = 10;
    l.shadow.camera.far = 320;
    l.shadow.bias = -0.0006;
    l.shadow.camera.updateProjectionMatrix();
  }, []);

  return (
    <>
      <ambientLight intensity={0.52} color="#eef6ff" />
      <hemisphereLight args={['#cfe8fb', '#71835a', 0.5]} />
      <directionalLight ref={sun} position={[60, 95, 70]} intensity={1.85} color="#fff3da"
        castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-60, 45, -50]} intensity={0.32} color="#d4e4ff" />
    </>
  );
};

// ── GROUND, ROADS & MARKINGS ────────────────────────────────────────────────

/** Road centre-line dashes, baked into a single mesh. */
const RoadMarkings: React.FC = () => {
  const geo = useMemo(() => {
    const parts: BoxPart[] = [];
    for (let i = 0; i < 18; i++) parts.push({ x: 0, y: 0.02, z: 40 + i * 5, sx: 0.35, sy: 0.01, sz: 2.2 });
    for (let i = 0; i < 18; i++) parts.push({ x: -42 + i * 5, y: 0.02, z: 33, sx: 2.2, sy: 0.01, sz: 0.3 });
    return mergeBoxes(parts);
  }, []);
  return <mesh geometry={geo} material={MAT.lineWhite} />;
};

const Ground: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}
      geometry={GEO.plane} material={MAT.grass} scale={[DEPOT.groundSize, DEPOT.groundSize, 1]} receiveShadow />
    {/* concrete yard under the working facility */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}
      geometry={GEO.plane} material={MAT.concrete} scale={[132, 78, 1]} receiveShadow />
    {/* depot road across the front and the dispatch road out through the gate */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 33]}
      geometry={GEO.plane} material={MAT.asphalt} scale={[96, 10, 1]} receiveShadow />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 80]}
      geometry={GEO.plane} material={MAT.asphalt} scale={[16, 94, 1]} receiveShadow />
    <RoadMarkings />
    {/* loading bays under each truck */}
    {(['blue', 'red'] as TeamId[]).map((team) => {
      const s = sideOf(team);
      return (
        <group key={team}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[s.truck.x - sideSign(team) * 0.5, 0.015, s.truck.z]}
            geometry={GEO.plane} material={MAT.lineYellow} scale={[10.5, 4.2, 1]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[s.truck.x - sideSign(team) * 0.5, 0.018, s.truck.z]}
            geometry={GEO.plane} material={MAT.asphalt} scale={[10, 3.7, 1]} />
        </group>
      );
    })}
  </group>
);

// ── WAREHOUSE & INTAKE ──────────────────────────────────────────────────────

const Warehouse: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  const { w, h, d } = s.warehouseSize;
  const isBlue = team === 'blue';
  const wall = isBlue ? MAT.wallBlue : MAT.wallRed;
  const brand = useMemo(() => new THREE.MeshBasicMaterial({
    map: makeSign(isBlue ? 'BLUE LOGISTICS' : 'RED LOGISTICS', 'PARCEL DEPOT', isBlue ? '#1e4fa8' : '#a8292a', 1024, 220),
    toneMapped: false,
  }), [isBlue]);

  return (
    <group position={[s.warehouse.x, 0, s.warehouse.z]}>
      <mesh geometry={GEO.unitBox} material={MAT.wallNeutral}
        position={[0, h / 2, 0]} scale={[w, h, d]} castShadow receiveShadow />
      <mesh geometry={GEO.unitBox} material={wall}
        position={[0, h - 2.1, 0]} scale={[w + 0.15, 2.3, d + 0.15]} />
      <mesh geometry={GEO.unitBox} material={MAT.roof}
        position={[0, h + 0.4, 0]} scale={[w + 1.6, 0.8, d + 1.6]} castShadow />
      <mesh geometry={GEO.plane} material={brand}
        position={[0, h - 2.1, d / 2 + 0.1]} scale={[w * 0.7, 2.0, 1]} />
      {/* dock doors; the middle one stands open for the intake crew */}
      {[-10, 0, 10].map((x) => {
        const open = x === 0;
        return (
          <group key={x} position={[x, 0, d / 2 + 0.05]}>
            <mesh geometry={GEO.unitBox} material={MAT.trim}
              position={[0, 3.1, 0]} scale={[6.2, 6.2, 0.3]} />
            <mesh geometry={GEO.unitBox} material={open ? MAT.concreteDark : MAT.steelDark}
              position={[0, open ? 5.3 : 2.9, 0.18]} scale={[5.4, open ? 1.2 : 5.3, 0.16]} />
            {!open && Array.from({ length: 6 }, (_, i) => (
              <mesh key={i} geometry={GEO.unitBox} material={MAT.steel}
                position={[0, 0.8 + i * 0.85, 0.28]} scale={[5.3, 0.1, 0.05]} />
            ))}
          </group>
        );
      })}
      {[-12, 12].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={MAT.glass}
          position={[x, h - 4.4, d / 2 + 0.12]} scale={[4.2, 1.5, 0.1]} />
      ))}
    </group>
  );
};

const IntakeYard: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  return (
    <group>
      {/* pallet the intake parcels wait on */}
      <mesh geometry={GEO.unitBox} material={MAT.cardboardDark}
        position={[s.intakePile.x, 0.15, s.intakePile.z]} scale={[3.4, 0.3, 1.5]} castShadow receiveShadow />
      {/* pallet rack for heavy parcels */}
      <group position={[s.heavyPickup.x, 0, s.heavyPickup.z]}>
        <mesh geometry={GEO.unitBox} material={MAT.cardboardDark}
          position={[0, 0.27, 0]} scale={[1.8, 0.14, 1.6]} castShadow />
        {[-1, 1].map((x) => (
          <mesh key={x} geometry={GEO.unitBox} material={MAT.guardOrange}
            position={[x, 1.6, -0.6]} scale={[0.12, 3.2, 0.12]} castShadow />
        ))}
        <mesh geometry={GEO.unitBox} material={MAT.guardOrange}
          position={[0, 3.1, -0.6]} scale={[2.1, 0.14, 0.14]} />
      </group>
      {/* forklift lane markings along the service road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(s.nav.westGate.x + s.nav.southRoadEast.x) / 2, 0.015, s.nav.westGate.z]}
        geometry={GEO.plane} material={MAT.lineYellow} scale={[Math.abs(s.nav.westGate.x - s.nav.southRoadEast.x), 0.25, 1]} />
      {/* shipping containers */}
      {[0, 1].map((i) => (
        <mesh key={i} geometry={GEO.unitBox}
          material={i === 0 ? (team === 'blue' ? MAT.wallBlue : MAT.wallRed) : MAT.guardOrange}
          position={[s.warehouse.x + sideSign(team) * 22, 1.6, s.warehouse.z + 6 + i * 3.4]}
          scale={[3.0, 3.2, 11]} castShadow receiveShadow />
      ))}
    </group>
  );
};

// ── BACKDROP ────────────────────────────────────────────────────────────────

function hash(i: number, k: number) {
  const x = Math.sin(i * k) * 43758.5453;
  return x - Math.floor(x);
}

const Backdrop: React.FC = () => {
  const towers = useMemo(() => Array.from({ length: 50 }, (_, i) => {
    const a = (i / 50) * Math.PI * 1.4 - Math.PI * 0.2;
    const dist = 220 + hash(i, 127.1) * 120;
    return {
      x: Math.cos(a) * dist, z: -Math.abs(Math.sin(a)) * dist - 50,
      h: 18 + hash(i, 311.7) * 60, w: 10 + hash(i, 74.3) * 12, m: i % 3,
    };
  }), []);
  const cityMats = useMemo(() => ['#b9c6d4', '#a6b4c4', '#c8d3de'].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 })), []);
  const trees = useMemo(() => Array.from({ length: 46 }, (_, i) => {
    const a = (i / 46) * Math.PI * 2;
    const dist = 96 + hash(i, 78.23) * 40;
    return { x: Math.cos(a) * dist, z: Math.sin(a) * dist + 8, s: 0.8 + hash(i, 12.9) * 0.5 };
  }).filter((t) => !(Math.abs(t.x) < 12 && t.z > 30)), []);

  // A few birds circling over the city side, purely ambient.
  const birds = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!birds.current) return;
    birds.current.children.forEach((b, i) => {
      const t = sim.elapsed * (0.12 + i * 0.01) + i;
      b.position.set(Math.cos(t) * (60 + i * 6), 38 + Math.sin(t * 2) * 3, -40 + Math.sin(t) * 30);
      b.rotation.y = -t;
      b.scale.y = 0.5 + Math.abs(Math.sin(sim.elapsed * 9 + i)) * 0.8;
    });
  });

  const baked = useMemo(() => {
    const byMat: BoxPart[][] = [[], [], []];
    towers.forEach((t) => byMat[t.m].push({ x: t.x, y: t.h / 2, z: t.z, sx: t.w, sy: t.h, sz: t.w }));
    const trunks: BoxPart[] = [];
    const crowns: BoxPart[] = [];
    trees.forEach((t) => {
      trunks.push({ x: t.x, y: 1.4 * t.s, z: t.z, sx: 0.5 * t.s, sy: 2.8 * t.s, sz: 0.5 * t.s });
      crowns.push({ x: t.x, y: 4.6 * t.s, z: t.z, sx: 5.2 * t.s, sy: 7.5 * t.s, sz: 5.2 * t.s });
    });
    const masts: BoxPart[] = [];
    const heads: BoxPart[] = [];
    [-52, -30, 30, 52].forEach((x) => {
      masts.push({ x, y: 6, z: 38, sx: 0.4, sy: 12, sz: 0.4 });
      heads.push({ x, y: 12.2, z: 37.2, sx: 2.2, sy: 0.4, sz: 1.4 });
    });
    return {
      city: byMat.map((parts) => mergeBoxes(parts)),
      trunks: mergeCylinders(trunks),
      crowns: mergeCones(crowns),
      masts: mergeCylinders(masts),
      heads: mergeBoxes(heads),
    };
  }, [towers, trees]);

  return (
    <group>
      {baked.city.map((g, i) => <mesh key={i} geometry={g} material={cityMats[i]} />)}
      <mesh geometry={baked.trunks} material={MAT.trim} />
      <mesh geometry={baked.crowns} material={MAT.grass} castShadow />
      <mesh geometry={baked.masts} material={MAT.steel} castShadow />
      <mesh geometry={baked.heads} material={MAT.trim} />
      <group ref={birds}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} geometry={GEO.unitBox} material={MAT.trim} scale={[1.1, 0.5, 0.25]} />
        ))}
      </group>
    </group>
  );
};

// ── A TEAM'S HALF OF THE DEPOT ──────────────────────────────────────────────

const TeamDepot: React.FC<{ team: TeamId }> = ({ team }) => (
  <group>
    <Warehouse team={team} />
    <IntakeYard team={team} />
    {LANES.map((lane) => (
      <group key={lane}>
        <Conveyor3D team={team} lane={lane} />
        <WeighStation3D team={team} lane={lane} />
        <Scanner3D team={team} lane={lane} />
        <Diverter3D team={team} lane={lane} />
      </group>
    ))}
    <RejectZone3D team={team} />
    <DispatchSign3D team={team} />
    <Truck3D team={team} />
    <Forklift3D team={team} role="yard" />
    <Forklift3D team={team} role="dispatch" />
    <CrewMember3D team={team} index={0} />
    <CrewMember3D team={team} index={1} />
    <IntakeWorker3D team={team} index={0} />
    <IntakeWorker3D team={team} index={1} />
    <PlayerCharacter3D team={team} />
    <TeamParcels3D team={team} />
  </group>
);

// ── RENDER DIRECTOR ─────────────────────────────────────────────────────────

interface CamState { pos: THREE.Vector3; look: THREE.Vector3; ready: boolean }

function damp(state: CamState, shot: Shot, rate: number, dt: number) {
  const k = 1 - Math.exp(-rate * dt);
  if (!state.ready) {
    state.pos.set(shot.pos.x, shot.pos.y, shot.pos.z);
    state.look.set(shot.look.x, shot.look.y, shot.look.z);
    state.ready = true;
    return;
  }
  state.pos.x += (shot.pos.x - state.pos.x) * k;
  state.pos.y += (shot.pos.y - state.pos.y) * k;
  state.pos.z += (shot.pos.z - state.pos.z) * k;
  state.look.x += (shot.look.x - state.look.x) * k;
  state.look.y += (shot.look.y - state.look.y) * k;
  state.look.z += (shot.look.z - state.look.z) * k;
}

/** Which shot a team's station window should hold right now. */
function stationTarget(team: TeamId): Shot {
  const f = focusParcel(team);
  if (!f) {
    const s = sideOf(team);
    return stationShot(team, s.lanes.A.station, 'A');
  }
  const moving = f.parcel.stage === 'carried' || f.parcel.stage === 'placing' || f.parcel.stage === 'awaiting_pickup';
  return moving ? followShot(team, f.parcel.pos) : stationShot(team, f.parcel.pos, f.lane);
}

const RenderDirector: React.FC = () => {
  const { gl, scene, camera, size } = useThree();
  const phase = useDepotStore((s) => s.phase);
  const result = useDepotStore((s) => s.result);

  const main = useRef<CamState>({ pos: new THREE.Vector3(), look: new THREE.Vector3(), ready: false });
  const stations = useMemo(() => ({
    blue: { cam: new THREE.PerspectiveCamera(42, 1.6, 0.4, 900), s: { pos: new THREE.Vector3(), look: new THREE.Vector3(), ready: false } as CamState },
    red: { cam: new THREE.PerspectiveCamera(42, 1.6, 0.4, 900), s: { pos: new THREE.Vector3(), look: new THREE.Vector3(), ready: false } as CamState },
  }), []);
  const introT = useRef(0);
  const accumulator = useRef(0);
  // Development-only fast-forward (?speed=4) for verifying long sequences.
  const devSpeed = useMemo(() => {
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') return 1;
    const v = Number(new URLSearchParams(window.location.search).get('speed'));
    return Number.isFinite(v) && v > 0 ? Math.min(v, 12) : 1;
  }, []);

  useEffect(() => {
    if (phase === 'intro') { introT.current = 0; main.current.ready = false; }
  }, [phase]);

  useFrame((_, rawDt) => {
    const dt = Math.min(0.05, rawDt);

    // ── FIXED-STEP SIMULATION ──
    // The depot advances in fixed 1/60 s steps, as many as real time requires.
    // A weak classroom PC that only manages 20 frames a second still sees the
    // depot run at true speed, instead of every conveyor and worker slowing
    // down with the frame rate. Capped so a stalled tab cannot fast-forward.
    const STEP = 1 / 60;
    accumulator.current += Math.min(rawDt, 0.25) * devSpeed;
    let steps = 0;
    while (accumulator.current >= STEP && steps < 90) {
      stepSim(STEP);
      accumulator.current -= STEP;
      steps++;
    }

    const W = size.width;
    const H = size.height;
    const layout = screenLayout(W, H);
    const playing = phase === 'operating' || phase === 'tie_breaker' || phase === 'round_complete';

    // ── MAIN CAMERA ──
    let shot: Shot;
    if (phase === 'intro') {
      introT.current += dt;
      shot = introT.current < 3.5 ? CAMERAS.introA : introT.current < 7 ? CAMERAS.introB : CAMERAS.introC;
    } else if (phase === 'round_intro') {
      shot = CAMERAS.roundIntro;
    } else if (phase === 'dispatch_showdown' || phase === 'game_complete') {
      const winner: TeamId = result?.winner === 'red' ? 'red' : 'blue';
      const t = sideSim(winner);
      // Chase the winning truck; wide enough to keep the waiting truck in the
      // opening moments.
      shot = { pos: { x: t.truckPos.x * 0.6 + 18, y: 13, z: t.truckPos.z + 24 }, look: { x: t.truckPos.x, y: 2, z: t.truckPos.z }, fov: 46 };
    } else if (phase === 'final_results') {
      shot = CAMERAS.overview;
    } else {
      shot = OPERATING_SHOT;
    }
    damp(main.current, shot, phase === 'intro' ? 1.4 : 2.2, dt);

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.copy(main.current.pos);
    cam.lookAt(main.current.look);

    // During play the facility must fit the centre band between the consoles
    // and below the station windows, so size the lens to that visible region
    // and shift the picture down into it.
    if (playing) {
      const f = layout.free.w / W;
      const targetH = THREE.MathUtils.degToRad(80);
      const tanHalfH = Math.tan(targetH / 2) / f;
      cam.fov = THREE.MathUtils.radToDeg(2 * Math.atan(tanHalfH / (W / H)));
      cam.setViewOffset(W, H, 0, -(layout.free.y) / 2, W, H);
    } else {
      cam.fov = shot.fov;
      cam.clearViewOffset();
    }
    cam.aspect = W / H;
    cam.updateProjectionMatrix();

    // ── RENDER ──
    // Count draw calls across all three views for the frame, not just the last.
    gl.info.autoReset = false;
    gl.info.reset();
    gl.autoClear = false;
    gl.shadowMap.needsUpdate = true;
    gl.setScissorTest(false);
    gl.setViewport(0, 0, W, H);
    gl.clear(true, true, true);
    gl.render(scene, cam);

    if (playing) {
      for (const team of ['blue', 'red'] as TeamId[]) {
        const st = stations[team];
        damp(st.s, stationTarget(team), 2.6, dt);
        st.cam.position.copy(st.s.pos);
        st.cam.lookAt(st.s.look);
        const r = layout[team];
        st.cam.aspect = r.w / r.h;
        st.cam.updateProjectionMatrix();

        // GL viewports are measured from the bottom-left.
        const y = H - r.y - r.h;
        gl.setViewport(r.x, y, r.w, r.h);
        gl.setScissor(r.x, y, r.w, r.h);
        gl.setScissorTest(true);
        gl.clear(true, true, true);
        gl.render(scene, st.cam);
      }
      gl.setScissorTest(false);
    } else {
      stations.blue.s.ready = false;
      stations.red.s.ready = false;
    }

    if (process.env.NODE_ENV === 'development') {
      (window as unknown as { __depotRender: unknown }).__depotRender = {
        calls: gl.info.render.calls, triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries, textures: gl.info.memory.textures,
      };
    }
  }, 1);

  return null;
};

// ── CANVAS ──────────────────────────────────────────────────────────────────

const World: React.FC = () => (
  <>
    <SkyDome />
    <Lighting />
    <Ground />
    <Backdrop />
    <TeamDepot team="blue" />
    <TeamDepot team="red" />
    <CentralHub3D />
    <DispatchGate3D />
  </>
);

export const DepotScene3D: React.FC = () => {
  const glProps = useMemo(() => ({
    antialias: true,
    powerPreference: 'high-performance' as const,
    stencil: false,
    alpha: false,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.0,
  }), []);

  return (
    <div className="absolute inset-0">
      <Canvas shadows="percentage" dpr={[1, 1.5]} camera={{ position: [0, 36, 64], fov: 44, near: 0.5, far: 1600 }} gl={glProps}>
        <RenderDirector />
        <World />
      </Canvas>
    </div>
  );
};

export type { Vec3 };
export { HUB };
