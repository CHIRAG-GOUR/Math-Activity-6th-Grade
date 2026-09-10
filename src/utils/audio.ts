// ============================================================
// Web Audio API Synthesizer & Audio Master Engine for Math Activities
// - 100% Reliable Zero-Latency Web Audio Synthesizers (Nathan K3LA Train Horn, Steam Whistles, Station Bells, Steam Piston Chugs)
// - Parallel HTML5 Audio Element Playback
// - Browser Autoplay Policy Global Unlocker (Activates instantly on first user click/touch/keypress)
// - Amplified Volume Levels for Crystal-Clear Audio on All Classroom Touchscreens & Speakers
// ============================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private isBgmStarted: boolean = false;
  private railwayBgmAudio: HTMLAudioElement | null = null;
  private isRailwayBgmStarted: boolean = false;
  private trainRunningAudio: HTMLAudioElement | null = null;
  private trainHornAudio: HTMLAudioElement | null = null;
  private loudWhistleAudio: HTMLAudioElement | null = null;
  private trainBellsAudio: HTMLAudioElement | null = null;
  private bellsFadeInterval: ReturnType<typeof setInterval> | null = null;
  private runningChugInterval: ReturnType<typeof setInterval> | null = null;

  public initCtx() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {}
  }

  // ── Global Autoplay Unlocker ──
  public unlockAudio() {
    this.initCtx();
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      try {
        // Hardware wake-up buffer
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.01);
      } catch {}
    }

    // Resume any pending background music
    if (this.isBgmStarted && this.bgmAudio && this.bgmAudio.paused && !this.isMuted) {
      this.bgmAudio.play().catch(() => {});
    }
    if (this.isRailwayBgmStarted && this.railwayBgmAudio && this.railwayBgmAudio.paused && !this.isMuted) {
      this.railwayBgmAudio.play().catch(() => {});
    }
  }

  // ── Background Music Controls ──
  public startBgm(volume = 0.45) {
    if (typeof window === 'undefined') return;
    this.initCtx();
    this.isBgmStarted = true;
    try {
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio('/audio/detective-bgm.mp3');
        this.bgmAudio.loop = true;
      }
      this.bgmAudio.volume = this.isMuted ? 0 : volume;
      this.bgmAudio.play().catch(() => {});
    } catch {}
  }

  public stopBgm() {
    this.isBgmStarted = false;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }

  // Train Ambience / Music (Loud & Clear: volume 0.40)
  public startRailwayBgm(volume = 0.40) {
    if (typeof window === 'undefined') return;
    this.initCtx();
    this.isRailwayBgmStarted = true;
    try {
      if (!this.railwayBgmAudio) {
        this.railwayBgmAudio = new Audio('/audio/train_bg.mp3');
        this.railwayBgmAudio.loop = true;
      }
      this.railwayBgmAudio.volume = this.isMuted ? 0 : volume;
      this.railwayBgmAudio.play().catch(() => {});
    } catch {}
  }

  public stopRailwayBgm() {
    this.isRailwayBgmStarted = false;
    if (this.railwayBgmAudio) {
      this.railwayBgmAudio.pause();
      this.railwayBgmAudio.currentTime = 0;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = muted ? 0 : 0.45;
    }
    if (this.railwayBgmAudio) {
      this.railwayBgmAudio.volume = muted ? 0 : 0.40;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.isMuted ? 0 : 0.45;
      if (!this.isMuted && this.bgmAudio.paused && this.isBgmStarted) {
        this.bgmAudio.play().catch(() => {});
      }
    }
    if (this.railwayBgmAudio) {
      this.railwayBgmAudio.volume = this.isMuted ? 0 : 0.40;
      if (!this.isMuted && this.railwayBgmAudio.paused && this.isRailwayBgmStarted) {
        this.railwayBgmAudio.play().catch(() => {});
      }
    }
    if (!this.isMuted) {
      this.playClick();
    }
    return this.isMuted;
  }

  // ── Core UI Sounds ──

  // Button Tap / Press (Crisp mechanical click)
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Heavy Vault Wheel Handle Rotation & Lock Click
  public playVaultWheelTurn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Series of 5 rapid metallic ratchet clicks
    for (let i = 0; i < 5; i++) {
      const t = now + i * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(220 + i * 50, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.045);
    }

    // Heavy locking tumbler clank at end of rotation
    const clankTime = now + 0.38;
    const clankOsc = this.ctx.createOscillator();
    const clankGain = this.ctx.createGain();

    clankOsc.type = 'sawtooth';
    clankOsc.frequency.setValueAtTime(140, clankTime);
    clankOsc.frequency.exponentialRampToValueAtTime(45, clankTime + 0.25);

    clankGain.gain.setValueAtTime(0.65, clankTime);
    clankGain.gain.exponentialRampToValueAtTime(0.001, clankTime + 0.25);

    clankOsc.connect(clankGain);
    clankGain.connect(this.ctx.destination);

    clankOsc.start(clankTime);
    clankOsc.stop(clankTime + 0.25);
  }

  // 3 Strikes Security Alarm Klaxon
  public playSecurityAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let cycle = 0; cycle < 3; cycle++) {
      const tStart = now + cycle * 0.35;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, tStart);
      osc.frequency.linearRampToValueAtTime(440, tStart + 0.16);
      osc.frequency.linearRampToValueAtTime(880, tStart + 0.32);

      gain.gain.setValueAtTime(0.55, tStart);
      gain.gain.exponentialRampToValueAtTime(0.01, tStart + 0.33);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(tStart);
      osc.stop(tStart + 0.34);
    }
  }

  // Multiplier Boost Select
  public playMultiplier(multiplier: 1 | 2 | 3) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const baseFreq = multiplier === 1 ? 320 : multiplier === 2 ? 580 : 920;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = multiplier === 3 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.16);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Correct Answer - Triumphant Sparkle Chime
  public playCorrect(isBig: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = isBig
      ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]
      : [523.25, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.55, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.55);
    });
  }

  // Wrong Answer - Deep Mechanical Clank / Buzz
  public playWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(75, now + 0.3);

    gain.gain.setValueAtTime(0.60, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Countdown Beep (3, 2, 1)
  public playCountdownTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Countdown GO!
  public playCountdownGo() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 659.25, 880, 1174.66];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.6, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.5);
    });
  }

  // Timer Warning Pulse (<5s and <3s)
  public playTimerUrgent(isLastSeconds: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isLastSeconds ? 1050 : 800, now);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Key Earned / Vault Unlock Step
  public playKeyEarned() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [440, 554.37, 659.25, 880, 1108.73];

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.5, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.55);
    });
  }

  public playVaultGear() {
    this.playVaultWheelTurn();
  }

  // Combo Fanfare
  public playCombo(level: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords =
      level >= 5
        ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]
        : [440, 554.37, 659.25, 880];

    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.5, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.65);
    });
  }

  // Vault Cracked - Final Victory Fanfare & Explosive Chords
  public playVaultCracked() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const victoryNotes = [
      { f: 523.25, d: 0.16, t: 0 },
      { f: 659.25, d: 0.16, t: 0.15 },
      { f: 783.99, d: 0.16, t: 0.3 },
      { f: 1046.5, d: 0.45, t: 0.45 },
      { f: 880.0, d: 0.22, t: 0.88 },
      { f: 1046.5, d: 0.95, t: 1.08 },
    ];

    victoryNotes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.65, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }

  public playKeypadBeep() {
    this.playClick();
  }
  public playLockout() {
    this.playWrong();
  }
  public playVictory() {
    this.playVaultCracked();
  }
  public playTimerWarning() {
    this.playClick();
  }

  // ============================================================
  // ── NUMBER RAILWAY PROPRIETARY HIGH-FIDELITY SOUND ENGINE ──
  // ============================================================

  // 1. Authentic 4-Chime Nathan K3LA Train Horn (LOUD, IMMERSIVE BRASS BLAST)
  // Plays rich brass synthesizer immediately AND parallel MP3
  public playTrainHorn() {
    if (this.isMuted) return;
    this.initCtx();

    // ── 1. Full-Power Synthesized 4-Tone Locomotive Brass Blast (Instant, 100% Reliable) ──
    if (this.ctx) {
      const now = this.ctx.currentTime;
      // Authentic Nathan K3LA American Locomotive Horn Chords: Eb4 (311Hz), F#4 (370Hz), Bb4 (466Hz), Eb5 (622Hz)
      const hornChimes = [311.13, 369.99, 466.16, 622.25];

      const masterHornGain = this.ctx.createGain();
      masterHornGain.gain.setValueAtTime(0.01, now);
      masterHornGain.gain.linearRampToValueAtTime(0.85, now + 0.08); // Punchy brass attack
      masterHornGain.gain.setValueAtTime(0.85, now + 0.6);
      masterHornGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25); // Resonant echo decay

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(2.5, now);

      hornChimes.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        // Subtle pitch bend of heavy air pressure surge
        osc.frequency.linearRampToValueAtTime(freq * 1.018, now + 0.1);
        osc.frequency.linearRampToValueAtTime(freq, now + 0.5);

        osc.connect(filter);
        osc.start(now);
        osc.stop(now + 1.3);
      });

      filter.connect(masterHornGain);
      masterHornGain.connect(this.ctx.destination);
    }

    // ── 2. Parallel HTML5 Audio File Playback ──
    try {
      if (typeof window !== 'undefined') {
        if (!this.trainHornAudio) {
          this.trainHornAudio = new Audio('/audio/train_horn.mp3');
        }
        this.trainHornAudio.currentTime = 0;
        this.trainHornAudio.volume = 0.95;
        this.trainHornAudio.play().catch(() => {});
      }
    } catch {}
  }

  // 2. High-Pressure Dual/Triple Steam Whistle
  public playLoudWhistle() {
    if (this.isMuted) return;
    this.initCtx();

    // ── 1. Full-Power Synthesized Steam Whistle with Hiss (Instant) ──
    if (this.ctx) {
      const now = this.ctx.currentTime;
      // High steam whistle notes (D5, F#5, A5, D6)
      const whistleNotes = [587.33, 739.99, 880.0, 1174.66];

      const masterWhistleGain = this.ctx.createGain();
      masterWhistleGain.gain.setValueAtTime(0.01, now);
      masterWhistleGain.gain.linearRampToValueAtTime(0.85, now + 0.09);
      masterWhistleGain.gain.setValueAtTime(0.85, now + 0.7);
      masterWhistleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      whistleNotes.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 1.03, now + 0.12);
        osc.frequency.linearRampToValueAtTime(freq, now + 0.6);

        osc.connect(masterWhistleGain);
        osc.start(now);
        osc.stop(now + 1.25);
      });

      // Steam hiss layer
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.9);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2400, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.95);

      masterWhistleGain.connect(this.ctx.destination);
    }

    // ── 2. Parallel HTML5 Audio File Playback ──
    try {
      if (typeof window !== 'undefined') {
        if (!this.loudWhistleAudio) {
          this.loudWhistleAudio = new Audio('/audio/train_whistle_loud.mp3');
        }
        this.loudWhistleAudio.currentTime = 0;
        this.loudWhistleAudio.volume = 0.95;
        this.loudWhistleAudio.play().catch(() => {});
      }
    } catch {}
  }

  // 3. Dual-Tone Soft Train Whistle (D5 + F#5)
  public playTrainWhistle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [587.33, 739.99].forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.15);
      osc.frequency.linearRampToValueAtTime(freq, now + 0.45);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.65, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    });
  }

  // 4. Heavy 4-Stroke Locomotive Steam Piston Chugs (chug-chug-chug-chug!)
  public playTrainChug() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // 4 rhythmic steam piston strokes spaced by 0.14s
    for (let stroke = 0; stroke < 4; stroke++) {
      const t = now + stroke * 0.14;
      // Low sub-bass piston thump (80Hz -> 35Hz)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(85, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.09);

      oscGain.gain.setValueAtTime(0.65, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.095);

      // Steam noise puff
      const bufSize = Math.floor(this.ctx.sampleRate * 0.08);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, t);
      filter.Q.setValueAtTime(2.0, t);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.45, t);
      nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.085);
    }
  }

  // 5. Heavy Bronze Station Bell (4 repeating strikes + parallel MP3)
  public playTrainBells(durationMs: number = 3000) {
    if (this.isMuted) return;
    this.initCtx();

    // ── 1. Synthesized Station Bell Strikes (Instant) ──
    if (this.ctx) {
      const now = this.ctx.currentTime;
      const strikes = Math.min(6, Math.floor(durationMs / 550));

      for (let i = 0; i < strikes; i++) {
        const t = now + i * 0.55;
        // Bell harmonics: 1174.66Hz (D6) + 1760Hz (A6) + 2349Hz (D7)
        [1174.66, 1760.0, 2349.32].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          const vol = (0.55 - idx * 0.12);
          gain.gain.setValueAtTime(vol, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 1.0);
        });
      }
    }

    // ── 2. Parallel HTML5 Audio File Playback ──
    try {
      if (typeof window !== 'undefined') {
        if (this.bellsFadeInterval) {
          clearInterval(this.bellsFadeInterval);
          this.bellsFadeInterval = null;
        }
        if (!this.trainBellsAudio) {
          this.trainBellsAudio = new Audio('/audio/train_bells.mp3');
        }
        this.trainBellsAudio.currentTime = 0;
        this.trainBellsAudio.volume = 0.9;
        this.trainBellsAudio.play().catch(() => {});

        const fadeStartTime = Math.max(500, durationMs - 900);
        setTimeout(() => {
          let vol = 0.9;
          this.bellsFadeInterval = setInterval(() => {
            vol -= 0.12;
            if (this.trainBellsAudio) {
              if (vol <= 0.05) {
                if (this.bellsFadeInterval) clearInterval(this.bellsFadeInterval);
                this.trainBellsAudio.pause();
                this.trainBellsAudio.currentTime = 0;
                this.trainBellsAudio.volume = 0.9;
              } else {
                this.trainBellsAudio.volume = vol;
              }
            }
          }, 90);
        }, fadeStartTime);
      }
    } catch {}
  }

  // 6. 1.8-Second Pressurized Steam Release (Loud Billowing Hiss & Boiler Rumble)
  public playSteamRelease() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 1.8;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(2200, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(320, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.75, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration + 0.05);

    // Deep resonant boiler rumble
    const hum = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    hum.type = 'sine';
    hum.frequency.setValueAtTime(95, now);
    hum.frequency.exponentialRampToValueAtTime(50, now + 1.4);
    humGain.gain.setValueAtTime(0.4, now);
    humGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    hum.connect(humGain);
    humGain.connect(this.ctx.destination);
    hum.start(now);
    hum.stop(now + 1.45);
  }

  // 7. Track Switch Mechanism (Heavy Iron Lever Throw & Metallic Clang)
  public playSwitchMechanism() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Lever friction scrape
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.16);

    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);

    // Metallic latch lock clank
    const ringOsc = this.ctx.createOscillator();
    const ringGain = this.ctx.createGain();
    ringOsc.type = 'triangle';
    ringOsc.frequency.setValueAtTime(1400, now + 0.15);
    ringGain.gain.setValueAtTime(0.45, now + 0.15);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    ringOsc.connect(ringGain);
    ringGain.connect(this.ctx.destination);
    ringOsc.start(now + 0.15);
    ringOsc.stop(now + 0.46);
  }

  // 8. Railway Signal Status Change (Ascending Electric Chime)
  public playSignalChange() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const signalNotes = [659.25, 880.0, 1318.51]; // E5, A5, E6
    signalNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.46);
    });
  }

  // 9. Continuous Train Running Track Loop
  public playTrainRunningAudio() {
    if (this.isMuted) return;
    this.initCtx();

    // Start rhythmic synthesized chugs
    if (this.runningChugInterval) clearInterval(this.runningChugInterval);
    this.playTrainChug();
    this.runningChugInterval = setInterval(() => {
      if (!this.isMuted) {
        this.playTrainChug();
      }
    }, 650);

    // HTML5 running loop
    try {
      if (typeof window !== 'undefined') {
        if (!this.trainRunningAudio) {
          this.trainRunningAudio = new Audio('/audio/train_running.mp3');
          this.trainRunningAudio.loop = true;
        }
        this.trainRunningAudio.currentTime = 0;
        this.trainRunningAudio.volume = 0.85;
        this.trainRunningAudio.play().catch(() => {});
      }
    } catch {}
  }

  public stopTrainRunningAudio() {
    if (this.runningChugInterval) {
      clearInterval(this.runningChugInterval);
      this.runningChugInterval = null;
    }
    try {
      if (this.trainRunningAudio) {
        this.trainRunningAudio.pause();
        this.trainRunningAudio.currentTime = 0;
      }
    } catch {}
  }

  public playTrainDepart() {
    this.playTrainHorn();
  }

  public playTrainArrive() {
    this.stopTrainRunningAudio();
    this.playVaultCracked();
  }

  public playRailwayVictory() {
    this.stopTrainRunningAudio();
    this.playVaultCracked();
  }

  // 10. Authentic Retro Arcade Coin Drop & Game Startup Chime
  public playArcadeGameStart() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Dual Coin Drop Ting (B5 -> E6)
    const coinNotes = [987.77, 1318.51];
    coinNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.55, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.23);
    });

    // 2. Rising Retro 8-bit Power-Up Arpeggio
    const arpNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    arpNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = now + 0.22 + idx * 0.055;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    });

    // 3. Final Resonant Power Chime
    const endT = now + 0.58;
    const endOsc = this.ctx.createOscillator();
    const endGain = this.ctx.createGain();
    endOsc.type = 'sawtooth';
    endOsc.frequency.setValueAtTime(1046.5, endT);
    endOsc.frequency.exponentialRampToValueAtTime(2093.0, endT + 0.4);

    endGain.gain.setValueAtTime(0.5, endT);
    endGain.gain.exponentialRampToValueAtTime(0.001, endT + 0.45);

    endOsc.connect(endGain);
    endGain.connect(this.ctx.destination);

    endOsc.start(endT);
    endOsc.stop(endT + 0.46);
  }
}

export const soundManager = new SoundEngine();

// ── Attach Global Browser Autoplay Unlock Listeners Immediately on Client Load ──
if (typeof window !== 'undefined') {
  const unlockEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'];
  const globalUnlock = () => {
    soundManager.unlockAudio();
    unlockEvents.forEach((evt) => window.removeEventListener(evt, globalUnlock, true));
  };
  unlockEvents.forEach((evt) => window.addEventListener(evt, globalUnlock, { capture: true, passive: true }));
}

