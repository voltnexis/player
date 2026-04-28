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
import { X as CloseIcon, ChevronRight, ChevronLeft, Volume2, Volume1, VolumeX, Settings } from 'lucide-react';

export const PlayerContainer: React.FC<VoltNexisPlayerProps> = (props) => {
  const { 
    src, auto, title, theme = 'dark', primaryColor = '#00ffd5', progressColor,
    hide = [], qualities = {}, previewVtt, subtitleVtt, shareUrl,
    onLike, onDislike, onShare, onChat, onComment, onOpenMenu, clicktitle,
    width, height, onNext, onPrev, onNextChapter, onPrevChapter
  } = props;
  const {
    videoRef, containerRef, state, updateState,
    togglePlay, handleOnPlay, handleOnPause, handleTimeUpdate, handleLoadedMetadata,
    handleVideoProgress, handleVideoSpeed, toggleMute, handleVolumeChange,
    toggleFullscreen, toggleTheater, toggleSettings, showControls, seek, seekTo,
    handleSubtitleChange, toggleFeedback, loadFeedback
  } = useVideoPlayer();

  const [currentSrc, setCurrentSrc] = React.useState(src || auto || '');

  useEffect(() => {
    loadFeedback(currentSrc);
  }, [currentSrc]);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [contextMenu, setContextMenu] = React.useState<{ x: number, y: number } | null>(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = React.useState(false);
  const timeToRestore = React.useRef(0);

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isTabletDevice = /iPad|PlayBook|Silk/i.test(ua) || (navigator.maxTouchPoints > 0 && /Macintosh/i.test(ua));
      const isSmallScreen = window.innerWidth <= 1024;
      setIsMobileOrTablet(isMobileDevice || isTabletDevice || isSmallScreen);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (isMobileOrTablet && state.isFullscreen) {
      if ((window.screen.orientation as any)?.lock) {
        (window.screen.orientation as any).lock('landscape').catch(() => {});
      }
    } else if (isMobileOrTablet && !state.isFullscreen) {
      if ((window.screen.orientation as any)?.unlock) {
        (window.screen.orientation as any).unlock();
      }
    }
  }, [state.isFullscreen, isMobileOrTablet]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea/editable
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) return;

      const key = e.key.toLowerCase();
      
      // Top Essential
      if (key === 'k' || key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (key === 'j') {
        seek(-10);
      } else if (key === 'l') {
        seek(10);
      } else if (key === 'm') {
        toggleMute();
      } else if (key === 'f') {
        toggleFullscreen();
      } else if (key === 't') {
        toggleTheater();
      } else if (key === 'c') {
        const newSub = state.currentSubtitle === 'off' ? 'en' : 'off';
        handleSubtitleChange(newSub);
      }
      
      // Playback & Navigation
      else if (key === 'arrowleft') {
        if (e.ctrlKey) {
          if (onPrevChapter) onPrevChapter();
        } else {
          seek(-5);
        }
      } else if (key === 'arrowright') {
        if (e.ctrlKey) {
          if (onNextChapter) onNextChapter();
        } else {
          seek(5);
        }
      } else if (key === '0' || key === 'home') {
        seekTo(0);
      } else if (/^[1-9]$/.test(key)) {
        const percent = parseInt(key) * 10;
        seekTo((percent / 100) * state.duration);
      } else if (key === 'n' && e.shiftKey) {
        if (onNext) onNext();
      } else if (key === 'p' && e.shiftKey) {
        if (onPrev) onPrev();
      }
      
      // Volume & Speed
      else if (key === 'arrowup') {
        e.preventDefault();
        handleVolumeChange(Math.min(1, state.volume + 0.05));
      } else if (key === 'arrowdown') {
        e.preventDefault();
        handleVolumeChange(Math.max(0, state.volume - 0.05));
      } else if ((key === '>' || key === '.') && e.shiftKey) {
        handleVideoSpeed(Math.min(2, state.playbackSpeed + 0.25));
      } else if ((key === '<' || key === ',') && e.shiftKey) {
        handleVideoSpeed(Math.max(0.25, state.playbackSpeed - 0.25));
      }
      
      // Frame by Frame (when paused)
      else if (!state.isPlaying) {
        if (key === '.') {
          seekTo(state.currentTime + (1/24));
        } else if (key === ',') {
          seekTo(state.currentTime - (1/24));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, togglePlay, seek, seekTo, toggleMute, toggleFullscreen, toggleTheater, handleSubtitleChange, handleVolumeChange, handleVideoSpeed, onNext, onPrev, onNextChapter, onPrevChapter, isMobileOrTablet]);

  const isDesktop = !isMobileOrTablet;
  const isMobileOnly = isMobileOrTablet && !state.isFullscreen;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleLike = () => {
    toggleFeedback(currentSrc, 'isLiked');
    if (onLike) onLike();
  };

  const handleDislike = () => {
    toggleFeedback(currentSrc, 'isDisliked');
    if (onDislike) onDislike();
  };

  const handleShare = () => {
    if (onShare) onShare();
    setShowShareModal(true);
  };

  const handleChat = () => {
    toggleFeedback(currentSrc, 'isChatActive');
    if (onChat) onChat({ like: handleLike, dislike: handleDislike, share: handleShare });
  };

  const handleComment = () => {
    toggleFeedback(currentSrc, 'isCommentActive');
    if (onComment) onComment({ like: handleLike, dislike: handleDislike, share: handleShare });
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
    : `relative ${!width ? 'w-full max-w-5xl' : ''} mx-auto rounded-xl bg-(--color-player-bg) shadow-2xl transition-all duration-300`;

  const containerStyle: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
    maxWidth: width ? 'none' : undefined,
    aspectRatio: !height ? '16/9' : undefined
  };

  return (
    <div 
      ref={containerRef} 
      className={`overflow-hidden font-sans text-white ${layoutStyle} ${cursorStyle} ${theme === 'light' ? 'bg-zinc-100 text-black' : ''} group/player ${state.isHolding2x && isMobileOrTablet ? 'is-holding-2x' : ''} ${state.showControls ? 'controls-visible' : ''} ${isMobileOrTablet ? 'is-mobile' : ''} ${state.isFullscreen ? 'is-fullscreen' : ''}`}
      style={containerStyle}
      onMouseMove={showControls}
      onMouseLeave={() => { if(state.isPlaying) state.showControls = false; }}
    >
      {/* Top Title Bar */}
      <div className={`absolute top-0 left-0 right-0 px-4 pb-4 pt-3 bg-gradient-to-b from-black/80 to-transparent z-20 transition-opacity duration-300 flex items-start justify-between pointer-events-none ${(state.showControls && !(state.isHolding2x && isMobileOrTablet)) ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex-1 min-w-0 pr-4">
          {clicktitle ? (
             <a href={clicktitle} target="_blank" rel="noopener noreferrer" className="inline-block pointer-events-auto">
               <h2 className="text-base sm:text-lg font-medium tracking-wide drop-shadow-md hover:text-(--player-primary) transition-colors truncate max-w-[70vw]">{title || 'VoltNexis Player'}</h2>
             </a>
          ) : (
            <h2 className="text-sm sm:text-lg font-medium tracking-wide drop-shadow-md truncate max-w-[70vw]">{title || 'VoltNexis Player'}</h2>
          )}
        </div>
        
        {/* Mobile Settings Button (Top Right) */}
        {isMobileOnly && (
          <button 
            onClick={toggleSettings} 
            className="pointer-events-auto p-1.5 transition-all hover:text-(--color-primary) bg-white/5 hover:bg-white/10 rounded-full active:scale-90"
          >
            <Settings size={18} />
          </button>
        )}
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
        updateState={updateState}
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

      {/* Centered Play/Pause Button */}
      {!state.isBuffering && (!state.isPlaying || (isMobileOnly && state.showControls)) && !(state.isHolding2x && isMobileOrTablet) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/50 p-3 sm:p-4 rounded-full backdrop-blur-sm shadow-xl drop-shadow-2xl transition-all">
            {state.isPlaying ? (
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white ml-1 sm:ml-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3l14 9-14 9V3z"/>
              </svg>
            )}
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
        isMobile={isMobileOrTablet}
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
        onLike={handleLike}
        onDislike={handleDislike}
        onShare={handleShare}
        onChat={handleChat}
        onComment={handleComment}
        onOpenMenu={onOpenMenu}
        isMobile={isMobileOrTablet}
        isMobileOnly={isMobileOnly}
        isFullscreen={state.isFullscreen}
        primaryColor={primaryColor}
      >
         {/* Render progress bar inside controls wrapper for layout consistency */}
         <div className={`w-full ${isMobileOnly ? 'mb-0' : 'mb-1'}`}>
           <ProgressBar 
             state={state} 
             handleVideoProgress={handleVideoProgress} 
             duration={state.duration} 
             src={currentSrc} 
             hide={hide}
             isMobile={isMobileOrTablet}
             isMobileOnly={isMobileOnly}
             previewVtt={previewVtt}
           />
         </div>
       </ControlsBar>

       {/* Visual Feedback Overlays */}
       {state.seekingFeedback?.visible && !(state.isHolding2x && isMobileOrTablet) && (
         <div className="absolute inset-0 pointer-events-none z-[60] flex items-center">
           {state.seekingFeedback.direction === 'backward' ? (
             <div className={`pl-6 sm:pl-12 animate-in slide-in-from-left-4 fade-in duration-300`}>
               <div className={`flex items-center gap-2 sm:gap-4 text-white font-bold text-2xl sm:text-4xl tracking-tighter drop-shadow-lg`}>
                 <ChevronLeft size={isMobileOrTablet ? 32 : 48} strokeWidth={3} />
                 <span>- {state.seekingFeedback.accumulatedValue}</span>
               </div>
             </div>
           ) : (
             <div className={`ml-auto pr-6 sm:pr-12 animate-in slide-in-from-right-4 fade-in duration-300`}>
               <div className={`flex items-center gap-2 sm:gap-4 text-white font-bold text-2xl sm:text-4xl tracking-tighter drop-shadow-lg text-right`}>
                 <span>+ {state.seekingFeedback.accumulatedValue}</span>
                 <ChevronRight size={isMobileOrTablet ? 32 : 48} strokeWidth={3} />
               </div>
             </div>
           )}
         </div>
       )}

       {isDesktop && state.volumeFeedback?.visible && (
         <div className="absolute inset-0 pointer-events-none z-[60]">
            {/* Percentage at top */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 animate-in slide-in-from-top-4 fade-in duration-300">
              <span className="text-white font-bold text-2xl drop-shadow-md">
                {Math.round(state.volumeFeedback.volume * 100)}%
              </span>
            </div>
            {/* Icon at center */}
            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-95 fade-in duration-300">
              <div className="drop-shadow-2xl">
                {state.volumeFeedback.volume === 0 ? <VolumeX size={80} className="text-white/80" /> : 
                 state.volumeFeedback.volume < 0.5 ? <Volume1 size={80} className="text-white/80" /> : 
                 <Volume2 size={80} className="text-white/80" />}
              </div>
            </div>
         </div>
       )}

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
