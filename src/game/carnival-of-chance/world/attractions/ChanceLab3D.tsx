// ============================================================
// THE GREAT CARNIVAL OF CHANCE — The Probability Lab 3D
// Alchemical science laboratory pavilion with glowing calibration
// cylinders, orbital reaction chamber, brass pipes, and marquee
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const ChanceLab3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [8.5, 0, 0.8],
}) => {
  const machineAnimState = useCarnivalStore((s) => s.machineAnimState);
  const selectAttraction = useCarnivalStore((s) => s.selectAttraction);
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
    <group position={position} onClick={() => selectAttraction('chance-lab')}>
      {/* ── Circular Cobblestone Platform Base ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.1, 0.3, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* ── Heavy Lab Bench Platform ── */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.8, 2.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.1, 2.6]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ── Central Spherical Reaction Chamber ── */}
      <group position={[0, 2.4, 0]}>
        <mesh>
          <sphereGeometry args={[1.15, 32, 32]} />
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

      {/* ── Two Cylindrical Measuring Columns ── */}
      <group position={[-1.6, 2.0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 2.0, 16]} />
          <meshPhysicalMaterial color="#e2e8f0" transmission={0.9} transparent opacity={1} roughness={0.1} />
        </mesh>
        <mesh ref={liquidRedRef} position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 1.0, 16]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#ef4444" emissiveIntensity={0.2} />
        </mesh>
      </group>

      <group position={[1.6, 2.0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 2.0, 16]} />
          <meshPhysicalMaterial color="#e2e8f0" transmission={0.9} transparent opacity={1} roughness={0.1} />
        </mesh>
        <mesh ref={liquidBlueRef} position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 1.5, 16]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.3} emissive="#3b82f6" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* ── Interconnecting Brass Arch & Marquee Sign ── */}
      <mesh position={[0, 3.6, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <torusGeometry args={[1.6, 0.08, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top Marquee Sign: THE PROBABILITY LAB */}
      <group position={[0, 4.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3.6, 0.8, 0.2]} />
          <meshStandardMaterial color="#7e22ce" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[3.7, 0.9, 0.05]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Glowing Bulbs */}
        {[-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 0.35, 0.12]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
