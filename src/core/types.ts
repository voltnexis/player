export interface VoltNexisPlayerProps {
  src?: string;
  auto?: string;
  title?: string;
  theme?: 'dark' | 'light';
  primaryColor?: string;
  progressColor?: string;
  qualities?: Record<string, string>;
  previewVtt?: string;
  subtitleVtt?: string;
  subtitles?: { label: string, src: string, lang: string, default?: boolean }[];
  shareUrl?: string;
  hide?: string[];
  
  // Callbacks
  onLike?: () => void;
  onDislike?: () => void;
  onShare?: () => void;
  onChat?: (ctx?: { like?: () => void, dislike?: () => void, share?: () => void }) => void;
  onComment?: (ctx?: { like?: () => void, dislike?: () => void, share?: () => void }) => void;
  onOpenMenu?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  clicktitle?: string;
  width?: string | number;
  height?: string | number;
}

export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number; // 0 to 100
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  isFullscreen: boolean;
  isTheaterMode: boolean;
  showSettings: boolean;
  showControls: boolean;
  isBuffering: boolean;
  currentQuality: string;
  currentSubtitle: string; // 'off', 'auto' or lang code
  seekingFeedback?: { direction: 'forward' | 'backward'; visible: boolean; accumulatedValue: number };
  volumeFeedback?: { volume: number; visible: boolean };
  isLiked: boolean;
  isDisliked: boolean;
  isCommentActive: boolean;
  isChatActive: boolean;
}
