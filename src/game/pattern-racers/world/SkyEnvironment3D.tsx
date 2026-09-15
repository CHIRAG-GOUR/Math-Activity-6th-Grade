// ============================================================
// PATTERN RACERS — SKY, GROUND & LIGHTING
//
// The "everything is transparent" report was mostly THIS file's absence.
//
// Previously: the canvas was alpha-transparent with no scene background, so
// the "sky" was a pale CSS div (`bg-sky-100`, #e0f2fe) showing through. There
// was no fog and no horizon, and the lighting summed to ~4.9 units on near-
// white concrete, clipping it to pure white. Washed-out white geometry against
// a flat white backdrop reads exactly like see-through geometry.
//
// Fixes applied here:
//   - A real gradient sky dome, drawn inside-out. Opaque.
//   - Linear fog matched to the sky's horizon colour, so distance reads as
//     depth instead of void.
//   - Lighting cut to roughly a third of its previous total, with exposure at
//     1.0, so surfaces keep their own colour.
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GROUND } from '../engine/worldLayout';
import { CIRCUIT } from '../engine/circuit';
import { makeGrassTexture } from './trackGeometry';
import { InstancedGroup, type Placement } from './InstancedGroup';

const HORIZON = '#cfe3f2';
const ZENITH = '#4a9fe0';

/** Vertical gradient dome. Cheaper and more controllable than a physical sky. */
const SkyDome: React.FC = () => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          topColor: { value: new THREE.Color(ZENITH) },
          bottomColor: { value: new THREE.Color(HORIZON) },
        },
        vertexShader: `
          varying vec3 vWorld;
          void main() {
            vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          varying vec3 vWorld;
          void main() {
            float h = clamp(normalize(vWorld).y * 1.4 + 0.15, 0.0, 1.0);
            gl_FragColor = vec4(mix(bottomColor, topColor, pow(h, 0.72)), 1.0);
          }
        `,
      }),
    []
  );

  return (
    <mesh material={material} renderOrder={-1000} frustumCulled={false}>
      <sphereGeometry args={[2200, 24, 16]} />
    </mesh>
  );
};

/** Slow-drifting cloud slabs, high above the venue. Opaque, unlit, cheap. */
const Clouds: React.FC = () => {
  const ref = useRef<THREE.Group>(null);

  const puffs = useMemo<Placement[]>(() => {
    const out: Placement[] = [];
    for (let i = 0; i < 26; i++) {
      // Deterministic scatter — no Math.random, so every session looks the same.
      const h = (i * 2654435761) % 4294967296;
      const a = (h / 4294967296) * Math.PI * 2;
      const r = 600 + ((h >> 5) % 900);
      out.push({
        x: GROUND.cx + Math.cos(a) * r,
        y: 260 + ((h >> 11) % 90),
        z: GROUND.cz + Math.sin(a) * r,
        rotY: a,
        sx: 120 + ((h >> 3) % 160),
        sy: 26,
        sz: 90 + ((h >> 7) % 120),
      });
    }
    return out;
  }, []);

  const geo = useMemo(() => new THREE.SphereGeometry(1, 10, 7), []);
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#ffffff', fog: false }),
    []
  );

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.004;
  });

  return (
    <group ref={ref} position={[GROUND.cx, 0, GROUND.cz]}>
      <group position={[-GROUND.cx, 0, -GROUND.cz]}>
        <InstancedGroup geometry={geo} material={mat} placements={puffs} />
      </group>
    </group>
  );
};

export const SkyEnvironment3D: React.FC = () => {
  const { scene } = useThree();

  const grass = useMemo(() => makeGrassTexture(), []);

  // Background and fog are set imperatively so they survive canvas resizes.
  useMemo(() => {
    scene.background = new THREE.Color(HORIZON);
    scene.fog = new THREE.Fog(HORIZON, 420, 2000);
  }, [scene]);

  const sunRef = useRef<THREE.DirectionalLight>(null);

  // Shadow camera sized to the venue, so shadows are crisp near the action
  // rather than smeared across a 2 km frustum.
  useMemo(() => {
    const l = sunRef.current;
    if (!l) return;
    l.shadow.camera.left = -320;
    l.shadow.camera.right = 320;
    l.shadow.camera.top = 320;
    l.shadow.camera.bottom = -320;
    l.shadow.camera.near = 20;
    l.shadow.camera.far = 900;
    l.shadow.bias = -0.0006;
    l.shadow.camera.updateProjectionMatrix();
  }, []);

  const treeRing = useMemo<Placement[]>(() => {
    const out: Placement[] = [];
    const b = CIRCUIT.bounds;
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    const rx = (b.maxX - b.minX) / 2 + 95;
    const rz = (b.maxZ - b.minZ) / 2 + 95;

    for (let i = 0; i < 150; i++) {
      const h = (i * 1103515245 + 12345) % 4294967296;
      const a = (i / 150) * Math.PI * 2;
      const jitter = ((h / 4294967296) - 0.5) * 55;
      out.push({
        x: cx + Math.cos(a) * (rx + jitter),
        y: 0,
        z: cz + Math.sin(a) * (rz + jitter),
        rotY: a,
        sy: 0.8 + ((h >> 9) % 100) / 140,
      });
    }
    return out;
  }, []);

  const treeGeo = useMemo(() => new THREE.ConeGeometry(4.5, 15, 7), []);
  const treeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2f7d4f', roughness: 0.95 }),
    []
  );
  const groundMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: grass, color: '#93b884', roughness: 0.98 }),
    [grass]
  );

  return (
    <>
      <SkyDome />
      <Clouds />

      {/* ── LIGHTING ──
          Previously ambient 1.35 + directional 2.8 + hemisphere 0.75 on an
          exposure of 1.15. That is what bleached the venue. */}
      <ambientLight intensity={0.42} color="#eaf3ff" />
      <hemisphereLight args={['#bcdcf5', '#5f7a4e', 0.42]} />
      <directionalLight
        ref={sunRef}
        position={[260, 340, 180]}
        intensity={1.85}
        color="#fff6e3"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* A soft fill from the opposite side keeps shadowed faces readable
          without flattening the scene. */}
      <directionalLight position={[-220, 160, -240]} intensity={0.32} color="#cfe0ff" />

      {/* ── GROUND ── */}
      <mesh
        position={[GROUND.cx, -0.02, GROUND.cz]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={groundMat}
        receiveShadow
      >
        <planeGeometry args={[GROUND.size, GROUND.size]} />
      </mesh>

      {/* Treeline, to give the horizon depth instead of a hard edge. */}
      <group position={[0, 7.5, 0]}>
        <InstancedGroup geometry={treeGeo} material={treeMat} placements={treeRing} castShadow />
      </group>
    </>
  );
};
