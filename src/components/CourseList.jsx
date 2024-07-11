import React from 'react';
import { Edit, Trash2, Book } from 'lucide-react';

const CourseList = ({ courses, onEdit, onDelete, onViewChapters }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-orange-600">{course.price}€</span>
              <div>
                <button onClick={() => onEdit(course)} className="mr-2 text-blue-600 hover:text-blue-800">
                  <Edit size={20} />
                </button>
                <button onClick={() => onDelete(course)} className="mr-2 text-red-600 hover:text-red-800">
                  <Trash2 size={20} />
                </button>
                <button onClick={() => onViewChapters(course)} className="text-green-600 hover:text-green-800">
                  <Book size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;