// ============================================================
// GRAPHWORKS — THE DATA CITY: 5-Question City Event 3D Visuals
// Brings the 10 distinct city events to life in the continuous 3D world:
// 1. Morning Alive (Sunrise, dawn glow, waking systems)
// 2. Weather Day (Data-driven rain particles, puddles, clearing sky)
// 3. Traffic Rush (Junction signals, queuing markers, flow controls)
// 4. Water Operation (Flowing hydro conduits, surging plaza fountain)
// 5. Power Surge (Substation corona arcs, transmission pulse waves)
// 6. Train Day (Platform departure signals, viaduct speed ribbons)
// 7. Park Festival (Striped pavilions, string lantern bunting, crowd)
// 8. City Development (Yellow tower crane, hoist cable, rising modern high-rise)
//    *PERSISTENT: newly built building remains standing!*
// 9. Grand Data Festival (Plaza celebration banners, confetti particles)
// 10. The Data Crisis (Emergency beacon, hazard containment, green rescue)
// ============================================================
'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGraphworksStore } from '../store/graphworksStore';
import { CITY_GEO, CITY_MAT } from './CityMaterials';

// ── 1. RAIN SYSTEM FOR WEATHER DAY (EVENT 2) ──
function EventRainSystem({ intensity, isClearing }: { intensity: number; isClearing: boolean }) {
  const count = 350;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Precomputed rain particle positions & velocities
  const rainData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 60,
      y: Math.random() * 26 + 2,
      z: (Math.random() - 0.5) * 45,
      speed: 28 + Math.random() * 16,
      slant: (Math.random() - 0.5) * 0.1,
    }));
  }, [count]);

  const rainMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#93c5fd',
      transparent: true,
      opacity: 0.65,
    });
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetOpacity = isClearing ? 0 : Math.min(0.75, Math.max(0.15, intensity * 0.7));
    rainMat.opacity = THREE.MathUtils.damp(rainMat.opacity, targetOpacity, 3.0, delta);

    if (rainMat.opacity < 0.02) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    for (let i = 0; i < count; i++) {
      const p = rainData[i];
      p.y -= delta * p.speed * (0.8 + intensity * 0.5);
      p.x += delta * p.slant * p.speed;

      if (p.y < 0.1) {
        p.y = 26 + Math.random() * 3;
        p.x = (Math.random() - 0.5) * 60;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(0.04, 0.75 + intensity * 0.4, 0.04);
      dummy.rotation.set(0.1, 0, -p.slant * 2);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[CITY_GEO.cylinder6, rainMat, count]}
      frustumCulled={false}
    />
  );
}

// ── 2. TOWER CRANE & MODULAR MODERN BUILDING (EVENT 8 & PERSISTENT) ──
function ConstructionDevelopmentVisuals({
  floorsCount,
  isEventActive,
  phase,
}: {
  floorsCount: number;
  isEventActive: boolean;
  phase: number;
}) {
  const craneGroupRef = useRef<THREE.Group>(null);
  const trolleyRef = useRef<THREE.Group>(null);
  const cableRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Group>(null);

  // Construction site position in the modern development zone
  const sitePos: [number, number, number] = [18, 0, -10];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (isEventActive) {
      // Smooth sinusoidal slewing of the crane jib
      if (craneGroupRef.current) {
        craneGroupRef.current.rotation.y = Math.sin(t * 0.45) * 0.75 + 0.3;
      }
      // Trolley traverses back and forth along the jib arm
      if (trolleyRef.current) {
        const trolleyX = 4.5 + Math.sin(t * 0.6) * 3.5;
        trolleyRef.current.position.x = trolleyX;

        // Hoist cable and suspended steel beam
        const cableLength = 4.2 + Math.cos(t * 0.8) * 1.8;
        if (cableRef.current) {
          cableRef.current.scale.y = cableLength;
          cableRef.current.position.y = -cableLength / 2;
        }
        if (beamRef.current) {
          beamRef.current.position.y = -cableLength;
          beamRef.current.rotation.y = Math.sin(t * 0.9) * 0.2;
        }
      }
    }
  });

  // Determine effective floors to display (either built or currently building)
  const effectiveFloors = Math.max(floorsCount, isEventActive ? phase : 0);

  return (
    <group position={sitePos}>
      {/* ── GROUND PERIMETER / SAFETY FENCE ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Safety Hazard Cones around perimeter */}
      {isEventActive && (
        <group>
          {[
            [-5.5, 0, -4.5],
            [5.5, 0, -4.5],
            [-5.5, 0, 4.5],
            [5.5, 0, 4.5],
            [0, 0, 4.5],
            [-3, 0, 4.5],
            [3, 0, 4.5],
          ].map((pos, idx) => (
            <group key={idx} position={pos as [number, number, number]}>
              <mesh position={[0, 0.3, 0]} geometry={CITY_GEO.cone} scale={[0.18, 0.6, 0.18]}>
                <meshStandardMaterial color="#f97316" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.25, 0]} geometry={CITY_GEO.cylinder8} scale={[0.13, 0.12, 0.13]}>
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* ── ANIMATED TOWER CRANE (Active during Event 8) ── */}
      {isEventActive && (
        <group position={[-4.5, 0, 0]}>
          {/* Concrete crane base ballast */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[2.2, 0.7, 2.2]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>

          {/* Vertical Lattice Mast */}
          <mesh position={[0, 7.5, 0]} castShadow>
            <boxGeometry args={[0.7, 14, 0.7]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Crane ladder & internal cross bracings */}
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} position={[0, 2 + i * 1.8, 0]}>
              <boxGeometry args={[0.82, 0.12, 0.82]} />
              <meshStandardMaterial color="#ca8a04" roughness={0.5} />
            </mesh>
          ))}

          {/* Slew Platform & Rotating Jib Assembly */}
          <group ref={craneGroupRef} position={[0, 14.5, 0]}>
            {/* Operator Cabin */}
            <mesh position={[0.7, -0.4, 0.4]} castShadow>
              <boxGeometry args={[1.0, 1.2, 0.8]} />
              <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Cabin Glass Window */}
            <mesh position={[1.15, -0.4, 0.4]}>
              <boxGeometry args={[0.12, 0.7, 0.6]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.8} />
            </mesh>

            {/* Counter-Jib (Rear Arm with Concrete Ballast Blocks) */}
            <mesh position={[-2.8, 0.3, 0]} castShadow>
              <boxGeometry args={[4.8, 0.45, 0.5]} />
              <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[-4.5, 0.1, 0]} castShadow>
              <boxGeometry args={[1.5, 1.0, 1.2]} />
              <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>

            {/* Crane A-Frame Apex Tower */}
            <mesh position={[0, 1.4, 0]}>
              <coneGeometry args={[0.6, 2.6, 4]} />
              <meshStandardMaterial color="#ca8a04" roughness={0.5} metalness={0.5} />
            </mesh>

            {/* Main Horizontal Working Jib Arm (12m long) */}
            <mesh position={[5.5, 0.3, 0]} castShadow>
              <boxGeometry args={[11, 0.45, 0.5]} />
              <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Tie Rod Cables from Apex to Jib */}
            <mesh position={[4.0, 0.9, 0]} rotation={[0, 0, -0.22]}>
              <cylinderGeometry args={[0.025, 0.025, 7.8, 4]} />
              <meshBasicMaterial color="#94a3b8" />
            </mesh>

            {/* Trolley traveling along the Jib */}
            <group ref={trolleyRef} position={[4.5, 0, 0]}>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[0.6, 0.3, 0.6]} />
                <meshStandardMaterial color="#1e293b" roughness={0.5} />
              </mesh>

              {/* Steel Hoist Cable */}
              <mesh ref={cableRef} position={[0, -2, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1, 4]} />
                <meshBasicMaterial color="#cbd5e1" />
              </mesh>

              {/* Suspended Steel I-Beam */}
              <group ref={beamRef} position={[0, -4, 0]}>
                {/* Steel I-beam web & flanges */}
                <mesh castShadow>
                  <boxGeometry args={[3.2, 0.32, 0.25]} />
                  <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.16, 0]}>
                  <boxGeometry args={[3.2, 0.06, 0.5]} />
                  <meshStandardMaterial color="#ca8a04" roughness={0.4} metalness={0.7} />
                </mesh>
                <mesh position={[0, -0.16, 0]}>
                  <boxGeometry args={[3.2, 0.06, 0.5]} />
                  <meshStandardMaterial color="#ca8a04" roughness={0.4} metalness={0.7} />
                </mesh>
                {/* Rigging cables */}
                <mesh position={[-1.2, 0.4, 0]} rotation={[0, 0, 0.4]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.9, 4]} />
                  <meshBasicMaterial color="#94a3b8" />
                </mesh>
                <mesh position={[1.2, 0.4, 0]} rotation={[0, 0, -0.4]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.9, 4]} />
                  <meshBasicMaterial color="#94a3b8" />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      )}

      {/* ── MODULAR MODERN BUILDING (Rises floor-by-floor & stays permanent) ── */}
      <group position={[1.5, 0, 0]}>
        {/* FLOOR 1: Grand Lobby & Atrium (Built in Q36 / Phase 1) */}
        {effectiveFloors >= 1 && (
          <group position={[0, 1.4, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[5.2, 2.8, 5.2]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Double-height glass entrance */}
            <mesh position={[0, 0, 2.62]}>
              <planeGeometry args={[4.4, 2.3]} />
              <meshStandardMaterial
                color="#67e8f9"
                roughness={0.1}
                metalness={0.7}
                emissive="#0284c7"
                emissiveIntensity={0.3}
                transparent
                opacity={0.88}
              />
            </mesh>
            {/* Concrete columns */}
            {[-2.3, 2.3].map((cx, i) => (
              <mesh key={i} position={[cx, 0, 2.55]} geometry={CITY_GEO.cylinder8} scale={[0.18, 2.8, 0.18]}>
                <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
              </mesh>
            ))}
          </group>
        )}

        {/* FLOOR 2: Architectural Glass Office Floor (Built in Q37 / Phase 2) */}
        {effectiveFloors >= 2 && (
          <group position={[0, 4.0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[5.0, 2.4, 5.0]} />
              <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Modern Ribbon Windows */}
            {[-2.52, 2.52].map((pz, i) => (
              <mesh key={i} position={[0, 0, pz]}>
                <planeGeometry args={[4.6, 1.6]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  roughness={0.1}
                  metalness={0.8}
                  emissive="#0369a1"
                  emissiveIntensity={0.35}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* FLOOR 3: Mid Commercial Tier with Balcony (Built in Q38 / Phase 3) */}
        {effectiveFloors >= 3 && (
          <group position={[0, 6.4, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4.8, 2.4, 4.8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Cantilevered Glass Balcony */}
            <mesh position={[0, -0.9, 2.7]} castShadow>
              <boxGeometry args={[4.2, 0.25, 0.9]} />
              <meshStandardMaterial color="#64748b" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.4, 3.1]}>
              <boxGeometry args={[4.2, 0.8, 0.08]} />
              <meshStandardMaterial color="#67e8f9" transparent opacity={0.65} />
            </mesh>
          </group>
        )}

        {/* FLOOR 4: Executive Glass Suite (Built in Q39 / Phase 4) */}
        {effectiveFloors >= 4 && (
          <group position={[0, 8.8, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4.6, 2.4, 4.6]} />
              <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0, 2.32]}>
              <planeGeometry args={[4.0, 1.8]} />
              <meshStandardMaterial
                color="#67e8f9"
                roughness={0.1}
                emissive="#0284c7"
                emissiveIntensity={0.4}
              />
            </mesh>
          </group>
        )}

        {/* FLOOR 5: Penthouse & Rooftop Communications Spire (Built in Q40 / Phase 5) */}
        {effectiveFloors >= 5 && (
          <group position={[0, 11.0, 0]}>
            {/* Penthouse glass pavilion */}
            <mesh castShadow>
              <boxGeometry args={[3.8, 2.0, 3.8]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.4} />
            </mesh>
            {/* Rooftop Solar Canopy */}
            <mesh position={[0, 1.25, 0]} rotation={[0.08, 0, 0]}>
              <boxGeometry args={[4.4, 0.12, 4.4]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Communications Mast with Aviation Beacon */}
            <mesh position={[0, 2.6, 0]}>
              <cylinderGeometry args={[0.04, 0.08, 2.6, 6]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Flashing Red Aviation Strobe */}
            <mesh position={[0, 3.9, 0]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

// ── 3. BOTANICAL PARK FESTIVAL VISUALS (EVENT 7) ──
function ParkFestivalVisuals({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <group position={[-16, 0, -8]}>
      {/* Festival Pavilion 1: Striped Coral/White Canopy */}
      <group position={[-3.2, 0, 2.2]}>
        {/* Wooden Counter */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2.0, 1.0, 1.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Support poles */}
        {[-0.9, 0.9].map((px) =>
          [-0.5, 0.5].map((pz) => (
            <mesh key={`${px}-${pz}`} position={[px, 1.2, pz]}>
              <cylinderGeometry args={[0.03, 0.03, 1.4, 6]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
          ))
        )}
        {/* Striped Canopy */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <coneGeometry args={[1.5, 0.7, 4]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.6} />
        </mesh>
      </group>

      {/* Festival Pavilion 2: Blue/White Canopy */}
      <group position={[3.2, 0, 1.8]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2.0, 1.0, 1.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 2.1, 0]} castShadow>
          <coneGeometry args={[1.5, 0.7, 4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>
      </group>

      {/* Festive Bunting / Garland string lights across path */}
      <group position={[0, 2.4, 2.0]}>
        {[-2.0, -1.0, 0, 1.0, 2.0].map((lx, idx) => (
          <mesh key={idx} position={[lx, -Math.sin(idx * 0.7) * 0.25, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial
              color={idx % 3 === 0 ? '#facc15' : idx % 3 === 1 ? '#38bdf8' : '#ec4899'}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── 4. WATER DISTRICT SURGE FOUNTAIN (EVENT 4) ──
function WaterSurgeVisuals({ isActive, phase }: { isActive: boolean; phase: number }) {
  const sprayRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sprayRef.current && isActive) {
      const t = state.clock.getElapsedTime();
      sprayRef.current.children.forEach((jet, i) => {
        const height = (1.5 + phase * 0.6) + Math.sin(t * 6 + i) * 0.3;
        jet.scale.y = height;
        jet.position.y = height / 2;
      });
    }
  });

  if (!isActive && phase < 3) return null;

  return (
    <group position={[0, 0.3, 3.2]}>
      {/* Surging vertical jets at the plaza water feature */}
      <group ref={sprayRef}>
        {[-0.8, 0, 0.8].map((jx, idx) => (
          <mesh key={idx} position={[jx, 1.0, 0]}>
            <cylinderGeometry args={[0.06, 0.12, 1, 8]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              emissive="#0284c7"
              emissiveIntensity={0.6}
              transparent
              opacity={0.82}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── 5. DATA CRISIS HAZARD WARNING & RESCUE BEACON (EVENT 10) ──
function DataCrisisVisuals({ isActive, phase }: { isActive: boolean; phase: number }) {
  const beaconRef = useRef<THREE.Mesh>(null);
  const pulseRingsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (beaconRef.current) {
      if (phase >= 5) {
        // Crisis Resolved! Peaceful emerald green beacon
        (beaconRef.current.material as THREE.MeshStandardMaterial).color.set('#22c55e');
        (beaconRef.current.material as THREE.MeshStandardMaterial).emissive.set('#16a34a');
        (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2;
      } else {
        // Active Crisis: Rapid emergency amber/red flashing
        const flash = Math.sin(t * 8) > 0;
        const color = flash ? '#ef4444' : '#f59e0b';
        (beaconRef.current.material as THREE.MeshStandardMaterial).color.set(color);
        (beaconRef.current.material as THREE.MeshStandardMaterial).emissive.set(color);
        (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flash ? 1.8 : 0.4;
      }
    }

    if (pulseRingsRef.current && phase < 5) {
      pulseRingsRef.current.children.forEach((ring, i) => {
        const s = ((t * 1.5 + i * 0.8) % 2.5) * 4;
        ring.scale.set(s, s, s);
        (ring as THREE.Mesh).material = (ring as THREE.Mesh).material;
      });
    }
  });

  if (!isActive) return null;

  return (
    <group position={[0, 16.5, -4]}>
      {/* Tower Top Emergency / Rescue Strobe */}
      <mesh ref={beaconRef} castShadow>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1.5}
          roughness={0.1}
        />
      </mesh>

      {/* Expanding Emergency Hazard Rings */}
      {phase < 5 && (
        <group ref={pulseRingsRef} rotation={[-Math.PI / 2, 0, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} geometry={CITY_GEO.torus}>
              <meshBasicMaterial color="#f87171" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// ── 6. MORNING SUNRISE LIGHTING (EVENT 1) ──
function MorningSunriseLighting({ isActive, phase }: { isActive: boolean; phase: number }) {
  if (!isActive) return null;

  // Sunrise directional sun: climbs from low angle with warm golden glow
  const sunY = 12 + phase * 6;
  const sunIntensity = 1.0 + phase * 0.35;

  return (
    <group>
      <directionalLight
        position={[30, sunY, 20]}
        intensity={sunIntensity}
        color={phase < 3 ? '#fef08a' : '#fffdf0'}
      />
      {/* Soft morning bay mist layer */}
      {phase <= 3 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 26]}>
          <planeGeometry args={[110, 14]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.35 - phase * 0.08} />
        </mesh>
      )}
    </group>
  );
}

// ── MASTER 3D CITY EVENT VISUALS COMPONENT ──
export function CityEventVisuals3D() {
  const cityEventState = useGraphworksStore((s) => s.cityEventState);
  const blueCity = useGraphworksStore((s) => s.blueCity);
  const redCity = useGraphworksStore((s) => s.redCity);

  const eventCode = cityEventState?.currentEvent?.code ?? 'MORNING_ALIVE';
  const phase = cityEventState?.eventPhase ?? 1;
  const persistentState = cityEventState?.persistentState ?? {
    buildingFloorsBuilt: 0,
    waterReservoirFilled: false,
    powerGridStabilized: false,
    trainNetworkActive: false,
    morningAwake: false,
    crisisResolved: false,
  };

  // Weather state (Rain is strictly hidden unless the weather day event is active)
  const isWeatherEvent = eventCode === 'WEATHER_DAY';
  const isRaining = isWeatherEvent && (blueCity.weather.rainfall > 0 || redCity.weather.rainfall > 0 || blueCity.weather.isRaining || redCity.weather.isRaining);
  const rainIntensity = isWeatherEvent
    ? (phase / 5) * (blueCity.weather.temperature < 15 ? 1.0 : 0.6)
    : 0;
  const isRainClearing = isWeatherEvent && phase === 5;

  return (
    <group>
      {/* ── EVENT 1: MORNING CITY COMES ALIVE ── */}
      <MorningSunriseLighting isActive={eventCode === 'MORNING_ALIVE'} phase={phase} />

      {/* ── EVENT 2: WEATHER DAY RAIN PARTICLES ── */}
      {isRaining && (
        <EventRainSystem intensity={rainIntensity} isClearing={isRainClearing} />
      )}

      {/* ── EVENT 4: WATER CITY OPERATION ── */}
      <WaterSurgeVisuals isActive={eventCode === 'WATER_OPERATION'} phase={phase} />

      {/* ── EVENT 7: BOTANICAL PARK FESTIVAL ── */}
      <ParkFestivalVisuals isActive={eventCode === 'PARK_FESTIVAL'} />

      {/* ── EVENT 8: CITY DEVELOPMENT & PERSISTENT BUILDING ── */}
      <ConstructionDevelopmentVisuals
        floorsCount={persistentState.buildingFloorsBuilt}
        isEventActive={eventCode === 'CITY_DEVELOPMENT'}
        phase={phase}
      />

      {/* ── EVENT 10: THE DATA CRISIS RESOLUTION ── */}
      <DataCrisisVisuals isActive={eventCode === 'DATA_CRISIS'} phase={phase} />
    </group>
  );
}
