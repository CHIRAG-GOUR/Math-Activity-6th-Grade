// ============================================================
// EQUATION MISSION CONTROL 2.0 — Stable Daytime Atmosphere & Campus
// Zero-Flickering Sunlit Aerospace Launch Campus featuring:
// - Stable Blue Sky Gradient & Horizon Fog
// - Solid Ground Landscape (No Coplanar/Unrotated Plane Glitches)
// - Distant Coastal Mountains & Rolling Green Foothills
// - Vehicle Assembly Building (VAB) Hangar with Giant Doors
// - Modern Engineering & Mission Control Glass Buildings
// - VIP Observation Gallery Tower
// - Perimeter Security Fences, Manicured Lawns, Trees & Shrubs
// - Volumetric 3D Cumulus Clouds & Soaring Birds
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Animated Fluffy Cumulus Cloud with gentle drift
const FluffyCloud3D: React.FC<{
  position: [number, number, number];
  scale?: number;
  speed?: number;
}> = ({ position, scale = 1, speed = 0.03 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * speed * 2.0;
      if (groupRef.current.position.x > 60) {
        groupRef.current.position.x = -60;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.0, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} metalness={0.0} />
      </mesh>
      <mesh position={[-2.4, -0.4, 0.6]}>
        <sphereGeometry args={[2.2, 14, 14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[2.4, -0.3, -0.4]}>
        <sphereGeometry args={[2.3, 14, 14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[0.8, 1.2, 0.3]}>
        <sphereGeometry args={[1.8, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh position={[-1.2, 1.0, -0.3]}>
        <sphereGeometry args={[1.6, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
    </group>
  );
};

// Soaring 3D Birds with animated flapping wings
const SoaringBirds3D: React.FC = () => {
  const birdsRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (birdsRef.current) {
      birdsRef.current.rotation.y = time * 0.1;
    }
    wingsRef.current.forEach((wing, i) => {
      if (wing) {
        wing.rotation.z = Math.sin(time * 5.5 + i) * 0.35;
      }
    });
  });

  const birdPositions = useMemo(
    () => [
      [22, 24, -16],
      [25, 25.5, -19],
      [23.5, 24.8, -14],
      [28, 27, -22],
      [20.5, 23.8, -17],
    ],
    []
  );

  return (
    <group ref={birdsRef} position={[0, 0, 0]}>
      {birdPositions.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Bird Body */}
          <mesh>
            <coneGeometry args={[0.08, 0.45, 6]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
          {/* Left Wing */}
          <group
            ref={(el) => {
              wingsRef.current[i * 2] = el;
            }}
            position={[-0.06, 0, 0]}
          >
            <mesh position={[-0.32, 0, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.55, 0.02, 0.15]} />
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
            <mesh position={[0.32, 0, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.55, 0.02, 0.15]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

// Stylized Campus Tree with solid 3D geometry
const CampusTree3D: React.FC<{
  position: [number, number, number];
  scale?: number;
  type?: 'conifer' | 'deciduous';
}> = ({ position, scale = 1, type = 'deciduous' }) => {
  return (
    <group position={position} scale={scale}>
      {/* Wood Trunk */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 2.0, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {type === 'deciduous' ? (
        <>
          {/* Lower Foliage */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <sphereGeometry args={[1.2, 12, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.85} />
          </mesh>
          {/* Upper Foliage */}
          <mesh position={[0, 3.1, 0]} castShadow>
            <sphereGeometry args={[0.85, 10, 10]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>
        </>
      ) : (
        <>
          {/* Conifer Tier 1 */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <coneGeometry args={[1.3, 1.8, 8]} />
            <meshStandardMaterial color="#166534" roughness={0.8} />
          </mesh>
          {/* Conifer Tier 2 */}
          <mesh position={[0, 3.1, 0]} castShadow>
            <coneGeometry args={[1.0, 1.5, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
          {/* Conifer Tier 3 */}
          <mesh position={[0, 4.0, 0]} castShadow>
            <coneGeometry args={[0.65, 1.2, 8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
};

// Perimeter Security Chainlink Fence
const SecurityFence3D: React.FC<{ startX: number; endX: number; z: number }> = ({
  startX,
  endX,
  z,
}) => {
  const posts = useMemo(() => {
    const arr = [];
    const count = Math.floor((endX - startX) / 3.5);
    for (let i = 0; i <= count; i++) {
      arr.push(startX + i * 3.5);
    }
    return arr;
  }, [startX, endX]);

  return (
    <group position={[0, 0, z]}>
      {/* Horizontal Steel Rails */}
      <mesh position={[(startX + endX) / 2, 0.8, 0]}>
        <boxGeometry args={[endX - startX, 0.06, 0.06]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} />
      </mesh>
      <mesh position={[(startX + endX) / 2, 1.6, 0]}>
        <boxGeometry args={[endX - startX, 0.06, 0.06]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} />
      </mesh>
      {/* Vertical Posts */}
      {posts.map((x, i) => (
        <mesh key={i} position={[x, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 2.0, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

export const DaytimeAtmosphere3D: React.FC = () => {
  return (
    <group>
      {/* ── 1. LIGHTING RIG (Warm Morning Sunlight & Skylight Fill) ── */}
      {/* Soft Ambient Light for Open Sky Fill */}
      <ambientLight intensity={1.1} color="#f0f9ff" />

      {/* Main Directional Sun (Golden Warm Sunlight) */}
      <directionalLight
        position={[24, 36, 26]}
        intensity={2.2}
        color="#fffdf2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={90}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.00015}
      />

      {/* Secondary Soft Atmospheric Fill Light */}
      <directionalLight position={[-20, 24, -16]} intensity={0.65} color="#7dd3fc" />

      {/* Ground Bounce Fill Light */}
      <hemisphereLight
        color="#bae6fd"
        groundColor="#94a3b8"
        intensity={0.55}
      />

      {/* ── 2. STABLE SKY DOME & DISTANT ATMOSPHERIC FOG ── */}
      <color attach="background" args={['#60a5fa']} />
      <fog attach="fog" args={['#93c5fd', 50, 140]} />

      {/* ── 3. DISTANT COASTAL HILLS & HORIZON MOUNTAINS ── */}
      <group position={[0, 0, -42]}>
        {/* Far Mountain Peaks */}
        <mesh position={[-28, 6.0, -10]}>
          <coneGeometry args={[32, 14, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.95} />
        </mesh>
        <mesh position={[4, 8.0, -14]}>
          <coneGeometry args={[38, 17, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.95} />
        </mesh>
        <mesh position={[32, 6.5, -8]}>
          <coneGeometry args={[30, 15, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.95} />
        </mesh>

        {/* Rolling Green Coastal Foothills */}
        <mesh position={[-18, 2.5, 4]}>
          <sphereGeometry args={[16, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} />
        </mesh>
        <mesh position={[18, 3.0, 2]}>
          <sphereGeometry args={[18, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#15803d" roughness={0.9} />
        </mesh>
      </group>

      {/* ── 4. SOLID HORIZONTAL GROUND TERRAIN ── */}
      {/* Outer Campus Green Perimeter Bed (Solid Box, Y = -0.6) */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[150, 1.0, 130]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Campus Concrete Sub-base (Solid Box, Y = -0.06) */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[52, 0.12, 38]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* ── 5. DISTANT AEROSPACE CAMPUS BUILDINGS ── */}
      <group position={[0, 0, -18]}>
        {/* Main Vehicle Assembly Building (VAB) Hangar */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 7.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[20, 14, 10]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} metalness={0.2} />
          </mesh>
          {/* Vertical Blue Hangar Bay Doors */}
          <mesh position={[0, 6.0, 5.05]}>
            <boxGeometry args={[11, 12, 0.1]} />
            <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.7} />
          </mesh>
          {/* Vertical Rib Striping on Hangar Door */}
          {[-3.5, -1.2, 1.2, 3.5].map((x) => (
            <mesh key={x} position={[x, 6.0, 5.12]}>
              <boxGeometry args={[0.25, 12, 0.05]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
          ))}
          {/* VAB Roof HVAC Units & Communications Mast */}
          <mesh position={[0, 14.5, 0]}>
            <boxGeometry args={[7, 1.0, 5]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 16.8, 0]}>
            <cylinderGeometry args={[0.09, 0.16, 3.5, 8]} />
            <meshStandardMaterial color="#dc2626" metalness={0.8} />
          </mesh>
          {/* Flashing Red Aviation Beacon at Mast Top */}
          <mesh position={[0, 18.6, 0]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.5} />
          </mesh>
        </group>

        {/* Left Research & Avionics Laboratory Building */}
        <group position={[-18, 0, 2]}>
          <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[11, 9, 8]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
          {/* Blue Tinted Thermal Glass Facade */}
          <mesh position={[0, 4.5, 4.05]}>
            <boxGeometry args={[9, 6, 0.1]} />
            <meshStandardMaterial color="#0369a1" roughness={0.1} metalness={0.85} />
          </mesh>
          {/* Roof Solar Panels & Antennas */}
          <mesh position={[0, 9.3, 0]}>
            <boxGeometry args={[5, 0.5, 4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Right Mission Operations & VIP Observation Building */}
        <group position={[18, 0, 2]}>
          <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[11, 9, 8]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
          {/* Observation Gallery Windows */}
          <mesh position={[0, 4.5, 4.05]}>
            <boxGeometry args={[9, 6, 0.1]} />
            <meshStandardMaterial color="#0369a1" roughness={0.1} metalness={0.85} />
          </mesh>
          {/* Observation Dome */}
          <mesh position={[0, 9.8, 0]}>
            <cylinderGeometry args={[1.6, 2.0, 1.8, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ── 6. PERIMETER SECURITY FENCES ── */}
      <SecurityFence3D startX={-25} endX={25} z={-11.5} />
      <SecurityFence3D startX={-25} endX={-16} z={15} />
      <SecurityFence3D startX={16} endX={25} z={15} />

      {/* ── 7. CAMPUS TREES & LANDSCAPING ── */}
      {[
        [-22, 0, -9],
        [-24, 0, -4],
        [-23, 0, 4],
        [-24, 0, 10],
        [-18, 0, 14],
        [22, 0, -9],
        [24, 0, -4],
        [23, 0, 4],
        [24, 0, 10],
        [18, 0, 14],
        [-11, 0, -12],
        [11, 0, -12],
      ].map((pos, i) => (
        <CampusTree3D
          key={i}
          position={pos as [number, number, number]}
          scale={0.95 + (i % 3) * 0.2}
          type={i % 2 === 0 ? 'deciduous' : 'conifer'}
        />
      ))}

      {/* ── 8. DRIFTING 3D CUMULUS CLOUDS ── */}
      <FluffyCloud3D position={[-32, 24, -25]} scale={1.5} speed={0.045} />
      <FluffyCloud3D position={[14, 28, -28]} scale={1.9} speed={0.035} />
      <FluffyCloud3D position={[-10, 30, -35]} scale={2.3} speed={0.04} />
      <FluffyCloud3D position={[36, 26, -22]} scale={1.4} speed={0.055} />
      <FluffyCloud3D position={[-42, 27, -18]} scale={1.6} speed={0.04} />

      {/* ── 9. SOARING 3D BIRDS IN SUNNY SKY ── */}
      <SoaringBirds3D />
    </group>
  );
};
