'use client';

export default function NaiveAnimation() {
    return (
        <div className="relative w-64 h-64 mx-auto">
            <svg
                viewBox="0 0 200 200"
                className="w-full h-full animate-pulse-slow"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Hand-drawn style network/tree */}
                <g className="animate-grow">
                    {/* Central node */}
                    <circle cx="100" cy="100" r="8" fill="#d4816f" className="animate-pulse" />

                    {/* Branches */}
                    <path
                        d="M 100 100 Q 80 70, 60 50"
                        stroke="#d4816f"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <circle cx="60" cy="50" r="6" fill="#d4816f" />

                    <path
                        d="M 100 100 Q 120 70, 140 50"
                        stroke="#d4816f"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <circle cx="140" cy="50" r="6" fill="#d4816f" />

                    <path
                        d="M 100 100 Q 70 110, 40 120"
                        stroke="#d4816f"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <circle cx="40" cy="120" r="6" fill="#d4816f" />

                    <path
                        d="M 100 100 Q 130 110, 160 120"
                        stroke="#d4816f"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <circle cx="160" cy="120" r="6" fill="#d4816f" />

                    <path
                        d="M 100 100 Q 90 140, 80 170"
                        stroke="#d4816f"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <circle cx="80" cy="170" r="6" fill="#d4816f" />

                    <path
                        d="M 100 100 Q 110 140, 120 170"
                        stroke="#d4816f"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <circle cx="120" cy="170" r="6" fill="#d4816f" />
                </g>

                {/* Hand illustration (simplified) */}
                <g className="opacity-70">
                    <path
                        d="M 85 180 Q 90 185, 95 180 Q 100 175, 105 180 Q 110 185, 115 180"
                        stroke="#1a1a1a"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>

            <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes grow {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(0.95); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-grow {
          animation: grow 4s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
        </div>
    );
}
