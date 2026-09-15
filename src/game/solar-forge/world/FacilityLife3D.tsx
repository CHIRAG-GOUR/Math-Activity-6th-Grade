// ============================================================
// THE SOLAR FORGE: Facility Life, Workers & Service Vehicles 3D
// Engineered life: maintenance engineers with hardhats,
// utility service carts, team wind banners & background solar panels
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SOLAR_MATERIALS } from './materials';

// Engineer Figure with Hardhat and Safety Vest
const FacilityEngineer3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  team: 'blue' | 'red' | 'neutral';
}> = ({ position, rotationY = 0, team }) => {
  const armRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (armRef.current) {
      armRef.current.rotation.x = Math.sin(t * 1.5) * 0.15;
    }
  });

  const vestColor = team === 'blue' ? '#0284c7' : team === 'red' ? '#dc2626' : '#f59e0b';

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Boots */}
      <mesh position={[-0.12, 0.15, 0]}>
        <boxGeometry args={[0.14, 0.3, 0.25]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.12, 0.15, 0]}>
        <boxGeometry args={[0.14, 0.3, 0.25]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Pants (Navy Blue) */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.22]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Hi-Vis Safety Vest Torso */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.46, 0.55, 0.26]} />
        <meshStandardMaterial color={vestColor} roughness={0.5} />
      </mesh>
      {/* Reflective Stripes on Vest */}
      <mesh position={[0, 1.08, 0.14]}>
        <boxGeometry args={[0.42, 0.08, 0.02]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.48, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#fed7aa" />
      </mesh>

      {/* Safety Hardhat (Yellow) */}
      <mesh position={[0, 1.58, 0]}>
        <sphereGeometry args={[0.17, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={SOLAR_MATERIALS.safetyYellow} attach="material" />
      </mesh>
      <mesh position={[0, 1.58, 0.04]}>
        <boxGeometry args={[0.36, 0.03, 0.38]} />
        <primitive object={SOLAR_MATERIALS.safetyYellow} attach="material" />
      </mesh>

      {/* Right Arm Holding Clipboard / Tablet */}
      <group ref={armRef} position={[0.28, 1.25, 0]}>
        <mesh position={[0, -0.22, 0.12]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.1, 0.45, 0.1]} />
          <meshStandardMaterial color={vestColor} />
        </mesh>
        {/* Tablet Tool */}
        <mesh position={[0, -0.42, 0.25]} rotation={[0.6, 0, 0]}>
          <boxGeometry args={[0.22, 0.32, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
};

// Electric Maintenance Utility Cart
const UtilityCart3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Chassis Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.45, 3.2]} />
        <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
      </mesh>
      {/* Utility Cargo Bed */}
      <mesh position={[0, 0.85, -0.7]}>
        <boxGeometry args={[1.6, 0.35, 1.5]} />
        <primitive object={SOLAR_MATERIALS.machinerySteel} attach="material" />
      </mesh>
      {/* Roll Cage Pillars & Roof */}
      <mesh position={[0, 1.6, 0.4]}>
        <boxGeometry args={[1.6, 0.06, 1.5]} />
        <primitive object={SOLAR_MATERIALS.darkTitanium} attach="material" />
      </mesh>
      {/* 4 Wheels */}
      {[
        [-0.95, 0.3, 0.9],
        [0.95, 0.3, 0.9],
        [-0.95, 0.3, -0.9],
        [0.95, 0.3, -0.9],
      ].map(([wx, wy, wz], idx) => (
        <mesh key={idx} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.22, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      ))}
      {/* Warning Flashing Beacon */}
      <mesh position={[0, 1.7, 0.4]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
};

// Fluttering Team Wind Flag
const TeamWindFlag3D: React.FC<{
  position: [number, number, number];
  team: 'blue' | 'red';
}> = ({ position, team }) => {
  const clothRef = useRef<THREE.Mesh>(null);
  const flagColor = team === 'blue' ? '#0284c7' : '#dc2626';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (clothRef.current) {
      clothRef.current.rotation.y = 0.2 + Math.sin(t * 2.8) * 0.12;
      clothRef.current.scale.x = 1.0 + Math.sin(t * 3.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Flagpole Mast */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 9, 8]} />
        <primitive object={SOLAR_MATERIALS.machinerySteel} attach="material" />
      </mesh>
      {/* Finial Ball */}
      <mesh position={[0, 9.1, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
      </mesh>
      {/* Fluttering Cloth Banner */}
      <mesh ref={clothRef} position={[1.4, 7.8, 0]}>
        <planeGeometry args={[2.6, 1.4]} />
        <meshStandardMaterial color={flagColor} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export const FacilityLife3D: React.FC = () => {
  return (
    <group>
      {/* ── 1. BLUE TEAM CREW & EQUIPMENT (WEST FACILITY) ── */}
      <FacilityEngineer3D position={[-20, 0, -4]} rotationY={0.6} team="blue" />
      <FacilityEngineer3D position={[-16, 0, -12]} rotationY={-0.8} team="blue" />
      <TeamWindFlag3D position={[-28, 0, 2]} team="blue" />
      <UtilityCart3D position={[-18, 0, 3]} rotationY={0.3} />

      {/* ── 2. RED TEAM CREW & EQUIPMENT (EAST FACILITY) ── */}
      <FacilityEngineer3D position={[20, 0, -4]} rotationY={-0.6} team="red" />
      <FacilityEngineer3D position={[16, 0, -12]} rotationY={0.8} team="red" />
      <TeamWindFlag3D position={[28, 0, 2]} team="red" />
      <UtilityCart3D position={[18, 0, 3]} rotationY={-0.3} />

      {/* ── 3. CENTRAL FORGE INSPECTION LEAD ── */}
      <FacilityEngineer3D position={[-2.5, 0, 6]} rotationY={0.2} team="neutral" />
    </group>
  );
};
