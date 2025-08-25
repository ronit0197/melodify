'use client';

import { Song } from '@/contexts/SongContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { Play, Music, Plus } from 'lucide-react';

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const { playSong, addToQueue } = usePlayer();
  const artists = song.artist.split(',').map(artist => artist.trim());
  
  const handlePlay = () => {
    playSong(song);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
  };

  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50 hover:border-indigo-500/50">
      <div className="relative mb-4">
        <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          {song.album_link ? (
            <img 
              src={process.env.NEXT_PUBLIC_SONG_ALBUM_BASE_URL + song.album_link} 
              alt={song.song_name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Music className="w-12 h-12 text-white/70" />
          )}
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
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
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-white truncate">{song.song_name}</h3>
        <p className="text-sm text-gray-400 truncate">{song.album}</p>
        
        <div className="flex flex-wrap gap-1">
          {artists.map((artist, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
            >
              {artist}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{song.director}</span>
          <span>{song.genre}</span>
        </div>
      </div>
    </div>
  );
}