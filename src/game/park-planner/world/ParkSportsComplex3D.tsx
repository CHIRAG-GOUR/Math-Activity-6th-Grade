// ============================================================
// PARK PLANNER — High-Graphics 3D Sports Complex (Quadrant III)
// All-weather blue acrylic basketball court, soccer/futsal pitch with goal frames,
// and calisthenics fitness station with parallel bars.
// ============================================================

import React from 'react';
import * as THREE from 'three';

// ------------------------------------------------------------
// 1. ALL-WEATHER ACRYLIC BASKETBALL COURT
// ------------------------------------------------------------
export const BasketballCourt3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Acrylic Court Slab */}
      <mesh receiveShadow position={[0, 0.035, 0]}>
        <boxGeometry args={[3.8, 0.05, 2.8]} />
        <meshStandardMaterial color="#2563eb" roughness={0.65} />
      </mesh>

      {/* Outer Border Apron (Terracotta Red) */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[4.2, 0.04, 3.2]} />
        <meshStandardMaterial color="#dc2626" roughness={0.7} />
      </mesh>

      {/* Center Circle Key */}
      <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.46, 24]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* Half-Court Dividing Line */}
      <mesh position={[0, 0.065, 0]}>
        <boxGeometry args={[0.04, 0.01, 2.7]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Three-Point Arc / Key Left */}
      <mesh position={[-1.15, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.74, 16, 1, -Math.PI / 2, Math.PI]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* Left Basketball Hoop Assembly */}
      <group position={[-1.75, 0, 0]}>
        {/* Support Steel Mast */}
        <mesh castShadow position={[0, 1.45, 0]} rotation={[0, 0, -0.08]}>
          <cylinderGeometry args={[0.055, 0.065, 2.9, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        {/* Boom Arm */}
        <mesh position={[0.22, 2.45, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.45, 6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Tempered Glass Backboard with White Target Box */}
        <group position={[0.45, 2.55, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.85, 0.6, 0.03]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} transparent opacity={0.75} />
          </mesh>
          <mesh position={[0, -0.05, 0.02]}>
            <boxGeometry args={[0.35, 0.25, 0.005]} />
            <meshBasicMaterial color="#ef4444" wireframe />
          </mesh>
        </group>
        {/* Breakaway Orange Rim & Nylon Net */}
        <mesh position={[0.62, 2.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.022, 6, 16]} />
          <meshStandardMaterial color="#ea580c" metalness={0.6} />
        </mesh>
        <mesh position={[0.62, 2.18, 0]}>
          <cylinderGeometry args={[0.18, 0.1, 0.3, 8, 1, true]} />
          <meshStandardMaterial color="#ffffff" wireframe />
        </mesh>
      </group>

      {/* Rear High Security Chain-Link Fence */}
      <mesh position={[0, 1.15, -1.45]}>
        <boxGeometry args={[3.9, 2.2, 0.04]} />
        <meshStandardMaterial color="#64748b" wireframe />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 2. MINI SOCCER / FUTSAL TRAINING PITCH
// ------------------------------------------------------------
export const SoccerPitch3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Striped Green Turf Pitch */}
      <mesh receiveShadow position={[0, 0.035, 0]}>
        <boxGeometry args={[3.8, 0.05, 2.8]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>

      {/* Regulation Goal Box Markings */}
      <mesh position={[-1.25, 0.065, 0]}>
        <boxGeometry args={[1.1, 0.01, 1.5]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>

      {/* Goal Post Frame & White Netting */}
      <group position={[-1.75, 0, 0]}>
        <mesh castShadow position={[0, 0.75, -0.65]}>
          <cylinderGeometry args={[0.045, 0.045, 1.5, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh castShadow position={[0, 0.75, 0.65]}>
          <cylinderGeometry args={[0.045, 0.045, 1.5, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh castShadow position={[0, 1.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.35, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Netting Cage */}
        <mesh position={[-0.28, 0.75, 0]}>
          <boxGeometry args={[0.55, 1.45, 1.3]} />
          <meshStandardMaterial color="#e2e8f0" wireframe transparent opacity={0.65} />
        </mesh>
      </group>

      {/* Soccer Ball on Pitch */}
      <mesh castShadow position={[0.2, 0.16, 0.1]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 3. CALISTHENICS FITNESS STATION
// ------------------------------------------------------------
export const FitnessStation3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Rubber workout mat */}
      <mesh receiveShadow position={[0, 0.025, 0]}>
        <boxGeometry args={[2.4, 0.04, 2.0]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Upright Steel Posts */}
      {[-0.85, 0, 0.85].map((x, i) => (
        <mesh key={`fit_post_${i}`} castShadow position={[x, 1.25, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 2.5, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
      ))}

      {/* Pull-Up Bars */}
      <mesh castShadow position={[-0.42, 2.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.032, 0.032, 0.85, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>
      <mesh castShadow position={[0.42, 1.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.032, 0.032, 0.85, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>
    </group>
  );
};
