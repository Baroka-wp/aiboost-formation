import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book, ArrowRight, User, Briefcase, GraduationCap, Award, Search, Clock } from 'lucide-react';
import { getAllCourses, getAllCategories } from './services/api';
import Loading from './components/Loading';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, categoriesResponse] = await Promise.all([
          getAllCourses(),
          getAllCategories()
        ]);
        setCourses(coursesResponse.data);
        setFilteredCourses(coursesResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = courses.filter(course =>
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === '' || course.category.id === parseInt(selectedCategory))
    );
    setFilteredCourses(results);
  }, [searchTerm, selectedCategory, courses]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Découvrez AIBoost</h1>
            <p className="text-xl md:text-2xl mb-8">Votre Passerelle vers l'Excellence !</p>
            <a href="#courses" className="bg-white text-orange-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-100 transition-colors">
              Commencer maintenant
            </a>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                icon={<Book size={40} />}
                title="Cours de Pointe"
                description="Des cours constamment mis à jour sur l'IA et les technologies connexes."
              />
              <ServiceCard
                icon={<User size={40} />}
                title="Mentorat Personnalisé"
                description="Bénéficiez de l'expertise de mentors chevronnés qui vous guideront."
              />
              <ServiceCard
                icon={<GraduationCap size={40} />}
                title="Apprentissage Interactif"
                description="Testez vos connaissances avec des QCM et des projets pratiques."
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="courses" className="py-16 bg-orange-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Formations</h2>
            <div className="mb-8 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-4 pr-8 py-2 border border-gray-300 rounded-full w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités Phares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard
                icon={<Briefcase size={40} />}
                title="Tableau de Bord Intuitif"
                description="Suivez vos cours et votre progression en temps réel."
              />
              <FeatureCard
                icon={<Award size={40} />}
                title="Certification"
                description="Obtenez une certification pour valoriser vos nouvelles compétences."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-orange-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            {isAuthenticated ? (
              <>
                <h2 className="text-3xl font-bold mb-4">Bienvenue, {user.full_name} !</h2>
                <p className="text-xl mb-8">Continuez votre apprentissage et développez vos compétences en IA.</p>
                <Link
                  to="/profile"
                  className="bg-white text-orange-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-100 transition-colors"
                >
                  Accéder à mon profil
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">Prêt à Booster Votre Carrière ?</h2>
                <p className="text-xl mb-8">Rejoignez AIBoost dès aujourd'hui et transformez votre passion pour l'IA en expertise concrète !</p>
                <Link
                  to="/register"
                  className="bg-white text-orange-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-100 transition-colors"
                >
                  S'inscrire Maintenant
                </Link>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AIBoost. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-orange-100 p-6 rounded-lg text-center">
    <div className="text-orange-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const CourseCard = ({ course, onClick }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer h-full flex flex-col" onClick={onClick}>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{course.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-orange-600 font-bold">{course.price}€</span>
        <div className="flex items-center">
          <Clock className="mr-1" size={16} />
          <span>{course.duration}h</span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap">
        {course.tags && course.tags.map((tag, index) => (
          <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="mt-2">
        <span className="text-sm text-gray-500">Catégorie: {course.category.name}</span>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex items-start p-6 bg-orange-100 rounded-lg">
    <div className="text-orange-600 mr-4">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

export default LandingPage;