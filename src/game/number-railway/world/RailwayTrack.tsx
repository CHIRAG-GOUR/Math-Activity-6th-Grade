// ============================================================
// THE GREAT NUMBER RAILWAY — Railway Track & Signal System
// Physical 3D Dual Rails, Wooden Sleepers, Ballast,
// Semaphore Signal with Red/Green Lights, Bridge, Tunnel
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

const SLEEPER_GEOMETRY = new THREE.BoxGeometry(1.3, 0.08, 0.22);

export const ContinuousRailwayTrack: React.FC<TrackProps> = ({
  controlPoints,
  active = false,
  hasBridge = false,
  hasTunnel = false,
}) => {
  const { curve, sleeperTransforms, leftRailGeo, rightRailGeo, ballastGeo } = useMemo(() => {
    const pts = controlPoints.map((p) => new THREE.Vector3(...p));
    const c = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);

    // Sleepers along the curve
    const sleeperCount = Math.max(12, Math.floor(c.getLength() * 2.2));
    const transforms: { pos: THREE.Vector3; rotation: number }[] = [];

    for (let i = 0; i < sleeperCount; i++) {
      const t = i / (sleeperCount - 1);
      const pos = c.getPointAt(t);
      const tangent = c.getTangentAt(t);
      const angle = Math.atan2(tangent.x, tangent.z);
      transforms.push({ pos, rotation: angle });
    }

    // Rail extrusions (gauge half-width = 0.42)
    const railGauge = 0.42;
    const leftPts: THREE.Vector3[] = [];
    const rightPts: THREE.Vector3[] = [];

    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const pos = c.getPointAt(t);
      const tangent = c.getTangentAt(t);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      leftPts.push(pos.clone().add(normal.clone().multiplyScalar(railGauge)));
      rightPts.push(pos.clone().add(normal.clone().multiplyScalar(-railGauge)));
    }

    const leftCurve = new THREE.CatmullRomCurve3(leftPts);
    const rightCurve = new THREE.CatmullRomCurve3(rightPts);

    const railShape = new THREE.Shape();
    railShape.moveTo(-0.03, 0);
    railShape.lineTo(0.03, 0);
    railShape.lineTo(0.03, 0.07);
    railShape.lineTo(0.015, 0.09);
    railShape.lineTo(-0.015, 0.09);
    railShape.lineTo(-0.03, 0.07);
    railShape.closePath();

    const leftGeo = new THREE.ExtrudeGeometry(railShape, { steps: 80, extrudePath: leftCurve });
    const rightGeo = new THREE.ExtrudeGeometry(railShape, { steps: 80, extrudePath: rightCurve });

    // Ballast bed
    const ballastShape = new THREE.Shape();
    ballastShape.moveTo(-0.85, 0);
    ballastShape.lineTo(0.85, 0);
    ballastShape.lineTo(0.65, 0.045);
    ballastShape.lineTo(-0.65, 0.045);
    ballastShape.closePath();

    const ballastG = new THREE.ExtrudeGeometry(ballastShape, { steps: 80, extrudePath: c });

    return {
      curve: c,
      sleeperTransforms: transforms,
      leftRailGeo: leftGeo,
      rightRailGeo: rightGeo,
      ballastGeo: ballastG,
    };
  }, [controlPoints]);

  return (
    <group>
      {/* Ballast Gravel Bed */}
      <mesh geometry={ballastGeo}>
        <meshStandardMaterial color="#94a3b8" roughness={0.95} />
      </mesh>

      {/* Left Rail */}
      <mesh geometry={leftRailGeo} position={[0, 0.04, 0]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right Rail */}
      <mesh geometry={rightRailGeo} position={[0, 0.04, 0]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Wooden Sleepers */}
      {sleeperTransforms.map((st, i) => (
        <mesh
          key={i}
          geometry={SLEEPER_GEOMETRY}
          position={[st.pos.x, st.pos.y + 0.02, st.pos.z]}
          rotation={[0, st.rotation + Math.PI / 2, 0]}
        >
          <meshStandardMaterial color="#5c3d1a" roughness={0.85} />
        </mesh>
      ))}

      {/* Trestle Bridge Section */}
      {hasBridge && (
        <group>
          {[0.25, 0.5, 0.75].map((t, i) => {
            const bp = curve.getPointAt(t);
            return (
              <group key={i} position={[bp.x, bp.y - 1.2, bp.z]}>
                <mesh>
                  <boxGeometry args={[0.35, 2.4, 0.35]} />
                  <meshStandardMaterial color="#78350f" roughness={0.9} />
                </mesh>
                <mesh position={[0, 1.1, 0]}>
                  <boxGeometry args={[1.8, 0.16, 0.3]} />
                  <meshStandardMaterial color="#92400e" roughness={0.8} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* Mountain Tunnel Arch */}
      {hasTunnel && (() => {
        const tp = curve.getPointAt(0.5);
        const tangent = curve.getTangentAt(0.5);
        const ang = Math.atan2(tangent.x, tangent.z);
        return (
          <group position={[tp.x, tp.y, tp.z]} rotation={[0, ang, 0]}>
            <mesh position={[0, 1.1, 0]}>
              <cylinderGeometry args={[1.4, 1.4, 3.2, 16, 1, true, 0, Math.PI]} />
              <meshStandardMaterial color="#334155" side={THREE.DoubleSide} roughness={0.9} />
            </mesh>
            <mesh position={[-1.4, 0.5, 0]}>
              <boxGeometry args={[0.2, 1.0, 3.2]} />
              <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>
            <mesh position={[1.4, 0.5, 0]}>
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
      const targetRotation = isGreen ? -0.7 : 0; // Down/angled = Green, Horizontal = Red
      armRef.current.rotation.z += (targetRotation - armRef.current.rotation.z) * delta * 5;
    }
  });

  return (
    <group position={position}>
      {/* Concrete Base */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.25, 0.28, 0.24, 12]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>

      {/* Signal Post (Black/White striped) */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 2.4, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Lamp Housing Box */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[0.3, 0.65, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Red Light Indicator */}
      <mesh position={[0, 2.68, 0.11]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={!isGreen ? '#ef4444' : '#450a0a'}
          emissive={!isGreen ? '#ef4444' : '#000000'}
          emissiveIntensity={!isGreen ? 2.5 : 0}
        />
      </mesh>

      {/* Green Light Indicator */}
      <mesh position={[0, 2.32, 0.11]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={isGreen ? '#22c55e' : '#052e16'}
          emissive={isGreen ? '#22c55e' : '#000000'}
          emissiveIntensity={isGreen ? 3.0 : 0}
        />
      </mesh>

      {/* Mechanical Semaphore Blade Arm */}
      <group ref={armRef} position={[0, 2.5, 0]}>
        <mesh position={[0.45, 0, -0.05]}>
          <boxGeometry args={[0.75, 0.14, 0.03]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh position={[0.65, 0, -0.04]}>
          <boxGeometry args={[0.15, 0.14, 0.04]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
