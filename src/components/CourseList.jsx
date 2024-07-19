import React from 'react';
import { Edit, BookOpen, Users } from 'lucide-react';

const CourseList = ({ filteredCourses, handleEditCourse, handleViewChapters, handleViewStudents }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map(course => (
        <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
          <div className="relative pb-48 overflow-hidden">
            {course.cover_image_url ? (
              <img 
                className="absolute inset-0 h-full w-full object-cover transform hover:scale-110 transition duration-500"
                src={course.cover_image_url} 
                alt={course.title}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white text-4xl font-bold">
                {course.title.charAt(0)}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <h3 className="text-xl font-semibold text-white">{course.title}</h3>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>{course.duration} heures</span>
              <span>{course.price} FCFA</span>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => handleEditCourse(course)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Edit size={18} className="mr-1" /> Éditer
              </button>
              <button
                onClick={() => handleViewChapters(course)}
                className="text-green-600 hover:text-green-800 flex items-center"
              >
                <BookOpen size={18} className="mr-1" /> Chapitres
              </button>
              <button
                onClick={() => handleViewStudents(course)}
                className="text-purple-600 hover:text-purple-800 flex items-center"
              >
                <Users size={18} className="mr-1" /> Étudiants
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;