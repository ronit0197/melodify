'use client';

import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Song } from './SongContext';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  currentTime: number;
  duration: number;
  volume: number;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setQueue: (songs: Song[], startIndex?: number) => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextType>({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playSong: () => {},
  togglePlay: () => {},
  nextSong: () => {},
  prevSong: () => {},
  setQueue: () => {},
  seekTo: () => {},
  setVolume: () => {},
});

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => {
        if (queue.length > 0 && currentIndex < queue.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setCurrentSong(queue[nextIndex]);
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [queue, currentIndex]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = process.env.NEXT_PUBLIC_SONG_BASE_URL + currentSong.song_link;
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const playSong = (song: Song, newQueue?: Song[]) => {
    setCurrentSong(song);
    if (newQueue) {
      setQueueState(newQueue);
      setCurrentIndex(newQueue.findIndex(s => s.id === song.id));
    }
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(queue[nextIndex]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const prevSong = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(queue[prevIndex]);
      setIsPlaying(true);
    }
  };

  const setQueue = (songs: Song[], startIndex = 0) => {
    setQueueState(songs);
    setCurrentIndex(startIndex);
    if (songs.length > 0) {
      setCurrentSong(songs[startIndex]);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      queue,
      currentIndex,
      currentTime,
      duration,
      volume,
      playSong,
      togglePlay,
      nextSong,
      prevSong,
      setQueue,
      seekTo,
      setVolume,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};