"use client";

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  duration: string;
  coverUrl: string;
  cover_url?: string; // Support DB format
  audioUrl?: string;
  audio_url?: string; // Support DB format
  label?: string;
  isNew?: boolean;
  isHot?: boolean;
  price?: number;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  duration: number;
  currentTime: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  skipNext: () => void;
  skipPrev: () => void;
  setVolume: (v: number) => void;
  setProgress: (p: number) => void;
  queue: Track[];
  setQueue: (tracks: Track[]) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueueState] = useState<Track[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      const pct = (audio.currentTime / audio.duration) * 100;
      setProgressState(pct || 0);
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto play next could be added here
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current?.src) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Playback error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const playTrack = useCallback((track: Track) => {
    const trackUrl = track.audio_url || track.audioUrl;
    
    if (currentTrack?.id === track.id) {
      setIsPlaying((p) => !p);
      return;
    }

    setCurrentTrack(track);
    if (audioRef.current) {
      if (trackUrl) {
        audioRef.current.src = trackUrl;
        audioRef.current.load();
        setIsPlaying(true);
      } else {
        // Fallback for demo tracks without real audio
        audioRef.current.src = "";
        setIsPlaying(true);
        console.warn("No audio URL found for this track. Simulating playback...");
      }
    }
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying((p) => !p);
  }, [currentTrack]);

  const skipNext = useCallback(() => {
    if (!queue.length || !currentTrack) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const next = queue[(idx + 1) % queue.length];
    if (next) playTrack(next);
  }, [queue, currentTrack, playTrack]);

  const skipPrev = useCallback(() => {
    if (!queue.length || !currentTrack) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const prev = queue[(idx - 1 + queue.length) % queue.length];
    if (prev) playTrack(prev);
  }, [queue, currentTrack, playTrack]);

  const setVolume = useCallback((v: number) => {
    const vol = Math.max(0, Math.min(1, v));
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  const setProgress = useCallback((p: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (p / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgressState(p);
      setCurrentTime(time);
    }
  }, []);

  const setQueue = useCallback((tracks: Track[]) => {
    setQueueState(tracks);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        volume,
        duration,
        currentTime,
        playTrack,
        togglePlay,
        skipNext,
        skipPrev,
        setVolume,
        setProgress,
        queue,
        setQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
