// ============================================================
// THE GREAT NUMBER RAILWAY — 3D Train Ticket Examiner (TT / Conductor)
// - Realistic 3D Conductor with uniform, peaked cap, and Green Flag
// - Proper human anatomy: arms NEVER intersect the head
// - Floating 3D Thought Bubble with 10 engaging 4-5 word 1-liners
// - Step 1: Stands in distance observing
// - Step 2: Walks forward into the center between both tracks
// - Step 3-4: Ponders & inspects both trains (turning head left & right)
// - Step 5 / Showdown: Decides winner, turns towards winning team, and waves GREEN FLAG!
// ============================================================

'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRailwayStore } from '../store/railwayStore';

const THINKING_QUOTES = [
  "Which train to signal first?",
  "Who will win this route?",
  "Both express engines look ready!",
  "Checking signals and track switch...",
  "Waiting for the fastest answer!",
  "Blue or Red to depart?",
  "Steam pressure is building up!",
  "Keep answering to gain passage!",
  "The open junction awaits winner!",
  "Ready to wave green flag!"
];

export const TicketExaminerTT: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const flagClothRef = useRef<THREE.Mesh>(null);

  const currentZRef = useRef(14.0);
  const bodyRotYRef = useRef(0);

  const signalsGreenCount = useRailwayStore((s) => s.signalsGreenCount);
  const roundWinner = useRailwayStore((s) => s.roundWinner);
  const showdownStep = useRailwayStore((s) => s.showdownStep);
  const phase = useRailwayStore((s) => s.phase);
  const blueTeamName = useRailwayStore((s) => s.blueTeam.name);
  const redTeamName = useRailwayStore((s) => s.redTeam.name);

  // Quote cycling
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % THINKING_QUOTES.length);
    }, 3400);
    return () => clearInterval(interval);
  }, []);

  // Compute active thought text
  const currentThought = useMemo(() => {
    if (phase === 'showdown' || phase === 'winner-reveal') {
      if (roundWinner === 'blue') return `🚩 Green flag for ${blueTeamName}!`;
      if (roundWinner === 'red') return `🚩 Green flag for ${redTeamName}!`;
      return "🚩 Authorizing the express route!";
    }
    if (signalsGreenCount === 1) return "📢 Horns blowing in distance!";
    if (signalsGreenCount === 2) return "🚂 Trains arrived! Who departs first?";
    if (signalsGreenCount === 3) return "💨 Look at that steam power!";
    if (signalsGreenCount === 4) return "🟢 Both engines at switch!";
    return THINKING_QUOTES[quoteIndex];
  }, [phase, roundWinner, signalsGreenCount, quoteIndex, blueTeamName, redTeamName]);

  // Target Z position based on question milestone
  // Step 0-1: z = 14.0 (far staging view)
  // Step 2+: z = 5.8 (center aisle between trains)
  const targetZ = signalsGreenCount >= 2 ? 5.8 : 14.0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth walking / translation along Z axis
    currentZRef.current = THREE.MathUtils.damp(
      currentZRef.current,
      targetZ,
      2.2,
      delta
    );

    const isWalking = Math.abs(currentZRef.current - targetZ) > 0.08;
    const now = Date.now() * 0.004;

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
      targetRotY = Math.sin(now * 0.8) * 0.22;
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
        headRef.current.rotation.x = -0.06;
      } else {
        headRef.current.rotation.y = Math.sin(now * 1.2) * 0.4;
        headRef.current.rotation.x = Math.sin(now * 0.6) * 0.06;
      }
    }

    // ── RIGHT ARM & GREEN FLAG (PROPER HUMAN ANATOMY - NEVER INTERSECTS HEAD) ──
    if (rightArmRef.current) {
      if (isShowdown) {
        // High enthusiastic waving of Green Flag OUTWARD & FORWARD away from the head
        const wave = Math.sin(Date.now() * 0.012) * 0.2;
        rightArmRef.current.rotation.x = -Math.PI * 0.38 + wave * 0.15;
        rightArmRef.current.rotation.y = 0.2;
        rightArmRef.current.rotation.z = -Math.PI * 0.35 + wave;
      } else if (isWalking) {
        // Natural arm sway while walking
        rightArmRef.current.rotation.x = Math.sin(Date.now() * 0.009) * 0.25 - 0.2;
        rightArmRef.current.rotation.y = 0.1;
        rightArmRef.current.rotation.z = -0.22;
      } else {
        // Ready inspection pose: arm held comfortably outward to the side, flag forward
        rightArmRef.current.rotation.x = -0.3;
        rightArmRef.current.rotation.y = 0.15;
        rightArmRef.current.rotation.z = -0.25;
      }
    }

    // ── LEFT ARM (THINKING / POINTING POSE) ──
    if (leftArmRef.current) {
      if (isShowdown) {
        // Pointing encouragingly down the track toward the open line
        leftArmRef.current.rotation.x = -Math.PI * 0.42;
        leftArmRef.current.rotation.y = -0.25;
        leftArmRef.current.rotation.z = 0.2;
      } else if (isWalking) {
        leftArmRef.current.rotation.x = -Math.sin(Date.now() * 0.009) * 0.3;
        leftArmRef.current.rotation.y = 0;
        leftArmRef.current.rotation.z = 0.15;
      } else {
        // Hand rested thoughtfully in front of chest/chin (never inside skull)
        leftArmRef.current.rotation.x = -Math.PI * 0.4;
        leftArmRef.current.rotation.y = 0.35;
        leftArmRef.current.rotation.z = 0.35;
      }
    }

    // Dynamic wave ripples on the silk Green Flag
    if (flagClothRef.current) {
      const flagWave = Math.sin(Date.now() * 0.01 + currentZRef.current) * 0.18;
      flagClothRef.current.rotation.y = flagWave;
      flagClothRef.current.rotation.z = Math.cos(Date.now() * 0.008) * 0.08;
    }
  });

  return (
    <group ref={groupRef} scale={[1.15, 1.15, 1.15]}>
      {/* ── 3D FLOATING THOUGHT BUBBLE OVER TT'S HEAD ── */}
      <Html
        position={[0, 1.88, 0]}
        center
        distanceFactor={13}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'floatBob 3s ease-in-out infinite',
          filter: 'drop-shadow(0 6px 16px rgba(0, 0, 0, 0.4))',
          userSelect: 'none',
        }}>
          {/* Main Thought Pill */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.92) 100%)',
            border: '2px solid #facc15',
            borderRadius: '22px',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 18px rgba(250, 204, 21, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ fontSize: '15px' }}>💭</span>
            <span style={{
              color: '#f8fafc',
              fontSize: '12.5px',
              fontWeight: 800,
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              {currentThought}
            </span>
          </div>

          {/* Thought Bubble Tail Circles */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            marginTop: '3px',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#facc15',
              boxShadow: '0 0 8px rgba(250, 204, 21, 0.6)',
            }} />
            <div style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#facc15',
              opacity: 0.8,
            }} />
          </div>
        </div>
      </Html>

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
      <group ref={leftArmRef} position={[-0.22, 0.92, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.07, 0.3, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
      </group>

      {/* ── RIGHT ARM HOLDING GREEN FLAG (OUTWARD TO SIDE, ZERO HEAD CLIPPING) ── */}
      <group ref={rightArmRef} position={[0.22, 0.92, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.07, 0.3, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {/* ── GREEN FLAG ON FLAGPOLE (EXTENDS OUTWARD & FORWARD) ── */}
        <group position={[0.06, -0.3, 0.08]} rotation={[Math.PI / 4, 0.2, -0.2]}>
          {/* Flagpole */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.78, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Brass Finial Ball on Top of Pole */}
          <mesh position={[0, 0.68, 0]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* ── VIBRANT GREEN FLAG CLOTH ── */}
          <group ref={flagClothRef} position={[0.2, 0.5, 0]}>
            <mesh>
              <boxGeometry args={[0.38, 0.3, 0.015]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#15803d"
                emissiveIntensity={0.3}
                roughness={0.3}
              />
            </mesh>
            {/* Gold Fringe Trim on Edge */}
            <mesh position={[0.19, 0, 0]}>
              <boxGeometry args={[0.02, 0.3, 0.02]} />
              <meshStandardMaterial color="#facc15" metalness={0.8} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
