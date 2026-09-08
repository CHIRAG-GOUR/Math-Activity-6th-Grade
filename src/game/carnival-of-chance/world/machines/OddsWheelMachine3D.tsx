// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Odds Wheel 3D Physical Machine
// Authentic Victorian / Neo-Brutalist Carnival Prize Spinner Wheel:
// - Completely Unobstructed Front View (Stand strictly BEHIND the wheel)
// - 8 Vibrant Alternating Sectors: Green "CORRECT" (WIN) & Red "WRONG" (TRY AGAIN)
// - High-Resolution Dynamic Canvas Face Texture with Gold Foil Accents
// - 24 Incandescent Circumference Carnival Bulbs with Chasing Warm Glow
// - Perimeter Brass Dividing Spokes & Pegs
// - Top 12 O'Clock Ratchet Pointer (Flapper) vibrating physically as pegs pass
// - Outcome-Synchronized Spin: Decelerates and lands on matching outcome
// ============================================================

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

// ═══════════════════════════════════════════════════════════════
// HIGH-RESOLUTION DYNAMIC CARNIVAL WHEEL FACE TEXTURE GENERATOR
// ═══════════════════════════════════════════════════════════════
function createCarnivalWheelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 512;
  const cy = 512;
  const r = 500;
  const numSectors = 8;
  const arc = (Math.PI * 2) / numSectors;

  // Background Outer Dark Mahogany Disc
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#451a03';
  ctx.fill();

  // Heavy Brass Outer Bezel
  ctx.beginPath();
  ctx.arc(cx, cy, r - 12, 0, Math.PI * 2);
  ctx.lineWidth = 26;
  ctx.strokeStyle = '#d97706';
  ctx.stroke();

  // Golden Inlay Ring
  ctx.beginPath();
  ctx.arc(cx, cy, r - 30, 0, Math.PI * 2);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#fef08a';
  ctx.stroke();

  // 8 Alternating Radial Carnival Sectors (Green for Correct, Red for Wrong)
  for (let i = 0; i < numSectors; i++) {
    const isCorrect = i % 2 === 0;
    // With Three.js flipY=true, 3D angle θ maps to Canvas angle -θ
    const sectorAngle3D = i * arc;
    const canvasMidAngle = -sectorAngle3D;
    const startAngle = canvasMidAngle - arc / 2;
    const endAngle = canvasMidAngle + arc / 2;

    // Draw Sector Wedge
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r - 36, startAngle, endAngle);
    ctx.closePath();

    // Vibrant Radiant Sector Gradients
    const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, r - 36);
    if (isCorrect) {
      grad.addColorStop(0, '#047857'); // Emerald Green
      grad.addColorStop(0.5, '#10b981');
      grad.addColorStop(1, '#065f46');
    } else {
      grad.addColorStop(0, '#b91c1c'); // Crimson Red
      grad.addColorStop(0.5, '#ef4444');
      grad.addColorStop(1, '#991b1b');
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Sector Stroke Outline
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Sector Text & Decals
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(canvasMidAngle);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isCorrect) {
      // "CORRECT" Title
      ctx.font = '900 48px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 10;
      ctx.fillText('CORRECT', 290, -10);

      // "★ WIN ★" Subtitle
      ctx.font = '800 28px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.fillText('★ +100 PTS ★', 290, 32);

      // Rim Gold Star
      ctx.font = '900 40px sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText('★', 420, 0);
    } else {
      // "WRONG" Title
      ctx.font = '900 48px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 10;
      ctx.fillText('WRONG', 290, -10);

      // "TRY AGAIN" Subtitle
      ctx.font = '800 28px sans-serif';
      ctx.fillStyle = '#fecaca';
      ctx.shadowBlur = 6;
      ctx.fillText('TRY AGAIN', 290, 32);

      // Rim Cross
      ctx.font = '900 40px sans-serif';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('✖', 420, 0);
    }

    ctx.restore();
  }

  // Radial Gold Divider Spokes
  for (let i = 0; i < numSectors; i++) {
    const angle = -(i * arc - arc / 2);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(r - 30, 0);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();
    ctx.restore();
  }

  // Center Gold Medal Disc
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  const centerGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 110);
  centerGrad.addColorStop(0, '#fde047');
  centerGrad.addColorStop(0.6, '#f59e0b');
  centerGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = centerGrad;
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#000000';
  ctx.stroke();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const OddsWheelMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);

  const wheelRef = useRef<THREE.Group>(null);
  const pointerRef = useRef<THREE.Group>(null);

  // Wheel face canvas texture
  const wheelTexture = useMemo(() => createCarnivalWheelTexture(), []);

  // Spin animation physics state
  const spinState = useRef({
    isSpinning: false,
    startTime: 0,
    duration: 2.2, // 2.2 seconds realistic carnival deceleration
    startAngle: 0,
    targetAngle: 0,
    targetSector: 0,
  });

  const prevPhase = useRef<string>(phase);

  // Trigger spin when phase enters 'operating'
  useEffect(() => {
    if (phase === 'operating' && prevPhase.current !== 'operating') {
      const isRoundCorrect = blueTeam.isCorrect === true || redTeam.isCorrect === true;

      // Select target sector index (even: Correct [0, 2, 4, 6], odd: Wrong [1, 3, 5, 7])
      const correctSectors = [0, 2, 4, 6];
      const wrongSectors = [1, 3, 5, 7];
      const chosenSector = isRoundCorrect
        ? correctSectors[Math.floor(Math.random() * correctSectors.length)]
        : wrongSectors[Math.floor(Math.random() * wrongSectors.length)];

      const currentAngle = wheelRef.current ? wheelRef.current.rotation.z : 0;
      const targetSectorAngle = chosenSector * (Math.PI / 4);
      // Top pointer is at 12 o'clock (PI/2). To align sector k under top pointer:
      const finalRestAngle = (Math.PI / 2) - targetSectorAngle;

      const twoPi = Math.PI * 2;
      const normalizedCurrent = ((currentAngle % twoPi) + twoPi) % twoPi;
      const normalizedFinal = ((finalRestAngle % twoPi) + twoPi) % twoPi;

      let delta = normalizedCurrent - normalizedFinal;
      if (delta <= 0) delta += twoPi;

      // 5 full dramatic revolutions + remaining delta to exact sector
      const fullSpins = 5 * twoPi;
      const targetAngle = currentAngle - fullSpins - delta;

      spinState.current = {
        isSpinning: true,
        startTime: -1, // set on first frame
        duration: 2.2,
        startAngle: currentAngle,
        targetAngle,
        targetSector: chosenSector,
      };
    }
    prevPhase.current = phase;
  }, [phase, blueTeam.isCorrect, redTeam.isCorrect]);

  // Handle frame dynamics
  useFrame((state, delta) => {
    if (wheelRef.current) {
      if (phase === 'operating') {
        if (spinState.current.startTime < 0) {
          spinState.current.startTime = state.clock.getElapsedTime();
        }

        const elapsed = state.clock.getElapsedTime() - spinState.current.startTime;
        const t = Math.min(Math.max(elapsed / spinState.current.duration, 0), 1.0);

        // Heavy Carnival Wheel Deceleration Curve (Quintic Ease-Out)
        const easeOut = 1 - Math.pow(1 - t, 3.5);
        const currentZ = THREE.MathUtils.lerp(
          spinState.current.startAngle,
          spinState.current.targetAngle,
          easeOut
        );
        wheelRef.current.rotation.z = currentZ;

        // Pointer flapper ratchet vibration in sync with wheel rotation speed
        if (pointerRef.current) {
          const speedFactor = (1 - t);
          pointerRef.current.rotation.z = Math.sin(currentZ * 8) * (speedFactor * 0.35);
        }

        if (t >= 1.0) {
          spinState.current.isSpinning = false;
          if (pointerRef.current) {
            pointerRef.current.rotation.z = THREE.MathUtils.lerp(
              pointerRef.current.rotation.z,
              0,
              delta * 12
            );
          }
        }
      } else if (phase === 'observation') {
        // Locked on winning sector
        if (pointerRef.current) {
          pointerRef.current.rotation.z = THREE.MathUtils.lerp(
            pointerRef.current.rotation.z,
            0,
            delta * 12
          );
        }
      } else {
        // Gentle attraction idle spin
        wheelRef.current.rotation.z -= delta * 0.2;
        if (pointerRef.current) {
          pointerRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 3) * 0.03;
        }
      }
    }
  });

  const wheelRadius = 2.35;
  const bulbCount = 24;

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── 1. Front Spotlight Focused on Wheel Face ── */}
      <spotLight
        position={[0, 6, 7]}
        target-position={[0, 3.2, 0]}
        intensity={2.8}
        angle={0.65}
        penumbra={0.4}
        color="#fffbeb"
        castShadow
      />

      {/* ── 2. Stepped Wooden Platform Base (Positioned at `z = -0.3`) ── */}
      <group position={[0, 0.15, -0.3]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[2.8, 3.2, 0.28, 36]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.5, 2.7, 0.14, 36]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
        {/* Golden Trim Ring */}
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[2.52, 2.52, 0.04, 36]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          3. REAR HEAVY A-FRAME STAND (Strictly BEHIND the Wheel at `z = -0.45`)
          Guarantees ZERO legs or bars crossing the front of the wheel!
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, -0.45]}>
        {/* Left Stand Leg */}
        <mesh position={[-1.15, 1.8, 0]} rotation={[0, 0, -0.16]} castShadow>
          <boxGeometry args={[0.22, 3.6, 0.22]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.3} />
        </mesh>

        {/* Right Stand Leg */}
        <mesh position={[1.15, 1.8, 0]} rotation={[0, 0, 0.16]} castShadow>
          <boxGeometry args={[0.22, 3.6, 0.22]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.3} />
        </mesh>

        {/* Rear Tripod Kickstand Pole */}
        <mesh position={[0, 1.7, -0.4]} rotation={[0.22, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 3.5, 16]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>

        {/* Horizontal Steel Braces */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[2.2, 0.14, 0.18]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <boxGeometry args={[1.6, 0.14, 0.18]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Main Axle Bearing Housing (Behind Wheel) */}
        <mesh position={[0, 3.2, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.35, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          4. ROTATING CARNIVAL PRIZE WHEEL (Centered at `[0, 3.2, 0.0]`)
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 3.2, 0.0]}>
        <group ref={wheelRef}>
          {/* Solid Wooden Base Disc Backing */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[wheelRadius + 0.02, wheelRadius + 0.02, 0.1, 48]} />
            <meshStandardMaterial color="#451a03" roughness={0.6} />
          </mesh>

          {/* Heavy Brass Outer Tyre Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[wheelRadius + 0.14, wheelRadius + 0.14, 0.14, 48, 1, true]} />
            <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.15} />
          </mesh>

          {/* Inner Golden Bevel Ring */}
          <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[wheelRadius - 0.04, 0.05, 16, 48]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* ── HIGH-RESOLUTION CANVAS TEXTURE WHEEL FACE DISC ── */}
          <mesh position={[0, 0, 0.055]} castShadow receiveShadow>
            <circleGeometry args={[wheelRadius - 0.02, 64]} />
            <meshStandardMaterial
              map={wheelTexture}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>

          {/* ── 8 3D PERIMETER BRASS PEGS (PINS) BETWEEN SECTORS ── */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = i * (Math.PI / 4) - (Math.PI / 8);
            const px = Math.cos(angle) * (wheelRadius - 0.12);
            const py = Math.sin(angle) * (wheelRadius - 0.12);
            return (
              <mesh
                key={`peg-${i}`}
                position={[px, py, 0.12]}
                rotation={[Math.PI / 2, 0, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
                <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
              </mesh>
            );
          })}

          {/* ── 24 ROUND INCANDESCENT BULBS AROUND OUTER RIM ── */}
          {Array.from({ length: bulbCount }).map((_, i) => {
            const angle = (i / bulbCount) * Math.PI * 2;
            const isLit = i % 2 === 0;
            return (
              <mesh
                key={`bulb-${i}`}
                position={[
                  Math.cos(angle) * (wheelRadius + 0.05),
                  Math.sin(angle) * (wheelRadius + 0.05),
                  0.07,
                ]}
                castShadow
              >
                <sphereGeometry args={[0.07, 12, 12]} />
                <meshStandardMaterial
                  color={isLit ? '#fef08a' : '#ffffff'}
                  emissive={isLit ? '#f59e0b' : '#38bdf8'}
                  emissiveIntensity={0.8}
                  roughness={0.2}
                />
              </mesh>
            );
          })}

          {/* ── 3D CENTER GOLDEN STAR MEDAL HUB ── */}
          <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.14, 32]} />
            <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.18]} castShadow>
            <sphereGeometry args={[0.32, 24, 24]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* 5-Point Golden Star */}
          {[0, 1, 2, 3, 4].map((p) => (
            <mesh
              key={`star-${p}`}
              position={[0, 0, 0.22]}
              rotation={[0, 0, (p * Math.PI * 2) / 5]}
              castShadow
            >
              <coneGeometry args={[0.12, 0.46, 4]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
            </mesh>
          ))}
        </group>

        {/* ═════════════════════════════════════════════════════════════
            5. TOP FLAPPER RATCHET POINTER (12 O'Clock, Points DOWN)
            ═════════════════════════════════════════════════════════════ */}
        <group ref={pointerRef} position={[0, wheelRadius + 0.16, 0.14]}>
          {/* Brass Mounting Bracket */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.26, 0.14, 0.16]} />
            <meshStandardMaterial color="#78350f" roughness={0.5} />
          </mesh>
          {/* Golden Pivot Axle */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.22, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} />
          </mesh>
          {/* Heavy Red & Gold Arrow Needle */}
          <mesh position={[0, -0.28, 0]} rotation={[0, 0, Math.PI]} castShadow>
            <coneGeometry args={[0.2, 0.65, 16]} />
            <meshStandardMaterial color="#dc2626" roughness={0.25} metalness={0.3} />
          </mesh>
          {/* Pointer Golden Tip Accent */}
          <mesh position={[0, -0.54, 0]} rotation={[0, 0, Math.PI]} castShadow>
            <coneGeometry args={[0.07, 0.18, 12]} />
            <meshStandardMaterial color="#fde047" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* ── 6. Marquee Signboard Header Above Wheel (Behind Pointer) ── */}
        <group position={[0, wheelRadius + 0.65, -0.15]}>
          <mesh castShadow>
            <boxGeometry args={[3.4, 0.48, 0.1]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[3.2, 0.36, 0.02]} />
            <meshStandardMaterial color="#fef08a" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Left & Right Pennant Flags */}
          {[-1.65, 1.65].map((x, i) => (
            <mesh key={`flag-${i}`} position={[x, 0.28, 0]} castShadow>
              <boxGeometry args={[0.32, 0.2, 0.02]} />
              <meshStandardMaterial color={i === 0 ? '#2563eb' : '#dc2626'} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
