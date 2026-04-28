import React, { useState } from 'react';
import { PlayerState } from '../core/types';
import { Settings, X, ChevronRight, ChevronLeft, Subtitles, Gauge, Monitor, Moon } from 'lucide-react';

interface SettingsPanelProps {
  state: PlayerState;
  handleVideoSpeed: (speed: number) => void;
  toggleSettings: () => void;
  qualities?: Record<string, string>;
  handleQualityChange: (quality: string, url: string) => void;
  subtitles?: { label: string, src: string, lang: string }[];
  handleSubtitleChange: (lang: string) => void;
  isMobile?: boolean;
}

type MenuType = 'main' | 'speed' | 'quality' | 'subtitles';

export const SettingsPanel: React.FC<SettingsPanelProps> = React.memo(({ 
  state, handleVideoSpeed, toggleSettings, qualities = {}, handleQualityChange,
  subtitles = [], handleSubtitleChange, isMobile
}) => {
  const [currentMenu, setCurrentMenu] = useState<MenuType>('main');

  if (!state.showSettings) return null;

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const iconSize = isMobile ? 16 : 19;
  const headerPadding = isMobile ? "pt-2 pb-2" : "pt-3 pb-3";
  const itemPadding = isMobile ? "py-2 px-3" : "py-3.5 px-3";
  const labelText = isMobile ? "text-[11px]" : "text-[13px]";
  const valueText = isMobile ? "text-[10px]" : "text-xs";
  const subLabelText = isMobile ? "text-[8px]" : "text-[9px]";

  const MenuItem = ({ icon: Icon, label, value, onClick }: any) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between ${itemPadding} hover:bg-white/10 active:bg-white/15 rounded-xl transition-all group`}
    >
      <div className="flex items-center gap-3">
        <div className="text-zinc-400 group-hover:text-(--color-primary) transition-colors">
          <Icon size={iconSize} strokeWidth={2.5} />
        </div>
        <span className={`${labelText} font-semibold tracking-tight`}>{label}</span>
      </div>
      <div className={`flex items-center gap-1.5 ${valueText}`}>
        <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">{value}</span>
        <ChevronRight size={isMobile ? 14 : 15} className="text-zinc-500" />
      </div>
    </button>
  );

  const SubMenuItem = ({ label, isSelected, onClick, subtext }: any) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between ${itemPadding} rounded-xl transition-all ${isSelected ? 'bg-(--color-primary)/15 text-(--color-primary)' : 'hover:bg-white/10 active:bg-white/15'}`}
    >
      <div className="flex flex-col items-start">
        <span className={`${labelText} font-semibold tracking-tight`}>{label}</span>
        {subtext && <span className={`${subLabelText} font-bold opacity-60 uppercase tracking-wider mt-0.5`}>{subtext}</span>}
      </div>
      {isSelected && (
        <div className={`flex items-center justify-center ${isMobile ? 'w-4 h-4' : 'w-5 h-5'} rounded-full bg-(--color-primary)/20`}>
          <div className="w-1.5 h-1.5 rounded-full bg-(--color-primary) shadow-[0_0_10px_var(--color-primary)]"></div>
        </div>
      )}
    </button>
  );

  const renderMainMenu = () => (
    <div className="space-y-0.5 mt-1 transition-opacity duration-200">
      <MenuItem 
        icon={Subtitles} 
        label="Captions" 
        value={state.currentSubtitle === 'off' ? 'Off' : subtitles.find(s => s.lang === state.currentSubtitle)?.label || 'On'} 
        onClick={() => setCurrentMenu('subtitles')} 
      />
      <MenuItem 
        icon={Gauge} 
        label="Playback speed" 
        value={state.playbackSpeed === 1 ? 'Normal' : `${state.playbackSpeed}x`} 
        onClick={() => setCurrentMenu('speed')} 
      />
      <MenuItem 
        icon={Monitor} 
        label="Quality" 
        value={state.currentQuality === 'Auto' ? 'Auto' : state.currentQuality} 
        onClick={() => setCurrentMenu('quality')} 
      />
      <MenuItem 
        icon={Moon} 
        label="Sleep timer" 
        value="Off" 
        onClick={() => {}} 
      />
    </div>
  );

  const renderSpeedMenu = () => (
    <div className="space-y-0.5 mt-1">
      {speeds.map(speed => (
        <SubMenuItem 
          key={speed}
          label={speed === 1 ? 'Normal' : `${speed}x`}
          isSelected={state.playbackSpeed === speed}
          onClick={() => {
            handleVideoSpeed(speed);
            setCurrentMenu('main');
          }}
        />
      ))}
    </div>
  );

  const renderQualityMenu = () => (
    <div className="space-y-0.5 mt-1">
      <SubMenuItem 
        label="Auto"
        isSelected={state.currentQuality === 'Auto'}
        onClick={() => {
          handleQualityChange('Auto', '');
          setCurrentMenu('main');
        }}
      />
      {Object.entries(qualities).map(([label, url]) => (
        <SubMenuItem 
          key={label}
          label={label.includes('p') ? label : `${label}p`}
          subtext={parseInt(label) >= 1080 ? 'HD' : ''}
          isSelected={state.currentQuality === label}
          onClick={() => {
            handleQualityChange(label, url);
            setCurrentMenu('main');
          }}
        />
      ))}
    </div>
  );

  const renderSubtitlesMenu = () => (
    <div className="space-y-0.5 mt-1">
      <SubMenuItem 
        label="Off"
        isSelected={state.currentSubtitle === 'off'}
        onClick={() => {
          handleSubtitleChange('off');
          setCurrentMenu('main');
        }}
      />
      {subtitles.map((track) => (
        <SubMenuItem 
          key={track.lang}
          label={track.label}
          isSelected={state.currentSubtitle === track.lang}
          onClick={() => {
            handleSubtitleChange(track.lang);
            setCurrentMenu('main');
          }}
        />
      ))}
    </div>
  );

  const containerClasses = isMobile 
    ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[280px]" 
    : "absolute right-4 bottom-[90px] w-72";

  return (
    <>
      <div 
        className="absolute inset-0 z-40" 
        onClick={(e) => {
          e.stopPropagation();
          toggleSettings();
        }}
      />
      <div className={`${containerClasses} max-h-[85%] overflow-y-auto bg-zinc-950/95 backdrop-blur-3xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 p-2 text-white font-sans z-50 transition-all duration-300 scrollbar-hide`}>
      <div className={`flex items-center gap-2 px-3 ${headerPadding} sticky top-0 bg-transparent backdrop-blur-md z-10`}>
        {currentMenu !== 'main' && (
          <button 
            onClick={() => setCurrentMenu('main')}
            className="p-1.5 -ml-1 hover:bg-white/10 rounded-full transition-colors active:scale-90"
          >
            <ChevronLeft size={isMobile ? 18 : 20} strokeWidth={2.5} />
          </button>
        )}
        <h3 className={`${isMobile ? 'text-[12px]' : 'text-[14px]'} font-bold tracking-tight`}>
          {currentMenu === 'main' ? 'Settings' : 
           currentMenu === 'speed' ? 'Playback speed' : 
           currentMenu === 'quality' ? 'Quality' : 'Captions'}
        </h3>
        <button 
          onClick={toggleSettings} 
          className="ml-auto p-1.5 -mr-1 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-all active:scale-90"
        >
          <X size={iconSize} strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-1 pb-2">
        {currentMenu === 'main' && renderMainMenu()}
        {currentMenu === 'speed' && renderSpeedMenu()}
        {currentMenu === 'quality' && renderQualityMenu()}
        {currentMenu === 'subtitles' && renderSubtitlesMenu()}
      </div>
    </div>
    </>
  );
}, (prev, next) => {
  return prev.state.showSettings === next.state.showSettings &&
         prev.state.playbackSpeed === next.state.playbackSpeed &&
         prev.state.currentQuality === next.state.currentQuality &&
         prev.state.currentSubtitle === next.state.currentSubtitle &&
         prev.isMobile === next.isMobile;
});
