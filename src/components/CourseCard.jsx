import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, BookOpen } from 'lucide-react';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg border border-gray-100">
      {/* Course Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full mb-3">
            {course.category}
          </span>
          <h3 className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors">
            {course.title}
          </h3>
        </div>
      </div>

      {/* Course Description */}
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
        {course.description}
      </p>

      {/* Course Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{course.students} étudiants</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{course.level}</span>
        </div>
      </div>

      {/* Course Footer */}
      <Link
        to={`/courses/${course.id}`}
        className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
      >
        En savoir plus
        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  );
};

export default CourseCard;
