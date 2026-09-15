// ============================================================
// THE DECIMAL DELIVERY NETWORK — AUDIO ENGINE
// - Delivery BGM: Seamless loop of /audio/Delivery BGM.mp3 while game is selected
// - Forklift Sound: Plays /audio/Forklift Sound.mp3 strictly when forklift is working
//   and stops immediately when parked/idle, with no other forklift sounds.
// - Clean shutdown when navigating away or unmounting.
// ============================================================

'use client';

import type { SimEvent } from './depotSim';

class DepotAudio {
  private bgmAudio: HTMLAudioElement | null = null;
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

    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('/audio/Delivery BGM.mp3');
      this.bgmAudio.loop = true;
    }

    this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;
    this.isBgmPlaying = true;

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

    const isWorking = busy > 0;

    if (!this.forkliftAudio) {
      this.forkliftAudio = new Audio('/audio/Forklift Sound.mp3');
      this.forkliftAudio.loop = true;
    }

    if (isWorking) {
      if (!this.isForkliftPlaying) {
        this.isForkliftPlaying = true;
        this.forkliftAudio.volume = this.muted ? 0 : this.forkliftVolume;
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
    } else {
      if (this.isForkliftPlaying) {
        this.isForkliftPlaying = false;
        try {
          this.forkliftAudio.pause();
          this.forkliftAudio.currentTime = 0;
        } catch {}
      }
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = muted ? 0 : this.bgmVolume;
    }
    if (this.forkliftAudio) {
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
    if (this.forkliftAudio) {
      try {
        this.forkliftAudio.pause();
        this.forkliftAudio.currentTime = 0;
      } catch {}
      this.isForkliftPlaying = false;
    }
    if (this.ctx) {
      try {
        void this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}

export const depotAudio = new DepotAudio();
