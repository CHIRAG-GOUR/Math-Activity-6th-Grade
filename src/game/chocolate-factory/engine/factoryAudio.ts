// ============================================================
// THE CHOCOLATE FACTORY — AUDIO ENGINE
//
// - Chocolate Factory BGM: Seamless loop of /audio/chocolate_factory_bgm.mp3
//   decoded via Web Audio for gapless crossfade looping, with <audio> fallback.
// - Forklift Sound: Real audio sample /audio/Forklift Sound.mp3 strictly played
//   when forklift is in motion/lifting and smoothly faded out when idle/parked.
// - Factory Machine Synthesis: Conveyor hum, industrial mixer churn, cocoa
//   bean chute hiss, cutter slice, QC approval chime, box sealing, and
//   happy customer delivery celebration.
// - Mute & Cleanup: Comprehensive master volume, mute toggling, and clean
//   shutdown on page unmount.
// ============================================================

'use client';

import type { FactoryEvent } from '../types';

/** Overlap between one music loop and the next, in seconds. */
const BGM_CROSSFADE = 0.25;

/** The machine sounds that run continuously while something is working. */
export type MachineLayer = 'conveyor' | 'mixer' | 'truck' | 'forklift';

export interface MachineState {
  conveyor: boolean;
  mixer: boolean;
  truck: boolean;
  forklift: boolean;
}

/**
 * Loop points that skip the silence an MP3 encoder pads onto both ends of a
 * file, so the music repeats without a gap.
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

class FactoryAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  // ── BACKGROUND MUSIC (BGM) ──
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmBuffer: AudioBuffer | null = null;
  private bgmGain: GainNode | null = null;
  private bgmSources: AudioBufferSourceNode[] = [];
  private bgmTimer: ReturnType<typeof setInterval> | null = null;
  private bgmNextAt = 0;
  private bgmLoop = { start: 0, end: 0 };
  private bgmDecoding: Promise<void> | null = null;
  private isBgmPlaying = false;
  private bgmVolume = 0.38;

  // ── FORKLIFT REAL AUDIO ──
  private forkliftAudio: HTMLAudioElement | null = null;
  private forkliftTap: MediaElementAudioSourceNode | null = null;
  private forkliftGain: GainNode | null = null;
  private forkliftStopTimer: ReturnType<typeof setTimeout> | null = null;
  private isForkliftPlaying = false;
  private forkliftVolume = 0.45;

  // ── AMBIENT BED & CONTINUOUS MACHINE LAYERS ──
  private bedGain: GainNode | null = null;
  private bedNodes: AudioScheduledSourceNode[] = [];
  private layers: Partial<Record<MachineLayer, { gain: GainNode; level: number }>> = {};

  private muted = false;
  private unlocked = false;
  private lastAt = new Map<string, number>();

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    if (this.ctx && !this.master) {
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-14, this.ctx.currentTime);
      comp.ratio.setValueAtTime(6, this.ctx.currentTime);
      comp.connect(this.ctx.destination);

      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
      this.master.connect(comp);
    }
  }

  /** Unlocks audio context and starts BGM on explicit user gesture. */
  unlock() {
    this.unlocked = true;
    this.init();
    this.startBgm();
    this.startBed();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.03);
    }
    if (this.bgmAudio) {
      this.bgmAudio.volume = muted ? 0 : this.bgmVolume;
    }
    if (this.forkliftAudio) {
      this.forkliftAudio.volume = muted ? 0 : this.forkliftVolume;
    }
  }

  // ── BGM PLAYBACK (GAPLESS WEB AUDIO + FALLBACK) ──

  public startBgm() {
    if (typeof window === 'undefined') return;
    this.isBgmPlaying = true;
    this.init();

    if (this.ctx) {
      void this.startBgmSeamless();
      return;
    }
    this.startBgmElement();
  }

  private async startBgmSeamless() {
    const ctx = this.ctx;
    if (!ctx || this.bgmGain) return;

    if (!this.bgmBuffer) {
      if (!this.bgmDecoding) {
        this.bgmDecoding = (async () => {
          try {
            const res = await fetch(encodeURI('/audio/chocolate_factory_bgm.mp3'));
            if (!res.ok) return;
            const buf = await ctx.decodeAudioData(await res.arrayBuffer());
            if (this.ctx === ctx) this.bgmBuffer = buf;
          } catch {
            // Falls back to standard HTMLAudioElement loop
          }
        })();
      }
      await this.bgmDecoding;
    }

    if (this.ctx !== ctx || !this.isBgmPlaying || this.bgmGain) return;
    if (!this.bgmBuffer) {
      this.startBgmElement();
      return;
    }

    this.bgmLoop = audibleRange(this.bgmBuffer);
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.muted ? 0 : this.bgmVolume, ctx.currentTime);
    this.bgmGain.connect(this.master ?? ctx.destination);
    this.bgmNextAt = ctx.currentTime + 0.05;
    this.pumpBgm();
    this.bgmTimer = setInterval(() => this.pumpBgm(), 1000);
  }

  private pumpBgm() {
    const ctx = this.ctx;
    if (!ctx || !this.bgmBuffer || !this.bgmGain || !this.isBgmPlaying) return;

    const body = this.bgmLoop.end - this.bgmLoop.start;
    const fade = Math.min(BGM_CROSSFADE, body * 0.2);
    const period = body - fade;

    while (this.bgmNextAt < ctx.currentTime + 2) {
      const at = Math.max(this.bgmNextAt, ctx.currentTime);
      const src = ctx.createBufferSource();
      src.buffer = this.bgmBuffer;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(1, at + fade);
      g.gain.setValueAtTime(1, at + period);
      g.gain.linearRampToValueAtTime(0, at + period + fade);
      src.connect(g);
      g.connect(this.bgmGain);
      src.start(at, this.bgmLoop.start, body);
      src.onended = () => {
        this.bgmSources = this.bgmSources.filter((x) => x !== src);
      };
      this.bgmSources.push(src);
      this.bgmNextAt = at + period;
    }
  }

  private startBgmElement() {
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('/audio/chocolate_factory_bgm.mp3');
      this.bgmAudio.loop = true;
    }
    this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;

    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const startOnInteraction = () => {
          if (this.isBgmPlaying && this.bgmAudio) {
            this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;
            this.bgmAudio.play().catch(() => {});
          }
          window.removeEventListener('pointerdown', startOnInteraction);
          window.removeEventListener('keydown', startOnInteraction);
        };
        window.addEventListener('pointerdown', startOnInteraction, { once: true });
        window.addEventListener('keydown', startOnInteraction, { once: true });
      });
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    for (const src of this.bgmSources) {
      try {
        src.onended = null;
        src.stop();
      } catch {
        /* already stopped */
      }
    }
    this.bgmSources = [];
    try {
      this.bgmGain?.disconnect();
    } catch {
      /* already gone */
    }
    this.bgmGain = null;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch {}
    }
  }

  // ── REAL FORKLIFT ENGINE AUDIO ──

  public setForkliftActivity(busy: number) {
    if (typeof window === 'undefined') return;
    if (!this.unlocked && busy <= 0) return;

    const isWorking = busy > 0;
    if (!this.forkliftAudio) {
      this.forkliftAudio = new Audio('/audio/Forklift Sound.mp3');
      this.forkliftAudio.loop = true;
    }

    this.init();
    if (this.ctx && !this.forkliftTap && this.master) {
      try {
        this.forkliftTap = this.ctx.createMediaElementSource(this.forkliftAudio);
        this.forkliftGain = this.ctx.createGain();
        this.forkliftGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.forkliftTap.connect(this.forkliftGain);
        this.forkliftGain.connect(this.master);
        this.forkliftAudio.volume = 1;
      } catch {
        this.forkliftTap = null;
        this.forkliftGain = null;
      }
    }

    if (isWorking) {
      if (this.forkliftStopTimer !== null) {
        clearTimeout(this.forkliftStopTimer);
        this.forkliftStopTimer = null;
      }
      if (this.forkliftGain && this.ctx) {
        this.forkliftGain.gain.setTargetAtTime(
          this.muted ? 0 : this.forkliftVolume,
          this.ctx.currentTime,
          0.06
        );
      }
      if (!this.isForkliftPlaying) {
        this.isForkliftPlaying = true;
        if (!this.forkliftGain) this.forkliftAudio.volume = this.muted ? 0 : this.forkliftVolume;
        this.forkliftAudio.play().catch(() => {
          const retryOnInteraction = () => {
            if (this.isForkliftPlaying && this.forkliftAudio) {
              this.forkliftAudio.volume = this.muted ? 0 : this.forkliftVolume;
              this.forkliftAudio.play().catch(() => {});
            }
            window.removeEventListener('pointerdown', retryOnInteraction);
          };
          window.addEventListener('pointerdown', retryOnInteraction, { once: true });
        });
      }
    } else if (this.isForkliftPlaying) {
      this.isForkliftPlaying = false;
      const el = this.forkliftAudio;
      if (this.forkliftGain && this.ctx) {
        this.forkliftGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
        this.forkliftStopTimer = setTimeout(() => {
          this.forkliftStopTimer = null;
          if (!this.isForkliftPlaying) {
            try {
              el.pause();
            } catch {}
          }
        }, 300);
      } else {
        try {
          el.pause();
        } catch {}
      }
    }
  }

  // ── AMBIENT MOTOR BED & SOUND EFFECTS ──

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
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
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
    src.connect(filt);
    filt.connect(gain);
    gain.connect(this.master);
    src.start(t);
    src.stop(t + dur);
  }

  private startBed() {
    if (!this.ctx || !this.master || this.bedNodes.length) return;
    const t = this.ctx.currentTime;
    this.bedGain = this.ctx.createGain();
    this.bedGain.gain.setValueAtTime(0, t);
    this.bedGain.gain.linearRampToValueAtTime(0.04, t + 2.0);
    this.bedGain.connect(this.master);

    const len = Math.floor(this.ctx.sampleRate * 3);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const air = this.ctx.createBufferSource();
    air.buffer = buf;
    air.loop = true;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(340, t);
    air.connect(lp);
    lp.connect(this.bedGain);
    air.start(t);
    this.bedNodes.push(air);

    const hum = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    hum.type = 'sawtooth';
    hum.frequency.setValueAtTime(50, t);
    humGain.gain.setValueAtTime(0.2, t);
    const humLp = this.ctx.createBiquadFilter();
    humLp.type = 'lowpass';
    humLp.frequency.setValueAtTime(150, t);
    hum.connect(humLp);
    humLp.connect(humGain);
    humGain.connect(this.bedGain);
    hum.start(t);
    this.bedNodes.push(hum);
  }

  private buildLayer(name: MachineLayer) {
    if (!this.ctx || !this.master || this.layers[name]) return;
    const t = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.connect(this.master);

    if (name === 'conveyor' || name === 'truck') {
      const len = Math.floor(this.ctx.sampleRate * 2.5);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(name === 'truck' ? 240 : 650, t);
      src.connect(lp);
      lp.connect(gain);
      src.start(t);
      this.bedNodes.push(src);

      if (name === 'truck') {
        const rumble = this.ctx.createOscillator();
        const rg = this.ctx.createGain();
        rumble.type = 'sawtooth';
        rumble.frequency.setValueAtTime(58, t);
        rg.gain.setValueAtTime(0.45, t);
        rumble.connect(rg);
        rg.connect(gain);
        rumble.start(t);
        this.bedNodes.push(rumble);
      }
    } else {
      const osc = this.ctx.createOscillator();
      const lp = this.ctx.createBiquadFilter();
      osc.type = name === 'mixer' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(name === 'mixer' ? 92 : 200, t);
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(name === 'mixer' ? 380 : 850, t);
      osc.connect(lp);
      lp.connect(gain);
      osc.start(t);
      this.bedNodes.push(osc);
    }
    this.layers[name] = { gain, level: 0 };
  }

  setMachines(state: MachineState) {
    if (!this.ctx || !this.master) return;
    const targets: Record<MachineLayer, number> = {
      conveyor: state.conveyor ? 0.09 : 0,
      mixer: state.mixer ? 0.08 : 0,
      truck: state.truck ? 0.09 : 0,
      forklift: state.forklift ? 0.05 : 0,
    };
    for (const name of Object.keys(targets) as MachineLayer[]) {
      this.buildLayer(name);
      const layer = this.layers[name];
      if (!layer) continue;
      const want = targets[name];
      if (Math.abs(want - layer.level) < 0.002) continue;
      layer.level = want;
      layer.gain.gain.setTargetAtTime(want, this.ctx.currentTime, want > 0 ? 0.12 : 0.3);
    }
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
        if (this.allow('valve', 0.3)) {
          this.noise(0.5, 1800, 500, 0.1);
          this.tone(150, 90, 0.9, 'sine', 0.07);
        }
        break;
      case 'mixer_start':
        if (this.allow('mixer', 0.4)) {
          this.tone(70, 120, 0.6, 'sawtooth', 0.1);
          this.noise(0.8, 500, 240, 0.07);
        }
        break;
      case 'mold_fill':
        if (this.allow('mold', 0.3)) this.noise(0.45, 700, 220, 0.09);
        break;
      case 'cooling_enter':
        if (this.allow('cool', 0.4)) this.noise(0.7, 1400, 400, 0.06);
        break;
      case 'cut':
        if (this.allow('cut', 0.2)) {
          this.noise(0.14, 2600, 800, 0.13);
          this.tone(900, 420, 0.12, 'square', 0.07);
        }
        break;
      case 'quality_stamp':
        if (this.allow('stamp', 0.25)) this.tone(1500, 2100, 0.09, 'square', 0.09);
        break;
      case 'box_seal':
        if (this.allow('seal', 0.18)) {
          this.noise(0.22, 1200, 300, 0.1);
          this.tone(300, 220, 0.12, 'sine', 0.07);
        }
        break;
      case 'forklift_beep':
        if (this.allow('beep', 0.7)) {
          this.tone(1100, 1100, 0.11, 'square', 0.06);
          this.tone(1100, 1100, 0.11, 'square', 0.06, 0.18);
        }
        break;
      case 'truck_depart':
        if (this.allow('truck', 1.2)) {
          this.tone(52, 84, 1.3, 'sawtooth', 0.13);
          this.noise(1.1, 360, 130, 0.08);
        }
        break;
      case 'truck_arrive':
        if (this.allow('arrive', 1.0)) this.tone(300, 220, 0.3, 'square', 0.07);
        break;
      case 'customer_happy':
        if (this.allow('cust', 0.5)) {
          [523.25, 659.25, 783.99].forEach((f, i) =>
            this.tone(f, f, 0.18, 'triangle', 0.15, i * 0.07)
          );
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
    this.stopBgm();
    this.setForkliftActivity(0);
    for (const n of this.bedNodes) {
      try {
        n.stop();
      } catch {}
    }
    this.bedNodes = [];
    this.layers = {};
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
    this.master = null;
    this.bedGain = null;
  }
}

export const factoryAudio = new FactoryAudio();
