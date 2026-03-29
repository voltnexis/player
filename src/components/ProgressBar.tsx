import React, { useRef, useState, useEffect } from 'react';
import { PlayerState } from '../core/types';

interface ProgressBarProps {
  state: PlayerState;
  handleVideoProgress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  primaryColor?: string;
  duration: number;
  src?: string;
  hide?: string[];
  isMobile?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ state, handleVideoProgress, primaryColor, duration, src, hide = [], isMobile }) => {
  const [hoverTarget, setHoverTarget] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pos = e.clientX - rect.left;
    const percentage = pos / rect.width;
    const time = percentage * duration;

    setHoverPos(percentage * 100);
    setHoverTarget(time);

    // Sync preview video
    if (previewVideoRef.current && src && !hide.includes('preview')) {
      previewVideoRef.current.currentTime = time;
    }
  };

  const handleMouseLeave = () => {
    setHoverTarget(null);
    setHoverPos(null);
  };

  // Note: CSS variables are now handled at the PlayerContainer level for better scoping

  return (
    <div className="w-full relative py-3 group cursor-pointer" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Preview Tooltip */}
      {hoverTarget !== null && hoverPos !== null && !hide.includes('preview') && (
        <div
          className="absolute bottom-8 transform -translate-x-1/2 bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center pointer-events-none z-50 transition-all animate-in fade-in zoom-in-95 duration-200"
          style={{ left: `${hoverPos}%`, minWidth: '160px' }}
        >
          {src && (
            <video
              ref={previewVideoRef}
              src={src}
              className="w-40 aspect-video object-cover bg-black"
              muted
              playsInline
              preload="metadata"
            />
          )}
          <div className="text-[11px] text-white font-bold py-1.5 bg-black/40 w-full text-center tracking-tight">
            {formatTime(hoverTarget)}
          </div>
        </div>
      )}

      <div ref={trackRef} className={`relative w-full ${isMobile ? 'h-1.5' : 'h-1 group-hover:h-1.5'} bg-white/20 rounded-full transition-all duration-300`}>
        {/* Buffered (Mocked empty for now) */}
        <div className="absolute top-0 left-0 h-full bg-white/20 rounded-full" style={{ width: `0%` }}></div>

        {/* Current Progress */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all"
          style={{ width: `${state.progress}%`, backgroundColor: 'var(--player-primary)', boxShadow: '0 0 10px var(--player-primary)' }}
        >
          {/* Thumb */}
          <div className={`absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white rounded-full ${isMobile ? 'scale-100 shadow-lg' : 'scale-0 group-hover:scale-100'} shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 border-2 border-(--player-primary)`}></div>
        </div>

        {/* Invisible Range Input for Dragging */}
        <input
          type="range"
          min="0"
          max="100"
          value={state.progress}
          onChange={handleVideoProgress}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
