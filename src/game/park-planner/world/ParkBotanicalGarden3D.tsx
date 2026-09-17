// ============================================================
// PARK PLANNER — 3D Botanical Gardens & Nature (Quadrant II)
// Tiered marble fountain with water jets, landscaped flower beds,
// Victorian gazebo, and lotus koi pond.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ------------------------------------------------------------
// 1. TIERED MARBLE FOUNTAIN
// ------------------------------------------------------------
export const TieredFountain3D: React.FC<{
  position?: [number, number, number];
  isFlowing?: boolean;
}> = ({ position = [0, 0, 0], isFlowing = true }) => {
  const waterJetRef = useRef<THREE.Group>(null);
  const rippleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (isFlowing) {
      if (waterJetRef.current) {
        waterJetRef.current.scale.y = 0.9 + Math.sin(t * 8) * 0.15;
      }
      if (rippleRef.current) {
        const s = 1 + ((t * 1.5) % 1) * 0.3;
        rippleRef.current.scale.set(s, 1, s);
        (rippleRef.current.material as THREE.MeshStandardMaterial).opacity =
          0.8 * (1 - ((t * 1.5) % 1));
      }
    }
  });

  return (
    <group position={position}>
      {/* Stone Plaza Base */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.06, 24]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* Outer Basin Wall */}
      <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.3, 1.35, 0.45, 24, 1, true]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} />
      </mesh>
      {/* Outer Basin Lip */}
      <mesh position={[0, 0.48, 0]}>
        <torusGeometry args={[1.32, 0.06, 8, 24]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
      </mesh>

      {/* Basin Water Surface */}
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.28, 24]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.08}
          metalness={0.3}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Animated Ripple */}
      {isFlowing && (
        <mesh ref={rippleRef} position={[0, 0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 24]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Central Pedestal / Tier 1 Column */}
      <mesh castShadow position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.8, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} />
      </mesh>

      {/* Upper Basin Tier */}
      <mesh castShadow position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.7, 0.3, 0.25, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} />
      </mesh>
      {/* Upper Water Sheet */}
      <mesh position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 20]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.08} transparent opacity={0.9} />
      </mesh>

      {/* Top Finial / Spout */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Flowing Water Jets */}
      {isFlowing && (
        <group position={[0, 1.45, 0]} ref={waterJetRef}>
          {/* Central Jet */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 0.5, 8]} />
            <meshStandardMaterial
              color="#e0f2fe"
              transparent
              opacity={0.75}
              roughness={0.1}
            />
          </mesh>
          {/* Cascading Arcs */}
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
            <mesh
              key={`jet_${idx}`}
              position={[Math.cos(angle) * 0.25, -0.15, Math.sin(angle) * 0.25]}
              rotation={[0.3 * Math.sin(angle), 0, -0.3 * Math.cos(angle)]}
            >
              <cylinderGeometry args={[0.02, 0.04, 0.4, 6]} />
              <meshStandardMaterial color="#e0f2fe" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 2. LANDSCAPED FLOWER BEDS
// ------------------------------------------------------------
export const FlowerBed3D: React.FC<{
  position?: [number, number, number];
  flowerColor?: string;
}> = ({ position = [0, 0, 0], flowerColor = '#ef4444' }) => {
  return (
    <group position={position}>
      {/* Curved Stone Retaining Wall */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.1, 1.15, 0.2, 20]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
      {/* Rich Black Soil Mound */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.98, 1.05, 0.15, 20]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>

      {/* Cluster of Flowers & Foliage */}
      {[-0.5, 0, 0.5].map((x, i) =>
        [-0.5, 0, 0.5].map((z, j) => {
          if (x * x + z * z > 0.6) return null;
          const height = 0.22 + ((i + j) % 3) * 0.05;
          const col = (i + j) % 2 === 0 ? flowerColor : '#eab308';

          return (
            <group key={`flower_${i}_${j}`} position={[x * 1.1, 0.25, z * 1.1]}>
              {/* Green Stem */}
              <mesh position={[0, height / 2, 0]}>
                <cylinderGeometry args={[0.015, 0.015, height, 6]} />
                <meshStandardMaterial color="#15803d" />
              </mesh>
              {/* Green Leaves */}
              <mesh position={[0.04, height * 0.4, 0]} rotation={[0, 0, 0.4]}>
                <planeGeometry args={[0.08, 0.05]} />
                <meshStandardMaterial color="#16a34a" side={THREE.DoubleSide} />
              </mesh>
              {/* Flower Blossom */}
              <mesh position={[0, height + 0.04, 0]}>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial color={col} roughness={0.4} />
              </mesh>
              <mesh position={[0, height + 0.04, 0]}>
                <sphereGeometry args={[0.025, 6, 6]} />
                <meshStandardMaterial color="#fbbf24" />
              </mesh>
            </group>
          );
        })
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 3. VICTORIAN OCTAGONAL GAZEBO
// ------------------------------------------------------------
export const VictorianGazebo3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  const postsCount = 8;
  const radius = 1.3;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Octagonal Stone Base Plinth */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[radius + 0.2, radius + 0.25, 0.3, postsCount]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>

      {/* Cedar Wood Flooring */}
      <mesh receiveShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[radius + 0.1, radius + 0.1, 0.04, postsCount]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* 8 Turned Timber Columns */}
      {Array.from({ length: postsCount }).map((_, i) => {
        const angle = (i * Math.PI * 2) / postsCount;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={`col_${i}`} position={[x, 0.32, z]}>
            <mesh castShadow position={[0, 1.1, 0]}>
              <cylinderGeometry args={[0.05, 0.06, 2.2, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
            {/* Base & Capital */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.15, 0.1, 0.15]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 2.1, 0]}>
              <boxGeometry args={[0.15, 0.1, 0.15]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}

      {/* Perimeter Balustrade / Railing (except front opening) */}
      {Array.from({ length: postsCount - 1 }).map((_, i) => {
        const angle1 = (i * Math.PI * 2) / postsCount;
        const angle2 = ((i + 1) * Math.PI * 2) / postsCount;
        const midX = (Math.cos(angle1) + Math.cos(angle2)) * 0.5 * radius;
        const midZ = (Math.sin(angle1) + Math.sin(angle2)) * 0.5 * radius;
        const rotY = Math.atan2(Math.cos(angle1) - Math.cos(angle2), -(Math.sin(angle1) - Math.sin(angle2)));

        return (
          <mesh
            key={`rail_${i}`}
            position={[midX, 0.7, midZ]}
            rotation={[0, rotY, 0]}
          >
            <boxGeometry args={[0.85, 0.6, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        );
      })}

      {/* Steeple Shingled Roof */}
      <mesh castShadow position={[0, 2.9, 0]}>
        <cylinderGeometry args={[0.1, radius + 0.35, 1.2, postsCount]} />
        <meshStandardMaterial color="#0f766e" roughness={0.6} />
      </mesh>
      {/* Roof Weathervane Finial */}
      <mesh position={[0, 3.65, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 4. LOTUS & KOI POND
// ------------------------------------------------------------
export const KoiPond3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, 0],
}) => {
  return (
    <group position={position}>
      {/* Natural River Boulder Rim */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 14;
        const r = 1.3 + ((i % 3) * 0.1 - 0.1);
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const rockScale = 0.25 + ((i % 4) * 0.05);

        return (
          <mesh
            key={`rock_${i}`}
            castShadow
            position={[x, 0.1, z]}
            scale={[rockScale, rockScale * 0.8, rockScale]}
          >
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Deep Pond Water Surface */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.25, 24]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.05}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Water Lily Pads & Flowers */}
      {[
        { x: -0.4, z: 0.3 },
        { x: 0.5, z: -0.2 },
        { x: 0.1, z: 0.5 },
      ].map((pad, idx) => (
        <group key={`lily_${idx}`} position={[pad.x, 0.09, pad.z]}>
          <mesh rotation={[-Math.PI / 2, 0, idx * 1.5]}>
            <circleGeometry args={[0.18, 12, 0, Math.PI * 1.8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
