// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Mystery Chests 3D
// Three physical antique carnival prize chests with animated lids,
// gold trims, and floating tokens
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

const Chest: React.FC<{
  position: [number, number, number];
  label: string;
  goldCount: number;
  silverCount: number;
  isOpen: boolean;
}> = ({ position, label, goldCount, silverCount, isOpen }) => {
  const lidRef = useRef<THREE.Group>(null);
  const tokenGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (lidRef.current) {
      const targetRot = isOpen ? -Math.PI / 1.7 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetRot, delta * 5);
    }
    if (tokenGroupRef.current && isOpen) {
      tokenGroupRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Wooden Chest Base Body */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.7, 0.8]} />
        <meshStandardMaterial color="#713f12" roughness={0.65} />
      </mesh>
      {/* Brass Edge Trims */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.24, 0.72, 0.84]} />
        <meshStandardMaterial color="#ca8a04" wireframe roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Pivoting Lid Assembly */}
      <group ref={lidRef} position={[0, 0.8, -0.4]}>
        <mesh position={[0, 0.2, 0.4]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 1.2, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#854d0e" roughness={0.6} />
        </mesh>
        {/* Lid Gold Lock Clasp */}
        <mesh position={[0, 0.05, 0.82]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.08]} />
          <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Inside Tokens Container (visible when open) */}
      <group ref={tokenGroupRef} position={[0, 0.6, 0]}>
        {isOpen && (
          <>
            {/* Gold Tokens cluster */}
            {Array.from({ length: Math.min(6, goldCount) }).map((_, i) => (
              <mesh key={`g-${i}`} position={[(i % 3 - 1) * 0.2, 0.1 + i * 0.04, ((i % 2) - 0.5) * 0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.03, 16]} />
                <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}
            {/* Silver Tokens */}
            {Array.from({ length: Math.min(6, silverCount) }).map((_, i) => (
              <mesh key={`s-${i}`} position={[((i + 1) % 3 - 1) * 0.2, 0.08 + i * 0.03, (0.5 - (i % 2)) * 0.2]} rotation={[Math.PI / 3, 0, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.09, 0.03, 16]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </>
        )}
      </group>

      {/* Pedestal & Placard */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 1.1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

export const MysteryChests3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [7.5, 0, -4.5],
}) => {
  const machineAnimState = useCarnivalStore((s) => s.machineAnimState);
  const isOpen = machineAnimState === 'opening' || machineAnimState === 'settled';

  return (
    <group position={position}>
      {/* ── Carnival Booth Counter Table ── */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 0.7, 2.2]} />
        <meshStandardMaterial color="#991b1b" roughness={0.5} />
      </mesh>
      {/* Table Top Surface */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.5, 0.1, 2.4]} />
        <meshStandardMaterial color="#fef08a" roughness={0.4} />
      </mesh>

      {/* Three Physical Chests: Chest A, Chest B, Chest C */}
      <Chest position={[-1.7, 0.8, 0]} label="CHEST A" goldCount={8} silverCount={2} isOpen={isOpen} />
      <Chest position={[0, 0.8, 0]} label="CHEST B" goldCount={5} silverCount={5} isOpen={isOpen} />
      <Chest position={[1.7, 0.8, 0]} label="CHEST C" goldCount={2} silverCount={8} isOpen={isOpen} />

      {/* Canopy Roof on Posts */}
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 2.2, -1.0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 3.0, 12]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      ))}
      <mesh position={[0, 3.6, -0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[5.8, 0.15, 2.6]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
    </group>
  );
};
