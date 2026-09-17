// ============================================================
// PARK PLANNER — High-Graphics 3D Picnic Grove & Relaxation (Quadrant IV)
// Cedar picnic tables, cast iron park benches with seated visitors reading,
// and lush layered deciduous shade trees.
// ============================================================

import React from 'react';
import * as THREE from 'three';
import { StylizedHuman3D } from './ParkCharacters3D';

// ------------------------------------------------------------
// 1. HANDCRAFTED CEDAR PICNIC TABLE
// ------------------------------------------------------------
export const PicnicTable3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Stone Paver Base */}
      <mesh receiveShadow position={[0, 0.025, 0]}>
        <boxGeometry args={[2.4, 0.04, 2.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Table Top Timber Planks */}
      <mesh castShadow receiveShadow position={[0, 0.78, 0]}>
        <boxGeometry args={[1.9, 0.07, 0.9]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>

      {/* A-Frame Legs Left & Right */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={`picnic_legs_${i}`} position={[x, 0.4, 0]}>
          <mesh castShadow position={[0, 0, 0.48]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.78, 0.08]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          <mesh castShadow position={[0, 0, -0.48]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.78, 0.08]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          {/* Bench Support Beam */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.08, 0.08, 1.5]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
        </group>
      ))}

      {/* Bench Planks (Front & Rear) */}
      <mesh castShadow position={[0, 0.46, 0.7]}>
        <boxGeometry args={[1.9, 0.055, 0.3]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.46, -0.7]}>
        <boxGeometry args={[1.9, 0.055, 0.3]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 2. CAST IRON PARK BENCH (With seated reader)
// ------------------------------------------------------------
export const ParkBench3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  hasVisitor?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, hasVisitor = false }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Cast Iron Curved Framework */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={`bench_frame_${i}`} position={[x, 0.3, 0]}>
          <mesh castShadow position={[0, 0, 0.22]}>
            <boxGeometry args={[0.05, 0.58, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 0.22, -0.22]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.05, 0.98, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.05, 0.04, 0.48]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Wooden Seat Slats */}
      {[-0.14, -0.03, 0.08, 0.19].map((z, idx) => (
        <mesh key={`seat_slat_${idx}`} castShadow position={[0, 0.44, z]}>
          <boxGeometry args={[1.45, 0.032, 0.085]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
      ))}

      {/* Wooden Backrest Slats */}
      {[0.58, 0.7, 0.82].map((y, idx) => (
        <mesh key={`back_slat_${idx}`} castShadow position={[0, y, -0.24]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.45, 0.085, 0.032]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
      ))}

      {/* Optional Seated Visitor reading a book */}
      {hasVisitor && (
        <group position={[0, 0.1, 0]}>
          <StylizedHuman3D
            position={[0, 0, 0]}
            scale={0.85}
            shirtColor="#059669"
            pantsColor="#1e3a8a"
            isWalking={false}
            isSeated={true}
          />
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 3. SHADY DECIDUOUS OAK & PINE TREES
// ------------------------------------------------------------
export const ShadyTree3D: React.FC<{
  position?: [number, number, number];
  scale?: number;
}> = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Textured Wood Trunk */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 2.6, 8]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.9} />
      </mesh>

      {/* Layered Foliage Canopy Clusters */}
      <mesh castShadow position={[0, 2.8, 0]}>
        <dodecahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.45, 3.3, 0.35]}>
        <dodecahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial color="#40916c" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.45, 3.0, -0.35]}>
        <dodecahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#1b4332" roughness={0.8} />
      </mesh>
    </group>
  );
};
