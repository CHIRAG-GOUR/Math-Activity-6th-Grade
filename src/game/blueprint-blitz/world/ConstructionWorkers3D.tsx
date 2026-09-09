// ============================================================
// BLUEPRINT BLITZ — 3D Construction Workers
// Stylized 3D humanoid workers featuring:
// - Hard hats (White / Yellow)
// - High-visibility fluorescent safety vests with reflective stripes
// - Work trousers & heavy construction boots
// - Active poses: Surveying, directing, inspecting, and holding tools
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorkerProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  hatColor?: string;
  vestColor?: string;
  pose?: 'standing' | 'surveyor' | 'directing' | 'walking';
}

export const ConstructionWorker3D: React.FC<WorkerProps> = ({
  position,
  rotation = [0, 0, 0],
  hatColor = '#facc15',
  vestColor = '#ea580c',
  pose = 'standing',
}) => {
  const armRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pose === 'directing' && armRef.current) {
      armRef.current.rotation.x = Math.sin(t * 2.5) * 0.3 - 1.2;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.6 + position[0]) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Heavy Work Boots */}
      <mesh position={[-0.14, 0.1, 0.04]} castShadow>
        <boxGeometry args={[0.15, 0.18, 0.28]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>
      <mesh position={[0.14, 0.1, 0.04]} castShadow>
        <boxGeometry args={[0.15, 0.18, 0.28]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>

      {/* Heavy Duty Work Pants / Trousers */}
      <mesh position={[-0.14, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.6, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh position={[0.14, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.6, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Torso & High-Visibility Fluorescent Safety Vest */}
      <group position={[0, 1.0, 0]}>
        {/* Main Workshirt Core */}
        <mesh castShadow>
          <boxGeometry args={[0.48, 0.65, 0.28]} />
          <meshStandardMaterial color={vestColor} roughness={0.6} />
        </mesh>
        {/* Silver High-Vis Retroreflective Cross-Bands */}
        <mesh position={[0, 0.08, 0.145]}>
          <planeGeometry args={[0.44, 0.08]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.15, 0.145]}>
          <planeGeometry args={[0.44, 0.08]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[-0.14, 0.1, 0.145]}>
          <planeGeometry args={[0.06, 0.4]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0.14, 0.1, 0.145]}>
          <planeGeometry args={[0.06, 0.4]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Left & Right Arms */}
      <group position={[-0.3, 1.15, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
          <meshStandardMaterial color={vestColor} />
        </mesh>
      </group>
      <group ref={armRef} position={[0.3, 1.15, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
          <meshStandardMaterial color={vestColor} />
        </mesh>
        {/* Held Clipboard / Tool if Surveyor */}
        {pose === 'surveyor' && (
          <mesh position={[0, -0.45, 0.15]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.22, 0.32, 0.02]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
        )}
      </group>

      {/* Head & Safety Hard Hat */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        {/* Head Skin */}
        <mesh castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>
        {/* Safety Hard Hat */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.17, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={hatColor} roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Hard Hat Front Brim */}
        <mesh position={[0, 0.07, 0.08]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.03, 16]} />
          <meshStandardMaterial color={hatColor} roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// ── CONSTRUCTION CREW COMPOSITION ──
export const ConstructionCrew3D: React.FC = () => {
  return (
    <group>
      {/* Site Architect / Inspector near Central Station */}
      <ConstructionWorker3D
        position={[0, 0, -2.5]}
        rotation={[0, 0, 0]}
        hatColor="#ffffff"
        vestColor="#ea580c"
        pose="surveyor"
      />

      {/* Signalman directing excavator on Left */}
      <ConstructionWorker3D
        position={[-12, 0, 1.5]}
        rotation={[0, 0.8, 0]}
        hatColor="#facc15"
        vestColor="#ea580c"
        pose="directing"
      />

      {/* Worker near Dump Truck on Right */}
      <ConstructionWorker3D
        position={[13, 0, 1.2]}
        rotation={[0, -0.6, 0]}
        hatColor="#ffffff"
        vestColor="#84cc16"
        pose="standing"
      />

      {/* Worker on Blue Site Scaffolding */}
      <ConstructionWorker3D
        position={[-16, 4.15, -3]}
        rotation={[0, 0.4, 0]}
        hatColor="#facc15"
        vestColor="#ea580c"
        pose="standing"
      />

      {/* Worker on Red Site Scaffolding */}
      <ConstructionWorker3D
        position={[16, 4.15, -3]}
        rotation={[0, -0.4, 0]}
        hatColor="#facc15"
        vestColor="#84cc16"
        pose="standing"
      />
    </group>
  );
};
