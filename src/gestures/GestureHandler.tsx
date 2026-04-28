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
  updateState: (updates: Partial<PlayerState>) => void;
}

export const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  state,
  togglePlay,
  toggleFullscreen,
  handleVideoSpeed,
  seek,
  showControls,
  updateState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const singleTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
            // Store the current speed to restore it later
            (window as any)._preHoldSpeed = state.playbackSpeed;
            handleVideoSpeed(2); 
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
        const preSpeed = (window as any)._preHoldSpeed ?? 1;
        handleVideoSpeed(preSpeed);
        
        // If it was a quick press (not much time passed or not a long hold), toggle play/pause
        // Note: PlayerContainer also toggles play on space down, so we might need to be careful
        // but typically togglePlay twice would just resume.
        // Actually, if we just want to fix the speed reset, restoring preSpeed is enough.
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

  const lastTapRef = useRef<{ x: number; time: number } | null>(null);

  const handleDoubleClick = (e: React.MouseEvent | { clientX: number }) => {
    if (singleTapTimeoutRef.current) clearTimeout(singleTapTimeoutRef.current);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Left 30% for seek backward
    if (x < width * 0.3) {
      seek(-5);
      showControls();
    } 
    // Right 30% for seek forward
    else if (x > width * 0.7) {
      seek(5);
      showControls();
    } 
    // Center for fullscreen
    else {
      toggleFullscreen();
    }
  };

  // Mobile Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    
    // Touch hold -> 2x speed
    holdTimeoutRef.current = setTimeout(() => {
      isHandlingHold.current = true;
      (window as any)._preHoldSpeed = state.playbackSpeed;
      handleVideoSpeed(2);
      updateState({ isHolding2x: true });
    }, 500); 
  };

  const clearHold = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (isHandlingHold.current) {
      const preSpeed = (window as any)._preHoldSpeed ?? 1;
      handleVideoSpeed(preSpeed);
      isHandlingHold.current = false;
      updateState({ isHolding2x: false });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    const touch = e.changedTouches[0];
    const x = touch.clientX;
    
    // Double tap detection
    if (lastTapRef.current && 
        now - lastTapRef.current.time < 300 && 
        Math.abs(x - lastTapRef.current.x) < 30) {
      
      if (singleTapTimeoutRef.current) clearTimeout(singleTapTimeoutRef.current);
      handleDoubleClick({ clientX: x });
      lastTapRef.current = null; // Reset
    } else {
      lastTapRef.current = { x, time: now };
      
      // If it was a quick tap, and not a hold, toggle play/pause
      if (!isHandlingHold.current) {
          if (singleTapTimeoutRef.current) clearTimeout(singleTapTimeoutRef.current);
          singleTapTimeoutRef.current = setTimeout(() => {
            togglePlay();
            showControls();
            lastTapRef.current = null;
          }, 250);
      }
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

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0"
      tabIndex={0}
      onMouseMove={showControls}
      onClick={(e) => {
        // Only toggle on single click desktop.
        if ((e.nativeEvent as PointerEvent).pointerType === 'mouse') {
          if (singleTapTimeoutRef.current) clearTimeout(singleTapTimeoutRef.current);
          singleTapTimeoutRef.current = setTimeout(() => {
            togglePlay();
            showControls();
          }, 250);
        } else {
          showControls();
        }
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

