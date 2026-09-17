// ============================================================
// PERCENTAGE HARVEST — AUDIO SYNTHESIZER & SOUND ENGINE
// Realistic farm sound effects (Cows, Goats, Chickens, Knapsack Sprayer,
// Manure Spreading, Sowing, Harvester, Delivery Truck V8 & Air-Horn)
// + Uplifting Pastoral Countryside Game BGM (Web Audio Polyphonic Synthesizer)
// ============================================================

'use client';

import { SimEvent } from '../types';

/** Musical note frequencies in Hz */
const NOTE_FREQS: Record<string, number> = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98,
};

class FarmAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;

  // Tractor engine nodes
  private tractorGain: GainNode | null = null;
  private tractorOsc1: OscillatorNode | null = null;
  private tractorOsc2: OscillatorNode | null = null;
  private tractorLfo: OscillatorNode | null = null;
  private isTractorRunning = false;

  // Delivery truck driving nodes
  private truckGain: GainNode | null = null;
  private truckOsc1: OscillatorNode | null = null;
  private truckOsc2: OscillatorNode | null = null;
  private truckNoise: AudioBufferSourceNode | null = null;
  private isTruckRunning = false;

  // Ambient animal & nature loop timer
  private ambientInterval: any = null;

  // BGM Synthesizer Scheduler State
  private isBgmPlaying = false;
  private bgmTimer: any = null;
  private nextNoteTime = 0;
  private current16thStep = 0;
  private readonly tempo = 104; // BPM (pastoral cozy pace)
  private readonly secondsPerStep = 60 / (104 * 4); // 16th note duration

  private muted = false;
  private userUnlocked = false;

  // ─────────────────────────────────────────────────────────────
  // 1. CONTEXT INITIALIZATION & MASTER ROUTING
  // ─────────────────────────────────────────────────────────────
  public initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    if (this.ctx && !this.masterGain) {
      // Dynamic master compression for warm punchy acoustic sound
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-12, this.ctx.currentTime);
      comp.knee.setValueAtTime(30, this.ctx.currentTime);
      comp.ratio.setValueAtTime(6, this.ctx.currentTime);
      comp.attack.setValueAtTime(0.003, this.ctx.currentTime);
      comp.release.setValueAtTime(0.25, this.ctx.currentTime);
      comp.connect(this.ctx.destination);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.85, this.ctx.currentTime);
      this.masterGain.connect(comp);

      // SFX Bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // BGM Bus (with warm low-pass filter)
      const bgmFilter = this.ctx.createBiquadFilter();
      bgmFilter.type = 'lowpass';
      bgmFilter.frequency.setValueAtTime(4200, this.ctx.currentTime);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      this.bgmGain.connect(bgmFilter);
      bgmFilter.connect(this.masterGain);
    }
  }

  /** Unlocks browser audio policy on user interaction and kicks off music */
  public unlock() {
    this.userUnlocked = true;
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    this.startBgm();
    this.startAmbience();
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.85, this.ctx.currentTime, 0.03);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PASTORAL COUNTRYSIDE GAME BGM SYNTHESIZER
  // 16-Bar continuous loop in C / G Major pentatonic with
  // Acoustic Guitar arpeggios, Marimba melody, Upright Bass & Shakers
  // ─────────────────────────────────────────────────────────────
  public startBgm() {
    if (this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.current16thStep = 0;

    if (this.bgmTimer) clearInterval(this.bgmTimer);
    this.bgmTimer = setInterval(() => {
      this.scheduleBgmSteps();
    }, 25);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  /** Schedules upcoming 16th note steps up to 100ms in advance */
  private scheduleBgmSteps() {
    if (!this.ctx || !this.isBgmPlaying || this.muted) return;
    const scheduleAheadTime = 0.12; // 120ms lookahead

    while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
      this.playBgmStep(this.current16thStep, this.nextNoteTime);
      this.nextNoteTime += this.secondsPerStep;
      this.current16thStep = (this.current16thStep + 1) % 256; // 16 bars * 16 steps = 256
    }
  }

  /** Plays individual notes for a 16th note subdivision */
  private playBgmStep(step: number, time: number) {
    if (!this.ctx || !this.bgmGain) return;

    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;
    const beatInBar = Math.floor(stepInBar / 4); // 0, 1, 2, 3
    const subBeat = stepInBar % 4; // 0, 1, 2, 3

    // 16-Bar Chord Progression:
    // Bars 0-3:   Cmaj -> Gmaj -> Amin -> Fmaj
    // Bars 4-7:   Cmaj -> Emin -> Fmaj -> Gmaj
    // Bars 8-11:  Amin -> Emin -> Fmaj -> Cmaj
    // Bars 12-15: Dmin -> G7   -> Cmaj -> Gmaj
    const chordRoots = [
      { root: 'C3', chord: ['C4', 'E4', 'G4', 'C5'], bass: ['C2', 'G2'] },
      { root: 'G2', chord: ['B3', 'D4', 'G4', 'B4'], bass: ['G2', 'D3'] },
      { root: 'A2', chord: ['A3', 'C4', 'E4', 'A4'], bass: ['A2', 'E2'] },
      { root: 'F2', chord: ['A3', 'C4', 'F4', 'A4'], bass: ['F2', 'C3'] },

      { root: 'C3', chord: ['C4', 'E4', 'G4', 'C5'], bass: ['C2', 'G2'] },
      { root: 'E2', chord: ['G3', 'B3', 'E4', 'G4'], bass: ['E2', 'B2'] },
      { root: 'F2', chord: ['A3', 'C4', 'F4', 'A4'], bass: ['F2', 'C3'] },
      { root: 'G2', chord: ['B3', 'D4', 'G4', 'D5'], bass: ['G2', 'D3'] },

      { root: 'A2', chord: ['A3', 'C4', 'E4', 'C5'], bass: ['A2', 'E2'] },
      { root: 'E2', chord: ['G3', 'B3', 'E4', 'B4'], bass: ['E2', 'B2'] },
      { root: 'F2', chord: ['A3', 'C4', 'F4', 'C5'], bass: ['F2', 'C3'] },
      { root: 'C3', chord: ['C4', 'E4', 'G4', 'E5'], bass: ['C2', 'G2'] },

      { root: 'D2', chord: ['F3', 'A3', 'D4', 'F4'], bass: ['D2', 'A2'] },
      { root: 'G2', chord: ['F3', 'G3', 'B3', 'D4'], bass: ['G2', 'D3'] },
      { root: 'C3', chord: ['E3', 'G3', 'C4', 'E4'], bass: ['C2', 'G2'] },
      { root: 'G2', chord: ['D3', 'G3', 'B3', 'G4'], bass: ['G2', 'D3'] },
    ];

    const cur = chordRoots[bar % 16];

    // ── 1. UPRIGHT ACOUSTIC BASS (Beats 0 and 2) ──
    if (subBeat === 0) {
      if (beatInBar === 0 || beatInBar === 2) {
        const bassNote = beatInBar === 0 ? cur.bass[0] : cur.bass[1];
        this.synthBassNote(bassNote, time, 0.38);
      }
    }

    // ── 2. ACOUSTIC GUITAR FINGERPICK ARPEGGIO (Every 8th note) ──
    if (subBeat === 0 || subBeat === 2) {
      const pickIdx = (beatInBar * 2 + (subBeat === 2 ? 1 : 0)) % cur.chord.length;
      const guitarNote = cur.chord[pickIdx];
      this.synthAcousticPluck(guitarNote, time, 0.18);
    }

    // ── 3. MARIMBA / KALIMBA LEAD MELODY ──
    // Whimsical pastoral melody note map (step -> note)
    const melodyMap: Record<number, string> = {
      0: 'E5', 4: 'G5', 8: 'A5', 12: 'G5',
      16: 'D5', 20: 'B4', 24: 'D5', 28: 'E5',
      32: 'C5', 36: 'E5', 40: 'G5', 44: 'A5',
      48: 'G5', 52: 'F5', 56: 'E5', 60: 'D5',

      64: 'E5', 68: 'G5', 72: 'C6', 76: 'B5',
      80: 'G5', 84: 'E5', 88: 'G5', 92: 'A5',
      96: 'F5', 100: 'A5', 104: 'C6', 108: 'A5',
      112: 'G5', 116: 'E5', 120: 'D5', 124: 'C5',

      128: 'A5', 132: 'C6', 136: 'B5', 140: 'A5',
      144: 'G5', 148: 'E5', 152: 'D5', 156: 'E5',
      160: 'F5', 164: 'A5', 168: 'G5', 172: 'F5',
      176: 'E5', 180: 'G5', 184: 'C6', 188: 'D6',

      192: 'F5', 196: 'A5', 200: 'D6', 204: 'C6',
      208: 'B5', 212: 'G5', 216: 'A5', 220: 'B5',
      224: 'C6', 228: 'G5', 232: 'E5', 236: 'C5',
      240: 'D5', 244: 'E5', 248: 'D5', 252: 'C5',
    };

    if (melodyMap[step]) {
      this.synthMarimbaNote(melodyMap[step], time, 0.45);
    }

    // ── 4. SOFT MEADOW PERCUSSION & SHAKER ──
    if (subBeat === 0 || subBeat === 2) {
      const isAccent = beatInBar === 1 || beatInBar === 3;
      this.synthShakerHit(time, isAccent ? 0.05 : 0.025);
    }
  }

  /** Synthesizes warm wooden marimba tone */
  private synthMarimbaNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note] || 440;

    // Fundamental + 4th harmonic for wooden bar chime
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 3.85, time); // acoustic wooden overtone

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.14, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.05);
    osc2.stop(time + duration + 0.05);
  }

  /** Synthesizes acoustic guitar/ukulele plucked string */
  private synthAcousticPluck(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note] || 330;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.exponentialRampToValueAtTime(600, time + duration);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.09, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  /** Synthesizes warm upright acoustic bass */
  private synthBassNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note] || 110;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration + 0.03);
  }

  /** Synthesizes gentle rhythmic country shaker */
  private synthShakerHit(time: number, vol: number) {
    if (!this.ctx || !this.bgmGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.038);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    noise.start(time);
    noise.stop(time + 0.04);
  }

  // ─────────────────────────────────────────────────────────────
  // 3. REALISTIC FARM ANIMAL SOUND SYNTHESIZERS
  // ─────────────────────────────────────────────────────────────

  /** Realistic Cow Lowing / "Moooo-o-o-uh" with bovine vocal tract formants */
  public playCowMoo() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const dur = 1.4;

    // Vocal cord oscillator
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.linearRampToValueAtTime(125, now + 0.25);
    osc.frequency.linearRampToValueAtTime(96, now + 1.1);
    osc.frequency.exponentialRampToValueAtTime(80, now + dur);

    // Sub-chest cavity resonance
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(58, now);
    subOsc.frequency.linearRampToValueAtTime(48, now + dur);

    // Formant 1: Mouth opening (450Hz -> 380Hz)
    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(450, now);
    f1.frequency.linearRampToValueAtTime(360, now + dur);
    f1.Q.setValueAtTime(3.5, now);

    // Formant 2: Nasal throat (820Hz -> 680Hz)
    const f2 = this.ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(820, now);
    f2.frequency.linearRampToValueAtTime(680, now + dur);
    f2.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.18);
    gain.gain.setValueAtTime(0.16, now + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(f1);
    osc.connect(f2);
    subOsc.connect(f1);

    f1.connect(gain);
    f2.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + dur + 0.05);
    subOsc.stop(now + dur + 0.05);
  }

  /** Realistic Goat / Sheep Bleat with vocal cord flutter "Maa-a-a-a-h!" */
  public playGoatBleat() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const dur = 0.75;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.linearRampToValueAtTime(270, now + dur);

    // Rapid 18Hz tremolo LFO for throat bleat flutter
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(17, now);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(25, now);
    lfo.connect(osc.frequency);

    // Nasal goat formant
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1180, now);
    filter.Q.setValueAtTime(3.2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.04);
    gain.gain.setValueAtTime(0.12, now + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + dur + 0.02);
    lfo.stop(now + dur + 0.02);
  }

  /** Realistic Chicken Cluck & Cackle "Bawk... bawk-bawk!" */
  public playChickenCluck() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const cluckOffsets = [0, 0.12, 0.22, 0.42];

    cluckOffsets.forEach((tOffset, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + tOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      const startF = idx === 3 ? 720 : 540 + Math.random() * 80;
      osc.frequency.setValueAtTime(startF, t);
      osc.frequency.exponentialRampToValueAtTime(startF * 0.55, t + 0.07);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(2.5, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.09);
    });
  }

  /** Sky Meadow Birds Singing */
  public playBirdChirp() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 2300 + Math.random() * 700;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq - 250, now + 0.16);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /** Morning Dawn Rooster Crow "Cock-a-doodle-doo!" */
  public playRoosterMorning() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const roosterNotes = [
      { f: 520, start: 0, dur: 0.12 },
      { f: 740, start: 0.13, dur: 0.16 },
      { f: 980, start: 0.30, dur: 0.22 },
      { f: 1240, start: 0.54, dur: 0.65 },
    ];

    roosterNotes.forEach((n) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, now + n.start);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, now + n.start);

      gain.gain.setValueAtTime(0.1, now + n.start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur + 0.03);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. REALISTIC FARM EQUIPMENT & VEHICLE SOUNDS
  // ─────────────────────────────────────────────────────────────

  /** Indian Farmer Knapsack Sprayer: Mechanical pump click + pressurized mist hiss */
  public playKnapsackSpray() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    // 1. Mechanical pump lever compression click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(680, now);
    clickOsc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
    clickGain.gain.setValueAtTime(0.12, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    clickOsc.connect(clickGain);
    clickGain.connect(this.sfxGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.06);

    // 2. Continuous high-pressure fine aerosol mist spray hiss
    const dur = 1.1;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) data[j] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4600, now + 0.05);
    filter.frequency.linearRampToValueAtTime(4200, now + dur);
    filter.Q.setValueAtTime(3.2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gain.gain.setValueAtTime(0.14, now + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now + 0.05);
    noise.stop(now + dur + 0.02);
  }

  /** Granular Manure / Fertilizer Broadcast Scatter on Soil */
  public playManureScatter() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const t = now + i * 0.09;
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.07), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750 + Math.random() * 300, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(t);
      noise.stop(t + 0.07);
    }
  }

  /** Sowing Seeds into Furrows */
  public playSowingSeeds() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Soil shovel swish
    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.25), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.22);
    filter.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
    noise.stop(now + 0.25);

    // Light seed drops
    for (let i = 0; i < 4; i++) {
      const st = now + 0.12 + i * 0.05;
      const osc = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2800 + i * 200, st);
      sGain.gain.setValueAtTime(0.05, st);
      sGain.gain.exponentialRampToValueAtTime(0.001, st + 0.04);
      osc.connect(sGain);
      sGain.connect(this.sfxGain);
      osc.start(st);
      osc.stop(st + 0.05);
    }
  }

  /** Delivery Truck Dual-Tone Air Horn ("TOOT-TOOT!") */
  public playTruckHorn() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const blasts = [0, 0.24];

    blasts.forEach((blastOffset) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + blastOffset;
      const dur = 0.18;

      // Tone 1: C#4 (277 Hz)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(277.18, t);

      // Tone 2: F4 (349 Hz)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(349.23, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
      gain.gain.setValueAtTime(0.16, t + dur * 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + dur + 0.02);
      osc2.stop(t + dur + 0.02);
    });
  }

  /** Air brake release hiss ("Psssshh-t") */
  public playAirBrakeHiss() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const dur = 0.35;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + dur + 0.02);
  }

  /** Continuous Truck Driving Sound (Heavy Diesel V8 Rumble + Turbo + Road Tread) */
  public playTruckDrive(active: boolean) {
    if (this.muted) {
      this.stopTruckDrive();
      return;
    }
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    if (active && !this.isTruckRunning) {
      this.isTruckRunning = true;
      const now = this.ctx.currentTime;

      // Air brake release hiss on departure
      this.playAirBrakeHiss();

      // 1. Heavy Diesel Engine V8 rumble (twin detuned oscillators)
      this.truckOsc1 = this.ctx.createOscillator();
      this.truckOsc1.type = 'sawtooth';
      this.truckOsc1.frequency.setValueAtTime(58, now);
      this.truckOsc1.frequency.linearRampToValueAtTime(96, now + 1.5);
      this.truckOsc1.frequency.linearRampToValueAtTime(76, now + 3.0);

      this.truckOsc2 = this.ctx.createOscillator();
      this.truckOsc2.type = 'triangle';
      this.truckOsc2.frequency.setValueAtTime(116, now);
      this.truckOsc2.frequency.linearRampToValueAtTime(192, now + 1.5);
      this.truckOsc2.frequency.linearRampToValueAtTime(152, now + 3.0);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.linearRampToValueAtTime(520, now + 1.5);

      // 2. Rolling tire road surface noise
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 2.0), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;

      this.truckNoise = this.ctx.createBufferSource();
      this.truckNoise.buffer = buffer;
      this.truckNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(750, now);
      noiseFilter.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, now);

      // 3. High turbocharger whistle
      const turboOsc = this.ctx.createOscillator();
      turboOsc.type = 'sine';
      turboOsc.frequency.setValueAtTime(1600, now);
      turboOsc.frequency.linearRampToValueAtTime(2400, now + 1.5);
      turboOsc.frequency.linearRampToValueAtTime(1800, now + 3.0);

      const turboGain = this.ctx.createGain();
      turboGain.gain.setValueAtTime(0.02, now);

      this.truckGain = this.ctx.createGain();
      this.truckGain.gain.setValueAtTime(0, now);
      this.truckGain.gain.linearRampToValueAtTime(0.18, now + 0.25);

      this.truckOsc1.connect(filter);
      this.truckOsc2.connect(filter);
      filter.connect(this.truckGain);

      this.truckNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.truckGain);

      turboOsc.connect(turboGain);
      turboGain.connect(this.truckGain);

      this.truckGain.connect(this.sfxGain);

      this.truckOsc1.start(now);
      this.truckOsc2.start(now);
      this.truckNoise.start(now);
      turboOsc.start(now);

      // Store turbo on osc reference for cleanup
      (this.truckGain as any).turboOsc = turboOsc;
    } else if (!active && this.isTruckRunning) {
      this.stopTruckDrive();
    }
  }

  private stopTruckDrive() {
    if (this.truckGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.truckGain.gain.linearRampToValueAtTime(0.001, now + 0.35);
      const turbo = (this.truckGain as any)?.turboOsc;
      setTimeout(() => {
        try {
          this.truckOsc1?.stop();
          this.truckOsc2?.stop();
          this.truckNoise?.stop();
          turbo?.stop();
          this.truckOsc1?.disconnect();
          this.truckOsc2?.disconnect();
          this.truckNoise?.disconnect();
          turbo?.disconnect();
        } catch (e) {}
        this.truckOsc1 = null;
        this.truckOsc2 = null;
        this.truckNoise = null;
        this.truckGain = null;
        this.isTruckRunning = false;
      }, 400);
    } else {
      this.isTruckRunning = false;
    }
  }

  /** Delivery Truck Diesel Engine Acceleration Roar */
  public playTruckDelivery() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    this.playTruckHorn();
    this.playAirBrakeHiss();
    this.playTruckDrive(true);
    setTimeout(() => this.playTruckDrive(false), 3500);
  }

  /** Tractor Diesel Engine Idle & Driving */
  public playTractorEngine(active: boolean) {
    if (this.muted) {
      this.stopTractorEngine();
      return;
    }
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    if (active && !this.isTractorRunning) {
      this.isTractorRunning = true;
      const now = this.ctx.currentTime;

      // Twin detuned diesel oscillators
      this.tractorOsc1 = this.ctx.createOscillator();
      this.tractorOsc1.type = 'sawtooth';
      this.tractorOsc1.frequency.setValueAtTime(48, now);

      this.tractorOsc2 = this.ctx.createOscillator();
      this.tractorOsc2.type = 'triangle';
      this.tractorOsc2.frequency.setValueAtTime(53, now);

      // 14Hz piston firing rate LFO
      this.tractorLfo = this.ctx.createOscillator();
      this.tractorLfo.type = 'sine';
      this.tractorLfo.frequency.setValueAtTime(13.5, now);

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(14, now);
      this.tractorLfo.connect(this.tractorOsc1.frequency);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);

      this.tractorGain = this.ctx.createGain();
      this.tractorGain.gain.setValueAtTime(0, now);
      this.tractorGain.gain.linearRampToValueAtTime(0.09, now + 0.4);

      this.tractorOsc1.connect(filter);
      this.tractorOsc2.connect(filter);
      filter.connect(this.tractorGain);
      this.tractorGain.connect(this.sfxGain);

      this.tractorOsc1.start(now);
      this.tractorOsc2.start(now);
      this.tractorLfo.start(now);
    } else if (!active && this.isTractorRunning) {
      this.stopTractorEngine();
    }
  }

  private stopTractorEngine() {
    if (this.tractorGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.tractorGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      setTimeout(() => {
        try {
          this.tractorOsc1?.stop();
          this.tractorOsc2?.stop();
          this.tractorLfo?.stop();
          this.tractorOsc1?.disconnect();
          this.tractorOsc2?.disconnect();
          this.tractorLfo?.disconnect();
        } catch (e) {}
        this.tractorOsc1 = null;
        this.tractorOsc2 = null;
        this.tractorLfo = null;
        this.tractorGain = null;
        this.isTractorRunning = false;
      }, 350);
    } else {
      this.isTractorRunning = false;
    }
  }

  /** Combine Harvester Rotary Reel Cutter */
  public playHarvesterSound() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(135, now + 0.4);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(290, now);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.75);
  }

  /** Rotary Irrigation Sprinkler Water Bursts ("t-t-t-t-t-tsheeeew") */
  public playSprinklerSound() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const burstTime = now + i * 0.11;
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.05), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3600, burstTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, burstTime);
      gain.gain.exponentialRampToValueAtTime(0.001, burstTime + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(burstTime);
      noise.stop(burstTime + 0.06);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 5. WEIGH SCALE, CASH REGISTER & CLOCK SFX
  // ─────────────────────────────────────────────────────────────

  /** Scale Digital Acceptance Beep */
  public playWeighStationBeep() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1440, now);
    osc.frequency.setValueAtTime(1760, now + 0.07);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  /** Market Sale: Crystal Bell Ding + Cascading Gold Coins */
  public playCashRegisterSale() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    // Bell ding (B6)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1975, now);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.9);

    // Cascading coin drops
    for (let i = 0; i < 5; i++) {
      const coinTime = now + 0.14 + i * 0.06;
      const coinOsc = this.ctx.createOscillator();
      const coinGain = this.ctx.createGain();
      coinOsc.type = 'sine';
      coinOsc.frequency.setValueAtTime(2400 + i * 220, coinTime);

      coinGain.gain.setValueAtTime(0.09, coinTime);
      coinGain.gain.exponentialRampToValueAtTime(0.001, coinTime + 0.08);

      coinOsc.connect(coinGain);
      coinGain.connect(this.sfxGain);
      coinOsc.start(coinTime);
      coinOsc.stop(coinTime + 0.09);
    }
  }

  /** Antique Clock Pendulum Ticking */
  public playClockTicking(ticks = 6) {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < ticks; i++) {
      const t = now + i * 0.13;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(i % 2 === 0 ? 1280 : 920, t);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.04);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 6. TACTILE ARCADE UI SFX
  // ─────────────────────────────────────────────────────────────

  /** Tactile Grid Cell Paint / Click Pop */
  public playGridPop() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.035);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /** Correct Answer Golden Harvest Fanfare Chord */
  public playCorrect() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.05 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.38);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.4);
    });
  }

  /** Incorrect Answer Gentle Warning Wobble */
  public playIncorrect() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.28);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  /** Grand Victory Match Celebration Fanfare */
  public playVictoryFanfare() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.5, d: 0.35 },
      { f: 880.0,  d: 0.15 },
      { f: 1046.5, d: 0.7 },
    ];

    let t = now;
    melody.forEach((note) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + note.d + 0.05);
      t += note.d * 0.88;
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 7. BACKGROUND AMBIENCE & SIMULATION EVENT DISPATCHER
  // ─────────────────────────────────────────────────────────────
  public startAmbience() {
    if (this.ambientInterval) clearInterval(this.ambientInterval);
    this.ambientInterval = setInterval(() => {
      if (!this.muted) {
        const rand = Math.random();
        if (rand < 0.35) {
          this.playBirdChirp();
        } else if (rand < 0.48) {
          this.playChickenCluck();
        } else if (rand < 0.60) {
          this.playGoatBleat();
        } else if (rand < 0.72) {
          this.playCowMoo();
        }
      }
    }, 5500);
  }

  public onSimEvent(event: SimEvent) {
    switch (event.type) {
      case 'farmer_sow':
      case 'tractor_plant':
        this.playSowingSeeds();
        break;
      case 'fertilizer_spread':
        this.playManureScatter();
        break;
      case 'pesticide_spray':
        this.playKnapsackSpray();
        break;
      case 'tractor_harvest':
        this.playHarvesterSound();
        break;
      case 'truck_depart':
        this.playTruckDelivery();
        break;
      case 'scale_weigh':
        this.playWeighStationBeep();
        break;
      case 'market_sell':
      case 'money_gain':
        this.playCashRegisterSale();
        break;
      case 'irrigation_activate':
      case 'rain_start':
        this.playSprinklerSound();
        break;
      case 'day_advance':
        this.playClockTicking(8);
        setTimeout(() => this.playRoosterMorning(), 1200);
        break;
      case 'celebration':
        this.playVictoryFanfare();
        break;
    }
  }

  public shutdown() {
    this.stopBgm();
    if (this.ambientInterval) clearInterval(this.ambientInterval);
    this.stopTractorEngine();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch (e) {}
    }
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
  }
}

export const farmAudio = new FarmAudioEngine();
