'use client';

import { User } from 'lucide-react';
import Link from 'next/link';

interface ArtistCardProps {
  artist: string;
  songCount: number;
}

export default function ArtistCard({ artist, songCount }: ArtistCardProps) {
  return (
    <Link href={`/artist/${encodeURIComponent(artist)}`}>
      <div className="group flex-shrink-0 w-28 sm:w-32 md:w-40 p-3 sm:p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 cursor-pointer">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white/80" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-white truncate mb-1 text-sm sm:text-base md:text-lg">
            {artist}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400">{songCount} songs</p>
        </div>
      </div>
    </Link>
  );
}