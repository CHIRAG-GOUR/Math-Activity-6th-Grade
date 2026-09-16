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
  const cityStage = useGraphworksStore((s) => s.cityStage);

  // References for live physical animations
  const turbineRef = useRef<THREE.Group>(null);
  const radarDishRef = useRef<THREE.Mesh>(null);
  const skimmerRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Group>(null);
  const parkFountainJetsRef = useRef<THREE.Group>(null);
  const fountainHeightRef = useRef(0.8);

  // Independent damped telemetry values for 60 FPS buttery smoothness
  const blueTempRef = useRef(15);
  const redTempRef = useRef(15);
  const blueWaterRef = useRef(50);
  const redWaterRef = useRef(50);
  const bluePowerRef = useRef(30);
  const redPowerRef = useRef(30);

  const blueMercuryRef = useRef<THREE.Mesh>(null);
  const redMercuryRef = useRef<THREE.Mesh>(null);
  const blueWaterCylRef = useRef<THREE.Mesh>(null);
  const redWaterCylRef = useRef<THREE.Mesh>(null);
  const blueCoronaRef = useRef<THREE.Mesh>(null);
  const redCoronaRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // ── 1. DAMPED LIVE DATA INTERPOLATION (NO ABRUPT JUMPS) ──
    blueTempRef.current = THREE.MathUtils.damp(blueTempRef.current, blueCity.weather.temperature, 5.0, delta);
    redTempRef.current = THREE.MathUtils.damp(redTempRef.current, redCity.weather.temperature, 5.0, delta);
    blueWaterRef.current = THREE.MathUtils.damp(blueWaterRef.current, blueCity.water.reservoirLevel, 4.5, delta);
    redWaterRef.current = THREE.MathUtils.damp(redWaterRef.current, redCity.water.reservoirLevel, 4.5, delta);
    bluePowerRef.current = THREE.MathUtils.damp(bluePowerRef.current, blueCity.power.generationMW, 5.0, delta);
    redPowerRef.current = THREE.MathUtils.damp(redPowerRef.current, redCity.power.generationMW, 5.0, delta);

    const activeWind = (blueCity.weather.windSpeed + redCity.weather.windSpeed) / 2;

    // ── 2. WEATHER STATION PHYSICAL ACTUATORS ──
    // Turbine spin proportional to wind speed
    if (turbineRef.current) {
      turbineRef.current.rotation.z += delta * (1.2 + activeWind * 0.22);
    }
    // Radar dish rotation
    if (radarDishRef.current) {
      radarDishRef.current.rotation.y += delta * 0.9;
    }
    // Blue Thermometer column
    if (blueMercuryRef.current) {
      const norm = Math.max(0.05, Math.min(1.0, blueTempRef.current / 40));
      blueMercuryRef.current.scale.y = norm;
      blueMercuryRef.current.position.y = 0.5 + norm * 1.3;
    }
    // Red Thermometer column
    if (redMercuryRef.current) {
      const norm = Math.max(0.05, Math.min(1.0, redTempRef.current / 40));
      redMercuryRef.current.scale.y = norm;
      redMercuryRef.current.position.y = 0.5 + norm * 1.3;
    }

    // ── 3. WATER TREATMENT PHYSICAL ACTUATORS ──
    // Clarifier skimmer speed proportional to active flow
    const activeFlow = (blueCity.water.flowRate + redCity.water.flowRate) / 2;
    if (skimmerRef.current) {
      skimmerRef.current.rotation.y += delta * (0.3 + (activeFlow / 100) * 0.8);
    }
    // Blue Reservoir water level
    if (blueWaterCylRef.current) {
      const norm = Math.max(0.06, Math.min(1.0, blueWaterRef.current / 100));
      blueWaterCylRef.current.scale.y = norm;
      blueWaterCylRef.current.position.y = 0.1 + norm * 1.1;
    }
    // Red Reservoir water level
    if (redWaterCylRef.current) {
      const norm = Math.max(0.06, Math.min(1.0, redWaterRef.current / 100));
      redWaterCylRef.current.scale.y = norm;
      redWaterCylRef.current.position.y = 0.1 + norm * 1.1;
    }

    // ── 4. POWER STATION PHYSICAL ACTUATORS ──
    // Cooling tower steam: rise speed and volume directly driven by power output!
    const activePower = (bluePowerRef.current + redPowerRef.current) / 2;
    const powerNorm = Math.min(2.0, Math.max(0.3, activePower / 35));
    if (steamRef.current) {
      steamRef.current.children.forEach((puff, i) => {
        puff.position.y = 4.2 + ((t * (0.8 * powerNorm) + i * 0.7) % (2.5 * powerNorm));
        puff.scale.setScalar((0.35 + (puff.position.y - 4.2) * 0.3) * powerNorm);
      });
    }
    // Corona rings electrical pulsing
    if (blueCoronaRef.current) {
      blueCoronaRef.current.rotation.y += delta * (1.5 + (bluePowerRef.current / 30) * 3);
      (blueCoronaRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.8 + Math.sin(t * 10) * 0.5 * (bluePowerRef.current / 50);
    }
    if (redCoronaRef.current) {
      redCoronaRef.current.rotation.y -= delta * (1.5 + (redPowerRef.current / 30) * 3);
      (redCoronaRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.8 + Math.cos(t * 10) * 0.5 * (redPowerRef.current / 50);
    }

    // ── 5. BOTANICAL GARDEN FOUNTAIN JET DYNAMICS ──
    const avgFountainTarget = (blueCity.park.fountainHeight + redCity.park.fountainHeight) / 2;
    fountainHeightRef.current = THREE.MathUtils.damp(fountainHeightRef.current, avgFountainTarget, 4.5, delta);

    if (parkFountainJetsRef.current) {
      const isFountainActive = cityStage >= 3;
      parkFountainJetsRef.current.children.forEach((jet, i) => {
        const h = isFountainActive ? fountainHeightRef.current : 0.05;
        if (i === 0) {
          // Center main geyser
          jet.scale.set(1, Math.max(0.04, h * (1.15 + Math.sin(t * 3.8) * 0.2)), 1);
        } else {
          // Perimeter dancing arc jets
          jet.scale.set(1, Math.max(0.04, h * (0.65 + Math.sin(t * 4.2 + i * 1.0) * 0.18)), 1);
        }
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
            <cylinderGeometry args={[0.12, 0.26, 6.4, 12]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Nacelle Housing (Generator Box Atop Mast) */}
          <mesh position={[0, 6.4, -0.1]} castShadow>
            <boxGeometry args={[0.42, 0.44, 0.95]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Generator Heat Sink / Aerodynamic Tail Fin */}
          <mesh position={[0, 6.65, -0.52]}>
            <boxGeometry args={[0.04, 0.35, 0.45]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} />
          </mesh>

          {/* 3-Blade Rotating Rotor Assembly (Center at [0, 6.4, 0.42]) */}
          <group ref={turbineRef} position={[0, 6.4, 0.4]}>
            {/* Aerodynamic Nose Cone Hub */}
            <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <coneGeometry args={[0.22, 0.32, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.25} />
            </mesh>
            {/* 3 Radiating Airfoil Blades */}
            {[0, 1, 2].map((bladeIdx) => (
              <group key={bladeIdx} rotation={[0, 0, (bladeIdx * Math.PI * 2) / 3]}>
                {/* Main Airfoil Blade */}
                <mesh position={[0, 1.15, 0]} castShadow>
                  <boxGeometry args={[0.14, 2.3, 0.03]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.25} />
                </mesh>
                {/* Red High-Visibility Aerodynamic Tip */}
                <mesh position={[0, 2.22, 0]}>
                  <boxGeometry args={[0.15, 0.16, 0.035]} />
                  <meshStandardMaterial color="#ef4444" roughness={0.4} />
                </mesh>
              </group>
            ))}
          </group>
        </group>

        {/* ── DUAL WORKING MERCURY THERMOMETERS (INDEPENDENT BLUE & RED) ── */}
        {/* Blue Team Thermometer */}
        <group position={[1.8, 1.2, 1.8]}>
          {/* Mounting Backboard with Blue Header */}
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[0.7, 3.8, 0.2]} />
            <meshStandardMaterial color="#eff6ff" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.6, 0.12]}>
            <boxGeometry args={[0.6, 0.25, 0.05]} />
            <meshStandardMaterial color="#2563eb" emissive="#1d4ed8" emissiveIntensity={0.8} />
          </mesh>
          {/* Glass Tube */}
          <mesh position={[0, 1.8, 0.12]}>
            <cylinderGeometry args={[0.1, 0.1, 3.0, 12]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.4} roughness={0.1} />
          </mesh>
          {/* Live Rising/Falling Mercury Column */}
          <mesh ref={blueMercuryRef} position={[0, 1.1, 0.12]}>
            <cylinderGeometry args={[0.07, 0.07, 2.6, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
          {/* Blue Mercury Bulb */}
          <mesh position={[0, 0.3, 0.12]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#2563eb" emissive="#1d4ed8" emissiveIntensity={0.9} />
          </mesh>
        </group>

        {/* Red Team Thermometer */}
        <group position={[3.1, 1.2, 1.8]}>
          {/* Mounting Backboard with Red Header */}
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[0.7, 3.8, 0.2]} />
            <meshStandardMaterial color="#fef2f2" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.6, 0.12]}>
            <boxGeometry args={[0.6, 0.25, 0.05]} />
            <meshStandardMaterial color="#dc2626" emissive="#b91c1c" emissiveIntensity={0.8} />
          </mesh>
          {/* Glass Tube */}
          <mesh position={[0, 1.8, 0.12]}>
            <cylinderGeometry args={[0.1, 0.1, 3.0, 12]} />
            <meshStandardMaterial color="#ffe4e6" transparent opacity={0.4} roughness={0.1} />
          </mesh>
          {/* Live Rising/Falling Mercury Column */}
          <mesh ref={redMercuryRef} position={[0, 1.1, 0.12]}>
            <cylinderGeometry args={[0.07, 0.07, 2.6, 12]} />
            <meshStandardMaterial color="#f87171" emissive="#dc2626" emissiveIntensity={0.8} />
          </mesh>
          {/* Red Mercury Bulb */}
          <mesh position={[0, 0.3, 0.12]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#dc2626" emissive="#b91c1c" emissiveIntensity={0.9} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 2. WATER TREATMENT PLANT DISTRICT (DUAL RESERVOIRS)          */}
      {/* ============================================================ */}
      <group position={[-16, 0, -11]}>
        {/* Foundation Slab */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[10.5, 0.2, 6.5]} />
          <primitive object={CITY_MAT.concrete} attach="material" />
        </mesh>

        {/* Filtration & Pump Building */}
        <mesh position={[-2.6, 1.4, -0.8]} castShadow>
          <boxGeometry args={[4.2, 2.6, 3.8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Building Blue Roof */}
        <mesh position={[-2.6, 2.8, -0.8]} castShadow>
          <boxGeometry args={[4.4, 0.25, 4.0]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>

        {/* Circular Clarifier Basin 1 */}
        <group position={[1.8, 0.4, -1.2]}>
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

        {/* ── DUAL RESERVOIR TANKS (INDEPENDENT BLUE & RED WATER LEVELS) ── */}
        {/* Blue Team Reservoir Tank */}
        <group position={[0.8, 0.2, 1.6]}>
          {/* Blue Label Badge */}
          <mesh position={[0, 2.7, 0]}>
            <boxGeometry args={[1.2, 0.22, 0.05]} />
            <meshStandardMaterial color="#2563eb" emissive="#1d4ed8" emissiveIntensity={0.8} />
          </mesh>
          {/* Transparent Glass/Poly Tank Casing */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 2.4, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} transparent opacity={0.32} roughness={0.1} />
          </mesh>
          {/* Physical Water Level Inside Tank */}
          <mesh ref={blueWaterCylRef} position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.94, 0.94, 2.2, 16]} />
            <meshStandardMaterial color="#0ea5e9" transparent opacity={0.85} roughness={0.1} />
          </mesh>
          {/* Metallic Top Dome */}
          <mesh position={[0, 2.4, 0]}>
            <sphereGeometry args={[1.02, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
        </group>

        {/* Red Team Reservoir Tank */}
        <group position={[3.4, 0.2, 1.6]}>
          {/* Red Label Badge */}
          <mesh position={[0, 2.7, 0]}>
            <boxGeometry args={[1.2, 0.22, 0.05]} />
            <meshStandardMaterial color="#dc2626" emissive="#b91c1c" emissiveIntensity={0.8} />
          </mesh>
          {/* Transparent Glass/Poly Tank Casing */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 2.4, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} transparent opacity={0.32} roughness={0.1} />
          </mesh>
          {/* Physical Water Level Inside Tank */}
          <mesh ref={redWaterCylRef} position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.94, 0.94, 2.2, 16]} />
            <meshStandardMaterial color="#f43f5e" transparent opacity={0.85} roughness={0.1} />
          </mesh>
          {/* Metallic Top Dome */}
          <mesh position={[0, 2.4, 0]}>
            <sphereGeometry args={[1.02, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 3. ECO-POWER STATION DISTRICT (DUAL SUBSTATION CORONAS)       */}
      {/* ============================================================ */}
      <group position={[18, 0, -10]}>
        {/* Concrete Yard */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[10.5, 0.2, 7.0]} />
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

        {/* Hyperbolic Natural-Draft Cooling Tower (Steam scales with power!) */}
        <group position={[-2.8, 0.2, 0.8]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[1.1, 1.6, 4.2, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
          {/* Rising White Steam Clouds */}
          <group ref={steamRef} position={[0, 0, 0]}>
            {[0, 1, 2, 3].map((idx) => (
              <mesh key={idx} position={[0, 4.3 + idx * 0.6, 0]} geometry={CITY_GEO.sphere}>
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

        {/* High-Voltage Substation with Dual Corona Rings */}
        <group position={[3.6, 0.2, 2.0]}>
          <mesh position={[0, 2.8, 0]}>
            <cylinderGeometry args={[0.06, 0.18, 5.6, 4]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 4.5, 0]}>
            <boxGeometry args={[2.4, 0.1, 0.1]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          {/* Blue Corona Discharge Ring */}
          <mesh ref={blueCoronaRef} position={[-0.8, 4.5, 0]}>
            <torusGeometry args={[0.3, 0.04, 8, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.0} />
          </mesh>
          {/* Red Corona Discharge Ring */}
          <mesh ref={redCoronaRef} position={[0.8, 4.5, 0]}>
            <torusGeometry args={[0.3, 0.04, 8, 16]} />
            <meshStandardMaterial color="#f87171" emissive="#dc2626" emissiveIntensity={1.0} />
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

        {/* Platform Safety Edge Line (Yellow) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.82, 1.75]}>
          <planeGeometry args={[17, 0.15]} />
          <meshStandardMaterial color="#facc15" roughness={0.5} />
        </mesh>

        {/* Flat Modern Station Roof Canopy */}
        <mesh position={[0, 3.6, 0]} castShadow>
          <boxGeometry args={[16, 0.15, 4.2]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Canopy underside (warm glow) */}
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[15.6, 0.04, 3.8]} />
          <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={0.4} />
        </mesh>

        {/* 6 Steel Support Columns for Canopy */}
        {[-6, -2, 2, 6].map((cx) => (
          <React.Fragment key={cx}>
            <mesh position={[cx, 2.0, -1.6]} castShadow>
              <cylinderGeometry args={[0.08, 0.1, 3.2, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[cx, 2.0, 1.6]} castShadow>
              <cylinderGeometry args={[0.08, 0.1, 3.2, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Station Signage Board */}
        <mesh position={[0, 3.2, 1.95]}>
          <boxGeometry args={[4.0, 0.45, 0.06]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.2, 2.0]}>
          <boxGeometry args={[3.6, 0.3, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>

        {/* Two Small Waiting Shelters */}
        {[-5.0, 5.0].map((sx) => (
          <group key={sx} position={[sx, 0.82, -1.0]}>
            {/* Bench */}
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[1.2, 0.08, 0.35]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
            {[-0.5, 0.5].map((lx) => (
              <mesh key={lx} position={[lx, 0.11, 0]}>
                <boxGeometry args={[0.06, 0.22, 0.3]} />
                <meshStandardMaterial color="#334155" metalness={0.7} />
              </mesh>
            ))}
          </group>
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
      {/* 5. TRAFFIC JUNCTION DISTRICT (Multi-Lane Interchange & Crosswalks) */}
      {/* ============================================================ */}
      <group position={[0, 0, 5.5]}>
        {/* Zebra Pedestrian Crosswalks (Connecting Park Promenade to Civic Plaza) */}
        {[-5.0, 5.0].map((cx) => (
          <group key={cx} position={[cx, 0.026, 0]}>
            {/* 6 High-Visibility White Zebra Stripes */}
            {[-1.3, -0.8, -0.3, 0.2, 0.7, 1.2].map((sz, si) => (
              <mesh key={si} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, sz]}>
                <planeGeometry args={[1.6, 0.35]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
            ))}
            {/* Yellow Tactile Paving Warning Strips on Curb */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, -1.9]}>
              <planeGeometry args={[1.8, 0.25]} />
              <meshStandardMaterial color="#facc15" roughness={0.8} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 1.9]}>
              <planeGeometry args={[1.8, 0.25]} />
              <meshStandardMaterial color="#facc15" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Sleek Roadside 3-Aspect LED Traffic Signals (Unobstructed View) */}
        {[-8.5, 8.5].map((tx) => (
          <group key={tx} position={[tx, 0, -2.4]}>
            {/* Pole */}
            <mesh position={[0, 2.0, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 4.0, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            {/* Black Signal Head */}
            <mesh position={[0, 3.5, 0.15]}>
              <boxGeometry args={[0.32, 0.9, 0.22]} />
              <meshStandardMaterial color="#0f172a" roughness={0.6} />
            </mesh>
            {/* Red Light */}
            <mesh position={[0, 3.8, 0.28]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.4} />
            </mesh>
            {/* Amber Light */}
            <mesh position={[0, 3.5, 0.28]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
            </mesh>
            {/* Green Light */}
            <mesh position={[0, 3.2, 0.28]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
            </mesh>
            {/* Pedestrian Push-Button Signal Housing */}
            <mesh position={[0, 1.2, 0.12]}>
              <boxGeometry args={[0.16, 0.26, 0.12]} />
              <meshStandardMaterial color="#facc15" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 6. BOTANICAL CITY PARK DISTRICT & GRAND CIVIC FOUNTAIN       */}
      {/* ============================================================ */}
      <group position={[0, 0, 11]}>
        {/* Park Lush Grass Mound */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <planeGeometry args={[18, 7.5]} />
          <primitive object={CITY_MAT.parkLush} attach="material" />
        </mesh>

        {/* Cobblestone Promenade Walkway */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[16, 1.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} />
        </mesh>

        {/* ── GRAND BOTANICAL GARDEN FOUNTAIN ── */}
        <group position={[0, 0, 0]}>
          {/* Circular Granite Terrace Apron */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <circleGeometry args={[2.5, 32]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
            <ringGeometry args={[2.4, 2.55, 32]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
          </mesh>

          {/* Raised Dark Slate Fountain Curb */}
          <mesh position={[0, 0.16, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[2.02, 2.15, 0.28, 32]} />
            <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.2} />
          </mesh>
          {/* Polished Granite Curb Rim */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[2.05, 2.05, 0.04, 32]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.3} />
          </mesh>

          {/* Tier 1 Great Fountain Basin (Carved Stone with Coping) */}
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.72, 1.82, 0.38, 28]} />
            <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.15} />
          </mesh>
          <mesh position={[0, 0.63, 0]}>
            <cylinderGeometry args={[1.76, 1.76, 0.04, 28]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.35} metalness={0.2} />
          </mesh>

          {/* Dark Wet Slate Basin Interior Floor */}
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[1.62, 1.62, 0.04, 28]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} />
          </mesh>

          {/* Shimmering Deep Aqua Pool Water Surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.54, 0]}>
            <circleGeometry args={[1.65, 28]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.05}
              metalness={0.3}
              transparent
              opacity={0.92}
            />
          </mesh>
          {/* Animated Water Ripple Mesh */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.545, 0]}>
            <ringGeometry args={[0.35, 1.6, 28]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              transparent
              opacity={cityStage >= 3 ? 0.65 : 0.25}
            />
          </mesh>

          {/* Tier 2 Classical Center Pedestal (Carved Limestone) */}
          <mesh position={[0, 0.76, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.48, 0.64, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.15} />
          </mesh>
          {/* 4 Bronze Water Spouts */}
          {[0, 1, 2, 3].map((si) => {
            const sAngle = (si / 4) * Math.PI * 2;
            return (
              <mesh
                key={si}
                position={[Math.cos(sAngle) * 0.42, 0.88, Math.sin(sAngle) * 0.42]}
                rotation={[0, -sAngle, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.035, 0.05, 0.12, 8]} />
                <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
              </mesh>
            );
          })}

          {/* Tier 2 Elevated Overflow Basin Bowl */}
          <mesh position={[0, 1.06, 0]} castShadow>
            <cylinderGeometry args={[0.82, 0.52, 0.24, 20]} />
            <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.15} />
          </mesh>
          <mesh position={[0, 1.18, 0]}>
            <cylinderGeometry args={[0.84, 0.84, 0.03, 20]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Upper Basin Aqua Water */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.17, 0]}>
            <circleGeometry args={[0.78, 20]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.05}
              transparent
              opacity={0.94}
            />
          </mesh>

          {/* Cascading Water Curtains (Spilling from Upper Bowl to Lower Pool) */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.8, 1.35, 0.58, 20, 1, true]} />
            <meshStandardMaterial
              color="#bae6fd"
              transparent
              opacity={cityStage >= 3 ? 0.72 : 0.15}
              roughness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Tier 3 Central Spire & Bronze Finial */}
          <mesh position={[0, 1.34, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.2, 0.38, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.54, 0]} castShadow>
            <coneGeometry args={[0.09, 0.24, 8]} />
            <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Submerged Pool LED Glow Lighting */}
          <pointLight
            color="#38bdf8"
            intensity={cityStage >= 3 ? 2.5 : 0.8}
            distance={6.0}
            position={[0, 0.7, 0]}
          />

          {/* Dynamic Dancing Fountain Water Jets */}
          <group ref={parkFountainJetsRef}>
            {/* Center High Geyser Plume */}
            <mesh position={[0, 1.62, 0]}>
              <cylinderGeometry args={[0.055, 0.11, 2.2, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#bae6fd"
                emissiveIntensity={0.6}
                transparent
                opacity={0.88}
                roughness={0.1}
              />
            </mesh>
            {/* 8 Perimeter Parabolic Inward Arc Jets */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((ji) => {
              const jAngle = (ji / 8) * Math.PI * 2;
              const jx = Math.cos(jAngle) * 1.15;
              const jz = Math.sin(jAngle) * 1.15;
              return (
                <group key={ji} position={[jx, 0.62, jz]}>
                  {/* Splash foam base ring */}
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                    <circleGeometry args={[0.11, 8]} />
                    <meshStandardMaterial color="#ffffff" transparent opacity={0.75} />
                  </mesh>
                  {/* Angled Arc Jet */}
                  <mesh
                    rotation={[-Math.sin(jAngle) * 0.35, 0, Math.cos(jAngle) * 0.35]}
                    position={[0, 0.45, 0]}
                  >
                    <cylinderGeometry args={[0.03, 0.055, 1.05, 6]} />
                    <meshStandardMaterial
                      color="#bae6fd"
                      emissive="#38bdf8"
                      emissiveIntensity={0.4}
                      transparent
                      opacity={0.85}
                      roughness={0.1}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>

          {/* Rose Flowerbeds Framing the Fountain */}
          {[-2.9, 2.9].map((fx) => (
            <group key={fx} position={[fx, 0.06, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.55, 12]} />
                <meshStandardMaterial color="#15803d" roughness={0.8} />
              </mesh>
              {/* Colorful Flowers */}
              {[0, 1, 2, 3, 4].map((fl) => {
                const fAngle = (fl / 5) * Math.PI * 2;
                return (
                  <mesh
                    key={fl}
                    position={[Math.cos(fAngle) * 0.28, 0.09, Math.sin(fAngle) * 0.28]}
                  >
                    <sphereGeometry args={[0.08, 6, 6]} />
                    <meshStandardMaterial
                      color={fl % 2 === 0 ? '#f43f5e' : '#fbbf24'}
                      roughness={0.6}
                    />
                  </mesh>
                );
              })}
            </group>
          ))}
        </group>

        {/* Park Promenade Benches */}
        {[-4.8, 4.8].map((bx) => (
          <group key={bx} position={[bx, 0.1, 0.8]}>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[1.2, 0.08, 0.38]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
            {[-0.5, 0.5].map((lx) => (
              <mesh key={lx} position={[lx, 0.12, 0]}>
                <boxGeometry args={[0.06, 0.24, 0.32]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
