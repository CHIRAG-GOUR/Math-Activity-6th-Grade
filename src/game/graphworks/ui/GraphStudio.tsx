// ============================================================
// GRAPHWORKS — GRAPH STUDIO PANEL
// Interactive graph construction interface for each team
// Supports line graphs, bar graphs, and coordinate graphs
// ============================================================
'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useGraphworksStore, type Team, type PlottedPoint, type MissionQuestion } from '../store/graphworksStore';

// ── CONSTANTS ──
const GRAPH_W = 340;
const GRAPH_H = 220;
const PADDING = { top: 15, right: 15, bottom: 30, left: 45 };
const PLOT_W = GRAPH_W - PADDING.left - PADDING.right;
const PLOT_H = GRAPH_H - PADDING.top - PADDING.bottom;

// ── SVG GRAPH CANVAS ──
interface GraphCanvasProps {
  team: Team;
  mission: MissionQuestion;
}

function GraphCanvas({ team, mission }: GraphCanvasProps) {
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

  // Convert SVG coordinates to value
  const svgToValue = useCallback((svgX: number, svgY: number) => {
    const x = Math.max(0, Math.min(PLOT_W, svgX - PADDING.left));
    const y = Math.max(0, Math.min(PLOT_H, svgY - PADDING.top));

    const idx = graphType === 'bar'
      ? Math.floor((x / PLOT_W) * xCount)
      : Math.round((x / PLOT_W) * (xCount - 1));

    const value = yMin + ((PLOT_H - y) / PLOT_H) * (yMax - yMin);
    const snapped = Math.round(value / (yStep / 2)) * (yStep / 2);

    return { idx: Math.min(idx, xCount - 1), value: Math.max(yMin, Math.min(yMax, snapped)) };
  }, [xCount, yMin, yMax, yStep, graphType]);

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
    const coords = getSVGCoords(e);
    const { idx, value } = svgToValue(coords.x, coords.y);

    if (graphType === 'bar') {
      updateBarHeight(team, idx, value);
      return;
    }

    if (selectedTool === 'addPoint') {
      const label = xAxis.labels[idx] ?? `${idx}`;
      // Check if point at this index exists
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
        return Math.hypot(px - coords.x, py - coords.y) < 12;
      });
      if (closest >= 0) removePlottedPoint(team, closest);
    }
  }, [getSVGCoords, svgToValue, graphType, selectedTool, plottedPoints, team, xAxis.labels,
    addPlottedPoint, updatePlottedPoint, removePlottedPoint, updateBarHeight, indexToX, valueToY]);

  // Handle drag for moving points/bars
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingIdx(idx);
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (draggingIdx === null) return;
    e.preventDefault();
    const coords = getSVGCoords(e);
    const { value } = svgToValue(coords.x, coords.y);

    if (graphType === 'bar') {
      updateBarHeight(team, draggingIdx, value);
    } else {
      updatePlottedPoint(team, draggingIdx, { y: value });
    }
  }, [draggingIdx, getSVGCoords, svgToValue, graphType, team, updateBarHeight, updatePlottedPoint]);

  const handleDragEnd = useCallback(() => {
    setDraggingIdx(null);
  }, []);

  // Y-axis gridlines and labels
  const yGridlines = [];
  for (let v = yMin; v <= yMax; v += yStep) {
    yGridlines.push(v);
  }

  // Sort plotted points by x position
  const sortedPoints = [...plottedPoints].sort((a, b) => a.x - b.x);

  // Build line path
  const linePath = sortedPoints.length > 1
    ? sortedPoints.map((p, i) => {
      const x = indexToX(p.x);
      const y = valueToY(p.y);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ')
    : '';

  const barWidth = PLOT_W / xCount * 0.65;
  const teamColor = team === 'blue' ? '#1976D2' : '#D32F2F';
  const teamColorLight = team === 'blue' ? '#BBDEFB' : '#FFCDD2';

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
      className="w-full h-full touch-none"
      style={{ background: '#FAFAFA', borderRadius: 6 }}
      onClick={handleGraphInteraction}
      onTouchStart={handleGraphInteraction}
      onMouseMove={handleDragMove}
      onTouchMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Grid */}
      {yGridlines.map((v) => {
        const y = valueToY(v);
        return (
          <g key={v}>
            <line x1={PADDING.left} y1={y} x2={GRAPH_W - PADDING.right} y2={y}
              stroke="#E0E0E0" strokeWidth={0.5} />
            <text x={PADDING.left - 4} y={y + 3} textAnchor="end"
              fill="#666" fontSize={8} fontFamily="Inter, sans-serif">{v}</text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {xAxis.labels.map((label, i) => {
        const x = indexToX(i);
        return (
          <text key={i} x={x} y={GRAPH_H - 5} textAnchor="middle"
            fill="#666" fontSize={7} fontFamily="Inter, sans-serif">{label}</text>
        );
      })}

      {/* Axes */}
      <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={GRAPH_H - PADDING.bottom}
        stroke="#333" strokeWidth={1.5} />
      <line x1={PADDING.left} y1={GRAPH_H - PADDING.bottom} x2={GRAPH_W - PADDING.right} y2={GRAPH_H - PADDING.bottom}
        stroke="#333" strokeWidth={1.5} />

      {/* Axis titles */}
      <text x={GRAPH_W / 2} y={GRAPH_H - 0} textAnchor="middle"
        fill="#333" fontSize={8} fontWeight="600" fontFamily="Inter, sans-serif">{xAxis.title}</text>
      <text x={8} y={GRAPH_H / 2} textAnchor="middle" transform={`rotate(-90, 8, ${GRAPH_H / 2})`}
        fill="#333" fontSize={8} fontWeight="600" fontFamily="Inter, sans-serif">{yAxis.title}</text>

      {/* BAR GRAPH */}
      {graphType === 'bar' && plottedBars.map((bar, i) => {
        const x = indexToX(i) - barWidth / 2;
        const y = valueToY(bar.height);
        const h = GRAPH_H - PADDING.bottom - y;
        return (
          <g key={i}>
            {/* Bar shadow/guide */}
            <rect x={x} y={PADDING.top} width={barWidth} height={PLOT_H}
              fill={teamColorLight} opacity={0.15} rx={2} />
            {/* Actual bar */}
            <rect x={x} y={y} width={barWidth} height={Math.max(0, h)}
              fill={teamColor} opacity={0.85} rx={2}
              style={{ cursor: 'ns-resize', transition: 'height 0.15s ease' }}
              onMouseDown={(e) => handleDragStart(e, i)}
              onTouchStart={(e) => handleDragStart(e, i)}
            />
            {/* Value label */}
            {bar.height > 0 && (
              <text x={x + barWidth / 2} y={y - 4} textAnchor="middle"
                fill={teamColor} fontSize={8} fontWeight="bold"
                fontFamily="Inter, sans-serif">{Math.round(bar.height)}</text>
            )}
            {/* Expected indicator (faded) */}
            {mission.expectedValues[i] !== undefined && (
              <line
                x1={x} y1={valueToY(mission.expectedValues[i])}
                x2={x + barWidth} y2={valueToY(mission.expectedValues[i])}
                stroke={teamColor} strokeWidth={1} strokeDasharray="3,2" opacity={0.25}
              />
            )}
          </g>
        );
      })}

      {/* LINE GRAPH */}
      {graphType === 'line' && (
        <>
          {/* Expected positions (guides) */}
          {mission.phase !== 'create' && dataTable.map((d, i) => {
            const x = indexToX(i);
            const y = valueToY(d.value);
            return (
              <circle key={`guide-${i}`} cx={x} cy={y} r={4}
                fill="none" stroke={teamColor} strokeWidth={0.8} strokeDasharray="2,2"
                opacity={0.2} />
            );
          })}

          {/* Connecting line */}
          {linePath && (
            <path d={linePath} fill="none" stroke={teamColor} strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          )}

          {/* Plotted points */}
          {sortedPoints.map((pt, i) => {
            const x = indexToX(pt.x);
            const y = valueToY(pt.y);
            const origIdx = plottedPoints.indexOf(pt);
            return (
              <g key={i}>
                {/* Hit area */}
                <circle cx={x} cy={y} r={12} fill="transparent"
                  style={{ cursor: selectedTool === 'movePoint' ? 'grab' : 'pointer' }}
                  onMouseDown={(e) => handleDragStart(e, origIdx)}
                  onTouchStart={(e) => handleDragStart(e, origIdx)}
                />
                {/* Visible point */}
                <circle cx={x} cy={y} r={5} fill={teamColor} stroke="#FFF" strokeWidth={1.5} />
                {/* Value label */}
                <text x={x} y={y - 8} textAnchor="middle"
                  fill={teamColor} fontSize={8} fontWeight="bold"
                  fontFamily="Inter, sans-serif">{Math.round(pt.y)}</text>
              </g>
            );
          })}
        </>
      )}

      {/* Empty state prompt */}
      {plottedPoints.length === 0 && plottedBars.every((b) => b.height === 0) && (
        <text x={GRAPH_W / 2} y={GRAPH_H / 2} textAnchor="middle"
          fill="#999" fontSize={11} fontFamily="Inter, sans-serif">
          Tap to plot data
        </text>
      )}
    </svg>
  );
}

// ── DATA TABLE ──
function DataTable({ mission, team }: { mission: MissionQuestion; team: Team }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="px-1.5 py-1 text-left font-semibold border-b border-gray-200"
              style={{ color: team === 'blue' ? '#1565C0' : '#C62828' }}>
              {mission.xAxis.title}
            </th>
            <th className="px-1.5 py-1 text-right font-semibold border-b border-gray-200"
              style={{ color: team === 'blue' ? '#1565C0' : '#C62828' }}>
              {mission.yAxis.title}
            </th>
          </tr>
        </thead>
        <tbody>
          {mission.dataTable.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="px-1.5 py-0.5 text-left font-medium text-gray-700">{row.label}</td>
              <td className="px-1.5 py-0.5 text-right font-mono font-bold text-gray-900">
                {mission.phase === 'complete' && mission.partialGraphData?.[i] === -1
                  ? <span className="text-orange-500">?</span>
                  : `${row.value}${mission.unit}`
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── GRAPH TOOLS ──
function GraphTools({ team }: { team: Team }) {
  const selectedTool = useGraphworksStore((s) => s[team].selectedTool);
  const setTool = useGraphworksStore((s) => s.setTool);
  const clearGraph = useGraphworksStore((s) => s.clearGraph);

  const teamColor = team === 'blue' ? '#1976D2' : '#D32F2F';

  const tools: { id: typeof selectedTool; icon: string; label: string }[] = [
    { id: 'addPoint', icon: '✚', label: 'Add' },
    { id: 'movePoint', icon: '↕', label: 'Move' },
    { id: 'erase', icon: '✕', label: 'Erase' },
  ];

  return (
    <div className="flex items-center gap-1">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setTool(team, tool.id)}
          className="flex items-center gap-0.5 px-2 py-1 rounded text-xs font-medium transition-all"
          style={{
            background: selectedTool === tool.id ? teamColor : '#F5F5F5',
            color: selectedTool === tool.id ? '#FFF' : '#555',
            border: `1px solid ${selectedTool === tool.id ? teamColor : '#DDD'}`,
          }}
        >
          <span>{tool.icon}</span>
          <span>{tool.label}</span>
        </button>
      ))}
      <button
        onClick={() => clearGraph(team)}
        className="ml-auto px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300 transition-all"
      >
        ↻ Reset
      </button>
    </div>
  );
}

// ── FEEDBACK PANEL ──
function FeedbackPanel({ team }: { team: Team }) {
  const lastValidation = useGraphworksStore((s) => s[team].lastValidation);
  const showFeedback = useGraphworksStore((s) => s[team].showFeedback);
  const setShowFeedback = useGraphworksStore((s) => s.setShowFeedback);

  if (!showFeedback || !lastValidation) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-sm rounded-xl">
      <div className="bg-white rounded-lg shadow-xl p-4 mx-3 max-w-[90%]"
        style={{ borderTop: `3px solid ${lastValidation.accuracy >= 80 ? '#4CAF50' : lastValidation.accuracy >= 50 ? '#FF9800' : '#F44336'}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{lastValidation.accuracy >= 80 ? '🎉' : lastValidation.accuracy >= 50 ? '📊' : '📝'}</span>
          <div>
            <div className="font-bold text-sm text-gray-800">
              {lastValidation.accuracy}% Accuracy
            </div>
            <div className="text-xs text-gray-500">
              {lastValidation.pointsCorrect}/{lastValidation.pointsTotal} values correct
            </div>
          </div>
        </div>
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {lastValidation.feedback.map((fb, i) => (
            <p key={i} className="text-xs text-gray-600">{fb}</p>
          ))}
        </div>
        <button
          onClick={() => setShowFeedback(team, false)}
          className="mt-3 w-full py-1.5 rounded font-semibold text-xs text-white transition-all"
          style={{ background: team === 'blue' ? '#1976D2' : '#D32F2F' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── INTERPRETATION PANEL ──
function InterpretationPanel({ team, mission }: { team: Team; mission: MissionQuestion }) {
  const interpretationAnswer = useGraphworksStore((s) => s[team].interpretationAnswer);
  const setInterpretationAnswer = useGraphworksStore((s) => s.setInterpretationAnswer);
  const submitInterpretation = useGraphworksStore((s) => s.submitInterpretation);

  if (!mission.interpretationQ) return null;

  return (
    <div className="mt-1.5 p-2 rounded-lg" style={{ background: team === 'blue' ? '#E3F2FD' : '#FFEBEE' }}>
      <p className="text-xs font-semibold text-gray-800 mb-1">📝 {mission.interpretationQ}</p>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={interpretationAnswer}
          onChange={(e) => setInterpretationAnswer(team, e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 px-2 py-1 text-xs rounded border border-gray-300 bg-white focus:outline-none focus:ring-1"
          style={{ focusRingColor: team === 'blue' ? '#1976D2' : '#D32F2F' } as React.CSSProperties}
        />
        <button
          onClick={() => submitInterpretation(team)}
          className="px-3 py-1 rounded text-xs font-bold text-white transition-all"
          style={{ background: team === 'blue' ? '#1976D2' : '#D32F2F' }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

// ── CREATE MODE CONDITIONS ──
function CreateConditions({ mission, team }: { mission: MissionQuestion; team: Team }) {
  if (!mission.createConditions) return null;

  return (
    <div className="mt-1.5 p-2 rounded-lg" style={{ background: team === 'blue' ? '#E3F2FD' : '#FFEBEE' }}>
      <p className="text-xs font-bold text-gray-800 mb-1">📋 Your graph must satisfy:</p>
      <ul className="space-y-0.5">
        {mission.createConditions.map((cond, i) => (
          <li key={i} className="flex items-start gap-1 text-xs text-gray-700">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>{cond}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── MAIN GRAPH STUDIO ──
export function GraphStudio({ team }: { team: Team }) {
  const teamState = useGraphworksStore((s) => s[team]);
  const currentMission = teamState.currentMission;
  const completedMissions = teamState.completedMissions;
  const totalScore = teamState.totalScore;
  const graphAccuracy = teamState.graphAccuracy;
  const cityLevel = teamState.cityLevel;
  const checkGraph = useGraphworksStore((s) => s.checkGraph);
  const runGraph = useGraphworksStore((s) => s.runGraph);

  const currentRound = useGraphworksStore((s) => s.currentRound);
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const isRunningGraph = useGraphworksStore((s) => s.isRunningGraph);
  const runningTeam = useGraphworksStore((s) => s.runningTeam);

  const teamColor = team === 'blue' ? '#1976D2' : '#D32F2F';
  const teamBg = team === 'blue' ? 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' : 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)';
  const teamName = team === 'blue' ? 'BLUE' : 'RED';

  if (!currentMission) {
    return (
      <div className="relative rounded-xl p-3 shadow-lg overflow-hidden"
        style={{
          background: teamBg,
          border: `2px solid ${teamColor}30`,
          minHeight: 200,
        }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ background: teamColor }} />
          <h3 className="font-black text-sm tracking-wider" style={{ color: teamColor }}>
            {teamName} GRAPH STUDIO
          </h3>
        </div>
        <p className="text-xs text-gray-500 mt-4">Waiting for mission...</p>
      </div>
    );
  }

  const isThisTeamRunning = isRunningGraph && runningTeam === team;

  return (
    <div className="relative rounded-xl shadow-lg overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: `2px solid ${teamColor}`,
      }}>
      {/* HEADER */}
      <div className="px-3 py-2 flex items-center justify-between"
        style={{ background: teamColor }}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <span className="font-black text-white text-xs tracking-wider">{teamName} GRAPH STUDIO</span>
        </div>
        <div className="flex items-center gap-3 text-white/90 text-[10px] font-semibold">
          <span>ROUND {currentRound}/5</span>
          <span>⭐ {totalScore}</span>
        </div>
      </div>

      {/* MISSION INFO */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: `${teamColor}15`, color: teamColor }}>
            {currentMission.graphType === 'line' ? '📈 Line Graph' :
              currentMission.graphType === 'bar' ? '📊 Bar Graph' :
                currentMission.graphType === 'pictograph' ? '🖼 Pictograph' : '📍 Coordinate'}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            Mission {completedMissions + 1}
          </span>
        </div>
        <h4 className="font-bold text-xs text-gray-800 leading-tight">{currentMission.title}</h4>
        <p className="text-[10px] text-gray-500 leading-snug mt-0.5">{currentMission.instruction}</p>
      </div>

      {/* DATA TABLE */}
      <div className="px-3 py-1.5 border-b border-gray-100 max-h-24 overflow-y-auto">
        <DataTable mission={currentMission} team={team} />
      </div>

      {/* GRAPH TOOLS */}
      <div className="px-3 py-1.5 border-b border-gray-100">
        <GraphTools team={team} />
      </div>

      {/* GRAPH CANVAS */}
      <div className="px-2 py-1.5 relative">
        <GraphCanvas team={team} mission={currentMission} />

        {/* Running overlay */}
        {isThisTeamRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded">
            <div className="bg-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: `${teamColor} transparent ${teamColor} ${teamColor}` }} />
              <span className="text-xs font-bold" style={{ color: teamColor }}>Running graph...</span>
            </div>
          </div>
        )}
      </div>

      {/* CREATE CONDITIONS */}
      {currentMission.phase === 'create' && (
        <div className="px-3">
          <CreateConditions mission={currentMission} team={team} />
        </div>
      )}

      {/* INTERPRETATION */}
      {currentMission.interpretationQ && currentMission.phase === 'interpret' && (
        <div className="px-3">
          <InterpretationPanel team={team} mission={currentMission} />
        </div>
      )}

      {/* CHECK BUTTON */}
      <div className="px-3 py-2">
        <button
          onClick={() => checkGraph(team)}
          disabled={isRunningGraph}
          className="w-full py-2 rounded-lg font-black text-sm text-white tracking-wide transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, ${teamColor} 0%, ${team === 'blue' ? '#0D47A1' : '#B71C1C'} 100%)`,
            boxShadow: `0 3px 12px ${teamColor}40`,
          }}
        >
          ✓ CHECK GRAPH
        </button>
      </div>

      {/* TEAM STATUS BAR */}
      <div className="px-3 py-1.5 flex items-center justify-between text-[10px]"
        style={{ background: `${teamColor}08`, borderTop: `1px solid ${teamColor}15` }}>
        <span className="font-semibold" style={{ color: teamColor }}>
          City Lv.{cityLevel}
        </span>
        <span className="text-gray-500">Accuracy: {graphAccuracy}%</span>
        <span className="text-gray-500">Score: {totalScore}</span>
      </div>

      {/* FEEDBACK OVERLAY */}
      <FeedbackPanel team={team} />
    </div>
  );
}
