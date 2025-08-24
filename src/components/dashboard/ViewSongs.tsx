'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Pause, Disc, Trash2 } from 'lucide-react';

interface Song {
  id: string;
  song_name: string;
  artist: string;
  album: string;
  director: string;
  genre: string;
  song_link: string;
  album_link: string;
  created_at: any;
}

interface ViewSongsProps {
  onViewSong: (songId: string) => void;
}

export default function ViewSongs({ onViewSong }: ViewSongsProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchSongs = async () => {
    if (!user) return;

    try {
      setError('');
      const querySnapshot = await getDocs(collection(db, 'songs'));
      const songsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Song[];
      setSongs(songsData);
    } catch (error: any) {
      console.error('Error fetching songs:', error);
      setError(error.message || 'Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const playSong = (songId: string, songUrl: string) => {
    if (currentlyPlaying === songId) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = songUrl;
        audioRef.current.play();
        setCurrentlyPlaying(songId);
      }
    }
  };

  const deleteSong = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this song?')) return;

    try {
      await deleteDoc(doc(db, 'songs', id));
      setSongs(songs.filter(song => song.id !== id));
    } catch (error: any) {
      console.error('Error deleting song:', error);
      setError(error.message || 'Failed to delete song');
    }
  };

  useEffect(() => {
    if (user) {
      fetchSongs();
    }
  }, [user]);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Song</th>
                <th className="px-4 py-3 text-left">Artist</th>
                <th className="px-4 py-3 text-left">Album</th>
                <th className="px-4 py-3 text-left">Director</th>
                <th className="px-4 py-3 text-left">Era</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-t border-gray-600">
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-700 rounded w-28 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-6 w-6 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-6 w-6 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-6 w-6 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          Error: {error}
        </div>
        <button
          onClick={() => fetchSongs()}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">All Songs</h2>
          <p className="text-gray-400 text-sm mt-1">{songs.length} {songs.length === 1 ? 'song' : 'songs'} found</p>
        </div>
        <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {songs.length}
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="text-center text-gray-400">No songs found. Add some songs first!</div>
      ) : (
        <div className="h-170 overflow-auto bg-gray-800 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">Song</th>
                <th className="px-4 py-3 text-left">Artist</th>
                <th className="px-4 py-3 text-left">Album</th>
                <th className="px-4 py-3 text-left">Director</th>
                <th className="px-4 py-3 text-left">Era</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={song.id} className={`border-t border-gray-600 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}`}>
                  <td className="px-4 py-3 font-medium">{song.song_name}</td>
                  <td className="px-4 py-3 text-gray-300">{song.artist}</td>
                  <td className="px-4 py-3 text-gray-300">{song.album}</td>
                  <td className="px-4 py-3 text-gray-300">{song.director || '-'}</td>
                  <td className="px-4 py-3 text-gray-300">{song.genre}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => playSong(song.id, process.env.NEXT_PUBLIC_SONG_BASE_URL + song.song_link)}
                        className="text-indigo-400 hover:text-indigo-300 p-1 rounded"
                        title={currentlyPlaying === song.id ? "Pause Song" : "Play Song"}
                      >
                        {currentlyPlaying === song.id ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        onClick={() => onViewSong(song.id)}
                        className="text-indigo-400 hover:text-indigo-300 p-1 rounded"
                        title="View Song Details"
                      >
                        <Disc size={16} />
                      </button>
                      <button
                        onClick={() => deleteSong(song.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded"
                        title="Delete Song"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={() => setCurrentlyPlaying(null)}
        onError={() => setCurrentlyPlaying(null)}
      />
    </div>
  );
}