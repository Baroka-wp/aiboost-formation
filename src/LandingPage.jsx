import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, User, GraduationCap, Award, Search, Clock, Briefcase, X, Mail, Phone, BookOpen, Users, ArrowRight, Compass, MessageCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllCourses, getAllCategories, getAllTags } from './services/api';
import Footer from './components/Footer';
import Loading from './components/Loading';
import Header from './components/Header';
import bgImage from './assets/image_fx_.jpg'
import video_about_platforme from './assets/video_about_plateform.mov'
import screenshot1 from './assets/qcm_screen.png'
import screenshot2 from './assets/profilt_screen.png'
import screenshot3 from './assets/cours_screen.png'
import robo_img from './assets/our_course.jpg'

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
  const [currentSlide, setCurrentSlide] = useState(0);

  const screenshots = [screenshot1, screenshot2, screenshot3];

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTagToggle = (tagId) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tagId)
        ? prevTags.filter(id => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  const scrollToPayback = () => {
    const paybackSection = document.getElementById('payback-program');
    paybackSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
          </div>

          <div className="container relative mx-auto px-4 py-20">
            <div className="max-w-3xl">
              {/* Promo Badge */}
              <div 
                onClick={scrollToPayback}
                className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20 group cursor-pointer hover:bg-white/20 transition-all duration-300"
              >
                <div className="mr-2">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-orange-500 font-medium mr-2 flex-shrink-0">Nouveau !</span>
                <span className="text-white flex-grow">Terminez votre formation et récupérez 50% de vos frais</span>
                <svg
                  className="w-5 h-5 ml-2 text-orange-500 transform group-hover:translate-x-1 transition-transform flex-shrink-0 hidden sm:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Développez vos compétences<br className="hidden sm:block" /> numériques avec des experts
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Formez-vous aux métiers du digital avec notre programme de formation complet et certifiant. 
                Profitez de notre offre exceptionnelle de remboursement de 50% !
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/courses"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center group text-lg"
                >
                  Commencer maintenant
                </Link>
                {/* <Link
                  to="/program"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  En savoir plus
                </Link> */}
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <div>
          {/* Content Below Video */}
          <div className="bg-white py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">
                  Pourquoi Choisir Notre Plateforme ?
                </h2>
                <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                  Notre plateforme offre une expérience d'apprentissage unique, combinant technologie 
                  de pointe et méthodes pédagogiques éprouvées. Nous nous engageons à votre réussite 
                  avec un programme de remboursement garanti et un accompagnement personnalisé.
                </p>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Feature 1 */}
                  <div className="flex items-start space-x-4 p-6 rounded-xl bg-orange-50">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
                        <Book className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Contenu de Qualité</h3>
                      <p className="text-gray-600">
                        Des cours structurés et mis à jour régulièrement pour rester en phase avec les besoins du marché. Avec des QCM et des test de niveau
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start space-x-4 p-6 rounded-xl bg-orange-50">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Accompagnement</h3>
                      <p className="text-gray-600">
                        Un mentor dédié pour vous guider et répondre à vos questions tout au long de votre parcours.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-start space-x-4 p-6 rounded-xl bg-orange-50">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Certification</h3>
                      <p className="text-gray-600">
                        Des certifications reconnues pour valoriser vos nouvelles compétences sur le marché.
                      </p>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-start space-x-4 p-6 rounded-xl bg-orange-50">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Garantie Réussite</h3>
                      <p className="text-gray-600">
                        Programme de remboursement si vous ne trouvez pas d'emploi dans les 6 mois.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Video and Screenshots Section */}
          <div className="w-full relative bg-gray-50 py-20 mb-32">
            <div className="container mx-auto px-4">
              {/* Video Section */}
              <div className="mb-32">
                <video
                  className="w-4/5 mx-auto aspect-video rounded-2xl shadow-2xl"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={video_about_platforme} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>

              {/* Screenshots Section */}
              <div className="relative h-[500px] max-w-6xl mx-auto mb-20">
                {/* Main Screenshot - QCM */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] z-30 transition-all duration-300 hover:z-50 hover:scale-110 hover:shadow-2xl">
                  <img
                    src={screenshot3}
                    alt="Interface QCM"
                    className="w-full rounded-2xl shadow-2xl border-4 border-white"
                  />
                </div>

                {/* Left Floating Screenshot - Profile */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[70%] z-20 transform -rotate-12 hover:rotate-0 transition-all duration-300 hover:z-50 hover:scale-110 hover:-translate-x-5">
                  <img
                    src={screenshot2}
                    alt="Page de profil"
                    className="w-full rounded-2xl shadow-xl border-4 border-white opacity-95 hover:opacity-100"
                  />
                </div>

                {/* Right Floating Screenshot - Courses */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] z-20 transform rotate-12 hover:rotate-0 transition-all duration-300 hover:z-50 hover:scale-110 hover:translate-x-5">
                  <img
                    src={screenshot1}
                    alt="Liste des cours"
                    className="w-full rounded-2xl shadow-xl border-4 border-white opacity-95 hover:opacity-100"
                  />
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl shadow-2xl mx-auto max-w-5xl -mb-16 relative z-10 overflow-hidden">
                <div className="relative px-8 py-16">
                  {/* Background Elements */}
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>
                  <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>

                  <div className="relative text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                      Prêt à Commencer Votre Parcours vers l'Excellence ?
                    </h2>
                    <p className="text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
                      Inscrivez-vous dès maintenant ou prenez rendez-vous avec un conseiller 
                      pour découvrir le parcours qui vous correspond le mieux.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Link
                        to="/register"
                        className="min-w-[280px] whitespace-nowrap px-8 py-4 bg-white text-orange-600 rounded-xl font-medium hover:bg-orange-100 transition-colors group text-lg inline-flex items-center justify-center"
                      >
                        <span>S'inscrire maintenant</span>
                        <ArrowRight className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </Link>
                      
                      <button
                        onClick={() => document.getElementById('calendly-modal').classList.remove('hidden')}
                        className="min-w-[280px] whitespace-nowrap px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-medium hover:bg-white/10 transition-colors group text-lg inline-flex items-center justify-center"
                      >
                        <span>Parler à un conseiller</span>
                        <Calendar className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50"></div>

          <div className="container relative mx-auto px-4">
            {/* Section Header */}
            <div className="max-w-2xl mx-auto text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-orange-500/10 to-red-500/10 px-4 py-2 rounded-full mb-6 group">
                <div className="mr-2 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-orange-600 font-medium">Formations Certifiantes</span>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-4 h-4 text-orange-600 animate-pulse"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent leading-tight">
                Nos formations Populaires
              </h2>
              <p className="text-lg text-gray-600">
                Des formations intensives conçues par des experts pour vous transformer en professionnel du numérique
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher une formation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Category Filter */}
                  <div className="w-full sm:w-auto">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full sm:w-48 px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all appearance-none bg-white text-sm"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tags Filter */}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedTags.includes(tag.id)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {selectedTags.includes(tag.id) && (
                          <X size={14} className="inline mr-1" />
                        )}
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                {filteredCourses.map((course) => (
                  <div key={course.id}>
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Calendly Modal */}
        <div id="calendly-modal" className="fixed inset-0 bg-white z-[9999] hidden">
          <button 
            onClick={() => document.getElementById('calendly-modal').classList.add('hidden')}
            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 transition-colors z-[10000]"
          >
            <X className="w-8 h-8" />
          </button>
          <iframe 
            src="https://calendly.com/baroka/connecting-meeting" 
            className="w-full h-full border-none"
            title="Calendly Scheduling"
          />
        </div>

        {/* Payback Program Section */}
        <section id="payback-program" className="py-20 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left Content */}
              <div className="w-full lg:w-1/2">
                <div className="max-w-xl">
                  <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm mb-6">
                    <svg
                      className="w-5 h-5 text-orange-600 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-orange-600 font-medium">Programme de Remboursement</span>
                  </div>
                  <h2 className="text-4xl font-bold mb-6">
                    Terminez votre formation,{' '}
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Récupérez 50% de vos frais !
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Nous croyons en votre réussite. Terminez votre formation et récupérez la moitié de vos frais d'inscription !
                  </p>
                </div>
              </div>

              {/* Right Content - Steps */}
              <div className="w-full lg:w-1/2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Inscrivez-vous à une formation éligible</h3>
                        <p className="text-gray-600">Choisissez parmi notre sélection de formations certifiantes</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Complétez tous les modules</h3>
                        <p className="text-gray-600">Suivez l'intégralité du programme et réalisez tous les exercices</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Réussissez l'examen final</h3>
                        <p className="text-gray-600">Obtenez une note minimale de 80% à l'évaluation finale</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Recevez votre remboursement</h3>
                        <p className="text-gray-600">Obtenez 50% de vos frais de formation en retour</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
                  <button 
                      onClick={() => document.getElementById('calendly-modal').classList.remove('hidden')}
                      className="bg-orange-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Prendre un rendez-vous
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </section>

        {/* Call to Action */}
        <section className="min-h-[600px] py-20 bg-gradient-to-br from-orange-600 to-red-600 relative overflow-hidden flex items-center">
          {/* Background Image with Parallax */}
          <div 
            className="absolute inset-y-0 left-0 w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${robo_img})`,
              backgroundSize: 'cover',
              transformStyle: 'preserve-3d',
              backgroundAttachment: 'fixed',
              backgroundPosition: '100% center',
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-orange-600/90"></div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-5xl font-bold mb-8">Besoin d'Orientation ?</h2>
              <p className="text-2xl mb-12 text-orange-100 leading-relaxed">
                Pas sûr de la direction à prendre ? Notre plateforme d'orientation professionnelle vous aide à découvrir 
                le parcours qui correspond le mieux à vos aspirations et compétences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="https://decision-io.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[280px] whitespace-nowrap px-8 py-4 bg-white text-orange-600 rounded-xl font-medium hover:bg-orange-100 transition-colors group text-lg inline-flex items-center justify-center"
                >
                  <span>Découvrir mon parcours</span>
                  <svg
                    className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                
                <button
                  onClick={() => document.getElementById('calendly-modal').classList.remove('hidden')}
                  className="min-w-[280px] whitespace-nowrap px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-medium hover:bg-white/10 transition-colors group text-lg inline-flex items-center justify-center"
                >
                  <span>Parler à un conseiller</span>
                  <Calendar className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Besoin d'aide ?</h2>
              <p className="text-lg text-gray-600">
                Notre équipe est disponible pour répondre à toutes vos questions. 
                Choisissez le moyen de contact qui vous convient le mieux.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Email Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-6 mx-auto">
                    <Mail size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-4">Email</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Envoyez-nous un email pour des informations détaillées
                  </p>
                  <a
                    href="mailto:birotori@gmail.com"
                    className="flex items-center justify-center gap-2 w-full bg-orange-50 text-orange-600 py-3 rounded-xl hover:bg-orange-100 transition-colors group"
                  >
                    <span>birotori@gmail.com</span>
                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* WhatsApp Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6 mx-auto">
                    <Phone size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-4">WhatsApp</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Discussion instantanée avec notre équipe
                  </p>
                  <a
                    href="https://wa.me/22967153974"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-50 text-green-600 py-3 rounded-xl hover:bg-green-100 transition-colors group"
                  >
                    <span>+229 67 15 39 74</span>
                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Decision.io Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6 mx-auto">
                    <Compass size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-4">Orientation</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Découvrez votre parcours idéal avec Decision.io
                  </p>
                  <a
                    href="https://decision-io.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-600 py-3 rounded-xl hover:bg-blue-100 transition-colors group"
                  >
                    <span>Faire le test</span>
                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-16 text-center">
                <p className="text-gray-600 mb-4">
                  Horaires de disponibilité : Lundi - Vendredi, 9h - 18h (UTC+1)
                </p>
                <div className="flex items-center justify-center gap-4">
                  <span className="inline-flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    Réponse sous 24h
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-500">
                    <MessageCircle size={16} className="mr-1" />
                    Support en français
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
    <div className="flex flex-col h-full">
      {/* Header with Category and Price */}
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
          {course.category.name}
        </span>
        {course.price === 0 ? (
          <span className="text-green-600 font-medium">Gratuit</span>
        ) : (
          <span className="text-orange-600 font-medium">{course.price} FCFA</span>
        )}
      </div>

      {/* Title and Description */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
        {course.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
        {course.description}
      </p>

      {/* Course Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{course.duration}h</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {course.tags && course.tags.slice(0, 3).map((tag) => (
          <span 
            key={tag.id} 
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <Link
        to={`/course/${course.id}`}
        className="inline-flex items-center justify-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors mt-auto group"
      >
        Voir le cours
        <svg 
          className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M4 12H20M20 12L14 6M20 12L14 18" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
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