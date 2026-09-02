// ============================================================
// THE GREAT NUMBER RAILWAY — Environment & Storybook Stations
// - Station 1: Skillizee Junction with 3D Waiting Passengers on Platform
// - Station 2: CCIS Junction (Highlands Destination Terminal)
// - Blue curved canopy, yellow footing boots, park benches, and lush scenery
// ============================================================

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { HumanFigure } from './Locomotive';
import { useRailwayStore } from '../store/railwayStore';

interface CartoonStationProps {
  position: [number, number, number];
  name: string;
  isSkillizeeJunction?: boolean;
}

export const CartoonStation: React.FC<CartoonStationProps> = ({
  position,
  name,
  isSkillizeeJunction = false,
}) => {
  const loadedItems = useRailwayStore((s) => s.loadedItems);
  const passengersOnPlatform = isSkillizeeJunction && !loadedItems.passengers;

  return (
    <group position={position}>
      {/* ── 1. Concrete Platform ── */}
      <group position={[0, 0, 0]}>
        {/* Main Platform Slab */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <boxGeometry args={[2.4, 0.16, 8.0]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
        </mesh>

        {/* Yellow Safety Hazard Stripe along Track Curb */}
        <mesh position={[1.16, 0.165, 0]}>
          <boxGeometry args={[0.08, 0.01, 8.0]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
        <mesh position={[1.1, 0.165, 0]}>
          <boxGeometry args={[0.04, 0.01, 8.0]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} />
        </mesh>

        {/* Park Bench */}
        <group position={[-0.4, 0.16, 1.6]}>
          {[-0.08, 0.04, 0.16].map((z, i) => (
            <mesh key={i} position={[0, 0.22, z]}>
              <boxGeometry args={[1.3, 0.03, 0.09]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.5} />
            </mesh>
          ))}
          {[0.32, 0.44].map((y, i) => (
            <mesh key={`b-${i}`} position={[-0.12, y, -0.12]}>
              <boxGeometry args={[1.3, 0.08, 0.03]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.5} />
            </mesh>
          ))}
          {[-0.55, 0.55].map((x, i) => (
            <group key={`leg-${i}`} position={[x, 0.12, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.06, 0.24, 0.35]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>

        {/* ── 3D PASSENGERS WAITING ON SKILLIZEE PLATFORM (Before Step 1) ── */}
        {passengersOnPlatform && (
          <group position={[0.4, 0.16, -1.0]}>
            {/* Passenger 1 (Student with Backpack) */}
            <HumanFigure
              position={[0, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
              scale={0.8}
              shirtColor="#0284c7"
              pantsColor="#1e293b"
              hasBag={true}
            />
            {/* Passenger 2 (Teacher/Commuter with Cap) */}
            <HumanFigure
              position={[-0.4, 0, -0.8]}
              rotation={[0, Math.PI / 2 - 0.2, 0]}
              scale={0.85}
              shirtColor="#16a34a"
              pantsColor="#334155"
              hasCap={true}
            />
            {/* Passenger 3 (Traveler with Bag) */}
            <HumanFigure
              position={[0.1, 0, -1.6]}
              rotation={[0, Math.PI / 2 + 0.1, 0]}
              scale={0.78}
              shirtColor="#ea580c"
              pantsColor="#1e293b"
              hasBag={true}
            />
          </group>
        )}
      </group>

      {/* ── 2. Station Canopy Roof & Steel Truss Structure ── */}
      <group position={[-0.4, 0, 0]}>
        {/* Twin Steel Columns with Yellow Base Boots */}
        {[-2.8, 2.8].map((z, i) => (
          <group key={`col-${i}`} position={[0.6, 0, z]}>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.16, 0.18, 0.24, 16]} />
              <meshStandardMaterial color="#facc15" roughness={0.3} />
            </mesh>
            <mesh position={[0, 1.35, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 2.1, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Silver Lattice Truss Support Beam */}
        <group position={[0.6, 2.35, 0]}>
          <mesh>
            <boxGeometry args={[0.12, 0.22, 6.0]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
          </mesh>
          {[-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((z, i) => (
            <mesh key={`strut-${i}`} position={[0, 0, z]} rotation={[0.6 * (i % 2 === 0 ? 1 : -1), 0, 0]}>
              <boxGeometry args={[0.04, 0.28, 0.04]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Curved Royal Blue Canopy */}
        <group position={[0.1, 2.65, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.2, 0.16, 6.4]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.1, 1.1, 6.4, 24, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#0369a1" roughness={0.3} />
          </mesh>

          {/* Station Name Board on Canopy Roof */}
          <group position={[0.9, -0.15, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.04, 0.52, 2.8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            <mesh position={[-0.01, 0, 0]}>
              <boxGeometry args={[0.04, 0.58, 2.86]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            <mesh position={[0.025, 0, 0]}>
              <boxGeometry args={[0.02, 0.26, 2.4]} />
              <meshStandardMaterial color={isSkillizeeJunction ? '#1e3a8a' : '#14532d'} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* Station Platform Name Signpost */}
        <group position={[-0.8, 1.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.38, 2.6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[0.02, 0.24, 2.4]} />
            <meshStandardMaterial
              color={isSkillizeeJunction ? '#38bdf8' : '#4ade80'}
              emissive={isSkillizeeJunction ? '#0284c7' : '#16a34a'}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ── Layered Cartoon Pine Tree ──
export const CartoonPineTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.85, 0.95, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <coneGeometry args={[0.7, 0.9, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.45, 0]}>
        <coneGeometry args={[0.5, 0.85, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.7} />
      </mesh>
    </group>
  );
};

// ── Fluffy Cartoon Bush ──
export const CartoonBush: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.42, 10, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} />
      </mesh>
      <mesh position={[-0.24, 0.2, 0.1]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      <mesh position={[0.22, 0.22, -0.05]}>
        <sphereGeometry args={[0.32, 8, 6]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
};

// ── Floating Clouds ──
export const CartoonCloud: React.FC<{ position: [number, number, number]; speed?: number; scale?: number }> = ({
  position,
  speed = 0.5,
  scale = 1,
}) => {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.position.x += speed * delta;
      if (cloudRef.current.position.x > 50) {
        cloudRef.current.position.x = -50;
      }
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 12, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[-1.2, -0.2, 0]}>
        <sphereGeometry args={[1.1, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[1.2, -0.2, 0.2]}>
        <sphereGeometry args={[1.0, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0.4, 0.6, -0.1]}>
        <sphereGeometry args={[1.2, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
    </group>
  );
};

// ── Ground ──
export const StorybookGround: React.FC = () => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#65a30d" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -17]} receiveShadow>
        <planeGeometry args={[6, 75]} />
        <meshStandardMaterial color="#78716c" roughness={0.95} />
      </mesh>
    </group>
  );
};
