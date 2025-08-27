'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';

interface Song {
  id: string;
  song_name: string;
  artist: string;
  album: string;
  director: string;
  genre: string;
  song_link: string;
  album_link: string;
  created_at: { toDate?: () => Date } | null;
}

interface SongDetailsProps {
  songId: string;
  onBack: () => void;
}

export default function SongDetails({ songId, onBack }: SongDetailsProps) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const songDoc = await getDoc(doc(db, 'songs', songId));
        if (songDoc.exists()) {
          setSong({ id: songDoc.id, ...songDoc.data() } as Song);
        } else {
          setError('Song not found');
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch song';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [songId]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <div className="h-8 w-8 bg-gray-700 rounded animate-pulse mr-4"></div>
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="h-6 bg-gray-700 rounded w-64 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div>
        <button onClick={onBack} className="flex items-center text-indigo-400 hover:text-indigo-300 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Songs
        </button>
        <div className="bg-red-600 text-white p-4 rounded">
          {error || 'Song not found'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center text-indigo-400 hover:text-indigo-300 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Songs
      </button>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">{song.song_name}</h2>
        
        <div className="flex gap-6">
          {song.album_link && (
            <OptimizedImage
              src={process.env.NEXT_PUBLIC_SONG_ALBUM_BASE_URL + song.album_link}
              alt={song.album}
              className="w-48 h-48 rounded-lg object-cover"
              width={192}
              height={192}
            />
          )}
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Artist</label>
                <p className="text-white text-lg">{song.artist}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Album</label>
                <p className="text-white text-lg">{song.album}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Director</label>
                <p className="text-white text-lg">{song.director || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Genre</label>
                <p className="text-white text-lg">{song.genre}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Added On</label>
                <p className="text-white text-lg">
                  {song.created_at?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={process.env.NEXT_PUBLIC_SONG_BASE_URL + song.song_link}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
    </div>
  );
}