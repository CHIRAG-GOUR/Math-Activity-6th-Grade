// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Odds Wheel 3D Physical Machine
// Studio close-up of the giant segmented wheel with physics spin,
// ratchet pointer vibration, and landing spotlight
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const OddsWheelMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);

  const wheelRef = useRef<THREE.Group>(null);
  const pointerRef = useRef<THREE.Group>(null);

  const setup = activeChallenge?.setup || {
    totalItems: 10,
    items: [
      { color: '#2563eb', colorName: 'Blue', count: 6 },
      { color: '#dc2626', colorName: 'Red', count: 3 },
      { color: '#f59e0b', colorName: 'Gold', count: 1 },
    ],
  };

  const segments = useMemo(() => {
    const list: { color: string; label: string; startAngle: number; endAngle: number }[] = [];
    let currentAngle = 0;
    const sliceAngle = (Math.PI * 2) / setup.totalItems;

    setup.items.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        list.push({
          color: item.color,
          label: item.colorName,
          startAngle: currentAngle,
          endAngle: currentAngle + sliceAngle,
        });
        currentAngle += sliceAngle;
      }
    });
    return list;
  }, [setup]);

  useFrame((state, delta) => {
    if (wheelRef.current) {
      if (phase === 'operating') {
        wheelRef.current.rotation.z -= delta * 12;
      } else if (phase === 'observation') {
        wheelRef.current.rotation.z = THREE.MathUtils.lerp(wheelRef.current.rotation.z, 0, delta * 2);
      } else {
        wheelRef.current.rotation.z -= delta * 0.2;
      }
    }

    if (pointerRef.current) {
      if (phase === 'operating') {
        pointerRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 40) * 0.2;
      } else {
        pointerRef.current.rotation.z = THREE.MathUtils.lerp(pointerRef.current.rotation.z, 0, delta * 6);
      }
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Wooden Base Platform */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.4, 32]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* Red & Gold A-Frame Trestle */}
      <mesh position={[-0.9, 2.2, 0]} rotation={[0, 0, -0.22]} castShadow>
        <boxGeometry args={[0.22, 4.2, 0.22]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.9, 2.2, 0]} rotation={[0, 0, 0.22]} castShadow>
        <boxGeometry args={[0.22, 4.2, 0.22]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[1.8, 0.15, 0.2]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Rotating Wheel Assembly */}
      <group position={[0, 3.6, 0.2]}>
        <group ref={wheelRef}>
          {/* Wheel Backing Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[2.2, 2.2, 0.18, 36]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Slices */}
          {segments.map((seg, idx) => {
            const angle = (seg.startAngle + seg.endAngle) / 2;
            return (
              <group key={idx} rotation={[0, 0, angle]}>
                <mesh position={[0, 1.1, 0.1]} castShadow>
                  <boxGeometry args={[0.7, 1.5, 0.05]} />
                  <meshStandardMaterial color={seg.color} roughness={0.3} metalness={0.1} />
                </mesh>
                {/* Brass Pegs */}
                <mesh position={[0, 2.1, 0.14]} castShadow>
                  <sphereGeometry args={[0.08, 12, 12]} />
                  <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
                </mesh>
              </group>
            );
          })}

          {/* Center Hub */}
          <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.15, 24]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.26]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Flapper Ratchet Pointer */}
        <group ref={pointerRef} position={[0, 2.35, 0.22]}>
          <mesh rotation={[0, 0, Math.PI]} castShadow>
            <coneGeometry args={[0.2, 0.7, 16]} />
            <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
