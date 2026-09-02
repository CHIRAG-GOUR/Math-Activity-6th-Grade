// ============================================================
// THE GREAT NUMBER RAILWAY — 3D Railway Track System
// Actual 3D rails with sleepers, ballast, and spline paths
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface RailwayTrackProps {
  controlPoints: [number, number, number][];
  active?: boolean;
  hasBridge?: boolean;
  hasTunnel?: boolean;
  teamColor?: string;
}

// Create a single railway sleeper (tie) geometry — reused via instancing
const SLEEPER_GEO = new THREE.BoxGeometry(1.2, 0.08, 0.18);
const RAIL_PROFILE = new THREE.BoxGeometry(0.06, 0.08, 1); // will be extruded

export const RailwayTrack: React.FC<RailwayTrackProps> = ({
  controlPoints,
  active = false,
  hasBridge = false,
  hasTunnel = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Build CatmullRom spline from control points
  const { curve, sleeperTransforms, railPoints } = useMemo(() => {
    const pts = controlPoints.map((p) => new THREE.Vector3(...p));
    const c = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);

    // Sleeper positions along the curve
    const sleeperCount = Math.max(8, Math.floor(c.getLength() * 3));
    const transforms: { pos: THREE.Vector3; rotation: number }[] = [];

    for (let i = 0; i < sleeperCount; i++) {
      const t = i / (sleeperCount - 1);
      const pos = c.getPointAt(t);
      const tangent = c.getTangentAt(t);
      const angle = Math.atan2(tangent.x, tangent.z);
      transforms.push({ pos, rotation: angle });
    }

    // Rail geometry points (left and right rail)
    const railSamples = 64;
    const railPts: THREE.Vector3[] = [];
    for (let i = 0; i <= railSamples; i++) {
      railPts.push(c.getPointAt(i / railSamples));
    }

    return { curve: c, sleeperTransforms: transforms, railPoints: railPts };
  }, [controlPoints]);

  // Build rail tube geometries (left and right)
  const { leftRailGeo, rightRailGeo, ballastGeo } = useMemo(() => {
    const railGauge = 0.4; // half gauge width

    // Create offset curves for left and right rails
    const leftPts: THREE.Vector3[] = [];
    const rightPts: THREE.Vector3[] = [];

    for (let i = 0; i <= 64; i++) {
      const t = i / 64;
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      leftPts.push(pos.clone().add(normal.clone().multiplyScalar(railGauge)));
      rightPts.push(pos.clone().add(normal.clone().multiplyScalar(-railGauge)));
    }

    const leftCurve = new THREE.CatmullRomCurve3(leftPts);
    const rightCurve = new THREE.CatmullRomCurve3(rightPts);

    const railShape = new THREE.Shape();
    railShape.moveTo(-0.025, 0);
    railShape.lineTo(0.025, 0);
    railShape.lineTo(0.025, 0.06);
    railShape.lineTo(0.015, 0.08);
    railShape.lineTo(-0.015, 0.08);
    railShape.lineTo(-0.025, 0.06);
    railShape.closePath();

    const extrudeSettings = { steps: 64, extrudePath: leftCurve };
    const extrudeSettingsR = { steps: 64, extrudePath: rightCurve };

    const leftGeo = new THREE.ExtrudeGeometry(railShape, extrudeSettings);
    const rightGeo = new THREE.ExtrudeGeometry(railShape, extrudeSettingsR);

    // Ballast (ground under tracks)
    const ballastShape = new THREE.Shape();
    ballastShape.moveTo(-0.7, 0);
    ballastShape.lineTo(0.7, 0);
    ballastShape.lineTo(0.5, 0.04);
    ballastShape.lineTo(-0.5, 0.04);
    ballastShape.closePath();

    const ballastGeoResult = new THREE.ExtrudeGeometry(ballastShape, {
      steps: 64,
      extrudePath: curve,
    });

    return { leftRailGeo: leftGeo, rightRailGeo: rightGeo, ballastGeo: ballastGeoResult };
  }, [curve]);

  // Active glow animation
  const glowRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, delta) => {
    if (glowRef.current && active) {
      glowRef.current.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.003) * 0.15;
    }
  });

  const railColor = active ? '#4a5568' : '#6b7280';
  const sleeperColor = active ? '#8B6914' : '#6B5B3A';

  return (
    <group ref={groupRef}>
      {/* Ballast */}
      <mesh geometry={ballastGeo}>
        <meshStandardMaterial color="#9CA3AF" roughness={0.95} />
      </mesh>

      {/* Left Rail */}
      <mesh geometry={leftRailGeo} position={[0, 0.04, 0]}>
        <meshStandardMaterial
          ref={glowRef}
          color={railColor}
          metalness={0.8}
          roughness={0.3}
          emissive={active ? '#3b82f6' : '#000000'}
          emissiveIntensity={active ? 0.2 : 0}
        />
      </mesh>

      {/* Right Rail */}
      <mesh geometry={rightRailGeo} position={[0, 0.04, 0]}>
        <meshStandardMaterial
          color={railColor}
          metalness={0.8}
          roughness={0.3}
          emissive={active ? '#3b82f6' : '#000000'}
          emissiveIntensity={active ? 0.2 : 0}
        />
      </mesh>

      {/* Sleepers */}
      {sleeperTransforms.map((st, i) => (
        <mesh
          key={i}
          geometry={SLEEPER_GEO}
          position={[st.pos.x, st.pos.y + 0.02, st.pos.z]}
          rotation={[0, st.rotation + Math.PI / 2, 0]}
        >
          <meshStandardMaterial color={sleeperColor} roughness={0.8} />
        </mesh>
      ))}

      {/* Bridge support beams */}
      {hasBridge && (
        <group>
          {[0.3, 0.5, 0.7].map((t, i) => {
            const pos = curve.getPointAt(t);
            return (
              <group key={i} position={[pos.x, pos.y - 1.5, pos.z]}>
                {/* Bridge pillar */}
                <mesh>
                  <boxGeometry args={[0.3, 3, 0.3]} />
                  <meshStandardMaterial color="#8B7355" roughness={0.7} />
                </mesh>
                {/* Cross beam */}
                <mesh position={[0, 1.4, 0]}>
                  <boxGeometry args={[1.8, 0.15, 0.2]} />
                  <meshStandardMaterial color="#6B5B3A" roughness={0.7} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* Tunnel entrance */}
      {hasTunnel && (() => {
        const tunnelPos = curve.getPointAt(0.5);
        const tunnelTangent = curve.getTangentAt(0.5);
        const tunnelAngle = Math.atan2(tunnelTangent.x, tunnelTangent.z);
        return (
          <group position={[tunnelPos.x, tunnelPos.y, tunnelPos.z]} rotation={[0, tunnelAngle, 0]}>
            {/* Tunnel arch */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[1, 1, 2, 16, 1, true, 0, Math.PI]} />
              <meshStandardMaterial color="#4a4a4a" side={THREE.DoubleSide} roughness={0.9} />
            </mesh>
            {/* Tunnel walls */}
            <mesh position={[-1, 0.3, 0]}>
              <boxGeometry args={[0.15, 0.6, 2]} />
              <meshStandardMaterial color="#555555" roughness={0.9} />
            </mesh>
            <mesh position={[1, 0.3, 0]}>
              <boxGeometry args={[0.15, 0.6, 2]} />
              <meshStandardMaterial color="#555555" roughness={0.9} />
            </mesh>
          </group>
        );
      })()}
    </group>
  );
};

// ── Railway Signal ──
interface RailwaySignalProps {
  position: [number, number, number];
  state: 'red' | 'yellow' | 'green';
}

export const RailwaySignal: React.FC<RailwaySignalProps> = ({ position, state }) => {
  const lightColors = { red: '#ef4444', yellow: '#eab308', green: '#22c55e' };
  const emissiveIntensity = 1.5;

  return (
    <group position={position}>
      {/* Signal pole */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 1.6, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Signal head housing */}
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[0.25, 0.7, 0.15]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Red light */}
      <mesh position={[0, 1.9, 0.08]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={state === 'red' ? lightColors.red : '#3f3f46'}
          emissive={state === 'red' ? lightColors.red : '#000'}
          emissiveIntensity={state === 'red' ? emissiveIntensity : 0}
        />
      </mesh>

      {/* Yellow light */}
      <mesh position={[0, 1.7, 0.08]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={state === 'yellow' ? lightColors.yellow : '#3f3f46'}
          emissive={state === 'yellow' ? lightColors.yellow : '#000'}
          emissiveIntensity={state === 'yellow' ? emissiveIntensity : 0}
        />
      </mesh>

      {/* Green light */}
      <mesh position={[0, 1.5, 0.08]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={state === 'green' ? lightColors.green : '#3f3f46'}
          emissive={state === 'green' ? lightColors.green : '#000'}
          emissiveIntensity={state === 'green' ? emissiveIntensity : 0}
        />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};

// ── Railway Junction Switch ──
interface RailwaySwitchProps {
  position: [number, number, number];
  routeA: boolean; // true = route A selected
  onAnimate?: boolean;
}

export const RailwaySwitch: React.FC<RailwaySwitchProps> = ({ position, routeA }) => {
  const leverRef = useRef<THREE.Mesh>(null);
  const targetAngle = routeA ? -0.4 : 0.4;

  useFrame((_, delta) => {
    if (leverRef.current) {
      const current = leverRef.current.rotation.z;
      leverRef.current.rotation.z += (targetAngle - current) * delta * 4;
    }
  });

  return (
    <group position={position}>
      {/* Base plate */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Switch mechanism housing */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.18, 0.2, 0.18]} />
        <meshStandardMaterial color="#92400e" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Lever */}
      <mesh ref={leverRef} position={[0, 0.3, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Lever knob */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color={routeA ? '#3b82f6' : '#ef4444'}
          emissive={routeA ? '#3b82f6' : '#ef4444'}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};
