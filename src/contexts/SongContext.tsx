'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Song {
  id: string;
  song_name: string;
  album: string;
  album_link: string;
  director: string;
  genre: string;
  artist: string;
  song_link: string;
  duration?: string;
  created_at: any;
  created_by: string;
}

interface SongContextType {
  songs: Song[];
  loading: boolean;
  fetchSongs: () => Promise<void>;
}

const SongContext = createContext<SongContextType>({
  songs: [],
  loading: true,
  fetchSongs: async () => {},
});

export const useSongs = () => useContext(SongContext);

export const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const songsCollection = collection(db, 'songs');
      const songsSnapshot = await getDocs(songsCollection);
      const songsData = songsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Song[];
      setSongs(songsData);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <SongContext.Provider value={{ songs, loading, fetchSongs }}>
      {children}
    </SongContext.Provider>
  );
};