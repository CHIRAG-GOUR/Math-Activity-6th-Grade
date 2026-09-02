// ============================================================
// THE GREAT NUMBER RAILWAY — Team Locomotive & Rolling Stock
// Two liveried trains (Blue = LEFT spur, Red = RIGHT spur) that idle at
// their starting positions and depart along their own route curve when
// their team wins the Railway Showdown.
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRailwayStore } from '../store/railwayStore';
import { TeamId } from '../types';

// ── Realistic Human Figure Helper (shared with the station platform) ──
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

// ── Team livery palette ──
interface Livery {
  primary: string;
  dark: string;
  cabin: string;
  seat: string;
}
const LIVERY: Record<TeamId, Livery> = {
  blue: { primary: '#2563eb', dark: '#1d4ed8', cabin: '#1e40af', seat: '#1e3a8a' },
  red: { primary: '#dc2626', dark: '#b91c1c', cabin: '#991b1b', seat: '#7f1d1d' },
};

interface TeamTrainProps {
  team: TeamId;
  route: [number, number, number][];
}

export const TeamTrain: React.FC<TeamTrainProps> = ({ team, route }) => {
  const locoRef = useRef<THREE.Group>(null);
  const coach1Ref = useRef<THREE.Group>(null);
  const coach2Ref = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const rodRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Mesh[]>([]);
  const whistleRef = useRef<THREE.Mesh>(null);
  const headlampRef = useRef<THREE.Mesh>(null);

  const L = LIVERY[team];

  const curve = useMemo(() => {
    const pts = route.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  }, [route]);
  const curveLen = useMemo(() => curve.getLength(), [curve]);

  const coach1Off = 2.15 / curveLen;
  const coach2Off = 4.0 / curveLen;

  useFrame((_, delta) => {
    const t = useRailwayStore.getState();
    const anim = team === 'blue' ? t.blueTrain : t.redTrain;
    const moving = anim.state === 'departing' || anim.state === 'moving' || anim.state === 'approaching';
    const base = anim.progress;

    const place = (ref: React.RefObject<THREE.Group | null>, off: number) => {
      if (!ref.current) return;
      const tt = Math.min(Math.max(base - off, 0.0001), 0.9999);
      const pos = curve.getPointAt(tt);
      const tan = curve.getTangentAt(tt);
      ref.current.position.set(pos.x, pos.y + 0.12, pos.z);
      ref.current.rotation.y = Math.atan2(tan.x, tan.z);
      ref.current.rotation.z = moving ? Math.sin(Date.now() * 0.008 + off * 12) * 0.02 : 0;
    };
    place(locoRef, 0);
    place(coach1Ref, coach1Off);
    place(coach2Ref, coach2Off);

    const wheelSpeed = (moving ? anim.speed * 20 : 0) * delta;
    wheelsRef.current.forEach((w) => { if (w) w.rotation.x -= wheelSpeed; });

    if (rodRef.current) {
      rodRef.current.position.y = 0.2 + Math.sin(Date.now() * 0.015) * (moving ? 0.045 : 0);
      rodRef.current.position.z = 0.1 + Math.cos(Date.now() * 0.015) * (moving ? 0.06 : 0);
    }

    steamRef.current.forEach((puff, i) => {
      if (!puff) return;
      if (anim.smokeActive || moving) {
        puff.visible = true;
        const o = (Date.now() * 0.002 + i * 0.35) % 1.5;
        puff.position.y = 1.35 + o * 1.3;
        puff.position.z = 0.65 - (moving ? o * 0.9 : 0);
        const s = 0.12 + o * 0.28;
        puff.scale.set(s, s, s);
        (puff.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.7 - o * 0.5);
      } else {
        puff.visible = false;
      }
    });

    if (whistleRef.current) {
      whistleRef.current.visible = anim.whistleActive;
      if (whistleRef.current.visible) whistleRef.current.scale.setScalar(0.08 + Math.sin(Date.now() * 0.02) * 0.04);
    }
    if (headlampRef.current) {
      const m = headlampRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = anim.headlampOn ? 2.6 : 0.15;
    }
  });

  return (
    <group>
      {/* ── LOCOMOTIVE ── */}
      <group ref={locoRef} scale={[0.8, 0.8, 0.8]}>
        {/* Boiler */}
        <mesh position={[0, 0.62, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 1.3, 24]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Boiler cap in team colour */}
        <mesh position={[0, 0.62, 1.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.08, 24]} />
          <meshStandardMaterial color={L.primary} roughness={0.3} />
        </mesh>
        {/* Headlamp */}
        <mesh ref={headlampRef} position={[0, 0.72, 1.12]}>
          <cylinderGeometry args={[0.11, 0.13, 0.12, 16]} />
          <meshStandardMaterial color="#fffbeb" emissive="#fde68a" emissiveIntensity={0.15} roughness={0.2} />
        </mesh>
        {/* Gold bands */}
        {[0.0, 0.45, 0.85].map((z, i) => (
          <mesh key={i} position={[0, 0.62, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.395, 0.02, 8, 24]} />
            <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Smokestack */}
        <group position={[0, 1.02, 0.72]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.11, 0.48, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <torusGeometry args={[0.18, 0.035, 8, 16]} />
            <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
        {/* Steam dome & whistle */}
        <mesh position={[0, 1.05, 0.18]}>
          <sphereGeometry args={[0.15, 16, 12]} />
          <meshStandardMaterial color="#facc15" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh ref={whistleRef} position={[0.12, 1.25, -0.06]} visible={false}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
        {/* Steam puffs */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} ref={(el) => { if (el) steamRef.current[i] = el; }} position={[0, 1.4, 0.72]} visible={false}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#f8fafc" transparent opacity={0.7} roughness={0.1} />
          </mesh>
        ))}
        {/* Cow-catcher */}
        <group position={[0, 0.15, 1.28]}>
          <mesh position={[0, 0.05, 0.15]} rotation={[0.45, 0, 0]}>
            <boxGeometry args={[0.82, 0.12, 0.42]} />
            <meshStandardMaterial color={L.dark} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.02, 0.32]}>
            <boxGeometry args={[0.84, 0.06, 0.08]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} />
          </mesh>
        </group>
        {/* Cabin with gold roof + driver */}
        <group position={[0, 0.85, -0.62]}>
          <mesh>
            <boxGeometry args={[0.88, 0.88, 0.78]} />
            <meshStandardMaterial color={L.cabin} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.52, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.48, 0.48, 0.88, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#facc15" roughness={0.25} metalness={0.2} />
          </mesh>
          {[-0.45, 0.45].map((x, i) => (
            <mesh key={i} position={[x, 0.06, 0]}>
              <boxGeometry args={[0.02, 0.4, 0.44]} />
              <meshStandardMaterial color="#7dd3fc" roughness={0.1} transparent opacity={0.8} />
            </mesh>
          ))}
          <group position={[0.12, -0.15, 0]}>
            <HumanFigure position={[0, 0, 0]} scale={0.9} shirtColor={L.seat} pantsColor="#0f172a" hasCap isSeated />
          </group>
        </group>
        {/* Chassis */}
        <mesh position={[0, 0.2, 0.12]}>
          <boxGeometry args={[0.88, 0.14, 2.3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* Driving wheels */}
        {[-0.47, 0.47].map((x, i) => (
          <group key={`rw-${i}`} position={[x, 0.24, -0.3]}>
            <mesh ref={(el) => { if (el) wheelsRef.current[i] = el; }} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
              <meshStandardMaterial color={L.primary} roughness={0.3} />
            </mesh>
            <mesh position={[x > 0 ? 0.05 : -0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.09, 0.09, 0.03, 12]} />
              <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {[-0.47, 0.47].map((x, i) => (
          <group key={`fw-${i}`} position={[x, 0.18, 0.55]}>
            <mesh ref={(el) => { if (el) wheelsRef.current[i + 2] = el; }} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
              <meshStandardMaterial color={L.primary} roughness={0.3} />
            </mesh>
          </group>
        ))}
        {/* Connecting rod */}
        <group ref={rodRef} position={[-0.52, 0.2, 0.12]}>
          <mesh>
            <boxGeometry args={[0.03, 0.04, 0.95]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ── COACH 1 ── */}
      <group ref={coach1Ref} scale={[0.8, 0.8, 0.8]}>
        <mesh position={[0, 0.58, 0]}>
          <boxGeometry args={[0.84, 0.65, 1.8]} />
          <meshStandardMaterial color={L.dark} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.94, 0]}>
          <boxGeometry args={[0.88, 0.08, 1.88]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
        </mesh>
        {[-0.43, 0.43].map((x, si) => (
          <group key={`c1-side-${si}`}>
            {[-0.55, 0, 0.55].map((z, wi) => (
              <group key={`c1-w-${wi}`} position={[x, 0.62, z]}>
                <mesh>
                  <boxGeometry args={[0.02, 0.32, 0.32]} />
                  <meshStandardMaterial color="#fef08a" emissive="#eab308" emissiveIntensity={0.7} roughness={0.1} transparent opacity={0.9} />
                </mesh>
                <group position={[x > 0 ? -0.15 : 0.15, 0.4, 0]}>
                  <HumanFigure position={[0, 0, 0]} scale={0.7} shirtColor={wi === 0 ? '#2563eb' : wi === 1 ? '#16a34a' : '#ea580c'} pantsColor="#1e293b" isSeated />
                </group>
              </group>
            ))}
          </group>
        ))}
        {[-0.44, 0.44].map((x, i) => (
          <group key={`c1-wheels-${i}`}>
            <mesh ref={(el) => { if (el) wheelsRef.current[i + 4] = el; }} position={[x, 0.15, 0.45]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
            <mesh ref={(el) => { if (el) wheelsRef.current[i + 6] = el; }} position={[x, 0.15, -0.45]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── COACH 2 ── */}
      <group ref={coach2Ref} scale={[0.8, 0.8, 0.8]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.82, 0.58, 1.7]} />
          <meshStandardMaterial color={L.primary} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.87, 0]}>
          <boxGeometry args={[0.86, 0.08, 1.78]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
        </mesh>
        {[-0.42, 0.42].map((x, si) => (
          <group key={`c2-side-${si}`}>
            {[-0.5, 0.1].map((z, wi) => (
              <mesh key={`c2-w-${wi}`} position={[x, 0.58, z]}>
                <boxGeometry args={[0.02, 0.28, 0.34]} />
                <meshStandardMaterial color="#fef08a" emissive="#eab308" emissiveIntensity={0.6} roughness={0.1} transparent opacity={0.9} />
              </mesh>
            ))}
          </group>
        ))}
        {[-0.44, 0.44].map((x, i) => (
          <group key={`c2-wheels-${i}`}>
            <mesh ref={(el) => { if (el) wheelsRef.current[i + 8] = el; }} position={[x, 0.15, 0.42]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
            <mesh ref={(el) => { if (el) wheelsRef.current[i + 10] = el; }} position={[x, 0.15, -0.42]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.15, 0.15, 0.06, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
