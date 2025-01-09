import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const CompletionButton = ({ onComplete, isCompleted }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onComplete();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium">
        <CheckCircle className="w-5 h-5" />
        <span>Chapitre terminé</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-full font-medium
          transition-all duration-200
          ${isLoading ? 'bg-orange-400 cursor-wait' : 'bg-orange-600 hover:bg-orange-700'}
          text-white
        `}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <CheckCircle className="w-5 h-5" />
        )}
        <span>{isLoading ? 'En cours...' : 'Terminer le chapitre'}</span>
      </button>

      {showSuccess && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg shadow-md">
          Chapitre terminé avec succès !
        </div>
      )}
    </div>
  );
};

export default CompletionButton;