'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Hash } from 'lucide-react';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || userLoading || !user) {
    return <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20 p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mt-10">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white text-indigo-600 text-3xl font-bold shadow-lg">
                {userData?.name ? userData.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {userData?.name || 'User'}
                </h2>
                <p className="text-indigo-200 text-lg">
                  {userData?.type || 'Member'}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-white">Account Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-medium">{userData?.name || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Email Address</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Account Type</p>
                    <p className="text-white font-medium">{userData?.type || 'Standard'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Hash className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">User ID</p>
                    <p className="text-white font-medium text-xs">{user.uid}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}