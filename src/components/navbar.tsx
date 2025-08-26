"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSongs } from "@/contexts/SongContext";
import { usePlayer } from "@/contexts/PlayerContext";

export default function Navbar() {
    const { user, loading } = useAuth();
    const { userData } = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const router = useRouter();

    const { songs } = useSongs();
    const { playSong } = usePlayer();

    // Filter songs by query
    const filteredSongs =
        searchQuery.trim().length > 0
            ? songs.filter(
                (song) =>
                    song.song_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    song.album.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : [];

    return (
        <nav className="fixed top-0 left-0 right-0 bg-[#0a0a0a] text-white px-4 py-3 shadow-md z-50">
            <div className="flex items-center w-full">
                {/* Left side - Brand/Logo */}
                <div
                    className="cursor-pointer flex-shrink-0"
                    onClick={() => router.push("/")}
                >
                    <Image
                        src="/logo.png"
                        alt="Melodify"
                        width={180}
                        height={60}
                        className="h-12 w-auto"
                    />
                </div>

                {/* Center - Search */}
                <div className="flex-1 px-8 relative">
                    <div className="max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search songs, artists, albums..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setSearchOpen(true);
                            }}
                            className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Search Dropdown */}
                    {searchOpen && searchQuery && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-full max-w-2xl bg-gray-900 rounded-lg shadow-lg border border-gray-700 max-h-80 overflow-y-auto z-50 scrollbar-hide">
                            {filteredSongs.length > 0 ? (
                                filteredSongs.map((song) => (
                                    <div
                                        key={song.id}
                                        onClick={() => {
                                            playSong(song, filteredSongs);
                                            setSearchQuery("");
                                            setSearchOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 cursor-pointer"
                                    >
                                        <Image
                                            src={
                                                song.album_link
                                                    ? process.env.NEXT_PUBLIC_SONG_ALBUM_BASE_URL +
                                                    song.album_link
                                                    : "/placeholder.png"
                                            }
                                            alt={song.song_name}
                                            width={40}
                                            height={40}
                                            className="rounded"
                                            unoptimized
                                        />
                                        <div>
                                            <p className="text-white font-medium">{song.song_name}</p>
                                            <p className="text-sm text-gray-400">
                                                {song.artist} • {song.album}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 px-4 py-3">No results found</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side - User Section */}
                <div className="relative flex-shrink-0">
                    {!loading && !user ? (
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition"
                        >
                            Sign In
                        </button>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 transition"
                            >
                                <span className="font-bold text-white">
                                    {userData?.name ? (
                                        userData.name.charAt(0).toUpperCase()
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <div className="w-6 h-6 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </span>
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-2 z-50">
                                    <button
                                        onClick={() => {
                                            router.push("/profile");
                                            setDropdownOpen(false);
                                        }}
                                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    >
                                        Profile Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push("/favourite");
                                            setDropdownOpen(false);
                                        }}
                                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    >
                                        Liked Songs
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await signOut(auth);
                                            setDropdownOpen(false);
                                        }}
                                        className="block px-4 py-2 bg-red-700 hover:bg-red-500 text-white text-left w-full rounded"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}