import Image from "next/image";
export default function PreLoader() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
            <div className="relative flex items-center justify-center">
                {/* Outer glow pulse */}
                <div className="absolute w-40 h-40 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

                {/* Gradient spinning ring */}
                <div className="absolute w-32 h-32 rounded-full animate-spin-slow">
                    <div
                        className="w-full h-full rounded-full
                [mask-image:conic-gradient(from_0deg,rgba(0,0,0,1),transparent)]
                bg-gradient-to-tr from-purple-500 via-pink-500 to-transparent"
                    />
                </div>

                {/* Inner blurred glow */}
                <div className="absolute w-24 h-24 rounded-full bg-purple-400/30 blur-xl animate-pulse" />

                {/* Logo in center */}
                <Image
                    src="/logo.png"
                    alt="Melodify Logo"
                    width={96}
                    height={96}
                    className="relative z-10 drop-shadow-lg"
                    priority
                />
            </div>
        </div>
    );
}