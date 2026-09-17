// ============================================================
// PARK PLANNER — 3D Picnic Grove & Relaxation (Quadrant IV)
// Handcrafted cedar picnic tables, cast iron park benches,
// and lush deciduous shade trees.
// ============================================================

import React from 'react';
import * as THREE from 'three';

// ------------------------------------------------------------
// 1. CEDAR PICNIC TABLE & BENCHES
// ------------------------------------------------------------
export const PicnicTable3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Stone Paved Base Pad */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[2.2, 0.04, 2.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Table Top Planks */}
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[1.8, 0.06, 0.85]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>

      {/* A-Frame Legs Left & Right */}
      {[-0.65, 0.65].map((x, i) => (
        <group key={`legs_${i}`} position={[x, 0.38, 0]}>
          <mesh castShadow position={[0, 0, 0.45]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          <mesh castShadow position={[0, 0, -0.45]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          {/* Cross brace supporting benches */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.08, 0.08, 1.4]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
        </group>
      ))}

      {/* Bench Planks (Front & Rear) */}
      <mesh castShadow position={[0, 0.44, 0.65]}>
        <boxGeometry args={[1.8, 0.05, 0.28]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.44, -0.65]}>
        <boxGeometry args={[1.8, 0.05, 0.28]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 2. CAST IRON PARK BENCH
// ------------------------------------------------------------
export const ParkBench3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Cast Iron Curved Armrests & Legs */}
      {[-0.65, 0.65].map((x, i) => (
        <group key={`bench_leg_${i}`} position={[x, 0.28, 0]}>
          {/* Front Leg */}
          <mesh castShadow position={[0, 0, 0.2]}>
            <boxGeometry args={[0.05, 0.55, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          {/* Back Leg & Spine */}
          <mesh castShadow position={[0, 0.2, -0.2]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.05, 0.95, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          {/* Curved Armrest */}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.05, 0.04, 0.45]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Wooden Seat Slats */}
      {[-0.12, -0.02, 0.08, 0.18].map((z, idx) => (
        <mesh key={`seat_slat_${idx}`} castShadow position={[0, 0.42, z]}>
          <boxGeometry args={[1.4, 0.03, 0.08]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
      ))}

      {/* Wooden Backrest Slats */}
      {[0.55, 0.67, 0.79].map((y, idx) => (
        <mesh key={`back_slat_${idx}`} castShadow position={[0, y, -0.22]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.4, 0.08, 0.03]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------
// 3. SHADY DECIDUOUS OAK TREE
// ------------------------------------------------------------
export const ShadyTree3D: React.FC<{
  position?: [number, number, number];
  scale?: number;
}> = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Wood Trunk */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 2.4, 8]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.9} />
      </mesh>

      {/* Foliage Canopy Clusters */}
      <mesh castShadow position={[0, 2.6, 0]}>
        <dodecahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.4, 3.1, 0.3]}>
        <dodecahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color="#40916c" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.4, 2.8, -0.3]}>
        <dodecahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial color="#1b4332" roughness={0.8} />
      </mesh>
    </group>
  );
};
