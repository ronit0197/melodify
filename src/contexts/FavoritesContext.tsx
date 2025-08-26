'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (songId: string) => void;
  removeFromFavorites: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addToFavorites: () => { },
  removeFromFavorites: () => { },
  isFavorite: () => false,
  loading: false,
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const docRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFavorites(docSnap.data().songs || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (songId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      const docRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          songs: arrayUnion(songId)
        });
      } else {
        await setDoc(docRef, {
          songs: [songId]
        });
      }

      setFavorites(prev => [...prev, songId]);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (songId: string) => {
    if (!user) return;

    try {
      const docRef = doc(db, 'favorites', user.uid);
      await updateDoc(docRef, {
        songs: arrayRemove(songId)
      });

      setFavorites(prev => prev.filter(id => id !== songId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const isFavorite = (songId: string) => favorites.includes(songId);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      loading,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};