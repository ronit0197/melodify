import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { SongProvider } from "@/contexts/SongContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import Navbar from "@/components/navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Melodify",
  description: "Melodify – Feel the Rhythm, Live the Moment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <UserProvider>
            <SongProvider>
              <PlayerProvider>
                <FavoritesProvider>
                  <Navbar />
                  {children}
                  <Toaster richColors position="bottom-right" />
                  <MusicPlayer />
                </FavoritesProvider>
              </PlayerProvider>
            </SongProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
