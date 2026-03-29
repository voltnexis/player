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
  });

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateState = (updates: Partial<PlayerState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

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

  const seek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), videoRef.current.duration);
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      updateState({ volume: newVolume, isMuted: newVolume === 0 });
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

  return {
    videoRef,
    containerRef,
    state,
    updateState,
    togglePlay,
    handleOnPlay,
    handleOnPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    handleVolumeChange,
    toggleFullscreen,
    toggleTheater,
    toggleSettings,
    showControls,
    seek,
    handleSubtitleChange
  };
};
