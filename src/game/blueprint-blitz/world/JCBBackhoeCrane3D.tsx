// ============================================================
// BLUEPRINT BLITZ — 3D JCB Backhoe Crane & Excavator Component
// Detailed, animated iconic yellow JCB machine:
// - Heavy front loader bucket with hydraulic cylinders
// - Operator cab with glass, steering, and hard-hat driver
// - Large chevron-tread tractor rear wheels & front steering wheels
// - Rear articulating backhoe boom with hydraulic hoist crane cable
// - Outrigger stabilizer legs & dynamic working animations
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface JCBProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const JCBBackhoeCrane3D: React.FC<JCBProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
}) => {
  const boomSwingRef = useRef<THREE.Group>(null);
  const mainBoomRef = useRef<THREE.Group>(null);
  const dipperRef = useRef<THREE.Group>(null);
  const frontBucketRef = useRef<THREE.Group>(null);
  const frontArmsRef = useRef<THREE.Group>(null);
  const loadCrateRef = useRef<THREE.Group>(null);

  // Animated working cycle for backhoe crane & front bucket
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Kingpost swing left <-> right (crane slewing)
    if (boomSwingRef.current) {
      boomSwingRef.current.rotation.y = Math.sin(t * 0.8) * 0.55;
    }

    // 2. Main boom up & down
    if (mainBoomRef.current) {
      mainBoomRef.current.rotation.z = Math.sin(t * 0.8 + 0.5) * 0.2 - 0.45;
    }

    // 3. Dipper stick articulation
    if (dipperRef.current) {
      dipperRef.current.rotation.z = Math.cos(t * 0.8) * 0.25 + 0.65;
    }

    // 4. Subtle front bucket breathing
    if (frontArmsRef.current) {
      frontArmsRef.current.rotation.z = Math.sin(t * 0.4) * 0.05 - 0.08;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── 1. MAIN CHASSIS & HEAVY BOX FRAME ── */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.7, 1.6]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Black Underchassis & Axles */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[3.0, 0.35, 1.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Front Engine Grille & Headlights */}
      <mesh position={[-1.61, 0.8, 0]}>
        <planeGeometry args={[1.3, 0.55]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Headlight Left */}
      <mesh position={[-1.62, 0.85, 0.45]} rotation={[0, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
      </mesh>
      {/* Headlight Right */}
      <mesh position={[-1.62, 0.85, -0.45]} rotation={[0, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
      </mesh>

      {/* Vertical Black Exhaust Stack with Rain Cap */}
      <group position={[-0.8, 1.2, 0.65]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.4, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.42, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ── 2. OPERATOR ENCLOSED CABIN (ROPS/FOPS) ── */}
      <group position={[0.2, 1.6, 0]}>
        {/* Yellow Roll Cage Pillars */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 1.25, 1.35]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Large Tinted Glass Windows */}
        {/* Front Windshield */}
        <mesh position={[-0.76, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.15, 0.95]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
        </mesh>
        {/* Rear Windshield */}
        <mesh position={[0.76, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.15, 0.95]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
        </mesh>
        {/* Side Windows */}
        <mesh position={[0, 0.05, 0.68]}>
          <planeGeometry args={[1.3, 0.95]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
        </mesh>
        <mesh position={[0, 0.05, -0.68]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.3, 0.95]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
        </mesh>

        {/* Cab Roof Top with Warning Beacon */}
        <mesh position={[0, 0.66, 0]}>
          <boxGeometry args={[1.58, 0.08, 1.42]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        <mesh position={[0, 0.76, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.14, 12]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.8} />
        </mesh>

        {/* 3D Worker Driver Inside Cab */}
        <group position={[-0.1, -0.2, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.3, 0.35, 0.3]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <sphereGeometry args={[0.12, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ── 3. HEAVY ALL-TERRAIN WHEELS ── */}
      {/* Front Wheels (Left & Right) */}
      <group position={[-1.1, 0.45, 0.85]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.32, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 12]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>
      <group position={[-1.1, 0.45, -0.85]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.32, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.17]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 12]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>

      {/* Giant Rear Tractor Drive Wheels (Left & Right) */}
      <group position={[0.9, 0.65, 0.95]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.45, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 16]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>
      <group position={[0.9, 0.65, -0.95]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.45, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.23]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 16]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>

      {/* ── 4. DEPLOYED OUTRIGGER STABILIZER LEGS (Left & Right) ── */}
      <group position={[1.5, 0.5, 0.8]}>
        <mesh position={[0, -0.2, 0.2]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.7, 8]} />
          <meshStandardMaterial color="#facc15" metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.5, 0.35]}>
          <boxGeometry args={[0.35, 0.06, 0.35]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
      <group position={[1.5, 0.5, -0.8]}>
        <mesh position={[0, -0.2, -0.2]} rotation={[-0.4, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.7, 8]} />
          <meshStandardMaterial color="#facc15" metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.5, -0.35]}>
          <boxGeometry args={[0.35, 0.06, 0.35]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ── 5. FRONT LOADER BUCKET ASSEMBLY ── */}
      <group ref={frontArmsRef} position={[-1.2, 0.7, 0]}>
        {/* Left & Right Twin Lift Arms */}
        <mesh position={[-0.6, 0, 0.65]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[1.3, 0.12, 0.1]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        <mesh position={[-0.6, 0, -0.65]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[1.3, 0.12, 0.1]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>

        {/* Front 4-in-1 Loader Bucket with Forged Digging Teeth */}
        <group ref={frontBucketRef} position={[-1.3, -0.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.55, 1.8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Front Digging Teeth */}
          {[-0.7, -0.35, 0, 0.35, 0.7].map((z, idx) => (
            <mesh key={idx} position={[-0.35, -0.24, z]}>
              <boxGeometry args={[0.16, 0.06, 0.08]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── 6. REAR ARTICULATING BACKHOE CRANE BOOM ── */}
      <group position={[1.65, 0.8, 0]}>
        {/* Slew Kingpost Pivot */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>

        {/* Slewing Boom Assembly */}
        <group ref={boomSwingRef}>
          {/* Main Curved Heavy Boom */}
          <group ref={mainBoomRef} position={[0.15, 0.2, 0]}>
            <mesh position={[0.9, 0.7, 0]} rotation={[0, 0, 0.65]} castShadow>
              <boxGeometry args={[2.0, 0.22, 0.25]} />
              <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
            </mesh>
            {/* Hydraulic Cylinder */}
            <mesh position={[0.7, 0.25, 0]} rotation={[0, 0, 0.35]}>
              <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Secondary Dipper Stick Arm */}
            <group ref={dipperRef} position={[1.6, 1.4, 0]}>
              <mesh position={[0.7, -0.4, 0]} rotation={[0, 0, -0.5]} castShadow>
                <boxGeometry args={[1.7, 0.18, 0.2]} />
                <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
              </mesh>

              {/* Crane Hoist Hook & Cable Holding Building Crate */}
              <group position={[1.4, -0.85, 0]}>
                {/* Steel Cable */}
                <mesh position={[0, -0.5, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 1.0, 6]} />
                  <meshBasicMaterial color="#334155" />
                </mesh>

                {/* Heavy Hook */}
                <mesh position={[0, -1.05, 0]}>
                  <torusGeometry args={[0.08, 0.03, 8, 16, Math.PI * 1.5]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.8} />
                </mesh>

                {/* Suspended Construction Block / Crate (Reference Action) */}
                <group ref={loadCrateRef} position={[0, -1.35, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.65, 0.55, 0.65]} />
                    <meshStandardMaterial color="#d97706" roughness={0.8} />
                  </mesh>
                  {/* Yellow Rigging Straps */}
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.67, 0.08, 0.67]} />
                    <meshStandardMaterial color="#facc15" />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
