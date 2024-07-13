import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Edit, Trash2, Check } from 'lucide-react';

const ChapterSideModal = ({ isOpen, onClose, course, chapters, onAddChapter, onEditChapter, onDeleteChapter }) => {
  const [editingChapter, setEditingChapter] = useState(null);

  const handleEditClick = (chapter) => {
    setEditingChapter({ ...chapter });
  };

  const handleSaveEdit = () => {
    onEditChapter(editingChapter);
    setEditingChapter(null);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-lg overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-800">Chapitres du cours</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <button
          onClick={onAddChapter}
          className="mb-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Ajouter un chapitre
        </button>

        {chapters.length === 0 ? (
          <p className="text-gray-500">Aucun chapitre pour ce cours.</p>
        ) : (
          <ul className="space-y-4">
            {chapters.map((chapter) => (
              <li key={chapter.id} className="bg-gray-100 p-4 rounded-lg">
                {editingChapter && editingChapter.id === chapter.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editingChapter.title}
                      onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                      className="flex-grow mr-2 p-1 border rounded"
                    />
                    <button onClick={handleSaveEdit} className="text-green-500 hover:text-green-700">
                      <Check size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{chapter.title}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(chapter)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDeleteChapter(chapter.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default ChapterSideModal;