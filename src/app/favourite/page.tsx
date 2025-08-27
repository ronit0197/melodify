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
                {/* Album Header */}
                <div className="flex flex-row sm:items-end gap-6 mb-8">
                    <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <HeartIcon className="w-16 h-16 md:w-24 md:h-24 text-white/70" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-400 mb-2">Liked Songs</p>
                        <h1 className="text-xl sm:text-6xl font-bold mb-4">Favourite Songs</h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            My fev songs • {favoriteSongs.length} songs
                        </p>
                    </div>
                </div>

                {/* Play Button */}
                <div className="mb-6 mt-10 sm:mt-20">
                    <button
                        onClick={() => {
                            setQueue(favoriteSongs);
                            playSong(favoriteSongs[0], favoriteSongs);
                        }}
                        className="bg-green-500 hover:bg-green-400 text-black px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base"
                    >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                        Play
                    </button>
                </div>

                {/* Song List */}
                <div className="space-y-2">
                    {favoriteSongs.map((song, index) => (
                        <div
                            key={song.id}
                            className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg hover:bg-gray-800/50 group"
                        >
                            <span className="text-gray-400 w-5 sm:w-6 text-center text-sm sm:text-base">
                                {index + 1}
                            </span>

                            {/* Song Title + Artist */}
                            <div
                                className="flex-1 cursor-pointer"
                                onClick={() => playSong(song, favoriteSongs)}
                            >
                                <h3 className="text-white font-medium text-sm sm:text-base">
                                    {song.song_name}
                                </h3>
                                <p className="text-gray-400 text-xs sm:text-sm">{song.artist}</p>
                            </div>

                            {/* Genre */}
                            <span className="hidden sm:block text-gray-400 text-sm">
                                {song.genre}
                            </span>

                            {/* Duration */}
                            <SongDuration songUrl={song.song_link} />

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => addToQueue(song)}
                                    className="text-gray-400 hover:text-white p-2"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => removeFromFavorites(song.id)}
                                    className="text-gray-400 hover:text-white p-2"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}