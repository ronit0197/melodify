'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useSongs } from '@/contexts/SongContext';

interface AddSongsProps {
  onSongAdded?: () => void;
}

export default function AddSongs({ onSongAdded }: AddSongsProps) {
  const [formData, setFormData] = useState({
    song_name: '',
    artist: '',
    album: '',
    director: '',
    genre: '',
    song_link: '',
    album_link: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { fetchSongs } = useSongs();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage('You must be logged in to add songs.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'songs'), {
        ...formData,
        created_at: new Date(),
        created_by: user.uid
      });
      setMessage('Song added successfully!');
      setFormData({
        song_name: '',
        artist: '',
        album: '',
        director: '',
        genre: '',
        song_link: '',
        album_link: ''
      });
      await fetchSongs();
      setTimeout(() => {
        onSongAdded?.();
      }, 1000);
    } catch (error: unknown) {
      console.error('Error adding song:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add song. Please try again.';
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Song</h2>
      
      {message && (
        <div className={`p-4 rounded mb-4 ${message.includes('Error') ? 'bg-red-600' : 'bg-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Song Name</label>
          <input
            type="text"
            name="song_name"
            value={formData.song_name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Artist</label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Album</label>
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Director</label>
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Era</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-indigo-500"
          >
            <option value="">Select Era</option>
            <option value="80s">80s</option>
            <option value="90s">90s</option>
            <option value="2000s">2000s</option>
            <option value="2010s">2010s</option>
            <option value="2020s">2020s</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Song Link</label>
          <input
            type="text"
            name="song_link"
            value={formData.song_link}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-indigo-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Album Link</label>
          <input
            type="text"
            name="album_link"
            value={formData.album_link}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Adding Song...' : 'Add Song'}
        </button>
      </form>
    </div>
  );
}