// ============================================================
// THE DECIMAL DELIVERY NETWORK — AUDIO ENGINE
// - Delivery BGM: Seamless loop of /audio/Delivery BGM.mp3 while game is selected.
//   The file carries no gapless (Xing/LAME) metadata, so a plain <audio loop>
//   gaps audibly every 8 s. It is decoded once and looped through Web Audio
//   with trimmed loop points and a short crossfade instead; if that fails for
//   any reason it falls back to the plain looping element.
// - Forklift Sound: Plays /audio/Forklift Sound.mp3 strictly when forklift is working
//   and stops immediately when parked/idle, with no other forklift sounds.
// - Clean shutdown when navigating away or unmounting.
// ============================================================

'use client';

import type { SimEvent } from './depotSim';

/** Overlap between one music loop and the next, in seconds. */
const BGM_CROSSFADE = 0.25;

/**
 * Loop points that skip the silence an MP3 encoder pads onto both ends of a
 * file, so the music repeats without a gap.
 */
function audibleRange(buf: AudioBuffer): { start: number; end: number } {
  const threshold = 0.002;
  const channels = Array.from({ length: buf.numberOfChannels }, (_, c) => buf.getChannelData(c));
  const loud = (i: number) => channels.some((ch) => Math.abs(ch[i]) > threshold);
  let first = 0;
  while (first < buf.length && !loud(first)) first++;
  let last = buf.length - 1;
  while (last > first && !loud(last)) last--;
  if (last <= first) return { start: 0, end: buf.duration };
  return { start: first / buf.sampleRate, end: (last + 1) / buf.sampleRate };
}

class DepotAudio {
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmBuffer: AudioBuffer | null = null;
  private bgmGain: GainNode | null = null;
  private bgmSources: AudioBufferSourceNode[] = [];
  private bgmTimer: ReturnType<typeof setInterval> | null = null;
  private bgmNextAt = 0;
  private bgmLoop = { start: 0, end: 0 };
  private bgmDecoding: Promise<void> | null = null;
  private forkliftTap: MediaElementAudioSourceNode | null = null;
  private forkliftGain: GainNode | null = null;
  private forkliftStopTimer: ReturnType<typeof setTimeout> | null = null;
  private forkliftAudio: HTMLAudioElement | null = null;
  private isBgmPlaying = false;
  private isForkliftPlaying = false;
  private muted = false;
  private bgmVolume = 0.35;
  private forkliftVolume = 0.48;
  private unlocked = false;
  private lastAt = new Map<string, number>();

  // Web Audio Context for gameplay confirmations (scale_ok, etc.)
  private ctx: AudioContext | null = null;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctor) {
        this.ctx = new Ctor();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  /**
   * Start looping background music (/audio/Delivery BGM.mp3).
   * Automatically handles browser autoplay policies by attaching a listener on first gesture if blocked.
   */
  public startBgm() {
    if (typeof window === 'undefined') return;
    this.isBgmPlaying = true;

    this.initContext();
    if (this.ctx) {
      void this.startBgmSeamless();
      return;
    }
    this.startBgmElement();
  }

  /** Crossfaded Web Audio loop, so there is no gap where the recording restarts. */
  private async startBgmSeamless() {
    const ctx = this.ctx;
    if (!ctx || this.bgmGain) return;

    if (!this.bgmBuffer) {
      if (!this.bgmDecoding) {
        this.bgmDecoding = (async () => {
          try {
            const res = await fetch(encodeURI('/audio/Delivery BGM.mp3'));
            if (!res.ok) return;
            const buf = await ctx.decodeAudioData(await res.arrayBuffer());
            if (this.ctx === ctx) this.bgmBuffer = buf;
          } catch {
            // Leave bgmBuffer null: the element fallback below takes over.
          }
        })();
      }
      await this.bgmDecoding;
    }

    // Shut down, stopped or already restarted while the file was decoding.
    if (this.ctx !== ctx || !this.isBgmPlaying || this.bgmGain) return;
    if (!this.bgmBuffer) { this.startBgmElement(); return; }

    this.bgmLoop = audibleRange(this.bgmBuffer);
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.muted ? 0 : this.bgmVolume, ctx.currentTime);
    this.bgmGain.connect(ctx.destination);
    this.bgmNextAt = ctx.currentTime + 0.05;
    this.pumpBgm();
    this.bgmTimer = setInterval(() => this.pumpBgm(), 1000);
  }

  /** Schedule any loop iterations that begin within the next couple of seconds. */
  private pumpBgm() {
    const ctx = this.ctx;
    if (!ctx || !this.bgmBuffer || !this.bgmGain || !this.isBgmPlaying) return;

    const body = this.bgmLoop.end - this.bgmLoop.start;
    const fade = Math.min(BGM_CROSSFADE, body * 0.25);
    const period = body - fade;

    while (this.bgmNextAt < ctx.currentTime + 2) {
      const at = Math.max(this.bgmNextAt, ctx.currentTime);
      const src = ctx.createBufferSource();
      src.buffer = this.bgmBuffer;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(1, at + fade);
      g.gain.setValueAtTime(1, at + period);
      g.gain.linearRampToValueAtTime(0, at + period + fade);
      src.connect(g);
      g.connect(this.bgmGain);
      src.start(at, this.bgmLoop.start, body);
      src.onended = () => { this.bgmSources = this.bgmSources.filter((x) => x !== src); };
      this.bgmSources.push(src);
      this.bgmNextAt = at + period;
    }
  }

  private startBgmElement() {
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('/audio/Delivery BGM.mp3');
      this.bgmAudio.loop = true;
    }

    this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;

    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, start on first user interaction
        const startOnInteraction = () => {
          if (this.isBgmPlaying && this.bgmAudio) {
            this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;
            this.bgmAudio.play().catch(() => {});
          }
          window.removeEventListener('pointerdown', startOnInteraction);
          window.removeEventListener('keydown', startOnInteraction);
        };
        window.addEventListener('pointerdown', startOnInteraction, { once: true });
        window.addEventListener('keydown', startOnInteraction, { once: true });
      });
    }
  }

  /**
   * Stop BGM immediately when game is unmounted or deselected.
   */
  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) { clearInterval(this.bgmTimer); this.bgmTimer = null; }
    for (const src of this.bgmSources) {
      try { src.onended = null; src.stop(); } catch { /* already stopped */ }
    }
    this.bgmSources = [];
    try { this.bgmGain?.disconnect(); } catch { /* already gone */ }
    this.bgmGain = null;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch {}
    }
  }

  /**
   * Unlock audio engine from an explicit user click (e.g. OPEN THE DEPOT).
   */
  public unlock() {
    this.unlocked = true;
    this.initContext();
    this.startBgm();
  }

  /**
   * Forklift Sound (/audio/Forklift Sound.mp3).
   * Strictly plays when forklift is in work (busy > 0), and stops immediately when not working (busy === 0).
   * Neither any other sound is played for the forklift.
   */
  public setForkliftActivity(busy: number) {
    if (typeof window === 'undefined') return;
    // Before the player opens the depot there is no audio to make, so do not
    // build a context or fetch the engine recording yet.
    if (!this.unlocked) return;

    const isWorking = busy > 0;

    if (!this.forkliftAudio) {
      this.forkliftAudio = new Audio('/audio/Forklift Sound.mp3');
      this.forkliftAudio.loop = true;
    }

    // Route through the context so the engine can be faded rather than cut,
    // which clicks. Falls back to the element's own volume.
    this.initContext();
    if (this.ctx && !this.forkliftTap) {
      try {
        this.forkliftTap = this.ctx.createMediaElementSource(this.forkliftAudio);
        this.forkliftGain = this.ctx.createGain();
        this.forkliftGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.forkliftTap.connect(this.forkliftGain);
        this.forkliftGain.connect(this.ctx.destination);
        this.forkliftAudio.volume = 1;
      } catch {
        this.forkliftTap = null;
        this.forkliftGain = null;
      }
    }

    if (isWorking) {
      if (this.forkliftStopTimer !== null) {
        clearTimeout(this.forkliftStopTimer);
        this.forkliftStopTimer = null;
      }
      if (this.forkliftGain && this.ctx) {
        this.forkliftGain.gain.setTargetAtTime(
          this.muted ? 0 : this.forkliftVolume, this.ctx.currentTime, 0.05
        );
      }
      if (!this.isForkliftPlaying) {
        this.isForkliftPlaying = true;
        if (!this.forkliftGain) this.forkliftAudio.volume = this.muted ? 0 : this.forkliftVolume;
        this.forkliftAudio.play().catch(() => {
          // Autoplay protection: wait for first interaction if needed
          const retryOnInteraction = () => {
            if (this.isForkliftPlaying && this.forkliftAudio) {
              this.forkliftAudio.volume = this.muted ? 0 : this.forkliftVolume;
              this.forkliftAudio.play().catch(() => {});
            }
            window.removeEventListener('pointerdown', retryOnInteraction);
          };
          window.addEventListener('pointerdown', retryOnInteraction, { once: true });
        });
      }
    } else if (this.isForkliftPlaying) {
      this.isForkliftPlaying = false;
      const el = this.forkliftAudio;
      if (this.forkliftGain && this.ctx) {
        // Die away over a moment, then stop the element. The engine picks up
        // where it left off next time instead of restarting its first note.
        this.forkliftGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.06);
        this.forkliftStopTimer = setTimeout(() => {
          this.forkliftStopTimer = null;
          if (!this.isForkliftPlaying) { try { el.pause(); } catch { /* gone */ } }
        }, 260);
      } else {
        try { el.pause(); el.currentTime = 0; } catch { /* gone */ }
      }
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(muted ? 0 : this.bgmVolume, this.ctx.currentTime, 0.03);
    } else if (this.bgmAudio) {
      this.bgmAudio.volume = muted ? 0 : this.bgmVolume;
    }
    if (this.forkliftGain && this.ctx) {
      const level = muted || !this.isForkliftPlaying ? 0 : this.forkliftVolume;
      this.forkliftGain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.03);
    } else if (this.forkliftAudio) {
      this.forkliftAudio.volume = muted ? 0 : this.forkliftVolume;
    }
  }

  /** Rate limiter helper */
  private allow(key: string, gapSeconds: number): boolean {
    const now = Date.now() / 1000;
    const prev = this.lastAt.get(key) ?? -999;
    if (now - prev < gapSeconds) return false;
    this.lastAt.set(key, now);
    return true;
  }

  /** Play lightweight synthesized gameplay feedback cues */
  private playTone(freq: number, duration: number, peak = 0.15) {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(peak, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + duration);
    } catch {}
  }

  /**
   * Simulation event sounds:
   * Only lightweight cues for answers/dispatch.
   * NO forklift beeps or noisy synthetic ambience, so Forklift Sound and Delivery BGM are clean!
   */
  public onSimEvent(event: SimEvent) {
    if (this.muted) return;

    switch (event) {
      case 'scale_ok':
        // Correct mathematical answer confirmation
        if (this.allow(event, 0.2)) {
          this.playTone(587.33, 0.1, 0.18);
          setTimeout(() => this.playTone(880, 0.2, 0.18), 90);
        }
        break;

      case 'scale_error':
        // Soft error cue
        if (this.allow(event, 0.2)) {
          this.playTone(220, 0.18, 0.14);
        }
        break;

      case 'truck_load':
        // Dispatch celebration arpeggio
        if (this.allow(event, 0.3)) {
          [523.25, 659.25, 783.99].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 0.16, 0.14), i * 70);
          });
        }
        break;

      // Notice: NO forklift_beep, NO synthetic machine noise — forklift sound strictly uses Forklift Sound.mp3!
      default:
        break;
    }
  }

  /**
   * Completely shut down all audio when leaving Decimal Delivery.
   */
  public shutdown() {
    this.stopBgm();
    if (this.forkliftStopTimer !== null) {
      clearTimeout(this.forkliftStopTimer);
      this.forkliftStopTimer = null;
    }
    if (this.forkliftAudio) {
      try {
        this.forkliftAudio.pause();
        this.forkliftAudio.currentTime = 0;
      } catch {}
      this.isForkliftPlaying = false;
    }
    // An element tapped by a closed context stays silent for ever, so drop the
    // elements and the decoded music too: unlock() builds them again.
    this.forkliftTap = null;
    this.forkliftGain = null;
    this.forkliftAudio = null;
    this.bgmAudio = null;
    this.bgmBuffer = null;
    this.bgmDecoding = null;
    if (this.ctx) {
      try {
        void this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}

export const depotAudio = new DepotAudio();
