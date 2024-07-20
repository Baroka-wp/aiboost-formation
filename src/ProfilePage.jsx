import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrolledCourses, getEnrolledCoursesProgress, updateUserProfile } from './services/api';
import { useAuth } from './contexts/AuthContext';
import Loading from './components/Loading';
import EnrolledCoursesList from './components/EnrolledCoursesList';
import UserProfileForm from './components/UserProfileForm';
import Header from './components/Header';

const ProfilePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user, updateUserInfo } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setLoading(true);
          const [coursesResponse, progressResponse] = await Promise.all([
            getEnrolledCourses(user.id),
            getEnrolledCoursesProgress(user.id)
          ]);
          
          const coursesWithProgress = coursesResponse.data.map(course => {
            const progressInfo = progressResponse.data.find(p => p.course_id === course.id);
            return {
              ...course,
              progress: progressInfo ? progressInfo.percentage : 0
            };
          });
          
          setEnrolledCourses(coursesWithProgress);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

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
    <div className="bg-orange-50 min-h-screen font-sans">
      <Header />
      
      <main className="container mx-auto p-4 md:p-8 mt-16">
        <h1 className="text-3xl font-bold mb-6">Profil de {user.full_name}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Informations personnelles</h2>
          {isEditing ? (
            <UserProfileForm 
              user={user} 
              setIsEditing={setIsEditing} 
              setError={setError}
              onSubmit={handleProfileUpdate}
            />
          ) : (
            <div>
              <p><strong>Nom:</strong> {user.full_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors"
              >
                Modifier le profil
              </button>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4">Vos formations en cours</h2>
        <EnrolledCoursesList enrolledCourses={enrolledCourses} navigate={navigate} />
      </main>
    </div>
  );
};

export default ProfilePage;