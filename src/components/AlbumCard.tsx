'use client';

import { Music } from 'lucide-react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';

interface AlbumCardProps {
  album: string;
  songCount: number;
  director?: string;
  album_link?: Array<{ album_link: string; album: string }>;
}

export default function AlbumCard({ album, songCount, director, album_link }: AlbumCardProps) {
  return (
    <Link href={`/album/${encodeURIComponent(album)}`}>
      <div className="group flex-shrink-0 w-32 sm:w-40 md:w-48 p-3 sm:p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 cursor-pointer">
        <div className="aspect-square mb-3 sm:mb-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
          {album_link && album_link[0]?.album_link ? (
            <OptimizedImage
              src={process.env.NEXT_PUBLIC_SONG_ALBUM_BASE_URL + album_link[0].album_link}
              alt={album_link[0].album}
              className="w-full h-full object-cover rounded-lg"
              fill
            />
          ) : (
            <Music className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/70" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-white truncate mb-1 text-sm sm:text-base md:text-lg">
            {album}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 truncate">{director}</p>
          <p className="text-[10px] sm:text-xs text-gray-500">{songCount} songs</p>
        </div>
      </div>
    </Link>
  );
}