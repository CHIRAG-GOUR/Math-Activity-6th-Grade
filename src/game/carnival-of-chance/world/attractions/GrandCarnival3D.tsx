// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Grand Carnival 3D Pavilion
// Celebration big top, rotating golden carousel, spotlights,
// and master trophy
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const GrandCarnival3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, 11],
}) => {
  const phase = useCarnivalStore((s) => s.phase);
  const carouselRef = useRef<THREE.Group>(null);
  const trophyRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (carouselRef.current) {
      carouselRef.current.rotation.y += delta * (phase === 'grand-celebration' ? 1.5 : 0.4);
    }
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 1.2;
      trophyRef.current.position.y = 2.4 + Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Grand Festival Circular Base Stage */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.2, 3.5, 0.6, 32]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.0, 3.2, 0.15, 32]} />
        <meshStandardMaterial color="#fef08a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Rotating Grand Carousel Roof */}
      <group ref={carouselRef} position={[0, 3.8, 0]}>
        <mesh castShadow>
          <coneGeometry args={[3.2, 1.8, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Striped Canopy Flaps */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh
            key={i}
            position={[Math.cos((i * Math.PI) / 8) * 3.1, -0.2, Math.sin((i * Math.PI) / 8) * 3.1]}
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
        <mesh key={i} position={[Math.cos(ang) * 2.8, 2.0, Math.sin(ang) * 2.8]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 3.2, 12]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
      ))}

      {/* Floating Grand Master Trophy */}
      <group ref={trophyRef} position={[0, 2.4, 0]}>
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
    </group>
  );
};
