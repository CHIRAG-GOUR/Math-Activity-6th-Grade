// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Game Builder 3D Machine
// Carnival workshop pegboard studio machine with 10 target slots
// ============================================================

import React from 'react';
import { useCarnivalStore } from '../../store/carnivalStore';

export const GameBuilderMachine3D: React.FC = () => {
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);

  return (
    <group position={[0, -0.4, 0]}>
      {/* Wooden Workbench Base */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.8, 2.4]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.12, 2.6]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.4} />
      </mesh>

      {/* Upright Pegboard Game Frame */}
      <group position={[0, 2.7, -0.3]} rotation={[-0.15, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.8, 3.2, 0.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[3.6, 3.0, 0.05]} />
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.9} transparent opacity={1} roughness={0.1} />
        </mesh>

        {/* Brass Deflection Pegs */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <mesh
              key={`${row}-${col}`}
              position={[(col - 2.5) * 0.55 + (row % 2 === 0 ? 0.27 : 0), (row - 1.5) * 0.55, 0.1]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
              <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
            </mesh>
          ))
        )}

        {/* Bottom 10 Target Slots */}
        {Array.from({ length: 10 }).map((_, i) => {
          const isWin = i === 2 || i === 5 || i === 8;
          return (
            <mesh key={i} position={[(i - 4.5) * 0.34, -1.35, 0.12]} castShadow>
              <boxGeometry args={[0.3, 0.38, 0.16]} />
              <meshStandardMaterial color={isWin ? '#16a34a' : '#dc2626'} roughness={0.4} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
