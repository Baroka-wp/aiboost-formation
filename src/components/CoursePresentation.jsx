import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById, getEnrolledCourses } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import InscriptionFormModal from './InscriptionFormModal';
import Loading from './Loading';
import { Book, Clock, Users, ChevronRight, Home, User } from 'lucide-react';
import Header from './Header';


const CoursePresentation = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseResponse, enrolledCoursesResponse] = await Promise.all([
          getCourseById(courseId),
          isAuthenticated ? getEnrolledCourses(user.id) : Promise.resolve({ data: [] })
        ]);
        setCourse(courseResponse.data);
        setEnrolledCourses(enrolledCoursesResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load course data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, isAuthenticated, user]);

  const isEnrolled = enrolledCourses.some(course => course.id === parseInt(courseId));

  const handleCourseAction = () => {
    if (!isAuthenticated) {
      setShowModal(true);
    } else if (isEnrolled) {
      navigate(`/course/${courseId}/chapter/${course.chapters[0].id}`);
    } else {
      setShowModal(true);
    }
  };

  const handleEnrollmentSuccess = async () => {
    try {
      const enrolledCoursesResponse = await getEnrolledCourses(user.id);
      setEnrolledCourses(enrolledCoursesResponse.data);
      setShowModal(false);
      navigate(`/course/${courseId}/chapter/${course.chapters[0].id}`);
    } catch (error) {
      console.error('Error updating enrolled courses:', error);
      setError('Failed to update course enrollment. Please try again.');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;
  if (!course) return <div className="text-center mt-8">Cours non trouvé</div>;

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl mb-8">{course.description}</p>
          <div className="flex flex-wrap items-center text-sm md:text-base gap-4 mb-8">
            <div className="flex items-center">
              <Book className="mr-2" size={20} />
              <span>{course.chapters.length} chapitres</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" size={20} />
              <span>{course.duration || 'À déterminer'}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2" size={20} />
              <span>{course.enrolled_count || 0} étudiants inscrits</span>
            </div>
          </div>
          <button 
            onClick={handleCourseAction}
            className="bg-white text-orange-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-100 transition-colors"
          >
            {isEnrolled ? "Continuer le cours" : "S'inscrire au cours"}
          </button>
        </div>
      </section>

      {/* Course Content */}
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">À propos de ce cours</h2>
          <p className="text-gray-700">{course.long_description || course.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Contenu du cours</h2>
          <ul className="space-y-4">
            {course.chapters.map((chapter, index) => (
              <li key={chapter.id} className="flex items-center">
                <span className="mr-4 text-orange-600 font-bold">{index + 1}</span>
                <span className="flex-grow">{chapter.title}</span>
                {isEnrolled && (
                  <button 
                    onClick={() => navigate(`/course/${courseId}/chapter/${chapter.id}`)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>

      {showModal && (
        <InscriptionFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          courseTitle={course.title}
          courseId={course.id}
          onSuccess={handleEnrollmentSuccess}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

export default CoursePresentation;