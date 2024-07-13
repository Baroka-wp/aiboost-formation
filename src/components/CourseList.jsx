import React from 'react';
import { Edit, Book, Users } from 'lucide-react';

const CourseList = ({ filteredCourses, handleEditCourse, handleViewChapters, handleViewStudents }) => {
  return (
    <div className="space-y-4">
      {filteredCourses.map(course => (
        <div key={course.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <div className="text-sm text-gray-500">
              {course.enrolled_count} inscrits
            </div>
          </div>
          <div className="text-right mr-8">
            <div className="text-sm text-gray-500">Durée</div>
            <div>{course.duration} heures</div>
          </div>
          <div className="text-right mr-8">
            <div className="text-sm text-gray-500">Prix</div>
            <div>{course.price} €</div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleEditCourse(course)}
              className="text-gray-600 hover:text-blue-600"
              title="Modifier le cours"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => handleViewChapters(course)}
              className="text-gray-600 hover:text-green-600"
              title="Voir les chapitres"
            >
              <Book size={20} />
            </button>
            <button
              onClick={() => handleViewStudents(course)}
              className="text-gray-600 hover:text-purple-600"
              title="Voir les étudiants"
            >
              <Users size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;