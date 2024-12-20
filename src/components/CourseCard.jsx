import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Tag } from 'lucide-react';

const CourseCard = ({ course }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{course.enrolled_count || 0} inscrits</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={tag.id || index}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-medium"
            >
              <Tag size={12} />
              {tag.name}
            </span>
          ))}
        </div>

        <Link
          to={`/course/${course.id}`}
          className="block w-full text-center bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition-colors"
        >
          Voir le cours
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
