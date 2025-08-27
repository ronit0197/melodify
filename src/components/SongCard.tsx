'use client';

import { Song } from '@/contexts/SongContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Play, Music, Plus, Heart, Loader2, MoreVertical } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

import { useState } from 'react';

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const { playSong, addToQueue } = usePlayer();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [favLoading, setFavLoading] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  const handlePlay = () => {
    playSong(song);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    setShowMobileActions(false);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavLoading(true);
    try {
      if (isFavorite(song.id)) {
        await removeFromFavorites(song.id);
      } else {
        await addToFavorites(song.id);
      }
    } finally {
      setFavLoading(false);
      setShowMobileActions(false);
    }
  };

  return (
    <div
      onClick={() => handlePlay()}
      className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50 hover:border-indigo-500/50 cursor-pointer"
    >
      <div className="relative mb-3 sm:mb-4">
        {/* Album Art */}
        <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          {song.album_link ? (
            <OptimizedImage
              src={process.env.NEXT_PUBLIC_SONG_ALBUM_BASE_URL + song.album_link}
              alt={song.song_name}
              className="w-full h-full object-cover rounded-lg"
              fill
            />
          ) : (
            <Music className="w-10 h-10 sm:w-12 sm:h-12 text-white/70" />
          )}
        </div>

        {/* Desktop Hover Controls */}
        <div
          className="
            absolute bottom-2 right-2 gap-2 hidden md:flex
            opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
            transition-all duration-300
          "
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleFavorite}
            disabled={favLoading}
            className={`p-2 rounded-full ${isFavorite(song.id) ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
          >
            {favLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 ${isFavorite(song.id) ? 'fill-current' : ''}`} />
            )}
          </button>
          <button
            onClick={handleAddToQueue}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handlePlay}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full"
          >
            <Play className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* Mobile 3 Dots Menu */}
        <div
          className="absolute top-2 right-2 flex md:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setShowMobileActions((prev) => !prev);
          }}
        >
          <button className="bg-gray-700/80 hover:bg-gray-600 text-white p-2 rounded-full">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Actions Dropdown */}
        {showMobileActions && (
          <div
            className="absolute top-10 right-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 flex flex-col gap-2 z-10 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleFavorite}
              disabled={favLoading}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${isFavorite(song.id) ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              {favLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
              {isFavorite(song.id) ? 'Remove Favorite' : 'Add Favorite'}
            </button>
            <button
              onClick={handleAddToQueue}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
            >
              <Plus className="w-4 h-4" />
              Add to Queue
            </button>
          </div>
        )}
      </div>

      {/* Song Details */}
      <div className="space-y-1.5 sm:space-y-2">
        <h3 className="font-semibold text-white text-sm sm:text-base truncate">
          {song.song_name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 truncate">{song.album}</p>

        {/* Artists (hidden on mobile) */}
        <div className="hidden sm:flex flex-wrap gap-1">
          {song.artist.split(',').map((artist, index) => (
            <span
              key={index}
              className="text-[10px] sm:text-xs bg-gray-700/50 text-gray-300 px-2 py-0.5 sm:py-1 rounded-full"
            >
              {artist.trim()}
            </span>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500">
          <span className="truncate">{song.director}</span>
          <span className="truncate">{song.genre}</span>
        </div>
      </div>
    </div>
  );
}