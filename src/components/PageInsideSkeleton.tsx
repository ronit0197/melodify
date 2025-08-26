export default function ArtistPageSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white mt-15 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
                {/* Artist header skeleton */}
                <div className="flex items-end gap-6 mb-8">
                    <div className="w-48 h-48 bg-gray-800 rounded-full" />
                    <div className="space-y-4">
                        <div className="h-4 w-20 bg-gray-800 rounded" />
                        <div className="h-10 w-64 bg-gray-800 rounded" />
                        <div className="h-4 w-32 bg-gray-800 rounded" />
                    </div>
                </div>

                {/* Play button skeleton */}
                <div className="mb-6 mt-20">
                    <div className="h-12 w-32 bg-gray-800 rounded-full" />
                </div>

                {/* Songs list skeleton */}
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-3 rounded-lg bg-gray-900"
                        >
                            {/* Index number placeholder */}
                            <div className="w-6 h-4 bg-gray-800 rounded" />
                            {/* Song title + album */}
                            <div className="flex-1">
                                <div className="h-4 w-48 bg-gray-800 rounded mb-2" />
                                <div className="h-3 w-32 bg-gray-700 rounded" />
                            </div>
                            {/* Genre */}
                            <div className="h-3 w-20 bg-gray-800 rounded" />
                            {/* Duration */}
                            <div className="h-3 w-12 bg-gray-800 rounded" />
                            {/* Favorite / Queue buttons */}
                            <div className="flex gap-2">
                                <div className="w-6 h-6 bg-gray-800 rounded-full" />
                                <div className="w-6 h-6 bg-gray-800 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}