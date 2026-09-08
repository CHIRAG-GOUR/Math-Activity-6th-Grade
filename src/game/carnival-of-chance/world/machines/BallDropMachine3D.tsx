// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Giant Pachinko Ball Drop 3D Machine
// 2 Distinct Collector Containers Below:
// - LEFT CONTAINER (Alternative Outcome / Left Path)
// - RIGHT CONTAINER (Target Outcome / Right Path)
// Rich Arcade Game Bouncing Physics:
// - Staggered Brass Peg Grid + Side Bounce Bumpers + Center Wedge Deflector
// - Natural multi-stage ricochet arcs tumbling through pins into the container!
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const BallDropMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);

  const droppingBallRef = useRef<THREE.Mesh>(null);
  const leftContainerRef = useRef<THREE.Group>(null);
  const rightContainerRef = useRef<THREE.Group>(null);
  const funnelHatchRef = useRef<THREE.Mesh>(null);

  const setup = activeChallenge?.setup || {
    totalItems: 10,
    items: [
      { color: '#10b981', colorName: 'Green', count: 7 },
      { color: '#ef4444', colorName: 'Red', count: 3 },
    ],
    targetColor: '#10b981',
  };

  const itemA = setup.items[0] || { color: '#10b981', colorName: 'Green', count: 7 };
  const itemB = setup.items[1] || { color: '#ef4444', colorName: 'Red', count: 3 };

  // Determine whether this drop goes to the Right Container (Target/Correct) or Left Container (Alternative/Wrong)
  const isTargetRight = useMemo(() => {
    if (drawnOutcome && activeChallenge?.setup.targetColor) {
      return drawnOutcome.color === activeChallenge.setup.targetColor;
    }
    return blueTeam.lastResult === 'correct' || redTeam.lastResult === 'correct';
  }, [drawnOutcome, activeChallenge, blueTeam.lastResult, redTeam.lastResult]);

  const activeBallColor = drawnOutcome?.color || (isTargetRight ? itemA.color : itemB.color);

  // Staggered brass pins grid for the pachinko board
  const pins = useMemo(() => {
    const list: { id: number; x: number; y: number }[] = [];
    let id = 0;
    // 5 rows of staggered pins
    const rows = [
      { y: 3.3, count: 3, spacing: 0.7 },
      { y: 2.8, count: 4, spacing: 0.65 },
      { y: 2.3, count: 5, spacing: 0.6 },
      { y: 1.8, count: 4, spacing: 0.65 },
      { y: 1.3, count: 3, spacing: 0.7 },
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

    // 1. Funnel solenoid door actuation
    if (funnelHatchRef.current) {
      if (phase === 'operating') {
        funnelHatchRef.current.rotation.z = THREE.MathUtils.lerp(
          funnelHatchRef.current.rotation.z,
          isTargetRight ? -0.8 : 0.8,
          delta * 8
        );
      } else {
        funnelHatchRef.current.rotation.z = THREE.MathUtils.lerp(
          funnelHatchRef.current.rotation.z,
          0,
          delta * 4
        );
      }
    }

    // 2. Realistic Arcade Game Bouncing Ball Physics
    if (droppingBallRef.current) {
      if (phase === 'operating') {
        const cycle = 2.0; // 2.0 second drop sequence
        const t = (tClock * 1.0) % (cycle + 0.5);
        const progress = Math.min(1, t / cycle);

        let x = 0;
        let y = 4.0;
        let z = 0.45;

        if (isTargetRight) {
          // ── RIGHT CONTAINER ARCADE BOUNCE TRAJECTORY ──
          if (progress < 0.2) {
            // Stage 1: Drop from hopper & strike 1st top pin
            const p = progress / 0.2;
            x = THREE.MathUtils.lerp(0, 0.15, p) + Math.sin(p * Math.PI) * 0.08;
            y = 4.0 - p * 0.7; // 4.0 -> 3.3
          } else if (progress < 0.42) {
            // Stage 2: Ricochet right towards mid tier pin with parabolic arc
            const p = (progress - 0.2) / 0.22;
            x = 0.15 + p * 0.45 + Math.sin(p * Math.PI) * 0.12; // 0.15 -> 0.60
            y = 3.3 - p * 0.8 + Math.sin(p * Math.PI) * 0.15; // 3.3 -> 2.5
          } else if (progress < 0.65) {
            // Stage 3: Hit side rubber bumper & bounce aggressively into chute
            const p = (progress - 0.42) / 0.23;
            x = 0.6 + p * 0.45 + Math.sin(p * Math.PI) * 0.18; // 0.6 -> 1.05
            y = 2.5 - p * 0.9 + Math.sin(p * Math.PI) * 0.2; // 2.5 -> 1.6
          } else if (progress < 0.85) {
            // Stage 4: Freefall into Right Container mouth
            const p = (progress - 0.65) / 0.2;
            x = 1.05 + p * 0.15; // 1.05 -> 1.2
            y = 1.6 - p * 1.05; // 1.6 -> 0.55
          } else {
            // Stage 5: Container landing with decaying vertical bounce
            const p = (progress - 0.85) / 0.15;
            x = 1.2;
            const bounce = Math.sin(p * Math.PI * 2.5) * Math.exp(-p * 3) * 0.22;
            y = 0.55 + Math.max(0, bounce);
          }
        } else {
          // ── WRONG ANSWER: BALL FALLS OUTSIDE BOTH BUCKETS ──
          if (progress < 0.2) {
            // Stage 1: Drop from hopper & strike center pin
            const p = progress / 0.2;
            x = THREE.MathUtils.lerp(0, -0.2, p) + Math.sin(p * Math.PI) * 0.08;
            y = 4.0 - p * 0.7; // 4.0 -> 3.3
            z = 0.45;
          } else if (progress < 0.45) {
            // Stage 2: Erratic ricochet between middle pins
            const p = (progress - 0.2) / 0.25;
            x = -0.2 + p * 0.5 + Math.sin(p * Math.PI) * 0.15; // -0.2 -> 0.3
            y = 3.3 - p * 0.9 + Math.sin(p * Math.PI) * 0.15; // 3.3 -> 2.4
            z = 0.45;
          } else if (progress < 0.7) {
            // Stage 3: Strikes center divider wedge & pops outward past the buckets
            const p = (progress - 0.45) / 0.25;
            x = 0.3 - p * 0.35; // 0.3 -> -0.05 (Center miss gutter)
            y = 2.4 - p * 1.2 + Math.sin(p * Math.PI) * 0.25; // 2.4 -> 1.2
            z = 0.45 + p * 0.55; // 0.45 -> 1.0 (Flies forward past buckets)
          } else if (progress < 0.9) {
            // Stage 4: Freefall down past both buckets to the floor
            const p = (progress - 0.7) / 0.2;
            x = -0.05 + p * 0.05; // -0.05 -> 0.0
            y = 1.2 - p * 1.6; // 1.2 -> -0.4 (Down past table)
            z = 1.0 + p * 0.4; // 1.0 -> 1.4
          } else {
            // Stage 5: Bounces on floor gutter outside both buckets
            const p = (progress - 0.9) / 0.1;
            x = 0;
            const bounce = Math.sin(p * Math.PI * 2) * Math.exp(-p * 3) * 0.15;
            y = -0.42 + Math.max(0, bounce);
            z = 1.4 + p * 0.1;
          }
        }

        droppingBallRef.current.position.set(x, y, z);
        droppingBallRef.current.scale.setScalar(1);
        droppingBallRef.current.rotation.x += delta * 15;
        droppingBallRef.current.rotation.z += delta * (isTargetRight ? -12 : 8);
      } else if (phase === 'observation' || phase === 'batch-trials') {
        if (isTargetRight) {
          // Settled inside right container with soft bobbing highlight
          const bob = Math.sin(tClock * 3) * 0.03;
          droppingBallRef.current.position.set(1.2, 0.58 + bob, 0.45);
        } else {
          // Settled on floor outside both buckets
          droppingBallRef.current.position.set(0, -0.42, 1.5);
        }
        droppingBallRef.current.scale.setScalar(1.15);
        droppingBallRef.current.rotation.y += delta * 1.5;
      } else {
        // Stored in top hopper waiting for release
        droppingBallRef.current.position.set(0, 4.2, 0.45);
        droppingBallRef.current.scale.setScalar(0.9);
      }
    }

    // 3. Container reactive feedback vibration when ball lands
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
        intensity={2.6}
        angle={0.65}
        penumbra={0.4}
        color="#fffbeb"
        castShadow
      />

      {/* ── Heavy Stepped Base Platform ── */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.3, 2.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.1, 1.9]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── Main Pachinko Pegboard Backing Frame ── */}
      <group position={[0, 2.4, 0]}>
        {/* Outer Wooden/Metal Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 3.6, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>

        {/* Board Face (Vibrant Arcade Teal with Yellow Border) */}
        <mesh position={[0, 0, 0.16]} receiveShadow>
          <planeGeometry args={[3.1, 3.3]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Yellow Neo-Brutalist Border Frame */}
        {[-1.55, 1.55].map((x, i) => (
          <mesh key={`border-v-${i}`} position={[x, 0, 0.2]} castShadow>
            <boxGeometry args={[0.12, 3.4, 0.15]} />
            <meshStandardMaterial color="#fed500" metalness={0.6} />
          </mesh>
        ))}
        {[-1.65, 1.65].map((y, i) => (
          <mesh key={`border-h-${i}`} position={[0, y, 0.2]} castShadow>
            <boxGeometry args={[3.22, 0.12, 0.15]} />
            <meshStandardMaterial color="#fed500" metalness={0.6} />
          </mesh>
        ))}

        {/* ── Pachinko Brass Pins / Pegs Grid ── */}
        {pins.map((pin) => (
          <group key={pin.id} position={[pin.x, pin.y - 2.4, 0.3]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.045, 0.25, 12]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.12]} castShadow>
              <sphereGeometry args={[0.065, 12, 12]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} />
            </mesh>
          </group>
        ))}

        {/* ── Side Elastic Bounce Bumpers (Angled Triangles) ── */}
        {/* Left Bumper */}
        <group position={[-1.15, -0.7, 0.25]}>
          <mesh rotation={[0, 0, 0.35]} castShadow>
            <boxGeometry args={[0.15, 1.1, 0.18]} />
            <meshStandardMaterial color="#ff2a6d" roughness={0.3} />
          </mesh>
        </group>
        {/* Right Bumper */}
        <group position={[1.15, -0.7, 0.25]}>
          <mesh rotation={[0, 0, -0.35]} castShadow>
            <boxGeometry args={[0.15, 1.1, 0.18]} />
            <meshStandardMaterial color="#00f0a8" roughness={0.3} />
          </mesh>
        </group>

        {/* ── Center Divider Wedge Deflector (Splits ball to left or right) ── */}
        <group position={[0, -1.3, 0.3]}>
          <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.3, 0.6, 4]} />
            <meshStandardMaterial color="#fed500" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ── Top Ball Dispenser / Hopper Funnel (`y = 4.2`) ── */}
      <group position={[0, 4.35, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.55, 0.25, 0.6, 20]} />
          <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <torusGeometry args={[0.55, 0.06, 12, 24]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>
        {/* Solenoid Release Flap */}
        <mesh ref={funnelHatchRef} position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.32, 0.05, 0.25]} />
          <meshStandardMaterial color="#ff2a6d" />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          TWO 3D COLLECTOR BINS / CONTAINERS BELOW
          ═════════════════════════════════════════════════════════════ */}

      {/* ── 1. LEFT CONTAINER: ALTERNATIVE OUTCOME / WRONG PATH (`x = -1.2`) ── */}
      <group ref={leftContainerRef} position={[-1.2, 0.45, 0.45]}>
        {/* Hopper Mouth Cone */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.52, 0.38, 0.3, 24, 1, true]} />
          <meshStandardMaterial color="#ff2a6d" roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <torusGeometry args={[0.52, 0.05, 12, 24]} />
          <meshStandardMaterial color="#ffffff" metalness={0.6} />
        </mesh>

        {/* Main Cylinder Bin Body */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.42, 0.45, 24]} />
          <meshStandardMaterial color="#ff2a6d" roughness={0.5} />
        </mesh>

        {/* Brass Support Rings */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <torusGeometry args={[0.39, 0.03, 10, 24]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.46, 0.48, 0.1, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>

        {/* Neo-Brutalist 3D Label Plaque */}
        <group position={[0, 0.18, 0.44]}>
          <mesh castShadow>
            <boxGeometry args={[0.72, 0.22, 0.06]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[0.66, 0.16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      {/* ── 2. RIGHT CONTAINER: TARGET OUTCOME / CORRECT PATH (`x = +1.2`) ── */}
      <group ref={rightContainerRef} position={[1.2, 0.45, 0.45]}>
        {/* Hopper Mouth Cone */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.52, 0.38, 0.3, 24, 1, true]} />
          <meshStandardMaterial color="#00f0a8" roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <torusGeometry args={[0.52, 0.05, 12, 24]} />
          <meshStandardMaterial color="#000000" metalness={0.6} />
        </mesh>

        {/* Main Cylinder Bin Body */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.42, 0.45, 24]} />
          <meshStandardMaterial color="#00f0a8" roughness={0.5} />
        </mesh>

        {/* Brass Support Rings */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <torusGeometry args={[0.39, 0.03, 10, 24]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.46, 0.48, 0.1, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>

        {/* Neo-Brutalist 3D Label Plaque */}
        <group position={[0, 0.18, 0.44]}>
          <mesh castShadow>
            <boxGeometry args={[0.72, 0.22, 0.06]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[0.66, 0.16]} />
            <meshStandardMaterial color="#fed500" />
          </mesh>
        </group>
      </group>

      {/* ── ACTIVE DROPPING PROBABILITY BALL ── */}
      <mesh ref={droppingBallRef} castShadow>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color={activeBallColor}
          roughness={0.2}
          metalness={0.25}
          emissive={activeBallColor}
          emissiveIntensity={phase === 'observation' ? 0.4 : 0.05}
        />
      </mesh>
    </group>
  );
};
