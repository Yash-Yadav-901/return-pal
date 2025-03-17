
import React from 'react';

const AnimatedLogo: React.FC = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center perspective-3d">
      <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-subtle shadow-glow-xs"></div>
      <div className="absolute inset-1 bg-primary/20 rounded-full animate-pulse-subtle shadow-glow-xs" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center relative z-10 animate-float shadow-glow-xs">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-primary-foreground"
        >
          <path d="M20 7h-7.5A1.5 1.5 0 0 0 11 8.5V11" />
          <path d="M14 16v-3.5A1.5 1.5 0 0 0 12.5 11H4" />
          <path d="M4 15v1.5A1.5 1.5 0 0 0 5.5 18H20" />
        </svg>
      </div>
      <div className="absolute inset-[-5px] border border-primary/30 rounded-full animate-pulse-subtle" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default AnimatedLogo;
