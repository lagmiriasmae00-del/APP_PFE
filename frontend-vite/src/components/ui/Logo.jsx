import React from 'react';

export default function Logo({ size = 32, className = '' }) {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`} 
      style={{ width: size, height: size, minWidth: size }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 200 160" 
        width="100%" 
        height="100%" 
        fill="currentColor"
        stroke="currentColor" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Book pages */}
        <path d="M 10 140 L 10 70 C 50 70, 80 110, 100 130 C 120 110, 150 70, 190 70 L 190 140 C 150 140, 120 160, 100 160 C 80 160, 50 140, 10 140 Z" fill="none" />
        <path d="M 50 100 C 70 110, 85 125, 100 140 C 115 125, 130 110, 150 100" fill="none" />
        
        {/* Graduation cap top */}
        <polygon points="100,10 170,40 100,70 30,40" fill="currentColor" stroke="none" />
        
        {/* Tassel cord */}
        <line x1="30" y1="40" x2="30" y2="80" strokeWidth="5" />
        {/* Tassel end */}
        <rect x="25" y="80" width="10" height="20" fill="currentColor" stroke="none" rx="2" />

        {/* Hat base */}
        <path d="M 55 60 L 55 90 C 70 105, 130 105, 145 90 L 145 60" fill="none" strokeWidth="12" />
      </svg>
    </div>
  );
}
