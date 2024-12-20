import React, { useState, useEffect } from 'react';
import { getAllCourses, getAllCategories, getAllTags } from '../services/api';
import { Mail, Phone, Compass, ArrowRight, Clock, MessageCircle, Search, X } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import Header from '../components/Header';
import Loading from '../components/Loading';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import heroImage from '../assets/why_us.jpg';

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

        {/* Contact Section */}
        <ContactSection />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CoursesPage;