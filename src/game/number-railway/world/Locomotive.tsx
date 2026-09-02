// ============================================================
// THE GREAT NUMBER RAILWAY — Stylized 3D Locomotive
// Premium stylized train with animated wheels and steam
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRailwayStore } from '../store/railwayStore';
import { TeamId } from '../types';

interface LocomotiveProps {
  team: TeamId;
  trackControlPoints?: [number, number, number][];
}

export const Locomotive: React.FC<LocomotiveProps> = ({ team, trackControlPoints }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelFLRef = useRef<THREE.Mesh>(null);
  const wheelFRRef = useRef<THREE.Mesh>(null);
  const wheelBLRef = useRef<THREE.Mesh>(null);
  const wheelBRRef = useRef<THREE.Mesh>(null);
  const rodRef = useRef<THREE.Mesh>(null);
  const smokeRefs = useRef<THREE.Mesh[]>([]);

  const trainState = useRailwayStore((s) =>
    team === 'blue' ? s.blueTrain : s.redTrain
  );

  // Build spline curve from track points
  const curve = useMemo(() => {
    if (!trackControlPoints || trackControlPoints.length < 2) return null;
    const pts = trackControlPoints.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  }, [trackControlPoints]);

  // Team colors
  const bodyColor = team === 'blue' ? '#1e40af' : '#991b1b';
  const accentColor = team === 'blue' ? '#3b82f6' : '#ef4444';
  const trimColor = '#d4a94d'; // brass/gold trim

  // Animate train along track
  useFrame((_, delta) => {
    if (!groupRef.current || !curve) return;

    const progress = trainState.progress;
    const state = trainState.state;

    if (state === 'idle') {
      // Parked at start
      const startPos = curve.getPointAt(0);
      const startTangent = curve.getTangentAt(0);
      groupRef.current.position.copy(startPos);
      groupRef.current.position.y += 0.15;
      const angle = Math.atan2(startTangent.x, startTangent.z);
      groupRef.current.rotation.y = angle;
      return;
    }

    // Move along spline
    const t = Math.min(Math.max(progress, 0), 0.999);
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);

    groupRef.current.position.copy(pos);
    groupRef.current.position.y += 0.15;

    // Orient along track
    const angle = Math.atan2(tangent.x, tangent.z);
    groupRef.current.rotation.y = angle;

    // Subtle rocking
    if (state === 'moving' || state === 'departing') {
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.004) * 0.01;
    }

    // Wheel rotation
    const wheelSpeed = trainState.speed * delta * 15;
    [wheelFLRef, wheelFRRef, wheelBLRef, wheelBRRef].forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.x -= wheelSpeed;
      }
    });

    // Connecting rod
    if (rodRef.current) {
      rodRef.current.rotation.x = Math.sin(Date.now() * 0.008) * 0.3;
    }

    // Smoke particles
    smokeRefs.current.forEach((smoke, i) => {
      if (smoke && trainState.smokeActive) {
        const t = (Date.now() * 0.001 + i * 0.5) % 2;
        smoke.position.y = 0.6 + t * 1.5;
        smoke.scale.setScalar(0.05 + t * 0.12);
        (smoke.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.5 - t * 0.3);
        smoke.visible = true;
      } else if (smoke) {
        smoke.visible = false;
      }
    });
  });

  return (
    <group ref={groupRef} scale={[0.6, 0.6, 0.6]}>
      {/* ── LOCOMOTIVE BODY ── */}
      {/* Main boiler (cylinder) */}
      <mesh position={[0, 0.45, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 1.2, 16]} />
        <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Boiler front dome */}
      <mesh position={[0, 0.45, 0.95]}>
        <sphereGeometry args={[0.25, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.55, -0.55]}>
        <boxGeometry args={[0.6, 0.55, 0.5]} />
        <meshStandardMaterial color={bodyColor} metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Cabin roof */}
      <mesh position={[0, 0.85, -0.55]}>
        <boxGeometry args={[0.68, 0.06, 0.58]} />
        <meshStandardMaterial color={trimColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Cabin windows */}
      {[-0.31, 0.31].map((x, i) => (
        <mesh key={i} position={[x, 0.6, -0.55]}>
          <boxGeometry args={[0.01, 0.2, 0.25]} />
          <meshStandardMaterial color="#bfdbfe" metalness={0.1} roughness={0.2} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Smokestack */}
      <mesh position={[0, 0.8, 0.65]}>
        <cylinderGeometry args={[0.1, 0.07, 0.35, 8]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Smokestack rim */}
      <mesh position={[0, 0.98, 0.65]}>
        <cylinderGeometry args={[0.12, 0.1, 0.05, 8]} />
        <meshStandardMaterial color={trimColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Steam dome */}
      <mesh position={[0, 0.72, 0.2]}>
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshStandardMaterial color={trimColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Headlamp */}
      <mesh position={[0, 0.55, 1.0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fbbf24"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Front coupler / cow catcher */}
      <mesh position={[0, 0.12, 1.05]}>
        <boxGeometry args={[0.5, 0.08, 0.15]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Cow catcher triangles */}
      <mesh position={[0, 0.08, 1.15]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.55, 0.04, 0.2]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Chassis / frame */}
      <mesh position={[0, 0.16, 0.15]}>
        <boxGeometry args={[0.55, 0.1, 1.8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>

      {/* Brass trim bands on boiler */}
      {[0.0, 0.35, 0.7].map((z, i) => (
        <mesh key={i} position={[0, 0.45, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.015, 6, 16]} />
          <meshStandardMaterial color={trimColor} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* ── WHEELS ── */}
      {/* Front left */}
      <mesh ref={wheelFLRef} position={[-0.32, 0.1, 0.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Front right */}
      <mesh ref={wheelFRRef} position={[0.32, 0.1, 0.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Back left */}
      <mesh ref={wheelBLRef} position={[-0.32, 0.1, -0.25]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 12]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Back right */}
      <mesh ref={wheelBRRef} position={[0.32, 0.1, -0.25]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 12]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Connecting rod (left side) */}
      <mesh ref={rodRef} position={[-0.35, 0.1, 0.15]}>
        <boxGeometry args={[0.02, 0.02, 0.7]} />
        <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Team badge on side */}
      <mesh position={[0.31, 0.45, 0.0]}>
        <boxGeometry args={[0.01, 0.15, 0.15]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* ── SMOKE PARTICLES ── */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) smokeRefs.current[i] = el; }}
          position={[0, 1.0 + i * 0.3, 0.65]}
          visible={false}
        >
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial
            color="#d1d5db"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* ── TENDER (coal car behind locomotive) ── */}
      <group position={[0, 0, -1.15]}>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.48, 0.35, 0.5]} />
          <meshStandardMaterial color={bodyColor} metalness={0.2} roughness={0.6} />
        </mesh>
        {/* Coal */}
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.42]} />
          <meshStandardMaterial color="#1c1917" roughness={0.95} />
        </mesh>
        {/* Tender wheels */}
        <mesh position={[-0.28, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 10]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.28, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 10]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Coupler */}
        <mesh position={[0, 0.16, -0.3]}>
          <boxGeometry args={[0.08, 0.04, 0.1]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
