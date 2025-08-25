'use client';

import { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, List } from 'lucide-react';
import QueueModal from './QueueModal';

export default function MusicPlayer() {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, currentTime, duration, seekTo, volume, setVolume, queue } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };
  
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, percent)));
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 p-4 z-40">
      <div className="mx-auto">
        {/* Progress Bar */}
        <div className="mb-3">
          <div
            onClick={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer group"
          >
            <div
              className="h-full bg-white rounded-full transition-all group-hover:bg-green-500"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              {currentSong.album_link ? (
                <img
                  src={process.env.NEXT_PUBLIC_SONG_ALBUM_BASE_URL + currentSong.album_link}
                  alt={currentSong.song_name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Music className="w-6 h-6 text-white/70" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-white font-medium truncate">{currentSong.song_name}</h4>
              <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevSong}
              className="text-gray-400 hover:text-white transition p-2"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="bg-white text-black hover:bg-gray-200 transition p-3 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextSong}
              className="text-gray-400 hover:text-white transition p-2"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowQueue(true)}
              className="text-gray-400 hover:text-white transition p-2 relative"
            >
              <List className="w-5 h-5" />
              {queue.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {queue.length}
                </span>
              )}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex-1 flex justify-end items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <div 
              onClick={handleVolumeChange}
              className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer group"
            >
              <div 
                className="h-full bg-white rounded-full transition-all group-hover:bg-green-500"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <QueueModal isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </div>
  );
}