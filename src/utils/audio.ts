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
  // ── NUMBER RAILWAY ORIGINAL AUDIO FILES ──
  // Plays user's original authentic MP3 tracks exclusively
  // ============================================================

  // 1. Original Locomotive Train Horn (/audio/train_horn.mp3)
  public playTrainHorn() {
    if (this.isMuted) return;
    try {
      if (typeof window !== 'undefined') {
        if (!this.trainHornAudio) {
          this.trainHornAudio = new Audio('/audio/train_horn.mp3');
        }
        this.trainHornAudio.currentTime = 0;
        this.trainHornAudio.volume = 1.0;
        this.trainHornAudio.play().catch(() => {});
      }
    } catch {}
  }

  // 2. Original Loud Steam Whistle (/audio/train_whistle_loud.mp3)
  public playLoudWhistle() {
    if (this.isMuted) return;
    try {
      if (typeof window !== 'undefined') {
        if (!this.loudWhistleAudio) {
          this.loudWhistleAudio = new Audio('/audio/train_whistle_loud.mp3');
        }
        this.loudWhistleAudio.currentTime = 0;
        this.loudWhistleAudio.volume = 1.0;
        this.loudWhistleAudio.play().catch(() => {});
      }
    } catch {}
  }

  public playTrainWhistle() {
    this.playLoudWhistle();
  }

  public playSteamRelease() {
    this.playLoudWhistle();
  }

  // 3. Original Station Bells (/audio/train_bells.mp3)
  public playTrainBells(durationMs: number = 3000) {
    if (this.isMuted) return;
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
        this.trainBellsAudio.volume = 1.0;
        this.trainBellsAudio.play().catch(() => {});

        const fadeStartTime = Math.max(500, durationMs - 900);
        setTimeout(() => {
          let vol = 1.0;
          this.bellsFadeInterval = setInterval(() => {
            vol -= 0.12;
            if (this.trainBellsAudio) {
              if (vol <= 0.05) {
                if (this.bellsFadeInterval) clearInterval(this.bellsFadeInterval);
                this.trainBellsAudio.pause();
                this.trainBellsAudio.currentTime = 0;
                this.trainBellsAudio.volume = 1.0;
              } else {
                this.trainBellsAudio.volume = vol;
              }
            }
          }, 90);
        }, fadeStartTime);
      }
    } catch {}
  }

  // 4. Original Train Running Ambience Loop (/audio/train_running.mp3)
  public playTrainRunningAudio() {
    if (this.isMuted) return;
    try {
      if (typeof window !== 'undefined') {
        if (!this.trainRunningAudio) {
          this.trainRunningAudio = new Audio('/audio/train_running.mp3');
          this.trainRunningAudio.loop = true;
        }
        this.trainRunningAudio.currentTime = 0;
        this.trainRunningAudio.volume = 1.0;
        this.trainRunningAudio.play().catch(() => {});
      }
    } catch {}
  }

  public stopTrainRunningAudio() {
    try {
      if (this.trainRunningAudio) {
        this.trainRunningAudio.pause();
        this.trainRunningAudio.currentTime = 0;
      }
    } catch {}
  }

  public playTrainChug() {
    // Chugs are handled by original train_running.mp3
  }

  public playSignalChange() {
    this.playCorrect();
  }

  public playSwitchMechanism() {
    this.playClick();
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

  // ============================================================
  // ── EQUATION MISSION CONTROL REALTIME AUDIO SYNTHESIZERS ──
  // ============================================================

  // 1. Heavy Low-Frequency Rocket Ignition & Cryo Combustion Rumble
  public playRocketIgnition() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // A. Sub-bass combustive sawtooth rumble (40Hz -> 85Hz)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(42, now);
    osc.frequency.linearRampToValueAtTime(80, now + 1.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.linearRampToValueAtTime(320, now + 1.6);

    oscGain.gain.setValueAtTime(0.01, now);
    oscGain.gain.linearRampToValueAtTime(0.85, now + 0.3);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 2.0);

    // B. Turbulent Ignition Roar Noise Buffer
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 2.0);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(260, now);
      noiseFilter.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.75, now + 0.35);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 2.0);
    } catch {}
  }

  // 2. High-Pressure Rocket Thrust Ramp & Booster Roar
  public playRocketThrustRamp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Dual Oscillators for massive twin booster vibration
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.linearRampToValueAtTime(130, now + 2.2);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(45, now);
    osc2.frequency.linearRampToValueAtTime(95, now + 2.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.linearRampToValueAtTime(750, now + 2.2);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.95, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 2.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.5);
    osc2.stop(now + 2.5);

    // High frequency exhaust jet hissing noise
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 2.5);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const nFilter = this.ctx.createBiquadFilter();
      nFilter.type = 'highpass';
      nFilter.frequency.setValueAtTime(400, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.05, now);
      nGain.gain.linearRampToValueAtTime(0.8, now + 0.6);
      nGain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);

      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 2.5);
    } catch {}
  }

  // 3. Thunderous Rocket Liftoff & Atmospheric Ascent Whoosh
  public playRocketLiftoff() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // A. Ascending jet pitch frequency curve
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 3.0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 2.8);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(1.0, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 3.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 3.2);

    // B. Crackling Rocket Flame Noise Burst
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 3.2);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const nFilter = this.ctx.createBiquadFilter();
      nFilter.type = 'bandpass';
      nFilter.frequency.setValueAtTime(550, now);
      nFilter.frequency.linearRampToValueAtTime(900, now + 3.0);
      nFilter.Q.setValueAtTime(1.2, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.15, now);
      nGain.gain.linearRampToValueAtTime(0.9, now + 0.5);
      nGain.gain.exponentialRampToValueAtTime(0.01, now + 3.2);

      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 3.2);
    } catch {}
  }

  // 4. Pad Evacuation Warning Siren Klaxon
  public playRocketSirens() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.45;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, t);
      osc.frequency.linearRampToValueAtTime(950, t + 0.22);
      osc.frequency.linearRampToValueAtTime(650, t + 0.42);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.43);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.44);
    }
  }

  // 5. Triumphant Aerospace Victory Fanfare (Multi-voice Brass Chords)
  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const chords = [
      { notes: [261.63, 329.63, 392.0], duration: 0.25, time: 0 },       // C Major
      { notes: [261.63, 329.63, 392.0], duration: 0.25, time: 0.28 },    // C Major
      { notes: [261.63, 329.63, 392.0], duration: 0.25, time: 0.56 },    // C Major
      { notes: [349.23, 440.0, 523.25], duration: 0.75, time: 0.84 },    // F Major
      { notes: [392.0, 493.88, 587.33], duration: 0.45, time: 1.62 },    // G Major
      { notes: [523.25, 659.25, 783.99, 1046.5], duration: 1.4, time: 2.1 }, // High C Major Brilliance
    ];

    chords.forEach((chord) => {
      chord.notes.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + chord.time);

        gain.gain.setValueAtTime(0.001, now + chord.time);
        gain.gain.linearRampToValueAtTime(0.35, now + chord.time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + chord.duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + chord.time);
        osc.stop(now + chord.time + chord.duration + 0.05);
      });
    });
  }

  // Generic Sound Dispatcher for Arcade Activities
  public play(
    soundName:
      | 'click'
      | 'tap'
      | 'pop'
      | 'correct'
      | 'success'
      | 'wrong'
      | 'error'
      | 'buzz'
      | 'lock'
      | 'gear'
      | 'laser'
      | 'powerup'
      | 'switch'
      | 'countdown'
      | 'alarm'
      | 'whistle'
      | 'horn'
      | 'rocket-ignition'
      | 'rocket-thrust'
      | 'rocket-liftoff'
      | 'rocket-siren'
      | 'fanfare'
      | string
  ) {
    if (this.isMuted) return;
    switch (soundName) {
      case 'click':
      case 'tap':
      case 'switch':
        this.playClick();
        break;
      case 'pop':
      case 'lock':
      case 'gear':
        this.playVaultGear();
        break;
      case 'correct':
      case 'success':
      case 'powerup':
        this.playCorrect(true);
        break;
      case 'wrong':
      case 'error':
      case 'buzz':
        this.playWrong();
        break;
      case 'laser':
        this.playMultiplier(2);
        break;
      case 'countdown':
        this.playCountdownGo();
        break;
      case 'alarm':
      case 'rocket-siren':
        this.playRocketSirens();
        break;
      case 'rocket-ignition':
        this.playRocketIgnition();
        break;
      case 'rocket-thrust':
        this.playRocketThrustRamp();
        break;
      case 'rocket-liftoff':
        this.playRocketLiftoff();
        break;
      case 'fanfare':
        this.playVictoryFanfare();
        break;
      default:
        this.playClick();
        break;
    }
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

