// ============================================================
// BLUEPRINT BLITZ — 3D JCB Backhoe Crane & Excavator Fleet
// 1. JCBBackhoeCrane3D: Foreground working backhoe crane with controlled,
//    non-colliding hoist boom and suspended cargo crate.
// 2. MobileJCB3D: Background mobile JCB crane that drives back and forth
//    along the haul road, rotating wheels, lifting front bucket, and working!
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface JCBProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// ── 1. FOREGROUND STATIONARY WORKING JCB CRANE ──
export const JCBBackhoeCrane3D: React.FC<JCBProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
}) => {
  const boomSwingRef = useRef<THREE.Group>(null);
  const mainBoomRef = useRef<THREE.Group>(null);
  const dipperRef = useRef<THREE.Group>(null);
  const frontArmsRef = useRef<THREE.Group>(null);

  // Smooth working cycle for backhoe crane (strictly constrained to avoid collisions)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Kingpost gentle swing (safe arc of +- 15 degrees)
    if (boomSwingRef.current) {
      boomSwingRef.current.rotation.y = Math.sin(t * 0.6) * 0.22;
    }

    // 2. Main boom elevation (stays high, above ground level)
    if (mainBoomRef.current) {
      mainBoomRef.current.rotation.z = Math.sin(t * 0.6 + 0.3) * 0.12 - 0.4;
    }

    // 3. Dipper stick articulation
    if (dipperRef.current) {
      dipperRef.current.rotation.z = Math.cos(t * 0.6) * 0.15 + 0.55;
    }

    // 4. Front loader arm slight breathing
    if (frontArmsRef.current) {
      frontArmsRef.current.rotation.z = Math.sin(t * 0.3) * 0.04 - 0.06;
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
      {/* Headlights */}
      <mesh position={[-1.62, 0.85, 0.45]} rotation={[0, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-1.62, 0.85, -0.45]} rotation={[0, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
      </mesh>

      {/* Vertical Black Exhaust Stack */}
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
        {/* Yellow Roll Cage */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 1.25, 1.35]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Tinted Glass Windows */}
        <mesh position={[-0.76, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.15, 0.95]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.76, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.15, 0.95]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
        </mesh>
        <mesh position={[0, 0.05, 0.68]}>
          <planeGeometry args={[1.3, 0.95]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
        </mesh>
        <mesh position={[0, 0.05, -0.68]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.3, 0.95]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.65} />
        </mesh>

        {/* Cab Roof Top with Flashing Warning Beacon */}
        <mesh position={[0, 0.66, 0]}>
          <boxGeometry args={[1.58, 0.08, 1.42]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        <mesh position={[0, 0.76, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.14, 12]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.8} />
        </mesh>

        {/* 3D Worker Driver Inside Cab with Face & Hard Hat */}
        <group position={[-0.1, -0.2, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.3, 0.35, 0.3]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.08, 0.46, 0.04]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[-0.08, 0.46, -0.04]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Hard Hat */}
          <mesh position={[0, 0.52, 0]}>
            <sphereGeometry args={[0.12, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ── 3. HEAVY ALL-TERRAIN WHEELS ── */}
      {/* Front Wheels */}
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

      {/* Giant Rear Tractor Drive Wheels */}
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

      {/* ── 4. DEPLOYED OUTRIGGER STABILIZER LEGS ── */}
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
        <mesh position={[-0.6, 0, 0.65]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[1.3, 0.12, 0.1]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        <mesh position={[-0.6, 0, -0.65]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[1.3, 0.12, 0.1]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>

        {/* Front Loader Bucket */}
        <group position={[-1.3, -0.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.55, 1.8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
          </mesh>
          {[-0.7, -0.35, 0, 0.35, 0.7].map((z, idx) => (
            <mesh key={idx} position={[-0.35, -0.24, z]}>
              <boxGeometry args={[0.16, 0.06, 0.08]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── 6. REAR ARTICULATING BACKHOE CRANE BOOM (HIGH-CLEARANCE NON-CLIPPING) ── */}
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
            <mesh position={[0.8, 0.65, 0]} rotation={[0, 0, 0.65]} castShadow>
              <boxGeometry args={[1.8, 0.22, 0.25]} />
              <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
            </mesh>
            {/* Hydraulic Cylinder */}
            <mesh position={[0.6, 0.22, 0]} rotation={[0, 0, 0.35]}>
              <cylinderGeometry args={[0.06, 0.06, 1.1, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Secondary Dipper Stick Arm */}
            <group ref={dipperRef} position={[1.4, 1.3, 0]}>
              <mesh position={[0.6, -0.35, 0]} rotation={[0, 0, -0.45]} castShadow>
                <boxGeometry args={[1.5, 0.18, 0.2]} />
                <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
              </mesh>

              {/* Crane Hoist Hook & High-Clearance Suspended Crate (Kept safely above ground) */}
              <group position={[1.2, -0.7, 0]}>
                {/* Steel Cable (Compact length to stay well above ground) */}
                <mesh position={[0, -0.25, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.5, 6]} />
                  <meshBasicMaterial color="#334155" />
                </mesh>

                {/* Heavy Hook */}
                <mesh position={[0, -0.55, 0]}>
                  <torusGeometry args={[0.08, 0.03, 8, 16, Math.PI * 1.5]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.8} />
                </mesh>

                {/* Suspended Construction Crate (Floating safely at Y >= 1.4) */}
                <group position={[0, -0.85, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.55, 0.45, 0.55]} />
                    <meshStandardMaterial color="#d97706" roughness={0.8} />
                  </mesh>
                  {/* Yellow Rigging Straps */}
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.57, 0.06, 0.57]} />
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

// ── 2. BACKGROUND ACTIVE MOBILE JCB CRANE (DRIVING BACK & FORTH WORKING) ──
export const MobileJCB3D: React.FC = () => {
  const jcbGroupRef = useRef<THREE.Group>(null);
  const frontWheelsRef = useRef<THREE.Group>(null);
  const rearWheelsRef = useRef<THREE.Group>(null);
  const frontBucketRef = useRef<THREE.Group>(null);
  const backCraneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.4;
    // Ping-pong drive along X axis from x = -16 to x = +16 along z = -14
    const cycle = Math.sin(t);
    const posX = cycle * 16;
    const direction = Math.cos(t) > 0 ? 1 : -1;

    if (jcbGroupRef.current) {
      jcbGroupRef.current.position.x = posX;
      // Rotate 180 degrees when turning around
      jcbGroupRef.current.rotation.y = direction > 0 ? 0 : Math.PI;
    }

    // Wheel rotation
    if (frontWheelsRef.current) {
      frontWheelsRef.current.rotation.z += direction * 0.08;
    }
    if (rearWheelsRef.current) {
      rearWheelsRef.current.rotation.z += direction * 0.08;
    }

    // Bucket lifting animation
    if (frontBucketRef.current) {
      frontBucketRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15 - 0.1;
    }

    // Backhoe crane gentle sway while driving
    if (backCraneRef.current) {
      backCraneRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.2;
    }
  });

  return (
    <group ref={jcbGroupRef} position={[0, 0, -14]} scale={0.9}>
      {/* Main Yellow Chassis */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[2.8, 0.65, 1.5]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Operator Cab with Driver */}
      <group position={[0.1, 1.55, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.35, 1.15, 1.25]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {/* Windows */}
        <mesh position={[-0.68, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.05, 0.85]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.68, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.05, 0.85]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        {/* Driver */}
        <group position={[-0.1, -0.15, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.25, 0.3, 0.25]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.11, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        </group>
      </group>

      {/* Rotating Wheels */}
      {/* Front Wheels */}
      <group ref={frontWheelsRef}>
        <mesh position={[-0.95, 0.4, 0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.28, 14]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-0.95, 0.4, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.28, 14]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
      {/* Giant Rear Tractor Wheels */}
      <group ref={rearWheelsRef}>
        <mesh position={[0.8, 0.58, 0.85]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.58, 0.58, 0.38, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.8, 0.58, -0.85]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.58, 0.58, 0.38, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Front Loader Bucket with Sand/Gravel */}
      <group ref={frontBucketRef} position={[-1.3, 0.5, 0]}>
        <mesh position={[-0.6, 0.1, 0]} castShadow>
          <boxGeometry args={[0.5, 0.45, 1.6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} />
        </mesh>
        {/* Sand load */}
        <mesh position={[-0.6, 0.25, 0]}>
          <boxGeometry args={[0.42, 0.15, 1.45]} />
          <meshStandardMaterial color="#d4b895" roughness={0.9} />
        </mesh>
      </group>

      {/* Rear Backhoe Crane Folded/Working */}
      <group ref={backCraneRef} position={[1.4, 0.7, 0]}>
        <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, 0.6]} castShadow>
          <boxGeometry args={[1.3, 0.18, 0.2]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        <mesh position={[0.9, 0.9, 0]} rotation={[0, 0, -0.7]} castShadow>
          <boxGeometry args={[1.1, 0.14, 0.16]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {/* Backhoe Bucket */}
        <mesh position={[1.3, 0.4, 0]} castShadow>
          <boxGeometry args={[0.35, 0.3, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
