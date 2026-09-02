// ============================================================
// THE GREAT NUMBER RAILWAY — Stylized 3D Train & Detailed Models
// - Actual 3D Locomotive Driver inside the engine cabin
// - True Articulation: Every wagon follows the spline independently
// - Step 1: 👥 Realistic Human Passengers sitting in passenger coach
// - Step 2: 🚗 Realistic Sedan & Pickup Truck loaded onto flatbed
// - Step 3: 🪜 Wooden Ladders, Timber Planks, Steel & Bricks on cargo car
// - Step 4: ⚙️ Locomotive Steam Pistons, Pressure Valve & Calipers Disengaged
// - Step 5: 🚦 Emerald Green Semaphore & 15-Second Scenic Journey
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRailwayStore } from '../store/railwayStore';

interface CartoonTrainProps {
  trackPoints: [number, number, number][];
}

// ── Realistic Human Figure Helper ──
export const HumanFigure: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  shirtColor?: string;
  pantsColor?: string;
  hasCap?: boolean;
  hasBag?: boolean;
  isSeated?: boolean;
}> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  shirtColor = '#2563eb',
  pantsColor = '#1e293b',
  hasCap = false,
  hasBag = false,
  isSeated = false,
}) => {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Head */}
      <mesh position={[0, isSeated ? 0.38 : 0.62, 0]}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Hair / Cap */}
      {hasCap ? (
        <group position={[0, isSeated ? 0.44 : 0.68, 0]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.082, 0.04, 12]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.01, 0.06]}>
            <boxGeometry args={[0.09, 0.01, 0.06]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.4} />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, isSeated ? 0.43 : 0.67, -0.01]}>
          <sphereGeometry args={[0.078, 10, 10]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
      )}

      {/* Torso */}
      <mesh position={[0, isSeated ? 0.22 : 0.42, 0]}>
        <boxGeometry args={[0.15, 0.22, 0.09]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>

      {/* Arms */}
      {[-0.095, 0.095].map((x, i) => (
        <mesh key={`arm-${i}`} position={[x, isSeated ? 0.22 : 0.4, 0]}>
          <boxGeometry args={[0.035, 0.18, 0.04]} />
          <meshStandardMaterial color={shirtColor} roughness={0.5} />
        </mesh>
      ))}

      {/* Legs */}
      {isSeated ? (
        // Seated Legs (bent forward)
        <group position={[0, 0.11, 0.06]}>
          {[-0.04, 0.04].map((x, i) => (
            <group key={`leg-${i}`} position={[x, 0, 0]}>
              <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
                <boxGeometry args={[0.04, 0.12, 0.04]} />
                <meshStandardMaterial color={pantsColor} roughness={0.6} />
              </mesh>
              <mesh position={[0, -0.08, 0.12]}>
                <boxGeometry args={[0.04, 0.12, 0.04]} />
                <meshStandardMaterial color={pantsColor} roughness={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      ) : (
        // Standing Legs
        <group position={[0, 0.16, 0]}>
          {[-0.04, 0.04].map((x, i) => (
            <mesh key={`s-leg-${i}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.045, 0.28, 0.05]} />
              <meshStandardMaterial color={pantsColor} roughness={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {/* Backpack / Briefcase */}
      {hasBag && (
        <mesh position={[0, isSeated ? 0.22 : 0.42, -0.06]}>
          <boxGeometry args={[0.12, 0.16, 0.06]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
      )}
    </group>
  );
};

export const CartoonTrain: React.FC<CartoonTrainProps> = ({ trackPoints }) => {
  const locoGroupRef = useRef<THREE.Group>(null);
  const flatbedGroupRef = useRef<THREE.Group>(null);
  const cargoGroupRef = useRef<THREE.Group>(null);
  const coachGroupRef = useRef<THREE.Group>(null);

  const locoWheelsRef = useRef<THREE.Mesh[]>([]);
  const flatbedWheelsRef = useRef<THREE.Mesh[]>([]);
  const cargoWheelsRef = useRef<THREE.Mesh[]>([]);
  const coachWheelsRef = useRef<THREE.Mesh[]>([]);
  const rodRef = useRef<THREE.Mesh>(null);
  const steamPuffsRef = useRef<THREE.Mesh[]>([]);
  const whistleSteamRef = useRef<THREE.Mesh>(null);

  const trainState = useRailwayStore((s) => s.train);
  const loadedItems = useRailwayStore((s) => s.loadedItems);
  const signalState = useRailwayStore((s) => s.signalState);

  // CatmullRom spline
  const curve = useMemo(() => {
    if (!trackPoints || trackPoints.length < 2) return null;
    const pts = trackPoints.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  }, [trackPoints]);

  const curveLength = useMemo(() => (curve ? curve.getLength() : 40), [curve]);

  const locoOffset = 0.0;
  const flatbedOffset = 2.1 / curveLength;
  const cargoOffset = 4.0 / curveLength;
  const coachOffset = 6.0 / curveLength;

  useFrame((_, delta) => {
    if (!curve) return;

    const baseProgress = trainState.progress;
    const isMoving =
      trainState.state === 'moving' ||
      trainState.state === 'departing' ||
      trainState.state === 'approaching' ||
      trainState.state === 'arriving-start';

    const positionWagon = (
      groupRef: React.RefObject<THREE.Group | null>,
      offset: number,
      yOffset: number = 0.12
    ) => {
      if (!groupRef.current) return;
      const t = Math.min(Math.max(baseProgress - offset, 0.0001), 0.9999);
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);

      groupRef.current.position.set(pos.x, pos.y + yOffset, pos.z);
      const angle = Math.atan2(tangent.x, tangent.z);
      groupRef.current.rotation.y = angle;

      if (isMoving) {
        groupRef.current.rotation.z = Math.sin(Date.now() * 0.008 + offset * 10) * 0.02;
      } else {
        groupRef.current.rotation.z = 0;
      }
    };

    positionWagon(locoGroupRef, locoOffset, 0.12);
    positionWagon(flatbedGroupRef, flatbedOffset, 0.12);
    positionWagon(cargoGroupRef, cargoOffset, 0.12);
    positionWagon(coachGroupRef, coachOffset, 0.12);

    // Rotate all wheels
    const wheelSpeed = (isMoving ? trainState.speed * 20 : 0) * delta;
    [
      ...locoWheelsRef.current,
      ...flatbedWheelsRef.current,
      ...cargoWheelsRef.current,
      ...coachWheelsRef.current,
    ].forEach((w) => {
      if (w) w.rotation.x -= wheelSpeed;
    });

    // Connecting rod oscillation
    if (rodRef.current) {
      rodRef.current.position.y = 0.2 + Math.sin(Date.now() * 0.015) * 0.04;
      rodRef.current.position.z = 0.1 + Math.cos(Date.now() * 0.015) * 0.06;
    }

    // Steam puffs
    steamPuffsRef.current.forEach((puff, i) => {
      if (puff) {
        if (trainState.smokeActive || isMoving || loadedItems.brakesLifted) {
          puff.visible = true;
          const timeOffset = (Date.now() * 0.002 + i * 0.35) % 1.5;
          puff.position.y = 1.35 + timeOffset * 1.3;
          puff.position.z = 0.65 - (isMoving ? timeOffset * 0.9 : 0);
          const s = 0.12 + timeOffset * 0.28;
          puff.scale.set(s, s, s);
          (puff.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.75 - timeOffset * 0.5);
        } else {
          puff.visible = false;
        }
      }
    });

    if (whistleSteamRef.current) {
      whistleSteamRef.current.visible = trainState.whistleActive || signalState === 'green';
      if (whistleSteamRef.current.visible) {
        whistleSteamRef.current.scale.setScalar(0.08 + Math.sin(Date.now() * 0.02) * 0.04);
      }
    }
  });

  return (
    <group>
      {/* ========================================================= */}
      {/* ── 1. LOCOMOTIVE ENGINE + ACTUAL 3D TRAIN DRIVER ── */}
      {/* ========================================================= */}
      <group ref={locoGroupRef} scale={[0.85, 0.85, 0.85]}>
        {/* Boiler Cylinder */}
        <mesh position={[0, 0.62, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 1.3, 24]} />
          <meshStandardMaterial color="#2d3748" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Boiler Cap with Face */}
        <mesh position={[0, 0.62, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.39, 0.39, 0.08, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.62, 1.09]}>
          <sphereGeometry args={[0.37, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>

        {/* Friendly Eyes */}
        <group position={[-0.14, 0.72, 1.38]}>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0, 0.085]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.02, 0.02, 0.1]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
          </mesh>
        </group>

        <group position={[0.14, 0.72, 1.38]}>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0, 0.085]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.02, 0.02, 0.1]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Cheeks & Smile */}
        <mesh position={[-0.22, 0.58, 1.32]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color="#fb7185" roughness={0.6} />
        </mesh>
        <mesh position={[0.22, 0.58, 1.32]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color="#fb7185" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.52, 1.39]}>
          <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.3} />
        </mesh>

        {/* Cow-Catcher */}
        <group position={[0, 0.15, 1.3]}>
          <mesh position={[0, 0.05, 0.15]} rotation={[0.45, 0, 0]}>
            <boxGeometry args={[0.82, 0.12, 0.42]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
          {[-0.3, -0.18, -0.06, 0.06, 0.18, 0.3].map((x, i) => (
            <mesh key={i} position={[x, 0.08, 0.22]} rotation={[0.45, 0, 0]}>
              <boxGeometry args={[0.03, 0.15, 0.28]} />
              <meshStandardMaterial color="#facc15" roughness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, -0.02, 0.32]}>
            <boxGeometry args={[0.84, 0.06, 0.08]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} />
          </mesh>
        </group>

        {/* Gold Bands */}
        {[0.0, 0.45, 0.85].map((z, i) => (
          <mesh key={i} position={[0, 0.62, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.395, 0.02, 8, 24]} />
            <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Smokestack */}
        <group position={[0, 1.02, 0.75]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.11, 0.48, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <torusGeometry args={[0.18, 0.035, 8, 16]} />
            <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Steam Dome & Whistle */}
        <mesh position={[0, 1.05, 0.18]}>
          <sphereGeometry args={[0.16, 16, 12]} />
          <meshStandardMaterial color="#facc15" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.12, 1.08, -0.08]}>
          <cylinderGeometry args={[0.03, 0.03, 0.22, 8]} />
          <meshStandardMaterial color="#facc15" metalness={0.85} roughness={0.2} />
        </mesh>

        <mesh ref={whistleSteamRef} position={[0.12, 1.25, -0.08]} visible={false}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>

        {/* Steam Puffs */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            ref={(el) => { if (el) steamPuffsRef.current[i] = el; }}
            position={[0, 1.4, 0.75]}
            visible={false}
          >
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#f8fafc" transparent opacity={0.7} roughness={0.1} />
          </mesh>
        ))}

        {/* Red Cabin with Gold Roof */}
        <group position={[0, 0.85, -0.65]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.88, 0.88, 0.78]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.52, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.48, 0.48, 0.88, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#facc15" roughness={0.25} metalness={0.2} />
          </mesh>
          {/* Side Windows */}
          {[-0.45, 0.45].map((x, i) => (
            <group key={i} position={[x, 0.06, 0]}>
              <mesh>
                <boxGeometry args={[0.02, 0.42, 0.46]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              <mesh position={[x > 0 ? 0.01 : -0.01, 0, 0]}>
                <boxGeometry args={[0.02, 0.36, 0.4]} />
                <meshStandardMaterial color="#7dd3fc" roughness={0.1} transparent opacity={0.75} />
              </mesh>
            </group>
          ))}

          {/* ── 3D LOCOMOTIVE DRIVER (Visible Inside the Cabin) ── */}
          <group position={[0.15, -0.15, 0]}>
            <HumanFigure
              position={[0, 0, 0]}
              scale={0.9}
              shirtColor="#1e3a8a"
              pantsColor="#0f172a"
              hasCap={true}
              isSeated={true}
            />
            {/* Throttle Controls */}
            <mesh position={[0.1, 0.25, 0.15]}>
              <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
              <meshStandardMaterial color="#facc15" metalness={0.8} />
            </mesh>
          </group>
        </group>

        {/* Chassis */}
        <mesh position={[0, 0.2, 0.15]}>
          <boxGeometry args={[0.88, 0.14, 2.3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>

        {/* Wheels */}
        {[-0.47, 0.47].map((x, i) => (
          <group key={`rear-w-${i}`} position={[x, 0.24, -0.3]}>
            <mesh
              ref={(el) => { if (el) locoWheelsRef.current[i] = el; }}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            <mesh position={[x > 0 ? 0.05 : -0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.09, 0.09, 0.03, 12]} />
              <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {[-0.47, 0.47].map((x, i) => (
          <group key={`front-w-${i}`} position={[x, 0.18, 0.55]}>
            <mesh
              ref={(el) => { if (el) locoWheelsRef.current[i + 2] = el; }}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            <mesh position={[x > 0 ? 0.05 : -0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.03, 12]} />
              <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Connecting Rod */}
        <mesh ref={rodRef} position={[-0.52, 0.2, 0.12]}>
          <boxGeometry args={[0.03, 0.04, 0.95]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* ── 2. CARRIAGE 1: VEHICLE FLATBED CAR (LOADED ON STEP 2) ── */}
      {/* ========================================================= */}
      <group ref={flatbedGroupRef} scale={[0.85, 0.85, 0.85]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.82, 0.1, 1.8]} />
          <meshStandardMaterial color="#d97706" roughness={0.7} />
        </mesh>
        {[-0.4, 0.4].map((x, i) => (
          <mesh key={i} position={[x, 0.3, 0]}>
            <boxGeometry args={[0.03, 0.14, 1.76]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
        ))}

        {/* Wheels */}
        {[-0.43, 0.43].map((x, i) => (
          <group key={i}>
            <mesh
              ref={(el) => { if (el) flatbedWheelsRef.current[i] = el; }}
              position={[x, 0.15, 0.45]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
            <mesh
              ref={(el) => { if (el) flatbedWheelsRef.current[i + 2] = el; }}
              position={[x, 0.15, -0.45]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* ── REALISTIC 3D VEHICLES (Appears on Step 2 Correct Answer!) ── */}
        {loadedItems.vehicles && (
          <group position={[0, 0.28, 0]}>
            {/* 1. Realistic Cyan Sedan Car */}
            <group position={[0, 0, 0.42]} scale={[0.55, 0.55, 0.55]}>
              {/* Lower Body */}
              <mesh position={[0, 0.14, 0]}>
                <boxGeometry args={[0.62, 0.18, 1.05]} />
                <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.3} />
              </mesh>
              {/* Cabin & Windows */}
              <mesh position={[0, 0.3, -0.05]}>
                <boxGeometry args={[0.48, 0.18, 0.55]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} />
              </mesh>
              {/* Headlights & Taillights */}
              <mesh position={[-0.22, 0.16, 0.53]}>
                <boxGeometry args={[0.1, 0.06, 0.02]} />
                <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.8} />
              </mesh>
              <mesh position={[0.22, 0.16, 0.53]}>
                <boxGeometry args={[0.1, 0.06, 0.02]} />
                <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.8} />
              </mesh>
              <mesh position={[-0.22, 0.16, -0.53]}>
                <boxGeometry args={[0.1, 0.06, 0.02]} />
                <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
              </mesh>
              <mesh position={[0.22, 0.16, -0.53]}>
                <boxGeometry args={[0.1, 0.06, 0.02]} />
                <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
              </mesh>
              {/* Tires & Hubcaps */}
              {[[-0.32, 0.09, 0.3], [0.32, 0.09, 0.3], [-0.32, 0.09, -0.3], [0.32, 0.09, -0.3]].map((wp, wi) => (
                <group key={wi} position={wp as [number, number, number]}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.09, 0.09, 0.06, 12]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.9} />
                  </mesh>
                  <mesh position={[wp[0] > 0 ? 0.035 : -0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.045, 0.045, 0.02, 8]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
                  </mesh>
                </group>
              ))}
            </group>

            {/* 2. Realistic Yellow Pickup Truck */}
            <group position={[0, 0, -0.42]} scale={[0.55, 0.55, 0.55]}>
              <mesh position={[0, 0.16, 0]}>
                <boxGeometry args={[0.64, 0.22, 1.1]} />
                <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.2} />
              </mesh>
              {/* Truck Cabin */}
              <mesh position={[0, 0.35, 0.18]}>
                <boxGeometry args={[0.55, 0.22, 0.45]} />
                <meshStandardMaterial color="#fef08a" roughness={0.1} />
              </mesh>
              {/* Open Bed */}
              <mesh position={[0, 0.28, -0.28]}>
                <boxGeometry args={[0.56, 0.15, 0.48]} />
                <meshStandardMaterial color="#ca8a04" roughness={0.7} />
              </mesh>
              {/* Wheels */}
              {[[-0.33, 0.1, 0.32], [0.33, 0.1, 0.32], [-0.33, 0.1, -0.32], [0.33, 0.1, -0.32]].map((wp, wi) => (
                <group key={wi} position={wp as [number, number, number]}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.07, 12]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.9} />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        )}
      </group>

      {/* ========================================================= */}
      {/* ── 3. CARRIAGE 2: MATERIALS CAR (LADDERS & PLANKS - STEP 3) ── */}
      {/* ========================================================= */}
      <group ref={cargoGroupRef} scale={[0.85, 0.85, 0.85]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.82, 0.26, 1.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>

        {/* Wheels */}
        {[-0.43, 0.43].map((x, i) => (
          <group key={i}>
            <mesh
              ref={(el) => { if (el) cargoWheelsRef.current[i] = el; }}
              position={[x, 0.15, 0.45]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
            <mesh
              ref={(el) => { if (el) cargoWheelsRef.current[i + 2] = el; }}
              position={[x, 0.15, -0.45]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* ── REALISTIC MATERIALS: LADDERS, PLANKS, STEEL & BRICKS (Step 3) ── */}
        {loadedItems.materials && (
          <group position={[0, 0.42, 0]}>
            {/* 1. Timber Planks Stack */}
            {[-0.24, 0, 0.24].map((x, li) => (
              <mesh key={`plank-${li}`} position={[x, 0.08, 0]}>
                <boxGeometry args={[0.2, 0.08, 1.5]} />
                <meshStandardMaterial color="#b45309" roughness={0.9} />
              </mesh>
            ))}
            {[-0.12, 0.12].map((x, li) => (
              <mesh key={`plank-top-${li}`} position={[x, 0.18, 0]}>
                <boxGeometry args={[0.2, 0.08, 1.4]} />
                <meshStandardMaterial color="#d97706" roughness={0.9} />
              </mesh>
            ))}

            {/* 2. Wooden Ladders on Side */}
            {[-0.38, 0.38].map((x, i) => (
              <group key={`ladder-${i}`} position={[x, 0.25, 0]} rotation={[0, 0, i === 0 ? 0.2 : -0.2]}>
                {/* Rails */}
                <mesh position={[0, 0, -0.6]}>
                  <boxGeometry args={[0.03, 0.3, 0.03]} />
                  <meshStandardMaterial color="#fed7aa" roughness={0.7} />
                </mesh>
                <mesh position={[0, 0, 0.6]}>
                  <boxGeometry args={[0.03, 0.3, 0.03]} />
                  <meshStandardMaterial color="#fed7aa" roughness={0.7} />
                </mesh>
                {/* Rungs */}
                {[-0.4, -0.2, 0, 0.2, 0.4].map((z, ri) => (
                  <mesh key={`rung-${ri}`} position={[0, 0, z]}>
                    <boxGeometry args={[0.02, 0.28, 0.02]} />
                    <meshStandardMaterial color="#fed7aa" roughness={0.7} />
                  </mesh>
                ))}
              </group>
            ))}

            {/* 3. Red Brick Pallets */}
            <mesh position={[-0.18, 0.32, 0.35]}>
              <boxGeometry args={[0.28, 0.18, 0.45]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.8} />
            </mesh>

            {/* 4. Steel Scaffolding Beams */}
            <mesh position={[0.18, 0.32, -0.3]}>
              <boxGeometry args={[0.2, 0.16, 0.7]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}
      </group>

      {/* ========================================================= */}
      {/* ── 4. CARRIAGE 3: PASSENGER COACH (BOARDED ON STEP 1) ── */}
      {/* ========================================================= */}
      <group ref={coachGroupRef} scale={[0.85, 0.85, 0.85]}>
        <mesh position={[0, 0.58, 0]}>
          <boxGeometry args={[0.84, 0.65, 1.8]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.94, 0]}>
          <boxGeometry args={[0.88, 0.08, 1.88]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Windows */}
        {[-0.43, 0.43].map((x, si) => (
          <group key={`side-win-${si}`}>
            {[-0.55, 0, 0.55].map((z, wi) => (
              <group key={`win-${wi}`} position={[x, 0.62, z]}>
                <mesh>
                  <boxGeometry args={[0.02, 0.32, 0.32]} />
                  <meshStandardMaterial
                    color={loadedItems.passengers ? '#fef08a' : '#93c5fd'}
                    emissive={loadedItems.passengers ? '#eab308' : '#000000'}
                    emissiveIntensity={loadedItems.passengers ? 0.8 : 0}
                    roughness={0.1}
                    transparent
                    opacity={0.85}
                  />
                </mesh>

                {/* ── REALISTIC ONBOARD PASSENGERS (Appears on Step 1 Correct Answer!) ── */}
                {loadedItems.passengers && (
                  <group position={[x > 0 ? -0.15 : 0.15, -0.22, 0]}>
                    <HumanFigure
                      position={[0, 0, 0]}
                      scale={0.7}
                      shirtColor={wi === 0 ? '#2563eb' : wi === 1 ? '#16a34a' : '#ea580c'}
                      pantsColor="#1e293b"
                      isSeated={true}
                    />
                  </group>
                )}
              </group>
            ))}
          </group>
        ))}

        {/* Wheels */}
        {[-0.44, 0.44].map((x, i) => (
          <group key={`coach-w-${i}`}>
            <mesh
              ref={(el) => { if (el) coachWheelsRef.current[i] = el; }}
              position={[x, 0.15, 0.45]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
            <mesh
              ref={(el) => { if (el) coachWheelsRef.current[i + 2] = el; }}
              position={[x, 0.15, -0.45]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
