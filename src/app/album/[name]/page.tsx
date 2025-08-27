'use client';

import { useSongs, Song } from '@/contexts/SongContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useParams } from 'next/navigation';
import { Play, Music, Plus, Heart, Loader2 } from 'lucide-react';
import SongDuration from '@/components/SongDuration';
import PageInsideSkeleton from '@/components/PageInsideSkeleton';
import Image from 'next/image';

import { useState, useCallback } from 'react';

export default function AlbumPage() {
  const { name } = useParams();
  const { songs, loading } = useSongs();
  const { setQueue, playSong, addToQueue } = usePlayer();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const albumName = typeof name === 'string' ? decodeURIComponent(name) : '';
  const albumSongs: Song[] = songs.filter(song => song.album === albumName);
  const director = albumSongs[0]?.director ?? 'Unknown';

  const handleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>, song: Song) => {
      e.stopPropagation();
      setLoadingIds(prev => [...prev, song.id]);
      try {
        if (isFavorite(song.id)) {
          await removeFromFavorites(song.id);
        } else {
          await addToFavorites(song.id);
        }
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== song.id));
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  const handlePlayAlbum = useCallback(() => {
    setQueue(albumSongs);
    playSong(albumSongs[0], albumSongs);
  }, [albumSongs, setQueue, playSong]);

  if (loading) {
    return <PageInsideSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white mt-15 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Album Header */}
        <div className="flex flex-row sm:items-end gap-6 mb-8">
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600">
            {albumSongs[0]?.album_link ? (
              <Image
                src={albumSongs[0].album_link}
                alt={albumName}
                width={192}
                height={192}
                className="object-cover w-full h-full"
              />
            ) : (
              <Music className="w-16 h-16 sm:w-24 sm:h-24 text-white/70" />
            )}
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-2">Album</p>
            <h1 className="text-xl sm:text-6xl font-bold mb-4">{albumName}</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {director} • {albumSongs.length} songs
            </p>
          </div>
        </div>

        {/* Play Button */}
        <div className="mb-6 mt-10 sm:mt-20">
          <button
            onClick={handlePlayAlbum}
            className="bg-green-500 hover:bg-green-400 text-black px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            Play
          </button>
        </div>

        {/* Song List */}
        <div className="space-y-2">
          {albumSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg hover:bg-gray-800/50 group"
            >
              <span className="text-gray-400 w-5 sm:w-6 text-center text-sm sm:text-base">
                {index + 1}
              </span>

              {/* Song Title + Artist */}
              <div
                className="flex-1 cursor-pointer"
                onClick={() => playSong(song, albumSongs)}
              >
                <h3 className="text-white font-medium text-sm sm:text-base">
                  {song.song_name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">{song.artist}</p>
              </div>

              {/* Genre */}
              <span className="hidden sm:block text-gray-400 text-sm">
                {song.genre ?? 'Unknown'}
              </span>

              {/* Duration */}
              <SongDuration songUrl={song.song_link} />

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleFavorite(e, song)}
                  disabled={loadingIds.includes(song.id)}
                  className={`p-1 sm:p-2 ${isFavorite(song.id)
                    ? 'text-red-500 hover:text-red-400'
                    : 'text-gray-400 hover:text-white'
                    } sm:opacity-0 sm:group-hover:opacity-100`}
                >
                  {loadingIds.includes(song.id) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Heart
                      className={`w-4 h-4 ${isFavorite(song.id) ? 'fill-current' : ''}`}
                    />
                  )}
                </button>
                <button
                  onClick={() => addToQueue(song)}
                  className="text-gray-400 hover:text-white p-1 sm:p-2 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}