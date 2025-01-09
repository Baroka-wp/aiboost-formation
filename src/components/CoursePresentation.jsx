import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getCourseById, getEnrolledCourses } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import InscriptionFormModal from './InscriptionFormModal';
import Loading from './Loading';
import { Book, Clock, Users, ChevronRight, Home, User, Twitter, Facebook, Linkedin, Wallet, GraduationCap } from 'lucide-react';
import Header from './Header';
import ContactSection from './ContactSection';
import Footer from './Footer';
import heroImage from '../assets/image_fx_.jpg';

const CoursePresentation = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur vient de se connecter et doit payer
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('action') === 'enroll' && isAuthenticated) {
      setShowModal(true);
    }
  }, [location, isAuthenticated]);

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
      // Rediriger vers la page de connexion avec un paramètre de retour
      navigate(`/register?redirect=/course/${courseId}&action=enroll`);
    } else if (isEnrolled) {
      navigate(`/course/${courseId}/chapter/${course.chapters[0].id}`);
    } else {
      // Ouvrir directement le modal de paiement
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

  const shareUrl = `${window.location.origin}/course/${courseId}`;
  const shareText = `Découvrez cette formation intéressante sur AIBoost: ${course?.title}`;

  const handleShare = (platform) => {
    let url;
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(course?.title)}&summary=${encodeURIComponent(course?.description)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank');
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;
  if (!course) return <div className="text-center mt-8">Cours non trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section with Parallax */}
        <div className="relative min-h-[400px] md:h-[500px] overflow-hidden">
          {/* Background Image with Parallax */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
              transform: `translateY(${window.scrollY * 0.5}px)`,
              willChange: 'transform'
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 to-red-600/80" />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl self-start md:self-auto">
                  <GraduationCap size={32} className="text-white" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  {course?.title}
                </h1>
              </div>
              <p className="text-lg md:text-xl text-orange-100 max-w-3xl mb-8">
                {course?.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8 text-white">
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Book className="mr-2" size={20} />
                  <span>{course?.chapters?.length || 0} chapitres</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Clock className="mr-2" size={20} />
                  <span>{course?.duration || 'À déterminer'} heures</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Users className="mr-2" size={20} />
                  <span>{course?.enrolled_count || 0} étudiants</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Wallet className="mr-2" size={20} />
                  <span>{course?.price || 0} FCFA</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center">
                <button
                  onClick={handleCourseAction}
                  className="w-full md:w-auto bg-white text-orange-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-orange-50 transition-colors mb-4 md:mb-0"
                >
                  {isEnrolled ? "Continuer le cours" : "S'inscrire au cours"}
                </button>
                <div className="flex justify-center md:justify-start gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/20 transition-colors"
                    aria-label="Partager sur Twitter"
                  >
                    <Twitter size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/20 transition-colors"
                    aria-label="Partager sur Facebook"
                  >
                    <Facebook size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/20 transition-colors"
                    aria-label="Partager sur LinkedIn"
                  >
                    <Linkedin size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container mx-auto px-4 -mt-10 md:-mt-20 relative z-10">
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 mb-12">
            {/* About Course */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Book className="mr-3 text-orange-600" />
                À propos de ce cours
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {course.long_description || course.description}
              </p>
            </div>

            {/* Course Chapters */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <GraduationCap className="mr-3 text-orange-600" />
                Contenu du cours
              </h2>
              <div className="grid gap-4">
                {course.chapters.map((chapter, index) => (
                  <div 
                    key={chapter.id} 
                    className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg font-bold mr-4">
                      {index + 1}
                    </span>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800">{chapter.title}</h3>
                      {chapter.description && (
                        <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                      )}
                    </div>
                    {isEnrolled && (
                      <button
                        onClick={() => navigate(`/course/${courseId}/chapter/${chapter.id}`)}
                        className="ml-4 p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded-lg transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {showModal && (
        <InscriptionFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          courseTitle={course.title}
          coursePrice={course.price}
          courseId={course.id}
          onSuccess={handleEnrollmentSuccess}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

export default CoursePresentation;