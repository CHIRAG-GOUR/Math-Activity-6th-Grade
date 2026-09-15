// ============================================================
// PATTERN RACERS — SAMPLE-BASED CAR AUDIO
//
// Real recordings rather than synthesis, layered on top of the existing
// Web Audio bus in patternAudio.ts.
//
// Engine notes are looping AudioBufferSourceNodes whose playbackRate tracks
// road speed, so accelerating genuinely pitches the recording up and braking
// drops it back. An AudioBufferSourceNode cannot seek once started, so
// "restart from 14 seconds" means tearing down the node and starting a new one
// at that offset — which is exactly what startAt() does.
//
// Every sound routes through the shared master bus so the mute button and the
// compressor still apply to all of it.
// ============================================================

'use client';

export const AUDIO_FILES = {
  bgm: '/audio/Car Race BGM.mp3',
  blueEngine: '/audio/Car 1.mp3',
  redEngine: '/audio/Car 2.mp3',
  rev: '/audio/Cars rev.mp3',
} as const;

/** Where each engine recording is useful, in seconds into the file. */
export const ENGINE_CUES = {
  /** Idle / pulling away — used as the cars leave the garage. */
  blueGarage: 13,
  /** The part of the recording that sits under hard acceleration. */
  blueDriving: 14,
  redDriving: 0,
} as const;

const BGM_VOLUME = 0.4;

type Ctx = AudioContext;

/**
 * One looping engine layer for a single car.
 *
 * Holds its own gain and panner, so the two cars sit apart in the stereo field
 * and can be faded independently.
 */
class EngineLayer {
  private ctx: Ctx;
  private buffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gain: GainNode;
  private panner: StereoPannerNode;
  private currentOffset = -1;
  private baseVolume: number;

  constructor(ctx: Ctx, out: AudioNode, pan: number, baseVolume: number) {
    this.ctx = ctx;
    this.baseVolume = baseVolume;

    this.gain = ctx.createGain();
    this.gain.gain.setValueAtTime(0, ctx.currentTime);

    this.panner = ctx.createStereoPanner();
    this.panner.pan.setValueAtTime(pan, ctx.currentTime);

    this.gain.connect(this.panner);
    this.panner.connect(out);
  }

  setBuffer(buffer: AudioBuffer) {
    this.buffer = buffer;
  }

  get ready() {
    return this.buffer !== null;
  }

  /**
   * (Re)start the loop at `offset` seconds into the recording.
   * Calling this with the offset already playing is a no-op, so it is safe to
   * call every frame.
   */
  startAt(offset: number, fadeIn = 0.35) {
    if (!this.buffer) return;
    if (this.source && Math.abs(this.currentOffset - offset) < 0.01) return;

    this.stopSource();

    const safeOffset = Math.max(0, Math.min(offset, this.buffer.duration - 0.5));
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffer;
    src.loop = true;
    // Loop the tail of the recording from the cue point onward, so the engine
    // never drops back to the quiet intro of the file.
    src.loopStart = safeOffset;
    src.loopEnd = this.buffer.duration;
    src.connect(this.gain);
    src.start(0, safeOffset);

    this.source = src;
    this.currentOffset = offset;

    const t = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(t);
    this.gain.gain.setValueAtTime(this.gain.gain.value, t);
    this.gain.gain.linearRampToValueAtTime(this.baseVolume * 0.4, t + fadeIn);
  }

  /**
   * Track the car. `speedFrac` is 0..1 of top speed and drives pitch;
   * `load` is how hard the engine is working and drives level.
   */
  update(speedFrac: number, load: number, muted: boolean) {
    if (!this.source) return;
    const t = this.ctx.currentTime;

    // Pitch follows speed. Kept inside a musical range so the recording never
    // turns into a chipmunk at top speed or a drone at a crawl.
    const rate = 0.82 + speedFrac * 0.85;
    this.source.playbackRate.setTargetAtTime(rate, t, 0.08);

    const vol = muted ? 0 : this.baseVolume * (0.32 + 0.68 * Math.max(load, speedFrac));
    this.gain.gain.setTargetAtTime(vol, t, 0.1);
  }

  fadeOut(seconds = 0.4) {
    const t = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(t);
    this.gain.gain.setValueAtTime(this.gain.gain.value, t);
    this.gain.gain.linearRampToValueAtTime(0, t + seconds);
    const src = this.source;
    this.source = null;
    this.currentOffset = -1;
    if (src) {
      try { src.stop(t + seconds + 0.05); } catch { /* already stopped */ }
    }
  }

  private stopSource() {
    if (!this.source) return;
    try { this.source.stop(); } catch { /* already stopped */ }
    this.source.disconnect();
    this.source = null;
  }
}

/**
 * Owns every sampled sound in the game. Constructed lazily, because an
 * AudioContext cannot exist until the user has interacted with the page.
 */
export class CarAudioKit {
  private ctx: Ctx;
  private out: AudioNode;
  private buffers = new Map<string, AudioBuffer>();
  private loading = new Map<string, Promise<AudioBuffer | null>>();

  private bgmSource: AudioBufferSourceNode | null = null;
  private bgmGain: GainNode;

  private engines: Record<'blue' | 'red', EngineLayer>;

  private revSource: AudioBufferSourceNode | null = null;
  private revGain: GainNode;

  private muted = false;

  constructor(ctx: Ctx, out: AudioNode) {
    this.ctx = ctx;
    this.out = out;

    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0, ctx.currentTime);
    this.bgmGain.connect(out);

    this.revGain = ctx.createGain();
    this.revGain.gain.setValueAtTime(0, ctx.currentTime);
    this.revGain.connect(out);

    this.engines = {
      blue: new EngineLayer(ctx, out, -0.32, 0.85),
      red: new EngineLayer(ctx, out, 0.32, 0.85),
    };

    void this.preload();
  }

  private async fetchBuffer(url: string): Promise<AudioBuffer | null> {
    const cached = this.buffers.get(url);
    if (cached) return cached;

    const inflight = this.loading.get(url);
    if (inflight) return inflight;

    const job = (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const bytes = await res.arrayBuffer();
        const buf = await this.ctx.decodeAudioData(bytes);
        this.buffers.set(url, buf);
        return buf;
      } catch (err) {
        // A missing or undecodable file must never take the game down; the
        // synthesized fallbacks in patternAudio.ts still cover the essentials.
        // eslint-disable-next-line no-console
        console.warn('[carAudio] could not load', url, err);
        return null;
      } finally {
        this.loading.delete(url);
      }
    })();

    this.loading.set(url, job);
    return job;
  }

  private async preload() {
    const [bgm, blue, red] = await Promise.all([
      this.fetchBuffer(AUDIO_FILES.bgm),
      this.fetchBuffer(AUDIO_FILES.blueEngine),
      this.fetchBuffer(AUDIO_FILES.redEngine),
      this.fetchBuffer(AUDIO_FILES.rev),
    ]);
    if (blue) this.engines.blue.setBuffer(blue);
    if (red) this.engines.red.setBuffer(red);
    if (bgm) this.startBgm();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    const t = this.ctx.currentTime;
    this.bgmGain.gain.setTargetAtTime(muted ? 0 : BGM_VOLUME, t, 0.05);
  }

  // ── BACKGROUND MUSIC ──────────────────────────────────────────────────────
  // Loops for the whole session at a fixed 40%, so it sits under the engines
  // rather than competing with them.

  startBgm() {
    if (this.bgmSource) return;
    const buf = this.buffers.get(AUDIO_FILES.bgm);
    if (!buf) return;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(this.bgmGain);
    src.start(0);
    this.bgmSource = src;

    const t = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(t);
    this.bgmGain.gain.setValueAtTime(0, t);
    this.bgmGain.gain.linearRampToValueAtTime(this.muted ? 0 : BGM_VOLUME, t + 1.2);
  }

  stopBgm() {
    if (!this.bgmSource) return;
    const t = this.ctx.currentTime;
    this.bgmGain.gain.linearRampToValueAtTime(0, t + 0.5);
    try { this.bgmSource.stop(t + 0.6); } catch { /* already stopped */ }
    this.bgmSource = null;
  }

  // ── ENGINES ───────────────────────────────────────────────────────────────

  /** Begin a car's engine loop at a specific point in its recording. */
  startEngine(team: 'blue' | 'red', offsetSeconds: number, fadeIn = 0.35) {
    this.engines[team].startAt(offsetSeconds, fadeIn);
  }

  /** Per-frame update. `speedFrac` 0..1 of top speed, `load` 0..1. */
  updateEngine(team: 'blue' | 'red', speedFrac: number, load: number) {
    this.engines[team].update(speedFrac, load, this.muted);
  }

  stopEngine(team: 'blue' | 'red') {
    this.engines[team].fadeOut();
  }

  stopAllEngines() {
    this.engines.blue.fadeOut();
    this.engines.red.fadeOut();
    this.stopRev();
  }

  enginesReady() {
    return this.engines.blue.ready && this.engines.red.ready;
  }

  // ── REV (grid staging) ────────────────────────────────────────────────────
  // Both cars revving on the spot during the grid-rev questions. Looped so it
  // holds for as long as the question is on screen.

  startRev() {
    if (this.revSource) return;
    const buf = this.buffers.get(AUDIO_FILES.rev);
    if (!buf) return;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(this.revGain);
    src.start(0);
    this.revSource = src;

    const t = this.ctx.currentTime;
    this.revGain.gain.cancelScheduledValues(t);
    this.revGain.gain.setValueAtTime(0, t);
    this.revGain.gain.linearRampToValueAtTime(this.muted ? 0 : 0.7, t + 0.3);
  }

  stopRev() {
    if (!this.revSource) return;
    const t = this.ctx.currentTime;
    this.revGain.gain.cancelScheduledValues(t);
    this.revGain.gain.setValueAtTime(this.revGain.gain.value, t);
    this.revGain.gain.linearRampToValueAtTime(0, t + 0.35);
    const src = this.revSource;
    this.revSource = null;
    try { src.stop(t + 0.4); } catch { /* already stopped */ }
  }

  get revving() {
    return this.revSource !== null;
  }
}
