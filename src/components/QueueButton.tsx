'use client';

import { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { List } from 'lucide-react';
import QueueModal from './QueueModal';

export default function QueueButton() {
  const { queue } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowQueue(true)}
        className="fixed bottom-24 right-6 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
      >
        <List className="w-6 h-6" />
        {queue.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {queue.length}
          </span>
        )}
      </button>
      <QueueModal isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </>
  );
}