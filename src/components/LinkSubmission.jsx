import React, { useState, useEffect } from 'react';
import { Link, Check, AlertCircle, Loader } from 'lucide-react';

const LinkSubmission = ({ courseId, chapterId, onSubmit, initialStatus }) => {
  const [link, setLink] = useState('');
  const [status, setStatus] = useState(initialStatus || 'not_submitted'); // 'not_submitted', 'pending', 'approved', 'needs_revision'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setStatus(initialStatus || 'not_submitted');
  }, [initialStatus]);

  console.log(status)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!link) {
      setErrorMessage('Veuillez entrer un lien valide.');
      return;
    }

    try {
      await onSubmit(courseId, chapterId, link);
      setStatus('pending');
      setLink('');
    } catch (error) {
      setErrorMessage(error.message || 'Une erreur est survenue lors de la soumission.');
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600">
            <Loader className="animate-spin mr-2" size={16} />
            En cours de revision.
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center text-green-600">
            <Check className="mr-2" size={16} />
            Votre soumission a été approuvée !
          </div>
        );
      case 'needs_revision':
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="mr-2" size={16} />
            Votre soumission nécessite des modifications. Veuillez soumettre à nouveau.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="my-4 p-4 bg-orange-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Soumettez le lien</h3>
      {( status === 'not_submitted') && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Link size={20} className="text-orange-500" />
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Entrez l'URL de votre travail"
              className="flex-grow p-2 border rounded focus:ring-2 focus:ring-orange-300"
              disabled={status === 'approved'}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors disabled:bg-orange-300"
            disabled={status === 'pending'}
          >
            {status === 'pending' ? 'Travail soumis' : 'Soumettre'}
          </button>
        </form>
      )}
      {errorMessage && (
        <div className="mt-2 text-red-600">
          {errorMessage}
        </div>
      )}
      {renderStatusMessage()}
    </div>
  );
};

export default LinkSubmission;