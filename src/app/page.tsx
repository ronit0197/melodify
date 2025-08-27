"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useSongs } from '@/contexts/SongContext';
import Link from 'next/link';
import ScrollableSection from '@/components/ScrollableSection';
import ArtistCard from '@/components/ArtistCard';
import AlbumCard from '@/components/AlbumCard';
import SectionRow from '@/components/SectionRow';
import RecentlyPlayed from '@/components/RecentlyPlayed';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import PreLoader from '@/components/PreLoader';

export default function Home() {
  const { user, loading } = useAuth();
  const { songs, loading: songsLoading } = useSongs();

  if (loading) {
    return <PreLoader />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-20">
      {!user && (
        <div className="max-w-6xl mx-auto px-4 py-16 mt-10 sm:mt-12 md:mt-16">
          <div className="text-center">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to Melodify
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 px-2">
              Discover, stream, and enjoy your favorite music
            </p>

            {/* Buttons */}
            <div className="flex flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-indigo-600 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-indigo-700 transition text-center"
              >
                Get Started
              </Link>
              <Link
                href="/auth/login"
                className="border border-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-black transition text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className={`mx-auto px-4 py-8 sm:mt-10 ${user ? 'mt-15' : 'mt-0'}`}>
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Good evening
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">
            What do you want to listen to today?
          </p>
        </div>


        {songsLoading ? (
          <LoadingSkeleton />
        ) : songs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No songs found. Add some songs to get started!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Recently Played Section */}
            <RecentlyPlayed />

            {/* Artists Section */}
            <ScrollableSection title="Popular Artists">
              {(() => {
                const artistGroups = songs.reduce((acc, song) => {
                  const artists = song.artist.split(',').map(a => a.trim());
                  artists.forEach(artist => {
                    if (!acc[artist]) acc[artist] = [];
                    acc[artist].push(song);
                  });
                  return acc;
                }, {} as Record<string, typeof songs>);

                return Object.entries(artistGroups).map(([artist, artistSongs]) => (
                  <ArtistCard key={artist} artist={artist} songCount={artistSongs.length} />
                ));
              })()}
            </ScrollableSection>

            {/* Albums Section */}
            <ScrollableSection title="Popular Albums">
              {(() => {
                const albumGroups = songs.reduce((acc, song) => {
                  if (!acc[song.album]) acc[song.album] = [];
                  acc[song.album].push(song);
                  return acc;
                }, {} as Record<string, typeof songs>);

                return Object.entries(albumGroups).map(([album, albumSongs]) => (
                  <AlbumCard
                    key={album}
                    album={album}
                    album_link={albumSongs}
                    songCount={albumSongs.length}
                    director={albumSongs[0]?.director}
                  />
                ));
              })()}
            </ScrollableSection>

            {/* Genre Section */}
            {(() => {
              const genreGroups = songs.reduce((acc, song) => {
                if (!acc[song.genre]) acc[song.genre] = [];
                acc[song.genre].push(song);
                return acc;
              }, {} as Record<string, typeof songs>);

              return Object.entries(genreGroups).map(([genre, genreSongs]) => (
                <SectionRow key={genre} title={`${genre} Music`} songs={genreSongs} />
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
