// ============================================================
// BLUEPRINT BLITZ — 3D Active Construction Workers & Crew
// Animated, stylized 3D humanoid workers featuring:
// - Bright safety hard hats (Yellow / White / Blue / Red)
// - High-visibility fluorescent vests with silver reflective cross-stripes
// - Heavy work trousers & work boots
// - Dynamic Working Animations:
//   * 'hammering': Swinging hammer rhythmically hitting blocks
//   * 'measuring': Holding yellow measuring tape across plot
//   * 'signaling': Waving orange safety signal batons to direct cranes/JCB
//   * 'surveyor': Rotating optical theodolite scope & checking blueprints
//   * 'inspecting': Checking architectural clipboard & walkie-talkie
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type WorkerPose =
  | 'standing'
  | 'hammering'
  | 'measuring'
  | 'signaling'
  | 'surveyor'
  | 'inspecting'
  | 'cheering';

interface WorkerProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  hatColor?: string;
  vestColor?: string;
  pantsColor?: string;
  pose?: WorkerPose;
  scale?: number;
}

export const ConstructionWorker3D: React.FC<WorkerProps> = ({
  position,
  rotation = [0, 0, 0],
  hatColor = '#facc15',
  vestColor = '#ea580c',
  pantsColor = '#334155',
  pose = 'standing',
  scale = 1.0,
}) => {
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Hammering Animation
    if (pose === 'hammering' && rightArmRef.current) {
      // Fast rhythmic hammering swing
      const hammerCycle = Math.sin(t * 6.0);
      rightArmRef.current.rotation.x = hammerCycle > 0 ? -1.6 + hammerCycle * 0.9 : -1.6;
      if (headRef.current) {
        headRef.current.rotation.x = Math.max(0, hammerCycle * 0.15);
      }
    }

    // 2. Signaling Animation (Waving orange safety batons)
    if (pose === 'signaling') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(t * 3.0) * 0.5 - 1.2;
        rightArmRef.current.rotation.z = Math.cos(t * 3.0) * 0.3 + 0.4;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(t * 3.0 + Math.PI) * 0.5 - 1.2;
        leftArmRef.current.rotation.z = -(Math.cos(t * 3.0 + Math.PI) * 0.3 + 0.4);
      }
    }

    // 3. Surveyor Animation (Rotating optic scope & looking left/right)
    if (pose === 'surveyor') {
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.5;
        headRef.current.rotation.x = Math.sin(t * 1.6) * 0.1;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.1 + Math.sin(t * 0.8) * 0.1;
      }
    }

    // 4. Measuring Animation (Holding tape & subtle body sway)
    if (pose === 'measuring') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.2;
        rightArmRef.current.rotation.y = 0.3;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.2;
        leftArmRef.current.rotation.y = -0.3;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 1.2) * 0.3;
      }
    }

    // 5. Inspecting Animation (Holding clipboard & walkie-talkie)
    if (pose === 'inspecting') {
      if (rightArmRef.current) {
        // Holding walkie-talkie near mouth
        rightArmRef.current.rotation.x = -2.1;
        rightArmRef.current.rotation.z = -0.3;
      }
      if (leftArmRef.current) {
        // Holding clipboard
        leftArmRef.current.rotation.x = -1.0;
        leftArmRef.current.rotation.z = 0.2;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
      }
    }

    // 6. Cheering Animation (Both arms in the air celebrating)
    if (pose === 'cheering') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -2.6 + Math.sin(t * 5.0) * 0.3;
        rightArmRef.current.rotation.z = 0.4;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -2.6 + Math.sin(t * 5.0 + 0.5) * 0.3;
        leftArmRef.current.rotation.z = -0.4;
      }
      if (bodyRef.current) {
        bodyRef.current.position.y = Math.abs(Math.sin(t * 5.0)) * 0.15;
      }
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={bodyRef}>
        {/* Heavy Work Boots */}
        <mesh position={[-0.14, 0.1, 0.04]} castShadow>
          <boxGeometry args={[0.15, 0.18, 0.28]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        <mesh position={[0.14, 0.1, 0.04]} castShadow>
          <boxGeometry args={[0.15, 0.18, 0.28]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>

        {/* Heavy Duty Work Pants / Trousers */}
        <mesh position={[-0.14, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.6, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.14, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.6, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>

        {/* Torso & High-Visibility Fluorescent Safety Vest */}
        <group position={[0, 1.0, 0]}>
          {/* Main Workshirt Core */}
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.65, 0.28]} />
            <meshStandardMaterial color={vestColor} roughness={0.5} />
          </mesh>
          {/* Silver High-Vis Retroreflective Cross-Bands */}
          <mesh position={[0, 0.08, 0.145]}>
            <planeGeometry args={[0.44, 0.08]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.15, 0.145]}>
            <planeGeometry args={[0.44, 0.08]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[-0.14, 0.1, 0.145]}>
            <planeGeometry args={[0.06, 0.4]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0.14, 0.1, 0.145]}>
            <planeGeometry args={[0.06, 0.4]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Back reflective stripes */}
          <mesh position={[0, 0.08, -0.145]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.44, 0.08]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>

        {/* ── LEFT ARM ── */}
        <group ref={leftArmRef} position={[-0.3, 1.18, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.48, 8]} />
            <meshStandardMaterial color={vestColor} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.48, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>

          {/* Left Hand Props */}
          {pose === 'signaling' && (
            <group position={[0, -0.5, 0.15]} rotation={[0.4, 0, 0]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
                <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={0.5} />
              </mesh>
            </group>
          )}
          {pose === 'inspecting' && (
            <group position={[0, -0.5, 0.2]} rotation={[0.3, 0, 0]}>
              <mesh>
                <boxGeometry args={[0.26, 0.36, 0.02]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
              <mesh position={[0, 0, 0.015]}>
                <planeGeometry args={[0.22, 0.3]} />
                <meshBasicMaterial color="#0284c7" />
              </mesh>
            </group>
          )}
        </group>

        {/* ── RIGHT ARM ── */}
        <group ref={rightArmRef} position={[0.3, 1.18, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.48, 8]} />
            <meshStandardMaterial color={vestColor} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.48, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>

          {/* Right Hand Props */}
          {pose === 'hammering' && (
            <group position={[0, -0.5, 0.1]} rotation={[0.4, 0, 0]}>
              {/* Hammer Wooden Handle */}
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
                <meshStandardMaterial color="#92400e" />
              </mesh>
              {/* Steel Hammer Head */}
              <mesh position={[0, 0.32, 0]}>
                <boxGeometry args={[0.08, 0.09, 0.18]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          )}
          {pose === 'signaling' && (
            <group position={[0, -0.5, 0.15]} rotation={[0.4, 0, 0]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
                <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={0.5} />
              </mesh>
            </group>
          )}
          {pose === 'inspecting' && (
            <group position={[0, -0.5, 0.1]} rotation={[-0.4, 0, 0]}>
              {/* Walkie-Talkie */}
              <mesh>
                <boxGeometry args={[0.06, 0.14, 0.05]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
              <mesh position={[0.02, 0.12, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
                <meshBasicMaterial color="#0f172a" />
              </mesh>
            </group>
          )}
          {pose === 'measuring' && (
            <group position={[0, -0.5, 0.15]}>
              {/* Yellow Tape Measure */}
              <mesh>
                <boxGeometry args={[0.09, 0.09, 0.06]} />
                <meshStandardMaterial color="#facc15" />
              </mesh>
              {/* Extended Measuring Tape */}
              <mesh position={[-0.4, 0, 0]}>
                <boxGeometry args={[0.8, 0.015, 0.03]} />
                <meshStandardMaterial color="#fef08a" />
              </mesh>
            </group>
          )}
        </group>

        {/* ── HEAD & SAFETY HARD HAT ── */}
        <group ref={headRef} position={[0, 1.48, 0]}>
          {/* Head Skin */}
          <mesh castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>
          {/* Safety Hard Hat */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.17, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={hatColor} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Hard Hat Front Brim */}
          <mesh position={[0, 0.07, 0.08]} rotation={[-0.2, 0, 0]}>
            <cylinderGeometry args={[0.19, 0.19, 0.03, 16]} />
            <meshStandardMaterial color={hatColor} roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ── COMPLETE ACTIVE CONSTRUCTION CREW ──
export const ConstructionCrew3D: React.FC = () => {
  return (
    <group>
      {/* ── 1. BLUE TEAM ACTIVE BUILDER WORKER (Hammering / Constructing on Left Site) ── */}
      <ConstructionWorker3D
        position={[-5.8, 0, 2.8]}
        rotation={[0, 0.5, 0]}
        hatColor="#2563eb"
        vestColor="#ea580c"
        pantsColor="#1e3a8a"
        pose="hammering"
      />

      {/* ── 2. RED TEAM ACTIVE BUILDER WORKER (Measuring / Constructing on Right Site) ── */}
      <ConstructionWorker3D
        position={[5.8, 0, 2.8]}
        rotation={[0, -0.5, 0]}
        hatColor="#dc2626"
        vestColor="#84cc16"
        pantsColor="#7f1d1d"
        pose="measuring"
      />

      {/* ── 3. CENTRAL SITE INSPECTOR & SURVEYOR (Looking through Tripod Optic Scope) ── */}
      <ConstructionWorker3D
        position={[0, 0, -2.0]}
        rotation={[0, 0, 0]}
        hatColor="#ffffff"
        vestColor="#ea580c"
        pantsColor="#334155"
        pose="surveyor"
      />

      {/* ── 4. CHIEF SITE SUPERVISOR (With Walkie-Talkie & Clipboard) ── */}
      <ConstructionWorker3D
        position={[-2.2, 0, 3.2]}
        rotation={[0, 0.2, 0]}
        hatColor="#ffffff"
        vestColor="#f59e0b"
        pantsColor="#0f172a"
        pose="inspecting"
      />

      {/* ── 5. SIGNALMAN DIRECTING THE JCB CRANE & EXCAVATOR (With Orange Batons) ── */}
      <ConstructionWorker3D
        position={[-11.5, 0, 2.2]}
        rotation={[0, 0.8, 0]}
        hatColor="#facc15"
        vestColor="#ea580c"
        pantsColor="#334155"
        pose="signaling"
      />

      {/* ── 6. DUMP TRUCK ASSISTANT (Standing on Haul Road) ── */}
      <ConstructionWorker3D
        position={[12.5, 0, 2.2]}
        rotation={[0, -0.7, 0]}
        hatColor="#facc15"
        vestColor="#84cc16"
        pantsColor="#334155"
        pose="signaling"
      />

      {/* ── 7. WORKER ON BUILDING SCAFFOLDING ── */}
      <ConstructionWorker3D
        position={[0, 4.4, -18.5]}
        rotation={[0, 0, 0]}
        hatColor="#facc15"
        vestColor="#ea580c"
        pose="hammering"
      />
    </group>
  );
};
