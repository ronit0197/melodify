'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddSongs from '@/components/dashboard/AddSongs';
import ViewSongs from '@/components/dashboard/ViewSongs';
import { BarChart3, Plus, Music } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [songCount, setSongCount] = useState(0);

  const fetchSongCount = async () => {
    if (!user) return;
    try {
      const querySnapshot = await getDocs(collection(db, 'songs'));
      setSongCount(querySnapshot.size);
    } catch (error) {
      console.error('Error fetching song count:', error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchSongCount();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Sidebar */}
      <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-800 p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8">Menu</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-left hover:text-gray-300 flex items-center gap-2 ${activeTab === 'overview' ? 'text-indigo-400' : ''}`}
          >
            <BarChart3 size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('add-songs')}
            className={`text-left hover:text-gray-300 flex items-center gap-2 ${activeTab === 'add-songs' ? 'text-indigo-400' : ''}`}
          >
            <Plus size={18} /> Add Songs
          </button>
          <button
            onClick={() => setActiveTab('view-songs')}
            className={`text-left hover:text-gray-300 flex items-center gap-2 ${activeTab === 'view-songs' ? 'text-indigo-400' : ''}`}
          >
            <Music size={18} /> View Songs
          </button>
        </nav>
      </aside>
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-200 text-sm">Total Songs</p>
                      <p className="text-3xl font-bold">{songCount}</p>
                    </div>
                    <Music size={32} className="text-indigo-200" />
                  </div>
                </div>

                <div className="bg-green-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm">Active Users</p>
                      <p className="text-3xl font-bold">1</p>
                    </div>
                    <BarChart3 size={32} className="text-green-200" />
                  </div>
                </div>

                <div className="bg-purple-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm">Quick Actions</p>
                      <button
                        onClick={() => setActiveTab('add-songs')}
                        className="text-sm bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded mt-2"
                      >
                        Add New Song
                      </button>
                    </div>
                    <Plus size={32} className="text-purple-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add-songs' && <AddSongs onSongAdded={() => setActiveTab('view-songs')} />}
          {activeTab === 'view-songs' && <ViewSongs />}
        </div>
      </main>
    </div>
  );
}