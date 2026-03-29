import React, { useEffect, useRef } from 'react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { VoltNexisPlayerProps } from '../core/types';
import { GestureHandler } from '../gestures/GestureHandler';
import { VideoElement } from './VideoElement';
import { ControlsBar } from './ControlsBar';
import { ProgressBar } from './ProgressBar';
import { SettingsPanel } from './SettingsPanel';
import { ContextMenu } from './ContextMenu';
import { ShareModal } from './ShareModal';
import { X as CloseIcon } from 'lucide-react';

export const PlayerContainer: React.FC<VoltNexisPlayerProps> = (props) => {
  const { 
    src, auto, title, theme = 'dark', primaryColor = '#00ffd5', progressColor,
    hide = [], qualities = {}, previewVtt, subtitleVtt, shareUrl,
    onLike, onDislike, onShare, onChat, onComment, onOpenMenu, clicktitle
  } = props;
  const {
    videoRef, containerRef, state, updateState,
    togglePlay, handleOnPlay, handleOnPause, handleTimeUpdate, handleLoadedMetadata,
    handleVideoProgress, handleVideoSpeed, toggleMute, handleVolumeChange,
    toggleFullscreen, toggleTheater, toggleSettings, showControls, seek, handleSubtitleChange
  } = useVideoPlayer();

  const [currentSrc, setCurrentSrc] = React.useState(src || auto || '');
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [contextMenu, setContextMenu] = React.useState<{ x: number, y: number } | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const timeToRestore = React.useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleShare = () => {
    if (onShare) onShare();
    setShowShareModal(true);
  };

  const handleChat = () => {
    if (onChat) onChat({ like: onLike, dislike: onDislike, share: handleShare });
  };

  const handleComment = () => {
    if (onComment) onComment({ like: onLike, dislike: onDislike, share: handleShare });
  };

  const handleQualityChange = (quality: string, url: string) => {
    const targetUrl = quality === 'Auto' ? (src || auto || '') : url;
    if (targetUrl === currentSrc) return;

    if (videoRef.current) {
      timeToRestore.current = videoRef.current.currentTime;
      updateState({ currentQuality: quality, isBuffering: true });
      setCurrentSrc(targetUrl);
      
      // We need to seek back once the new source metadata is loaded
      const onLoaded = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = timeToRestore.current;
          updateState({ isBuffering: false });
          if (state.isPlaying) videoRef.current.play();
          videoRef.current.removeEventListener('loadedmetadata', onLoaded);
        }
      };
      videoRef.current.addEventListener('loadedmetadata', onLoaded);
    }
  };

  useEffect(() => {
    // Sync initial src if it changes from props
    setCurrentSrc(src || auto || '');
  }, [src, auto]);

  useEffect(() => {
    const color = progressColor || primaryColor;
    if (color && containerRef.current) {
      containerRef.current.style.setProperty('--player-primary', color);
    }
  }, [primaryColor, progressColor]);

  // Handle auto-hide cursor when fullscreen and controls are hidden
  const cursorStyle = state.isFullscreen && !state.showControls ? 'cursor-none' : 'cursor-default';

  // Dynamic layout for theater mode (breaking completely out of container wrapper if possible context-wise)
  const layoutStyle = state.isTheaterMode && !state.isFullscreen
    ? 'relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] max-w-none !rounded-none bg-black z-40'
    : 'relative w-full max-w-5xl mx-auto rounded-xl bg-(--color-player-bg) shadow-2xl';

  return (
    <div 
      ref={containerRef} 
      className={`aspect-video overflow-hidden font-sans text-white ${layoutStyle} ${cursorStyle} ${theme === 'light' ? 'bg-zinc-100 text-black' : ''}`}
      onMouseMove={showControls}
      onMouseLeave={() => { if(state.isPlaying) state.showControls = false; }}
    >
      {/* Top Title Bar */}
      <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 transition-opacity duration-300 flex items-center justify-between ${state.showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex-1 min-w-0">
          {clicktitle ? (
             <a href={clicktitle} target="_blank" rel="noopener noreferrer" className="inline-block pointer-events-auto">
               <h2 className="text-lg font-medium tracking-wide drop-shadow-md hover:text-(--player-primary) transition-colors truncate">{title || 'VoltNexis Player'}</h2>
             </a>
          ) : (
            <h2 className="text-lg font-medium tracking-wide drop-shadow-md truncate pointer-events-none">{title || 'VoltNexis Player'}</h2>
          )}
        </div>
      </div>

      <div 
        className="w-full h-full"
        onContextMenu={handleContextMenu}
      >
        <GestureHandler 
        state={state} 
        togglePlay={togglePlay} 
        toggleFullscreen={toggleFullscreen} 
        handleVideoSpeed={handleVideoSpeed} 
        seek={seek} 
        showControls={showControls}
      >
        <VideoElement
          ref={videoRef}
          src={currentSrc}
          auto={auto}
          subtitleVtt={subtitleVtt}
          subtitles={props.subtitles}
          onPlay={handleOnPlay}
          onPause={handleOnPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </GestureHandler>

      {/* Buffering Indicator */}
      {state.isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 border-4 border-white/20 border-t-(--color-primary) rounded-full animate-spin"></div>
        </div>
      )}

      {/* Centered Play Button (When paused) */}
      {!state.isPlaying && !state.isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm shadow-xl drop-shadow-2xl">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3l14 9-14 9V3z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Overlay Settings */}
      <SettingsPanel 
        state={state} 
        handleVideoSpeed={handleVideoSpeed} 
        toggleSettings={toggleSettings} 
        qualities={qualities}
        handleQualityChange={handleQualityChange}
        subtitles={props.subtitles}
        handleSubtitleChange={handleSubtitleChange}
      />

      {/* Controls Overlay */}
      <ControlsBar 
        state={state}
        togglePlay={togglePlay}
        toggleFullscreen={toggleFullscreen}
        toggleTheater={toggleTheater}
        toggleMute={toggleMute}
        handleVolumeChange={handleVolumeChange}
        toggleSettings={toggleSettings}
        hide={hide}
        onLike={onLike}
        onDislike={onDislike}
        onShare={handleShare}
        onChat={handleChat}
        onComment={handleComment}
        onOpenMenu={onOpenMenu}
        isMobile={isMobile}
        isFullscreen={state.isFullscreen}
      >
         {/* Render progress bar inside controls wrapper for layout consistency */}
         <div className="w-full mb-1">
           <ProgressBar 
             state={state} 
             handleVideoProgress={handleVideoProgress} 
             duration={state.duration} 
             src={currentSrc} 
             hide={hide}
           />
         </div>
      </ControlsBar>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal 
          url={shareUrl || window.location.href} 
          onClose={() => setShowShareModal(false)} 
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)} 
          copyUrl={copyPageUrl}
        />
      )}
      </div>
    </div>
  );
};
