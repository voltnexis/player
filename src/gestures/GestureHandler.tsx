import React, { useEffect, useRef } from 'react';
import { PlayerState } from '../core/types';

interface GestureHandlerProps {
  children: React.ReactNode;
  state: PlayerState;
  togglePlay: () => void;
  toggleFullscreen: () => void;
  handleVideoSpeed: (speed: number) => void;
  seek: (seconds: number) => void;
  showControls: () => void;
}

export const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  state,
  togglePlay,
  toggleFullscreen,
  handleVideoSpeed,
  seek,
  showControls,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHandlingHold = useRef(false);
  
  // Desktop keydown handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (!e.repeat) {
            handleVideoSpeed(2); // Temporary 2x speed
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(5);
          showControls();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(-5);
          showControls();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          // handled in parent or implement toggleMute prop
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleVideoSpeed(1); // Restore normal speed
        // If it was a quick press, maybe toggle play/pause (but space usually just plays/pauses). 
        // We'll treat short space press for play/pause if needed, or stick to req: Space hold -> 2x speed.
        // Let's implement quick press play/pause:
        if (state.playbackSpeed !== 2) {
          togglePlay();
        }
      }
    };

    const element = containerRef.current;
    if (element) {
      // To focus we just attach to window or document for this demo, 
      // but ideally we attach to the player container with tabIndex
      element.addEventListener('keydown', handleKeyDown);
      element.addEventListener('keyup', handleKeyUp);
      
      return () => {
        element.removeEventListener('keydown', handleKeyDown);
        element.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [handleVideoSpeed, seek, showControls, state.playbackSpeed, toggleFullscreen, togglePlay]);

  // Mobile Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    
    // Touch hold -> 2x speed
    holdTimeoutRef.current = setTimeout(() => {
      isHandlingHold.current = true;
      handleVideoSpeed(2);
    }, 500); // 500ms for hold
  };

  const clearHold = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (isHandlingHold.current) {
      handleVideoSpeed(1);
      isHandlingHold.current = false;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // If it was a quick tap, and not a hold, toggle play/pause
    if (!isHandlingHold.current) {
        // We might want to show controls on tap instead of pausing immediately if controls are hidden,
        // but requirement says: Mobile: Tip -> play/pause
        togglePlay();
        showControls();
    }
    clearHold();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    clearHold(); // cancel hold if dragging
    const deltaY = e.touches[0].clientY - touchStartY.current;
    // Swipe down to exit fullscreen
    if (deltaY > 50 && state.isFullscreen) {
      toggleFullscreen(); 
      touchStartY.current = e.touches[0].clientY; // Reset to avoid multiple triggers
    }
  };

  const handleDoubleClick = () => {
    toggleFullscreen();
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0"
      tabIndex={0}
      onMouseMove={showControls}
      onClick={(e) => {
        // Only toggle on single click desktop. Mobile touch handles its own tap.
        if ((e.nativeEvent as PointerEvent).pointerType === 'mouse') togglePlay();
        showControls();
      }}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={clearHold}
    >
      {children}
    </div>
  );
};
