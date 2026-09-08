// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Odds Wheel 3D Physical Machine
// High-Fidelity Carnival Prize Wheel with accurate radial pie segments,
// brass rim bulbs, golden star hub, A-frame truss, and physical ratchet pointer
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const OddsWheelMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);

  const wheelRef = useRef<THREE.Group>(null);
  const pointerRef = useRef<THREE.Group>(null);
  const spinVelocityRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);

  const setup = activeChallenge?.setup || {
    totalItems: 10,
    items: [
      { color: '#2563eb', colorName: 'Blue', count: 6 },
      { color: '#dc2626', colorName: 'Red', count: 3 },
      { color: '#f59e0b', colorName: 'Gold', count: 1 },
    ],
  };

  // Build accurate pie segments based on item fractions
  const segments = useMemo(() => {
    const list: {
      color: string;
      label: string;
      startAngle: number;
      angleSpan: number;
      midAngle: number;
    }[] = [];
    let currentAngle = 0;
    const sliceAngle = (Math.PI * 2) / setup.totalItems;

    setup.items.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        list.push({
          color: item.color,
          label: item.colorName,
          startAngle: currentAngle,
          angleSpan: sliceAngle,
          midAngle: currentAngle + sliceAngle / 2,
        });
        currentAngle += sliceAngle;
      }
    });
    return list;
  }, [setup]);

  // Handle spin dynamics
  useFrame((state, delta) => {
    if (wheelRef.current) {
      if (phase === 'operating') {
        // High speed rotation during active spin
        spinVelocityRef.current = THREE.MathUtils.lerp(spinVelocityRef.current, 14, delta * 3);
        wheelRef.current.rotation.z -= spinVelocityRef.current * delta;
      } else if (phase === 'observation') {
        // Smoothly settle on winning angle
        spinVelocityRef.current = THREE.MathUtils.lerp(spinVelocityRef.current, 0, delta * 2.5);
        wheelRef.current.rotation.z -= spinVelocityRef.current * delta;
      } else {
        // Gentle idle attraction spin
        spinVelocityRef.current = 0.25;
        wheelRef.current.rotation.z -= delta * 0.25;
      }
    }

    // Physical Flapper Ratchet Pointer Vibration
    if (pointerRef.current) {
      if (phase === 'operating') {
        pointerRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 45) * 0.25;
      } else {
        pointerRef.current.rotation.z = THREE.MathUtils.lerp(pointerRef.current.rotation.z, 0, delta * 8);
      }
    }
  });

  const bulbCount = 20;
  const wheelRadius = 2.4;

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Spotlight for Wheel ── */}
      <spotLight
        position={[0, 8, 5]}
        target-position={[0, 3.4, 0]}
        intensity={2.2}
        angle={0.6}
        penumbra={0.5}
        color="#fffbeb"
        castShadow
      />

      {/* ── Stepped Wooden Carnival Platform ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.2, 3.6, 0.3, 32]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.8, 3.1, 0.15, 32]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>
      {/* Gold Trim Ring */}
      <mesh position={[0, 0.44, 0]} receiveShadow>
        <cylinderGeometry args={[2.82, 2.82, 0.04, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── Front Platform Steps ── */}
      <mesh position={[0, 0.15, 2.6]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.28, 0.6]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.08, 3.1]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.16, 0.5]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* ── Red & Gold Steel A-Frame Lattice Truss Towers ── */}
      {/* Left Leg */}
      <group position={[-1.2, 2.2, 0]} rotation={[0, 0, -0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.24, 4.4, 0.24]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Lattice struts */}
        {[-1.2, -0.4, 0.4, 1.2].map((y, i) => (
          <mesh key={i} position={[0.15, y, 0]} rotation={[0, 0, 0.7]} castShadow>
            <boxGeometry args={[0.08, 0.4, 0.1]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Right Leg */}
      <group position={[1.2, 2.2, 0]} rotation={[0, 0, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.24, 4.4, 0.24]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Lattice struts */}
        {[-1.2, -0.4, 0.4, 1.2].map((y, i) => (
          <mesh key={i} position={[-0.15, y, 0]} rotation={[0, 0, -0.7]} castShadow>
            <boxGeometry args={[0.08, 0.4, 0.1]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Cross Braces */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[2.2, 0.16, 0.2]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <boxGeometry args={[1.6, 0.16, 0.2]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ── Main Axle Bearing Housing ── */}
      <mesh position={[0, 3.8, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.5, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ═════════════════════════════════════════════════════════════
          ROTATING WHEEL ASSEMBLY
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 3.8, 0.22]}>
        <group ref={wheelRef}>
          {/* Solid Wooden Base Disc Backing */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[wheelRadius, wheelRadius, 0.12, 48]} />
            <meshStandardMaterial color="#451a03" roughness={0.6} />
          </mesh>

          {/* Heavy Brass Outer Tyre Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[wheelRadius + 0.12, wheelRadius + 0.12, 0.16, 48, 1, true]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Inner Golden Bevel Ring */}
          <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[wheelRadius - 0.05, 0.06, 16, 48]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* ── ACCURATE PIE WEDGES (CylinderGeometry thetaStart & thetaLength) ── */}
          {segments.map((seg, idx) => (
            <group key={idx}>
              {/* Colored Pie Sector */}
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry
                  args={[
                    wheelRadius - 0.08,
                    wheelRadius - 0.08,
                    0.14,
                    32,
                    1,
                    false,
                    seg.startAngle,
                    seg.angleSpan * 0.98,
                  ]}
                />
                <meshStandardMaterial
                  color={seg.color}
                  roughness={0.3}
                  metalness={0.15}
                />
              </mesh>

              {/* Radial Golden Divider Spoke */}
              <group rotation={[0, 0, seg.startAngle]}>
                <mesh position={[0, (wheelRadius - 0.1) / 2, 0.08]} castShadow>
                  <boxGeometry args={[0.04, wheelRadius - 0.1, 0.04]} />
                  <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>

              {/* Brass Peg at Sector Edge */}
              <mesh
                position={[
                  Math.cos(seg.midAngle) * (wheelRadius - 0.18),
                  Math.sin(seg.midAngle) * (wheelRadius - 0.18),
                  0.12,
                ]}
                rotation={[Math.PI / 2, 0, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.04, 0.04, 0.16, 12]} />
                <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          ))}

          {/* ── Round Incandescent Bulbs Around Outer Rim ── */}
          {Array.from({ length: bulbCount }).map((_, i) => {
            const angle = (i / bulbCount) * Math.PI * 2;
            const isLit = i % 2 === 0;
            return (
              <mesh
                key={`bulb-${i}`}
                position={[
                  Math.cos(angle) * (wheelRadius + 0.04),
                  Math.sin(angle) * (wheelRadius + 0.04),
                  0.08,
                ]}
                castShadow
              >
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshStandardMaterial
                  color={isLit ? '#fef08a' : '#ffffff'}
                  emissive={isLit ? '#f59e0b' : '#38bdf8'}
                  emissiveIntensity={0.6}
                  roughness={0.2}
                />
              </mesh>
            );
          })}

          {/* ── Center Golden Hub & Star Medal ── */}
          <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.18, 32]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.22]} castShadow>
            <sphereGeometry args={[0.38, 24, 24]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Star Medal Points */}
          {[0, 1, 2, 3, 4].map((p) => (
            <mesh
              key={`star-${p}`}
              position={[0, 0, 0.25]}
              rotation={[0, 0, (p * Math.PI * 2) / 5]}
              castShadow
            >
              <coneGeometry args={[0.15, 0.55, 4]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
            </mesh>
          ))}
        </group>

        {/* ═════════════════════════════════════════════════════════════
            FLAPPER RATCHET POINTER (Top Center 12 O'Clock)
            ═════════════════════════════════════════════════════════════ */}
        <group ref={pointerRef} position={[0, wheelRadius + 0.18, 0.15]}>
          {/* Mounting Bracket */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.3, 0.15, 0.2]} />
            <meshStandardMaterial color="#78350f" roughness={0.5} />
          </mesh>
          {/* Golden Pivot Pin */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
          {/* Arrow Pointer Body (Points DOWN at wheel) */}
          <mesh position={[0, -0.32, 0]} rotation={[0, 0, Math.PI]} castShadow>
            <coneGeometry args={[0.22, 0.7, 16]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>

        {/* ── Marquee Sign Arch Above Wheel ── */}
        <group position={[0, wheelRadius + 0.7, -0.1]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 0.5, 0.12]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[3.0, 0.38, 0.02]} />
            <meshStandardMaterial color="#fef08a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Side Mini Flags */}
          {[-1.5, 1.5].map((x, i) => (
            <mesh key={i} position={[x, 0.3, 0]} castShadow>
              <boxGeometry args={[0.35, 0.22, 0.02]} />
              <meshStandardMaterial color={i === 0 ? '#2563eb' : '#dc2626'} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
