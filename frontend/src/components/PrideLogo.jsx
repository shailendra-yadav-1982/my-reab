import React from 'react';

export const PrideLogo = ({ className = "w-10 h-10", showText = false }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full rounded-lg shadow-lg"
            >
                {/* Charcoal Background */}
                <rect width="100" height="100" fill="#18181B" />

                {/* Diagonal Pride Stripes */}
                <g style={{ mixBlendMode: 'screen', opacity: 0.9 }}>
                    {/* Red: Physical */}
                    <path d="M0 20 L20 0 L40 0 L0 40 Z" fill="#FF5C5C" />
                    {/* Gold: Cognitive */}
                    <path d="M0 40 L40 0 L55 0 L0 55 Z" fill="#FFD700" />
                    {/* White: Invisible */}
                    <path d="M0 55 L55 0 L70 0 L0 70 Z" fill="#F4F4F5" />
                    {/* Blue: Psychiatric */}
                    <path d="M0 70 L70 0 L85 0 L0 85 Z" fill="#38BDF8" />
                    {/* Green: Sensory */}
                    <path d="M0 85 L85 0 L100 0 L100 15 L15 100 L0 100 Z" fill="#34D399" />
                </g>

                {/* DP Initials Overlay (Subtle) */}
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    fontSize="32"
                    fontWeight="bold"
                    fontFamily="Lexend, sans-serif"
                    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
                >
                    DP
                </text>
            </svg>
            {showText && (
                <span className="font-lexend font-semibold text-lg text-white">
                    Pride <span className="text-zinc-400">Connect</span>
                </span>
            )}
        </div>
    );
};

export default PrideLogo;
