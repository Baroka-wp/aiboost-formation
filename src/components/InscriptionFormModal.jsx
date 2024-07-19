import React, { useState, useEffect } from 'react';
import { X, CreditCard, User, Check } from 'lucide-react';
import { enrollCourse } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const KKIA_PAY = import.meta.env.VITE_KKIA_PAY_KEY

const InscriptionFormModal = ({ isOpen, onClose, courseTitle, coursePrice, courseId, onSuccess }) => {
  const { user, updateUserInfo } = useAuth();
  const [step, setStep] = useState(1); // 1 pour paiement, 2 pour succès
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Proceed to payment
      openKkiapayWidget({
        amount: coursePrice,
        position: "center",
        callback: "",
        data: "",
        theme: "orange",
        key: KKIA_PAY
      });
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  addSuccessListener(async (response) => {
    console.log({ response })
    try {
      // Enroll the user in the course
      await enrollCourse(courseId, user?.email);
      // Update user information
      const updatedEnrolledCourses = [...(user.enrolled_courses || []), parseInt(courseId)];
      await updateUserInfo({ enrolled_courses: updatedEnrolledCourses });
      setStep(2);
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error during course enrollment:', error);
      setError('Failed to enroll in the course. Please try again.');
    }
  });

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
          <div>
            <p className="text-xl font-semibold mb-4">Veuillez procéder au paiement pour finir votre inscription au cours !</p>
            <button
              onClick={handlePayment}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Traitement...' : 'PROCEDER AU PAIEMENT'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <Check size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Inscription réussie !</h3>
            <p>Vous serez redirigé vers votre cours...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InscriptionFormModal;