import React, { useState, useEffect } from 'react';
import { SongTrack } from '../types/scrapbook';
import { audioEngine, playCassetteClick, playPopSound } from '../utils/audio';
import { MixtapeTrack, FINAL_MIXTAPE_TRACKS } from '../utils/audioRegistry';
import { Play, Pause, SkipBack, SkipForward, Plus, Disc, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  tracks?: SongTrack[];
  onAddCustomTrack?: (track: SongTrack) => void;
  boyfriendName: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks: propTracks,
  onAddCustomTrack,
}) => {
  // Authoritative 10 final mixtape tracks + any user-added custom tracks
  const customTracks: MixtapeTrack[] = (propTracks || [])
    .filter((t) => !FINAL_MIXTAPE_TRACKS.some((f) => f.id === t.id || f.title.toLowerCase() === t.title.toLowerCase()))
    .map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      filename: t.filename || `${t.title}.mp3`,
      duration: t.duration,
      note: t.note,
    }));

  const tracks: MixtapeTrack[] = [...FINAL_MIXTAPE_TRACKS, ...customTracks];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => audioEngine.getVolume());
  const [isMuted, setIsMuted] = useState(() => audioEngine.getIsMuted());
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Synchronize with the single AudioEngine instance
  useEffect(() => {
    const unsubscribeState = audioEngine.subscribe((playing, activeTrack) => {
      setIsPlaying(playing);
      if (activeTrack) {
        const matchingIdx = tracks.findIndex((t) => t.id === activeTrack.id);
        if (matchingIdx !== -1) {
          setCurrentTrackIndex(matchingIdx);
        }
      }
    });

    const unsubscribeTime = audioEngine.subscribeTime((curr, dur) => {
      setCurrentTime(curr);
      if (dur > 0 && !isNaN(dur)) {
        setDuration(dur);
      }
    });

    const unsubscribeNotice = audioEngine.subscribeNotice((notice) => {
      setAudioNotice(notice);
    });

    return () => {
      unsubscribeState();
      unsubscribeTime();
      unsubscribeNotice();
    };
  }, [tracks]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTogglePlay = () => {
    playCassetteClick();
    if (isPlaying) {
      audioEngine.pause();
    } else {
      const track = tracks[currentTrackIndex] || tracks[0];
      setAudioNotice(null);
      audioEngine.playTrack(track);
    }
  };

  const handleNext = () => {
    playCassetteClick();
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    const nextTrack = tracks[nextIndex];
    if (nextTrack) {
      setAudioNotice(null);
      audioEngine.playTrack(nextTrack);
    }
  };

  const handlePrev = () => {
    playCassetteClick();
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    const prevTrack = tracks[prevIndex];
    if (prevTrack) {
      setAudioNotice(null);
      audioEngine.playTrack(prevTrack);
    }
  };

  /**
   * Independent track selection from the playlist.
   * Directly resolves and plays this track without affecting the navbar.
   */
  const handleSelectTrack = (track: MixtapeTrack, index: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    playCassetteClick();
    if (currentTrack?.id === track.id && isPlaying) {
      audioEngine.pause();
    } else {
      setCurrentTrackIndex(index);
      setAudioNotice(null);
      audioEngine.playTrack(track).then((started) => {
        if (!started) {
          console.warn(`[Audio] Playback failed for: "${track.filename}"`);
        }
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    audioEngine.seek(targetTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    audioEngine.setVolume(newVol);
  };

  const toggleMute = () => {
    const newMuted = audioEngine.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      setVolume(audioEngine.getVolume());
    }
  };

  const handleSaveCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    playPopSound();

    const created: SongTrack = {
      id: `track-${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Our Melody',
      duration: '3:20',
      lofiMelodyKey: tracks.length % 3,
      note: newNote.trim() || 'A song chosen just for us.',
      customAudioUrl: newUrl.trim() || undefined,
      filename: newUrl.trim() ? newUrl.trim() : `${newTitle.trim()}.mp3`,
    };

    if (onAddCustomTrack) {
      onAddCustomTrack(created);
    }
    setNewTitle('');
    setNewArtist('');
    setNewNote('');
    setNewUrl('');
    setIsAddingSong(false);
  };

  return (
    <section id="music" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8 select-none">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#20304A] font-bold tracking-tight">
          THE SOUNDTRACK OF US 📼
        </h2>
      </div>

      {/* Authentic Vintage Cassette Deck Component */}
      <div className="relative bg-[#1E293B] rounded-3xl p-6 sm:p-10 shadow-[0_20px_45px_rgba(20,15,30,0.18)] border-4 border-[#334155] max-w-2xl mx-auto overflow-hidden">
        {/* Brass Screws */}
        <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-amber-200/60 shadow-2xs" />
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-200/60 shadow-2xs" />
        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-amber-200/60 shadow-2xs" />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-amber-200/60 shadow-2xs" />

        {/* Vintage Baby Yellow Paper Label */}
        <div className="bg-[#FFF4B8] rounded-2xl border border-[#F2DE79] p-4 sm:p-5 relative shadow-inner">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#24324A]/70 border-b border-[#F2DE79] pb-1 mb-2 font-semibold">
            <span>SIDE A · VINTAGE STEREO</span>
            <span>ABHI & PARINA · 90 MIN</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="max-w-[75%]">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#24324A] line-clamp-1">
                {currentTrack.title}
              </h3>
              <p className="font-sans text-xs text-[#24324A]/80 font-medium">
                {currentTrack.artist}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 bg-white text-[#24324A] rounded-full text-[10px] font-mono font-semibold border border-[#F2DE79]">
                {duration > 0 ? formatTime(duration) : currentTrack.duration}
              </span>
            </div>
          </div>

          {/* Tape window with spinning reels */}
          <div className="mt-4 bg-[#0F172A] rounded-xl p-3 sm:p-4 border-2 border-slate-700 flex items-center justify-around relative">
            {/* Magnetic tape bridge */}
            <div className="absolute inset-x-12 top-1/2 h-4 -translate-y-1/2 bg-[#332520] opacity-80 pointer-events-none" />

            {/* Left Spool */}
            <div className="relative flex items-center justify-center">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-stone-400 bg-stone-800 flex items-center justify-center ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s', animationTimingFunction: 'linear' }}
              >
                <div className="w-6 h-6 rounded-full bg-[#EAF6FF] flex items-center justify-center shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-[#24324A]" />
                </div>
                <div className="absolute w-12 h-1 bg-stone-500/70" />
                <div className="absolute h-12 w-1 bg-stone-500/70" />
              </div>
            </div>

            {/* Center Tape Window Cutout */}
            <div className="flex flex-col items-center justify-center z-10 bg-black/60 px-3.5 py-1 rounded-md border border-slate-700 text-center">
              <span className="text-[10px] font-mono font-semibold text-stone-300">
                {isPlaying ? '▶ TAPE PLAYING' : '❚❚ PAUSED'}
              </span>
              <span className="font-handwriting text-base text-[#FFDDE8]">
                For Abhi ♡
              </span>
            </div>

            {/* Right Spool */}
            <div className="relative flex items-center justify-center">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-stone-400 bg-stone-800 flex items-center justify-center ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s', animationTimingFunction: 'linear' }}
              >
                <div className="w-6 h-6 rounded-full bg-[#EAF6FF] flex items-center justify-center shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-[#24324A]" />
                </div>
                <div className="absolute w-12 h-1 bg-stone-500/70" />
                <div className="absolute h-12 w-1 bg-stone-500/70" />
              </div>
            </div>
          </div>

          {/* Progress Bar & Scrubbing Slider */}
          <div className="mt-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#24324A]/80 font-medium px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : currentTrack.duration}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#F2DE79] rounded-lg appearance-none cursor-pointer accent-[#24324A]"
              title="Seek audio progress"
            />
          </div>
        </div>

        {/* Physical Cassette Buttons & Volume Control */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Main Transport Buttons */}
          <div className="flex items-center gap-4 sm:gap-6 mx-auto sm:mx-0">
            <button
              type="button"
              onClick={handlePrev}
              className="w-12 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-stone-200 border border-slate-700 flex items-center justify-center shadow-md transition-all cursor-pointer"
              title="Previous track"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-16 h-12 rounded-2xl bg-[#24324A] hover:bg-[#1A2538] active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer border border-blue-400/30"
              title={isPlaying ? 'Pause' : 'Play tape'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 translate-x-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-12 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-stone-200 border border-slate-700 flex items-center justify-center shadow-md transition-all cursor-pointer"
              title="Next track"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-stone-300">
            <button
              type="button"
              onClick={toggleMute}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-400"
              title="Adjust volume"
            />
          </div>
        </div>

        {/* Playing Status Notice */}
        <div className="mt-4 text-center">
          {audioNotice ? (
            <p className="text-xs font-mono text-amber-300 bg-amber-950/70 border border-amber-500/40 py-1.5 px-3 rounded-xl inline-block max-w-lg">
              {audioNotice}
            </p>
          ) : (
            <p className="text-xs font-mono text-stone-400 flex items-center justify-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isPlaying
                  ? `Now Playing: "${currentTrack.title}" — ${currentTrack.artist}`
                  : 'Tap any song in the playlist to listen'}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Playlist Tracklist - Light Rainbow Handmade Aesthetic */}
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#FFF0F5]/90 via-[#FFFBEB]/85 via-[#F0FDF4]/85 via-[#F0F9FF]/90 to-[#FAF5FF]/90 rounded-3xl border-2 border-purple-200/80 p-5 sm:p-7 shadow-[0_16px_40px_rgba(192,132,252,0.12)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-200/50">
          <h3 className="font-serif text-xl font-bold text-[#24324A] flex items-center gap-2">
            <Disc className="w-5 h-5 text-purple-600" />
            <span>Our {tracks.length} Signature Songs</span>
          </h3>
          <button
            type="button"
            onClick={() => setIsAddingSong(!isAddingSong)}
            className="px-3.5 py-1.5 bg-white/90 hover:bg-white text-[#24324A] border border-purple-200 rounded-xl text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Track</span>
          </button>
        </div>

        {/* Add custom track form */}
        {isAddingSong && (
          <form
            onSubmit={handleSaveCustomTrack}
            className="mb-4 p-4 bg-white/80 border border-purple-200 rounded-2xl space-y-3 animate-in fade-in"
          >
            <div className="text-xs font-sans font-semibold text-[#24324A]">
              Add another song to our mixtape:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Song Title (e.g. Until I Found You)"
                className="px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs font-sans text-[#24324A]"
                required
              />
              <input
                type="text"
                value={newArtist}
                onChange={(e) => setNewArtist(e.target.value)}
                placeholder="Artist name"
                className="px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs font-sans text-[#24324A]"
              />
            </div>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Why this song? (Your personal liner note)"
              className="w-full px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs font-sans text-[#24324A]"
            />
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Audio File URL (optional .mp3 / audio stream link)"
              className="w-full px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs font-sans text-[#24324A]"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingSong(false)}
                className="px-3 py-1.5 text-xs text-[#24324A]/70 font-sans cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#24324A] hover:bg-[#1A2538] text-white rounded-xl text-xs font-sans font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Save to Cassette
              </button>
            </div>
          </form>
        )}

        {/* Tracks List with light pastel rainbow tints */}
        <div className="space-y-2">
          {tracks.map((track, idx) => {
            const isSelected = idx === currentTrackIndex;
            const isCurrentPlaying = isSelected && isPlaying;
            const rainbowTints = [
              'bg-rose-50/80 border-rose-200/80 hover:bg-rose-100/70',
              'bg-amber-50/80 border-amber-200/80 hover:bg-amber-100/70',
              'bg-emerald-50/80 border-emerald-200/80 hover:bg-emerald-100/70',
              'bg-sky-50/80 border-sky-200/80 hover:bg-sky-100/70',
              'bg-purple-50/80 border-purple-200/80 hover:bg-purple-100/70',
              'bg-pink-50/80 border-pink-200/80 hover:bg-pink-100/70',
            ];
            const tint = rainbowTints[idx % rainbowTints.length];

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => handleSelectTrack(track, idx)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all cursor-pointer border group ${
                  isSelected
                    ? 'bg-white border-2 border-purple-500 text-[#24324A] shadow-sm ring-2 ring-purple-300/40 font-semibold'
                    : `${tint} text-[#24324A]/90`
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Functional play button on each track */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isCurrentPlaying
                        ? 'bg-[#24324A] text-white shadow-xs'
                        : isSelected
                        ? 'bg-purple-200 text-[#24324A]'
                        : 'bg-white/80 text-[#24324A]/70 group-hover:bg-white'
                    }`}
                    title={isCurrentPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 translate-x-0.2" />
                    )}
                  </div>

                  <span className="font-mono text-xs text-[#24324A]/60 font-semibold w-5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h5 className="font-serif font-bold text-sm text-[#24324A]">
                      {track.title}
                    </h5>
                    <p className="font-sans text-xs text-[#24324A]/70">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isCurrentPlaying && (
                    <span className="flex items-center gap-0.5 text-purple-600">
                      <span className="w-1 h-3 bg-purple-600 rounded animate-pulse" />
                      <span className="w-1 h-4 bg-purple-600 rounded animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-purple-600 rounded animate-pulse delay-150" />
                    </span>
                  )}
                  <span className="font-mono text-xs text-[#24324A]/60 font-medium">
                    {track.duration}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
