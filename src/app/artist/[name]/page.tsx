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
        <div className="flex items-end gap-6 mb-8">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-6xl font-bold text-white">{artistName.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Artist</p>
            <h1 className="text-6xl font-bold mb-4">{artistName}</h1>
            <p className="text-gray-400">{artistSongs.length} songs</p>
          </div>
        </div>

        <div className="mb-6 mt-20">
          <button
            onClick={() => {
              setQueue(artistSongs);
              playSong(artistSongs[0], artistSongs);
            }}
            className="bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-full font-semibold flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Play
          </button>
        </div>

        <div className="space-y-2">
          {artistSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 group"
            >
              <span className="text-gray-400 w-6 text-center">{index + 1}</span>
              <div className="flex-1 cursor-pointer" onClick={() => playSong(song, artistSongs)}>
                <h3 className="text-white font-medium">{song.song_name}</h3>
                <p className="text-gray-400 text-sm">{song.album}</p>
              </div>
              <span className="text-gray-400 text-sm">{song.genre}</span>
              <SongDuration songUrl={song.song_link} />
              <button
                onClick={(e) => handleFavorite(e, song)}
                disabled={loadingId}
                className={`opacity-0 group-hover:opacity-100 p-2 ${isFavorite(song.id) ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'}`}
              >
                {loadingId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className={`w-4 h-4 ${isFavorite(song.id) ? 'fill-current' : ''}`} />
                )}
              </button>
              <button
                onClick={() => addToQueue(song)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-2"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}