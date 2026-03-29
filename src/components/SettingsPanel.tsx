import React from 'react';
import { PlayerState } from '../core/types';
import { Settings, X } from 'lucide-react';

interface SettingsPanelProps {
  state: PlayerState;
  handleVideoSpeed: (speed: number) => void;
  toggleSettings: () => void;
  qualities?: Record<string, string>;
  handleQualityChange: (quality: string, url: string) => void;
  subtitles?: { label: string, src: string, lang: string }[];
  handleSubtitleChange: (lang: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  state, handleVideoSpeed, toggleSettings, qualities = {}, handleQualityChange,
  subtitles = [], handleSubtitleChange
}) => {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (!state.showSettings) return null;

  return (
    <div className="absolute right-4 bottom-20 w-64 bg-zinc-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-zinc-800 p-4 text-white font-sans transition-all z-50">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-700/50">
        <h3 className="font-semibold flex items-center gap-2"><Settings size={16} /> Settings</h3>
        <button onClick={toggleSettings} className="p-1 hover:bg-white/10 rounded-full transition"><X size={16} /></button>
      </div>

      <div className="space-y-4">
        {/* Playback Speed */}
        <div>
          <label className="text-xs text-zinc-400 mb-2 block uppercase tracking-wider">Playback Speed</label>
          <div className="flex flex-wrap gap-2">
            {speeds.map(speed => (
              <button
                key={speed}
                onClick={() => handleVideoSpeed(speed)}
                className={`px-3 py-1 rounded text-sm transition ${state.playbackSpeed === speed ? 'bg-(--color-primary) text-black font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {speed === 1 ? 'Normal' : `${speed}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        {Object.keys(qualities).length > 0 && (
          <div>
            <label className="text-xs text-zinc-400 mb-2 block uppercase tracking-wider">Quality</label>
            <div className="flex flex-wrap gap-2 text-sm">
              <button 
                onClick={() => handleQualityChange('Auto', '')}
                className={`px-3 py-1 rounded transition ${state.currentQuality === 'Auto' ? 'bg-(--color-primary) text-black font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
              >
                Auto
              </button>
              {Object.entries(qualities).map(([label, url]) => (
                <button
                  key={label}
                  onClick={() => handleQualityChange(label, url)}
                  className={`px-3 py-1 rounded transition ${state.currentQuality === label ? 'bg-(--color-primary) text-black font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {label.includes('p') ? label : `${label}p`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subtitles */}
        <div>
          <label className="text-xs text-zinc-400 mb-2 block uppercase tracking-wider">Subtitles</label>
          <div className="flex flex-wrap gap-2 text-sm">
            <button 
              onClick={() => handleSubtitleChange('off')}
              className={`px-3 py-1 rounded transition ${state.currentSubtitle === 'off' ? 'bg-(--color-primary) text-black font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
            >
              Off
            </button>
            {subtitles.map((track) => (
              <button
                key={track.lang}
                onClick={() => handleSubtitleChange(track.lang)}
                className={`px-3 py-1 rounded transition ${state.currentSubtitle === track.lang ? 'bg-(--color-primary) text-black font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {track.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Sleep Timer</span>
          <button className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Off</button>
        </div>
      </div>
    </div>
  );
};
