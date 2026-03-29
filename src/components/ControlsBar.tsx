import React, { useState } from 'react';
import { PlayerState } from '../core/types';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, ThumbsUp, ThumbsDown, MessageSquare, Share2, ChevronUp, ToggleRight, Subtitles, RectangleHorizontal } from 'lucide-react';

interface ControlsBarProps {
  state: PlayerState;
  togglePlay: () => void;
  toggleMute: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleFullscreen: () => void;
  toggleTheater: () => void;
  toggleSettings: () => void;
  hide?: string[];
  onLike?: () => void;
  onDislike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onChat?: () => void;
  onOpenMenu?: () => void;
  children?: React.ReactNode; // For progress bar
  forceShow?: boolean;
  isMobile?: boolean;
  isFullscreen?: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  state, togglePlay, toggleMute, handleVolumeChange, toggleFullscreen, toggleTheater, toggleSettings, 
  hide = [], onLike, onDislike, onComment, onShare, onChat, onOpenMenu, children, isMobile, isFullscreen
}) => {
  const isHidden = (key: string) => hide.includes(key);
  const [showActions, setShowActions] = useState(!isHidden('minimized'));
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const showControls = state.showControls || !state.isPlaying || state.showSettings;

  return (
    <div className={`absolute bottom-0 left-0 right-0 px-4 pb-2 pt-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 z-10 
      ${showControls ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'}`}>
      
      {/* Top right floating actions (Like, Dislike, Share, etc.) above the progress bar */}
      <div className="flex justify-end items-center mb-2 mr-2">
        <div className={`flex items-center gap-3 sm:gap-4 overflow-hidden transition-all duration-500 ease-in-out ${showActions ? 'max-w-[500px] opacity-100' : 'max-w-0 opacity-0'}`}>
          {!isHidden('like') && <button onClick={onLike} className="p-1.5 transition-colors hover:text-(--color-primary) drop-shadow-md"><ThumbsUp size={18} /></button>}
          {!isHidden('dislike') && <button onClick={onDislike} className="p-1.5 transition-colors hover:text-(--color-primary) drop-shadow-md"><ThumbsDown size={18} /></button>}
          {!isHidden('comment') && <button onClick={onComment} className="p-1.5 transition-colors hover:text-(--color-primary) drop-shadow-md"><MessageSquare size={18} /></button>}
          {!isHidden('chat') && <button onClick={onChat} className="p-1.5 transition-colors hover:text-(--color-primary) drop-shadow-md"><MessageSquare size={18} className="rotate-180" /></button>}
          {!isHidden('share') && <button onClick={onShare} className="p-1.5 transition-colors hover:text-(--color-primary) drop-shadow-md"><Share2 size={18} /></button>}
        </div>
        
        {!isHidden('menu-icon') && (
          <button 
            onClick={() => {
              setShowActions(!showActions);
              if (onOpenMenu) onOpenMenu();
            }} 
            className={`p-1.5 transition-all duration-300 hover:text-(--color-primary) drop-shadow-md ${showActions ? 'rotate-180' : 'rotate-0'}`}
          >
            <ChevronUp size={18} />
          </button>
        )}
      </div>

      {children}
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="hover:text-(--color-primary) transition-colors p-1">
            {state.isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
          </button>
          
          <div className="flex items-center gap-2 group">
            <button onClick={toggleMute} className="hover:text-(--color-primary) transition-colors p-1">
              {state.isMuted || state.volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min="0" max="1" step="0.05"
              value={state.volume}
              onChange={handleVolumeChange}
              className="w-0 group-hover:w-20 opacity-0 group-hover:opacity-100 transition-all duration-300 accent-(--color-primary) h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="text-sm font-medium tracking-wide">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hidden sm:block p-1 transition-colors hover:text-(--color-primary)"><ToggleRight size={20} /></button>
          {!isHidden('subtitle') && <button className="hidden sm:block p-1 transition-colors hover:text-(--color-primary)"><Subtitles size={20} /></button>}
          
          <button onClick={toggleSettings} className={`p-1 transition-colors hover:text-(--color-primary) relative ${state.showSettings ? 'text-(--color-primary) rotate-90' : ''} duration-300`}>
            {/* Red dot mock for settings/quality */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border border-black"></span>
            <Settings size={20} />
          </button>
          
          {!isHidden('theater') && (
            <button onClick={toggleTheater} className={`hidden sm:block p-1 transition-colors hover:text-(--color-primary) ${state.isTheaterMode ? 'text-(--color-primary)' : ''}`}>
              <RectangleHorizontal size={20} />
            </button>
          )}
          
          <button onClick={toggleFullscreen} className="p-1 transition-colors hover:text-(--color-primary)">
            {state.isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
