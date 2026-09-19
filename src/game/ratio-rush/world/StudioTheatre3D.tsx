// ============================================================
// RATIO RUSH — PREMIERE THEATRE
//
// A real auditorium: raked seating, a centre aisle, aisle lights, acoustic
// side walls and a masked cinema screen carrying the live feed — so the
// film the studio just shot plays here, in front of an audience.
//
// The audience is drawn as two InstancedMesh calls (bodies and heads) rather
// than 48 humanoids, and its sway is written every third frame, so a full
// house costs two draw calls instead of several hundred.
// ============================================================

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoSphere12,
  getStudioMaterial,
  MAT_ROAD_CASE_BLACK,
  MAT_RED_CARPET,
  MAT_GOLD_BRASS,
  MAT_STEEL_DARK,
  MAT_SCREEN_GLOW,
} from './StudioMaterials';
import { useLiveFeed } from './StudioLiveFeed';

const SCREEN_Z = -7;
const ROWS = 6;
const ROW_PITCH = 1.45;
const ROW_RISE = 0.34;
const FIRST_ROW_Z = -2.4;
/** Two blocks of four, with a centre aisle straight up the middle. */
const SEAT_X = [-3.1, -2.42, -1.74, -1.06, 1.06, 1.74, 2.42, 3.1];

const MAT_SEAT = getStudioMaterial('#7f1d1d', 0.85, 0.0);
const MAT_SEAT_TRIM = getStudioMaterial('#a16207', 0.5, 0.35);
const MAT_RISER = getStudioMaterial('#1c1917', 0.9, 0.0);
const MAT_WALL_DARK = getStudioMaterial('#27272a', 0.95, 0.0);
const MAT_PANEL = getStudioMaterial('#3f3f46', 0.95, 0.0);
const MAT_AISLE_LIGHT = getStudioMaterial('#fde047', 0.2, 0.0, '#facc15', 2.2);
const MAT_EXIT_SIGN = getStudioMaterial('#16a34a', 0.3, 0.0, '#22c55e', 1.8);
const MAT_SCREEN_MASK = getStudioMaterial('#09090b', 0.95, 0.0);

const AUDIENCE_COAT = [
  '#1e293b', '#4c1d95', '#0f766e', '#7c2d12', '#334155', '#581c87', '#155e75', '#3f3f46',
];
const AUDIENCE_SKIN = ['#ffedd5', '#fed7aa', '#d97706', '#78350f'];

interface Seat {
  x: number;
  y: number;
  z: number;
  /** Empty seats read as a real room rather than a rendered crowd. */
  occupied: boolean;
  coat: number;
  skin: number;
  phase: number;
}

function buildSeats(): Seat[] {
  const seats: Seat[] = [];
  let n = 0;
  for (let r = 0; r < ROWS; r++) {
    for (const x of SEAT_X) {
      // Deterministic scatter — the same house every time, no render-to-render popping.
      const h = Math.sin(n * 12.9898) * 43758.5453;
      const rand = h - Math.floor(h);
      seats.push({
        x,
        y: r * ROW_RISE,
        z: FIRST_ROW_Z + r * ROW_PITCH,
        occupied: rand > 0.12,
        coat: n % AUDIENCE_COAT.length,
        skin: (n * 3) % AUDIENCE_SKIN.length,
        phase: rand * Math.PI * 2,
      });
      n += 1;
    }
  }
  return seats;
}

const AudienceInstanced: React.FC<{ seats: Seat[] }> = ({ seats }) => {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const frame = useRef(0);

  const people = useMemo(() => seats.filter((s) => s.occupied), [seats]);

  const bodyMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.0 }),
    []
  );
  const headMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.0 }),
    []
  );

  const { bodyColors, headColors } = useMemo(() => {
    const b = new Float32Array(people.length * 3);
    const h = new Float32Array(people.length * 3);
    const c = new THREE.Color();
    people.forEach((p, i) => {
      c.set(AUDIENCE_COAT[p.coat]).convertSRGBToLinear().toArray(b, i * 3);
      c.set(AUDIENCE_SKIN[p.skin]).convertSRGBToLinear().toArray(h, i * 3);
    });
    return { bodyColors: b, headColors: h };
  }, [people]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    frame.current += 1;
    // A seated audience barely moves; three updates a second is plenty and
    // keeps the two matrix uploads off most frames.
    if (frame.current % 3 !== 0) return;
    const body = bodyRef.current;
    const head = headRef.current;
    if (!body || !head) return;

    const t = clock.getElapsedTime();
    for (let i = 0; i < people.length; i++) {
      const p = people[i];
      const sway = Math.sin(t * 0.7 + p.phase) * 0.018;
      const bob = Math.sin(t * 1.6 + p.phase) * 0.008;

      dummy.position.set(p.x, p.y + 0.76 + bob, p.z - 0.04);
      dummy.rotation.set(0, sway, 0);
      dummy.scale.set(0.4, 0.58, 0.32);
      dummy.updateMatrix();
      body.setMatrixAt(i, dummy.matrix);

      dummy.position.set(p.x, p.y + 1.12 + bob, p.z - 0.06);
      dummy.rotation.set(Math.sin(t * 0.9 + p.phase) * 0.03, sway * 1.6, 0);
      dummy.scale.set(0.125, 0.145, 0.125);
      dummy.updateMatrix();
      head.setMatrixAt(i, dummy.matrix);
    }
    body.instanceMatrix.needsUpdate = true;
    head.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={bodyRef}
        args={[geoCylinder12, bodyMaterial, people.length]}
        frustumCulled={false}
      >
        <instancedBufferAttribute attach="instanceColor" args={[bodyColors, 3]} />
      </instancedMesh>
      <instancedMesh
        ref={headRef}
        args={[geoSphere12, headMaterial, people.length]}
        frustumCulled={false}
      >
        <instancedBufferAttribute attach="instanceColor" args={[headColors, 3]} />
      </instancedMesh>
    </group>
  );
};

export const StudioTheatre3D: React.FC<{ isPremiere: boolean }> = React.memo(
  ({ isPremiere }) => {
    const feed = useLiveFeed();
    const seats = useMemo(buildSeats, []);

    return (
      <group>
        {/* ── Auditorium shell ── */}
        <mesh
          geometry={geoBox}
          material={MAT_RISER}
          scale={[10.6, 0.1, 22]}
          position={[0, 0.02, -1]}
        />
        {/* Side walls with acoustic panelling */}
        {[-5.4, 5.4].map((wx) => (
          <group key={`wall-${wx}`}>
            <mesh
              geometry={geoBox}
              material={MAT_WALL_DARK}
              scale={[0.3, 8.6, 22]}
              position={[wx, 4.3, -1]}
            />
            {[-5.5, -3, -0.5, 2, 4.5].map((pz) => (
              <mesh
                key={`panel-${wx}-${pz}`}
                geometry={geoBox}
                material={MAT_PANEL}
                scale={[0.08, 4.4, 1.6]}
                position={[wx + (wx < 0 ? 0.2 : -0.2), 3.4, pz]}
              />
            ))}
            {/* Aisle sconces */}
            {[-4, -1, 2, 5].map((pz) => (
              <mesh
                key={`sconce-${wx}-${pz}`}
                geometry={geoBox}
                material={MAT_AISLE_LIGHT}
                scale={[0.06, 0.5, 0.12]}
                position={[wx + (wx < 0 ? 0.28 : -0.28), 2.2, pz]}
              />
            ))}
          </group>
        ))}
        {/* Front, back and ceiling: a sealed room, so the soundstage next door
            never shows up behind the screen. */}
        <mesh
          geometry={geoBox}
          material={MAT_WALL_DARK}
          scale={[10.7, 8.6, 0.4]}
          position={[0, 4.3, SCREEN_Z - 0.35]}
        />
        <mesh
          geometry={geoBox}
          material={MAT_WALL_DARK}
          scale={[10.7, 8.6, 0.4]}
          position={[0, 4.3, 10]}
        />
        <mesh
          geometry={geoBox}
          material={MAT_RISER}
          scale={[10.7, 0.3, 22]}
          position={[0, 8.5, -1]}
        />

        {/* ── Masked cinema screen carrying the live feed ── */}
        <group position={[0, 3.5, SCREEN_Z]}>
          {/* Black masking surround */}
          <mesh geometry={geoBox} material={MAT_SCREEN_MASK} scale={[8.9, 5.6, 0.3]} />
          <mesh scale={[7.5, 4.22, 1]} position={[0, 0, 0.17]}>
            <planeGeometry args={[1, 1]} />
            {feed ? (
              <primitive object={feed.screenMaterial} attach="material" />
            ) : (
              <primitive object={MAT_SCREEN_GLOW} attach="material" />
            )}
          </mesh>
          {/* Gold proscenium trim */}
          {[
            [0, 2.9, 0.22, 9.3, 0.22, 0.12],
            [0, -2.9, 0.22, 9.3, 0.22, 0.12],
            [-4.55, 0, 0.22, 0.22, 6.0, 0.12],
            [4.55, 0, 0.22, 0.22, 6.0, 0.12],
          ].map((t, i) => (
            <mesh
              key={`trim-${i}`}
              geometry={geoBox}
              material={MAT_GOLD_BRASS}
              scale={[t[3], t[4], t[5]]}
              position={[t[0], t[1], t[2]]}
            />
          ))}
        </group>

        {/* Stage lip and steps below the screen */}
        <mesh
          geometry={geoBox}
          material={MAT_RED_CARPET}
          scale={[9.4, 0.6, 1.6]}
          position={[0, 0.3, SCREEN_Z + 1.2]}
        />

        {/* ── Raked seating ── */}
        {seats.map((s, i) => (
          <group key={`seat-${i}`} position={[s.x, s.y, s.z]}>
            {/* Seat base */}
            <mesh geometry={geoBox} material={MAT_SEAT} scale={[0.62, 0.12, 0.6]} position={[0, 0.46, 0]} />
            {/* Backrest, tilted back like a real cinema seat */}
            <mesh
              geometry={geoBox}
              material={MAT_SEAT}
              scale={[0.62, 0.86, 0.14]}
              position={[0, 0.88, 0.3]}
              rotation={[0.14, 0, 0]}
            />
            {/* Armrests */}
            {[-0.33, 0.33].map((ax) => (
              <mesh
                key={`arm-${ax}`}
                geometry={geoBox}
                material={MAT_SEAT_TRIM}
                scale={[0.07, 0.09, 0.56]}
                position={[ax, 0.56, 0.02]}
              />
            ))}
            {/* Pedestal */}
            <mesh
              geometry={geoCylinder8}
              material={MAT_STEEL_DARK}
              scale={[0.07, 0.4, 0.07]}
              position={[0, 0.2, 0]}
            />
          </group>
        ))}

        {/* Risers under each row */}
        {Array.from({ length: ROWS }).map((_, r) => (
          <mesh
            key={`riser-${r}`}
            geometry={geoBox}
            material={MAT_RISER}
            scale={[10.2, r * ROW_RISE + 0.08, ROW_PITCH]}
            position={[0, (r * ROW_RISE + 0.08) / 2, FIRST_ROW_Z + r * ROW_PITCH]}
          />
        ))}

        {/* Aisle strip lighting up the centre */}
        {Array.from({ length: ROWS }).map((_, r) => (
          <mesh
            key={`aisle-${r}`}
            geometry={geoBox}
            material={MAT_AISLE_LIGHT}
            scale={[0.14, 0.04, 0.5]}
            position={[0, r * ROW_RISE + 0.1, FIRST_ROW_Z + r * ROW_PITCH]}
          />
        ))}

        <AudienceInstanced seats={seats} />

        {/* ── Projection booth & beam ── */}
        <mesh
          geometry={geoBox}
          material={MAT_ROAD_CASE_BLACK}
          scale={[1.4, 0.7, 0.9]}
          position={[0, 5.6, 8.4]}
        />
        {isPremiere && (
          <mesh
            geometry={geoCylinder12}
            position={[0, 4.7, 1.0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[2.4, 14.6, 2.4]}
          >
            <meshBasicMaterial color="#e2e8f0" transparent opacity={0.045} depthWrite={false} />
          </mesh>
        )}

        {/* Exit signs */}
        {[-4.9, 4.9].map((ex) => (
          <mesh
            key={`exit-${ex}`}
            geometry={geoBox}
            material={MAT_EXIT_SIGN}
            scale={[0.08, 0.26, 0.7]}
            position={[ex, 2.9, 8.6]}
          />
        ))}

        {/* House light — warm before the film, near-dark once it rolls */}
        <pointLight
          position={[0, 6.4, 3]}
          color="#fde68a"
          intensity={isPremiere ? 3 : 16}
          distance={26}
          decay={2}
        />
        {/* Screen bounce onto the first rows */}
        <pointLight
          position={[0, 3.4, SCREEN_Z + 3]}
          color="#bfdbfe"
          intensity={isPremiere ? 14 : 2}
          distance={18}
          decay={2}
        />
      </group>
    );
  }
);

StudioTheatre3D.displayName = 'StudioTheatre3D';
