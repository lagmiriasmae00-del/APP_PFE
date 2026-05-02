import React from 'react';

export default function Card({ children, className = '', hover = false, onClick }) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`
        bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 
        ${hover ? 'hover:shadow-2xl transition-all relative overflow-hidden active:translate-y-1 active:shadow-none duration-100 text-left w-full group' : ''}
        ${onClick && !hover ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
