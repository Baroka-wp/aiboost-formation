import React from 'react';

export const ChatIcon = ({ variant = 'chat', className = "w-6 h-6", ...props }) => {
  const variants = {
    'chat': (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}
        {...props}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97l-.213.21a1.48 1.48 0 0 1-2.105-2.092l.213-.210a5.981 5.981 0 0 1 1.498-4.055A8.967 8.967 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" 
        />
      </svg>
    ),
    'close': (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}
        {...props}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M6 18L18 6M6 6l12 12" 
        />
      </svg>
    )
  };

  return variants[variant] || variants['chat'];
};
