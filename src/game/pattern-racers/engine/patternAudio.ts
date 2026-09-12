// ============================================================
// PATTERN RACERS — Professional Web Audio Soundscape
// Custom Synthesized Audio for Formula Track & Machinery:
// - Engine Revs, Accelerations, Gear Clicks, Hydraulic Releases
// - Mechanical Dials, Locking Bolts, Capsule Conveyors
// - Starting Gantry Lights & Race Launch Fanfare
// ============================================================

'use client';

class PatternAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private bgmOsc1: OscillatorNode | null = null;
  private bgmOsc2: OscillatorNode | null = null;
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
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = muted ? 0 : 0.08;
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
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

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
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.linearRampToValueAtTime(400, t + 0.35);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.35);

    // Heavy metallic clank at t + 0.3s
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const clankGain = this.ctx.createGain();
      const t2 = this.ctx.currentTime;

      osc.type = 'square';
      osc.frequency.setValueAtTime(180, t2);
      osc.frequency.exponentialRampToValueAtTime(45, t2 + 0.15);

      clankGain.gain.setValueAtTime(0.35, t2);
      clankGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.15);

      osc.connect(clankGain);
      clankGain.connect(this.ctx.destination);

      osc.start(t2);
      osc.stop(t2 + 0.15);
    }, 280);
  }

  // ── 3. Function Machine Gears & Capsule Conveyor ──
  public playFunctionMachine() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Series of mechanical gear ticks
    for (let i = 0; i < 6; i++) {
      const tickTime = t + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + (i % 2) * 200, tickTime);
      osc.frequency.exponentialRampToValueAtTime(150, tickTime + 0.05);

      gain.gain.setValueAtTime(0.15, tickTime);
      gain.gain.linearRampToValueAtTime(0, tickTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(tickTime);
      osc.stop(tickTime + 0.05);
    }
  }

  // ── 4. Vehicle Engine Acceleration Whoosh ──
  public playEngineRev() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.6);
    osc.frequency.linearRampToValueAtTime(220, t + 0.9);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.9);
  }

  // ── 5. Starting Light Beep (Red / Yellow / Green) ──
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

    gain.gain.setValueAtTime(isGreen ? 0.3 : 0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isGreen ? 0.6 : 0.25));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + (isGreen ? 0.6 : 0.25));
  }

  // ── 6. Correct Mathematical Confirmation ──
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

      gain.gain.setValueAtTime(0.22, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  }

  // ── 7. Non-Punishing Error Thud ──
  public playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.2);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // ── 8. Grand Prix Background Music Loop ──
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
      bassGain.connect(this.ctx.destination);

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
        melGain.connect(this.ctx.destination);

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
