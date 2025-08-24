"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
    const { user, loading } = useAuth();
    const { userData } = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    return (
        <nav className="fixed top-0 left-0 right-0 bg-[#0a0a0a] text-white px-4 py-3 shadow-md z-50">
            <div className="flex items-center w-full">
                {/* Left side - Brand/Logo */}
                <div
                    className="cursor-pointer flex-shrink-0"
                    onClick={() => router.push('/')}
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
                <div className="flex-1 px-8">
                    <div className="max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search songs, artists, albums..."
                            className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Right Side - User Section */}
                <div className="relative flex-shrink-0">
                    {!loading && !user ? (
                        <button
                            onClick={() => router.push('/auth/login')}
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
                                    {userData?.name ? userData.name.charAt(0).toUpperCase() :
                                        <div className="flex items-center justify-center">
                                            <div className="w-6 h-6 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                        </div>
                                    }
                                </span>
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-2 z-50">
                                    <button
                                        onClick={() => {
                                            router.push('/profile');
                                            setDropdownOpen(false);
                                        }}
                                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    >
                                        Profile Settings
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
