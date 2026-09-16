// ============================================================
// GRAPHWORKS — THE DATA CITY: 3D Environment & Sky Dome
// 360° Daytime Azure Sky Dome, Sunlit Coastal Bay,
// Distant Mountains, Drifting Clouds, Marina with Boats,
// Multi-species Stylized Trees (Oak, Cherry Blossom, Cypress),
// and flocking coastal seagulls.
// ============================================================
'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITY_GEO, CITY_MAT } from './CityMaterials';

// Tree species definition
interface StylizedTreeData {
  pos: [number, number, number];
  scale: number;
  species: 'oak' | 'cherry' | 'cypress';
  rotationY: number;
}

export function CityEnvironment3D() {
  const cloudsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const boatsRef = useRef<THREE.Group>(null);
  const foliageGroupRef = useRef<THREE.Group>(null);
  const birdsGroupRef = useRef<THREE.Group>(null);

  // ── 1. 360° DAYLIGHT SKY DOME (NO BLACK VOIDS GUARANTEED) ──
  const skyDomeGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(320, 32, 32);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const cZenith = new THREE.Color('#0284c7');
    const cSky = new THREE.Color('#38bdf8');
    const cHorizon = new THREE.Color('#bae6fd');
    const cGround = new THREE.Color('#e0f2fe');

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const col = new THREE.Color();

      if (y > 100) {
        const t = Math.min(1, (y - 100) / 180);
        col.lerpColors(cSky, cZenith, t);
      } else if (y > 10) {
        const t = (y - 10) / 90;
        col.lerpColors(cHorizon, cSky, t);
      } else if (y > -30) {
        const t = (y - (-30)) / 40;
        col.lerpColors(cGround, cHorizon, t);
      } else {
        col.copy(cGround);
      }

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // ── 2. LAYERED DISTANT SUNLIT MOUNTAINS ──
  const mountains = useMemo(() => [
    { pos: [0, 14, -85] as [number, number, number], scale: [70, 28, 25] as [number, number, number], color: '#64748b' },
    { pos: [-55, 12, -75] as [number, number, number], scale: [55, 24, 20] as [number, number, number], color: '#475569' },
    { pos: [55, 13, -80] as [number, number, number], scale: [60, 26, 22] as [number, number, number], color: '#475569' },
    { pos: [-95, 10, -50] as [number, number, number], scale: [50, 20, 30] as [number, number, number], color: '#334155' },
    { pos: [95, 10, -50] as [number, number, number], scale: [50, 20, 30] as [number, number, number], color: '#334155' },
  ], []);

  // ── 3. CURATED MULTI-SPECIES TREES (NATURAL GROUPING & BALANCED VISTAS) ──
  const trees = useMemo<StylizedTreeData[]>(() => {
    const arr: StylizedTreeData[] = [
      // Park flanking trees (framing the central promenade without blocking tower)
      { pos: [-7.2, 0, 9.5], scale: 1.1, species: 'oak', rotationY: 0.3 },
      { pos: [7.2, 0, 9.5], scale: 1.1, species: 'oak', rotationY: -0.4 },
      { pos: [-6.8, 0, 12.8], scale: 0.95, species: 'cherry', rotationY: 0.8 },
      { pos: [6.8, 0, 12.8], scale: 0.95, species: 'cherry', rotationY: -0.6 },
      { pos: [-4.2, 0, 14.2], scale: 0.85, species: 'oak', rotationY: 1.2 },
      { pos: [4.2, 0, 14.2], scale: 0.85, species: 'oak', rotationY: -1.1 },

      // Boulevard roadside cypresses (neat architectural accents along sidewalks)
      { pos: [-12.0, 0, 8.2], scale: 1.15, species: 'cypress', rotationY: 0.1 },
      { pos: [-16.0, 0, 8.2], scale: 1.05, species: 'cypress', rotationY: 0.2 },
      { pos: [12.0, 0, 8.2], scale: 1.15, species: 'cypress', rotationY: -0.1 },
      { pos: [16.0, 0, 8.2], scale: 1.05, species: 'cypress', rotationY: -0.2 },

      // Waterfront promenade tree line
      { pos: [-20.0, 0, 15.5], scale: 1.0, species: 'oak', rotationY: 0.5 },
      { pos: [-12.0, 0, 15.5], scale: 1.1, species: 'cherry', rotationY: 1.1 },
      { pos: [12.0, 0, 15.5], scale: 1.1, species: 'cherry', rotationY: -0.7 },
      { pos: [20.0, 0, 15.5], scale: 1.0, species: 'oak', rotationY: -0.5 },

      // District boundaries green belts
      { pos: [-24.0, 0, 0.0], scale: 1.2, species: 'oak', rotationY: 0.9 },
      { pos: [-26.0, 0, -8.0], scale: 1.1, species: 'cypress', rotationY: 0.3 },
      { pos: [24.0, 0, 0.0], scale: 1.2, species: 'oak', rotationY: -0.9 },
      { pos: [26.0, 0, -8.0], scale: 1.1, species: 'cypress', rotationY: -0.3 },
    ];
    return arr;
  }, []);

  // Frame animation for water, clouds, tree sway, and coastal birds
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Gentle cloud drift
    if (cloudsRef.current) {
      cloudsRef.current.position.x = ((t * 0.35) % 120) - 60;
    }

    // Subtle water surface wave ripple
    if (waterRef.current) {
      waterRef.current.position.y = -0.15 + Math.sin(t * 1.5) * 0.02;
    }

    // Gentle boat bobbing in bay
    if (boatsRef.current) {
      boatsRef.current.children.forEach((boat, i) => {
        boat.position.y = Math.sin(t * 2 + i * 1.2) * 0.04;
        boat.rotation.z = Math.sin(t * 1.5 + i) * 0.03;
      });
    }

    // Natural wind rustle on foliage canopies
    if (foliageGroupRef.current) {
      foliageGroupRef.current.children.forEach((treeMesh, i) => {
        const sway = Math.sin(t * 1.8 + i * 0.7) * 0.018;
        treeMesh.rotation.z = sway;
      });
    }

    // Flocking coastal gulls gliding over the bay
    if (birdsGroupRef.current) {
      birdsGroupRef.current.children.forEach((bird, i) => {
        const birdSpeed = 0.4 + i * 0.1;
        const bAngle = t * birdSpeed + (i * Math.PI * 2) / 5;
        const radius = 16 + (i % 3) * 6;
        bird.position.x = Math.cos(bAngle) * radius;
        bird.position.z = 22 + Math.sin(bAngle) * 8;
        bird.position.y = 12 + Math.sin(t * 2 + i) * 1.2;
        bird.rotation.y = -bAngle + Math.PI / 2;
        // Wing flapping
        bird.rotation.z = Math.sin(t * 6 + i) * 0.15;
      });
    }
  });

  return (
    <group>
      {/* ── 360° SKY DOME ── */}
      <mesh geometry={skyDomeGeo} rotation={[0, 0, 0]}>
        <meshBasicMaterial vertexColors side={THREE.BackSide} />
      </mesh>

      {/* ── SUN IN SKY ── */}
      <group position={[60, 90, -70]}>
        <mesh>
          <sphereGeometry args={[10, 24, 24]} />
          <meshBasicMaterial color="#fffef0" />
        </mesh>
        {/* Soft sun glow corona */}
        <mesh>
          <sphereGeometry args={[18, 16, 16]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.25} />
        </mesh>
      </group>

      {/* ── SCENIC DRIFTING CLOUDS ── */}
      <group ref={cloudsRef} position={[0, 45, -35]}>
        {[-40, -15, 12, 38].map((cx, idx) => (
          <group key={idx} position={[cx, (idx % 2) * 4, (idx % 3) * 6]}>
            <mesh position={[0, 0, 0]} geometry={CITY_GEO.sphere} scale={[8, 3.2, 5]}>
              <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.92} />
            </mesh>
            <mesh position={[4, 1, 0]} geometry={CITY_GEO.sphere} scale={[6, 3.8, 4.5]}>
              <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.92} />
            </mesh>
            <mesh position={[-4, 0.5, 0]} geometry={CITY_GEO.sphere} scale={[5.5, 2.8, 4]}>
              <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.92} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── DISTANT SUNLIT MOUNTAINS ── */}
      <group>
        {mountains.map((m, i) => (
          <group key={i} position={m.pos} scale={m.scale}>
            <mesh geometry={CITY_GEO.cone}>
              <meshStandardMaterial color={m.color} roughness={0.9} flatShading />
            </mesh>
            {/* Mountain peak snow caps */}
            <mesh position={[0, 0.35, 0]} scale={[0.45, 0.35, 0.45]} geometry={CITY_GEO.cone}>
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── MAIN CITY TERRAIN BASE ── */}
      {/* Landmass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -10]} receiveShadow>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial color="#4ade80" roughness={0.85} />
      </mesh>

      {/* Coastal Sand Beach / Shoreline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 17.5]} receiveShadow>
        <planeGeometry args={[120, 4]} />
        <primitive object={CITY_MAT.sandBeach} attach="material" />
      </mesh>

      {/* ── COASTAL BAY WATER ── */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 28]} receiveShadow>
        <planeGeometry args={[130, 20]} />
        <primitive object={CITY_MAT.waterSurface} attach="material" />
      </mesh>

      {/* ── MARINA DOCKS & SAILBOATS ── */}
      <group ref={boatsRef} position={[0, 0, 23]}>
        {/* Marina Wooden Pier */}
        <mesh position={[-14, -0.05, 0]}>
          <boxGeometry args={[1.6, 0.2, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[14, -0.05, 0]}>
          <boxGeometry args={[1.6, 0.2, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>

        {/* Sailboats moored in bay */}
        {[
          { pos: [-10, 0, 2] as [number, number, number], rotY: 0.3, hullColor: '#ffffff', sailColor: '#38bdf8' },
          { pos: [-18, 0, 4] as [number, number, number], rotY: -0.2, hullColor: '#2563eb', sailColor: '#ffffff' },
          { pos: [10, 0, 3] as [number, number, number], rotY: 0.15, hullColor: '#ffffff', sailColor: '#f87171' },
          { pos: [19, 0, 1.5] as [number, number, number], rotY: -0.4, hullColor: '#dc2626', sailColor: '#ffffff' },
        ].map((boat, i) => (
          <group key={i} position={boat.pos} rotation={[0, boat.rotY, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[1.2, 0.4, 2.8]} />
              <meshStandardMaterial color={boat.hullColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 2.6, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} />
            </mesh>
            <mesh position={[0, 1.5, 0.4]} rotation={[0, Math.PI / 2, 0]}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, -0.9, 0, 0, 0.9, 0, 0.8, -0.9, 0]), 3]}
                />
              </bufferGeometry>
              <meshStandardMaterial color={boat.sailColor} side={THREE.DoubleSide} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── COASTAL SEAGULLS ── */}
      <group ref={birdsGroupRef}>
        {[0, 1, 2, 3, 4].map((bi) => (
          <group key={bi}>
            {/* Bird body */}
            <mesh scale={[0.15, 0.08, 0.3]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            {/* Left Wing */}
            <mesh position={[-0.28, 0.02, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.45, 0.02, 0.15]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
            </mesh>
            {/* Right Wing */}
            <mesh position={[0.28, 0.02, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.45, 0.02, 0.15]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── HIGH-QUALITY MULTI-SPECIES TREES ── */}
      <group ref={foliageGroupRef}>
        {trees.map((t, idx) => (
          <group key={idx} position={t.pos} scale={[t.scale, t.scale, t.scale]} rotation={[0, t.rotationY, 0]}>
            {/* 1. LUSH PARK OAK / ELM */}
            {t.species === 'oak' && (
              <group>
                {/* Textured Trunk with Root Flairs */}
                <mesh position={[0, 0.75, 0]} castShadow>
                  <cylinderGeometry args={[0.16, 0.24, 1.5, 8]} />
                  <meshStandardMaterial color="#5c3817" roughness={0.9} />
                </mesh>
                {/* Main Dense Canopy Sphere */}
                <mesh position={[0, 2.0, 0]} castShadow>
                  <sphereGeometry args={[1.1, 10, 10]} />
                  <meshStandardMaterial color="#16a34a" roughness={0.7} flatShading />
                </mesh>
                {/* Secondary Canopy Cluster Left */}
                <mesh position={[-0.45, 2.35, 0.2]} castShadow>
                  <sphereGeometry args={[0.8, 8, 8]} />
                  <meshStandardMaterial color="#15803d" roughness={0.7} flatShading />
                </mesh>
                {/* Secondary Canopy Cluster Right */}
                <mesh position={[0.45, 2.2, -0.2]} castShadow>
                  <sphereGeometry args={[0.85, 8, 8]} />
                  <meshStandardMaterial color="#22c55e" roughness={0.7} flatShading />
                </mesh>
              </group>
            )}

            {/* 2. FLOWERING CHERRY BLOSSOM TREE */}
            {t.species === 'cherry' && (
              <group>
                {/* Slender Dark Cherry Trunk */}
                <mesh position={[0, 0.8, 0]} castShadow>
                  <cylinderGeometry args={[0.12, 0.18, 1.6, 8]} />
                  <meshStandardMaterial color="#451a03" roughness={0.85} />
                </mesh>
                {/* Pastel Pink Blossom Masses */}
                <mesh position={[0, 2.1, 0]} castShadow>
                  <sphereGeometry args={[1.05, 10, 10]} />
                  <meshStandardMaterial color="#f472b6" roughness={0.65} flatShading />
                </mesh>
                <mesh position={[-0.4, 2.4, 0.15]} castShadow>
                  <sphereGeometry args={[0.75, 8, 8]} />
                  <meshStandardMaterial color="#fbcfe8" roughness={0.6} flatShading />
                </mesh>
                <mesh position={[0.4, 2.25, -0.15]} castShadow>
                  <sphereGeometry args={[0.78, 8, 8]} />
                  <meshStandardMaterial color="#ec4899" roughness={0.65} flatShading />
                </mesh>
              </group>
            )}

            {/* 3. COLUMNAR ITALIAN CYPRESS */}
            {t.species === 'cypress' && (
              <group>
                {/* Short Sturdy Trunk */}
                <mesh position={[0, 0.35, 0]} castShadow>
                  <cylinderGeometry args={[0.1, 0.14, 0.7, 8]} />
                  <meshStandardMaterial color="#3e2723" roughness={0.9} />
                </mesh>
                {/* Lower Tier */}
                <mesh position={[0, 1.4, 0]} castShadow>
                  <cylinderGeometry args={[0.38, 0.52, 1.6, 8]} />
                  <meshStandardMaterial color="#166534" roughness={0.75} flatShading />
                </mesh>
                {/* Upper Tier Tapered Crown */}
                <mesh position={[0, 2.6, 0]} castShadow>
                  <coneGeometry args={[0.4, 1.2, 8]} />
                  <meshStandardMaterial color="#15803d" roughness={0.75} flatShading />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}
