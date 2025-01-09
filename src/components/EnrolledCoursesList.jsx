import React from 'react';
import { ChevronRight, BookOpen, Clock } from 'lucide-react';

const EnrolledCoursesList = ({ enrolledCourses, navigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {enrolledCourses.map((course) => (
        <div key={course.courseId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-orange-600">{course.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <BookOpen size={16} className="mr-1" />
                {course.totalChapters || 0} chapitres
              </span>
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                {course.duration || 'Libre'}
              </span>
            </div>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-orange-600 h-2.5 rounded-full"
                  style={{ width: `${course.percentage || 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Progression : {course.percentage || 0}%
              </p>
            </div>
            <button
              onClick={() => navigate(`/course/${course.courseId}`)}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors flex items-center justify-center"
            >
              Continuer le cours <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnrolledCoursesList;