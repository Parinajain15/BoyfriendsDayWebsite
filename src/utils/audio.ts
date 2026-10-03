/**
 * Single Reliable HTML5 Audio Engine
 * Handles all audio playback for the Mixtape and Navbar Play "her".
 */

import {
  FINAL_MIXTAPE_TRACKS,
  MixtapeTrack,
  HER_TRACK_ID,
  getAudioSourceUrl,
} from './audioRegistry';

type PlaybackListener = (isPlaying: boolean, activeTrack: MixtapeTrack | null) => void;
type TimeListener = (currentTime: number, duration: number) => void;
type NoticeListener = (notice: string | null) => void;

const HER_INITIAL_TRACK =
  FINAL_MIXTAPE_TRACKS.find((t) => t.id === HER_TRACK_ID) || FINAL_MIXTAPE_TRACKS[2];

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: MixtapeTrack | null = HER_INITIAL_TRACK;
  private isPlaying = false;
  private volume = 0.8;
  private isMuted = false;
  private listeners: Set<PlaybackListener> = new Set();
  private timeListeners: Set<TimeListener> = new Set();
  private noticeListeners: Set<NoticeListener> = new Set();
  private currentNotice: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedVol = localStorage.getItem('bf_gift_volume');
        if (savedVol !== null) {
          const v = parseFloat(savedVol);
          if (!isNaN(v) && v >= 0 && v <= 1) {
            this.volume = v;
          }
        }
        const savedMute = localStorage.getItem('bf_gift_muted');
        if (savedMute === 'true') {
          this.isMuted = true;
        }
      } catch {
        // Ignore localStorage restrictions
      }
    }
  }

  /**
   * Lazily initializes the single HTML5 Audio instance and binds its lifecycle events once.
   */
  private getOrCreateAudio(): HTMLAudioElement {
    if (this.audio) return this.audio;

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = this.isMuted ? 0 : this.volume;

    audio.addEventListener('loadedmetadata', () => {
      console.log(`[Audio] Event: loadedmetadata | Duration: ${audio.duration}s`);
      this.notifyTime(audio.currentTime, audio.duration || 0);
    });

    audio.addEventListener('canplay', () => {
      console.log(`[Audio] Event: canplay | Track: ${this.currentTrack?.title}`);
    });

    audio.addEventListener('play', () => {
      console.log(`[Audio] Event: play | Track: ${this.currentTrack?.title}`);
      this.isPlaying = true;
      this.notify();
    });

    audio.addEventListener('pause', () => {
      console.log(`[Audio] Event: pause | Track: ${this.currentTrack?.title}`);
      this.isPlaying = false;
      this.notify();
    });

    audio.addEventListener('ended', () => {
      console.log(`[Audio] Event: ended | Track: ${this.currentTrack?.title} -> Auto-advancing`);
      this.isPlaying = false;
      this.notify();
      this.playNext();
    });

    audio.addEventListener('timeupdate', () => {
      this.notifyTime(audio.currentTime || 0, audio.duration || 0);
    });

    audio.addEventListener('error', () => {
      const err = audio.error;
      console.warn(
        `[Audio] Event: error | Code: ${err?.code} | Message: ${err?.message} | Src: ${audio.src}`
      );
      this.isPlaying = false;
      this.notifyNotice(`Audio file missing or unplayable: place '${this.currentTrack?.filename}' into /public/audio/ to play.`);
      this.notify();
    });

    this.audio = audio;
    if (typeof window !== 'undefined') {
      (window as unknown as { __audio: HTMLAudioElement; __audioEngine: AudioEngine }).__audio = audio;
      (window as unknown as { __audioEngine: AudioEngine }).__audioEngine = this;
    }
    return audio;
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isPlaying, this.currentTrack);
      } catch (e) {
        console.error('[Audio Engine Listener Error]', e);
      }
    });
  }

  private notifyTime(current: number, duration: number) {
    this.timeListeners.forEach((cb) => {
      try {
        cb(current, duration);
      } catch (e) {
        console.error('[Audio Engine Time Listener Error]', e);
      }
    });
  }

  private notifyNotice(notice: string | null) {
    this.currentNotice = notice;
    this.noticeListeners.forEach((cb) => {
      try {
        cb(notice);
      } catch (e) {
        console.error('[Audio Engine Notice Listener Error]', e);
      }
    });
  }

  /**
   * Main method to play a specific track from user click interaction.
   * Every click unconditionally sets audio.src to the selected track's exact URL.
   */
  public async playTrack(track: MixtapeTrack): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const audio = this.getOrCreateAudio();

    // 1. Explicitly stop and reset previous audio
    try {
      audio.pause();
    } catch {
      // Ignore
    }
    audio.currentTime = 0;

    // 2. Resolve safe public URL from audioRegistry
    const targetUrl = getAudioSourceUrl(track.filename);

    // 3. Set audio.src directly to the selected track's exact URL
    audio.src = targetUrl;

    // 4. Call audio.load() to load the selected track
    audio.load();

    // 5. Update active track
    this.currentTrack = track;
    this.isPlaying = false;
    this.notify();

    // 6. Wait for the selected audio element to load enough to play
    if (audio.readyState < 2) {
      await new Promise<void>((resolve) => {
        let isDone = false;
        const finish = () => {
          if (isDone) return;
          isDone = true;
          audio.removeEventListener('canplay', onCanPlay);
          audio.removeEventListener('error', onError);
          clearTimeout(timeout);
          resolve();
        };
        const onCanPlay = () => finish();
        const onError = () => finish();
        const timeout = setTimeout(() => finish(), 1200);

        audio.addEventListener('canplay', onCanPlay, { once: true });
        audio.addEventListener('error', onError, { once: true });
      });
    }

    // 7. Immediately before audio.play(), log all debug parameters exactly as required:
    console.log('[Audio DEBUG] requested track:', track.title);
    console.log('[Audio DEBUG] requested filename:', track.filename);
    console.log('[Audio DEBUG] requested URL:', targetUrl);
    console.log('[Audio DEBUG] actual audio.src:', audio.src);
    console.log('[Audio DEBUG] currentTrack:', this.currentTrack?.title);
    console.log('[Audio DEBUG] audio.readyState:', audio.readyState);
    console.log('[Audio DEBUG] audio.currentSrc:', audio.currentSrc);

    // 8. Play selected audio
    try {
      await audio.play();
      this.isPlaying = true;
      this.notifyNotice(null);
      this.notify();

      // 9. After audio starts, log:
      console.log('[Audio DEBUG] NOW PLAYING:', track.title);
      console.log('[Audio DEBUG] currentSrc:', audio.currentSrc);

      return true;
    } catch (err: unknown) {
      this.isPlaying = false;
      this.notify();
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[Audio] Playback failed for "${track.title}":`, message);
      this.notifyNotice(`Audio file missing or unplayable: place '${track.filename}' into /public/audio/ to play.`);
      return false;
    }
  }

  /**
   * Toggles play/pause for the currently selected track.
   */
  public async togglePlay(): Promise<boolean> {
    const audio = this.getOrCreateAudio();
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      const trackToPlay = this.currentTrack || FINAL_MIXTAPE_TRACKS[0];
      return this.playTrack(trackToPlay);
    }
  }

  /**
   * Plays the next track in the 10-track playlist.
   */
  public playNext(): Promise<boolean> {
    const currentIndex = this.currentTrack
      ? FINAL_MIXTAPE_TRACKS.findIndex((t) => t.id === this.currentTrack?.id)
      : -1;
    const nextIndex = (currentIndex + 1) % FINAL_MIXTAPE_TRACKS.length;
    return this.playTrack(FINAL_MIXTAPE_TRACKS[nextIndex]);
  }

  /**
   * Plays the previous track in the 10-track playlist.
   */
  public playPrev(): Promise<boolean> {
    const currentIndex = this.currentTrack
      ? FINAL_MIXTAPE_TRACKS.findIndex((t) => t.id === this.currentTrack?.id)
      : -1;
    const prevIndex =
      (currentIndex - 1 + FINAL_MIXTAPE_TRACKS.length) % FINAL_MIXTAPE_TRACKS.length;
    return this.playTrack(FINAL_MIXTAPE_TRACKS[prevIndex]);
  }

  /**
   * Dedicated handler for Navbar Play "her".
   * ONLY plays or pauses JVKE - her (track-3).
   * Independent from playlist clicks.
   */
  public async toggleHer(): Promise<boolean> {
    const herTrack = FINAL_MIXTAPE_TRACKS.find((t) => t.id === HER_TRACK_ID) || FINAL_MIXTAPE_TRACKS[2];
    if (this.currentTrack?.id === HER_TRACK_ID && this.isPlaying) {
      this.pause();
      return false;
    }
    return this.playTrack(herTrack);
  }

  /**
   * Unconditionally starts playing "her" (unless already actively playing).
   */
  public async playHer(): Promise<boolean> {
    const herTrack = FINAL_MIXTAPE_TRACKS.find((t) => t.id === HER_TRACK_ID) || FINAL_MIXTAPE_TRACKS[2];
    if (this.currentTrack?.id === HER_TRACK_ID && this.isPlaying) {
      return true;
    }
    return this.playTrack(herTrack);
  }

  public pause(): void {
    if (this.audio) {
      try {
        this.audio.pause();
      } catch (err) {
        console.error('[Audio] pause() error:', err);
      }
    }
    this.isPlaying = false;
    this.notify();
  }

  public seek(seconds: number): void {
    if (this.audio && !isNaN(seconds)) {
      try {
        this.audio.currentTime = seconds;
      } catch (err) {
        console.error('[Audio] seek() error:', err);
      }
    }
  }

  public setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    this.isMuted = false;
    if (this.audio) {
      this.audio.volume = clamped;
    }
    try {
      localStorage.setItem('bf_gift_volume', clamped.toString());
      localStorage.setItem('bf_gift_muted', 'false');
    } catch {
      // Ignore
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    try {
      localStorage.setItem('bf_gift_muted', this.isMuted ? 'true' : 'false');
    } catch {
      // Ignore
    }
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): MixtapeTrack | null {
    return this.currentTrack;
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audio;
  }

  public isHerPlaying(): boolean {
    return this.isPlaying && this.currentTrack?.id === HER_TRACK_ID;
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying, this.currentTrack);
    return () => this.listeners.delete(listener);
  }

  public subscribeTime(listener: TimeListener): () => void {
    this.timeListeners.add(listener);
    if (this.audio) {
      listener(this.audio.currentTime || 0, this.audio.duration || 0);
    }
    return () => this.timeListeners.delete(listener);
  }

  public subscribeNotice(listener: NoticeListener): () => void {
    this.noticeListeners.add(listener);
    listener(this.currentNotice);
    return () => this.noticeListeners.delete(listener);
  }
}

export const audioEngine = new AudioEngine();

// Legacy alias to maintain compatibility with sound-effect callers
export const lofiPlayer = {
  subscribe: (cb: (playing: boolean, activeUrl?: string) => void) =>
    audioEngine.subscribe((p, t) => cb(p, t ? getAudioSourceUrl(t.filename) : undefined)),
  subscribeTime: (cb: (curr: number, dur: number) => void) =>
    audioEngine.subscribeTime(cb),
  pause: () => audioEngine.pause(),
  seek: (t: number) => audioEngine.seek(t),
  getVolume: () => audioEngine.getVolume(),
  setVolume: (v: number) => audioEngine.setVolume(v),
  getCurrentUrl: () => {
    const t = audioEngine.getCurrentTrack();
    return t ? getAudioSourceUrl(t.filename) : '';
  },
  start: async (urlOrId?: string) => {
    const track = FINAL_MIXTAPE_TRACKS.find((t) => t.id === urlOrId || t.filename === urlOrId) || FINAL_MIXTAPE_TRACKS[2];
    return audioEngine.playTrack(track);
  },
  getAudioElement: () => null,
};

/**
 * Sound effects for tactile scrapbooking clicks
 */
let audioContext: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) audioContext = new AudioCtx();
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

export function playCassetteClick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore
  }
}

export function playPopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch {
    // Ignore
  }
}

export function playSparkleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.06, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.15);
    });
  } catch {
    // Ignore
  }
}

export function playHeartChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.08, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  } catch {
    // Ignore
  }
}
