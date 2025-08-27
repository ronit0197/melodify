'use client';

import { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, List, X } from 'lucide-react';
import QueueModal from './QueueModal';

export default function MusicPlayer() {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, currentTime, duration, seekTo, volume, setVolume, queue } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
    <>
      {/* Mini Player (always visible) */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 p-3 sm:p-4 z-40">
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

        {/* Layout: mobile (song + play) / desktop (3-col) */}
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: Song Info */}
          <div
            className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 cursor-pointer sm:cursor-default"
            onClick={() => !expanded && setExpanded(true)}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              {currentSong.album_link ? (
                <img
                  src={
                    process.env.NEXT_PUBLIC_SONG_ALBUM_BASE_URL +
                    currentSong.album_link
                  }
                  alt={currentSong.song_name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-white font-medium truncate text-sm sm:text-base">
                {currentSong.song_name}
              </h4>
              <p className="text-gray-400 truncate text-xs sm:text-sm">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* CENTER: Controls (desktop only in center) */}
          <div className="hidden sm:flex items-center justify-center gap-4 flex-1">
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
              className="text-gray-400 hover:text-white transition p-2"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* RIGHT: Volume (desktop only) */}
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-end">
            <Volume2 className="w-5 h-5 text-gray-400" />
            <div
              onClick={handleVolumeChange}
              className="w-28 h-1 bg-gray-600 rounded-full cursor-pointer group"
            >
              <div
                className="h-full bg-white rounded-full transition-all group-hover:bg-green-500"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          {/* MOBILE Controls (inline with song info) */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={prevSong}
              className="text-gray-400 hover:text-white transition p-2"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="bg-white text-black hover:bg-gray-200 transition p-2.5 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
            <button
              onClick={nextSong}
              className="text-gray-400 hover:text-white transition p-2"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Full Player (mobile only) */}
      {expanded && (
        <div className="fixed inset-0 bg-gray-950/95 backdrop-blur-lg z-50 flex flex-col p-4 sm:hidden">
          {/* Header */}
          <div className="flex justify-end">
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-400 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Artwork */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              {currentSong.album_link ? (
                <img
                  src={process.env.NEXT_PUBLIC_SONG_ALBUM_BASE_URL + currentSong.album_link}
                  alt={currentSong.song_name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Music className="w-12 h-12 text-white/70" />
              )}
            </div>
            <h2 className="text-white text-xl font-bold">{currentSong.song_name}</h2>
            <p className="text-gray-400 text-sm mt-3">{currentSong.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
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

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={prevSong}
              className="text-gray-400 hover:text-white transition p-3"
            >
              <SkipBack className="w-7 h-7" />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white text-black hover:bg-gray-200 transition p-4 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>
            <button
              onClick={nextSong}
              className="text-gray-400 hover:text-white transition p-3"
            >
              <SkipForward className="w-7 h-7" />
            </button>
          </div>

          {/* Extra Options */}
          <div className="flex justify-around items-center border-t border-gray-700 pt-4">
            <button
              onClick={() => setShowQueue(true)}
              className="text-gray-400 hover:text-white"
            >
              <List className="w-6 h-6" />
            </button>
            <div
              onClick={handleVolumeChange}
              className="w-28 h-1 bg-gray-600 rounded-full cursor-pointer group"
            >
              <div
                className="h-full bg-white rounded-full transition-all group-hover:bg-green-500"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            <Volume2 className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      )}

      {/* Queue Modal */}
      <QueueModal isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </>
  );
}