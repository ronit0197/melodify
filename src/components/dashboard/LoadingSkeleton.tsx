export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen flex bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Sidebar */}
            <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-800 p-6 shadow-lg animate-pulse">
                <div className="h-6 w-24 bg-gray-700 rounded mb-8" />
                <nav className="flex flex-col space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-5 w-32 bg-gray-700 rounded" />
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 mt-16 p-8 animate-pulse">
                <div className="mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-800 p-6 rounded-lg flex items-center justify-between"
                            >
                                <div>
                                    <div className="h-4 w-24 bg-gray-700 rounded mb-2" />
                                    <div className="h-8 w-12 bg-gray-600 rounded" />
                                </div>
                                <div className="h-8 w-8 bg-gray-700 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
