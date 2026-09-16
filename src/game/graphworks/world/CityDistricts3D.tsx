// ============================================================
// GRAPHWORKS — THE DATA CITY: Six Interactive City Districts
// Weather Station, Water Treatment Plant, Power Station,
// Traffic Junction, Train Station, and Botanical City Park
// ============================================================
'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITY_GEO, CITY_MAT, CITY_COLORS } from './CityMaterials';
import { useGraphworksStore } from '../store/graphworksStore';

export function CityDistricts3D() {
  const blueCity = useGraphworksStore((s) => s.blueCity);
  const redCity = useGraphworksStore((s) => s.redCity);

  // References for live physical animations
  const turbineRef = useRef<THREE.Group>(null);
  const radarDishRef = useRef<THREE.Mesh>(null);
  const skimmerRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Group>(null);
  const parkFountainRef = useRef<THREE.Group>(null);

  const avgTemp = (blueCity.weather.temperature + redCity.weather.temperature) / 2;
  const windSpeed = (blueCity.weather.windSpeed + redCity.weather.windSpeed) / 2;
  const waterLevel = (blueCity.water.reservoirLevel + redCity.water.reservoirLevel) / 200;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Weather turbine spin proportional to wind speed
    if (turbineRef.current) {
      turbineRef.current.rotation.z += delta * (1.2 + windSpeed * 0.18);
    }

    // 2. Weather radar dish continuous rotation
    if (radarDishRef.current) {
      radarDishRef.current.rotation.y += delta * 0.8;
    }

    // 3. Water treatment clarifier skimmer slow rotation
    if (skimmerRef.current) {
      skimmerRef.current.rotation.y += delta * 0.35;
    }

    // 4. Power plant cooling tower steam rising
    if (steamRef.current) {
      steamRef.current.children.forEach((puff, i) => {
        puff.position.y = 4.2 + ((t * 0.8 + i * 0.7) % 2.5);
        puff.scale.setScalar(0.4 + (puff.position.y - 4.2) * 0.35);
      });
    }

    // 5. Park fountain dancing water jets
    if (parkFountainRef.current) {
      parkFountainRef.current.children.forEach((jet, i) => {
        jet.scale.set(1, 0.4 + Math.sin(t * 4 + i * 1.5) * 0.35, 1);
      });
    }
  });

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. WEATHER STATION DISTRICT (Coastal Hilltop Observatory)    */}
      {/* ============================================================ */}
      <group position={[-25, 0, -4]}>
        {/* Hilltop Elevation Plinth */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[5.2, 6.0, 1.2, 16]} />
          <meshStandardMaterial color="#86efac" roughness={0.8} />
        </mesh>

        {/* Observatory Main Building */}
        <mesh position={[0, 1.9, 0]} castShadow>
          <cylinderGeometry args={[2.4, 2.6, 1.4, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* White Observation Dome */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <sphereGeometry args={[2.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.2} />
        </mesh>
        {/* Telescope Slit Inset */}
        <mesh position={[0, 3.2, 1.5]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.5, 2.2, 0.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>

        {/* Rotating Doppler Radar Dish */}
        <group position={[2.8, 1.8, -1.8]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 2.4, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} />
          </mesh>
          <mesh ref={radarDishRef} position={[0, 2.5, 0]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.9, 0.2, 0.3, 12]} />
            <meshStandardMaterial color="#ffffff" metalness={0.4} />
          </mesh>
        </group>

        {/* Aerodynamic 3-Blade Wind Turbine */}
        <group position={[-3.2, 1.2, 1.5]}>
          {/* Mast Tower */}
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.25, 6.4, 8]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.5} />
          </mesh>
          {/* Nacelle Housing */}
          <mesh position={[0, 6.4, 0.2]}>
            <boxGeometry args={[0.4, 0.4, 0.9]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* 3 Rotor Blades */}
          <group ref={turbineRef} position={[0, 6.4, 0.7]}>
            {[0, 1, 2].map((bladeIdx) => (
              <mesh
                key={bladeIdx}
                rotation={[0, 0, (bladeIdx * Math.PI * 2) / 3]}
                position={[0, 1.2, 0]}
              >
                <boxGeometry args={[0.18, 2.4, 0.04]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            ))}
          </group>
        </group>

        {/* Working Giant Mercury Thermometer */}
        <group position={[2.5, 1.2, 1.8]}>
          {/* Wooden Mounting Backboard */}
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[0.8, 3.8, 0.2]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.7} />
          </mesh>
          {/* Glass Tube */}
          <mesh position={[0, 1.8, 0.12]}>
            <cylinderGeometry args={[0.12, 0.12, 3.2, 12]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.45} roughness={0.1} />
          </mesh>
          {/* Dynamic Rising/Falling Mercury Column */}
          <mesh
            position={[0, 0.5 + (Math.max(5, avgTemp) / 45) * 1.3, 0.12]}
            scale={[1, Math.max(0.15, Math.min(1.0, avgTemp / 40)), 1]}
          >
            <cylinderGeometry args={[0.08, 0.08, 2.6, 12]} />
            <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.6} />
          </mesh>
          {/* Red Mercury Bulb */}
          <mesh position={[0, 0.3, 0.12]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#dc2626" emissive="#b91c1c" emissiveIntensity={0.7} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 2. WATER TREATMENT PLANT DISTRICT                            */}
      {/* ============================================================ */}
      <group position={[-16, 0, -11]}>
        {/* Foundation Slab */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[8.5, 0.2, 6.5]} />
          <primitive object={CITY_MAT.concrete} attach="material" />
        </mesh>

        {/* Filtration & Pump Building */}
        <mesh position={[-1.8, 1.4, -0.8]} castShadow>
          <boxGeometry args={[4.2, 2.6, 3.8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Building Blue Roof */}
        <mesh position={[-1.8, 2.8, -0.8]} castShadow>
          <boxGeometry args={[4.4, 0.25, 4.0]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>

        {/* Circular Clarifier Basin 1 */}
        <group position={[2.4, 0.4, -1.2]}>
          {/* Concrete Basin Walls */}
          <mesh>
            <cylinderGeometry args={[1.6, 1.7, 0.8, 20]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
          </mesh>
          {/* Clarifier Water Surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.35, 0]}>
            <circleGeometry args={[1.5, 20]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.15} transparent opacity={0.88} />
          </mesh>
          {/* Rotating Skimmer Bridge */}
          <group ref={skimmerRef} position={[0, 0.45, 0]}>
            <mesh>
              <boxGeometry args={[3.0, 0.08, 0.18]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          </group>
        </group>

        {/* Cylindrical Reservoir Tank (Water Level responds to data!) */}
        <group position={[2.4, 0.2, 1.6]}>
          {/* Transparent Glass/Poly Tank Casing */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[1.3, 1.3, 2.4, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} transparent opacity={0.35} roughness={0.1} />
          </mesh>
          {/* Physical Water Level Inside Tank */}
          <mesh
            position={[0, 0.1 + waterLevel * 1.1, 0]}
            scale={[1, Math.max(0.08, waterLevel), 1]}
          >
            <cylinderGeometry args={[1.22, 1.22, 2.2, 16]} />
            <meshStandardMaterial color="#0ea5e9" transparent opacity={0.85} roughness={0.1} />
          </mesh>
          {/* Metallic Top Dome */}
          <mesh position={[0, 2.4, 0]}>
            <sphereGeometry args={[1.32, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 3. ECO-POWER STATION DISTRICT                                */}
      {/* ============================================================ */}
      <group position={[18, 0, -10]}>
        {/* Concrete Yard */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[9.5, 0.2, 7.0]} />
          <primitive object={CITY_MAT.concrete} attach="material" />
        </mesh>

        {/* Generator Main Hall */}
        <mesh position={[0.5, 1.8, 0.5]} castShadow>
          <boxGeometry args={[5.2, 3.4, 4.2]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        <mesh position={[0.5, 3.6, 0.5]} castShadow>
          <boxGeometry args={[5.4, 0.3, 4.4]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* Hyperbolic Natural-Draft Cooling Tower */}
        <group position={[-2.8, 0.2, 0.8]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[1.1, 1.6, 4.2, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
          {/* Rising White Steam Clouds */}
          <group ref={steamRef} position={[0, 0, 0]}>
            {[0, 1, 2].map((idx) => (
              <mesh key={idx} position={[0, 4.3 + idx * 0.7, 0]} geometry={CITY_GEO.sphere}>
                <meshStandardMaterial color="#ffffff" transparent opacity={0.45} roughness={0.9} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Solar Photovoltaic Array */}
        <group position={[1.2, 0.2, -2.2]}>
          {[-1.6, 0, 1.6].map((sx, idx) => (
            <mesh key={idx} position={[sx, 0.5, 0]} rotation={[Math.PI / 6, 0, 0]}>
              <boxGeometry args={[1.3, 0.08, 1.0]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.15} metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* High-Voltage Transmission Substation Pylon */}
        <group position={[3.6, 0.2, 2.0]}>
          <mesh position={[0, 2.8, 0]}>
            <cylinderGeometry args={[0.06, 0.18, 5.6, 4]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 4.5, 0]}>
            <boxGeometry args={[2.2, 0.1, 0.1]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 4. TRAIN STATION & TRANSIT TERMINAL                          */}
      {/* ============================================================ */}
      <group position={[0, 0, -14]}>
        {/* Terminal Platform */}
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <boxGeometry args={[18, 0.8, 3.8]} />
          <primitive object={CITY_MAT.concrete} attach="material" />
        </mesh>

        {/* Modern Arched Glass Canopy */}
        <mesh position={[0, 3.0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[4.2, 4.2, 14, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#0284c7"
            emissiveIntensity={0.2}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
            roughness={0.1}
          />
        </mesh>
        {/* Steel Arch Canopy Ribs */}
        {[-6, -2, 2, 6].map((rx) => (
          <mesh key={rx} position={[rx, 3.0, 0]}>
            <torusGeometry args={[4.22, 0.1, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} />
          </mesh>
        ))}

        {/* Dual Railway Tracks & Sleepers */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.85, 0]}>
          <planeGeometry args={[36, 1.8]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
        {/* Chrome Rails */}
        {[-0.5, 0.5].map((rz) => (
          <mesh key={rz} position={[0, 0.9, rz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 36, 6]} />
            <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 5. TRAFFIC JUNCTION DISTRICT (Multi-Lane Interchange)         */}
      {/* ============================================================ */}
      <group position={[0, 0, 5.5]}>
        {/* Overhead Steel Highway Information Gantry */}
        <group position={[0, 0, 0]}>
          {/* Vertical Support Posts */}
          <mesh position={[-7.5, 2.4, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 4.8, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          <mesh position={[7.5, 2.4, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 4.8, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          {/* Overhead Horizontal Truss */}
          <mesh position={[0, 4.6, 0]}>
            <boxGeometry args={[15.2, 0.35, 0.35]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          {/* Electronic Directional Signboard */}
          <mesh position={[0, 4.5, 0.22]}>
            <boxGeometry args={[6.5, 1.2, 0.1]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>

        {/* Working 3-Aspect LED Traffic Signals */}
        {[-6, 6].map((tx) => (
          <group key={tx} position={[tx, 0, -2.5]}>
            {/* Pole */}
            <mesh position={[0, 2.0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 4.0, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            {/* Black Signal Head */}
            <mesh position={[0, 3.6, 0.15]}>
              <boxGeometry args={[0.35, 0.95, 0.25]} />
              <meshStandardMaterial color="#0f172a" roughness={0.6} />
            </mesh>
            {/* Red Light */}
            <mesh position={[0, 3.9, 0.3]}>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.4} />
            </mesh>
            {/* Amber Light */}
            <mesh position={[0, 3.6, 0.3]}>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
            </mesh>
            {/* Green Light */}
            <mesh position={[0, 3.3, 0.3]}>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 6. BOTANICAL CITY PARK DISTRICT                              */}
      {/* ============================================================ */}
      <group position={[0, 0, 11]}>
        {/* Park Lush Grass Mound */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <planeGeometry args={[15, 6.5]} />
          <primitive object={CITY_MAT.parkLush} attach="material" />
        </mesh>

        {/* Cobblestone Promenade Walkway */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[13, 1.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} />
        </mesh>

        {/* Grand Civic Park Fountain */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[1.6, 1.8, 0.5, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.48, 0]}>
            <circleGeometry args={[1.5, 20]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.9} />
          </mesh>
          {/* Vertical Fountain Jets */}
          <group ref={parkFountainRef} position={[0, 0.5, 0]}>
            {[0, 1, 2, 3].map((fi) => {
              const fAngle = (fi / 4) * Math.PI * 2;
              return (
                <mesh key={fi} position={[Math.cos(fAngle) * 0.7, 0.5, Math.sin(fAngle) * 0.7]}>
                  <cylinderGeometry args={[0.04, 0.06, 1.4, 6]} />
                  <meshStandardMaterial color="#bae6fd" transparent opacity={0.8} />
                </mesh>
              );
            })}
          </group>
        </group>

        {/* Park Promenade Benches */}
        {[-3.5, 3.5].map((bx) => (
          <group key={bx} position={[bx, 0.1, 1.2]}>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[1.1, 0.08, 0.35]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
            {[-0.45, 0.45].map((lx) => (
              <mesh key={lx} position={[lx, 0.12, 0]}>
                <boxGeometry args={[0.06, 0.24, 0.3]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
