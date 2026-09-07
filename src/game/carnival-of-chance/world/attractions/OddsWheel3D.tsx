// ============================================================
// THE GREAT CARNIVAL OF CHANCE — The Odds Wheel 3D
// Physical segmented probability wheel with spinning axle,
// brass pegs, and animated ratchet pointer
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const OddsWheel3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [-7.5, 0, -4.5],
}) => {
  const machineAnimState = useCarnivalStore((s) => s.machineAnimState);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const wheelRef = useRef<THREE.Group>(null);
  const pointerRef = useRef<THREE.Group>(null);

  // Wheel sectors data (10 segments)
  const segments = useMemo(() => {
    const items = activeChallenge?.probabilityData.items || [
      { label: 'Blue', color: '#3b82f6', count: 6 },
      { label: 'Red', color: '#ef4444', count: 3 },
      { label: 'Gold', color: '#f59e0b', count: 1 },
    ];
    const segList: { color: string; label: string; startAngle: number; endAngle: number }[] = [];
    let currentAngle = 0;
    const totalCount = items.reduce((acc, i) => acc + i.count, 0) || 10;
    const sliceAngle = (Math.PI * 2) / totalCount;

    items.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        segList.push({
          color: item.color,
          label: item.label,
          startAngle: currentAngle,
          endAngle: currentAngle + sliceAngle,
        });
        currentAngle += sliceAngle;
      }
    });
    return segList;
  }, [activeChallenge]);

  useFrame((state, delta) => {
    if (wheelRef.current) {
      if (machineAnimState === 'spinning' || machineAnimState === 'mixing') {
        wheelRef.current.rotation.z -= delta * 12;
      } else {
        // Subtle idle drift
        wheelRef.current.rotation.z -= delta * 0.15;
      }
    }

    if (pointerRef.current) {
      if (machineAnimState === 'spinning' || machineAnimState === 'mixing') {
        // Flapper vibration ratchet effect
        pointerRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 45) * 0.18;
      } else {
        pointerRef.current.rotation.z = THREE.MathUtils.lerp(pointerRef.current.rotation.z, 0, delta * 6);
      }
    }
  });

  return (
    <group position={position}>
      {/* ── Wooden Base Stand ── */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.5, 1.4]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {/* Vertical Support Post */}
      <mesh position={[0, 2.0, -0.2]} castShadow>
        <boxGeometry args={[0.3, 3.4, 0.3]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>
      {/* Side Angled Braces */}
      <mesh position={[-0.6, 1.2, -0.2]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.15, 1.8, 0.15]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.6, 1.2, -0.2]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[0.15, 1.8, 0.15]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* ── Rotating Wheel Assembly ── */}
      <group position={[0, 3.2, 0]}>
        <group ref={wheelRef}>
          {/* Wheel Backing Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[1.8, 1.8, 0.15, 36]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Individual Colored Pie Slices */}
          {segments.map((seg, idx) => {
            const angle = (seg.startAngle + seg.endAngle) / 2;
            const radius = 0.9;
            return (
              <group key={idx} rotation={[0, 0, angle]}>
                <mesh position={[0, radius, 0.08]} castShadow>
                  <boxGeometry args={[0.55, 1.3, 0.04]} />
                  <meshStandardMaterial color={seg.color} roughness={0.3} metalness={0.1} />
                </mesh>
                {/* Brass Separator Peg at Edge */}
                <mesh position={[0, 1.68, 0.12]} castShadow>
                  <sphereGeometry args={[0.07, 12, 12]} />
                  <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            );
          })}

          {/* Center Brass Hub */}
          <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.12, 24]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.22]} castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* ── Top Mechanical Flapper Pointer (Stationary at 12 o'clock) ── */}
        <group ref={pointerRef} position={[0, 1.95, 0.18]}>
          <mesh rotation={[0, 0, Math.PI]} castShadow>
            <coneGeometry args={[0.16, 0.55, 16]} />
            <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
