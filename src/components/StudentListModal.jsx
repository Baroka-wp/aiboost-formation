
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserMinus } from 'lucide-react';

const StudentListModal = ({ isOpen, onClose, students, courseName, onUnenroll }) => {
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