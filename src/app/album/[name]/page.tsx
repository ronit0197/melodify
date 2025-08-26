'use client';

import { useSongs } from '@/contexts/SongContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useParams } from 'next/navigation';
import { Play, Music, Plus, Heart, Loader2 } from 'lucide-react';
import SongDuration from '@/components/SongDuration';

import { useState } from 'react';
import PageInsideSkeleton from '@/components/PageInsideSkeleton';

export default function AlbumPage() {
  const { name } = useParams();
  const { songs, loading } = useSongs();
  const { setQueue, playSong, addToQueue } = usePlayer();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [loadingId, setLoadingId] = useState(false);

  const albumName = decodeURIComponent(name as string);
  const albumSongs = songs.filter(song => song.album === albumName);
  const director = albumSongs[0]?.director;

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
          <div className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Music className="w-24 h-24 text-white/70" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Album</p>
            <h1 className="text-6xl font-bold mb-4">{albumName}</h1>
            <p className="text-gray-400">{director} • {albumSongs.length} songs</p>
          </div>
        </div>

        <div className="mb-6 mt-20">
          <button
            onClick={() => {
              setQueue(albumSongs);
              playSong(albumSongs[0], albumSongs);
            }}
            className="bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-full font-semibold flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Play
          </button>
        </div>

        <div className="space-y-2">
          {albumSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 group"
            >
              <span className="text-gray-400 w-6 text-center">{index + 1}</span>
              <div className="flex-1 cursor-pointer" onClick={() => playSong(song, albumSongs)}>
                <h3 className="text-white font-medium">{song.song_name}</h3>
                <p className="text-gray-400 text-sm">{song.artist}</p>
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