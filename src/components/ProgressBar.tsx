import React, { useRef, useState, useEffect } from 'react';
import { PlayerState } from '../core/types';

interface ProgressBarProps {
  state: PlayerState;
  handleVideoProgress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  primaryColor?: string;
  duration: number;
  src?: string;
  hide?: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ state, handleVideoProgress, primaryColor, duration, src, hide = [] }) => {
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
    <div className="w-full relative py-2 group cursor-pointer" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Preview Tooltip */}
      {hoverTarget !== null && hoverPos !== null && !hide.includes('preview') && (
        <div
          className="absolute bottom-6 transform -translate-x-1/2 bg-zinc-900 border border-zinc-700/50 rounded shadow-2xl overflow-hidden flex flex-col items-center pointer-events-none"
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
          <div className="text-xs text-white font-medium py-1">
            {formatTime(hoverTarget)}
          </div>
        </div>
      )}

      <div ref={trackRef} className="relative w-full h-1.5 bg-white/30 rounded-full group-hover:h-2 transition-all">
        {/* Buffered (Mocked empty for now) */}
        <div className="absolute top-0 left-0 h-full bg-white/50 rounded-full" style={{ width: `0%` }}></div>

        {/* Current Progress */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all"
          style={{ width: `${state.progress}%`, backgroundColor: 'var(--player-primary)' }}
        >
          {/* Thumb */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
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
