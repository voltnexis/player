import React, { forwardRef } from 'react';
import { VoltNexisPlayerProps } from '../core/types';

interface VideoElementProps extends VoltNexisPlayerProps {
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onClick?: () => void;
}

export const VideoElement = forwardRef<HTMLVideoElement, VideoElementProps>((props, ref) => {
  const videoSrc = props.src || props.auto;

  return (
    <video
      ref={ref}
      src={videoSrc}
      className="w-full h-full object-contain bg-black"
      onPlay={props.onPlay}
      onPause={props.onPause}
      onTimeUpdate={props.onTimeUpdate}
      onLoadedMetadata={props.onLoadedMetadata}
      onClick={props.onClick}
      playsInline
    >
      {props.subtitleVtt && (
        <track 
          kind="subtitles" 
          src={props.subtitleVtt} 
          srcLang="en" 
          label="English" 
          default 
        />
      )}
      {props.subtitles?.map((track, index) => (
        <track
          key={`${track.lang}-${index}`}
          kind="subtitles"
          src={track.src}
          srcLang={track.lang}
          label={track.label}
          default={track.default}
        />
      ))}
    </video>
  );
});

VideoElement.displayName = 'VideoElement';
