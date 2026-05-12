"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Repeat, Shuffle,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/lib/PlayerContext";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Simulated waveform visualization bars
const WAVEFORM_HEIGHTS = [
  30, 55, 40, 70, 50, 85, 45, 60, 35, 75, 55, 80, 40, 65, 50, 90, 45, 70, 35, 60,
  50, 75, 40, 85, 55, 65, 45, 70, 35, 55, 80, 45, 60, 75, 50, 40, 65, 55, 80, 70,
  45, 60, 35, 75, 50, 85, 40, 65, 55, 70,
];

export default function AudioPlayer() {
  const {
    currentTrack, isPlaying, progress, volume,
    currentTime, duration,
    togglePlay, skipNext, skipPrev,
    setVolume, setProgress,
  } = usePlayer();

  const progressBarRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          if (e.shiftKey) {
            setProgress(Math.min(100, progress + 5));
          } else {
            skipNext();
          }
          break;
        case "ArrowLeft":
          if (e.shiftKey) {
            setProgress(Math.max(0, progress - 5));
          } else {
            skipPrev();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, skipNext, skipPrev, setVolume, volume, setProgress, progress]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setProgress(Math.max(0, Math.min(100, pct)));
    },
    [setProgress]
  );

  if (!currentTrack) {
    return (
      <footer
        id="audio-player"
        className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/5 h-[88px] flex items-center justify-center"
      >
        <div className="flex items-center gap-3 text-white/25">
          <Play size={16} />
          <span className="text-sm font-medium">Select a track to start playing</span>
        </div>
      </footer>
    );
  }

  const totalSeconds = duration || 180;

  return (
    <footer
      id="audio-player"
      className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/5"
    >
      {/* Waveform progress bar */}
      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        className="relative w-full h-12 cursor-pointer group px-0 overflow-hidden"
        aria-label="Seek bar"
        role="slider"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-2 pointer-events-none">
          {WAVEFORM_HEIGHTS.map((h, i) => {
            const barProgress = (i / WAVEFORM_HEIGHTS.length) * 100;
            const isPassed = barProgress < progress;
            const isCurrent = Math.abs(barProgress - progress) < 3;
            return (
              <div
                key={i}
                className="flex-shrink-0 rounded-sm transition-all duration-75"
                style={{
                  width: "4px",
                  height: `${h * 0.4}px`,
                  background: isPassed
                    ? "#00D1FF"
                    : isCurrent
                    ? "rgba(0,209,255,0.6)"
                    : "rgba(255,255,255,0.08)",
                  boxShadow: isPassed ? "0 0 4px rgba(0,209,255,0.4)" : "none",
                }}
              />
            );
          })}
        </div>

        {/* Invisible solid progress track for click accuracy */}
        <div className="absolute inset-0 flex items-center px-2">
          <div className="progress-track w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              className="progress-fill h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3 px-4 sm:px-6 pb-4 pt-1">
        {/* Track info */}
        <div className="flex items-center gap-3 w-[200px] sm:w-[240px] flex-shrink-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src={currentTrack.cover_url || currentTrack.coverUrl}
                alt={currentTrack.title}
                width={40}
                height={40}
                className="object-cover"
                unoptimized
              />
            </div>
            {isPlaying && (
              <div className="absolute inset-0 rounded-lg border border-neon/50 animate-pulse" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentTrack.title}</p>
            <p className="text-[11px] text-white/40 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Center controls */}
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3">
          <button
            className="hidden sm:flex items-center justify-center w-8 h-8 text-white/30 hover:text-white/60 transition-colors"
            aria-label="Shuffle"
          >
            <Shuffle size={15} />
          </button>

          <button
            id="player-prev"
            onClick={skipPrev}
            className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Previous track"
          >
            <SkipBack size={18} />
          </button>

          <button
            id="player-play-pause"
            onClick={togglePlay}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-neon text-base hover:bg-neon/90 hover:shadow-neon transition-all active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} fill="#0A0A0A" className="text-base" />
            ) : (
              <Play size={20} fill="#0A0A0A" className="text-base ml-0.5" />
            )}
          </button>

          <button
            id="player-next"
            onClick={skipNext}
            className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Next track"
          >
            <SkipForward size={18} />
          </button>

          <button
            className="hidden sm:flex items-center justify-center w-8 h-8 text-white/30 hover:text-white/60 transition-colors"
            aria-label="Repeat"
          >
            <Repeat size={15} />
          </button>
        </div>

        {/* Right: time + volume */}
        <div className="flex items-center gap-3 w-[200px] sm:w-[240px] justify-end flex-shrink-0">
          <span className="hidden sm:block text-[11px] font-mono text-white/30 tabular-nums flex-shrink-0">
            {formatTime(currentTime)} / {formatTime(totalSeconds)}
          </span>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              className="text-white/30 hover:text-neon transition-colors"
              aria-label="Mute"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="relative w-20 h-1 bg-white/10 rounded-full cursor-pointer group/vol"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const v = (e.clientX - rect.left) / rect.width;
                setVolume(Math.max(0, Math.min(1, v)));
              }}
            >
              <div
                className="h-full rounded-full bg-neon transition-all"
                style={{ width: `${volume * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-neon shadow-neon-sm opacity-0 group-hover/vol:opacity-100 transition-all"
                style={{ left: `calc(${volume * 100}% - 6px)` }}
              />
            </div>
          </div>

          {/* BPM / Key badge on player */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/5">
            <span className="hidden md:block text-[10px] font-mono font-bold text-white/20 tabular-nums">
              {currentTrack.bpm} BPM
            </span>
            <span className="hidden md:block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neon/10 text-neon/60">
              {currentTrack.key}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
