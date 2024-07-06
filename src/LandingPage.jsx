import React, { useEffect, useState } from 'react';
import { Book, ArrowRight, DollarSign, Star, Menu, X } from 'lucide-react';
import InscriptionFormModal from './components/InscriptionFormModal';
import bgImage from './assets/bg.jpeg';
import { useNavigate } from 'react-router-dom';
import { getAllCourses } from './services/api'
import { useAuth } from './contexts/AuthContext';
import Loading from './components/Loading'; 

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getAllCourses();
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);


  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  const handleInscriptionClick = (course) => {
    setSelectedCourse(course);
    if (isAuthenticated) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleInscriptionSuccess = () => {
    setIsModalOpen(false);
    navigate('/profile');
  };

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      <header className="fixed top-0 left-0 right-0 bg-white text-gray-800 shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-orange-600">AIBoost</div>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Accueil</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Formations</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">À propos</a></li>
                {
                  isAuthenticated ? (
                    <li><a href="/profile" className="hover:text-orange-600 transition-colors">Mon Profil</a></li>
                  ) : (
                    <li><a href="/login" className="hover:text-orange-600 transition-colors">Se connecter</a></li>
                  )
                }
              </ul>
            </nav>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-800">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden">
          <div className="container mx-auto px-4 py-8">
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-800 text-xl hover:text-orange-600 transition-colors">Accueil</a></li>
              <li><a href="#" className="text-gray-800 text-xl hover:text-orange-600 transition-colors">Formations</a></li>
              <li><a href="#" className="text-gray-800 text-xl hover:text-orange-600 transition-colors">À propos</a></li>
              <li><a href="#" className="text-gray-800 text-xl hover:text-orange-600 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">AI<span className="text-orange-600">Boost</span></h1>
            <p className="text-lg md:text-xl mb-6">Maîtrisez l'IA générative et boostez votre productivité</p>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-full flex items-center hover:bg-orange-700 transition-colors">
              Commencer <ArrowRight className="ml-2" />
            </button>
          </div>
          <div className="md:w-1/2">
            <img src={bgImage} alt="IA Illustration" className="rounded-lg shadow-lg w-full h-auto" />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <Book size={48} className="mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2">1. Inscrivez-vous</h3>
              <p>Choisissez votre formation et inscrivez-vous en quelques clics.</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <DollarSign size={48} className="mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2">2. Payez</h3>
              <p>Effectuez le paiement pour débloquer l'accès à la formation.</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <ArrowRight size={48} className="mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2">3. Apprenez</h3>
              <p>Suivez la formation et obtenez un remboursement à la fin.</p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Nos formations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{course.price}€</span>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    <span className="ml-1">{course.rating}</span>
                  </div>
                </div>
                <button
                  className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
                  onClick={() => handleInscriptionClick(course)}
                >
                  S'inscrire
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white text-gray-800 p-4 mt-16 shadow-inner">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 AIBoost. Tous droits réservés.</p>
        </div>
      </footer>

      {selectedCourse && (
        <InscriptionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courseTitle={selectedCourse.title}
          courseId={selectedCourse.id}
          onSuccess={handleInscriptionSuccess}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

export default LandingPage;