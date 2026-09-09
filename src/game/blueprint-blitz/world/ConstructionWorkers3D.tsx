// ============================================================
// BLUEPRINT BLITZ — 3D Active Construction Workers with Expressive Faces
// Stylized 3D humanoid workers featuring:
// - Expressive 3D Faces: Friendly eyes, eyebrows, nose, smile & safety goggles
// - Hard hats (White / Yellow / Blue / Red) with front LED headlamps
// - High-visibility fluorescent vests with silver retroreflective stripes
// - Heavy work trousers & sturdy construction boots
// - Active Working Animations:
//   * 'hammering': Swinging hammer rhythmically hitting foundation blocks
//   * 'measuring': Pulling yellow tape measure across building plot
//   * 'signaling': Waving dual orange safety signal batons directing JCBs
//   * 'surveyor': Rotating optical theodolite & checking digital tablet
//   * 'inspecting': Walkie-talkie communication & blueprint clipboard
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
  | 'cheering'
  | 'welding';

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
      const hammerCycle = Math.sin(t * 5.5);
      rightArmRef.current.rotation.x = hammerCycle > 0 ? -1.6 + hammerCycle * 0.95 : -1.6;
      if (headRef.current) {
        headRef.current.rotation.x = Math.max(0, hammerCycle * 0.12);
      }
    }

    // 2. Signaling Animation (Waving safety batons in smooth arcs)
    if (pose === 'signaling') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(t * 3.0) * 0.5 - 1.2;
        rightArmRef.current.rotation.z = Math.cos(t * 3.0) * 0.3 + 0.35;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(t * 3.0 + Math.PI) * 0.5 - 1.2;
        leftArmRef.current.rotation.z = -(Math.cos(t * 3.0 + Math.PI) * 0.3 + 0.35);
      }
    }

    // 3. Surveyor Animation (Rotating optic scope & looking across plots)
    if (pose === 'surveyor') {
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.45;
        headRef.current.rotation.x = Math.sin(t * 1.4) * 0.08;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.1 + Math.sin(t * 0.7) * 0.1;
      }
    }

    // 4. Measuring Animation (Pulling tape measure & inspecting)
    if (pose === 'measuring') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.2 + Math.sin(t * 1.5) * 0.15;
        rightArmRef.current.rotation.y = 0.3;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.2;
        leftArmRef.current.rotation.y = -0.3;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 1.2) * 0.25;
      }
    }

    // 5. Inspecting Animation (Walkie-talkie to ear & blueprint tablet)
    if (pose === 'inspecting') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -2.1 + Math.sin(t * 1.0) * 0.08;
        rightArmRef.current.rotation.z = -0.3;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.0;
        leftArmRef.current.rotation.z = 0.2;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
      }
    }

    // 6. Welding / Scaffolding Animation
    if (pose === 'welding') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.4 + Math.sin(t * 8.0) * 0.04;
        rightArmRef.current.rotation.y = 0.2;
      }
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={bodyRef}>
        {/* ── HEAVY WORK BOOTS ── */}
        <mesh position={[-0.14, 0.1, 0.04]} castShadow>
          <boxGeometry args={[0.15, 0.18, 0.28]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        <mesh position={[0.14, 0.1, 0.04]} castShadow>
          <boxGeometry args={[0.15, 0.18, 0.28]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>

        {/* ── WORK TROUSERS ── */}
        <mesh position={[-0.14, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.6, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.14, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.6, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>

        {/* ── TORSO & HIGH-VISIBILITY SAFETY VEST ── */}
        <group position={[0, 1.0, 0]}>
          {/* Main Vest Body */}
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.65, 0.28]} />
            <meshStandardMaterial color={vestColor} roughness={0.5} />
          </mesh>
          {/* Silver Reflective Stripes */}
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
          {/* Back reflective stripe */}
          <mesh position={[0, 0.08, -0.145]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.44, 0.08]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>

        {/* ── LEFT ARM & PROPS ── */}
        <group ref={leftArmRef} position={[-0.3, 1.18, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.48, 8]} />
            <meshStandardMaterial color={vestColor} />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>

          {/* Left Hand Props */}
          {pose === 'signaling' && (
            <group position={[0, -0.5, 0.15]} rotation={[0.4, 0, 0]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
                <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={0.6} />
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
          {pose === 'surveyor' && (
            <group position={[0, -0.5, 0.15]} rotation={[0.2, 0, 0]}>
              {/* Digital Architectural Tablet */}
              <mesh>
                <boxGeometry args={[0.24, 0.32, 0.02]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[0.2, 0.28]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          )}
        </group>

        {/* ── RIGHT ARM & PROPS ── */}
        <group ref={rightArmRef} position={[0.3, 1.18, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.48, 8]} />
            <meshStandardMaterial color={vestColor} />
          </mesh>
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
                <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={0.6} />
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
              <mesh position={[-0.35, 0, 0]}>
                <boxGeometry args={[0.7, 0.015, 0.03]} />
                <meshStandardMaterial color="#fef08a" />
              </mesh>
            </group>
          )}
        </group>

        {/* ── HEAD WITH DETAILED 3D FACE & HARD HAT ── */}
        <group ref={headRef} position={[0, 1.48, 0]}>
          {/* Head Skin Sphere */}
          <mesh castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.4} />
          </mesh>

          {/* ── 3D FACIAL FEATURES (Eyes, Goggles, Smile, Nose) ── */}
          {/* Left Eye */}
          <mesh position={[-0.045, 0.02, 0.14]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.045, 0.02, 0.155]}>
            <sphereGeometry args={[0.013, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>

          {/* Right Eye */}
          <mesh position={[0.045, 0.02, 0.14]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.045, 0.02, 0.155]}>
            <sphereGeometry args={[0.013, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>

          {/* Eyebrows */}
          <mesh position={[-0.045, 0.05, 0.14]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.04, 0.008, 0.01]} />
            <meshBasicMaterial color="#78350f" />
          </mesh>
          <mesh position={[0.045, 0.05, 0.14]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.04, 0.008, 0.01]} />
            <meshBasicMaterial color="#78350f" />
          </mesh>

          {/* Cute Nose */}
          <mesh position={[0, -0.01, 0.155]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#fca5a5" roughness={0.3} />
          </mesh>

          {/* Cheerful Smile Mouth */}
          <mesh position={[0, -0.055, 0.138]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.06, 0.015, 0.01]} />
            <meshBasicMaterial color="#78350f" />
          </mesh>

          {/* ── SAFETY HARD HAT WITH LED WORK LIGHT ── */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={hatColor} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Hard Hat Front Brim */}
          <mesh position={[0, 0.07, 0.09]} rotation={[-0.2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.03, 16]} />
            <meshStandardMaterial color={hatColor} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Front LED Headlamp */}
          <mesh position={[0, 0.12, 0.17]}>
            <cylinderGeometry args={[0.03, 0.03, 0.03, 8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.12, 0.185]}>
            <circleGeometry args={[0.024, 8]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ── ACTIVE CONSTRUCTION CREW ──
export const ConstructionCrew3D: React.FC = () => {
  return (
    <group>
      {/* ── 1. BLUE TEAM ACTIVE BUILDER (Hammering on Left Foundation, Facing Work) ── */}
      <ConstructionWorker3D
        position={[-5.2, 0, 3.2]}
        rotation={[0, 0.35, 0]}
        hatColor="#2563eb"
        vestColor="#ea580c"
        pantsColor="#1e3a8a"
        pose="hammering"
      />

      {/* ── 2. RED TEAM ACTIVE BUILDER (Measuring on Right Foundation, Facing Work) ── */}
      <ConstructionWorker3D
        position={[5.2, 0, 3.2]}
        rotation={[0, -0.35, 0]}
        hatColor="#dc2626"
        vestColor="#84cc16"
        pantsColor="#7f1d1d"
        pose="measuring"
      />

      {/* ── 3. CENTRAL CHIEF SURVEYOR (Facing FRONT towards camera & students beside tripod) ── */}
      <ConstructionWorker3D
        position={[0, 0, -1.8]}
        rotation={[0, 0, 0]}
        hatColor="#ffffff"
        vestColor="#ea580c"
        pantsColor="#334155"
        pose="surveyor"
      />

      {/* ── 4. SITE SUPERVISOR (With Walkie-Talkie & Tablet) ── */}
      <ConstructionWorker3D
        position={[-2.2, 0, 3.2]}
        rotation={[0, 0.3, 0]}
        hatColor="#ffffff"
        vestColor="#f59e0b"
        pantsColor="#0f172a"
        pose="inspecting"
      />

      {/* ── 5. SIGNALMAN DIRECTING MACHINERY (Waving Dual Orange Batons) ── */}
      <ConstructionWorker3D
        position={[-12.2, 0, 3.5]}
        rotation={[0, 0.8, 0]}
        hatColor="#facc15"
        vestColor="#ea580c"
        pantsColor="#334155"
        pose="signaling"
      />

      {/* ── 6. TRAFFIC SAFETY FLAGMAN (On Right Haul Road) ── */}
      <ConstructionWorker3D
        position={[12.5, 0, 3.5]}
        rotation={[0, -0.8, 0]}
        hatColor="#facc15"
        vestColor="#84cc16"
        pantsColor="#334155"
        pose="signaling"
      />

      {/* ── 7. SCAFFOLDING WELDER (High on Building Scaffolding) ── */}
      <ConstructionWorker3D
        position={[0, 4.4, -18.5]}
        rotation={[0, 0, 0]}
        hatColor="#facc15"
        vestColor="#ea580c"
        pose="welding"
      />
    </group>
  );
};
