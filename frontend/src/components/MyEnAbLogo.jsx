import React from 'react';

export const MyEnAbLogo = ({ className = "w-48 h-14" }) => {
    return (
        <div className={`flex items-center ${className}`}>
            <svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#E40303" />
                        <stop offset="20%" stop-color="#FF8C00" />
                        <stop offset="40%" stop-color="#FFD700" />
                        <stop offset="60%" stop-color="#008026" />
                        <stop offset="80%" stop-color="#24408E" />
                        <stop offset="100%" stop-color="#732982" />
                    </linearGradient>
                </defs>

                <circle cx="55" cy="60" r="30" stroke="url(#grad4)" stroke-width="8" fill="none" />
                <circle cx="55" cy="45" r="6" fill="url(#grad4)" />
                <path d="M55 50 L55 72 L68 85" stroke="url(#grad4)" stroke-width="6" stroke-linecap="round" />

                <text x="110" y="70" font-size="42" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#FFFFFF">
                    MyEnAb
                </text>
            </svg>
        </div>
    );
};

export default MyEnAbLogo;

