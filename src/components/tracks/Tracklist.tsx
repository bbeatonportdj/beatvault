"use client";

import { useEffect } from "react";
import { Play, Pause, BarChart2, ShoppingCart, Flame, Sparkles } from "lucide-react";
import Image from "next/image";
import { Track } from "@/lib/PlayerContext";
import { usePlayer } from "@/lib/PlayerContext";

import { useCart } from "@/lib/CartContext";

interface WaveformIconProps {
  isPlaying: boolean;
}

function WaveformIcon({ isPlaying }: WaveformIconProps) {
  if (!isPlaying) {
    return <BarChart2 size={14} className="text-neon/50" />;
  }
  return (
    <span className="flex items-end gap-[2px] h-4">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <span key={i} className="waveform-bar" />
      ))}
    </span>
  );
}

interface TracklistProps {
  tracks: Track[];
  title?: string;
}

export default function Tracklist({ tracks, title = "Tracklist" }: TracklistProps) {
  const { currentTrack, isPlaying, playTrack, setQueue } = usePlayer();
  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    setQueue(tracks);
  }, [tracks, setQueue]);

  const formatKey = (key: string) => {
    const num = key.replace(/[AB]/g, "");
    const scale = key.endsWith("A") ? "m" : "M";
    const camelotToKey: Record<string, string> = {
      "1": "Ab", "2": "Eb", "3": "Bb", "4": "F", "5": "C", "6": "G",
      "7": "D", "8": "A", "9": "E", "10": "B", "11": "F#", "12": "Db",
    };
    return `${camelotToKey[num] || num}${scale}`;
  };

  return (
    <section id="tracklist" className="px-4 sm:px-6 pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-white tracking-tight">{title}</h2>
        <span className="text-xs text-white/30 font-medium tabular-nums">
          {tracks.length} tracks
        </span>
      </div>

      {/* Table container */}
      <div className="rounded-xl border border-white/5 overflow-hidden bg-[#0E0E0E]">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[40px_1fr_140px_64px_64px_80px_80px_44px] gap-2 px-4 py-3 border-b border-white/5">
          <span className="text-[11px] font-bold text-white/20 tracking-widest text-center">#</span>
          <span className="text-[11px] font-bold text-white/20 tracking-widest">TITLE</span>
          <span className="text-[11px] font-bold text-white/20 tracking-widest">ARTIST</span>
          <span className="text-[11px] font-bold text-white/20 tracking-widest text-center">BPM</span>
          <span className="text-[11px] font-bold text-white/20 tracking-widest text-center">KEY</span>
          <span className="text-[11px] font-bold text-white/20 tracking-widest text-center">TIME</span>
          <span className="text-[11px] font-bold text-white/20 tracking-widest text-center">PRICE</span>
          <span className="text-[11px] font-bold text-white/20 tracking-widest text-center">BUY</span>
        </div>

        {/* Track rows */}
        {tracks.length === 0 ? (
          <div className="py-16 text-center">
            <BarChart2 size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm font-medium">No tracks found</p>
          </div>
        ) : (
          tracks.map((track, idx) => {
            const isActive = currentTrack?.id === track.id;
            const isCurrentPlaying = isActive && isPlaying;
            const isInCart = cart.some(item => item.id === track.id);

            return (
              <div
                key={track.id}
                id={`track-row-${track.id}`}
                onDoubleClick={() => playTrack(track)}
                className={`track-row group grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_1fr_140px_64px_64px_80px_80px_44px] items-center gap-2 px-4 py-3 border-b border-white/[0.03] last:border-b-0 cursor-pointer
                  ${isActive ? "active" : ""}`}
              >
                {/* Index / waveform */}
                <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                  {isActive ? (
                    <WaveformIcon isPlaying={isCurrentPlaying} />
                  ) : (
                    <span className={`text-[13px] font-mono font-semibold tabular-nums ${isActive ? "text-neon" : "text-white/25"} group-hover:hidden`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                  {!isActive && (
                    <button
                      onClick={() => playTrack(track)}
                      className="hidden group-hover:flex items-center justify-center w-7 h-7 rounded-full bg-neon/10 hover:bg-neon/20 transition-colors"
                      aria-label={`Play ${track.title}`}
                    >
                      <Play size={12} fill="#00D1FF" className="text-neon ml-0.5" />
                    </button>
                  )}
                </div>

                {/* Title + cover */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5">
                      <Image
                        src={track.coverUrl}
                        alt={track.title}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg border border-neon/50 shadow-neon-sm" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${isActive ? "text-neon" : "text-white/90"}`}>
                        {track.title}
                      </p>
                      {track.isNew && (
                        <span className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-neon/15 text-neon text-[9px] font-bold tracking-wider">
                          <Sparkles size={8} />NEW
                        </span>
                      )}
                      {track.isHot && !track.isNew && (
                        <span className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 text-[9px] font-bold tracking-wider">
                          <Flame size={8} />HOT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/30 truncate mt-0.5">{track.label}</p>
                  </div>
                </div>

                {/* Artist - hidden on mobile */}
                <div className="hidden md:block min-w-0">
                  <p className="text-sm text-white/50 font-medium truncate">{track.artist}</p>
                </div>

                {/* BPM */}
                <div className="hidden md:flex justify-center">
                  <span className="font-mono text-sm font-semibold text-white/60 tabular-nums">{track.bpm}</span>
                </div>

                {/* Key */}
                <div className="hidden md:flex justify-center">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/5 text-neon/70 tracking-wide">
                    {track.key}
                  </span>
                </div>

                {/* Duration */}
                <div className="hidden md:flex justify-center">
                  <span className="font-mono text-[12px] text-white/30 tabular-nums">{track.duration}</span>
                </div>

                {/* Price */}
                <div className="hidden md:flex justify-center">
                  <span className="font-mono text-sm font-bold text-neon tabular-nums">฿{track.price || 99}</span>
                </div>

                {/* Cart button */}
                <div className="flex justify-center">
                  <button
                    id={`cart-btn-${track.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      isInCart ? removeFromCart(track.id) : addToCart(track);
                    }}
                    className={`cart-btn flex items-center justify-center w-8 h-8 rounded-full transition-all
                      ${isInCart ? "bg-neon text-base" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}
                    aria-label={isInCart ? "Remove from cart" : "Add to cart"}
                  >
                    <ShoppingCart size={14} fill={isInCart ? "#0A0A0A" : "none"} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
