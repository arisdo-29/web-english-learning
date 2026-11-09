import React, { useState } from 'react';
import { speak } from '../services/tts';
import { useApp } from '../context/AppContext';
import { Icons } from './Icons';

export default function AudioPlayer({ text, slow = false, size = 'md', className = '' }) {
  const { settings } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (!text) return;
    
    setIsPlaying(true);
    const rate = slow ? 0.7 : (settings.rate || 1.0);
    speak(text, {
      voiceName: settings.voice,
      rate,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }[size] || 'w-8 h-8';

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size] || 'w-4 h-4';

  return (
    <button
      type="button"
      onClick={handlePlay}
      title={slow ? "Nghe chậm (0.7x)" : "Phát âm"}
      className={`inline-flex items-center justify-center rounded-xl border border-border bg-card hover:bg-secondary text-foreground transition-all active:scale-95 ${
        isPlaying ? 'ring-2 ring-primary/30 bg-primary/10 text-primary' : ''
      } ${sizeClasses} ${className}`}
    >
      {slow ? (
        <Icons.VolumeSlow className={iconSizes} />
      ) : (
        <Icons.Volume className={iconSizes} />
      )}
    </button>
  );
}
