// ============================================================
// EQUATION MISSION CONTROL 2.0 — Daytime Atmosphere & Campus 3D
// Complete Sunlit Aerospace Launch Campus Environment featuring:
// - Expansive Blue Sky Dome with Atmospheric Gradient & Horizon Haze
// - Volumetric 3D Fluffy Cumulus Clouds drifting at multiple depths
// - Distant Rolling Coastal Hills & Horizon Landscape
// - Large Vehicle Assembly Building (VAB) with Hangar Doors & Flags
// - Modern Mission Control Building with Blue Glass Windows
// - Observation Bunker Tower & Telemetry Radar Dome
// - Perimeter Security Fences, Manicured Lawns, Trees & Shrubs
// - Soaring 3D Birds with animated flapping flight
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Animated Fluffy Cumulus Cloud with multiple overlapping spheres
const FluffyCloud3D: React.FC<{
  position: [number, number, number];
  scale?: number;
  speed?: number;
}> = ({ position, scale = 1, speed = 0.04 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * speed * 2.5;
      if (groupRef.current.position.x > 55) {
        groupRef.current.position.x = -55;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.8, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} metalness={0.0} />
      </mesh>
      <mesh position={[-2.2, -0.4, 0.6]}>
        <sphereGeometry args={[2.0, 14, 14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[2.2, -0.3, -0.4]}>
        <sphereGeometry args={[2.1, 14, 14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[0.8, 1.1, 0.3]}>
        <sphereGeometry args={[1.7, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[-1.0, 0.9, -0.2]}>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
    </group>
  );
};

// Soaring 3D Birds with flapping wings
const SoaringBirds3D: React.FC = () => {
  const birdsRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (birdsRef.current) {
      birdsRef.current.rotation.y = time * 0.12;
    }
    wingsRef.current.forEach((wing, i) => {
      if (wing) {
        wing.rotation.z = Math.sin(time * 6 + i) * 0.35;
      }
    });
  });

  const birdPositions = useMemo(
    () => [
      [18, 22, -12],
      [21, 23.5, -15],
      [19.5, 22.8, -10],
      [24, 25, -18],
      [16.5, 21.8, -13],
    ],
    []
  );

  return (
    <group ref={birdsRef} position={[0, 0, 0]}>
      {birdPositions.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Bird Body */}
          <mesh castShadow>
            <coneGeometry args={[0.08, 0.4, 6]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
          {/* Left Wing */}
          <group
            ref={(el) => {
              wingsRef.current[i * 2] = el;
            }}
            position={[-0.06, 0, 0]}
          >
            <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.5, 0.02, 0.14]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
          </group>
          {/* Right Wing */}
          <group
            ref={(el) => {
              wingsRef.current[i * 2 + 1] = el;
            }}
            position={[0.06, 0, 0]}
          >
            <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.5, 0.02, 0.14]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

// Stylized Campus Tree with natural variation
const CampusTree3D: React.FC<{
  position: [number, number, number];
  scale?: number;
  type?: 'conifer' | 'deciduous';
}> = ({ position, scale = 1, type = 'deciduous' }) => {
  return (
    <group position={position} scale={scale}>
      {/* Wood Trunk */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.26, 1.8, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {type === 'deciduous' ? (
        <>
          {/* Lower Foliage */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <sphereGeometry args={[1.1, 14, 14]} />
            <meshStandardMaterial color="#15803d" roughness={0.85} />
          </mesh>
          {/* Upper Foliage */}
          <mesh position={[0, 2.8, 0]} castShadow>
            <sphereGeometry args={[0.8, 12, 12]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>
        </>
      ) : (
        <>
          {/* Conifer Tier 1 */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[1.2, 1.6, 8]} />
            <meshStandardMaterial color="#166534" roughness={0.8} />
          </mesh>
          {/* Conifer Tier 2 */}
          <mesh position={[0, 2.8, 0]} castShadow>
            <coneGeometry args={[0.9, 1.4, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
          {/* Conifer Tier 3 */}
          <mesh position={[0, 3.7, 0]} castShadow>
            <coneGeometry args={[0.6, 1.2, 8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
};

// Stylized Perimeter Security Fence Segment
const SecurityFence3D: React.FC<{ startX: number; endX: number; z: number }> = ({
  startX,
  endX,
  z,
}) => {
  const posts = useMemo(() => {
    const arr = [];
    const count = Math.floor((endX - startX) / 3.0);
    for (let i = 0; i <= count; i++) {
      arr.push(startX + i * 3.0);
    }
    return arr;
  }, [startX, endX]);

  return (
    <group position={[0, 0, z]}>
      {/* Horizontal Rails */}
      <mesh position={[(startX + endX) / 2, 0.8, 0]}>
        <boxGeometry args={[endX - startX, 0.05, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} />
      </mesh>
      <mesh position={[(startX + endX) / 2, 1.5, 0]}>
        <boxGeometry args={[endX - startX, 0.05, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} />
      </mesh>
      {/* Vertical Posts */}
      {posts.map((x, i) => (
        <mesh key={i} position={[x, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

export const DaytimeAtmosphere3D: React.FC = () => {
  return (
    <group>
      {/* ── 1. REALISTIC SUNLIT DAYTIME LIGHTING RIG ── */}
      {/* Sky Ambient Light */}
      <ambientLight intensity={1.15} color="#e0f2fe" />

      {/* Main Directional Sunlight (Warm Morning Sun) */}
      <directionalLight
        position={[22, 34, 24]}
        intensity={2.3}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-bias={-0.00015}
      />

      {/* Secondary Soft Atmosphere Fill Light */}
      <directionalLight position={[-20, 22, -15]} intensity={0.7} color="#7dd3fc" />

      {/* Ground Bounce Fill Light */}
      <hemisphereLight
        color="#bae6fd"
        groundColor="#86efac"
        intensity={0.65}
      />

      {/* ── 2. SKY DOME & ATMOSPHERIC FOG ── */}
      <color attach="background" args={['#60a5fa']} />
      <fog attach="fog" args={['#93c5fd', 45, 110]} />

      {/* ── 3. DISTANT COASTAL HILLS & HORIZON MOUNTAINS ── */}
      <group position={[0, 0, -38]}>
        {/* Layer 1 Far Mountains */}
        <mesh position={[-25, 4.5, -8]}>
          <coneGeometry args={[28, 12, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.95} />
        </mesh>
        <mesh position={[2, 6.0, -12]}>
          <coneGeometry args={[34, 14, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.95} />
        </mesh>
        <mesh position={[28, 5.0, -6]}>
          <coneGeometry args={[26, 13, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.95} />
        </mesh>

        {/* Layer 2 Rolling Green Foothills */}
        <mesh position={[-18, 1.8, 4]}>
          <sphereGeometry args={[14, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#22c55e" roughness={0.9} />
        </mesh>
        <mesh position={[16, 2.2, 2]}>
          <sphereGeometry args={[16, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} />
        </mesh>
      </group>

      {/* ── 4. EXPANSIVE GROUND TERRAIN ── */}
      {/* Outer Landscape Grass Plane (extends far to horizon) */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <planeGeometry args={[140, 120]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Inner Campus Concrete & Tarmac Perimeter Deck */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[48, 34]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Asphalt Service Access Roads (Left & Right) */}
      <mesh position={[-18, -0.05, 0]} receiveShadow>
        <planeGeometry args={[6, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[18, -0.05, 0]} receiveShadow>
        <planeGeometry args={[6, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      {/* Rear Service Highway */}
      <mesh position={[0, -0.05, -13]} receiveShadow>
        <planeGeometry args={[48, 6]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* ── 5. DISTANT AEROSPACE CAMPUS BUILDINGS ── */}
      <group position={[0, 0, -17]}>
        {/* Main Vehicle Assembly Building (VAB) Hangar */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 6.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[18, 13, 9]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Giant Vertical Hangar Door */}
          <mesh position={[0, 5.5, 4.52]}>
            <planeGeometry args={[10, 11]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.7} />
          </mesh>
          {/* Vertical Rib Striping on Hangar Door */}
          {[-3, -1, 1, 3].map((x) => (
            <mesh key={x} position={[x, 5.5, 4.54]}>
              <planeGeometry args={[0.2, 11]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
          ))}
          {/* VAB Roof HVAC Units & Communications Mast */}
          <mesh position={[0, 13.5, 0]}>
            <boxGeometry args={[6, 1.0, 4]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 15.5, 0]}>
            <cylinderGeometry args={[0.08, 0.15, 3.0, 8]} />
            <meshStandardMaterial color="#dc2626" metalness={0.8} />
          </mesh>
          {/* Rooftop Aviation Warning Beacon */}
          <mesh position={[0, 17.2, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} />
          </mesh>
        </group>

        {/* Left Research & Avionics Laboratory Building */}
        <group position={[-16, 0, 2]}>
          <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[10, 8.4, 7]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
          {/* Blue Tinted Thermal Glass Facade */}
          <mesh position={[0, 4.2, 3.52]}>
            <planeGeometry args={[8, 5.5]} />
            <meshStandardMaterial color="#0369a1" roughness={0.1} metalness={0.85} />
          </mesh>
          {/* Roof Solar Panels & Antennas */}
          <mesh position={[0, 8.6, 0]}>
            <boxGeometry args={[4, 0.4, 3]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Right Mission Operations & VIP Observation Building */}
        <group position={[16, 0, 2]}>
          <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[10, 8.4, 7]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
          {/* Observation Gallery Windows */}
          <mesh position={[0, 4.2, 3.52]}>
            <planeGeometry args={[8, 5.5]} />
            <meshStandardMaterial color="#0369a1" roughness={0.1} metalness={0.85} />
          </mesh>
          {/* Observation Tower Dome */}
          <mesh position={[0, 9.2, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 1.6, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ── 6. PERIMETER SECURITY FENCES ── */}
      <SecurityFence3D startX={-23} endX={23} z={-10.5} />
      <SecurityFence3D startX={-23} endX={-15} z={14} />
      <SecurityFence3D startX={15} endX={23} z={14} />

      {/* ── 7. MANICURED TREES & SHRUBS ALONG CAMPUS PERIMETER ── */}
      {[
        [-20, 0, -8],
        [-22, 0, -3],
        [-21, 0, 4],
        [-22, 0, 9],
        [-17, 0, 12],
        [20, 0, -8],
        [22, 0, -3],
        [21, 0, 4],
        [22, 0, 9],
        [17, 0, 12],
        [-10, 0, -11],
        [10, 0, -11],
      ].map((pos, i) => (
        <CampusTree3D
          key={i}
          position={pos as [number, number, number]}
          scale={0.95 + (i % 3) * 0.2}
          type={i % 2 === 0 ? 'deciduous' : 'conifer'}
        />
      ))}

      {/* ── 8. DRIFTING 3D CUMULUS CLOUDS (Multiple Altitudes & Depths) ── */}
      <FluffyCloud3D position={[-28, 22, -22]} scale={1.4} speed={0.05} />
      <FluffyCloud3D position={[12, 26, -26]} scale={1.8} speed={0.035} />
      <FluffyCloud3D position={[-8, 28, -32]} scale={2.2} speed={0.04} />
      <FluffyCloud3D position={[32, 24, -20]} scale={1.3} speed={0.06} />
      <FluffyCloud3D position={[-38, 25, -16]} scale={1.5} speed={0.045} />
      <FluffyCloud3D position={[0, 32, -35]} scale={2.5} speed={0.03} />

      {/* ── 9. SOARING 3D BIRDS IN SUNNY SKY ── */}
      <SoaringBirds3D />
    </group>
  );
};
