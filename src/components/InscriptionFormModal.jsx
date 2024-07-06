import React, { useEffect, useState } from 'react';
import { X, CreditCard, User, Check } from 'lucide-react';
import { register, enrollCourse } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';


const InscriptionFormModal = ({ isOpen, onClose, courseTitle, courseId, onSuccess, isAuthenticated }) => {
  const [step, setStep] = useState(isAuthenticated ? 2 : 1);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    numeroCard: '',
    dateExpiration: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prevData => ({
        ...prevData,
        nom: user.full_name || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
 try {
      if (!isAuthenticated) {
        const response = await register(formData.email, formData.password, formData.nom, formData.nom);
        await login(response.data.token, response.data.user);
      }

      // Inscrire l'utilisateur au cours
      await enrollCourse(courseId);

      setStep(3);
      setTimeout(() => {
        onClose();
        navigate('/profile');
      }, 2000);

    } catch (error) {
      console.error('Registration/Enrollment error:', error);
      setError(error.response?.data?.message || 'Registration/Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Inscription : {courseTitle}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <h3 className="text-xl font-semibold mb-4">Étape 1 : Identité</h3>
            <div className="mb-4">
              <label htmlFor="nom" className="block mb-2">Nom complet</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Suivant
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-semibold mb-4">Étape 2 : Paiement</h3>
            <div className="mb-4">
              <label htmlFor="numeroCard" className="block mb-2">Numéro de carte</label>
              <input
                type="text"
                id="numeroCard"
                name="numeroCard"
                value={formData.numeroCard}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dateExpiration" className="block mb-2">Date d'expiration</label>
              <input
                type="text"
                id="dateExpiration"
                name="dateExpiration"
                value={formData.dateExpiration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cvv" className="block mb-2">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600" disabled={loading}>
              {loading ? 'Traitement...' : 'Payer et S\'inscrire'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center">
            <Check size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Inscription réussie !</h3>
            <p>Vous serez redirigé vers votre profil...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InscriptionFormModal;
