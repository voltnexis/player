import { useState, useRef, useEffect, useCallback } from 'react';
import { PlayerState } from '../core/types';

export const useVideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    progress: 0,
    currentTime: 0,
    duration: 0,
    playbackSpeed: 1,
    isFullscreen: false,
    isTheaterMode: false,
    showSettings: false,
    showControls: true,
    isBuffering: false,
    currentQuality: 'Auto',
    currentSubtitle: 'off',
    seekingFeedback: { direction: 'forward', visible: false, accumulatedValue: 0 },
    volumeFeedback: { volume: 1, visible: false },
    isLiked: false,
    isDisliked: false,
    isCommentActive: false,
    isChatActive: false,
  });
  
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volumeFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSeekTimeRef = useRef<number>(0);

  const getFeedbackKey = (src: string) => `vn_feedback_${btoa(src).substring(0, 16)}`;

  const updateState = (updates: Partial<PlayerState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const loadFeedback = (src: string) => {
    if (!src) return;
    try {
      const key = getFeedbackKey(src);
      const saved = JSON.parse(sessionStorage.getItem(key) || '{}');
      updateState({
        isLiked: !!saved.isLiked,
        isDisliked: !!saved.isDisliked,
        isCommentActive: !!saved.isCommentActive,
        isChatActive: !!saved.isChatActive,
      });
    } catch (e) {
      console.warn("Failed to load feedback from sessionStorage:", e);
    }
  };

  const toggleFeedback = (src: string, field: 'isLiked' | 'isDisliked' | 'isCommentActive' | 'isChatActive') => {
    if (!src) return;
    setState((prev) => {
      const newState = { ...prev, [field]: !prev[field] };
      
      // Mutual exclusion: Like and Dislike
      if (field === 'isLiked' && newState.isLiked) newState.isDisliked = false;
      if (field === 'isDisliked' && newState.isDisliked) newState.isLiked = false;
      
      try {
        const key = getFeedbackKey(src);
        sessionStorage.setItem(key, JSON.stringify({
          isLiked: newState.isLiked,
          isDisliked: newState.isDisliked,
          isCommentActive: newState.isCommentActive,
          isChatActive: newState.isChatActive,
        }));
      } catch (e) {
        console.warn("Failed to save feedback to sessionStorage:", e);
      }
      
      return newState;
    });
  };

  const triggerSeekingFeedback = (direction: 'forward' | 'backward') => {
    const now = Date.now();
    const isQuickSeek = now - lastSeekTimeRef.current < 800 && state.seekingFeedback?.direction === direction;
    const newValue = isQuickSeek ? (state.seekingFeedback?.accumulatedValue || 0) + 5 : 5;
    
    updateState({ 
      seekingFeedback: { direction, visible: true, accumulatedValue: newValue } 
    });
    lastSeekTimeRef.current = now;

    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => {
      updateState({ 
        seekingFeedback: { direction, visible: false, accumulatedValue: 0 } 
      });
    }, 800);
  };

  const triggerVolumeFeedback = (volume: number) => {
    updateState({ volumeFeedback: { volume, visible: true } });
    if (volumeFeedbackTimeoutRef.current) clearTimeout(volumeFeedbackTimeoutRef.current);
    volumeFeedbackTimeoutRef.current = setTimeout(() => {
      updateState({ volumeFeedback: { volume, visible: false } });
    }, 800);
  };

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubtitleChange = (lang: string) => {
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].language === lang || (lang === 'auto' && i === 0)) {
          tracks[i].mode = 'showing';
        } else {
          tracks[i].mode = 'hidden';
        }
      }
      updateState({ currentSubtitle: lang });
    }
  };

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Play prevented:", error);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  const handleOnPlay = () => updateState({ isPlaying: true });
  const handleOnPause = () => updateState({ isPlaying: false });

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    if (isNaN(duration) || !isFinite(duration) || duration === 0) return;
    
    const progress = (videoRef.current.currentTime / duration) * 100;
    updateState({
      progress: isNaN(progress) ? 0 : progress,
      currentTime: videoRef.current.currentTime,
    });
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    updateState({ duration: videoRef.current.duration });
  };

  const handleVideoProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const manualChange = Number(e.target.value);
    if (!videoRef.current) return;
    
    const duration = videoRef.current.duration;
    if (isNaN(duration) || !isFinite(duration) || duration === 0) return;

    const newTime = (manualChange / 100) * duration;
    videoRef.current.currentTime = newTime;
    updateState({ progress: manualChange, currentTime: newTime });
  };

  const handleVideoSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      updateState({ playbackSpeed: speed });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      updateState({ isMuted: videoRef.current.muted, volume: videoRef.current.muted ? 0 : 1 });
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      updateState({ isFullscreen: true });
    } else {
      await document.exitFullscreen();
      updateState({ isFullscreen: false });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      updateState({ isFullscreen: !!document.fullscreenElement });
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const showControls = () => {
    updateState({ showControls: true });
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (state.isPlaying && !state.showSettings) {
        updateState({ showControls: false });
      }
    }, 3000);
  };

  const toggleSettings = () => {
    updateState({ showSettings: !state.showSettings });
  };

  const toggleTheater = () => {
    updateState({ isTheaterMode: !state.isTheaterMode });
  };

  const seek = (seconds: number) => {
    if (!videoRef.current) return;
    const direction = seconds > 0 ? 'forward' : 'backward';
    triggerSeekingFeedback(direction);
    videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), videoRef.current.duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement> | number) => {
    const newVolume = typeof e === 'number' ? e : Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      updateState({ volume: newVolume, isMuted: newVolume === 0 });
      triggerVolumeFeedback(newVolume);
    }
  };

  const seekTo = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(Math.max(time, 0), videoRef.current.duration);
  };

  // ... return statement with new functions ...
  return {
    videoRef, containerRef, state, updateState, togglePlay, handleOnPlay, handleOnPause,
    handleTimeUpdate, handleLoadedMetadata, handleVideoProgress, handleVideoSpeed,
    toggleMute, handleVolumeChange, toggleFullscreen, toggleTheater, toggleSettings,
    showControls, seek, seekTo, handleSubtitleChange, toggleFeedback, loadFeedback
  };
};
