// ============================================================
// GRAPHWORKS — GRAPH STUDIO PANEL
// Compact touchscreen arcade console for Blue (left) & Red (right)
// High-precision graph plotting: Circle Graph (Pie), Pictograph,
// Bar Graph, and Line Graph with drag, tap, and ±1, ±5, ±10 nudge controls.
// Removed all post-graph questions so gameplay remains 100% focused on graphs!
// ============================================================
'use client';

import React, { useRef, useCallback, useState } from 'react';
import { useGraphworksStore, type Team, type PlottedPoint, type MissionQuestion } from '../store/graphworksStore';
import { soundManager } from '@/utils/audio';

// ── COMPACT DIMENSIONS (Designed for bottom-corner arcade consoles) ──
const GRAPH_W = 290;
const GRAPH_H = 145;
const PADDING = { top: 12, right: 10, bottom: 22, left: 30 };
const PLOT_W = GRAPH_W - PADDING.left - PADDING.right;
const PLOT_H = GRAPH_H - PADDING.top - PADDING.bottom;

const PIE_COLORS = ['#0284c7', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const DISTRICT_ICONS: Record<string, string> = {
  weather: '🌡️',
  water: '💧',
  power: '⚡',
  traffic: '🚲',
  train: '🚆',
  park: '🌲',
};

// ── SVG GRAPH CANVAS ──
interface GraphCanvasProps {
  team: Team;
  mission: MissionQuestion;
  selectedIdx: number;
  onSelectIdx: (idx: number) => void;
}

function GraphCanvas({ team, mission, selectedIdx, onSelectIdx }: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const teamData = useGraphworksStore((s) => s[team]);
  const plottedPoints = teamData.plottedPoints;
  const plottedBars = teamData.plottedBars;
  const selectedTool = teamData.selectedTool;
  const addPlottedPoint = useGraphworksStore((s) => s.addPlottedPoint);
  const updatePlottedPoint = useGraphworksStore((s) => s.updatePlottedPoint);
  const removePlottedPoint = useGraphworksStore((s) => s.removePlottedPoint);
  const updateBarHeight = useGraphworksStore((s) => s.updateBarHeight);

  const { xAxis, yAxis, graphType, dataTable } = mission;
  const xCount = xAxis.labels.length;
  const yMin = yAxis.min;
  const yMax = yAxis.max;
  const yStep = yAxis.step;

  // Convert value to SVG y coordinate
  const valueToY = useCallback((val: number) => {
    return PADDING.top + PLOT_H - ((val - yMin) / (yMax - yMin)) * PLOT_H;
  }, [yMin, yMax]);

  // Convert index to SVG x coordinate
  const indexToX = useCallback((idx: number) => {
    if (graphType === 'bar') {
      const barWidth = PLOT_W / xCount;
      return PADDING.left + idx * barWidth + barWidth / 2;
    }
    return PADDING.left + (idx / Math.max(1, xCount - 1)) * PLOT_W;
  }, [xCount, graphType]);

  // Convert SVG coordinates to value with INTEGER precision
  const svgToValue = useCallback((svgX: number, svgY: number) => {
    const x = Math.max(0, Math.min(PLOT_W, svgX - PADDING.left));
    const y = Math.max(0, Math.min(PLOT_H, svgY - PADDING.top));

    const idx = graphType === 'bar'
      ? Math.floor((x / PLOT_W) * xCount)
      : Math.round((x / PLOT_W) * Math.max(1, xCount - 1));

    const rawValue = yMin + ((PLOT_H - y) / PLOT_H) * (yMax - yMin);
    const snapped = Math.max(yMin, Math.min(yMax, Math.round(rawValue)));

    return { idx: Math.min(idx, xCount - 1), value: snapped };
  }, [xCount, yMin, yMax, graphType]);

  // Get SVG position from event
  const getSVGCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * GRAPH_W,
      y: ((clientY - rect.top) / rect.height) * GRAPH_H,
    };
  }, []);

  // Handle click/tap on graph area
  const handleGraphInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (graphType === 'pie' || graphType === 'pictograph') return;

    const coords = getSVGCoords(e);
    const { idx, value } = svgToValue(coords.x, coords.y);
    onSelectIdx(idx);

    if (graphType === 'bar') {
      soundManager.playKeypadBeep();
      updateBarHeight(team, idx, value);
      return;
    }

    if (selectedTool === 'addPoint') {
      soundManager.playKeypadBeep();
      const label = xAxis.labels[idx] ?? `${idx}`;
      const existing = plottedPoints.findIndex((p) => p.label === label);
      if (existing >= 0) {
        updatePlottedPoint(team, existing, { y: value });
      } else {
        addPlottedPoint(team, { x: idx, y: value, label, connected: true });
      }
    } else if (selectedTool === 'erase') {
      const closest = plottedPoints.findIndex((p) => {
        const px = indexToX(p.x);
        const py = valueToY(p.y);
        return Math.hypot(px - coords.x, py - coords.y) < 14;
      });
      if (closest >= 0) {
        soundManager.playClick();
        removePlottedPoint(team, closest);
      }
    }
  }, [getSVGCoords, svgToValue, graphType, selectedTool, plottedPoints, team, xAxis.labels,
    addPlottedPoint, updatePlottedPoint, removePlottedPoint, updateBarHeight, onSelectIdx, indexToX, valueToY]);

  // Handle drag for moving points/bars
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectIdx(idx);
    setDraggingIdx(idx);
  }, [onSelectIdx]);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (draggingIdx === null) return;
    e.preventDefault();
    const coords = getSVGCoords(e);
    const { value } = svgToValue(coords.x, coords.y);

    if (graphType === 'bar' || graphType === 'pie' || graphType === 'pictograph') {
      updateBarHeight(team, draggingIdx, value);
    } else {
      updatePlottedPoint(team, draggingIdx, { y: value });
    }
  }, [draggingIdx, getSVGCoords, svgToValue, graphType, team, updateBarHeight, updatePlottedPoint]);

  const handleDragEnd = useCallback(() => {
    setDraggingIdx(null);
  }, []);

  // Y-axis gridlines for Cartesian graphs
  const yGridlines: number[] = [];
  for (let v = yMin; v <= yMax; v += yStep) {
    yGridlines.push(v);
  }

  const teamColor = team === 'blue' ? '#2563EB' : '#DC2626';
  const barWidth = Math.max(12, (PLOT_W / xCount) * 0.72);

  // Line path
  const sortedPoints = [...plottedPoints].sort((a, b) => a.x - b.x);
  const linePath = sortedPoints.length > 1
    ? sortedPoints.reduce((acc, pt, i) => {
        const x = indexToX(pt.x);
        const y = valueToY(pt.y);
        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, '')
    : '';

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
      className="w-full h-auto bg-white rounded-lg border border-slate-200 select-none shadow-inner"
      style={{ touchAction: 'none' }}
      onClick={handleGraphInteraction}
      onMouseMove={handleDragMove}
      onTouchMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* ── 1. CARTESIAN AXES & GRIDLINES (FOR BAR & LINE) ── */}
      {(graphType === 'bar' || graphType === 'line') && (
        <>
          {/* Grid lines */}
          {yGridlines.map((v) => {
            const y = valueToY(v);
            return (
              <g key={v}>
                <line
                  x1={PADDING.left} y1={y} x2={GRAPH_W - PADDING.right} y2={y}
                  stroke="#F1F5F9" strokeWidth={0.8}
                />
                <text
                  x={PADDING.left - 4} y={y + 3} textAnchor="end"
                  fill="#94A3B8" fontSize={7} fontWeight="600" fontFamily="Inter, sans-serif"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {xAxis.labels.map((label, i) => {
            const x = indexToX(i);
            const isSelected = selectedIdx === i;
            return (
              <text
                key={i} x={x} y={GRAPH_H - 6} textAnchor="middle"
                fill={isSelected ? teamColor : '#64748B'}
                fontSize={isSelected ? 8 : 7}
                fontWeight={isSelected ? '800' : '600'}
                fontFamily="Inter, sans-serif"
              >
                {label}
              </text>
            );
          })}

          {/* Axes lines */}
          <line
            x1={PADDING.left} y1={PADDING.top}
            x2={PADDING.left} y2={GRAPH_H - PADDING.bottom}
            stroke="#94A3B8" strokeWidth={1.2}
          />
          <line
            x1={PADDING.left} y1={GRAPH_H - PADDING.bottom}
            x2={GRAPH_W - PADDING.right} y2={GRAPH_H - PADDING.bottom}
            stroke="#94A3B8" strokeWidth={1.2}
          />
        </>
      )}

      {/* ── 2. BAR GRAPH RENDERING ── */}
      {graphType === 'bar' && plottedBars.map((bar, i) => {
        const x = indexToX(i) - barWidth / 2;
        const y = valueToY(bar.height);
        const h = GRAPH_H - PADDING.bottom - y;
        const isSelected = selectedIdx === i;

        return (
          <g key={i}>
            <rect
              x={x} y={PADDING.top} width={barWidth} height={PLOT_H}
              fill={isSelected ? (team === 'blue' ? '#EFF6FF' : '#FEF2F2') : '#F8FAFC'}
              rx={2}
            />
            <rect
              x={x} y={y} width={barWidth} height={Math.max(0, h)}
              fill={teamColor}
              stroke={isSelected ? '#FBBF24' : 'none'}
              strokeWidth={isSelected ? 1.8 : 0}
              opacity={isSelected ? 1 : 0.85}
              rx={2}
              style={{ cursor: 'pointer', transition: 'height 0.1s ease' }}
              onMouseDown={(e) => handleDragStart(e, i)}
              onTouchStart={(e) => handleDragStart(e, i)}
            />
            {bar.height > 0 && (
              <text
                x={x + barWidth / 2} y={Math.max(PADDING.top + 7, y - 3)} textAnchor="middle"
                fill={isSelected ? '#1E293B' : teamColor}
                fontSize={7.5} fontWeight="800" fontFamily="Inter, sans-serif"
              >
                {Math.round(bar.height)}
              </text>
            )}
            {mission.expectedValues[i] !== undefined && (
              <line
                x1={x - 1} y1={valueToY(mission.expectedValues[i])}
                x2={x + barWidth + 1} y2={valueToY(mission.expectedValues[i])}
                stroke={teamColor} strokeWidth={1} strokeDasharray="2,2" opacity={0.3}
              />
            )}
          </g>
        );
      })}

      {/* ── 3. LINE GRAPH RENDERING ── */}
      {graphType === 'line' && (
        <>
          {mission.phase !== 'create' && dataTable.map((d, i) => {
            const x = indexToX(i);
            const y = valueToY(d.value);
            return (
              <circle
                key={`guide-${i}`} cx={x} cy={y} r={3}
                fill="none" stroke={teamColor} strokeWidth={0.6} strokeDasharray="2,2" opacity={0.25}
              />
            );
          })}
          {linePath && (
            <path
              d={linePath} fill="none" stroke={teamColor} strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" opacity={0.9}
            />
          )}
          {sortedPoints.map((pt, i) => {
            const x = indexToX(pt.x);
            const y = valueToY(pt.y);
            const origIdx = plottedPoints.indexOf(pt);
            const isSelected = selectedIdx === pt.x;

            return (
              <g key={i}>
                <circle
                  cx={x} cy={y} r={12} fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseDown={(e) => handleDragStart(e, origIdx)}
                  onTouchStart={(e) => handleDragStart(e, origIdx)}
                />
                {isSelected && (
                  <circle cx={x} cy={y} r={7.5} fill="none" stroke="#FBBF24" strokeWidth={1.8} />
                )}
                <circle cx={x} cy={y} r={4.5} fill={teamColor} stroke="#FFF" strokeWidth={1.5} />
                <text
                  x={x} y={Math.max(PADDING.top + 6, y - 6)} textAnchor="middle"
                  fill={isSelected ? '#1E293B' : teamColor}
                  fontSize={7.5} fontWeight="800" fontFamily="Inter, sans-serif"
                >
                  {Math.round(pt.y)}
                </text>
              </g>
            );
          })}
        </>
      )}

      {/* ── 4. PIE CHART / CIRCLE GRAPH ("ROUND ONE") ── */}
      {graphType === 'pie' && (() => {
        const cx = GRAPH_W / 2;
        const cy = GRAPH_H / 2;
        const outerR = 46;
        const innerR = 16;
        const total = plottedBars.reduce((sum, b) => sum + Math.max(0, b.height), 0) || 1;
        let currentAngle = -Math.PI / 2;

        return (
          <g>
            {plottedBars.map((bar, i) => {
              const val = Math.max(0, bar.height);
              const sliceAngle = (val / total) * Math.PI * 2;
              const startAngle = currentAngle;
              const endAngle = currentAngle + sliceAngle;
              currentAngle += sliceAngle;

              const isSelected = selectedIdx === i;
              const color = PIE_COLORS[i % PIE_COLORS.length];

              const midAngle = startAngle + sliceAngle / 2;
              const explode = isSelected ? 4 : 0;
              const ox = Math.cos(midAngle) * explode;
              const oy = Math.sin(midAngle) * explode;

              const x1Outer = cx + ox + Math.cos(startAngle) * outerR;
              const y1Outer = cy + oy + Math.sin(startAngle) * outerR;
              const x2Outer = cx + ox + Math.cos(endAngle) * outerR;
              const y2Outer = cy + oy + Math.sin(endAngle) * outerR;

              const x1Inner = cx + ox + Math.cos(endAngle) * innerR;
              const y1Inner = cy + oy + Math.sin(endAngle) * innerR;
              const x2Inner = cx + ox + Math.cos(startAngle) * innerR;
              const y2Inner = cy + oy + Math.sin(startAngle) * innerR;

              const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
              const pathData = val <= 0.001
                ? ''
                : sliceAngle >= Math.PI * 1.999
                ? `M ${cx + ox} ${cy + oy - outerR} A ${outerR} ${outerR} 0 1 0 ${cx + ox} ${cy + oy + outerR} A ${outerR} ${outerR} 0 1 0 ${cx + ox} ${cy + oy - outerR} Z`
                : `M ${x1Outer} ${y1Outer} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer} L ${x1Inner} ${y1Inner} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner} Z`;

              const labelR = outerR * 0.72;
              const lx = cx + ox + Math.cos(midAngle) * labelR;
              const ly = cy + oy + Math.sin(midAngle) * labelR;
              const pct = Math.round((val / total) * 100);

              return (
                <g key={i} onClick={() => onSelectIdx(i)} style={{ cursor: 'pointer' }}>
                  {pathData && (
                    <path
                      d={pathData}
                      fill={color}
                      stroke={isSelected ? '#FBBF24' : '#FFFFFF'}
                      strokeWidth={isSelected ? 2.2 : 1}
                      opacity={isSelected ? 1 : 0.88}
                    />
                  )}
                  {val > 0 && sliceAngle > 0.35 && (
                    <text
                      x={lx} y={ly + 2.5} textAnchor="middle"
                      fill="#FFFFFF" fontSize={7.5} fontWeight="800" fontFamily="Inter, sans-serif"
                    >
                      {pct}%
                    </text>
                  )}
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r={innerR - 1} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={1} />
            <text
              x={cx} y={cy + 2.5} textAnchor="middle"
              fill="#475569" fontSize={6.5} fontWeight="900" fontFamily="Inter, sans-serif"
            >
              CIRCLE
            </text>
          </g>
        );
      })()}

      {/* ── 5. PICTOGRAPH / PICTURE GRAPH ── */}
      {graphType === 'pictograph' && (() => {
        const icon = DISTRICT_ICONS[mission.district] || '📊';
        const step = mission.yAxis.step || 5;

        return (
          <g>
            <rect x={PADDING.left} y={6} width={PLOT_W} height={14} fill="#F8FAFC" rx={3} stroke="#E2E8F0" strokeWidth={0.8} />
            <text
              x={GRAPH_W / 2} y={16} textAnchor="middle"
              fill="#0F172A" fontSize={8} fontWeight="700" fontFamily="Inter, sans-serif"
            >
              KEY: 1 {icon} = {step} {mission.unit}
            </text>

            {plottedBars.map((bar, i) => {
              const rowY = 25 + i * 21;
              const isSelected = selectedIdx === i;
              const count = Math.max(0, bar.height);
              const fullIcons = Math.floor(count / step);
              const hasHalf = (count % step) >= step * 0.4;

              return (
                <g key={i} onClick={() => onSelectIdx(i)} style={{ cursor: 'pointer' }}>
                  <rect
                    x={PADDING.left} y={rowY} width={PLOT_W} height={18}
                    fill={isSelected ? (team === 'blue' ? '#EFF6FF' : '#FEF2F2') : '#FFFFFF'}
                    stroke={isSelected ? teamColor : '#F1F5F9'}
                    strokeWidth={isSelected ? 1.5 : 0.8}
                    rx={4}
                  />
                  <text
                    x={PADDING.left + 5} y={rowY + 12}
                    fill={isSelected ? teamColor : '#334155'}
                    fontSize={7.5} fontWeight={isSelected ? '800' : '600'} fontFamily="Inter, sans-serif"
                  >
                    {bar.label}
                  </text>
                  {Array.from({ length: Math.min(8, fullIcons) }).map((_, iconIdx) => (
                    <text
                      key={iconIdx}
                      x={PADDING.left + 58 + iconIdx * 14} y={rowY + 13}
                      fontSize={9} textAnchor="middle"
                    >
                      {icon}
                    </text>
                  ))}
                  {hasHalf && fullIcons < 8 && (
                    <text
                      x={PADDING.left + 58 + fullIcons * 14} y={rowY + 13}
                      fontSize={8} textAnchor="middle" opacity={0.65}
                    >
                      ½
                    </text>
                  )}
                  <text
                    x={GRAPH_W - PADDING.right - 5} y={rowY + 12} textAnchor="end"
                    fill={isSelected ? teamColor : '#64748B'}
                    fontSize={8} fontWeight="800" fontFamily="Inter, sans-serif"
                  >
                    {Math.round(count)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* Empty State Prompt */}
      {plottedPoints.length === 0 && plottedBars.every((b) => b.height === 0) && (
        <text
          x={GRAPH_W / 2} y={GRAPH_H / 2} textAnchor="middle"
          fill="#94A3B8" fontSize={9} fontWeight="600" fontFamily="Inter, sans-serif"
        >
          Tap or use ± buttons to plot data
        </text>
      )}
    </svg>
  );
}

// ── COMPACT HORIZONTAL DATA STRIP ──
function DataStrip({
  mission,
  team,
  selectedIdx,
  onSelectIdx,
}: {
  mission: MissionQuestion;
  team: Team;
  selectedIdx: number;
  onSelectIdx: (idx: number) => void;
}) {
  const teamColor = team === 'blue' ? '#2563EB' : '#DC2626';
  const teamBg = team === 'blue' ? '#EFF6FF' : '#FEF2F2';

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-0.5 px-0.5 no-scrollbar">
      {mission.dataTable.map((row, i) => {
        const isSelected = selectedIdx === i;
        const isMissing = mission.phase === 'complete' && mission.partialGraphData?.[i] === -1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => {
              soundManager.playClick();
              onSelectIdx(i);
            }}
            className={`flex-1 min-w-[42px] px-1 py-0.5 rounded text-center transition-all cursor-pointer border ${
              isSelected
                ? 'ring-2 font-black shadow-xs'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
            style={{
              borderColor: isSelected ? teamColor : undefined,
              backgroundColor: isSelected ? teamBg : undefined,
              color: isSelected ? teamColor : undefined,
              boxShadow: isSelected ? `0 0 0 1px ${teamColor}` : undefined,
            }}
          >
            <div className="text-[8.5px] font-bold truncate leading-tight opacity-75">{row.label}</div>
            <div className="text-[10.5px] font-mono font-black leading-tight tabular-nums">
              {isMissing ? '?' : `${row.value}${mission.unit}`}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── PRECISION NUDGE CONTROLS (±1, ±5, ±10) ──
function PrecisionControls({
  label,
  value,
  unit,
  team,
  onNudge,
}: {
  label: string;
  value: number;
  unit: string;
  team: Team;
  onNudge: (delta: number) => void;
}) {
  const isBlue = team === 'blue';
  const accentColor = isBlue ? 'text-blue-700' : 'text-red-700';
  const badgeBg = isBlue ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200';

  return (
    <div className="flex items-center justify-between bg-slate-50/95 rounded-lg px-2 py-1 border border-slate-200 shadow-2xs">
      <div className="flex items-center gap-1 min-w-0 pr-1">
        <span className="text-[9.5px] font-bold text-slate-500 uppercase truncate">
          {label}:
        </span>
        <span className={`text-xs font-black font-mono px-1 py-0.2 rounded border ${badgeBg} ${accentColor} tabular-nums`}>
          {Math.round(value)}{unit}
        </span>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={() => onNudge(-10)}
          className="px-1.5 py-1 text-[9.5px] font-black rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 active:scale-95 shadow-2xs leading-none cursor-pointer"
          title="Subtract 10"
        >
          -10
        </button>
        <button
          type="button"
          onClick={() => onNudge(-5)}
          className="px-1.5 py-1 text-[9.5px] font-black rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 active:scale-95 shadow-2xs leading-none cursor-pointer"
          title="Subtract 5"
        >
          -5
        </button>
        <button
          type="button"
          onClick={() => onNudge(-1)}
          className="px-1.5 py-1 text-[9.5px] font-black rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 active:scale-95 shadow-2xs leading-none cursor-pointer"
          title="Subtract 1"
        >
          -1
        </button>
        <button
          type="button"
          onClick={() => onNudge(1)}
          className="px-1.5 py-1 text-[9.5px] font-black rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 active:scale-95 shadow-2xs leading-none cursor-pointer"
          title="Add 1"
        >
          +1
        </button>
        <button
          type="button"
          onClick={() => onNudge(5)}
          className="px-1.5 py-1 text-[9.5px] font-black rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 active:scale-95 shadow-2xs leading-none cursor-pointer"
          title="Add 5"
        >
          +5
        </button>
        <button
          type="button"
          onClick={() => onNudge(10)}
          className="px-1.5 py-1 text-[9.5px] font-black rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 active:scale-95 shadow-2xs leading-none cursor-pointer"
          title="Add 10"
        >
          +10
        </button>
      </div>
    </div>
  );
}

// ── COMPACT GRAPH TOOLBAR ──
function GraphTools({
  team,
  selectedTool,
  onSelectTool,
  onReset,
}: {
  team: Team;
  selectedTool: string;
  onSelectTool: (tool: any) => void;
  onReset: () => void;
}) {
  const isBlue = team === 'blue';
  const activeClass = isBlue
    ? 'bg-blue-600 text-white font-black shadow-xs'
    : 'bg-red-600 text-white font-black shadow-xs';

  return (
    <div className="flex items-center justify-between text-[10px]">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onSelectTool('addPoint');
          }}
          className={`px-2 py-0.5 rounded border transition-all cursor-pointer font-bold ${
            selectedTool === 'addPoint'
              ? activeClass
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          ✚ Plot
        </button>
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onSelectTool('erase');
          }}
          className={`px-2 py-0.5 rounded border transition-all cursor-pointer font-bold ${
            selectedTool === 'erase'
              ? activeClass
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          ✕ Erase
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          soundManager.playClick();
          onReset();
        }}
        className="text-[9.5px] font-bold text-slate-500 hover:text-slate-800 transition-colors px-1 py-0.5 cursor-pointer"
      >
        ↺ Reset
      </button>
    </div>
  );
}

// ── FEEDBACK NOTIFICATION OVERLAY ──
function FeedbackPanel({ team }: { team: Team }) {
  const lastValidation = useGraphworksStore((s) => s[team].lastValidation);
  const showFeedback = useGraphworksStore((s) => s[team].showFeedback);
  const setShowFeedback = useGraphworksStore((s) => s.setShowFeedback);

  if (!showFeedback || !lastValidation) return null;

  return (
    <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm rounded-xl p-3 flex flex-col justify-between shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{lastValidation.isCorrect ? '🌟' : '💡'}</span>
            <span className="font-black text-xs text-slate-800">
              {lastValidation.isCorrect ? 'Mission Completed!' : 'Check Your Graph'}
            </span>
          </div>
          <span
            className="text-[11px] font-mono font-black px-1.5 py-0.2 rounded"
            style={{
              background: lastValidation.accuracy >= 80 ? '#DCFCE7' : '#FEE2E2',
              color: lastValidation.accuracy >= 80 ? '#15803D' : '#B91C1C',
            }}
          >
            {lastValidation.accuracy}%
          </span>
        </div>
        <div className="space-y-0.5 max-h-20 overflow-y-auto mb-2">
          {lastValidation.feedback.map((fb, i) => (
            <p key={i} className="text-[10.5px] text-slate-600 leading-tight">· {fb}</p>
          ))}
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            setShowFeedback(team, false);
          }}
          className="w-full py-1.5 rounded-lg font-bold text-xs text-white transition-all cursor-pointer shadow-xs"
          style={{ background: team === 'blue' ? '#2563EB' : '#DC2626' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── MAIN GRAPH STUDIO (BOTTOM-CORNER COMPACT CONSOLE) ──
export function GraphStudio({ team }: { team: Team }) {
  const teamState = useGraphworksStore((s) => s[team]);
  const currentMission = teamState.currentMission;
  const completedMissions = teamState.completedMissions;
  const totalScore = teamState.totalScore;
  const graphAccuracy = teamState.graphAccuracy;
  const checkGraph = useGraphworksStore((s) => s.checkGraph);
  const setTool = useGraphworksStore((s) => s.setTool);
  const clearGraph = useGraphworksStore((s) => s.clearGraph);
  const updateBarHeight = useGraphworksStore((s) => s.updateBarHeight);
  const addPlottedPoint = useGraphworksStore((s) => s.addPlottedPoint);
  const updatePlottedPoint = useGraphworksStore((s) => s.updatePlottedPoint);

  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const isBlue = team === 'blue';
  const teamColor = isBlue ? '#2563EB' : '#DC2626';
  const headerBg = isBlue ? 'bg-gradient-to-r from-blue-700 to-sky-600' : 'bg-gradient-to-r from-red-700 to-rose-600';
  const borderColor = isBlue ? 'border-blue-400/80 shadow-blue-500/20' : 'border-red-400/80 shadow-red-500/20';
  const teamName = isBlue ? 'BLUE' : 'RED';

  if (!currentMission) {
    return (
      <div className="w-full h-44 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center border border-slate-200 shadow-lg">
        <span className="text-xs font-bold text-slate-400">Loading {teamName} Mission...</span>
      </div>
    );
  }

  const { xAxis, yAxis, graphType } = currentMission;
  const selectedLabel = xAxis.labels[selectedIdx] ?? `Item ${selectedIdx + 1}`;

  // Get current value of selected data point
  let currentValue = 0;
  if (graphType === 'bar' || graphType === 'pie' || graphType === 'pictograph') {
    const bar = teamState.plottedBars[selectedIdx];
    currentValue = bar ? bar.height : 0;
  } else {
    const existing = teamState.plottedPoints.find((p) => p.label === selectedLabel);
    currentValue = existing ? existing.y : yAxis.min;
  }

  // Handle precision nudge buttons (±1, ±5, ±10)
  const handleNudge = (delta: number) => {
    soundManager.playKeypadBeep();
    const clamped = Math.max(yAxis.min, Math.min(yAxis.max, Math.round(currentValue + delta)));

    if (graphType === 'bar' || graphType === 'pie' || graphType === 'pictograph') {
      updateBarHeight(team, selectedIdx, clamped);
    } else {
      const existingIdx = teamState.plottedPoints.findIndex((p) => p.label === selectedLabel);
      if (existingIdx >= 0) {
        updatePlottedPoint(team, existingIdx, { y: clamped });
      } else {
        addPlottedPoint(team, { x: selectedIdx, y: clamped, label: selectedLabel, connected: true });
      }
    }
  };

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 ${borderColor} flex flex-col overflow-hidden text-slate-800 select-none`}
    >
      {/* ── 1. HEADER ── */}
      <div className={`px-2.5 py-1.5 ${headerBg} flex items-center justify-between text-white shadow-2xs`}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-black text-xs tracking-wider uppercase">{teamName} STUDIO</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="font-bold opacity-90">R{currentMission.round} · M{completedMissions + 1}</span>
          <span className="font-black bg-white/20 px-1.5 py-0.2 rounded font-mono">
            {graphAccuracy > 0 ? `${graphAccuracy}%` : `${totalScore}pts`}
          </span>
        </div>
      </div>

      {/* ── 2. BODY CONTENT (COMPACT PADDING) ── */}
      <div className="p-2 flex flex-col gap-1.5 relative">
        {/* Feedback Overlay */}
        <FeedbackPanel team={team} />

        {/* Mission Title & Instruction */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: teamColor }}>
              {currentMission.title}
            </span>
            <span className="text-[8.5px] font-bold text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
              {currentMission.graphType === 'pie' ? 'CIRCLE GRAPH' : currentMission.graphType.toUpperCase()}
            </span>
          </div>
          <p className="text-[10px] text-slate-600 line-clamp-1 leading-snug">
            {currentMission.instruction}
          </p>
        </div>

        {/* Horizontal Clickable Data Strip */}
        <DataStrip
          mission={currentMission}
          team={team}
          selectedIdx={selectedIdx}
          onSelectIdx={setSelectedIdx}
        />

        {/* Compact SVG Graph Canvas */}
        <GraphCanvas
          team={team}
          mission={currentMission}
          selectedIdx={selectedIdx}
          onSelectIdx={setSelectedIdx}
        />

        {/* Precision Nudge Controls (±1, ±5, ±10) */}
        <PrecisionControls
          label={selectedLabel}
          value={currentValue}
          unit={currentMission.unit}
          team={team}
          onNudge={handleNudge}
        />

        {/* Tools row */}
        <GraphTools
          team={team}
          selectedTool={teamState.selectedTool}
          onSelectTool={(tool) => setTool(team, tool)}
          onReset={() => clearGraph(team)}
        />

        {/* Check Graph Action Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            checkGraph(team);
          }}
          className={`w-full py-2 rounded-xl font-black text-xs text-white uppercase tracking-wider shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isBlue
              ? 'bg-gradient-to-r from-blue-600 to-sky-600 shadow-blue-500/25'
              : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/25'
          }`}
        >
          <span>CHECK GRAPH</span>
          <span>✓</span>
        </button>
      </div>
    </div>
  );
}
