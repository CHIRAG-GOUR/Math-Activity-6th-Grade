// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Game Builder 3D Physical Machine
// 2 Distinct Collector Containers Below:
// - LEFT CONTAINER (Alternative Outcome / Left Path)
// - RIGHT CONTAINER (Target Outcome / Right Path)
// Real Arcade Game Bouncing Physics:
// - Staggered Brass Pins + Side Elastic Bumpers + Center Wedge Deflector
// - Rich multi-phase ricochet tumbling arcs into bottom containers!
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const GameBuilderMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);

  const gear1Ref = useRef<THREE.Group>(null);
  const gear2Ref = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  const leftContainerRef = useRef<THREE.Group>(null);
  const rightContainerRef = useRef<THREE.Group>(null);

  const setup = activeChallenge?.setup || {
    totalItems: 6,
    items: [
      { color: '#10b981', colorName: 'Green', count: 4 },
      { color: '#ef4444', colorName: 'Red', count: 2 },
    ],
    targetColor: '#10b981',
  };

  const itemA = setup.items[0] || { color: '#10b981', colorName: 'Win', count: 4 };
  const itemB = setup.items[1] || { color: '#ef4444', colorName: 'Loss', count: 2 };

  // Determine whether drop lands in Right Container (Target/Win) or Left Container (Alternative/Loss)
  const isTargetRight = useMemo(() => {
    if (drawnOutcome && activeChallenge?.setup.targetColor) {
      return drawnOutcome.color === activeChallenge.setup.targetColor;
    }
    return blueTeam.lastResult === 'correct' || redTeam.lastResult === 'correct';
  }, [drawnOutcome, activeChallenge, blueTeam.lastResult, redTeam.lastResult]);

  const activeColor = drawnOutcome?.color || (isTargetRight ? itemA.color : itemB.color);

  // Staggered brass pins grid for Plinko board
  const pins = useMemo(() => {
    const list: { id: number; x: number; y: number }[] = [];
    let id = 0;
    const rows = [
      { y: 3.2, count: 3, spacing: 0.65 },
      { y: 2.7, count: 4, spacing: 0.6 },
      { y: 2.2, count: 5, spacing: 0.55 },
      { y: 1.7, count: 4, spacing: 0.6 },
      { y: 1.2, count: 3, spacing: 0.65 },
    ];

    rows.forEach((row) => {
      const half = ((row.count - 1) * row.spacing) / 2;
      for (let i = 0; i < row.count; i++) {
        list.push({
          id: id++,
          x: -half + i * row.spacing,
          y: row.y,
        });
      }
    });
    return list;
  }, []);

  useFrame((state, delta) => {
    const tClock = state.clock.getElapsedTime();

    // 1. Spinning Workshop Gears
    if (gear1Ref.current) {
      gear1Ref.current.rotation.z += delta * (phase === 'operating' ? 6 : 0.8);
    }
    if (gear2Ref.current) {
      gear2Ref.current.rotation.z -= delta * (phase === 'operating' ? 6 : 0.8);
    }

    // 2. Realistic Arcade Game Bouncing Physics (No straight drops!)
    if (ballRef.current) {
      if (phase === 'operating') {
        const cycle = 2.0;
        const t = (tClock * 1.0) % (cycle + 0.5);
        const progress = Math.min(1, t / cycle);

        let x = 0;
        let y = 3.9;
        let z = 0.35;

        if (isTargetRight) {
          // ── RIGHT CONTAINER ARCADE BOUNCE TRAJECTORY ──
          if (progress < 0.2) {
            const p = progress / 0.2;
            x = THREE.MathUtils.lerp(0, 0.15, p) + Math.sin(p * Math.PI) * 0.08;
            y = 3.9 - p * 0.7; // 3.9 -> 3.2
          } else if (progress < 0.42) {
            const p = (progress - 0.2) / 0.22;
            x = 0.15 + p * 0.4 + Math.sin(p * Math.PI) * 0.12; // 0.15 -> 0.55
            y = 3.2 - p * 0.8 + Math.sin(p * Math.PI) * 0.15; // 3.2 -> 2.4
          } else if (progress < 0.65) {
            const p = (progress - 0.42) / 0.23;
            x = 0.55 + p * 0.4 + Math.sin(p * Math.PI) * 0.18; // 0.55 -> 0.95
            y = 2.4 - p * 0.9 + Math.sin(p * Math.PI) * 0.2; // 2.4 -> 1.5
          } else if (progress < 0.85) {
            const p = (progress - 0.65) / 0.2;
            x = 0.95 + p * 0.15; // 0.95 -> 1.1
            y = 1.5 - p * 0.95; // 1.5 -> 0.55
          } else {
            const p = (progress - 0.85) / 0.15;
            x = 1.1;
            const bounce = Math.sin(p * Math.PI * 2.5) * Math.exp(-p * 3) * 0.2;
            y = 0.55 + Math.max(0, bounce);
          }
        } else {
          // ── WRONG ANSWER: BALL FALLS OUTSIDE BOTH BUCKETS ──
          if (progress < 0.2) {
            const p = progress / 0.2;
            x = THREE.MathUtils.lerp(0, -0.2, p) + Math.sin(p * Math.PI) * 0.08;
            y = 3.9 - p * 0.7; // 3.9 -> 3.2
            z = 0.35;
          } else if (progress < 0.45) {
            const p = (progress - 0.2) / 0.25;
            x = -0.2 + p * 0.5 + Math.sin(p * Math.PI) * 0.15; // -0.2 -> 0.3
            y = 3.2 - p * 0.9 + Math.sin(p * Math.PI) * 0.15; // 3.2 -> 2.3
            z = 0.35;
          } else if (progress < 0.7) {
            const p = (progress - 0.45) / 0.25;
            x = 0.3 - p * 0.35; // 0.3 -> -0.05
            y = 2.3 - p * 1.2 + Math.sin(p * Math.PI) * 0.2; // 2.3 -> 1.1
            z = 0.35 + p * 0.55; // 0.35 -> 0.9 (Pops forward past buckets)
          } else if (progress < 0.9) {
            const p = (progress - 0.7) / 0.2;
            x = -0.05 + p * 0.05; // -0.05 -> 0.0
            y = 1.1 - p * 1.5; // 1.1 -> -0.4 (Down past workbench)
            z = 0.9 + p * 0.4; // 0.9 -> 1.3
          } else {
            const p = (progress - 0.9) / 0.1;
            x = 0;
            const bounce = Math.sin(p * Math.PI * 2) * Math.exp(-p * 3) * 0.15;
            y = -0.42 + Math.max(0, bounce);
            z = 1.3 + p * 0.1;
          }
        }

        ballRef.current.position.set(x, y, z);
        ballRef.current.scale.setScalar(1);
        ballRef.current.rotation.x += delta * 15;
        ballRef.current.rotation.z += delta * (isTargetRight ? -12 : 8);
      } else if (phase === 'observation' || phase === 'batch-trials') {
        if (isTargetRight) {
          const bob = Math.sin(tClock * 3) * 0.03;
          ballRef.current.position.set(1.1, 0.58 + bob, 0.35);
        } else {
          ballRef.current.position.set(0, -0.42, 1.4);
        }
        ballRef.current.scale.setScalar(1.15);
        ballRef.current.rotation.y += delta * 1.5;
      } else {
        // Stored in top hopper waiting for release
        ballRef.current.position.set(0, 4.0, 0.35);
        ballRef.current.scale.setScalar(1);
      }
    }

    // 3. Container vibration feedback
    if (leftContainerRef.current) {
      if (phase === 'operating' && !isTargetRight) {
        const s = 1 + Math.sin(tClock * 20) * 0.02;
        leftContainerRef.current.scale.set(s, 1, s);
      } else {
        leftContainerRef.current.scale.set(1, 1, 1);
      }
    }

    if (rightContainerRef.current) {
      if (phase === 'operating' && isTargetRight) {
        const s = 1 + Math.sin(tClock * 20) * 0.02;
        rightContainerRef.current.scale.set(s, 1, s);
      } else {
        rightContainerRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Studio Lighting ── */}
      <spotLight
        position={[0, 9, 6]}
        target-position={[0, 2.2, 0]}
        intensity={2.5}
        angle={0.65}
        penumbra={0.4}
        color="#fffbeb"
        castShadow
      />

      {/* ── Carpenter Workbench Base ── */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.3, 2.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.1, 2.4]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.4} />
      </mesh>

      {/* ── Side Workshop Dice ── */}
      {/* Red Die (Left) */}
      <group position={[-1.85, 0.75, 0.5]} rotation={[0.2, 0.4, 0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.28]} castShadow>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Blue Die (Right) */}
      <group position={[1.85, 0.75, 0.5]} rotation={[-0.2, -0.3, 0.15]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} />
        </mesh>
        {[
          [-0.12, 0.12, 0.28],
          [0.12, -0.12, 0.28],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* ── Side Brass Gears ── */}
      <group ref={gear1Ref} position={[-1.75, 2.5, -0.1]}>
        <mesh castShadow>
          <torusGeometry args={[0.45, 0.08, 12, 24]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.15} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 4) * 0.48,
              Math.sin((i * Math.PI) / 4) * 0.48,
              0,
            ]}
            rotation={[0, 0, (i * Math.PI) / 4]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.12, 0.06]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} />
          </mesh>
        ))}
      </group>

      <group ref={gear2Ref} position={[1.75, 2.5, -0.1]}>
        <mesh castShadow>
          <torusGeometry args={[0.45, 0.08, 12, 24]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.15} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 4) * 0.48,
              Math.sin((i * Math.PI) / 4) * 0.48,
              0,
            ]}
            rotation={[0, 0, (i * Math.PI) / 4]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.12, 0.06]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ── Main Plinko Pegboard Frame ── */}
      <group position={[0, 2.4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 3.4, 0.25]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        {/* Inner Backboard */}
        <mesh position={[0, 0, 0.14]} receiveShadow>
          <planeGeometry args={[2.9, 3.1]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.3} />
        </mesh>
        {/* Gold Trim Borders */}
        {[-1.45, 1.45].map((x, i) => (
          <mesh key={`v-trim-${i}`} position={[x, 0, 0.16]} castShadow>
            <boxGeometry args={[0.1, 3.2, 0.1]} />
            <meshStandardMaterial color="#fed500" metalness={0.7} />
          </mesh>
        ))}
        {[-1.55, 1.55].map((y, i) => (
          <mesh key={`h-trim-${i}`} position={[0, y, 0.16]} castShadow>
            <boxGeometry args={[3.0, 0.1, 0.1]} />
            <meshStandardMaterial color="#fed500" metalness={0.7} />
          </mesh>
        ))}

        {/* ── Brass Pins Grid ── */}
        {pins.map((pin) => (
          <group key={pin.id} position={[pin.x, pin.y - 2.4, 0.24]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.1]} castShadow>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} />
            </mesh>
          </group>
        ))}

        {/* Side Deflector Bumpers */}
        <group position={[-1.05, -0.6, 0.2]}>
          <mesh rotation={[0, 0, 0.35]} castShadow>
            <boxGeometry args={[0.12, 1.0, 0.15]} />
            <meshStandardMaterial color="#ff2a6d" roughness={0.3} />
          </mesh>
        </group>
        <group position={[1.05, -0.6, 0.2]}>
          <mesh rotation={[0, 0, -0.35]} castShadow>
            <boxGeometry args={[0.12, 1.0, 0.15]} />
            <meshStandardMaterial color="#00f0a8" roughness={0.3} />
          </mesh>
        </group>

        {/* Center Wedge Deflector */}
        <group position={[0, -1.2, 0.24]}>
          <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.26, 0.5, 4]} />
            <meshStandardMaterial color="#fed500" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ── Top Funnel Hopper (`y = 4.1`) ── */}
      <group position={[0, 4.15, 0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.22, 0.5, 20]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.26, 0]} castShadow>
          <torusGeometry args={[0.5, 0.05, 12, 24]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          TWO 3D COLLECTOR BINS / CONTAINERS BELOW
          ═════════════════════════════════════════════════════════════ */}

      {/* ── 1. LEFT CONTAINER: ALTERNATIVE / WRONG OUTCOME (`x = -1.1`) ── */}
      <group ref={leftContainerRef} position={[-1.1, 0.45, 0.35]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.48, 0.35, 0.25, 24, 1, true]} />
          <meshStandardMaterial color="#ff2a6d" roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow>
          <torusGeometry args={[0.48, 0.04, 12, 24]} />
          <meshStandardMaterial color="#ffffff" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.38, 0.4, 24]} />
          <meshStandardMaterial color="#ff2a6d" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <torusGeometry args={[0.36, 0.025, 10, 24]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.44, 0.08, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>

        {/* Neo-Brutalist 3D Label Plaque */}
        <group position={[0, 0.16, 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.2, 0.05]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.6, 0.15]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      {/* ── 2. RIGHT CONTAINER: TARGET / WIN OUTCOME (`x = +1.1`) ── */}
      <group ref={rightContainerRef} position={[1.1, 0.45, 0.35]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.48, 0.35, 0.25, 24, 1, true]} />
          <meshStandardMaterial color="#00f0a8" roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow>
          <torusGeometry args={[0.48, 0.04, 12, 24]} />
          <meshStandardMaterial color="#000000" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.38, 0.4, 24]} />
          <meshStandardMaterial color="#00f0a8" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <torusGeometry args={[0.36, 0.025, 10, 24]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.44, 0.08, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>

        {/* Neo-Brutalist 3D Label Plaque */}
        <group position={[0, 0.16, 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.2, 0.05]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.6, 0.15]} />
            <meshStandardMaterial color="#fed500" />
          </mesh>
        </group>
      </group>

      {/* ── ACTIVE DROPPING PROBABILITY BALL ── */}
      <mesh ref={ballRef} castShadow>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial
          color={activeColor}
          roughness={0.2}
          metalness={0.25}
          emissive={activeColor}
          emissiveIntensity={phase === 'observation' ? 0.4 : 0.05}
        />
      </mesh>
    </group>
  );
};
