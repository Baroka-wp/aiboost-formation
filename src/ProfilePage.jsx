import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrolledCourses, getEnrolledCoursesProgress, updateUserProfile } from './services/api';
import { useAuth } from './contexts/AuthContext';
import Loading from './components/Loading';
import EnrolledCoursesList from './components/EnrolledCoursesList';
import UserProfileForm from './components/UserProfileForm';
import Header from './components/Header';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { User, BookOpen, Edit2 } from 'lucide-react';
import profileBg from './assets/image_fx_.jpg';

const ProfilePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const { user, updateUserInfo } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setLoading(true);
          const coursesResponse = await getEnrolledCoursesProgress(user.id)
          setEnrolledCourses(coursesResponse?.data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);
  
  const handleProfileUpdate = async (updatedData) => {
    try {
      const updatedUser = await updateUserProfile(updatedData);
      updateUserInfo(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section with Parallax */}
        <div className="relative h-[400px] overflow-hidden">
          {/* Background Image with Parallax */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${profileBg})`,
              transform: `translateY(${scrollY * 0.5}px)`,
              willChange: 'transform'
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 to-red-600/80" />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-white p-3 rounded-full">
                  <User size={32} className="text-orange-600" />
                </div>
                <h1 className="text-4xl font-bold text-white">
                  {user.full_name}
                </h1>
              </div>
              <p className="text-xl text-orange-100 max-w-2xl">
                Gérez votre profil et suivez vos formations
              </p>
            </div>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <User className="mr-2 text-orange-600" />
                Informations personnelles
              </h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors"
                >
                  <Edit2 size={18} className="mr-2" />
                  Modifier
                </button>
              )}
            </div>

            {isEditing ? (
              <UserProfileForm 
                user={user} 
                setIsEditing={setIsEditing} 
                setError={setError}
                onSubmit={handleProfileUpdate}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Nom complet</label>
                    <p className="text-lg font-medium">{user.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Nom d'utilisateur</label>
                    <p className="text-lg font-medium">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Formations suivies</label>
                    <p className="text-lg font-medium">{enrolledCourses.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <BookOpen className="text-orange-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Vos formations en cours</h2>
          </div>
          <EnrolledCoursesList enrolledCourses={enrolledCourses} navigate={navigate} />
        </div>

        {/* Contact Section */}
        <ContactSection />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;