import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, User, GraduationCap, Award, Search, Clock, Briefcase, X, Mail, Phone, BookOpen, Users } from 'lucide-react';
import { getAllCourses, getAllCategories, getAllTags } from './services/api';
import Loading from './components/Loading';
import Header from './components/Header';
import bgImage from './assets/image_fx_.jpg'
import why_us_image from './assets/why_us.jpg'

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, categoriesResponse, tagsResponse] = await Promise.all([
          getAllCourses(),
          getAllCategories(),
          getAllTags()
        ]);
        setCourses(coursesResponse.data);
        setFilteredCourses(coursesResponse.data);
        setCategories(categoriesResponse.data);
        setTags(tagsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Impossible de charger les données. Veuillez réessayer.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = courses.filter(course =>
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === '' || course.category_id === parseInt(selectedCategory)) &&
      (selectedTags.length === 0 || selectedTags.every(tag => course.tags.some(courseTag => courseTag.id === tag)))
    );
    setFilteredCourses(results);
  }, [searchTerm, selectedCategory, selectedTags, courses]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTagToggle = (tagId) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tagId)
        ? prevTags.filter(id => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center bg-gradient-to-r from-orange-600 to-red-600 text-white overflow-hidden pt-24">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
          
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundPosition: 'center 30%'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/60 to-red-600/60"></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="block mb-4">Formez-vous aux</span>
                <span className="text-yellow-300">Métiers du Numérique</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-2xl mx-auto leading-relaxed">
                Découvrez AIBoost, votre partenaire pour une carrière réussie dans le numérique. 
                De l'IA au développement web, en passant par la cybersécurité et le marketing digital, 
                formez-vous aux métiers d'avenir les plus recherchés.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#courses" 
                  className="px-8 py-4 bg-white text-orange-600 rounded-full text-lg font-semibold hover:bg-orange-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Commencer maintenant
                </a>
                <a 
                  href="#contact" 
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Nous contacter
                </a>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
                <div className="p-4 backdrop-blur-sm bg-white/10 rounded-xl">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">15+</div>
                  <div className="text-sm text-orange-100">Domaines d'Expertise</div>
                </div>
                <div className="p-4 backdrop-blur-sm bg-white/10 rounded-xl">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">1000+</div>
                  <div className="text-sm text-orange-100">Apprenants Satisfaits</div>
                </div>
                <div className="p-4 backdrop-blur-sm bg-white/10 rounded-xl">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">50+</div>
                  <div className="text-sm text-orange-100">Experts & Mentors</div>
                </div>
                <div className="p-4 backdrop-blur-sm bg-white/10 rounded-xl">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">90%</div>
                  <div className="text-sm text-orange-100">Taux d'Insertion</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <svg
              className="relative block w-full h-[50px] text-white"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-current"
              ></path>
            </svg>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative py-32 bg-white overflow-hidden">
          <div className="container relative mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left Column - Content */}
              <div className="w-full lg:w-1/2 relative z-10">
                <div className="max-w-xl">
                  <h2 className="text-5xl font-bold mb-6 text-gray-900">
                    Pourquoi Nous Choisir
                  </h2>
                  <div className="w-24 h-1 bg-orange-500 rounded-full mb-12"></div>

                  {/* Cards Stack */}
                  <div className="space-y-8">
                    {/* Programme Complet */}
                    <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-orange-500 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
                            Programme Complet
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            Accédez à une large gamme de cours conçus par des experts de l'industrie, adaptés aux besoins du marché.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Apprentissage Interactif */}
                    <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-orange-500 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
                            Apprentissage Interactif
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            Échangez avec les formateurs et vos pairs à travers des sessions en direct et des forums dédiés.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Certifications Reconnues */}
                    <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-orange-500 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
                            Certifications Reconnues
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            Obtenez des certificats à la fin de vos formations pour valoriser votre profil professionnel.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="w-full lg:w-1/2 lg:h-[800px] relative overflow-hidden">
                <div 
                  className="absolute inset-0 lg:-right-48 lg:w-[150%]"
                  style={{
                    transform: `translateY(${scrollY * 0.1}px)`,
                  }}
                >
                  <img 
                    src={why_us_image}
                    alt="Illustration apprentissage" 
                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="courses" className="py-16 bg-orange-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Formations</h2>
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Rechercher une formation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-orange-600"
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
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag.id)
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                      }`}
                  >
                    {selectedTags.includes(tag.id) && <X size={14} className="inline mr-1" />}
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
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
            <h2 className="text-3xl font-bold mb-4">Prêt à Booster Votre Carrière ?</h2>
            <p className="text-xl mb-8">Rejoignez AIBoost dès aujourd'hui et transformez votre passion pour l'IA en expertise concrète !</p>
            <Link
              to="/register"
              className="bg-white text-orange-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-100 transition-colors"
            >
              S'inscrire Maintenant
            </Link>
          </div>
        </section>
        {/* Contact */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Contactez-nous</h2>
            <div className="flex flex-col md:flex-row justify-center items-stretch space-y-4 md:space-y-0 md:space-x-8">
              <ContactCard
                icon={<Mail size={24} />}
                title="Email"
                content="birotori@gmail.com"
                link="mailto:birotori@gmail.com"
                buttonText="Envoyer un email"
              />
              <ContactCard
                icon={<Phone size={24} />}
                title="WhatsApp"
                content="+22967153974"
                link="https://wa.me/22967153974"
                buttonText="Contacter sur WhatsApp"
                isWhatsApp={true}
              />
            </div>
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

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl">
    <div className="relative pt-[100%]">
      {course.cover_image_url ? (
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={course.cover_image_url}
          alt={course.title}
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">{course.title.charAt(0)}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end justify-start p-4">
        <h3 className="text-white text-xl font-semibold line-clamp-2">{course.title}</h3>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{course.description}</p>
      <div className="flex justify-between items-center mt-auto">
        {course.price === 0 ? (
          <span className="text-green-600 font-bold">Gratuit</span>
        ) : (
          <span className="text-orange-600 font-bold">{course.price} FCFA</span>
        )}
        <div className="flex items-center">
          <Clock className="mr-1" size={16} />
          <span>{course.duration}h</span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap">
        {course.tags && course.tags.map((tag) => (
          <span key={tag.id} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="mt-2">
        <span className="text-sm text-gray-500">Catégorie: {course.category.name}</span>
      </div>
      <Link
        to={`/course/${course.id}`}
        className="mt-4 block w-full bg-orange-500 text-white text-center py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Voir le cours
      </Link>
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

const ContactCard = ({ icon, title, content, link, buttonText, isWhatsApp = false }) => (
  <div className="bg-orange-100 p-6 rounded-lg text-center flex flex-col justify-between w-full md:w-64">
    <div>
      <div className="text-orange-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="mb-4">{content}</p>
    </div>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full px-4 py-2 rounded-full text-white font-semibold ${isWhatsApp ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'
        } transition-colors`}
    >
      {buttonText}
    </a>
  </div>
);

export default LandingPage;