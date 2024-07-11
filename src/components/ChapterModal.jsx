import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

const ChapterModal = ({ type, course, chapter, onClose, onConfirm, onAddChapter }) => {
  const [chapterData, setChapterData] = useState({ title: '', content: '' });

  useEffect(() => {
    if (chapter && type === 'editChapter') {
      setChapterData({ title: chapter.title, content: chapter.content });
    }
  }, [chapter, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapterData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(chapterData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {type === 'viewChapters' && `Chapters for ${course.title}`}
            {type === 'addChapter' && 'Add New Chapter'}
            {type === 'editChapter' && 'Edit Chapter'}
            {type === 'deleteChapter' && 'Delete Chapter'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="px-6 py-4">
          {type === 'viewChapters' && (
            <div>
              <ul className="space-y-2">
                {course.chapters.map(chap => (
                  <li key={chap.id} className="flex justify-between items-center">
                    <span>{chap.title}</span>
                    <div>
                      <button onClick={() => onEditChapter(chap)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button onClick={() => onDeleteChapter(chap)} className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={onAddChapter}
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Chapter
              </button>
            </div>
          )}
          {(type === 'addChapter' || type === 'editChapter') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={chapterData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={chapterData.content}
                  onChange={handleChange}
                  rows="10"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  {type === 'addChapter' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          )}
          {type === 'deleteChapter' && (
            <div className="text-center">
              <p className="mb-4">Are you sure you want to delete this chapter?</p>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterModal;