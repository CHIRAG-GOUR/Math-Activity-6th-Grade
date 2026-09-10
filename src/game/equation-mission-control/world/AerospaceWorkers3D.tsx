// ============================================================
// EQUATION MISSION CONTROL 2.0 — Highly Active 3D Aerospace Workers
// Authentic Aerospace Technicians & Real 3D Workstations:
// - Dynamic 3D Laptop Telemetry Screen (Live Step 1/5 -> 5/5 status updates)
// - Dual Glowing LCD Telemetry Monitors
// - Active Aerospace Welders with Electrical Sparks & Torches (Q1-Q3 active, stops & evacuates on Q3+)
// - Detailed Anatomy (Head, Hard Hat, Comms Headset, Hi-Vis Vest, Utility Belt, Boots)
// - Dedicated Jobs:
//     1. Flight Directors: Two-handed keyboard typing, sipping coffee, checking screens
//     2. Welding Technicians: Holding welding torch with blue electric arc & flickering sparks
//     3. Cryo Propellant Specialists: Valve adjustments & manifold pressure checks
//     4. Propulsion Specialists: Laser scanner sweeping across engine bells
//     5. Safety & Comms Marshalls: Glowing wands & radio coordination
//     6. Roving Field Inspection Officer: 15s inspection & logbook routine
// - Pad Evacuation to Perimeter Safety Line (Z >= 12)
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TeamId, LaunchStep } from '../types';

// Real-Time Dynamic 3D Laptop Screen Texture
const LaptopScreenCanvasDecal: React.FC<{
  team: TeamId;
  stagesCleared: number;
  isCorrectPulse?: boolean;
}> = ({ team, stagesCleared, isCorrectPulse = false }) => {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const isBlue = team === 'blue';
    const primaryBg = '#020617';
    const accentColor = isBlue ? '#38bdf8' : '#f87171';
    const headerColor = isBlue ? '#1d4ed8' : '#b91c1c';

    // Base background
    ctx.fillStyle = primaryBg;
    ctx.fillRect(0, 0, 512, 340);

    // Subtle HUD grid
    ctx.strokeStyle = isBlue ? 'rgba(56, 189, 248, 0.15)' : 'rgba(248, 113, 113, 0.15)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 512; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 340);
      ctx.stroke();
    }
    for (let y = 0; y < 340; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Top Header Banner
    ctx.fillStyle = headerColor;
    ctx.fillRect(0, 0, 512, 52);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🚀 ${isBlue ? 'BLUE' : 'RED'} WORKSTATION [${stagesCleared}/5]`, 18, 35);

    // Stage Step Details
    const STAGE_TITLES = [
      { main: 'SYSTEM IDLE', sub: 'AWAITING MISSION TELEMETRY...' },
      { main: 'STAGE 1: AVIONICS ONLINE', sub: 'HUD & FLIGHT COMPUTER SYNCED' },
      { main: 'STAGE 2: CRYO FUEL 100%', sub: 'LOX UMBILICALS LOCKED & FULL' },
      { main: 'STAGE 3: PROPULSION LOCKED', sub: 'WELDING COMPLETE • CLEAR PAD' },
      { main: 'STAGE 4: BRAKES RELEASED', sub: '🟢 GREEN SIGNAL GO FOR LIFTOFF' },
      { main: 'STAGE 5: LAUNCH READY', sub: '🚀 100% THRUST LIFTOFF ACTIVE' },
    ];
    const info = STAGE_TITLES[Math.min(5, Math.max(0, stagesCleared))];

    // Status Title
    ctx.fillStyle = isCorrectPulse ? '#4ade80' : accentColor;
    ctx.font = '900 24px sans-serif';
    ctx.fillText(info.main, 18, 98);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '700 16px sans-serif';
    ctx.fillText(info.sub, 18, 132);

    // 5 Segmented Stage Blocks
    for (let i = 0; i < 5; i++) {
      const bx = 18 + i * 95;
      const by = 165;
      const bw = 86;
      const bh = 42;
      const isFilled = i < stagesCleared;

      ctx.fillStyle = isFilled ? (isBlue ? '#0284c7' : '#dc2626') : '#1e293b';
      ctx.fillRect(bx, by, bw, bh);

      ctx.strokeStyle = isFilled ? (isBlue ? '#38bdf8' : '#f87171') : '#475569';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = isFilled ? '#ffffff' : '#64748b';
      ctx.font = '900 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`S0${i + 1}`, bx + bw / 2, by + 28);
    }

    // Telemetry Footer
    ctx.fillStyle = isBlue ? '#38bdf8' : '#f87171';
    ctx.textAlign = 'left';
    ctx.font = '800 15px sans-serif';
    const sigText = stagesCleared >= 4 ? '🟢 GREEN SIGNAL GO' : '🟡 STANDBY SIGNAL';
    const weldText = stagesCleared >= 3 ? 'WELDING: DONE' : 'WELDING: ACTIVE';
    ctx.fillText(`${sigText}  |  ${weldText}`, 18, 250);

    // Live wave telemetry
    ctx.strokeStyle = isBlue ? '#00f0ff' : '#ff4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 18; x < 490; x += 6) {
      const y = 300 + Math.sin(x * 0.08 + stagesCleared) * 12;
      if (x === 18) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Highlight border
    ctx.lineWidth = 8;
    ctx.strokeStyle = isCorrectPulse ? '#22c55e' : (isBlue ? '#2563eb' : '#dc2626');
    ctx.strokeRect(4, 4, 504, 332);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [team, stagesCleared, isCorrectPulse]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, 0.012]}>
      <planeGeometry args={[0.29, 0.19]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

// Physical 3D Engineering Workstation Desk
export const WorkstationDesk3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  team: TeamId;
  stagesCleared?: number;
  isCorrectPulse?: boolean;
}> = ({ position, rotationY = 0, team, stagesCleared = 0, isCorrectPulse = false }) => {
  const isBlue = team === 'blue';
  const monitorGlow = isBlue ? '#38bdf8' : '#f87171';
  const screenColor = isBlue ? '#0369a1' : '#991b1b';

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* ── DESK BASE FRAME ── */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.08, 0.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Steel Table Legs */}
      {[-0.65, 0.65].map((x) =>
        [-0.32, 0.32].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.46, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.92, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        ))
      )}

      {/* ── DUAL GLOWING LCD TELEMETRY MONITORS ── */}
      {/* Left Monitor */}
      <group position={[-0.35, 1.32, -0.18]} rotation={[0, 0.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.42, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.024]}>
          <boxGeometry args={[0.5, 0.36, 0.01]} />
          <meshStandardMaterial
            color={screenColor}
            emissive={monitorGlow}
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Right Monitor */}
      <group position={[0.35, 1.32, -0.18]} rotation={[0, -0.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.42, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.024]}>
          <boxGeometry args={[0.5, 0.36, 0.01]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive={stagesCleared >= 4 ? '#22c55e' : '#f59e0b'}
            emissiveIntensity={0.7}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* ── OPEN FIELD LAPTOP WITH DYNAMIC REAL-TIME TELEMETRY ── */}
      <group position={[0, 1.02, 0.12]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.02, 0.24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <group position={[0, 0.1, -0.11]} rotation={[-0.4, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.22, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <LaptopScreenCanvasDecal
            team={team}
            stagesCleared={stagesCleared}
            isCorrectPulse={isCorrectPulse}
          />
        </group>
      </group>

      {/* Ceramic Coffee Mug */}
      <mesh position={[-0.55, 1.04, 0.18]} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.09, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
    </group>
  );
};

// Cryogenic Fuel Manifold Junction Stand for Pad Technicians
const CryoManifoldStand: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh position={[0, 0.4, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.08, 0.8, 10]} />
      <meshStandardMaterial color="#475569" metalness={0.7} />
    </mesh>
    <mesh position={[0, 0.82, 0]} castShadow>
      <boxGeometry args={[0.28, 0.24, 0.2]} />
      <meshStandardMaterial color="#1e293b" metalness={0.8} />
    </mesh>
    <group position={[0, 0.82, 0.12]} rotation={[1.57, 0, 0]}>
      <mesh castShadow>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>
    </group>
    <group position={[0, 0.98, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[-1.57, 0, 0]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  </group>
);

interface CharacterProps {
  initialPos: [number, number, number];
  rotationY?: number;
  team: TeamId;
  job: 'flight-director' | 'fuel-tech' | 'engine-scan' | 'comms-marshall' | 'tank-tech' | 'welder';
  isEvacuated: boolean;
  isCheering: boolean;
  isCentralOperator?: boolean;
}

const AerospaceCharacter: React.FC<CharacterProps> = ({
  initialPos,
  rotationY = 0,
  team,
  job,
  isEvacuated,
  isCheering,
  isCentralOperator = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);
  const sparkRef = useRef<THREE.Group>(null);
  const weldLightRef = useRef<THREE.PointLight>(null);

  const isBlue = team === 'blue';
  const teamAccent = isBlue ? '#2563eb' : '#dc2626';

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // 1. Evacuation Movement to Perimeter Safety Line (Z >= 12)
    if (isEvacuated) {
      const targetZ = 12.0 + Math.abs(initialPos[0] * 0.15);
      const targetX = initialPos[0] * 1.35;
      const targetY = 0;

      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        delta * 2.5
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        delta * 2.5
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        delta * 2.5
      );

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0,
        delta * 3.0
      );

      // Hide welding sparks immediately when evacuated
      if (sparkRef.current) sparkRef.current.visible = false;
      if (weldLightRef.current) weldLightRef.current.intensity = 0;

      const distToPad = Math.abs(groupRef.current.position.z - initialPos[2]);
      if (distToPad > 4.5) {
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = 2.4 + Math.sin(time * 9) * 0.3;
          leftArmRef.current.rotation.x = -0.4;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = -2.4 - Math.sin(time * 9) * 0.3;
          rightArmRef.current.rotation.x = -0.4;
        }
        if (headRef.current) {
          headRef.current.rotation.x = -0.45;
          headRef.current.rotation.y = 0;
        }
      } else {
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = Math.sin(time * 12) * 0.55;
          rightLegRef.current.rotation.x = -Math.sin(time * 12) * 0.55;
        }
      }
      return;
    }

    // 2. Stage Celebration Cheer
    if (isCheering) {
      if (leftArmRef.current)
        leftArmRef.current.rotation.z = 2.4 + Math.sin(time * 10) * 0.25;
      if (rightArmRef.current)
        rightArmRef.current.rotation.z = -2.4 - Math.sin(time * 10) * 0.25;
      if (headRef.current) headRef.current.rotation.x = -0.3;
      return;
    }

    // 3. Central Operator Focus
    if (isCentralOperator) {
      if (headRef.current) {
        headRef.current.rotation.x = 0.38 + Math.sin(time * 2) * 0.04;
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.06;
      }
    }

    // 4. Role-Specific Animations

    // ── ROLE: WELDER TECHNICIAN (Active welding torch & electric arc sparks during Q1-Q3) ──
    if (job === 'welder') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.45 + Math.sin(time * 4) * 0.08;
        rightArmRef.current.rotation.y = (isBlue ? -0.25 : 0.25) + Math.cos(time * 3) * 0.1;
        rightArmRef.current.rotation.z = isBlue ? 0.15 : -0.15;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.3;
        leftArmRef.current.rotation.y = isBlue ? 0.35 : -0.35;
      }
      if (headRef.current) {
        headRef.current.rotation.x = 0.32 + Math.sin(time * 2) * 0.05;
        headRef.current.rotation.y = isBlue ? 0.1 : -0.1;
      }

      // Flickering electric arc light
      if (weldLightRef.current) {
        const flicker =
          2.4 +
          Math.sin(time * 45) * 1.5 +
          (Math.sin(time * 110) > 0 ? 1.2 : -0.6);
        weldLightRef.current.intensity = Math.max(0.4, flicker);
      }

      // Pulsing Spark Particles
      if (sparkRef.current) {
        sparkRef.current.visible = true;
        sparkRef.current.scale.set(
          1 + Math.sin(time * 30) * 0.3,
          1 + Math.cos(time * 25) * 0.3,
          1 + Math.sin(time * 30) * 0.3
        );
      }
    }

    // ── ROLE: FLIGHT DIRECTOR (Facing computer desk, looking down at screen & typing) ──
    else if (job === 'flight-director') {
      // Rapid active keyboard typing & telemetry data entry
      const typePhase = (time * 14 + (isBlue ? 0 : 3.5)) % (Math.PI * 2);
      const shiftPhase = (time * 0.8) % 6.0;

      if (shiftPhase < 4.5) {
        // Fast dual-hand typing on laptop keyboard
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.22 + Math.sin(typePhase) * 0.04;
          rightArmRef.current.rotation.y = -0.16;
          rightArmRef.current.rotation.z = 0.05;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.22 + Math.cos(typePhase) * 0.04;
          leftArmRef.current.rotation.y = 0.16;
          leftArmRef.current.rotation.z = -0.05;
        }
        if (headRef.current) {
          // Head tilted down toward laptop screen and monitors
          headRef.current.rotation.x = 0.38 + Math.sin(time * 2) * 0.03;
          headRef.current.rotation.y = Math.sin(time * 1.5) * 0.08;
        }
      } else {
        // Right hand moves to trackpad / auxiliary controls, left hand stays on keys
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.18 + Math.sin(time * 6) * 0.03;
          rightArmRef.current.rotation.y = -0.28;
          rightArmRef.current.rotation.z = 0.08;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.25;
          leftArmRef.current.rotation.y = 0.14;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.35;
          headRef.current.rotation.y = 0.12;
        }
      }
    }

    // ── ROLE: CRYO PROPELLANT SPECIALIST ──
    else if (job === 'fuel-tech') {
      const cycleTime = (time + (isBlue ? 0 : 3.0)) % 6.0;

      if (cycleTime < 2.5) {
        groupRef.current.position.y = initialPos[1] - 0.05;
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.25;
          rightArmRef.current.rotation.y = -0.3;
          rightArmRef.current.rotation.z = Math.sin(time * 8) * 0.35;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.9;
          leftArmRef.current.rotation.y = 0.35;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.35;
          headRef.current.rotation.y = 0.1;
        }
      } else if (cycleTime < 4.5) {
        groupRef.current.position.y = initialPos[1];
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.25;
          leftArmRef.current.rotation.y = 0.3;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.15 + Math.sin(time * 6) * 0.1;
          rightArmRef.current.rotation.y = -0.35;
          rightArmRef.current.rotation.z = 0;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.32;
          headRef.current.rotation.y = 0.1;
        }
      } else {
        groupRef.current.position.y = initialPos[1];
        if (headRef.current) {
          headRef.current.rotation.x = -0.42;
          headRef.current.rotation.y = Math.sin(time * 2) * 0.15;
        }
      }
    }

    // ── ROLE: ENGINE SCANNER ──
    else if (job === 'engine-scan') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.35 + Math.sin(time * 2.4) * 0.22;
        rightArmRef.current.rotation.y = Math.sin(time * 1.8) * 0.32;
        rightArmRef.current.rotation.z = 0.2;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.28 + Math.sin(time * 2.4) * 0.15;
        headRef.current.rotation.y = Math.sin(time * 1.8) * 0.28;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.8;
        leftArmRef.current.rotation.y = 0.2;
      }
      if (laserBeamRef.current) {
        laserBeamRef.current.scale.set(
          1 + Math.sin(time * 12) * 0.15,
          1,
          1 + Math.cos(time * 12) * 0.15
        );
      }
    }

    // ── ROLE: COMMS MARSHALL ──
    else if (job === 'comms-marshall') {
      const cycleTime = (time + (isBlue ? 0 : 3.5)) % 7.0;

      if (cycleTime < 3.5) {
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = 1.4 + Math.sin(time * 3.2) * 0.45;
          leftArmRef.current.rotation.x = -0.4 + Math.cos(time * 3.2) * 0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = -1.4 - Math.sin(time * 3.2) * 0.45;
          rightArmRef.current.rotation.x = -0.4 + Math.cos(time * 3.2) * 0.2;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(time * 2.0) * 0.2;
          headRef.current.rotation.x = 0;
        }
      } else {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.5;
          rightArmRef.current.rotation.y = -0.2;
        }
      }
    }

    // ── ROLE: TANK TECH ──
    else if (job === 'tank-tech') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.35;
        rightArmRef.current.rotation.z = Math.sin(time * 6) * 0.4;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.2;
        leftArmRef.current.rotation.y = 0.3;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.2;
        headRef.current.rotation.y = 0.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={initialPos} rotation={[0, rotationY, 0]}>
      {/* ── PELVIS & WORK TROUSERS ── */}
      <mesh position={[0, 0.76, 0]} castShadow>
        <boxGeometry args={[0.38, 0.22, 0.25]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.11, 0.66, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.62, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.66, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.15, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.11, 0.66, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.62, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.66, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.15, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* ── TORSO & HI-VIS VEST ── */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.44, 0.6, 0.28]} />
        <meshStandardMaterial color={job === 'welder' ? '#475569' : '#ea580c'} roughness={0.45} />
      </mesh>
      {/* Reflective Fluorescent Yellow Stripes */}
      <mesh position={[0, 1.28, 0.15]}>
        <boxGeometry args={[0.4, 0.06, 0.02]} />
        <meshStandardMaterial color="#fde047" emissive="#fef08a" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[0, 1.04, 0.15]}>
        <boxGeometry args={[0.4, 0.06, 0.02]} />
        <meshStandardMaterial color="#fde047" emissive="#fef08a" emissiveIntensity={0.65} />
      </mesh>

      {/* Utility Tool Belt */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[0.46, 0.08, 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* ── HEAD & HARD HAT / WELDING MASK ── */}
      <group ref={headRef} position={[0, 1.62, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 0.12, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {job === 'welder' ? (
          /* Heavy Aerospace Welding Helmet & Dark Visor */
          <group position={[0, 0.05, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.34, 0.36, 0.34]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Dark Tinted Protective Welding Glass Window */}
            <mesh position={[0, 0.02, 0.175]}>
              <boxGeometry args={[0.18, 0.1, 0.01]} />
              <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ) : (
          /* Standard Safety Hard Hat */
          <>
            <mesh position={[0, 0.09, 0]} castShadow>
              <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.08, 0.04]} rotation={[0.15, 0, 0]}>
              <cylinderGeometry args={[0.21, 0.21, 0.03, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.17, 0]}>
              <boxGeometry args={[0.08, 0.04, 0.34]} />
              <meshStandardMaterial color={teamAccent} />
            </mesh>
            <mesh position={[-0.18, 0.02, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </>
        )}
      </group>

      {/* ── LEFT ARM ── */}
      <group ref={leftArmRef} position={[-0.28, 1.42, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.32, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.28, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[0.09, 0.11, 0.09]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
      </group>

      {/* ── RIGHT ARM WITH JOB EQUIPMENT ── */}
      <group ref={rightArmRef} position={[0.28, 1.42, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.32, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.28, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[0.09, 0.11, 0.09]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {/* ACTIVE WELDING TORCH & SPARK SYSTEM (job === 'welder') */}
        {job === 'welder' && (
          <group position={[0, -0.65, 0.22]} rotation={[0.8, 0, 0]}>
            {/* Torch Handle */}
            <mesh castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            {/* Brass Gas Tube */}
            <mesh position={[0, 0.18, 0]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} />
            </mesh>
            {/* Ceramic Gas Cup Nozzle */}
            <mesh position={[0, 0.28, 0.02]}>
              <cylinderGeometry args={[0.03, 0.02, 0.08, 12]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>

            {/* Glowing Blue Electric Arc Tip */}
            {!isEvacuated && (
              <>
                <mesh position={[0, 0.34, 0.03]}>
                  <sphereGeometry args={[0.045, 8, 8]} />
                  <meshStandardMaterial
                    color="#e0f2fe"
                    emissive="#38bdf8"
                    emissiveIntensity={5.0}
                  />
                </mesh>

                {/* Electric Arc Flickering Light */}
                <pointLight
                  ref={weldLightRef}
                  position={[0, 0.38, 0.05]}
                  color="#38bdf8"
                  intensity={3.2}
                  distance={5}
                />

                {/* Spark Particle Cluster */}
                <group ref={sparkRef} position={[0, 0.36, 0.04]}>
                  {[-0.04, 0, 0.04].map((sx, idx) => (
                    <mesh key={idx} position={[sx, (idx % 2) * 0.04, (idx - 1) * 0.03]}>
                      <sphereGeometry args={[0.018, 6, 6]} />
                      <meshStandardMaterial
                        color="#ffffff"
                        emissive="#67e8f9"
                        emissiveIntensity={6.0}
                      />
                    </mesh>
                  ))}
                </group>
              </>
            )}
          </group>
        )}

        {/* Heavy Torque Wrench */}
        {job === 'fuel-tech' && (
          <group position={[0, -0.62, 0.14]} rotation={[0.6, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.38, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.12, 0]}>
              <cylinderGeometry args={[0.026, 0.026, 0.14, 8]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* Laser Scanner */}
        {job === 'engine-scan' && (
          <group position={[0, -0.6, 0.18]} rotation={[0.85, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.24, 10]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.7} />
            </mesh>
            <pointLight color="#38bdf8" intensity={2.8} distance={4.5} />
            <mesh ref={laserBeamRef} position={[0, 0.75, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.22, 1.4, 16]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}

        {/* Glowing Marshalling Wand */}
        {job === 'comms-marshall' && (
          <group position={[0, -0.65, 0.12]} rotation={[1.57, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.34, 12]} />
              <meshStandardMaterial
                color="#f97316"
                emissive="#f97316"
                emissiveIntensity={2.5}
              />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// Continuous 15-Second Roving Field Inspection Officer
const RovingInspectorCharacter: React.FC<{ isEvacuated: boolean }> = ({ isEvacuated }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    if (isEvacuated) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, delta * 2.5);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 12.5, delta * 2.5);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, delta * 2.5);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, delta * 3.0);
      return;
    }

    const loopTime = time % 15.0;
    const cycleIndex = Math.floor(time / 15.0);
    const targetIsBlue = cycleIndex % 2 === 0;

    const deskX = 0;
    const deskZ = 2.4;
    const padX = targetIsBlue ? -4.8 : 4.8;
    const padZ = 0.5;
    const padElevation = 0.85;

    if (loopTime < 4.5) {
      const p = loopTime / 4.5;
      const ease = p * p * (3 - 2 * p);
      groupRef.current.position.x = THREE.MathUtils.lerp(deskX, padX, ease);
      groupRef.current.position.z = THREE.MathUtils.lerp(deskZ, padZ, ease);
      groupRef.current.position.y = p < 0.4 ? 0 : THREE.MathUtils.lerp(0, padElevation, (p - 0.4) / 0.6);
      groupRef.current.rotation.y = Math.atan2(padX - deskX, padZ - deskZ);

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 9) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(time * 9) * 0.45;
      }
    } else if (loopTime < 8.5) {
      const inspectT = loopTime - 4.5;
      groupRef.current.position.set(padX, padElevation, padZ);
      groupRef.current.rotation.y = targetIsBlue ? -1.8 : 1.8;

      if (headRef.current) {
        headRef.current.rotation.x = -0.32 + Math.sin(inspectT * 2.2) * 0.12;
      }
    } else if (loopTime < 12.0) {
      const p = (loopTime - 8.5) / 3.5;
      const ease = p * p * (3 - 2 * p);
      groupRef.current.position.x = THREE.MathUtils.lerp(padX, deskX, ease);
      groupRef.current.position.z = THREE.MathUtils.lerp(padZ, deskZ, ease);
      groupRef.current.position.y = p < 0.6 ? THREE.MathUtils.lerp(padElevation, 0, p / 0.6) : 0;
      groupRef.current.rotation.y = Math.atan2(deskX - padX, deskZ - padZ);
    } else {
      groupRef.current.position.set(deskX, 0, deskZ);
      groupRef.current.rotation.y = targetIsBlue ? 2.5 : -2.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 2.7]}>
      <mesh position={[0, 0.76, 0]} castShadow>
        <boxGeometry args={[0.38, 0.22, 0.25]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>
      <group ref={leftLegRef} position={[-0.11, 0.66, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.62, 12]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.11, 0.66, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.62, 12]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
      </group>
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.44, 0.6, 0.28]} />
        <meshStandardMaterial color="#ea580c" roughness={0.45} />
      </mesh>
      <group ref={headRef} position={[0, 1.62, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
      <group ref={leftArmRef} position={[-0.28, 1.42, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.06, 0.5, 12]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.28, 1.42, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.06, 0.5, 12]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
      </group>
    </group>
  );
};

interface WorkersProps {
  launchStage: LaunchStep;
  isLaunchPhase?: boolean;
  blueStagesCleared?: number;
  redStagesCleared?: number;
  blueCheering: boolean;
  redCheering: boolean;
  blueIsWelding?: boolean;
  redIsWelding?: boolean;
}

export const AerospaceWorkers3D: React.FC<WorkersProps> = ({
  launchStage,
  isLaunchPhase = false,
  blueStagesCleared = 0,
  redStagesCleared = 0,
  blueCheering,
  redCheering,
  blueIsWelding = true,
  redIsWelding = true,
}) => {
  const isGlobalEvac = isLaunchPhase || launchStage !== 'idle';
  const blueWelderEvac = isGlobalEvac || !blueIsWelding || blueStagesCleared >= 3;
  const redWelderEvac = isGlobalEvac || !redIsWelding || redStagesCleared >= 3;

  return (
    <group position={[0, 0.1, 0]}>
      {/* ── 1. BLUE TEAM ENGINEERING WORKSTATION & CREW (Left Pad: x = -7.0) ── */}
      <WorkstationDesk3D
        position={[-9.8, 0, 2.4]}
        rotationY={0.45}
        team="blue"
        stagesCleared={blueStagesCleared}
        isCorrectPulse={blueCheering}
      />

      {/* Blue Worker 1: Lead Flight Director (Standing in front of computer, facing computer screen & typing) */}
      <AerospaceCharacter
        initialPos={[-9.55, 0, 2.92]}
        rotationY={3.59}
        team="blue"
        job="flight-director"
        isEvacuated={isGlobalEvac}
        isCheering={blueCheering}
      />

      {/* Blue Worker 2: ACTIVE WELDING TECHNICIAN (Welding rocket hull Q1-Q3, stops & evacuates on Q3+) */}
      <AerospaceCharacter
        initialPos={[-4.8, 0.85, -1.9]}
        rotationY={-0.86}
        team="blue"
        job="welder"
        isEvacuated={blueWelderEvac}
        isCheering={blueCheering}
      />

      {/* Blue Manifold Stand Prop for Cryo Specialist */}
      <CryoManifoldStand position={[-4.8, 0.85, 2.35]} rotationY={3.14} />

      {/* Blue Worker 3: Cryo Propellant Specialist */}
      <AerospaceCharacter
        initialPos={[-4.8, 0.85, 1.9]}
        rotationY={-2.28}
        team="blue"
        job="fuel-tech"
        isEvacuated={isGlobalEvac}
        isCheering={blueCheering}
      />

      {/* Blue Worker 4: Safety & Comms Marshall */}
      <AerospaceCharacter
        initialPos={[-10.6, 0, -1.2]}
        rotationY={0.8}
        team="blue"
        job="comms-marshall"
        isEvacuated={isGlobalEvac}
        isCheering={blueCheering}
      />

      {/* Blue Worker 5: LOX Spherical Tank Cryo Technician */}
      <AerospaceCharacter
        initialPos={[-6.0, 0, -2.1]}
        rotationY={3.14}
        team="blue"
        job="tank-tech"
        isEvacuated={isGlobalEvac}
        isCheering={blueCheering}
      />

      {/* ── 2. RED TEAM ENGINEERING WORKSTATION & CREW (Right Pad: x = +7.0) ── */}
      <WorkstationDesk3D
        position={[9.8, 0, 2.4]}
        rotationY={-0.45}
        team="red"
        stagesCleared={redStagesCleared}
        isCorrectPulse={redCheering}
      />

      {/* Red Worker 1: Lead Flight Director (Standing in front of computer, facing computer screen & typing) */}
      <AerospaceCharacter
        initialPos={[9.55, 0, 2.92]}
        rotationY={2.69}
        team="red"
        job="flight-director"
        isEvacuated={isGlobalEvac}
        isCheering={redCheering}
      />

      {/* Red Worker 2: ACTIVE WELDING TECHNICIAN (Welding rocket hull Q1-Q3, stops & evacuates on Q3+) */}
      <AerospaceCharacter
        initialPos={[4.8, 0.85, -1.9]}
        rotationY={0.86}
        team="red"
        job="welder"
        isEvacuated={redWelderEvac}
        isCheering={redCheering}
      />

      {/* Red Manifold Stand Prop for Cryo Specialist */}
      <CryoManifoldStand position={[4.8, 0.85, 2.35]} rotationY={3.14} />

      {/* Red Worker 3: Cryo Propellant Specialist */}
      <AerospaceCharacter
        initialPos={[4.8, 0.85, 1.9]}
        rotationY={2.28}
        team="red"
        job="fuel-tech"
        isEvacuated={isGlobalEvac}
        isCheering={redCheering}
      />

      {/* Red Worker 4: Safety & Comms Marshall */}
      <AerospaceCharacter
        initialPos={[10.6, 0, -1.2]}
        rotationY={-0.8}
        team="red"
        job="comms-marshall"
        isEvacuated={isGlobalEvac}
        isCheering={redCheering}
      />

      {/* Red Worker 5: LOX Spherical Tank Cryo Technician */}
      <AerospaceCharacter
        initialPos={[6.0, 0, -2.1]}
        rotationY={3.14}
        team="red"
        job="tank-tech"
        isEvacuated={isGlobalEvac}
        isCheering={redCheering}
      />

      {/* ── 3. CENTRAL HUB WORKERS & ROVING INSPECTOR ── */}
      <WorkstationDesk3D
        position={[0, 0, 3.4]}
        rotationY={0}
        team="blue"
        stagesCleared={Math.max(blueStagesCleared, redStagesCleared)}
      />

      {/* Central Flight Marshall (Standing in front of computer, facing computer screen & typing) */}
      <AerospaceCharacter
        initialPos={[0, 0, 3.95]}
        rotationY={3.14159}
        team="blue"
        job="flight-director"
        isEvacuated={isGlobalEvac}
        isCheering={blueCheering || redCheering}
        isCentralOperator={true}
      />

      {/* Continuous 15-Second Roving Field Inspection Officer */}
      <RovingInspectorCharacter isEvacuated={isGlobalEvac} />
    </group>
  );
};
