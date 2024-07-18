import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserMinus, UserPlus } from 'lucide-react';

const StudentListModal = ({ isOpen, onClose, students, courseName, onUnenroll, onEnroll }) => {
  const [email, setEmail] = useState('');
  const [showEnrollForm, setShowEnrollForm] = useState(false);

  const handleEnroll = (e) => {
    e.preventDefault();
    onEnroll(email);
    setEmail('');
    setShowEnrollForm(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-800">
                Étudiants inscrits - {courseName}
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            {!showEnrollForm ? (
              <button
                onClick={() => setShowEnrollForm(true)}
                className="mb-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center"
              >
                <UserPlus size={20} className="mr-2" />
                Inscrire un étudiant
              </button>
            ) : (
              <form onSubmit={handleEnroll} className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email de l'étudiant"
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEnrollForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Inscrire
                  </button>
                </div>
              </form>
            )}
            {students.length === 0 ? (
              <p className="text-gray-500">Aucun étudiant inscrit à ce cours.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {students.map((student) => (
                  <li key={student.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.full_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {student.email}
                        </p>
                      </div>
                      <button
                        onClick={() => onUnenroll(student.id)}
                        className="ml-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition-colors"
                        title="Désinscrire l'étudiant"
                      >
                        <UserMinus size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StudentListModal;