// ============================================================
// PARK PLANNER — 3D Sports Complex (Quadrant III)
// All-weather acrylic basketball court, soccer pitch with goal frame,
// and calisthenics fitness station.
// ============================================================

import React from 'react';
import * as THREE from 'three';

// ------------------------------------------------------------
// 1. ALL-WEATHER BASKETBALL COURT
// ------------------------------------------------------------
export const BasketballCourt3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Acrylic Court Slab */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[3.6, 0.05, 2.6]} />
        <meshStandardMaterial color="#2563eb" roughness={0.65} />
      </mesh>

      {/* Center Circle Key */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.44, 20]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* Half-court Line */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.04, 0.01, 2.5]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Three-Point Arc / Key Left */}
      <mesh position={[-1.1, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.69, 16, 1, -Math.PI / 2, Math.PI]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* Left Basketball Hoop Pole */}
      <group position={[-1.7, 0, 0]}>
        {/* Heavy Steel Support Pole */}
        <mesh castShadow position={[0, 1.4, 0]} rotation={[0, 0, -0.08]}>
          <cylinderGeometry args={[0.05, 0.06, 2.8, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Backboard Extension Arm */}
        <mesh position={[0.2, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Glass Backboard */}
        <mesh position={[0.4, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.8, 0.55, 0.03]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Orange Rim & Net */}
        <mesh position={[0.55, 2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.02, 6, 16]} />
          <meshStandardMaterial color="#ea580c" metalness={0.6} />
        </mesh>
        <mesh position={[0.55, 2.15, 0]}>
          <cylinderGeometry args={[0.16, 0.1, 0.28, 8, 1, true]} />
          <meshStandardMaterial color="#ffffff" wireframe />
        </mesh>
      </group>

      {/* Court Perimeter Chain-Link Fence (Rear) */}
      <mesh position={[0, 1.1, -1.35]}>
        <boxGeometry args={[3.7, 2.1, 0.04]} />
        <meshStandardMaterial color="#64748b" wireframe />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 2. MINI SOCCER TRAINING PITCH & GOAL
// ------------------------------------------------------------
export const SoccerPitch3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Manicured Turf Pitch */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[3.6, 0.05, 2.6]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>

      {/* Goal Box Lines */}
      <mesh position={[-1.2, 0.06, 0]}>
        <boxGeometry args={[1.0, 0.01, 1.4]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>

      {/* Steel Goal Post Frame */}
      <group position={[-1.7, 0, 0]}>
        {/* Left Post */}
        <mesh castShadow position={[0, 0.7, -0.6]}>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Right Post */}
        <mesh castShadow position={[0, 0.7, 0.6]}>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Crossbar */}
        <mesh castShadow position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.25, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Netting Cage */}
        <mesh position={[-0.25, 0.7, 0]}>
          <boxGeometry args={[0.5, 1.4, 1.2]} />
          <meshStandardMaterial color="#e2e8f0" wireframe transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Soccer Ball on Pitch */}
      <mesh castShadow position={[0.2, 0.15, 0.1]}>
        <sphereGeometry args={[0.12, 12, 12]} />
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
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[2.2, 0.04, 1.8]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Vertical Uprights */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={`post_${i}`} castShadow position={[x, 1.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.4, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} />
        </mesh>
      ))}

      {/* Pull-Up Bars at varying heights */}
      <mesh castShadow position={[-0.4, 2.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0.4, 1.9, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} />
      </mesh>
    </group>
  );
};
