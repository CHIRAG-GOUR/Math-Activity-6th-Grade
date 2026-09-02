// ============================================================
// THE GREAT NUMBER RAILWAY — Railway Track & Signal System
// Completely natural 3D tracks:
// - Flat ground ballast ribbon (NO vertical fins/walls)
// - Clean wooden sleepers (ties) laid flat along curve
// - Parallel extruded steel rails running on top of sleepers
// - Dynamic semaphore signal with animated arm & LED lamps
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SignalState } from '../types';

interface TrackProps {
  controlPoints: [number, number, number][];
  active?: boolean;
  hasBridge?: boolean;
  hasTunnel?: boolean;
}

const SLEEPER_GEO = new THREE.BoxGeometry(1.35, 0.05, 0.2);

export const ContinuousRailwayTrack: React.FC<TrackProps> = ({
  controlPoints,
  active = false,
  hasBridge = false,
  hasTunnel = false,
}) => {
  const { curve, sleeperTransforms, leftRailGeo, rightRailGeo, ballastMeshGeo } = useMemo(() => {
    const pts = controlPoints.map((p) => new THREE.Vector3(...p));
    const c = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);

    // 1. Calculate Sleepers positions along curve (every ~0.55 units)
    const curveLength = c.getLength();
    const sleeperCount = Math.max(14, Math.floor(curveLength * 2.2));
    const transforms: { pos: THREE.Vector3; rotation: number }[] = [];

    for (let i = 0; i < sleeperCount; i++) {
      const t = i / (sleeperCount - 1);
      const pos = c.getPointAt(t);
      const tangent = c.getTangentAt(t);
      const angle = Math.atan2(tangent.x, tangent.z);
      transforms.push({ pos, rotation: angle });
    }

    // 2. Build flat ground ballast ribbon (BufferGeometry flat quad strip on ground plane)
    const samples = 100;
    const ballastWidth = 1.4; // width of stone ballast bed
    const railGauge = 0.42;   // half-width between rails

    const ballastPositions: number[] = [];
    const ballastNormals: number[] = [];
    const ballastIndices: number[] = [];

    const leftRailPts: THREE.Vector3[] = [];
    const rightRailPts: THREE.Vector3[] = [];

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const pos = c.getPointAt(t);
      const tangent = c.getTangentAt(t);
      // Horizontal normal in X-Z plane
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // Ballast left and right edges (flat at y = 0.015)
      const bLeft = pos.clone().add(normal.clone().multiplyScalar(ballastWidth * 0.5));
      const bRight = pos.clone().add(normal.clone().multiplyScalar(-ballastWidth * 0.5));

      ballastPositions.push(bLeft.x, 0.015, bLeft.z);
      ballastPositions.push(bRight.x, 0.015, bRight.z);

      ballastNormals.push(0, 1, 0);
      ballastNormals.push(0, 1, 0);

      // Rails paths (elevated at sleeper top: y = 0.065)
      const rLeft = pos.clone().add(normal.clone().multiplyScalar(railGauge));
      const rRight = pos.clone().add(normal.clone().multiplyScalar(-railGauge));
      rLeft.y = 0.065;
      rRight.y = 0.065;

      leftRailPts.push(rLeft);
      rightRailPts.push(rRight);

      if (i < samples) {
        const row1 = i * 2;
        const row2 = (i + 1) * 2;
        ballastIndices.push(row1, row1 + 1, row2);
        ballastIndices.push(row1 + 1, row2 + 1, row2);
      }
    }

    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute('position', new THREE.Float32BufferAttribute(ballastPositions, 3));
    bGeo.setAttribute('normal', new THREE.Float32BufferAttribute(ballastNormals, 3));
    bGeo.setIndex(ballastIndices);

    // 3. Build Parallel Extruded Steel Rails
    const leftCurve = new THREE.CatmullRomCurve3(leftRailPts);
    const rightCurve = new THREE.CatmullRomCurve3(rightRailPts);

    const railShape = new THREE.Shape();
    railShape.moveTo(-0.025, 0);
    railShape.lineTo(0.025, 0);
    railShape.lineTo(0.025, 0.05);
    railShape.lineTo(0.012, 0.07);
    railShape.lineTo(-0.012, 0.07);
    railShape.lineTo(-0.025, 0.05);
    railShape.closePath();

    const lGeo = new THREE.ExtrudeGeometry(railShape, { steps: 100, extrudePath: leftCurve });
    const rGeo = new THREE.ExtrudeGeometry(railShape, { steps: 100, extrudePath: rightCurve });

    return {
      curve: c,
      sleeperTransforms: transforms,
      leftRailGeo: lGeo,
      rightRailGeo: rGeo,
      ballastMeshGeo: bGeo,
    };
  }, [controlPoints]);

  return (
    <group>
      {/* ── 1. Flat Stone Ballast Bed (Underneath Track) ── */}
      <mesh geometry={ballastMeshGeo} receiveShadow>
        <meshStandardMaterial color="#64748b" roughness={0.95} />
      </mesh>

      {/* ── 2. Wooden Sleepers (Ties) Laid Flat across Ballast ── */}
      {sleeperTransforms.map((st, i) => (
        <mesh
          key={i}
          geometry={SLEEPER_GEO}
          position={[st.pos.x, 0.035, st.pos.z]}
          rotation={[0, st.rotation + Math.PI / 2, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#5c3d1a" roughness={0.8} />
        </mesh>
      ))}

      {/* ── 3. Parallel Extruded Steel Rails on Top ── */}
      <mesh geometry={leftRailGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh geometry={rightRailGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ── 4. Trestle Bridge Section (if configured) ── */}
      {hasBridge && (
        <group>
          {[0.3, 0.5, 0.7].map((t, i) => {
            const bp = curve.getPointAt(t);
            return (
              <group key={i} position={[bp.x, -0.6, bp.z]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.35, 1.4, 0.35]} />
                  <meshStandardMaterial color="#78350f" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.65, 0]}>
                  <boxGeometry args={[1.7, 0.14, 0.3]} />
                  <meshStandardMaterial color="#92400e" roughness={0.8} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* ── 5. Mountain Tunnel Arch (if configured) ── */}
      {hasTunnel && (() => {
        const tp = curve.getPointAt(0.5);
        const tangent = curve.getTangentAt(0.5);
        const ang = Math.atan2(tangent.x, tangent.z);
        return (
          <group position={[tp.x, 0, tp.z]} rotation={[0, ang, 0]}>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 3.2, 16, 1, true, 0, Math.PI]} />
              <meshStandardMaterial color="#334155" side={THREE.DoubleSide} roughness={0.9} />
            </mesh>
            <mesh position={[-1.5, 0.5, 0]}>
              <boxGeometry args={[0.2, 1.0, 3.2]} />
              <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>
            <mesh position={[1.5, 0.5, 0]}>
              <boxGeometry args={[0.2, 1.0, 3.2]} />
              <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>
          </group>
        );
      })()}
    </group>
  );
};

// ── Physical Railway Semaphore Signal ──
interface DynamicSignalProps {
  position: [number, number, number];
  signalState: SignalState;
}

export const DynamicRailwaySignal: React.FC<DynamicSignalProps> = ({ position, signalState }) => {
  const armRef = useRef<THREE.Group>(null);
  const isGreen = signalState === 'green';

  useFrame((_, delta) => {
    if (armRef.current) {
      const targetRotation = isGreen ? -0.75 : 0;
      armRef.current.rotation.z += (targetRotation - armRef.current.rotation.z) * delta * 6;
    }
  });

  return (
    <group position={position}>
      {/* Concrete Base Footing */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.24, 12]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>

      {/* Signal Mast Post */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 2.3, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Signal Lamp Housing Box */}
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[0.28, 0.6, 0.18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Red Lamp */}
      <mesh position={[0, 2.56, 0.1]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial
          color={!isGreen ? '#ef4444' : '#450a0a'}
          emissive={!isGreen ? '#ef4444' : '#000000'}
          emissiveIntensity={!isGreen ? 2.5 : 0}
        />
      </mesh>

      {/* Green Lamp */}
      <mesh position={[0, 2.24, 0.1]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial
          color={isGreen ? '#22c55e' : '#052e16'}
          emissive={isGreen ? '#22c55e' : '#000000'}
          emissiveIntensity={isGreen ? 3.0 : 0}
        />
      </mesh>

      {/* Mechanical Semaphore Blade Arm */}
      <group ref={armRef} position={[0, 2.4, 0]}>
        <mesh position={[0.42, 0, -0.05]}>
          <boxGeometry args={[0.7, 0.12, 0.03]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh position={[0.62, 0, -0.04]}>
          <boxGeometry args={[0.14, 0.12, 0.035]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
