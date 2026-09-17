// ============================================================
// THE CHOCOLATE FACTORY — NPC DEBUG VIEW (development only)
//
// Open the activity with ?debug=npc to see, for every worker:
//   the walkway graph, their current route, their destination marker,
// and (in the DOM panel) state, task, target, path length, progress,
// stuck timer, recoveries and navigation failures — plus any production
// fallbacks the foreman had to use. Nothing here renders without the flag.
// ============================================================

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TeamId } from '../types';
import { sim } from '../engine/factorySim';
import { graphSegments, stationPos } from '../engine/crewNav';

export function npcDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('debug') === 'npc';
}

const MAX_PTS = 16;

const WorkerRoute: React.FC<{ team: TeamId; index: number }> = ({ team, index }) => {
  const line = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_PTS * 3), 3));
    const mat = new THREE.LineBasicMaterial({ color: team === 'blue' ? '#22d3ee' : '#fb923c', depthTest: false });
    const l = new THREE.Line(geo, mat);
    l.renderOrder = 999;
    l.frustumCulled = false;
    return l;
  }, [team]);
  const marker = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const w = sim[team].crew[index];
    if (!w) return;
    const attr = line.geometry.getAttribute('position') as THREE.BufferAttribute;
    const walking = w.state === 'WALK_TO_TARGET' && w.path.length >= 2;
    const pts = walking ? w.path.slice(0, MAX_PTS) : [];
    pts.forEach((p, i) => attr.setXYZ(i, p.x, 0.15, p.z));
    attr.needsUpdate = true;
    line.geometry.setDrawRange(0, pts.length);
    if (marker.current) {
      marker.current.visible = !!w.task;
      if (w.task) {
        const p = stationPos(team, w.task.station);
        marker.current.position.set(p.x, 0.12, p.z);
      }
    }
  });

  return (
    <>
      <primitive object={line} />
      <mesh ref={marker} rotation={[-Math.PI / 2, 0, 0]} renderOrder={999}>
        <ringGeometry args={[0.35, 0.55, 20]} />
        <meshBasicMaterial color={team === 'blue' ? '#22d3ee' : '#fb923c'} depthTest={false} transparent opacity={0.9} />
      </mesh>
    </>
  );
};

const Graph: React.FC<{ team: TeamId }> = ({ team }) => {
  const geo = useMemo(() => {
    const pts: number[] = [];
    for (const [a, b] of graphSegments(team)) pts.push(a.x, 0.08, a.z, b.x, 0.08, b.z);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [team]);
  return (
    <lineSegments geometry={geo} renderOrder={998}>
      <lineBasicMaterial color="#a3e635" depthTest={false} transparent opacity={0.55} />
    </lineSegments>
  );
};

export const CrewDebug3D: React.FC = () => (
  <>
    {(['blue', 'red'] as TeamId[]).map((team) => (
      <group key={team}>
        <Graph team={team} />
        {sim[team].crew.map((w, i) => <WorkerRoute key={w.id} team={team} index={i} />)}
      </group>
    ))}
  </>
);

interface Row {
  id: string; label: string; state: string; task: string; target: string;
  path: number; progress: number; stuck: number; recoveries: number; failures: number; carry: string;
}

function snapshot(team: TeamId) {
  const s = sim[team];
  const rows: Row[] = s.crew.map((w) => ({
    id: w.id, label: w.label, state: w.state,
    task: w.task?.type ?? '—', target: w.task?.station ?? '—',
    path: w.state === 'WALK_TO_TARGET' ? w.pathNodes.length : 0,
    progress: Math.round((w.task?.progress ?? 0) * 100),
    stuck: w.stuckT, recoveries: w.recoveries, failures: w.navFailures,
    carry: w.pushingCart ? `cart(${s.cart.boxes})` : w.carry,
  }));
  return {
    rows,
    step: `${s.stepIndex + 1} ${s.phase}${s.phase === 'running' ? (s.machineOn ? ' · machine ON' : ' · waiting for worker') : ''}`,
    logistics: s.logistics,
    fallbacks: s.fallbacks,
    lastFallback: s.lastFallback,
  };
}

export const CrewDebugPanel: React.FC = () => {
  const [data, setData] = useState(() => ({ blue: snapshot('blue'), red: snapshot('red') }));
  useEffect(() => {
    const id = setInterval(() => setData({ blue: snapshot('blue'), red: snapshot('red') }), 250);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed z-50 top-16 left-1/2 -translate-x-1/2 w-[min(760px,60vw)] max-h-[46vh] overflow-y-auto rounded-xl bg-slate-950/88 text-[10px] font-mono text-slate-100 p-2 shadow-2xl pointer-events-none">
      {(['blue', 'red'] as TeamId[]).map((team) => {
        const d = data[team];
        return (
          <div key={team} className="mb-2">
            <div className={team === 'blue' ? 'text-cyan-300 font-bold' : 'text-orange-300 font-bold'}>
              {team.toUpperCase()} · STEP {d.step} · LOGISTICS {d.logistics} · FALLBACKS {d.fallbacks}{d.lastFallback ? ` (${d.lastFallback})` : ''}
            </div>
            <table className="w-full">
              <tbody>
                {d.rows.map((r) => (
                  <tr key={r.id} className={r.failures > 0 || r.stuck > 0 ? 'text-rose-300' : ''}>
                    <td className="pr-2 whitespace-nowrap">{r.label}</td>
                    <td className="pr-2">{r.state}</td>
                    <td className="pr-2">{r.task}</td>
                    <td className="pr-2">→ {r.target}</td>
                    <td className="pr-2">path {r.path}</td>
                    <td className="pr-2">{r.progress}%</td>
                    <td className="pr-2">{r.carry}</td>
                    <td className="pr-2">stuck {r.stuck.toFixed(0)}s</td>
                    <td>rec {r.recoveries} · fail {r.failures}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};
