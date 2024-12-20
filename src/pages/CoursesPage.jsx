import React, { useState, useEffect } from 'react';
import { getAllCourses, getAllCategories, getAllTags } from '../services/api';
import { Mail, Phone, Compass, ArrowRight, Clock, MessageCircle, Search, X } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import Header from '../components/Header';
import Loading from '../components/Loading';
import heroImage from '../assets/our_course.jpg';

const CoursesPage = () => {
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
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleTagToggle = (tagId) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tagId)
        ? prevTags.filter(id => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Hero Section with Parallax */}
        <div className="relative h-[500px] overflow-hidden">
          {/* Background Image with Parallax */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
              transform: `translateY(${scrollY * 0.5}px)`,
              willChange: 'transform'
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/70 to-red-600/70" />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-5xl font-bold mb-6 text-white">
                Nos Formations
              </h1>
              <p className="text-2xl text-orange-100 max-w-2xl">
                Découvrez nos formations certifiantes et transformez votre carrière dans l'intelligence artificielle
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une formation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="flex items-center justify-center px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <X size={20} className="mr-2" />
                Réinitialiser
              </button>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {filteredCourses.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucune formation ne correspond à vos critères.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-orange-500 font-medium hover:text-orange-600"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

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
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 AIBoost. Tous droits réservés.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CoursesPage;