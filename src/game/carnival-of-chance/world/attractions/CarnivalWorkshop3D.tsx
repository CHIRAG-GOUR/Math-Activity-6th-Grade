// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Build a Game (Carnival Workshop) 3D
// Carpenter workshop stall with striped awning, tool pegboards,
// prize slot calibrator, and marquee signboard
// ============================================================

import React from 'react';
import { useCarnivalStore } from '../../store/carnivalStore';

export const CarnivalWorkshop3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [-5.5, 0, 6.0],
}) => {
  const machineAnimState = useCarnivalStore((s) => s.machineAnimState);
  const selectAttraction = useCarnivalStore((s) => s.selectAttraction);

  return (
    <group position={position} onClick={() => selectAttraction('carnival-workshop')}>
      {/* ── Circular Cobblestone Platform Base ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.1, 0.3, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* ── Workbench Station Base ── */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.8, 2.4]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.12, 2.6]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.4} />
      </mesh>

      {/* ── Upright Slanted Pegboard Game Frame ── */}
      <group position={[0, 2.6, -0.4]} rotation={[-0.15, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 3.0, 0.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Transparent Front Glass Plate */}
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[3.4, 2.8, 0.05]} />
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
            <mesh key={i} position={[(i - 4.5) * 0.32, -1.25, 0.12]} castShadow>
              <boxGeometry args={[0.28, 0.35, 0.15]} />
              <meshStandardMaterial color={isWin ? '#10b981' : '#ef4444'} roughness={0.4} />
            </mesh>
          );
        })}
      </group>

      {/* ── Striped Workshop Awning & Top Marquee: BUILD A GAME ── */}
      <mesh position={[0, 4.4, 0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[4.8, 0.18, 2.2]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} />
      </mesh>

      {/* Marquee Sign */}
      <group position={[0, 5.2, 0.4]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3.4, 0.8, 0.2]} />
          <meshStandardMaterial color="#0369a1" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[3.5, 0.9, 0.05]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Glowing Bulbs */}
        {[-1.4, -0.9, -0.4, 0.1, 0.6, 1.1, 1.4].map((x, i) => (
          <mesh key={i} position={[x, 0.35, 0.12]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
