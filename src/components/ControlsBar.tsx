import React, { useState } from 'react';
import { PlayerState } from '../core/types';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, ThumbsUp, ThumbsDown, MessageSquareText, Share2, ChevronUp, ToggleRight, Subtitles, RectangleHorizontal, MessageCircle } from 'lucide-react';

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
  children?: React.ReactNode; 
  forceShow?: boolean;
  isMobile?: boolean; 
  isMobileOnly?: boolean;
  isFullscreen?: boolean;
  primaryColor?: string;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  state, togglePlay, toggleMute, handleVolumeChange, toggleFullscreen, toggleTheater, toggleSettings, 
  hide = [], onLike, onDislike, onComment, onShare, onChat, onOpenMenu, children, isMobile, isMobileOnly, isFullscreen,
  primaryColor = '#00ffd5'
}) => {
  const isHidden = (key: string) => hide.includes(key);
  
  // Default to hidden actions on mobile/tablet, but expanded on desktop or in fullscreen
  const [showActions, setShowActions] = useState((!isMobile || isFullscreen) && !isHidden('minimized'));
  const [showRemainingTime, setShowRemainingTime] = useState(false);

  // Sync actions menu state with fullscreen transitions
  React.useEffect(() => {
    if (isFullscreen) {
      setShowActions(true);
    } else if (isMobile) {
      setShowActions(false);
    }
  }, [isFullscreen, isMobile]);
  
  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const displayCurrentTime = showRemainingTime 
    ? `-${formatTime(state.duration - state.currentTime)}` 
    : formatTime(state.currentTime);

  const showControls = state.showControls || !state.isPlaying || state.showSettings;
  const hideUiOnHold = state.isHolding2x && isMobile;

  return (
    <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 z-10 
      ${showControls ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'}
      ${isMobileOnly ? 'pb-0 px-0' : `px-4 pb-4 pt-10 ${hideUiOnHold ? '' : 'bg-gradient-to-t from-black/95 via-black/50 to-transparent'}`}`}>
      
      {!isMobileOnly && !hideUiOnHold && (
        <>
          {/* Top right floating actions (Like, Dislike, Share, etc.) above the progress bar */}
          <div className="flex justify-end items-center mb-2 mr-2 pointer-events-none">
            <div className={`flex items-center gap-3 sm:gap-4 overflow-hidden transition-all duration-500 ease-in-out pointer-events-auto ${showActions ? 'max-w-[500px] opacity-100' : 'max-w-0 opacity-0 !pointer-events-none'}`}>
              {!isHidden('like') && (
                <button 
                  onClick={onLike} 
                  title="Like"
                  className={`p-2 transition-all active:scale-90 drop-shadow-lg bg-white/5 hover:bg-white/10 rounded-full ${state.isLiked ? '' : 'text-white/70 hover:text-white'}`}
                  style={state.isLiked ? { color: primaryColor } : {}}
                >
                  <ThumbsUp size={18} fill={state.isLiked ? primaryColor : "none"} />
                </button>
              )}
              {!isHidden('dislike') && (
                <button 
                  onClick={onDislike} 
                  title="Dislike"
                  className={`p-2 transition-all active:scale-90 drop-shadow-lg bg-white/5 hover:bg-white/10 rounded-full ${state.isDisliked ? 'text-red-500' : 'text-white/70 hover:text-white'}`}
                >
                  <ThumbsDown size={18} fill={state.isDisliked ? "#ef4444" : "none"} />
                </button>
              )}
              {!isHidden('comment') && (
                <button 
                  onClick={onComment} 
                  title="Comments" 
                  className={`p-2 transition-all active:scale-90 drop-shadow-lg bg-white/5 hover:bg-white/10 rounded-full ${state.isCommentActive ? '' : 'text-white/70 hover:text-white'}`}
                  style={state.isCommentActive ? { color: primaryColor } : {}}
                >
                  <MessageSquareText size={18} fill={state.isCommentActive ? primaryColor : "none"} />
                </button>
              )}
              {!isHidden('chat') && (
                <button 
                  onClick={onChat} 
                  title="Chat" 
                  className={`p-2 transition-all active:scale-90 drop-shadow-lg bg-white/5 hover:bg-white/10 rounded-full ${state.isChatActive ? '' : 'text-white/70 hover:text-white'}`}
                  style={state.isChatActive ? { color: primaryColor } : {}}
                >
                  <MessageCircle size={18} fill={state.isChatActive ? primaryColor : "none"} />
                </button>
              )}
              {!isHidden('share') && (
                <button 
                  onClick={onShare} 
                  title="Share" 
                  className="p-2 transition-all text-white/70 hover:text-white active:scale-90 drop-shadow-lg bg-white/5 hover:bg-white/10 rounded-full"
                >
                  <Share2 size={18} />
                </button>
              )}
            </div>
            
            {!isHidden('menu-icon') && (
              <button 
                onClick={() => {
                  setShowActions(!showActions);
                  if (onOpenMenu) onOpenMenu();
                }} 
                className={`p-1.5 transition-all duration-300 hover:text-(--color-primary) drop-shadow-md pointer-events-auto ${showActions ? 'rotate-180' : 'rotate-0'}`}
              >
                <ChevronUp size={18} />
              </button>
            )}
          </div>
        </>
      )}

      {isMobileOnly && !hideUiOnHold && (
        <div className="flex items-center justify-between px-3 -mb-1 pointer-events-none">
          <div 
            className="text-[10px] font-bold tracking-wider text-white/90 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm cursor-pointer pointer-events-auto"
            onClick={() => setShowRemainingTime(!showRemainingTime)}
          >
            {displayCurrentTime} <span className="text-white/40 mx-0.5">/</span> {formatTime(state.duration)}
          </div>
          <button onClick={toggleFullscreen} className="p-1.5 transition-all text-white/90 active:scale-90 bg-black/20 rounded-full backdrop-blur-sm pointer-events-auto">
            <Maximize size={16} />
          </button>
        </div>
      )}

      {children}
      
      {!isMobileOnly && !hideUiOnHold && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={togglePlay} className="hover:text-(--color-primary) transition-all active:scale-90 p-1.5 bg-white/5 hover:bg-white/10 rounded-full">
              {state.isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
            </button>
            
            <div className="flex items-center gap-2 group">
              <button onClick={toggleMute} className="hover:text-(--color-primary) transition-all active:scale-90 p-1.5 bg-white/5 hover:bg-white/10 rounded-full">
                {state.isMuted || state.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              {!isMobile && (
                <input 
                  type="range" 
                  min="0" max="1" step="0.05"
                  value={state.volume}
                  onChange={handleVolumeChange}
                  className="w-0 sm:group-hover:w-20 opacity-0 sm:group-hover:opacity-100 transition-all duration-300 accent-(--color-primary) h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              )}
            </div>

            <div 
              className="text-[11px] sm:text-sm font-medium tracking-wide text-zinc-300 cursor-pointer pointer-events-auto select-none"
              onClick={() => setShowRemainingTime(!showRemainingTime)}
            >
              {displayCurrentTime} <span className="text-zinc-500 mx-0.5">/</span> {formatTime(state.duration)}
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <button className="hidden sm:block p-1 transition-colors hover:text-(--color-primary)"><ToggleRight size={20} /></button>
            {!isHidden('subtitle') && <button className="hidden sm:block p-1 transition-colors hover:text-(--color-primary)"><Subtitles size={20} /></button>}
            
            <button onClick={toggleSettings} className={`p-1.5 transition-all hover:text-(--color-primary) bg-white/5 hover:bg-white/10 rounded-full active:scale-90 relative ${state.showSettings ? 'text-(--color-primary) rotate-90' : ''} duration-300`}>
              {/* Red dot indicator for HD/Premium content */}
              {state.currentQuality !== 'Auto' && parseInt(state.currentQuality) >= 1080 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
                </span>
              )}
              <Settings size={18} />
            </button>
            
            {!isHidden('theater') && (
              <button onClick={toggleTheater} className={`hidden md:block p-1 transition-colors hover:text-(--color-primary) ${state.isTheaterMode ? 'text-(--color-primary)' : ''}`}>
                <RectangleHorizontal size={20} />
              </button>
            )}
            
            <button onClick={toggleFullscreen} className="p-1.5 transition-all hover:text-(--color-primary) active:scale-90 bg-white/5 hover:bg-white/10 rounded-full">
              {state.isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

