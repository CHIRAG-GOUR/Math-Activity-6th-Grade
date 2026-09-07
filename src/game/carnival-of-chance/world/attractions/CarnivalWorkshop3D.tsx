// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Carnival Workshop 3D
// Physical pegboard slot machine and game crafting station
// ============================================================

import React from 'react';
import { useCarnivalStore } from '../../store/carnivalStore';

export const CarnivalWorkshop3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, -9.5],
}) => {
  const machineAnimState = useCarnivalStore((s) => s.machineAnimState);

  return (
    <group position={position}>
      {/* Workbench Station */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.8, 2.4]} />
        <meshStandardMaterial color="#0f766e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.1, 2.6]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.4} />
      </mesh>

      {/* Upright Slanted Pegboard Game Frame */}
      <group position={[0, 2.6, -0.4]} rotation={[-0.2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 3.2, 0.2]} />
          <meshStandardMaterial color="#134e4a" roughness={0.5} />
        </mesh>
        {/* Transparent Front Glass Plate */}
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[3.4, 3.0, 0.05]} />
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.9} transparent opacity={1} roughness={0.1} />
        </mesh>

        {/* Grid of Brass Deflection Pegs */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <mesh
              key={`${row}-${col}`}
              position={[(col - 2.5) * 0.5 + (row % 2 === 0 ? 0.25 : 0), (row - 1.5) * 0.5, 0.1]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
              <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
            </mesh>
          ))
        )}

        {/* Bottom 10 Target Slots (e.g. 3 Win, 7 Try Again) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const isWin = i === 2 || i === 5 || i === 8;
          return (
            <mesh key={i} position={[(i - 4.5) * 0.32, -1.35, 0.12]} castShadow>
              <boxGeometry args={[0.28, 0.35, 0.15]} />
              <meshStandardMaterial color={isWin ? '#10b981' : '#ef4444'} roughness={0.4} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
