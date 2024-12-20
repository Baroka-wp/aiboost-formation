import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, User, GraduationCap, Award, Search, Clock, Briefcase, X, Mail, Phone, BookOpen, Users, ArrowRight, Compass, MessageCircle, Calendar } from 'lucide-react';
import { getAllCourses, getAllCategories, getAllTags } from './services/api';
import Footer from './components/Footer';
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

  const scrollToPayback = () => {
    const paybackSection = document.getElementById('payback-program');
    paybackSection?.scrollIntoView({ behavior: 'smooth' });
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
                <span className="text-orange-500 font-medium mr-2">Nouveau !</span>
                <span className="text-white">Terminez votre formation et récupérez 50% de vos frais</span>
                <svg
                  className="w-5 h-5 ml-2 text-orange-500 transform group-hover:translate-x-1 transition-transform"
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

              <h1 className="text-5xl font-bold text-white mb-6">
                Développez vos compétences numériques avec des experts
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Formez-vous aux métiers du digital avec notre programme de formation complet et certifiant. 
                Profitez de notre offre exceptionnelle de remboursement de 50% !
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/courses"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
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

        {/* Services Section */}
        <section className="relative py-32 bg-white overflow-hidden">
          <div className="container relative mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left Column - Content */}
              <div className="w-full lg:w-1/2 relative z-10">
                <div className="max-w-xl">
                  <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent leading-tight">
                    Pourquoi<br />
                    Nous Choisir
                  </h2>
                  <div className="w-32 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-16"></div>

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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                Propulsez Votre Carrière
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
                      className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
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
        <section className="py-20 bg-gradient-to-br from-orange-600 to-red-600 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-4xl font-bold mb-6">Besoin d'Orientation ?</h2>
              <p className="text-xl mb-12 text-orange-100">
                Pas sûr de la direction à prendre ? Notre plateforme d'orientation professionnelle vous aide à découvrir 
                le parcours qui correspond le mieux à vos aspirations et compétences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="https://decision-io.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-orange-600 rounded-xl font-medium hover:bg-orange-100 transition-all duration-300 flex items-center justify-center group"
                >
                  Découvrir mon parcours idéal
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
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
                
                <a
                  href="https://decision-io.vercel.app/"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
                >
                  Parler à un conseiller
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 12H16M16 12L12 8M16 12L12 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-orange-300 mr-3"
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
                  <span className="text-orange-100">Test d'orientation gratuit</span>
                </div>
                <div className="flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-orange-300 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.4 15C19.1277 15.6171 19.0717 16.3081 19.2401 16.9584C19.4085 17.6087 19.7933 18.1871 20.33 18.61L20.41 18.68C20.8625 19.1131 21.2034 19.6515 21.4075 20.2484C21.6116 20.8453 21.674 21.4855 21.5902 22.1159C21.5063 22.7463 21.2783 23.3506 20.9246 23.8817C20.5709 24.4127 20.1 24.8554 19.55 25.18C19.0007 25.5 18.386 25.6932 17.7538 25.7465C17.1216 25.7997 16.4857 25.7119 15.8932 25.4891C15.3007 25.2663 14.7657 24.9139 14.3258 24.4532C13.886 23.9924 13.5521 23.4339 13.35 22.82L13.33 22.75C13.1066 22.0943 12.6997 21.5159 12.16 21.08C11.6203 20.6441 10.9698 20.3699 10.29 20.29C9.61016 20.2101 8.91978 20.3272 8.30397 20.6285C7.68817 20.9299 7.17292 21.4026 6.82001 21.99L6.76001 22.09C6.31753 22.5231 5.77909 22.864 5.18219 23.0681C4.58529 23.2722 3.94503 23.3346 3.31464 23.2508C2.68425 23.1669 2.08001 22.9389 1.54891 22.5852C1.01782 22.2315 0.575127 21.7606 0.250012 21.21C-0.0674958 20.6606 -0.260691 20.0459 -0.313939 19.4137C-0.367187 18.7815 -0.279373 18.1456 -0.0565682 17.5532C0.166236 16.9607 0.518628 16.4257 0.979373 15.9858C1.44012 15.546 1.99861 15.2121 2.61251 15.01L2.68251 14.99C3.33822 14.7666 3.91662 14.3597 4.35251 13.82C4.78839 13.2803 5.06261 12.6298 5.14251 11.95C5.22236 11.2702 5.10525 10.5798 4.80388 9.964C4.50251 9.34822 4.02984 8.83297 3.44251 8.48005L3.34251 8.42005C2.90945 7.97757 2.56859 7.43913 2.36449 6.84223C2.16039 6.24533 2.09799 5.60507 2.18185 4.97468C2.26571 4.34429 2.49369 3.74005 2.8474 3.20895C3.2011 2.67786 3.67198 2.23517 4.22251 1.91005C4.77189 1.59255 5.38657 1.39935 6.01878 1.3461C6.651 1.29285 7.28689 1.38067 7.87938 1.60348C8.47186 1.82628 9.00685 2.17867 9.44671 2.63941C9.88657 3.10016 10.2205 3.65865 10.4225 4.27255L10.4425 4.34255C10.6659 4.99826 11.0728 5.57666 11.6125 6.01255C12.1522 6.44843 12.8027 6.72265 13.4825 6.80255C14.1623 6.8824 14.8527 6.76529 15.4685 6.46392C16.0843 6.16255 16.5996 5.68988 16.9525 5.10255L17.0125 5.00255C17.455 4.56949 17.9934 4.22863 18.5903 4.02453C19.1872 3.82043 19.8275 3.75803 20.4579 3.84189C21.0882 3.92575 21.6925 4.15373 22.2236 4.50744C22.7547 4.86114 23.1974 5.33202 23.5225 5.88255C23.84 6.43193 24.0332 7.04661 24.0865 7.67882C24.1397 8.31104 24.0519 8.94693 23.8291 9.53942C23.6063 10.1319 23.2539 10.6669 22.7931 11.1067C22.3324 11.5466 21.7739 11.8805 21.16 12.0825L21.09 12.1025C20.4343 12.3259 19.8559 12.7328 19.42 13.2725C18.9841 13.8122 18.7099 14.4627 18.63 15.1425L19.4 15Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-orange-100">Résultats personnalisés</span>
                </div>
                <div className="flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-orange-300 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 8H19C20.1046 8 21 8.89543 21 10V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V10C3 8.89543 3.89543 8 5 8H7M17 8V6C17 4.89543 16.1046 4 15 4H9C7.89543 4 7 4.89543 7 6V8M17 8H7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-orange-100">Conseiller dédié</span>
                </div>
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