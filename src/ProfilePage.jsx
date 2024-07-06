import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { getEnrolledCourses, getUserProfile } from './services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Loading from './components/Loading'; 


const ProfilePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if(user){
        try {
          setLoading(true);
          const [coursesResponse, profileResponse] = await Promise.all([
            getEnrolledCourses(user?.id),
            getUserProfile(user?.id)
          ]);

          setEnrolledCourses(coursesResponse.data);
          setUserProfile(profileResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, user, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <Loading />; ;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">AIBoost</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><button onClick={() => navigate('/')} className="hover:text-orange-600 transition-colors">Home</button></li>
              <li><button onClick={() => handleLogout()} className="hover:text-orange-600 transition-colors">Logout</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-8">
        {userProfile && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Hi, {userProfile.full_name}</h2>
            <p>email : {userProfile.email}</p>
          </div>
        )}

        <h3 className="text-2xl font-bold mb-4">Vos formations en cours</h3>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors flex items-center"
                >
                  Continue Course <ChevronRight size={20} className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;