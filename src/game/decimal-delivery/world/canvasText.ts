// ============================================================
// THE DECIMAL DELIVERY NETWORK — IN-WORLD TEXT
//
// Shipping labels, the scale's digital readout, order status plates and depot
// signage are drawn onto small canvases and used as textures, so they are a
// physical part of the object they belong to (section 52) rather than a
// floating HTML card.
//
// Uses only the system UI font stack — no font files, no CDN, nothing that can
// fail to load in a classroom with patchy internet.
// ============================================================

import * as THREE from 'three';

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
const MONO = '"Consolas", "Menlo", "DejaVu Sans Mono", monospace';

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function toTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

/** Fit text to a max width by shrinking the font. */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, size: number, weight: string, family = FONT) {
  let s = size;
  ctx.font = `${weight} ${s}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && s > 10) {
    s -= 2;
    ctx.font = `${weight} ${s}px ${family}`;
  }
}

// ── SHIPPING LABEL ──────────────────────────────────────────────────────────

export interface LabelData {
  orderId: string;
  destination: string;
  rows: { label: string; value: string }[];
  teamColor: string;
}

/** A printed shipping label for the top of a parcel. */
export function makeShippingLabel(d: LabelData): THREE.CanvasTexture {
  const W = 256;
  const H = 256;
  const [c, ctx] = makeCanvas(W, H);

  ctx.fillStyle = '#fbfcfd';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, W - 6, H - 6);

  // Team colour band with the order number.
  ctx.fillStyle = d.teamColor;
  ctx.fillRect(6, 6, W - 12, 52);
  ctx.fillStyle = '#ffffff';
  fitText(ctx, `ORDER ${d.orderId}`, W - 28, 34, '900');
  ctx.textBaseline = 'middle';
  ctx.fillText(`ORDER ${d.orderId}`, 14, 33);

  ctx.fillStyle = '#374151';
  fitText(ctx, d.destination, W - 28, 24, '800');
  ctx.fillText(d.destination, 14, 80);

  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(12, 98); ctx.lineTo(W - 12, 98); ctx.stroke();
  ctx.setLineDash([]);

  const rows = d.rows.slice(0, 3);
  rows.forEach((r, i) => {
    const y = 124 + i * 44;
    ctx.fillStyle = '#6b7280';
    fitText(ctx, r.label, 110, 17, '700');
    ctx.fillText(r.label, 14, y);
    ctx.fillStyle = '#111827';
    fitText(ctx, r.value, 128, 30, '900', MONO);
    const w = ctx.measureText(r.value).width;
    ctx.fillText(r.value, W - 14 - w, y);
  });

  // Barcode strip, purely decorative but it reads as a real label.
  ctx.fillStyle = '#111827';
  let x = 14;
  const seed = d.orderId.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0);
  for (let i = 0; x < W - 14; i++) {
    const bw = 2 + ((seed * (i + 3)) % 4);
    if (i % 2 === 0) ctx.fillRect(x, H - 36, bw, 24);
    x += bw + 1;
  }

  return toTexture(c);
}

// ── LIVE DISPLAYS ───────────────────────────────────────────────────────────
// Redrawn only when their text actually changes, so a display that sits on
// the same reading costs nothing per frame.

export class LiveDisplay {
  readonly texture: THREE.CanvasTexture;
  private ctx: CanvasRenderingContext2D;
  private last = '';
  private w: number;
  private h: number;

  constructor(w: number, h: number) {
    const [c, ctx] = makeCanvas(w, h);
    this.w = w;
    this.h = h;
    this.ctx = ctx;
    this.texture = toTexture(c);
  }

  /** Seven-segment style scale readout. */
  drawScale(value: number, state: 'idle' | 'working' | 'ok' | 'error') {
    const text = Number.isNaN(value) ? '--.--' : value.toFixed(2);
    const key = `${text}|${state}`;
    if (key === this.last) return;
    this.last = key;

    const { ctx, w, h } = this;
    ctx.fillStyle = '#0b1d2a';
    ctx.fillRect(0, 0, w, h);
    const color = state === 'ok' ? '#4ade80' : state === 'error' ? '#fb923c' : '#7dd3fc';

    ctx.fillStyle = '#16384d';
    ctx.font = `900 ${Math.round(h * 0.52)}px ${MONO}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.fillText('88.88', w - 70, h * 0.46);   // unlit segment ghosting
    ctx.fillStyle = color;
    ctx.fillText(text, w - 70, h * 0.46);

    ctx.textAlign = 'left';
    ctx.font = `800 ${Math.round(h * 0.26)}px ${FONT}`;
    ctx.fillText('kg', w - 62, h * 0.52);

    ctx.font = `800 ${Math.round(h * 0.15)}px ${FONT}`;
    ctx.fillStyle = color;
    const caption = state === 'ok' ? 'APPROVED' : state === 'error' ? 'CHECK FIGURE'
      : Number.isNaN(value) ? 'WEIGHT WITHHELD' : state === 'working' ? 'WEIGHING' : 'READY';
    ctx.fillText(caption, 14, h * 0.86);
    this.texture.needsUpdate = true;
  }

  /** Order status plate: WAITING / PROCESSING / APPROVED / ... */
  drawStatus(word: string, lane: string) {
    const key = `${word}|${lane}`;
    if (key === this.last) return;
    this.last = key;
    const { ctx, w, h } = this;

    const palette: Record<string, [string, string]> = {
      WAITING: ['#e5e7eb', '#374151'],
      PROCESSING: ['#fcd34d', '#78350f'],
      APPROVED: ['#86efac', '#14532d'],
      'IN TRANSIT': ['#93c5fd', '#1e3a8a'],
      DELIVERED: ['#4ade80', '#14532d'],
      REJECTED: ['#fdba74', '#7c2d12'],
    };
    const [bg, fg] = palette[word] ?? palette.WAITING;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = bg;
    ctx.fillRect(6, 6, w - 12, h - 12);
    ctx.fillStyle = fg;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.font = `900 ${Math.round(h * 0.34)}px ${FONT}`;
    ctx.fillText(`BELT ${lane}`, 16, h / 2);
    ctx.textAlign = 'right';
    fitText(ctx, word, w * 0.62, Math.round(h * 0.42), '900');
    ctx.fillText(word, w - 16, h / 2);
    this.texture.needsUpdate = true;
  }

  /** General two-line sign. */
  drawSign(title: string, subtitle: string, bg: string, fg = '#ffffff') {
    const key = `${title}|${subtitle}|${bg}`;
    if (key === this.last) return;
    this.last = key;
    const { ctx, w, h } = this;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    fitText(ctx, title, w - 40, Math.round(h * 0.34), '900');
    ctx.fillText(title, w / 2, subtitle ? h * 0.38 : h / 2);
    if (subtitle) {
      fitText(ctx, subtitle, w - 40, Math.round(h * 0.2), '800');
      ctx.fillText(subtitle, w / 2, h * 0.72);
    }
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}

/** Static sign texture (company branding, zone names). */
export function makeSign(title: string, subtitle: string, bg: string, w = 512, h = 160, fg = '#ffffff'): THREE.CanvasTexture {
  const d = new LiveDisplay(w, h);
  d.drawSign(title, subtitle, bg, fg);
  return d.texture;
}
