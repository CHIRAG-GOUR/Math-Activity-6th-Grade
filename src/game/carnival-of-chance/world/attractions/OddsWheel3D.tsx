// ============================================================
// THE GREAT CARNIVAL OF CHANCE — The Odds Wheel 3D
// Physical segmented probability wheel with spinning axle,
// red & gold carnival trestle stand, brass pegs, and marquee arch
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const OddsWheel3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [-8.5, 0, 0.5],
}) => {
  const machineAnimState = useCarnivalStore((s) => s.machineAnimState);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const selectAttraction = useCarnivalStore((s) => s.selectAttraction);
  const wheelRef = useRef<THREE.Group>(null);
  const pointerRef = useRef<THREE.Group>(null);

  // Wheel sectors data (10 segments)
  const segments = useMemo(() => {
    const items = activeChallenge?.probabilityData.items || [
      { label: 'Blue', color: '#2563eb', count: 4 },
      { label: 'Red', color: '#dc2626', count: 3 },
      { label: 'Yellow', color: '#f59e0b', count: 2 },
      { label: 'Green', color: '#16a34a', count: 1 },
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
    <group position={position} onClick={() => selectAttraction('odds-wheel')}>
      {/* ── Circular Cobblestone Platform Base ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.1, 0.3, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.7, 0.12, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>

      {/* ── Red & Gold Steel A-Frame Trestle Stand ── */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.3, 1.6]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* Left Red Strut */}
      <mesh position={[-0.8, 2.1, 0]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[0.22, 3.6, 0.22]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Right Red Strut */}
      <mesh position={[0.8, 2.1, 0]} rotation={[0, 0, 0.25]} castShadow>
        <boxGeometry args={[0.22, 3.6, 0.22]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Center Gold Crossbeam */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[1.5, 0.15, 0.18]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── Top Carnival Marquee Sign: THE ODDS WHEEL ── */}
      <group position={[0, 6.0, 0]}>
        {/* Arched Red Marquee Plaque */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        {/* Gold Border Trim */}
        <mesh position={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[3.3, 0.9, 0.05]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Marquee Glowing Bulbs */}
        {[-1.4, -0.9, -0.4, 0.1, 0.6, 1.1, 1.4].map((x, i) => (
          <mesh key={i} position={[x, 0.35, 0.14]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── Rotating Wheel Assembly ── */}
      <group position={[0, 3.6, 0.2]}>
        <group ref={wheelRef}>
          {/* Wheel Backing Rim (Gold/Bronze) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[2.0, 2.0, 0.18, 36]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Individual Colored Pie Slices */}
          {segments.map((seg, idx) => {
            const angle = (seg.startAngle + seg.endAngle) / 2;
            const radius = 1.0;
            return (
              <group key={idx} rotation={[0, 0, angle]}>
                <mesh position={[0, radius, 0.1]} castShadow>
                  <boxGeometry args={[0.65, 1.4, 0.05]} />
                  <meshStandardMaterial color={seg.color} roughness={0.3} metalness={0.1} />
                </mesh>
                {/* Brass Separator Peg at Edge */}
                <mesh position={[0, 1.9, 0.14]} castShadow>
                  <sphereGeometry args={[0.08, 12, 12]} />
                  <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
                </mesh>
              </group>
            );
          })}

          {/* Center Brass Hub & Star */}
          <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.14, 24]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.26]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* ── Top Mechanical Flapper Pointer (At 12 o'clock) ── */}
        <group ref={pointerRef} position={[0, 2.15, 0.22]}>
          <mesh rotation={[0, 0, Math.PI]} castShadow>
            <coneGeometry args={[0.18, 0.6, 16]} />
            <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.16, 12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
