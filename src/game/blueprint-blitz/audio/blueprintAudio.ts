// ============================================================
// BLUEPRINT BLITZ — Minecraft-Style Physical Construction Sound Engine
// Authentic Minecraft-inspired procedural Web Audio synthesis:
// - Stone / Brick block place & break (crunchy rocky thud)
// - Wood planks knock & snap (warm organic hollow resonance)
// - Sand / Gravel shovel digging & dumping (granular white-noise crunch)
// - Metal Anvil / Hammer strike (metallic clang with harmonic ringing decay)
// - Glass window placing (crisp crystal snap)
// - Minecraft XP Orb chime & level up fanfare (pitch-shifted crystal chimes)
// - Wooden Door open / close latch
// - Measurement Scanner & Hydraulic Machinery hums
// ============================================================

class BlueprintAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;

  // Real Background Audio Tracks (40% volume on loop)
  private constructionBgmAudio: HTMLAudioElement | null = null;
  private constructionSiteSoundAudio: HTMLAudioElement | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
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
  }

  private initAudioElements() {
    if (typeof window === 'undefined') return;

    if (!this.constructionBgmAudio) {
      try {
        this.constructionBgmAudio = new Audio('/audio/Construction Game BGm.mp3');
        this.constructionBgmAudio.loop = true;
        this.constructionBgmAudio.volume = this.isMuted ? 0 : 0.40;
      } catch {}
    }

    if (!this.constructionSiteSoundAudio) {
      try {
        this.constructionSiteSoundAudio = new Audio('/audio/Construction Site Sound.wav');
        this.constructionSiteSoundAudio.loop = true;
        this.constructionSiteSoundAudio.volume = this.isMuted ? 0 : 0.40;
      } catch {}
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.constructionBgmAudio) {
      this.constructionBgmAudio.volume = muted ? 0 : 0.40;
      if (muted) {
        this.constructionBgmAudio.pause();
      } else if (this.isBgmPlaying) {
        this.constructionBgmAudio.play().catch(() => {});
      }
    }
    if (this.constructionSiteSoundAudio) {
      this.constructionSiteSoundAudio.volume = muted ? 0 : 0.40;
      if (muted) {
        this.constructionSiteSoundAudio.pause();
      } else if (this.isBgmPlaying) {
        this.constructionSiteSoundAudio.play().catch(() => {});
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Helper to create bandpass filtered noise (essential for Minecraft block crunches)
  private playFilteredNoise(
    duration: number,
    freq: number,
    gainVal: number,
    type: 'bandpass' | 'lowpass' | 'highpass' = 'bandpass'
  ) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + duration);
  }

  // ── 1. MINECRAFT STONE / BRICK BLOCK PLACE ──
  public playStonePlace() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low stone thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.09);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);

    // Stone crunch noise texture
    this.playFilteredNoise(0.08, 1200, 0.35, 'bandpass');
  }

  // ── 2. MINECRAFT WOOD PLANKS KNOCK & PLACE ──
  public playWoodPlace() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.07);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);

    // Wood snap texture
    this.playFilteredNoise(0.06, 600, 0.25, 'bandpass');
  }

  // ── 3. MINECRAFT SAND / GRAVEL SHOVEL SCOOP ──
  public playSandDig() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Granular sand scraping crunch
    this.playFilteredNoise(0.18, 950, 0.45, 'bandpass');

    // Subtle shovel blade metallic friction
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.12);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // ── 4. MINECRAFT SAND DUMP / DROP ──
  public playSandDrop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.playFilteredNoise(0.22, 500, 0.35, 'lowpass');
  }

  // ── 5. MINECRAFT ANVIL / HAMMER STRIKE (Heavy Clang + Harmonic Ring) ──
  public playHammerStrike() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Heavy metallic strike impact
    const strikeOsc = this.ctx.createOscillator();
    const strikeGain = this.ctx.createGain();
    strikeOsc.type = 'sawtooth';
    strikeOsc.frequency.setValueAtTime(420, now);
    strikeOsc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
    strikeGain.gain.setValueAtTime(0.4, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    strikeOsc.connect(strikeGain);
    strikeGain.connect(this.ctx.destination);
    strikeOsc.start(now);
    strikeOsc.stop(now + 0.08);

    // Harmonic metallic ringing resonance (Minecraft anvil style)
    const ringOsc = this.ctx.createOscillator();
    const ringGain = this.ctx.createGain();
    ringOsc.type = 'sine';
    ringOsc.frequency.setValueAtTime(1480, now);
    ringGain.gain.setValueAtTime(0.3, now);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    ringOsc.connect(ringGain);
    ringGain.connect(this.ctx.destination);
    ringOsc.start(now);
    ringOsc.stop(now + 0.45);

    this.playFilteredNoise(0.06, 2400, 0.2, 'highpass');
  }

  // ── 6. MINECRAFT GLASS BLOCK SNAP ──
  public playGlassPlace() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1960, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.1);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);

    this.playFilteredNoise(0.07, 3200, 0.3, 'highpass');
  }

  // ── 7. MINECRAFT XP ORB CHIME (Ascending Crystal Ding) ──
  public playXpOrbChime(step: number = 0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 880 * Math.pow(1.059463, (step % 12)); // Chromatic pitch step
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // ── 8. MINECRAFT BLOCK BREAK / DEMOLISH ──
  public playBlockRemove() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.14);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);

    this.playFilteredNoise(0.12, 800, 0.4, 'bandpass');
  }

  // ── 9. MINECRAFT LEVEL UP / HOUSE STAGE COMPLETE FANFARE ──
  public playStageCompleteFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Minecraft level-up sequence
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = now + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.7);
    });
  }

  // ── 10. WOODEN DOOR CREAK & LATCH ──
  public playDoorLatch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.1);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // ── 11. BUTTON MECHANICAL CLICK ──
  public playButtonTap() {
    this.playWoodPlace();
  }

  // ── 12. BRICK / CONCRETE CLUNKS ──
  public playBrickClunk() {
    this.playStonePlace();
  }
  public playConcreteThud() {
    this.playStonePlace();
  }
  public playWoodKnock() {
    this.playWoodPlace();
  }
  public playMetalClang() {
    this.playHammerStrike();
  }
  public playBlockPlace() {
    this.playStonePlace();
  }

  // ── 13. HYDRAULIC CRANE MOTOR ──
  public playCraneMove() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(85, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.15);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // ── 14. MEASUREMENT SCANNER SWEEP ──
  public playScannerSweep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.2;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t);
      osc.frequency.exponentialRampToValueAtTime(1567.98, t + 0.1);
      osc.frequency.exponentialRampToValueAtTime(392.0, t + 0.2);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.2);
    }
  }

  // ── 15. BUILD APPROVED (CHIME) ──
  public playBuildApproved() {
    this.playStageCompleteFanfare();
  }

  // ── 16. MISMATCH WARNING BUZZER ──
  public playBuildMismatch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [220, 174.61];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = now + idx * 0.14;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  // ── 17. ROUND START SIREN ──
  public playRoundStart() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(261.63, now);
    osc.frequency.linearRampToValueAtTime(523.25, now + 0.22);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // ── 18. CHAMPIONSHIP VICTORY FANFARE ──
  public playChampionshipVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    fanfareNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = now + idx * 0.1;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.4);
    });
  }

  // ── 19. DUAL CONSTRUCTION SITE BGM & AMBIENCE (40% Volume on Loop) ──
  public startBgm() {
    this.initCtx();
    this.initAudioElements();
    this.isBgmPlaying = true;

    // Track 1: Construction Game BGM (40% volume on loop)
    if (this.constructionBgmAudio) {
      this.constructionBgmAudio.volume = this.isMuted ? 0 : 0.40;
      this.constructionBgmAudio.loop = true;
      this.constructionBgmAudio.play().catch(() => {});
    }

    // Track 2: Construction Site Sound Ambience (40% volume on loop)
    if (this.constructionSiteSoundAudio) {
      this.constructionSiteSoundAudio.volume = this.isMuted ? 0 : 0.40;
      this.constructionSiteSoundAudio.loop = true;
      this.constructionSiteSoundAudio.play().catch(() => {});
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.constructionBgmAudio) {
      this.constructionBgmAudio.pause();
      this.constructionBgmAudio.currentTime = 0;
    }
    if (this.constructionSiteSoundAudio) {
      this.constructionSiteSoundAudio.pause();
      this.constructionSiteSoundAudio.currentTime = 0;
    }
  }

  public pauseBgm() {
    if (this.constructionBgmAudio) this.constructionBgmAudio.pause();
    if (this.constructionSiteSoundAudio) this.constructionSiteSoundAudio.pause();
  }

  public resumeBgm() {
    if (!this.isMuted && this.isBgmPlaying) {
      if (this.constructionBgmAudio) this.constructionBgmAudio.play().catch(() => {});
      if (this.constructionSiteSoundAudio) this.constructionSiteSoundAudio.play().catch(() => {});
    }
  }
}

export const blueprintAudio = new BlueprintAudioEngine();
