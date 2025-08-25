'use client';

import { useState, useEffect } from 'react';

interface SongDurationProps {
  songUrl: string;
}

export default function SongDuration({ songUrl }: SongDurationProps) {
  const [duration, setDuration] = useState<string>('--:--');

  useEffect(() => {
    const audio = new Audio();
    
    const handleLoadedMetadata = () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.src = process.env.NEXT_PUBLIC_SONG_BASE_URL + songUrl;

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [songUrl]);

  return <span className="text-gray-400 text-sm">{duration}</span>;
}