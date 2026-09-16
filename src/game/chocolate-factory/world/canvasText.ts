// ============================================================
// THE CHOCOLATE FACTORY — CANVAS-DRAWN SIGNAGE AND DISPLAYS
//
// All lettering in the 3D world is painted into canvas textures: factory
// signage, the fraction scale down the side of each measuring tank, machine
// readouts and the central scoreboard. No font files, no CDN, and a live
// display only repaints when its text actually changes.
// ============================================================

import * as THREE from 'three';

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return { c, ctx: c.getContext('2d')! };
}

function texture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Factory / building sign: bold title over an optional subtitle. */
export function makeSign(
  title: string, subtitle = '', bg = '#2563eb', fg = '#ffffff', w = 512, h = 160
): THREE.CanvasTexture {
  const { c, ctx } = canvas(w, h);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.fillRect(0, 0, w, h * 0.42);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, w - 8, h - 8);

  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${subtitle ? h * 0.36 : h * 0.46}px system-ui, sans-serif`;
  ctx.fillText(title, w / 2, subtitle ? h * 0.38 : h * 0.52, w * 0.92);
  if (subtitle) {
    ctx.font = `700 ${h * 0.19}px system-ui, sans-serif`;
    ctx.globalAlpha = 0.9;
    ctx.fillText(subtitle, w / 2, h * 0.72, w * 0.92);
    ctx.globalAlpha = 1;
  }
  return texture(c);
}

/**
 * The fraction scale printed down the side of a measuring tank: FULL, 3/4,
 * 1/2, 1/4 and EMPTY, positioned so a mark sits exactly at its own height.
 */
export function makeTankScale(accent = '#2563eb'): THREE.CanvasTexture {
  const w = 256, h = 512;
  const { c, ctx } = canvas(w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.90)';
  ctx.fillRect(0, 0, w * 0.62, h);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, w * 0.62 - 6, h - 6);

  const marks: { label: string; frac: number; major: boolean }[] = [
    { label: 'FULL', frac: 1, major: true },
    { label: '3/4', frac: 0.75, major: true },
    { label: '1/2', frac: 0.5, major: true },
    { label: '1/4', frac: 0.25, major: true },
    { label: '1/8', frac: 0.125, major: false },
    { label: '5/8', frac: 0.625, major: false },
    { label: '7/8', frac: 0.875, major: false },
    { label: '3/8', frac: 0.375, major: false },
  ];

  for (const m of marks) {
    // Canvas Y is inverted relative to tank height.
    const y = h - m.frac * h;
    ctx.strokeStyle = m.major ? '#1f2937' : '#94a3b8';
    ctx.lineWidth = m.major ? 6 : 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.62 - (m.major ? 78 : 44), y);
    ctx.lineTo(w * 0.62 - 8, y);
    ctx.stroke();
    if (m.major) {
      ctx.fillStyle = '#111827';
      ctx.font = '900 46px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.label, 12, Math.min(h - 26, Math.max(26, y)));
    }
  }
  return texture(c);
}

/**
 * A repaint-on-change readout (quality %, temperature, scoreboard).
 * `draw` receives the 2D context and the canvas size.
 */
export class LiveDisplay {
  readonly texture: THREE.CanvasTexture;
  private ctx: CanvasRenderingContext2D;
  private w: number;
  private h: number;
  private last = '';

  constructor(w: number, h: number) {
    const { c, ctx } = canvas(w, h);
    this.ctx = ctx; this.w = w; this.h = h;
    this.texture = texture(c);
  }

  /** `key` identifies the content; the canvas only repaints when it changes. */
  update(key: string, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
    if (key === this.last) return;
    this.last = key;
    this.ctx.clearRect(0, 0, this.w, this.h);
    draw(this.ctx, this.w, this.h);
    this.texture.needsUpdate = true;
  }

  dispose() { this.texture.dispose(); }
}

/** Machine readout: a label with a big value on a dark instrument panel. */
export function drawReadout(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  label: string, value: string, tint = '#4ade80'
) {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, w - 6, h - 6);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#7d8da6';
  ctx.font = `700 ${h * 0.2}px system-ui, sans-serif`;
  ctx.fillText(label, w / 2, h * 0.26, w * 0.9);

  ctx.fillStyle = tint;
  ctx.font = `900 ${h * 0.46}px system-ui, sans-serif`;
  ctx.fillText(value, w / 2, h * 0.64, w * 0.9);
}

/** The central factory scoreboard: BLUE vs RED across three live metrics. */
export function drawScoreboard(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  blue: { orders: number; quality: number; deliveries: number },
  red: { orders: number; quality: number; deliveries: number }
) {
  ctx.fillStyle = '#10151f';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#2b3446';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, w - 8, h - 8);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = `900 ${h * 0.12}px system-ui, sans-serif`;
  ctx.fillText('LIVE PRODUCTION', w / 2, h * 0.12, w * 0.8);

  ctx.font = `900 ${h * 0.13}px system-ui, sans-serif`;
  ctx.fillStyle = '#60a5fa';
  ctx.fillText('BLUE', w * 0.24, h * 0.32, w * 0.4);
  ctx.fillStyle = '#f87171';
  ctx.fillText('RED', w * 0.76, h * 0.32, w * 0.4);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(w / 2, h * 0.24); ctx.lineTo(w / 2, h * 0.92); ctx.stroke();

  const rows: [string, number, number][] = [
    ['ORDERS', blue.orders, red.orders],
    ['QUALITY', blue.quality, red.quality],
    ['DELIVERIES', blue.deliveries, red.deliveries],
  ];
  rows.forEach(([label, b, r], i) => {
    const y = h * (0.5 + i * 0.17);
    ctx.fillStyle = '#94a3b8';
    ctx.font = `700 ${h * 0.1}px system-ui, sans-serif`;
    ctx.fillText(label, w / 2, y);
    ctx.fillStyle = '#dbeafe';
    ctx.font = `900 ${h * 0.14}px system-ui, sans-serif`;
    ctx.fillText(label === 'QUALITY' ? `${b}%` : `${b}`, w * 0.22, y);
    ctx.fillStyle = '#fee2e2';
    ctx.fillText(label === 'QUALITY' ? `${r}%` : `${r}`, w * 0.78, y);
  });
}
