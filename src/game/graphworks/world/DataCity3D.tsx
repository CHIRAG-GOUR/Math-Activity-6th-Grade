// ============================================================
// GRAPHWORKS — THE DATA CITY: 3D World
// Central city with 6 data districts, alive with activity
// ============================================================
'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGraphworksStore } from '../store/graphworksStore';

// ── SHARED MATERIALS ──
const COLORS = {
  grass: '#4CAF50',
  grassDark: '#388E3C',
  road: '#546E7A',
  roadLine: '#FDD835',
  sidewalk: '#BDBDBD',
  water: '#29B6F6',
  waterDeep: '#0288D1',
  building1: '#ECEFF1',
  building2: '#E3F2FD',
  building3: '#FFF3E0',
  building4: '#F3E5F5',
  buildingAccent: '#1565C0',
  roof: '#D32F2F',
  roofBlue: '#1565C0',
  tree: '#2E7D32',
  treeTrunk: '#5D4037',
  sky: '#87CEEB',
  sand: '#FFF8E1',
  bridge: '#78909C',
  blueTeam: '#1976D2',
  redTeam: '#D32F2F',
  white: '#FFFFFF',
  metal: '#90A4AE',
  concrete: '#E0E0E0',
  glass: '#B3E5FC',
  yellow: '#FFC107',
  orange: '#FF9800',
};

// ── INSTANCED TREES ──
function CityTrees() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const trunkRef = useRef<THREE.InstancedMesh>(null);

  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    // Park area trees
    for (let i = 0; i < 20; i++) {
      positions.push([
        -5 + Math.random() * 10,
        0,
        8 + Math.random() * 6,
      ]);
    }
    // Along roads
    for (let i = 0; i < 15; i++) {
      positions.push([-20 + i * 2.8, 0, 3 + Math.random() * 0.5]);
    }
    for (let i = 0; i < 15; i++) {
      positions.push([-20 + i * 2.8, 0, -3 - Math.random() * 0.5]);
    }
    // Blue side
    for (let i = 0; i < 8; i++) {
      positions.push([-25 + Math.random() * 5, 0, -8 + Math.random() * 16]);
    }
    // Red side
    for (let i = 0; i < 8; i++) {
      positions.push([20 + Math.random() * 5, 0, -8 + Math.random() * 16]);
    }
    return positions;
  }, []);

  React.useEffect(() => {
    if (!meshRef.current || !trunkRef.current) return;
    const dummy = new THREE.Object3D();

    treePositions.forEach(([x, _, z], i) => {
      const scale = 0.6 + Math.random() * 0.6;
      // Canopy
      dummy.position.set(x, 1.5 * scale, z);
      dummy.scale.set(scale, scale * 1.2, scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      // Trunk
      dummy.position.set(x, 0.4 * scale, z);
      dummy.scale.set(0.15 * scale, 0.8 * scale, 0.15 * scale);
      dummy.updateMatrix();
      trunkRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    trunkRef.current.instanceMatrix.needsUpdate = true;
  }, [treePositions]);

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, treePositions.length]}>
        <dodecahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color={COLORS.tree} flatShading />
      </instancedMesh>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, treePositions.length]}>
        <cylinderGeometry args={[0.08, 0.12, 1, 6]} />
        <meshStandardMaterial color={COLORS.treeTrunk} />
      </instancedMesh>
    </>
  );
}

// ── CITY BUILDINGS ──
function CityBuildings() {
  const buildings = useMemo(() => {
    const b: { pos: [number, number, number]; size: [number, number, number]; color: string; hasWindows: boolean }[] = [];
    const colors = [COLORS.building1, COLORS.building2, COLORS.building3, COLORS.building4];

    // Central cluster
    for (let i = 0; i < 6; i++) {
      const h = 2 + Math.random() * 4;
      b.push({
        pos: [-4 + i * 1.6, h / 2, -6 - Math.random() * 3],
        size: [1 + Math.random() * 0.5, h, 1 + Math.random() * 0.5],
        color: colors[i % colors.length],
        hasWindows: true,
      });
    }

    // Blue side buildings
    for (let i = 0; i < 4; i++) {
      const h = 1.5 + Math.random() * 3;
      b.push({
        pos: [-18 + i * 2.5, h / 2, -5 - Math.random() * 4],
        size: [1.2 + Math.random() * 0.6, h, 1.2 + Math.random() * 0.6],
        color: colors[i % colors.length],
        hasWindows: true,
      });
    }

    // Red side buildings
    for (let i = 0; i < 4; i++) {
      const h = 1.5 + Math.random() * 3;
      b.push({
        pos: [12 + i * 2.5, h / 2, -5 - Math.random() * 4],
        size: [1.2 + Math.random() * 0.6, h, 1.2 + Math.random() * 0.6],
        color: colors[i % colors.length],
        hasWindows: true,
      });
    }

    // Houses near park
    for (let i = 0; i < 5; i++) {
      b.push({
        pos: [-12 + i * 3, 0.8, 6 + Math.random() * 2],
        size: [1.4, 1.6, 1.2],
        color: colors[i % colors.length],
        hasWindows: false,
      });
    }

    return b;
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i} position={b.pos}>
          {/* Main building body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial color={b.color} />
          </mesh>
          {/* Windows */}
          {b.hasWindows && Array.from({ length: Math.floor(b.size[1] / 0.8) }, (_, row) => (
            <React.Fragment key={row}>
              <mesh position={[b.size[0] / 2 + 0.01, -b.size[1] / 2 + 0.6 + row * 0.9, 0]}>
                <planeGeometry args={[0.3, 0.4]} />
                <meshStandardMaterial color={COLORS.glass} emissive="#4FC3F7" emissiveIntensity={0.3} />
              </mesh>
              <mesh position={[-b.size[0] / 2 - 0.01, -b.size[1] / 2 + 0.6 + row * 0.9, 0]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[0.3, 0.4]} />
                <meshStandardMaterial color={COLORS.glass} emissive="#4FC3F7" emissiveIntensity={0.3} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      ))}
    </group>
  );
}

// ── ROADS ──
function CityRoads() {
  return (
    <group>
      {/* Main horizontal road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[60, 3]} />
        <meshStandardMaterial color={COLORS.road} />
      </mesh>
      {/* Road center line */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-28 + i * 3, 0.025, 0]}>
          <planeGeometry args={[1.5, 0.1]} />
          <meshStandardMaterial color={COLORS.roadLine} />
        </mesh>
      ))}
      {/* Vertical road (through center) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -4]} receiveShadow>
        <planeGeometry args={[3, 16]} />
        <meshStandardMaterial color={COLORS.road} />
      </mesh>
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 2]}>
        <planeGeometry args={[60, 1]} />
        <meshStandardMaterial color={COLORS.sidewalk} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -2]}>
        <planeGeometry args={[60, 1]} />
        <meshStandardMaterial color={COLORS.sidewalk} />
      </mesh>
    </group>
  );
}

// ── WATER FEATURES ──
function CityWater() {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (waterRef.current) {
      waterRef.current.position.y = 0.01 + Math.sin(Date.now() * 0.001) * 0.02;
    }
  });

  return (
    <group>
      {/* River */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 14]}>
        <planeGeometry args={[50, 4]} />
        <meshStandardMaterial color={COLORS.water} transparent opacity={0.8} />
      </mesh>
      {/* River banks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 12]}>
        <planeGeometry args={[50, 0.5]} />
        <meshStandardMaterial color={COLORS.sand} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 16]}>
        <planeGeometry args={[50, 0.5]} />
        <meshStandardMaterial color={COLORS.sand} />
      </mesh>
      {/* Bridge */}
      <mesh position={[0, 0.3, 14]}>
        <boxGeometry args={[4, 0.15, 5]} />
        <meshStandardMaterial color={COLORS.bridge} />
      </mesh>
      {/* Bridge rails */}
      <mesh position={[-1.8, 0.6, 14]}>
        <boxGeometry args={[0.1, 0.5, 5]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      <mesh position={[1.8, 0.6, 14]}>
        <boxGeometry args={[0.1, 0.5, 5]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
    </group>
  );
}

// ── WEATHER STATION DISTRICT ──
function WeatherStation3D() {
  const blueCity = useGraphworksStore((s) => s.blueCity);
  const redCity = useGraphworksStore((s) => s.redCity);

  const weatherRef = useRef<THREE.Group>(null);
  const turbineRef = useRef<THREE.Mesh>(null);
  const thermometerRef = useRef<THREE.Mesh>(null);

  const avgTemp = (blueCity.weather.temperature + redCity.weather.temperature) / 2;
  const windSpeed = (blueCity.weather.windSpeed + redCity.weather.windSpeed) / 2;

  useFrame((_, delta) => {
    if (turbineRef.current) {
      turbineRef.current.rotation.z += delta * windSpeed * 0.3;
    }
  });

  return (
    <group position={[-22, 0, -8]}>
      {/* Station building */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[3, 2.4, 2.5]} />
        <meshStandardMaterial color={COLORS.building1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.7, 0]} castShadow>
        <coneGeometry args={[2.2, 1, 4]} />
        <meshStandardMaterial color={COLORS.roof} />
      </mesh>
      {/* Weather tower */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      {/* Weather dome */}
      <mesh position={[0, 6.2, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={COLORS.white} />
      </mesh>
      {/* Wind turbine */}
      <group position={[3, 0, 0]}>
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 6, 6]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        <mesh ref={turbineRef} position={[0, 6, 0.2]}>
          <group>
            {[0, 1, 2].map((i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]} position={[0, 1, 0]}>
                <boxGeometry args={[0.15, 2, 0.05]} />
                <meshStandardMaterial color={COLORS.white} />
              </mesh>
            ))}
          </group>
        </mesh>
      </group>
      {/* Thermometer */}
      <group position={[-2, 0, 1]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
          <meshStandardMaterial color={COLORS.white} />
        </mesh>
        {/* Mercury level */}
        <mesh
          ref={thermometerRef}
          position={[0, 0.5 + (avgTemp / 40) * 1.5, 0.01]}
          scale={[1, Math.max(0.1, avgTemp / 40), 1]}
        >
          <cylinderGeometry args={[0.06, 0.06, 1.5, 8]} />
          <meshStandardMaterial color="#E53935" />
        </mesh>
        {/* Bulb */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#E53935" />
        </mesh>
      </group>
      {/* Rain collector */}
      <mesh position={[2, 0.4, 2]}>
        <cylinderGeometry args={[0.4, 0.3, 0.8, 8]} />
        <meshStandardMaterial color={COLORS.metal} transparent opacity={0.6} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0.01, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 0.6]} />
        <meshStandardMaterial color={COLORS.blueTeam} />
      </mesh>
    </group>
  );
}

// ── TRAFFIC JUNCTION DISTRICT ──
function TrafficJunction3D() {
  const carsRef = useRef<THREE.InstancedMesh>(null);

  const blueCity = useGraphworksStore((s) => s.blueCity);
  const vehicleCount = Math.min(20, Math.round(blueCity.traffic.vehicleCount / 5));

  useFrame((state) => {
    if (!carsRef.current) return;
    const dummy = new THREE.Object3D();
    const time = state.clock.elapsedTime;

    for (let i = 0; i < 20; i++) {
      if (i < vehicleCount) {
        const offset = i * 2.5;
        dummy.position.set(
          -15 + ((time * 2 + offset) % 30),
          0.3,
          i % 2 === 0 ? 0.8 : -0.8
        );
        dummy.scale.set(0.6, 0.4, 0.35);
        dummy.rotation.y = i % 2 === 0 ? 0 : Math.PI;
      } else {
        dummy.position.set(0, -100, 0);
        dummy.scale.set(0, 0, 0);
      }
      dummy.updateMatrix();
      carsRef.current.setMatrixAt(i, dummy.matrix);
    }
    carsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Traffic lights */}
      {[-8, 8].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 5, 6]} />
            <meshStandardMaterial color={COLORS.metal} />
          </mesh>
          <mesh position={[0, 4.5, 0.1]}>
            <boxGeometry args={[0.3, 0.8, 0.2]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, 4.7, 0.22]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#F44336" emissive="#F44336" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 4.5, 0.22]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FFC107" emissive="#FFC107" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 4.3, 0.22]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#4CAF50" emissive="#4CAF50" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
      {/* Cars (instanced) */}
      <instancedMesh ref={carsRef} args={[undefined, undefined, 20]}>
        <boxGeometry args={[1, 0.5, 0.6]} />
        <meshStandardMaterial color="#1976D2" />
      </instancedMesh>
    </group>
  );
}

// ── WATER PLANT DISTRICT ──
function WaterPlant3D() {
  const blueCity = useGraphworksStore((s) => s.blueCity);
  const waterLevel = blueCity.water.reservoirLevel / 100;

  return (
    <group position={[-12, 0, -10]}>
      {/* Main building */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 3]} />
        <meshStandardMaterial color="#E0F7FA" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[4.4, 0.3, 3.4]} />
        <meshStandardMaterial color={COLORS.buildingAccent} />
      </mesh>
      {/* Reservoir tank */}
      <mesh position={[3, 1, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 2, 12]} />
        <meshStandardMaterial color={COLORS.metal} transparent opacity={0.4} />
      </mesh>
      {/* Water inside tank */}
      <mesh position={[3, waterLevel, 0]} scale={[1, waterLevel, 1]}>
        <cylinderGeometry args={[1.1, 1.1, 2, 12]} />
        <meshStandardMaterial color={COLORS.water} transparent opacity={0.7} />
      </mesh>
      {/* Pipes */}
      <mesh position={[1.5, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
    </group>
  );
}

// ── POWER STATION DISTRICT ──
function PowerStation3D() {
  const blueCity = useGraphworksStore((s) => s.blueCity);
  const turbineRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (turbineRef.current) {
      turbineRef.current.rotation.y += delta * (blueCity.power.turbineRPM / 100);
    }
  });

  return (
    <group position={[15, 0, -10]}>
      {/* Station building */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[5, 4, 3]} />
        <meshStandardMaterial color="#ECEFF1" />
      </mesh>
      {/* Chimney */}
      <mesh position={[2, 4.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 5, 8]} />
        <meshStandardMaterial color={COLORS.concrete} />
      </mesh>
      {/* Turbine housing */}
      <mesh ref={turbineRef} position={[-2.5, 1.5, 2]}>
        <cylinderGeometry args={[0.8, 0.8, 1.5, 8]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      {/* Transmission tower */}
      <group position={[5, 0, 0]}>
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.05, 0.2, 6, 4]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        {/* Cross arms */}
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[2, 0.08, 0.08]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        <mesh position={[0, 4, 0]}>
          <boxGeometry args={[1.5, 0.08, 0.08]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      </group>
    </group>
  );
}

// ── TRAIN STATION DISTRICT ──
function TrainStation3D() {
  const blueCity = useGraphworksStore((s) => s.blueCity);
  const trainRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (trainRef.current) {
      const targetX = -20 + blueCity.train.trainPosition * 40;
      trainRef.current.position.x += (targetX - trainRef.current.position.x) * delta * 2;
    }
  });

  return (
    <group position={[0, 0, -14]}>
      {/* Platform */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[8, 0.6, 2]} />
        <meshStandardMaterial color={COLORS.concrete} />
      </mesh>
      {/* Platform roof */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[8, 0.1, 2.5]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      {/* Roof supports */}
      {[-3, 0, 3].map((x) => (
        <mesh key={x} position={[x, 1.4, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.2, 6]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      ))}
      {/* Rails */}
      <mesh position={[0, 0.05, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 0.8]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      {/* Rail lines */}
      {[-0.25, 0.25].map((z) => (
        <mesh key={z} position={[0, 0.08, 2 + z]}>
          <boxGeometry args={[40, 0.04, 0.04]} />
          <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Train */}
      <group ref={trainRef} position={[-8, 0.35, 2]}>
        {/* Locomotive */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.5, 1, 0.8]} />
          <meshStandardMaterial color={COLORS.blueTeam} />
        </mesh>
        <mesh position={[1.2, 0.8, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.7]} />
          <meshStandardMaterial color={COLORS.glass} />
        </mesh>
        {/* Cars */}
        {[1, 2].map((c) => (
          <mesh key={c} position={[-c * 2.8, 0.4, 0]}>
            <boxGeometry args={[2.4, 0.8, 0.75]} />
            <meshStandardMaterial color={c === 1 ? '#FFC107' : '#4CAF50'} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── CITY PARK DISTRICT ──
function CityPark3D() {
  const blueCity = useGraphworksStore((s) => s.blueCity);
  const fountainRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (fountainRef.current && blueCity.park.fountainActive) {
      fountainRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && i > 0) {
          child.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.3;
          child.scale.setScalar(0.8 + Math.sin(state.clock.elapsedTime * 4 + i * 0.5) * 0.2);
        }
      });
    }
  });

  return (
    <group position={[0, 0, 10]}>
      {/* Park ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color={COLORS.grass} />
      </mesh>
      {/* Walking paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[10, 0.5]} />
        <meshStandardMaterial color={COLORS.sand} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[2, 0.02, 1]}>
        <planeGeometry args={[5, 0.4]} />
        <meshStandardMaterial color={COLORS.sand} />
      </mesh>
      {/* Fountain */}
      <group ref={fountainRef} position={[0, 0, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[1, 1.2, 0.6, 12]} />
          <meshStandardMaterial color={COLORS.concrete} />
        </mesh>
        {/* Water jets */}
        {blueCity.park.fountainActive && [0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.4, 0.8, Math.sin(i * Math.PI / 2) * 0.4]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={COLORS.water} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
      {/* Playground */}
      <group position={[-4, 0, -1]}>
        {/* Swing frame */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.08, 2, 0.08]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        <mesh position={[1, 1, 0]}>
          <boxGeometry args={[0.08, 2, 0.08]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        <mesh position={[0.5, 2, 0]}>
          <boxGeometry args={[1.2, 0.06, 0.06]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      </group>
      {/* Benches */}
      {[[-2, 0, 2], [2, 0, 2], [5, 0, 0]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.06, 0.3]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
          <mesh position={[-0.3, 0.15, 0]}>
            <boxGeometry args={[0.06, 0.3, 0.25]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh position={[0.3, 0.15, 0]}>
            <boxGeometry args={[0.06, 0.3, 0.25]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── FLYING BIRDS ──
function FlyingBirds() {
  const birdsRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    if (!birdsRef.current) return;
    const dummy = new THREE.Object3D();
    const t = state.clock.elapsedTime;

    for (let i = 0; i < 12; i++) {
      const angle = t * 0.3 + i * 0.5;
      const radius = 8 + i * 2;
      dummy.position.set(
        Math.cos(angle) * radius,
        10 + Math.sin(t * 0.8 + i) * 2,
        Math.sin(angle) * radius
      );
      dummy.rotation.y = angle + Math.PI / 2;
      dummy.scale.set(0.15, 0.1, 0.15 + Math.sin(t * 6 + i) * 0.05);
      dummy.updateMatrix();
      birdsRef.current.setMatrixAt(i, dummy.matrix);
    }
    birdsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={birdsRef} args={[undefined, undefined, 12]}>
      <coneGeometry args={[0.5, 1, 3]} />
      <meshStandardMaterial color="#333" />
    </instancedMesh>
  );
}

// ── PEDESTRIANS ──
function Pedestrians() {
  const peopleRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    if (!peopleRef.current) return;
    const dummy = new THREE.Object3D();
    const t = state.clock.elapsedTime;

    for (let i = 0; i < 15; i++) {
      const speed = 0.3 + (i % 3) * 0.2;
      const xBase = -20 + ((t * speed + i * 4) % 40);
      const zBase = 1.8 + (i % 2) * 0.5;
      const bobble = Math.sin(t * 4 + i) * 0.05;

      dummy.position.set(xBase, 0.5 + bobble, i < 8 ? zBase : -zBase);
      dummy.scale.set(0.2, 0.5, 0.2);
      dummy.updateMatrix();
      peopleRef.current.setMatrixAt(i, dummy.matrix);
    }
    peopleRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={peopleRef} args={[undefined, undefined, 15]}>
      <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
      <meshStandardMaterial color="#5C6BC0" />
    </instancedMesh>
  );
}

// ── DISTANT MOUNTAINS ──
function Mountains() {
  return (
    <group position={[0, -1, -30]}>
      {[[-20, 6], [-8, 8], [5, 7], [18, 5], [30, 6.5]].map(([x, h], i) => (
        <mesh key={i} position={[x, h / 2, 0]}>
          <coneGeometry args={[8 + Math.random() * 4, h, 6]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#7986CB' : '#9FA8DA'} />
        </mesh>
      ))}
      {/* Snow caps */}
      {[[-8, 8], [5, 7], [30, 6.5]].map(([x, h], i) => (
        <mesh key={`snow-${i}`} position={[x, h - 0.5, 0]}>
          <coneGeometry args={[3, 2, 6]} />
          <meshStandardMaterial color="#E8EAF6" />
        </mesh>
      ))}
    </group>
  );
}

// ── CLOUDS ──
function Clouds() {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, i) => {
        cloud.position.x = -30 + ((state.clock.elapsedTime * 0.3 + i * 15) % 60);
      });
    }
  });

  return (
    <group ref={cloudsRef}>
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} position={[-20 + i * 8, 15 + Math.random() * 5, -15 + Math.random() * 10]}>
          <mesh>
            <sphereGeometry args={[1.5 + Math.random(), 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.85} />
          </mesh>
          <mesh position={[1, -0.3, 0]}>
            <sphereGeometry args={[1 + Math.random() * 0.5, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.85} />
          </mesh>
          <mesh position={[-0.8, -0.2, 0.3]}>
            <sphereGeometry args={[0.8 + Math.random() * 0.3, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── TEAM ZONE MARKERS ──
function TeamZones() {
  return (
    <group>
      {/* Blue team zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.01, 5]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={COLORS.blueTeam} transparent opacity={0.08} />
      </mesh>
      {/* Red team zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[22, 0.01, 5]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={COLORS.redTeam} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

// ── STREET LIGHTS (instanced) ──
function StreetLights() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  React.useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const positions: [number, number, number][] = [];

    for (let i = 0; i < 12; i++) {
      positions.push([-25 + i * 4.5, 2, 2.5]);
      positions.push([-25 + i * 4.5, 2, -2.5]);
    }

    positions.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z);
      dummy.scale.set(0.05, 4, 0.05);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 24]}>
      <cylinderGeometry args={[1, 1, 1, 6]} />
      <meshStandardMaterial color={COLORS.metal} />
    </instancedMesh>
  );
}

// ── DATA TOWER (central landmark) ──
function DataTower() {
  const towerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (towerRef.current) {
      towerRef.current.children.forEach((child, i) => {
        if (i > 2) {
          const pulse = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.3 + 0.7;
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissiveIntensity = pulse;
          }
        }
      });
    }
  });

  return (
    <group ref={towerRef} position={[0, 0, -6]}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color={COLORS.concrete} />
      </mesh>
      {/* Tower body */}
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[1.2, 7, 1.2]} />
        <meshStandardMaterial color={COLORS.building1} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 8, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 2, 6]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      {/* Data rings */}
      {[3, 5, 7].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.9, 0.06, 8, 16]} />
          <meshStandardMaterial
            color={i === 0 ? COLORS.blueTeam : i === 1 ? '#4CAF50' : COLORS.redTeam}
            emissive={i === 0 ? COLORS.blueTeam : i === 1 ? '#4CAF50' : COLORS.redTeam}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── MAIN CITY EXPORT ──
export function DataCity3D() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 50]} />
        <meshStandardMaterial color={COLORS.grassDark} />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[20, 25, 15]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight args={['#87CEEB', '#4CAF50', 0.4]} />

      {/* Sky */}
      <mesh position={[0, 20, -35]}>
        <planeGeometry args={[120, 50]} />
        <meshBasicMaterial color={COLORS.sky} />
      </mesh>

      {/* City components */}
      <Mountains />
      <Clouds />
      <CityRoads />
      <CityBuildings />
      <CityTrees />
      <CityWater />
      <StreetLights />
      <TeamZones />
      <DataTower />
      <FlyingBirds />
      <Pedestrians />

      {/* Districts */}
      <WeatherStation3D />
      <TrafficJunction3D />
      <WaterPlant3D />
      <PowerStation3D />
      <TrainStation3D />
      <CityPark3D />
    </group>
  );
}
