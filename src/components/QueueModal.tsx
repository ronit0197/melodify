'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { X, Music, Trash } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QueueModal({ isOpen, onClose }: QueueModalProps) {
  const { queue, currentIndex, removeFromQueue, clearQueue, playSong } = usePlayer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-gray-900 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            Queue
            <span className="bg-indigo-600 text-white text-sm font-medium px-2 py-0.5 rounded-full">
              {queue.length}
            </span>
          </h2>
          <div className="flex gap-2">
            <button onClick={clearQueue} className="text-gray-400 hover:text-white">
              <Trash className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-96 scrollbar-hide">
          {queue.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No songs in queue</p>
            </div>
          ) : (
            queue.map((song, index) => (
              <div
                key={`${song.id}-${index}`}
                className={`flex items-center gap-3 p-3 hover:bg-gray-800/50 cursor-pointer ${index === currentIndex ? 'bg-gray-800 border-l-4 border-green-500' : ''
                  }`}
                onClick={() => playSong(song, queue)}
              >
                <span className="text-gray-400 w-6 text-sm">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{song.song_name}</h3>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(index);
                  }}
                  className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}