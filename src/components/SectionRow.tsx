'use client';

import { Song } from '@/contexts/SongContext';
import SongCard from './SongCard';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SectionRowProps {
  title: string;
  songs: Song[];
}

export default function SectionRow({ title, songs }: SectionRowProps) {
  const [showAll, setShowAll] = useState(false);
  const displaySongs = showAll ? songs : songs.slice(0, 6);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        {songs.length > 5 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="flex items-center text-gray-400 hover:text-white transition text-sm sm:text-base"
          >
            {showAll ? 'Show less' : 'Show all'}
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displaySongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}