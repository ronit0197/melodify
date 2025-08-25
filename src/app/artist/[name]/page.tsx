'use client';

import { useSongs } from '@/contexts/SongContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { useParams } from 'next/navigation';
import { Play } from 'lucide-react';
import SongDuration from '@/components/SongDuration';

export default function ArtistPage() {
  const { name } = useParams();
  const { songs, loading } = useSongs();
  const { setQueue, playSong } = usePlayer();
  
  const artistName = decodeURIComponent(name as string);
  const artistSongs = songs.filter(song => 
    song.artist.split(',').map(a => a.trim()).includes(artistName)
  );

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">Loading...</div>;
  }

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
              onClick={() => playSong(song, artistSongs)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 group cursor-pointer"
            >
              <span className="text-gray-400 w-6 text-center">{index + 1}</span>
              <div className="flex-1">
                <h3 className="text-white font-medium">{song.song_name}</h3>
                <p className="text-gray-400 text-sm">{song.album}</p>
              </div>
              <span className="text-gray-400 text-sm">{song.genre}</span>
              <SongDuration songUrl={song.song_link} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}