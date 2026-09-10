// ============================================================
// THE GREAT NUMBER RAILWAY — 3D Train Ticket Examiner (TT / Conductor)
// - Realistic 3D Conductor with uniform, peaked cap, and Green Flag
// - Step 1: Stands in distance observing
// - Step 2: Walks forward into the center between both tracks
// - Step 3-4: Ponders & inspects both trains (turning head left & right, thinking which train to release)
// - Step 5 / Showdown: Decides winner, turns towards winning team, and proudly waves GREEN FLAG high!
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRailwayStore } from '../store/railwayStore';

export const TicketExaminerTT: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const flagClothRef = useRef<THREE.Mesh>(null);

  const currentZRef = useRef(16.0);
  const bodyRotYRef = useRef(0);

  const signalsGreenCount = useRailwayStore((s) => s.signalsGreenCount);
  const roundWinner = useRailwayStore((s) => s.roundWinner);
  const showdownStep = useRailwayStore((s) => s.showdownStep);
  const phase = useRailwayStore((s) => s.phase);

  // Target Z position based on question milestone
  // Step 0-1: z = 16.0 (far)
  // Step 2+: z = 6.8 (middle between trains)
  const targetZ = signalsGreenCount >= 2 ? 6.8 : 16.0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth walking / translation along Z axis
    currentZRef.current = THREE.MathUtils.damp(
      currentZRef.current,
      targetZ,
      2.0,
      delta
    );

    const isWalking = Math.abs(currentZRef.current - targetZ) > 0.08;
    const now = Date.now() * 0.004;

    // Determine TT orientation and behavior
    const isShowdown = phase === 'showdown' || phase === 'winner-reveal';
    const isWinnerBlue = roundWinner === 'blue';
    const isWinnerRed = roundWinner === 'red';

    let targetRotY = 0;
    if (isShowdown && isWinnerBlue) {
      targetRotY = -Math.PI * 0.38; // Turn toward Blue train on Left Track
    } else if (isShowdown && isWinnerRed) {
      targetRotY = Math.PI * 0.38; // Turn toward Red train on Right Track
    } else {
      // Thinking / inspecting oscillation between left and right
      targetRotY = Math.sin(now * 0.8) * 0.25;
    }

    bodyRotYRef.current = THREE.MathUtils.damp(
      bodyRotYRef.current,
      targetRotY,
      4.0,
      delta
    );

    groupRef.current.position.set(0, 0.1, currentZRef.current);
    groupRef.current.rotation.set(0, bodyRotYRef.current, 0);

    // Walking leg swing
    if (isWalking) {
      const walkCycle = Math.sin(Date.now() * 0.009);
      if (leftLegRef.current) leftLegRef.current.rotation.x = walkCycle * 0.55;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * 0.55;
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }

    // Head thinking movement (looking left to Blue, looking right to Red)
    if (headRef.current) {
      if (isShowdown) {
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = -0.08; // looking up proudly
      } else {
        headRef.current.rotation.y = Math.sin(now * 1.2) * 0.45;
        headRef.current.rotation.x = Math.sin(now * 0.6) * 0.08;
      }
    }

    // Right Arm & Green Flag Waving Logic
    if (rightArmRef.current) {
      if (isShowdown) {
        // High enthusiastic waving of Green Flag to authorized departing team!
        const wave = Math.sin(Date.now() * 0.012) * 0.35;
        rightArmRef.current.rotation.x = -Math.PI * 0.72 + wave * 0.3;
        rightArmRef.current.rotation.z = -0.4 + wave;
      } else if (isWalking) {
        // Normal arm sway while walking
        rightArmRef.current.rotation.x = Math.sin(Date.now() * 0.009) * 0.35 - 0.2;
        rightArmRef.current.rotation.z = -0.2;
      } else {
        // Ready / inspection pose (flag held firmly at side/chest ready)
        rightArmRef.current.rotation.x = -0.45;
        rightArmRef.current.rotation.z = -0.25;
      }
    }

    // Left Arm Thinking / Pointing Pose
    if (leftArmRef.current) {
      if (isShowdown) {
        // Pointing toward route
        leftArmRef.current.rotation.x = -Math.PI * 0.45;
        leftArmRef.current.rotation.y = -0.3;
        leftArmRef.current.rotation.z = 0.2;
      } else if (isWalking) {
        leftArmRef.current.rotation.x = -Math.sin(Date.now() * 0.009) * 0.35;
        leftArmRef.current.rotation.y = 0;
        leftArmRef.current.rotation.z = 0.1;
      } else {
        // Hand to chin / clipboard thinking gesture
        leftArmRef.current.rotation.x = -Math.PI * 0.55;
        leftArmRef.current.rotation.y = 0.45;
        leftArmRef.current.rotation.z = 0.35;
      }
    }

    // Dynamic wave ripples on the silk Green Flag
    if (flagClothRef.current) {
      const flagWave = Math.sin(Date.now() * 0.01 + currentZRef.current) * 0.15;
      flagClothRef.current.rotation.y = flagWave;
      flagClothRef.current.rotation.z = Math.cos(Date.now() * 0.008) * 0.08;
    }
  });

  return (
    <group ref={groupRef} scale={[1.1, 1.1, 1.1]}>
      {/* ── SHOES & LEGS ── */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.46, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[0.085, 0.46, 0.09]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        {/* Left Shoe */}
        <mesh position={[0, -0.45, 0.04]}>
          <boxGeometry args={[0.09, 0.07, 0.16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.4} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.46, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[0.085, 0.46, 0.09]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        {/* Right Shoe */}
        <mesh position={[0, -0.45, 0.04]}>
          <boxGeometry args={[0.09, 0.07, 0.16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.4} />
        </mesh>
      </group>

      {/* ── TORSO & UNIFORM ── */}
      <group position={[0, 0.76, 0]}>
        {/* Navy Blazer / Vest Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.34, 0.48, 0.18]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>

        {/* Crisp White Shirt Collar */}
        <mesh position={[0, 0.18, 0.08]}>
          <boxGeometry args={[0.12, 0.12, 0.04]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>

        {/* Crimson Red Necktie */}
        <mesh position={[0, 0.06, 0.1]}>
          <boxGeometry args={[0.04, 0.22, 0.02]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>

        {/* Golden Buttons */}
        {[-0.08, 0, 0.08].map((y, bi) => (
          <mesh key={`btn-${bi}`} position={[0, y, 0.095]}>
            <sphereGeometry args={[0.016, 8, 8]} />
            <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* Gold Pocket Watch Chain across vest */}
        <mesh position={[0.06, -0.06, 0.095]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.1, 0.012, 0.01]} />
          <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Official Conductor Gold Chest Badge */}
        <mesh position={[-0.09, 0.12, 0.095]}>
          <boxGeometry args={[0.06, 0.035, 0.01]} />
          <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ── HEAD & CONDUCTOR CAP ── */}
      <group ref={headRef} position={[0, 1.15, 0]}>
        {/* Face */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, 0, 0.115]}>
          <boxGeometry args={[0.025, 0.035, 0.04]} />
          <meshStandardMaterial color="#fdba74" roughness={0.5} />
        </mesh>
        {/* Eyes */}
        {[-0.04, 0.04].map((x, ei) => (
          <mesh key={`eye-${ei}`} position={[x, 0.02, 0.11]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} />
          </mesh>
        ))}
        {/* Mustache / Smile */}
        <mesh position={[0, -0.04, 0.11]}>
          <boxGeometry args={[0.07, 0.02, 0.02]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>

        {/* Conductor Peaked Cap */}
        <group position={[0, 0.09, 0]}>
          {/* Cap Base */}
          <mesh>
            <cylinderGeometry args={[0.13, 0.135, 0.09, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Gold Cap Badge & Trim Band */}
          <mesh position={[0, -0.02, 0]}>
            <torusGeometry args={[0.132, 0.012, 8, 16]} />
            <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.01, 0.125]}>
            <boxGeometry args={[0.05, 0.04, 0.02]} />
            <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Shiny Visor Peak */}
          <mesh position={[0, -0.04, 0.11]} rotation={[Math.PI / 8, 0, 0]}>
            <boxGeometry args={[0.17, 0.015, 0.1]} />
            <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ── LEFT ARM ── */}
      <group ref={leftArmRef} position={[-0.2, 0.94, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <boxGeometry args={[0.07, 0.32, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
      </group>

      {/* ── RIGHT ARM HOLDING GREEN FLAG ── */}
      <group ref={rightArmRef} position={[0.2, 0.94, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <boxGeometry args={[0.07, 0.32, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {/* ── GREEN FLAG ON FLAGPOLE ── */}
        <group position={[0, -0.34, 0.06]} rotation={[Math.PI / 3, 0, 0]}>
          {/* Flagpole */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.75, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Brass Finial Ball on Top of Pole */}
          <mesh position={[0, 0.64, 0]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* ── VIBRANT GREEN FLAG CLOTH ── */}
          <group ref={flagClothRef} position={[0.18, 0.46, 0]}>
            <mesh>
              <boxGeometry args={[0.36, 0.28, 0.015]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#15803d"
                emissiveIntensity={0.25}
                roughness={0.3}
              />
            </mesh>
            {/* Gold Fringe Trim on Edge */}
            <mesh position={[0.18, 0, 0]}>
              <boxGeometry args={[0.02, 0.28, 0.02]} />
              <meshStandardMaterial color="#facc15" metalness={0.8} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
