// ============================================================
// THE GREAT NUMBER RAILWAY — Station Buildings & Environment
// Train stations, platforms, trees, hills, water tower
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ── Train Station ──
interface StationProps {
  position: [number, number, number];
  name: string;
  type: 'central' | 'passenger' | 'cargo' | 'maintenance';
  active: boolean;
}

export const Station: React.FC<StationProps> = ({ position, name, type, active }) => {
  const roofColor =
    type === 'central'
      ? '#991b1b'
      : type === 'passenger'
        ? '#1e40af'
        : type === 'cargo'
          ? '#854d0e'
          : '#065f46';

  const wallColor = '#f5f0e8';
  const platformColor = '#9ca3af';

  return (
    <group position={position}>
      {/* Platform */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[3, 0.16, 1.5]} />
        <meshStandardMaterial color={platformColor} roughness={0.8} />
      </mesh>

      {/* Platform edge line */}
      <mesh position={[0, 0.17, 0.7]}>
        <boxGeometry args={[3, 0.02, 0.08]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.5} />
      </mesh>

      {/* Main building */}
      <mesh position={[0, 0.65, -0.2]}>
        <boxGeometry args={[2, 1.0, 0.8]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.2, -0.2]}>
        <boxGeometry args={[2.3, 0.08, 1.0]} />
        <meshStandardMaterial color={roofColor} roughness={0.6} />
      </mesh>

      {/* Roof ridge */}
      <mesh position={[0, 1.35, -0.2]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.7, 0.7, 1.0]} />
        <meshStandardMaterial color={roofColor} roughness={0.6} />
      </mesh>

      {/* Windows */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.7, 0.21]}>
          <boxGeometry args={[0.25, 0.3, 0.02]} />
          <meshStandardMaterial
            color={active ? '#bfdbfe' : '#94a3b8'}
            emissive={active ? '#fbbf24' : '#000'}
            emissiveIntensity={active ? 0.4 : 0}
          />
        </mesh>
      ))}

      {/* Door */}
      <mesh position={[0, 0.45, 0.21]}>
        <boxGeometry args={[0.35, 0.6, 0.02]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* Station sign board */}
      <mesh position={[0, 1.55, 0.0]}>
        <boxGeometry args={[1.6, 0.25, 0.05]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>

      {/* Chimney */}
      <mesh position={[0.7, 1.6, -0.2]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Active indicator light */}
      {active && (
        <pointLight
          position={[0, 1.3, 0.5]}
          color="#fbbf24"
          intensity={0.5}
          distance={3}
        />
      )}
    </group>
  );
};

// ── Water Tower ──
interface WaterTowerProps {
  position: [number, number, number];
}

export const WaterTower: React.FC<WaterTowerProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Legs */}
      {[[-0.3, 0, -0.3], [0.3, 0, -0.3], [-0.3, 0, 0.3], [0.3, 0, 0.3]].map((p, i) => (
        <mesh key={i} position={[p[0], 1.0, p[2]]}>
          <boxGeometry args={[0.08, 2.0, 0.08]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      ))}

      {/* Tank */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.5, 0.45, 0.8, 12]} />
        <meshStandardMaterial color="#6b7280" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Conical top */}
      <mesh position={[0, 2.7, 0]}>
        <coneGeometry args={[0.55, 0.3, 12]} />
        <meshStandardMaterial color="#374151" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Spout */}
      <mesh position={[0.45, 1.8, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 6]} />
        <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
};

// ── Tree (stylized) ──
interface TreeProps {
  position: [number, number, number];
  scale?: number;
  variant?: 'oak' | 'pine' | 'bush';
}

export const Tree: React.FC<TreeProps> = ({ position, scale = 1, variant = 'oak' }) => {
  const colors = {
    oak: { trunk: '#78350f', leaves: '#15803d' },
    pine: { trunk: '#5c3d1a', leaves: '#166534' },
    bush: { trunk: '#78350f', leaves: '#22c55e' },
  };
  const c = colors[variant];

  if (variant === 'bush') {
    return (
      <group position={position} scale={[scale, scale, scale]}>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.35, 8, 6]} />
          <meshStandardMaterial color={c.leaves} roughness={0.8} />
        </mesh>
      </group>
    );
  }

  if (variant === 'pine') {
    return (
      <group position={position} scale={[scale, scale, scale]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.8, 6]} />
          <meshStandardMaterial color={c.trunk} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.4, 0.6, 8]} />
          <meshStandardMaterial color={c.leaves} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <coneGeometry args={[0.3, 0.5, 8]} />
          <meshStandardMaterial color="#16a34a" roughness={0.7} />
        </mesh>
      </group>
    );
  }

  // Oak
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.0, 6]} />
        <meshStandardMaterial color={c.trunk} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={c.leaves} roughness={0.7} />
      </mesh>
    </group>
  );
};

// ── Hill ──
interface HillProps {
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}

export const Hill: React.FC<HillProps> = ({
  position,
  scale = [1, 1, 1],
  color = '#4ade80',
}) => {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
};

// ── Signal Tower ──
interface SignalTowerProps {
  position: [number, number, number];
}

export const SignalTower: React.FC<SignalTowerProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Tower body */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.6, 3.0, 0.6]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.7} />
      </mesh>

      {/* Observation room */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.7} />
      </mesh>

      {/* Windows */}
      {[
        [0, 3.2, 0.41],
        [0, 3.2, -0.41],
        [0.41, 3.2, 0],
        [-0.41, 3.2, 0],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[i < 2 ? 0.3 : 0.02, 0.25, i < 2 ? 0.02 : 0.3]} />
          <meshStandardMaterial color="#bfdbfe" emissive="#fbbf24" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Roof */}
      <mesh position={[0, 3.6, 0]}>
        <coneGeometry args={[0.6, 0.4, 4]} />
        <meshStandardMaterial color="#991b1b" roughness={0.6} />
      </mesh>
    </group>
  );
};

// ── Cargo Depot ──
interface CargoDepotProps {
  position: [number, number, number];
}

export const CargoDepot: React.FC<CargoDepotProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Warehouse */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.5, 1.2, 1.5]} />
        <meshStandardMaterial color="#d4a94d" roughness={0.7} />
      </mesh>

      {/* Corrugated roof */}
      <mesh position={[0, 1.25, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.7, 0.06, 1.7]} />
        <meshStandardMaterial color="#6b7280" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Loading bay door */}
      <mesh position={[0, 0.45, 0.76]}>
        <boxGeometry args={[0.8, 0.8, 0.02]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>

      {/* Cargo crates */}
      {[
        [-0.8, 0.15, 1.0],
        [-0.4, 0.15, 1.1],
        [-0.6, 0.4, 1.05],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#92400e' : '#b45309'} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// ── Ground plane with grass ──
export const GroundPlane: React.FC = () => {
  return (
    <group>
      {/* Main grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#86b85c" roughness={0.9} />
      </mesh>

      {/* Dirt patches near tracks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0, 0]} receiveShadow>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#a68b5b" roughness={0.95} />
      </mesh>
    </group>
  );
};

// ── Distant Mountains ──
export const Mountains: React.FC = () => {
  return (
    <group position={[0, -2, -35]}>
      {[
        { x: -15, h: 12, w: 8, c: '#6d8f6d' },
        { x: -5, h: 15, w: 10, c: '#5a7a5a' },
        { x: 8, h: 11, w: 7, c: '#7a9a7a' },
        { x: 20, h: 13, w: 9, c: '#6d8f6d' },
        { x: -25, h: 9, w: 6, c: '#7a9a7a' },
      ].map((m, i) => (
        <mesh key={i} position={[m.x, m.h / 2, 0]}>
          <coneGeometry args={[m.w, m.h, 6]} />
          <meshStandardMaterial color={m.c} roughness={0.85} />
        </mesh>
      ))}
      {/* Snow caps */}
      {[
        { x: -5, h: 15, w: 10 },
        { x: 20, h: 13, w: 9 },
      ].map((m, i) => (
        <mesh key={i} position={[m.x, m.h - 1.5, 0]}>
          <coneGeometry args={[m.w * 0.3, 3, 6]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};
