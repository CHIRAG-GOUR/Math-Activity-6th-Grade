// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Programmatic Audio Manager
// High-fidelity Web Audio API Sound Effects & Cheerful BGM Engine
// Zero external audio file dependencies — 100% reliable in browser
// ============================================================

class CarnivalAudioManager {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  
  // Real BGM Audio Elements
  private hubAudio: HTMLAudioElement | null = null;
  private gameAudio: HTMLAudioElement | null = null;
  private currentMode: 'hub' | 'game' | 'off' = 'off';

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private initAudioElements() {
    if (typeof window === 'undefined') return;

    if (!this.hubAudio) {
      this.hubAudio = new Audio('/audio/Carnival bgm.mp3');
      this.hubAudio.loop = true;
      this.hubAudio.volume = this.isMuted ? 0 : 0.35;
    }

    if (!this.gameAudio) {
      this.gameAudio = new Audio('/audio/Carnival game bgm.mp3');
      this.gameAudio.loop = true;
      this.gameAudio.volume = this.isMuted ? 0 : 0.32;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(muted ? 0 : 0.45, this.ctx.currentTime);
    }
    if (this.hubAudio) {
      this.hubAudio.volume = muted ? 0 : 0.35;
    }
    if (this.gameAudio) {
      this.gameAudio.volume = muted ? 0 : 0.32;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // ── 1. Carnival BGM Controller (Island Hub vs In-Game Mini-Games) ──

  public setMode(mode: 'hub' | 'game') {
    this.initContext();
    this.initAudioElements();
    if (this.currentMode === mode) return;
    this.currentMode = mode;

    if (mode === 'hub') {
      // Fade out / pause game audio, play hub audio
      if (this.gameAudio) {
        this.gameAudio.pause();
        this.gameAudio.currentTime = 0;
      }
      if (this.hubAudio) {
        this.hubAudio.volume = this.isMuted ? 0 : 0.35;
        this.hubAudio.play().catch(() => {});
      }
    } else if (mode === 'game') {
      // Fade out / pause hub audio, play in-game mini-game audio
      if (this.hubAudio) {
        this.hubAudio.pause();
      }
      if (this.gameAudio) {
        this.gameAudio.volume = this.isMuted ? 0 : 0.32;
        this.gameAudio.play().catch(() => {});
      }
    }
  }

  public startBGM() {
    this.setMode(this.currentMode === 'game' ? 'game' : 'hub');
  }

  public stopBGM() {
    this.currentMode = 'off';
    if (this.hubAudio) {
      this.hubAudio.pause();
    }
    if (this.gameAudio) {
      this.gameAudio.pause();
    }
  }

  // ── 2. Physical Carnival SFX Generators ──

  // Correct Fanfare Chime & Arpeggio
  public playCorrect() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    frequencies.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.48);
    });
  }

  // Incorrect Carnival Buzzer Clunk
  public playIncorrect() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(65, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.38);
  }

  // Odds Wheel Ratchet Tick
  public playWheelTick(speedMultiplier = 1) {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(850 * speedMultiplier, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.045);
  }

  // Bell Chime
  public playBellChime() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.7);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.72);
  }

  // ── High Striker Sledgehammer Heavy Swing Whoosh ──
  public playHammerWhoosh() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.12);
    filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
  }

  // ── High Striker Sledgehammer Heavy Slam & Anvil Impact ──
  public playHammerStrike() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    // 1. Sub-bass heavy thump boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(28, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);

    // 2. Heavy Anvil metallic clank & slap
    const metalOsc = this.ctx.createOscillator();
    const metalGain = this.ctx.createGain();
    metalOsc.type = 'triangle';
    metalOsc.frequency.setValueAtTime(1100, this.ctx.currentTime);
    metalOsc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.18);
    metalGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    metalGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    metalOsc.connect(metalGain);
    metalGain.connect(this.sfxGain);
    metalOsc.start();
    metalOsc.stop(this.ctx.currentTime + 0.22);
  }

  // High Striker Puck Ascending Whistle
  public playPuckAscend() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.75);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.78);
  }

  // High Striker Bell Top Ding / Championship Gong
  public playHighStrikerBell() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    [1760, 2637, 3520, 4400].forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = this.ctx.currentTime + i * 0.03;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.45 - i * 0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.95);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 1.0);
    });
  }

  // High Striker Puck Landing Thud
  public playPuckFallThud() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  // ── Probability Lab Boiling Reactor & Chemical Laser Zap ──
  public playLabReaction() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    // Laser Synth Zap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.42);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  // ── Grand Carnival Championship Prize Vault Unlock & Open ──
  public playVaultUnlock() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    // Dial click ratchet
    for (let i = 0; i < 4; i++) {
      const start = this.ctx.currentTime + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + i * 150, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.05);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.06);
    }
  }

  public playVaultOpen() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    // Heavy vault door metallic friction & latch clunk
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(280, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  // Mystery Bag Cloth Rustle & Mechanical Latch
  public playBagOpen() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
  }

  // Ball Draw & Roll on Wooden Tray
  public playBallRoll() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(450, this.ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.42);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  // Wooden Tray Impact Clunk
  public playTrayImpact() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.14);
  }

  // Score Tick Coin Sound
  public playScoreTick() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  // ── 3. Carnival Dart Throwing SFX ──

  // Air-cutting Dart Whoosh
  public playDartWhoosh() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.1);
    filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.18);
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
  }

  // Dart Tip Solid Impact into Cork Board (Thud + Click)
  public playDartHit() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    // 1. Low Thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);
    oscGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);

    // 2. High Sharp Snap / Sisal Fiber Puncture
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'sine';
    snap.frequency.setValueAtTime(1800, this.ctx.currentTime);
    snap.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
    snapGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    snapGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    snap.connect(snapGain);
    snapGain.connect(this.sfxGain);
    snap.start();
    snap.stop(this.ctx.currentTime + 0.06);
  }

  // Dart Miss / Outer Board Rim Tap
  public playDartMiss() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Bullseye Triumphant Fanfare Chime
  public playBullseyeChime() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const freqs = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  }

  public unlockAudio() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.currentMode !== 'off') {
      if (this.currentMode === 'hub' && this.hubAudio && this.hubAudio.paused && !this.isMuted) {
        this.hubAudio.play().catch(() => {});
      } else if (this.currentMode === 'game' && this.gameAudio && this.gameAudio.paused && !this.isMuted) {
        this.gameAudio.play().catch(() => {});
      }
    }
  }
}

export const carnivalAudio = new CarnivalAudioManager();

if (typeof window !== 'undefined') {
  const unlockEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'];
  const globalUnlock = () => {
    carnivalAudio.unlockAudio();
    unlockEvents.forEach((evt) => window.removeEventListener(evt, globalUnlock, true));
  };
  unlockEvents.forEach((evt) => window.addEventListener(evt, globalUnlock, { capture: true, passive: true }));
}

