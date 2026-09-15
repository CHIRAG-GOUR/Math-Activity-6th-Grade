// ============================================================
// THE DECIMAL DELIVERY NETWORK — TOUCHSCREEN KEYPAD
//
// Built for a large classroom touchscreen, not a mouse:
//   - onPointerDown, so a tap registers immediately rather than waiting for a
//     full click, and a drag off the button cannot swallow the press
//   - touch-none, so a fast tap is never interpreted as a scroll gesture
//   - each team's keypad writes only to its own side of the store, so both
//     players can hammer their pads at the same time without interfering
//   - nothing here depends on hover
// ============================================================

'use client';

import React from 'react';
import type { TeamId } from '../types';
import { useDepotStore } from '../store/depotStore';

interface Props {
  team: TeamId;
  /** Disabled while the parcel is still arriving or already processing. */
  live: boolean;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const DepotKeypad: React.FC<Props> = ({ team, live }) => {
  const pressKey = useDepotStore((s) => s.pressKey);
  const clearInput = useDepotStore((s) => s.clearInput);
  const backspace = useDepotStore((s) => s.backspace);
  const submit = useDepotStore((s) => s.submit);

  const accent = team === 'blue' ? 'blue' : 'red';

  const keyClass =
    'select-none touch-none flex items-center justify-center rounded-2xl ' +
    'border-2 border-slate-300 bg-white text-slate-900 font-black ' +
    'text-3xl xl:text-4xl h-14 xl:h-16 shadow-sm ' +
    'active:scale-95 active:bg-slate-100 transition-transform disabled:opacity-40';

  return (
    <div className={`flex flex-col gap-2 ${live ? '' : 'opacity-50 pointer-events-none'}`}>
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            disabled={!live}
            onPointerDown={(e) => { e.preventDefault(); pressKey(team, k); }}
            className={keyClass}
          >
            {k}
          </button>
        ))}

        {/* CLEAR sits under 7 so the digits keep a clean 3-wide block. */}
        <button
          type="button"
          disabled={!live}
          onPointerDown={(e) => { e.preventDefault(); clearInput(team); }}
          className={
            'select-none touch-none flex items-center justify-center rounded-2xl border-2 ' +
            'border-slate-400 bg-slate-200 text-slate-700 font-black text-base xl:text-lg ' +
            'h-14 xl:h-16 active:scale-95 transition-transform disabled:opacity-40'
          }
        >
          CLEAR
        </button>

        <button
          type="button"
          disabled={!live}
          onPointerDown={(e) => { e.preventDefault(); pressKey(team, '0'); }}
          className={keyClass}
        >
          0
        </button>

        {/* The decimal point is the whole subject of the game, so it gets its
            own colour and a larger glyph rather than hiding among the digits. */}
        <button
          type="button"
          disabled={!live}
          onPointerDown={(e) => { e.preventDefault(); pressKey(team, '.'); }}
          className={
            'select-none touch-none flex items-end justify-center rounded-2xl border-2 pb-2 ' +
            `border-amber-400 bg-amber-300 text-slate-900 font-black text-4xl xl:text-5xl ` +
            'h-14 xl:h-16 shadow-sm active:scale-95 transition-transform disabled:opacity-40'
          }
          aria-label="decimal point"
        >
          .
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          disabled={!live}
          onPointerDown={(e) => { e.preventDefault(); backspace(team); }}
          className={
            'select-none touch-none col-span-1 flex items-center justify-center rounded-2xl ' +
            'border-2 border-slate-400 bg-slate-200 text-slate-700 font-black text-2xl ' +
            'h-14 xl:h-16 active:scale-95 transition-transform disabled:opacity-40'
          }
          aria-label="backspace"
        >
          ⌫
        </button>

        {/* PROCESS is the largest control and always high contrast — it must
            never become unreadable at classroom distance. */}
        <button
          type="button"
          disabled={!live}
          onPointerDown={(e) => { e.preventDefault(); submit(team); }}
          className={
            'select-none touch-none col-span-2 flex items-center justify-center rounded-2xl ' +
            'border-b-4 font-black text-lg xl:text-xl tracking-wide h-14 xl:h-16 ' +
            'active:scale-95 active:border-b-2 transition-transform disabled:opacity-40 ' +
            (accent === 'blue'
              ? 'bg-blue-600 border-blue-900 text-white'
              : 'bg-red-600 border-red-900 text-white')
          }
        >
          PROCESS ORDER
        </button>
      </div>
    </div>
  );
};
