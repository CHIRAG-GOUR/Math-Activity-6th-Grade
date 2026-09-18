import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { UNIT_SIZE, GRID_EXTENT, coordToWorld } from '../engine/coordinateMath';
import { Coordinate2D } from '../types';
import { TieredFountain3D } from './ParkBotanicalGarden3D';
import { getCachedMaterial, getCachedBasicMaterial, getCachedBoxGeo, getCachedCylinderGeo, getCachedSphereGeo } from './ParkMaterials';

interface ParkTerrain3DProps {
  selectedPoint?: Coordinate2D | null;
  selectedPoints?: Coordinate2D[];
  hoveredPoint?: Coordinate2D | null;
  onPointClick?: (coord: Coordinate2D) => void;
  gateOpenAngle?: number;
  fountainActive?: boolean;
  q1Built?: boolean;
  q2Built?: boolean;
  q3Built?: boolean;
  q4Built?: boolean;
}

export const ParkTerrain3D: React.FC<ParkTerrain3DProps> = ({
  selectedPoint,
  selectedPoints = [],
  hoveredPoint,
  onPointClick,
  gateOpenAngle = 0,
  fountainActive = false,
  q1Built = false,
  q2Built = false,
  q3Built = false,
  q4Built = false,
}) => {
  const parkInnerSize = (GRID_EXTENT * 2 + 0.6) * UNIT_SIZE; // 25.44m inner park
  const cycleTrackRadius = UNIT_SIZE * 5.4; // 12.96m
  const outerFootpathRadius = UNIT_SIZE * 5.8; // 13.92m
  const roadSize = UNIT_SIZE * 15; // ~36m total world extent

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
    <group name="MasterParkTerrain">
      {/* ============================================================ */}
      {/* 1. SURROUNDING CITY STREET / ROAD */}
      {/* ============================================================ */}
      {/* Asphalt Ground Plane */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[75, 75]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* 2-Lane Asphalt Road Ribbon Surface */}
      <mesh position={[0, -0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 44]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Outer White Road Edge Lines */}
      <mesh position={[0, -0.05, -20.8]} geometry={getCachedBoxGeo(41.6, 0.01, 0.12)} material={getCachedBasicMaterial('#f8fafc')} />
      <mesh position={[0, -0.05, 20.8]} geometry={getCachedBoxGeo(41.6, 0.01, 0.12)} material={getCachedBasicMaterial('#f8fafc')} />
      <mesh position={[-20.8, -0.05, 0]} geometry={getCachedBoxGeo(0.12, 0.01, 41.6)} material={getCachedBasicMaterial('#f8fafc')} />
      <mesh position={[20.8, -0.05, 0]} geometry={getCachedBoxGeo(0.12, 0.01, 41.6)} material={getCachedBasicMaterial('#f8fafc')} />

      {/* Inner White Road Edge Lines */}
      <mesh position={[0, -0.05, -16.2]} geometry={getCachedBoxGeo(32.4, 0.01, 0.12)} material={getCachedBasicMaterial('#f8fafc')} />
      <mesh position={[0, -0.05, 16.2]} geometry={getCachedBoxGeo(32.4, 0.01, 0.12)} material={getCachedBasicMaterial('#f8fafc')} />
      <mesh position={[-16.2, -0.05, 0]} geometry={getCachedBoxGeo(0.12, 0.01, 32.4)} material={getCachedBasicMaterial('#f8fafc')} />
      <mesh position={[16.2, -0.05, 0]} geometry={getCachedBoxGeo(0.12, 0.01, 32.4)} material={getCachedBasicMaterial('#f8fafc')} />

      {/* Surrounding City Sidewalks underneath Buildings */}
      {/* Sidewalks */}
      <mesh position={[0, -0.02, -27]} geometry={getCachedBoxGeo(72, 0.08, 12)} material={getCachedMaterial('#cbd5e1', 0.7)} />
      <mesh position={[0, -0.02, 27]} geometry={getCachedBoxGeo(72, 0.08, 12)} material={getCachedMaterial('#cbd5e1', 0.7)} />
      <mesh position={[-27, -0.02, 0]} geometry={getCachedBoxGeo(12, 0.08, 72)} material={getCachedMaterial('#cbd5e1', 0.7)} />
      <mesh position={[27, -0.02, 0]} geometry={getCachedBoxGeo(12, 0.08, 72)} material={getCachedMaterial('#cbd5e1', 0.7)} />

      {/* Road Lane Centerline Markings (Yellow Dashed Lines at R = 18.5m) */}
      {/* Road Centerline Dashes — Using cached geometry and materials */}
      {[-12, -4, 4, 12].map((cx, i) => (
        <React.Fragment key={`rd_dash_ns_${i}`}>
          <mesh position={[cx, -0.05, -18.5]} geometry={getCachedBoxGeo(2.2, 0.01, 0.15)} material={getCachedBasicMaterial('#facc15')} />
          <mesh position={[cx, -0.05, 18.5]} geometry={getCachedBoxGeo(2.2, 0.01, 0.15)} material={getCachedBasicMaterial('#facc15')} />
        </React.Fragment>
      ))}
      {[-12, -4, 4, 12].map((cz, i) => (
        <React.Fragment key={`rd_dash_ew_${i}`}>
          <mesh position={[18.5, -0.05, cz]} geometry={getCachedBoxGeo(0.15, 0.01, 2.2)} material={getCachedBasicMaterial('#facc15')} />
          <mesh position={[-18.5, -0.05, cz]} geometry={getCachedBoxGeo(0.15, 0.01, 2.2)} material={getCachedBasicMaterial('#facc15')} />
        </React.Fragment>
      ))}

      {/* 4 Pedestrian Zebra Crossings connecting City Sidewalk to Park Gates */}
      {/* Crosswalks — Reduced to 3 stripes each, cached geometry */}
      {[[0, -18.5, 0], [0, 18.5, 0], [18.5, 0, Math.PI / 2], [-18.5, 0, Math.PI / 2]].map(([px, pz, ry], gi) => (
        <group key={`cw_${gi}`} position={[px, -0.03, pz]} rotation={[0, ry || 0, 0]}>
          {[-0.9, 0, 0.9].map((cx, ci) => (
            <mesh key={`cs_${ci}`} position={[cx, 0, 0]} geometry={getCachedBoxGeo(0.5, 0.01, 4.8)} material={getCachedBasicMaterial('#ffffff')} />
          ))}
        </group>
      ))}

      {/* ============================================================ */}
      {/* 2. OUTER SIDEWALK / PEDESTRIAN FOOTPATH */}
      {/* ============================================================ */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[outerFootpathRadius * 2 + 1.8, 0.08, outerFootpathRadius * 2 + 1.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Outer Footpath Curbs */}
      <mesh position={[0, 0.04, (outerFootpathRadius * 2 + 1.8) / 2]}>
        <boxGeometry args={[outerFootpathRadius * 2 + 1.9, 0.12, 0.18]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.04, -(outerFootpathRadius * 2 + 1.8) / 2]}>
        <boxGeometry args={[outerFootpathRadius * 2 + 1.9, 0.12, 0.18]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      <mesh position={[(outerFootpathRadius * 2 + 1.8) / 2, 0.04, 0]}>
        <boxGeometry args={[0.18, 0.12, outerFootpathRadius * 2 + 1.9]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      <mesh position={[-(outerFootpathRadius * 2 + 1.8) / 2, 0.04, 0]}>
        <boxGeometry args={[0.18, 0.12, outerFootpathRadius * 2 + 1.9]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. DEDICATED BRICK-RED CYCLING LANE */}
      {/* ============================================================ */}
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[cycleTrackRadius * 2 + 0.6, 0.04, cycleTrackRadius * 2 + 0.6]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[cycleTrackRadius * 2 - 1.2, 0.04, cycleTrackRadius * 2 - 1.2]} />
        <meshStandardMaterial color="#4f9a3e" roughness={0.88} />
      </mesh>

      {/* ============================================================ */}
      {/* 4. PERIMETER WROUGHT-IRON FENCE & 4 ENTRANCE GATES */}
      {/* ============================================================ */}
      {/* North Fence Section */}
      <group position={[0, 0.35, -parkInnerSize / 2]}>
        <mesh position={[-6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        <mesh position={[6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* North Entrance Arch Gate & Animated Gate Doors */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[2.6, 0.18, 0.1]} />
            <meshStandardMaterial color="#047857" />
          </mesh>

          {/* Left Swinging Gate Door */}
          <group position={[-1.2, 0, 0]} rotation={[0, -gateOpenAngle, 0]}>
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>

          {/* Right Swinging Gate Door */}
          <group position={[1.2, 0, 0]} rotation={[0, gateOpenAngle, 0]}>
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>

        </group>
      </group>

      {/* South Fence Section */}
      <group position={[0, 0.35, parkInnerSize / 2]}>
        <mesh position={[-6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        <mesh position={[6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* South Entrance Arch Gate */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[2.6, 0.18, 0.1]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
          {/* South Swinging Doors */}
          <group position={[-1.2, 0, 0]} rotation={[0, -gateOpenAngle, 0]}>
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
          <group position={[1.2, 0, 0]} rotation={[0, gateOpenAngle, 0]}>
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
        </group>
      </group>

      {/* East Fence Section */}
      <group position={[parkInnerSize / 2, 0.35, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[-6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        <mesh position={[6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* East Gate */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[2.6, 0.18, 0.1]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
          <group position={[-1.2, 0, 0]} rotation={[0, -gateOpenAngle, 0]}>
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
          <group position={[1.2, 0, 0]} rotation={[0, gateOpenAngle, 0]}>
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
        </group>
      </group>

      {/* West Fence Section */}
      <group position={[-parkInnerSize / 2, 0.35, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[-6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        <mesh position={[6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* West Gate */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[2.6, 0.18, 0.1]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
          <group position={[-1.2, 0, 0]} rotation={[0, -gateOpenAngle, 0]}>
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
          <group position={[1.2, 0, 0]} rotation={[0, gateOpenAngle, 0]}>
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 5. MAIN CARTESIAN PROMENADES (X-Axis & Y-Axis) */}
      {/* ============================================================ */}
      {/* Promenades */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[parkInnerSize, 0.05, UNIT_SIZE * 0.95]} />
        <meshStandardMaterial color="#e5ded0" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.055, UNIT_SIZE * 0.48]} geometry={getCachedBoxGeo(parkInnerSize, 0.08, 0.1)} material={getCachedMaterial('#a8a29e', 0.6)} />
      <mesh position={[0, 0.055, -UNIT_SIZE * 0.48]} geometry={getCachedBoxGeo(parkInnerSize, 0.08, 0.1)} material={getCachedMaterial('#a8a29e', 0.6)} />
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[UNIT_SIZE * 0.95, 0.05, parkInnerSize]} />
        <meshStandardMaterial color="#e5ded0" roughness={0.65} />
      </mesh>
      <mesh position={[UNIT_SIZE * 0.48, 0.055, 0]} geometry={getCachedBoxGeo(0.1, 0.08, parkInnerSize)} material={getCachedMaterial('#a8a29e', 0.6)} />
      <mesh position={[-UNIT_SIZE * 0.48, 0.055, 0]} geometry={getCachedBoxGeo(0.1, 0.08, parkInnerSize)} material={getCachedMaterial('#a8a29e', 0.6)} />

      {/* ============================================================ */}
      {/* 6. CENTRAL ORIGIN PLAZA & GRAND TIERED FOUNTAIN (0, 0) */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Stone Dais */}
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[UNIT_SIZE * 1.35, UNIT_SIZE * 1.42, 0.08, 16]} />
          <meshStandardMaterial color="#f5f0e6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[UNIT_SIZE * 1.42, UNIT_SIZE * 1.46, 0.09, 16]} />
          <meshStandardMaterial color="#78716c" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.096, 0]} geometry={getCachedCylinderGeo(0.7, 0.7, 0.01, 12)} material={getCachedMaterial('#d97706', 0.2, 0.85)} />

        {/* Central Major Tiered Fountain (Activates upon Question 4) */}
        <TieredFountain3D position={[0, 0.06, 0]} isFlowing={fountainActive} />

        {/* Origin Label Plaque */}
        <Html position={[0, 3.4, 0]} center distanceFactor={16}>
          <div className="bg-slate-900/95 text-amber-300 font-black text-xs px-2.5 py-1 rounded-full border border-amber-400 shadow-xl backdrop-blur-sm pointer-events-none select-none whitespace-nowrap">
            ORIGIN (0, 0) {fountainActive ? '• GRAND FOUNTAIN' : ''}
          </div>
        </Html>
      </group>



      {/* ============================================================ */}
      {/* 8. AXES COORDINATE NUMBER STONES (-5 to +5) */}
      {/* ============================================================ */}
      {axisValues.map((val) => {
        const xPos = coordToWorld({ x: val, y: 0 }, 0.05);
        const yPos = coordToWorld({ x: 0, y: val }, 0.05);

        return (
          <React.Fragment key={`axis_marker_${val}`}>
            {/* X-Axis Number Stone */}
            <group position={xPos}>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.22, 0.24, 0.05, 16]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
              <Html position={[0, 0.18, 0.4]} center distanceFactor={18}>
                <div className="bg-slate-900/90 text-white font-bold text-[10px] px-1.5 py-0.5 rounded border border-slate-600 shadow select-none pointer-events-none">
                  {val > 0 ? `+${val}` : `${val}`}
                </div>
              </Html>
            </group>

            {/* Y-Axis Number Stone */}
            <group position={yPos}>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.22, 0.24, 0.05, 16]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
              <Html position={[0.4, 0.18, 0]} center distanceFactor={18}>
                <div className="bg-slate-900/90 text-white font-bold text-[10px] px-1.5 py-0.5 rounded border border-slate-600 shadow select-none pointer-events-none">
                  {val > 0 ? `+${val}` : `${val}`}
                </div>
              </Html>
            </group>
          </React.Fragment>
        );
      })}

      {/* ============================================================ */}
      {/* 9. QUADRANT EDUCATIONAL TITLES (Removed one by one as built) */}
      {/* ============================================================ */}
      {!q1Built && (
        <Html position={[UNIT_SIZE * 3.2, 0.04, -UNIT_SIZE * 3.2]} center distanceFactor={22}>
          <div className="text-emerald-900 font-extrabold text-[11px] tracking-wider uppercase bg-white/85 px-3 py-1.5 rounded-lg border-2 border-emerald-400 shadow-md select-none pointer-events-none">
            Quadrant I (+, +) • Active Playground
          </div>
        </Html>
      )}
      {!q2Built && (
        <Html position={[-UNIT_SIZE * 3.2, 0.04, -UNIT_SIZE * 3.2]} center distanceFactor={22}>
          <div className="text-teal-900 font-extrabold text-[11px] tracking-wider uppercase bg-white/85 px-3 py-1.5 rounded-lg border-2 border-teal-400 shadow-md select-none pointer-events-none">
            Quadrant II (-, +) • Botanical Gardens
          </div>
        </Html>
      )}
      {!q3Built && (
        <Html position={[-UNIT_SIZE * 3.2, 0.04, UNIT_SIZE * 3.2]} center distanceFactor={22}>
          <div className="text-blue-900 font-extrabold text-[11px] tracking-wider uppercase bg-white/85 px-3 py-1.5 rounded-lg border-2 border-blue-400 shadow-md select-none pointer-events-none">
            Quadrant III (-, -) • Sports Complex
          </div>
        </Html>
      )}
      {!q4Built && (
        <Html position={[UNIT_SIZE * 3.2, 0.04, UNIT_SIZE * 3.2]} center distanceFactor={22}>
          <div className="text-amber-900 font-extrabold text-[11px] tracking-wider uppercase bg-white/85 px-3 py-1.5 rounded-lg border-2 border-amber-400 shadow-md select-none pointer-events-none">
            Quadrant IV (+, -) • Picnic Grove
          </div>
        </Html>
      )}

      {/* ============================================================ */}
      {/* 10. INTERACTIVE COORDINATE CLICK NODES */}
      {/* ============================================================ */}
      {gridCoords.map((coord) => {
        const isSelected = selectedPoint && selectedPoint.x === coord.x && selectedPoint.y === coord.y;
        const isPolySelected = selectedPoints.some((p) => p.x === coord.x && p.y === coord.y);
        const isHovered = hoveredPoint && hoveredPoint.x === coord.x && hoveredPoint.y === coord.y;
        const worldPos = coordToWorld(coord, 0.03);

        return (
          <group
            key={`grid_pt_${coord.x}_${coord.y}`}
            position={worldPos}
            onClick={(e) => {
              e.stopPropagation();
              onPointClick?.(coord);
            }}
          >
            {/* Subtle stone node */}
            <mesh position={[0, 0.01, 0]}
              geometry={getCachedCylinderGeo(0.09, 0.1, 0.02, 6)}
              material={getCachedMaterial(isSelected || isPolySelected ? '#2563eb' : isHovered ? '#60a5fa' : '#6b7280', 0.5)}
            />

            {/* Surveyor Flag Pin when selected */}
            {(isSelected || isPolySelected) && (
              <group position={[0, 0, 0]}>
                <mesh position={[0, 0.4, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.8, 0]} geometry={getCachedSphereGeo(0.12, 8, 8)} material={getCachedMaterial('#3b82f6', 0.3, 0, { emissive: '#2563eb', emissiveIntensity: 0.6 })} />
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
    </group>
  );
};
