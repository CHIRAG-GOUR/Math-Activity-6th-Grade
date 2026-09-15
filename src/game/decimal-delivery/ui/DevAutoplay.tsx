// ============================================================
// THE DECIMAL DELIVERY NETWORK — DEVELOPMENT AUTOPLAY
//
// DEVELOPMENT ONLY. Visit /decimal-delivery?autoplay=1 under `next dev` to
// watch a full match play itself: both teams answer after a short "thinking"
// pause, Blue always correctly, Red missing some parcels twice so the reject
// path is exercised too. Also exposes the store and simulation on
// window.__depot for inspection from the browser devtools.
//
// Compiled out of production builds: the whole component returns null unless
// NODE_ENV is 'development', and nothing here is reachable from the UI.
// ============================================================

'use client';

import { useEffect } from 'react';
import { useDepotStore } from '../store/depotStore';
import { sim } from '../engine/depotSim';
import { LANES } from '../engine/depotLayout';
import type { TeamId } from '../types';

export const DevAutoplay: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const params = new URLSearchParams(window.location.search);
    (window as unknown as { __depot: unknown }).__depot = { store: useDepotStore, sim };
    if (params.get('autoplay') !== '1') return;

    const think = Number(params.get('think') ?? '5') * 1000;
    const plans = new Map<string, { at: number; tries: number; reject: boolean }>();
    let redCount = 0;

    if (useDepotStore.getState().phase === 'intro') useDepotStore.getState().startGame();

    const id = setInterval(() => {
      const st = useDepotStore.getState();
      if (st.phase !== 'operating' && st.phase !== 'tie_breaker') return;
      const now = Date.now();

      for (const team of ['blue', 'red'] as TeamId[]) {
        for (const lane of LANES) {
          const l = st[team].lanes[lane];
          if (l.status !== 'ready' || !l.active) continue;
          const { order, parcelId } = l.active;
          let plan = plans.get(parcelId);
          if (!plan) {
            const reject = team === 'red' && ++redCount % 4 === 0;
            plan = { at: now + think * (0.6 + Math.random() * 0.8), tries: 0, reject };
            plans.set(parcelId, plan);
          }
          if (now < plan.at) continue;
          plan.at = now + 1200;

          const value = plan.reject ? order.correctAnswer + 1 : order.correctAnswer;
          const s = useDepotStore.getState();
          s.clearInput(team, lane);
          for (const ch of value.toFixed(order.decimals)) s.pressKey(team, lane, ch);
          s.submit(team, lane);
          plan.tries++;
        }
      }
    }, 250);

    return () => clearInterval(id);
  }, []);

  return null;
};
