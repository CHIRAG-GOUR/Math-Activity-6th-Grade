// ============================================================
// THE SOLAR FORGE: Audio Synthesizer (Web Audio API)
// Mechanical actuators, servo motors, solar beam resonance,
// electrical power-up hums, sundial clicks & facility ambience.
// ============================================================

class SolarForgeAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambienceOsc: OscillatorNode | null = null;
  private ambienceGain: GainNode | null = null;

  private init() {
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
    if (this.bgmAudio) {
      this.bgmAudio.volume = muted ? 0 : this.bgmVolume;
    }
    if (this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : this.bgmVolume, this.ctx?.currentTime || 0);
    }
    if (this.ambienceGain) {
      this.ambienceGain.gain.setValueAtTime(muted ? 0 : 0.04, this.ctx?.currentTime || 0);
    }
  }

  // 1. Mechanical gear click / Protractor tick
  public playDialClick(frequency = 750) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // 2. Servo Motor / Hydraulic Mirror Rotation
  public playServoMotor() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(185, this.ctx.currentTime + 0.4);
    osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.3);
  }

  // 3. Sunlight Beam Hit & Focus Hum
  public playBeamFocus() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.35);

    osc2.frequency.setValueAtTime(554.37, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1108.73, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.65);
    osc2.stop(this.ctx.currentTime + 0.65);
  }

  // 4. Receiver Power-up & Energy Surge
  public playReceiverPowerUp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Harmonic chord: C4, E4, G4, C5
    const freqs = [261.63, 329.63, 392.00, 523.25];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx!.currentTime + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.85);
    });
  }

  // 5. Angle Misalignment / Off Target Warning
  public playOffTarget() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.setValueAtTime(185, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  // 6. Geometry Snap / Arc Construction
  public playGeometrySnap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(987.77, this.ctx.currentTime + 0.08); // B5

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.14);
  }

  // 7. Central Solar Forge Ignition & Full Power Resonance
  public playSolarForgeIgnition() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Deep sub-bass turbine rumble + high energy rising chime
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 2.0);

    subGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    subGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.8);
    subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.2);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start();
    subOsc.stop(this.ctx.currentTime + 3.3);

    // Major triumphal fanfare: C4 -> G4 -> C5 -> E5 -> G5
    const fanfareNotes = [261.63, 392.00, 523.25, 659.25, 783.99];
    fanfareNotes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + 0.4 + idx * 0.18);

      gain.gain.setValueAtTime(0.001, this.ctx!.currentTime + 0.4 + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.16, this.ctx!.currentTime + 0.4 + idx * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.4 + idx * 0.18 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + 0.4 + idx * 0.18);
      osc.stop(this.ctx!.currentTime + 0.4 + idx * 0.18 + 1.3);
    });
  }

  // ── 8. SOLAR GAME BGM (User's Solar Game Bgm.mp3 at 30% Volume) ──
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmGain: GainNode | null = null;
  private bgmIntervalId: ReturnType<typeof setInterval> | null = null;
  private isBgmPlaying: boolean = false;
  private bgmVolume: number = 0.30; // Strictly 30% as requested

  public startSolarBGM(volume = 0.30) {
    if (this.isBgmPlaying) return;
    this.bgmVolume = volume;
    this.isBgmPlaying = true;

    // 1. First priority: Play user's public/audio/Solar Game Bgm.mp3
    if (typeof window !== 'undefined') {
      try {
        if (!this.bgmAudio) {
          this.bgmAudio = new Audio('/audio/Solar Game Bgm.mp3');
          this.bgmAudio.loop = true;
        }
        this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
        const playPromise = this.bgmAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio element autoplay policy caught, falling back to Web Audio:', err);
            this.startProceduralSolarBGM(volume);
          });
        }
        return;
      } catch (e) {
        console.warn('Error loading audio file, using procedural fallback:', e);
      }
    }

    this.startProceduralSolarBGM(volume);
  }

  private startProceduralSolarBGM(volume = 0.30) {
    this.init();
    if (!this.ctx) return;

    // Master BGM gain bus set to 30%
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : volume, this.ctx.currentTime);
    this.bgmGain.connect(this.ctx.destination);

    // Warm solar daylight chords (D major, A major, B minor, G major)
    const chords = [
      [146.83, 220.00, 293.66, 369.99, 440.00], // D major 9 (D3, A3, D4, F#4, A4)
      [110.00, 164.81, 220.00, 277.18, 329.63], // A major (A2, E3, A3, C#4, E4)
      [123.47, 185.00, 246.94, 293.66, 369.99], // B minor 7 (B2, F#3, B3, D4, F#4)
      [98.00, 146.83, 196.00, 246.94, 293.66],  // G major add9 (G2, D3, G3, B3, D4)
    ];

    const arpeggioNotes = [587.33, 659.25, 739.99, 880.00, 1108.73, 1174.66]; // D5, E5, F#5, A5, C#6, D6

    let chordIdx = 0;
    let stepCount = 0;

    const playChordStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      // Play smooth pad chord
      currentChord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const filter = this.ctx!.createBiquadFilter();
        const noteGain = this.ctx!.createGain();

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450 + idx * 80, this.ctx!.currentTime);

        const chordDuration = 4.2;
        noteGain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.045, this.ctx!.currentTime + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + chordDuration);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.bgmGain!);

        osc.start(this.ctx!.currentTime);
        osc.stop(this.ctx!.currentTime + chordDuration + 0.1);
      });

      // Play 3 sparkling arpeggio chime notes over the chord
      for (let i = 0; i < 3; i++) {
        const delay = 0.8 + i * 0.9 + Math.random() * 0.3;
        const note = arpeggioNotes[(stepCount + i * 2) % arpeggioNotes.length];

        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(note, this.ctx.currentTime + delay);

        chimeGain.gain.setValueAtTime(0.0001, this.ctx.currentTime + delay);
        chimeGain.gain.linearRampToValueAtTime(0.025, this.ctx.currentTime + delay + 0.08);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + 1.4);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.bgmGain);

        chimeOsc.start(this.ctx.currentTime + delay);
        chimeOsc.stop(this.ctx.currentTime + delay + 1.5);
      }

      stepCount++;
    };

    // First chord immediately
    playChordStep();
    // Continue loop every 4.0 seconds
    this.bgmIntervalId = setInterval(playChordStep, 4000);
  }

  public stopSolarBGM() {
    this.isBgmPlaying = false;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch (e) {
        // Ignore
      }
    }
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.bgmGain) {
      try {
        this.bgmGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
      } catch (e) {
        // Ignore
      }
    }
  }

  public setBGMVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
    }
  }

  public getBGMVolume() {
    return this.bgmVolume;
  }

  // 9. Soft Outdoor Facility Ambience
  public startFacilityAmbience() {
    if (this.ambienceOsc) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);

    gain.gain.setValueAtTime(this.isMuted ? 0 : 0.025, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    this.ambienceOsc = osc;
    this.ambienceGain = gain;
  }

  // 10. Winner VIP Celebration Party Cheer
  public playPartyCheer() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Upbeat sparkling celebration arpeggio
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.01, this.ctx!.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx!.currentTime + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 1.1);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 1.2);
    });
  }
}

export const solarAudio = new SolarForgeAudioEngine();
