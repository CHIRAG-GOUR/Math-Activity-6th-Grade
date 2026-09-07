// ============================================================
// THE GREAT CARNIVAL OF CHANCE — The Probability Lab 3D
// Configurable apparatus with glass calibration tubes, mixer,
// and digital dials
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const ChanceLab3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [7.5, 0, 6.5],
}) => {
  const machineAnimState = useCarnivalStore((s) => s.machineAnimState);
  const mixerRef = useRef<THREE.Group>(null);
  const liquidRedRef = useRef<THREE.Mesh>(null);
  const liquidBlueRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      if (machineAnimState === 'mixing' || machineAnimState === 'batch-simulating') {
        mixerRef.current.rotation.y += delta * 6;
      } else {
        mixerRef.current.rotation.y += delta * 0.4;
      }
    }
  });

  return (
    <group position={position}>
      {/* Heavy Lab Bench Platform */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.8, 2.2]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.1, 2.4]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Central Spherical Reaction Chamber */}
      <group position={[0, 2.3, 0]}>
        <mesh>
          <sphereGeometry args={[1.1, 32, 32]} />
          <meshPhysicalMaterial
            color="#f1f5f9"
            transmission={0.9}
            transparent
            opacity={1}
            roughness={0.05}
            ior={1.4}
          />
        </mesh>
        {/* Internal Floating Colored Orbs */}
        <group ref={mixerRef}>
          {[-0.4, 0, 0.4].map((x, i) => (
            <mesh key={`r-${i}`} position={[x, Math.sin(i) * 0.3, Math.cos(i) * 0.3]} castShadow>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.2} />
            </mesh>
          ))}
          {[-0.5, -0.1, 0.3, 0.6].map((x, i) => (
            <mesh key={`b-${i}`} position={[x, Math.cos(i) * 0.3, Math.sin(i) * 0.4]} castShadow>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.2} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Two Cylindrical Measuring Columns */}
      <group position={[-1.5, 1.8, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 1.8, 16]} />
          <meshPhysicalMaterial color="#e2e8f0" transmission={0.9} transparent opacity={1} roughness={0.1} />
        </mesh>
        <mesh ref={liquidRedRef} position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.9, 16]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
      </group>

      <group position={[1.5, 1.8, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 1.8, 16]} />
          <meshPhysicalMaterial color="#e2e8f0" transmission={0.9} transparent opacity={1} roughness={0.1} />
        </mesh>
        <mesh ref={liquidBlueRef} position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 1.4, 16]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.3} />
        </mesh>
      </group>

      {/* Interconnecting Brass Pipes */}
      <mesh position={[0, 3.4, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <torusGeometry args={[1.5, 0.06, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};
