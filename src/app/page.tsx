import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 mt-15">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6">Welcome to Melodify</h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover, stream, and enjoy your favorite music
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/auth/login"
                className="border border-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
