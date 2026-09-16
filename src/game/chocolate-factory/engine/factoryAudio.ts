// ============================================================
// THE CHOCOLATE FACTORY — SOUND
//
// Web Audio synthesis on one master bus: machine sounds for the events the
// simulation emits, plus a quiet factory bed (motor hum and air handling)
// so the world sounds like it is running. No external files, so nothing can
// 404 and silently kill the audio.
//
// Browsers block audio until a real gesture, so `unlock()` is called from the
// START button.
// ============================================================

'use client';

import type { FactoryEvent } from '../types';

class FactoryAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bedGain: GainNode | null = null;
  private bedNodes: AudioScheduledSourceNode[] = [];
  private muted = false;
  private lastAt = new Map<string, number>();

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const Ctor = window.AudioContext
        || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    if (this.ctx && !this.master) {
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-15, this.ctx.currentTime);
      comp.ratio.setValueAtTime(7, this.ctx.currentTime);
      comp.connect(this.ctx.destination);
      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
      this.master.connect(comp);
    }
  }

  unlock() {
    this.init();
    this.startBed();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.03);
  }

  private allow(key: string, gap: number): boolean {
    if (!this.ctx) return false;
    const now = this.ctx.currentTime;
    const prev = this.lastAt.get(key) ?? -999;
    if (now - prev < gap) return false;
    this.lastAt.set(key, now);
    return true;
  }

  private tone(from: number, to: number, dur: number, type: OscillatorType, peak: number, delay = 0) {
    this.init();
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + Math.min(0.03, dur * 0.3));
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain); gain.connect(this.master);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  private noise(dur: number, cutFrom: number, cutTo: number, peak: number) {
    this.init();
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(cutFrom, t);
    filt.frequency.exponentialRampToValueAtTime(Math.max(60, cutTo), t + dur);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(peak, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt); filt.connect(gain); gain.connect(this.master);
    src.start(t); src.stop(t + dur);
  }

  /** Quiet, continuous factory bed: motor hum plus air handling. */
  private startBed() {
    if (!this.ctx || !this.master || this.bedNodes.length) return;
    const t = this.ctx.currentTime;
    this.bedGain = this.ctx.createGain();
    this.bedGain.gain.setValueAtTime(0, t);
    this.bedGain.gain.linearRampToValueAtTime(0.05, t + 2.5);
    this.bedGain.connect(this.master);

    const len = Math.floor(this.ctx.sampleRate * 4);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const air = this.ctx.createBufferSource();
    air.buffer = buf; air.loop = true;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(380, t);
    air.connect(lp); lp.connect(this.bedGain);
    air.start(t);
    this.bedNodes.push(air);

    const hum = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    hum.type = 'sawtooth';
    hum.frequency.setValueAtTime(54, t);
    humGain.gain.setValueAtTime(0.3, t);
    const humLp = this.ctx.createBiquadFilter();
    humLp.type = 'lowpass'; humLp.frequency.setValueAtTime(170, t);
    hum.connect(humLp); humLp.connect(humGain); humGain.connect(this.bedGain);
    hum.start(t);
    this.bedNodes.push(hum);
  }

  onEvent(e: FactoryEvent) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    switch (e.kind) {
      case 'correct':
        if (this.allow('correct', 0.15)) {
          this.tone(587.33, 587.33, 0.1, 'triangle', 0.2);
          this.tone(880, 880, 0.2, 'triangle', 0.18, 0.09);
        }
        break;
      case 'wrong':
        if (this.allow('wrong', 0.2)) this.tone(240, 175, 0.22, 'sine', 0.16);
        break;
      case 'rework':
        if (this.allow('rework', 0.4)) {
          this.tone(420, 420, 0.12, 'square', 0.08);
          this.tone(320, 320, 0.16, 'square', 0.08, 0.16);
        }
        break;
      case 'valve_open':
        // Hiss of the valve, then chocolate running into the tank.
        if (this.allow('valve', 0.3)) { this.noise(0.5, 1800, 500, 0.1); this.tone(150, 90, 0.9, 'sine', 0.07); }
        break;
      case 'mixer_start':
        if (this.allow('mixer', 0.4)) { this.tone(70, 120, 0.6, 'sawtooth', 0.1); this.noise(0.8, 500, 240, 0.07); }
        break;
      case 'mold_fill':
        if (this.allow('mold', 0.3)) this.noise(0.45, 700, 220, 0.09);
        break;
      case 'cooling_enter':
        if (this.allow('cool', 0.4)) this.noise(0.7, 1400, 400, 0.06);
        break;
      case 'cut':
        if (this.allow('cut', 0.2)) { this.noise(0.14, 2600, 800, 0.13); this.tone(900, 420, 0.12, 'square', 0.07); }
        break;
      case 'quality_stamp':
        if (this.allow('stamp', 0.25)) this.tone(1500, 2100, 0.09, 'square', 0.09);
        break;
      case 'box_seal':
        if (this.allow('seal', 0.25)) { this.noise(0.22, 1200, 300, 0.1); this.tone(300, 220, 0.12, 'sine', 0.07); }
        break;
      case 'truck_depart':
        if (this.allow('truck', 1.2)) { this.tone(52, 84, 1.3, 'sawtooth', 0.13); this.noise(1.1, 360, 130, 0.08); }
        break;
      case 'truck_arrive':
        if (this.allow('arrive', 1.0)) this.tone(300, 220, 0.3, 'square', 0.07);
        break;
      case 'customer_happy':
        if (this.allow('cust', 0.5)) {
          [523.25, 659.25, 783.99].forEach((f, i) => this.tone(f, f, 0.18, 'triangle', 0.15, i * 0.07));
        }
        break;
      case 'customer_meh':
        if (this.allow('cust', 0.5)) this.tone(440, 440, 0.2, 'triangle', 0.12);
        break;
      case 'customer_unhappy':
        if (this.allow('cust', 0.5)) this.tone(330, 250, 0.3, 'sine', 0.12);
        break;
    }
  }

  shutdown() {
    for (const n of this.bedNodes) { try { n.stop(); } catch { /* already stopped */ } }
    this.bedNodes = [];
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
    this.master = null;
    this.bedGain = null;
  }
}

export const factoryAudio = new FactoryAudio();
