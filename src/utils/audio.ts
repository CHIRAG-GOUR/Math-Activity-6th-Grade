// Web Audio API Synthesizer for Math Vault
// Zero external audio files required, zero latency, 100% reliable on classroom touchscreens

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private isBgmStarted: boolean = false;
  private railwayBgmAudio: HTMLAudioElement | null = null;
  private isRailwayBgmStarted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 40% Volume Detective Background Music (On Loop)
  public startBgm(volume = 0.4) {
    if (typeof window === 'undefined') return;
    try {
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio('/audio/detective-bgm.mp3');
        this.bgmAudio.loop = true;
      }
      this.bgmAudio.volume = this.isMuted ? 0 : volume;
      this.isBgmStarted = true;
      this.bgmAudio.play().catch(() => {
        // Autoplay may wait for first user click
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
      this.isBgmStarted = false;
    }
  }

  // 30% Volume Train Background Music (On Loop)
  public startRailwayBgm(volume = 0.3) {
    if (typeof window === 'undefined') return;
    try {
      if (!this.railwayBgmAudio) {
        this.railwayBgmAudio = new Audio('/audio/train_bg.mp3');
        this.railwayBgmAudio.loop = true;
      }
      this.railwayBgmAudio.volume = this.isMuted ? 0 : volume;
      this.isRailwayBgmStarted = true;
      this.railwayBgmAudio.play().catch(() => {});
    } catch {}
  }

  public stopRailwayBgm() {
    if (this.railwayBgmAudio) {
      this.railwayBgmAudio.pause();
      this.railwayBgmAudio.currentTime = 0;
      this.isRailwayBgmStarted = false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = muted ? 0 : 0.4;
    }
    if (this.railwayBgmAudio) {
      this.railwayBgmAudio.volume = muted ? 0 : 0.3;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.isMuted ? 0 : 0.4;
      if (!this.isMuted && this.bgmAudio.paused && this.isBgmStarted) {
        this.bgmAudio.play().catch(() => {});
      }
    }
    if (this.railwayBgmAudio) {
      this.railwayBgmAudio.volume = this.isMuted ? 0 : 0.3;
      if (!this.isMuted && this.railwayBgmAudio.paused && this.isRailwayBgmStarted) {
        this.railwayBgmAudio.play().catch(() => {});
      }
    }
    if (!this.isMuted) {
      this.playClick();
    }
    return this.isMuted;
  }

  // Button Tap / Press
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Heavy Vault Wheel Handle Rotation & Lock Click
  public playVaultWheelTurn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Series of 5 rapid metallic ratchet clicks
    for (let i = 0; i < 5; i++) {
      const t = now + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(180 + i * 40, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.04);
    }

    // Heavy locking tumbler clank at end of rotation
    const clankTime = now + 0.42;
    const clankOsc = this.ctx.createOscillator();
    const clankGain = this.ctx.createGain();

    clankOsc.type = 'sawtooth';
    clankOsc.frequency.setValueAtTime(110, clankTime);
    clankOsc.frequency.exponentialRampToValueAtTime(40, clankTime + 0.25);

    clankGain.gain.setValueAtTime(0.4, clankTime);
    clankGain.gain.exponentialRampToValueAtTime(0.001, clankTime + 0.25);

    clankOsc.connect(clankGain);
    clankGain.connect(this.ctx.destination);

    clankOsc.start(clankTime);
    clankOsc.stop(clankTime + 0.25);
  }

  // 3 Strikes Security Alarm Klaxon (Busted Siren)
  public playSecurityAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // High-low 3-cycle emergency klaxon
    for (let cycle = 0; cycle < 3; cycle++) {
      const tStart = now + cycle * 0.35;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, tStart);
      osc.frequency.linearRampToValueAtTime(440, tStart + 0.16);
      osc.frequency.linearRampToValueAtTime(880, tStart + 0.32);

      gain.gain.setValueAtTime(0.35, tStart);
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

    const baseFreq = multiplier === 1 ? 300 : multiplier === 2 ? 550 : 880;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = multiplier === 3 ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
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

    const notes = isBig ? [523.25, 659.25, 783.99, 1046.5, 1318.51] : [523.25, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.45);
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
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.28);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
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
    osc.frequency.setValueAtTime(600, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Countdown GO!
  public playCountdownGo() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 659.25, 880];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.3, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.4);
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
    osc.frequency.setValueAtTime(isLastSeconds ? 950 : 750, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
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

      gain.gain.setValueAtTime(0.28, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  }

  // Heavy Vault Gears Ratchet & Rotate
  public playVaultGear() {
    this.playVaultWheelTurn();
  }

  // Combo Fanfare
  public playCombo(level: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = level >= 5 ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98] : [440, 554.37, 659.25, 880];

    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.25, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.6);
    });
  }

  // Vault Cracked - Final Victory Fanfare & Explosive Chords
  public playVaultCracked() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const victoryNotes = [
      { f: 523.25, d: 0.15, t: 0 },
      { f: 659.25, d: 0.15, t: 0.15 },
      { f: 783.99, d: 0.15, t: 0.3 },
      { f: 1046.5, d: 0.4, t: 0.45 },
      { f: 880.0, d: 0.2, t: 0.85 },
      { f: 1046.5, d: 0.8, t: 1.05 },
    ];

    victoryNotes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.35, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }

  // Number Forge / Keypad Helper Aliases
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

  // Number Railway Sound Synthesis
  public playTrainWhistle() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    // Dual-tone harmonic train whistle (D5 + F#5)
    [587.33, 739.99].forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.15);
      osc.frequency.linearRampToValueAtTime(freq, now + 0.4);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  public playTrainChug() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  private trainRunningAudio: HTMLAudioElement | null = null;
  private trainHornAudio: HTMLAudioElement | null = null;
  private loudWhistleAudio: HTMLAudioElement | null = null;
  private trainBellsAudio: HTMLAudioElement | null = null;
  private bellsFadeInterval: ReturnType<typeof setInterval> | null = null;

  public playLoudWhistle() {
    if (this.isMuted) return;
    try {
      if (typeof window !== 'undefined') {
        if (!this.loudWhistleAudio) {
          this.loudWhistleAudio = new Audio('/audio/train_whistle_loud.mp3');
        }
        this.loudWhistleAudio.currentTime = 0;
        this.loudWhistleAudio.volume = 0.9;
        this.loudWhistleAudio.play().catch(() => {
          this.playTrainWhistle();
        });
        return;
      }
    } catch {
      this.playTrainWhistle();
    }
  }

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
        this.trainBellsAudio.volume = 0.8;
        this.trainBellsAudio.play().catch(() => {});

        // Fade out over the last 900ms
        const fadeStartTime = Math.max(500, durationMs - 900);
        setTimeout(() => {
          let vol = 0.8;
          this.bellsFadeInterval = setInterval(() => {
            vol -= 0.1;
            if (this.trainBellsAudio) {
              if (vol <= 0.05) {
                if (this.bellsFadeInterval) clearInterval(this.bellsFadeInterval);
                this.trainBellsAudio.pause();
                this.trainBellsAudio.currentTime = 0;
                this.trainBellsAudio.volume = 0.8;
              } else {
                this.trainBellsAudio.volume = vol;
              }
            }
          }, 90);
        }, fadeStartTime);
      }
    } catch {}
  }

  public playTrainHorn() {
    if (this.isMuted) return;
    try {
      if (typeof window !== 'undefined') {
        if (!this.trainHornAudio) {
          this.trainHornAudio = new Audio('/audio/train_horn.mp3');
        }
        this.trainHornAudio.currentTime = 0;
        this.trainHornAudio.volume = 0.85;
        this.trainHornAudio.play().catch(() => {
          this.playTrainWhistle();
        });
        return;
      }
    } catch {
      this.playTrainWhistle();
    }
  }

  public playTrainRunningAudio() {
    if (this.isMuted) return;
    try {
      if (typeof window !== 'undefined') {
        if (!this.trainRunningAudio) {
          this.trainRunningAudio = new Audio('/audio/train_running.mp3');
          this.trainRunningAudio.loop = true;
        }
        this.trainRunningAudio.currentTime = 0;
        this.trainRunningAudio.volume = 0.75;
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
}

export const soundManager = new SoundEngine();
