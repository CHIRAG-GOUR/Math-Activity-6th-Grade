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
  const signalsGreenCount = useRailwayStore((s) => s.signalsGreenCount);

  const isBlue = team === 'blue';
  const primaryColor = isBlue ? '#2563eb' : '#dc2626';
  const secondaryColor = isBlue ? '#1e3a8a' : '#991b1b';
  const accentColor = isBlue ? '#38bdf8' : '#f87171';
  const darkChassis = '#0f172a';
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

    // ── MASSIVE DENSE STEAM BLOW-OFF ANIMATION ──
    const isBigSteam = signalsGreenCount === 3 || trainAnim.whistleActive;
    const steamSpeed = isBigSteam ? 0.0028 : 0.0018;

    steamPuffsRef.current.forEach((puff, i) => {
      if (puff) {
        if (trainAnim.smokeActive || isMoving || isBigSteam) {
          puff.visible = true;
          const timeOffset = (Date.now() * steamSpeed + i * 0.22) % 1.8;
          const heightMultiplier = isBigSteam ? 2.4 : 1.2;
          const driftMultiplier = isBigSteam ? 0.35 : 0.15;
          const driftX = Math.sin(Date.now() * 0.003 + i) * driftMultiplier;

          puff.position.x = driftX;
          puff.position.y = 1.35 + timeOffset * heightMultiplier;
          puff.position.z = 0.75 - (isMoving ? timeOffset * 0.9 : 0);

          // Steam plume expands dynamically as it ascends
          const baseScale = isBigSteam ? 0.32 : 0.14;
          const s = baseScale + timeOffset * (isBigSteam ? 0.55 : 0.25);
          puff.scale.set(s, s, s);

          const maxOpacity = isBigSteam ? 0.88 : 0.65;
          (puff.material as THREE.MeshStandardMaterial).opacity = Math.max(
            0,
            maxOpacity - (timeOffset / 1.8) * maxOpacity
          );
        } else {
          puff.visible = false;
        }
      }
    });

    if (whistleSteamRef.current) {
      whistleSteamRef.current.visible = trainAnim.whistleActive || isBigSteam;
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

  // Filter passengers belonging specifically to THIS team's train!
  const teamPassengers = onboardPassengers.filter((p) => p.team === team);

  return (
    <group>
      {/* ========================================================= */}
      {/* ── 1. LOCOMOTIVE ENGINE WITH 3D DRIVER IN CABIN ── */}
      {/* ========================================================= */}
      <group ref={locoGroupRef} scale={[0.85, 0.85, 0.85]}>
        {/* Main Boiler */}
        <mesh position={[0, 0.62, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 1.3, 24]} />
          <meshStandardMaterial color={primaryColor} roughness={0.3} metalness={0.25} />
        </mesh>

        {/* Brass Boiler Straps */}
        {[-0.1, 0.35, 0.8].map((zPos, bi) => (
          <mesh key={`boiler-strap-${bi}`} position={[0, 0.62, zPos]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.385, 0.385, 0.04, 24]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Boiler Front Cap with Accent Color */}
        <mesh position={[0, 0.62, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.39, 0.39, 0.08, 24]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.62, 1.09]}>
          <sphereGeometry args={[0.37, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.3} />
        </mesh>

        {/* Front Cowcatcher / Pilot Grill */}
        <group position={[0, 0.16, 1.18]}>
          <mesh rotation={[Math.PI / 6, 0, 0]}>
            <boxGeometry args={[0.82, 0.22, 0.18]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.06, 0.06]}>
            <boxGeometry args={[0.76, 0.04, 0.08]} />
            <meshStandardMaterial color={trimColor} metalness={0.7} roughness={0.2} />
          </mesh>
        </group>

        {/* Front Headlamp */}
        <group position={[0, 0.68, 1.3]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.14, 0.14, 16]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <sphereGeometry args={[0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Steam Dome & Sand Dome on Top */}
        <group position={[0, 1.02, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.14, 0.18, 16]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <sphereGeometry args={[0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Smokestack with Brass Crown */}
        <group position={[0, 1.02, 0.75]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.11, 0.48, 16]} />
            <meshStandardMaterial color={darkChassis} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <torusGeometry args={[0.18, 0.035, 8, 16]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* ── MULTI-LAYERED VOLUMETRIC STEAM PUFFS (BIGGER AMOUNT) ── */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <mesh
            key={`steam-puff-${i}`}
            ref={(el) => { if (el) steamPuffsRef.current[i] = el; }}
            position={[0, 1.4, 0.75]}
            visible={false}
          >
            <sphereGeometry args={[0.18, 14, 14]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={0.1} />
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
            <meshStandardMaterial color={secondaryColor} roughness={0.25} />
          </mesh>
          {/* Side Windows */}
          {[-0.45, 0.45].map((x, i) => (
            <mesh key={i} position={[x, 0.06, 0]}>
              <boxGeometry args={[0.02, 0.36, 0.4]} />
              <meshStandardMaterial color="#7dd3fc" roughness={0.1} transparent opacity={0.75} />
            </mesh>
          ))}

          {/* Team Nameplate Banner on Cabin */}
          {[-0.45, 0.45].map((x, i) => (
            <mesh key={`plate-${i}`} position={[x, -0.22, 0]}>
              <boxGeometry args={[0.025, 0.12, 0.55]} />
              <meshStandardMaterial color={trimColor} metalness={0.7} roughness={0.3} />
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
          <meshStandardMaterial color={darkChassis} roughness={0.6} />
        </mesh>

        {/* Large Drive Wheels in Team Color */}
        {[-0.47, 0.47].map((x, i) => (
          <group key={`rear-w-${i}`} position={[x, 0.24, -0.3]}>
            <mesh
              ref={(el) => { if (el) wheelsRef.current.push(el); }}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
              <meshStandardMaterial color={primaryColor} roughness={0.3} />
            </mesh>
            {/* Wheel Rim */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.26, 0.02, 8, 16]} />
              <meshStandardMaterial color={trimColor} metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Front Guide Wheels in Team Color */}
        {[-0.47, 0.47].map((x, i) => (
          <group key={`front-w-${i}`} position={[x, 0.18, 0.55]}>
            <mesh
              ref={(el) => { if (el) wheelsRef.current.push(el); }}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
              <meshStandardMaterial color={primaryColor} roughness={0.3} />
            </mesh>
            {/* Wheel Rim */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.18, 0.02, 8, 16]} />
              <meshStandardMaterial color={trimColor} metalness={0.8} />
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
      {/* ── 2. CARRIAGE 1: TEAM SUPPLY FLATBED ── */}
      {/* ========================================================= */}
      <group ref={flatbedGroupRef} scale={[0.85, 0.85, 0.85]}>
        {/* Bed Frame in Team Secondary Color */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.82, 0.1, 1.8]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.5} />
        </mesh>
        {[-0.4, 0.4].map((x, i) => (
          <mesh key={i} position={[x, 0.3, 0]}>
            <boxGeometry args={[0.03, 0.14, 1.76]} />
            <meshStandardMaterial color={trimColor} metalness={0.6} roughness={0.3} />
          </mesh>
        ))}

        {/* Wheels */}
        {[-0.44, 0.44].map((x, xi) => (
          <group key={`fb-w-${xi}`}>
            {[-0.55, 0.55].map((z, zi) => (
              <mesh key={`w-${zi}`} position={[x, 0.16, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 0.06, 14]} />
                <meshStandardMaterial color={darkChassis} roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Team Vehicle 1: Front Sports Car */}
        <group position={[0, 0.28, 0.4]} scale={[0.55, 0.55, 0.55]}>
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[0.62, 0.18, 1.05]} />
            <meshStandardMaterial color={primaryColor} roughness={0.2} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.3, -0.05]}>
            <boxGeometry args={[0.48, 0.18, 0.55]} />
            <meshStandardMaterial color={accentColor} roughness={0.1} />
          </mesh>
        </group>

        {/* Team Vehicle 2: Rear Utility Hauler */}
        <group position={[0, 0.28, -0.4]} scale={[0.55, 0.55, 0.55]}>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.64, 0.22, 1.1]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.35, 0.18]}>
            <boxGeometry args={[0.55, 0.22, 0.45]} />
            <meshStandardMaterial color="#fef08a" roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* ── 3. CARRIAGE 2: TEAM CARGO BOX WAGON ── */}
      {/* ========================================================= */}
      <group ref={cargoGroupRef} scale={[0.85, 0.85, 0.85]}>
        {/* Wagon Walls in Team Primary Color */}
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.82, 0.34, 1.8]} />
          <meshStandardMaterial color={primaryColor} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.86, 0.04, 1.84]} />
          <meshStandardMaterial color={trimColor} metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Wheels */}
        {[-0.44, 0.44].map((x, xi) => (
          <group key={`cg-w-${xi}`}>
            {[-0.55, 0.55].map((z, zi) => (
              <mesh key={`w-${zi}`} position={[x, 0.16, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 0.06, 14]} />
                <meshStandardMaterial color={darkChassis} roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Team Supply Cargo Crates inside Wagon */}
        <group position={[0, 0.46, 0]}>
          {[-0.22, 0.22].map((x, ci) => (
            <mesh key={`crate-${ci}`} position={[x, 0.12, -0.2]}>
              <boxGeometry args={[0.3, 0.24, 0.5]} />
              <meshStandardMaterial color={secondaryColor} roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 0.14, 0.38]}>
            <boxGeometry args={[0.55, 0.28, 0.55]} />
            <meshStandardMaterial color={accentColor} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* ── 4. CARRIAGE 3: TEAM PASSENGER EXPRESS COACH ── */}
      {/* ========================================================= */}
      <group ref={coachGroupRef} scale={[0.85, 0.85, 0.85]}>
        {/* Coach Body Shell in Team Primary Color */}
        <mesh position={[0, 0.58, 0]}>
          <boxGeometry args={[0.84, 0.65, 1.8]} />
          <meshStandardMaterial color={primaryColor} roughness={0.3} />
        </mesh>
        {/* Roof Cap in Team Secondary with Trim */}
        <mesh position={[0, 0.94, 0]}>
          <boxGeometry args={[0.88, 0.08, 1.88]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.25} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.98, 0]}>
          <boxGeometry args={[0.6, 0.04, 1.6]} />
          <meshStandardMaterial color={trimColor} metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Wheels */}
        {[-0.44, 0.44].map((x, xi) => (
          <group key={`ch-w-${xi}`}>
            {[-0.55, 0.55].map((z, zi) => (
              <mesh key={`w-${zi}`} position={[x, 0.16, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 0.06, 14]} />
                <meshStandardMaterial color={primaryColor} roughness={0.4} />
              </mesh>
            ))}
          </group>
        ))}

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

        {/* ── ONLY THIS TEAM'S PASSENGERS SEATED INSIDE COACH FLOOR ── */}
        <group position={[0, 0.28, 0]}>
          {teamPassengers.map((pass, idx) => {
            const seat = seatPositions[idx % seatPositions.length];
            return (
              <SeatedPassenger
                key={pass.id}
                position={seat}
                team={team}
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
