// ============================================================
// PARK PLANNER — 3D Park Terrain & Cartesian Grid Promenades
// Paved East-West (X-axis) and North-South (Y-axis) avenues with Origin Plaza
// ============================================================

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { UNIT_SIZE, GRID_EXTENT, coordToWorld } from '../engine/coordinateMath';
import { Coordinate2D } from '../types';

interface ParkTerrain3DProps {
  selectedPoint?: Coordinate2D | null;
  selectedPoints?: Coordinate2D[];
  hoveredPoint?: Coordinate2D | null;
  onPointClick?: (coord: Coordinate2D) => void;
}

export const ParkTerrain3D: React.FC<ParkTerrain3DProps> = ({
  selectedPoint,
  selectedPoints = [],
  hoveredPoint,
  onPointClick,
}) => {
  const parkSize = (GRID_EXTENT * 2 + 2) * UNIT_SIZE; // ~28.8 units

  // Generate grid points from -5 to +5
  const gridCoords = useMemo(() => {
    const coords: Coordinate2D[] = [];
    for (let x = -GRID_EXTENT; x <= GRID_EXTENT; x++) {
      for (let y = -GRID_EXTENT; y <= GRID_EXTENT; y++) {
        coords.push({ x, y });
      }
    }
    return coords;
  }, []);

  const axisValues = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

  return (
    <group name="ParkTerrain">
      {/* Base Lush Park Lawn */}
      <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[parkSize + 12, parkSize + 12]} />
        <meshStandardMaterial color="#4f9a3e" roughness={0.88} />
      </mesh>

      {/* Subtle Landscaping Grid Tiles */}
      <gridHelper
        args={[parkSize, GRID_EXTENT * 2, '#7ec96e', '#5fa84e']}
        position={[0, 0.005, 0]}
      />

      {/* ============================================================ */}
      {/* X-AXIS: Main East-West Promenade */}
      {/* ============================================================ */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[parkSize, 0.04, UNIT_SIZE * 0.9]} />
        <meshStandardMaterial color="#e5ded0" roughness={0.65} />
      </mesh>
      {/* X-Axis Curbs */}
      <mesh position={[0, 0.04, UNIT_SIZE * 0.45]}>
        <boxGeometry args={[parkSize, 0.06, 0.08]} />
        <meshStandardMaterial color="#b8afa0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.04, -UNIT_SIZE * 0.45]}>
        <boxGeometry args={[parkSize, 0.06, 0.08]} />
        <meshStandardMaterial color="#b8afa0" roughness={0.6} />
      </mesh>

      {/* ============================================================ */}
      {/* Y-AXIS: Main North-South Promenade */}
      {/* ============================================================ */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[UNIT_SIZE * 0.9, 0.04, parkSize]} />
        <meshStandardMaterial color="#e5ded0" roughness={0.65} />
      </mesh>
      {/* Y-Axis Curbs */}
      <mesh position={[UNIT_SIZE * 0.45, 0.04, 0]}>
        <boxGeometry args={[0.08, 0.06, parkSize]} />
        <meshStandardMaterial color="#b8afa0" roughness={0.6} />
      </mesh>
      <mesh position={[-UNIT_SIZE * 0.45, 0.04, 0]}>
        <boxGeometry args={[0.08, 0.06, parkSize]} />
        <meshStandardMaterial color="#b8afa0" roughness={0.6} />
      </mesh>

      {/* ============================================================ */}
      {/* ORIGIN (0,0): Central Plaza */}
      {/* ============================================================ */}
      <group position={[0, 0.03, 0]}>
        {/* Circular Plaza Stones */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[UNIT_SIZE * 0.95, 32]} />
          <meshStandardMaterial color="#f2eee6" roughness={0.5} />
        </mesh>
        {/* Outer Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[UNIT_SIZE * 0.85, UNIT_SIZE * 0.95, 32]} />
          <meshStandardMaterial color="#b8afa0" roughness={0.6} />
        </mesh>
        {/* Compass Star / Bronze Medallion */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Origin Label Plaque */}
        <Html position={[0, 0.2, 0]} center distanceFactor={16}>
          <div className="bg-slate-900/90 text-amber-300 font-black text-[11px] px-2 py-0.5 rounded-full border border-amber-400 shadow-md backdrop-blur-sm pointer-events-none select-none whitespace-nowrap">
            ORIGIN (0, 0)
          </div>
        </Html>
      </group>

      {/* ============================================================ */}
      {/* X-AXIS & Y-AXIS Coordinate Number Plaques */}
      {/* ============================================================ */}
      {axisValues.map((val) => {
        const xPos = coordToWorld({ x: val, y: 0 }, 0.05);
        const yPos = coordToWorld({ x: 0, y: val }, 0.05);

        return (
          <React.Fragment key={`axis_${val}`}>
            {/* X-Axis Number Stone */}
            <group position={xPos}>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.2, 0.22, 0.04, 16]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
              <Html position={[0, 0.15, 0.35]} center distanceFactor={18}>
                <div className="bg-slate-900/80 text-white font-bold text-[10px] px-1.5 py-0.5 rounded border border-slate-600 select-none shadow pointer-events-none">
                  {val > 0 ? `+${val}` : `${val}`}
                </div>
              </Html>
            </group>

            {/* Y-Axis Number Stone */}
            <group position={yPos}>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.2, 0.22, 0.04, 16]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
              <Html position={[0.35, 0.15, 0]} center distanceFactor={18}>
                <div className="bg-slate-900/80 text-white font-bold text-[10px] px-1.5 py-0.5 rounded border border-slate-600 select-none shadow pointer-events-none">
                  {val > 0 ? `+${val}` : `${val}`}
                </div>
              </Html>
            </group>
          </React.Fragment>
        );
      })}

      {/* ============================================================ */}
      {/* Quadrant Watermark Badges */}
      {/* ============================================================ */}
      <Html position={[UNIT_SIZE * 3, 0.02, -UNIT_SIZE * 3]} center distanceFactor={22}>
        <div className="text-emerald-800/60 font-black text-xs tracking-wider uppercase bg-white/70 px-2 py-1 rounded-md border border-emerald-300 select-none pointer-events-none">
          Quadrant I (+, +) • Active Playground
        </div>
      </Html>
      <Html position={[-UNIT_SIZE * 3, 0.02, -UNIT_SIZE * 3]} center distanceFactor={22}>
        <div className="text-teal-800/60 font-black text-xs tracking-wider uppercase bg-white/70 px-2 py-1 rounded-md border border-teal-300 select-none pointer-events-none">
          Quadrant II (-, +) • Botanical Gardens
        </div>
      </Html>
      <Html position={[-UNIT_SIZE * 3, 0.02, UNIT_SIZE * 3]} center distanceFactor={22}>
        <div className="text-blue-800/60 font-black text-xs tracking-wider uppercase bg-white/70 px-2 py-1 rounded-md border border-blue-300 select-none pointer-events-none">
          Quadrant III (-, -) • Sports Complex
        </div>
      </Html>
      <Html position={[UNIT_SIZE * 3, 0.02, UNIT_SIZE * 3]} center distanceFactor={22}>
        <div className="text-amber-800/60 font-black text-xs tracking-wider uppercase bg-white/70 px-2 py-1 rounded-md border border-amber-300 select-none pointer-events-none">
          Quadrant IV (+, -) • Picnic Grove
        </div>
      </Html>

      {/* ============================================================ */}
      {/* Interactive Coordinate Plotting Points */}
      {/* ============================================================ */}
      {gridCoords.map((coord) => {
        const isSelected = selectedPoint && selectedPoint.x === coord.x && selectedPoint.y === coord.y;
        const isPolySelected = selectedPoints.some((p) => p.x === coord.x && p.y === coord.y);
        const isHovered = hoveredPoint && hoveredPoint.x === coord.x && hoveredPoint.y === coord.y;
        const worldPos = coordToWorld(coord, 0.02);

        return (
          <group
            key={`grid_${coord.x}_${coord.y}`}
            position={worldPos}
            onClick={(e) => {
              e.stopPropagation();
              onPointClick?.(coord);
            }}
          >
            {/* Small subtle embedded stone dot */}
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.08, 0.09, 0.02, 8]} />
              <meshStandardMaterial
                color={isSelected || isPolySelected ? '#3b82f6' : isHovered ? '#60a5fa' : '#88aa77'}
                roughness={0.5}
              />
            </mesh>

            {/* If Selected: Surveyor Marker / Pin Flag */}
            {(isSelected || isPolySelected) && (
              <group position={[0, 0, 0]}>
                {/* Brass Surveyor Tripod Pin */}
                <mesh position={[0, 0.4, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Glowing Target Sphere */}
                <mesh position={[0, 0.8, 0]}>
                  <sphereGeometry args={[0.12, 16, 16]} />
                  <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={0.6} />
                </mesh>
                {/* Coordinate Label */}
                <Html position={[0, 1.15, 0]} center distanceFactor={14}>
                  <div className="bg-blue-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-full shadow-lg border border-blue-200 select-none pointer-events-none whitespace-nowrap animate-bounce">
                    ({coord.x}, {coord.y})
                  </div>
                </Html>
              </group>
            )}
          </group>
        );
      })}

      {/* Perimeter Hedge & Fencing */}
      <mesh position={[0, 0.3, -(parkSize / 2 + 0.6)]}>
        <boxGeometry args={[parkSize + 2, 0.6, 0.4]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.3, parkSize / 2 + 0.6]}>
        <boxGeometry args={[parkSize + 2, 0.6, 0.4]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.9} />
      </mesh>
      <mesh position={[-(parkSize / 2 + 0.6), 0.3, 0]}>
        <boxGeometry args={[0.4, 0.6, parkSize + 2]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.9} />
      </mesh>
      <mesh position={[parkSize / 2 + 0.6, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.6, parkSize + 2]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.9} />
      </mesh>
    </group>
  );
};
