'use client';

import { useSongs } from '@/contexts/SongContext';
import { useParams } from 'next/navigation';
import { Play, Clock, Music } from 'lucide-react';

export default function AlbumPage() {
  const { name } = useParams();
  const { songs, loading } = useSongs();
  
  const albumName = decodeURIComponent(name as string);
  const albumSongs = songs.filter(song => song.album === albumName);
  const director = albumSongs[0]?.director;

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">Loading...</div>;
  }

  console.log(albumSongs)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white mt-15">
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
          <button className="bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-full font-semibold flex items-center gap-2">
            <Play className="w-5 h-5" />
            Play
          </button>
        </div>

        <div className="space-y-2">
          {albumSongs.map((song, index) => (
            <div key={song.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 group">
              <span className="text-gray-400 w-6 text-center">{index + 1}</span>
              <div className="flex-1">
                <h3 className="text-white font-medium">{song.song_name}</h3>
                <p className="text-gray-400 text-sm">{song.artist}</p>
              </div>
              <span className="text-gray-400 text-sm">{song.genre}</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}