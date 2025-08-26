'use client';
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSongs } from "@/contexts/SongContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { HeartIcon, Play, Plus, Trash } from "lucide-react";
import SongDuration from '@/components/SongDuration';
import PageInsideSkeleton from "@/components/PageInsideSkeleton";

export default function Favorite() {
    const { favorites, loading: favLoading, removeFromFavorites } = useFavorites();
    const { songs, loading: songsLoading } = useSongs();
    const { setQueue, playSong, addToQueue } = usePlayer();

    if (favLoading || songsLoading) {
        return <PageInsideSkeleton />;
    }

    // Match songs with favorite IDs
    const favoriteSongs = songs.filter(song => favorites.includes(song.id));

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white mt-15 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-end gap-6 mb-8">
                    <div className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <HeartIcon className="w-24 h-24 text-white/70" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-2">Liked Songs</p>
                        <h1 className="text-6xl font-bold mb-4">Favourite songs</h1>
                        <p className="text-gray-400">My fev songs • {favoriteSongs.length} songs</p>
                    </div>
                </div>
                <div className="mb-6 mt-20">
                    <button
                        onClick={() => {
                            setQueue(favoriteSongs);
                            playSong(favoriteSongs[0], favoriteSongs);
                        }}
                        className="bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-full font-semibold flex items-center gap-2"
                    >
                        <Play className="w-5 h-5" />
                        Play
                    </button>
                </div>
                <div className="space-y-2">
                    {favoriteSongs.map((song, index) => (
                        <div
                            key={song.id}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 group"
                        >
                            <span className="text-gray-400 w-6 text-center">{index + 1}</span>
                            <div className="flex-1 cursor-pointer" onClick={() => playSong(song, favoriteSongs)}>
                                <h3 className="text-white font-medium">{song.song_name}</h3>
                                <p className="text-gray-400 text-sm">{song.artist}</p>
                            </div>
                            <span className="text-gray-400 text-sm">{song.genre}</span>
                            <SongDuration songUrl={song.song_link} />
                            <button
                                onClick={() => addToQueue(song)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-2"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => removeFromFavorites(song.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-2"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}