import React from 'react';
import { ChatIcon } from './icons/ChatIcon';

const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-blue-500 text-white 
        shadow-2xl hover:shadow-xl transition-all duration-300 
        flex items-center justify-center 
        hover:scale-110 active:scale-95 
        focus:outline-none focus:ring-4 focus:ring-blue-500/50"
      aria-label="Ouvrir le chat"
    >
      <ChatIcon className="w-7 h-7" />
    </button>
  );
};

export default FloatingButton;
