// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Grand Carnival 3D Pavilion & Entrance
// Celebration circus archway, rotating carousel, festival lighting,
// master trophy, and entrance boardwalk
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const GrandCarnival3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, 8.5],
}) => {
  const phase = useCarnivalStore((s) => s.phase);
  const selectAttraction = useCarnivalStore((s) => s.selectAttraction);
  const carouselRef = useRef<THREE.Group>(null);
  const trophyRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (carouselRef.current) {
      carouselRef.current.rotation.y += delta * (phase === 'grand-celebration' ? 1.5 : 0.4);
    }
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 1.2;
      trophyRef.current.position.y = 2.6 + Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
    }
  });

  return (
    <group position={position} onClick={() => selectAttraction('grand-carnival')}>
      {/* ── Circular Cobblestone Platform Base ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.5, 0.3, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* ── Grand Festival Circular Base Stage ── */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.0, 3.2, 0.4, 32]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 3.0, 0.12, 32]} />
        <meshStandardMaterial color="#fef08a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ── Rotating Grand Carousel Roof (Red & Gold Canopy) ── */}
      <group ref={carouselRef} position={[0, 3.8, 0]}>
        <mesh castShadow>
          <coneGeometry args={[3.0, 1.8, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Striped Canopy Flaps */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh
            key={i}
            position={[Math.cos((i * Math.PI) / 8) * 2.9, -0.2, Math.sin((i * Math.PI) / 8) * 2.9]}
            castShadow
          >
            <boxGeometry args={[0.3, 0.4, 0.08]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#fbbf24' : '#ffffff'} />
          </mesh>
        ))}
        {/* Top Grand Golden Crown */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 4 Outer Pillar Supports */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
        <mesh key={i} position={[Math.cos(ang) * 2.6, 2.1, Math.sin(ang) * 2.6]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 3.0, 12]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
      ))}

      {/* ── Floating Grand Master Trophy ── */}
      <group ref={trophyRef} position={[0, 2.6, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.2, 0.6, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <torusGeometry args={[0.45, 0.08, 12, 24]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ── Top Grand Marquee Sign: GRAND CARNIVAL ── */}
      <group position={[0, 5.4, 1.8]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3.8, 0.8, 0.2]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[3.9, 0.9, 0.05]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Glowing Bulbs */}
        {[-1.6, -1.1, -0.6, 0, 0.6, 1.1, 1.6].map((x, i) => (
          <mesh key={i} position={[x, 0.35, 0.12]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
