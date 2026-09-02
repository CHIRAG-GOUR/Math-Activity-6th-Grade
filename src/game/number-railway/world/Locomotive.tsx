// ============================================================
// THE GREAT NUMBER RAILWAY — Stylized Cartoon 3D Train & Carriages
// - Independent Spline Following for EVERY Carriage (Loco + 3 Cars)
// - True Railway Articulation: Each wagon follows the track curve independently
// - Animated Item Loading (Vehicles drop, Materials stack, People board)
// - Continuous Steam, Wheel rotation, and Whistle animation
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRailwayStore } from '../store/railwayStore';

interface CartoonTrainProps {
  trackPoints: [number, number, number][];
}

export const CartoonTrain: React.FC<CartoonTrainProps> = ({ trackPoints }) => {
  // References to independent wagon groups
  const locoGroupRef = useRef<THREE.Group>(null);
  const flatbedGroupRef = useRef<THREE.Group>(null);
  const cargoGroupRef = useRef<THREE.Group>(null);
  const coachGroupRef = useRef<THREE.Group>(null);

  // Wheel and particle refs
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

  // Build CatmullRom spline curve
  const curve = useMemo(() => {
    if (!trackPoints || trackPoints.length < 2) return null;
    const pts = trackPoints.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  }, [trackPoints]);

  const curveLength = useMemo(() => (curve ? curve.getLength() : 40), [curve]);

  // Distance offsets along track for each car (in normalized 0..1 units)
  const locoOffset = 0.0;
  const flatbedOffset = 2.1 / curveLength; // ~2.1m behind loco
  const cargoOffset = 4.0 / curveLength;   // ~4.0m behind loco
  const coachOffset = 6.0 / curveLength;   // ~6.0m behind loco

  // Frame animation: Position and orient EVERY wagon along the spline
  useFrame((_, delta) => {
    if (!curve) return;

    const baseProgress = trainState.progress;
    const isMoving = trainState.state === 'moving' || trainState.state === 'departing' || trainState.state === 'approaching';

    // Helper to position a single wagon group along spline
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

    // Position each wagon independently!
    positionWagon(locoGroupRef, locoOffset, 0.12);
    positionWagon(flatbedGroupRef, flatbedOffset, 0.12);
    positionWagon(cargoGroupRef, cargoOffset, 0.12);
    positionWagon(coachGroupRef, coachOffset, 0.12);

    // Rotate all wheels
    const wheelSpeed = (isMoving ? trainState.speed * 22 : 0) * delta;
    [...locoWheelsRef.current, ...flatbedWheelsRef.current, ...cargoWheelsRef.current, ...coachWheelsRef.current].forEach((w) => {
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
          const timeOffset = (Date.now() * 0.002 + i * 0.4) % 1.5;
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
      {/* ── 1. LOCOMOTIVE ENGINE (INDEPENDENT WAGON GROUP) ── */}
      {/* ========================================================= */}
      <group ref={locoGroupRef} scale={[0.85, 0.85, 0.85]}>
        {/* Boiler Cylinder */}
        <mesh position={[0, 0.62, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 1.3, 24]} />
          <meshStandardMaterial color="#2d3748" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Boiler Front Cap with Friendly Face */}
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

        {/* Rosy Cheeks & Smile */}
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

        {/* Cow-Catcher Plow (Red with Yellow Slats) */}
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

        {/* Gold Steam Dome & Whistle */}
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

        {/* Smokestack Steam Puffs */}
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
          {[-0.45, 0.45].map((x, i) => (
            <group key={i} position={[x, 0.06, 0]}>
              <mesh>
                <boxGeometry args={[0.02, 0.42, 0.46]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              <mesh position={[x > 0 ? 0.01 : -0.01, 0, 0]}>
                <boxGeometry args={[0.02, 0.36, 0.4]} />
                <meshStandardMaterial color="#7dd3fc" roughness={0.1} emissive="#38bdf8" emissiveIntensity={0.2} />
              </mesh>
            </group>
          ))}
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
      {/* ── 2. CARRIAGE 1: VEHICLE FLATBED CAR (INDEPENDENT) ── */}
      {/* ========================================================= */}
      <group ref={flatbedGroupRef} scale={[0.85, 0.85, 0.85]}>
        {/* Chassis */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.82, 0.1, 1.6]} />
          <meshStandardMaterial color="#d97706" roughness={0.7} />
        </mesh>
        {[-0.4, 0.4].map((x, i) => (
          <mesh key={i} position={[x, 0.3, 0]}>
            <boxGeometry args={[0.03, 0.14, 1.56]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
        ))}

        {/* Wheels */}
        {[-0.43, 0.43].map((x, i) => (
          <group key={i}>
            <mesh
              ref={(el) => { if (el) flatbedWheelsRef.current[i] = el; }}
              position={[x, 0.15, 0.4]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
            <mesh
              ref={(el) => { if (el) flatbedWheelsRef.current[i + 2] = el; }}
              position={[x, 0.15, -0.4]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* ── 3D LOADED VEHICLES (Appears on Step 1 Correct Answer!) ── */}
        {loadedItems.vehicles && (
          <group position={[0, 0.28, 0]}>
            {/* Cyan Sports Car */}
            <group position={[0, 0, 0.35]} scale={[0.55, 0.55, 0.55]}>
              <mesh position={[0, 0.14, 0]}>
                <boxGeometry args={[0.55, 0.18, 0.85]} />
                <meshStandardMaterial color="#0284c7" roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.3, -0.05]}>
                <boxGeometry args={[0.42, 0.18, 0.46]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} />
              </mesh>
              {[[-0.28, 0.08, 0.24], [0.28, 0.08, 0.24], [-0.28, 0.08, -0.24], [0.28, 0.08, -0.24]].map((wp, wi) => (
                <mesh key={wi} position={wp as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.06, 10]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
              ))}
            </group>

            {/* Yellow Pickup Truck */}
            <group position={[0, 0, -0.35]} scale={[0.55, 0.55, 0.55]}>
              <mesh position={[0, 0.16, 0]}>
                <boxGeometry args={[0.56, 0.22, 0.9]} />
                <meshStandardMaterial color="#eab308" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.34, 0.15]}>
                <boxGeometry args={[0.5, 0.2, 0.4]} />
                <meshStandardMaterial color="#fef08a" />
              </mesh>
              {[[-0.29, 0.08, 0.26], [0.29, 0.08, 0.26], [-0.29, 0.08, -0.26], [0.29, 0.08, -0.26]].map((wp, wi) => (
                <mesh key={wi} position={wp as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.09, 0.09, 0.06, 10]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
              ))}
            </group>
          </group>
        )}
      </group>

      {/* ========================================================= */}
      {/* ── 3. CARRIAGE 2: BUILDING MATERIALS CAR (INDEPENDENT) ── */}
      {/* ========================================================= */}
      <group ref={cargoGroupRef} scale={[0.85, 0.85, 0.85]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.82, 0.26, 1.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>

        {/* Wheels */}
        {[-0.43, 0.43].map((x, i) => (
          <group key={i}>
            <mesh
              ref={(el) => { if (el) cargoWheelsRef.current[i] = el; }}
              position={[x, 0.15, 0.4]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
            <mesh
              ref={(el) => { if (el) cargoWheelsRef.current[i + 2] = el; }}
              position={[x, 0.15, -0.4]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* ── 3D LOADED BUILDING MATERIALS (Appears on Step 2 Correct Answer!) ── */}
        {loadedItems.materials && (
          <group position={[0, 0.42, 0]}>
            {/* Stacked Timber Logs */}
            {[-0.22, 0, 0.22].map((x, li) => (
              <mesh key={`log1-${li}`} position={[x, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 1.35, 12]} />
                <meshStandardMaterial color="#92400e" roughness={0.9} />
              </mesh>
            ))}
            {[-0.11, 0.11].map((x, li) => (
              <mesh key={`log2-${li}`} position={[x, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.085, 0.085, 1.3, 12]} />
                <meshStandardMaterial color="#a16207" roughness={0.9} />
              </mesh>
            ))}

            {/* Red Brick Pallets */}
            <mesh position={[-0.18, 0.42, 0.25]}>
              <boxGeometry args={[0.26, 0.18, 0.4]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.8} />
            </mesh>

            {/* Steel I-Beams */}
            <mesh position={[0.18, 0.42, -0.2]}>
              <boxGeometry args={[0.18, 0.16, 0.65]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}
      </group>

      {/* ========================================================= */}
      {/* ── 4. CARRIAGE 3: PASSENGER COACH (INDEPENDENT) ── */}
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

        {/* Windows & Passenger Figures */}
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
                  />
                </mesh>

                {/* ── PASSENGER FIGURES (Appears on Step 3 Correct Answer!) ── */}
                {loadedItems.passengers && (
                  <group position={[x > 0 ? -0.1 : 0.1, -0.05, 0]}>
                    <mesh position={[0, 0.06, 0]}>
                      <sphereGeometry args={[0.065, 8, 8]} />
                      <meshStandardMaterial color={wi % 2 === 0 ? '#fde047' : '#f97316'} />
                    </mesh>
                    <mesh position={[0, -0.06, 0]}>
                      <boxGeometry args={[0.1, 0.1, 0.1]} />
                      <meshStandardMaterial color={wi === 0 ? '#3b82f6' : wi === 1 ? '#10b981' : '#ec4899'} />
                    </mesh>
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
