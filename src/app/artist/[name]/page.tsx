'use client';

import { useSongs } from '@/contexts/SongContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useParams } from 'next/navigation';
import { Play, Plus, Heart, Loader2 } from 'lucide-react';
import SongDuration from '@/components/SongDuration';

import { useState } from 'react';
import PageInsideSkeleton from '@/components/PageInsideSkeleton';

export default function ArtistPage() {
  const { name } = useParams();
  const { songs, loading } = useSongs();
  const { setQueue, playSong, addToQueue } = usePlayer();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [loadingId, setLoadingId] = useState(false);

  const artistName = decodeURIComponent(name as string);
  const artistSongs = songs.filter(song =>
    song.artist.split(',').map(a => a.trim()).includes(artistName)
  );

  if (loading) {
    return <PageInsideSkeleton />;
  }

  const handleFavorite = async (e: React.MouseEvent, song: any) => {
    e.stopPropagation();
    setLoadingId(true);
    try {
      if (isFavorite(song.id)) {
        await removeFromFavorites(song.id);
      } else {
        await addToFavorites(song.id);
      }
    } finally {
      setLoadingId(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white mt-15 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Artist Header */}
        <div className="flex flex-row sm:items-end gap-5 mb-8">
          <div className="w-30 h-30 sm:w-48 sm:h-48 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-4xl sm:text-6xl font-bold text-white">
              {artistName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-2">Artist</p>
            <h1 className="text-xl sm:text-6xl font-bold mb-4">{artistName}</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {artistSongs.length} songs
            </p>
          </div>
        </div>

        {/* Play Button */}
        <div className="mb-6 mt-10 sm:mt-20">
          <button
            onClick={() => {
              setQueue(artistSongs);
              playSong(artistSongs[0], artistSongs);
            }}
            className="bg-green-500 hover:bg-green-400 text-black px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            Play
          </button>
        </div>

        {/* Songs List */}
        <div className="space-y-2">
          {artistSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-800/50 group"
            >
              {/* Index */}
              <span className="text-gray-400 w-5 sm:w-6 text-xs sm:text-base text-center">
                {index + 1}
              </span>

              {/* Song Info */}
              <div
                className="flex-1 cursor-pointer"
                onClick={() => playSong(song, artistSongs)}
              >
                <h3 className="text-white font-medium text-sm sm:text-base">
                  {song.song_name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">{song.album}</p>
              </div>

              {/* Genre */}
              <span className="hidden sm:inline text-gray-400 text-sm">
                {song.genre}
              </span>

              {/* Duration */}
              <SongDuration songUrl={song.song_link} />

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={(e) => handleFavorite(e, song)}
                  disabled={loadingId}
                  className={`${isFavorite(song.id)
                    ? 'text-red-500 hover:text-red-400'
                    : 'text-gray-400 hover:text-white'
                    } 
                p-2 sm:opacity-0 sm:group-hover:opacity-100`}
                >
                  {loadingId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Heart
                      className={`w-4 h-4 ${isFavorite(song.id) ? 'fill-current' : ''
                        }`}
                    />
                  )}
                </button>
                <button
                  onClick={() => addToQueue(song)}
                  className="text-gray-400 hover:text-white p-2 sm:opacity-0 sm:group-hover:opacity-100"
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