// ============================================================
// THE GREAT NUMBER RAILWAY — Stylized Steam Trains & Articulated Carriages
// - Blue Team Locomotive on Left Track, Red Team Locomotive on Right Track
// - Realistic 3D Train Driver inside both locomotive cabins
// - Correctly positioned Passenger Coach:
//   * Passengers sit INSIDE the coach cabin, neatly framed by side windows
//   * Blue passengers wear Blue shirts, Red passengers wear Red shirts
//   * ZERO roof clipping or floating
// - Flatbed Carriage with Vehicles & Cargo Carriage with Ladders/Planks
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRailwayStore } from '../store/railwayStore';
import { TeamId } from '../types';

// ── Realistic Human Figure Helper (Standing / Seated) ──
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
      <mesh position={[0, isSeated ? 0.38 : 0.62, 0]}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
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
      <mesh position={[0, isSeated ? 0.22 : 0.42, 0]}>
        <boxGeometry args={[0.15, 0.22, 0.09]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>
      {[-0.095, 0.095].map((x, i) => (
        <mesh key={`arm-${i}`} position={[x, isSeated ? 0.22 : 0.4, 0]}>
          <boxGeometry args={[0.035, 0.18, 0.04]} />
          <meshStandardMaterial color={shirtColor} roughness={0.5} />
        </mesh>
      ))}
      {isSeated ? (
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
        <group position={[0, 0.16, 0]}>
          {[-0.04, 0.04].map((x, i) => (
            <mesh key={`s-leg-${i}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.045, 0.28, 0.05]} />
              <meshStandardMaterial color={pantsColor} roughness={0.6} />
            </mesh>
          ))}
        </group>
      )}
      {hasBag && (
        <mesh position={[0, isSeated ? 0.22 : 0.42, -0.06]}>
          <boxGeometry args={[0.12, 0.16, 0.06]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
      )}
    </group>
  );
};

// ── Realistic Seated Passenger Figure ──
export const SeatedPassenger: React.FC<{
  position: [number, number, number];
  team: TeamId;
  scale?: number;
}> = ({ position, team, scale = 0.75 }) => {
  const isBlue = team === 'blue';
  const shirtColor = isBlue ? '#2563eb' : '#dc2626';
  const capColor = isBlue ? '#1e3a8a' : '#7f1d1d';

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Head */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.08, 0.082, 0.035, 10]} />
        <meshStandardMaterial color={capColor} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.47, 0.06]}>
        <boxGeometry args={[0.085, 0.01, 0.05]} />
        <meshStandardMaterial color={capColor} roughness={0.4} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.15, 0.22, 0.09]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>

      {/* Arms */}
      {[-0.095, 0.095].map((x, i) => (
        <mesh key={`arm-${i}`} position={[x, 0.24, 0]}>
          <boxGeometry args={[0.035, 0.16, 0.04]} />
          <meshStandardMaterial color={shirtColor} roughness={0.5} />
        </mesh>
      ))}

      {/* Seated Legs */}
      <group position={[0, 0.12, 0.05]}>
        {[-0.04, 0.04].map((x, i) => (
          <group key={`leg-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[0.04, 0.1, 0.04]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.07, 0.1]}>
              <boxGeometry args={[0.04, 0.1, 0.04]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

interface TeamTrainProps {
  team: TeamId;
  route?: [number, number, number][];
  trackPoints?: [number, number, number][];
}

export const StylizedTeamTrain: React.FC<TeamTrainProps> = ({ team, route, trackPoints }) => {
  const points = route || trackPoints || [];
  const locoGroupRef = useRef<THREE.Group>(null);
  const flatbedGroupRef = useRef<THREE.Group>(null);
  const cargoGroupRef = useRef<THREE.Group>(null);
  const coachGroupRef = useRef<THREE.Group>(null);

  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const rodRef = useRef<THREE.Mesh>(null);
  const steamPuffsRef = useRef<THREE.Mesh[]>([]);
  const whistleSteamRef = useRef<THREE.Mesh>(null);

  const trainAnim = useRailwayStore((s) => (team === 'blue' ? s.blueTrain : s.redTrain));
  const onboardPassengers = useRailwayStore((s) => s.onboardPassengers);

  const isBlue = team === 'blue';
  const primaryColor = isBlue ? '#2563eb' : '#dc2626';
  const secondaryColor = isBlue ? '#1e3a8a' : '#7f1d1d';
  const trimColor = '#facc15';

  const curve = useMemo(() => {
    if (!points || points.length < 2) return null;
    const pts = points.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  }, [points]);

  const curveLen = useMemo(() => (curve ? curve.getLength() : 40), [curve]);

  const locoOffset = 0.0;
  const flatbedOffset = 2.0 / curveLen;
  const cargoOffset = 3.9 / curveLen;
  const coachOffset = 5.8 / curveLen;

  const currentProgressRef = useRef(trainAnim.progress);

  useFrame((_, delta) => {
    if (!curve) return;

    // Reset position immediately if new round resets progress to 0
    if (trainAnim.progress === 0 && currentProgressRef.current > 0.4) {
      currentProgressRef.current = 0;
    }

    const targetProgress = trainAnim.progress;
    const isShowdown = trainAnim.state === 'departing' || trainAnim.state === 'moving';
    // Smooth, silky steam locomotive physics damping
    const dampRate = isShowdown ? 3.5 : 2.2;

    currentProgressRef.current = THREE.MathUtils.damp(
      currentProgressRef.current,
      targetProgress,
      dampRate,
      delta
    );

    const baseProgress = currentProgressRef.current;
    const progressDiff = Math.abs(currentProgressRef.current - targetProgress);
    const isMoving = isShowdown || progressDiff > 0.0003;

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
      groupRef.current.rotation.set(0, angle, 0);
    };

    positionWagon(locoGroupRef, locoOffset, 0.12);
    positionWagon(flatbedGroupRef, flatbedOffset, 0.12);
    positionWagon(cargoGroupRef, cargoOffset, 0.12);
    positionWagon(coachGroupRef, coachOffset, 0.12);

    // Smooth wheel rotation (no jerky speed spikes)
    const activeSpeed = isShowdown ? trainAnim.speed : Math.min(1.2, Math.max(0.4, progressDiff * 25));
    const wheelSpeed = (isMoving ? activeSpeed * 16 : 0) * delta;
    wheelsRef.current.forEach((w) => {
      if (w) w.rotation.x -= wheelSpeed;
    });

    // Smooth connecting rod oscillation
    if (rodRef.current) {
      if (isMoving) {
        const tNow = Date.now() * 0.005;
        rodRef.current.position.y = 0.2 + Math.sin(tNow) * 0.03;
        rodRef.current.position.z = 0.1 + Math.cos(tNow) * 0.04;
      } else {
        rodRef.current.position.y = 0.2;
        rodRef.current.position.z = 0.1;
      }
    }

    // Gentle steam puffs
    steamPuffsRef.current.forEach((puff, i) => {
      if (puff) {
        if (trainAnim.smokeActive || isMoving) {
          puff.visible = true;
          const timeOffset = (Date.now() * 0.0018 + i * 0.35) % 1.5;
          puff.position.y = 1.35 + timeOffset * 1.2;
          puff.position.z = 0.65 - (isMoving ? timeOffset * 0.8 : 0);
          const s = 0.12 + timeOffset * 0.24;
          puff.scale.set(s, s, s);
          (puff.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.65 - timeOffset * 0.45);
        } else {
          puff.visible = false;
        }
      }
    });

    if (whistleSteamRef.current) {
      whistleSteamRef.current.visible = trainAnim.whistleActive;
    }
  });

  // Seat positions inside the passenger coach (3 pairs of left & right window seats)
  const seatPositions: [number, number, number][] = [
    [-0.22, 0.24, 0.45],
    [0.22, 0.24, 0.45],
    [-0.22, 0.24, 0],
    [0.22, 0.24, 0],
    [-0.22, 0.24, -0.45],
    [0.22, 0.24, -0.45],
  ];

  return (
    <group>
      {/* ========================================================= */}
      {/* ── 1. LOCOMOTIVE ENGINE WITH 3D DRIVER IN CABIN ── */}
      {/* ========================================================= */}
      <group ref={locoGroupRef} scale={[0.85, 0.85, 0.85]}>
        {/* Boiler */}
        <mesh position={[0, 0.62, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 1.3, 24]} />
          <meshStandardMaterial color="#2d3748" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Boiler Front Cap with Team Color */}
        <mesh position={[0, 0.62, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.39, 0.39, 0.08, 24]} />
          <meshStandardMaterial color={primaryColor} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.62, 1.09]}>
          <sphereGeometry args={[0.37, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={primaryColor} roughness={0.3} />
        </mesh>

        {/* Smokestack */}
        <group position={[0, 1.02, 0.75]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.11, 0.48, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <torusGeometry args={[0.18, 0.035, 8, 16]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

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

        {/* Cabin with 3D Train Driver */}
        <group position={[0, 0.85, -0.65]}>
          <mesh>
            <boxGeometry args={[0.88, 0.88, 0.78]} />
            <meshStandardMaterial color={primaryColor} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.52, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.48, 0.48, 0.88, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={trimColor} roughness={0.25} metalness={0.2} />
          </mesh>
          {/* Side Windows */}
          {[-0.45, 0.45].map((x, i) => (
            <mesh key={i} position={[x, 0.06, 0]}>
              <boxGeometry args={[0.02, 0.36, 0.4]} />
              <meshStandardMaterial color="#7dd3fc" roughness={0.1} transparent opacity={0.75} />
            </mesh>
          ))}

          {/* 3D Train Driver in Cabin */}
          <group position={[0.12, -0.18, 0]}>
            <SeatedPassenger position={[0, 0, 0]} team={team} scale={0.85} />
            {/* Throttle Lever */}
            <mesh position={[0.1, 0.22, 0.12]}>
              <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
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
              ref={(el) => { if (el) wheelsRef.current.push(el); }}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
              <meshStandardMaterial color={primaryColor} roughness={0.3} />
            </mesh>
          </group>
        ))}
        {[-0.47, 0.47].map((x, i) => (
          <group key={`front-w-${i}`} position={[x, 0.18, 0.55]}>
            <mesh
              ref={(el) => { if (el) wheelsRef.current.push(el); }}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
              <meshStandardMaterial color={primaryColor} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Connecting Rod */}
        <mesh ref={rodRef} position={[-0.52, 0.2, 0.12]}>
          <boxGeometry args={[0.03, 0.04, 0.95]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* ── 2. CARRIAGE 1: VEHICLE FLATBED ── */}
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

        {/* 3D Cyan Sports Sedan on Flatbed */}
        <group position={[0, 0.28, 0.4]} scale={[0.55, 0.55, 0.55]}>
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[0.62, 0.18, 1.05]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.3, -0.05]}>
            <boxGeometry args={[0.48, 0.18, 0.55]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} />
          </mesh>
        </group>

        {/* 3D Yellow Pickup Truck on Flatbed */}
        <group position={[0, 0.28, -0.4]} scale={[0.55, 0.55, 0.55]}>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.64, 0.22, 1.1]} />
            <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.35, 0.18]}>
            <boxGeometry args={[0.55, 0.22, 0.45]} />
            <meshStandardMaterial color="#fef08a" roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* ── 3. CARRIAGE 2: CARGO WAGON (LADDERS & PLANKS) ── */}
      {/* ========================================================= */}
      <group ref={cargoGroupRef} scale={[0.85, 0.85, 0.85]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.82, 0.26, 1.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Planks & Ladders */}
        <group position={[0, 0.42, 0]}>
          {[-0.22, 0, 0.22].map((x, li) => (
            <mesh key={`plank-${li}`} position={[x, 0.08, 0]}>
              <boxGeometry args={[0.18, 0.08, 1.4]} />
              <meshStandardMaterial color="#b45309" roughness={0.9} />
            </mesh>
          ))}
          {/* Ladders on Side */}
          {[-0.38, 0.38].map((x, i) => (
            <group key={`ladder-${i}`} position={[x, 0.25, 0]}>
              <mesh position={[0, 0, -0.5]}>
                <boxGeometry args={[0.03, 0.28, 0.03]} />
                <meshStandardMaterial color="#fed7aa" />
              </mesh>
              <mesh position={[0, 0, 0.5]}>
                <boxGeometry args={[0.03, 0.28, 0.03]} />
                <meshStandardMaterial color="#fed7aa" />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ========================================================= */}
      {/* ── 4. CARRIAGE 3: PASSENGER COACH (SEATED INSIDE CABIN) ── */}
      {/* ========================================================= */}
      <group ref={coachGroupRef} scale={[0.85, 0.85, 0.85]}>
        {/* Coach Body Shell */}
        <mesh position={[0, 0.58, 0]}>
          <boxGeometry args={[0.84, 0.65, 1.8]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.35} />
        </mesh>
        {/* Roof Cap */}
        <mesh position={[0, 0.94, 0]}>
          <boxGeometry args={[0.88, 0.08, 1.88]} />
          <meshStandardMaterial color={trimColor} roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Clear Glass Windows */}
        {[-0.43, 0.43].map((x, si) => (
          <group key={`side-win-${si}`}>
            {[-0.55, 0, 0.55].map((z, wi) => (
              <mesh key={`win-${wi}`} position={[x, 0.62, z]}>
                <boxGeometry args={[0.02, 0.34, 0.34]} />
                <meshStandardMaterial
                  color="#93c5fd"
                  roughness={0.1}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* ── PASSENGERS SEATED INSIDE COACH FLOOR ── */}
        <group position={[0, 0.28, 0]}>
          {onboardPassengers.map((pass, idx) => {
            const seat = seatPositions[idx % seatPositions.length];
            return (
              <SeatedPassenger
                key={pass.id}
                position={seat}
                team={pass.team}
                scale={0.7}
              />
            );
          })}
        </group>
      </group>
    </group>
  );
};

export const TeamTrain = StylizedTeamTrain;
