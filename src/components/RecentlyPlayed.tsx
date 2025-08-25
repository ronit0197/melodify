'use client';

import { useState, useEffect } from 'react';
import { useSongs } from '@/contexts/SongContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { getRecentlyPlayed } from '@/utils/recentlyPlayed';
import { Play, Music } from 'lucide-react';

export default function RecentlyPlayed() {
  const { songs } = useSongs();
  const { playSong } = usePlayer();
  const [recentSongs, setRecentSongs] = useState<any[]>([]);

  useEffect(() => {
    const recentIds = getRecentlyPlayed();
    const recent = recentIds.map(id => songs.find(song => song.id === id)).filter(Boolean);
    setRecentSongs(recent);
  }, [songs]);

  if (recentSongs.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
      <div className="grid grid-cols-3 gap-4">
        {recentSongs.map((song) => (
          <div
            key={song.id}
            onClick={() => playSong(song, songs)}
            className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{song.song_name}</h3>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>
              <Play className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}