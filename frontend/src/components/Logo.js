import React from 'react';

const Logo = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle 
        cx="16" 
        cy="16" 
        r="15" 
        fill="url(#gradient)" 
        stroke="#fff" 
        strokeWidth="2"
      />
      
      {/* Compression Arrow */}
      <path 
        d="M8 12 L16 8 L24 12 L20 14 L16 12 L12 14 Z" 
        fill="white" 
        opacity="0.9"
      />
      <path 
        d="M8 20 L16 24 L24 20 L20 18 L16 20 L12 18 Z" 
        fill="white" 
        opacity="0.9"
      />
      
      {/* Center compression lines */}
      <line x1="8" y1="16" x2="24" y2="16" stroke="white" strokeWidth="2" opacity="0.7"/>
      <line x1="10" y1="14" x2="22" y2="14" stroke="white" strokeWidth="1" opacity="0.5"/>
      <line x1="10" y1="18" x2="22" y2="18" stroke="white" strokeWidth="1" opacity="0.5"/>
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FF6B6B', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#FF5252', stopOpacity: 1}} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
