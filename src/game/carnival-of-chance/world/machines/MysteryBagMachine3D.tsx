// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Mystery Bag 3D Physical Machine
// Genuine 3D cloth sack holding real physical spheres, animated
// drawstring opening, mechanical grabber scoop, and rolling tray
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const MysteryBagMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);

  const bagNeckRef = useRef<THREE.Group>(null);
  const grabberArmRef = useRef<THREE.Group>(null);
  const rollingBallRef = useRef<THREE.Mesh>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);

  // Challenge setup items (e.g. 5 Red, 4 Blue = 9 total)
  const setup = activeChallenge?.setup || {
    totalItems: 9,
    items: [
      { color: '#dc2626', colorName: 'Red', count: 5 },
      { color: '#2563eb', colorName: 'Blue', count: 4 },
    ],
    targetColor: '#dc2626',
    theoreticalFraction: { numerator: 5, denominator: 9 },
  };

  // Generate the actual 9 physical 3D spheres distributed inside the bag opening
  const ballsInBag = useMemo(() => {
    const list: { id: number; color: string; pos: [number, number, number] }[] = [];
    let id = 0;
    setup.items.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        const angle = (id / setup.totalItems) * Math.PI * 2;
        const radius = 0.35 + (id % 3) * 0.15;
        list.push({
          id: id++,
          color: item.color,
          pos: [Math.cos(angle) * radius, 1.35 + (id % 2) * 0.2, Math.sin(angle) * radius],
        });
      }
    });
    return list;
  }, [setup]);

  const activeColor = drawnOutcome?.color || setup.items[0].color;

  useFrame((state, delta) => {
    // 1. Drawstring / Bag Neck breathing & opening animation
    if (bagNeckRef.current) {
      if (phase === 'operating') {
        bagNeckRef.current.scale.lerp(new THREE.Vector3(1.35, 0.9, 1.35), delta * 4);
      } else if (phase === 'observation' || phase === 'batch-trials') {
        bagNeckRef.current.scale.lerp(new THREE.Vector3(1.2, 1.0, 1.2), delta * 3);
      } else {
        // Idle gentle breathing
        const s = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.04;
        bagNeckRef.current.scale.set(s, 1, s);
      }
    }

    // 2. Mechanical Grabber Scoop Animation
    if (grabberArmRef.current) {
      if (phase === 'operating') {
        const t = (state.clock.getElapsedTime() * 2.2) % 3;
        // Descend into bag (0 -> 1s), scoop (1 -> 2s), lift out (2 -> 3s)
        if (t < 1.0) {
          grabberArmRef.current.position.y = THREE.MathUtils.lerp(grabberArmRef.current.position.y, 1.4, delta * 6);
        } else if (t < 2.0) {
          grabberArmRef.current.position.y = 1.3;
          grabberArmRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 12) * 0.15;
        } else {
          grabberArmRef.current.position.y = THREE.MathUtils.lerp(grabberArmRef.current.position.y, 2.8, delta * 5);
        }
      } else {
        grabberArmRef.current.position.y = THREE.MathUtils.lerp(grabberArmRef.current.position.y, 3.2, delta * 4);
      }
    }

    // 3. Physical Drawn Ball Rolling & Tray Landing
    if (rollingBallRef.current) {
      if (phase === 'operating') {
        // Rises from sack (y=1.4) and rolls forward onto tray (y=0.45, z=1.8)
        const t = (state.clock.getElapsedTime() * 1.5) % 2.5;
        const progress = Math.min(1, t / 1.8);
        rollingBallRef.current.position.set(
          Math.sin(progress * Math.PI) * 0.3,
          1.8 - progress * 1.35,
          -0.2 + progress * 2.0
        );
        rollingBallRef.current.rotation.x += delta * 8;
        rollingBallRef.current.scale.setScalar(1);
      } else if (phase === 'observation' || phase === 'batch-trials') {
        // Sits proudly on the spotlight tray
        rollingBallRef.current.position.set(0, 0.45, 1.8);
        rollingBallRef.current.scale.setScalar(1.2);
        rollingBallRef.current.rotation.y += delta * 1.2;
      } else {
        // Hidden inside bag
        rollingBallRef.current.position.set(0, 1.4, 0);
        rollingBallRef.current.scale.setScalar(0);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── Spotlight on Drawn Ball Platter ── */}
      <spotLight
        ref={spotlightRef}
        position={[0, 8, 3]}
        target-position={[0, 0.4, 1.8]}
        intensity={phase === 'observation' ? 4.5 : 1.5}
        angle={0.5}
        penumbra={0.6}
        color="#fffbeb"
        castShadow
      />

      {/* ── Polished Wooden Carnival Booth Table Base ── */}
      <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.6, 36]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[3.8, 4.1, 0.15, 36]} />
        <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ── 3D PHYSICAL CLOTH CARNIVAL SACK / BAG ── */}
      <group position={[0, 0.25, 0]}>
        {/* Main Sack Body (Bulbous base) */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <sphereGeometry args={[1.4, 32, 24]} />
          <meshStandardMaterial color="#9a3412" roughness={0.85} metalness={0.05} />
        </mesh>

        {/* Sack Neck & Opening Rim */}
        <group ref={bagNeckRef} position={[0, 1.4, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.9, 1.3, 0.8, 28, 1, true]} />
            <meshStandardMaterial color="#c2410c" roughness={0.8} />
          </mesh>
          {/* Gold Drawstring Cord & Tassels */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <torusGeometry args={[0.95, 0.08, 16, 32]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Gold Eyelets */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              position={[Math.cos((i * Math.PI) / 4) * 0.96, 0.1, Math.sin((i * Math.PI) / 4) * 0.96]}
              castShadow
            >
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
            </mesh>
          ))}
        </group>

        {/* ── The 9 Physical 3D Spheres Inside Bag ── */}
        {ballsInBag.map((b) => (
          <mesh key={b.id} position={b.pos} castShadow>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color={b.color} roughness={0.25} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ── Front Wooden Collection Tray / Spotlight Platter ── */}
      <group position={[0, 0.25, 1.8]}>
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.95, 0.16, 24]} />
          <meshStandardMaterial color="#451a03" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.17, 0]} receiveShadow>
          <cylinderGeometry args={[0.75, 0.75, 0.04, 24]} />
          <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>

      {/* ── Active Rolling / Drawn Ball (Spotlight Winner) ── */}
      <mesh ref={rollingBallRef} castShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color={activeColor}
          roughness={0.2}
          metalness={0.25}
          emissive={activeColor}
          emissiveIntensity={phase === 'observation' ? 0.35 : 0}
        />
      </mesh>

      {/* ── Mechanical Scoop Grabber Arm ── */}
      <group ref={grabberArmRef} position={[0, 3.2, 0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 12]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
        {/* Brass Scoop Cup */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <sphereGeometry args={[0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
};
