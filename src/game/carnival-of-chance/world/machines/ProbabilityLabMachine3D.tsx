// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Probability Lab 3D Machine
// Science laboratory studio apparatus with glass mixing chamber,
// calibrated liquid columns, and floating orbital particles
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const ProbabilityLabMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const mixerRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      if (phase === 'operating') {
        mixerRef.current.rotation.y += delta * 6;
      } else {
        mixerRef.current.rotation.y += delta * 0.5;
      }
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Stone & Brass Bench Base */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.8, 2.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.12, 2.6]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Central Glass Spherical Reaction Chamber */}
      <group position={[0, 2.4, 0]}>
        <mesh>
          <sphereGeometry args={[1.25, 32, 32]} />
          <meshPhysicalMaterial color="#f1f5f9" transmission={0.9} transparent opacity={1} roughness={0.05} />
        </mesh>
        <group ref={mixerRef}>
          {[-0.45, 0, 0.45].map((x, i) => (
            <mesh key={`b-${i}`} position={[x, Math.sin(i * 2) * 0.35, Math.cos(i * 2) * 0.35]} castShadow>
              <sphereGeometry args={[0.2, 20, 20]} />
              <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.2} />
            </mesh>
          ))}
          {[-0.3, 0.3].map((x, i) => (
            <mesh key={`r-${i}`} position={[x, Math.cos(i * 2) * 0.35, Math.sin(i * 2) * 0.35]} castShadow>
              <sphereGeometry args={[0.2, 20, 20]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.2} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Left Red Column */}
      <group position={[-1.8, 2.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 2.2, 16]} />
          <meshPhysicalMaterial color="#e2e8f0" transmission={0.9} transparent opacity={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 1.1, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} emissive="#dc2626" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Right Blue Column */}
      <group position={[1.8, 2.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 2.2, 16]} />
          <meshPhysicalMaterial color="#e2e8f0" transmission={0.9} transparent opacity={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 1.6, 16]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} emissive="#2563eb" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  );
};
