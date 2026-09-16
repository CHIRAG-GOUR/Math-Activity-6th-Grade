// ============================================================
// GRAPHWORKS — THE DATA CITY: 3D Environment & Sky Dome
// 360° Daytime Azure Sky Dome (No black voids!), Sunlit Coastal Bay,
// Distant Mountains, Drifting Clouds, Marina with Boats, and Scenic Foliage
// ============================================================
'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITY_GEO, CITY_MAT, CITY_COLORS } from './CityMaterials';

export function CityEnvironment3D() {
  const cloudsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const boatsRef = useRef<THREE.Group>(null);

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

  // ── 3. ORGANIC PROCEDURAL TREES ──
  const treeClusters = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; type: 'round' | 'tall'; hue: string }[] = [];
    const hues = ['#22c55e', '#16a34a', '#15803d', '#4ade80'];

    // Park area clusters
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const r = 3 + Math.random() * 5;
      arr.push({
        pos: [Math.cos(angle) * r, 0, 8 + Math.sin(angle) * r],
        scale: 0.65 + Math.random() * 0.45,
        type: i % 3 === 0 ? 'tall' : 'round',
        hue: hues[i % hues.length],
      });
    }

    // Waterfront promenade tree line
    for (let i = 0; i < 9; i++) {
      arr.push({
        pos: [-24 + i * 6, 0, 15.5],
        scale: 0.8 + Math.random() * 0.3,
        type: 'round',
        hue: hues[(i + 1) % hues.length],
      });
    }

    // Suburban green belts
    for (let i = 0; i < 6; i++) {
      arr.push({
        pos: [-28 + Math.random() * 6, 0, -5 + Math.random() * 10],
        scale: 0.9 + Math.random() * 0.4,
        type: 'tall',
        hue: hues[i % hues.length],
      });
      arr.push({
        pos: [22 + Math.random() * 6, 0, -5 + Math.random() * 10],
        scale: 0.9 + Math.random() * 0.4,
        type: 'round',
        hue: hues[(i + 2) % hues.length],
      });
    }

    return arr;
  }, []);

  // Frame animation for water and clouds
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Gentle cloud drift
    if (cloudsRef.current) {
      cloudsRef.current.position.x = (t * 0.4) % 120 - 60;
    }

    // Subtle water surface wave ripple
    if (waterRef.current) {
      waterRef.current.position.y = -0.15 + Math.sin(t * 1.5) * 0.02;
    }

    // Gentle boat bobbing
    if (boatsRef.current) {
      boatsRef.current.children.forEach((boat, i) => {
        boat.position.y = Math.sin(t * 2 + i * 1.2) * 0.04;
        boat.rotation.z = Math.sin(t * 1.5 + i) * 0.03;
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
            {/* Hull */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[1.2, 0.4, 2.8]} />
              <meshStandardMaterial color={boat.hullColor} roughness={0.4} />
            </mesh>
            {/* Mast */}
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 2.6, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} />
            </mesh>
            {/* Triangular Sail */}
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

      {/* ── ORGANIC URBAN TREES ── */}
      <group>
        {treeClusters.map((t, idx) => (
          <group key={idx} position={t.pos} scale={[t.scale, t.scale, t.scale]}>
            {/* Tree Trunk */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.18, 1.4, 6]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            {/* Tree Canopy */}
            {t.type === 'round' ? (
              <mesh position={[0, 1.9, 0]} castShadow>
                <dodecahedronGeometry args={[1.0, 1]} />
                <meshStandardMaterial color={t.hue} roughness={0.75} flatShading />
              </mesh>
            ) : (
              <mesh position={[0, 2.2, 0]} castShadow>
                <coneGeometry args={[0.9, 2.6, 6]} />
                <meshStandardMaterial color={t.hue} roughness={0.75} flatShading />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}
