// ============================================================
// THE DECIMAL DELIVERY NETWORK — SCENE, ENVIRONMENT & CAMERA
//
// Bright daylight logistics park. One canvas, one scene, one simulation step.
//
// The camera is directed by game phase and is deliberately calm: a wide shot
// that holds both depots and the central hub for almost the whole match, with
// cinematic moves reserved for the intro and the final dispatch. Constant
// zooming would make a shared classroom screen unusable.
// ============================================================

'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { MAT, GEO } from './DepotMaterials';
import { Truck3D, Forklift3D, Worker3D, Parcel3D, Conveyor3D } from './DepotProps3D';
import {
  WeighStation3D, Scanner3D, SortGate3D, CentralHub3D, DispatchGate3D,
} from './DepotMachines3D';
import { stepSim, sim } from '../engine/depotSim';
import { sideOf, DEPOT, HUB, CAMERAS, type Vec3 } from '../engine/depotLayout';
import { useDepotStore } from '../store/depotStore';
import type { TeamId } from '../types';

// ── SIM DRIVER ──────────────────────────────────────────────────────────────

const SimDriver: React.FC = () => {
  useFrame((_, dt) => stepSim(dt));
  return null;
};

// ── SKY & LIGHT ─────────────────────────────────────────────────────────────

const HORIZON = '#cfe6f5';
const ZENITH = '#4f9fd8';

const SkyDome: React.FC = () => {
  const material = useMemo(
    () => new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        topColor: { value: new THREE.Color(ZENITH) },
        bottomColor: { value: new THREE.Color(HORIZON) },
      },
      vertexShader: `varying vec3 vW;
        void main(){ vW=(modelMatrix*vec4(position,1.0)).xyz;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
      fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; varying vec3 vW;
        void main(){ float h=clamp(normalize(vW).y*1.5+0.18,0.0,1.0);
        gl_FragColor=vec4(mix(bottomColor,topColor,pow(h,0.7)),1.0);} `,
    }),
    []
  );
  return (
    <mesh material={material} renderOrder={-1000} frustumCulled={false}>
      <sphereGeometry args={[900, 24, 16]} />
    </mesh>
  );
};

const Lighting: React.FC = () => {
  const { scene } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);

  useMemo(() => {
    scene.background = new THREE.Color(HORIZON);
    scene.fog = new THREE.Fog(HORIZON, 180, 720);
  }, [scene]);

  useEffect(() => {
    const l = sun.current;
    if (!l) return;
    // Shadow frustum sized to the facility, so shadows stay crisp where the
    // action is rather than being smeared across the whole park.
    l.shadow.camera.left = -90;
    l.shadow.camera.right = 90;
    l.shadow.camera.top = 90;
    l.shadow.camera.bottom = -90;
    l.shadow.camera.near = 10;
    l.shadow.camera.far = 300;
    l.shadow.bias = -0.0008;
    l.shadow.camera.updateProjectionMatrix();
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} color="#eaf4ff" />
      <hemisphereLight args={['#cbe6fa', '#6d7f5a', 0.45]} />
      <directionalLight
        ref={sun}
        position={[70, 95, 55]}
        intensity={1.9}
        color="#fff4dd"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* Cool fill from the opposite side so shadowed faces stay readable. */}
      <directionalLight position={[-60, 45, -50]} intensity={0.35} color="#cfe0ff" />
    </>
  );
};

// ── GROUND, ROADS & MARKINGS ────────────────────────────────────────────────

const Ground: React.FC = () => {
  const bays = useMemo(() => {
    const out: { x: number; z: number; team: TeamId }[] = [];
    (['blue', 'red'] as TeamId[]).forEach((team) => {
      const s = sideOf(team);
      out.push({ x: s.truck.x, z: s.truck.z, team });
    });
    return out;
  }, []);

  return (
    <group>
      {/* grass base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}
        geometry={GEO.plane} material={MAT.grass}
        scale={[DEPOT.groundSize, DEPOT.groundSize, 1]} receiveShadow />

      {/* concrete apron covering the working facility */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 4]}
        geometry={GEO.plane} material={MAT.concrete}
        scale={[122, 76, 1]} receiveShadow />

      {/* dispatch road running out through the gate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 70]}
        geometry={GEO.plane} material={MAT.asphalt}
        scale={[18, 90, 1]} receiveShadow />
      {/* centre line dashes */}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, 34 + i * 5]} geometry={GEO.plane} material={MAT.lineWhite}
          scale={[0.4, 2.2, 1]} />
      ))}

      {/* loading bay markings under each truck */}
      {bays.map((b) => (
        <group key={b.team}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[b.x, 0.02, b.z]}
            geometry={GEO.plane} material={MAT.lineYellow} scale={[7.2, 13, 1]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[b.x, 0.03, b.z]}
            geometry={GEO.plane} material={MAT.asphalt} scale={[6.4, 12.2, 1]} />
        </group>
      ))}

      {/* forklift lane hatching */}
      {(['blue', 'red'] as TeamId[]).map((team) => {
        const s = sideOf(team);
        return (
          <mesh key={team} rotation={[-Math.PI / 2, 0, 0]}
            position={[(s.palletStack.x + s.scale.x) / 2, 0.015, -12]}
            geometry={GEO.plane} material={MAT.lineYellow} scale={[16, 0.35, 1]} />
        );
      })}
    </group>
  );
};

// ── WAREHOUSE SHELL ─────────────────────────────────────────────────────────

const Warehouse: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  const { w, h, d } = s.warehouseSize;
  const wall = team === 'blue' ? MAT.wallBlue : MAT.wallRed;

  return (
    <group position={[s.warehouse.x, 0, s.warehouse.z]}>
      {/* shell */}
      <mesh geometry={GEO.unitBox} material={MAT.wallNeutral}
        position={[0, h / 2, 0]} scale={[w, h, d]} castShadow receiveShadow />
      {/* livery band + roof */}
      <mesh geometry={GEO.unitBox} material={wall}
        position={[0, h - 2.2, 0]} scale={[w + 0.15, 2.4, d + 0.15]} />
      <mesh geometry={GEO.unitBox} material={MAT.roof}
        position={[0, h + 0.4, 0]} scale={[w + 1.6, 0.8, d + 1.6]} castShadow />

      {/* dock doors facing the yard */}
      {[-10, 0, 10].map((x) => (
        <group key={x} position={[x, 0, d / 2 + 0.1]}>
          <mesh geometry={GEO.unitBox} material={MAT.trim}
            position={[0, 3.1, 0]} scale={[6.4, 6.2, 0.35]} />
          <mesh geometry={GEO.unitBox} material={MAT.steelDark}
            position={[0, 3.0, 0.2]} scale={[5.6, 5.4, 0.2]} />
          {/* roller slats */}
          {Array.from({ length: 6 }, (_, i) => (
            <mesh key={i} geometry={GEO.unitBox} material={MAT.steel}
              position={[0, 0.9 + i * 0.9, 0.33]} scale={[5.5, 0.12, 0.06]} />
          ))}
        </group>
      ))}

      {/* clerestory windows */}
      {[-12, -4, 4, 12].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={MAT.glass}
          position={[x, h - 4.6, d / 2 + 0.12]} scale={[5.0, 1.6, 0.1]} />
      ))}
    </group>
  );
};

// ── BACKGROUND CITY, TREES & LIGHTS ─────────────────────────────────────────

const Backdrop: React.FC = () => {
  const towers = useMemo(() => {
    const out: { x: number; z: number; h: number; w: number; shade: number }[] = [];
    // Deterministic skyline — a hash, never Math.random, so it never flickers
    // between reloads or between clients.
    for (let i = 0; i < 46; i++) {
      const hsh = Math.sin(i * 127.1) * 43758.5453;
      const r = hsh - Math.floor(hsh);
      const hsh2 = Math.sin(i * 311.7) * 24634.6345;
      const r2 = hsh2 - Math.floor(hsh2);
      const a = (i / 46) * Math.PI * 1.4 - Math.PI * 0.2;
      const dist = 210 + r * 120;
      out.push({
        x: Math.cos(a) * dist,
        z: -Math.abs(Math.sin(a)) * dist - 40,
        h: 18 + r2 * 58,
        w: 10 + r * 12,
        shade: r2,
      });
    }
    return out;
  }, []);

  const cityMats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: '#b9c6d4', roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color: '#a6b4c4', roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color: '#c8d3de', roughness: 0.85 }),
    ],
    []
  );

  const trees = useMemo(() => {
    const out: Vec3[] = [];
    for (let i = 0; i < 40; i++) {
      const hsh = Math.sin(i * 78.233) * 43758.5453;
      const r = hsh - Math.floor(hsh);
      const a = (i / 40) * Math.PI * 2;
      const dist = 92 + r * 40;
      out.push({ x: Math.cos(a) * dist, y: 0, z: Math.sin(a) * dist + 6 });
    }
    return out;
  }, []);

  return (
    <group>
      {towers.map((t, i) => (
        <mesh key={i} geometry={GEO.unitBox}
          material={cityMats[i % cityMats.length]}
          position={[t.x, t.h / 2, t.z]} scale={[t.w, t.h, t.w]} />
      ))}

      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh geometry={GEO.unitCylLow} material={MAT.trim}
            position={[0, 1.4, 0]} scale={[0.5, 2.8, 0.5]} />
          <mesh geometry={GEO.unitCone} material={MAT.grass}
            position={[0, 4.6, 0]} scale={[5.2, 7.5, 5.2]} castShadow />
        </group>
      ))}

      {/* yard light masts */}
      {[-52, -26, 26, 52].map((x) => (
        <group key={x} position={[x, 0, 34]}>
          <mesh geometry={GEO.unitCylLow} material={MAT.steel}
            position={[0, 6, 0]} scale={[0.4, 12, 0.4]} castShadow />
          <mesh geometry={GEO.unitBox} material={MAT.trim}
            position={[0, 12.2, 0.8]} scale={[2.2, 0.4, 1.4]} />
        </group>
      ))}
    </group>
  );
};

// ── STATIC YARD PROPS ───────────────────────────────────────────────────────

const YardProps: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  const accent = team === 'blue' ? MAT.wallBlue : MAT.wallRed;

  return (
    <group>
      {/* pallet stack the forklift serves */}
      <group position={[s.palletStack.x, 0, s.palletStack.z]}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, i * 0.95, 0]}>
            <mesh geometry={GEO.unitBox} material={MAT.cardboardDark}
              position={[0, 0.1, 0]} scale={[1.6, 0.18, 1.6]} castShadow />
            <mesh geometry={GEO.unitBox} material={MAT.cardboard}
              position={[0, 0.55, 0]} scale={[1.35, 0.72, 1.35]} castShadow />
          </group>
        ))}
      </group>

      {/* shipping containers along the back fence */}
      {[0, 1].map((i) => (
        <mesh key={i} geometry={GEO.unitBox} material={i === 0 ? accent : MAT.guardOrange}
          position={[s.warehouse.x + (i === 0 ? -20 : -20), 1.6, s.warehouse.z + 14 + i * 3.4]}
          scale={[12, 3.2, 3.0]} castShadow receiveShadow />
      ))}

      {/* team dispatch terminal */}
      <group position={[s.terminal.x, 0, s.terminal.z]}>
        <mesh geometry={GEO.unitBox} material={MAT.steel}
          position={[0, 1.0, 0]} scale={[0.3, 2.0, 0.3]} castShadow />
        <mesh geometry={GEO.unitBox} material={MAT.trim}
          position={[0, 2.3, 0]} scale={[2.0, 1.3, 0.3]} castShadow />
        <mesh geometry={GEO.unitBox} material={MAT.screen}
          position={[0, 2.3, 0.18]} scale={[1.7, 1.0, 0.05]} />
        <mesh geometry={GEO.unitBox} material={accent}
          position={[0, 3.1, 0]} scale={[2.0, 0.3, 0.3]} />
      </group>

      {/* safety cones marking the forklift lane */}
      {[-6, 0, 6].map((dz) => (
        <mesh key={dz} geometry={GEO.unitCone} material={MAT.guardOrange}
          position={[(s.palletStack.x + s.scale.x) / 2, 0.35, -12 + dz]}
          scale={[0.7, 0.7, 0.7]} />
      ))}
    </group>
  );
};

// ── CAMERA DIRECTOR ─────────────────────────────────────────────────────────

const camPos = new THREE.Vector3();
const camLook = new THREE.Vector3();
const want = new THREE.Vector3();
const wantLook = new THREE.Vector3();

function damp3(cur: THREE.Vector3, target: THREE.Vector3, rate: number, dt: number) {
  cur.lerp(target, 1 - Math.exp(-rate * dt));
}

const CameraDirector: React.FC = () => {
  const phase = useDepotStore((s) => s.phase);
  const result = useDepotStore((s) => s.result);
  const introT = useRef(0);
  const ready = useRef(false);

  useEffect(() => {
    if (phase === 'intro') { introT.current = 0; ready.current = false; }
  }, [phase]);

  useFrame((state, rawDt) => {
    const dt = Math.min(0.05, rawDt);
    let shot: { pos: Vec3; look: Vec3; fov: number };

    if (phase === 'intro') {
      // Short three-beat establishing sequence: the whole park, then a pass
      // across the yard, then settling into the playing view.
      introT.current += dt;
      const t = introT.current;
      if (t < 3.2) shot = CAMERAS.introA;
      else if (t < 6.4) shot = CAMERAS.introB;
      else shot = CAMERAS.introC;
    } else if (phase === 'dispatch_showdown' || phase === 'game_complete') {
      // Follow the departing truck down the road.
      const winner = result?.winner === 'red' ? 'red' : 'blue';
      const s = winner === 'blue' ? sim.blue : sim.red;
      shot = {
        pos: { x: s.truckPos.x + 22, y: 11, z: s.truckPos.z - 14 },
        look: { x: s.truckPos.x, y: 2.2, z: s.truckPos.z + 6 },
        fov: 44,
      };
    } else if (phase === 'round_intro' || phase === 'round_complete') {
      shot = CAMERAS.roundIntro;
    } else {
      shot = CAMERAS.operating;
    }

    want.set(shot.pos.x, shot.pos.y, shot.pos.z);
    wantLook.set(shot.look.x, shot.look.y, shot.look.z);

    if (!ready.current) {
      camPos.copy(want);
      camLook.copy(wantLook);
      ready.current = true;
    }

    // Deliberately slow: a shared classroom screen should never lurch.
    damp3(camPos, want, phase === 'intro' ? 1.6 : 2.2, dt);
    damp3(camLook, wantLook, 2.4, dt);

    state.camera.position.copy(camPos);
    state.camera.lookAt(camLook);

    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera && Math.abs(cam.fov - shot.fov) > 0.01) {
      cam.fov += (shot.fov - cam.fov) * (1 - Math.exp(-3 * dt));
      cam.updateProjectionMatrix();
    }
  });

  return null;
};

// ── WORLD ───────────────────────────────────────────────────────────────────

const World: React.FC = () => (
  <>
    <SkyDome />
    <Lighting />
    <Ground />
    <Backdrop />

    {(['blue', 'red'] as TeamId[]).map((team) => (
      <group key={team}>
        <Warehouse team={team} />
        <YardProps team={team} />
        <Conveyor3D team={team} />
        <WeighStation3D team={team} />
        <Scanner3D team={team} />
        <SortGate3D team={team} />
        <Forklift3D team={team} />
        <Worker3D team={team} index={0} />
        <Worker3D team={team} index={1} />
        <Parcel3D team={team} />
        <Truck3D team={team} />
      </group>
    ))}

    <CentralHub3D />
    <DispatchGate3D />
  </>
);

export const DepotScene3D: React.FC = () => {
  const gl = useMemo(
    () => ({
      antialias: true,
      powerPreference: 'high-performance' as const,
      stencil: false,
      // Opaque canvas: with alpha the page background shows through wherever
      // the scene does not paint, which reads as a washed-out world.
      alpha: false,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.0,
    }),
    []
  );

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 34, 62], fov: 42, near: 0.5, far: 1600 }}
        gl={gl}
      >
        <SimDriver />
        <CameraDirector />
        <World />
      </Canvas>
    </div>
  );
};
