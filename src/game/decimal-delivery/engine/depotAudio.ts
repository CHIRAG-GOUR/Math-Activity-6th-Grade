// ============================================================
// THE DECIMAL DELIVERY NETWORK — AUDIO
//
// Web Audio on a single master bus, matching the pattern used elsewhere in
// the Arcade. Two recordings are layered on top of the synthesised effects:
//  - the looping background music
//  - a looping forklift engine, faded in while any forklift is working
// If either file fails to load, the synthesised sounds still play.
//
// Two things worth knowing:
//  - A browser blocks all audio until a genuine user gesture, so `unlock()`
//    must be called from a real tap (the OPEN THE DEPOT button does it).
//  - Simulation events arrive in bursts; each one-shot is rate-limited so a
//    busy depot never stacks a dozen copies of the same sound.
// ============================================================

'use client';

import type { SimEvent } from './depotSim';

const AUDIO_FILES = {
  bgm: '/audio/Delivery BGM.mp3',
  forklift: '/audio/Forklift Sound.mp3',
} as const;

const BGM_VOLUME = 0.4;
/** Forklift loop level with one forklift working, and the ceiling with several. */
const FORKLIFT_VOLUME = 0.42;
const FORKLIFT_VOLUME_MAX = 0.65;

/**
 * Loop points that skip the silence MP3 encoders pad onto both ends of a file,
 * so a short music loop repeats without an audible gap.
 */
function audibleRange(buf: AudioBuffer): { start: number; end: number } {
  const threshold = 0.002;
  const channels = Array.from({ length: buf.numberOfChannels }, (_, c) => buf.getChannelData(c));
  const loud = (i: number) => channels.some((ch) => Math.abs(ch[i]) > threshold);
  let first = 0;
  while (first < buf.length && !loud(first)) first++;
  let last = buf.length - 1;
  while (last > first && !loud(last)) last--;
  if (last <= first) return { start: 0, end: buf.duration };
  return { start: first / buf.sampleRate, end: (last + 1) / buf.sampleRate };
}

class DepotAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private muted = false;
  private lastAt = new Map<string, number>();
  private ambientNodes: AudioScheduledSourceNode[] = [];

  private buffers: Partial<Record<keyof typeof AUDIO_FILES, AudioBuffer>> = {};
  private loading: Promise<void> | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;
  private forkliftSource: AudioBufferSourceNode | null = null;
  private forkliftGain: GainNode | null = null;
  private forkliftLevel = -1;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const Ctor = window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();

    if (this.ctx && !this.master) {
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-16, this.ctx.currentTime);
      comp.ratio.setValueAtTime(8, this.ctx.currentTime);
      comp.connect(this.ctx.destination);

      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
      this.master.connect(comp);
    }
  }

  private bus(): AudioNode | null {
    this.init();
    return this.master;
  }

  /** Call from a real user gesture, or nothing will ever be audible. */
  unlock() {
    this.init();
    this.startAmbience();
    void this.loadRecordings().then(() => {
      this.startBgm();
      this.startForkliftLoop();
    });
  }

  // ── RECORDINGS ──

  private loadRecordings(): Promise<void> {
    if (!this.ctx) return Promise.resolve();
    if (this.loading) return this.loading;
    const ctx = this.ctx;
    this.loading = Promise.all(
      (Object.keys(AUDIO_FILES) as (keyof typeof AUDIO_FILES)[]).map(async (key) => {
        try {
          const res = await fetch(encodeURI(AUDIO_FILES[key]));
          if (!res.ok) return;
          const buf = await ctx.decodeAudioData(await res.arrayBuffer());
          // Ignore a decode that finishes after the context was shut down.
          if (this.ctx === ctx) this.buffers[key] = buf;
        } catch {
          // Missing or undecodable file: the synthesised sounds carry on alone.
        }
      })
    ).then(() => undefined);
    return this.loading;
  }

  private loopSource(buf: AudioBuffer, out: AudioNode): AudioBufferSourceNode | null {
    if (!this.ctx) return null;
    const { start, end } = audibleRange(buf);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.loopStart = start;
    src.loopEnd = end;
    src.connect(out);
    src.start(this.ctx.currentTime, start);
    return src;
  }

  private startBgm() {
    const buf = this.buffers.bgm;
    if (!this.ctx || !this.master || !buf || this.bgmSource) return;
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(BGM_VOLUME, t + 1.5);
    gain.connect(this.master);
    this.bgmSource = this.loopSource(buf, gain);
  }

  /** The engine loop runs continuously at zero volume and is faded by activity. */
  private startForkliftLoop() {
    const buf = this.buffers.forklift;
    if (!this.ctx || !this.master || !buf || this.forkliftSource) return;
    this.forkliftGain = this.ctx.createGain();
    this.forkliftGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.forkliftGain.connect(this.master);
    this.forkliftSource = this.loopSource(buf, this.forkliftGain);
    this.forkliftLevel = -1;
  }

  /**
   * Called every frame with how many forklifts are out of their parking spot
   * (driving, lifting, hauling or returning). Louder when several are busy.
   */
  setForkliftActivity(busy: number) {
    if (!this.ctx || !this.forkliftGain) return;
    const level = busy <= 0
      ? 0
      : Math.min(FORKLIFT_VOLUME_MAX, FORKLIFT_VOLUME + (busy - 1) * 0.08);
    if (Math.abs(level - this.forkliftLevel) < 1e-3) return;
    this.forkliftLevel = level;
    // Quick to start up, a little slower to die away as the engine idles off.
    this.forkliftGain.gain.setTargetAtTime(level, this.ctx.currentTime, level > 0 ? 0.15 : 0.45);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.03);
    }
  }

  /** Rate limiter so a burst of events does not stack identical sounds. */
  private allow(key: string, gapSeconds: number): boolean {
    if (!this.ctx) return false;
    const now = this.ctx.currentTime;
    const prev = this.lastAt.get(key) ?? -999;
    if (now - prev < gapSeconds) return false;
    this.lastAt.set(key, now);
    return true;
  }

  private tone(
    freqFrom: number, freqTo: number, duration: number,
    type: OscillatorType, peak: number, delay = 0
  ) {
    const out = this.bus();
    if (!this.ctx || !out) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqFrom, t);
    if (freqTo !== freqFrom) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqTo), t + duration);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + Math.min(0.03, duration * 0.3));
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + duration + 0.02);
  }

  private noise(duration: number, cutoffFrom: number, cutoffTo: number, peak: number) {
    const out = this.bus();
    if (!this.ctx || !out) return;
    const t = this.ctx.currentTime;
    const len = Math.floor(this.ctx.sampleRate * duration);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(cutoffFrom, t);
    filt.frequency.exponentialRampToValueAtTime(Math.max(60, cutoffTo), t + duration);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(peak, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    src.connect(filt); filt.connect(gain); gain.connect(out);
    src.start(t); src.stop(t + duration);
  }

  // ── AMBIENCE ──
  // A quiet, continuous warehouse bed: filtered noise for air handling plus a
  // low hum for machinery. Deliberately understated so it never competes with
  // the confirmation sounds that carry gameplay meaning.
  private startAmbience() {
    if (!this.ctx || !this.master || this.ambientNodes.length) return;
    const t = this.ctx.currentTime;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, t);
    this.ambientGain.gain.linearRampToValueAtTime(0.03, t + 2.5);
    this.ambientGain.connect(this.master);

    // Air handling.
    const len = Math.floor(this.ctx.sampleRate * 4);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const air = this.ctx.createBufferSource();
    air.buffer = buf; air.loop = true;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(420, t);
    air.connect(lp); lp.connect(this.ambientGain);
    air.start(t);
    this.ambientNodes.push(air);

    // Machinery hum.
    const hum = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    hum.type = 'sawtooth';
    hum.frequency.setValueAtTime(58, t);
    humGain.gain.setValueAtTime(0.35, t);
    const humLp = this.ctx.createBiquadFilter();
    humLp.type = 'lowpass'; humLp.frequency.setValueAtTime(180, t);
    hum.connect(humLp); humLp.connect(humGain); humGain.connect(this.ambientGain);
    hum.start(t);
    this.ambientNodes.push(hum);
  }

  shutdown() {
    for (const n of this.ambientNodes) {
      try { n.stop(); } catch { /* already stopped */ }
    }
    this.ambientNodes = [];
    for (const n of [this.bgmSource, this.forkliftSource]) {
      try { n?.stop(); } catch { /* already stopped */ }
    }
    this.bgmSource = null;
    this.forkliftSource = null;
    this.forkliftGain = null;
    this.forkliftLevel = -1;
    this.buffers = {};
    this.loading = null;
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
    this.master = null;
    this.ambientGain = null;
  }

  // ── EVENT SOUNDS ──

  onSimEvent(event: SimEvent) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    switch (event) {
      case 'parcel_arrive':
        if (this.allow(event, 0.5)) this.noise(0.18, 900, 220, 0.12);
        break;

      case 'scale_settle':
        // Belt slows, parcel settles onto the platform.
        if (this.allow(event, 0.2)) this.noise(0.22, 700, 180, 0.09);
        break;

      case 'forklift_beep':
        // Reversing beeper, two short pips.
        if (this.allow(event, 0.8)) {
          this.tone(1100, 1100, 0.12, 'square', 0.07);
          this.tone(1100, 1100, 0.12, 'square', 0.07, 0.2);
        }
        break;

      case 'reject_drop':
        // Parcel lands in the discard bin. Dull, not harsh.
        if (this.allow(event, 0.3)) {
          this.noise(0.3, 450, 120, 0.13);
          this.tone(180, 110, 0.25, 'sine', 0.1);
        }
        break;

      case 'scale_ok':
        // Rising two-note confirmation — the satisfying "accepted" cue.
        if (this.allow(event, 0.15)) {
          this.tone(660, 660, 0.1, 'triangle', 0.22);
          this.tone(990, 990, 0.22, 'triangle', 0.2, 0.09);
        }
        break;

      case 'scale_error':
        // Soft and low. Never harsh — a wrong answer is not a punishment.
        if (this.allow(event, 0.2)) this.tone(240, 180, 0.22, 'sine', 0.16);
        break;

      case 'belt_start':
        if (this.allow(event, 0.4)) {
          this.noise(0.4, 500, 260, 0.1);
          this.tone(120, 150, 0.35, 'sawtooth', 0.06);
        }
        break;

      case 'scanner':
        if (this.allow(event, 0.25)) this.tone(1500, 2100, 0.1, 'square', 0.1);
        break;

      case 'divert':
        if (this.allow(event, 0.3)) this.noise(0.22, 700, 200, 0.1);
        break;

      case 'pickup':
        if (this.allow(event, 0.3)) this.noise(0.12, 600, 180, 0.08);
        break;

      case 'truck_load':
        // Money/reward cue: a small ascending arpeggio.
        if (this.allow(event, 0.3)) {
          [523.25, 659.25, 783.99].forEach((f, i) =>
            this.tone(f, f, 0.18, 'triangle', 0.16, i * 0.07));
          this.noise(0.16, 500, 150, 0.1);
        }
        break;

      case 'truck_engine':
        if (this.allow(event, 1.5)) {
          this.tone(48, 78, 1.4, 'sawtooth', 0.14);
          this.noise(1.2, 380, 140, 0.09);
        }
        break;

      case 'gate_open':
        if (this.allow(event, 1.5)) {
          this.tone(420, 620, 0.5, 'square', 0.08);
          this.noise(0.9, 600, 200, 0.08);
        }
        break;
    }
  }
}

export const depotAudio = new DepotAudio();
