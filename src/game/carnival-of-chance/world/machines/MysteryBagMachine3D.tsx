// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Mystery Chests & Bag 3D Physical Machine
// Ornate Victorian Carnival Stage with 3 glowing treasure chests,
// genuine 3D cloth sack holding real physical probability spheres,
// mechanical brass grabber scoop, and spotlight prize tray
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
  const chestLidRef = useRef<THREE.Group>(null);

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

  // Generate the actual physical 3D spheres distributed inside the bag opening
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
          pos: [Math.cos(angle) * radius, 1.45 + (id % 2) * 0.18, Math.sin(angle) * radius],
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
        const s = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.04;
        bagNeckRef.current.scale.set(s, 1, s);
      }
    }

    // 2. Chest Lid opening animation during observation
    if (chestLidRef.current) {
      if (phase === 'observation' || phase === 'batch-trials') {
        chestLidRef.current.rotation.x = THREE.MathUtils.lerp(chestLidRef.current.rotation.x, -1.1, delta * 4);
      } else {
        chestLidRef.current.rotation.x = THREE.MathUtils.lerp(chestLidRef.current.rotation.x, 0, delta * 4);
      }
    }

    // 3. Mechanical Grabber Scoop Animation
    if (grabberArmRef.current) {
      if (phase === 'operating') {
        const t = (state.clock.getElapsedTime() * 2.2) % 3;
        if (t < 1.0) {
          grabberArmRef.current.position.y = THREE.MathUtils.lerp(grabberArmRef.current.position.y, 1.5, delta * 6);
        } else if (t < 2.0) {
          grabberArmRef.current.position.y = 1.4;
          grabberArmRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 12) * 0.15;
        } else {
          grabberArmRef.current.position.y = THREE.MathUtils.lerp(grabberArmRef.current.position.y, 2.9, delta * 5);
        }
      } else {
        grabberArmRef.current.position.y = THREE.MathUtils.lerp(grabberArmRef.current.position.y, 3.4, delta * 4);
      }
    }

    // 4. Physical Drawn Ball Rolling & Tray Landing
    if (rollingBallRef.current) {
      if (phase === 'operating') {
        const t = (state.clock.getElapsedTime() * 1.5) % 2.5;
        const progress = Math.min(1, t / 1.8);
        rollingBallRef.current.position.set(
          Math.sin(progress * Math.PI) * 0.3,
          1.9 - progress * 1.35,
          -0.2 + progress * 2.1
        );
        rollingBallRef.current.rotation.x += delta * 8;
        rollingBallRef.current.scale.setScalar(1);
      } else if (phase === 'observation' || phase === 'batch-trials') {
        rollingBallRef.current.position.set(0, 0.55, 1.9);
        rollingBallRef.current.scale.setScalar(1.2);
        rollingBallRef.current.rotation.y += delta * 1.2;
      } else {
        rollingBallRef.current.position.set(0, 1.5, 0);
        rollingBallRef.current.scale.setScalar(0);
      }
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* ── Dramatic Spotlight ── */}
      <spotLight
        ref={spotlightRef}
        position={[0, 9, 4]}
        target-position={[0, 0.5, 1.9]}
        intensity={phase === 'observation' ? 4.5 : 2.0}
        angle={0.55}
        penumbra={0.6}
        color="#fffbeb"
        castShadow
      />

      {/* ── Ornate Wooden Carnival Stage Base ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.3, 36]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {/* Red Velvet Table Runner */}
      <mesh position={[0, 0.32, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.8, 4.1, 0.08, 36]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>
      {/* Gold Trim */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[3.82, 3.82, 0.04, 36]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ═════════════════════════════════════════════════════════════
          ORNATE 3D TREASURE CHESTS ON STAGE
          ═════════════════════════════════════════════════════════════ */}
      {/* Left Treasure Chest */}
      <group position={[-2.1, 0.65, -0.4]} rotation={[0, 0.25, 0]}>
        {/* Chest Base Box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.65, 0.8]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
        {/* Brass corner brackets & bands */}
        {[-0.45, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 0.67, 0.82]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
          </mesh>
        ))}
        {/* Keyhole Plate */}
        <mesh position={[0, 0, 0.42]} castShadow>
          <boxGeometry args={[0.18, 0.2, 0.02]} />
          <meshStandardMaterial color="#fef08a" metalness={0.95} />
        </mesh>
        {/* Chest Lid */}
        <mesh position={[0, 0.36, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#b45309" roughness={0.5} />
        </mesh>
      </group>

      {/* Right Treasure Chest (Opens on Observation!) */}
      <group position={[2.1, 0.65, -0.4]} rotation={[0, -0.25, 0]}>
        {/* Chest Base Box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.65, 0.8]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
        {[-0.45, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 0.67, 0.82]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
          </mesh>
        ))}
        {/* Keyhole */}
        <mesh position={[0, 0, 0.42]} castShadow>
          <boxGeometry args={[0.18, 0.2, 0.02]} />
          <meshStandardMaterial color="#fef08a" metalness={0.95} />
        </mesh>
        {/* Animated Hinged Lid */}
        <group ref={chestLidRef} position={[0, 0.32, -0.4]}>
          <mesh position={[0, 0.15, 0.4]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 1.2, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#b45309" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          CENTRAL 3D CLOTH SACK HOLDING PHYSICAL BALLS
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 0.35, 0]}>
        {/* Sack Velvet Pedestal Base */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.7, 0.2, 24]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.8} />
        </mesh>

        {/* Sack Bulbous Body */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <sphereGeometry args={[1.35, 32, 24]} />
          <meshStandardMaterial color="#9a3412" roughness={0.85} metalness={0.05} />
        </mesh>

        {/* Sack Neck & Opening Rim */}
        <group ref={bagNeckRef} position={[0, 1.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.9, 1.25, 0.8, 28, 1, true]} />
            <meshStandardMaterial color="#c2410c" roughness={0.8} />
          </mesh>
          {/* Gold Drawstring Cord */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <torusGeometry args={[0.95, 0.08, 16, 32]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Gold Grommets */}
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

        {/* The Actual 3D Probability Spheres Inside Bag */}
        {ballsInBag.map((b) => (
          <mesh key={b.id} position={b.pos} castShadow>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color={b.color} roughness={0.25} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ── Front Wooden Collection Tray / Spotlight Platter ── */}
      <group position={[0, 0.35, 1.9]}>
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.95, 0.16, 24]} />
          <meshStandardMaterial color="#451a03" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.17, 0]} receiveShadow>
          <cylinderGeometry args={[0.75, 0.75, 0.04, 24]} />
          <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.6} />
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
      <group ref={grabberArmRef} position={[0, 3.4, 0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 12]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <sphereGeometry args={[0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
};
