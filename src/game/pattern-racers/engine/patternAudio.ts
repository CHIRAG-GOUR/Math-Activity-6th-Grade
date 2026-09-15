// ============================================================
// PATTERN RACERS — Professional Web Audio Soundscape
// Custom Synthesized Audio for Formula Track, Machinery & Power-ups:
// - Engine Revs, Accelerations, Gear Clicks, Hydraulic Releases
// - Power-Up Activations (50:50, Time Freeze, 2x Multiplier)
// - Pneumatic Air Depressurization (Both Teams Miss / Reset)
// - Starting Gantry Lights & Race Launch Fanfare
// ============================================================

'use client';


/**
 * A sustained engine note for one car.
 *
 * Two detuned sawtooths through a lowpass gives a usable engine timbre without
 * any audio assets. Frequency tracks RPM and the filter cutoff tracks load, so
 * the car sounds like it is working when you are on the throttle and drops to
 * a idle burble when you lift. Everything is smoothed with setTargetAtTime;
 * stepping the frequency per frame would produce audible zipper noise.
 */
class EngineVoice {
  private oscA: OscillatorNode;
  private oscB: OscillatorNode;
  private sub: OscillatorNode;
  private filter: BiquadFilterNode;
  private gain: GainNode;
  private panner: StereoPannerNode;
  private ctx: AudioContext;
  private running = false;

  constructor(ctx: AudioContext, out: AudioNode, pan: number) {
    this.ctx = ctx;

    this.gain = ctx.createGain();
    this.gain.gain.setValueAtTime(0, ctx.currentTime);

    this.panner = ctx.createStereoPanner();
    this.panner.pan.setValueAtTime(pan, ctx.currentTime);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(700, ctx.currentTime);
    this.filter.Q.setValueAtTime(4, ctx.currentTime);

    this.oscA = ctx.createOscillator();
    this.oscA.type = 'sawtooth';
    this.oscB = ctx.createOscillator();
    this.oscB.type = 'sawtooth';
    this.oscB.detune.setValueAtTime(14, ctx.currentTime);
    this.sub = ctx.createOscillator();
    this.sub.type = 'square';

    this.oscA.connect(this.filter);
    this.oscB.connect(this.filter);
    this.sub.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(this.panner);
    this.panner.connect(out);
  }

  start() {
    if (this.running) return;
    this.running = true;
    const t = this.ctx.currentTime;
    this.oscA.start(t);
    this.oscB.start(t);
    this.sub.start(t);
  }

  /** rpm 1100..12000, load 0..1 */
  update(rpm: number, load: number, muted: boolean) {
    if (!this.running) return;
    const t = this.ctx.currentTime;

    // Map RPM to a musical-ish range; the sub sits an octave down.
    const freq = 34 + (rpm / 12000) * 210;
    this.oscA.frequency.setTargetAtTime(freq, t, 0.06);
    this.oscB.frequency.setTargetAtTime(freq * 1.005, t, 0.06);
    this.sub.frequency.setTargetAtTime(freq * 0.5, t, 0.06);

    // Opening the filter under load is what reads as "working hard".
    const cutoff = 420 + load * 2100 + (rpm / 12000) * 900;
    this.filter.frequency.setTargetAtTime(cutoff, t, 0.08);

    const vol = muted ? 0 : 0.055 + load * 0.075;
    this.gain.gain.setTargetAtTime(vol, t, 0.08);
  }

  stop() {
    if (!this.running) return;
    const t = this.ctx.currentTime;
    this.gain.gain.setTargetAtTime(0, t, 0.05);
    try {
      this.oscA.stop(t + 0.3);
      this.oscB.stop(t + 0.3);
      this.sub.stop(t + 0.3);
    } catch {
      /* already stopped */
    }
    this.running = false;
  }
}

class PatternAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private engines = new Map<string, EngineVoice>();
  private lastImpactAt = 0;
  private lastBrakeAt = 0;
  private lastSquealAt = 0;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private bgmInterval: NodeJS.Timeout | null = null;
  private isBgmPlaying: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx && !this.master) {
      // master -> compressor -> destination. A compressor matters here because
      // two engine voices plus impacts and crowd noise can otherwise clip.
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-14, this.ctx.currentTime);
      comp.ratio.setValueAtTime(8, this.ctx.currentTime);
      comp.connect(this.ctx.destination);

      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.master.connect(comp);
    }
  }

  /** Output node every sound must connect to. */
  private bus(): AudioNode {
    this.initContext();
    return this.master ?? this.ctx!.destination;
  }

  /** Call from a user gesture (the intro button) to unlock playback. */
  public unlock() {
    this.initContext();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.02);
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // ── 1. Tactical Dial / Switch Click ──
  public playDialClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.04);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.04);

    osc.connect(gain);
    gain.connect(this.bus());

    osc.start(t);
    osc.stop(t + 0.04);
  }

  // ── 2. Hydraulic Piston Rise & Track Lock ──
  public playHydraulicLock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Noise burst for pneumatic hiss
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.3);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.linearRampToValueAtTime(500, t + 0.3);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.bus());

    noise.start(t);
    noise.stop(t + 0.3);

    // Heavy metallic clank
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const clankGain = this.ctx.createGain();
      const t2 = this.ctx.currentTime;

      osc.type = 'square';
      osc.frequency.setValueAtTime(200, t2);
      osc.frequency.exponentialRampToValueAtTime(50, t2 + 0.15);

      clankGain.gain.setValueAtTime(0.35, t2);
      clankGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.15);

      osc.connect(clankGain);
      clankGain.connect(this.bus());

      osc.start(t2);
      osc.stop(t2 + 0.15);
    }, 250);
  }

  // ── 3. Pneumatic Air Release (Both Teams Miss / Reset) ──
  public playPneumaticDepressurize() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.linearRampToValueAtTime(250, t + 0.45);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bus());

    noise.start(t);
    noise.stop(t + 0.45);
  }

  // ── 4. Power-Up: 50:50 Sonar Sweep ──
  public playPowerUp5050() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.18);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.35);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.bus());

    osc.start(t);
    osc.stop(t + 0.35);
  }

  // ── 5. Power-Up: Time Freeze Ice Chime ──
  public playPowerUpFreeze() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
    freqs.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(this.bus());

      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  }

  // ── 6. Power-Up: 2x Multiplier Turbo Charge ──
  public playPowerUp2x() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.45);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.bus());

    osc.start(t);
    osc.stop(t + 0.45);
  }

  // ── 7. Vehicle Engine Acceleration Whoosh ──
  public playEngineRev() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.5);
    osc.frequency.linearRampToValueAtTime(240, t + 0.9);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(gain);
    gain.connect(this.bus());

    osc.start(t);
    osc.stop(t + 0.9);
  }

  // ── 8. Starting Light Beep (Red / Yellow / Green) ──
  public playStartLightBeep(isGreen: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isGreen ? 880 : 440;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(isGreen ? 0.32 : 0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isGreen ? 0.6 : 0.25));

    osc.connect(gain);
    gain.connect(this.bus());

    osc.start(t);
    osc.stop(t + (isGreen ? 0.6 : 0.25));
  }

  // ── 9. Correct Mathematical Confirmation Fanfare ──
  public playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.24, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.32);

      osc.connect(gain);
      gain.connect(this.bus());

      osc.start(noteTime);
      osc.stop(noteTime + 0.32);
    });
  }

  // ── 10. Non-Punishing Error Tone ──
  public playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(130, t + 0.25);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.bus());

    osc.start(t);
    osc.stop(t + 0.25);
  }


  // ---- SUSTAINED ENGINE VOICES ----

  /** Drive one car's engine note. Safe to call every frame. */
  public updateEngine(team: string, rpm: number, load: number) {
    this.initContext();
    if (!this.ctx) return;

    let voice = this.engines.get(team);
    if (!voice) {
      voice = new EngineVoice(this.ctx, this.bus(), team === 'blue' ? -0.35 : 0.35);
      voice.start();
      this.engines.set(team, voice);
    }
    voice.update(rpm, Math.max(0, Math.min(1, load)), this.isMuted);
  }

  public stopAllEngines() {
    this.engines.forEach((v) => v.stop());
    this.engines.clear();
  }

  // ---- TYRE SQUEAL ----
  // Gated on the grip limiter in the vehicle model, so it only sounds when the
  // car is genuinely sliding.
  public playTyreSqueal(intensity = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // A sustained slide fires this every frame otherwise.
    if (t - this.lastSquealAt < 0.4) return;
    this.lastSquealAt = t;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.linearRampToValueAtTime(1180, t + 0.35);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2600, t);
    filter.Q.setValueAtTime(9, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05 * intensity, t + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bus());
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // ---- WALL / BARRIER IMPACT ----
  // Rate-limited, or scraping along a barrier machine-guns the sound.
  public playImpact(force: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastImpactAt < 0.12) return;
    this.lastImpactAt = now;

    const amp = Math.max(0.05, Math.min(0.45, force / 40));

    const size = Math.floor(this.ctx.sampleRate * 0.22);
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / size);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.22);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(amp, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bus());
    noise.start(now);
    noise.stop(now + 0.22);

    // Low thud underneath the scrape.
    const thud = this.ctx.createOscillator();
    const tg = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(120, now);
    thud.frequency.exponentialRampToValueAtTime(42, now + 0.18);
    tg.gain.setValueAtTime(amp * 0.8, now);
    tg.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    thud.connect(tg);
    tg.connect(this.bus());
    thud.start(now);
    thud.stop(now + 0.18);
  }

  public playGearShift() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.05);
    gain.gain.setValueAtTime(0.055, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain);
    gain.connect(this.bus());
    osc.start(t);
    osc.stop(t + 0.06);
  }

  public playBoost() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.5);
    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(gain);
    gain.connect(this.bus());
    osc.start(t);
    osc.stop(t + 0.6);
  }

  /** Crowd roar, used for the champagne celebration and the chequered flag. */
  public playCrowdCheer(duration = 2.4) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const size = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, t);
    filter.Q.setValueAtTime(0.8, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.35);
    gain.gain.linearRampToValueAtTime(0.06, t + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bus());
    noise.start(t);
    noise.stop(t + duration);
  }

  /** Cork pop for the one-shot champagne celebration. */
  public playChampagnePop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.07);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(gain);
    gain.connect(this.bus());
    osc.start(t);
    osc.stop(t + 0.09);
    this.playCrowdCheer(2.0);
  }

  /** Rolling garage shutter, for the Round 1 departure. */
  public playGarageDoor() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const size = Math.floor(this.ctx.sampleRate * 1.1);
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      // Periodic rattle rather than flat noise, so it reads as a shutter.
      data[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin(i * 0.02));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bus());
    noise.start(t);
    noise.stop(t + 1.1);
  }

  /** Brake squeal + disc rumble, scaled by how hard the car is stopping. */
  public playBrake(intensity = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastBrakeAt < 0.35) return;
    this.lastBrakeAt = now;

    const amp = 0.035 + 0.05 * Math.min(1, intensity);
    const dur = 0.55;

    const osc = this.ctx.createOscillator();
    const filt = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + dur);
    filt.type = 'bandpass';
    filt.frequency.setValueAtTime(2400, now);
    filt.Q.setValueAtTime(11, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(amp, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(filt); filt.connect(gain); gain.connect(this.bus());
    osc.start(now); osc.stop(now + dur);
  }

  /** Starter motor then catch -- played as a car fires up to leave the garage. */
  public playEngineStart() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const crank = this.ctx.createOscillator();
    const cg = this.ctx.createGain();
    crank.type = 'square';
    crank.frequency.setValueAtTime(42, t);
    crank.frequency.linearRampToValueAtTime(70, t + 0.7);
    cg.gain.setValueAtTime(0.05, t);
    cg.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
    crank.connect(cg); cg.connect(this.bus());
    crank.start(t); crank.stop(t + 0.75);

    const fire = this.ctx.createOscillator();
    const fg = this.ctx.createGain();
    fire.type = 'sawtooth';
    fire.frequency.setValueAtTime(90, t + 0.7);
    fire.frequency.exponentialRampToValueAtTime(320, t + 1.0);
    fire.frequency.exponentialRampToValueAtTime(130, t + 1.6);
    fg.gain.setValueAtTime(0.12, t + 0.7);
    fg.gain.exponentialRampToValueAtTime(0.001, t + 1.7);
    fire.connect(fg); fg.connect(this.bus());
    fire.start(t + 0.7); fire.stop(t + 1.7);
  }

  // ── 11. Grand Prix Background Music Loop ──
  public startBgm() {
    if (this.isBgmPlaying || typeof window === 'undefined') return;
    this.initContext();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C D E G A C
    let step = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.ctx || this.isMuted || !this.isBgmPlaying) return;
      const t = this.ctx.currentTime;

      // Bass groove
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      const root = step % 4 === 0 ? 130.81 : step % 4 === 2 ? 146.83 : 164.81;
      bassOsc.frequency.setValueAtTime(root, t);

      bassGain.gain.setValueAtTime(0.04, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      bassOsc.connect(bassGain);
      bassGain.connect(this.bus());

      bassOsc.start(t);
      bassOsc.stop(t + 0.2);

      // Melodic arpeggio
      if (step % 2 === 0) {
        const note = scale[(step / 2) % scale.length];
        const melOsc = this.ctx.createOscillator();
        const melGain = this.ctx.createGain();
        melOsc.type = 'sine';
        melOsc.frequency.setValueAtTime(note, t + 0.05);

        melGain.gain.setValueAtTime(0.03, t + 0.05);
        melGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        melOsc.connect(melGain);
        melGain.connect(this.bus());

        melOsc.start(t + 0.05);
        melOsc.stop(t + 0.25);
      }

      step++;
    }, 240);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const patternAudio = new PatternAudioEngine();

/**
 * Bridge between the simulation and the audio engine. raceSim.ts calls these
 * and never imports the audio engine directly, which keeps the sim testable
 * and keeps audio concerns out of the physics loop.
 */
export const simAudioSink = {
  onEngine(team: string, rpm: number, load: number) {
    patternAudio.updateEngine(team, rpm, load);
  },
  onSlip(team: string, slipping: boolean) {
    if (slipping) patternAudio.playTyreSqueal(1);
  },
  onImpact(_team: string, force: number) {
    patternAudio.playImpact(force);
  },
  onBoost() {
    patternAudio.playBoost();
  },
  onGearShift() {
    patternAudio.playGearShift();
  },
  onBrake(_team: string, intensity: number) {
    patternAudio.playBrake(intensity);
  },
  onEngineStart() {
    patternAudio.playEngineStart();
  },
  onGarageDoor() {
    patternAudio.playGarageDoor();
  },
};
